// FIXED Parser for bhaktivinodainstitute.org
// Правильно парсить структуру: (номер) транслітерація номер) переклад

export interface BhaktivinodaVerse {
  verse_number: string;
  sanskrit?: string;
  transliteration_en?: string;
  transliteration_ua?: string;
  synonyms_en?: string;
  synonyms_ua?: string;
  translation_en?: string;
  translation_ua?: string;
  commentary_en?: string;
  commentary_ua?: string;
}

export interface BhaktivinodaSong {
  song_number: number;
  title_en?: string;
  title_ua?: string;
  verses: BhaktivinodaVerse[];
}

/**
 * Extract song URLs from root page (e.g., Śaraṇāgati list page)
 * Returns array of individual song URLs
 */
export function extractSongUrls(html: string, baseUrl: string): string[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const urls: string[] = [];

    // Find all links that look like song pages
    const links = doc.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Match patterns for all Śaraṇāgati sections (9 sections, 54 songs total):
      // 1. Вступна пісня (1) + Dainya (7) - /dainya-song-one/
      // 2. Ātma Nivedana (8) - /atmanivedana-song-one/
      // 3. Goptṛtve-Varaṇa (4) - /goptritve-varana-song-one/
      // 4. Avaśya Rakṣibe Kṛṣṇa (6) - /avasya-raksibe-krsna-song-one/
      // 5. Bhakti-Pratikūla-Bhāva (5) - /bhakti-pratikula-bhava-song-one/
      // 6. Svīkara (5) - /svikara-song-one/
      // 7. Bhajana Lālasā (13) - /bhajana-lalasa-song-one/
      // 8. Siddhi Lālasā (3) - /siddhi-lalasa-song-one/
      // 9. Vijñapti + Śrī Nāma Māhātmya (2) - /vijnaptih-song-one/, /sri-nama-mahatmya-song-one/
      if (href.match(/\/(song-|dainya|atmanivedana|goptritve|varana|avaśya|avasya|raksibe|krsna|bhakti-anukula|bhakti-pratikula|bhava|svikara|bhajana|lalasa|siddhi|vijnaptih|vijnapti|nama-mahatmya|sri-nama)/i)) {
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
    console.error('Error extracting song URLs:', error);
    return [];
  }
}

/**
 * Parse a single song page
 *
 * Структура на сайті:
 * (1)
 * transliteration line 1
 * transliteration line 2
 * 1) English translation here
 *
 * (2)
 * transliteration lines
 * 2) English translation
 *
 * (3-4)  ← подвійний номер = ДВА окремі вірші!
 * transliteration for verse 3
 * transliteration for verse 4
 * 3-4) English translation for both verses
 */
export function parseBhaktivinodaSongPage(html: string, url: string): BhaktivinodaSong | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Витягуємо ТІЛЬКИ основний контент (не меню/footer/header)
    const mainContent =
      doc.querySelector('main') ||           // Основний контент
      doc.querySelector('article') ||        // Або стаття
      doc.querySelector('.entry-content') || // Або WordPress контент
      doc.querySelector('.post-content') ||  // Або інший варіант
      doc.body;                              // Fallback

    const text = mainContent.textContent || '';

    const verses = parseTextContent(text);

    if (verses.length === 0) {
      return null;
    }

    // Отримуємо назву пісні
    const songTitle = getBhaktivinodaSongTitle(html);

    return {
      song_number: 1,
      title_en: songTitle.title_en,
      title_ua: songTitle.title_ua,
      verses: verses
    };
  } catch (error) {
    console.error('Error parsing bhaktivinoda song page:', error);
    return null;
  }
}

/**
 * Парсинг текстового контенту (витягує вірші)
 */
