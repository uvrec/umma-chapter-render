#!/usr/bin/env npx ts-node
/**
 * ISO (Sri Isopanisad / Шрі Ішопанішада) Ventura Parser
 *
 * Parses BBT Ventura files from /docs/iso folder and outputs JSON
 * ISO has 18 mantras, each with verses structure like Gita
 * All 18 mantras are in a single "chapter 1"
 *
 * File pattern: UKIS##XT.* (UKIS01XT through UKIS18XT)
 *
 * Usage: npx ts-node tools/parse-iso.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, "..", "docs", "iso");
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
  "\uf10d": "м\u0310", // м̐ - m with candrabindu (not just combining mark!)
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

// Intro file mapping for ISO (prefix UKIS)
const INTRO_FILE_MAP: Record<string, [string, string, number]> = {
  UKIS00DC: ["dedication", "Посвята", 1],
  UKIS00FW: ["foreword", "Передмова", 2],
  UKIS00PF: ["preface", "Передмова до англійського видання", 3],
  UKIS00ID: ["introduction", "Вступ", 4],
  UKIS00IV: ["invocation", "Молитва", 5],
  UKIS00CR: ["credits", "Подяки", 6],
  UKIS00AU: ["about-author", "Про автора", 100],
  UKIS00PG: ["pronunciation", "Як читати санскрит", 101],
  UKIS00BL: ["books", "Книги Його Божественної Милості", 102],
  UKIS00GL: ["glossary", "Словничок", 103],
  UKIS00TC: ["contents", "Зміст", 104],
  UKIS00QV: ["verse-index", "Покажчик віршів", 105],
  UKIS00XS: ["summary", "Підсумок", 106],
};

const SKIP_TAGS = new Set(["rh-verso", "rh-recto", "logo", "text-rh", "special", "h1-digit-rh", "h1-digit"]);
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

function extractMantraNumber(text: string): string {
  // ISO uses "Мантра перша", "Мантра друга" etc. or just numbers
  const ordinals: [string, string][] = [
    ["ВІСІМНАДЦЯТА", "18"],
    ["СІМНАДЦЯТА", "17"],
    ["ШІСТНАДЦЯТА", "16"],
    ["П'ЯТНАДЦЯТА", "15"],
    ["ЧОТИРНАДЦЯТА", "14"],
    ["ТРИНАДЦЯТА", "13"],
    ["ДВАНАДЦЯТА", "12"],
    ["ОДИНАДЦЯТА", "11"],
    ["ДЕСЯТА", "10"],
    ["ДЕВ'ЯТА", "9"],
    ["ВОСЬМА", "8"],
    ["СЬОМА", "7"],
    ["С'ОМА", "7"],
    ["ШОСТА", "6"],
    ["П'ЯТА", "5"],
    ["ЧЕТВЕРТА", "4"],
    ["ТРЕТЯ", "3"],
    ["ДРУГА", "2"],
    ["ПЕРША", "1"],
  ];

  const upper = text.toUpperCase().replace(/ʼ/g, "'").replace(/\u2019/g, "'");
  for (const [name, num] of ordinals) {
    if (upper.includes(name)) return num;
  }

  const match = text.match(/(?:Мантра|МАНТРА)\s*(\d+)/i);
  if (match) return match[1];

  const numMatch = text.match(/(\d+)/);
  if (numMatch) return numMatch[1];

  return text.trim();
}

// ============= INTERFACES =============

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

// ============= PARSERS =============

function parseMantra(text: string, mantraNum: number): Verse {
  const lines = text.split("\n");
  const verse: Verse = { verse_number: String(mantraNum) };
  let currentTag: string | null = null;
  let currentContent: string[] = [];
  let pendingListDigit: string = "";
  let inList: boolean = false;

  function closeListIfNeeded() {
    if (inList && verse.commentary_ua) {
      verse.commentary_ua = verse.commentary_ua + "\n</ol>";
      inList = false;
    }
  }

  function flushBlock() {
    if (!currentTag || SKIP_TAGS.has(currentTag) || DEVANAGARI_TAGS.has(currentTag)) return;
    const content = currentContent.join(" ").trim();
    if (!content) return;

    // Close list before non-list content
    const isListTag = currentTag === "li-digit" || currentTag === "li-digit-0" || currentTag === "li-body";
    if (!isListTag && inList) {
      closeListIfNeeded();
    }

    if (["h1", "h1-fb", "h1-fb1", "h2-number"].includes(currentTag)) {
      const extracted = extractMantraNumber(content);
      if (extracted) verse.verse_number = extracted;
    } else if (["v-uvaca", "v-anustubh", "v-tristubh", "p-tristubh"].includes(currentTag)) {
      const translit = processTransliteration(content);
      verse.transliteration_ua = verse.transliteration_ua
        ? verse.transliteration_ua + "\n" + translit
        : translit;
    } else if (currentTag === "eqs") {
      const synonyms = processSynonyms(content);
      verse.synonyms_ua = verse.synonyms_ua ? verse.synonyms_ua + " " + synonyms : synonyms;
    } else if (currentTag === "translation") {
      verse.translation_ua = processProse(content, false);
    } else if (currentTag === "p-indent") {
      const para = processFirstParagraph(content);
      if (para) {
        verse.commentary_ua = verse.commentary_ua ? verse.commentary_ua + "\n\n" + para : para;
      }
    } else if (["p", "p0", "p1"].includes(currentTag)) {
      const para = processProse(content, true);
      if (para) {
        const wrapped = `<p class="purport">${para}</p>`;
        verse.commentary_ua = verse.commentary_ua ? verse.commentary_ua + "\n\n" + wrapped : wrapped;
      }
    } else if (["ql", "q", "q-p"].includes(currentTag)) {
      const quote = processQuote(content);
      if (quote) {
        const blockquote = `<blockquote class="verse-quote"><p>${quote}</p></blockquote>`;
        verse.commentary_ua = verse.commentary_ua ? verse.commentary_ua + "\n\n" + blockquote : blockquote;
      }
    } else if (["p-anustubh", "p-uvaca", "p-gayatri", "p-indravajra"].includes(currentTag)) {
      const translit = processTransliteration(content);
      if (translit) {
        const blockquote = `<blockquote class="verse-quote verse-translit">${translit}</blockquote>`;
        verse.commentary_ua = verse.commentary_ua ? verse.commentary_ua + "\n\n" + blockquote : blockquote;
      }
    } else if (currentTag === "p-outro") {
      const outro = `<p class="purport-outro"><em>${processProse(content, true)}</em></p>`;
      verse.commentary_ua = verse.commentary_ua ? verse.commentary_ua + "\n\n" + outro : outro;
    } else if (currentTag === "li-digit" || currentTag === "li-digit-0") {
      // Close previous list if not in one, then store digit for next li-body
      pendingListDigit = content.replace(/<[^>]+>/g, "").replace(/[.\s]/g, "").trim();
    } else if (currentTag === "li-body") {
      const body = processProse(content, true);
      if (body) {
        const digit = pendingListDigit || "";
        const li = `<li value="${digit}">${body}</li>`;
        if (!inList) {
          // Start new list
          verse.commentary_ua = verse.commentary_ua
            ? verse.commentary_ua + `\n\n<ol class="purport-list">\n${li}`
            : `<ol class="purport-list">\n${li}`;
          inList = true;
        } else {
          // Continue existing list
          verse.commentary_ua = verse.commentary_ua + `\n${li}`;
        }
        pendingListDigit = "";
      }
    }
    // Note: list closing is handled at the start of flushBlock for non-list tags
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
  closeListIfNeeded();
  return verse;
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
  return { slug, title_ua: title, content_ua: paragraphs.join("\n\n"), display_order: displayOrder };
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
  console.log("ISO (Sri Isopanisad / Шрі Ішопанішада) Ventura Parser\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!fs.existsSync(DOCS_DIR)) {
    console.log(`Directory ${DOCS_DIR} not found. Creating empty output.`);
    const output = {
      book_slug: "iso",
      book_title_ua: "Шрі Ішопанішада",
      book_title_en: "Sri Isopanisad",
      chapters: [],
      intros: [],
    };
    const outputPath = path.join(OUTPUT_DIR, "iso-parsed.json");
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
    console.log(`Created empty output: ${outputPath}`);
    return;
  }

  const files = fs.readdirSync(DOCS_DIR);
  const verses: Verse[] = [];
  const intros: IntroPage[] = [];

  // ISO has 18 mantras, all in one chapter
  // File pattern: UKIS01XT through UKIS18XT
  for (let i = 1; i <= 18; i++) {
    const prefix = `UKIS${String(i).padStart(2, "0")}XT`;
    const mantraFile = files.find((f) => f.startsWith(prefix) && !f.endsWith(".bak"));

    if (mantraFile) {
      console.log(`Parsing mantra ${i}: ${mantraFile}`);
      const text = readFile(path.join(DOCS_DIR, mantraFile));
      const verse = parseMantra(text, i);
      verses.push(verse);
      console.log(`  → Mantra ${verse.verse_number}`);
    } else {
      console.log(`Mantra ${i}: NOT FOUND`);
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
        console.log(`  → "${intro.title_ua}"`);
      }
    }
  }

  // Create single chapter with all mantras
  const chapter: Chapter = {
    chapter_number: 1,
    title_ua: "Шрі Ішопанішада",
    verses,
  };

  // Write output
  const output = {
    book_slug: "iso",
    book_title_ua: "Шрі Ішопанішада",
    book_title_en: "Sri Isopanisad",
    chapters: verses.length > 0 ? [chapter] : [],
    intros,
  };

  const outputPath = path.join(OUTPUT_DIR, "iso-parsed.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(`\n✅ Done!`);
  console.log(`   Mantras/Verses: ${verses.length}`);
  console.log(`   Intro pages: ${intros.length}`);
  console.log(`   Output: ${outputPath}`);
}

main();
