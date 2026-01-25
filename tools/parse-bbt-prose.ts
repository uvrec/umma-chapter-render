/**
 * Parser for BBT prose books and SOVA
 *
 * Usage: npx ts-node tools/parse-bbt-prose.ts [book_code]
 * Example: npx ts-node tools/parse-bbt-prose.ts sova
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Book configurations
const BOOKS: Record<string, {
  folder: string;
  title_uk: string;
  title_en: string;
  slug: string;
  chapterPrefix: string;
  chapterFiles: string[];
  hasVerses: boolean; // true = verse structure like BG, false = prose
}> = {
  bbd: {
    folder: 'BBAD',
    title_uk: 'По той бік народження і смерті',
    title_en: 'Beyond Birth and Death',
    slug: 'bbd',
    chapterPrefix: 'UKBB',
    chapterFiles: ['01xt', '02xt', '03XT', '04XT', '05XT'],
    hasVerses: false,
  },
  lcfl: {
    folder: 'LCFL',
    title_uk: 'Життя походить із життя',
    title_en: 'Life Comes From Life',
    slug: 'lcfl',
    chapterPrefix: 'UKLC',
    chapterFiles: Array.from({ length: 16 }, (_, i) => String(i + 1).padStart(2, '0') + 'XT'),
    hasVerses: false,
  },
  sova: {
    folder: 'sova',
    title_uk: "Пісні ачар'їв-вайшнавів",
    title_en: 'Songs of the Vaiṣṇava Ācāryas',
    slug: 'sova',
    chapterPrefix: 'UKSO',
    chapterFiles: [], // Dynamic - will be populated at runtime
    hasVerses: true, // Like BG - has transliteration, synonyms, translation
  },
};

// PUA character mapping for Ukrainian BBT fonts
const PUA_MAP: Record<number, string> = {
  0xF020: ' ', 0xF021: '!', 0xF022: '"', 0xF023: '#', 0xF024: '$', 0xF025: '%',
  0xF026: '&', 0xF027: "'", 0xF028: '(', 0xF029: ')', 0xF02A: '*', 0xF02B: '+',
  0xF02C: ',', 0xF02D: '-', 0xF02E: '.', 0xF02F: '/', 0xF030: '0', 0xF031: '1',
  0xF032: '2', 0xF033: '3', 0xF034: '4', 0xF035: '5', 0xF036: '6', 0xF037: '7',
  0xF038: '8', 0xF039: '9', 0xF03A: ':', 0xF03B: ';', 0xF03C: '<', 0xF03D: '=',
  0xF03E: '>', 0xF03F: '?', 0xF040: '@', 0xF041: 'А', 0xF042: 'Б', 0xF043: 'Ц',
  0xF044: 'Д', 0xF045: 'Е', 0xF046: 'Ф', 0xF047: 'Ґ', 0xF048: 'Г', 0xF049: 'І',
  0xF04A: 'Й', 0xF04B: 'К', 0xF04C: 'Л', 0xF04D: 'М', 0xF04E: 'Н', 0xF04F: 'О',
  0xF050: 'П', 0xF051: 'Я', 0xF052: 'Р', 0xF053: 'С', 0xF054: 'Т', 0xF055: 'У',
  0xF056: 'В', 0xF057: 'Ш', 0xF058: 'Ь', 0xF059: 'И', 0xF05A: 'З', 0xF05B: '[',
  0xF05C: '\\', 0xF05D: ']', 0xF05E: '^', 0xF05F: '_', 0xF060: '`', 0xF061: 'а',
  0xF062: 'б', 0xF063: 'ц', 0xF064: 'д', 0xF065: 'е', 0xF066: 'ф', 0xF067: 'ґ',
  0xF068: 'г', 0xF069: 'і', 0xF06A: 'й', 0xF06B: 'к', 0xF06C: 'л', 0xF06D: 'м',
  0xF06E: 'н', 0xF06F: 'о', 0xF070: 'п', 0xF071: 'я', 0xF072: 'р', 0xF073: 'с',
  0xF074: 'т', 0xF075: 'у', 0xF076: 'в', 0xF077: 'ш', 0xF078: 'ь', 0xF079: 'и',
  0xF07A: 'з', 0xF07B: '{', 0xF07C: '|', 0xF07D: '}', 0xF07E: '~', 0xF080: 'Ж',
  0xF081: 'Ї', 0xF082: 'ї', 0xF083: 'Є', 0xF084: 'є', 0xF085: 'Ч', 0xF086: 'ч',
  0xF087: 'Щ', 0xF088: 'щ', 0xF089: 'Х', 0xF08A: 'х', 0xF08B: 'Ю', 0xF08C: 'ю',
  0xF08D: 'ж', 0xF08E: 'Э', 0xF08F: 'э', 0xF090: '№', 0xF091: '«', 0xF092: '»',
  0xF093: '\u2018', 0xF094: '\u2019', 0xF095: '\u201C', 0xF096: '\u201D', 0xF097: '–', 0xF098: '—',
  0xF0B0: '°', 0xF0E0: 'ā', 0xF0E1: 'ī', 0xF0E2: 'ū', 0xF0E3: 'ṛ', 0xF0E4: 'ṝ',
  0xF0E5: 'ḷ', 0xF0E6: 'ḹ', 0xF0E7: 'ṅ', 0xF0E8: 'ñ', 0xF0E9: 'ṭ', 0xF0EA: 'ḍ',
  0xF0EB: 'ṇ', 0xF0EC: 'ś', 0xF0ED: 'ṣ', 0xF0EE: 'ḥ', 0xF0EF: 'ṁ',
  0xF0F0: 'Ā', 0xF0F1: 'Ī', 0xF0F2: 'Ū', 0xF0F3: 'Ṛ', 0xF0F4: 'Ṝ', 0xF0F5: 'Ḷ',
  0xF0F6: 'Ḹ', 0xF0F7: 'Ṅ', 0xF0F8: 'Ñ', 0xF0F9: 'Ṭ', 0xF0FA: 'Ḍ', 0xF0FB: 'Ṇ',
  0xF0FC: 'Ś', 0xF0FD: 'Ṣ', 0xF0FE: 'Ḥ', 0xF0FF: 'Ṁ',
};

// Additional PUA map for Ukrainian diacritics (Cyrillic + combining marks)
const UKRAINIAN_PUA_MAP: Record<string, string> = {
  '\uf100': 'А',     // Capital A
  '\uf101': 'а̄',    // а + macron (long a)
  '\uf102': 'ī',     // ī (long i) - used in Sanskrit portions
  '\uf121': 'ī',     // ī (dotless i + macron)
  '\uf123': 'ū',     // ū (long u)
  '\uf103': 'д̣',    // д + dot below (retroflex d)
  '\uf105': '',      // Style marker, remove
  '\uf109': 'м̇',    // м + dot above (anusvara)
  '\uf107': 'м\u0310', // м + candrabindu
  '\uf10d': 'м\u0310', // м + candrabindu variant
  '\uf10f': 'н̇',    // н + dot above (velar nasal)
  '\uf111': 'н̣',    // н + dot below (retroflex n)
  '\uf113': 'н̃',    // н + tilde (palatal nasal)
  '\uf115': 'р̣',    // р + dot below (vocalic r)
  '\uf117': 'р̣',    // р + dot below (alternate)
  '\uf119': 'т̣',    // т + dot below (retroflex t)
  '\uf11b': 'х̣',    // х + dot below (visarga)
  '\uf11c': 'Ш́',    // Ш + acute (capital ś)
  '\uf11d': 'ш́',    // ш + acute (ś)
  '\uf11f': 'ш̣',    // ш + dot below (ṣ)
  '\uf125': 'р̣̄',   // р + dot below + macron (long vocalic r)
  '\uf127': 'л̣',    // л + dot below (vocalic l)
  '\uf129': 'л̣̄',   // л + dot below + macron (long vocalic l)
};

/**
 * Decode PUA characters to Ukrainian/IAST
 */
