// src/utils/import/webImporter.ts
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

/**
 * Витягує текст з HTML елемента за селектором
 */
function extractText(html: string, selector: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const element = doc.querySelector(selector);
  return element?.textContent?.trim() || "";
}

/**
 * Витягує всі вірші з HTML сторінки Vedabase
 * Vedabase має структуру: кожен вірш це окремий блок з класами
 */
function parseVedabaseHTML(html: string): Map<string, VedabaseVerse> {
  console.log("[webImporter] Parsing Vedabase HTML");
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const verses = new Map<string, VedabaseVerse>();

  // Шукаємо всі віршові блоки
  // Vedabase використовує різні класи залежно від книги
  const verseBlocks = doc.querySelectorAll('.r, .verse, [class*="verse-"]');

  console.log(`[webImporter] Found ${verseBlocks.length} verse blocks in Vedabase`);

  verseBlocks.forEach((block, index) => {
    const verseNum = (index + 1).toString();

    // Шукаємо бенгалі/санскрит текст
    const bengaliEl = block.querySelector('.d, .devanagari, .bengali, [class*="sanskrit"]');
    const bengali = bengaliEl?.textContent?.trim() || "";

    // Шукаємо транслітерацію
    const translitEl = block.querySelector('.v, .verse-text, [class*="translit"]');
    const transliteration = translitEl?.textContent?.trim() || "";

    // Шукаємо синоніми
    const synonymsEl = block.querySelector(".w, .word-for-word, .synonyms");
    const synonyms = synonymsEl?.textContent?.trim() || "";

    // Шукаємо переклад
    const translationEl = block.querySelector(".t, .translation");
    const translation = translationEl?.textContent?.trim() || "";

    // Шукаємо коментар
    const commentaryEl = block.querySelector(".p, .purport, .commentary");
    const commentary = commentaryEl?.textContent?.trim() || "";

    if (bengali || transliteration || translation) {
      verses.set(verseNum, {
        verseNumber: verseNum,
        bengali,
        transliteration,
        synonyms,
        translation,
        commentary,
      });
      console.log(`[webImporter] Vedabase verse ${verseNum}:`, {
        bengali: bengali.substring(0, 50),
        transliteration: transliteration.substring(0, 50),
      });
    }
  });

  // Якщо не знайшли жодного вірша, спробуємо альтернативний метод
  if (verses.size === 0) {
    console.log("[webImporter] No verses found with standard selectors, trying alternative method");

    // Шукаємо текст який містить характерні маркери віршів
    const bodyText = doc.body.textContent || "";

    // Vedabase часто має TEXT 1, TEXT 2 тощо
    const textMatches = bodyText.matchAll(/TEXT\s+(\d+)/gi);
    const verseNumbers = Array.from(textMatches).map((m) => m[1]);

    console.log(`[webImporter] Found ${verseNumbers.length} verse numbers via TEXT pattern`);

    verseNumbers.forEach((num) => {
      verses.set(num, {
        verseNumber: num,
        bengali: "",
        transliteration: "",
        synonyms: "",
        translation: "",
        commentary: "",
      });
    });
  }

  return verses;
}

/**
 * Витягує всі вірші з HTML сторінки Gitabase
 */
function parseGitabaseHTML(html: string): Map<string, GitabaseVerse> {
  console.log("[webImporter] Parsing Gitabase HTML");
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const verses = new Map<string, GitabaseVerse>();

  // Gitabase має структуру з текстами віршів
  const bodyText = doc.body.textContent || "";

  // Шукаємо вірші за патерном [Текст 1], [Текст 2] тощо
  const verseMatches = Array.from(bodyText.matchAll(/\[?Текст\*?\s*(\d+)\]?[:\s]*([^[]+?)(?=\[?Текст\*?\s*\d+|$)/gis));

  console.log(`[webImporter] Found ${verseMatches.length} verses in Gitabase`);

  verseMatches.forEach((match) => {
    const verseNum = match[1];
    const content = match[2].trim();

    // Розділяємо переклад і коментар
    // Переклад зазвичай виділений жирним або в лапках
    const translationMatch = content.match(/^[«"]?(.+?)[»"]?\s*[\.—]/);
    const translation = translationMatch ? translationMatch[1].trim() : content.split(".")[0].trim();

    // Коментар - все що після перекладу
    const commentary = content.substring(translation.length).trim();

    verses.set(verseNum, {
      verseNumber: verseNum,
      translation,
      commentary,
    });

    console.log(`[webImporter] Gitabase verse ${verseNum}:`, {
      translation: translation.substring(0, 50),
      commentary: commentary.substring(0, 50),
    });
  });

  return verses;
}

interface VedabaseVerse {
  verseNumber: string;
  bengali?: string;
  transliteration?: string;
  synonyms?: string;
  translation?: string;
  commentary?: string;
}

interface GitabaseVerse {
  verseNumber: string;
  translation?: string;
  commentary?: string;
}

/**
 * Об'єднує дані з обох джерел в один ParsedVerse
 */
function mergeVerseData(
  vedabaseVerse: VedabaseVerse | undefined,
  gitabaseVerse: GitabaseVerse | undefined,
  verseNum: string,
): ParsedVerse {
  return {
    verse_number: verseNum,
    sanskrit: vedabaseVerse?.bengali || "",
    transliteration: vedabaseVerse?.transliteration || "",
    synonyms_en: vedabaseVerse?.synonyms || "",
    synonyms_ua: "", // Gitabase не має пословного перекладу
    translation_en: vedabaseVerse?.translation || "",
    translation_ua: gitabaseVerse?.translation || "",
    commentary_en: vedabaseVerse?.commentary || "",
    commentary_ua: gitabaseVerse?.commentary || "",
  };
}

/**
 * Парсить повну главу з HTML контенту обох сайтів
 */
export async function parseChapterFromWeb(
  vedabaseHTML: string,
  gitabaseHTML: string,
  chapterNumber: number,
  chapterTitleUa: string,
  chapterTitleEn: string,
): Promise<ParsedChapter> {
  console.log("[webImporter] Starting chapter parsing");
  console.log("[webImporter] Vedabase HTML length:", vedabaseHTML.length);
  console.log("[webImporter] Gitabase HTML length:", gitabaseHTML.length);

  // Парсимо обидва джерела
  const vedabaseVerses = parseVedabaseHTML(vedabaseHTML);
  const gitabaseVerses = parseGitabaseHTML(gitabaseHTML);

  // Об'єднуємо всі унікальні номери віршів
  const allVerseNumbers = new Set<string>();
  vedabaseVerses.forEach((_, num) => allVerseNumbers.add(num));
  gitabaseVerses.forEach((_, num) => allVerseNumbers.add(num));

  // Сортуємо номери віршів
  const sortedVerseNumbers = Array.from(allVerseNumbers).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  console.log("[webImporter] Total unique verse numbers:", sortedVerseNumbers.length);
  console.log("[webImporter] Verse numbers:", sortedVerseNumbers);

  // Створюємо ParsedVerse для кожного номера
  const verses: ParsedVerse[] = sortedVerseNumbers.map((verseNum) => {
    const vedabaseVerse = vedabaseVerses.get(verseNum);
    const gitabaseVerse = gitabaseVerses.get(verseNum);

    return mergeVerseData(vedabaseVerse, gitabaseVerse, verseNum);
  });

  console.log("[webImporter] Parsed verses:", verses.length);

  return {
    chapter_number: chapterNumber,
    chapter_type: "verses",
    title_ua: chapterTitleUa,
    title_en: chapterTitleEn,
    verses,
  };
}
