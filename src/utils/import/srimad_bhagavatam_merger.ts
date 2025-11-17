/**
 * Об'єднання українських даних з EPUB та англійських даних з Vedabase
 * для Śrīmad-Bhāgavatam
 */

import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

/**
 * Об'єднує українську главу з EPUB та англійську главу з Vedabase
 */
export function mergeSBChapters(
  uaChapter: ParsedChapter,
  enChapter: ParsedChapter | null
): ParsedChapter {
  if (!enChapter) {
    // Якщо немає EN, повертаємо тільки UA
    return uaChapter;
  }

  // Об'єднуємо вірші по verse_number
  const mergedVerses: ParsedVerse[] = [];

  // Створюємо мапу EN віршів для швидкого пошуку
  const enVersesMap = new Map<string, ParsedVerse>();
  for (const verse of enChapter.verses) {
    enVersesMap.set(verse.verse_number, verse);
  }

  // Об'єднуємо UA вірші з EN
  for (const uaVerse of uaChapter.verses) {
    const enVerse = enVersesMap.get(uaVerse.verse_number);

    const merged: ParsedVerse = {
      verse_number: uaVerse.verse_number,

      // Sanskrit - беремо з UA (EPUB має краще якість Devanagari)
      sanskrit: uaVerse.sanskrit || enVerse?.sanskrit || '',

      // Transliteration UA - з EPUB
      transliteration_ua: uaVerse.transliteration_ua || '',

      // Transliteration EN - з Vedabase
      transliteration_en: enVerse?.transliteration_en || '',

      // Synonyms UA - з EPUB
      synonyms_ua: uaVerse.synonyms_ua || '',

      // Synonyms EN - з Vedabase
      synonyms_en: enVerse?.synonyms_en || '',

      // Translation UA - з EPUB
      translation_ua: uaVerse.translation_ua || '',

      // Translation EN - з Vedabase
      translation_en: enVerse?.translation_en || '',

      // Commentary UA - з EPUB
      commentary_ua: uaVerse.commentary_ua || '',

      // Commentary EN - з Vedabase
      commentary_en: enVerse?.commentary_en || '',
    };

    mergedVerses.push(merged);
  }

  // Додаємо вірші які є тільки в EN (якщо такі є)
  for (const enVerse of enChapter.verses) {
    if (!uaChapter.verses.find(v => v.verse_number === enVerse.verse_number)) {
      mergedVerses.push({
        verse_number: enVerse.verse_number,
        sanskrit: enVerse.sanskrit || '',
        transliteration_en: enVerse.transliteration_en || '',
        synonyms_en: enVerse.synonyms_en || '',
        translation_en: enVerse.translation_en || '',
        commentary_en: enVerse.commentary_en || '',
        transliteration_ua: '',
        synonyms_ua: '',
        translation_ua: '',
        commentary_ua: '',
      });
    }
  }

  return {
    chapter_number: uaChapter.chapter_number,
    chapter_type: "verses",
    title_ua: uaChapter.title_ua || '',
    title_en: enChapter.title_en || '',
    verses: mergedVerses,
  };
}
