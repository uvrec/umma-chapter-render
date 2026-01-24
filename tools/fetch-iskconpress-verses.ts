/**
 * Fetches verse content from iskconpress/books repository
 * Downloads Sanskrit, transliteration, synonyms, translation, and purport
 *
 * Usage: npx ts-node tools/fetch-iskconpress-verses.ts [canto_number]
 * Example: npx ts-node tools/fetch-iskconpress-verses.ts 4
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
  console.error('Usage: npx ts-node tools/fetch-iskconpress-verses.ts [canto_number]');
  process.exit(1);
}

const BASE_URL = 'https://raw.githubusercontent.com/iskconpress/books/master/sb';
const UK_JSON = path.join(__dirname, '..', 'src', 'data', `sb-canto${CANTO}-parsed.json`);
const OUTPUT_JSON = path.join(__dirname, '..', 'src', 'data', `sb-canto${CANTO}-combined.json`);

// Delay between requests (ms)
const DELAY_MS = 150;

interface ParsedVerse {
  sanskrit?: string;
  transliteration_en?: string;
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string;
}

/**
 * Fetch verse file from GitHub
 */
async function fetchVerse(canto: number, chapter: number, verse: number): Promise<string | null> {
  const url = `${BASE_URL}/${canto}/${chapter}/${verse}.txt`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SB-Parser/1.0)',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP ${response.status}`);
    }

    return response.text();
  } catch (error) {
    console.error(`  Error fetching ${canto}.${chapter}.${verse}:`, error);
    return null;
  }
}

/**
 * Parse wiki format verse file
 */
function parseWikiVerse(content: string): ParsedVerse {
  const result: ParsedVerse = {};

  try {
    const lines = content.split('\n');
    let inDevanagariSection = false;
    let inTextSection = false;
    let inSynonymsSection = false;
    let inTranslationSection = false;
    let inPurportSection = false;

    const devanagariLines: string[] = [];
    const transliterationLines: string[] = [];
    const synonymsLines: string[] = [];
    const translationLines: string[] = [];
    const purportLines: string[] = [];

    for (const line of lines) {
      // Section markers
      if (line.match(/^======.*SB.*======$/)) {
        inDevanagariSection = true;
        inTextSection = false;
        inSynonymsSection = false;
        inTranslationSection = false;
        inPurportSection = false;
        continue;
      }
      if (line.match(/^=====\s*Text\s*=====$/i)) {
        inDevanagariSection = false;
        inTextSection = true;
        inSynonymsSection = false;
        inTranslationSection = false;
        inPurportSection = false;
        continue;
      }
      if (line.match(/^=====\s*Synonyms\s*=====$/i)) {
        inDevanagariSection = false;
        inTextSection = false;
        inSynonymsSection = true;
        inTranslationSection = false;
        inPurportSection = false;
        continue;
      }
      if (line.match(/^=====\s*Translation\s*=====$/i)) {
        inDevanagariSection = false;
        inTextSection = false;
        inSynonymsSection = false;
        inTranslationSection = true;
        inPurportSection = false;
        continue;
      }
      if (line.match(/^=====\s*Purport\s*=====$/i)) {
        inDevanagariSection = false;
        inTextSection = false;
        inSynonymsSection = false;
        inTranslationSection = false;
        inPurportSection = true;
        continue;
      }

      // Collect content
      if (inDevanagariSection && line.startsWith('>')) {
        const text = line.replace(/^>\s*/, '').trim();
        if (/[\u0900-\u097F]/.test(text)) {
          devanagariLines.push(text);
        }
      }

      if (inTextSection && line.startsWith('>')) {
        const text = line.replace(/^>\s*/, '').trim();
        if (text) {
          transliterationLines.push(text);
        }
      }

      if (inSynonymsSection) {
        // Parse [[synonyms:x:word]]---meaning format
        const cleaned = line
          .replace(/\[\[synonyms:[a-z]:([^\]]+)\]\]/gi, '$1')
          .trim();
        if (cleaned) {
          synonymsLines.push(cleaned);
        }
      }

      if (inTranslationSection) {
        const cleaned = line.replace(/\*\*/g, '').trim();
        if (cleaned) {
          translationLines.push(cleaned);
        }
      }

      if (inPurportSection) {
        let cleaned = line
          .replace(/\/\/([^/]+)\/\//g, '$1')  // //italic// -> italic
          .replace(/\[\[.*?\|(.*?)\]\]/g, '$1')  // [[link|text]] -> text
          .replace(/\[\[([^\]|]+)\]\]/g, '$1')   // [[link]] -> link
          .trim();
        if (cleaned) {
          purportLines.push(cleaned);
        }
      }
    }

    // Build result
    if (devanagariLines.length > 0) {
      result.sanskrit = devanagariLines.join('\n');
    }

    if (transliterationLines.length > 0) {
      result.transliteration_en = transliterationLines.join('\n');
    }

    if (synonymsLines.length > 0) {
      result.synonyms_en = synonymsLines.join(' ');
    }

    if (translationLines.length > 0) {
      result.translation_en = translationLines.join(' ');
    }

    if (purportLines.length > 0) {
      result.commentary_en = purportLines.join('\n\n');
    }

  } catch (error) {
    console.error('Parse error:', error);
  }

  return result;
}

