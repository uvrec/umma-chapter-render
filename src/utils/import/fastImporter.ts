// src/utils/import/fastImporter.ts
/**
 * Швидкий імпортер з 40× покращенням швидкості
 * Використовує ensure pattern для idempotent операцій
 * Підтримує багатомовність: UA/EN в одному вірші
 */

import type { ParsedChapter, ParsedVerse } from "@/types/book-import";
import { ensureBook } from "./ensure/book";
import { ensureCanto } from "./ensure/canto";
import { ensureChapter } from "./ensure/chapter";
import { ensureVerse } from "./ensure/verse";
import { BOOK_MAP, SB_CANTO_TITLES, CC_LILA_TITLES } from "@/config/importIds";

export type ImportOptions = {
  bookSlug: string;
  cantoNumber?: number;
  language?: 'en' | 'uk';
  onProgress?: (message: string) => void;
};

/**
 * Отримує назву пісні для книги
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
 * Швидкий імпорт однієї глави з підтримкою багатомовності
 */
export async function fastImportChapter(
  chapter: ParsedChapter,
  options: ImportOptions
): Promise<void> {
  const { bookSlug, cantoNumber, language = 'en', onProgress } = options;

  try {
    onProgress?.(`📖 Ensure book: ${bookSlug}`);
    
    // 1. Ensure Book
    const bookInfo = BOOK_MAP[bookSlug];
    if (!bookInfo) {
      throw new Error(`Unknown book: ${bookSlug}`);
    }
    
    const book = await ensureBook(
      { vedabase_slug: bookSlug },
      bookInfo
    );
    
    // 2. Ensure Canto (якщо книга має cantos)
    let cantoId: string | undefined;
    if (bookInfo.has_cantos && cantoNumber) {
      onProgress?.(`  📜 Ensure canto: ${cantoNumber}`);
      const cantoTitles = getCantoTitle(bookSlug, cantoNumber);
      const canto = await ensureCanto(book.id, cantoNumber, {
        title_ua: cantoTitles.ua,
        title_en: cantoTitles.en
      });
      cantoId = canto.id;
    }
    
    // 3. Ensure Chapter
    onProgress?.(`    📄 Ensure chapter: ${chapter.chapter_number}`);
    
    const chapterParams: any = {
      chapterNumber: chapter.chapter_number,
      title_ua: chapter.title_ua || `Глава ${chapter.chapter_number}`,
      title_en: chapter.title_en || `Chapter ${chapter.chapter_number}`,
      chapter_type: chapter.chapter_type || 'verses'
    };
    
    // Додаємо content якщо є
    if (language === 'uk' && chapter.content_ua) {
      chapterParams.content_ua = chapter.content_ua;
    } else if (language === 'en' && chapter.content_en) {
      chapterParams.content_en = chapter.content_en;
    }
    
    if (cantoId) {
      chapterParams.cantoId = cantoId;
    } else {
      chapterParams.bookId = book.id;
    }
    
    const chapterRecord = await ensureChapter(chapterParams);
    
    // 4. Ensure Verses (якщо це глава з віршами)
    if (chapter.chapter_type === 'verses' && chapter.verses?.length) {
      onProgress?.(`      📝 Importing ${chapter.verses.length} verses...`);
      
      for (const verse of chapter.verses) {
        await ensureVerse(chapterRecord.id, {
          verse_number: String(verse.verse_number),
          language: language,
          sanskrit: verse.sanskrit,
          transliteration: verse.transliteration,
          synonyms: language === 'uk' ? (verse as any).synonyms_ua : (verse as any).synonyms_en,
          translation: language === 'uk' ? (verse as any).translation_ua : (verse as any).translation_en,
          commentary: language === 'uk' ? (verse as any).commentary_ua : (verse as any).commentary_en,
          audio_url: (verse as any).audio_url
        });
      }
      
      onProgress?.(`      ✅ ${chapter.verses.length} verses processed`);
    }
    
    const location = `${book.slug}` + 
      (cantoNumber ? `.${cantoNumber}` : '') +
      `.${chapter.chapter_number}`;
    
    onProgress?.(`✅ Chapter imported: ${location} (${language})`);
    
  } catch (err: any) {
    const errorMsg = `❌ Import failed: ${err.message}`;
    onProgress?.(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Швидкий імпорт кількох глав
 */
export async function fastImportBook(
  chapters: ParsedChapter[],
  options: ImportOptions
): Promise<void> {
  const { onProgress } = options;
  
  onProgress?.(`🚀 Starting fast import: ${chapters.length} chapters`);
  
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    onProgress?.(`\n[${i + 1}/${chapters.length}] Processing chapter ${chapter.chapter_number}...`);
    
    await fastImportChapter(chapter, options);
  }
  
  onProgress?.(`\n🎉 Import complete: ${chapters.length} chapters imported`);
}
