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

    // 1. BENGALI TEXT (немає в Антья-лілі, є тільки в Аді та Мадх'я)
    let bengali = '';
    const bengaliSelectors = ['.r-verse', '.r-bengali', '.r-verse-bengali', '.r-original'];
    for (const sel of bengaliSelectors) {
      const el = doc.querySelector(sel);
      if (el) {
        bengali = el.textContent?.trim() || '';
        if (bengali) break;
      }
    }

    // 2. TRANSLITERATION - РЕАЛЬНА структура: .av-verse_text .text-center.italic em
    let transliteration = '';
    const translitElement = doc.querySelector('.av-verse_text .text-center.italic em');
    if (translitElement) {
      // Збираємо всі <em> теги і текстові вузли всередині, зберігаючи <br> як переноси рядків
      const html = translitElement.innerHTML;
      transliteration = html
        .replace(/<br\s*\/?>/gi, '\n')  // <br> -> перенос рядка
        .replace(/<[^>]+>/g, '')         // видаляємо всі інші теги
        .trim();
    }

    // 3. SYNONYMS - РЕАЛЬНА структура: .av-synonyms .text-justify span.inline
    let synonyms = '';
    const synonymsContainer = doc.querySelector('.av-synonyms .text-justify');
    if (synonymsContainer) {
      const spans = synonymsContainer.querySelectorAll('span.inline');
      const parts: string[] = [];
      
      spans.forEach(span => {
        const text = span.textContent?.trim() || '';
        if (text) {
          // Видаляємо зайві пробіли та semicolons в кінці
          const cleaned = text.replace(/;\s*$/, '').trim();
          if (cleaned) parts.push(cleaned);
        }
      });
      
      synonyms = parts.join('; ');
    }

    // 4. TRANSLATION - РЕАЛЬНА структура: .av-translation strong
    let translation = '';
    const translationElement = doc.querySelector('.av-translation strong');
    if (translationElement) {
      translation = translationElement.textContent?.trim() || '';
    }

    // 5. PURPORT - РЕАЛЬНА структура: .av-purport (може не бути)
    let purport = '';
    const purportContainer = doc.querySelector('.av-purport');
    if (purportContainer) {
      const paragraphs = purportContainer.querySelectorAll('p, div');
      const parts: string[] = [];
      
      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text && text.length > 10) {
          parts.push(text);
        }
      });
      
      purport = parts.join('\n\n');
    }

    // Перевірка: потрібна хоча б транслітерація або переклад
    if (!transliteration && !translation) {
      console.warn('❌ Не знайдено transliteration/translation для', url);
      return null;
    }
    
    console.log('✅ Парсинг успішний:', url, {
      bengali: bengali ? '✓' : '✗',
      transliteration: transliteration ? '✓' : '✗',
      synonyms: synonyms ? '✓' : '✗',
      translation: translation ? '✓' : '✗',
      purport: purport ? '✓' : '✗'
    });

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
