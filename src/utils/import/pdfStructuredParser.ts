/**
 * Структурований парсер PDF для ведичних текстів
 *
 * Розпізнає та витягує структуровані блоки:
 * - Санскрит (Devanagari)
 * - Транслітерація (IAST з діакритикою)
 * - Синоніми (Synonyms)
 * - Переклад (Translation)
 * - Пояснення (Commentary)
 */

export interface StructuredVerse {
  verse_number: string;
  sanskrit?: string;
  transliteration?: string;
  transliteration_en?: string;
  transliteration_ua?: string;
  synonyms_en?: string;
  synonyms_ua?: string;
  translation_en?: string;
  translation_ua?: string;
  commentary_en?: string;
  commentary_ua?: string;
}

/**
 * Перевіряє чи є текст санскритом (Devanagari)
 */
function isDevanagari(text: string): boolean {
  // Unicode range для Devanagari: U+0900-U+097F
  const devanagariRegex = /[\u0900-\u097F]/;
  return devanagariRegex.test(text);
}

/**
 * Перевіряє чи є текст бенгальським письмом
 */
function isBengali(text: string): boolean {
  // Unicode range для Bengali: U+0980-U+09FF
  const bengaliRegex = /[\u0980-\u09FF]/;
  return bengaliRegex.test(text);
}

/**
 * Перевіряє чи містить текст IAST діакритику
 */
function hasIASTDiacritics(text: string): boolean {
  // IAST використовує спеціальні символи: ā ī ū ṛ ṝ ḷ ḹ ṃ ṅ ñ ṭ ḍ ṇ ś ṣ
  const iastRegex = /[āīūṛṝḷḹṃṅñṭḍṇśṣ]/i;
  return iastRegex.test(text);
}

/**
 * Витягує номер вірша з тексту
 */
