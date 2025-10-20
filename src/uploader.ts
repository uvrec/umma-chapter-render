// src/uploader.ts
import type { Client } from 'pg';
import { normalize, type RawExtract } from './normalizer.js';
import { markFailed, markSaved, markSkipped } from './lib/state.js';
import { scrapeDetail } from './scraper.js';
import { ensureBook } from './ensure/book.js';
import { ensureCanto } from './ensure/canto.js';
import { ensureChapter } from './ensure/chapter.js';
import { ensureVerse } from './ensure/verse.js';
import { BOOK_MAP, SB_CANTO_TITLES, CC_LILA_TITLES } from './config/books.js';
import { sanitizeHtml } from './utils/sanitize.js';
import { sha256Hex } from './utils/hash.js';

type ParsedUrl = {
  source: 'vedabase' | 'gitabase';
  book_code?: string;
  language: 'en' | 'uk';
  canto_number?: number;
  chapter_number?: number;
  verse_number?: string;
  isListing?: boolean;
};

/**
 * Parse Vedabase/Gitabase URL into structured components
 * Handles various URL formats:
 * - https://vedabase.io/en/library/bg/1/1/
 * - https://vedabase.io/en/library/sb/1/1/1/
 * - https://gitabase.com/ukr/bg/1/1/
 * - https://vedabase.io/en/library/bg/ (listing)
 */
function parseUrl(url: string): ParsedUrl {
  const source = url.includes('vedabase.io') ? 'vedabase' : 'gitabase';
  
  // Detect language
  let language: 'en' | 'uk' = 'en';
  if (url.includes('/ukr/') || url.includes('/ua/') || url.includes('/ukrainian/')) {
    language = 'uk';
  }
  
  // Pattern: optional /library/, then book_code, then optional numbers
  // (?:library/)? - optional "library/" segment
  // (bg|sb|cc|iso|noi|nod|tlc|kb) - book code (case insensitive)
  // (?:/(\d+))?(?:/(\d+))?(?:/(\d+))? - up to 3 optional number segments
  const pattern = /\/(?:library\/)?(bg|sb|cc|iso|noi|nod|tlc|kb)(?:\/(\d+))?(?:\/(\d+))?(?:\/(\d+))?/i;
  const match = url.match(pattern);
  
  if (!match) {
    return { source, language };
  }
  
  const book_code = match[1].toLowerCase();
  const bookConfig = BOOK_MAP[book_code];
  
  if (!bookConfig) {
    return { source, language, book_code };
  }
  
  // Parse numbers
  const num1 = match[2] ? parseInt(match[2]) : undefined;
  const num2 = match[3] ? parseInt(match[3]) : undefined;
  const num3 = match[4] ? match[4] : undefined;
  
  // Determine if this is a listing URL (no verse numbers)
  const isListing = !num2; // No chapter number = listing
  
  // For books with cantos: num1=canto, num2=chapter, num3=verse
  // For books without cantos: num1=chapter, num2=verse
  if (bookConfig.has_cantos) {
    return {
      source,
      language,
      book_code,
      canto_number: num1,
      chapter_number: num2,
      verse_number: num3,
      isListing
    };
  } else {
    return {
      source,
      language,
      book_code,
      chapter_number: num1,
      verse_number: num2?.toString(),
      isListing
    };
  }
}

/**
 * Get localized canto title
 */
function getCantoTitle(bookCode: string, cantoNumber: number): { ua: string; en: string } {
  if (bookCode === 'sb' && SB_CANTO_TITLES[cantoNumber]) {
    return SB_CANTO_TITLES[cantoNumber];
  }
  if (bookCode === 'cc' && CC_LILA_TITLES[cantoNumber]) {
    return CC_LILA_TITLES[cantoNumber];
  }
  return {
    ua: `Пісня ${cantoNumber}`,
    en: `Canto ${cantoNumber}`
  };
}

/**
 * Build admin/reader URL for the imported content
 */
function buildContentUrl(
  bookSlug: string,
  cantoNumber?: number,
  chapterNumber?: number,
  verseNumber?: string
): string {
  const base = 'https://vedavoice.org/veda-reader';
  
  if (cantoNumber) {
    // Book with cantos
    return `${base}/${bookSlug}/canto/${cantoNumber}/chapter/${chapterNumber}`;
  } else {
    // Book without cantos
    return `${base}/${bookSlug}/chapter/${chapterNumber}`;
  }
}

/**
 * Process one import item (verse or chapter)
 */
