/**
 * Bengali Lexicon Import Script
 *
 * Imports the English-Bengali dictionary from MinhasKamal/BengaliDictionary into Supabase.
 * Source: https://github.com/MinhasKamal/BengaliDictionary
 * Data file: https://github.com/Nafisa41/Dictionary--English-to-Bangla-
 * License: GPL-3.0
 *
 * Usage:
 *   npx tsx scripts/import-bengali-lexicon.ts
 *
 * Prerequisites:
 *   1. Dictionary file at ./docs/E2Bdatabase.json (or set DICTIONARY_PATH env var)
 *   2. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

interface DictionaryEntry {
  en: string;
  bn: string;
}

interface LexiconEntry {
  word_en: string;
  word_bn: string;
  word_en_normalized: string;
}

/**
 * Normalize English word for search (lowercase, trimmed)
 */
function normalizeWord(word: string): string {
  return word.toLowerCase().trim();
}

/**
 * Retry helper with exponential backoff
 */
async function retry<T>(fn: () => Promise<T>, retries = 3, baseDelayMs = 500): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.log(`\n  Retry ${attempt}/${retries} after ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

/**
 * Read and parse the dictionary JSON file
 * Aggregates duplicate English words by combining their Bengali translations
 */
async function readDictionary(filePath: string): Promise<LexiconEntry[]> {
  console.log(`Reading dictionary from: ${filePath}`);
  const content = fs.readFileSync(filePath, "utf-8");
  const rawEntries: DictionaryEntry[] = JSON.parse(content);

  console.log(`Parsed ${rawEntries.length} entries from JSON`);

  // Aggregate duplicates by English word
  const wordMap = new Map<string, string[]>();

  for (const entry of rawEntries) {
    if (!entry.en || !entry.bn) continue;
    const key = entry.en.trim();
    const translations = wordMap.get(key) || [];
    translations.push(entry.bn.trim());
    wordMap.set(key, translations);
  }

  const entries: LexiconEntry[] = Array.from(wordMap.entries()).map(([word, translations]) => ({
    word_en: word,
    word_bn: [...new Set(translations)].join("; "), // Remove duplicates and join with semicolon
    word_en_normalized: normalizeWord(word),
  }));

  console.log(`Prepared ${entries.length} unique entries for import (from ${rawEntries.length} raw entries)`);
  return entries;
}

/**
 * Main import function
 */
async function importLexicon() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.");
    console.log("\nUsage:");
    console.log(
      "  SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/import-bengali-lexicon.ts",
    );
    process.exit(1);
  }

  const dictionaryPath = process.env.DICTIONARY_PATH || "./docs/E2Bdatabase.json";

  if (!fs.existsSync(dictionaryPath)) {
    console.error(`Error: Dictionary file not found at ${dictionaryPath}`);
    console.log("\nEnsure the file exists at ./docs/E2Bdatabase.json or set DICTIONARY_PATH env var");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Starting Bengali lexicon import...");

  // Read all entries
  const allEntries = await readDictionary(dictionaryPath);

  const BATCH_SIZE = 1000;
  let totalImported = 0;
  let errors = 0;

  // Process in batches
  for (let i = 0; i < allEntries.length; i += BATCH_SIZE) {
    const batch = allEntries.slice(i, i + BATCH_SIZE);

    try {
      await retry(async () => {
        const { error } = await supabase.from("bengali_lexicon").upsert(batch, {
          onConflict: "word_en",
          ignoreDuplicates: true,
        });
        if (error) throw error;
      });
      totalImported += batch.length;
      process.stdout.write(`\rImported: ${totalImported} / ${allEntries.length} entries...`);
    } catch (err: any) {
      console.error(`\nError inserting batch at index ${i}: ${err.message || err}`);
      errors++;

      // Try inserting one by one for problematic batch
      for (const entry of batch) {
        try {
          const { error } = await supabase.from("bengali_lexicon").upsert([entry], {
            onConflict: "word_en",
            ignoreDuplicates: true,
          });
          if (!error) totalImported++;
        } catch {
          // Skip individual errors
        }
      }
    }
  }

  console.log(`\n\nImport complete!`);
  console.log(`Total entries imported: ${totalImported}`);
  console.log(`Batch errors: ${errors}`);
  console.log("\nAttribution: MinhasKamal/BengaliDictionary. License: GPL-3.0");
}

// Run if called directly
importLexicon().catch(console.error);
