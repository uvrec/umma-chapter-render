// ============================================================================
// WISDOM LIBRARY PARSER - Chaitanya Bhagavata
// Виправлена версія з правильними селекторами для структури HTML
// ============================================================================

export interface WisdomlibVerse {
  verse_number: string;
  bengali?: string; // Bengali text
  transliteration_en?: string;
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string; // Gaudiya-bhāṣya
}

export interface WisdomlibChapter {
  chapter_number: number;
  title_en?: string;
  verses: WisdomlibVerse[];
  khanda: string; // adi, madhya, antya
  verseUrls?: Array<{ url: string; verseNumber: string }>;
}

/**
 * Парсинг окремої сторінки вірша
 *
 * Структура Wisdom Library для Chaitanya Bhagavata:
 * 1. Bengali text (4 рядки) - в blockquote > p:nth-child(2)
 * 2. English translation - в #scontent > p:nth-child(3)
 * 3. Commentary - починається з #scontent > p:nth-child(5) і далі
 */
export function parseWisdomlibVersePage(html: string, verseUrl: string): WisdomlibVerse | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Витягуємо номер вірша з URL
    const verseMatch = verseUrl.match(/doc(\d+)\.html/);
    const verseNumber = verseMatch ? verseMatch[1] : "1";

    const verse: WisdomlibVerse = {
      verse_number: verseNumber,
    };

    // 1. BENGALI TEXT - в blockquote (4 рядки разом)
    // Селектор: #scontent > blockquote:nth-child(1)
    const blockquote = doc.querySelector("#scontent > blockquote:first-of-type");
    if (blockquote) {
      // Витягуємо всі параграфи з blockquote
      const paragraphs = blockquote.querySelectorAll("p");
      const bengaliLines: string[] = [];

      paragraphs.forEach((p) => {
        const text = p.textContent?.trim() || "";
        // Bengali текст містить специфічні символи
        if (text && /[\u0980-\u09FF]/.test(text)) {
          bengaliLines.push(text);
        }
      });

      if (bengaliLines.length > 0) {
        verse.bengali = bengaliLines.join("\n");
      }
    }

    // 2. ENGLISH TRANSLATION - перший параграф після blockquote
    // Селектор: #scontent > p:nth-child(3)
    const scontent = doc.querySelector("#scontent");
    if (scontent) {
      const allChildren = Array.from(scontent.children);

      // Знаходимо індекс blockquote
      const blockquoteIndex = allChildren.findIndex((el) => el.tagName === "BLOCKQUOTE");

      if (blockquoteIndex >= 0) {
        // Перший <p> після blockquote - це переклад
        const translationP = allChildren.find((el, idx) => idx > blockquoteIndex && el.tagName === "P") as
          | HTMLElement
          | undefined;

        if (translationP) {
          const text = translationP.textContent?.trim() || "";
          // Переклад зазвичай починається з великої літери і не містить "—"
          if (text.length > 30 && !text.includes("Commentary:")) {
            verse.translation_en = text;
          }
        }
      }
    }

    // 3. COMMENTARY - всі параграфи після перекладу до кінця
    // Починається після заголовка "Commentary: Gauḍīya-bhāṣya..."
    if (scontent) {
      const allParagraphs = Array.from(scontent.querySelectorAll("p"));
      let commentaryStarted = false;
      const commentaryParagraphs: string[] = [];

      allParagraphs.forEach((p) => {
        const text = p.textContent?.trim() || "";

        // Шукаємо початок коментаря
        if (text.includes("Commentary:") || text.includes("Gauḍīya-bhāṣya")) {
          commentaryStarted = true;
          // Якщо в тому ж параграфі є текст після "Commentary:", додаємо його
          const afterCommentary = text.split(/Commentary:|Gauḍīya-bhāṣya[^:]*:/)[1];
          if (afterCommentary) {
            commentaryParagraphs.push(afterCommentary.trim());
          }
          return;
        }

        // Якщо коментар почався, додаємо всі наступні параграфи
        if (commentaryStarted && text.length > 0) {
          // Виключаємо навігаційні елементи
          if (!text.includes("Previous") && !text.includes("Next") && !text.includes("Like what you read?")) {
            commentaryParagraphs.push(text);
          }
        }
      });

      if (commentaryParagraphs.length > 0) {
        verse.commentary_en = commentaryParagraphs.join("\n\n");
      }
    }

    // 4. TRANSLITERATION - якщо є, зазвичай в blockquote після Bengali
    if (blockquote) {
      const paragraphs = Array.from(blockquote.querySelectorAll("p"));
      paragraphs.forEach((p) => {
        const text = p.textContent?.trim() || "";
        // Транслітерація містить діакритичні знаки IAST
        if (text && /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]/.test(text)) {
          if (!verse.transliteration_en) {
            verse.transliteration_en = text;
          }
        }
      });
    }

    // 5. SYNONYMS - слова через "—" та ";"
    // Зазвичай після transliteration, але до translation
    if (scontent) {
      const allParagraphs = Array.from(scontent.querySelectorAll("p, blockquote p"));

      for (const p of allParagraphs) {
        const text = p.textContent?.trim() || "";

        // Synonyms мають характерний патерн: слово—переклад; слово—переклад
        const dashCount = (text.match(/—/g) || []).length;
        const semiCount = (text.match(/;/g) || []).length;

        // Має бути мінімум 3 тире і 2 крапки з комою
        if (dashCount >= 3 && semiCount >= 2 && text.length > 50) {
          verse.synonyms_en = text;
          break;
        }
      }
    }

    console.log("✅ Wisdomlib verse parsed:", {
      verse_number: verse.verse_number,
      bengali: verse.bengali ? `${verse.bengali.substring(0, 50)}...` : "MISSING",
      translation: verse.translation_en ? `${verse.translation_en.substring(0, 50)}...` : "MISSING",
      commentary: verse.commentary_en ? `${verse.commentary_en.length} chars` : "MISSING",
    });

    // Повертаємо null якщо нема ключового контенту
    if (!verse.bengali && !verse.translation_en && !verse.commentary_en) {
      console.warn("⚠️ No content found for verse:", verseNumber);
      return null;
    }

    return verse;
  } catch (error) {
    console.error("❌ Wisdomlib parse error:", error);
    return null;
  }
}

