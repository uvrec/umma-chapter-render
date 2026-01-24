/**
 * Builds combined JSON for SB Canto by fetching EN content from iskconpress/books via WebFetch
 *
 * Since this runs in an environment where direct network access is blocked,
 * this script generates a JSON file with placeholders that can be filled
 * by running fetch requests externally.
 *
 * Usage: npx ts-node tools/build-combined-json.ts [canto_number]
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
  console.error('Usage: npx ts-node tools/build-combined-json.ts [canto_number]');
  process.exit(1);
}

const UK_JSON = path.join(__dirname, '..', 'src', 'data', `sb-canto${CANTO}-parsed.json`);
const OUTPUT_JSON = path.join(__dirname, '..', 'src', 'data', `sb-canto${CANTO}-combined.json`);
const FETCH_LIST = path.join(__dirname, 'outputs', `canto${CANTO}-fetch-urls.json`);

interface VerseURL {
  chapter: number;
  verse: string;
  verseNumbers: number[];
  url: string;
}

/**
 * Parse verse number range and return array of individual verse numbers
 */
function parseVerseRange(verseNum: string): number[] {
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

/**
 * Generate list of URLs to fetch
 */
function generateFetchList(): void {
  console.log('='.repeat(60));
  console.log(`Generating fetch list for SB Canto ${CANTO}`);
  console.log('='.repeat(60));

  if (!fs.existsSync(UK_JSON)) {
    console.error(`UK JSON not found: ${UK_JSON}`);
    process.exit(1);
  }

  const ukData = JSON.parse(fs.readFileSync(UK_JSON, 'utf-8'));
  const fetchList: VerseURL[] = [];

  for (const chapter of ukData.chapters) {
    const chapterNum = chapter.chapter_number;

    for (const verse of chapter.verses) {
      const verseNumStr = verse.verse_number;
      const verseNumbers = parseVerseRange(verseNumStr);

      if (verseNumbers.length === 0) continue;

      // For each verse, we'll fetch from the first verse number
      const url = `https://raw.githubusercontent.com/iskconpress/books/master/sb/${CANTO}/${chapterNum}/${verseNumbers[0]}.txt`;

      fetchList.push({
        chapter: chapterNum,
        verse: verseNumStr,
        verseNumbers,
        url
      });
    }
  }

  // Create outputs directory if needed
  const outputDir = path.dirname(FETCH_LIST);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(FETCH_LIST, JSON.stringify(fetchList, null, 2));
  console.log(`\nGenerated fetch list with ${fetchList.length} URLs`);
  console.log(`Output: ${FETCH_LIST}`);
}

/**
 * Build combined JSON with structure (to be filled with EN data later)
 */
function buildCombinedStructure(): void {
  console.log('='.repeat(60));
  console.log(`Building combined JSON structure for SB Canto ${CANTO}`);
  console.log('='.repeat(60));

  if (!fs.existsSync(UK_JSON)) {
    console.error(`UK JSON not found: ${UK_JSON}`);
    process.exit(1);
  }

  const ukData = JSON.parse(fs.readFileSync(UK_JSON, 'utf-8'));

  const combinedChapters: any[] = [];

  for (const ukChapter of ukData.chapters) {
    const chapterNum = ukChapter.chapter_number;
    console.log(`\nChapter ${chapterNum}: ${ukChapter.chapter_title_uk}`);

    const combinedVerses: any[] = [];

    for (const ukVerse of ukChapter.verses) {
      const combinedVerse: any = {
        verse_number: ukVerse.verse_number,
        // UK data from Ventura
        transliteration_uk: ukVerse.transliteration_uk,
        synonyms_uk: ukVerse.synonyms_uk,
        translation_uk: ukVerse.translation_uk,
        commentary_uk: ukVerse.commentary_uk,
        // EN data - placeholders
        sanskrit_uk: null,  // Will be filled with Devanagari
        sanskrit_en: null,  // Same as sanskrit_uk
        transliteration_en: null,
        synonyms_en: null,
        translation_en: null,
        commentary_en: null,
      };

      combinedVerses.push(combinedVerse);
    }

    combinedChapters.push({
      chapter_number: chapterNum,
      chapter_title_uk: ukChapter.chapter_title_uk,
      verses: combinedVerses,
    });
  }

  const output = {
    canto: CANTO,
    title_uk: ukData.title_uk,
    title_en: ukData.title_en,
    chapters: combinedChapters,
    intros: ukData.intros || [],
    generated_at: new Date().toISOString(),
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));
  console.log(`\nOutput: ${OUTPUT_JSON}`);
}

// Run
generateFetchList();
buildCombinedStructure();
