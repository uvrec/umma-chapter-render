// ============================================================================
// WISDOM LIBRARY PARSER - Chaitanya Bhagavata
// Updated version with correct selectors for actual HTML structure
//
// DB STRUCTURE (existing, book slug: 'scb'):
//   books (slug='scb') → cantos (3 khaṇḍas) → chapters → verses
//
// Khaṇḍas stored as cantos:
//   1. Ādi-khaṇḍa
//   2. Madhya-khaṇḍa
//   3. Antya-khaṇḍa
// ============================================================================

export interface WisdomlibVerse {
  verse_number: string; // e.g., "1", "352-353"
  bengali?: string;
  transliteration_en?: string; // IAST with diacritics
  translation_en?: string;
  commentary_en?: string; // Gauḍīya-bhāṣya
}

export interface WisdomlibChapter {
  chapter_number: number;
  khanda_number: number; // 1=Ādi, 2=Madhya, 3=Antya
  khanda_name: string;
  title_en?: string;
  verses: WisdomlibVerse[];
  verseUrls?: Array<{ url: string; verseNumber: string }>;
}

// Khaṇḍa URLs
export const KHANDA_URLS = {
  adi: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1092508.html",
  madhya: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1098648.html",
  antya: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1108917.html",
};

// Khaṇḍa names for display
// Ukrainian transliteration rules:
// - dhy → дг'я (apostrophe for dh cluster before ya)
// - nty → нтья (no apostrophe, soft sign absorption)
export const KHANDA_NAMES: Record<number, { en: string; ua: string }> = {
  1: { en: "Ādi-khaṇḍa", ua: "Аді-кханда" },
  2: { en: "Madhya-khaṇḍa", ua: "Мадг'я-кханда" },
  3: { en: "Antya-khaṇḍa", ua: "Антья-кханда" },
};

export interface WisdomlibChapterFull {
  chapter_number: number;
  khanda_number: number;
  khanda_name: string;
  title_en: string;
  title_ua?: string;
  content_en?: string; // Chapter introduction/description from "Introduction to chapter X"
  content_ua?: string; // To be filled manually later
  verses: WisdomlibVerse[];
  verseUrls: Array<{ url: string; verseNumber: string; fullRef: string }>;
  introUrl?: string;
}

/**
 * Parse a single verse page from Wisdomlib
 *
 * Actual HTML structure on verse pages (text content, not DOM):
 * "Bengali text, Devanagari and Unicode transliteration of verse X.Y.Z:"
 * Bengali: আজানু-লম্বিত-ভুজৌ... ॥ ১ ॥
 * Devanagari: आजानु-लम्बित-भुजौ... ॥ १ ॥ (skip)
 * IAST: ājānu-lambita-bhujau... || 1 ||
 * Plain: ajanu-lambita-bhujau... (1)
 * "English translation:"
 * (1) I offer my respectful obeisances...
 * "Commentary: Gauḍīya-bhāṣya by Śrīla Bhaktisiddhānta..."
 * Commentary text...
 */
