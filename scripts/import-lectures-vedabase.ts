/**
 * Масовий імпорт лекцій з Vedabase.io
 *
 * Використання:
 *   npx tsx scripts/import-lectures-vedabase.ts
 *
 * Етапи:
 * 1. Отримати список всіх slug'ів лекцій з vedabase.io
 * 2. Завантажити HTML кожної лекції
 * 3. Парсити метадані та контент
 * 4. Зберегти в БД через Supabase
 *
 * Опції:
 *   --limit <number>  - обмежити кількість лекцій для імпорту
 *   --offset <number> - пропустити перші N лекцій
 *   --slug <string>   - імпортувати конкретну лекцію
 *   --dry-run         - тільки показати що буде імпортовано
 */

import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";

// Конфігурація
const VEDABASE_BASE_URL = "https://vedabase.io/en/library/transcripts";
const DELAY_MS = 2000; // Затримка між запитами для rate limiting
const BATCH_SIZE = 10; // Кількість лекцій в одному batch

// Supabase клієнт (використовуємо service role key для адмін-доступу)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Типи
interface LectureMetadata {
  slug: string;
  title_en: string;
  title_ua: string | null;
  lecture_date: string;
  location_en: string;
  location_ua: string | null;
  lecture_type: string;
  audio_url: string | null;
  book_slug: string | null;
  chapter_number: number | null;
  verse_number: string | null;
}

interface LectureParagraph {
  paragraph_number: number;
  content_en: string;
  content_ua: string | null;
  audio_timecode: number | null;
}

// Маппінг типів лекцій для української мови
const LECTURE_TYPE_TRANSLATIONS: Record<string, string> = {
  "Conversation": "Розмова",
  "Walk": "Прогулянка",
  "Morning Walk": "Ранкова прогулянка",
  "Lecture": "Лекція",
  "Bhagavad-gita": "Лекція з Бгаґавад-ґіти",
  "Srimad-Bhagavatam": "Лекція з Шрімад-Бгаґаватам",
  "Nectar of Devotion": "Лекція з Нектару відданості",
  "Sri Isopanisad": "Лекція з Шрі Ішопанішад",
  "Sri Caitanya-caritamrta": "Лекція з Шрі Чайтанья-чарітамріта",
  "Initiation": "Ініціація",
  "Room Conversation": "Розмова в кімнаті",
  "Interview": "Інтерв'ю",
  "Arrival": "Прибуття",
  "Departure": "Від'їзд",
  "Festival": "Фестиваль",
  "Bhajan": "Бгаджан",
  "Kirtan": "Кіртан",
  "Other": "Інше",
};

// Маппінг міст
const LOCATION_TRANSLATIONS: Record<string, string> = {
  "New York": "Нью-Йорк",
  "Los Angeles": "Лос-Анджелес",
  "San Francisco": "Сан-Франциско",
  "London": "Лондон",
  "Paris": "Париж",
  "Bombay": "Бомбей",
  "Mumbai": "Мумбаї",
  "Calcutta": "Калькутта",
  "Vrindavan": "Вріндаван",
  "Mayapur": "Маяпур",
  "Delhi": "Делі",
  "Honolulu": "Гонолулу",
  "Tokyo": "Токіо",
  "Melbourne": "Мельбурн",
  "Sydney": "Сідней",
  "Montreal": "Монреаль",
  "Toronto": "Торонто",
  "Boston": "Бостон",
  "Chicago": "Чикаго",
  "Detroit": "Детройт",
  "Seattle": "Сіетл",
  "Dallas": "Даллас",
  "Atlanta": "Атланта",
  "Hawaii": "Гаваї",
};

// Утиліти
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "VedaVoice-Importer/1.0 (+https://vedavoice.org)",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function parseDateFromSlug(slug: string): string | null {
  // Формат slug: YYMMDD... (наприклад, 660219bg-new-york)
  const match = slug.match(/^(\d{2})(\d{2})(\d{2})/);
  if (!match) return null;

  const [, yy, mm, dd] = match;
  const year = parseInt(yy) > 50 ? `19${yy}` : `20${yy}`;

  try {
    const date = new Date(`${year}-${mm}-${dd}`);
    if (isNaN(date.getTime())) return null;
    return `${year}-${mm}-${dd}`;
  } catch {
    return null;
  }
}

