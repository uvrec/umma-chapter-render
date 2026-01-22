/**
 * Парсер для українського PDF Шрімад-Бхаґаватам (Пісня 3)
 * Структура: ВІРШ N → Sanskrit → IAST (skip) → UA translit (skip) → synonyms (skip) → translation → ПОЯСНЕННЯ
 *
 * ВАЖЛИВО: Цей парсер витягує тільки Sanskrit, Translation_UK та Commentary_UK з PDF
 * Всі інші поля (transliteration_en, synonyms_en, etc.) повинні бути з Vedabase
 */

import { normalizeVerseField, convertIASTtoUkrainian } from '../textNormalizer';

export interface ParsedVerse {
  verse_number: string;
  sanskrit: string; // З PDF (Devanagari)
  transliteration_en: string; // З Vedabase (IAST)
  transliteration_uk: string; // Генерується з transliteration_en через convertIASTtoUkrainian
  synonyms_en: string; // З Vedabase (IAST)
  synonyms_uk: string; // Генерується з synonyms_en через convertIASTtoUkrainian
  translation_uk: string; // З PDF
  translation_en: string; // З Vedabase
  commentary_uk: string; // З PDF
  commentary_en: string; // З Vedabase
}

export interface ParsedChapter {
  canto_number: number;
  chapter_number: number;
  title_uk: string;
  title_en: string;
  verses: ParsedVerse[];
}

/**
 * Витягує номер глави з заголовка типу "ГЛАВА ВІСІМНАДЦЯТА"
 */
const CHAPTER_NAMES_UK: Record<string, number> = {
  'перша': 1,
  'друга': 2,
  'третя': 3,
  'четверта': 4,
  "п'ята": 5,
  'шоста': 6,
  'сьома': 7,
  'восьма': 8,
  "дев'ята": 9,
  'десята': 10,
  'одинадцята': 11,
  'дванадцята': 12,
  'тринадцята': 13,
  'чотирнадцята': 14,
  "п'ятнадцята": 15,
  'шістнадцята': 16,
  'сімнадцята': 17,
  'вісімнадцята': 18,
  "дев'ятнадцята": 19,
  'двадцята': 20,
  'двадцять перша': 21,
  'двадцять друга': 22,
  'двадцять третя': 23,
  'двадцять четверта': 24,
  "двадцять п'ята": 25,
  'двадцять шоста': 26,
  'двадцять сьома': 27,
  'двадцять восьма': 28,
  "двадцять дев'ята": 29,
  'тридцята': 30,
  'тридцять перша': 31,
  'тридцять друга': 32,
  'тридцять третя': 33,
};

function extractChapterNumber(title: string): number {
  const normalized = title.toLowerCase().trim();

  // Sort by length DESC to match longer names first
  // Це важливо бо "вісімнадцята" містить "сімнадцята" як підрядок
  const sortedEntries = Object.entries(CHAPTER_NAMES_UK).sort(
    (a, b) => b[0].length - a[0].length
  );

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
 * Визначає, чи рядок містить Devanagari або Bengali текст
 */
function isSanskritText(text: string): boolean {
  // Devanagari: U+0900-U+097F, Bengali: U+0980-U+09FF
  return /[\u0900-\u097F\u0980-\u09FF।॥]/.test(text);
}

/**
 * Визначає, чи рядок містить IAST транслітерацію (латиниця з діакритиками)
 */
function isIASTText(text: string): boolean {
  // Латиниця з діакритиками: āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ
  return /[a-zA-Z]/.test(text) && /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]/.test(text);
}

/**
 * Визначає, чи рядок містить українську транслітерацію (кирилиця з діакритиками)
 */
function isUkrainianTranslit(text: string): boolean {
  // Кирилиця з діакритиками
  return /[а-яґєії]/i.test(text) && /[а̄ӯīх̣м̇н̣т̣д̣ш́н̃н̇]/i.test(text);
}

/**
 * Розбиває текст на вірші за маркерами "ВІРШ N" або "ВІРШІ N-M"
 */
