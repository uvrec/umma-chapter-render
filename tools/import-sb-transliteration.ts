#!/usr/bin/env npx ts-node
/**
 * Import SB Transliteration to Supabase
 *
 * Імпортує транслітерації з JSON файлів у базу даних Supabase.
 *
 * Використання:
 *   npx ts-node tools/import-sb-transliteration.ts
 *   npx ts-node tools/import-sb-transliteration.ts --dry-run
 *   npx ts-node tools/import-sb-transliteration.ts --chapter 2
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============= TYPES =============

interface TransliterationVerse {
  verse_number: string;
  transliteration_en: string;
  transliteration_ua: string;
  source_url_vedabase?: string;
}

interface TransliterationFile {
  book_slug: string;
  canto: number;
  chapter: number;
  verses: TransliterationVerse[];
}

// ============= SUPABASE =============

function getSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables."
    );
  }

  return createClient(url, key);
}

// ============= IMPORT FUNCTIONS =============

async function findChapterId(
  supabase: SupabaseClient,
  bookSlug: string,
  cantoNumber: number,
  chapterNumber: number
): Promise<string | null> {
  // First, find the book
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id")
    .eq("slug", bookSlug)
    .single();

  if (bookError || !book) {
    console.error(`Book not found: ${bookSlug}`, bookError);
    return null;
  }

  // Then find the canto
  const { data: canto, error: cantoError } = await supabase
    .from("cantos")
    .select("id")
    .eq("book_id", book.id)
    .eq("canto_number", cantoNumber)
    .single();

  if (cantoError || !canto) {
    console.error(`Canto not found: ${cantoNumber}`, cantoError);
    return null;
  }

  // Finally, find the chapter
  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("id")
    .eq("canto_id", canto.id)
    .eq("chapter_number", chapterNumber)
    .single();

  if (chapterError || !chapter) {
    console.error(`Chapter not found: ${chapterNumber}`, chapterError);
    return null;
  }

  return chapter.id;
}

async function updateVerseTransliteration(
  supabase: SupabaseClient,
  chapterId: string,
  verseNumber: string,
  transliterationEn: string,
  transliterationUa: string,
  dryRun: boolean
): Promise<boolean> {
  if (dryRun) {
    console.log(`  [DRY RUN] Would update verse ${verseNumber}`);
    return true;
  }

  const { error } = await supabase
    .from("verses")
    .update({
      transliteration_en: transliterationEn,
      transliteration_ua: transliterationUa,
    })
    .eq("chapter_id", chapterId)
    .eq("verse_number", verseNumber);

  if (error) {
    console.error(`  Error updating verse ${verseNumber}:`, error.message);
    return false;
  }

  return true;
}

async function importChapterTransliteration(
  supabase: SupabaseClient,
  data: TransliterationFile,
  dryRun: boolean
): Promise<{ success: number; failed: number }> {
  console.log(`\nImporting: ${data.book_slug} Canto ${data.canto} Chapter ${data.chapter}`);
  console.log(`  Verses: ${data.verses.length}`);

  const chapterId = await findChapterId(
    supabase,
    data.book_slug,
    data.canto,
    data.chapter
  );

  if (!chapterId) {
    console.error(`  Failed to find chapter in database`);
    return { success: 0, failed: data.verses.length };
  }

  console.log(`  Chapter ID: ${chapterId}`);

  let success = 0;
  let failed = 0;

  for (const verse of data.verses) {
    const updated = await updateVerseTransliteration(
      supabase,
      chapterId,
      verse.verse_number,
      verse.transliteration_en,
      verse.transliteration_ua,
      dryRun
    );

    if (updated) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(`  Done: ${success} updated, ${failed} failed`);
  return { success, failed };
}

// ============= MAIN =============

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const chapterArg = args.find((a) => a.startsWith("--chapter="));
  const specificChapter = chapterArg ? parseInt(chapterArg.split("=")[1], 10) : null;

  console.log("=".repeat(60));
  console.log("SB Transliteration Import");
  console.log("=".repeat(60));
  if (dryRun) {
    console.log("MODE: DRY RUN (no changes will be made)");
  }
  if (specificChapter) {
    console.log(`FILTER: Only chapter ${specificChapter}`);
  }

  // Find all JSON files
  const rootDir = path.join(__dirname, "..");
  const files = fs.readdirSync(rootDir).filter((f) => f.match(/^sb_1_\d+_transliteration\.json$/));

  if (files.length === 0) {
    console.error("No transliteration JSON files found in project root");
    process.exit(1);
  }

  console.log(`\nFound ${files.length} transliteration files`);

  // Filter by chapter if specified
  const filteredFiles = specificChapter
    ? files.filter((f) => f === `sb_1_${specificChapter}_transliteration.json`)
    : files;

  if (filteredFiles.length === 0) {
    console.error(`No file found for chapter ${specificChapter}`);
    process.exit(1);
  }

  const supabase = getSupabaseClient();

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const file of filteredFiles.sort()) {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const data: TransliterationFile = JSON.parse(content);

    const result = await importChapterTransliteration(supabase, data, dryRun);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total verses updated: ${totalSuccess}`);
  console.log(`Total failures: ${totalFailed}`);

  if (dryRun) {
    console.log("\nThis was a DRY RUN. No changes were made.");
    console.log("Run without --dry-run to apply changes.");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