function detectLectureType(title: string, slug: string): { type: string; bookSlug: string | null } {
  const titleLower = title.toLowerCase();
  const slugLower = slug.toLowerCase();

  if (titleLower.includes("bhagavad") || titleLower.includes("gita") || slugLower.includes("bg")) {
    return { type: "Bhagavad-gita", bookSlug: "bg" };
  }
  if (titleLower.includes("bhagavatam") || slugLower.includes("sb")) {
    return { type: "Srimad-Bhagavatam", bookSlug: "sb" };
  }
  if (titleLower.includes("caitanya") || slugLower.includes("cc")) {
    return { type: "Sri Caitanya-caritamrta", bookSlug: "cc" };
  }
  if (titleLower.includes("isopanisad") || slugLower.includes("iso")) {
    return { type: "Sri Isopanisad", bookSlug: "iso" };
  }
  if (titleLower.includes("walk") || slugLower.includes("walk")) {
    return { type: "Morning Walk", bookSlug: null };
  }
  if (titleLower.includes("conversation") || slugLower.includes("conv")) {
    return { type: "Conversation", bookSlug: null };
  }
  if (titleLower.includes("initiation")) {
    return { type: "Initiation", bookSlug: null };
  }

  return { type: "Lecture", bookSlug: null };
}

function parseChapterVerse(title: string): { chapter: number | null; verse: string | null } {
  const match = title.match(/(\d+)\.(\d+(?:-\d+)?)/);
  if (!match) return { chapter: null, verse: null };

  return {
    chapter: parseInt(match[1]),
    verse: match[2],
  };
}

function transliterateTitle(title: string): string {
  const replacements: Record<string, string> = {
    "Bhagavad-gita": "Бгаґавад-ґіта",
    "Bhagavad-gītā": "Бгаґавад-ґіта",
    "Srimad-Bhagavatam": "Шрімад-Бгаґаватам",
    "Śrīmad-Bhāgavatam": "Шрімад-Бгаґаватам",
    "Caitanya-caritamrta": "Чайтанья-чарітамріта",
    "Introduction": "Вступ",
    "Lecture": "Лекція",
  };

  let result = title;
  for (const [en, ua] of Object.entries(replacements)) {
    result = result.replace(new RegExp(en, "gi"), ua);
  }
  return result;
}

// Парсер лекції
function parseLecture(html: string, slug: string): { metadata: LectureMetadata; paragraphs: LectureParagraph[] } | null {
  const $ = cheerio.load(html);

  // Витягти заголовок
  const title = $("h1").first().text().trim() || $("title").text().trim();
  if (!title) {
    console.warn(`No title found for ${slug}`);
    return null;
  }

  // Витягти дату
  const lectureDate = parseDateFromSlug(slug);
  if (!lectureDate) {
    console.warn(`Could not parse date from slug: ${slug}`);
    return null;
  }

  // Витягти локацію
  let location = "Unknown";
  const slugParts = slug.split("-");
  if (slugParts.length > 1) {
    location = slugParts.slice(1).join(" ").replace(/_/g, " ");
    // Capitalize first letter of each word
    location = location.split(" ").map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  }

  // Визначити тип лекції
  const { type: lectureType, bookSlug } = detectLectureType(title, slug);

  // Витягти главу/вірш
  const { chapter, verse } = parseChapterVerse(title);

  // Витягти аудіо URL
  const audioUrl = $("audio source").attr("src") || $("audio").attr("src") || null;

  // Витягти параграфи
  const paragraphs: LectureParagraph[] = [];
  const contentDiv = $(".r-text, .content, article, main").first();
  const paragraphElements = contentDiv.length ? contentDiv.find("p") : $("p");

  let paragraphNumber = 1;
  paragraphElements.each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10) {
      paragraphs.push({
        paragraph_number: paragraphNumber++,
        content_en: text,
        content_ua: null,
        audio_timecode: null,
      });
    }
  });

  const metadata: LectureMetadata = {
    slug,
    title_en: title,
    title_ua: transliterateTitle(title),
    lecture_date: lectureDate,
    location_en: location,
    location_ua: LOCATION_TRANSLATIONS[location] || null,
    lecture_type: lectureType,
    audio_url: audioUrl,
    book_slug: bookSlug,
    chapter_number: chapter,
    verse_number: verse,
  };

  return { metadata, paragraphs };
}