function decodePUA(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    result += PUA_MAP[code] || char;
  }
  // Also apply string-based PUA map
  for (const [pua, uni] of Object.entries(UKRAINIAN_PUA_MAP)) {
    result = result.split(pua).join(uni);
  }
  return result;
}

/**
 * Process line continuations (from parse-bbt.ts)
 */
function processLineContinuations(text: string): string {
  if (!text.includes('<->') && !text.includes('<&>')) return text;

  const lines = text.split('\n');
  const result: string[] = [];
  let buffer = '';

  for (const line of lines) {
    const stripped = line.trimEnd();
    if (stripped.endsWith('<->')) {
      let l = stripped.slice(0, -3);
      if (l.endsWith('-')) l = l.slice(0, -1);
      buffer += l;
    } else if (stripped.endsWith('-<&>')) {
      buffer += stripped.slice(0, -4);
    } else if (stripped.endsWith('<&>')) {
      buffer += stripped.slice(0, -3);
    } else {
      if (buffer) {
        result.push(buffer + line);
        buffer = '';
      } else {
        result.push(line);
      }
    }
  }
  if (buffer) result.push(buffer);
  return result.join('\n');
}

/**
 * Process inline tags (from parse-bbt.ts)
 */
function processInlineTags(text: string, keepHtml: boolean = false): string {
  let result = processLineContinuations(text);
  result = result.replace(/<->\s*/g, '');
  result = result.replace(/<&>\s*/g, '');
  result = result.replace(/<=>\s*/g, '');
  result = result.replace(/<_?R>/g, '\n');
  result = result.replace(/<N\|?>/g, '');
  result = result.replace(/<S>/g, ' ');
  result = result.replace(/<_>/g, ' ');

  if (keepHtml) {
    result = result.replace(/<BI>([^<]*)<\/?D>/g, '<strong><em>$1</em></strong>');
    result = result.replace(/<B>([^<]*)<\/?D>/g, '<strong>$1</strong>');
    result = result.replace(/<B>/g, '<strong>');
    result = result.replace(/<MI>([^<]*)<\/?D>/g, '<em>$1</em>');
    result = result.replace(/<MI>/g, '<em>');
    result = result.replace(/<\/?D>/g, '</em>');
    result = result.replace(/<\/em>\s*<em>([,.\;:])/g, '</em>$1');
    result = result.replace(/<em><\/em>/g, '');
    result = result.replace(/<\/em>\s*<em>/g, ' ');
  } else {
    result = result.replace(/<BI>([^<]*)<\/?D>/g, '$1');
    result = result.replace(/<B>([^<]*)<\/?D>/g, '$1');
    result = result.replace(/<B>/g, '');
    result = result.replace(/<MI>([^<]*)<\/?D>/g, '$1');
    result = result.replace(/<MI>/g, '');
    result = result.replace(/<\/?D>/g, '');
  }

  // Handle <_dt>/<_dd> tags
  result = result.replace(/<_dt>([^<]*)<_\/dt>/g, '$1');
  result = result.replace(/<_dt>|<_\/dt>/g, '');
  result = result.replace(/<_dd>|<_\/dd>/g, '');
  result = result.replace(/<_MI>|<_D>/g, '');
  result = result.replace(/<_bt>([^<]*)<_\/bt>/g, '«$1»');

  result = decodePUA(result);

  // Remove remaining tags
  result = result.replace(/<_[^>]*>/g, '');
  result = result.replace(/<[A-Z0-9.]+>/g, '');
  result = result.replace(/<\|>/g, '');
  result = result.replace(/<L-\d+>/g, '');
  result = result.replace(/<~>/g, '');

  result = result.replace(/[ \t]+/g, ' ');
  result = result.replace(/\n\s*\n/g, '\n\n');
  return result.trim();
}