export function parseWisdomlibVersePage(html: string, verseUrl: string): WisdomlibVerse | null {
  try {
    // Get full text content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const fullText = doc.body?.textContent || html;

    // Extract verse number from page content
    // Pattern: "Verse X.Y.Z" or "Verse X.Y.Z-W"
    let verseNumber = "1";
    const verseMatch = fullText.match(/Verse\s+\d+\.\d+\.(\d+(?:-\d+)?)/i);
    if (verseMatch) {
      verseNumber = verseMatch[1];
    }

    const verse: WisdomlibVerse = {
      verse_number: verseNumber,
    };

    // Split text into lines for easier parsing
    const lines = fullText
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    // 1. BENGALI TEXT
    // Bengali script: U+0980–U+09FF
    // Has verse marker like ॥ ১ ॥ (Bengali numerals)
    // Must NOT contain Devanagari (U+0900–U+097F)
    for (const line of lines) {
      // Check for Bengali characters
      if (/[\u0980-\u09FF]/.test(line)) {
        // Make sure it's NOT Devanagari (mixed lines exist)
        if (!/[\u0900-\u097F]/.test(line)) {
          // Check for verse marker ॥ (U+0965) with Bengali numeral
          if (/॥\s*[\u09E6-\u09EF\d]+(?:-[\u09E6-\u09EF\d]+)?\s*॥/.test(line)) {
            verse.bengali = line;
            break;
          }
        }
      }
    }

    // 2. IAST TRANSLITERATION
    // Has diacritics: āīūṛṝḷḹṃḥśṣṇṭḍñṅ
    // Ends with || number || pattern
    // Starts with lowercase letter
    for (const line of lines) {
      // Must have IAST diacritics
      if (!/[āīūṛṝḷḹṃḥśṣṇṭḍñṅ]/.test(line)) continue;
      // Must have || marker
      if (!/\|\|/.test(line)) continue;
      // Must start with lowercase (not header text)
      if (!/^[a-zāīūṛṝḷḹṃḥśṣṇṭḍñṅ]/.test(line)) continue;
      // Must end with || number || pattern
      if (/\|\|\s*\d+(?:-\d+)?\s*\|\|/.test(line)) {
        verse.transliteration_en = line;
        break;
      }
    }

    // 3. ENGLISH TRANSLATION
    // Pattern: starts with (number) like "(1)" or "(352-353)"
    // Should be after "English translation:" marker
    let foundEngMarker = false;
    for (const line of lines) {
      // Check for English translation marker
      if (/English\s*translation\s*:/i.test(line)) {
        foundEngMarker = true;
        continue;
      }

      // Look for translation line starting with (number)
      const transMatch = line.match(/^\((\d+(?:-\d+)?)\)\s*(.+)/);
      if (transMatch) {
        // Verify it's actual translation (has enough English text)
        if (transMatch[2].length > 20 && /[a-zA-Z]{3,}/.test(transMatch[2])) {
          verse.translation_en = line;
          break;
        }
      }
    }

    // 4. COMMENTARY - Gauḍīya-bhāṣya
    // After "Commentary:" or "Gauḍīya-bhāṣya" marker
    const commentaryParts: string[] = [];
    let inCommentary = false;

    for (const line of lines) {
      if (!inCommentary) {
        // Check for commentary start
        if (/Commentary:|Gauḍīya-bhāṣya/i.test(line)) {
          inCommentary = true;
          // Get text after the marker on same line
          const afterMarker = line.split(/Commentary:\s*Gauḍīya-bhāṣya[^:]*:|Commentary:/i)[1];
          if (afterMarker && afterMarker.trim().length > 20) {
            commentaryParts.push(afterMarker.trim());
          }
          continue;
        }
      } else {
        // Stop at navigation/footer
        if (/^(Previous|Next|Like what you read|Let's grow together|parent:|source:)/i.test(line)) break;
        // Stop at new verse
        if (/^Verse\s+\d+\.\d+\.\d+/i.test(line)) break;
        // Skip very short lines (headers, etc)
        if (line.length < 20) continue;
        // Skip Bengali/Devanagari
        if (/[\u0900-\u097F\u0980-\u09FF]/.test(line)) continue;

        commentaryParts.push(line);
      }
    }

    if (commentaryParts.length > 0) {
      verse.commentary_en = commentaryParts.join("\n\n");
    }

    // Debug log
    console.log("✅ Parsed verse:", {
      verse_number: verse.verse_number,
      bengali: verse.bengali ? `${verse.bengali.substring(0, 50)}...` : "MISSING",
      transliteration: verse.transliteration_en ? `${verse.transliteration_en.substring(0, 50)}...` : "MISSING",
      translation: verse.translation_en ? `${verse.translation_en.substring(0, 50)}...` : "MISSING",
      commentary: verse.commentary_en ? `${verse.commentary_en.length} chars` : "MISSING",
    });

    // Return null if no content found
    if (!verse.bengali && !verse.translation_en) {
      console.warn("⚠️ No content found for verse");
      return null;
    }

    return verse;
  } catch (error) {
    console.error("❌ Parse error:", error);
    return null;
  }
}

/**
 * Extract verse URLs from a khaṇḍa or chapter index page
 * Links follow pattern: /d/docNNNNNN.html with text "Verse X.Y.Z"
 */
export function extractVerseUrlsFromIndex(
  html: string,
  baseUrl: string,
): Array<{ url: string; verseNumber: string; fullRef: string }> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const verses: Array<{ url: string; verseNumber: string; fullRef: string }> = [];

    const links = doc.querySelectorAll('a[href*="/d/doc"]');

    links.forEach((link) => {
      const href = link.getAttribute("href");
      const text = link.textContent?.trim() || "";

      if (!href) return;

      // Match "Verse 1.1.1" or "Verse 3.5.352-353"
      const verseMatch = text.match(/Verse\s+(\d+)\.(\d+)\.(\d+(?:-\d+)?)/i);
      if (!verseMatch) return;

      const [, khanda, chapter, verse] = verseMatch;
      const fullRef = `${khanda}.${chapter}.${verse}`;

      // Build full URL
      let fullUrl = href;
      if (href.startsWith("/")) {
        const base = new URL(baseUrl);
        fullUrl = base.origin + href;
      }

      verses.push({
        url: fullUrl,
        verseNumber: verse,
        fullRef,
      });
    });

    // Sort by verse number
    verses.sort((a, b) => {
      const aNum = parseInt(a.verseNumber.split("-")[0], 10);
      const bNum = parseInt(b.verseNumber.split("-")[0], 10);
      return aNum - bNum;
    });

    console.log(`✅ Found ${verses.length} verse URLs`);
    return verses;
  } catch (error) {
    console.error("❌ Error extracting verse URLs:", error);
    return [];
  }
}