// Отримати список всіх slug'ів лекцій
async function fetchLectureSlugs(): Promise<string[]> {
  console.log("Fetching lecture list from Vedabase...");

  const html = await fetchHtml(`${VEDABASE_BASE_URL}/`);
  if (!html) {
    console.error("Failed to fetch lecture list");
    return [];
  }

  const $ = cheerio.load(html);
  const slugs: string[] = [];

  // Шукаємо посилання на лекції
  $('a[href*="/transcripts/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const match = href.match(/\/transcripts\/([^/]+)/);
      if (match && match[1]) {
        slugs.push(match[1]);
      }
    }
  });

  // Унікальні slug'и
  return [...new Set(slugs)];
}

// Імпортувати одну лекцію в БД
async function importLecture(slug: string, dryRun: boolean = false): Promise<boolean> {
  console.log(`\nProcessing: ${slug}`);

  // Перевірити чи вже існує
  const { data: existing } = await supabase
    .from("lectures")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    console.log(`  Skipping (already exists): ${slug}`);
    return true;
  }

  // Завантажити HTML
  const html = await fetchHtml(`${VEDABASE_BASE_URL}/${slug}/`);
  if (!html) {
    console.error(`  Failed to fetch: ${slug}`);
    return false;
  }

  // Парсити
  const result = parseLecture(html, slug);
  if (!result) {
    console.error(`  Failed to parse: ${slug}`);
    return false;
  }

  const { metadata, paragraphs } = result;

  if (dryRun) {
    console.log(`  [DRY RUN] Would import: ${metadata.title_en}`);
    console.log(`    Date: ${metadata.lecture_date}`);
    console.log(`    Location: ${metadata.location_en}`);
    console.log(`    Type: ${metadata.lecture_type}`);
    console.log(`    Paragraphs: ${paragraphs.length}`);
    return true;
  }

  // Вставити лекцію
  const { data: lecture, error: lectureError } = await supabase
    .from("lectures")
    .insert(metadata)
    .select("id")
    .single();

  if (lectureError) {
    console.error(`  Failed to insert lecture: ${lectureError.message}`);
    return false;
  }

  // Вставити параграфи
  if (paragraphs.length > 0 && lecture) {
    const paragraphsWithLectureId = paragraphs.map((p) => ({
      ...p,
      lecture_id: lecture.id,
    }));

    const { error: paragraphsError } = await supabase
      .from("lecture_paragraphs")
      .insert(paragraphsWithLectureId);

    if (paragraphsError) {
      console.error(`  Failed to insert paragraphs: ${paragraphsError.message}`);
    }
  }

  console.log(`  ✓ Imported: ${metadata.title_en} (${paragraphs.length} paragraphs)`);
  return true;
}

// Головна функція
async function main() {
  const args = process.argv.slice(2);

  // Парсити аргументи
  const limitIndex = args.indexOf("--limit");
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;

  const offsetIndex = args.indexOf("--offset");
  const offset = offsetIndex !== -1 ? parseInt(args[offsetIndex + 1]) : 0;

  const slugIndex = args.indexOf("--slug");
  const singleSlug = slugIndex !== -1 ? args[slugIndex + 1] : undefined;

  const dryRun = args.includes("--dry-run");

  console.log("=== Vedabase Lectures Importer ===");
  console.log(`Dry run: ${dryRun}`);
  if (limit) console.log(`Limit: ${limit}`);
  if (offset) console.log(`Offset: ${offset}`);
  if (singleSlug) console.log(`Single slug: ${singleSlug}`);

  let slugs: string[];

  if (singleSlug) {
    slugs = [singleSlug];
  } else {
    slugs = await fetchLectureSlugs();
    console.log(`Found ${slugs.length} lectures`);

    // Застосувати offset та limit
    slugs = slugs.slice(offset, limit ? offset + limit : undefined);
  }

  console.log(`\nProcessing ${slugs.length} lectures...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];

    try {
      const success = await importLecture(slug, dryRun);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`Error processing ${slug}:`, error);
      failCount++;
    }

    // Rate limiting
    if (i < slugs.length - 1) {
      await delay(DELAY_MS);
    }

    // Прогрес
    if ((i + 1) % 10 === 0) {
      console.log(`\n--- Progress: ${i + 1}/${slugs.length} (${successCount} success, ${failCount} failed) ---\n`);
    }
  }

  console.log("\n=== Import Complete ===");
  console.log(`Total: ${slugs.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