/**
 * Process synonyms with <_dt>/<_dd> tags (from parse-bbt.ts)
 */
function processSynonyms(text: string): string {
  let result = processLineContinuations(text);
  result = result.split('\n').join(' ');

  // Remove <N>, <N150>, <N|> etc. tags before processing
  result = result.replace(/<N\d*\|?>/g, '');

  // Handle <MI><_dt>term<_/dt><D> – <_dd>meaning<_/dd> pattern
  // The meaning can contain nested tags like <MI>word<D>
  // Use a more flexible regex that captures content until <_/dd>
  result = result.replace(/<MI><_dt>([^<]*)<_\/dt><D>\s*[-–—]?\s*<_dd>([\s\S]*?)<_\/dd>/g, (_, term, meaning) => {
    // Process inline tags within the meaning
    let cleanMeaning = meaning.replace(/<MI>([^<]*)<D>/g, '<em>$1</em>');
    cleanMeaning = cleanMeaning.replace(/<MI>/g, '<em>').replace(/<D>/g, '</em>');
    cleanMeaning = cleanMeaning.replace(/<em><\/em>/g, '');
    return `<em>${term}</em> — ${cleanMeaning}`;
  });

  // Handle remaining <_dt>...<_/dt> – <_dd>...<_/dd> patterns (without <MI>)
  result = result.replace(/<_dt>([^<]*)<_\/dt>\s*[-–—]?\s*<_dd>([\s\S]*?)<_\/dd>/g, (_, term, meaning) => {
    let cleanMeaning = meaning.replace(/<MI>([^<]*)<D>/g, '<em>$1</em>');
    cleanMeaning = cleanMeaning.replace(/<MI>/g, '<em>').replace(/<D>/g, '</em>');
    cleanMeaning = cleanMeaning.replace(/<em><\/em>/g, '');
    return `<em>${term}</em> — ${cleanMeaning}`;
  });

  result = processInlineTags(result, true);
  result = result.replace(/\s+/g, ' ').trim();
  result = result.replace(/ – /g, ' — ');
  result = result.replace(/ - /g, ' — ');
  return result;
}

