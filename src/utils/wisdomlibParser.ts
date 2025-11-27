// ============================================================================
// WISDOM LIBRARY PARSER - Chaitanya Bhagavata
// Виправлена версія з правильними селекторами для структури HTML
//
// Структура Wisdom Library:
// - Bengali: পুনঃ ভক্ত-সঙ্গে... (Unicode U+0980-U+09FF)
// - Devanagari: पुनः भक्त-सङ्गे... (Unicode U+0900-U+097F) - НЕ ІМПОРТУЄМО (дублювання)
// - IAST транслітерація: punaḥ bhakta-saṅge... (латиниця з діакритиками)
// - English translation
// - Commentary: Gauḍīya-bhāṣya
// ============================================================================

import { parseVerseNumber } from "./vedabaseParsers";

export interface WisdomlibVerse {
  verse_number: string;
  bengali?: string; // Bengali text (оригінал)
  transliteration_en?: string; // IAST транслітерація
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string; // Gauḍīya-bhāṣya
  // Метадані для composite віршів
  is_composite?: boolean;
  start_verse?: number;
  end_verse?: number;
}

export interface WisdomlibChapter {
  chapter_number: number;
  title_en?: string;
  verses: WisdomlibVerse[];
  khanda: string; // adi, madhya, antya
  verseUrls?: Array<{ url: string; verseNumber: string; isComposite: boolean }>;
}

/**
 * Перевіряє чи є текст Bengali (а не Devanagari)
 * Bengali: U+0980-U+09FF
 * Devanagari: U+0900-U+097F (ігноруємо - це дублювання)
 */
