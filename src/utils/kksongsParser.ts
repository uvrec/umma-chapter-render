// Parser for kksongs.org
// Multi-page structure: each song has 3 separate HTML files
// 1. Main: transliteration + translation
// 2. Bengali: /unicode/b/songname_beng.html
// 3. Commentary: /authors/purports/songname_acbsp.html

import { BhaktivinodaSong, BhaktivinodaVerse, determineCantoFromUrl } from './bhaktivinodaParser';

/**
 * Derive Bengali and Commentary URLs from main song URL
 *
 * Example:
 * Main: kksongs.org/songs/b/bhuliyatomare.html
 * Bengali: kksongs.org/unicode/b/bhuliyatomar_beng.html
 * Commentary: kksongs.org/authors/purports/bhuliyatomare_acbsp.html
 */
export function deriveKKSongUrls(mainUrl: string): {
  mainUrl: string;
  bengaliUrl: string;
  commentaryUrl: string;
} {
  try {
    const url = new URL(mainUrl);
    const pathname = url.pathname; // e.g., /songs/b/bhuliyatomare.html
    const filename = pathname.split('/').pop()?.replace('.html', '') || '';

    // Bengali URL pattern: /unicode/b/songname_beng.html
    const bengaliUrl = `${url.origin}/unicode/b/${filename}_beng.html`;

    // Commentary URL pattern: /authors/purports/songname_acbsp.html
    const commentaryUrl = `${url.origin}/authors/purports/${filename}_acbsp.html`;

    return { mainUrl, bengaliUrl, commentaryUrl };
  } catch (error) {
    console.error('Error deriving kksongs URLs:', error);
    return { mainUrl, bengaliUrl: '', commentaryUrl: '' };
  }
}

/**
 * Extract song URLs from root page (saranagati.html)
 * Returns array of main song URLs
 */
export function extractKKSongUrls(html: string, baseUrl: string): string[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const urls: string[] = [];

    // Find all links that point to songs
    const links = doc.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Match patterns like /songs/b/songname.html
      if (href.match(/\/songs\/[a-z]\/[^/]+\.html/i)) {
        let fullUrl = href;
        if (href.startsWith('/')) {
          const base = new URL(baseUrl);
          fullUrl = base.origin + href;
        } else if (!href.startsWith('http')) {
          fullUrl = baseUrl.replace(/\/$/, '') + '/' + href;
        }
        urls.push(fullUrl);
      }
    });

    // Remove duplicates
    return Array.from(new Set(urls));
  } catch (error) {
    console.error('Error extracting kksongs URLs:', error);
    return [];
  }
}

/**
 * Parse main song page (transliteration + translation)
 */
export function parseKKSongMainPage(html: string): {
  verses: BhaktivinodaVerse[];
  title: string;
} {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Get title
    const titleEl = doc.querySelector('h1, h2, title');
    const title = titleEl?.textContent?.trim() || 'Untitled';

    // Get main content
    const mainContent =
      doc.querySelector('main') ||
      doc.querySelector('article') ||
      doc.querySelector('.content') ||
      doc.querySelector('pre') ||
      doc.body;

    const text = mainContent.textContent || '';

    // Parse verses
    // KKSongs format typically has numbered verses
    const verses: BhaktivinodaVerse[] = [];

    // Split by verse numbers (1), (2), etc or by line breaks
    const lines = text.split('\n').filter(l => l.trim());

    let currentVerse: Partial<BhaktivinodaVerse> = {};
    let verseNumber = 1;
    let transliterationLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check if line looks like a translation (usually in English, longer sentences)
      const isTranslation = trimmed.match(/^[A-Z].*[.!?]$/) && trimmed.split(' ').length > 5;

      if (isTranslation && transliterationLines.length > 0) {
        // Save previous verse
        verses.push({
          verse_number: verseNumber.toString(),
          transliteration_en: transliterationLines.join('\n'),
          translation_en: trimmed,
        });
        verseNumber++;
        transliterationLines = [];
      } else {
        transliterationLines.push(trimmed);
      }
    }

    // Add last verse if any
    if (transliterationLines.length > 0) {
      verses.push({
        verse_number: verseNumber.toString(),
        transliteration_en: transliterationLines.join('\n'),
        translation_en: '',
      });
    }

    return { verses, title };
  } catch (error) {
    console.error('Error parsing kksongs main page:', error);
    return { verses: [], title: 'Untitled' };
  }
}

/**
 * Parse Bengali page
 */
export function parseKKSongBengaliPage(html: string): Record<string, string> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const mainContent =
      doc.querySelector('main') ||
      doc.querySelector('article') ||
      doc.querySelector('.content') ||
      doc.querySelector('pre') ||
      doc.body;

    const text = mainContent.textContent || '';
    const lines = text.split('\n').filter(l => l.trim());

    // Map verse number to Bengali text
    const bengaliMap: Record<string, string> = {};
    let verseNumber = 1;
    const bengaliLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        // Empty line might indicate verse break
        if (bengaliLines.length > 0) {
          bengaliMap[verseNumber.toString()] = bengaliLines.join('\n');
          verseNumber++;
          bengaliLines.length = 0;
        }
        continue;
      }

      // Detect Bengali characters (Unicode range)
      const hasBengali = /[\u0980-\u09FF]/.test(trimmed);
      if (hasBengali) {
        bengaliLines.push(trimmed);
      }
    }

    // Add last verse
    if (bengaliLines.length > 0) {
      bengaliMap[verseNumber.toString()] = bengaliLines.join('\n');
    }

    return bengaliMap;
  } catch (error) {
    console.error('Error parsing kksongs Bengali page:', error);
    return {};
  }
}

/**
 * Parse commentary page (ACBSP purport)
 */
export function parseKKSongCommentaryPage(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const mainContent =
      doc.querySelector('main') ||
      doc.querySelector('article') ||
      doc.querySelector('.content') ||
      doc.querySelector('pre') ||
      doc.body;

    return mainContent.textContent?.trim() || '';
  } catch (error) {
    console.error('Error parsing kksongs commentary page:', error);
    return '';
  }
}

/**
 * Combine data from all 3 pages into a single song
 */
export function combineKKSongData(
  mainData: { verses: BhaktivinodaVerse[]; title: string },
  bengaliMap: Record<string, string>,
  commentary: string,
  songUrl: string
): BhaktivinodaSong | null {
  if (mainData.verses.length === 0) {
    return null;
  }

  // Merge Bengali text into verses
  const verses = mainData.verses.map(verse => ({
    ...verse,
    sanskrit: bengaliMap[verse.verse_number] || '', // Bengali in sanskrit field
    commentary_en: commentary, // Same commentary for all verses (can be split if needed)
  }));

  // Determine canto from URL
  const cantoInfo = determineCantoFromUrl(songUrl);

  return {
    song_number: 1, // Will be set by caller
    title_en: mainData.title,
    verses: verses,
    canto_number: cantoInfo?.number,
  };
}

/**
 * Parse a complete song from kksongs.org (requires fetching 3 pages)
 * This function should be called after fetching all 3 HTML pages
 */
export async function parseKKSongComplete(
  mainHtml: string,
  bengaliHtml: string,
  commentaryHtml: string,
  songUrl: string
): Promise<BhaktivinodaSong | null> {
  const mainData = parseKKSongMainPage(mainHtml);
  const bengaliMap = parseKKSongBengaliPage(bengaliHtml);
  const commentary = parseKKSongCommentaryPage(commentaryHtml);

  return combineKKSongData(mainData, bengaliMap, commentary, songUrl);
}
