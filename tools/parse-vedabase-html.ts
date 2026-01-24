/**
 * Парсер завантажених HTML файлів з vedabase.io
 * Об'єднує UK та EN версії в один JSON
 *
 * Використання: npx ts-node tools/parse-vedabase-html.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CANTO = 2;
const HTML_DIR = path.join(__dirname, 'outputs', `vedabase_sb${CANTO}`);
const UK_JSON = path.join(__dirname, '..', 'src', 'data', 'sb-canto2-parsed.json');
const OUTPUT_JSON = path.join(__dirname, '..', 'src', 'data', 'sb-canto2-combined.json');

interface CombinedVerse {
  verse_number: string;
  // Sanskrit (деванагарі) - однаковий для UK та EN
  sanskrit_uk?: string;
  sanskrit_en?: string;
  // UK версія (з Ventura файлів)
  transliteration_uk?: string;
  synonyms_uk?: string;
  translation_uk?: string;
  commentary_uk?: string;
  // EN версія (з vedabase.io)
  transliteration_en?: string;
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string;
  // Metadata
  source_url?: string;
}

interface CombinedChapter {
  chapter_number: number;
  chapter_title_uk?: string;
  chapter_title_en?: string;
  verses: CombinedVerse[];
}

interface CombinedData {
  canto: number;
  title_uk: string;
  title_en: string;
  chapters: CombinedChapter[];
  intros?: any[];
  generated_at: string;
}

/**
 * Декодує HTML-сутності
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Витягує контент з HTML файлу vedabase
 */
