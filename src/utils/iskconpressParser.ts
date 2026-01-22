/**
 * Parser for iskconpress books from GitHub repository
 * Source: https://github.com/iskconpress/books
 *
 * The books use DokuWiki markup format:
 * - `======` headers
 * - `//text//` italics
 * - `**text**` bold
 * - `~~Title:~~` metadata
 * - `{{description>}}` descriptions
 * - `[[books:...]]` cross-references
 */

import { convertIASTtoUkrainian } from "./textNormalizer";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/iskconpress/books/master";
const GITHUB_API_BASE = "https://api.github.com/repos/iskconpress/books/contents";

export interface IskconpressChapter {
  chapter_number: number;
  title_en: string;
  content_en: string;
  description_en?: string;
}

export interface IskconpressVerse {
  verse_number: string;
  sanskrit?: string;
  sanskrit_uk?: string; // Same Devanagari for UA field
  transliteration_en?: string;
  transliteration_uk?: string; // IAST converted to Ukrainian script
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string; // Purport - HTML formatted
}

export interface ParsedIskconpressChapter {
  chapter_number: number;
  chapter_type: "verses" | "text";
  title_en?: string;
  title_uk?: string;
  content_en?: string; // HTML content for prose/text books
  verses: IskconpressVerse[];
}

/**
 * Convert DokuWiki markup to HTML
 * Preserves formatting for Sanskrit terms (italics), bold text, etc.
 */
export function dokuwikiToHtml(content: string): string {
  if (!content) return "";

  return content
    // Remove metadata tags
    .replace(/~~[^~]+~~/g, "")
    // Remove description tags
    .replace(/\{\{description>.+?\}\}/gs, "")
    // Convert wiki headers to HTML
    .replace(/======\s*(.+?)\s*======/g, "<h1>$1</h1>")
    .replace(/=====\s*(.+?)\s*=====/g, "<h2>$1</h2>")
    .replace(/====\s*(.+?)\s*====/g, "<h3>$1</h3>")
    .replace(/===\s*(.+?)\s*===/g, "<h4>$1</h4>")
    // Convert wiki links to plain text (keep the visible text)
    .replace(/\[\[books:[^\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[books:[^\]]+\]\]/g, "")
    .replace(/\[\[synonyms:[^\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[synonyms:[^\]]+\]\]/g, "")
    // Convert wiki italics //text// to HTML <em> (for Sanskrit terms)
    .replace(/\/\/(.+?)\/\//g, "<em>$1</em>")
    // Convert wiki bold **text** to HTML <strong>
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Convert blockquotes (> lines)
    .replace(/^>\s*(.+)$/gm, "<blockquote>$1</blockquote>")
    // Remove page includes
    .replace(/\{\{page>[^}]+\}\}/g, "")
    // Convert horizontal rules
    .replace(/^----$/gm, "<hr>")
    // Convert line breaks
    .replace(/\\\\/g, "<br>")
    // Convert paragraphs (double newlines to <p> tags)
    .replace(/\n\n+/g, "</p><p>")
    // Clean up extra whitespace
    .trim();
}

/**
 * Wrap content in paragraph tags if needed
 */
export function wrapInParagraphs(content: string): string {
  if (!content) return "";
  if (content.startsWith("<h") || content.startsWith("<p")) {
    return content;
  }
  return "<p>" + content + "</p>";
}

/**
 * Fetch list of chapter files from GitHub API
 */
export async function fetchIskconpressChapterFiles(bookSlug: string): Promise<string[]> {
  const response = await fetch(`${GITHUB_API_BASE}/${bookSlug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch chapter list for ${bookSlug}: ${response.statusText}`);
  }

  const files = await response.json();

  if (!Array.isArray(files)) {
    throw new Error(`Invalid response from GitHub API for ${bookSlug}`);
  }

  return files
    .filter((f: any) => f.name.endsWith(".txt"))
    .map((f: any) => f.name)
    .sort((a: string, b: string) => {
      // Sort by chapter number
      const numA = parseInt(a.replace(/[^0-9]/g, "") || "0");
      const numB = parseInt(b.replace(/[^0-9]/g, "") || "0");
      return numA - numB;
    });
}

/**
 * Fetch raw chapter content from GitHub
 */
export async function fetchIskconpressChapterContent(
  bookSlug: string,
  filename: string,
): Promise<string> {
  const url = `${GITHUB_RAW_BASE}/${bookSlug}/${filename}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch chapter content: ${response.statusText}`);
  }

  return await response.text();
}

