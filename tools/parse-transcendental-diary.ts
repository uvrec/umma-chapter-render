#!/usr/bin/env npx ts-node
/**
 * Transcendental Diary Parser
 *
 * Парсить книгу "Transcendental Diary" by Hari Sauri dasa з сайту prabhupadavani.org
 *
 * Книга має 5 томів (Volume 1-5), кожен том має глави.
 * Це текстова книга (chapter_type: "text").
 *
 * Джерело: https://prabhupadavani.org/bio/transcendental-diary/
 *
 * Використання:
 *   npx ts-node tools/parse-transcendental-diary.ts
 *
 * Або з аргументами для тесту:
 *   npx ts-node tools/parse-transcendental-diary.ts --volume 1 --chapter 1
 */

import * as fs from "fs";
import * as path from "path";
import { load as cheerioLoad } from "cheerio";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "..", "src", "data");
const CACHE_DIR = path.join(__dirname, "..", "cache", "transcendental-diary");

// ============= TYPES =============

interface Chapter {
  chapter_number: number;
  title_en: string;
  content_en: string;
  dates?: string; // Дати у главі (наприклад, "May 3rd, 1976")
}

interface Volume {
  volume_number: number;
  title_en: string;
  subtitle_en?: string; // Period covered (e.g., "November 1975 – April 1976")
  chapters: Chapter[];
  intro_pages?: IntroPage[];
}

interface IntroPage {
  slug: string;
  title_en: string;
  content_en: string;
  display_order: number;
}

interface BookData {
  book_slug: string;
  book_title_en: string;
  book_title_ua: string;
  author_en: string;
  author_ua: string;
  description_en?: string;
  volumes: Volume[];
}

// ============= CONFIGURATION =============

const BOOK_CONFIG = {
  baseUrl: "https://prabhupadavani.org/bio/transcendental-diary",
  volumes: [
    {
      number: 1,
      title: "Volume 1",
      subtitle: "November 1975 – April 1976",
      chapters: 12,
      introPages: [
        "dedication",
        "acknowledgments",
        "introduction",
        "foreword",
        "preface",
      ],
    },
    {
      number: 2,
      title: "Volume 2",
      subtitle: "April 1976 – June 1976",
      chapters: 6,
    },
    {
      number: 3,
      title: "Volume 3",
      subtitle: "June 1976 – August 1976",
      chapters: 6,
    },
    {
      number: 4,
      title: "Volume 4",
      subtitle: "August 1976 – October 1976",
      chapters: 6,
    },
    {
      number: 5,
      title: "Volume 5",
      subtitle: "October 1976 – November 1977",
      chapters: 8,
    },
  ],
};

// ============= UTILITIES =============

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  retries = 3,
  delayMs = 2000
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  📥 Fetching (attempt ${attempt}/${retries}): ${url}`);

      // Try using undici or node-fetch with TLS bypass
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();

      // Check for Cloudflare challenge
      if (text.includes("Just a moment...") || text.includes("challenge-error-text")) {
        throw new Error("Cloudflare protection detected - use manual HTML download");
      }

      return text;
    } catch (error: any) {
      console.warn(`  ⚠️ Attempt ${attempt} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`  ⏳ Waiting ${delayMs}ms before retry...`);
        await delay(delayMs);
        delayMs *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

/**
 * Load HTML from local file (manually downloaded)
 */
function loadLocalHtml(volumeNum: number, chapterSlug: string): string | null {
  const localDir = path.join(__dirname, "..", "docs", "transcendental-diary");
  const possiblePaths = [
    path.join(localDir, `v${volumeNum}`, `${chapterSlug}.html`),
    path.join(localDir, `volume-${volumeNum}`, `${chapterSlug}.html`),
    path.join(localDir, `${chapterSlug}.html`),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log(`  📄 Loading from local file: ${p}`);
      return fs.readFileSync(p, "utf-8");
    }
  }

  return null;
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getCachePath(volumeNum: number, chapterSlug: string): string {
  return path.join(CACHE_DIR, `v${volumeNum}`, `${chapterSlug}.html`);
}

