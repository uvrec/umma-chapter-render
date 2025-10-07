export type ChapterType = 'verses' | 'text';

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
    id: 'bhagavad-gita',
    name: 'Бгагавад-Гіта',
    // Matches "ВІРШ 1" or "TEXT 1"
    versePattern: /^\s*(?:ВІРШ|TEXT|Вірш)\s+(\d+)/mi,
    synonymsPattern: /^\s*(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD|Послівний переклад)/mi,
    translationPattern: /^\s*(?:ПЕРЕКЛАД|TRANSLATION|Переклад)/mi,
    commentaryPattern: /^\s*(?:ПОЯСНЕННЯ|PURPORT|Пояснення)/mi,
    // Matches "ГЛАВА ПЕРША", "ГЛАВА ДРУГА", etc. (Ukrainian ordinals)
    chapterPattern: /^\s*(?:ГЛАВА|РОЗДІЛ|CHAPTER)\s+(ПЕРША|ДРУГА|ТРЕТЯ|ЧЕТВЕРТА|П'ЯТА|ШОСТА|СЬОМА|ВОСЬМА|ДЕВ'ЯТА|ДЕСЯТА|ОДИНАДЦЯТА|ДВАНАДЦЯТА|ТРИНАДЦЯТА|ЧОТИРНАДЦЯТА|П'ЯТНАДЦЯТА|ШІСТНАДЦЯТА|СІМНАДЦЯТА|ВІСІМНАДЦЯТА|\d{1,2})\s*$/mi,
  },
  {
    id: 'srimad-bhagavatam',
    name: 'Шрімад-Бгагаватам',
    versePattern: /^\s*(?:В[ІI]РШ|ТЕКСТ)\s+(\d+)/mi,
    synonymsPattern: /^\s*(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD|Послівний переклад)/mi,
    translationPattern: /^\s*(?:ПЕРЕКЛАД|TRANSLATION|Переклад)/mi,
    commentaryPattern: /^\s*(?:ПОЯСНЕННЯ|PURPORT|Пояснення)/mi,
    chapterPattern: /^\s*(?:ГЛАВА|РОЗДІЛ)\s+(ПЕРША|ДРУГА|ТРЕТЯ|ЧЕТВЕРТА|П'ЯТА|ШОСТА|СЬОМА|ВОСЬМА|ДЕВ'ЯТА|ДЕСЯТА|ОДИНАДЦЯТА|ДВАНАДЦЯТА|ТРИНАДЦЯТА|ЧОТИРНАДЦЯТА|П'ЯТНАДЦЯТА|ШІСТНАДЦЯТА|СІМНАДЦЯТА|ВІСІМНАДЦЯТА|\d{1,3})(?=\s|$)/mi,
  },
  {
    id: 'sri-isopanishad',
    name: 'Шрі Ішопанішад',
    versePattern: /^\s*(?:МАНТРА|MANTRA)\s+(\d+)/mi,
    synonymsPattern: /^\s*(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD)/mi,
    translationPattern: /^\s*(?:ПЕРЕКЛАД|TRANSLATION)/mi,
    commentaryPattern: /^\s*(?:ПОЯСНЕННЯ|PURPORT)/mi,
    chapterPattern: /^\s*(?:МАНТРА|MANTRA)\s+(\d+)/mi,
  },
];

// Validation helpers
export function validateParsedChapter(chapter: ParsedChapter): string[] {
  const errors: string[] = [];
  
  if (!chapter.chapter_number || chapter.chapter_number < 1) {
    errors.push('Невалідний номер глави');
  }
  
  if (!chapter.title_ua?.trim()) {
    errors.push('Відсутня назва глави (UA)');
  }
  
  if (chapter.verses.length === 0) {
    errors.push('Глава не містить віршів');
  }
  
  chapter.verses.forEach((verse, idx) => {
    if (!verse.verse_number?.trim()) {
      errors.push(`Вірш ${idx + 1}: відсутній номер`);
    }
  });
  
  return errors;
}

export function validateParsedVerse(verse: ParsedVerse): string[] {
  const errors: string[] = [];
  
  if (!verse.verse_number?.trim()) {
    errors.push('Відсутній номер вірша');
  }
  
  return errors;
}
