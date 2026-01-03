#!/usr/bin/env npx ts-node
/**
 * BBT Ventura Parser - Local Script
 *
 * Parses BBT Ventura files from /docs folder and outputs JSON
 *
 * Usage: npx ts-node tools/parse-bbt.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, "..", "docs");
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data");

// PUA Mapping for Ukrainian diacritics
const UKRAINIAN_PUA_MAP: Record<string, string> = {
  "\uf100": "А",    // Capital A
  "\uf101": "а̄",
  "\uf102": "ī",
  "\uf121": "ī",
  "\uf123": "ӯ",
  "\uf103": "д̣",
  "\uf105": "",     // Style marker, remove
  "\uf109": "м̇",
  "\uf107": "м\u0310", // Candrabindu variant
  "\uf10d": "м\u0310", // Candrabindu (combining) - м̐, М̐
  "\uf10f": "н̇",
  "\uf111": "н̣",
  "\uf113": "н̃",
  "\uf115": "р̣",
  "\uf117": "р̣",   // Alternative р̣ encoding
  "\uf119": "т̣",
  "\uf11b": "х̣",
  "\uf11c": "Ш́",
  "\uf11d": "ш́",
  "\uf11f": "ш̣",
  "\uf125": "р̣̄",
  "\uf127": "л̣",
  "\uf129": "л̣̄",
};

// Intro file mapping
const INTRO_FILE_MAP: Record<string, [string, string, number]> = {
  UKBG00DC: ["dedication", "Посвята", 1],
  UKBG00SS: ["background", "Передісторія «Бгаґавад-ґіти»", 2],
  UKBG00PF: ["preface", "Передмова до англійського видання", 3],
  UKBG00NT: ["note", "Коментар до другого англійського видання", 4],
  UKBG00ID: ["introduction", "Вступ", 5],
  UKBG00DS: ["disciplic-succession", "Ланцюг учнівської послідовності", 100],
  UKBG00AU: ["about-author", "Про автора", 101],
  UKBG00KU: ["reviews", "Відгуки про «Бгаґавад-ґіту як вона є»", 102],
  UKBG00PG: ["pronunciation", "Як читати санскрит", 103],
  UKBG00GL: ["glossary", "Словничок імен і термінів", 104],
  UKBG00QV: ["verse-index", "Покажчик цитованих віршів", 105],
  UKBG00RF: ["references", "Список цитованої літератури", 107],
  UKBG00BL: ["books", "Книги Його Божественної Милості", 108],
};

const ORDINALS: [string, number][] = [
  ["ВІСІМНАДЦЯТА", 18],
  ["СІМНАДЦЯТА", 17],
  ["ШІСТНАДЦЯТА", 16],
  ["П'ЯТНАДЦЯТА", 15],
  ["ЧОТИРНАДЦЯТА", 14],
  ["ТРИНАДЦЯТА", 13],
  ["ДВАНАДЦЯТА", 12],
  ["ОДИНАДЦЯТА", 11],
  ["ДЕСЯТА", 10],
  ["ДЕВ'ЯТА", 9],
  ["ВОСЬМА", 8],
  ["С'ОМА", 7],
  ["СЬОМА", 7],
  ["ШОСТА", 6],
  ["П'ЯТА", 5],
  ["ЧЕТВЕРТА", 4],
  ["ТРЕТЯ", 3],
  ["ДРУГА", 2],
  ["ПЕРША", 1],
];

const SKIP_TAGS = new Set(["rh-verso", "rh-recto", "logo", "text-rh", "special"]);
const DEVANAGARI_TAGS = new Set(["d-uvaca", "d-anustubh", "d-tristubh"]);

// ============= TEXT PROCESSING =============

function decodePua(text: string): string {
  let result = text;
  for (const [pua, uni] of Object.entries(UKRAINIAN_PUA_MAP)) {
    result = result.split(pua).join(uni);
  }
  return result;
}

function processLineContinuations(text: string): string {
  if (!text.includes("<->") && !text.includes("<&>")) return text;

  const lines = text.split("\n");
  const result: string[] = [];
  let buffer = "";

  for (const line of lines) {
    const stripped = line.trimEnd();
    if (stripped.endsWith("<->")) {
      let l = stripped.slice(0, -3);
      if (l.endsWith("-")) l = l.slice(0, -1);
      buffer += l;
    } else if (stripped.endsWith("-<&>")) {
      buffer += stripped.slice(0, -4);
    } else if (stripped.endsWith("<&>")) {
      buffer += stripped.slice(0, -3);
    } else {
      if (buffer) {
        result.push(buffer + line);
        buffer = "";
      } else {
        result.push(line);
      }
    }
  }
  if (buffer) result.push(buffer);
  return result.join("\n");
}

function processInlineTags(text: string, keepHtml: boolean = false): string {
  let result = processLineContinuations(text);
  result = result.split("<u003C>").join("<");
  result = result.replace(/<->\s*/g, "");
  result = result.replace(/<&>\s*/g, "");
  result = result.replace(/<=>\s*/g, "");
  result = result.replace(/<_?R>/g, "\n");
  result = result.replace(/<N\|?>/g, "");
  result = result.replace(/<S>/g, " ");
  result = result.replace(/<_>/g, " ");
  result = result.replace(/<_oneletter>([^<]*)<_N>/g, "$1 ");

  if (keepHtml) {
    result = result.replace(/<BI>([^<]*)<\/?D>/g, "<strong><em>$1</em></strong>");
    result = result.replace(/<B>([^<]*)<\/?D>/g, "<strong>$1</strong>");
    result = result.replace(/<B>/g, "<strong>");
    result = result.replace(/<MI>([^<]*)<\/?D>/g, "<em>$1</em>");
    result = result.replace(/<MI>/g, "<em>");
    result = result.replace(/<\/?D>/g, "</em>");
    result = result.replace(/<\/em>\s*<em>([,.\;:])/g, "</em>$1");
    result = result.replace(/<\/strong>\s*<strong>([,.\;:])/g, "</strong>$1");
    result = result.replace(/<em><\/em>/g, "");
    result = result.replace(/<strong><\/strong>/g, "");
    result = result.replace(/<\/em>\s*<em>/g, " ");
    result = result.replace(/<\/strong>\s*<strong>/g, " ");
    result = result.replace(/\s+<\/em>/g, "</em>");
    result = result.replace(/\s+<\/strong>/g, "</strong>");
    result = result.replace(/<em><\/em>/g, "");
    result = result.replace(/<strong><\/strong>/g, "");
  } else {
    result = result.replace(/<BI>([^<]*)<\/?D>/g, "$1");
    result = result.replace(/<B>([^<]*)<\/?D>/g, "$1");
    result = result.replace(/<B>/g, "");
    result = result.replace(/<MI>([^<]*)<\/?D>/g, "$1");
    result = result.replace(/<MI>/g, "");
    result = result.replace(/<\/?D>/g, "");
  }

  if (keepHtml) {
    // Book titles - wrap in strong, handle existing quotes
    result = result.replace(/<_bt>([^<]*)<_\/bt>/g, (_, content) => {
      const trimmed = content.trim();
      // Remove existing quotes if present, then add them back
      const cleaned = trimmed.replace(/^«+/, "").replace(/»+$/, "");
      return `<strong>«${cleaned}»</strong>`;
    });
  } else {
    result = result.replace(/<_bt>([^<]*)<_\/bt>/g, (_, content) => {
      const trimmed = content.trim();
      const cleaned = trimmed.replace(/^«+/, "").replace(/»+$/, "");
      return `«${cleaned}»`;
    });
  }

  result = result.replace(/<_qm>/g, "");
  result = result.replace(/<\/_qm>/g, "");
  result = result.replace(/<_dt>([^<]*)<_\/dt>/g, "$1");
  result = result.replace(/<_dt>|<_\/dt>/g, "");
  result = result.replace(/<_dd>|<_\/dd>/g, "");
  result = result.replace(/<_slash>\/<_\/slash>/g, "/");
  result = result.replace(/<mon>[^<]*<\/mon>/g, "");
  result = decodePua(result);

  if (keepHtml) {
    // Remove Ventura-specific tags but keep HTML tags
    // First, remove all remaining Ventura tags (start with <_ or are Ventura-specific)
    result = result.replace(/<_[^>]*>/g, ""); // Remove <_...> tags
    result = result.replace(/<\/?[A-Z][^>]*>/g, ""); // Remove uppercase tags like <B>, <MI>, <D>, <R>, <S>, <N>
    // Note: HTML tags like <em>, <strong>, <p>, <span>, <blockquote> start with lowercase and are preserved
  } else {
    result = result.replace(/<[^>]*>/g, "");
  }

  result = result.replace(/[ \t]+/g, " ");
  result = result.replace(/\n\s*\n/g, "\n\n");
  return result.trim();
}