function splitIntoVerses(
  text: string
): Array<{ number: string; content: string }> {
  const verses: Array<{ number: string; content: string }> = [];

  // Regex для знаходження заголовків віршів
  const verseRegex = /ВІРШ[ІІI]?\s+(\d+(?:\s*[-–—]\s*\d+)?)/gi;

  const matches = [...text.matchAll(verseRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const verseNumber = match[1].replace(/\s+/g, ''); // "22-23" або "1"
    const startPos = match.index! + match[0].length;
    const endPos = i < matches.length - 1 ? matches[i + 1].index! : text.length;

    const content = text.substring(startPos, endPos).trim();
    verses.push({ number: verseNumber, content });
  }

  return verses;
}

/**
 * Парсить один вірш з українського PDF
 * ВАЖЛИВО: Тільки Sanskrit, Translation_UK та Commentary_UK з PDF
 * Все інше (IAST, synonyms_en, translation_en, commentary_en) буде з Vedabase
 *
 * Структура PDF:
 * 1. Sanskrit (Devanagari/Bengali) - БЕРЕМО
 * 2. IAST transliteration - пропускаємо
 * 3. UA transliteration - пропускаємо
 * 4. Synonyms (мають " – ") - пропускаємо
 * 5. Translation (починається з великої літери) - БЕРЕМО
 * 6. ПОЯСНЕННЯ: Commentary - БЕРЕМО
 */
function parseVerse(number: string, content: string): ParsedVerse {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let sanskrit = '';
  let translation_uk = '';
  let commentary_uk = '';

  let inSanskrit = true;
  let inTranslation = false;
  let inCommentary = false;

  for (const line of lines) {
    // Commentary marker (найвищий пріоритет)
    if (/^ПОЯСНЕННЯ\s*:/i.test(line)) {
      inCommentary = true;
      inTranslation = false;
      inSanskrit = false;
      continue;
    }

    // Sanskrit (Devanagari/Bengali)
    if (inSanskrit && isSanskritText(line)) {
      sanskrit += (sanskrit ? ' ' : '') + line;
      continue;
    }

    // Після Sanskrit переходимо до пошуку перекладу
    if (inSanskrit && !isSanskritText(line)) {
      inSanskrit = false;
    }

    // Переклад: рядок починається з великої літери, БЕЗ " – " на початку
    // і це НЕ синоніми (синоніми містять " – ")
    if (!inTranslation && !inCommentary && /^[А-ЯҐЄІЇ]/.test(line)) {
      // Перевірка: це не синоніми (синоніми мають " – " в першій половині рядка)
      const firstHalf = line.length > 10 ? line.substring(0, line.length / 2) : line;
      if (!firstHalf.includes(' – ')) {
        inTranslation = true;
      }
    }

    // Збирання тексту
    if (inTranslation) {
      translation_uk += (translation_uk ? ' ' : '') + line;
    } else if (inCommentary) {
      commentary_uk += (commentary_uk ? ' ' : '') + line;
    }
  }

  // Нормалізація тільки того, що парсили з PDF
  sanskrit = normalizeVerseField(sanskrit, 'sanskrit');
  translation_uk = normalizeVerseField(translation_uk, 'translation');
  commentary_uk = normalizeVerseField(commentary_uk, 'commentary');

  return {
    verse_number: number,
    sanskrit,
    transliteration_en: '', // Буде з Vedabase
    transliteration_uk: '', // Буде згенеровано з transliteration_en
    synonyms_en: '', // Буде з Vedabase
    synonyms_uk: '', // Буде згенеровано з synonyms_en
    translation_uk,
    translation_en: '', // Буде з Vedabase
    commentary_uk,
    commentary_en: '', // Буде з Vedabase
  };
}

/**
 * Парсить главу з PDF тексту
 */
export function parseChapterFromPDF(
  pdfText: string,
  cantoNumber: number
): ParsedChapter | null {
  // Знаходимо заголовок глави (тільки назва глави, без підзаголовка)
  const chapterHeaderRegex = /ГЛАВА\s+([А-ЯҐЄІЇ' ]+?)(?:\n|$)/im;
  const match = pdfText.match(chapterHeaderRegex);

  if (!match) {
    console.error('❌ Chapter header not found');
    return null;
  }

  const chapterTitle = match[1].trim();
  const chapterNumber = extractChapterNumber(chapterTitle);

  if (!chapterNumber) {
    console.error('❌ Could not extract chapter number from:', chapterTitle);
    return null;
  }

  console.log(`📖 Found chapter: ${chapterNumber} - ${chapterTitle}`);

  // Розбиваємо на вірші
  const verseBlocks = splitIntoVerses(pdfText);
  console.log(`📝 Found ${verseBlocks.length} verses`);

  // Парсимо кожен вірш
  const verses: ParsedVerse[] = [];
  for (const block of verseBlocks) {
    try {
      const verse = parseVerse(block.number, block.content);
      verses.push(verse);
      console.log(`✅ Parsed verse ${block.number}`);
    } catch (error) {
      console.error(`❌ Failed to parse verse ${block.number}:`, error);
    }
  }

  return {
    canto_number: cantoNumber,
    chapter_number: chapterNumber,
    title_uk: chapterTitle,
    title_en: '', // Заповниться з Vedabase
    verses,
  };
}

/**
 * Парсить всі глави з PDF тексту (для книги з кількома главами)
 */
export function parseAllChaptersFromPDF(
  pdfText: string,
  cantoNumber: number
): ParsedChapter[] {
  const chapters: ParsedChapter[] = [];

  // Розбиваємо текст на глави за заголовками (тільки назва глави, без підзаголовка)
  const chapterRegex = /ГЛАВА\s+([А-ЯҐЄІЇ' ]+?)(?:\n|$)/gim;
  const matches = [...pdfText.matchAll(chapterRegex)];

  for (let i = 0; i < matches.length; i++) {
    const startPos = matches[i].index!;
    const endPos =
      i < matches.length - 1 ? matches[i + 1].index! : pdfText.length;

    const chapterText = pdfText.substring(startPos, endPos);
    const chapter = parseChapterFromPDF(chapterText, cantoNumber);

    if (chapter) {
      chapters.push(chapter);
    }
  }

  return chapters;
}