function parseVedabaseHtml(html: string): {
  sanskrit?: string;
  transliteration_en?: string;
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string;
} {
  const result: ReturnType<typeof parseVedabaseHtml> = {};

  try {
    // 1. САНСКРИТ/ДЕВАНАГАРІ
    let devanagariMatch = html.match(/av-devanagari[^>]*>([\s\S]*?)<\/div>/i);
    if (!devanagariMatch) {
      devanagariMatch = html.match(/av-bengali[^>]*>([\s\S]*?)<\/div>/i);
    }

    if (devanagariMatch) {
      const devanagariChars = devanagariMatch[1].match(/[\u0900-\u097F।॥\s]+/g);
      if (devanagariChars) {
        result.sanskrit = devanagariChars
          .map(s => s.trim())
          .filter(s => s.length > 5)
          .join('\n');
      }
    }

    // 2. ТРАНСЛІТЕРАЦІЯ (IAST)
    const verseTextMatch = html.match(/av-verse_text[^>]*>([\s\S]*?)<\/div>/i);
    if (verseTextMatch) {
      const text = decodeHtmlEntities(
        verseTextMatch[1]
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
      ).trim().replace(/^Verse text\s*/i, '').trim();

      if (text && /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]/.test(text)) {
        result.transliteration_en = text;
      }
    }

    // 3. СИНОНІМИ
    const synonymsMatch = html.match(/av-synonyms[^>]*>([\s\S]*?)<\/div>/i);
    if (synonymsMatch) {
      const text = decodeHtmlEntities(
        synonymsMatch[1]
          .replace(/<br\s*\/?>/gi, '; ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
      ).trim();

      if (text && text.length > 5) {
        result.synonyms_en = text;
      }
    }

    // 4. ПЕРЕКЛАД
    const translationMatch = html.match(/av-translation[^>]*>([\s\S]*?)<\/div>/i);
    if (translationMatch) {
      const text = decodeHtmlEntities(
        translationMatch[1]
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
      ).trim().replace(/^Translation\s*/i, '').trim();

      if (text) {
        result.translation_en = text;
      }
    }

    // 5. ПОЯСНЕННЯ
    const purportMatch = html.match(/av-purport[^>]*>([\s\S]*?)(?:<\/div>\s*<\/div>|<div[^>]*class)/i);
    if (purportMatch) {
      const paragraphMatches = purportMatch[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
      const purportParts: string[] = [];

      for (const match of paragraphMatches) {
        const text = decodeHtmlEntities(
          match[1]
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
        ).trim();
        if (text && text.length > 10) {
          purportParts.push(text);
        }
      }

      if (purportParts.length > 0) {
        result.commentary_en = purportParts.join('\n\n');
      }
    }

  } catch (error) {
    console.error('Parse error:', error);
  }

  return result;
}

/**
 * Парсить номер вірша та повертає масив номерів
 */
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

/**
 * Об'єднує контент кількох віршів
 */
function mergeEnContent(verses: ReturnType<typeof parseVedabaseHtml>[]): ReturnType<typeof parseVedabaseHtml> {
  const validVerses = verses.filter(v => Object.keys(v).length > 0);
  if (validVerses.length === 0) return {};
  if (validVerses.length === 1) return validVerses[0];

  return {
    sanskrit: validVerses.map(v => v.sanskrit).filter(Boolean).join('\n\n'),
    transliteration_en: validVerses.map(v => v.transliteration_en).filter(Boolean).join('\n\n'),
    synonyms_en: validVerses.map(v => v.synonyms_en).filter(Boolean).join('\n\n'),
    translation_en: validVerses.map(v => v.translation_en).filter(Boolean).join('\n\n'),
    commentary_en: validVerses.map(v => v.commentary_en).filter(Boolean).join('\n\n'),
  };
}

/**
 * Головна функція
 */
async function main() {
  console.log('='.repeat(60));
  console.log(`Parsing and combining SB Canto ${CANTO}`);
  console.log('='.repeat(60));

  // Читаємо UK JSON
  const ukData = JSON.parse(fs.readFileSync(UK_JSON, 'utf-8'));

  const result: CombinedData = {
    canto: CANTO,
    title_uk: ukData.title_uk || 'Шрімад-Бгаґаватам, Пісня 2',
    title_en: 'Srimad Bhagavatam, Canto 2',
    chapters: [],
    intros: ukData.intros,
    generated_at: new Date().toISOString()
  };

  let totalVerses = 0;
  let parsedVerses = 0;
  let missingFiles = 0;

  for (const ukChapter of ukData.chapters) {
    const chapterNum = ukChapter.chapter_number;
    console.log(`\nChapter ${chapterNum}: ${ukChapter.chapter_title || ''}`);
    console.log('-'.repeat(40));

    const chapter: CombinedChapter = {
      chapter_number: chapterNum,
      chapter_title_uk: ukChapter.chapter_title,
      verses: []
    };

    for (const ukVerse of ukChapter.verses) {
      const verseNumStr = ukVerse.verse_number;
      const verseNumbers = parseVerseNumbers(verseNumStr);

      // Створюємо комбінований вірш з UK даними
      const combinedVerse: CombinedVerse = {
        verse_number: verseNumStr,
        // UK дані з Ventura
        sanskrit_uk: ukVerse.sanskrit,
        transliteration_uk: ukVerse.transliteration_uk,
        synonyms_uk: ukVerse.synonyms_uk,
        translation_uk: ukVerse.translation_uk,
        commentary_uk: ukVerse.commentary_uk,
      };

      if (verseNumbers.length === 0) {
        // Нечисловий вірш (ЗВЕРНЕННЯ тощо) - без EN версії
        chapter.verses.push(combinedVerse);
        continue;
      }

      totalVerses++;

      // Парсимо EN дані з HTML файлів
      let mergedEn: ReturnType<typeof parseVedabaseHtml> = {};

      // Спочатку пробуємо знайти файл для комбінованого вірша (2-7)
      const combinedFile = path.join(HTML_DIR, `ch${chapterNum}_v${verseNumStr}.html`);

      if (fs.existsSync(combinedFile)) {
        const html = fs.readFileSync(combinedFile, 'utf-8');
        mergedEn = parseVedabaseHtml(html);
      } else {
        // Fallback: пробуємо знайти окремі файли для кожного вірша
        const enVerses: ReturnType<typeof parseVedabaseHtml>[] = [];

        for (const num of verseNumbers) {
          const htmlFile = path.join(HTML_DIR, `ch${chapterNum}_v${num}.html`);

          if (fs.existsSync(htmlFile)) {
            const html = fs.readFileSync(htmlFile, 'utf-8');
            const parsed = parseVedabaseHtml(html);
            enVerses.push(parsed);
          } else {
            missingFiles++;
            console.log(`  Missing: ch${chapterNum}_v${num}.html`);
          }
        }

        // Об'єднуємо EN контент
        mergedEn = mergeEnContent(enVerses);
      }

      if (Object.keys(mergedEn).length > 0) {
        parsedVerses++;

        // Sanskrit однаковий для обох мов
        combinedVerse.sanskrit_en = mergedEn.sanskrit;
        // Якщо UK не мав sanskrit, беремо з EN
        if (!combinedVerse.sanskrit_uk && mergedEn.sanskrit) {
          combinedVerse.sanskrit_uk = mergedEn.sanskrit;
        }

        combinedVerse.transliteration_en = mergedEn.transliteration_en;
        combinedVerse.synonyms_en = mergedEn.synonyms_en;
        combinedVerse.translation_en = mergedEn.translation_en;
        combinedVerse.commentary_en = mergedEn.commentary_en;

        combinedVerse.source_url = verseNumbers.length === 1
          ? `https://vedabase.io/en/library/sb/${CANTO}/${chapterNum}/${verseNumbers[0]}/`
          : `https://vedabase.io/en/library/sb/${CANTO}/${chapterNum}/${verseNumbers[0]}-${verseNumbers[verseNumbers.length - 1]}/`;

        console.log(`  ✓ ${verseNumStr}`);
      } else {
        console.log(`  ✗ ${verseNumStr} - no EN data`);
      }

      chapter.verses.push(combinedVerse);
    }

    result.chapters.push(chapter);
  }

  // Зберігаємо результат
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(result, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`Done!`);
  console.log(`Total verses: ${totalVerses}`);
  console.log(`Parsed with EN: ${parsedVerses}`);
  console.log(`Missing files: ${missingFiles}`);
  console.log(`Output: ${OUTPUT_JSON}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
