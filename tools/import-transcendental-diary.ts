#!/usr/bin/env npx ts-node
/**
 * Import Transcendental Diary to Supabase
 *
 * Імпортує спарсені дані книги "Transcendental Diary" у базу даних Supabase.
 *
 * Передумови:
 * 1. Запустіть парсер: npx ts-node tools/parse-transcendental-diary.ts
 * 2. Переконайтесь що файл src/data/transcendental-diary-parsed.json існує
 * 3. Встановіть змінні середовища SUPABASE_URL та SUPABASE_SERVICE_KEY
 *
 * Використання:
 *   npx ts-node tools/import-transcendental-diary.ts
 *
 * Або з аргументами:
 *   npx ts-node tools/import-transcendental-diary.ts --volume 1
 *   npx ts-node tools/import-transcendental-diary.ts --dry-run
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "..", "src", "data", "transcendental-diary-parsed.json");

// ============= TYPES =============

interface Chapter {
  chapter_number: number;
  title_en: string;
  content_en: string;
  dates?: string;
}

interface IntroPage {
  slug: string;
  title_en: string;
  content_en: string;
  display_order: number;
}

interface Volume {
  volume_number: number;
  title_en: string;
  subtitle_en?: string;
  chapters: Chapter[];
  intro_pages?: IntroPage[];
}

interface BookData {
  book_slug: string;
  book_title_en: string;
  book_title_ua: string;
  author_en: string;
  author_ua: string;
  description_en?: string;
  volumes: Volume[];
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

async function findOrCreateBook(supabase: SupabaseClient, bookData: BookData): Promise<string> {
  const { data: existing } = await supabase
    .from("books")
    .select("id")
    .eq("slug", bookData.book_slug)
    .maybeSingle();

  if (existing?.id) {
    console.log(`📚 Book found: ${bookData.book_slug} (${existing.id})`);
    return existing.id;
  }

  // Create new book
  const { data: created, error } = await supabase
    .from("books")
    .insert({
      slug: bookData.book_slug,
      title_en: bookData.book_title_en,
      title_ua: bookData.book_title_ua,
      description_en: bookData.description_en || "",
      description_ua: "",
      has_cantos: true,
      author_en: bookData.author_en,
      author_ua: bookData.author_ua,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create book: ${error.message}`);
  }

  console.log(`✅ Book created: ${bookData.book_slug} (${created.id})`);
  return created.id;
}

async function findOrCreateVolume(
  supabase: SupabaseClient,
  bookId: string,
  volume: Volume
): Promise<string> {
  const { data: existing } = await supabase
    .from("cantos")
    .select("id")
    .eq("book_id", bookId)
    .eq("canto_number", volume.volume_number)
    .maybeSingle();

  if (existing?.id) {
    console.log(`  📖 Volume ${volume.volume_number} found: ${existing.id}`);
    return existing.id;
  }

  // Create new canto (volume)
  const { data: created, error } = await supabase
    .from("cantos")
    .insert({
      book_id: bookId,
      canto_number: volume.volume_number,
      title_en: volume.title_en,
      title_ua: `Том ${volume.volume_number}`,
      description_en: volume.subtitle_en || "",
      description_ua: "",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create volume ${volume.volume_number}: ${error.message}`);
  }

  console.log(`  ✅ Volume ${volume.volume_number} created: ${created.id}`);
  return created.id;
}

async function upsertChapter(
  supabase: SupabaseClient,
  cantoId: string,
  chapter: Chapter
): Promise<string> {
  // Check if chapter exists
  const { data: existing } = await supabase
    .from("chapters")
    .select("id")
    .eq("canto_id", cantoId)
    .eq("chapter_number", chapter.chapter_number)
    .maybeSingle();

  if (existing?.id) {
    // Update existing chapter
    const { error } = await supabase
      .from("chapters")
      .update({
        title_en: chapter.title_en,
        content_en: chapter.content_en,
        chapter_type: "text",
      })
      .eq("id", existing.id);

    if (error) {
      throw new Error(`Failed to update chapter ${chapter.chapter_number}: ${error.message}`);
    }

    console.log(`    🔄 Chapter ${chapter.chapter_number} updated`);
    return existing.id;
  }

  // Create new chapter
  const { data: created, error } = await supabase
    .from("chapters")
    .insert({
      canto_id: cantoId,
      chapter_number: chapter.chapter_number,
      chapter_type: "text",
      title_en: chapter.title_en,
      title_ua: `Глава ${chapter.chapter_number}`,
      content_en: chapter.content_en,
      content_ua: "",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create chapter ${chapter.chapter_number}: ${error.message}`);
  }

  console.log(`    ✅ Chapter ${chapter.chapter_number} created: "${chapter.title_en}"`);
  return created.id;
}

async function importVolume(
  supabase: SupabaseClient,
  bookId: string,
  volume: Volume,
  dryRun: boolean = false
): Promise<void> {
  console.log(`\n📖 Importing Volume ${volume.volume_number}: ${volume.title_en}`);
  console.log(`   Subtitle: ${volume.subtitle_en || "N/A"}`);
  console.log(`   Chapters: ${volume.chapters.length}`);

  if (dryRun) {
    console.log("   [DRY RUN] Skipping database operations");
    for (const chapter of volume.chapters) {
      console.log(`    📄 Would import: Chapter ${chapter.chapter_number} - "${chapter.title_en}"`);
    }
    return;
  }

  // Create or find volume (canto)
  const cantoId = await findOrCreateVolume(supabase, bookId, volume);

  // Import chapters
  for (const chapter of volume.chapters) {
    try {
      await upsertChapter(supabase, cantoId, chapter);
    } catch (error: any) {
      console.error(`    ❌ Error importing chapter ${chapter.chapter_number}: ${error.message}`);
    }
  }
}

async function importBook(
  supabase: SupabaseClient,
  bookData: BookData,
  options: { volumeNum?: number; dryRun?: boolean } = {}
): Promise<void> {
  const { volumeNum, dryRun = false } = options;

  console.log("━".repeat(60));
  console.log(`📚 Importing: ${bookData.book_title_en}`);
  console.log(`   Author: ${bookData.author_en}`);
  console.log(`   Volumes: ${bookData.volumes.length}`);
  console.log("━".repeat(60));

  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No changes will be made to the database\n");
  }

  // Create or find book
  let bookId = "[dry-run]";
  if (!dryRun) {
    bookId = await findOrCreateBook(supabase, bookData);
  }

  // Import volumes
  const volumesToImport = volumeNum
    ? bookData.volumes.filter((v) => v.volume_number === volumeNum)
    : bookData.volumes;

  if (volumesToImport.length === 0) {
    console.log(`❌ No volumes to import (requested volume: ${volumeNum})`);
    return;
  }

  for (const volume of volumesToImport) {
    await importVolume(supabase, bookId, volume, dryRun);
  }

  console.log("\n" + "━".repeat(60));
  console.log("✅ Import completed!");
  console.log(
    `   Imported: ${volumesToImport.length} volume(s), ${volumesToImport.reduce(
      (acc, v) => acc + v.chapters.length,
      0
    )} chapter(s)`
  );
}

// ============= CLI =============

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const volumeArg = args.find((a) => a.startsWith("--volume="));
  const volumeNum = volumeArg ? parseInt(volumeArg.split("=")[1], 10) : undefined;

  if (args.includes("--help")) {
    console.log(`
Import Transcendental Diary to Supabase

Usage:
  npx ts-node tools/import-transcendental-diary.ts [options]

Options:
  --help              Show this help
  --dry-run           Preview changes without modifying database
  --volume=N          Import only volume N (1-5)

Environment Variables:
  SUPABASE_URL        Supabase project URL
  SUPABASE_SERVICE_KEY Supabase service role key (for admin operations)

Examples:
  npx ts-node tools/import-transcendental-diary.ts
  npx ts-node tools/import-transcendental-diary.ts --dry-run
  npx ts-node tools/import-transcendental-diary.ts --volume=1
`);
    return;
  }

  console.log("📥 Transcendental Diary Importer\n");

  // Load parsed data
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`❌ Data file not found: ${DATA_PATH}`);
    console.error(`   Run the parser first: npx ts-node tools/parse-transcendental-diary.ts`);
    process.exit(1);
  }

  const bookData: BookData = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  console.log(`📄 Loaded data from: ${DATA_PATH}`);

  // Initialize Supabase client
  let supabase: SupabaseClient | null = null;
  if (!dryRun) {
    try {
      supabase = getSupabaseClient();
      console.log("🔌 Connected to Supabase\n");
    } catch (error: any) {
      console.error(`❌ ${error.message}`);
      console.log("   Use --dry-run to preview changes without database connection");
      process.exit(1);
    }
  }

  // Import
  await importBook(supabase as SupabaseClient, bookData, { volumeNum, dryRun });
}

main().catch(console.error);
