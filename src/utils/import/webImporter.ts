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
 */
function parseVedabaseHTML(html: string): Map<string, VedabaseVerse> {
  console.log("[webImporter] Parsing Vedabase HTML, length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const verses = new Map<string, VedabaseVerse>();

  // МЕТОД 1: Шукаємо через data-id="text-X" (новий Vedabase)
  const textBlocks = doc.querySelectorAll('[data-id^="text-"]');

  if (textBlocks.length > 0) {
    console.log(`[webImporter] Found ${textBlocks.length} verse blocks via data-id`);

    textBlocks.forEach((block) => {
      const dataId = block.getAttribute("data-id");
      const verseNum = dataId?.match(/text-(\d+)/)?.[1] || "";

      if (!verseNum) return;

      // Шукаємо різні частини вірша в межах блоку
      const bengaliEl = block.querySelector('[lang="sa"], .devanagari, .sanskrit-text, .bengali');
      const bengali = bengaliEl?.textContent?.trim() || "";

      const translitEl = block.querySelector('.verse-text, .transliteration, [class*="translit"]');
      const transliteration = translitEl?.textContent?.trim() || "";

      const synonymsEl = block.querySelector(".word-for-word, .synonyms");
      const synonyms = synonymsEl?.textContent?.trim() || "";

      const translationEl = block.querySelector(".translation");
      const translation = translationEl?.textContent?.trim() || "";

      const commentaryEl = block.querySelector(".purport, .commentary");
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
          hasBengali: !!bengali,
          hasTranslit: !!transliteration,
          hasTranslation: !!translation,
        });
      }
    });
  }

  // МЕТОД 2: Парсимо через текстові маркери "TEXT X"
  if (verses.size === 0) {
    console.log("[webImporter] No data-id blocks, trying text-based parsing");
    const bodyText = doc.body.textContent || "";

    // Розбиваємо на секції по TEXT X
    const sections = bodyText.split(/TEXT\s+(\d+)/i);

    for (let i = 1; i < sections.length; i += 2) {
      const verseNum = sections[i];
      const content = sections[i + 1] || "";

      if (!content.trim()) continue;

      // Витягуємо різні компоненти
      const lines = content
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      let bengali = "";
      let transliteration = "";
      let synonyms = "";
      let translation = "";
      let commentary = "";

      let currentSection = "";

      for (const line of lines) {
        // Визначаємо тип контенту
        if (/SYNONYMS?/i.test(line)) {
          currentSection = "synonyms";
          continue;
        } else if (/TRANSLATION/i.test(line)) {
          currentSection = "translation";
          continue;
        } else if (/PURPORT|COMMENTARY/i.test(line)) {
          currentSection = "commentary";
          continue;
        }

        // Бенгалі/санскрит (містить девангарі символи)
        if (!bengali && /[\u0900-\u097F\u0980-\u09FF]/.test(line)) {
          bengali = line;
          continue;
        }

        // Транслітерація (латиниця з діакритикою)
        if (!transliteration && /[āīūṛṝḷḹēōṁṃḥṅñṭḍṇśṣ]/.test(line) && line.length > 10) {
          transliteration = line;
          continue;
        }

        // Додаємо до поточної секції
        switch (currentSection) {
          case "synonyms":
            synonyms += (synonyms ? "\n" : "") + line;
            break;
          case "translation":
            translation += (translation ? " " : "") + line;
            break;
          case "commentary":
            commentary += (commentary ? "\n\n" : "") + line;
            break;
        }
      }

      verses.set(verseNum, {
        verseNumber: verseNum,
        bengali: bengali.trim(),
        transliteration: transliteration.trim(),
        synonyms: synonyms.trim(),
        translation: translation.trim(),
        commentary: commentary.trim(),
      });

      console.log(`[webImporter] Parsed Vedabase verse ${verseNum}`);
    }
  }

  console.log(`[webImporter] Vedabase parsing complete: ${verses.size} verses found`);
  return verses;
}

/**
 * Витягує всі вірші з HTML сторінки Gitabase
 */