/**
 * Parse DokuWiki markup content into structured chapter data (for prose books)
 */
export function parseIskconpressContent(
  content: string,
  filename: string,
): IskconpressChapter | null {
  // Extract chapter number from filename (e.g., "1.txt", "0a.txt")
  const filenameMatch = filename.match(/^(\d+[a-z]?)\.txt$/);
  let chapterNum = 0;

  if (filenameMatch) {
    const num = filenameMatch[1];
    if (num.match(/^0[a-z]$/)) {
      chapterNum = 0; // Intro chapters
    } else {
      chapterNum = parseInt(num.replace(/[a-z]/g, ""));
    }
  }

  // Parse title from content
  // Format: ~~Title:Book Name Chapter Number: Chapter Title~~
  // Or header: ====== Chapter Title ======
  const metaTitleMatch = content.match(/~~Title:(.+?)~~/);
  const headerTitleMatch = content.match(/======\s*(.+?)\s*======/);

  // Prefer header title for verse-based content (Sūtra, Text, Verse patterns)
  // as it's more descriptive (e.g., "Sūtra 1" vs "NBS 1")
  let title_en: string;
  if (headerTitleMatch && /^(Sūtra|Sutra|Text|Verse|Sloka|Śloka)/i.test(headerTitleMatch[1].trim())) {
    title_en = headerTitleMatch[1].trim();
  } else if (metaTitleMatch) {
    title_en = metaTitleMatch[1].trim();
  } else if (headerTitleMatch) {
    title_en = headerTitleMatch[1].trim();
  } else {
    title_en = `Chapter ${chapterNum}`;
  }

  // Clean up title - remove book prefix like "SSR 1: ", "Chapter 1: "
  title_en = title_en
    .replace(/^[A-Z]+\s+\d+:\s*/, "") // Remove "SSR 1: " prefix
    .replace(/^Chapter\s+\d+:\s*/i, "") // Remove "Chapter 1: " prefix
    .trim();

  // Extract description if present
  const descMatch = content.match(/\{\{description>(.+?)\}\}/s);
  const description_en = descMatch ? descMatch[1].trim() : undefined;

  // Convert DokuWiki markup to HTML and wrap in paragraphs
  const content_en = wrapInParagraphs(dokuwikiToHtml(content));

  return {
    chapter_number: chapterNum,
    title_en,
    content_en,
    description_en,
  };
}

/**
 * Parse a single verse file from iskconpress (for verse-based books like SB)
 * File structure: Sanskrit, Transliteration, Synonyms, Translation, Purport
 */
