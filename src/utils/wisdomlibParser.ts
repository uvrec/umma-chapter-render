// ============================================================================
// WISDOM LIBRARY PARSER - Chaitanya Bhagavata
// Based on working Python parser: wisdomlib_scb_parser.py
//
// Структура Wisdom Library:
// - Bengali: blockquote > p:nth-child(2) (Unicode U+0980-U+09FF)
// - Devanagari: SKIP (дублювання)
// - IAST: blockquote > p:nth-child(4) > em
// - English translation: (number) text after "English translation:"
// - Commentary: after "Commentary: Gauḍīya-bhāṣya"
// ============================================================================

import { parseVerseNumber } from "./vedabaseParsers";

// ============================================================================
// INTERFACES
// ============================================================================

export interface WisdomlibVerse {
  verse_number: string;
  bengali?: string;
  transliteration_en?: string;
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string;
  is_composite?: boolean;
  start_verse?: number;
  end_verse?: number;
}

export interface WisdomlibChapter {
  chapter_number: number;
  title_en?: string;
  verses: WisdomlibVerse[];
  khanda: string;
  verseUrls?: Array<{ url: string; verseNumber: string; isComposite: boolean }>;
}

// ============================================================================
// TEXT DETECTION FUNCTIONS
// ============================================================================

/**
 * Check if text contains Bengali characters (U+0980–U+09FF)
 */
