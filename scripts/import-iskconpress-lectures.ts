#!/usr/bin/env npx tsx
/**
 * Import lectures from iskconpress/spoken GitHub repository
 * Source: https://github.com/iskconpress/spoken
 *
 * Usage:
 *   npx tsx scripts/import-iskconpress-lectures.ts
 *   npx tsx scripts/import-iskconpress-lectures.ts --limit 100
 *   npx tsx scripts/import-iskconpress-lectures.ts --dry-run
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load .env
const envContent = readFileSync(".env", "utf-8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (match) process.env[match[1]] = match[2];
}

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/iskconpress/spoken/master";
const GITHUB_API_BASE = "https://api.github.com/repos/iskconpress/spoken/contents";
const DELAY_MS = 300;

// Lecture type mapping
const LECTURE_TYPES: Record<string, string> = {
  "bg": "Bhagavad-gita",
  "sb": "Srimad-Bhagavatam",
  "cc": "Sri Caitanya-caritamrta",
  "nod": "Nectar of Devotion",
  "iso": "Sri Isopanisad",
  "conv": "Conversation",
  "rc": "Room Conversation",
  "mw": "Morning Walk",
  "int": "Interview",
  "ini": "Initiation",
  "arr": "Arrival",
  "dep": "Departure",
  "fest": "Festival",
  "lec": "Lecture",
  "pu": "Lecture",
};

// Location mapping
const LOCATIONS: Record<string, string> = {
  "ny": "New York",
  "la": "Los Angeles",
  "sf": "San Francisco",
  "lon": "London",
  "par": "Paris",
  "bom": "Bombay",
  "mum": "Mumbai",
  "cal": "Calcutta",
  "kol": "Kolkata",
  "vri": "Vrindavan",
  "vrn": "Vrindavan",
  "may": "Mayapur",
  "del": "Delhi",
  "hon": "Honolulu",
  "tok": "Tokyo",
  "mel": "Melbourne",
  "syd": "Sydney",
  "mon": "Montreal",
  "tor": "Toronto",
  "bos": "Boston",
  "chi": "Chicago",
  "det": "Detroit",
  "sea": "Seattle",
  "dal": "Dallas",
  "atl": "Atlanta",
  "hyd": "Hyderabad",
  "gor": "Gorakhpur",
  "aha": "Ahmedabad",
  "jai": "Jaipur",
  "nai": "Nairobi",
  "joh": "Johannesburg",
};

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLectureFiles(): Promise<string[]> {
  const files: string[] = [];
  let page = 1;

  // GitHub API returns max 1000 items, so we fetch in pages if needed
  while (true) {
    const response = await fetch(`${GITHUB_API_BASE}?per_page=100&page=${page}`);
    if (!response.ok) break;

    const items = await response.json();
    if (!Array.isArray(items) || items.length === 0) break;

    for (const item of items) {
      if (item.name.endsWith(".txt")) {
        files.push(item.name);
      }
    }

    if (items.length < 100) break;
    page++;
    await delay(200);
  }

  return files.sort();
}

async function fetchLectureContent(filename: string): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_RAW_BASE}/${filename}`);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

interface ParsedLecture {
  slug: string;
  title_en: string;
  lecture_date: string;
  location_en: string;
  lecture_type: string;
  audio_url?: string;
  book_slug?: string;
  verse_number?: string;
  content_en: string;
}

function parseLectureContent(content: string, filename: string): ParsedLecture | null {
  // Extract slug from filename (remove .txt)
  const slug = filename.replace(".txt", "");

  // Parse title
  const titleMatch = content.match(/~~Title:\s*(.+?)~~/);
  const title_en = titleMatch ? titleMatch[1].trim() : slug;

  // Parse date from dataentry
  const dateMatch = content.match(/listdate_hidden\s*:\s*(\d{4}-\d{2}-\d{2})/);
  let lecture_date = "1970-01-01";
  if (dateMatch) {
    lecture_date = dateMatch[1];
  } else {
    // Try to parse from filename: YYMMDD...
    const fnDateMatch = filename.match(/^(\d{2})(\d{2})(\d{2})/);
    if (fnDateMatch) {
      const year = parseInt(fnDateMatch[1]) > 50 ? `19${fnDateMatch[1]}` : `20${fnDateMatch[1]}`;
      lecture_date = `${year}-${fnDateMatch[2]}-${fnDateMatch[3]}`;
    }
  }

  // Parse location
  const placeMatch = content.match(/Place_spoken\s*:\s*(.+)/);
  let location_en = placeMatch ? placeMatch[1].trim() : "Unknown";

  // Also try from filename extension
  const locMatch = filename.match(/\.([a-z]+)\.txt$/);
  if (locMatch && LOCATIONS[locMatch[1]]) {
    location_en = LOCATIONS[locMatch[1]];
  }

  // Parse type
  const typeMatch = content.match(/Type_spoken\s*:\s*(.+)/);
  let lecture_type = typeMatch ? typeMatch[1].trim() : "Lecture";

  // Map to enum values
  const typeKey = Object.keys(LECTURE_TYPES).find(
    key => lecture_type.toLowerCase().includes(key) || filename.includes(key)
  );
  if (typeKey) {
    lecture_type = LECTURE_TYPES[typeKey];
  }

  // Parse audio URL
  const audioMatch = content.match(/\{\{(https:\/\/[^|]+\.mp3)/);
  const audio_url = audioMatch ? audioMatch[1] : undefined;

  // Parse book reference
  let book_slug: string | undefined;
  let verse_number: string | undefined;

  if (filename.includes("bg")) book_slug = "bg";
  else if (filename.includes("sb")) book_slug = "sb";
  else if (filename.includes("cc")) book_slug = "cc";
  else if (filename.includes("nod")) book_slug = "nod";
  else if (filename.includes("iso")) book_slug = "iso";

  // Extract verse number from title if present
  const verseMatch = title_en.match(/(\d+\.\d+(?:\.\d+)?(?:-\d+)?)/);
  if (verseMatch) {
    verse_number = verseMatch[1];
  }

  // Extract main content (remove metadata)
  const content_en = content
    .replace(/~~[^~]+~~/g, "")
    .replace(/----\s*dataentry[^-]+----/gs, "")
    .replace(/<audio>[^<]*<\/audio>/g, "")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/======\s*(.+?)\s*======/g, "# $1")
    .replace(/\[\[books:[^\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[books:[^\]]+\]\]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    slug,
    title_en,
    lecture_date,
    location_en,
    lecture_type,
    audio_url,
    book_slug,
    verse_number,
    content_en,
  };
}

async function importLecture(filename: string, dryRun: boolean): Promise<boolean> {
  const content = await fetchLectureContent(filename);
  if (!content) {
    console.error(`  ❌ Failed to fetch ${filename}`);
    return false;
  }

  const parsed = parseLectureContent(content, filename);
  if (!parsed) {
    console.error(`  ❌ Failed to parse ${filename}`);
    return false;
  }

  console.log(`  📄 ${parsed.slug}: ${parsed.title_en.substring(0, 50)}...`);

  if (dryRun) {
    console.log(`     [DRY RUN] Would insert lecture`);
    return true;
  }

  // Insert lecture
  const { data: lecture, error: lectureError } = await supabase
    .from("lectures")
    .upsert({
      slug: parsed.slug,
      title_en: parsed.title_en,
      lecture_date: parsed.lecture_date,
      location_en: parsed.location_en,
      lecture_type: parsed.lecture_type,
      audio_url: parsed.audio_url,
      book_slug: parsed.book_slug,
      verse_number: parsed.verse_number,
    }, { onConflict: "slug" })
    .select("id")
    .single();

  if (lectureError) {
    console.error(`     ❌ Error: ${lectureError.message}`);
    return false;
  }

  // Insert paragraphs
  const paragraphs = parsed.content_en.split(/\n\n+/).filter(p => p.trim().length > 0);
  for (let i = 0; i < paragraphs.length; i++) {
    await supabase.from("lecture_paragraphs").upsert({
      lecture_id: lecture.id,
      paragraph_number: i + 1,
      content_en: paragraphs[i].trim(),
    }, { onConflict: "lecture_id,paragraph_number" });
  }

  console.log(`     ✅ Imported with ${paragraphs.length} paragraphs`);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : Infinity;

  console.log("🎤 iskconpress Lectures Importer");
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`   Limit: ${limit === Infinity ? "none" : limit}`);

  console.log("\n📂 Fetching lecture files...");
  const files = await fetchLectureFiles();
  console.log(`   Found ${files.length} files`);

  let imported = 0;
  let failed = 0;

  for (const file of files.slice(0, limit)) {
    await delay(DELAY_MS);
    const success = await importLecture(file, dryRun);
    if (success) imported++;
    else failed++;
  }

  console.log(`\n✨ Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Failed: ${failed}`);
}

main().catch(console.error);