export function parseIskconpressVerse(content: string, verseNumber: string): IskconpressVerse {
  // Extract sections from the content
  const sections: Record<string, string> = {};

  // Common section markers in iskconpress verse files
  const sectionPatterns = [
    { key: "sanskrit", pattern: /===== Text =====\s*([\s\S]*?)(?=====|$)/i },
    { key: "transliteration_en", pattern: /===== Transliteration =====\s*([\s\S]*?)(?=====|$)/i },
    { key: "synonyms_en", pattern: /===== Synonyms =====\s*([\s\S]*?)(?=====|$)/i },
    { key: "translation_en", pattern: /===== Translation =====\s*([\s\S]*?)(?=====|$)/i },
    { key: "commentary_en", pattern: /===== Purport =====\s*([\s\S]*?)(?=====|$)/i },
  ];

  for (const { key, pattern } of sectionPatterns) {
    const match = content.match(pattern);
    if (match) {
      sections[key] = match[1].trim();
    }
  }

  // Convert synonyms - remove wiki link markup but keep structure
  let synonyms_en = sections.synonyms_en || "";
  synonyms_en = synonyms_en
    .replace(/\[\[synonyms:[^\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[synonyms:[^\]]+\]\]/g, "")
    .replace(/---/g, " — "); // Convert --- to em dash for word definitions

  // Convert purport to HTML with formatting preserved
  const commentary_en = sections.commentary_en
    ? wrapInParagraphs(dokuwikiToHtml(sections.commentary_en))
    : undefined;

  // Convert translation - usually in bold
  let translation_en = sections.translation_en || "";
  translation_en = translation_en
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold markers, keep text
    .replace(/\/\/(.+?)\/\//g, "$1") // Remove italic markers
    .trim();

  // Convert IAST transliteration to Ukrainian script
  const transliteration_uk = sections.transliteration_en
    ? convertIASTtoUkrainian(sections.transliteration_en)
    : undefined;

  return {
    verse_number: verseNumber,
    sanskrit: sections.sanskrit,
    sanskrit_uk: sections.sanskrit, // Same Devanagari for both EN and UA
    transliteration_en: sections.transliteration_en,
    transliteration_uk,
    synonyms_en: synonyms_en || undefined,
    translation_en: translation_en || undefined,
    commentary_en,
  };
}

/**
 * Convert iskconpress chapter to standard import format
 * @param chapter - Parsed chapter content
 * @param templateId - "verses" for verse-based books (NBS, BS), "text" for prose
 * @param rawContent - Original raw content (needed for verse parsing)
 */
export function iskconpressChapterToStandard(
  chapter: IskconpressChapter,
  templateId: "verses" | "text" = "text",
  rawContent?: string,
): ParsedIskconpressChapter {
  if (templateId === "verses" && rawContent) {
    // For verse-based books (NBS, BS, etc.) - parse as single verse per chapter
    const verse = parseIskconpressVerse(rawContent, String(chapter.chapter_number));
    return {
      chapter_number: chapter.chapter_number,
      chapter_type: "verses",
      title_en: chapter.title_en,
      verses: [verse],
    };
  }

  // For prose books - use text type
  return {
    chapter_number: chapter.chapter_number,
    chapter_type: "text",
    title_en: chapter.title_en,
    content_en: chapter.content_en,
    verses: [],
  };
}

/**
 * Import all chapters from an iskconpress book
 * @param bookSlug - Book identifier
 * @param templateId - "verses" for verse-based books (NBS, BS), "text" for prose
 * @param onProgress - Progress callback
 */
export async function importIskconpressBook(
  bookSlug: string,
  templateId: "verses" | "text" = "text",
  onProgress?: (current: number, total: number, chapter: string) => void,
): Promise<ParsedIskconpressChapter[]> {
  // Fetch list of chapter files
  const files = await fetchIskconpressChapterFiles(bookSlug);

  if (files.length === 0) {
    throw new Error(`No chapter files found for book: ${bookSlug}`);
  }

  const chapters: ParsedIskconpressChapter[] = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];

    onProgress?.(i + 1, files.length, filename);

    // Fetch chapter content
    const content = await fetchIskconpressChapterContent(bookSlug, filename);

    // Parse content
    const parsed = parseIskconpressContent(content, filename);
    if (!parsed) {
      console.warn(`Failed to parse ${filename}`);
      continue;
    }

    // Convert to standard format - pass templateId and raw content for verse parsing
    const standardChapter = iskconpressChapterToStandard(parsed, templateId, content);
    chapters.push(standardChapter);

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return chapters;
}

/**
 * Import a single chapter from an iskconpress book
 * @param bookSlug - Book identifier
 * @param chapterNumber - Chapter number to import
 * @param templateId - "verses" for verse-based books (NBS, BS), "text" for prose
 */
export async function importIskconpressChapter(
  bookSlug: string,
  chapterNumber: number,
  templateId: "verses" | "text" = "text",
): Promise<ParsedIskconpressChapter | null> {
  // Fetch list of chapter files to find the right one
  const files = await fetchIskconpressChapterFiles(bookSlug);

  // Find the file matching the chapter number
  const filename = files.find((f) => {
    const match = f.match(/^(\d+)[a-z]?\.txt$/);
    return match && parseInt(match[1]) === chapterNumber;
  });

  if (!filename) {
    throw new Error(`Chapter ${chapterNumber} not found in book ${bookSlug}`);
  }

  // Fetch chapter content
  const content = await fetchIskconpressChapterContent(bookSlug, filename);

  // Parse content
  const parsed = parseIskconpressContent(content, filename);
  if (!parsed) {
    throw new Error(`Failed to parse chapter ${chapterNumber}`);
  }

  // Convert to standard format - pass templateId and raw content for verse parsing
  return iskconpressChapterToStandard(parsed, templateId, content);
}

// =============================================================================
// SRIMAD-BHAGAVATAM (SB) - Canto-based import
// Structure: sb/{canto}/{chapter}/{verse}.txt
// =============================================================================

/**
 * Fetch list of chapters in a SB canto
 */
export async function fetchSBCantoChapters(canto: number): Promise<string[]> {
  const response = await fetch(`${GITHUB_API_BASE}/sb/${canto}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch SB canto ${canto} chapters`);
  }

  const data = await response.json();
  // Filter only directories (chapters), not .txt files
  return data
    .filter((item: any) => item.type === "dir")
    .map((item: any) => item.name)
    .sort((a: string, b: string) => parseInt(a) - parseInt(b));
}

