/**
 * ✅ РЕАЛЬНИЙ ПАРСЕР Vedabase Chaitanya-charitamrita
 * Основано на аналізі https://vedabase.io/en/library/cc/adi/1/1
 */

interface VedabaseVerseData {
  bengali: string;
  transliteration: string;
  synonyms: string;
  translation: string;
  purport: string;
  lila: string; // 'adi', 'madhya', 'antya'
  chapter: number;
  verse: number;
  source_url: string;
}

/**
 * Парсить сторінку Vedabase CC verse
 * @param html - HTML контент сторінки
 * @param url - URL сторінки (напр: https://vedabase.io/en/library/cc/adi/1/1)
 * @returns Структуровані дані вірша
 */
export function parseVedabaseCC(html: string, url: string): VedabaseVerseData | null {
  try {
    // Створюємо DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Витягуємо lila, chapter, verse з URL
    // URL формат: https://vedabase.io/en/library/cc/adi/1/1
    const urlParts = url.split('/');
    const lila = urlParts[urlParts.length - 3]; // 'adi', 'madhya', 'antya'
    const chapter = parseInt(urlParts[urlParts.length - 2]);
    const verse = parseInt(urlParts[urlParts.length - 1]);

    // 1. BENGALI TEXT
    // Try common selectors; if empty, detect by Bengali Unicode range
    let bengali = '';
    const bengaliSelectors = ['.r-verse', '.r-bengali', '.r-verse-bengali', '.r-original', '.r-verse-original'];
    let verseElement: Element | null = null;
    for (const sel of bengaliSelectors) {
      verseElement = doc.querySelector(sel);
      if (verseElement) {
        bengali = verseElement.textContent?.trim() || '';
        if (bengali) break;
      }
    }
    if (!bengali) {
      const candidates = Array.from(doc.querySelectorAll('main p, .entry-content p, blockquote p, .entry-content div'));
      const bnRegex = /[\u0980-\u09FF]/; // Bengali Unicode block
      for (const el of candidates) {
        const text = el.textContent?.trim() || '';
        if (bnRegex.test(text) && text.length > 4) {
          bengali = text;
          verseElement = el;
          break;
        }
      }
    }

    // 2. TRANSLITERATION - шукаємо клас r-verse-text або перший p після r-verse
    let transliteration = '';
    // Спочатку пробуємо клас r-verse-text
    const translitElement = doc.querySelector('.r-verse-text');
    if (translitElement) {
      transliteration = translitElement.textContent?.trim() || '';
    }
    
    // Якщо не знайшли, шукаємо перший p-елемент який йде після .r-verse
    if (!transliteration && verseElement) {
      let nextEl = verseElement.nextElementSibling;
      while (nextEl && !transliteration) {
        if (nextEl.tagName === 'P') {
          const text = nextEl.textContent?.trim() || '';
          // Транслітерація містить латинські літери з діакритикою і немає "—"
          if (text && text.length > 10 && /[a-z]/i.test(text) && !text.includes('—') && !text.includes('SYNONYMS')) {
            transliteration = text;
            break;
          }
        }
        nextEl = nextEl.nextElementSibling;
      }
    }

    // 3. SYNONYMS - r-synonyms-item
    let synonyms = '';
    const synonymsItems = doc.querySelectorAll('.r-synonyms-item');
    const synonymsParts: string[] = [];
    
    synonymsItems.forEach(item => {
      const word = item.querySelector('.r-synonym')?.textContent?.trim() || '';
      const meaning = item.querySelector('.r-synonim-text, .r-synonym-text')?.textContent?.trim() || '';
      if (word && meaning) {
        synonymsParts.push(`${word} — ${meaning}`);
      }
    });
    
    synonyms = synonymsParts.join('; ');

    // 4. TRANSLATION - r-translation
    let translation = '';
    const translationElement = doc.querySelector('.r-translation');
    if (translationElement) {
      translation = translationElement.textContent?.trim() || '';
    }

    // 5. PURPORT - r-purport
    let purport = '';
    const purportElement = doc.querySelector('.r-purport');
    if (purportElement) {
      // Збираємо всі параграфи з purport
      const paragraphs = purportElement.querySelectorAll('p');
      const purportParts: string[] = [];
      
      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text) {
          purportParts.push(text);
        }
      });
      
      purport = purportParts.join('\n\n');
    }

    // Ensure we have at least one meaningful field
    if (!bengali && !transliteration && !translation) {
      console.warn('Не знайдено жодного поля (bengali/transliteration/translation) для', url);
      return null;
    }

    return {
      bengali,
      transliteration,
      synonyms,
      translation,
      purport,
      lila,
      chapter,
      verse,
      source_url: url
    };

  } catch (error) {
    console.error('Помилка парсингу Vedabase CC:', error);
    return null;
  }
}

/**
 * Генерує URL для Vedabase CC verse
 * @param lila - 'adi', 'madhya', 'antya'
 * @param chapter - номер глави
 * @param verse - номер вірша
 * @returns URL
 */
export function generateVedabaseURL(lila: string, chapter: number, verse: number): string {
  return `https://vedabase.io/en/library/cc/${lila}/${chapter}/${verse}`;
}

/**
 * Витягує максимальний номер вірша з сторінки глави
 * @param html - HTML контент сторінки глави
 * @returns максимальний номер вірша
 */
export function getMaxVerseFromChapter(html: string): number {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Шукаємо всі посилання на вірші
    const verseLinks = doc.querySelectorAll('a[href*="/cc/"]');
    let maxVerse = 0;
    
    verseLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const parts = href.split('/');
      const lastPart = parts[parts.length - 1];
      const verseNum = parseInt(lastPart);
      
      if (!isNaN(verseNum) && verseNum > maxVerse) {
        maxVerse = verseNum;
      }
    });
    
    return maxVerse;
  } catch (error) {
    console.error('Помилка визначення maxVerse:', error);
    return 0;
  }
}
