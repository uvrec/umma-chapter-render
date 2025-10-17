// src/utils/import/webImporter.ts
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

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
 * Витягує всі вірші з HTML сторінки Vedabase
 * FIXED: Працює з side-by-side view та звичайним виглядом
 */
function parseVedabaseHTML(html: string): Map<string, VedabaseVerse> {
  console.log("[webImporter] Parsing Vedabase HTML, length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const verses = new Map<string, VedabaseVerse>();

  // Парсинг через текстові маркери (найнадійніший)
  const bodyText = doc.body.textContent || "";

  // Шукаємо "Text 1", "Text 2" і т.д.
  const textMarkers = Array.from(bodyText.matchAll(/Text\s+(\d+)/gi));

  console.log(`[webImporter] Found ${textMarkers.length} "Text X" markers`);

  for (let i = 0; i < textMarkers.length; i++) {
    const match = textMarkers[i];
    const verseNum = match[1];
    const startIdx = match.index! + match[0].length;
    const endIdx = i < textMarkers.length - 1 ? textMarkers[i + 1].index! : bodyText.length;
    const verseContent = bodyText.substring(startIdx, endIdx);

    // Розбираємо контент вірша
    let bengali = "";
    let transliteration = "";
    let synonyms = "";
    let translation = "";
    let commentary = "";

    // Шукаємо бенгалі/санскрит (перший рядок з девангарі)
    const bengaliMatch = verseContent.match(/[\u0900-\u097F\u0980-\u09FF][^\n]*/);
    if (bengaliMatch) {
      bengali = bengaliMatch[0].trim();
    }

    // Шукаємо транслітерацію (після бенгалі, має діакритику)
    const translitMatch = verseContent.match(/[a-z][āīūṛṝḷḹēōṁṃḥṅñṭḍṇśṣ][^\n]*/i);
    if (translitMatch) {
      transliteration = translitMatch[0].trim();
    }

    // Шукаємо SYNONYMS
    const synonymsMatch = verseContent.match(/SYNONYMS\s+([\s\S]*?)(?=TRANSLATION|PURPORT|Text\s+\d+|$)/i);
    if (synonymsMatch) {
      synonyms = synonymsMatch[1].trim().replace(/\s+/g, " ");
    }

    // Шукаємо TRANSLATION
    const translationMatch = verseContent.match(/TRANSLATION\s+([\s\S]*?)(?=PURPORT|Text\s+\d+|$)/i);
    if (translationMatch) {
      translation = translationMatch[1].trim().replace(/\s+/g, " ");
    }

    // Шукаємо PURPORT
    const purportMatch = verseContent.match(/PURPORT\s+([\s\S]*?)(?=Text\s+\d+|$)/i);
    if (purportMatch) {
      commentary = purportMatch[1].trim();
    }

    // Якщо знайшли хоч щось - зберігаємо
    if (bengali || transliteration || translation) {
      verses.set(verseNum, {
        verseNumber: verseNum,
        bengali,
        transliteration,
        synonyms,
        translation,
        commentary,
      });

      console.log(
        `[webImporter] ✓ Verse ${verseNum}: bengali=${!!bengali}, translit=${!!transliteration}, trans=${!!translation}`,
      );
    } else {
      console.warn(`[webImporter] ✗ Verse ${verseNum}: NO CONTENT FOUND`);
    }
  }

  console.log(`[webImporter] Vedabase complete: ${verses.size} verses`);
  return verses;
}

/**
 * Витягує всі вірші з HTML сторінки Gitabase
 */
export function parseGitabaseHTML(html: string): Map<string, GitabaseVerse> {
  console.log("[webImporter] Parsing Gitabase HTML, length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const verses = new Map<string, GitabaseVerse>();

  const bodyText = doc.body.textContent || "";

  // Gitabase: "[Текст 1]" або "Текст 1:"
  const pattern = /\[?Текст\*?\s*(\d+)\]?[:\s]*([\s\S]*?)(?=\[?Текст\*?\s*\d+|$)/gi;
  const matches = Array.from(bodyText.matchAll(pattern));

  console.log(`[webImporter] Found ${matches.length} Gitabase verses`);

  matches.forEach((match) => {
    const verseNum = match[1];
    let content = match[2].trim().replace(/\s+/g, " ");

    let translation = "";
    let commentary = "";

    // Переклад в лапках або перше речення
    const translMatch = content.match(/^[«"](.+?)[»"]/) || content.match(/^([^.]+?\.)/);

    if (translMatch) {
      translation = translMatch[1].replace(/[«»"]/g, "").trim();
      commentary = content.substring(translMatch[0].length).trim();
    } else {
      // Якщо нема чіткого перекладу - перше речення
      const firstSentence = content.match(/^.+?\./);
      if (firstSentence) {
        translation = firstSentence[0];
        commentary = content.substring(firstSentence[0].length).trim();
      } else {
        translation = content;
      }
    }

    verses.set(verseNum, {
      verseNumber: verseNum,
      translation: translation.trim(),
      commentary: commentary.trim(),
    });

    console.log(`[webImporter] ✓ Gitabase verse ${verseNum}`);
  });

  console.log(`[webImporter] Gitabase complete: ${verses.size} verses`);
  return verses;
}

/**
 * Об'єднує дані з обох джерел
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
    synonyms_ua: "",
    translation_en: vedabaseVerse?.translation || "",
    translation_ua: gitabaseVerse?.translation || "",
    commentary_en: vedabaseVerse?.commentary || "",
    commentary_ua: gitabaseVerse?.commentary || "",
  };
}

/**
 * Парсить повну главу з HTML контенту
 */
export async function parseChapterFromWeb(
  vedabaseHTML: string,
  gitabaseHTML: string,
  chapterNumber: number,
  chapterTitleUa: string,
  chapterTitleEn: string,
): Promise<ParsedChapter> {
  console.log("[webImporter] ========== Parsing chapter ==========");
  console.log("[webImporter] Chapter:", chapterNumber);

  const vedabaseVerses = parseVedabaseHTML(vedabaseHTML);
  const gitabaseVerses = parseGitabaseHTML(gitabaseHTML);

  // Всі унікальні номери
  const allVerseNumbers = new Set<string>();
  vedabaseVerses.forEach((_, num) => allVerseNumbers.add(num));
  gitabaseVerses.forEach((_, num) => allVerseNumbers.add(num));

  const sortedVerseNumbers = Array.from(allVerseNumbers).sort((a, b) => parseInt(a) - parseInt(b));

  console.log("[webImporter] Total verses:", sortedVerseNumbers.length);

  if (sortedVerseNumbers.length === 0) {
    throw new Error("Не знайдено жодного вірша. Перевірте URL.");
  }

  const verses: ParsedVerse[] = sortedVerseNumbers.map((verseNum) => {
    const vedabaseVerse = vedabaseVerses.get(verseNum);
    const gitabaseVerse = gitabaseVerses.get(verseNum);
    return mergeVerseData(vedabaseVerse, gitabaseVerse, verseNum);
  });

  console.log("[webImporter] ========== Complete ==========");

  return {
    chapter_number: chapterNumber,
    chapter_type: "verses",
    title_ua: chapterTitleUa,
    title_en: chapterTitleEn,
    verses,
  };
}
