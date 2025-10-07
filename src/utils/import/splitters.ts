import { ParsedChapter, ParsedVerse, ImportTemplate, ChapterType } from '@/types/book-import';

// Ukrainian number words to numeric mapping (extended)
const ukrainianNumberWords: Record<string, number> = {
  'ПЕРША': 1, 'ПЕРШИЙ': 1, 'ОДНА': 1, 'ОДИН': 1,
  'ДРУГА': 2, 'ДРУГИЙ': 2, 'ДВА': 2, 'ДВІ': 2,
  'ТРЕТЯ': 3, 'ТРЕТІЙ': 3, 'ТРИ': 3,
  'ЧЕТВЕРТА': 4, 'ЧЕТВЕРТИЙ': 4, 'ЧОТИРИ': 4,
  'П\'ЯТА': 5, 'П\'ЯТИЙ': 5, 'П\'ЯТЬ': 5,
  'ШОСТА': 6, 'ШОСТИЙ': 6, 'ШІСТЬ': 6,
  'СЬОМА': 7, 'СЬОМИЙ': 7, 'СІМ': 7,
  'ВОСЬМА': 8, 'ВОСЬМИЙ': 8, 'ВІСІМ': 8,
  'ДЕВ\'ЯТА': 9, 'ДЕВ\'ЯТИЙ': 9, 'ДЕВ\'ЯТЬ': 9,
  'ДЕСЯТА': 10, 'ДЕСЯТИЙ': 10, 'ДЕСЯТЬ': 10,
  'ОДИНАДЦЯТА': 11, 'ОДИНАДЦЯТИЙ': 11,
  'ДВАНАДЦЯТА': 12, 'ДВАНАДЦЯТИЙ': 12,
  'ТРИНАДЦЯТА': 13, 'ТРИНАДЦЯТИЙ': 13,
  'ЧОТИРНАДЦЯТА': 14, 'ЧОТИРНАДЦЯТИЙ': 14,
  'П\'ЯТНАДЦЯТА': 15, 'П\'ЯТНАДЦЯТИЙ': 15,
  'ШІСТНАДЦЯТА': 16, 'ШІСТНАДЦЯТИЙ': 16,
  'СІМНАДЦЯТА': 17, 'СІМНАДЦЯТИЙ': 17,
  'ВІСІМНАДЦЯТА': 18, 'ВІСІМНАДЦЯТИЙ': 18,
  'ДЕВ\'ЯТНАДЦЯТА': 19, 'ДЕВ\'ЯТНАДЦЯТИЙ': 19,
  'ДВАДЦЯТА': 20, 'ДВАДЦЯТИЙ': 20, 'ДВАДЦЯТЬ': 20,
  'ДВАДЦЯТЬ ПЕРША': 21, 'ДВАДЦЯТЬ ПЕРШИЙ': 21,
  'ДВАДЦЯТЬ ДРУГА': 22, 'ДВАДЦЯТЬ ДРУГИЙ': 22,
  'ДВАДЦЯТЬ ТРЕТЯ': 23, 'ДВАДЦЯТЬ ТРЕТІЙ': 23,
  'ДВАДЦЯТЬ ЧЕТВЕРТА': 24, 'ДВАДЦЯТЬ ЧЕТВЕРТИЙ': 24,
  'ДВАДЦЯТЬ П\'ЯТА': 25, 'ДВАДЦЯТЬ П\'ЯТИЙ': 25,
  'ДВАДЦЯТЬ ШОСТА': 26, 'ДВАДЦЯТЬ ШОСТИЙ': 26,
  'ДВАДЦЯТЬ СЬОМА': 27, 'ДВАДЦЯТЬ СЬОМИЙ': 27,
  'ДВАДЦЯТЬ ВОСЬМА': 28, 'ДВАДЦЯТЬ ВОСЬМИЙ': 28,
  'ДВАДЦЯТЬ ДЕВ\'ЯТА': 29, 'ДВАДЦЯТЬ ДЕВ\'ЯТИЙ': 29,
  'ТРИДЦЯТА': 30, 'ТРИДЦЯТИЙ': 30, 'ТРИДЦЯТЬ': 30,
};

// Ensure regex has desired flags without losing Unicode support
function withFlags(re: RegExp, extraFlags: string): RegExp {
  const set = new Set((re.flags + extraFlags).split(''));
  const flags = Array.from(set).join('');
  return new RegExp(re.source, flags);
}

