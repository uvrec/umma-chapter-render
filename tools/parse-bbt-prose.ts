/**
 * Parser for BBT prose books (Beyond Birth and Death, Life Comes From Life, etc.)
 *
 * Usage: npx ts-node tools/parse-bbt-prose.ts [book_code]
 * Example: npx ts-node tools/parse-bbt-prose.ts bbad
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
}> = {
  bbd: {
    folder: 'BBAD',
    title_uk: 'По той бік народження і смерті',
    title_en: 'Beyond Birth and Death',
    slug: 'bbd',
    chapterPrefix: 'UKBB',
    chapterFiles: ['01xt', '02xt', '03XT', '04XT', '05XT'],
  },
  lcfl: {
    folder: 'LCFL',
    title_uk: 'Життя походить із життя',
    title_en: 'Life Comes From Life',
    slug: 'lcfl',
    chapterPrefix: 'UKLC',
    chapterFiles: Array.from({ length: 16 }, (_, i) => String(i + 1).padStart(2, '0') + 'XT'),
  },
  sova: {
    folder: 'sova',
    title_uk: 'Пісні вайшнавських ачарʼїв',
    title_en: 'Songs of the Vaiṣṇava Ācāryas',
    slug: 'sova',
    chapterPrefix: 'UKSO',
    // Dynamic - will be populated at runtime
    chapterFiles: [],
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

/**
 * Decode PUA characters to Ukrainian/IAST
 */
function decodePUA(text: string): string {
  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    result += PUA_MAP[code] || char;
  }
  return result;
}

/**
 * Clean and format text
 */
function cleanText(text: string): string {
  return text
    // Remove soft hyphens and line continuation
    .replace(/<->\s*\n\s*/g, '')
    .replace(/<->/g, '')
    // Handle line breaks
    .replace(/<R>\s*/g, '\n')
    .replace(/<N>/g, '')
    .replace(/<S>/g, ' ')
    .replace(/<&>\s*\n\s*/g, '')
    // Handle formatting tags
    .replace(/<MI>/g, '<em>')
    .replace(/<M>/g, '</em>')
    .replace(/<D>/g, '</em>')
    .replace(/<B>/g, '<strong>')
    .replace(/<\/B>/g, '</strong>')
    // Remove other tags
    .replace(/<[A-Z0-9.]+>/g, '')
    .replace(/<~>/g, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

interface Chapter {
  chapter_number: number;
  chapter_title_uk: string;
  content_uk: string;
  verses?: Array<{
    sanskrit?: string;
    translation?: string;
  }>;
}

/**
 * Parse a chapter file
 */
function parseChapter(filePath: string, chapterNum: number): Chapter | null {
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${filePath}`);
    return null;
  }

  // Read file - detect encoding (UTF-16 LE or UTF-8)
  const buffer = fs.readFileSync(filePath);
  let raw: string;

  // Check for UTF-16 LE BOM (0xFF 0xFE)
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    raw = buffer.toString('utf16le');
  } else {
    raw = buffer.toString('utf-8');
  }

  const content = decodePUA(raw);

  // Extract chapter title - try different formats
  let chapterTitle = '';
  const titlePatterns = [
    /@chapter\s*(?:head|title)\s*=\s*([^\n@]+)/i,
    /@h1\s*=\s*([^\n@]+)/i,
  ];
  for (const pattern of titlePatterns) {
    const match = content.match(pattern);
    if (match) {
      chapterTitle = cleanText(match[1]);
      break;
    }
  }

  // Extract all content paragraphs
  const paragraphs: string[] = [];
  const verses: Array<{ sanskrit?: string; translation?: string }> = [];

  // Match different content types
  const lines = content.split('\n');
  let currentPara = '';

  // Content tag patterns (for different book formats)
  const contentTags = [
    /^@purp/i,
    /^@p-speech/i,
    /^@p-intro/i,
    /^@p\d*\s*=/i,
    /^@h4\s*=/i,
    /^@translation\s*=/i,
    /^@eqs\s*=/i,
    /^@text-/i,
  ];

  for (const line of lines) {
    // Skip metadata/header lines
    if (line.match(/^@(book|chapter)\s*(title|head|=)/i)) continue;
    if (line.match(/^@chapter\s*=\s*\d+/i)) continue;
    if (line.match(/^@h1\s*=/i)) continue;
    if (line.match(/^@h2\s*=/i)) continue;
    if (line.match(/^@rh-/i)) continue;

    // Sanskrit verse (various formats)
    if (line.match(/^@verse/i) || line.match(/^@h3-verse\s*=/i)) {
      if (currentPara) {
        paragraphs.push(cleanText(currentPara));
        currentPara = '';
      }
      const verseText = line.replace(/^@(verse[^=]*|h3-verse)\s*=\s*/i, '');
      verses.push({ sanskrit: cleanText(verseText) });
      continue;
    }

    // Content paragraph (various formats)
    let isContentTag = false;
    for (const tagPattern of contentTags) {
      if (line.match(tagPattern)) {
        if (currentPara) {
          paragraphs.push(cleanText(currentPara));
        }
        currentPara = line.replace(/^@[a-z0-9-]+\s*=\s*/i, '');
        isContentTag = true;
        break;
      }
    }
    if (isContentTag) continue;

    // Continue current paragraph (non-tag lines)
    if (currentPara && !line.match(/^@/)) {
      currentPara += ' ' + line;
    }
  }

  if (currentPara) {
    paragraphs.push(cleanText(currentPara));
  }

  // Build HTML content
  const htmlContent = paragraphs
    .filter(p => p.trim())
    .map(p => `<p>${p}</p>`)
    .join('\n\n');

  return {
    chapter_number: chapterNum,
    chapter_title_uk: chapterTitle,
    content_uk: htmlContent,
    verses: verses.length > 0 ? verses : undefined,
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
  console.log('='.repeat(60));

  // For SOVA, dynamically discover all song files
  let chapterFiles = book.chapterFiles;
  if (bookCode === 'sova') {
    const allFiles = fs.readdirSync(docsDir);
    chapterFiles = allFiles
      .filter(f => f.match(/^UKSO\d{4}/i))
      .sort()
      .map(f => f.replace(/^UKSO/i, '').replace(/\.H\d+$/i, ''));
  }

  const chapters: Chapter[] = [];

  for (let i = 0; i < chapterFiles.length; i++) {
    const chapterFile = chapterFiles[i];
    const pattern = `${book.chapterPrefix}${chapterFile}`;

    // Find matching file (case-insensitive)
    const files = fs.readdirSync(docsDir);
    const matchingFile = files.find(f => f.toUpperCase().startsWith(pattern.toUpperCase()));

    if (!matchingFile) {
      console.log(`Chapter ${i + 1}: File not found for pattern ${pattern}`);
      continue;
    }

    const filePath = path.join(docsDir, matchingFile);
    console.log(`Chapter ${i + 1}: ${matchingFile}`);

    const chapter = parseChapter(filePath, i + 1);
    if (chapter) {
      chapters.push(chapter);
      console.log(`  Title: ${chapter.chapter_title_uk}`);
      console.log(`  Content: ${chapter.content_uk.length} chars`);
    }
  }

  // Output
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