/**
 * Parse chapter introduction page from Wisdomlib
 * URL pattern: "Introduction to chapter X"
 * Content goes into chapters.content_en (not intro_chapters table)
 * intro_chapters table is for book-level intros like Preface, Foreword
 */
export function parseChapterIntroPage(
  html: string,
  khandaNumber: number,
  chapterNumber: number,
  chapterTitle: string,
): { content_en: string } | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const fullText = doc.body?.textContent || html;

    // Find introduction content - everything after "Introduction to chapter X" heading
    // and before navigation/footer
    const lines = fullText
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const contentParts: string[] = [];
    let inIntro = false;

    for (const line of lines) {
      // Start capturing after intro header
      if (/Introduction to chapter\s+\d+/i.test(line)) {
        inIntro = true;
        continue;
      }

      if (!inIntro) continue;

      // Stop conditions
      if (/^(Previous|Next|Like what you read|Let's grow together|parent:|source:)/i.test(line)) break;
      if (/^Verse\s+\d+\.\d+\.\d+/i.test(line)) break;
      if (/^Chapter\s+\d+\s*[-–]/i.test(line)) break;

      // Skip short lines and navigation
      if (line.length < 30) continue;
      // Skip if contains book metadata
      if (/by Bhumipati|1,349,850 words|16th century/i.test(line)) continue;

      contentParts.push(line);
    }

    if (contentParts.length === 0) {
      console.warn(`⚠️ No intro content found for chapter ${khandaNumber}.${chapterNumber}`);
      return null;
    }

    // Format as HTML paragraphs
    const contentHtml = contentParts.map((p) => `<p>${p}</p>`).join("\n");

    console.log(`✅ Parsed intro for chapter ${khandaNumber}.${chapterNumber}: ${contentParts.length} paragraphs`);
    return { content_en: contentHtml };
  } catch (error) {
    console.error("❌ Error parsing chapter intro:", error);
    return null;
  }
}

/**
 * Extract chapter info including intro URL from khaṇḍa index page
 * Links follow patterns:
 * - "Chapter X - Title" for chapter page
 * - "Introduction to chapter X" for intro page
 */