export function splitIntoChapters(
  text: string,
  template: ImportTemplate
): ParsedChapter[] {
  const chapters: ParsedChapter[] = [];
  // Use template pattern and ensure global + unicode flags are present
  const pattern = withFlags(template.chapterPattern, 'gu');
  const chapterMatches = [...text.matchAll(pattern)];
  
  console.log('🔍 Looking for chapters with pattern:', template.chapterPattern);
  console.log(`📚 Found ${chapterMatches.length} chapter markers`);
  if (chapterMatches.length > 0) {
    console.log('✅ First 5 chapters:', chapterMatches.slice(0, 5).map(m => m[0]));
  }
  console.log(`📝 Total text length: ${text.length} characters`);
  console.log(`📄 Sample text (first 500 chars):`, text.substring(0, 500));
  
  if (chapterMatches.length === 0) {
    console.warn('❌ No chapter markers found. Treating entire text as one chapter.');
    const verses = splitIntoVerses(text, template);
    if (verses.length === 0) {
      console.warn('⚠️ No verses found. This may be a text-only chapter (preface/introduction).');
      return [{
        chapter_number: 1,
        chapter_type: 'text',
        title_ua: 'Розділ 1',
        verses: [],
        content_ua: text.trim()
      }];
    }
    return [{
      chapter_number: 1,
      chapter_type: 'verses',
      title_ua: 'Розділ 1',
      verses: verses
    }];
  }
  
  chapterMatches.forEach((match, index) => {
    const rawNumber = match[1] || '';
    const fullMatch = match[0] || '';
    
    // Special handling for introductory text chapters
    let chapterNum: number;
    let chapterTitle: string;
    
    if (/^\s*(?:Вступ|ВСТУП)/i.test(fullMatch)) {
      chapterNum = -1;
      chapterTitle = 'Вступ';
    } else if (/^\s*(?:Звернення|ЗВЕРНЕННЯ)/i.test(fullMatch)) {
      chapterNum = 0;
      chapterTitle = 'Звернення';
    } else {
      // Try to parse as number first
      chapterNum = parseInt(rawNumber);
      
      // If not a number, try Ukrainian words
      if (isNaN(chapterNum)) {
        const normalized = rawNumber.trim().replace(/['ʼ`]/g, "'").toUpperCase();
        chapterNum = ukrainianNumberWords[normalized] || (index + 1);
      }
      
      chapterTitle = `Глава ${chapterNum}`;
    }
    
    const startPos = match.index || 0;
    const endPos = chapterMatches[index + 1]?.index || text.length;
    const chapterText = text.substring(startPos, endPos);
    
    // Extract chapter title only if not already set by special chapters
    if (chapterNum >= 1) {
      const titleMatch1 = chapterText.match(/^(?:ГЛАВА|РОЗДІЛ|CHAPTER)[^\n]*?:\s*(.+?)(?:\n|$)/mi);
      if (titleMatch1) {
        chapterTitle = titleMatch1[1].trim();
      } else {
        const titleMatch2 = chapterText.match(/^(?:ГЛАВА|РОЗДІЛ|CHAPTER)[^\n]*?\n\s*([А-ЯІЇЄҐа-яіїєґ][^\n]+?)(?:\n|$)/mi);
        if (titleMatch2) {
          chapterTitle = titleMatch2[1].trim();
        }
      }
    }
    
    const verses = splitIntoVerses(chapterText, template);
    
    // Determine chapter type: "Вступ" is text-only, all others with verses are verse chapters
    let chapterType: ChapterType;
    let contentUa: string | undefined;
    
    if (chapterNum === -1) {
      // "Вступ" is always text-only
      chapterType = 'text';
      contentUa = chapterText.trim();
    } else if (verses.length > 0) {
      // Has verses, treat as verse chapter
      chapterType = 'verses';
      contentUa = undefined;
    } else {
      // No verses found, treat as text
      chapterType = 'text';
      contentUa = chapterText.trim();
    }
    
    console.log(`📖 Chapter ${chapterNum}: "${chapterTitle}" (${verses.length} verses, type: ${chapterType})`);
    
    // Include all chapters, even if no verses (text-only chapters like prefaces)
    chapters.push({
      chapter_number: chapterNum,
      chapter_type: chapterType,
      title_ua: chapterTitle,
      verses: verses,
      content_ua: contentUa
    });
  });
  
  console.log(`✅ Final result: ${chapters.length} valid chapters (out of ${chapterMatches.length} markers)`);
  
  if (chapters.length === 0) {
    console.error('❌ No valid chapters with verses found. Check your file format and template patterns.');
  }
  
  return chapters;
}

export function splitIntoVerses(
  chapterText: string,
  template: ImportTemplate
): ParsedVerse[] {
  const verses: ParsedVerse[] = [];
  // Ensure global + unicode flags for verse regex
  const pattern = withFlags(template.versePattern, 'gu');
  const verseMatches = [...chapterText.matchAll(pattern)];
  
  console.log(`🔍 Verse pattern:`, template.versePattern);
  console.log(`📊 Found ${verseMatches.length} verse markers`);
  if (verseMatches.length > 0) {
    console.log(`✅ First verse:`, verseMatches[0][0]);
    console.log(`✅ Last verse:`, verseMatches[verseMatches.length - 1][0]);
  }
  console.log(`📝 Sample text (first 300 chars):`, chapterText.substring(0, 300));
  console.log(`📝 Full matches:`, verseMatches.map(m => ({ text: m[0], groups: m.slice(1) })));
  
  if (verseMatches.length === 0) {
    console.warn('⚠️ No verses found with main pattern. Trying fallback...');
    // Fallback: try broader pattern for Srimad-Bhagavatam verses
    const fallbackPattern = /^\s*(?:В[\u0406I]РШ|ТЕКСТ)\s+(\d+)/gmi;
    const fallbackMatches = [...chapterText.matchAll(fallbackPattern)];
    console.log(`🔄 Fallback found ${fallbackMatches.length} verses`);
    
    if (fallbackMatches.length === 0) {
      console.warn('❌ Still no verses found. Returning empty array.');
      return verses;
    }
    
    // Process fallback matches
    fallbackMatches.forEach((match, index) => {
      const verseNum = normalizeVerseNumber(match[1] || (index + 1).toString());
      const startPos = match.index || 0;
      const endPos = fallbackMatches[index + 1]?.index || chapterText.length;
      const verseText = chapterText.substring(startPos, endPos);
      
      const verse = parseVerse(verseNum, verseText, template);
      if (verse.verse_number) {
        verses.push(verse);
      }
    });
    
    return verses;
  }
  
  verseMatches.forEach((match, index) => {
    const fullMatch = match[0] || '';
    let verseNum: string;
    
    console.log(`📖 Processing verse match ${index + 1}:`, { fullMatch, groups: match.slice(1) });
    
    // Special handling for "Звернення"
    if (/^\s*(?:Звернення|ЗВЕРНЕННЯ)/i.test(fullMatch)) {
      verseNum = '0';
      console.log(`✅ Recognized as "Звернення", verse number: 0`);
    } else if (match[1]) {
      // First capture group - mantra number
      verseNum = normalizeVerseNumber(match[1]);
      console.log(`✅ Extracted from group 1: "${match[1]}" -> normalized to: "${verseNum}"`);
    } else if (match[2]) {
      // Second capture group - special chapters
      verseNum = '0';
      console.log(`✅ Extracted from group 2 (special): "${match[2]}" -> verse number: 0`);
    } else {
      // Fallback
      const rawNumber = match[0].replace(/^\s*(?:МАНТРА|MANTRA)\s+/i, '').trim();
      verseNum = normalizeVerseNumber(rawNumber);
      console.log(`⚠️ Fallback extraction from full match: "${rawNumber}" -> normalized to: "${verseNum}"`);
    }
    
    const startPos = match.index || 0;
    const endPos = verseMatches[index + 1]?.index || chapterText.length;
    const verseText = chapterText.substring(startPos, endPos);
    
    console.log(`📝 Verse ${verseNum} text length: ${verseText.length} chars`);
    console.log(`📝 First 200 chars:`, verseText.substring(0, 200));
    
    const verse = parseVerse(verseNum, verseText, template);
    console.log(`✅ Parsed verse ${verseNum}:`, {
      has_sanskrit: !!verse.sanskrit,
      has_transliteration: !!verse.transliteration,
      has_synonyms: !!verse.synonyms_ua,
      has_translation: !!verse.translation_ua,
      has_commentary: !!verse.commentary_ua
    });
    
    if (verse.verse_number) {
      verses.push(verse);
    } else {
      console.warn(`Skipping verse at index ${index} - no verse number`);
    }
  });
  
  return verses;
}

function normalizeVerseNumber(raw: string): string {
  // First check if it's a Ukrainian word
  const normalized = raw.trim().replace(/['ʼ`]/g, "'").toUpperCase();
  const numericValue = ukrainianNumberWords[normalized];
  
  if (numericValue !== undefined) {
    return numericValue.toString();
  }
  
  // Otherwise extract numeric value
  return raw.replace(/[^\d.-]/g, '').trim();
}

function parseVerse(
  verseNumber: string,
  text: string,
  template: ImportTemplate
): ParsedVerse {
  const verse: ParsedVerse = { verse_number: verseNumber };
  
  console.log(`\n🔍 Parsing verse ${verseNumber}`);
  console.log(`📄 Text length: ${text.length} chars`);
  
  const lines = text.split('\n').filter(l => l.trim());
  console.log(`📋 Total lines: ${lines.length}`);
  
  // Extract Sanskrit - collect all consecutive Devanagari lines
  const sanskritLines: string[] = [];
  let translitStartIndex = -1;
  
  for (let i = 1; i < lines.length; i++) { // Start from 1 to skip verse number
    const line = lines[i].trim();
    
    // Check if line contains Devanagari characters
    if (/[\u0900-\u097F]/.test(line)) {
      sanskritLines.push(line);
      console.log(`✅ Sanskrit line ${i}: ${line.substring(0, 50)}...`);
    } else if (sanskritLines.length > 0) {
      // Found end of Sanskrit section
      translitStartIndex = i;
      console.log(`🔚 End of Sanskrit at line ${i}`);
      break;
    }
  }
  
  if (sanskritLines.length > 0) {
    verse.sanskrit = sanskritLines.join('\n');
    console.log(`✅ Extracted ${sanskritLines.length} Sanskrit lines`);
  } else {
    console.log(`⚠️ No Sanskrit found`);
  }
  
  // Extract Transliteration - collect Ukrainian lines with diacritics after Sanskrit
  const translitLines: string[] = [];
  if (translitStartIndex !== -1) {
    for (let i = translitStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Stop if we hit section headers
      if (line.match(template.synonymsPattern) ||
          line.match(template.translationPattern) ||
          line.match(template.commentaryPattern)) {
        break;
      }
      
      // Check if line contains Ukrainian letters (with or without diacritics)
      // Skip lines that are section headers
      if (/[а-яА-ЯіІїЇєЄґҐ]/.test(line) && 
          !line.match(/^(?:ВІРШ|ТЕКСТ|ПОСЛІВНИЙ|ПЕРЕКЛАД|ПОЯСНЕННЯ)/i)) {
        translitLines.push(line);
      } else if (translitLines.length > 0) {
        // Stop if we've collected some and hit non-Ukrainian line
        break;
      }
    }
  }
  
  if (translitLines.length > 0) {
    verse.transliteration = translitLines.join('\n');
  }
  
  // Extract synonyms
  const synonymsMatch = text.match(template.synonymsPattern);
  if (synonymsMatch && synonymsMatch.index !== undefined) {
    const synonymsStart = synonymsMatch.index + synonymsMatch[0].length;
    const translationMatch = text.match(template.translationPattern);
    const synonymsEnd = translationMatch?.index || text.length;
    const synonymsText = text.substring(synonymsStart, synonymsEnd).trim();
    if (synonymsText.length > 0) {
      verse.synonyms_ua = synonymsText;
    }
  }
  
  // Extract translation
  const translationMatch = text.match(template.translationPattern);
  if (translationMatch && translationMatch.index !== undefined) {
    const translationStart = translationMatch.index + translationMatch[0].length;
    const commentaryMatch = text.match(template.commentaryPattern);
    const translationEnd = commentaryMatch?.index || text.length;
    const translationText = text.substring(translationStart, translationEnd).trim();
    if (translationText.length > 0) {
      verse.translation_ua = translationText;
    }
  }
  
  // Extract commentary
  const commentaryMatch = text.match(template.commentaryPattern);
  if (commentaryMatch && commentaryMatch.index !== undefined) {
    const commentaryStart = commentaryMatch.index + commentaryMatch[0].length;
    const commentaryText = text.substring(commentaryStart).trim();
    if (commentaryText.length > 0) {
      verse.commentary_ua = commentaryText;
    }
  }
  
  return verse;
}

export function customSplitByRegex(
  text: string,
  verseRegex: string,
  synonymsRegex: string,
  translationRegex: string,
  commentaryRegex: string
): ParsedVerse[] {
  const template: ImportTemplate = {
    id: 'custom',
    name: 'Користувацький',
    versePattern: new RegExp(verseRegex, 'mi'),
    synonymsPattern: new RegExp(synonymsRegex, 'mi'),
    translationPattern: new RegExp(translationRegex, 'mi'),
    commentaryPattern: new RegExp(commentaryRegex, 'mi'),
    chapterPattern: /^CHAPTER\s+(\d+)/mi,
  };
  
  return splitIntoVerses(text, template);
}