function extractVerseNumber(text: string): string | null {
  // Патерни для номерів віршів:
  // "Verse 1", "Verses 22-23", "Текст 1", "Вірш 1", або просто "1"
  const patterns = [
    /(?:Verse|Verses|Текст|Вірш|Вірші)\s+(\d+(?:-\d+)?)/i,
    /^\s*(\d+(?:-\d+)?)\s*$/,
    /ТЕКСТ\s+(\d+(?:-\d+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Визначає тип блоку за текстом
 */
function detectBlockType(text: string): 'sanskrit' | 'transliteration' | 'synonyms' | 'translation' | 'commentary' | 'unknown' {
  const trimmed = text.trim();

  // Перевіряємо маркери
  if (/^(?:SYNONYMS?|СИНОНІМИ):/i.test(trimmed)) {
    return 'synonyms';
  }
  if (/^(?:TRANSLATION|ПЕРЕКЛАД):/i.test(trimmed)) {
    return 'translation';
  }
  if (/^(?:PURPORT|COMMENTARY|ПОЯСНЕННЯ):/i.test(trimmed)) {
    return 'commentary';
  }

  // Перевіряємо скрипт
  if (isDevanagari(trimmed) || isBengali(trimmed)) {
    return 'sanskrit';
  }

  // Перевіряємо IAST транслітерацію
  if (hasIASTDiacritics(trimmed) && trimmed.length < 300) {
    return 'transliteration';
  }

  return 'unknown';
}

/**
 * Очищує текст від артефактів PDF
 */
function cleanPDFText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Нормалізуємо пробіли
    .replace(/\u00AD/g, '') // Видаляємо soft hyphens
    .replace(/\uFEFF/g, '') // Видаляємо zero-width no-break space
    .trim();
}

/**
 * Розпізнає мову тексту (en/ua)
 */
function detectLanguage(text: string): 'en' | 'uk' {
  // Українські літери
  const ukrainianRegex = /[а-яіїєґА-ЯІЇЄҐ]/;
  return ukrainianRegex.test(text) ? 'uk' : 'en';
}

/**
 * Парсить структуровані блоки з масиву рядків
 */
export function parseStructuredVerses(lines: string[]): StructuredVerse[] {
  const verses: StructuredVerse[] = [];
  let currentVerse: Partial<StructuredVerse> | null = null;
  let currentBlockType: string | null = null;
  let currentBlockText: string[] = [];

  const saveBlock = () => {
    if (!currentVerse || !currentBlockType || currentBlockText.length === 0) return;

    const blockText = cleanPDFText(currentBlockText.join(' '));
    const lang = detectLanguage(blockText);

    switch (currentBlockType) {
      case 'sanskrit':
        currentVerse.sanskrit = blockText;
        break;
      case 'transliteration':
        if (lang === 'uk') {
          currentVerse.transliteration_ua = blockText;
        } else {
          currentVerse.transliteration_en = blockText;
        }
        // Зберігаємо основну транслітерацію
        if (!currentVerse.transliteration) {
          currentVerse.transliteration = blockText;
        }
        break;
      case 'synonyms':
        if (lang === 'uk') {
          currentVerse.synonyms_ua = blockText;
        } else {
          currentVerse.synonyms_en = blockText;
        }
        break;
      case 'translation':
        if (lang === 'uk') {
          currentVerse.translation_ua = blockText;
        } else {
          currentVerse.translation_en = blockText;
        }
        break;
      case 'commentary':
        if (lang === 'uk') {
          currentVerse.commentary_ua = blockText;
        } else {
          currentVerse.commentary_en = blockText;
        }
        break;
    }

    currentBlockText = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Перевіряємо чи це новий вірш
    const verseNum = extractVerseNumber(trimmed);
    if (verseNum) {
      // Зберігаємо попередній блок
      saveBlock();

      // Зберігаємо попередній вірш
      if (currentVerse && currentVerse.verse_number) {
        verses.push(currentVerse as StructuredVerse);
      }

      // Починаємо новий вірш
      currentVerse = { verse_number: verseNum };
      currentBlockType = null;
      console.log(`📖 Знайдено вірш: ${verseNum}`);
      continue;
    }

    // Якщо немає поточного вірша, пропускаємо
    if (!currentVerse) continue;

    // Визначаємо тип блоку
    const blockType = detectBlockType(trimmed);

    // Якщо це маркер нового блоку
    if (blockType !== 'unknown' && blockType !== currentBlockType) {
      // Зберігаємо попередній блок
      saveBlock();

      // Починаємо новий блок
      currentBlockType = blockType;
      console.log(`  📌 Тип блоку: ${blockType}`);

      // Видаляємо маркер з тексту
      const cleanedLine = trimmed
        .replace(/^(?:SYNONYMS?|СИНОНІМИ):\s*/i, '')
        .replace(/^(?:TRANSLATION|ПЕРЕКЛАД):\s*/i, '')
        .replace(/^(?:PURPORT|COMMENTARY|ПОЯСНЕННЯ):\s*/i, '');

      if (cleanedLine) {
        currentBlockText.push(cleanedLine);
      }
    } else {
      // Продовжуємо поточний блок
      currentBlockText.push(trimmed);
    }
  }

  // Зберігаємо останній блок та вірш
  saveBlock();
  if (currentVerse && currentVerse.verse_number) {
    verses.push(currentVerse as StructuredVerse);
  }

  console.log(`✅ Розпізнано ${verses.length} віршів`);
  return verses;
}

/**
 * Експортує вірші у форматі для збереження в БД
 */
export function exportForDatabase(verses: StructuredVerse[]) {
  return {
    verses: verses.map(v => ({
      ...v,
      // Додаємо fallback значення
      transliteration: v.transliteration || v.transliteration_en || v.transliteration_ua || '',
      translation_en: v.translation_en || '',
      translation_ua: v.translation_ua || '',
      commentary_en: v.commentary_en || '',
      commentary_ua: v.commentary_ua || '',
    })),
    summary: {
      total: verses.length,
      hasTransliteration: verses.filter(v => v.transliteration || v.transliteration_en).length,
      hasSynonyms: verses.filter(v => v.synonyms_en || v.synonyms_ua).length,
      hasCommentary: verses.filter(v => v.commentary_en || v.commentary_ua).length,
    }
  };
}