/**
 * Parse verse number range
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
 * Delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log(`Fetching SB Canto ${CANTO} from iskconpress/books`);
  console.log('='.repeat(60));

  if (!fs.existsSync(UK_JSON)) {
    console.error(`UK JSON not found: ${UK_JSON}`);
    console.error('Run parse-sb.ts first to generate Ukrainian JSON');
    process.exit(1);
  }

  const ukData = JSON.parse(fs.readFileSync(UK_JSON, 'utf-8'));

  const combinedChapters: any[] = [];
  let totalVerses = 0;
  let fetchedWithEN = 0;
  let missingFiles = 0;

  for (const ukChapter of ukData.chapters) {
    const chapterNum = ukChapter.chapter_number;
    console.log(`\nChapter ${chapterNum}: ${ukChapter.chapter_title_uk}`);
    console.log('-'.repeat(40));

    const combinedVerses: any[] = [];

    for (const ukVerse of ukChapter.verses) {
      const verseNumStr = ukVerse.verse_number;
      const verseNumbers = parseVerseRange(verseNumStr);

      if (verseNumbers.length === 0) {
        // Non-numeric verse (like ЗВЕРНЕННЯ)
        combinedVerses.push({
          verse_number: verseNumStr,
          transliteration_uk: ukVerse.transliteration_uk,
          synonyms_uk: ukVerse.synonyms_uk,
          translation_uk: ukVerse.translation_uk,
          commentary_uk: ukVerse.commentary_uk,
        });
        continue;
      }

      totalVerses++;

      // Fetch and parse each verse in range
      const enVerses: (ParsedVerse | null)[] = [];

      for (const num of verseNumbers) {
        const content = await fetchVerse(CANTO, chapterNum, num);

        if (content) {
          const parsed = parseWikiVerse(content);
          enVerses.push(parsed);
        } else {
          enVerses.push(null);
          missingFiles++;
        }

        await delay(DELAY_MS);
      }

      // Merge EN content
      const validEN = enVerses.filter(v => v !== null) as ParsedVerse[];

      const mergedEN: Partial<ParsedVerse> = {};
      if (validEN.length > 0) {
        mergedEN.sanskrit = validEN.map(v => v.sanskrit).filter(Boolean).join('\n\n');
        mergedEN.transliteration_en = validEN.map(v => v.transliteration_en).filter(Boolean).join('\n\n');
        mergedEN.synonyms_en = validEN.map(v => v.synonyms_en).filter(Boolean).join('\n\n');
        mergedEN.translation_en = validEN.map(v => v.translation_en).filter(Boolean).join('\n\n');
        mergedEN.commentary_en = validEN.map(v => v.commentary_en).filter(Boolean).join('\n\n');
        fetchedWithEN++;
      }

      // Combine UK + EN
      const combinedVerse: any = {
        verse_number: verseNumStr,
        transliteration_uk: ukVerse.transliteration_uk,
        synonyms_uk: ukVerse.synonyms_uk,
        translation_uk: ukVerse.translation_uk,
        commentary_uk: ukVerse.commentary_uk,
      };

      // Sanskrit from EN source (Devanagari)
      if (mergedEN.sanskrit) {
        combinedVerse.sanskrit_uk = mergedEN.sanskrit;
        combinedVerse.sanskrit_en = mergedEN.sanskrit;
      }

      // EN data
      if (mergedEN.transliteration_en) combinedVerse.transliteration_en = mergedEN.transliteration_en;
      if (mergedEN.synonyms_en) combinedVerse.synonyms_en = mergedEN.synonyms_en;
      if (mergedEN.translation_en) combinedVerse.translation_en = mergedEN.translation_en;
      if (mergedEN.commentary_en) combinedVerse.commentary_en = mergedEN.commentary_en;

      combinedVerses.push(combinedVerse);
      console.log(`  ✓ ${verseNumStr}`);
    }

    combinedChapters.push({
      chapter_number: chapterNum,
      chapter_title_uk: ukChapter.chapter_title_uk,
      verses: combinedVerses,
    });
  }

  // Write output
  const output = {
    canto: CANTO,
    title_uk: ukData.title_uk,
    title_en: ukData.title_en,
    chapters: combinedChapters,
    intros: ukData.intros || [],
    generated_at: new Date().toISOString(),
  };

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('Done!');
  console.log(`Total verses: ${totalVerses}`);
  console.log(`Fetched with EN: ${fetchedWithEN}`);
  console.log(`Missing files: ${missingFiles}`);
  console.log(`Output: ${OUTPUT_JSON}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