/**
 * Fetch list of verse files in a SB chapter
 */
export async function fetchSBChapterVerses(canto: number, chapter: number): Promise<string[]> {
  const response = await fetch(`${GITHUB_API_BASE}/sb/${canto}/${chapter}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch SB ${canto}.${chapter} verses`);
  }

  const data = await response.json();
  // Filter only .txt files (verses)
  return data
    .filter((item: any) => item.type === "file" && item.name.endsWith(".txt"))
    .map((item: any) => item.name)
    .sort((a: string, b: string) => {
      // Sort by verse number, handling compound verses like "1-2.txt"
      const numA = parseInt(a.split("-")[0]);
      const numB = parseInt(b.split("-")[0]);
      return numA - numB;
    });
}

/**
 * Fetch verse content from SB
 */
export async function fetchSBVerseContent(canto: number, chapter: number, verseFile: string): Promise<string> {
  const url = `${GITHUB_RAW_BASE}/sb/${canto}/${chapter}/${verseFile}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch SB ${canto}.${chapter}.${verseFile}`);
  }
  return response.text();
}

/**
 * Import a single SB chapter (all verses)
 * Returns a ParsedIskconpressChapter with all verses
 */
export async function importSBChapter(
  canto: number,
  chapter: number,
  onProgress?: (current: number, total: number, verse: string) => void,
): Promise<ParsedIskconpressChapter> {
  // Fetch list of verse files
  const verseFiles = await fetchSBChapterVerses(canto, chapter);

  if (verseFiles.length === 0) {
    throw new Error(`No verses found in SB ${canto}.${chapter}`);
  }

  const verses: IskconpressVerse[] = [];

  for (let i = 0; i < verseFiles.length; i++) {
    const verseFile = verseFiles[i];
    // Extract verse number from filename (e.g., "1.txt" -> "1", "1-2.txt" -> "1-2")
    const verseNumber = verseFile.replace(".txt", "");

    onProgress?.(i + 1, verseFiles.length, `${canto}.${chapter}.${verseNumber}`);

    // Fetch verse content
    const content = await fetchSBVerseContent(canto, chapter, verseFile);

    // Parse verse
    const verse = parseIskconpressVerse(content, verseNumber);
    verses.push(verse);

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // Get chapter title from first verse file or use default
  let title_en = `Chapter ${chapter}`;
  if (verseFiles.length > 0) {
    const firstContent = await fetchSBVerseContent(canto, chapter, verseFiles[0]);
    // Try to extract chapter title from description tag
    const descMatch = firstContent.match(/\{\{description>(.+?)\}\}/s);
    if (descMatch) {
      // Use first sentence as title hint
      const desc = descMatch[1].trim();
      if (desc.length < 100) {
        title_en = desc;
      }
    }
  }

  return {
    chapter_number: chapter,
    chapter_type: "verses",
    title_en,
    verses,
  };
}