function loadFromCache(volumeNum: number, chapterSlug: string): string | null {
  const cachePath = getCachePath(volumeNum, chapterSlug);
  if (fs.existsSync(cachePath)) {
    console.log(`  📦 Loading from cache: ${cachePath}`);
    return fs.readFileSync(cachePath, "utf-8");
  }
  return null;
}

function saveToCache(
  volumeNum: number,
  chapterSlug: string,
  html: string
): void {
  const cachePath = getCachePath(volumeNum, chapterSlug);
  ensureDir(path.dirname(cachePath));
  fs.writeFileSync(cachePath, html, "utf-8");
  console.log(`  💾 Saved to cache: ${cachePath}`);
}

// ============= PARSERS =============

/**
 * Parses a volume index page to get chapter list
 */
function parseVolumeIndexPage(html: string, volumeNum: number): string[] {
  const $ = cheerioLoad(html);
  const chapters: string[] = [];

  // Look for links to chapters
  $('a[href*="chapter"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    // Extract chapter slug from URL like /volume-1/chapter-1/
    const match = href.match(/chapter-?(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/i);
    if (match) {
      chapters.push(href);
    }
  });

  // Deduplicate and sort
  const uniqueChapters = [...new Set(chapters)];
  console.log(`  📋 Found ${uniqueChapters.length} chapters in volume ${volumeNum}`);
  return uniqueChapters;
}

/**
 * Parses a chapter page to extract content
 */
function parseChapterPage(html: string, chapterNum: number): Chapter {
  const $ = cheerioLoad(html);

  // Extract title from h1 or .entry-title
  let title =
    $("h1.entry-title").text().trim() ||
    $("h1").first().text().trim() ||
    `Chapter ${chapterNum}`;

  // Clean up title - remove "Chapter X:" prefix if present
  title = title.replace(/^Chapter\s+\w+\s*[:–-]\s*/i, "").trim();

  // Try to extract chapter number from title or content
  const titleMatch = title.match(/^Chapter\s+(\w+)/i);
  if (titleMatch) {
    const numWord = titleMatch[1].toLowerCase();
    const wordToNum: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12,
    };
    if (wordToNum[numWord]) {
      chapterNum = wordToNum[numWord];
    } else if (/^\d+$/.test(numWord)) {
      chapterNum = parseInt(numWord, 10);
    }
  }

  // Extract main content
  // Try multiple selectors for content area
  let contentEl = $(".entry-content");
  if (!contentEl.length) contentEl = $("article .content");
  if (!contentEl.length) contentEl = $(".post-content");
  if (!contentEl.length) contentEl = $("main article");

  // Remove navigation elements, ads, related posts
  contentEl.find("nav, .navigation, .post-navigation, .related-posts, .sharedaddy, .jp-relatedposts, script, style, .social-share").remove();

  // Process content to clean HTML
  const contentParts: string[] = [];
  let dates: string[] = [];

  contentEl.find("p, h2, h3, h4, blockquote, ul, ol").each((_, el) => {
    const $el = $(el);
    const tagName = el.tagName?.toLowerCase() || "p";
    let text = $el.text().trim();

    // Skip empty elements
    if (!text) return;

    // Skip navigation text
    if (/^(Previous|Next|←|→|Chapter\s+\d+$)/i.test(text)) return;

    // Skip p elements inside blockquote (they will be handled by blockquote)
    if (tagName === "p" && $el.parent("blockquote").length) return;

    // Extract dates from content (e.g., "May 3rd, 1976")
    const dateMatch = text.match(
      /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}/gi
    );
    if (dateMatch) {
      dates.push(...dateMatch);
    }

    // Get innerHTML and clean it
    let innerHtml = $el.html() || "";

    // Preserve emphasis (em, i, strong, b)
    innerHtml = innerHtml
      .replace(/<em>/gi, "<em>")
      .replace(/<\/em>/gi, "</em>")
      .replace(/<i>/gi, "<em>")
      .replace(/<\/i>/gi, "</em>")
      .replace(/<strong>/gi, "<strong>")
      .replace(/<\/strong>/gi, "</strong>")
      .replace(/<b>/gi, "<strong>")
      .replace(/<\/b>/gi, "</strong>");

    // Remove unwanted tags but keep content
    innerHtml = innerHtml.replace(/<\/?(?:span|div|a)[^>]*>/gi, "");

    // Clean multiple spaces and newlines
    innerHtml = innerHtml.replace(/\s+/g, " ").trim();

    // Wrap in appropriate HTML tag
    if (tagName === "h2" || tagName === "h3" || tagName === "h4") {
      contentParts.push(`<${tagName}>${innerHtml}</${tagName}>`);
    } else if (tagName === "blockquote") {
      // For blockquote, get only the text content without nested p tags
      const quoteText = $el.find("p").text().trim() || text;
      contentParts.push(`<blockquote><p>${quoteText}</p></blockquote>`);
    } else if (tagName === "ul" || tagName === "ol") {
      // Preserve list structure
      const listItems = $el.find("li").map((_, li) => $(li).text().trim()).get();
      const listHtml = listItems.map(item => `<li>${item}</li>`).join("");
      contentParts.push(`<${tagName}>${listHtml}</${tagName}>`);
    } else {
      contentParts.push(`<p>${innerHtml}</p>`);
    }
  });

  const content = contentParts.join("\n\n");

  return {
    chapter_number: chapterNum,
    title_en: title || `Chapter ${chapterNum}`,
    content_en: content,
    dates: dates.length > 0 ? dates.join(", ") : undefined,
  };
}