/**
 * Витягує URLs віршів зі сторінки глави
 * Приклад: https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1092507.html
 */
export function extractWisdomlibVerseUrls(
  html: string,
  chapterUrl: string,
): Array<{ url: string; verseNumber: string }> {
  try {
    console.log(`[extractWisdomlibVerseUrls] Extracting verse URLs from chapter: ${chapterUrl}`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const verseUrls: Array<{ url: string; verseNumber: string }> = [];

    // Wisdom Library має список віршів як нумеровані посилання
    // Зазвичай в <ol> або <ul> списку
    const contentArea = doc.querySelector("#scontent, .content, main") || doc;
    console.log(`[extractWisdomlibVerseUrls] Content area found: ${!!contentArea}`);

    // Шукаємо всі посилання на сторінки віршів (pattern: /d/doc[digits].html)
    const links = contentArea.querySelectorAll('a[href*="/d/doc"]');
    console.log(`[extractWisdomlibVerseUrls] Found ${links.length} links with /d/doc pattern`);

    let validCount = 0;
    let skippedCount = 0;

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const text = link.textContent?.trim() || "";

      // Фільтруємо тільки числові посилання (номери віршів)
      if (!text.match(/^\d+$/) && !text.match(/^Verse\s*\d+$/i)) {
        skippedCount++;
        return;
      }

      // Будуємо повний URL
      let fullUrl = href;
      if (href.startsWith("/")) {
        const base = new URL(chapterUrl);
        fullUrl = base.origin + href;
      } else if (!href.startsWith("http")) {
        const base = new URL(chapterUrl);
        fullUrl = base.origin + "/" + href;
      }

      // Витягуємо номер вірша
      const verseMatch = text.match(/(\d+)/);
      const verseNumber = verseMatch ? verseMatch[1] : "";

      if (verseNumber) {
        verseUrls.push({ url: fullUrl, verseNumber });
        validCount++;
      }
    });

    console.log(`✅ Found ${verseUrls.length} verse URLs in chapter (valid: ${validCount}, skipped: ${skippedCount})`);
    if (verseUrls.length > 0) {
      console.log(`[extractWisdomlibVerseUrls] First 3 verses:`, verseUrls.slice(0, 3));
    }
    return verseUrls;
  } catch (error) {
    console.error("❌ Error extracting verse URLs:", error);
    return [];
  }
}

/**
 * Парсинг сторінки глави (отримує список URLs віршів)
 */