function parseTextContent(text: string): BhaktivinodaVerse[] {
  const verses: BhaktivinodaVerse[] = [];

  // Розбиваємо на блоки по номерах в дужках: (1), (2), (3-4), etc.
  // ВАЖЛИВО: використовуємо lookahead щоб не втратити дужку
  const blocks = text.split(/\n(?=\()/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || !trimmed.startsWith('(')) continue;

    // Знаходимо номер вірша: (1) або (3-4)
    const verseNumMatch = trimmed.match(/^\((\d+(?:-\d+)?)\)/);
    if (!verseNumMatch) continue;

    const verseNumber = verseNumMatch[1]; // "1" або "3-4"

    // Витягуємо текст після (1)
    const content = trimmed.substring(verseNumMatch[0].length).trim();

    // Шукаємо переклад: він починається з "1) " або "3-4) "
    // Використовуємо multiline regex
    const escapedNum = verseNumber.replace('-', '-');
    const translationRegex = new RegExp(`^(.+?)\\n${escapedNum}\\)\\s+(.+)$`, 's');
    const match = content.match(translationRegex);

    if (!match) {
      // Якщо не знайшли переклад, весь контент = транслітерація
      verses.push({
        verse_number: verseNumber,
        transliteration_en: content,
        translation_en: ''
      });
      continue;
    }

    const [, transliteration, translation] = match;

    // Обробка подвійних номерів (3-4)
    if (verseNumber.includes('-')) {
      const [start, end] = verseNumber.split('-').map(n => parseInt(n));
      const transLines = transliteration.trim().split('\n').map(l => l.trim()).filter(l => l);

      // Ділимо рівно між віршами
      const linesPerVerse = Math.ceil(transLines.length / (end - start + 1));

      for (let v = start; v <= end; v++) {
        const startLine = (v - start) * linesPerVerse;
        const endLine = Math.min(startLine + linesPerVerse, transLines.length);
        const verseTrans = transLines.slice(startLine, endLine).join('\n');

        verses.push({
          verse_number: v.toString(),
          transliteration_en: verseTrans,
          translation_en: translation.trim() // Обидва діляться перекладом
        });
      }
    } else {
      // Звичайний одинарний вірш
      verses.push({
        verse_number: verseNumber,
        transliteration_en: transliteration.trim(),
        translation_en: translation.trim()
      });
    }
  }

  return verses;
}

/**
 * Отримати назву пісні зі сторінки
 */
function getBhaktivinodaSongTitle(html: string): { title_en: string; title_ua?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Шукаємо h1 або title
    const h1 = doc.querySelector('h1');
    const titleTag = doc.querySelector('title');

    let title_en = 'Untitled';

    if (h1?.textContent) {
      title_en = h1.textContent.trim();
    } else if (titleTag?.textContent) {
      title_en = titleTag.textContent.trim();
      // Видаляємо " - Bhaktivinoda Institute" якщо є
      title_en = title_en.replace(/\s*-\s*Bhaktivinoda Institute\s*$/i, '');
    }

    // Витягуємо номер пісні якщо є: "Dainya Song One" → "Song 1"
    const songMatch = title_en.match(/Song\s+(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|\d+)/i);
    if (songMatch) {
      const wordToNum: Record<string, string> = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
        'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
        'eleven': '11', 'twelve': '12', 'thirteen': '13'
      };
      const num = wordToNum[songMatch[1].toLowerCase()] || songMatch[1];
      title_en = `Song ${num}`;
    }

    return { title_en };
  } catch {
    return { title_en: 'Untitled' };
  }
}

/**
 * Get book title from page (for main book page)
 */
export function getBhaktivinodaTitle(html: string): { title_en: string; title_ua?: string } {
  return getBhaktivinodaSongTitle(html);
}

/**
 * Legacy function - kept for backwards compatibility
 * Use parseBhaktivinodaSongPage instead for single songs
 */
export function parseBhaktivinodaPage(html: string, url: string): BhaktivinodaSong[] {
  const song = parseBhaktivinodaSongPage(html, url);
  return song ? [song] : [];
}

/**
 * Конвертація в формат бази даних
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
