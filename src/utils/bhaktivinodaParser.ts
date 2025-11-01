// Parser for bhaktivinodainstitute.org
// Extracts songs/poems by Bhaktivinoda Thakur and other Acharyas
// Currently supports: transliteration + English translation
// Future: add Bengali/Sanskrit, word-for-word, commentary

export interface BhaktivinodaVerse {
  verse_number: string;
  sanskrit?: string; // To be added manually or from other sources
  transliteration_en?: string;
  transliteration_ua?: string;
  synonyms_en?: string; // Word-for-word (to be added manually)
  synonyms_ua?: string;
  translation_en?: string;
  translation_ua?: string;
  commentary_en?: string; // Purport/commentary (to be added manually)
  commentary_ua?: string;
}

export interface BhaktivinodaSong {
  song_number: number;
  title_en?: string;
  title_ua?: string;
  verses: BhaktivinodaVerse[];
}

/**
 * Parse a single bhaktivinoda institute page (e.g., Śaraṇāgati)
 * Extracts transliteration and English translation
 */
export function parseBhaktivinodaPage(html: string, url: string): BhaktivinodaSong[] {
  const songs: BhaktivinodaSong[] = [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Strategy 1: Look for song/verse containers
    // Common patterns: .song, .verse, .stanza, article, section

    // Try to find song containers
    const songContainers = doc.querySelectorAll('.song, .verse-group, article.post, section');

    if (songContainers.length === 0) {
      console.warn('No song containers found, trying alternative parsing');
      // Fallback: parse entire content
      return parseBhaktivinodaFallback(doc);
    }

    songContainers.forEach((container, index) => {
      const song: BhaktivinodaSong = {
        song_number: index + 1,
        verses: []
      };

      // Extract title
      const titleEl = container.querySelector('h1, h2, h3, .title, .song-title');
      if (titleEl) {
        song.title_en = titleEl.textContent?.trim();
      }

      // Extract verses
      // Look for italic text (usually transliteration) and regular text (translation)
      const paragraphs = container.querySelectorAll('p, .verse, .stanza');

      let currentVerse: BhaktivinodaVerse | null = null;
      let verseNumber = 1;

      paragraphs.forEach(p => {
        const text = p.textContent?.trim() || '';
        if (!text) return;

        // Check if this is transliteration (usually in italics)
        const isItalic = p.querySelector('em, i') !== null ||
                        p.classList.contains('transliteration') ||
                        /^[a-z\s\'-]+$/i.test(text); // Latin characters only

        if (isItalic) {
          // New verse starts
          if (currentVerse) {
            song.verses.push(currentVerse);
          }
          currentVerse = {
            verse_number: verseNumber.toString(),
            transliteration_en: text,
          };
          verseNumber++;
        } else if (currentVerse) {
          // This is probably the translation
          currentVerse.translation_en = text;
        }
      });

      // Add last verse
      if (currentVerse) {
        song.verses.push(currentVerse);
      }

      if (song.verses.length > 0) {
        songs.push(song);
      }
    });

  } catch (error) {
    console.error('Error parsing bhaktivinoda page:', error);
  }

  return songs;
}

/**
 * Fallback parser: extract all text and try to identify verses
 */
function parseBhaktivinodaFallback(doc: Document): BhaktivinodaSong[] {
  const song: BhaktivinodaSong = {
    song_number: 1,
    verses: []
  };

  // Get main content
  const contentEl = doc.querySelector('main, article, .content, .entry-content, #content');
  if (!contentEl) {
    console.warn('No content element found');
    return [];
  }

  // Extract all paragraphs
  const paragraphs = Array.from(contentEl.querySelectorAll('p'));

  let verseNumber = 1;
  let currentVerse: BhaktivinodaVerse | null = null;

  paragraphs.forEach(p => {
    const text = p.textContent?.trim() || '';
    if (!text || text.length < 10) return;

    // Heuristic: italic = transliteration, regular = translation
    const hasItalic = p.querySelector('em, i') !== null;

    if (hasItalic || /^[a-z\s\'-]+$/i.test(text.substring(0, 50))) {
      // Likely transliteration
      if (currentVerse) {
        song.verses.push(currentVerse);
      }
      currentVerse = {
        verse_number: verseNumber.toString(),
        transliteration_en: text,
      };
      verseNumber++;
    } else if (currentVerse) {
      // Likely translation
      currentVerse.translation_en = text;
    }
  });

  if (currentVerse) {
    song.verses.push(currentVerse);
  }

  return song.verses.length > 0 ? [song] : [];
}

/**
 * Get song/chapter title from page
 */
export function getBhaktivinodaTitle(html: string): { title_en: string; title_ua?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Try to find title
    const titleEl = doc.querySelector('h1.entry-title, h1, .page-title, title');
    const title_en = titleEl?.textContent?.trim() || 'Untitled';

    return { title_en };
  } catch {
    return { title_en: 'Untitled' };
  }
}

/**
 * Convert BhaktivinodaSong to database format
 */
export function bhaktivinodaSongToChapter(song: BhaktivinodaSong, chapterNumber: number) {
  return {
    chapter_number: chapterNumber,
    title_en: song.title_en || `Song ${song.song_number}`,
    title_ua: song.title_ua || `Пісня ${song.song_number}`,
    chapter_type: 'verses' as const,
    verses: song.verses.map(v => ({
      verse_number: v.verse_number,
      sanskrit: v.sanskrit || '',
      transliteration_en: v.transliteration_en || '',
      transliteration_ua: v.transliteration_ua || '',
      synonyms_en: v.synonyms_en || '',
      synonyms_ua: v.synonyms_ua || '',
      translation_en: v.translation_en || '',
      translation_ua: v.translation_ua || '',
      commentary_en: v.commentary_en || '',
      commentary_ua: v.commentary_ua || '',
    }))
  };
}