export function parseWisdomlibChapterPage(html: string, chapterUrl: string, khanda: string): WisdomlibChapter | null {
  try {
    console.log(`[parseWisdomlibChapterPage] Parsing chapter from URL: ${chapterUrl}`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Витягуємо номер глави з URL
    const chapterMatch = chapterUrl.match(/chapter[_-]?(\d+)/i) || chapterUrl.match(/doc(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 1;
    console.log(`[parseWisdomlibChapterPage] Extracted chapter number: ${chapterNumber}`);

    // Витягуємо заголовок
    const titleEl = doc.querySelector("h1, h2, .chapter-title, #scontent > h2");
    const title = titleEl?.textContent?.trim() || `Chapter ${chapterNumber}`;
    console.log(`[parseWisdomlibChapterPage] Title: ${title}`);

    // Витягуємо URLs віршів
    const verseUrls = extractWisdomlibVerseUrls(html, chapterUrl);

    console.log(`✅ Chapter ${chapterNumber} parsed:`, {
      title,
      khanda,
      verseCount: verseUrls.length,
      verseUrlsPreview: verseUrls.slice(0, 3),
    });

    if (verseUrls.length === 0) {
      console.warn(`⚠️ No verse URLs found for chapter ${chapterNumber}. This chapter will be skipped unless it has inline content.`);
    }

    return {
      chapter_number: chapterNumber,
      title_en: title,
      verses: [],
      khanda,
      verseUrls,
    };
  } catch (error) {
    console.error("❌ Chapter parse error:", error);
    return null;
  }
}

/**
 * Визначає khaṇḍa з URL
 */
export function determineKhandaFromUrl(url: string): { name: string; number: number } {
  const urlLower = url.toLowerCase();
  if (urlLower.includes("adi")) {
    return { name: "adi", number: 1 };
  } else if (urlLower.includes("madhya")) {
    return { name: "madhya", number: 2 };
  } else if (urlLower.includes("antya")) {
    return { name: "antya", number: 3 };
  }
  return { name: "adi", number: 1 };
}

/**
 * Витягує URLs глав з головної сторінки книги
 */
export function extractWisdomlibChapterUrls(
  html: string,
  baseUrl: string,
): Array<{ url: string; title: string; chapterNumber: number; khanda: string }> {
  try {
    console.log(`[extractWisdomlibChapterUrls] Extracting chapters from: ${baseUrl}`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const chapters: Array<{ url: string; title: string; chapterNumber: number; khanda: string }> = [];

    // Шукаємо всі посилання на глави
    const links = doc.querySelectorAll('a[href*="/d/doc"]');
    console.log(`[extractWisdomlibChapterUrls] Found ${links.length} links with /d/doc pattern`);

    let skippedIntro = 0;
    let skippedNoMatch = 0;
    let validChapters = 0;

    // Log first few link texts for debugging
    const sampleTexts: string[] = [];
    links.forEach((link, idx) => {
      if (idx < 10) {
        sampleTexts.push(link.textContent?.trim() || "");
      }
    });
    console.log(`[extractWisdomlibChapterUrls] Sample link texts:`, sampleTexts);

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const text = link.textContent?.trim() || "";

      // Пропускаємо не-глави (вступи, передмови тощо)
      if (
        text.toLowerCase().includes("introduction") ||
        text.toLowerCase().includes("preface") ||
        text.toLowerCase().includes("index")
      ) {
        skippedIntro++;
        return;
      }

      // Витягуємо номер глави
      const chapterMatch = text.match(/(?:chapter|adhyāya)\s+(\d+)/i);
      if (!chapterMatch) {
        skippedNoMatch++;
        return;
      }

      const chapterNumber = parseInt(chapterMatch[1], 10);

      // Визначаємо khaṇḍa
      const khanda = determineKhandaFromUrl(href).name;

      // Будуємо повний URL
      let fullUrl = href;
      if (href.startsWith("/")) {
        const base = new URL(baseUrl);
        fullUrl = base.origin + href;
      } else if (!href.startsWith("http")) {
        fullUrl = baseUrl.replace(/\/$/, "") + "/" + href;
      }

      chapters.push({
        url: fullUrl,
        title: text,
        chapterNumber,
        khanda,
      });
      validChapters++;
    });

    console.log(`✅ Found ${chapters.length} chapters (valid: ${validChapters}, skipped intro: ${skippedIntro}, skipped no match: ${skippedNoMatch})`);
    if (chapters.length > 0) {
      console.log(`[extractWisdomlibChapterUrls] First 3 chapters:`, chapters.slice(0, 3));
    } else if (skippedNoMatch > 0) {
      console.warn(`⚠️ No chapters matched the pattern. Consider updating the regex pattern.`);
    }
    return chapters;
  } catch (error) {
    console.error("❌ Error extracting chapter URLs:", error);
    return [];
  }
}

/**
 * Конвертує главу Wisdomlib у стандартний формат для імпорту в БД
 */
export function wisdomlibChapterToStandardChapter(chapter: WisdomlibChapter): any {
  return {
    chapter_number: chapter.chapter_number,
    title_en: chapter.title_en,
    title_ua: chapter.title_en, // Поки що немає UA перекладів з Wisdomlib
    chapter_type: "verses" as const,
    verses: chapter.verses.map((v) => ({
      verse_number: v.verse_number,
      sanskrit: v.bengali || "", // Bengali текст
      transliteration_en: v.transliteration_en || "",
      transliteration_ua: "", // Немає UA транслітерації
      synonyms_en: v.synonyms_en || "",
      synonyms_ua: "", // Немає UA synonyms
      translation_en: v.translation_en || "",
      translation_ua: "", // Немає UA перекладу
      commentary_en: v.commentary_en || "",
      commentary_ua: "", // Немає UA коментарів
    })),
  };
}
