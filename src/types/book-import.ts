// src/types/book-import.ts
export type ChapterType = "verses" | "text";

export interface ParsedVerse {
  verse_number: string;
  sanskrit?: string;
  sanskrit_ua?: string;
  sanskrit_en?: string;
  transliteration?: string; // deprecated, для backward compatibility
  transliteration_en?: string; // оригінальний IAST з Vedabase
  transliteration_ua?: string; // українська транслітерація з діакритикою
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
    versePattern: /^(ТЕКСТ|МАНТРА|ВІРШ|TEXT|MANTRA|VERSE)\s+(\d+(?:\.\d+)?)/im,
    synonymsPattern: /^(ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD|СИНОНІМИ|SYNONYMS):/im,
    translationPattern: /^(ПЕРЕКЛАД|TRANSLATION):/im,
    commentaryPattern: /^(КОМЕНТАР|ПОЯСНЕННЯ|КОММЕНТАРИЙ|COMMENTARY|PURPORT):/im,
    chapterPattern: /^(ГЛАВА|CHAPTER|РОЗДІЛ)\s+(ПЕРША|ДРУГА|ТРЕТЯ|ЧЕТВЕРТА|П'ЯТА|ШОСТА|СЬОМА|ВОСЬМА|ДЕВ'ЯТА|ДЕСЯТА|\d+)/im,
  },
  {
    id: "bhagavad-gita",
    name: "Бгаґавад-ґіта (українська)",
    versePattern: /^(ВІРШ|ТЕКСТ)\s+(\d+(?:\.\d+)?)/im,
    synonymsPattern: /^(ПОСЛІВНИЙ ПЕРЕКЛАД):/im,
    translationPattern: /^(ПЕРЕКЛАД):/im,
    commentaryPattern: /^(ПОЯСНЕННЯ):/im,
    chapterPattern: /^(?:ГЛАВА\s+(?:ПЕРША|ДРУГА|ТРЕТЯ|ЧЕТВЕРТА|П'ЯТА|ШОСТА|СЬОМА|ВОСЬМА|ДЕВ'ЯТА|ДЕСЯТА|ОДИНАДЦЯТА|ДВАНАДЦЯТА|ТРИНАДЦЯТА|ЧОТИРНАДЦЯТА|П'ЯТНАДЦЯТА|ШІСТНАДЦЯТА|СІМНАДЦЯТА|ВІСІМНАДЦЯТА)|ЛАНКИ\s+ЛАНЦЮГА\s+УЧНІВСЬКОЇ\s+ПОСЛІДОВНОСТІ|ВСТУП|ПЕРЕДМОВА(?:\s+ДО\s+АНГЛІЙСЬКОГО\s+ВИДАННЯ)?|ПЕРЕДІСТОРІЯ(?:\s*«?БГАҐАВАД-ҐІТИ»?)?|(?:«?БГАҐАВАД-ҐІТА\s+ЯК\s+ВОНА\s+Є»?\s+)?ПОСВЯТА)/im,
  },
  {
    id: "srimad-bhagavatam",
    name: "Шрімад-Бгаґаватам (українська)",
    versePattern: /^(ВІРШ|ТЕКСТ)\s+(\d+(?:\.\d+)?)/im,
    synonymsPattern: /^(ПОСЛІВНИЙ ПЕРЕКЛАД):/im,
    translationPattern: /^(ПЕРЕКЛАД):/im,
    commentaryPattern: /^(ПОЯСНЕННЯ|КОМЕНТАР):/im,
    chapterPattern: /^(?:ГЛАВА\s+(?:[А-ЯІЇЄҐ''\- ]+|\d+)|ПЕРЕДМОВА(?:\s+ДО\s+АНГЛІЙСЬКОГО\s+ВИДАННЯ)?|ВСТУП|НАРИС\s+ЖИТТЯ\s+І\s+ПОВЧАНЬ)/im,
  },
  {
    id: "raja-vidya",
    name: "Раджа відья (текстова)",
    // Для текстової книги - не парсимо окремі вірші, а просто розділяємо по главах
    versePattern: /(?!.*)/im, // Не шукати вірші (negative lookahead)
    synonymsPattern: /(?!.*)/im,
    translationPattern: /(?!.*)/im,
    commentaryPattern: /(?!.*)/im,
    // Розпізнаємо глави: "ГЛАВА ПЕРША", "ГЛАВА ДРУГА" тощо
    chapterPattern: /^(?:ГЛАВА\s+(?:ПЕРША|ДРУГА|ТРЕТЯ|ЧЕТВЕРТА|П'ЯТА|ШОСТА|СЬОМА|ВОСЬМА|\d+))/im,
  },
];
