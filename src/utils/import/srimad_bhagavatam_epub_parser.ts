/**
 * Парсер EPUB для Śrīmad-Bhāgavatam
 * Портовано з Python версії import_sb_epub.py
 */

import { parseVerseNumber } from "@/utils/vedabaseParsers";
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

// Словник українських назв глав
const CHAPTER_NAMES_UA: Record<string, number> = {
  'перша': 1, 'друга': 2, 'третя': 3, 'четверта': 4, "п'ята": 5,
  'шоста': 6, 'сьома': 7, 'восьма': 8, "дев'ята": 9, 'десята': 10,
  'одинадцята': 11, 'дванадцята': 12, 'тринадцята': 13, 'чотирнадцята': 14,
  "п'ятнадцята": 15, 'шістнадцята': 16, 'сімнадцята': 17, 'вісімнадцята': 18,
  "дев'ятнадцята": 19, 'двадцята': 20,
  // Compound forms with "Ь" (двадцять)
  'двадцять перша': 21, 'двадцять друга': 22, 'двадцять третя': 23,
  'двадцять четверта': 24, "двадцять п'ята": 25, 'двадцять шоста': 26,
  'двадцять сьома': 27, 'двадцять восьма': 28, "двадцять дев'ята": 29,
  // Compound forms with "А" (двадцята) - as they appear in EPUB
  'двадцята перша': 21, 'двадцята друга': 22, 'двадцята третя': 23,
  'двадцята четверта': 24, "двадцята п'ята": 25, 'двадцята шоста': 26,
  'двадцята сьома': 27, 'двадцята восьма': 28, "двадцята дев'ята": 29,
  // 30+
  'тридцята': 30,
  'тридцять перша': 31, 'тридцять друга': 32, 'тридцять третя': 33,
  'тридцята перша': 31, 'тридцята друга': 32, 'тридцята третя': 33,
};

/**
 * Витягує номер глави з заголовка типу 'СІМНАДЦЯТА'
 */
