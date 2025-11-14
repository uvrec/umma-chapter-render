// Parser for wisdomlib.org - Chaitanya Bhagavata
// Structure: Book -> Khaṇḍa (Adi/Madhya/Antya) -> Chapters -> Verses
// Each verse has Bengali, transliteration, translation, synonyms, and Gaudiya-bhāṣya commentary

import { BhaktivinodaSong, BhaktivinodaVerse } from './bhaktivinodaParser';

export interface WisdomlibVerse {
  verse_number: string;
  sanskrit?: string; // Bengali text
  transliteration_en?: string;
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string; // Gaudiya-bhāṣya
}

export interface WisdomlibChapter {
  chapter_number: number;
  title_en?: string;
  title_ua?: string;
  verses: WisdomlibVerse[];
  khanda: string; // adi, madhya, antya
  intro_en?: string;
}

/**
 * Extract chapter URLs from a khaṇḍa page (e.g., Ādi-khaṇḍa index)
 * Returns array of chapter URLs
 */
export function extractWisdomlibChapterUrls(html: string, baseUrl: string): Array<{ url: string; title: string; chapterNumber: number }> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const chapters: Array<{ url: string; title: string; chapterNumber: number }> = [];

    // Find all chapter links - wisdomlib uses specific patterns
    // Look for links in the chapter list (usually in a specific section)
    const links = doc.querySelectorAll('a[href*="/d/doc"]');

    links.forEach((link, index) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const text = link.textContent?.trim() || '';

      // Skip if this is not a chapter link (e.g., it's an intro or commentary)
      if (text.toLowerCase().includes('introduction') ||
          text.toLowerCase().includes('preface') ||
          text.toLowerCase().includes('index')) {
        return;
      }

      // Extract chapter number from text (e.g., "Chapter 1", "Adhyāya 1")
      const chapterMatch = text.match(/(?:chapter|adhyāya)\s+(\d+)/i);
      const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : index + 1;

      let fullUrl = href;
      if (href.startsWith('/')) {
        const base = new URL(baseUrl);
        fullUrl = base.origin + href;
      } else if (!href.startsWith('http')) {
        fullUrl = baseUrl.replace(/\/$/, '') + '/' + href;
      }

      chapters.push({
        url: fullUrl,
        title: text,
        chapterNumber
      });
    });

    return chapters;
  } catch (error) {
    console.error('Error extracting wisdomlib chapter URLs:', error);
    return [];
  }
}

/**
 * Parse a single verse page from wisdomlib.org
 * wisdomlib structure typically has:
 * - Bengali text (Devanagari/Bengali script)
 * - Transliteration (Roman script)
 * - Synonyms (word-for-word)
 * - Translation (English)
 * - Gaudiya-bhāṣya commentary
 */