function parseGitabaseHTML(html: string): Map<string, GitabaseVerse> {
  console.log("[webImporter] Parsing Gitabase HTML, length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const verses = new Map<string, GitabaseVerse>();

  // МЕТОД 1: Шукаємо через структуру DOM
  const verseElements = doc.querySelectorAll('[class*="verse"], [data-verse], .text-block');

  if (verseElements.length > 0) {
    console.log(`[webImporter] Found ${verseElements.length} verse elements in Gitabase`);

    verseElements.forEach((el, idx) => {
      const verseNum = el.getAttribute("data-verse") || (idx + 1).toString();

      const translationEl = el.querySelector('.translation, [class*="translation"]');
      const translation = translationEl?.textContent?.trim() || "";

      const commentaryEl = el.querySelector('.commentary, .purport, [class*="commentary"]');
      const commentary = commentaryEl?.textContent?.trim() || "";

      if (translation || commentary) {
        verses.set(verseNum, {
          verseNumber: verseNum,
          translation,
          commentary,
        });
      }
    });
  }

  // МЕТОД 2: Парсимо через текстові маркери
  if (verses.size === 0) {
    console.log("[webImporter] No verse elements, trying text pattern matching");
    const bodyText = doc.body.textContent || "";

    // Gitabase часто має "[Текст X]" або "Текст X"
    const pattern = /\[?Текст\*?\s*(\d+)\]?[:\s]*([\s\S]*?)(?=\[?Текст\*?\s*\d+|$)/gi;
    const matches = Array.from(bodyText.matchAll(pattern));

    console.log(`[webImporter] Found ${matches.length} text matches in Gitabase`);

    matches.forEach((match) => {
      const verseNum = match[1];
      let content = match[2].trim();

      // Видаляємо зайві пробіли та переноси
      content = content.replace(/\s+/g, " ").trim();

      let translation = "";
      let commentary = "";

      // Переклад зазвичай в лапках або виділений
      const translMatch =
        content.match(/^[«"](.+?)[»"]/) || content.match(/^([^.]+?\.)/) || content.match(/^(.{20,150}?\.)/);

      if (translMatch) {
        translation = translMatch[1].replace(/[«»"]/g, "").trim();
        // Коментар - все що після перекладу
        commentary = content.substring(translMatch[0].length).trim();
      } else {
        // Якщо не знайшли чіткий переклад, перше речення - переклад
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

      console.log(`[webImporter] Gitabase verse ${verseNum}:`, {
        translationLength: translation.length,
        commentaryLength: commentary.length,
      });
    });
  }

  console.log(`[webImporter] Gitabase parsing complete: ${verses.size} verses found`);
  return verses;
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
  console.log("[webImporter] ========== Starting chapter parsing ==========");
  console.log("[webImporter] Chapter number:", chapterNumber);
  console.log("[webImporter] Vedabase HTML length:", vedabaseHTML.length);
  console.log("[webImporter] Gitabase HTML length:", gitabaseHTML.length);

  // Парсимо обидва джерела
  const vedabaseVerses = parseVedabaseHTML(vedabaseHTML);
  const gitabaseVerses = parseGitabaseHTML(gitabaseHTML);

  console.log("[webImporter] Vedabase verses found:", vedabaseVerses.size);
  console.log("[webImporter] Gitabase verses found:", gitabaseVerses.size);

  // Об'єднуємо всі унікальні номери віршів
  const allVerseNumbers = new Set<string>();
  vedabaseVerses.forEach((_, num) => allVerseNumbers.add(num));
  gitabaseVerses.forEach((_, num) => allVerseNumbers.add(num));

  // Сортуємо номери віршів
  const sortedVerseNumbers = Array.from(allVerseNumbers).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  console.log("[webImporter] Total unique verse numbers:", sortedVerseNumbers.length);
  console.log("[webImporter] Verse numbers:", sortedVerseNumbers.join(", "));

  if (sortedVerseNumbers.length === 0) {
    throw new Error("Не знайдено жодного вірша. Перевірте URL або структуру сторінок.");
  }

  // Створюємо ParsedVerse для кожного номера
  const verses: ParsedVerse[] = sortedVerseNumbers.map((verseNum) => {
    const vedabaseVerse = vedabaseVerses.get(verseNum);
    const gitabaseVerse = gitabaseVerses.get(verseNum);

    return mergeVerseData(vedabaseVerse, gitabaseVerse, verseNum);
  });

  console.log("[webImporter] ========== Parsing complete ==========");
  console.log("[webImporter] Total verses created:", verses.length);

  return {
    chapter_number: chapterNumber,
    chapter_type: "verses",
    title_ua: chapterTitleUa,
    title_en: chapterTitleEn,
    verses,
  };
}