/**
 * Parses an intro page (dedication, acknowledgments, etc.)
 */
function parseIntroPage(html: string, slug: string, displayOrder: number): IntroPage {
  const $ = cheerioLoad(html);

  // Extract title
  let title =
    $("h1.entry-title").text().trim() ||
    $("h1").first().text().trim() ||
    slug.charAt(0).toUpperCase() + slug.slice(1);

  // Extract content
  let contentEl = $(".entry-content");
  if (!contentEl.length) contentEl = $("article .content");
  if (!contentEl.length) contentEl = $(".post-content");

  // Remove navigation
  contentEl.find("nav, .navigation, script, style").remove();

  const contentParts: string[] = [];

  contentEl.find("p, h2, h3, blockquote").each((_, el) => {
    const $el = $(el);
    const tagName = el.tagName?.toLowerCase() || "p";
    let innerHtml = $el.html() || "";

    // Clean HTML
    innerHtml = innerHtml.replace(/\s+/g, " ").trim();

    if (innerHtml) {
      if (tagName === "h2" || tagName === "h3") {
        contentParts.push(`<${tagName}>${innerHtml}</${tagName}>`);
      } else if (tagName === "blockquote") {
        contentParts.push(`<blockquote><p>${innerHtml}</p></blockquote>`);
      } else {
        contentParts.push(`<p>${innerHtml}</p>`);
      }
    }
  });

  return {
    slug,
    title_en: title,
    content_en: contentParts.join("\n\n"),
    display_order: displayOrder,
  };
}

// ============= MAIN FUNCTIONS =============

async function fetchAndParseChapter(
  volumeNum: number,
  chapterNum: number,
  chapterSlug: string,
  useCache: boolean = true
): Promise<Chapter | null> {
  const cacheKey = `chapter-${chapterNum}`;

  // Try cache first
  if (useCache) {
    const cached = loadFromCache(volumeNum, cacheKey);
    if (cached) {
      return parseChapterPage(cached, chapterNum);
    }
  }

  // Try local HTML file (manually downloaded)
  const localHtml = loadLocalHtml(volumeNum, chapterSlug);
  if (localHtml) {
    saveToCache(volumeNum, cacheKey, localHtml);
    return parseChapterPage(localHtml, chapterNum);
  }

  // Build URL and try to fetch
  const url = `${BOOK_CONFIG.baseUrl}/volume-${volumeNum}/${chapterSlug}/`;

  try {
    const html = await fetchWithRetry(url);
    saveToCache(volumeNum, cacheKey, html);
    return parseChapterPage(html, chapterNum);
  } catch (error: any) {
    console.error(`  ❌ Failed to fetch chapter ${chapterNum}: ${error.message}`);
    console.log(`  💡 Tip: Save HTML manually to docs/transcendental-diary/v${volumeNum}/${chapterSlug}.html`);
    return null;
  }
}