function extractChapterNumber(title: string): number {
  let normalized = title.toLowerCase().trim();

  // Normalize all apostrophe variants to ASCII apostrophe
  // U+2019 ('), U+0027 ('), U+02BC (ʼ) → '
  normalized = normalized.replace(/[\u2019\u02BC]/g, "'");

  // Sort by length DESC to match longer names first
  // Це важливо бо "вісімнадцята" містить "сімнадцята" як підрядок
  const sortedEntries = Object.entries(CHAPTER_NAMES_UA).sort((a, b) => b[0].length - a[0].length);

  for (const [name, num] of sortedEntries) {
    if (normalized.includes(name)) {
      return num;
    }
  }

  // Якщо не знайдено, спробувати числа
  const match = title.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

/**
 * Визначає, чи містить текст Devanagari або Bengali
 */
function isSanskritText(text: string): boolean {
  return /[\u0900-\u097F\u0980-\u09FF।॥]/.test(text);
}

/**
 * Нормалізує текст: прибирає зайві пробіли, об'єднує рядки
 */
function normalizeText(text: string): string {
  // Замінити multiple spaces на один
  text = text.replace(/\s+/g, ' ');
  // Прибрати пробіли на початку/кінці
  text = text.trim();
  // Прибрати пробіли перед розділовими знаками
  text = text.replace(/\s+([.,;:!?])/g, '$1');
  return text;
}

/**
 * Парсить вірш з HTML блоку
 *
 * Структура EPUB:
 * 1. Sanskrit (Devanagari) - беремо
 * 2. Transliteration UA (IAST українською) - беремо
 * 3. "Послівний переклад" - synonyms UA - беремо
 * 4. "Переклад" - translation UA - беремо
 * 5. "Пояснення" - commentary UA - беремо
 */
function parseVerseFromHTML(verseHTML: string, verseNumber: string): ParsedVerse {
  const lines = verseHTML.split('\n').map(l => l.trim()).filter(l => l);

  let sanskrit = '';
  let transliterationUA = '';
  let synonymsUA = '';
  let translationUA = '';
  let commentaryUA = '';

  let state: 'sanskrit' | 'translit' | 'synonyms' | 'translation' | 'commentary' = 'sanskrit';

  for (const line of lines) {
    // Пропустити маркери віршів
    if (/^(Вірш|Текст|TEXT)\s+\d+/i.test(line)) {
      continue;
    }

    // Маркери секцій (підтримка кількох варіантів підписів)
    if (/^(Послівний переклад|Синоніми|Synonyms)\b/i.test(line)) {
      state = 'synonyms';
      continue;
    }
    if (/^(Переклад\:?|Translation\:?)/i.test(line)) {
      state = 'translation';
      continue;
    }
    if (/^(Пояснення|Коментар|Коментарій|Purport)\b/i.test(line)) {
      state = 'commentary';
      continue;
    }

    // Збирання тексту
    if (state === 'sanskrit' && isSanskritText(line)) {
      sanskrit += (sanskrit ? ' ' : '') + line;
    } else if (state === 'sanskrit' && !isSanskritText(line)) {
      // Після Sanskrit йде transliteration або одразу переклад
      state = 'translit';
      transliterationUA += (transliterationUA ? ' ' : '') + line;
    } else if (state === 'translit') {
      transliterationUA += (transliterationUA ? ' ' : '') + line;
    } else if (state === 'synonyms') {
      synonymsUA += (synonymsUA ? ' ' : '') + line;
    } else if (state === 'translation') {
      translationUA += (translationUA ? ' ' : '') + line;
    } else if (state === 'commentary') {
      commentaryUA += (commentaryUA ? ' ' : '') + line;
    }
  }

  // Нормалізація
  sanskrit = normalizeText(sanskrit);
  transliterationUA = normalizeText(transliterationUA);
  synonymsUA = normalizeText(synonymsUA);
  translationUA = normalizeText(translationUA);
  commentaryUA = normalizeText(commentaryUA);

  return {
    verse_number: verseNumber,
    sanskrit,
    transliteration_ua: transliterationUA,
    synonyms_ua: synonymsUA,
    translation_ua: translationUA,
    commentary_ua: commentaryUA,
    transliteration_en: '',  // Буде з Vedabase
    synonyms_en: '',         // Буде з Vedabase
    translation_en: '',      // Буде з Vedabase
    commentary_en: '',       // Буде з Vedabase
  };
}

/**
 * Парсить одну главу з EPUB HTML тексту
 */
export function parseChapterFromEPUBHTML(html: string, cantoNumber: number): ParsedChapter | null {
  // Знайти заголовок глави (після слова "Глава" до кінця рядка)
  const titleMatch = html.match(/глава\s+(.+?)(?:\n|$)/i);
  if (!titleMatch) {
    console.error('❌ Chapter title not found in HTML');
    return null;
  }

  // Початкове значення — те, що йде після слова "Глава"
  let rawTitle = titleMatch[1].trim();
  let chapterNumber = extractChapterNumber(rawTitle);

  // Якщо в заголовку лише число (наприклад, "1"), беремо наступний нефункціональний рядок як справжню назву
  if (/^\d+$/.test(rawTitle) || rawTitle.length <= 3) {
    const startIndex = (titleMatch.index ?? 0) + titleMatch[0].length;
    const after = html.slice(startIndex);
    const nextTitleLine = after
      .split('\n')
      .map(l => l.trim())
      .find(l => l && !/^(Вірш|Текст|TEXT)\s+\d+/i.test(l)) || '';
    if (nextTitleLine) {
      rawTitle = nextTitleLine;
    }
  }

  // Прибрати можливі розділові знаки на початку та нормалізувати регістр
  let titleUA = rawTitle.replace(/^[\-:–—]\s*/, '').trim().toUpperCase();
  // Перерахувати номер глави, якщо раніше не визначився
  chapterNumber = chapterNumber || extractChapterNumber(titleUA);

  console.log(`📖 Found chapter: ${chapterNumber} - ${titleUA}`);

  // Розбити на вірші
  const versePattern = /Вірш\s+(\d+(?:\s*[-–—]\s*\d+)?)/gi;
  const verseMatches = Array.from(html.matchAll(versePattern));

  const verses: ParsedVerse[] = [];

  for (let i = 0; i < verseMatches.length; i++) {
    const match = verseMatches[i];
    const verseNumber = match[1].replace(/\s/g, '');  // "22-23" або "1"
    const startPos = match.index! + match[0].length;
    const endPos = i < verseMatches.length - 1 ? verseMatches[i + 1].index! : html.length;

    const verseHTML = html.substring(startPos, endPos);

    try {
      const verse = parseVerseFromHTML(verseHTML, verseNumber);
      verses.push(verse);
      console.log(`✅ Parsed verse ${verseNumber}`);
    } catch (err) {
      console.error(`❌ Failed to parse verse ${verseNumber}:`, err);
    }
  }

  return {
    chapter_number: chapterNumber,
    chapter_type: "verses",
    title_ua: titleUA,
    title_en: '',  // Буде з Vedabase
    verses,
  };
}

/**
 * Знаходить XHTML файл глави за її номером
 * Формат: UKS{canto}{chapter:02d}XT.xhtml
 */
export function findChapterFileName(cantoNumber: number, chapterNumber: number): string {
  return `UKS${cantoNumber}${chapterNumber.toString().padStart(2, '0')}XT.xhtml`;
}

/**
 * Парсить всі глави з EPUB
 * @param epubHTML - HTML контент з EPUB (витягнутий через extractHTMLFromEPUB)
 * @param cantoNumber - номер пісні (2 або 3)
 * @param chapterRange - діапазон глав, наприклад "1-10" або "17"
 */
export function parseSrimadBhagavatamEPUB(
  epubHTML: string,
  cantoNumber: number,
  chapterRange: string
): ParsedChapter[] {
  console.log(`🔍 Parsing Śrīmad-Bhāgavatam Canto ${cantoNumber}, chapters ${chapterRange}`);

  // Парсинг діапазону глав
  let startChapter: number, endChapter: number;
  if (chapterRange.includes('-')) {
    const [start, end] = chapterRange.split('-').map(s => parseInt(s.trim()));
    startChapter = start;
    endChapter = end;
  } else {
    startChapter = endChapter = parseInt(chapterRange);
  }

  // EPUB містить всі глави в одному HTML, розбити по chapter markers
  const chapterPattern = /глава\s+(.+?)(?=глава\s+|$)/gis;
  const chapterMatches = Array.from(epubHTML.matchAll(chapterPattern));

  const chapters: ParsedChapter[] = [];

  for (const match of chapterMatches) {
    const chapterHTML = match[0];
    const chapter = parseChapterFromEPUBHTML(chapterHTML, cantoNumber);

    if (chapter && chapter.chapter_number >= startChapter && chapter.chapter_number <= endChapter) {
      chapters.push(chapter);
    }
  }

  console.log(`✅ Parsed ${chapters.length} chapters`);
  return chapters;
}