export function extractChaptersWithIntros(
  html: string,
  baseUrl: string,
  khandaNumber: number,
): Array<{
  chapterNumber: number;
  title: string;
  chapterUrl: string;
  introUrl?: string;
}> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const chapters = new Map<number, { title: string; chapterUrl: string; introUrl?: string }>();

    const links = doc.querySelectorAll('a[href*="/d/doc"]');

    links.forEach((link) => {
      const href = link.getAttribute("href");
      const text = link.textContent?.trim() || "";

      if (!href) return;

      // Build full URL
      let fullUrl = href;
      if (href.startsWith("/")) {
        const base = new URL(baseUrl);
        fullUrl = base.origin + href;
      }

      // Match "Chapter X - Title"
      const chapterMatch = text.match(/Chapter\s+(\d+)\s*[-–]\s*(.+)/i);
      if (chapterMatch) {
        const num = parseInt(chapterMatch[1], 10);
        const title = chapterMatch[2].trim();
        const existing = chapters.get(num);
        chapters.set(num, {
          title: existing?.title || title,
          chapterUrl: fullUrl,
          introUrl: existing?.introUrl,
        });
        return;
      }

      // Match "Introduction to chapter X"
      const introMatch = text.match(/Introduction to chapter\s+(\d+)/i);
      if (introMatch) {
        const num = parseInt(introMatch[1], 10);
        const existing = chapters.get(num);
        chapters.set(num, {
          title: existing?.title || `Chapter ${num}`,
          chapterUrl: existing?.chapterUrl || "",
          introUrl: fullUrl,
        });
        return;
      }
    });

    // Convert to array and sort
    const result = Array.from(chapters.entries())
      .map(([num, data]) => ({
        chapterNumber: num,
        title: data.title,
        chapterUrl: data.chapterUrl,
        introUrl: data.introUrl,
      }))
      .filter((ch) => ch.chapterUrl) // Must have chapter URL
      .sort((a, b) => a.chapterNumber - b.chapterNumber);

    console.log(
      `✅ Found ${result.length} chapters with ${result.filter((c) => c.introUrl).length} intros in khaṇḍa ${khandaNumber}`,
    );
    return result;
  } catch (error) {
    console.error("❌ Error extracting chapters:", error);
    return [];
  }
}

/**
 * Determine khaṇḍa from URL
 */
export function getKhandaFromUrl(url: string): { name: string; number: number } {
  const lower = url.toLowerCase();
  if (lower.includes("antya") || lower.includes("doc1108917") || lower.includes("doc110") || lower.includes("doc111")) {
    return { name: "antya", number: 3 };
  }
  if (
    lower.includes("madhya") ||
    lower.includes("doc1098648") ||
    lower.includes("doc109") ||
    lower.includes("doc110")
  ) {
    return { name: "madhya", number: 2 };
  }
  return { name: "adi", number: 1 };
}

/**
 * Parse full verse reference like "1.15.101" or "3.5.352-353"
 */
export function parseVerseRef(ref: string): { khanda: number; chapter: number; verse: string } | null {
  const match = ref.match(/^(\d+)\.(\d+)\.(\d+(?:-\d+)?)$/);
  if (!match) return null;
  return {
    khanda: parseInt(match[1], 10),
    chapter: parseInt(match[2], 10),
    verse: match[3],
  };
}

/**
 * Convert to standard format for database import
 */
export function wisdomlibVerseToStandard(verse: WisdomlibVerse, khandaNumber: number, chapterNumber: number) {
  return {
    verse_number: verse.verse_number,
    bengali: verse.bengali || "",
    transliteration_en: verse.transliteration_en || "",
    transliteration_ua: "",
    synonyms_en: "", // Chaitanya Bhagavata doesn't have word-for-word
    synonyms_ua: "",
    translation_en: verse.translation_en || "",
    translation_ua: "",
    commentary_en: verse.commentary_en || "",
    commentary_ua: "",
  };
}

/**
 * Convert chapter to standard format
 */
export function wisdomlibChapterToStandard(chapter: WisdomlibChapter) {
  return {
    chapter_number: chapter.chapter_number,
    khanda_number: chapter.khanda_number,
    khanda_name: chapter.khanda_name,
    title_en: chapter.title_en || `Chapter ${chapter.chapter_number}`,
    title_ua: "",
    chapter_type: "verses" as const,
    verses: chapter.verses.map((v) => wisdomlibVerseToStandard(v, chapter.khanda_number, chapter.chapter_number)),
  };
}

// ============================================================================
// DATABASE EXPORT STRUCTURES
// Existing DB structure for book 'scb':
//   books (id, slug='scb')
//     → cantos (id, book_id, canto_number=1/2/3, title_en, title_ua)
//       → chapters (id, book_id, canto_id, chapter_number, title_en, title_ua, content_en, content_ua)
//         → verses (id, chapter_id, verse_number, sanskrit, transliteration_en, translation_en, commentary_en, ...)
// ============================================================================

/**
 * Structure for cantos table (3 khaṇḍas)
 * Canto records should already exist in DB for book 'scb'
 */
export interface CantoDbRecord {
  id: string; // UUID - use existing canto IDs
  book_id: string;
  canto_number: number; // 1, 2, or 3
  title_en: string; // "Ādi-khaṇḍa", "Madhya-khaṇḍa", "Antya-khaṇḍa"
  title_ua: string; // "Аді-кханда", "Мадхья-кханда", "Антья-кханда"
}

