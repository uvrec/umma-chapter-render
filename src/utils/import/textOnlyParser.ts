// src/utils/import/textOnlyParser.ts
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

/**
 * Парсить текст Vedabase без використання DOM
 */
function parseVedabaseText(text: string): Map<string, Partial<ParsedVerse>> {
  console.log("[textOnlyParser] Parsing Vedabase text, length:", text.length);
  const verses = new Map<string, Partial<ParsedVerse>>();

  // Шукаємо секції TEXT X
  const textPattern = /TEXT\s+(\d+)/gi;
  const matches = Array.from(text.matchAll(textPattern));

  console.log(`[textOnlyParser] Found ${matches.length} TEXT markers`);

  for (let i = 0; i < matches.length; i++) {
    const verseNum = matches[i][1];
    const startPos = matches[i].index! + matches[i][0].length;
    const endPos = i < matches.length - 1 ? matches[i + 1].index! : text.length;
    const content = text.substring(startPos, endPos);

    // Розбиваємо контент на секції
    const sections = {
      sanskrit: "",
      transliteration: "",
      synonyms: "",
      translation: "",
      commentary: "",
    };

    let currentSection = "";
    const lines = content.split(/\n+/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Визначаємо секцію
      if (/^SYNONYMS?/i.test(trimmed)) {
        currentSection = "synonyms";
        continue;
      } else if (/^TRANSLATION/i.test(trimmed)) {
        currentSection = "translation";
        continue;
      } else if (/^PURPORT|^COMMENTARY/i.test(trimmed)) {
        currentSection = "commentary";
        continue;
      }

      // Санскрит/бенгалі - містить деванагарі символи
      if (!sections.sanskrit && /[\u0900-\u097F\u0980-\u09FF]/.test(trimmed)) {
        sections.sanskrit = trimmed;
        continue;
      }

      // Транслітерація - латиниця з діакритикою
      if (!sections.transliteration && /[āīūṛṝḷḹēōṁṃḥṅñṭḍṇśṣ]/i.test(trimmed) && trimmed.length > 10) {
        sections.transliteration = trimmed;
        continue;
      }

      // Додаємо до поточної секції
      switch (currentSection) {
        case "synonyms":
          sections.synonyms += (sections.synonyms ? " " : "") + trimmed;
          break;
        case "translation":
          sections.translation += (sections.translation ? " " : "") + trimmed;
          break;
        case "commentary":
          sections.commentary += (sections.commentary ? " " : "") + trimmed;
          break;
      }
    }

    verses.set(verseNum, {
      verse_number: verseNum,
      sanskrit: sections.sanskrit,
      transliteration: sections.transliteration,
      synonyms_en: sections.synonyms,
      translation_en: sections.translation,
      commentary_en: sections.commentary,
    });

    console.log(`[textOnlyParser] Vedabase verse ${verseNum}:`, {
      hasSanskrit: !!sections.sanskrit,
      hasTranslit: !!sections.transliteration,
      hasTranslation: !!sections.translation,
    });
  }

  return verses;
}

/**
 * Витягує метадані лекції (дата, місце, аудіо)
 */
function extractLectureMetadata(text: string): {
  date?: string;
  location?: string;
  audioUrl?: string;
  type?: string;
} {
  const metadata: any = {};

  // Дата: "February 19th 1966", "July 12th 1947"
  const dateMatch = text.match(/(?:Dated:|Date:)?\s*([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?\s+\d{4})/i);
  if (dateMatch) {
    metadata.date = dateMatch[1];
  }

  // Місце: "New York", "Cawnpore", "Location: New York"
  const locationMatch = text.match(/(?:Location:|Place:)\s*([A-Z][a-z\s]+)/i);
  if (locationMatch) {
    metadata.location = locationMatch[1].trim();
  }

  // Тип: "Bhagavad-gītā", "Letter to:"
  const typeMatch = text.match(/Type:\s*([^\n]+)/i);
  if (typeMatch) {
    metadata.type = typeMatch[1].trim();
  }

  // Аудіо файл: ".mp3"
  const audioMatch = text.match(/(\w+\.mp3)/i);
  if (audioMatch) {
    metadata.audioUrl = `https://vedabase.io/audio/${audioMatch[1]}`;
  }

  return metadata;
}

/**
 * Парсить текст Gitabase без використання DOM
 */
function parseGitabaseText(text: string): Map<string, Partial<ParsedVerse>> {
  console.log("[textOnlyParser] Parsing Gitabase text, length:", text.length);
  const verses = new Map<string, Partial<ParsedVerse>>();

  // Шукаємо вірші за патерном [Текст X] або Текст X
  const versePattern = /(?:\[)?Текст\s*\*?\s*(\d+)(?:\])?[:\s]*/gi;
  const matches = Array.from(text.matchAll(versePattern));

  console.log(`[textOnlyParser] Found ${matches.length} Gitabase verse markers`);

  for (let i = 0; i < matches.length; i++) {
    const verseNum = matches[i][1];
    const startPos = matches[i].index! + matches[i][0].length;
    const endPos = i < matches.length - 1 ? matches[i + 1].index! : text.length;
    const content = text.substring(startPos, endPos).trim();

    // Розділяємо на речення
    const sentences = content.split(/(?<=[.!?])\s+/);

    // Перший абзац зазвичай переклад, решта - коментар
    let translation = "";
    let commentary = "";
    let foundTranslation = false;

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      // Переклад часто в лапках або жирним (але ми цього не бачимо в текстовому режимі)
      // Візьмемо перші 1-3 речення як переклад
      if (!foundTranslation && translation.split(".").length < 3) {
        translation += (translation ? " " : "") + trimmed;
        if (trimmed.endsWith(".") || trimmed.endsWith("!") || trimmed.endsWith("?")) {
          foundTranslation = true;
        }
      } else {
        commentary += (commentary ? " " : "") + trimmed;
      }
    }

    verses.set(verseNum, {
      verse_number: verseNum,
      translation_ua: translation,
      commentary_ua: commentary,
    });

    console.log(`[textOnlyParser] Gitabase verse ${verseNum}:`, {
      translationLength: translation.length,
      commentaryLength: commentary.length,
    });
  }

  return verses;
}