function isBengali(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Check if text contains Devanagari characters (U+0900–U+097F)
 */
function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Check if text has IAST diacritical marks
 */
function hasIASTDiacritics(text: string): boolean {
  return /[āīūṛṝḷḹṃḥśṣṇṭḍñṅĀĪŪṚṜḶḸṂḤŚṢṆṬḌÑṄ]/.test(text);
}

// ============================================================================
// TEXT NORMALIZATION (from Python parser)
// ============================================================================

/**
 * Normalize dandas in Sanskrit/Bengali text:
 * - Two single dandas (।।) → one double danda (॥)
 * - Normalize spaces around double danda with number
 */
function normalizeDandas(text: string): string {
  if (!text) return text;

  // Two single dandas → double danda
  text = text.replace(/।।/g, '॥');

  // Normalize ॥ N ॥ spacing (Devanagari or Bengali numerals)
  // ॥१२॥ or ॥ १२॥ → ॥ १२ ॥
  text = text.replace(/॥\s*([०-९\u09E6-\u09EF]+)\s*॥/g, '॥ $1 ॥');

  return text;
}

/**
 * Add line breaks after double danda with verse number
 * Based on SQL: regexp_replace(sanskrit, '(॥\\s*[०-९]+\\s*॥)([^\\n])', E'\\1\\n\\2', 'g')
 */
function addLineBreaksAfterDanda(text: string): string {
  if (!text) return text;

  // Add \n after ॥ N ॥ if followed by non-newline
  text = text.replace(
    /(॥\s*[०-९\u09E6-\u09EF]+\s*॥)([^\n])/g,
    '$1\n$2'
  );

  return text;
}

/**
 * Process Bengali original text
 */
function processBengaliText(text: string): string {
  if (!text) return text;

  // Remove English text in quotes
  text = text.replace(/"[^"]*"/g, '');

  text = normalizeDandas(text);
  text = addLineBreaksAfterDanda(text);

  // Clean up lines
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return lines.join('\n');
}

/**
 * Process IAST transliteration
 * Format: "text text || 1 ||"
 */
function processTransliteration(text: string): string {
  if (!text) return text;

  // Normalize || N || spacing
  text = text.replace(/\|\|\s*(\d+(?:-\d+)?)\s*\|\|/g, '|| $1 ||');

  // Clean whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Remove Devanagari characters but keep shared punctuation (danda)
 */
function removDevanagariKeepPunctuation(text: string): string {
  return text.split('').filter(c => {
    // Keep if not Devanagari, or if it's danda/double-danda
    if (c >= '\u0900' && c <= '\u097F') {
      return c === '\u0964' || c === '\u0965'; // Single/double danda
    }
    return true;
  }).join('');
}

// ============================================================================
// VERSE PARSING (matching Python parser logic)
// ============================================================================

/**
 * Parse a single verse page
 * Based on Python: parse_verse_page()
 */
export function parseWisdomlibVersePage(html: string, verseUrl: string): WisdomlibVerse | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const fullText = doc.body?.textContent || "";

    // Extract verse number from page content
    // Pattern: "Verse X.Y.Z" or "Verse X.Y.Z-W"
    let verseNum = "1";
    const verseMatch = fullText.match(/Verse\s+\d+\.\d+\.(\d+(?:-\d+)?)/i);
    if (verseMatch) {
      verseNum = verseMatch[1].replace(/[–—]/g, '-').replace(/\s+/g, '');
    }

    const parsedNumber = parseVerseNumber(verseNum);

    const verse: WisdomlibVerse = {
      verse_number: verseNum,
      is_composite: parsedNumber.isComposite,
      start_verse: parsedNumber.startVerse,
      end_verse: parsedNumber.endVerse,
    };

    // Get content area
    const content = doc.querySelector('#scontent') || doc.querySelector('#pageContent') || doc.body;
    if (!content) {
      console.warn("⚠️ No content area found");
      return null;
    }

    // 1. BENGALI TEXT - blockquote > p:nth-child(2)
    const blockquote = content.querySelector('blockquote');
    if (blockquote) {
      const paragraphs = blockquote.querySelectorAll('p');

      // Bengali in 2nd paragraph (index 1)
      if (paragraphs.length >= 2) {
        let secondP = paragraphs[1].textContent?.trim() || "";

        if (isBengali(secondP)) {
          // Remove Devanagari but keep danda punctuation
          const cleaned = removDevanagariKeepPunctuation(secondP);
          if (isBengali(cleaned)) {
            verse.bengali = processBengaliText(cleaned);
          }
        }
      }

      // IAST in 4th paragraph (index 3) inside <em>
      if (paragraphs.length >= 4) {
        const fourthP = paragraphs[3];
        const emTag = fourthP.querySelector('em');
        if (emTag) {
          const emText = emTag.textContent?.trim() || "";
          if (hasIASTDiacritics(emText)) {
            verse.transliteration_en = processTransliteration(emText);
          }
        }
      }

      // Fallback: IAST in 1st paragraph if has || markers
      if (!verse.transliteration_en && paragraphs.length >= 1) {
        const firstP = paragraphs[0].textContent?.trim() || "";
        if (hasIASTDiacritics(firstP) && firstP.includes('||')) {
          verse.transliteration_en = processTransliteration(firstP);
        }
      }
    }

    // Process lines for additional content
    const lines = fullText.split('\n').map(l => l.trim()).filter(Boolean);

    // 2. BENGALI fallback - if not found in blockquote
    if (!verse.bengali) {
      for (const line of lines) {
        if (isBengali(line) && !isDevanagari(line)) {
          // Check for verse marker ॥ with Bengali numerals
          if (/॥\s*[\u09E6-\u09EF\d]+(?:-[\u09E6-\u09EF\d]+)?\s*॥/.test(line)) {
            verse.bengali = processBengaliText(line);
            break;
          }
        }
      }
    }

    // 3. IAST fallback - if not found in blockquote
    if (!verse.transliteration_en) {
      for (const line of lines) {
        if (!hasIASTDiacritics(line)) continue;
        if (!line.includes('||')) continue;
        if (!/^[a-zāīūṛṝḷḹṃḥśṣṇṭḍñṅ]/i.test(line)) continue;
        if (/\|\|\s*\d+(?:-\d+)?\s*\|\|/.test(line)) {
          verse.transliteration_en = processTransliteration(line);
          break;
        }
      }
    }

    // 4. ENGLISH TRANSLATION - pattern: (number) text after marker
    let foundMarker = false;
    for (const line of lines) {
      if (/English\s*translation\s*:/i.test(line)) {
        foundMarker = true;
        continue;
      }

      const match = line.match(/^\((\d+(?:-\d+)?)\)\s*(.+)/);
      if (match) {
        const text = match[2];
        // Must have substantial English text
        if (text.length > 20 && /[a-zA-Z]{3,}/.test(text)) {
          verse.translation_en = line;
          break;
        }
      }
    }

    // 5. COMMENTARY - after "Commentary: Gauḍīya-bhāṣya"
    const commentaryParts: string[] = [];
    let inCommentary = false;

    for (const line of lines) {
      if (!inCommentary) {
        if (/Commentary:|Gauḍīya-bhāṣya/i.test(line)) {
          inCommentary = true;
          // Get text after marker if on same line
          const parts = line.split(/Commentary:\s*Gauḍīya-bhāṣya[^:]*:|Commentary:/i);
          if (parts.length > 1 && parts[parts.length - 1].trim().length > 20) {
            commentaryParts.push(parts[parts.length - 1].trim());
          }
          continue;
        }
      } else {
        // Stop conditions
        if (/^(Previous|Next|Like what you read|Let's grow together|parent:|source:)/i.test(line)) break;
        if (/^Verse\s+\d+\.\d+\.\d+/i.test(line)) break;
        if (line.length < 20) continue;
        if (isBengali(line) || isDevanagari(line)) continue;

        commentaryParts.push(line);
      }
    }

    if (commentaryParts.length > 0) {
      verse.commentary_en = commentaryParts.join("\n\n");
    }

    console.log(`✅ Verse ${verseNum}: ` +
      `Bengali=${verse.bengali ? '✓' : '✗'} ` +
      `IAST=${verse.transliteration_en ? '✓' : '✗'} ` +
      `Trans=${verse.translation_en ? '✓' : '✗'} ` +
      `Comm=${verse.commentary_en ? '✓' : '✗'}`);

    // Return null if no content
    if (!verse.bengali && !verse.translation_en) {
      console.warn(`⚠️ No content for verse ${verseNum}`);
      return null;
    }

    return verse;
  } catch (error) {
    console.error("❌ Wisdomlib parse error:", error);
    return null;
  }
}

// ============================================================================
// CHAPTER & URL EXTRACTION
// ============================================================================

/**
 * Extract chapter URLs from khanda index page
 * Based on Python: extract_chapter_urls()
 */
export function extractWisdomlibChapterUrls(
  html: string,
  baseUrl: string,
): Array<{ url: string; title: string; chapterNumber: number; khanda: string }> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const chapters: Array<{ url: string; title: string; chapterNumber: number; khanda: string }> = [];

    const content = doc.querySelector('#scontent') || doc.querySelector('#pageContent') || doc.body;
    if (!content) return chapters;

    // Find all links with /d/doc in href
    const links = content.querySelectorAll('a[href*="/d/doc"]');

    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const text = link.textContent?.trim() || "";

      // Match "Chapter X - Title" or "Chapter X"
      const match = text.match(/Chapter\s+(\d+)(?:\s*[-–]\s*(.+))?/i);
      if (!match) return;

      const chapterNumber = parseInt(match[1], 10);
      const title = match[2]?.trim() || `Chapter ${chapterNumber}`;

      // Build full URL
      let fullUrl = href;
      if (href.startsWith("/")) {
        try {
          const base = new URL(baseUrl);
          fullUrl = base.origin + href;
        } catch {
          fullUrl = `https://www.wisdomlib.org${href}`;
        }
      }

      const khanda = determineKhandaFromUrl(baseUrl).name;

      chapters.push({ url: fullUrl, title, chapterNumber, khanda });
    });

    // Sort by chapter number
    chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    console.log(`✅ Found ${chapters.length} chapters`);
    return chapters;
  } catch (error) {
    console.error("❌ Error extracting chapter URLs:", error);
    return [];
  }
}

