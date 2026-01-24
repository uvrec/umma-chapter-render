#!/usr/bin/env npx ts-node
/**
 * SB (Srimad-Bhagavatam) Ventura Parser - Local Script
 *
 * Parses SB Ventura files from /docs/SB/{canto} folder and outputs JSON
 *
 * Usage: npx ts-node tools/parse-sb.ts [canto_number]
 * Example: npx ts-node tools/parse-sb.ts 4
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DOCS_DIR = path.join(__dirname, "..", "docs", "bbt", "SB");
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data");

// PUA Mapping for Ukrainian diacritics (same as BBT)
const UKRAINIAN_PUA_MAP: Record<string, string> = {
  "\uf100": "А",
  "\uf101": "а̄",
  "\uf102": "ī",
  "\uf121": "ī",
  "\uf123": "ӯ",
  "\uf103": "д̣",
  "\uf105": "",
  "\uf109": "м̇",
  "\uf107": "м\u0310",
  "\uf10d": "м\u0310",
  "\uf10f": "н̇",
  "\uf111": "н̣",
  "\uf113": "н̃",
  "\uf115": "р̣",
  "\uf117": "р̣",
  "\uf119": "т̣",
  "\uf11b": "х̣",
  "\uf11c": "Ш́",
  "\uf11d": "ш́",
  "\uf11f": "ш̣",
  "\uf125": "р̣̄",
  "\uf127": "л̣",
  "\uf129": "л̣̄",
};

// Intro file mapping for SB (UKS{canto}00 pattern)
function getIntroFileMap(cantoNum: number): Record<string, [string, string, number]> {
  const prefix = `UKS${cantoNum}00`;
  return {
    [`${prefix}DC`]: ["dedication", "Посвята", 1],
    [`${prefix}FW`]: ["foreword", "Передмова", 2],
    [`${prefix}PF`]: ["preface", "Передмова до англійського видання", 3],
    [`${prefix}PG`]: ["pronunciation", "Як читати санскрит", 4],
    [`${prefix}ID`]: ["introduction", "Вступ", 5],
    [`${prefix}TC`]: ["toc", "Зміст", 100],
    [`${prefix}GL`]: ["glossary", "Словничок", 101],
    [`${prefix}QV`]: ["verse-index", "Покажчик віршів", 102],
    [`${prefix}RF`]: ["references", "Список літератури", 103],
    [`${prefix}AU`]: ["about-author", "Про автора", 104],
    [`${prefix}BL`]: ["books", "Книги", 105],
    [`${prefix}XI`]: ["index", "Покажчик", 106],
    [`${prefix}XS`]: ["subjects", "Тематичний покажчик", 107],
  };
}

// Ukrainian ordinals for chapter numbers
const ORDINALS: [string, number][] = [
  ["ТРИДЦЯТЬ ПЕРША", 31],
  ["ТРИДЦЯТА", 30],
  ["ДВАДЦЯТЬ ДЕВ'ЯТА", 29],
  ["ДВАДЦЯТЬ ВОСЬМА", 28],
  ["ДВАДЦЯТЬ СЬОМА", 27],
  ["ДВАДЦЯТЬ С'ОМА", 27],
  ["ДВАДЦЯТЬ ШОСТА", 26],
  ["ДВАДЦЯТЬ П'ЯТА", 25],
  ["ДВАДЦЯТЬ ЧЕТВЕРТА", 24],
  ["ДВАДЦЯТЬ ТРЕТЯ", 23],
  ["ДВАДЦЯТЬ ДРУГА", 22],
  ["ДВАДЦЯТЬ ПЕРША", 21],
  ["ДВАДЦЯТА", 20],
  ["ДЕВ'ЯТНАДЦЯТА", 19],
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
// d-uvaca etc are speaker tags in devanagari font - skip them
// devanagari tag contains the actual sanskrit verse text - we parse it separately
const DEVANAGARI_SPEAKER_TAGS = new Set(["d-uvaca", "d-anustubh", "d-tristubh"]);

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
  const match = text.match(/(?:Вірш[иі]?|ВІРШ[ИІ]?)\s*(\d+(?:\s*[-–—]\s*\d+)?)/i);
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
  sanskrit?: string;
  transliteration_uk?: string;
  synonyms_uk?: string;
  translation_uk?: string;
  commentary_uk?: string;
}

interface Chapter {
  chapter_number: number;
  title_uk: string;
  verses: Verse[];
}

interface IntroPage {
  slug: string;
  title_uk: string;
  content_uk: string;
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
    if (!currentTag || SKIP_TAGS.has(currentTag) || DEVANAGARI_SPEAKER_TAGS.has(currentTag)) return;
    const content = currentContent.join(" ").trim();
    if (!content) return;

    if (currentTag === "h1-number") {
      chapterNumber = extractChapterNumber(content);
    } else if (currentTag === "h1") {
      // Replace line breaks with spaces for chapter title
      chapterTitle = processInlineTags(content).replace(/\s+/g, " ").trim();
    } else if (["h2-number", "h2-number-2", "ch"].includes(currentTag)) {
      if (currentVerse) verses.push(currentVerse);
      currentVerse = { verse_number: extractVerseNumber(content) };
    } else if (currentTag === "devanagari") {
      // Sanskrit verse text in devanagari encoding
      if (currentVerse) {
        // Clean up the content: remove line break markers and tags
        let sanskrit = content
          .replace(/<\/?R>/g, "\n")
          .replace(/<[^>]+>/g, "")
          .replace(/@\w+\s*=?\s*/g, "") // Remove any @tag = patterns
          .split("\n")
          .map(line => line.trim())
          .filter(line => line && !line.startsWith("@"))
          .join("\n");
        if (sanskrit) {
          currentVerse.sanskrit = currentVerse.sanskrit
            ? currentVerse.sanskrit + "\n" + sanskrit
            : sanskrit;
        }
      }
    } else if (["v-uvaca", "v-anustubh", "v-tristubh"].includes(currentTag)) {
      if (currentVerse) {
        const translit = processTransliteration(content);
        currentVerse.transliteration_uk = currentVerse.transliteration_uk
          ? currentVerse.transliteration_uk + "\n" + translit
          : translit;
      }
    } else if (currentTag === "eqs") {
      if (currentVerse) {
        const synonyms = processSynonyms(content);
        currentVerse.synonyms_uk = currentVerse.synonyms_uk ? currentVerse.synonyms_uk + " " + synonyms : synonyms;
      }
    } else if (currentTag === "translation" || currentTag === "translation2") {
      if (currentVerse) {
        const trans = processProse(content, false);
        currentVerse.translation_uk = currentVerse.translation_uk
          ? currentVerse.translation_uk + "\n\n" + trans
          : trans;
      }
    } else if (currentTag === "p-indent") {
      if (currentVerse) {
        const para = processFirstParagraph(content);
        if (para) {
          currentVerse.commentary_uk = currentVerse.commentary_uk ? currentVerse.commentary_uk + "\n\n" + para : para;
        }
      }
    } else if (["p", "p0", "p1"].includes(currentTag)) {
      if (currentVerse) {
        const para = processProse(content, true);
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
    } else if (["p-anustubh", "p-uvaca", "p-tristubh", "p-gayatri", "p-indravajra", "p-sakkari"].includes(currentTag)) {
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
  return { chapter_number: chapterNumber, title_uk: chapterTitle, verses };
}

function parseIntroPage(text: string, filePrefix: string, introMap: Record<string, [string, string, number]>): IntroPage | null {
  const mapping = introMap[filePrefix];
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

    if (["h1-fb", "h1", "h1-pg", "h1-rv", "h1-bl", "h1-ds", "h1-tc", "h1-gl"].includes(currentTag)) {
      title = processProse(content, false).split(/\s+/).join(" ");
    } else if (["h2", "h2-gl", "h2-rv", "h2-tc"].includes(currentTag)) {
      const sub = processProse(content, true);
      if (sub) paragraphs.push(`<strong>${sub}</strong>`);
    } else if (["p0", "p", "p1", "p-indent", "p-gl", "p-au", "p-rv", "p-bl", "p-fw", "p-tc"].includes(currentTag)) {
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
  return { slug, title_uk: title, content_uk: paragraphs.join("\n\n"), display_order: displayOrder };
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
  const args = process.argv.slice(2);
  const cantoNum = args[0] ? parseInt(args[0]) : 4;

  console.log(`SB Canto ${cantoNum} Ventura Parser\n`);

  const docsDir = path.join(BASE_DOCS_DIR, String(cantoNum));

  if (!fs.existsSync(docsDir)) {
    console.error(`❌ Directory not found: ${docsDir}`);
    console.log(`Available cantos:`);
    if (fs.existsSync(BASE_DOCS_DIR)) {
      const available = fs.readdirSync(BASE_DOCS_DIR).filter(f =>
        fs.statSync(path.join(BASE_DOCS_DIR, f)).isDirectory()
      );
      available.forEach(c => console.log(`  - ${c}`));
    }
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(docsDir);
  const chapters: Chapter[] = [];
  const intros: IntroPage[] = [];

  // Find all chapter files (UKS4XXXT pattern)
  const chapterFiles = files
    .filter(f => f.match(new RegExp(`^UKS${cantoNum}\\d{2}XT\\.H\\d+$`)) && !f.endsWith(".bak"))
    .sort();

  console.log(`Found ${chapterFiles.length} chapter files`);

  for (const chapterFile of chapterFiles) {
    // Extract chapter number from filename (e.g., UKS420XT.H18 -> 20)
    const match = chapterFile.match(new RegExp(`^UKS${cantoNum}(\\d{2})XT`));
    if (!match) continue;

    const chNum = parseInt(match[1]);
    console.log(`Parsing chapter ${chNum}: ${chapterFile}`);

    const text = readFile(path.join(docsDir, chapterFile));
    const chapter = parseVentura(text);

    // Override chapter number from filename if parsing failed
    if (chapter.chapter_number === 0) {
      chapter.chapter_number = chNum;
    }

    if (chapter.verses.length > 0) {
      chapters.push(chapter);
      console.log(`  → ${chapter.verses.length} verses, title: "${chapter.title_uk}"`);
    } else {
      console.log(`  → WARNING: No verses found!`);
    }
  }

  // Sort chapters by number
  chapters.sort((a, b) => a.chapter_number - b.chapter_number);

  // Parse intro files
  const introMap = getIntroFileMap(cantoNum);
  for (const [prefix] of Object.entries(introMap)) {
    const introFile = files.find(f => f.startsWith(prefix) && !f.endsWith(".bak"));

    if (introFile) {
      console.log(`Parsing intro: ${introFile}`);
      const text = readFile(path.join(docsDir, introFile));
      const intro = parseIntroPage(text, prefix, introMap);

      if (intro) {
        intros.push(intro);
        console.log(`  → "${intro.title_uk}"`);
      }
    }
  }

  // Write output
  const output = { canto: cantoNum, chapters, intros };
  const outputPath = path.join(OUTPUT_DIR, `sb-canto${cantoNum}-parsed.json`);
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(`\n✅ Done!`);
  console.log(`   Canto: ${cantoNum}`);
  console.log(`   Chapters: ${chapters.length}`);
  console.log(`   Total verses: ${chapters.reduce((sum, c) => sum + c.verses.length, 0)}`);
  console.log(`   Intro pages: ${intros.length}`);
  console.log(`   Output: ${outputPath}`);
}

main();
