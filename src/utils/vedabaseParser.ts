/**
 * ✅ РЕАЛЬНИЙ ПАРСЕР Vedabase Chaitanya-charitamrita
 * Основано на аналізі https://vedabase.io/en/library/cc/adi/1/1
 */

import { normalizeVerseField } from './textNormalizer';

interface VedabaseVerseData {
  bengali: string;
  transliteration: string;
  synonyms: string;
  translation: string;
  purport: string;
  lila: string; // 'adi', 'madhya', 'antya'
  chapter: number;
  verse: number | string; // може бути "7-8" для об'єднаних віршів
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
    // або https://vedabase.io/en/library/cc/madhya/9/7-8 для об'єднаних віршів
    const urlParts = url.split('/');
    const lila = urlParts[urlParts.length - 3]; // 'adi', 'madhya', 'antya'
    const chapter = parseInt(urlParts[urlParts.length - 2]);
    const verseStr = urlParts[urlParts.length - 1];
    const verse = verseStr.includes('-') ? verseStr : parseInt(verseStr);

    // 1. BENGALI TEXT - ВИПРАВЛЕНИЙ СЕЛЕКТОР ДЛЯ CC
    let bengali = '';
    // ✅ ВИПРАВЛЕНО: Для composite verses беремо ВСІ блоки Bengali/Sanskrit