export function parseWisdomlibVersePage(html: string, verseUrl: string): WisdomlibVerse | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract verse number from URL or page
    const verseMatch = verseUrl.match(/verse[_-]?(\d+(?:-\d+)?)/i) ||
                       verseUrl.match(/(\d+(?:-\d+)?)\.html?$/);
    const verseNumber = verseMatch ? verseMatch[1] : '1';

    const verse: WisdomlibVerse = {
      verse_number: verseNumber
    };

    // Strategy: Look for specific sections marked by headers or classes
    // Bengali/Sanskrit text - usually in a specific div or with a class
    const bengaliEl = doc.querySelector('.verse-text, .sanskrit, .bengali, .devanagari') ||
                     doc.querySelector('[lang="sa"], [lang="bn"]');
    if (bengaliEl) {
      verse.sanskrit = bengaliEl.textContent?.trim() || '';
    }

    // Transliteration - usually marked
    const translitEl = doc.querySelector('.transliteration, .roman') ||
                      Array.from(doc.querySelectorAll('p, div')).find(el =>
                        el.textContent?.match(/^[a-z\-ā ī ū ṛ ṝ ḷ ṅ ñ ṭ ḍ ṇ ś ṣ]+$/i)
                      );
    if (translitEl) {
      verse.transliteration_en = translitEl.textContent?.trim() || '';
    }

    // Synonyms (word-for-word)
    const synonymsEl = doc.querySelector('.synonyms, .word-for-word') ||
                      Array.from(doc.querySelectorAll('p, div')).find(el =>
                        el.textContent?.includes('—') && el.textContent?.includes(';')
                      );
    if (synonymsEl) {
      verse.synonyms_en = synonymsEl.textContent?.trim() || '';
    }

    // Translation
    const translationEl = doc.querySelector('.translation') ||
                         Array.from(doc.querySelectorAll('p')).find(el => {
                           const text = el.textContent || '';
                           return text.length > 50 && text.match(/^[A-Z]/) && !text.includes('—');
                         });
    if (translationEl) {
      verse.translation_en = translationEl.textContent?.trim() || '';
    }

    // Commentary (Gaudiya-bhāṣya)
    const commentaryEl = doc.querySelector('.commentary, .purport, .gaudiya-bhasya');
    if (commentaryEl) {
      verse.commentary_en = commentaryEl.textContent?.trim() || '';
    } else {
      // Try to find commentary in paragraphs after the translation
      const paragraphs = Array.from(doc.querySelectorAll('p'));
      const commentaryParagraphs = paragraphs.slice(
        paragraphs.findIndex(p => p === translationEl) + 1
      );
      if (commentaryParagraphs.length > 0) {
        verse.commentary_en = commentaryParagraphs
          .map(p => p.textContent?.trim())
          .filter(Boolean)
          .join('\n\n');
      }
    }

    // Return null if no meaningful content
    if (!verse.sanskrit && !verse.transliteration_en && !verse.translation_en) {
      return null;
    }

    return verse;
  } catch (error) {
    console.error('Error parsing wisdomlib verse:', error);
    return null;
  }
}

/**
 * Parse a chapter page that contains multiple verses
 */
export function parseWisdomlibChapterPage(html: string, chapterUrl: string, khanda: string): WisdomlibChapter | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract chapter number
    const chapterMatch = chapterUrl.match(/chapter[_-]?(\d+)/i) ||
                        chapterUrl.match(/adhyaya[_-]?(\d+)/i);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 1;

    // Extract title
    const titleEl = doc.querySelector('h1, h2, .chapter-title');
    const title = titleEl?.textContent?.trim() || `Chapter ${chapterNumber}`;

    // Extract verses
    const verses: WisdomlibVerse[] = [];

    // Find verse sections - wisdomlib usually has each verse in a separate container
    const verseSections = doc.querySelectorAll('.verse-container, .verse, article');

    if (verseSections.length > 0) {
      verseSections.forEach((section, index) => {
        const verseHtml = section.outerHTML;
        const verse = parseWisdomlibVersePage(verseHtml, `${chapterUrl}#verse-${index + 1}`);
        if (verse) {
          verse.verse_number = (index + 1).toString();
          verses.push(verse);
        }
      });
    } else {
      // Fallback: try to parse the whole page as one section
      const verse = parseWisdomlibVersePage(html, chapterUrl);
      if (verse) {
        verses.push(verse);
      }
    }

    return {
      chapter_number: chapterNumber,
      title_en: title,
      verses,
      khanda
    };
  } catch (error) {
    console.error('Error parsing wisdomlib chapter:', error);
    return null;
  }
}

/**
 * Determine khaṇḍa from URL
 */
export function determineKhandaFromUrl(url: string): { name: string; number: number } {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('adi')) {
    return { name: 'adi', number: 1 };
  } else if (urlLower.includes('madhya')) {
    return { name: 'madhya', number: 2 };
  } else if (urlLower.includes('antya')) {
    return { name: 'antya', number: 3 };
  }
  return { name: 'adi', number: 1 }; // default
}

/**
 * Convert wisdomlib chapter to our standard chapter format
 */
export function wisdomlibChapterToStandardChapter(chapter: WisdomlibChapter): any {
  return {
    chapter_number: chapter.chapter_number,
    title_en: chapter.title_en,
    title_ua: chapter.title_ua,
    chapter_type: 'verses' as const,
    verses: chapter.verses.map(v => ({
      verse_number: v.verse_number,
      sanskrit: v.sanskrit || '',
      transliteration_en: v.transliteration_en || '',
      synonyms_en: v.synonyms_en || '',
      translation_en: v.translation_en || '',
      commentary_en: v.commentary_en || '',
    })),
    intro_en: chapter.intro_en,
  };
}