async function fetchAndParseVolume(
  volumeNum: number,
  useCache: boolean = true
): Promise<Volume> {
  const volumeConfig = BOOK_CONFIG.volumes.find((v) => v.number === volumeNum);
  if (!volumeConfig) {
    throw new Error(`Volume ${volumeNum} not found in configuration`);
  }

  console.log(`\n📖 Parsing Volume ${volumeNum}: ${volumeConfig.title}`);
  console.log(`   Subtitle: ${volumeConfig.subtitle}`);

  const volume: Volume = {
    volume_number: volumeNum,
    title_en: volumeConfig.title,
    subtitle_en: volumeConfig.subtitle,
    chapters: [],
    intro_pages: [],
  };

  // Parse intro pages for Volume 1
  if (volumeConfig.introPages && volumeNum === 1) {
    console.log(`\n  📄 Parsing intro pages...`);
    let displayOrder = 1;
    for (const introSlug of volumeConfig.introPages) {
      const cacheKey = `intro-${introSlug}`;
      let html: string | null = null;

      if (useCache) {
        html = loadFromCache(volumeNum, cacheKey);
      }

      if (!html) {
        try {
          const url = `${BOOK_CONFIG.baseUrl}/volume-${volumeNum}/${introSlug}/`;
          html = await fetchWithRetry(url);
          saveToCache(volumeNum, cacheKey, html);
        } catch (error: any) {
          console.warn(`  ⚠️ Failed to fetch intro page ${introSlug}: ${error.message}`);
          continue;
        }
      }

      if (html) {
        const intro = parseIntroPage(html, introSlug, displayOrder++);
        volume.intro_pages!.push(intro);
        console.log(`    ✅ ${intro.title_en} (${intro.content_en.length} chars)`);
      }

      await delay(500); // Be nice to the server
    }
  }

  // Parse chapters
  console.log(`\n  📚 Parsing ${volumeConfig.chapters} chapters...`);
  for (let chapterNum = 1; chapterNum <= volumeConfig.chapters; chapterNum++) {
    // Build chapter slug (chapter-1, chapter-2, etc. or chapter-one, chapter-two)
    const chapterSlugs = [
      `chapter-${chapterNum}`,
      `chapter-${numberToWord(chapterNum)}`,
    ];

    let chapter: Chapter | null = null;

    for (const slug of chapterSlugs) {
      chapter = await fetchAndParseChapter(volumeNum, chapterNum, slug, useCache);
      if (chapter && chapter.content_en.length > 100) {
        break;
      }
    }

    if (chapter && chapter.content_en.length > 100) {
      volume.chapters.push(chapter);
      console.log(
        `    ✅ Chapter ${chapterNum}: "${chapter.title_en}" (${chapter.content_en.length} chars)`
      );
    } else {
      console.warn(`    ⚠️ Chapter ${chapterNum}: No content found`);
    }

    await delay(500); // Be nice to the server
  }

  return volume;
}

function numberToWord(num: number): string {
  const words = [
    "", "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve",
  ];
  return words[num] || String(num);
}

