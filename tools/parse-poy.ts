#!/usr/bin/env npx ts-node
/**
 * POY (Perfection of Yoga) HTML Parser
 *
 * Parses HTML files from /docs/poy folder and outputs JSON
 * This book has only chapters with continuous text (no verses like Gita)
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

interface ParsedChapter {
  chapter_number: number;
  title_ua: string;
  content_ua: string;
}

interface ParsedData {
  book_slug: string;
  book_title_ua: string;
  book_title_en: string;
  chapters: ParsedChapter[];
  intros: never[]; // POY doesn't have intro pages like Gita
}

function extractChapterFromHTML(html: string, filename: string): ParsedChapter | null {
  // Extract chapter number from filename (e.g., "7.html" -> 7)
  const filenameMatch = filename.match(/^(\d+)\.html$/);
  if (!filenameMatch) {
    console.warn(`Skipping non-chapter file: ${filename}`);
    return null;
  }
  const chapter_number = parseInt(filenameMatch[1], 10);

  // Extract title from <h1 class="chapter-title">
  const titleMatch = html.match(/<h1[^>]*class="chapter-title"[^>]*>(.*?)<\/h1>/s);
  const title_ua = titleMatch
    ? titleMatch[1].trim().replace(/<[^>]+>/g, '') // Remove any inner HTML tags
    : `Глава ${chapter_number}`;

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (!bodyMatch) {
    console.warn(`No body found in ${filename}`);
    return null;
  }

  let content = bodyMatch[1];

  // Remove chapter number and title elements
  content = content.replace(/<div[^>]*class="chapter-number"[^>]*>.*?<\/div>/gs, '');
  content = content.replace(/<h1[^>]*class="chapter-title"[^>]*>.*?<\/h1>/gs, '');

  // Clean up content - normalize whitespace between elements
  content = content
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+/gm, '');

  return {
    chapter_number,
    title_ua,
    content_ua: content,
  };
}

function parseAllChapters(): ParsedData {
  const chapters: ParsedChapter[] = [];

  // Check if directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`Directory not found: ${DOCS_DIR}`);
    console.log("Please create the docs/poy directory and add HTML files.");
    return {
      book_slug: "poy",
      book_title_ua: "Досконалість йоґи",
      book_title_en: "The Perfection of Yoga",
      chapters: [],
      intros: [],
    };
  }

  // Read all HTML files
  const files = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.html'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0', 10);
      const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0', 10);
      return numA - numB;
    });

  console.log(`Found ${files.length} HTML files in ${DOCS_DIR}`);

  for (const file of files) {
    const filepath = path.join(DOCS_DIR, file);
    const html = fs.readFileSync(filepath, 'utf-8');

    const chapter = extractChapterFromHTML(html, file);
    if (chapter) {
      chapters.push(chapter);
      console.log(`  ✓ Chapter ${chapter.chapter_number}: ${chapter.title_ua}`);
    }
  }

  return {
    book_slug: "poy",
    book_title_ua: "Досконалість йоґи",
    book_title_en: "The Perfection of Yoga",
    chapters,
    intros: [],
  };
}

function main() {
  console.log("=== POY (Perfection of Yoga) Parser ===\n");

  const data = parseAllChapters();

  console.log(`\nParsed ${data.chapters.length} chapters`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output
  const outputPath = path.join(OUTPUT_DIR, "poy-parsed.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`\nOutput written to: ${outputPath}`);
}

main();
