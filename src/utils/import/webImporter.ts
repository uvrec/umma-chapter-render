// src/utils/import/webImporter.ts
// ПОКРАЩЕНА ВЕРСІЯ З ВИПРАВЛЕНИМ ПАРСИНГОМ
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

interface VedabaseVerse {
  verseNumber: string;
  sanskrit?: string;
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
 * ========================================
 * VEDABASE PARSER - Покращена версія
 * ========================================
 */
function parseVedabaseHTML(html: string): Map<string, VedabaseVerse> {
  console.log("[Vedabase] Parsing HTML, length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const verses = new Map<string, VedabaseVerse>();

  // МЕТОД 1: data-id="text-X" (новий Vedabase 2023+)
  const textBlocks = doc.querySelectorAll('[data-id^="text-"]');

  if (textBlocks.length > 0) {
    console.log(`[Vedabase] Found ${textBlocks.length} verses via data-id`);

    textBlocks.forEach((block) => {
      const dataId = block.getAttribute("data-id");
      const verseNum = dataId?.match(/text-(\d+(?:-\d+)?)/)?.[1] || "";

      if (!verseNum) return;

      // Sanskrit/Bengali - шукаємо script/span з відповідними атрибутами
      const sanskritEl =
        block.querySelector('[lang="sa"]') ||
        block.querySelector('[lang="bn"]') ||
        block.querySelector(".devanagari") ||
        block.querySelector(".bengali") ||
        block.querySelector(".sanskrit-text") ||
        block.querySelector('script[type="text/vnd.trans"]');

      let sanskrit = "";
      if (sanskritEl) {
        // Для <script> тегів витягуємо вміст
        if (sanskritEl.tagName === "SCRIPT") {
          sanskrit = sanskritEl.textContent?.trim() || "";
        } else {
          sanskrit = sanskritEl.textContent?.trim() || "";
        }
      }

      // Transliteration - зазвичай перший text після sanskrit
      const translitEl =
        block.querySelector(".verse-text") ||
        block.querySelector(".r") ||
        block.querySelector('[class*="translit"]') ||
        block.querySelector("p:nth-of-type(1)");

      const transliteration = translitEl?.textContent?.trim() || "";

      // Synonyms (Word-for-word)
      const synonymsEl =
        block.querySelector(".word-for-word") || block.querySelector(".synonyms") || block.querySelector(".w");

      const synonyms = synonymsEl?.textContent?.trim() || "";

      // Translation
      const translationEl = block.querySelector(".translation") || block.querySelector(".t");

      const translation = translationEl?.textContent?.trim() || "";

      // Commentary (Purport)
      const commentaryEl =
        block.querySelector(".purport") || block.querySelector(".commentary") || block.querySelector(".p");

      const commentary = commentaryEl?.textContent?.trim() || "";

      if (sanskrit || transliteration || translation) {
        verses.set(verseNum, {
          verseNumber: verseNum,
          sanskrit: cleanSanskrit(sanskrit),
          transliteration: cleanTransliteration(transliteration),
          synonyms: cleanText(synonyms),
          translation: cleanText(translation),
          commentary: cleanText(commentary),
        });
      }
    });
  }

  // МЕТОД 2: Старий Vedabase (клас-базована структура)
  if (verses.size === 0) {
    console.log("[Vedabase] Trying legacy class-based parsing");

    const verseBlocks = doc.querySelectorAll(".r");
    verseBlocks.forEach((block, index) => {
      const verseNum = (index + 1).toString();

      const sanskritEl = block.querySelector(".d");
      const translitEl = block.querySelector(".v");
      const synonymsEl = block.querySelector(".w");
      const translationEl = block.querySelector(".t");
      const commentaryEl = block.querySelector(".p");

      verses.set(verseNum, {
        verseNumber: verseNum,
        sanskrit: cleanSanskrit(sanskritEl?.textContent || ""),
        transliteration: cleanTransliteration(translitEl?.textContent || ""),
        synonyms: cleanText(synonymsEl?.textContent || ""),
        translation: cleanText(translationEl?.textContent || ""),
        commentary: cleanText(commentaryEl?.textContent || ""),
      });
    });
  }

  // МЕТОД 3: Regex fallback для TEXT X
  if (verses.size === 0) {
    console.log("[Vedabase] Trying regex pattern matching");
    const bodyText = doc.body.textContent || "";
    const textMatches = Array.from(bodyText.matchAll(/TEXT\s+(\d+(?:-\d+)?)/gi));

    textMatches.forEach((match) => {
      const verseNum = match[1];
      verses.set(verseNum, {
        verseNumber: verseNum,
        sanskrit: "",
        transliteration: "",
        synonyms: "",
        translation: "",
        commentary: "",
      });
    });
  }

  console.log(`[Vedabase] Extracted ${verses.size} verses`);
  return verses;
}

/**
 * ========================================
 * GITABASE PARSER - Покращена версія
 * ========================================
 */
export function parseGitabaseHTML(html: string): Map<string, GitabaseVerse> {
  console.log("[Gitabase] Parsing HTML, length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const verses = new Map<string, GitabaseVerse>();

  // МЕТОД 1: Структурний парсинг через DOM
  const verseBlocks = doc.querySelectorAll('[class*="verse"], [data-verse], .text-content');

  if (verseBlocks.length > 0) {
    console.log(`[Gitabase] Found ${verseBlocks.length} verse blocks`);

    verseBlocks.forEach((block, idx) => {
      const verseNum =
        block.getAttribute("data-verse") ||
        block.querySelector("[data-verse]")?.getAttribute("data-verse") ||
        (idx + 1).toString();

      // Переклад - зазвичай в <strong> або окремому блоці
      const translationEl =
        block.querySelector(".translation") || block.querySelector("strong") || block.querySelector("p:first-child");

      let translation = translationEl?.textContent?.trim() || "";

      // Коментар - весь інший текст після перекладу
      let commentary = "";
      const allPs = block.querySelectorAll("p");
      if (allPs.length > 1) {
        const commentaryParts: string[] = [];
        allPs.forEach((p, pIdx) => {
          if (pIdx > 0) {
            // Skip first p (translation)
            const text = p.textContent?.trim();
            if (text) commentaryParts.push(text);
          }
        });
        commentary = commentaryParts.join("\n\n");
      }

      if (translation || commentary) {
        verses.set(verseNum, {
          verseNumber: verseNum,
          translation: cleanText(translation),
          commentary: cleanText(commentary),
        });
      }
    });
  }

  // МЕТОД 2: Текстовий парсинг через регулярні вирази
  if (verses.size === 0) {
    console.log("[Gitabase] Trying text pattern matching");
    const bodyText = doc.body.textContent || "";

    // Паттерн: [Текст X] або Текст X
    const pattern = /(?:\[)?Текст\*?\s*(\d+(?:-\d+)?)(?:\])?[:\s]*(.+?)(?=(?:\[)?Текст\*?\s*\d+|$)/gis;
    const matches = Array.from(bodyText.matchAll(pattern));

    console.log(`[Gitabase] Found ${matches.length} text matches`);

    matches.forEach((match) => {
      const verseNum = match[1];
      const content = match[2].trim();

      // Переклад в лапках або перше речення
      let translation = "";
      let commentary = "";

      const quotedMatch = content.match(/[«"](.+?)[»"]/);
      if (quotedMatch) {
        translation = quotedMatch[1];
        commentary = content.substring(quotedMatch[0].length).trim();
      } else {
        // Перше речення - переклад
        const firstSentMatch = content.match(/^(.+?[.!?])\s*/);
        if (firstSentMatch) {
          translation = firstSentMatch[1];
          commentary = content.substring(firstSentMatch[0].length).trim();
        } else {
          translation = content;
        }
      }

      verses.set(verseNum, {
        verseNumber: verseNum,
        translation: cleanText(translation),
        commentary: cleanText(commentary),
      });
    });
  }

  console.log(`[Gitabase] Extracted ${verses.size} verses`);
  return verses;
}

/**
 * ========================================
 * CLEANING UTILITIES
 * ========================================
 */

/**
 * Очищення Sanskrit/Bengali тексту
 */
function cleanSanskrit(text: string): string {
  if (!text) return "";

  return (
    text
      .trim()
      // Видалити HTML теги
      .replace(/<[^>]+>/g, "")
      // Видалити зайві пробіли між словами але зберегти переноси
      .replace(/[ \t]+/g, " ")
      // Видалити зайві переноси (більше 2 підряд)
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/**
 * Очищення транслітерації
 */
function cleanTransliteration(text: string): string {
  if (!text) return "";

  return (
    text
      .trim()
      .replace(/<[^>]+>/g, "")
      // Видалити номери віршів на початку
      .replace(/^(?:TEXT\s+)?\d+(?:-\d+)?\s*/i, "")
      // Видалити labels
      .replace(/^(?:Transliteration|Translation|Verse)[:\s]*/gi, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/**
 * Загальне очищення тексту
 */
function cleanText(text: string): string {
  if (!text) return "";

  return (
    text
      .trim()
      .replace(/<[^>]+>/g, "")
      // Видалити section labels
      .replace(/^(?:SYNONYMS?|TRANSLATION|PURPORT|COMMENTARY)[:\s]*/gi, "")
      // Нормалізувати пробіли
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      // Видалити зайві пробіли навколо абзаців
      .replace(/\n\s+/g, "\n")
      .trim()
  );
}

/**
 * ========================================
 * MERGE & EXPORT
 * ========================================
 */

/**
 * Об'єднує дані з Vedabase та Gitabase
 */
function mergeVerseData(
  vedabaseVerse: VedabaseVerse | undefined,
  gitabaseVerse: GitabaseVerse | undefined,
  verseNum: string,
): ParsedVerse {
  // Логування для дебагу
  if (vedabaseVerse) {
    console.log(`[Merge] Verse ${verseNum} from Vedabase:`, {
      hasSanskrit: !!vedabaseVerse.sanskrit,
      hasTranslit: !!vedabaseVerse.transliteration,
      hasTranslation: !!vedabaseVerse.translation,
    });
  }

  if (gitabaseVerse) {
    console.log(`[Merge] Verse ${verseNum} from Gitabase:`, {
      hasTranslation: !!gitabaseVerse.translation,
      hasCommentary: !!gitabaseVerse.commentary,
    });
  }

  return {
    verse_number: verseNum,
    sanskrit: vedabaseVerse?.sanskrit || "",
    transliteration: vedabaseVerse?.transliteration || "",
    synonyms_en: vedabaseVerse?.synonyms || "",
    synonyms_ua: "", // Gitabase не має синонімів
    translation_en: vedabaseVerse?.translation || "",
    translation_ua: gitabaseVerse?.translation || "",
    commentary_en: vedabaseVerse?.commentary || "",
    commentary_ua: gitabaseVerse?.commentary || "",
  };
}

/**
 * ========================================
 * MAIN EXPORT FUNCTION
 * ========================================
 */

/**
 * Парсить повну главу з HTML обох джерел
 */
export async function parseChapterFromWeb(
  vedabaseHTML: string,
  gitabaseHTML: string,
  chapterNumber: number,
  chapterTitleUa: string,
  chapterTitleEn: string,
): Promise<ParsedChapter> {
  console.log("\n========================================");
  console.log("STARTING CHAPTER PARSING");
  console.log("========================================");
  console.log("Chapter:", chapterNumber);
  console.log("Vedabase HTML:", vedabaseHTML.length, "chars");
  console.log("Gitabase HTML:", gitabaseHTML.length, "chars");

  // Парсинг обох джерел
  const vedabaseVerses = parseVedabaseHTML(vedabaseHTML);
  const gitabaseVerses = parseGitabaseHTML(gitabaseHTML);

  console.log("\n--- PARSING RESULTS ---");
  console.log("Vedabase verses:", vedabaseVerses.size);
  console.log("Gitabase verses:", gitabaseVerses.size);

  // Збираємо всі унікальні номери віршів
  const allVerseNumbers = new Set<string>();
  vedabaseVerses.forEach((_, num) => allVerseNumbers.add(num));
  gitabaseVerses.forEach((_, num) => allVerseNumbers.add(num));

  // Сортуємо
  const sortedVerseNumbers = Array.from(allVerseNumbers).sort((a, b) => {
    // Обробка діапазонів типу "1-2"
    const aNum = parseInt(a.split("-")[0]);
    const bNum = parseInt(b.split("-")[0]);
    return aNum - bNum;
  });

  console.log("\n--- FINAL VERSE LIST ---");
  console.log("Total unique verses:", sortedVerseNumbers.length);
  console.log("Verse numbers:", sortedVerseNumbers.join(", "));

  if (sortedVerseNumbers.length === 0) {
    throw new Error("Не знайдено жодного вірша. Перевірте URL або структуру HTML.");
  }

  // Об'єднуємо дані
  const verses: ParsedVerse[] = sortedVerseNumbers.map((verseNum) => {
    const vedabaseVerse = vedabaseVerses.get(verseNum);
    const gitabaseVerse = gitabaseVerses.get(verseNum);
    return mergeVerseData(vedabaseVerse, gitabaseVerse, verseNum);
  });

  console.log("\n========================================");
  console.log("PARSING COMPLETE");
  console.log("Total verses created:", verses.length);
  console.log("========================================\n");

  return {
    chapter_number: chapterNumber,
    chapter_type: "verses",
    title_ua: chapterTitleUa,
    title_en: chapterTitleEn,
    verses,
  };
}