export async function processOne(pg: Client, item: any): Promise<void> {
  const url: string = item.canonical_url;
  
  try {
    console.log(`\n🔍 Processing: ${url}`);
    
    // 1. PARSE URL
    const parsed = parseUrl(url);
    
    // Skip listings (they should be crawled separately for link extraction)
    if (parsed.isListing || item.content_type === 'listing') {
      await markSkipped(pg, item.id, 'listing_page');
      console.log(`⏭️  Skipped: Listing page`);
      return;
    }
    
    if (!parsed.book_code) {
      throw new Error('Cannot parse book_code from URL');
    }
    
    if (!parsed.chapter_number) {
      throw new Error('chapter_number is required');
    }
    
    // 2. SCRAPE content
    const raw: RawExtract = await scrapeDetail(url);
    const normalized = normalize(raw);
    
    // Compute content hash for deduplication
    const contentHash = sha256Hex(JSON.stringify({
      sanskrit: normalized.devanagari_or_bengali,
      translit: normalized.transliteration,
      synonyms: normalized.synonyms,
      translation: normalized.translation,
      purport: normalized.purport
    }));
    
    // Check if content changed (skip if identical)
    if (item.content_hash === contentHash && item.status === 'saved') {
      await markSkipped(pg, item.id, 'content_unchanged');
      console.log(`⏭️  Skipped: Content unchanged`);
      return;
    }
    
    // Update content_hash in imports.items
    await pg.query(
      'UPDATE imports.items SET content_hash = $1 WHERE id = $2',
      [contentHash, item.id]
    );
    
    // 3. ENSURE HIERARCHY: Book → Canto → Chapter → Verse
    
    const bookInfo = BOOK_MAP[parsed.book_code];
    if (!bookInfo) {
      throw new Error(`Unknown book: ${parsed.book_code}`);
    }
    
    // 3a. Ensure Book
    const book = await ensureBook(
      { vedabase_slug: parsed.book_code },
      bookInfo
    );
    
    // 3b. Ensure Canto (if book has cantos)
    let cantoId: string | undefined;
    if (bookInfo.has_cantos && parsed.canto_number) {
      const cantoTitles = getCantoTitle(parsed.book_code, parsed.canto_number);
      const canto = await ensureCanto(book.id, parsed.canto_number, {
        title_ua: cantoTitles.ua,
        title_en: cantoTitles.en
      });
      cantoId = canto.id;
    }
    
    // 3c. Ensure Chapter
    const chapterTitle = normalized.title || 
      (parsed.language === 'uk' ? `Глава ${parsed.chapter_number}` : `Chapter ${parsed.chapter_number}`);
    
    // Sanitize HTML content
    const introHtmlUa = parsed.language === 'uk' && normalized.content_type === 'chapter'
      ? sanitizeHtml(normalized.purport)
      : undefined;
    const introHtmlEn = parsed.language === 'en' && normalized.content_type === 'chapter'
      ? sanitizeHtml(normalized.purport)
      : undefined;
    
    const chapter = await ensureChapter({
      bookId: cantoId ? undefined : book.id,
      cantoId: cantoId,
      chapterNumber: parsed.chapter_number,
      title_ua: chapterTitle,
      title_en: chapterTitle,
      intro_html_ua: introHtmlUa,
      intro_html_en: introHtmlEn,
      chapter_type: 'verses'
    });
    
    // 3d. Ensure Verse (if this is a verse URL, not just chapter intro)
    if (parsed.verse_number && normalized.content_type === 'verse') {
      await ensureVerse(chapter.id, {
        verse_number: parsed.verse_number,
        language: parsed.language,
        sanskrit: normalized.devanagari_or_bengali,
        transliteration: normalized.transliteration,
        synonyms: sanitizeHtml(normalized.synonyms),
        translation: sanitizeHtml(normalized.translation),
        commentary: sanitizeHtml(normalized.purport)
      });
    }
    
    // 4. MARK SUCCESS
    const contentUrl = buildContentUrl(
      book.slug,
      parsed.canto_number,
      parsed.chapter_number,
      parsed.verse_number
    );
    
    await markSaved(pg, item.id, contentUrl);
    
    // Build location string for logging
    const location = `${book.slug}` +
      (parsed.canto_number ? `.${parsed.canto_number}` : '') +
      `.${parsed.chapter_number}` +
      (parsed.verse_number ? `.${parsed.verse_number}` : '');
    
    console.log(`✅ Saved: ${location} (${parsed.language})`);
    
  } catch (err: any) {
    console.error(`❌ Failed: ${url}`);
    console.error(`   Error: ${err.message}`);
    
    // Save error with stack trace for debugging
    const errorMessage = `${err.message}\n\nStack:\n${err.stack || 'N/A'}`;
    await markFailed(pg, item.id, errorMessage);
  }
}
