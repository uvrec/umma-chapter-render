import { ParsedChapter, ParsedVerse, ImportTemplate, ChapterType } from '@/types/book-import';
import { normalizeVerseNumber as normalizeCompositeVerse } from '@/utils/vedabaseParsers';

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

// Debug flag - disable heavy logging in production
const DEBUG = process.env.NODE_ENV === 'development' && false;

export function splitIntoChapters(
  text: string,
  template: ImportTemplate
): ParsedChapter[] {
  const chapters: ParsedChapter[] = [];
  // Use template pattern and ensure global + unicode flags are present
  const pattern = withFlags(template.chapterPattern, 'gu');
  const chapterMatches = [...text.matchAll(pattern)];
  
  if (DEBUG) {
    console.log('🔍 Looking for chapters with pattern:', template.chapterPattern);
    console.log(`📚 Found ${chapterMatches.length} chapter markers`);
    if (chapterMatches.length > 0) {
      console.log('✅ First 5 chapters:', chapterMatches.slice(0, 5).map(m => m[0]));
    }
    console.log(`📝 Total text length: ${text.length} characters`);
    console.log(`📄 Sample text (first 200 chars):`, text.substring(0, 200));
  }
  
  if (chapterMatches.length === 0) {
    console.warn('❌ No chapter markers found. Treating entire text as one chapter.');
    const verses = splitIntoVerses(text, template, 1);
    if (verses.length === 0) {
      console.warn('⚠️ No verses found in chapter 1. This may be a text-only chapter (preface/introduction).');
      return [{
        chapter_number: 1,
        chapter_type: 'text',
        title_uk: 'Розділ 1',
        verses: [],
        content_uk: text.trim()
      }];
    }
    return [{
      chapter_number: 1,
      chapter_type: 'verses',
      title_uk: 'Розділ 1',
      verses: verses
    }];
  }
  
  chapterMatches.forEach((match, index) => {
    const rawNumber = match[1] || '';
    const fullMatch = match[0] || '';
    
    // 🔧 Розширене розпізнавання вступних розділів
    const introTitles: Record<string, { num: number; title: string }> = {
      'ЛАНКИ ЛАНЦЮГА': { num: -5, title: 'Ланки ланцюга учнівської послідовності' },
      'ВСТУП': { num: -4, title: 'Вступ' },
      'ПЕРЕДМОВА': { num: -3, title: 'Передмова до англійського видання' },
      'ПЕРЕДІСТОРІЯ': { num: -2, title: 'Передісторія «Бгаґавад-ґіти»' },
      'ПОСВЯТА': { num: -1, title: 'Посвята' },
      'НАРИС ЖИТТЯ': { num: -2, title: 'Нарис життя і повчань Господа Чайтаньї' },
      'ЗВЕРНЕННЯ': { num: 0, title: 'Звернення' },
    };

    let chapterNum: number;
    let chapterTitle: string;
    let isIntroChapter = false;
    
    // Перевірка на вступний розділ
    const upperMatch = fullMatch.toUpperCase();
    for (const [key, value] of Object.entries(introTitles)) {
      if (upperMatch.includes(key)) {
        chapterNum = value.num;
        chapterTitle = value.title;
        isIntroChapter = true;
        if (DEBUG) console.log(`✅ Intro chapter detected: "${chapterTitle}" (num: ${chapterNum})`);
        break;
      }
    }
    
    if (!isIntroChapter) {
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
    
    const verses = splitIntoVerses(chapterText, template, chapterNum);
    
    // Determine chapter type
    let chapterType: ChapterType;
    let contentUk: string | undefined;
    
    if (isIntroChapter) {
      // Вступні розділи завжди текстові
      chapterType = 'text';
      contentUk = chapterText.trim();
    } else if (verses.length > 0) {
      // Has verses, treat as verse chapter
      chapterType = 'verses';
      contentUk = undefined;
    } else {
      // No verses found, treat as text
      chapterType = 'text';
      contentUk = chapterText.trim();
    }
    
    if (DEBUG) {
      console.log(`📖 Chapter ${chapterNum}: "${chapterTitle}" (${verses.length} verses, type: ${chapterType})`);
    }
    
    // Include all chapters, even if no verses (text-only chapters like prefaces)
    chapters.push({
      chapter_number: chapterNum,
      chapter_type: chapterType,
      title_uk: chapterTitle,
      verses: verses,
      content_uk: contentUk
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
  template: ImportTemplate,
  chapterNumber?: number
): ParsedVerse[] {
  const chapterInfo = chapterNumber !== undefined ? ` в розділі ${chapterNumber}` : '';
  const verses: ParsedVerse[] = [];
  // Ensure global + unicode flags for verse regex
  const pattern = withFlags(template.versePattern, 'gu');
  const verseMatches = [...chapterText.matchAll(pattern)];
  
  if (DEBUG) {
    console.log(`🔍 Verse pattern:`, template.versePattern);
    console.log(`📊 Found ${verseMatches.length} verse markers`);
    if (verseMatches.length > 0) {
      console.log(`✅ First verse:`, verseMatches[0][0]);
      console.log(`✅ Last verse:`, verseMatches[verseMatches.length - 1][0]);
    }
    console.log(`📝 Sample text (first 200 chars):`, chapterText.substring(0, 200));
  }
  
  // Try generic 'anywhere' fallback (remove leading ^) if nothing found
  if (verseMatches.length === 0) {
    console.warn(`⚠️ Не знайдено віршів${chapterInfo} з основним шаблоном. Спроба fallback...`);
    const anywhereSource = template.versePattern.source.replace(/^[\^]\s*/, '');
    const anywhereBase = new RegExp(anywhereSource, template.versePattern.flags);
    const anywherePattern = withFlags(anywhereBase, 'gu');
    const anywhereMatches = [...chapterText.matchAll(anywherePattern)];
    console.log(`🔄 Fallback знайшов ${anywhereMatches.length} віршів${chapterInfo}`);

    if (anywhereMatches.length > 0) {
      anywhereMatches.forEach((match, index) => {
        const verseNum = normalizeVerseNumber(match[1] || (index + 1).toString());
        const startPos = match.index || 0;
        const endPos = anywhereMatches[index + 1]?.index || chapterText.length;
        const verseText = chapterText.substring(startPos, endPos);
        const verse = parseVerse(verseNum, verseText, template);
        if (verse.verse_number) {
          verses.push(verse);
        }
      });

      return verses;
    }

    // Template-specific second fallback (legacy): Srimad-Bhagavatam "ВІРШ"/"ТЕКСТ"
    const fallbackPattern = /^\s*(?:В[\u0406I]РШ|ТЕКСТ)\s+(\d+)/gmi;
    const fallbackMatches = [...chapterText.matchAll(fallbackPattern)];
    console.log(`🔄 Legacy fallback знайшов ${fallbackMatches.length} віршів${chapterInfo}`);

    if (fallbackMatches.length === 0) {
      console.warn(`❌ Не знайдено жодного вірша${chapterInfo}. Повертаємо порожній масив.`);
      return verses;
    }
    
    // Process legacy fallback matches
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
      has_synonyms: !!verse.synonyms_uk,
      has_translation: !!verse.translation_uk,
      has_commentary: !!verse.commentary_uk
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

  // ✅ ОНОВЛЕНО: Підтримка складених віршів (діапазонів)
  // Перевіряємо чи є це діапазон (наприклад, "256-266", "Verses 10-15")
  const rangeMatch = raw.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (rangeMatch) {
    // Повертаємо діапазон у нормалізованому форматі "start-end"
    return `${rangeMatch[1]}-${rangeMatch[2]}`;
  }

  // ✅ FIX: Видаляємо префікси типу "1.1." (формат WisdomLib)
  // "1.1.73" → "73", "2.17.48-49" → "48-49"
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^\d+\.\d+\./, '');

  // Otherwise extract numeric value (зберігаємо тільки цифри і дефіс)
  return cleaned.replace(/[^\d-]/g, '').trim();
}

function parseVerse(
  verseNumber: string,
  text: string,
  template: ImportTemplate
): ParsedVerse {
  const verse: ParsedVerse = { verse_number: verseNumber };
  
  if (DEBUG) {
    console.log(`\n🔍 Parsing verse ${verseNumber}`);
    console.log(`📄 Text length: ${text.length} chars`);
  }
  
  const lines = text.split('\n').filter(l => l.trim());
  if (DEBUG) console.log(`📋 Total lines: ${lines.length}`);
  
  // Extract Sanskrit - collect all consecutive Devanagari lines
  const sanskritLines: string[] = [];
  let translitStartIndex = -1;
  
  for (let i = 1; i < lines.length; i++) { // Start from 1 to skip verse number
    const line = lines[i].trim();
    
    // 🔧 Розширене розпізнавання санскриту (деванаґарі + бенгалі)
    if (/[\u0900-\u097F\u0980-\u09FF]/.test(line)) {
      sanskritLines.push(line);
      if (DEBUG) console.log(`✅ Sanskrit line ${i}: ${line.substring(0, 50)}...`);
    } else if (sanskritLines.length > 0) {
      // Found end of Sanskrit section
      translitStartIndex = i;
      if (DEBUG) console.log(`🔚 End of Sanskrit at line ${i}`);
      break;
    }
  }
  
  if (sanskritLines.length > 0) {
    verse.sanskrit = sanskritLines.join('\n');
    console.log(`✅ Extracted ${sanskritLines.length} Sanskrit lines`);
  } else {
    console.log(`⚠️ No Sanskrit found`);
  }
  
  // Extract Transliteration - collect lines after Sanskrit until section headers
  const translitLines: string[] = [];
  {
    // Build unanchored header patterns for robust detection (allow optional leading spaces/tags)
    const anySynonyms = new RegExp(
      template.synonymsPattern.source.replace(/^\^\s*/, ''),
      template.synonymsPattern.flags
    );
    const anyTranslation = new RegExp(
      template.translationPattern.source.replace(/^\^\s*/, ''),
      template.translationPattern.flags
    );
    const anyCommentary = new RegExp(
      template.commentaryPattern.source.replace(/^\^\s*/, ''),
      template.commentaryPattern.flags
    );

    // If no Sanskrit detected, start right after the verse header line
    const startIndex = translitStartIndex !== -1 ? translitStartIndex : 1;
    if (startIndex < lines.length) {
      for (let i = startIndex; i < lines.length; i++) {
        // Remove simple HTML tags if present, then trim
        const rawLine = lines[i];
        const line = rawLine.replace(/<[^>]+>/g, '').trim();

        // Stop if we hit any section header (synonyms/translation/commentary)
        if (
          anySynonyms.test(line) ||
          anyTranslation.test(line) ||
          anyCommentary.test(line)
        ) {
          break;
        }

        // Collect non-empty lines (skip obvious headers/labels)
        if (
          line &&
          !/^(?:ВІРШ|ТЕКСТ|МАНТРА|MANTRA|ПОСЛІВНИЙ|WORD FOR WORD|ПЕРЕКЛАД|TRANSLATION|ПОЯСНЕННЯ|PURPORT)[:-]?/i.test(
            line
          )
        ) {
          translitLines.push(line);
        }
      }
    }
  }

  if (translitLines.length > 0) {
    verse.transliteration = translitLines.join('\n');
  }
  
  // Extract synonyms
  // Extract synonyms (fallback to unanchored if needed)
  let synonymsMatch = text.match(template.synonymsPattern);
  if (!synonymsMatch) {
    const anywhereSynonyms = new RegExp(
      template.synonymsPattern.source.replace(/^\^\s*/, ''),
      template.synonymsPattern.flags
    );
    synonymsMatch = text.match(anywhereSynonyms);
  }
  if (synonymsMatch && synonymsMatch.index !== undefined) {
    const synonymsStart = synonymsMatch.index + synonymsMatch[0].length;
    let translationMatch = text.match(template.translationPattern);
    if (!translationMatch) {
      const anywhereTranslation = new RegExp(
        template.translationPattern.source.replace(/^\^\s*/, ''),
        template.translationPattern.flags
      );
      translationMatch = text.match(anywhereTranslation);
    }
    const synonymsEnd = translationMatch?.index || text.length;
    const synonymsText = text.substring(synonymsStart, synonymsEnd).trim();
    if (synonymsText.length > 0) {
      verse.synonyms_uk = synonymsText;
    }
  }
  
  // Extract translation (fallback to unanchored if needed)
  let translationMatch = text.match(template.translationPattern);
  if (!translationMatch) {
    const anywhereTranslation = new RegExp(
      template.translationPattern.source.replace(/^\^\s*/, ''),
      template.translationPattern.flags
    );
    translationMatch = text.match(anywhereTranslation);
  }
  if (translationMatch && translationMatch.index !== undefined) {
    const translationStart = translationMatch.index + translationMatch[0].length;
    let commentaryMatch = text.match(template.commentaryPattern);
    if (!commentaryMatch) {
      const anywhereCommentary = new RegExp(
        template.commentaryPattern.source.replace(/^\^\s*/, ''),
        template.commentaryPattern.flags
      );
      commentaryMatch = text.match(anywhereCommentary);
    }
    const translationEnd = commentaryMatch?.index || text.length;
    const translationText = text.substring(translationStart, translationEnd).trim();
    if (translationText.length > 0) {
      verse.translation_uk = translationText;
    }
  }
  
  // Extract commentary (fallback to unanchored if needed)
  let commentaryMatch = text.match(template.commentaryPattern);
  if (!commentaryMatch) {
    const anywhereCommentary = new RegExp(
      template.commentaryPattern.source.replace(/^\^\s*/, ''),
      template.commentaryPattern.flags
    );
    commentaryMatch = text.match(anywhereCommentary);
  }
  if (commentaryMatch && commentaryMatch.index !== undefined) {
    const commentaryStart = commentaryMatch.index + commentaryMatch[0].length;
    const commentaryText = text.substring(commentaryStart).trim();
    if (commentaryText.length > 0) {
      verse.commentary_uk = commentaryText;
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
