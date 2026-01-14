#!/usr/bin/env npx tsx
/**
 * Import books from iskconpress/books GitHub repository
 * Source: https://github.com/iskconpress/books
 *
 * Usage:
 *   npx tsx scripts/import-iskconpress-books.ts
 *   npx tsx scripts/import-iskconpress-books.ts --book ssr
 *   npx tsx scripts/import-iskconpress-books.ts --dry-run
 */

import { createClient } from "@supabase/supabase-js";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/iskconpress/books/master";
const GITHUB_API_BASE = "https://api.github.com/repos/iskconpress/books/contents";
const DELAY_MS = 500;

// Book configurations with chapter counts
// NEW books to create in DB
const NEW_ISKCONPRESS_BOOKS = [
  { slug: "bbd", title_en: "Beyond Birth and Death", chapters: 5 },
  { slug: "ekc", title_en: "Elevation to Krsna Consciousness", chapters: 6 },
  { slug: "lcfl", title_en: "Life Comes From Life", chapters: 16 },
  { slug: "lob", title_en: "Light of the Bhagavata", chapters: 48 },
  { slug: "mg", title_en: "The Matchless Gift", chapters: 8 },
  { slug: "mm", title_en: "Mukunda-mala-stotra", chapters: 6 },
  { slug: "mog", title_en: "Message of Godhead", chapters: 2 },
  { slug: "nbs", title_en: "Narada-bhakti-sutra", chapters: 8 },
  { slug: "owk", title_en: "On the Way to Krsna", chapters: 5 },
  { slug: "pop", title_en: "The Path of Perfection", chapters: 10 },
  { slug: "ssr", title_en: "The Science of Self-Realization", chapters: 8 },
  { slug: "tlc", title_en: "Teachings of Lord Caitanya", chapters: 32 },
  { slug: "tqk", title_en: "Teachings of Queen Kunti", chapters: 26 },
  { slug: "ttp", title_en: "Teachings of Prahlada Maharaja", chapters: 6 },
];

// EXISTING books to upsert English content from iskconpress
const EXISTING_BOOKS_TO_UPSERT = [
  { slug: "nod", title_en: "Nectar of Devotion", chapters: 51 },
  { slug: "bs", title_en: "Brahma-samhita", chapters: 62 },
  { slug: "tlk", title_en: "Teachings of Lord Kapila", chapters: 32 },
  { slug: "kb", title_en: "Krsna Book", chapters: 90 },
  { slug: "pqpa", title_en: "Perfect Questions, Perfect Answers", chapters: 10 },
  // SB handled separately due to canto structure
];