async function parseAllVolumes(useCache: boolean = true): Promise<BookData> {
  console.log("📚 Transcendental Diary Parser");
  console.log("━".repeat(50));

  const bookData: BookData = {
    book_slug: "tdry",
    book_title_en: "Transcendental Diary",
    book_title_ua: "Трансцендентний щоденник",
    author_en: "Hari Sauri dasa",
    author_ua: "Харі Шаурі дас",
    description_en:
      "A personal account of traveling with His Divine Grace A.C. Bhaktivedanta Swami Prabhupada from November 1975 to November 1977.",
    volumes: [],
  };

  ensureDir(OUTPUT_DIR);
  ensureDir(CACHE_DIR);

  for (const volumeConfig of BOOK_CONFIG.volumes) {
    try {
      const volume = await fetchAndParseVolume(volumeConfig.number, useCache);
      bookData.volumes.push(volume);
    } catch (error: any) {
      console.error(`❌ Failed to parse Volume ${volumeConfig.number}: ${error.message}`);
    }
  }

  return bookData;
}

// ============= CLI =============

async function main() {
  const args = process.argv.slice(2);
  const useCache = !args.includes("--no-cache");
  const volumeArg = args.find((a) => a.startsWith("--volume="));
  const chapterArg = args.find((a) => a.startsWith("--chapter="));

  if (args.includes("--help")) {
    console.log(`
Transcendental Diary Parser

Usage:
  npx ts-node tools/parse-transcendental-diary.ts [options]

Options:
  --help              Show this help
  --no-cache          Ignore cache and fetch fresh data
  --volume=N          Parse only volume N (1-5)
  --chapter=N         Parse only chapter N (requires --volume)

Examples:
  npx ts-node tools/parse-transcendental-diary.ts
  npx ts-node tools/parse-transcendental-diary.ts --volume=1
  npx ts-node tools/parse-transcendental-diary.ts --volume=1 --chapter=1
  npx ts-node tools/parse-transcendental-diary.ts --no-cache
`);
    return;
  }

  console.log("📚 Transcendental Diary Parser\n");

  let bookData: BookData;

  if (volumeArg) {
    const volumeNum = parseInt(volumeArg.split("=")[1], 10);

    if (chapterArg) {
      // Parse single chapter
      const chapterNum = parseInt(chapterArg.split("=")[1], 10);
      console.log(`Parsing Volume ${volumeNum}, Chapter ${chapterNum}...`);

      const slugs = [`chapter-${chapterNum}`, `chapter-${numberToWord(chapterNum)}`];
      let chapter: Chapter | null = null;

      for (const slug of slugs) {
        chapter = await fetchAndParseChapter(volumeNum, chapterNum, slug, useCache);
        if (chapter && chapter.content_en.length > 100) break;
      }

      if (chapter) {
        console.log("\n📄 Result:");
        console.log(`  Title: ${chapter.title_en}`);
        console.log(`  Content length: ${chapter.content_en.length} chars`);
        console.log(`  Dates: ${chapter.dates || "N/A"}`);
        console.log("\n📝 First 500 chars of content:");
        console.log(chapter.content_en.substring(0, 500) + "...");
      } else {
        console.log("❌ Chapter not found");
      }
      return;
    }

    // Parse single volume
    const volume = await fetchAndParseVolume(volumeNum, useCache);
    bookData = {
      book_slug: "tdry",
      book_title_en: "Transcendental Diary",
      book_title_ua: "Трансцендентний щоденник",
      author_en: "Hari Sauri dasa",
      author_ua: "Харі Шаурі дас",
      volumes: [volume],
    };
  } else {
    // Parse all volumes
    bookData = await parseAllVolumes(useCache);
  }

  // Write output
  const outputPath = path.join(OUTPUT_DIR, "transcendental-diary-parsed.json");
  fs.writeFileSync(outputPath, JSON.stringify(bookData, null, 2), "utf-8");

  console.log("\n" + "━".repeat(50));
  console.log("✅ Done!");
  console.log(`   Volumes: ${bookData.volumes.length}`);
  console.log(
    `   Total chapters: ${bookData.volumes.reduce((acc, v) => acc + v.chapters.length, 0)}`
  );
  console.log(`   Output: ${outputPath}`);
}

main().catch(console.error);