/**
 * Process transliteration
 */
function processTransliteration(text: string): string {
  let result = processLineContinuations(text);
  result = result.replace(/<_R><_>/g, '\n');
  result = result.replace(/<R>/g, '\n');
  result = result.replace(/<_>/g, ' ');
  result = processInlineTags(result);
  const lines = result.split('\n').map(l => l.trim()).filter(l => l);
  return lines.join('\n');
}

/**
 * Process prose text
 */
function processProse(text: string, keepHtml: boolean = false): string {
  let result = processLineContinuations(text);
  result = result.split('\n').join(' ');
  result = processInlineTags(result, keepHtml);
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

// Skip these tags
const SKIP_TAGS = new Set(['rh-verso', 'rh-recto', 'logo', 'text-rh', 'special', 'h3-trans', 'h3-synonyms']);

interface Verse {
  verse_number: string;
  transliteration_uk?: string;
  synonyms_uk?: string;
  translation_uk?: string;
  commentary_uk?: string;
}

interface ChapterWithVerses {
  chapter_number: number;
  chapter_title_uk: string;
  verses: Verse[];
}

interface ChapterWithContent {
  chapter_number: number;
  chapter_title_uk: string;
  content_uk: string;
}

/**
 * Parse SOVA (verse-based book) - same structure as BG
 * Handles files where verses, translations, and synonyms are grouped separately
 */
function parseSOVA(filePath: string, chapterNum: number): ChapterWithVerses | null {
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${filePath}`);
    return null;
  }

  const buffer = fs.readFileSync(filePath);
  let raw: string;

  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    raw = buffer.toString('utf16le');
  } else {
    raw = buffer.toString('utf-8');
  }

  let content = decodePUA(raw);
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  const lines = content.split('\n');

  let chapterTitle = '';
  // Use a map to store verses by number (since translations/synonyms come later)
  const versesMap: Map<number, Verse> = new Map();
  let currentVerseNum = 0;
  let currentTag: string | null = null;
  let currentContent: string[] = [];

  function flushBlock() {
    if (!currentTag || SKIP_TAGS.has(currentTag)) return;
    const text = currentContent.join(' ').trim();

    // Title tags: h1, h1+h2, h1+source, h1+by
    if (currentTag.startsWith('h1')) {
      let titleText = text.replace(/<_?R>/g, ' ');
      titleText = titleText.split('\n').map(l => l.trim()).filter(l => l).join(' ');
      titleText = titleText.replace(/\s+/g, ' ').trim();
      chapterTitle = processInlineTags(titleText);
      return;
    }

    // Skip if no text content
    if (!text) return;

    // Verse number tag: @verse-number = N
    if (currentTag === 'verse-number') {
      const num = parseInt(text, 10);
      if (!isNaN(num)) {
        currentVerseNum = num;
        // Create verse entry if it doesn't exist
        if (!versesMap.has(num)) {
          versesMap.set(num, { verse_number: String(num) });
        }
      }
      return;
    }

    // Text number tags: @text-# = N, @text-#-1-br = N, @text-#-1-sp = N, @text-#R = N
    if (currentTag.startsWith('text-')) {
      const num = parseInt(text, 10);
      if (!isNaN(num)) {
        currentVerseNum = num;
        // Create verse entry if it doesn't exist
        if (!versesMap.has(num)) {
          versesMap.set(num, { verse_number: String(num) });
        }
      }
      return;
    }

    // Skip section headers
    if (currentTag === 'h3-trans' || currentTag === 'h3-synonyms') {
      return;
    }

    // Transliteration: @h3-verse, @verse-s60, @verse-#-40, etc.
    if (currentTag === 'h3-verse' || currentTag.startsWith('verse-s') || currentTag.startsWith('verse-')) {
      // Skip if it's just a verse number like "1" or "2"
      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      if (/^\d+$/.test(cleanText)) return;

      // If no verse number set yet, auto-increment
      if (currentVerseNum === 0) {
        currentVerseNum = versesMap.size + 1;
      }

      // Create or update verse
      if (!versesMap.has(currentVerseNum)) {
        versesMap.set(currentVerseNum, { verse_number: String(currentVerseNum) });
      }
      const verse = versesMap.get(currentVerseNum)!;
      const translit = processTransliteration(text);
      verse.transliteration_uk = verse.transliteration_uk
        ? verse.transliteration_uk + '\n\n' + translit
        : translit;

      // Auto-increment for next verse if we see another @h3-verse
      currentVerseNum++;
      return;
    }

    // Translation
    if (currentTag === 'translation') {
      // Find the verse to add translation to
      let targetNum = currentVerseNum > 0 ? currentVerseNum : 1;
      // If translation comes before verse number is set, use the last verse
      if (!versesMap.has(targetNum) && versesMap.size > 0) {
        targetNum = Math.max(...versesMap.keys());
      }

      if (!versesMap.has(targetNum)) {
        versesMap.set(targetNum, { verse_number: String(targetNum) });
      }
      const verse = versesMap.get(targetNum)!;
      const trans = processProse(text, false);
      verse.translation_uk = verse.translation_uk
        ? verse.translation_uk + '\n\n' + trans
        : trans;
      return;
    }

    // Synonyms
    if (currentTag === 'eqs') {
      // Find the verse to add synonyms to
      let targetNum = currentVerseNum > 0 ? currentVerseNum : 1;
      if (!versesMap.has(targetNum) && versesMap.size > 0) {
        targetNum = Math.max(...versesMap.keys());
      }

      if (!versesMap.has(targetNum)) {
        versesMap.set(targetNum, { verse_number: String(targetNum) });
      }
      const verse = versesMap.get(targetNum)!;
      const synonyms = processSynonyms(text);
      verse.synonyms_uk = verse.synonyms_uk
        ? verse.synonyms_uk + ' ' + synonyms
        : synonyms;
      return;
    }

    // Commentary/purport
    if (['p', 'p0', 'p1', 'purp'].includes(currentTag)) {
      let targetNum = currentVerseNum > 0 ? currentVerseNum : 1;
      if (!versesMap.has(targetNum) && versesMap.size > 0) {
        targetNum = Math.max(...versesMap.keys());
      }

      if (versesMap.has(targetNum)) {
        const verse = versesMap.get(targetNum)!;
        const para = processProse(text, true);
        if (para) {
          const wrapped = `<p class="purport">${para}</p>`;
          verse.commentary_uk = verse.commentary_uk
            ? verse.commentary_uk + '\n\n' + wrapped
            : wrapped;
        }
      }
    }
  }

  for (const line of lines) {
    const tagMatch = line.match(/^@([a-z0-9_#+-]+)\s*=?\s*(.*)/i);
    if (tagMatch) {
      flushBlock();
      currentTag = tagMatch[1].toLowerCase();
      currentContent = tagMatch[2] ? [tagMatch[2]] : [];
    } else if (currentTag && !line.match(/^@/)) {
      currentContent.push(line);
    }
  }
  flushBlock();

  // Convert map to sorted array
  const verses = Array.from(versesMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([_, verse]) => verse);

  return {
    chapter_number: chapterNum,
    chapter_title_uk: chapterTitle,
    verses,
  };
}

/**
 * Process a verse for embedding in prose (blockquote style)
 */
function processEmbeddedVerse(text: string): string {
  let result = processLineContinuations(text);
  result = result.replace(/<_R><_>/g, '\n');
  result = result.replace(/<R>/g, '\n');
  result = result.replace(/<_>/g, ' ');
  result = result.replace(/<~>/g, '');
  // Handle italic tags
  result = result.replace(/<MI>([^<]*)<\/?[DM]>/g, '<em>$1</em>');
  result = result.replace(/<MI>/g, '<em>');
  result = result.replace(/<\/?[DM]>/g, '</em>');
  result = result.replace(/<em><\/em>/g, '');
  result = decodePUA(result);
  result = result.replace(/<[A-Z0-9.]+>/g, '');
  const lines = result.split('\n').map(l => l.trim()).filter(l => l);
  return lines.join('<br>\n');
}

/**
 * Parse prose book (BBD, LCFL)
 */
function parseProse(filePath: string, chapterNum: number): ChapterWithContent | null {
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${filePath}`);
    return null;
  }

  const buffer = fs.readFileSync(filePath);
  let raw: string;

  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    raw = buffer.toString('utf16le');
  } else {
    raw = buffer.toString('utf-8');
  }

  let content = decodePUA(raw);
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  const lines = content.split('\n');

  // Extract chapter title
  let chapterTitle = '';

  // Content blocks
  const blocks: string[] = [];
  let currentTag: string | null = null;
  let currentContent: string[] = [];

  // Tags that contain prose content
  const proseTags = new Set([
    'purport', 'purp para', 'purp',
    'p-speech', 'p-intro', 'p', 'p0', 'p1', 'p2',
    'li-p', 'li-number', 'li-number-0'
  ]);

  // Tags for embedded verses
  const verseTags = new Set(['verse nosp', 'verse in purp', 'verse']);

  // Tags for headings within content
  const headingTags = new Set(['h4', 'h3', 'h2']);

  // Skip these tags
  const skipTags = new Set(['rh-verso', 'rh-recto', 'chapter', 'book title', 'chapter head', 'chapter title']);

  function flushBlock() {
    if (!currentTag) return;
    const text = currentContent.join('\n').trim();
    if (!text) return;

    const tagLower = currentTag.toLowerCase();

    // Title tags
    if (tagLower === 'h1' || tagLower === 'chapter head' || tagLower === 'chapter title') {
      if (!chapterTitle) {
        // Replace <R> tags with space, then join multi-line titles
        let titleText = text.replace(/<_?R>/g, ' ');
        titleText = titleText.split('\n').map(l => l.trim()).filter(l => l).join(' ');
        titleText = titleText.replace(/\s+/g, ' ').trim();
        chapterTitle = processInlineTags(titleText);
      }
      return;
    }

    // Skip tags
    if (skipTags.has(tagLower)) return;

    // Embedded verse (blockquote)
    if (verseTags.has(tagLower)) {
      const verseHtml = processEmbeddedVerse(text);
      if (verseHtml) {
        blocks.push(`<blockquote class="verse">${verseHtml}</blockquote>`);
      }
      return;
    }

    // Heading within content
    if (headingTags.has(tagLower)) {
      const headingText = processProse(text, true);
      if (headingText) {
        blocks.push(`<h4>${headingText}</h4>`);
      }
      return;
    }

    // List items
    if (tagLower === 'li-number' || tagLower === 'li-number-0') {
      // Just a dash or number, skip - will be combined with li-p
      return;
    }

    // Prose content
    if (proseTags.has(tagLower) || tagLower.startsWith('purp') || tagLower.startsWith('p')) {
      const para = processProse(text, true);
      if (para) {
        blocks.push(`<p>${para}</p>`);
      }
      return;
    }
  }

  for (const line of lines) {
    // Match tag lines: @tag = content or @tag content
    const tagMatch = line.match(/^@([a-z0-9_ -]+)\s*=?\s*(.*)/i);
    if (tagMatch) {
      flushBlock();
      currentTag = tagMatch[1].trim();
      currentContent = tagMatch[2] ? [tagMatch[2]] : [];
    } else if (currentTag && !line.match(/^@/)) {
      currentContent.push(line);
    }
  }
  flushBlock();

  const htmlContent = blocks.join('\n\n');

  return {
    chapter_number: chapterNum,
    chapter_title_uk: chapterTitle,
    content_uk: htmlContent,
  };
}

