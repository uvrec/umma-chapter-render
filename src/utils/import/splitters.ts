import { ParsedChapter, ParsedVerse, ImportTemplate } from '@/types/book-import';

export function splitIntoChapters(
  text: string,
  template: ImportTemplate
): ParsedChapter[] {
  const chapters: ParsedChapter[] = [];
  const chapterMatches = [...text.matchAll(new RegExp(template.chapterPattern, 'gmi'))];
  
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
  
  verseMatches.forEach((match, index) => {
    const verseNum = match[1] || (index + 1).toString();
    const startPos = match.index || 0;
    const endPos = verseMatches[index + 1]?.index || chapterText.length;
    const verseText = chapterText.substring(startPos, endPos);
    
    verses.push(parseVerse(verseNum, verseText, template));
  });
  
  return verses;
}

function parseVerse(
  verseNumber: string,
  text: string,
  template: ImportTemplate
): ParsedVerse {
  const verse: ParsedVerse = { verse_number: verseNumber };
  
  // Extract Sanskrit (usually first non-empty line after verse number)
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length > 1) {
    verse.sanskrit = lines[1]?.trim();
  }
  
  // Extract synonyms
  const synonymsMatch = text.match(template.synonymsPattern);
  if (synonymsMatch && synonymsMatch.index !== undefined) {
    const synonymsStart = synonymsMatch.index + synonymsMatch[0].length;
    const translationMatch = text.match(template.translationPattern);
    const synonymsEnd = translationMatch?.index || text.length;
    verse.synonyms_ua = text.substring(synonymsStart, synonymsEnd).trim();
  }
  
  // Extract translation
  const translationMatch = text.match(template.translationPattern);
  if (translationMatch && translationMatch.index !== undefined) {
    const translationStart = translationMatch.index + translationMatch[0].length;
    const commentaryMatch = text.match(template.commentaryPattern);
    const translationEnd = commentaryMatch?.index || text.length;
    verse.translation_ua = text.substring(translationStart, translationEnd).trim();
  }
  
  // Extract commentary
  const commentaryMatch = text.match(template.commentaryPattern);
  if (commentaryMatch && commentaryMatch.index !== undefined) {
    const commentaryStart = commentaryMatch.index + commentaryMatch[0].length;
    verse.commentary_ua = text.substring(commentaryStart).trim();
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
