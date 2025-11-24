/**
 * Sanskrit Lexicon Import Script
 *
 * Imports the Digital Corpus of Sanskrit (DCS) dictionary into Supabase.
 * Source: https://github.com/OliverHellwig/sanskrit
 * License: CC BY 4.0
 *
 * Usage:
 *   npx tsx scripts/import-sanskrit-lexicon.ts
 *
 * Prerequisites:
 *   1. Clone the DCS repository: git clone https://github.com/OliverHellwig/sanskrit.git /tmp/sanskrit-dcs
 *   2. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// IAST to Devanagari mapping
const IAST_TO_DEVANAGARI: Record<string, string> = {
  // Vowels
  'a': 'अ', 'ā': 'आ', 'i': 'इ', 'ī': 'ई', 'u': 'उ', 'ū': 'ऊ',
  'ṛ': 'ऋ', 'ṝ': 'ॠ', 'ḷ': 'ऌ', 'ḹ': 'ॡ',
  'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
  // Consonants
  'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ṅ': 'ङ',
  'c': 'च', 'ch': 'छ', 'j': 'ज', 'jh': 'झ', 'ñ': 'ञ',
  'ṭ': 'ट', 'ṭh': 'ठ', 'ḍ': 'ड', 'ḍh': 'ढ', 'ṇ': 'ण',
  't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
  'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
  'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व',
  'ś': 'श', 'ṣ': 'ष', 's': 'स', 'h': 'ह',
  // Special
  'ṃ': 'ं', 'ḥ': 'ः', "'": 'ऽ',
};

// Vowel matras (for combining with consonants)
const VOWEL_MATRAS: Record<string, string> = {
  'a': '', // inherent vowel
  'ā': 'ा', 'i': 'ि', 'ī': 'ी', 'u': 'ु', 'ū': 'ू',
  'ṛ': 'ृ', 'ṝ': 'ॄ', 'ḷ': 'ॢ', 'ḹ': 'ॣ',
  'e': 'े', 'ai': 'ै', 'o': 'ो', 'au': 'ौ',
};

const CONSONANTS = new Set([
  'k', 'kh', 'g', 'gh', 'ṅ',
  'c', 'ch', 'j', 'jh', 'ñ',
  'ṭ', 'ṭh', 'ḍ', 'ḍh', 'ṇ',
  't', 'th', 'd', 'dh', 'n',
  'p', 'ph', 'b', 'bh', 'm',
  'y', 'r', 'l', 'v',
  'ś', 'ṣ', 's', 'h',
]);

const VIRAMA = '्';

/**
 * Retry helper with exponential backoff
 */
