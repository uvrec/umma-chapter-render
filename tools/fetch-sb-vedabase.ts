/**
 * Скрипт для завантаження SB Canto 2 з vedabase.io
 * Витягує: деванагарі, транслітерацію, синоніми, переклад, пояснення
 *
 * Використання: npx ts-node tools/fetch-sb-vedabase.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Затримка між запитами (мс) для уникнення блокування
const DELAY_MS = 500;

// Конфігурація
const CANTO = 2;
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'sb-canto2-vedabase.json');
const UK_JSON_FILE = path.join(__dirname, '..', 'src', 'data', 'sb-canto2-parsed.json');

interface VedabaseVerse {
  verse_number: string;
  sanskrit?: string;           // Деванагарі - однаковий для UK та EN
  transliteration_en?: string; // IAST транслітерація (для англ. версії)
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string;
  source_url?: string;
}

interface Chapter {
  chapter_number: number;
  chapter_title?: string;
  verses: VedabaseVerse[];
}

interface VedabaseData {
  canto: number;
  chapters: Chapter[];
  fetched_at: string;
}

/**
 * Робить HTTP запит з правильними заголовками
 */
async function fetchWithHeaders(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.text();
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
 * Витягує контент з HTML сторінки vedabase
 */
function extractVedabaseContent(html: string): Omit<VedabaseVerse, 'verse_number' | 'source_url'> {
  const result: Omit<VedabaseVerse, 'verse_number' | 'source_url'> = {};

  try {
    // 1. САНСКРИТ/ДЕВАНАГАРІ - шукаємо av-devanagari або av-bengali блок
    // SB використовує av-devanagari, CC використовує av-bengali
    let devanagariMatch = html.match(/av-devanagari[^>]*>([\s\S]*?)<\/div>/i);
    if (!devanagariMatch) {
      devanagariMatch = html.match(/av-bengali[^>]*>([\s\S]*?)<\/div>/i);
    }

    if (devanagariMatch) {
      // Витягуємо деванагарі символи (Unicode range)
      const devanagariChars = devanagariMatch[1].match(/[\u0900-\u097F।॥\s]+/g);
      if (devanagariChars) {
        result.sanskrit = devanagariChars
          .map(s => s.trim())
          .filter(s => s.length > 5)
          .join('\n');
      }
    }

    // Fallback: шукаємо деванагарі символи в усьому HTML
    if (!result.sanskrit) {
      const fallbackMatch = html.match(/([\u0900-\u097F।॥\s]{20,})/g);
      if (fallbackMatch) {
        result.sanskrit = fallbackMatch
          .map(s => s.trim())
          .filter(s => s.length > 20)
          .join('\n');
      }
    }

    // 2. ТРАНСЛІТЕРАЦІЯ - av-verse_text блок
    const verseTextMatch = html.match(/av-verse_text[^>]*>([\s\S]*?)<\/div>/i);
    if (verseTextMatch) {
      // Видаляємо HTML теги і нормалізуємо пробіли
      const text = decodeHtmlEntities(
        verseTextMatch[1]
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
      ).trim();

      // Перевіряємо, що це IAST (має діакритику)
      if (text && /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]/.test(text)) {
        // Видаляємо "Verse text" префікс якщо є
        result.transliteration_en = text.replace(/^Verse text\s*/i, '').trim();
      }
    }

    // 3. СИНОНІМИ - av-synonyms блок
    const synonymsMatch = html.match(/<div[^>]*class="[^"]*av-synonyms[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (synonymsMatch) {
      // Витягуємо text-justify вміст
      const justifyMatch = synonymsMatch[1].match(/<div[^>]*class="[^"]*text-justify[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (justifyMatch) {
        const synonymsText = decodeHtmlEntities(
          justifyMatch[1]
            .replace(/<span[^>]*class="[^"]*inline[^"]*"[^>]*>/gi, '')
            .replace(/<\/span>/gi, '')
            .replace(/<br\s*\/?>/gi, '; ')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
        ).trim();

        if (synonymsText) {
          result.synonyms_en = synonymsText;
        }
      }
    }

    // 4. ПЕРЕКЛАД - av-translation блок
    const translationMatch = html.match(/av-translation[^>]*>([\s\S]*?)<\/div>/i);
    if (translationMatch) {
      // Видаляємо HTML теги та "Translation" префікс
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

    // 5. ПОЯСНЕННЯ - av-purport блок
    const purportMatch = html.match(/av-purport[^>]*>([\s\S]*?)<\/div>/i);
    if (purportMatch) {
      // Витягуємо всі параграфи
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

    // 6. СИНОНІМИ - av-synonyms блок
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

  } catch (error) {
    console.error('Parse error:', error);
  }

  return result;
}

/**
 * Затримка між запитами
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Парсить номер вірша та повертає масив номерів для завантаження
 * Наприклад: "2-7" -> [2, 3, 4, 5, 6, 7]
 */
function parseVerseNumbers(verseNum: string): number[] {
  // Пропускаємо нечислові вірші (ЗВЕРНЕННЯ тощо)
  if (!/^\d/.test(verseNum)) {
    return [];
  }

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
 * Завантажує та парсить один вірш
 */
async function fetchVerse(canto: number, chapter: number, verse: number): Promise<Omit<VedabaseVerse, 'verse_number'> | null> {
  const url = `https://vedabase.io/en/library/sb/${canto}/${chapter}/${verse}/`;

  try {
    console.log(`  Fetching ${url}...`);
    const html = await fetchWithHeaders(url);
    const content = extractVedabaseContent(html);

    return {
      ...content,
      source_url: url
    };
  } catch (error) {
    console.error(`  Error fetching verse ${chapter}.${verse}:`, error);
    return null;
  }
}

/**
 * Об'єднує контент кількох віршів (для об'єднаних віршів типу "2-7")
 */
function mergeVerseContent(verses: (Omit<VedabaseVerse, 'verse_number'> | null)[]): Omit<VedabaseVerse, 'verse_number' | 'source_url'> {
  const validVerses = verses.filter(v => v !== null) as Omit<VedabaseVerse, 'verse_number'>[];

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
  console.log(`Fetching SB Canto ${CANTO} from vedabase.io`);
  console.log('='.repeat(60));

  // Читаємо структуру з українського JSON
  const ukData = JSON.parse(fs.readFileSync(UK_JSON_FILE, 'utf-8'));

  const result: VedabaseData = {
    canto: CANTO,
    chapters: [],
    fetched_at: new Date().toISOString()
  };

  let totalVerses = 0;
  let successfulVerses = 0;

  for (const ukChapter of ukData.chapters) {
    const chapterNum = ukChapter.chapter_number;
    console.log(`\nChapter ${chapterNum}: ${ukChapter.chapter_title || ''}`);
    console.log('-'.repeat(40));

    const chapter: Chapter = {
      chapter_number: chapterNum,
      chapter_title: ukChapter.chapter_title,
      verses: []
    };

    for (const ukVerse of ukChapter.verses) {
      const verseNumStr = ukVerse.verse_number;
      const verseNumbers = parseVerseNumbers(verseNumStr);

      if (verseNumbers.length === 0) {
        console.log(`  Skipping non-verse: ${verseNumStr}`);
        continue;
      }

      totalVerses++;

      // Завантажуємо всі вірші з діапазону
      const fetchedVerses: (Omit<VedabaseVerse, 'verse_number'> | null)[] = [];

      for (const num of verseNumbers) {
        const verse = await fetchVerse(CANTO, chapterNum, num);
        fetchedVerses.push(verse);
        await delay(DELAY_MS);
      }

      // Об'єднуємо контент
      const merged = mergeVerseContent(fetchedVerses);

      if (Object.keys(merged).length > 0) {
        successfulVerses++;
        chapter.verses.push({
          verse_number: verseNumStr,
          ...merged,
          source_url: verseNumbers.length === 1
            ? `https://vedabase.io/en/library/sb/${CANTO}/${chapterNum}/${verseNumbers[0]}/`
            : `https://vedabase.io/en/library/sb/${CANTO}/${chapterNum}/${verseNumbers[0]}-${verseNumbers[verseNumbers.length - 1]}/`
        });
        console.log(`  ✓ Verse ${verseNumStr}: OK`);
      } else {
        console.log(`  ✗ Verse ${verseNumStr}: FAILED`);
      }
    }

    result.chapters.push(chapter);
  }

  // Зберігаємо результат
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`Done! ${successfulVerses}/${totalVerses} verses fetched`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