/**
 * Extract verse URLs from chapter page
 * Based on Python: extract_verse_urls()
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

    const content = doc.querySelector('#scontent') || doc.querySelector('#pageContent') || doc.body;
    if (!content) return verseUrls;

    const links = content.querySelectorAll('a[href*="/d/doc"]');

    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const text = link.textContent?.trim() || "";

      // Match "Verse X.Y.Z" or "Verse X.Y.Z-W"
      const match = text.match(/Verse\s+(\d+)\.(\d+)\.(\d+(?:-\d+)?)/i);
      if (!match) return;

      // Get verse number (3rd part: Z or Z-W)
      let verseNumber = match[3].replace(/[–—]/g, '-').replace(/\s+/g, '');

      // Build full URL
      let fullUrl = href;
      if (href.startsWith("/")) {
        try {
          const base = new URL(chapterUrl);
          fullUrl = base.origin + href;
        } catch {
          fullUrl = `https://www.wisdomlib.org${href}`;
        }
      }

      // Avoid duplicates
      if (seenUrls.has(fullUrl)) return;
      seenUrls.add(fullUrl);

      const isComposite = verseNumber.includes("-");
      verseUrls.push({ url: fullUrl, verseNumber, isComposite });
    });

    // Sort by verse number
    verseUrls.sort((a, b) => {
      const aFirst = parseInt(a.verseNumber.split("-")[0], 10);
      const bFirst = parseInt(b.verseNumber.split("-")[0], 10);
      return aFirst - bFirst;
    });

    console.log(`✅ Found ${verseUrls.length} verse URLs (${verseUrls.filter(v => v.isComposite).length} composite)`);
    return verseUrls;
  } catch (error) {
    console.error("❌ Error extracting verse URLs:", error);
    return [];
  }
}

/**
 * Parse chapter page
 */