async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelayMs = 500
): Promise<T> {
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
 * Convert IAST to Devanagari
 */
function iastToDevanagari(iast: string): string {
  if (!iast) return '';

  let result = '';
  let i = 0;
  let prevWasConsonant = false;

  while (i < iast.length) {
    // Try two-character sequences first (aspirated consonants, diphthongs)
    const twoChar = iast.substring(i, i + 2).toLowerCase();
    const oneChar = iast[i].toLowerCase();

    // Check for two-character consonants (kh, gh, ch, etc.)
    if (CONSONANTS.has(twoChar)) {
      if (prevWasConsonant) {
        result += VIRAMA;
      }
      result += IAST_TO_DEVANAGARI[twoChar] || twoChar;
      prevWasConsonant = true;
      i += 2;
      continue;
    }

    // Check for diphthongs (ai, au)
    if (twoChar === 'ai' || twoChar === 'au') {
      if (prevWasConsonant) {
        result += VOWEL_MATRAS[twoChar] || '';
        prevWasConsonant = false;
      } else {
        result += IAST_TO_DEVANAGARI[twoChar] || twoChar;
      }
      i += 2;
      continue;
    }

    // Check for single consonants
    if (CONSONANTS.has(oneChar)) {
      if (prevWasConsonant) {
        result += VIRAMA;
      }
      result += IAST_TO_DEVANAGARI[oneChar] || oneChar;
      prevWasConsonant = true;
      i += 1;
      continue;
    }

    // Check for vowels
    if (VOWEL_MATRAS.hasOwnProperty(oneChar)) {
      if (prevWasConsonant) {
        result += VOWEL_MATRAS[oneChar];
        prevWasConsonant = false;
      } else {
        result += IAST_TO_DEVANAGARI[oneChar] || oneChar;
      }
      i += 1;
      continue;
    }

    // Check for anusvara, visarga
    if (oneChar === 'ṃ' || oneChar === 'ḥ') {
      if (prevWasConsonant) {
        result += VIRAMA;
        prevWasConsonant = false;
      }
      result += IAST_TO_DEVANAGARI[oneChar] || oneChar;
      i += 1;
      continue;
    }

    // Other characters (spaces, punctuation, etc.)
    if (prevWasConsonant && oneChar !== ' ' && oneChar !== '-') {
      result += VIRAMA;
    }
    prevWasConsonant = false;
    result += iast[i];
    i += 1;
  }

  // Add final virama if word ends with consonant
  if (prevWasConsonant) {
    result += VIRAMA;
  }

  return result;
}

/**
 * Normalize word for search (remove diacritics, lowercase)
 */
function normalizeWord(word: string): string {
  if (!word) return '';
  return word
    .toLowerCase()
    .replace(/ā/g, 'a')
    .replace(/ī/g, 'i')
    .replace(/ū/g, 'u')
    .replace(/ṛ/g, 'r')
    .replace(/ṝ/g, 'r')
    .replace(/ḷ/g, 'l')
    .replace(/ḹ/g, 'l')
    .replace(/ē/g, 'e')
    .replace(/ō/g, 'o')
    .replace(/ṃ/g, 'm')
    .replace(/ḥ/g, 'h')
    .replace(/ṅ/g, 'n')
    .replace(/ñ/g, 'n')
    .replace(/ṭ/g, 't')
    .replace(/ḍ/g, 'd')
    .replace(/ṇ/g, 'n')
    .replace(/ś/g, 's')
    .replace(/ṣ/g, 's');
}

interface LexiconEntry {
  id: number;
  word: string;
  word_devanagari: string;
  grammar: string | null;
  preverbs: string | null;
  meanings: string | null;
  word_normalized: string;
}

/**
 * Parse TSV line
 */
function parseTsvLine(line: string): string[] {
  return line.split('\t');
}

/**
 * Read and parse the dictionary CSV
 */
async function* readDictionary(filePath: string): AsyncGenerator<LexiconEntry> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue; // Skip header
    }

    const fields = parseTsvLine(line);
    if (fields.length < 2) continue;

    const id = parseInt(fields[0], 10);
    const word = fields[1] || '';
    const grammar = fields[2] || null;
    const preverbs = fields[3] || null;
    const meanings = fields[4] || null;

    if (isNaN(id) || !word) continue;

    yield {
      id,
      word,
      word_devanagari: iastToDevanagari(word),
      grammar,
      preverbs,
      meanings,
      word_normalized: normalizeWord(word),
    };
  }
}

/**
 * Main import function
 */
async function importLexicon() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
    console.log('\nUsage:');
    console.log('  SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/import-sanskrit-lexicon.ts');
    process.exit(1);
  }

  const dictionaryPath = '/tmp/sanskrit-dcs/dcs/data/conllu/lookup/dictionary.csv';

  if (!fs.existsSync(dictionaryPath)) {
    console.error(`Error: Dictionary file not found at ${dictionaryPath}`);
    console.log('\nPlease clone the repository first:');
    console.log('  git clone https://github.com/OliverHellwig/sanskrit.git /tmp/sanskrit-dcs');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Starting Sanskrit lexicon import...');
  console.log(`Reading from: ${dictionaryPath}`);

  const BATCH_SIZE = 1000;
  let batch: LexiconEntry[] = [];
  let totalImported = 0;
  let errors = 0;

  for await (const entry of readDictionary(dictionaryPath)) {
    batch.push(entry);

    if (batch.length >= BATCH_SIZE) {
      try {
        await retry(async () => {
          const { error } = await supabase
            .from('sanskrit_lexicon')
            .upsert(batch, { onConflict: 'id' });
          if (error) throw error;
        });
        totalImported += batch.length;
        process.stdout.write(`\rImported: ${totalImported} entries...`);
      } catch (err: any) {
        console.error(`\nError inserting batch (id range ${batch[0].id} - ${batch[batch.length-1].id}): ${err.message || err}`);
        errors++;
      }

      batch = [];
    }
  }

  // Insert remaining entries
  if (batch.length > 0) {
    try {
      await retry(async () => {
        const { error } = await supabase
          .from('sanskrit_lexicon')
          .upsert(batch, { onConflict: 'id' });
        if (error) throw error;
      });
      totalImported += batch.length;
    } catch (err: any) {
      console.error(`\nError inserting final batch (id range ${batch[0].id} - ${batch[batch.length-1].id}): ${err.message || err}`);
      errors++;
    }
  }

  console.log(`\n\nImport complete!`);
  console.log(`Total entries imported: ${totalImported}`);
  console.log(`Errors: ${errors}`);
  console.log('\nAttribution: Oliver Hellwig: Digital Corpus of Sanskrit (DCS). 2010-2024. License: CC BY 4.0');
}

// Export for testing
export { iastToDevanagari, normalizeWord };

// Run if called directly
importLexicon().catch(console.error);
