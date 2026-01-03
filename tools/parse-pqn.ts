#!/usr/bin/env npx ts-node
/**
 * PQN (Perfect Questions, Perfect Answers / Досконалі питання, досконалі відповіді) Ventura Parser
 *
 * Parses BBT Ventura files from /docs/pqpa folder and outputs JSON
 * This book has continuous text chapters (no verses like Gita)
 *
 * File pattern: UKPQ##XT.*
 *
 * Usage: npx ts-node tools/parse-pqn.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, "..", "docs", "pqpa");
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

// Intro file mapping for PQN (both UKPQ00 and UK0000 prefixes)
const INTRO_FILE_MAP: Record<string, [string, string, number]> = {
  UKPQ00DC: ["dedication", "Посвята", 1],
  UKPQ00FW: ["foreword", "Передмова", 2],
  UKPQ00PF: ["preface", "Передмова до англійського видання", 3],
  UKPQ00ID: ["introduction", "Вступ", 4],
  UKPQ00CW: ["copyright", "Видавнича інформація", 5],
  UKPQ00CR: ["credits", "Подяки", 6],
  UK0000AU: ["about-author", "Про автора", 100],
  UK0000PG: ["pronunciation", "Як читати санскрит", 101],
  UK0000BL: ["books", "Книги Його Божественної Милості", 102],
  UKPQ00GL: ["glossary", "Словничок", 103],
  UKPQ00TC: ["contents", "Зміст", 104],
};

const SKIP_TAGS = new Set(["rh-verso", "rh-recto", "logo", "text-rh", "special", "h1-digit-rh", "h1-digit"]);

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

function processSpeech(text: string): string {
  let result = processLineContinuations(text);
  result = result.split("\n").join(" ");

  // First, clean up <N> tags in speaker names (non-breaking space markers)
  // Also handle <N|> variant
  result = result.replace(/<N\|?>/g, " ");

  // Process speaker names - various formats:
  // <F1><B>Боб:<D><F> - format 1
  // <B><F1>Шріла Прабгупада:<F><D> - format 2
  // The name may include spaces
  // Match everything up to colon, then the closing tags

  // Format: <F1><B>Name:<D><F> or <F1><B>Name:<F><D>
  result = result.replace(/<F1><B>([^<]+):<\/?(D|F)><\/?(F|D)?>/g, '<strong class="speaker">$1:</strong> ');

  // Format: <B><F1>Name:<F><D> or <B><F1>Name:<D><F>
  result = result.replace(/<B><F1>([^<]+):<\/?(F|D)><\/?(D|F)?>/g, '<strong class="speaker">$1:</strong> ');

  // Format without colon (for mid-sentence speaker refs): <B><F1>Name<F><D>
  result = result.replace(/<B><F1>([^<:]+)<\/?(F|D)><\/?(D|F)?>/g, '<strong>$1</strong>');

  // Clean up any remaining formatting tags
  result = processInlineTags(result, true);
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

// ============= INTERFACES =============

interface Chapter {
  chapter_number: number;
  title_ua: string;
  content_ua: string;
}

interface IntroPage {
  slug: string;
  title_ua: string;
  content_ua: string;
  display_order: number;
}

// ============= PARSERS =============

function parseChapter(text: string, chapterNum: number): Chapter {
  const lines = text.split("\n");
  let chapterTitle = "";
  const paragraphs: string[] = [];
  let currentTag: string | null = null;
  let currentContent: string[] = [];
  let isFirstParagraph = true;

  function flushBlock() {
    if (!currentTag || SKIP_TAGS.has(currentTag)) return;
    const content = currentContent.join(" ").trim();
    if (!content) return;

    if (currentTag === "h1") {
      chapterTitle = processProse(content, false).replace(/\n/g, " ");
    } else if (currentTag === "h2") {
      // Subheading like date
      const sub = processProse(content, true);
      if (sub) paragraphs.push(`<p class="chapter-date"><em>${sub}</em></p>`);
    } else if (["speech0", "speech"].includes(currentTag)) {
      // Dialogue content - main content of PQN book
      const para = processSpeech(content);
      if (para) {
        if (isFirstParagraph && currentTag === "speech0") {
          paragraphs.push(`<p class="speech first">${para}</p>`);
          isFirstParagraph = false;
        } else {
          paragraphs.push(`<p class="speech">${para}</p>`);
        }
      }
    } else if (["p0", "p-indent"].includes(currentTag)) {
      if (isFirstParagraph) {
        paragraphs.push(processFirstParagraph(content));
        isFirstParagraph = false;
      } else {
        const para = processProse(content, true);
        if (para) paragraphs.push(`<p class="purport">${para}</p>`);
      }
    } else if (["p", "p1"].includes(currentTag)) {
      const para = processProse(content, true);
      if (para) paragraphs.push(`<p class="purport">${para}</p>`);
    } else if (["p-anustubh", "p-uvaca", "p-tristubh", "p-gayatri", "p-indravajra", "p-sakkari"].includes(currentTag)) {
      const translit = processTransliteration(content);
      if (translit) {
        const lines = translit.split("\n").map(l => `<span class="line">${l}</span>`).join("\n");
        paragraphs.push(`<div class="verse-quote">${lines}</div>`);
      }
    } else if (["ql", "q", "q-p", "q1"].includes(currentTag)) {
      const quote = processQuote(content);
      if (quote) paragraphs.push(`<blockquote class="quote"><p>${quote}</p></blockquote>`);
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

  return {
    chapter_number: chapterNum,
    title_ua: chapterTitle || `Глава ${chapterNum}`,
    content_ua: paragraphs.join("\n\n"),
  };
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
  console.log("PQN (Perfect Questions, Perfect Answers / Досконалі питання, досконалі відповіді) Ventura Parser\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!fs.existsSync(DOCS_DIR)) {
    console.log(`Directory ${DOCS_DIR} not found. Creating empty output.`);
    const output = {
      book_slug: "pqn",
      book_title_ua: "Досконалі питання, досконалі відповіді",
      book_title_en: "Perfect Questions, Perfect Answers",
      chapters: [],
      intros: [],
    };
    const outputPath = path.join(OUTPUT_DIR, "pqn-parsed.json");
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
    console.log(`Created empty output: ${outputPath}`);
    return;
  }

  const files = fs.readdirSync(DOCS_DIR);
  const chapters: Chapter[] = [];
  const intros: IntroPage[] = [];

  // PQN has multiple chapters (estimate ~10 based on similar books)
  // File pattern: UKPQ01XT through UKPQ10XT (or more)
  for (let i = 1; i <= 20; i++) {
    const prefix = `UKPQ${String(i).padStart(2, "0")}XT`;
    const chapterFile = files.find((f) => f.startsWith(prefix) && !f.endsWith(".bak"));

    if (chapterFile) {
      console.log(`Parsing chapter ${i}: ${chapterFile}`);
      const text = readFile(path.join(DOCS_DIR, chapterFile));
      const chapter = parseChapter(text, i);

      if (chapter.content_ua) {
        chapters.push(chapter);
        console.log(`  → "${chapter.title_ua}" (${chapter.content_ua.length} chars)`);
      } else {
        console.log(`  → WARNING: No content found!`);
      }
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

  // Write output
  const output = {
    book_slug: "pqn",
    book_title_ua: "Досконалі питання, досконалі відповіді",
    book_title_en: "Perfect Questions, Perfect Answers",
    chapters,
    intros,
  };

  const outputPath = path.join(OUTPUT_DIR, "pqn-parsed.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(`\n✅ Done!`);
  console.log(`   Chapters: ${chapters.length}`);
  console.log(`   Intro pages: ${intros.length}`);
  console.log(`   Output: ${outputPath}`);
}

main();
