// src/types/book-import.ts
export type ChapterType = "verses" | "text" | "intro";

export interface ParsedVerse {
  verse_number: string;
  sanskrit?: string;
  transliteration?: string;
  synonyms_en?: string;
  synonyms_ua?: string;
  translation_en?: string;
  translation_ua?: string;
  commentary_en?: string;
  commentary_ua?: string;
  /** клієнтські дані часто приходять як audioUrl */
  audioUrl?: string;
  /** у БД поле під змійкою */
  audio_url?: string;
}

export interface ParsedChapter {
  chapter_number: number;
  chapter_type: "verses" | "text" | "intro";
  title_ua: string;
  title_en: string;
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
    versePattern: /^(ТЕКСТ|TEXT)\s+(\d+(?:\.\d+)?)/i,
    synonymsPattern: /^(ПОСЛОВНИЙ ПЕРЕКЛАД|WORD FOR WORD|СИНОНІМИ|SYNONYMS):/i,
    translationPattern: /^(ПЕРЕКЛАД|TRANSLATION):/i,
    commentaryPattern: /^(КОМЕНТАР|ПОЯСНЕННЯ|COMMENTARY|PURPORT):/i,
    chapterPattern: /^(ГЛАВА|CHAPTER|РОЗДІЛ)\s+(\d+)/i,
  },
];