function processSynonyms(text: string): string {
  let result = processLineContinuations(text);
  result = result.split("\n").join(" ");
  result = result.replace(/<MI><_dt>([^<]*)<_\/dt><D>\s*[-–—]?\s*<_dd>([^<]*)<_\/dd>/g, "<em>$1</em> — $2");
  result = result.replace(/<_dt>([^<]*)<_\/dt>\s*[-–—]?\s*<_dd>([^<]*)<_\/dd>/g, "<em>$1</em> — $2");
  result = processInlineTags(result, true);
  result = result.replace(/\s+/g, " ").trim();
  result = result.replace(/ – /g, " — ");
  result = result.replace(/ - /g, " — ");
  return result;
}

function processProse(text: string, keepHtml: boolean = false): string {
  let result = processLineContinuations(text);
  result = result.split("\n").join(" ");
  result = processInlineTags(result, keepHtml);
  result = result.replace(/\s+/g, " ").trim();
  return result;
}

function processFirstParagraph(text: string): string {
  let result = processProse(text, true);
  if (result && result.length > 0) {
    let i = 0;
    let leadingTags = "";
    while (i < result.length) {
      if (result[i] === "<") {
        const tagEnd = result.indexOf(">", i);
        if (tagEnd !== -1) {
          leadingTags += result.slice(i, tagEnd + 1);
          i = tagEnd + 1;
        } else break;
      } else {
        const firstChar = result[i];
        const rest = result.slice(i + 1);
        return `<p class="purport first">${leadingTags}<span class="drop-cap">${firstChar}</span>${rest}</p>`;
      }
    }
  }
  return `<p class="purport first">${result}</p>`;
}