    // Спочатку пробуємо знайти контейнер .av-bengali
    const mainBengaliContainer = doc.querySelector('.av-bengali');
    if (mainBengaliContainer) {
      // Шукаємо всі div.text-center всередині
      const bengaliContainers = mainBengaliContainer.querySelectorAll('div.text-center');

      if (bengaliContainers.length > 0) {
        const bengaliParts: string[] = [];
        bengaliContainers.forEach((container, index) => {
          const text = container.innerHTML
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<[^>]*>/g, '')
            .trim();
          if (text) {
            bengaliParts.push(text);
            console.log(`📖 Блок ${index + 1}: ${text.substring(0, 50)}...`);
          }
        });

        // Об'єднуємо блоки з порожнім рядком між ними для composite verses
        bengali = bengaliParts.join('\n\n');
        console.log(`📖 Знайдено ${bengaliContainers.length} блоків бенгалі/санскриту`);
      } else {
        // Fallback: якщо немає div.text-center, беремо весь текст контейнера
        bengali = mainBengaliContainer.textContent?.trim() || '';
        console.log(`📖 Використано fallback для .av-bengali (весь текст)`);
      }
    }

    // Fallback на старі селектори для інших текстів
    if (!bengali) {
      const bengaliSelectors = ['.r-verse', '.r-bengali', '.r-verse-bengali', '.r-original'];
      for (const sel of bengaliSelectors) {
        const el = doc.querySelector(sel);
        if (el) {
          bengali = el.textContent?.trim() || '';
          if (bengali) {
            console.log(`📖 Використано fallback селектор: ${sel}`);
            break;
          }
        }
      }
    }

    // 2. TRANSLITERATION - РЕАЛЬНА структура: .av-verse_text .text-center.italic em
    let transliteration = '';
    // ✅ ВИПРАВЛЕНО: Для composite verses беремо ВСІ блоки транслітерації

    // Спочатку пробуємо знайти контейнер .av-verse_text
    const mainTranslitContainer = doc.querySelector('.av-verse_text');
    if (mainTranslitContainer) {
      // Шукаємо всі .text-center.italic всередині
      const translitContainers = mainTranslitContainer.querySelectorAll('.text-center.italic');

      if (translitContainers.length > 0) {
        const translitParts: string[] = [];
        translitContainers.forEach((container, index) => {
          // Беремо текст з em елементів або весь текст контейнера
          const emElements = container.querySelectorAll('em');
          let text = '';

          if (emElements.length > 0) {
            const emTexts: string[] = [];
            emElements.forEach(em => {
              const emText = em.innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .trim();
              if (emText) emTexts.push(emText);
            });
            text = emTexts.join('\n');
          } else {
            text = container.innerHTML
              .replace(/<br\s*\/?>/gi, '\n')
              .replace(/<[^>]+>/g, '')
              .trim();
          }

          if (text) {
            translitParts.push(text);
            console.log(`📝 Блок транслітерації ${index + 1}: ${text.substring(0, 50)}...`);
          }
        });

        // Об'єднуємо блоки з порожнім рядком між ними для composite verses
        transliteration = translitParts.join('\n\n');
        console.log(`📝 Знайдено ${translitContainers.length} блоків транслітерації`);
      }
    }

    // Fallback на старий селектор
    if (!transliteration) {
      const translitElements = doc.querySelectorAll('.av-verse_text .text-center.italic em');
      if (translitElements.length > 0) {
        const translitParts: string[] = [];
        translitElements.forEach(element => {
          const text = element.innerHTML
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .trim();
          if (text) {
            translitParts.push(text);
          }
        });
        transliteration = translitParts.join('\n\n');
        console.log(`📝 Fallback: знайдено ${translitElements.length} em елементів`);
      }
    }

    // 3. SYNONYMS - РЕАЛЬНА структура: .av-synonyms .text-justify span.inline
    // КРИТИЧНО: Vedabase має ВКЛАДЕНІ span.inline (один всередині іншого),
    // що викликає дублювання тексту. Беремо ТІЛЬКИ top-level span.inline.
    let synonyms = '';
    const synonymsContainer = doc.querySelector('.av-synonyms .text-justify');
    if (synonymsContainer) {
      const allSpans = synonymsContainer.querySelectorAll('span.inline');
      const parts: string[] = [];
      const seen = new Set<string>();

      allSpans.forEach(span => {
        // ✅ ВИПРАВЛЕННЯ: Пропускаємо вкладені span.inline (які є всередині інших span.inline)
        // Перевіряємо чи будь-який батьківський елемент є span.inline
        let parent = span.parentElement;
        while (parent) {
          if (parent.classList.contains('inline') && parent.tagName === 'SPAN') {
            return; // Skip - це вкладений span
          }
          parent = parent.parentElement;
        }

        const text = span.textContent?.trim() || '';
        if (text) {
          // Видаляємо зайві пробіли та semicolons в кінці
          const cleaned = text.replace(/;\s*$/, '').trim();
          if (cleaned && !seen.has(cleaned)) {
            seen.add(cleaned);
            parts.push(cleaned);
          }
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
      console.warn(`❌ Vedabase ${lila} ${chapter}:${verse} - не знайдено transliteration/translation для ${url}`);
      return null;
    }
    
    console.log('✅ Парсинг успішний:', url, {
      bengali: bengali ? '✓' : '✗',
      transliteration: transliteration ? '✓' : '✗',
      synonyms: synonyms ? '✓' : '✗',
      translation: translation ? '✓' : '✗',
      purport: purport ? '✓' : '✗'
    });

    // ✅ Застосовуємо нормалізацію до всіх текстових полів
    return {
      bengali: normalizeVerseField(bengali, 'sanskrit'),
      transliteration: transliteration, // ✅ БЕЗ нормалізації - зберігаємо оригінальний IAST!
      synonyms: normalizeVerseField(synonyms, 'synonyms'),
      translation: normalizeVerseField(translation, 'translation'),
      purport: normalizeVerseField(purport, 'commentary'),
      lila,
      chapter,
      verse,
      source_url: url
    };

  } catch (error) {
    // Витягуємо verse info з URL для контексту
    const urlParts = url.split('/');
    const lila = urlParts[urlParts.length - 3];
    const chapter = urlParts[urlParts.length - 2];
    const verse = urlParts[urlParts.length - 1];
    console.error(`❌ Помилка парсингу Vedabase CC (${lila} ${chapter}:${verse}) з ${url}:`, error);
    return null;
  }
}

/**
 * Генерує URL для Vedabase CC verse
 * @param lila - 'adi', 'madhya', 'antya'
 * @param chapter - номер глави
 * @param verse - номер вірша (може бути "7-8" для об'єднаних)
 * @returns URL
 */
export function generateVedabaseURL(lila: string, chapter: number, verse: number | string): string {
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
    console.error('❌ Vedabase - Помилка визначення maxVerse:', error);
    return 0;
  }
}
