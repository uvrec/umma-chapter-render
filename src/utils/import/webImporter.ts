// src/utils/import/webImporter.ts
import type { ParsedChapter, ParsedVerse } from "@/types/book-import";

interface VedabaseVerse {
  verseNumber: string;
  bengali?: string;
  transliteration?: string;
  synonyms?: string;
  translation?: string;
  commentary?: string;
}

interface GitabaseVerse {
  verseNumber: string;
  translation?: string;
  commentary?: string;
}

/**
 * Парсить вірш з Vedabase.io (англійська + бенгалі)
 */
export function parseVedabaseVerse(markdown: string, verseNum: string): VedabaseVerse | null {
  const lines = markdown.split('\n');
  let bengali = '';
  let transliteration = '';
  let synonyms = '';
  let translation = '';
  let commentary = '';
  
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.includes('## Bengali')) {
      currentSection = 'bengali';
      continue;
    } else if (line.includes('## Verse text') || line.includes('## Synonyms')) {
      if (line.includes('Synonyms')) currentSection = 'synonyms';
      else currentSection = 'transliteration';
      continue;
    } else if (line.includes('## Translation')) {
      currentSection = 'translation';
      continue;
    } else if (line.includes('## Purport') || line.includes('## Commentary')) {
      currentSection = 'commentary';
      continue;
    }
    
    if (!line || line.startsWith('#') || line.startsWith('[')) continue;
    
    if (currentSection === 'bengali' && !line.startsWith('_')) {
      bengali += line + '\n';
    } else if (currentSection === 'transliteration' && line.startsWith('_')) {
      transliteration += line.replace(/_/g, '') + '\n';
    } else if (currentSection === 'synonyms') {
      if (!line.startsWith('[') && !line.startsWith('_')) {
        synonyms += line + ' ';
      }
    } else if (currentSection === 'translation' && line.startsWith('**')) {
      translation += line.replace(/\*\*/g, '') + '\n';
    } else if (currentSection === 'commentary') {
      commentary += line + '\n';
    }
  }
  
  return {
    verseNumber: verseNum,
    bengali: bengali.trim(),
    transliteration: transliteration.trim(),
    synonyms: synonyms.trim(),
    translation: translation.trim(),
    commentary: commentary.trim(),
  };
}

/**
 * Парсить вірш з Gitabase.com (українська)
 */
export function parseGitabaseVerse(markdown: string, verseNum: string): GitabaseVerse | null {
  const lines = markdown.split('\n');
  
  // Шукаємо текст для конкретного номера вірша
  const versePattern = new RegExp(`\\[Текст\\*?\\s+${verseNum}\\].*?:\\s*\\*\\*(.+?)\\*\\*`, 's');
  const match = markdown.match(versePattern);
  
  if (!match) return null;
  
  const translation = match[1].trim();
  
  // Шукаємо коментар (весь текст після вірша до наступного вірша)
  const nextVerseNum = parseInt(verseNum) + 1;
  const nextVersePattern = new RegExp(`\\[Текст\\*?\\s+${verseNum}\\].*?\\*\\*(.+?)\\*\\*([\\s\\S]*?)(?=\\[Текст\\*?\\s+${nextVerseNum}\\]|$)`, '');
  const commentMatch = markdown.match(nextVersePattern);
  
  let commentary = '';
  if (commentMatch && commentMatch[2]) {
    commentary = commentMatch[2]
      .split('\n')
      .filter(line => !line.includes('[Текст') && line.trim())
      .join('\n')
      .trim();
  }
  
  return {
    verseNumber: verseNum,
    translation,
    commentary,
  };
}

/**
 * Об'єднує дані з обох джерел в один ParsedVerse
 */
export function mergeVerseData(
  vedabaseVerse: VedabaseVerse | null,
  gitabaseVerse: GitabaseVerse | null,
  verseNum: string
): ParsedVerse {
  return {
    verse_number: verseNum,
    sanskrit: vedabaseVerse?.bengali || '',
    transliteration: vedabaseVerse?.transliteration || '',
    synonyms_en: vedabaseVerse?.synonyms || '',
    synonyms_ua: '', // Gitabase не має пословного перекладу
    translation_en: vedabaseVerse?.translation || '',
    translation_ua: gitabaseVerse?.translation || '',
    commentary_en: vedabaseVerse?.commentary || '',
    commentary_ua: gitabaseVerse?.commentary || '',
  };
}

/**
 * Парсить повну главу з markdown контенту обох сайтів
 */
export async function parseChapterFromWeb(
  vedabaseMarkdown: string,
  gitabaseMarkdown: string,
  chapterNumber: number,
  chapterTitleUa: string,
  chapterTitleEn: string
): Promise<ParsedChapter> {
  // Визначаємо діапазон віршів з gitabase (там є всі вірші)
  const verseMatches = Array.from(gitabaseMarkdown.matchAll(/\[Текст\*?\s+(\d+)\]/g));
  const verseNumbers = verseMatches.map(m => m[1]);
  
  const verses: ParsedVerse[] = [];
  
  for (const verseNum of verseNumbers) {
    // Для кожного вірша завантажуємо дані з vedabase
    // (В ідеалі тут треба завантажити окремі сторінки для кожного вірша)
    const gitabaseVerse = parseGitabaseVerse(gitabaseMarkdown, verseNum);
    
    // Тут можна було б завантажити окрему сторінку з vedabase для кожного вірша
    // Але для простоти використаємо те, що є
    const vedabaseVerse: VedabaseVerse = {
      verseNumber: verseNum,
    };
    
    const mergedVerse = mergeVerseData(vedabaseVerse, gitabaseVerse, verseNum);
    verses.push(mergedVerse);
  }
  
  return {
    chapter_number: chapterNumber,
    chapter_type: 'verses',
    title_ua: chapterTitleUa,
    title_en: chapterTitleEn,
    verses,
  };
}

/**
 * Завантажує та парсить конкретний вірш з vedabase
 */
export async function fetchVedabaseVerse(
  book: string,
  canto: number,
  chapter: number,
  verse: number
): Promise<VedabaseVerse | null> {
  try {
    const url = `https://vedabase.io/en/library/${book}/${canto}/${chapter}/${verse}/`;
    const response = await fetch(url);
    const html = await response.text();
    
    // Простий парсинг HTML (в ідеалі використати DOMParser)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const bengali = doc.querySelector('.verse-bengali')?.textContent?.trim() || '';
    const transliteration = doc.querySelector('.verse-text')?.textContent?.trim() || '';
    const synonyms = doc.querySelector('.synonyms')?.textContent?.trim() || '';
    const translation = doc.querySelector('.translation')?.textContent?.trim() || '';
    const commentary = doc.querySelector('.purport')?.textContent?.trim() || '';
    
    return {
      verseNumber: verse.toString(),
      bengali,
      transliteration,
      synonyms,
      translation,
      commentary,
    };
  } catch (error) {
    console.error(`Failed to fetch verse from vedabase: ${error}`);
    return null;
  }
}