/**
 * Main function
 */
function main() {
  const bookCode = process.argv[2]?.toLowerCase();

  if (!bookCode || !BOOKS[bookCode]) {
    console.error('Usage: npx ts-node tools/parse-bbt-prose.ts [book_code]');
    console.error('Available books:', Object.keys(BOOKS).join(', '));
    process.exit(1);
  }

  const book = BOOKS[bookCode];
  const docsDir = path.join(__dirname, '..', 'docs', 'bbt', book.folder);
  const outputPath = path.join(__dirname, '..', 'src', 'data', `${book.slug}-parsed.json`);

  console.log('='.repeat(60));
  console.log(`Parsing: ${book.title_uk}`);
  console.log(`Folder: ${docsDir}`);
  console.log(`Type: ${book.hasVerses ? 'verse-based (like BG)' : 'prose'}`);
  console.log('='.repeat(60));

  // For SOVA, dynamically discover all song files
  let chapterFiles = book.chapterFiles;
  if (bookCode === 'sova') {
    const allFiles = fs.readdirSync(docsDir);
    chapterFiles = allFiles
      .filter(f => f.match(/^UKSO\d{4}/i))
      .sort()
      .map(f => f.replace(/^UKSO/i, '').replace(/\.H\d+$/i, ''));
    // Remove duplicates
    chapterFiles = [...new Set(chapterFiles)];
  }

  const chapters: (ChapterWithVerses | ChapterWithContent)[] = [];

  for (let i = 0; i < chapterFiles.length; i++) {
    const chapterFile = chapterFiles[i];
    const pattern = `${book.chapterPrefix}${chapterFile}`;

    const files = fs.readdirSync(docsDir);
    const matchingFile = files.find(f => f.toUpperCase().startsWith(pattern.toUpperCase()));

    if (!matchingFile) {
      console.log(`Chapter ${i + 1}: File not found for pattern ${pattern}`);
      continue;
    }

    const filePath = path.join(docsDir, matchingFile);
    console.log(`Chapter ${i + 1}: ${matchingFile}`);

    const chapter = book.hasVerses
      ? parseSOVA(filePath, i + 1)
      : parseProse(filePath, i + 1);

    if (chapter) {
      chapters.push(chapter);
      console.log(`  Title: ${chapter.chapter_title_uk}`);
      if ('verses' in chapter) {
        console.log(`  Verses: ${chapter.verses.length}`);
      } else {
        console.log(`  Content: ${chapter.content_uk.length} chars`);
      }
    }
  }

  const output = {
    book_code: book.slug,
    title_uk: book.title_uk,
    title_en: book.title_en,
    chapters,
    generated_at: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`Done! ${chapters.length} chapters parsed`);
  console.log(`Output: ${outputPath}`);
  console.log('='.repeat(60));
}

main();
