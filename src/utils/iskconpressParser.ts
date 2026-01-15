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
  transliteration_en?: string;
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string; // Purport - HTML formatted
}

export interface ParsedIskconpressChapter {
  chapter_number: number;
  chapter_type: "verses" | "text";
  title_en?: string;
  title_ua?: string;
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
  const titleMatch =
    content.match(/~~Title:(.+?)~~/) || content.match(/======\s*(.+?)\s*======/);
  let title_en = titleMatch ? titleMatch[1].trim() : `Chapter ${chapterNum}`;

  // Clean up title
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

  return {
    verse_number: verseNumber,
    sanskrit: sections.sanskrit,
    transliteration_en: sections.transliteration_en,
    synonyms_en: synonyms_en || undefined,
    translation_en: translation_en || undefined,
    commentary_en,
  };
}

/**
 * Convert iskconpress chapter to standard import format
 * For prose books, we use content_en field (HTML) instead of verses
 */
export function iskconpressChapterToStandard(chapter: IskconpressChapter): ParsedIskconpressChapter {
  return {
    chapter_number: chapter.chapter_number,
    chapter_type: "text", // Prose books use text type, not verses
    title_en: chapter.title_en,
    // For prose books - store HTML content directly
    content_en: chapter.content_en,
    // Empty verses array - prose doesn't have verses
    verses: [],
  };
}

/**
 * Import all chapters from an iskconpress book
 */
export async function importIskconpressBook(
  bookSlug: string,
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

    // Convert to standard format
    const standardChapter = iskconpressChapterToStandard(parsed);
    chapters.push(standardChapter);

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return chapters;
}

/**
 * Import a single chapter from an iskconpress book
 */
export async function importIskconpressChapter(
  bookSlug: string,
  chapterNumber: number,
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

  // Convert to standard format
  return iskconpressChapterToStandard(parsed);
}
