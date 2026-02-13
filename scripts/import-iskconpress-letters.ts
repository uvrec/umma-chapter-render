#!/usr/bin/env npx tsx
/**
 * Import letters from iskconpress/letters GitHub repository
 * Source: https://github.com/iskconpress/letters
 *
 * Usage:
 *   npx tsx scripts/import-iskconpress-letters.ts
 *   npx tsx scripts/import-iskconpress-letters.ts --limit 100
 *   npx tsx scripts/import-iskconpress-letters.ts --dry-run
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load .env
const envContent = readFileSync(".env", "utf-8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^=]+)="?([^"]*)"?$/);
  if (match) process.env[match[1]] = match[2];
}

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/iskconpress/letters/master";
const GITHUB_API_BASE = "https://api.github.com/repos/iskconpress/letters/contents";
const DELAY_MS = 300;

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

async function fetchLetterFiles(): Promise<string[]> {
  const files: string[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(`${GITHUB_API_BASE}?per_page=100&page=${page}`);
    if (!response.ok) break;

    const items = await response.json();
    if (!Array.isArray(items) || items.length === 0) break;

    for (const item of items) {
      if (item.name.endsWith(".txt") && !item.name.startsWith(".")) {
        files.push(item.name);
      }
    }

    if (items.length < 100) break;
    page++;
    await delay(200);
  }

  return files.sort();
}

async function fetchLetterContent(filename: string): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_RAW_BASE}/${encodeURIComponent(filename)}`);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

interface ParsedLetter {
  slug: string;
  recipient_en: string;
  letter_date: string;
  location_en: string;
  reference?: string;
  address_block?: string;
  content_en: string;
}

function parseLetterContent(content: string, filename: string): ParsedLetter | null {
  // Create slug from filename
  const slug = filename.replace(".txt", "").replace(/[^a-z0-9_-]/gi, "_").toLowerCase();

  // Parse recipient
  const recipientMatch = content.match(/To_letters\s*:\s*(.+)/) || content.match(/Recipient_hidden\s*:\s*(.+)/);
  let recipient_en = recipientMatch ? recipientMatch[1].trim() : "Unknown";

  // Also try from filename: YYMMDD_recipient_name.txt
  if (recipient_en === "Unknown") {
    const fnMatch = filename.match(/^\d+_(.+)\.txt$/);
    if (fnMatch) {
      recipient_en = fnMatch[1].replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }
  }

  // Parse date
  const dateMatch = content.match(/ListDate_hidden\s*:\s*(\d{4}-\d{2}-\d{2})/);
  let letter_date = "1970-01-01";
  if (dateMatch) {
    letter_date = dateMatch[1];
  } else {
    // Parse from filename: YYMMDD_...
    const fnDateMatch = filename.match(/^(\d{2})(\d{2})(\d{2})/);
    if (fnDateMatch) {
      const year = parseInt(fnDateMatch[1]) > 50 ? `19${fnDateMatch[1]}` : `20${fnDateMatch[1]}`;
      letter_date = `${year}-${fnDateMatch[2]}-${fnDateMatch[3]}`;
    }
  }

  // Parse location
  const placeMatch = content.match(/Place_letter\s*:\s*(.+)/);
  const location_en = placeMatch ? placeMatch[1].trim() : "Unknown";

  // Extract address block (lines before "Dear...")
  let address_block: string | undefined;
  const addressMatch = content.match(/----\n\n([\s\S]*?)(?=Dear|My dear|Respected)/i);
  if (addressMatch) {
    address_block = addressMatch[1].trim().replace(/\\\\/g, "\n");
  }

  // Extract main content (after dataentry, clean markup)
  let content_en = content
    .replace(/~~[^~]+~~/g, "")
    .replace(/----\s*dataentry[^-]+----/gs, "")
    .replace(/======\s*(.+?)\s*======/g, "")
    .replace(/\[\[books:[^\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[books:[^\]]+\]\]/g, "")
    .replace(/__(.+?)__/g, "_$1_")
    .replace(/\\\\/g, "\n")
    .replace(/%%--%% /g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Remove address block from content if it was extracted
  if (address_block) {
    content_en = content_en.replace(address_block, "").trim();
  }

  return {
    slug,
    recipient_en,
    letter_date,
    location_en,
    address_block,
    content_en,
  };
}

async function importLetter(filename: string, dryRun: boolean): Promise<boolean> {
  const content = await fetchLetterContent(filename);
  if (!content) {
    console.error(`  ❌ Failed to fetch ${filename}`);
    return false;
  }

  const parsed = parseLetterContent(content, filename);
  if (!parsed) {
    console.error(`  ❌ Failed to parse ${filename}`);
    return false;
  }

  console.log(`  📄 ${parsed.slug}: To ${parsed.recipient_en} (${parsed.letter_date})`);

  if (dryRun) {
    console.log(`     [DRY RUN] Would insert letter`);
    return true;
  }

  const { error } = await supabase
    .from("letters")
    .upsert({
      slug: parsed.slug,
      recipient_en: parsed.recipient_en,
      letter_date: parsed.letter_date,
      location_en: parsed.location_en,
      address_block: parsed.address_block,
      content_en: parsed.content_en,
    }, { onConflict: "slug" });

  if (error) {
    console.error(`     ❌ Error: ${error.message}`);
    return false;
  }

  console.log(`     ✅ Imported`);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : Infinity;

  console.log("✉️  iskconpress Letters Importer");
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`   Limit: ${limit === Infinity ? "none" : limit}`);

  console.log("\n📂 Fetching letter files...");
  const files = await fetchLetterFiles();
  console.log(`   Found ${files.length} files`);

  let imported = 0;
  let failed = 0;

  for (const file of files.slice(0, limit)) {
    await delay(DELAY_MS);
    const success = await importLetter(file, dryRun);
    if (success) imported++;
    else failed++;
  }

  console.log(`\n✨ Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Failed: ${failed}`);
}

main().catch(console.error);
