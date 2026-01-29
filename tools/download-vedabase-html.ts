/**
 * Downloads vedabase.io HTML files for a given SB canto
 *
 * Usage: npx ts-node tools/download-vedabase-html.ts [canto_number]
 * Example: npx ts-node tools/download-vedabase-html.ts 4
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get canto from args
const cantoArg = process.argv[2];
const CANTO = cantoArg ? parseInt(cantoArg) : 4;

if (isNaN(CANTO) || CANTO < 1 || CANTO > 12) {
  console.error('Usage: npx ts-node tools/download-vedabase-html.ts [canto_number]');
  console.error('Example: npx ts-node tools/download-vedabase-html.ts 4');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, 'outputs', `vedabase_sb${CANTO}`);
const UK_JSON_FILE = path.join(__dirname, '..', 'src', 'data', `sb-canto${CANTO}-parsed.json`);

// Delay between requests (ms)
const DELAY_MS = 300;

async function fetchWithHeaders(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.text();
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseVerseNumbers(verseNum: string): number[] {
  if (!/^\d/.test(verseNum)) return [];

  const rangeMatch = verseNum.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1]);
    const end = parseInt(rangeMatch[2]);
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  const num = parseInt(verseNum);
  return isNaN(num) ? [] : [num];
}

async function downloadVerse(canto: number, chapter: number, verse: number): Promise<boolean> {
  const outputFile = path.join(OUTPUT_DIR, `ch${chapter}_v${verse}.html`);

  // Skip if already downloaded
  if (fs.existsSync(outputFile)) {
    return true;
  }

  const url = `https://vedabase.io/en/library/sb/${canto}/${chapter}/${verse}/`;

  try {
    console.log(`  Downloading ${url}...`);
    const html = await fetchWithHeaders(url);
    fs.writeFileSync(outputFile, html);
    return true;
  } catch (error) {
    console.error(`  Error: ${error}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log(`Downloading SB Canto ${CANTO} from vedabase.io`);
  console.log('='.repeat(60));

  // Check if UK JSON exists
  if (!fs.existsSync(UK_JSON_FILE)) {
    console.error(`UK JSON not found: ${UK_JSON_FILE}`);
    console.error('Run parse-sb.ts first to generate the Ukrainian JSON');
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read UK JSON to get verse structure
  const ukData = JSON.parse(fs.readFileSync(UK_JSON_FILE, 'utf-8'));

  let totalVerses = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const chapter of ukData.chapters) {
    const chapterNum = chapter.chapter_number;
    console.log(`\nChapter ${chapterNum}: ${chapter.chapter_title_uk || ''}`);
    console.log('-'.repeat(40));

    for (const verse of chapter.verses) {
      const verseNumStr = verse.verse_number;
      const verseNumbers = parseVerseNumbers(verseNumStr);

      if (verseNumbers.length === 0) {
        console.log(`  Skipping non-verse: ${verseNumStr}`);
        continue;
      }

      // First, try to download the combined verse URL (e.g., 2-7)
      if (verseNumbers.length > 1) {
        const combinedFile = path.join(OUTPUT_DIR, `ch${chapterNum}_v${verseNumStr}.html`);
        if (!fs.existsSync(combinedFile)) {
          const combinedUrl = `https://vedabase.io/en/library/sb/${CANTO}/${chapterNum}/${verseNumbers[0]}-${verseNumbers[verseNumbers.length - 1]}/`;
          try {
            console.log(`  Downloading ${combinedUrl}...`);
            const html = await fetchWithHeaders(combinedUrl);
            fs.writeFileSync(combinedFile, html);
            totalVerses++;
            downloaded++;
            await delay(DELAY_MS);
            continue;
          } catch {
            // Fall back to individual verses
          }
        } else {
          totalVerses++;
          skipped++;
          continue;
        }
      }

      // Download individual verses
      for (const num of verseNumbers) {
        totalVerses++;

        const outputFile = path.join(OUTPUT_DIR, `ch${chapterNum}_v${num}.html`);
        if (fs.existsSync(outputFile)) {
          skipped++;
          continue;
        }

        const success = await downloadVerse(CANTO, chapterNum, num);
        if (success) {
          downloaded++;
        } else {
          failed++;
        }
        await delay(DELAY_MS);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Done!`);
  console.log(`Total: ${totalVerses}`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