export function parseWisdomlibChapterPage(html: string, chapterUrl: string, khanda: string): WisdomlibChapter | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract chapter number from URL or content
    const fullText = doc.body?.textContent || "";
    let chapterNumber = 1;

    const match = fullText.match(/Chapter\s+(\d+)/i);
    if (match) {
      chapterNumber = parseInt(match[1], 10);
    }

    // Extract title
    const titleEl = doc.querySelector("h1, h2, .chapter-title");
    const title = titleEl?.textContent?.trim() || `Chapter ${chapterNumber}`;

    // Extract verse URLs
    const verseUrls = extractWisdomlibVerseUrls(html, chapterUrl);

    console.log(`✅ Chapter ${chapterNumber}: ${title} (${verseUrls.length} verses)`);

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
 * Determine khanda from URL
 */
export function determineKhandaFromUrl(url: string): { name: string; number: number } {
  const urlLower = url.toLowerCase();
  if (urlLower.includes("adi") || urlLower.includes("1092508")) {
    return { name: "adi", number: 1 };
  } else if (urlLower.includes("madhya") || urlLower.includes("1098648")) {
    return { name: "madhya", number: 2 };
  } else if (urlLower.includes("antya") || urlLower.includes("1108917")) {
    return { name: "antya", number: 3 };
  }
  return { name: "adi", number: 1 };
}

/**
 * Convert chapter to standard import format
 */
export function wisdomlibChapterToStandardChapter(chapter: WisdomlibChapter): any {
  return {
    chapter_number: chapter.chapter_number,
    title_en: chapter.title_en,
    title_ua: chapter.title_en,
    chapter_type: "verses" as const,
    verses: chapter.verses.map((v) => ({
      verse_number: v.verse_number,
      sanskrit: v.bengali || "",
      transliteration_en: v.transliteration_en || "",
      transliteration_ua: "",
      synonyms_en: v.synonyms_en || "",
      synonyms_ua: "",
      translation_en: v.translation_en || "",
      translation_ua: "",
      commentary_en: v.commentary_en || "",
      commentary_ua: "",
      is_composite: v.is_composite || false,
      start_verse: v.start_verse,
      end_verse: v.end_verse,
    })),
  };
}
