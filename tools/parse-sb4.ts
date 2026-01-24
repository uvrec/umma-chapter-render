#!/usr/bin/env npx ts-node
/**
 * SB4 (Srimad Bhagavatam Canto 4, Part 2) Ventura Parser
 *
 * Parses BBT Ventura files from /docs/SB/4 folder and outputs JSON
 * This canto has chapters 20-31, each with verses structure
 *
 * File pattern: UKS4##XT.* (UKS420XT through UKS431XT)
 *
 * Usage: npx ts-node tools/parse-sb4.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, "..", "docs", "SB", "4");
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

// Intro file mapping for SB4 (prefix UKS402 for intros)
const INTRO_FILE_MAP: Record<string, [string, string, number]> = {
  UKS402FW: ["foreword", "Передмова", 1],
  UKS402PF: ["preface", "Передмова до англійського видання", 2],
  UKS402AU: ["about-author", "Про автора", 100],
  UKS402PG: ["pronunciation", "Як читати санскрит", 101],
  UKS402BL: ["books", "Книги Його Божественної Милості", 102],
  UKS402GL: ["glossary", "Словничок", 103],
  UKS402TC: ["contents", "Зміст", 104],
};

const SKIP_TAGS = new Set(["rh-verso", "rh-recto", "logo", "text-rh", "special"]);
const DEVANAGARI_TAGS = new Set(["d-uvaca", "d-anustubh", "d-tristubh", "devanagari"]);

// ============= TEXT PROCESSING =============

function decodePua(text: string): string {
  let result = text;
  for (const [pua, uni] of Object.entries(UKRAINIAN_PUA_MAP)) {
    result = result.split(pua).join(uni);
  }
  return result;
}

function processLineContinuations(text: string): string {
  if (!text.includes("<->") && !text.includes("<&>") && !text.includes("<=>")) return text;

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
    } else if (stripped.endsWith("<=>")) {
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
  result = result.replace(/<N\d+>/g, "");
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
    result = result.replace(/<_bt>([^<]*)<_\/bt>/g, (_, content) => {
      const trimmed = content.trim();
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
  result = result.replace(/<qc>/g, "");
  result = decodePua(result);

  if (keepHtml) {
    result = result.replace(/<_[^>]*>/g, "");
    result = result.replace(/<\/?[A-Z][^>]*>/g, "");
    // Clean up stray artifacts
    result = result.replace(/<\|>/g, "");
    result = result.replace(/<\/em><\/em>/g, "</em>");
    result = result.replace(/<\/em>,<\/em>/g, "</em>,");
    result = result.replace(/<\/em>\.<\/em>/g, "</em>.");
    result = result.replace(/<\/strong><\/strong>/g, "</strong>");
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
  return lines.join("\n");
}

function processQuote(text: string): string {
  let result = processLineContinuations(text);
  result = result.replace(/<_R><_>/g, "\n");
  result = result.replace(/<_?R>/g, "\n");
  result = result.replace(/<_>/g, " ");
  result = processInlineTags(result, true);

  const paragraphs = result.split(/\n{2,}/).map(p => p.trim()).filter(p => p);
  const processedParagraphs = paragraphs.map(para => {
    const lines = para.split("\n").map(l => l.trim()).filter(l => l);
    return lines.join("<br>\n");
  });

  return processedParagraphs.join("</p>\n<p>");
}

function extractVerseNumber(text: string): string {
  const match = text.match(/(?:Вірш[иі]?|ВІРШ[ИІ]?|ТЕКСТ)\s*(\d+(?:\s*[-–—]\s*\d+)?)/i);
  if (match) {
    return match[1].replace(/\s+/g, "").replace(/[–—]/g, "-");
  }
  const numMatch = text.match(/(\d+(?:\s*[-–—]\s*\d+)?)/);
  if (numMatch) {
    return numMatch[1].replace(/\s+/g, "").replace(/[–—]/g, "-");
  }
  return text.trim();
}

function extractChapterNumber(text: string): number {
  const match = text.match(/(\d+)/);
  if (match) return parseInt(match[1]);
  return 0;
}

// ============= INTERFACES =============

interface Verse {
  verse_number: string;
  transliteration_uk?: string;
  synonyms_uk?: string;
  translation_uk?: string;
  commentary_uk?: string;
}

interface Chapter {
  chapter_number: number;
  chapter_title_uk: string;
  verses: Verse[];
}

interface IntroPage {
  slug: string;
  title_uk: string;
  content_uk: string;
  display_order: number;
}

// ============= PARSERS =============

function parseChapter(text: string): Chapter {
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
        currentVerse.transliteration_uk = currentVerse.transliteration_uk
          ? currentVerse.transliteration_uk + "\n" + translit
          : translit;
      }
    } else if (["eqs", "h3-synonyms"].includes(currentTag)) {
      if (currentVerse) {
        const synonyms = processSynonyms(content);
        currentVerse.synonyms_uk = currentVerse.synonyms_uk ? currentVerse.synonyms_uk + " " + synonyms : synonyms;
      }
    } else if (currentTag === "translation") {
      if (currentVerse) currentVerse.translation_uk = processProse(content, false);
    } else if (["p", "p0", "p1", "p-purport", "p-h3-inline"].includes(currentTag)) {
      if (currentVerse) {
        let para = processProse(content, true);
        // Remove redundant "ПОЯСНЕННЯ:" header - UI already shows purport section
        para = para.replace(/^ПОЯСНЕННЯ:\s*/i, "");
        if (para) {
          const wrapped = `<p class="purport">${para}</p>`;
          currentVerse.commentary_uk = currentVerse.commentary_uk
            ? currentVerse.commentary_uk + "\n\n" + wrapped
            : wrapped;
        }
      }
    } else if (["ql", "q", "q-p"].includes(currentTag)) {
      if (currentVerse) {
        const quote = processQuote(content);
        if (quote) {
          const blockquote = `<blockquote class="verse-quote"><p>${quote}</p></blockquote>`;
          currentVerse.commentary_uk = currentVerse.commentary_uk
            ? currentVerse.commentary_uk + "\n\n" + blockquote
            : blockquote;
        }
      }
    } else if (["p-anustubh", "p-uvaca", "p-tristubh", "p-gayatri", "p-indravajra", "p-bengali", "p-bengali-s", "p-jagati", "p-sakkari"].includes(currentTag)) {
      if (currentVerse) {
        const translit = processTransliteration(content);
        if (translit) {
          const blockquote = `<blockquote class="verse-quote verse-translit">${translit}</blockquote>`;
          currentVerse.commentary_uk = currentVerse.commentary_uk
            ? currentVerse.commentary_uk + "\n\n" + blockquote
            : blockquote;
        }
      }
    } else if (currentTag === "p-outro") {
      if (currentVerse) {
        const outro = `<p class="purport-outro"><em>${processProse(content, true)}</em></p>`;
        currentVerse.commentary_uk = currentVerse.commentary_uk ? currentVerse.commentary_uk + "\n\n" + outro : outro;
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
  return { chapter_number: chapterNumber, chapter_title_uk: chapterTitle, verses };
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

    if (["h1-fb", "h1", "h1-pg", "h1-rv", "h1-bl", "h1-ds", "h1-au"].includes(currentTag)) {
      title = processProse(content, false).split(/\s+/).join(" ");
    } else if (["h2", "h2-gl", "h2-rv"].includes(currentTag)) {
      const sub = processProse(content, true);
      if (sub) paragraphs.push(`<strong>${sub}</strong>`);
    } else if (["p0", "p", "p1", "p-indent", "p-gl", "p-au", "p-rv", "p-bl"].includes(currentTag)) {
      const para = processProse(content, true);
      if (para) paragraphs.push(para);
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
  return { slug, title_uk: title, content_uk: paragraphs.join("\n\n"), display_order: displayOrder };
}

// ============= FILE HANDLING =============

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

// ============= MAIN =============

function main() {
  console.log("SB4 (Srimad Bhagavatam Canto 4, Part 2) Ventura Parser\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!fs.existsSync(DOCS_DIR)) {
    console.log(`Directory ${DOCS_DIR} not found. Creating empty output.`);
    const output = {
      canto: 4,
      title_uk: "Шрімад-Бгаґаватам, Пісня 4, Частина 2",
      title_en: "Srimad Bhagavatam, Canto 4, Part 2",
      chapters: [],
      intros: [],
    };
    const outputPath = path.join(OUTPUT_DIR, "sb4-parsed.json");
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
    console.log(`Created empty output: ${outputPath}`);
    return;
  }

  const files = fs.readdirSync(DOCS_DIR);
  const chapters: Chapter[] = [];
  const intros: IntroPage[] = [];

  // SB4 Part 2 has chapters 20-31
  // File pattern: UKS420XT through UKS431XT
  for (let i = 20; i <= 31; i++) {
    const prefix = `UKS4${String(i).padStart(2, "0")}XT`;
    const chapterFile = files.find((f) => f.startsWith(prefix) && !f.endsWith(".bak"));

    if (chapterFile) {
      console.log(`Parsing chapter ${i}: ${chapterFile}`);
      const text = readFile(path.join(DOCS_DIR, chapterFile));
      const chapter = parseChapter(text);

      // Override chapter number from file pattern
      chapter.chapter_number = i;

      if (chapter.verses.length > 0) {
        chapters.push(chapter);
        console.log(`  → ${chapter.verses.length} verses, title: "${chapter.chapter_title_uk}"`);
      } else {
        console.log(`  → WARNING: No verses found!`);
      }
    } else {
      console.log(`Chapter ${i}: NOT FOUND`);
    }
  }

  // Parse intro files
  for (const [prefix] of Object.entries(INTRO_FILE_MAP)) {
    const introFile = files.find((f) => f.startsWith(prefix) && !f.endsWith(".bak"));

    if (introFile) {
      console.log(`Parsing intro: ${introFile}`);
      const text = readFile(path.join(DOCS_DIR, introFile));
      const intro = parseIntroPage(text, prefix);

      if (intro) {
        intros.push(intro);
        console.log(`  → "${intro.title_uk}"`);
      }
    }
  }

  // Write output
  const output = {
    canto: 4,
    title_uk: "Шрімад-Бгаґаватам, Пісня 4, Частина 2",
    title_en: "Srimad Bhagavatam, Canto 4, Part 2",
    chapters,
    intros,
  };

  const outputPath = path.join(OUTPUT_DIR, "sb4-parsed.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(`\n✅ Done!`);
  console.log(`   Chapters: ${chapters.length}`);
  console.log(`   Total verses: ${chapters.reduce((sum, c) => sum + c.verses.length, 0)}`);
  console.log(`   Intro pages: ${intros.length}`);
  console.log(`   Output: ${outputPath}`);
}

main();
