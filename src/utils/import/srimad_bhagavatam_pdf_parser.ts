/**
 * Парсер для українського PDF Шрімад-Бхаґаватам (Пісня 3)
 * Структура: ВІРШ N → Sanskrit → IAST (skip) → UA translit (skip) → synonyms (skip) → translation → ПОЯСНЕННЯ
 *
 * ВАЖЛИВО: Цей парсер витягує тільки Sanskrit, Translation_UA та Commentary_UA з PDF
 * Всі інші поля (transliteration_en, synonyms_en, etc.) повинні бути з Vedabase
 */

import { normalizeVerseField, convertIASTtoUkrainian } from '../textNormalizer';

export interface ParsedVerse {
  verse_number: string;
  sanskrit: string; // З PDF (Devanagari)
  transliteration_en: string; // З Vedabase (IAST)
  transliteration_ua: string; // Генерується з transliteration_en через convertIASTtoUkrainian
  synonyms_en: string; // З Vedabase (IAST)
  synonyms_ua: string; // Генерується з synonyms_en через convertIASTtoUkrainian
  translation_ua: string; // З PDF
  translation_en: string; // З Vedabase
  commentary_ua: string; // З PDF
  commentary_en: string; // З Vedabase
}

export interface ParsedChapter {
  canto_number: number;
  chapter_number: number;
  title_ua: string;
  title_en: string;
  verses: ParsedVerse[];
}

/**
 * Витягує номер глави з заголовка типу "ГЛАВА ВІСІМНАДЦЯТА"
 */
const CHAPTER_NAMES_UA: Record<string, number> = {
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

  for (const [name, num] of Object.entries(CHAPTER_NAMES_UA)) {
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
 * ВАЖЛИВО: Тільки Sanskrit, Translation_UA та Commentary_UA з PDF
 * Все інше (IAST, synonyms_en, translation_en, commentary_en) буде з Vedabase
 */
function parseVerse(number: string, content: string): ParsedVerse {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let sanskrit = '';
  let translation_ua = '';
  let commentary_ua = '';

  let currentSection: 'sanskrit' | 'skip' | 'translation' | 'commentary' =
    'sanskrit';
  let translationStarted = false;

  for (const line of lines) {
    // 1. Sanskrit (Devanagari/Bengali) - береємо тільки це
    if (isSanskritText(line) && currentSection === 'sanskrit') {
      sanskrit += (sanskrit ? ' ' : '') + line;
      continue;
    }

    // 2. IAST transliteration - ПРОПУСКАЄМО (буде з Vedabase)
    if (isIASTText(line) && !translationStarted) {
      currentSection = 'skip';
      continue;
    }

    // 3. Українська транслітерація - ПРОПУСКАЄМО (генерується з Vedabase IAST)
    if (isUkrainianTranslit(line) && !translationStarted) {
      currentSection = 'skip';
      continue;
    }

    // 4. Синоніми - ПРОПУСКАЄМО (будуть з Vedabase)
    if (line.includes(' – ') && currentSection !== 'commentary') {
      currentSection = 'skip';
      continue;
    }

    // 5. Переклад починається з великої літери після пропущених секцій
    if (!translationStarted && /^[А-ЯҐЄІЇ]/.test(line)) {
      currentSection = 'translation';
      translationStarted = true;
    }

    // 6. Маркер ПОЯСНЕННЯ:
    if (/^ПОЯСНЕННЯ\s*:/i.test(line)) {
      currentSection = 'commentary';
      continue;
    }

    // 7. Наповнення секцій
    if (currentSection === 'translation' && !line.startsWith('ПОЯСНЕННЯ')) {
      translation_ua += (translation_ua ? ' ' : '') + line;
    } else if (currentSection === 'commentary') {
      commentary_ua += (commentary_ua ? ' ' : '') + line;
    }
  }

  // Нормалізація тільки того, що парсили з PDF
  sanskrit = normalizeVerseField(sanskrit, 'sanskrit');
  translation_ua = normalizeVerseField(translation_ua, 'translation');
  commentary_ua = normalizeVerseField(commentary_ua, 'commentary');

  return {
    verse_number: number,
    sanskrit,
    transliteration_en: '', // Буде з Vedabase
    transliteration_ua: '', // Буде згенеровано з transliteration_en
    synonyms_en: '', // Буде з Vedabase
    synonyms_ua: '', // Буде згенеровано з synonyms_en
    translation_ua,
    translation_en: '', // Буде з Vedabase
    commentary_ua,
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
  // Знаходимо заголовок глави
  const chapterHeaderRegex = /ГЛАВА\s+([А-ЯҐЄІЇ'\s]+)/i;
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
    title_ua: chapterTitle,
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

  // Розбиваємо текст на глави за заголовками
  const chapterRegex = /ГЛАВА\s+[А-ЯҐЄІЇ'\s]+/gi;
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