/**
 * Об'єднує дані з обох джерел
 */
function mergeVerseData(
  vedabaseVerse: Partial<ParsedVerse> | undefined,
  gitabaseVerse: Partial<ParsedVerse> | undefined,
  verseNum: string,
): ParsedVerse {
  return {
    verse_number: verseNum,
    sanskrit: vedabaseVerse?.sanskrit || "",
    transliteration: vedabaseVerse?.transliteration || "",
    synonyms_en: vedabaseVerse?.synonyms_en || "",
    synonyms_ua: "",
    translation_en: vedabaseVerse?.translation_en || "",
    translation_ua: gitabaseVerse?.translation_ua || "",
    commentary_en: vedabaseVerse?.commentary_en || "",
    commentary_ua: gitabaseVerse?.commentary_ua || "",
  };
}

/**
 * Парсить повну главу з текстового контенту (без DOM)
 * Для лекцій/листів - повертає весь текст + метадані
 */
export async function parseChapterTextOnly(
  vedabaseText: string,
  gitabaseText: string,
  chapterNumber: number,
  chapterTitleUa: string,
  chapterTitleEn: string,
): Promise<ParsedChapter> {
  console.log("[textOnlyParser] Starting text-only chapter parsing");

  // Перевіряємо чи це лекція/лист (немає TEXT X маркерів)
  const hasVerseMarkers = /TEXT\s+\d+/i.test(vedabaseText);

  if (!hasVerseMarkers) {
    // Це лекція/лист - витягуємо весь текст
    console.log("[textOnlyParser] Detected lecture/letter format");

    const metadata = extractLectureMetadata(vedabaseText);

    // Видаляємо метадані з початку тексту
    let content = vedabaseText
      .replace(/Type:.*?\n/gi, "")
      .replace(/Dated?:.*?\n/gi, "")
      .replace(/Location:.*?\n/gi, "")
      .replace(/Audio file:.*?\n/gi, "")
      .replace(/Letter to:.*?\n/gi, "")
      .trim();

    // Видаляємо прабхупаду блок на початку (санскрит мантри)
    content = content.replace(/Prabhupāda:[\s\S]*?(?=\[|$)/i, "").trim();

    return {
      chapter_number: chapterNumber,
      chapter_type: "text",
      title_ua: chapterTitleUa,
      title_en: chapterTitleEn,
      content_en: content,
      content_ua: "",
      verses: [],
      metadata: {
        date: metadata.date,
        location: metadata.location,
        audio_url: metadata.audioUrl,
        type: metadata.type,
      },
    };
  }

  // Звичайна глава з віршами
  const vedabaseVerses = parseVedabaseText(vedabaseText);
  const gitabaseVerses = parseGitabaseText(gitabaseText);

  // Об'єднуємо всі унікальні номери віршів
  const allVerseNumbers = new Set<string>();
  vedabaseVerses.forEach((_, num) => allVerseNumbers.add(num));
  gitabaseVerses.forEach((_, num) => allVerseNumbers.add(num));

  // Сортуємо
  const sortedVerseNumbers = Array.from(allVerseNumbers).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  console.log("[textOnlyParser] Total unique verses:", sortedVerseNumbers.length);

  // Створюємо ParsedVerse для кожного номера
  const verses: ParsedVerse[] = sortedVerseNumbers.map((verseNum) => {
    const vedabaseVerse = vedabaseVerses.get(verseNum);
    const gitabaseVerse = gitabaseVerses.get(verseNum);
    return mergeVerseData(vedabaseVerse, gitabaseVerse, verseNum);
  });

  console.log("[textOnlyParser] Parsed verses:", verses.length);

  return {
    chapter_number: chapterNumber,
    chapter_type: "verses",
    title_ua: chapterTitleUa,
    title_en: chapterTitleEn,
    verses,
  };
}
