#!/usr/bin/env npx ts-node
/**
 * POY (Perfection of Yoga) Ventura Parser
 *
 * Parses BBT Ventura files from /docs/poy folder and outputs JSON
 * This book has continuous text chapters (no verses like Gita)
 *
 * Usage: npx ts-node tools/parse-poy.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, "..", "docs", "poy");
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data");

// PUA Mapping for Ukrainian diacritics (same as parse-bbt.ts)
const UKRAINIAN_PUA_MAP: Record<string, string> = {
  "\uf100": "А",    // Capital A
  "\uf101": "а̄",
  "\uf102": "ī",
  "\uf121": "ī",
  "\uf123": "ӯ",
  "\uf103": "д̣",
  "\uf105": "",     // Style marker, remove
  "\uf107": "м\u0310", // Candrabindu variant
  "\uf109": "м̇",
  "\uf10d": "м\u0310", // Candrabindu (combining) - м̐, М̐, л̐, Л̐
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

// Intro file mapping for POY
const INTRO_FILE_MAP: Record<string, [string, string, number]> = {
  UKPY00DC: ["dedication", "Посвята", 1],
  UKPY00FW: ["foreword", "Передмова", 2],
  UKPY00AU: ["about-author", "Про автора", 100],
  UKPY00PG: ["pronunciation", "Як читати санскрит", 101],
  UKPY00BL: ["books", "Книги Його Божественної Милості", 102],
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

// ============= INTERFACES =============

interface Chapter {
  chapter_number: number;
  chapter_title_uk: string;
  content_uk: string;
}

interface IntroPage {
  slug: string;
  title_uk: string;
  content_uk: string;
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
    chapter_title_uk: chapterTitle || `Глава ${chapterNum}`,
    content_uk: paragraphs.join("\n\n"),
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
  console.log("POY (Perfection of Yoga) Ventura Parser\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(DOCS_DIR);
  const chapters: Chapter[] = [];
  const intros: IntroPage[] = [];

  // Parse chapter files (UKPY01XT - UKPY08XT)
  for (let i = 1; i <= 8; i++) {
    const prefix = `UKPY${String(i).padStart(2, "0")}XT`;
    const chapterFile = files.find((f) => f.startsWith(prefix) && !f.endsWith(".bak"));

    if (chapterFile) {
      console.log(`Parsing chapter ${i}: ${chapterFile}`);
      const text = readFile(path.join(DOCS_DIR, chapterFile));
      const chapter = parseChapter(text, i);

      if (chapter.content_uk) {
        chapters.push(chapter);
        console.log(`  → "${chapter.title_uk}" (${chapter.content_uk.length} chars)`);
      } else {
        console.log(`  → WARNING: No content found!`);
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
        console.log(`  → "${intro.title_uk}"`);
      }
    }
  }

  // Write output
  const output = {
    title_uk: "Досконалість йоґи",
    title_en: "The Perfection of Yoga",
    chapters,
    intros,
  };

  const outputPath = path.join(OUTPUT_DIR, "poy-parsed.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(`\n✅ Done!`);
  console.log(`   Chapters: ${chapters.length}`);
  console.log(`   Intro pages: ${intros.length}`);
  console.log(`   Output: ${outputPath}`);
}

main();