function processTransliteration(text: string): string {
  let result = processLineContinuations(text);
  result = result.replace(/<_R><_>/g, "\n");
  result = result.replace(/<R>/g, "\n");
  result = result.replace(/<_>/g, " ");
  result = processInlineTags(result);
  const lines = result
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);
  // Just join with newlines - UI handles the formatting
  return lines.join("\n");
}

/**
 * Process quotes preserving line breaks
 * Uses <br> for single line breaks, paragraph separation for double breaks
 */
function processQuote(text: string): string {
  let result = processLineContinuations(text);

  // Convert explicit line break tags to markers
  result = result.replace(/<_R><_>/g, "\n");
  result = result.replace(/<_?R>/g, "\n");
  result = result.replace(/<_>/g, " ");

  // Process inline formatting (bold, italic, etc.)
  result = processInlineTags(result, true);

  // Split into paragraphs (double newlines or more)
  const paragraphs = result.split(/\n{2,}/).map(p => p.trim()).filter(p => p);

  // Within each paragraph, convert single newlines to <br>
  const processedParagraphs = paragraphs.map(para => {
    // Replace single newlines with <br>
    const lines = para.split("\n").map(l => l.trim()).filter(l => l);
    return lines.join("<br>\n");
  });

  // Join paragraphs with double newline (will be rendered as separate <p> or spacing)
  return processedParagraphs.join("</p>\n<p>");
}

function extractVerseNumber(text: string): string {
  const match = text.match(/(?:Вірш[иі]?|ВІРШ[ИІ]?)\s*(\d+(?:\s*[-–—]\s*\d+)?)/i);
  if (match) {
    // Normalize: remove spaces, replace en-dash/em-dash with hyphen
    return match[1].replace(/\s+/g, "").replace(/[–—]/g, "-");
  }
  const numMatch = text.match(/(\d+(?:\s*[-–—]\s*\d+)?)/);
  if (numMatch) {
    return numMatch[1].replace(/\s+/g, "").replace(/[–—]/g, "-");
  }
  return text.trim();
}

