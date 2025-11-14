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
 * 1. Bengali text (4 рядки) - в blockquote > p
 * 2. English translation - перший p після blockquote
 * 3. Commentary - після "Commentary: Gauḍīya-bhāṣya"
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

    // 1. BENGALI TEXT - в blockquote (всі рядки разом)
    const blockquote = doc.querySelector("#scontent blockquote, #pageContent blockquote");
    if (blockquote) {
      const paragraphs = blockquote.querySelectorAll("p");
      const bengaliLines: string[] = [];

      paragraphs.forEach((p) => {
        const text = p.textContent?.trim() || "";
        // Bengali текст містить специфічні символи Unicode U+0980–U+09FF
        if (text && /[\u0980-\u09FF]/.test(text)) {
          bengaliLines.push(text);
        }
      });

      if (bengaliLines.length > 0) {
        verse.bengali = bengaliLines.join("\n");
      }
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
 */
export function extractWisdomlibVerseUrls(
  html: string,
  chapterUrl: string,
): Array<{ url: string; verseNumber: string }> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const verseUrls: Array<{ url: string; verseNumber: string }> = [];

    const contentArea = doc.querySelector("#scontent, .content, main") || doc;
    const links = contentArea.querySelectorAll('a[href*="/d/doc"]');

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const text = link.textContent?.trim() || "";
      const title = link.getAttribute("title") || "";

      // Шукаємо номер вірша: "1", "1.1", "1.1.1", "Verse 1", "Verse 1.1.1", тощо
      const verseMatch =
        text.match(/^(?:Verse\s*)?(\d+(?:\.\d+){0,2})\b/i) ||
        title.match(/(?:Verse\s*)?(\d+(?:\.\d+){0,2})/i);
      if (!verseMatch) return;

      // ✅ FIX: Витягуємо тільки останнє число з формату "1.1.73" → "73"
      // Це запобігає створенню дублікатів з неправильними номерами
      let verseNumber = verseMatch[1];
      const parts = verseNumber.split('.');
      if (parts.length > 1) {
        const originalNumber = verseNumber;
        verseNumber = parts[parts.length - 1]; // Беремо останню частину
        console.log(`📝 [WisdomLib] Normalized verse number: "${originalNumber}" → "${verseNumber}"`);
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

      verseUrls.push({ url: fullUrl, verseNumber });
    });

    // Сортуємо за номером вірша (підтримка крапкових номерів)
    verseUrls.sort((a, b) => {
      const aParts = a.verseNumber.split('.').map(Number);
      const bParts = b.verseNumber.split('.').map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const av = aParts[i] ?? 0;
        const bv = bParts[i] ?? 0;
        if (av !== bv) return av - bv;
      }
      return 0;
    });

    console.log(`✅ Found ${verseUrls.length} verse URLs in chapter`);
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

      // Визначаємо khaṇḍa з baseUrl (href = /d/doc... не містить adi/madhya/antya)
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
