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
  canto_number?: number; // Додано для підтримки структури cantos
}

export interface BhaktivinodaCanto {
  canto_number: number;
  title_en: string;
  title_ua: string;
  songs: BhaktivinodaSong[];
}

/**
 * Визначити canto на основі URL пісні
 * Приклад: /dainya-song-one/ → Canto 1 (Dainya)
 */
export function determineCantoFromUrl(url: string): { number: number; name: string; name_ua: string } | null {
  const urlLower = url.toLowerCase();

  // Canto 1: Dainya (Смирення) - 7 songs
  if (urlLower.includes('dainya')) {
    return { number: 1, name: 'Dainya', name_ua: 'Смирення' };
  }

  // Canto 2: Ātma Nivedana (Посвячення себе) - 8 songs
  if (urlLower.includes('atmanivedana') || urlLower.includes('atma-nivedana')) {
    return { number: 2, name: 'Ātma Nivedana', name_ua: 'Посвячення себе' };
  }

  // Canto 3: Goptṛtve-Varaṇa (Вибір Захисника) - 4 songs
  if (urlLower.includes('goptritve') || urlLower.includes('varana')) {
    return { number: 3, name: 'Goptṛtve-Varaṇa', name_ua: 'Вибір Захисника' };
  }

  // Canto 4: Avaśya Rakṣibe Kṛṣṇa (Крішна неодмінно захистить) - 6 songs
  if (urlLower.includes('avasya') || urlLower.includes('raksibe') || urlLower.includes('krsna')) {
    return { number: 4, name: 'Avaśya Rakṣibe Kṛṣṇa', name_ua: 'Крішна неодмінно захистить' };
  }

  // Canto 5: Bhakti-Pratikūla-Bhāva (Відкинути несприятливе для бгакті) - 5 songs
  if (urlLower.includes('bhakti-pratikula') || urlLower.includes('pratikula')) {
    return { number: 5, name: 'Bhakti-Pratikūla-Bhāva', name_ua: 'Відкинути несприятливе для бгакті' };
  }

  // Canto 6: Svīkara (Прийняти сприятливе) - 5 songs
  if (urlLower.includes('svikara')) {
    return { number: 6, name: 'Svīkara', name_ua: 'Прийняти сприятливе' };
  }

  // Canto 7: Bhajana Lālasā (Прагнення до бгаджану) - 13 songs
  if (urlLower.includes('bhajana') || urlLower.includes('lalasa')) {
    return { number: 7, name: 'Bhajana Lālasā', name_ua: 'Прагнення до бгаджану' };
  }

  // Canto 8: Siddhi Lālasā (Прагнення до досконалості) - 3 songs
  if (urlLower.includes('siddhi')) {
    return { number: 8, name: 'Siddhi Lālasā', name_ua: 'Прагнення до досконалості' };
  }

  // Canto 9: Vijñapti & Śrī Nāma Māhātmya (Молитва і слава Святого Імені) - 2 songs
  if (urlLower.includes('vijnaptih') || urlLower.includes('vijnapti') ||
      urlLower.includes('nama-mahatmya') || urlLower.includes('sri-nama')) {
    return { number: 9, name: 'Vijñapti & Śrī Nāma Māhātmya', name_ua: 'Молитва і слава Святого Імені' };
  }

  return null;
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
 * Групувати URL пісень за cantos (розділами)
 * Повертає структуру: Map<canto_number, { info, urls }>
 */
export function groupSongUrlsByCantos(songUrls: string[]): Map<number, { name: string; name_ua: string; urls: string[] }> {
  const cantoMap = new Map<number, { name: string; name_ua: string; urls: string[] }>();

  for (const url of songUrls) {
    const cantoInfo = determineCantoFromUrl(url);

    if (!cantoInfo) {
      console.warn(`Cannot determine canto for URL: ${url}`);
      continue;
    }

    if (!cantoMap.has(cantoInfo.number)) {
      cantoMap.set(cantoInfo.number, {
        name: cantoInfo.name,
        name_ua: cantoInfo.name_uk,
        urls: []
      });
    }

    cantoMap.get(cantoInfo.number)!.urls.push(url);
  }

  return cantoMap;
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
      title_ua: songTitle.title_uk,
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
    canto_number: song.canto_number || undefined, // Додано підтримку cantos
    title_en: song.title_en || `Song ${song.song_number}`,
    title_ua: song.title_uk || `Пісня ${song.song_number}`,
    chapter_type: 'verses' as const,
    verses: song.verses.map(v => ({
      verse_number: v.verse_number,
      sanskrit: v.sanskrit || '',
      transliteration_en: v.transliteration_en || '',
      transliteration_ua: v.transliteration_ua || '',
      synonyms_en: v.synonyms_en || '',
      synonyms_ua: v.synonyms_uk || '',
      translation_en: v.translation_en || '',
      translation_ua: v.translation_uk || '',
      commentary_en: v.commentary_en || '',
      commentary_ua: v.commentary_ua || '',
    }))
  };
}