function extractChapterNumber(text: string): number {
  let norm = text
    .toUpperCase()
    .replace(/ʼ/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/`/g, "'");
  for (const [name, num] of ORDINALS) {
    if (norm.includes(name)) return num;
  }
  const match = text.match(/(\d+)/);
  if (match) return parseInt(match[1]);
  return 0;
}

// ============= PARSERS =============

interface Verse {
  verse_number: string;
  transliteration_ua?: string;
  synonyms_ua?: string;
  translation_ua?: string;
  commentary_ua?: string;
}

interface Chapter {
  chapter_number: number;
  title_ua: string;
  verses: Verse[];
}

interface IntroPage {
  slug: string;
  title_ua: string;
  content_ua: string;
  display_order: number;
}

function parseVentura(text: string): Chapter {
  const lines = text.split("\n");
  let chapterNumber = 0;
  let chapterTitle = "";
  const verses: Verse[] = [];
  let currentVerse: Verse | null = null;
  let currentTag: string | null = null;
  let currentContent: string[] = [];

  function flushBlock() {
    if (!currentTag || SKIP_TAGS.has(currentTag) || DEVANAGARI_TAGS.has(currentTag)) return;
    const content = currentContent.join(" ").trim();
    if (!content) return;

    if (currentTag === "h1-number") {
      chapterNumber = extractChapterNumber(content);
    } else if (currentTag === "h1") {
      chapterTitle = processInlineTags(content);
    } else if (["h2-number", "h2-number-2", "ch"].includes(currentTag)) {
      if (currentVerse) verses.push(currentVerse);
      currentVerse = { verse_number: extractVerseNumber(content) };
    } else if (["v-uvaca", "v-anustubh", "v-tristubh"].includes(currentTag)) {
      if (currentVerse) {
        const translit = processTransliteration(content);
        currentVerse.transliteration_ua = currentVerse.transliteration_ua
          ? currentVerse.transliteration_ua + "\n" + translit
          : translit;
      }
    } else if (currentTag === "eqs") {
      if (currentVerse) {
        const synonyms = processSynonyms(content);
        currentVerse.synonyms_ua = currentVerse.synonyms_ua ? currentVerse.synonyms_ua + " " + synonyms : synonyms;
      }
    } else if (currentTag === "translation") {
      if (currentVerse) currentVerse.translation_ua = processProse(content, false);
    } else if (currentTag === "p-indent") {
      if (currentVerse) {
        const para = processFirstParagraph(content);
        if (para) {
          currentVerse.commentary_ua = currentVerse.commentary_ua ? currentVerse.commentary_ua + "\n\n" + para : para;
        }
      }
    } else if (["p", "p0", "p1"].includes(currentTag)) {
      if (currentVerse) {
        const para = processProse(content, true);
        if (para) {
          const wrapped = `<p class="purport">${para}</p>`;
          currentVerse.commentary_ua = currentVerse.commentary_ua
            ? currentVerse.commentary_ua + "\n\n" + wrapped
            : wrapped;
        }
      }
      // p-purport (ПОЯСНЕННЯ: header) - SKIP, UI already has "Пояснення" header
    } else if (["ql", "q", "q-p"].includes(currentTag)) {
      if (currentVerse) {
        const quote = processQuote(content);
        if (quote) {
          const blockquote = `<blockquote class="verse-quote"><p>${quote}</p></blockquote>`;
          currentVerse.commentary_ua = currentVerse.commentary_ua
            ? currentVerse.commentary_ua + "\n\n" + blockquote
            : blockquote;
        }
      }
    } else if (["p-anustubh", "p-uvaca", "p-tristubh", "p-gayatri", "p-indravajra", "p-sakkari"].includes(currentTag)) {
      // Quoted verse transliteration inside commentary (like verse quotes from other texts)
      if (currentVerse) {
        const translit = processTransliteration(content);
        if (translit) {
          const blockquote = `<blockquote class="verse-quote verse-translit">${translit}</blockquote>`;
          currentVerse.commentary_ua = currentVerse.commentary_ua
            ? currentVerse.commentary_ua + "\n\n" + blockquote
            : blockquote;
        }
      }
    } else if (currentTag === "p-outro") {
      if (currentVerse) {
        const outro = `<p class="purport-outro"><em>${processProse(content, true)}</em></p>`;
        currentVerse.commentary_ua = currentVerse.commentary_ua ? currentVerse.commentary_ua + "\n\n" + outro : outro;
      }
    }
  }

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (trimmed.startsWith("@") && trimmed.includes(" = ")) {
      flushBlock();
      const match = trimmed.match(/^@([\w-]+)\s*=\s*(.*)/);
      if (match) {
        currentTag = match[1];
        const c = match[2].trim();
        currentContent = c ? [c] : [];
      }
    } else if (currentTag && line) {
      currentContent.push(line);
    }
  }

  flushBlock();
  if (currentVerse) verses.push(currentVerse);
  return { chapter_number: chapterNumber, title_ua: chapterTitle, verses };
}

function parseIntroPage(text: string, filePrefix: string): IntroPage | null {
  const mapping = INTRO_FILE_MAP[filePrefix];
  if (!mapping) return null;

  const [slug, defaultTitle, displayOrder] = mapping;
  const lines = text.split("\n");
  let title = defaultTitle;
  const paragraphs: string[] = [];
  let currentTag: string | null = null;
  let currentContent: string[] = [];

  function flushBlock() {
    if (!currentTag) return;
    const content = currentContent.join(" ").trim();
    if (!content) return;

    if (["h1-fb", "h1", "h1-pg", "h1-rv", "h1-bl", "h1-ds"].includes(currentTag)) {
      title = processProse(content, false).split(/\s+/).join(" ");
    } else if (["h2", "h2-gl", "h2-rv"].includes(currentTag)) {
      const sub = processProse(content, true);
      if (sub) paragraphs.push(`<strong>${sub}</strong>`);
    } else if (["p0", "p", "p1", "p-indent", "p-gl", "p-au", "p-rv", "p-bl", "p0-ku", "p1-ku"].includes(currentTag)) {
      const para = processProse(content, true);
      if (para) paragraphs.push(para);
    } else if (currentTag === "ku-signature") {
      const sig = processProse(content, true).replace(/\n/g, "<br>");
      if (sig) paragraphs.push(`<p class="signature"><em>${sig}</em></p>`);
    } else if (currentTag === "dc") {
      const para = processProse(content, true).replace(/\n/g, "<br>");
      if (para) paragraphs.push(`<p class="dedication">${para}</p>`);
    } else if (["ql", "q", "q-p"].includes(currentTag)) {
      const quote = processQuote(content);
      if (quote) paragraphs.push(`<blockquote><p>${quote}</p></blockquote>`);
    }
  }

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (trimmed.startsWith("@") && trimmed.includes(" = ")) {
      flushBlock();
      const match = trimmed.match(/^@([\w-]+)\s*=\s*(.*)/);
      if (match) {
        currentTag = match[1];
        const c = match[2].trim();
        currentContent = c ? [c] : [];
      }
    } else if (currentTag && line) {
      currentContent.push(line);
    }
  }

  flushBlock();
  if (paragraphs.length === 0) return null;
  return { slug, title_ua: title, content_ua: paragraphs.join("\n\n"), display_order: displayOrder };
}

// ============= MAIN =============

function readFile(filePath: string): string {
  const buffer = fs.readFileSync(filePath);

  // Try UTF-16LE first
  try {
    const text = buffer.toString("utf16le");
    if (text.includes("@") && text.includes(" = ")) {
      return text.replace(/^\ufeff/, "");
    }
  } catch {}

  // Fallback to UTF-8
  return buffer.toString("utf8").replace(/^\ufeff/, "");
}

function main() {
  console.log("BBT Ventura Parser\n");

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(DOCS_DIR);
  const chapters: Chapter[] = [];
  const intros: IntroPage[] = [];

  // Parse chapter files (UKBG01XT - UKBG18XT)
  for (let i = 1; i <= 18; i++) {
    const prefix = `UKBG${String(i).padStart(2, "0")}XT`;
    const chapterFile = files.find((f) => f.startsWith(prefix) && !f.endsWith(".bak"));

    if (chapterFile) {
      console.log(`Parsing chapter ${i}: ${chapterFile}`);
      const text = readFile(path.join(DOCS_DIR, chapterFile));
      const chapter = parseVentura(text);

      if (chapter.verses.length > 0) {
        chapters.push(chapter);
        console.log(`  → ${chapter.verses.length} verses, title: "${chapter.title_ua}"`);
      } else {
        console.log(`  → WARNING: No verses found!`);
      }
    } else {
      console.log(`Chapter ${i}: NOT FOUND`);
    }
  }

  // Parse intro files
  for (const [prefix, [slug, title]] of Object.entries(INTRO_FILE_MAP)) {
    const introFile = files.find((f) => f.startsWith(prefix) && !f.endsWith(".bak"));

    if (introFile) {
      console.log(`Parsing intro: ${introFile}`);
      const text = readFile(path.join(DOCS_DIR, introFile));
      const intro = parseIntroPage(text, prefix);

      if (intro) {
        intros.push(intro);
        console.log(`  → "${intro.title_ua}"`);
      }
    }
  }

  // Write output
  const output = { chapters, intros };
  const outputPath = path.join(OUTPUT_DIR, "bbt-parsed.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(`\n✅ Done!`);
  console.log(`   Chapters: ${chapters.length}`);
  console.log(`   Total verses: ${chapters.reduce((sum, c) => sum + c.verses.length, 0)}`);
  console.log(`   Intro pages: ${intros.length}`);
  console.log(`   Output: ${outputPath}`);
}

main();