// All books to import
const ISKCONPRESS_BOOKS = [...NEW_ISKCONPRESS_BOOKS, ...EXISTING_BOOKS_TO_UPSERT];

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchChapterFiles(bookSlug: string): Promise<string[]> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/${bookSlug}`);
    if (!response.ok) {
      console.error(`Failed to fetch chapter list for ${bookSlug}`);
      return [];
    }
    const files = await response.json();
    return files
      .filter((f: any) => f.name.endsWith(".txt"))
      .map((f: any) => f.name)
      .sort((a: string, b: string) => {
        // Sort by chapter number
        const numA = parseInt(a.replace(/[^0-9]/g, "") || "0");
        const numB = parseInt(b.replace(/[^0-9]/g, "") || "0");
        return numA - numB;
      });
  } catch (error) {
    console.error(`Error fetching chapter files for ${bookSlug}:`, error);
    return [];
  }
}

async function fetchChapterContent(bookSlug: string, filename: string): Promise<string | null> {
  try {
    const url = `${GITHUB_RAW_BASE}/${bookSlug}/${filename}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching chapter content:`, error);
    return null;
  }
}

interface ParsedChapter {
  chapter_number: number;
  title_en: string;
  content_en: string;
  description_en?: string;
}

function parseChapterContent(content: string, filename: string): ParsedChapter | null {
  // Extract chapter number from filename
  const filenameMatch = filename.match(/^(\d+[a-z]?)\.txt$/);
  let chapterNum = 0;
  if (filenameMatch) {
    // Handle cases like "0a", "0b" for intro chapters
    const num = filenameMatch[1];
    if (num.match(/^0[a-z]$/)) {
      chapterNum = 0; // Intro chapters
    } else {
      chapterNum = parseInt(num.replace(/[a-z]/g, ""));
    }
  }

  // Parse title from content
  // Format: ~~Title:Book Name Chapter Number: Chapter Title~~
  const titleMatch = content.match(/~~Title:(.+?)~~/) || content.match(/====== (.+?) ======/);
  let title_en = titleMatch ? titleMatch[1].trim() : `Chapter ${chapterNum}`;

  // Clean up title
  title_en = title_en
    .replace(/^[A-Z]+\s+\d+:\s*/, "") // Remove "SSR 1: " prefix
    .replace(/^Chapter\s+\d+:\s*/, "") // Remove "Chapter 1: " prefix
    .trim();

  // Extract description if present
  const descMatch = content.match(/\{\{description>(.+?)\}\}/s);
  const description_en = descMatch ? descMatch[1].trim() : undefined;

  // Clean content - remove wiki markup
  let content_en = content
    // Remove metadata tags
    .replace(/~~[^~]+~~/g, "")
    // Remove description tags
    .replace(/\{\{description>.+?\}\}/gs, "")
    // Convert wiki headers to markdown
    .replace(/======\s*(.+?)\s*======/g, "# $1")
    .replace(/=====\s*(.+?)\s*=====/g, "## $1")
    .replace(/====\s*(.+?)\s*====/g, "### $1")
    .replace(/===\s*(.+?)\s*===/g, "#### $1")
    // Convert wiki links to plain text or markdown
    .replace(/\[\[books:[^\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[books:[^\]]+\]\]/g, "")
    .replace(/\[\[synonyms:[^\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[synonyms:[^\]]+\]\]/g, "")
    // Convert bold/italic
    .replace(/\*\*(.+?)\*\*/g, "**$1**")
    // Convert blockquotes (> lines)
    .replace(/^>\s*(.+)$/gm, "> $1")
    // Remove page includes
    .replace(/\{\{page>[^}]+\}\}/g, "")
    // Remove horizontal rules
    .replace(/^----$/gm, "---")
    // Clean up extra whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    chapter_number: chapterNum,
    title_en,
    content_en,
    description_en,
  };
}

async function importBook(bookSlug: string, dryRun: boolean = false) {
  console.log(`\n📖 Importing book: ${bookSlug}`);

  // Get book ID
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id")
    .eq("slug", bookSlug)
    .single();

  if (bookError || !book) {
    console.error(`Book ${bookSlug} not found in database. Run migrations first.`);
    return;
  }

  const bookId = book.id;
  console.log(`  Book ID: ${bookId}`);

  // Fetch chapter files
  const chapterFiles = await fetchChapterFiles(bookSlug);
  console.log(`  Found ${chapterFiles.length} chapter files`);

  for (const filename of chapterFiles) {
    await delay(DELAY_MS);

    console.log(`  📄 Processing ${filename}...`);
    const content = await fetchChapterContent(bookSlug, filename);

    if (!content) {
      console.error(`    ❌ Failed to fetch content`);
      continue;
    }

    const parsed = parseChapterContent(content, filename);
    if (!parsed) {
      console.error(`    ❌ Failed to parse content`);
      continue;
    }

    console.log(`    Title: ${parsed.title_en}`);
    console.log(`    Chapter: ${parsed.chapter_number}`);
    console.log(`    Content length: ${parsed.content_en.length} chars`);

    if (dryRun) {
      console.log(`    [DRY RUN] Would insert chapter`);
      continue;
    }

    // Insert or update chapter
    const { error: chapterError } = await supabase.from("chapters").upsert(
      {
        book_id: bookId,
        chapter_number: parsed.chapter_number,
        title_en: parsed.title_en,
        content_en: parsed.content_en,
        summary_en: parsed.description_en,
        chapter_type: "text",
        is_published: true,
      },
      {
        onConflict: "book_id,chapter_number",
      }
    );

    if (chapterError) {
      console.error(`    ❌ Error inserting chapter:`, chapterError.message);
    } else {
      console.log(`    ✅ Chapter imported successfully`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const bookIndex = args.indexOf("--book");
  const specificBook = bookIndex !== -1 ? args[bookIndex + 1] : null;

  console.log("🚀 iskconpress Books Importer");
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);

  if (specificBook) {
    console.log(`   Importing single book: ${specificBook}`);
    await importBook(specificBook, dryRun);
  } else {
    console.log(`   Importing all ${ISKCONPRESS_BOOKS.length} books`);
    for (const book of ISKCONPRESS_BOOKS) {
      await importBook(book.slug, dryRun);
    }
  }

  console.log("\n✨ Import complete!");
}

main().catch(console.error);