function isBengaliText(text: string): boolean {
  // Текст є Bengali якщо містить Bengali символи
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Перевіряє чи є текст Devanagari (яку ми пропускаємо)
 */
function isDevanagariText(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Перевіряє чи є текст IAST транслітерацією
 * IAST містить латинські символи з діакритиками: ā, ī, ū, ṛ, ṝ, ḷ, ḹ, ē, ō, ṃ, ḥ, ś, ṣ, ṇ, ṭ, ḍ, ñ, ṅ
 */
function isIASTText(text: string): boolean {
  // Повинен містити латиницю + хоча б один IAST діакритичний знак
  const hasLatin = /[a-zA-Z]/.test(text);
  const hasIASTDiacritics = /[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅĀĪŪṚṜḶḸĒŌṂḤŚṢṆṬḌÑṄ]/.test(text);
  // Не повинен бути Bengali або Devanagari
  const notIndic = !isBengaliText(text) && !isDevanagariText(text);
  return hasLatin && hasIASTDiacritics && notIndic;
}

/**
 * Витягує номер вірша з тексту сторінки або URL
 * Підтримує формати: "Verse 256", "Verse 256-266", "Texts 1-5", тощо
 */
function extractVerseNumberFromPage(doc: Document, url: string): string {
  // 1. Спробувати з заголовка сторінки
  const h1 = doc.querySelector("h1");
  if (h1) {
    const h1Text = h1.textContent || "";
    // "Verse 256-266" або "Verse 256"
    const verseMatch = h1Text.match(/(?:Verse|Verses|Text|Texts)\s+(\d+(?:\s*[-–]\s*\d+)?)/i);
    if (verseMatch) {
      return verseMatch[1].replace(/\s+/g, "").replace("–", "-");
    }
  }

  // 2. З breadcrumb або навігації
  const breadcrumbs = Array.from(doc.querySelectorAll(".breadcrumb a, nav a, .navigation a"));
  for (const bc of breadcrumbs) {
    const text = bc.textContent || "";
    const match = text.match(/(?:Verse|Text)\s+(\d+(?:\s*[-–]\s*\d+)?)/i);
    if (match) {
      return match[1].replace(/\s+/g, "").replace("–", "-");
    }
  }

  // 3. З контенту сторінки - шукаємо "(256)" або "(256-266)" на початку вірша
  const scontent = doc.querySelector("#scontent, #pageContent");
  if (scontent) {
    const text = scontent.textContent || "";
    const match = text.match(/\((\d+(?:-\d+)?)\)/);
    if (match) {
      return match[1];
    }
  }

  // 4. Fallback: з URL (doc617046.html - але це ID документа, не номер вірша)
  // Краще повернути "1" як default
  return "1";
}

/**
 * Парсинг окремої сторінки вірша
 *
 * Структура Wisdom Library для Chaitanya Bhagavata:
 * 1. Bengali text - в blockquote > p (пропускаємо Devanagari!)
 * 2. IAST транслітерація - латиниця з діакритиками
 * 3. English translation - текст без діакритик
 * 4. Commentary - після "Commentary: Gauḍīya-bhāṣya"
 */
export function parseWisdomlibVersePage(html: string, verseUrl: string): WisdomlibVerse | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Витягуємо номер вірша з контенту сторінки
    const verseNumber = extractVerseNumberFromPage(doc, verseUrl);

    // Парсимо номер для composite інформації
    const parsedNumber = parseVerseNumber(verseNumber);

    const verse: WisdomlibVerse = {
      verse_number: verseNumber,
      is_composite: parsedNumber.isComposite,
      start_verse: parsedNumber.startVerse,
      end_verse: parsedNumber.endVerse,
    };

    // 1. BENGALI TEXT - в blockquote (всі рядки разом)
    // ВАЖЛИВО: Беремо тільки Bengali (U+0980-U+09FF), пропускаємо Devanagari (U+0900-U+097F)
    const blockquotes = doc.querySelectorAll("#scontent blockquote, #pageContent blockquote, blockquote");
    const bengaliLines: string[] = [];
    const iastLines: string[] = [];

    blockquotes.forEach((blockquote) => {
      const paragraphs = blockquote.querySelectorAll("p");

      paragraphs.forEach((p) => {
        const text = p.textContent?.trim() || "";
        if (!text) return;

        // Перевіряємо тип тексту
        if (isBengaliText(text) && !isDevanagariText(text)) {
          // Чистий Bengali текст - беремо
          bengaliLines.push(text);
        } else if (isBengaliText(text) && isDevanagariText(text)) {
          // Змішаний текст - можливо Bengali з Devanagari, фільтруємо
          // Витягуємо тільки Bengali частину
          const bengaliOnly = text.replace(/[\u0900-\u097F]+/g, "").trim();
          if (bengaliOnly) {
            bengaliLines.push(bengaliOnly);
          }
        } else if (isIASTText(text)) {
          // IAST транслітерація
          iastLines.push(text);
        }
        // Devanagari тексти пропускаємо повністю
      });
    });

    if (bengaliLines.length > 0) {
      verse.bengali = bengaliLines.join("\n");
    }

    // Зберігаємо IAST з blockquote якщо знайдено
    if (iastLines.length > 0 && !verse.transliteration_en) {
      verse.transliteration_en = iastLines.join("\n");
    }

    // 2. ENGLISH TRANSLATION - robust: search by label or numbered pattern within subtree
    // Prefer #scontent (content area) and fallback to #pageContent only if missing
    const scontent = doc.querySelector("#scontent") || doc.querySelector("#pageContent");
    if (scontent) {
      const ps = Array.from(scontent.querySelectorAll("p")) as HTMLParagraphElement[];

      let translation = "";

      const normalize = (t: string) => t.replace(/\s+/g, " ").trim();
      const isValidText = (t: string) =>
        t.length > 20 &&
        !/english\s*translation/i.test(t) &&
        !/^Bengali text.*transliteration/i.test(t) &&
        !/Previous|Next|Like what you read\?/i.test(t) &&
        !/Buy now/i.test(t) &&
        !/Chaitanya Bhagavata/i.test(t);

      // Find explicit "English translation" label
      const labelP = ps.find((p) => /english\s*translation\s*:?/i.test((p.textContent || "")));
      if (labelP) {
        const labelText = normalize(labelP.textContent || "");
        // If translation is on the same line after the colon, grab it
        const sameLine = labelText.match(/english\s*translation\s*:?\s*(.+)$/i);
        if (sameLine && sameLine[1] && sameLine[1].length > 10) {
          translation = sameLine[1];
        } else {
          // Otherwise take the next meaningful paragraph AFTER the label
          const idx = ps.indexOf(labelP);
          for (let i = idx + 1; i < ps.length; i++) {
            const t = normalize(ps[i].textContent || "");
            if (isValidText(t)) {
              translation = t;
              break;
            }
          }
        }
      }

      // Fallback: paragraph that starts with a numbered marker like "(198)"
      if (!translation) {
        const cand = ps.find((p) => /^\(\d+\)\s+/.test((p.textContent || "").trim()));
        if (cand) translation = normalize(cand.textContent || "");
      }

      // Final fallback: first non-blockquote, meaningful paragraph
      if (!translation) {
        const cand = ps.find((p) => !p.closest("blockquote") && isValidText(normalize(p.textContent || "")));
        if (cand) translation = normalize(cand.textContent || "");
      }

      if (translation) {
        verse.translation_en = translation;
      }
    }

    // 3. COMMENTARY - paragraphs after the "Commentary: Gauḍīya-bhāṣya" heading
    if (scontent) {
      const commentaryParts: string[] = [];

      // Prefer heading elements (h2/h3/h4) labeled as Commentary
      const headers = Array.from(scontent.querySelectorAll("h2, h3, h4"));
      const headerEl = headers.find((h) => /Commentary:|Gauḍīya-bhāṣya/i.test((h.textContent || "")) ) || null;

      if (headerEl) {
        let el: Element | null = headerEl.nextElementSibling;
        while (el) {
          const text = (el.textContent || "").trim();
          if (!text) { el = el.nextElementSibling; continue; }

          // Stop at navigation/other sections or next major heading
          if (/^English translation/i.test(text)) break;
          if (/^Previous|^Next|Like what you read\?|^parent:/i.test(text)) break;
          if (/^Commentary:/i.test(text) && el !== headerEl) break;
          if (/^Verse\s+\d/i.test(text)) break;
          if (/^(References|Notes|Further reading)/i.test(text)) break;

          const tag = el.tagName.toLowerCase();
          if (tag === 'p') {
            commentaryParts.push(text);
          } else if (tag === 'ul' || tag === 'ol') {
            const lis = Array.from(el.querySelectorAll('li')).map(li => (li.textContent || '').trim()).filter(Boolean);
            if (lis.length) commentaryParts.push(lis.join('\n'));
          }

          const next = el.nextElementSibling;
          if (next && /^(H2|H3|H4)$/.test(next.tagName)) {
            const nextText = (next.textContent || '').trim();
            if (/^\s*(Translation|Commentary|References|Notes)\b/i.test(nextText)) break;
          }

          el = el.nextElementSibling;
        }
      } else {
        // Fallback: header as a paragraph containing "Commentary:"
        const ps = Array.from(scontent.querySelectorAll("p")) as HTMLParagraphElement[];
        const startIdx = ps.findIndex((p) => /Commentary:|Gauḍīya-bhāṣya/i.test((p.textContent || "")));
        if (startIdx >= 0) {
          const headerText = (ps[startIdx].textContent || '').trim();
          const afterHeader = headerText.split(/Commentary:|Gauḍīya-bhāṣya[^:]*:/i)[1];
          if (afterHeader && afterHeader.trim()) commentaryParts.push(afterHeader.trim());

          for (let i = startIdx + 1; i < ps.length; i++) {
            const text = (ps[i].textContent || '').trim();
            if (!text) continue;
            if (/^Previous|^Next|Like what you read\?|^parent:/i.test(text)) break;
            if (/^English translation/i.test(text)) break;
            if (/^Commentary:/i.test(text)) break;
            commentaryParts.push(text);
          }
        }
      }

      if (commentaryParts.length > 0) {
        verse.commentary_en = commentaryParts.join("\n\n");
      }
    }

    // 4. TRANSLITERATION - шукаємо IAST текст в різних місцях
    // Вже витягли з blockquote вище, тепер перевіряємо інші місця
    if (!verse.transliteration_en && scontent) {
      const allParagraphs = Array.from(scontent.querySelectorAll("p"));
      const iastParagraphs: string[] = [];

      for (const p of allParagraphs) {
        // Пропускаємо параграфи всередині blockquote (вже оброблені)
        if (p.closest("blockquote")) continue;

        const text = p.textContent?.trim() || "";
        if (isIASTText(text)) {
          iastParagraphs.push(text);
        }
      }

      if (iastParagraphs.length > 0) {
        verse.transliteration_en = iastParagraphs.join("\n");
      }
    }

    // 5. SYNONYMS - слова через "—" та ";"
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
      is_composite: verse.is_composite,
      bengali: verse.bengali ? `${verse.bengali.substring(0, 50)}...` : "MISSING",
      iast: verse.transliteration_en ? `${verse.transliteration_en.substring(0, 50)}...` : "MISSING",
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
 * Підтримує: "Verse 1", "Verse 256-266", "Texts 1-5", тощо
 */
export function extractWisdomlibVerseUrls(
  html: string,
  chapterUrl: string,
): Array<{ url: string; verseNumber: string; isComposite: boolean }> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const verseUrls: Array<{ url: string; verseNumber: string; isComposite: boolean }> = [];
    const seenUrls = new Set<string>();

    const contentArea = doc.querySelector("#scontent, .content, main") || doc;
    const links = contentArea.querySelectorAll('a[href*="/d/doc"]');

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const text = link.textContent?.trim() || "";
      const title = link.getAttribute("title") || "";

      // Шукаємо номер вірша з підтримкою діапазонів:
      // "1", "256-266", "1.1", "Verse 1", "Verse 256-266", "Texts 1-5"
      const verseMatch =
        text.match(/^(?:Verse|Verses|Text|Texts)\s*(\d+(?:\s*[-–]\s*\d+)?)/i) ||
        text.match(/^(\d+(?:\s*[-–]\s*\d+)?)\b/) ||
        title.match(/(?:Verse|Verses|Text|Texts)\s*(\d+(?:\s*[-–]\s*\d+)?)/i) ||
        title.match(/(\d+(?:\s*[-–]\s*\d+)?)/);

      if (!verseMatch) return;

      // Нормалізуємо номер вірша (прибираємо пробіли, замінюємо – на -)
      const verseNumber = verseMatch[1].replace(/\s+/g, "").replace("–", "-");

      // Будуємо повний URL
      let fullUrl = href;
      if (href.startsWith("/")) {
        const base = new URL(chapterUrl);
        fullUrl = base.origin + href;
      } else if (!href.startsWith("http")) {
        const base = new URL(chapterUrl);
        fullUrl = base.origin + "/" + href;
      }

      // Уникаємо дублікатів
      if (seenUrls.has(fullUrl)) return;
      seenUrls.add(fullUrl);

      // Визначаємо чи це composite вірш
      const isComposite = verseNumber.includes("-");

      verseUrls.push({ url: fullUrl, verseNumber, isComposite });
    });

    // Сортуємо за номером вірша (враховуючи діапазони)
    verseUrls.sort((a, b) => {
      // Для діапазонів беремо перше число
      const aFirst = parseInt(a.verseNumber.split("-")[0].split(".").pop() || "0", 10);
      const bFirst = parseInt(b.verseNumber.split("-")[0].split(".").pop() || "0", 10);
      return aFirst - bFirst;
    });

    console.log(`✅ Found ${verseUrls.length} verse URLs in chapter (${verseUrls.filter(v => v.isComposite).length} composite)`);
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Витягуємо номер глави з URL
    const chapterMatch = chapterUrl.match(/chapter[_-]?(\d+)/i) || chapterUrl.match(/doc(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 1;

    // Витягуємо заголовок
    const titleEl = doc.querySelector("h1, h2, .chapter-title, #scontent > h2");
    const title = titleEl?.textContent?.trim() || `Chapter ${chapterNumber}`;

    // Витягуємо URLs віршів
    const verseUrls = extractWisdomlibVerseUrls(html, chapterUrl);

    console.log(`✅ Chapter ${chapterNumber} parsed:`, {
      title,
      khanda,
      verseCount: verseUrls.length,
    });

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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const chapters: Array<{ url: string; title: string; chapterNumber: number; khanda: string }> = [];

    // Шукаємо всі посилання на глави
    const links = doc.querySelectorAll('a[href*="/d/doc"]');

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const text = link.textContent?.trim() || "";

      // Пропускаємо не-глави
      const lower = text.toLowerCase();
      if (lower.includes("introduction") || lower.includes("preface") || lower.includes("index")) return;

      // Беремо контекст з батьківського елемента (li, p, div) — там часто є номер
      const parent = link.closest("li, p, div");
      const context = parent?.textContent?.trim() || "";

      // Варіанти визначення номера глави:
      // 1) "Chapter 1" або "Adhyāya 1"
      // 2) "1. ..." або "1 – ..." на початку рядка
      let chapterNumber: number | null = null;
      const r1 = text.match(/(?:Chapter|Adhy[āa]ya)\s+(\d+)/i) || context.match(/(?:Chapter|Adhy[āa]ya)\s+(\d+)/i);
      if (r1) {
        chapterNumber = parseInt(r1[1], 10);
      } else {
        const r2 = text.match(/^\s*(\d+)\s*[.:\-–]\s+/) || context.match(/^\s*(\d+)\s*[.:\-–]\s+/);
        if (r2) chapterNumber = parseInt(r2[1], 10);
      }
      if (chapterNumber === null) return;

      // Визначаємо khaṇḍa з baseUrl, а не з href (бо href - це /d/doc...)
      const khanda = determineKhandaFromUrl(baseUrl).name;

      // Будуємо повний URL
      let fullUrl = href;
      if (href.startsWith("/")) {
        const base = new URL(baseUrl);
        fullUrl = base.origin + href;
      } else if (!href.startsWith("http")) {
        fullUrl = baseUrl.replace(/\/$/, "") + "/" + href;
      }

      chapters.push({ url: fullUrl, title: text, chapterNumber, khanda });
    });

    // Сортуємо за номером глави
    chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    console.log(`✅ Found ${chapters.length} chapters`);
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
      sanskrit: v.bengali || "", // Bengali текст (оригінал)
      transliteration_en: v.transliteration_en || "", // IAST транслітерація
      transliteration_ua: "", // Немає UA транслітерації
      synonyms_en: v.synonyms_en || "",
      synonyms_ua: "", // Немає UA synonyms
      translation_en: v.translation_en || "",
      translation_ua: "", // Немає UA перекладу
      commentary_en: v.commentary_en || "",
      commentary_ua: "", // Немає UA коментарів
      // Composite verse metadata
      is_composite: v.is_composite || false,
      start_verse: v.start_verse,
      end_verse: v.end_verse,
    })),
  };
}
