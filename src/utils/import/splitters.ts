import { ParsedChapter, ParsedVerse, ImportTemplate } from '@/types/book-import';

export function splitIntoChapters(
  text: string,
  template: ImportTemplate
): ParsedChapter[] {
  const chapters: ParsedChapter[] = [];
  const chapterMatches = [...text.matchAll(new RegExp(template.chapterPattern, 'gmi'))];
  
  console.log('🔍 Looking for chapters with pattern:', template.chapterPattern);
  console.log(`📚 Found ${chapterMatches.length} chapter markers`);
  if (chapterMatches.length > 0) {
    console.log('✅ First 5 chapters:', chapterMatches.slice(0, 5).map(m => m[0]));
  }
  console.log(`📝 Total text length: ${text.length} characters`);
  console.log(`📄 Sample text (first 500 chars):`, text.substring(0, 500));
  
  if (chapterMatches.length === 0) {
    // If no chapter markers found, treat entire text as one chapter
    return [{
      chapter_number: 1,
      title_ua: 'Розділ 1',
      verses: splitIntoVerses(text, template)
    }];
  }
  
  chapterMatches.forEach((match, index) => {
    const chapterNum = parseInt(match[1] || (index + 1).toString());
    const startPos = match.index || 0;
    const endPos = chapterMatches[index + 1]?.index || text.length;
    const chapterText = text.substring(startPos, endPos);
    
    chapters.push({
      chapter_number: chapterNum,
      title_ua: `Розділ ${chapterNum}`,
      verses: splitIntoVerses(chapterText, template)
    });
  });
  
  return chapters;
}

export function splitIntoVerses(
  chapterText: string,
  template: ImportTemplate
): ParsedVerse[] {
  const verses: ParsedVerse[] = [];
  const verseMatches = [...chapterText.matchAll(new RegExp(template.versePattern, 'gmi'))];
  
  console.log(`🔍 Verse pattern:`, template.versePattern);
  console.log(`📊 Found ${verseMatches.length} verse markers`);
  if (verseMatches.length > 0) {
    console.log(`✅ First verse match:`, verseMatches[0][0]);
  }
  console.log(`📝 Sample text (first 300 chars):`, chapterText.substring(0, 300));
  
  if (verseMatches.length === 0) {
    console.warn('No verse matches found, attempting paragraph split');
    // Fallback: split by double newlines
    const paragraphs = chapterText.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    console.log(`Fallback: знайдено ${paragraphs.length} параграфів`);
    paragraphs.forEach((para, index) => {
      verses.push(parseVerse((index + 1).toString(), para, template));
    });
    return verses;
  }
  
  verseMatches.forEach((match, index) => {
    const verseNum = normalizeVerseNumber(match[1] || (index + 1).toString());
    const startPos = match.index || 0;
    const endPos = verseMatches[index + 1]?.index || chapterText.length;
    const verseText = chapterText.substring(startPos, endPos);
    
    const verse = parseVerse(verseNum, verseText, template);
    if (verse.verse_number) {
      verses.push(verse);
    } else {
      console.warn(`Skipping verse at index ${index} - no verse number`);
    }
  });
  
  return verses;
}

function normalizeVerseNumber(raw: string): string {
  return raw.replace(/[^\d.-]/g, '').trim();
}

function parseVerse(
  verseNumber: string,
  text: string,
  template: ImportTemplate
): ParsedVerse {
  const verse: ParsedVerse = { verse_number: verseNumber };
  
  const lines = text.split('\n').filter(l => l.trim());
  
  // Extract Sanskrit - collect all consecutive Devanagari lines
  const sanskritLines: string[] = [];
  let translitStartIndex = -1;
  
  for (let i = 1; i < lines.length; i++) { // Start from 1 to skip verse number
    const line = lines[i].trim();
    
    // Check if line contains Devanagari characters
    if (/[\u0900-\u097F]/.test(line)) {
      sanskritLines.push(line);
    } else if (sanskritLines.length > 0) {
      // Found end of Sanskrit section
      translitStartIndex = i;
      break;
    }
  }
  
  if (sanskritLines.length > 0) {
    verse.sanskrit = sanskritLines.join('\n');
  }
  
  // Extract Transliteration - collect consecutive IAST lines after Sanskrit
  const translitLines: string[] = [];
  if (translitStartIndex !== -1) {
    for (let i = translitStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line contains IAST characters but isn't a section header
      if (/[āīūṛṝḷḹēōṃḥśṣṇṭḍ]/.test(line) && 
          !line.match(template.synonymsPattern) &&
          !line.match(template.translationPattern) &&
          !line.match(template.commentaryPattern)) {
        translitLines.push(line);
      } else {
        // Stop collecting transliteration when we hit a section or non-IAST line
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
