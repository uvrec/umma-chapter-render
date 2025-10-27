// src/types/book-import.ts
export type ChapterType = "verses" | "text";

export interface ParsedVerse {
  verse_number: string;
  sanskrit?: string;
  sanskrit_ua?: string;
  sanskrit_en?: string;
  transliteration?: string;
  synonyms_ua?: string;
  synonyms_en?: string;
  translation_ua?: string;
  translation_en?: string;
  commentary_ua?: string;
  commentary_en?: string;
  /** клієнтські дані часто приходять як audioUrl */
  audioUrl?: string;
  /** у БД поле під змійкою */
  audio_url?: string;
}

export interface ParsedChapter {
  chapter_number: number;
  chapter_type: ChapterType;
  title_ua: string;
  title_en?: string;
  verses: ParsedVerse[];
  content_ua?: string;
  content_en?: string;
}

export interface ParsedBook {
  title_ua: string;
  title_en?: string;
  description_ua?: string;
  description_en?: string;
  chapters: ParsedChapter[];
  metadata?: BookMetadata;
}

export interface BookMetadata {
  author?: string;
  year?: number;
  source?: string;
}

export interface ImportTemplate {
  id: string;
  name: string;
  versePattern: RegExp;
  synonymsPattern: RegExp;
  translationPattern: RegExp;
  commentaryPattern: RegExp;
  chapterPattern: RegExp;
}

export const BOOK_TEMPLATES: ImportTemplate[] = [
  {
    id: "default",
    name: "За замовчуванням",
    versePattern: /^(ТЕКСТ|МАНТРА|ВІРШ|TEXT|MANTRA|VERSE)\s+(\d+(?:\.\d+)?)/i,
    synonymsPattern: /^(ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD|СИНОНІМИ|SYNONYMS):/i,
    translationPattern: /^(ПЕРЕКЛАД|TRANSLATION):/i,
    commentaryPattern: /^(КОМЕНТАР|ПОЯСНЕННЯ|КОММЕНТАРИЙ|COMMENTARY|PURPORT):/i,
    chapterPattern: /^(ГЛАВА|CHAPTER|РОЗДІЛ)\s+(\d+)/i,
  },
];