/**
 * Structure for chapters table insert
 */
export interface ChapterDbInsert {
  book_id: string; // UUID of 'scb' book
  canto_id?: string; // UUID of canto (khanda)
  chapter_number: number;
  title_en: string;
  title_ua: string;
  content_en?: string; // Chapter introduction from "Introduction to chapter X"
  content_ua?: string;
}

/**
 * Structure for verses table insert
 */
export interface VerseDbInsert {
  chapter_id: string;
  verse_number: string;
  sanskrit: string; // Bengali text goes here
  transliteration_en: string;
  transliteration_ua: string;
  synonyms_en: string;
  synonyms_ua: string;
  translation_en: string;
  translation_ua: string;
  commentary_en: string;
  commentary_ua: string;
  sort_key: number;
  is_published: boolean;
}

/**
 * Convert parsed data to database insert format
 * Chapter intro goes into chapters.content_en (not intro_chapters table)
 */
export function prepareChapterForDb(
  chapter: WisdomlibChapterFull,
  bookId: string,
  cantoId: string,
): {
  chapter: ChapterDbInsert;
  verses: Omit<VerseDbInsert, "chapter_id">[];
} {
  const chapterInsert: ChapterDbInsert = {
    book_id: bookId,
    canto_id: cantoId,
    chapter_number: chapter.chapter_number,
    title_en: chapter.title_en,
    title_ua: chapter.title_ua || "",
    content_en: chapter.content_en || "", // Introduction content
    content_ua: chapter.content_ua || "",
  };

  const versesInsert = chapter.verses.map((v, idx) => ({
    verse_number: v.verse_number,
    sanskrit: v.bengali || "", // Bengali text in sanskrit field
    transliteration_en: v.transliteration_en || "",
    transliteration_ua: "",
    synonyms_en: "", // CB doesn't have word-for-word
    synonyms_ua: "",
    translation_en: v.translation_en || "",
    translation_ua: "",
    commentary_en: v.commentary_en || "",
    commentary_ua: "",
    sort_key: (idx + 1) * 10,
    is_published: true,
  }));

  return {
    chapter: chapterInsert,
    verses: versesInsert,
  };
}

/**
 * Generate SQL for inserting a chapter with all its content
 * This can be used for manual database import
 */
export function generateInsertSql(chapter: WisdomlibChapterFull, bookId: string, cantoId: string): string {
  const data = prepareChapterForDb(chapter, bookId, cantoId);
  const lines: string[] = [];

  // Escape SQL string
  const esc = (s: string) => s.replace(/'/g, "''");

  // Chapter insert (including content_en for introduction)
  lines.push(`-- Chapter ${chapter.khanda_number}.${chapter.chapter_number}: ${chapter.title_en}`);
  lines.push(`INSERT INTO chapters (book_id, canto_id, chapter_number, title_en, title_ua, content_en, content_ua)`);
  lines.push(
    `VALUES ('${bookId}', '${cantoId}', ${data.chapter.chapter_number}, '${esc(data.chapter.title_en)}', '${esc(data.chapter.title_ua)}', '${esc(data.chapter.content_en || "")}', '${esc(data.chapter.content_ua || "")}')`,
  );
  lines.push(`RETURNING id;`);
  lines.push(``);

  // Verses insert
  if (data.verses.length > 0) {
    lines.push(`-- Verses (${data.verses.length} total)`);
    lines.push(`-- NOTE: Replace CHAPTER_ID_HERE with actual chapter id from RETURNING above`);
    lines.push(
      `INSERT INTO verses (chapter_id, verse_number, sanskrit, transliteration_en, translation_en, commentary_en, sort_key, is_published)`,
    );
    lines.push(`VALUES`);

    const valueLines = data.verses.map((v, idx) => {
      const isLast = idx === data.verses.length - 1;
      return `  ('CHAPTER_ID_HERE', '${esc(v.verse_number)}', '${esc(v.sanskrit)}', '${esc(v.transliteration_en)}', '${esc(v.translation_en)}', '${esc(v.commentary_en)}', ${v.sort_key}, true)${isLast ? ";" : ","}`;
    });
    lines.push(...valueLines);
  }

  return lines.join("\n");
}
