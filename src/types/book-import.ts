export interface ParsedVerse {
  verse_number: string;
  sanskrit?: string;
  transliteration?: string;
  synonyms_ua?: string;
  synonyms_en?: string;
  translation_ua?: string;
  translation_en?: string;
  commentary_ua?: string;
  commentary_en?: string;
}

export interface ParsedChapter {
  chapter_number: number;
  title_ua: string;
  title_en?: string;
  verses: ParsedVerse[];
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
    id: 'bhagavad-gita',
    name: 'Бгагавад-Гіта',
    versePattern: /^(?:ТЕКСТ|TEXT)\s+(\d+)/mi,
    synonymsPattern: /^(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD|Послівний переклад)/mi,
    translationPattern: /^(?:ПЕРЕКЛАД|TRANSLATION|Переклад)/mi,
    commentaryPattern: /^(?:ПОЯСНЕННЯ|PURPORT|Пояснення)/mi,
    chapterPattern: /^(?:РОЗДІЛ|CHAPTER)\s+(\d+)/mi,
  },
  {
    id: 'srimad-bhagavatam',
    name: 'Шрімад-Бгагаватам',
    versePattern: /^(?:ТЕКСТ|TEXT)\s+(\d+)/mi,
    synonymsPattern: /^(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD)/mi,
    translationPattern: /^(?:ПЕРЕКЛАД|TRANSLATION)/mi,
    commentaryPattern: /^(?:ПОЯСНЕННЯ|PURPORT)/mi,
    chapterPattern: /^(?:РОЗДІЛ|CHAPTER)\s+(\d+)/mi,
  },
  {
    id: 'sri-isopanishad',
    name: 'Шрі Ішопанішад',
    versePattern: /^(?:МАНТРА|MANTRA)\s+(\d+)/mi,
    synonymsPattern: /^(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD)/mi,
    translationPattern: /^(?:ПЕРЕКЛАД|TRANSLATION)/mi,
    commentaryPattern: /^(?:ПОЯСНЕННЯ|PURPORT)/mi,
    chapterPattern: /^(?:МАНТРА|MANTRA)\s+(\d+)/mi,
  },
];
