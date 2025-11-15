/**
 * Спеціалізований парсер для Raja Vidya (Раджа відья)
 *
 * Структура EPUB/PDF (українська):
 * - h1.header-number - "глава перша" (номер глави словами)
 * - h1.header - назва глави
 * - div.quoted-anustubh - вірші (українська транслітерація)
 * - p.reference - джерело {BG 9.1}
 * - p.paragraph - текст (переклад + коментар)
 *
 * Структура Vedabase (англійська):
 * - Текстові глави з вбудованими віршами
 */

import { normalizeVerseField } from './textNormalizer';

// Мапа українських назв глав на числа
const ukrainianChapterNumbers: Record<string, number> = {
  'перша': 1, 'перший': 1,
  'друга': 2, 'другий': 2,
  'третя': 3, 'третій': 3,
  'четверта': 4, 'четвертий': 4,
  'п\'ята': 5, 'п\'ятий': 5,
  'шоста': 6, 'шостий': 6,
  'сьома': 7, 'сьомий': 7,
  'восьма': 8, 'восьмий': 8,
};

export interface RajaVidyaChapterUA {
  chapter_number: number;
  title_ua: string;
  content_ua: string; // Весь текст глави з вбудованими віршами
}

export interface RajaVidyaChapterEN {
  chapter_number: number;
  title_en: string;
  content_en: string;
}

/**
 * Парсить українську версію Raja Vidya з EPUB HTML
 */
export function parseRajaVidyaEPUB(html: string): RajaVidyaChapterUA[] {
  console.log(`🔍 [Raja Vidya UA] parseRajaVidyaEPUB called`);
  console.log(`📄 [Raja Vidya UA] HTML length: ${html?.length || 0} characters`);

  if (!html || html.length < 100) {
    console.error(`❌ [Raja Vidya UA] HTML is empty or too short`);
    return [];
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const chapters: RajaVidyaChapterUA[] = [];

    // Знаходимо всі h1.header-number (маркери початку глав)
    const chapterHeaders = doc.querySelectorAll('h1.header-number');
    console.log(`📚 [Raja Vidya UA] Found ${chapterHeaders.length} chapter headers`);

    chapterHeaders.forEach((headerNumberEl, index) => {
      // Отримуємо номер глави з тексту (наприклад, "глава перша")
      const headerNumberText = headerNumberEl.textContent?.trim().toLowerCase() || '';
      console.log(`📖 [Raja Vidya UA] Processing chapter header: "${headerNumberText}"`);

      // Витягуємо українське слово з "глава перша"
      const match = headerNumberText.match(/глава\s+([а-яіїєґ']+)/i);
      const chapterWord = match ? match[1].toLowerCase().replace(/['ʼ`]/g, "'") : '';
      const chapterNumber = ukrainianChapterNumbers[chapterWord] || (index + 1);

      console.log(`✅ [Raja Vidya UA] Chapter word: "${chapterWord}" -> number: ${chapterNumber}`);

      // Знаходимо наступний елемент - h1.header з назвою глави
      let titleEl = headerNumberEl.nextElementSibling;
      while (titleEl && !titleEl.matches('h1.header')) {
        titleEl = titleEl.nextElementSibling;
      }

      const title = titleEl?.textContent?.trim() || `Глава ${chapterNumber}`;
      console.log(`📝 [Raja Vidya UA] Chapter ${chapterNumber} title: "${title}"`);

      // Збираємо весь контент глави до наступного h1.header-number
      const contentParts: string[] = [];
      let currentEl = titleEl?.nextElementSibling;

      while (currentEl) {
        // Зупиняємося на наступній главі
        if (currentEl.matches('h1.header-number')) {
          break;
        }

        // Збираємо різні типи контенту
        if (currentEl.matches('div.quoted-anustubh')) {
          // Вірш (українська транслітерація)
          const verseText = currentEl.textContent?.trim() || '';
          if (verseText) {
            contentParts.push(`\n${verseText}\n`);
          }
        } else if (currentEl.matches('p.reference')) {
          // Посилання на джерело {BG 9.1}
          const refText = currentEl.textContent?.trim() || '';
          if (refText) {
            contentParts.push(`[${refText}]`);
          }
        } else if (currentEl.matches('p.paragraph')) {
          // Основний текст
          const paraText = currentEl.textContent?.trim() || '';
          if (paraText) {
            contentParts.push(paraText);
          }
        } else if (currentEl.matches('p')) {
          // Будь-який інший параграф
          const text = currentEl.textContent?.trim() || '';
          if (text) {
            contentParts.push(text);
          }
        }

        currentEl = currentEl.nextElementSibling;
      }

      const content = contentParts.join('\n\n').trim();
      console.log(`✅ [Raja Vidya UA] Chapter ${chapterNumber} content: ${content.length} chars`);

      if (content) {
        chapters.push({
          chapter_number: chapterNumber,
          title_ua: title,
          content_ua: content,
        });
      }
    });

    console.log(`✅ [Raja Vidya UA] Successfully parsed ${chapters.length} chapters`);
    return chapters;
  } catch (error) {
    console.error('❌ [Raja Vidya UA] Parse error:', error);
    return [];
  }
}

/**
 * Парсить англійську версію Raja Vidya з Vedabase
 */
export function parseRajaVidyaVedabase(html: string, url: string): RajaVidyaChapterEN | null {
  console.log(`🔍 [Raja Vidya EN] parseRajaVidyaVedabase called for: ${url}`);
  console.log(`📄 [Raja Vidya EN] HTML length: ${html?.length || 0} characters`);

  if (!html || html.length < 100) {
    console.error(`❌ [Raja Vidya EN] HTML is empty or too short`);
    return null;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Витягуємо номер глави з URL: https://vedabase.io/en/library/rv/1/ -> 1
    const chapterMatch = url.match(/\/rv\/(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 1;

    // Знаходимо заголовок глави
    let title = '';
    const titleEl = doc.querySelector('h1, .r-title, .chapter-title');
    if (titleEl) {
      title = titleEl.textContent?.trim() || '';
      console.log(`📝 [Raja Vidya EN] Chapter ${chapterNumber} title: "${title}"`);
    }

    // Збираємо весь текстовий контент
    // Vedabase зазвичай використовує .r-verse, .r-paragraph, або .r-text
    const contentParts: string[] = [];

    // Спробуємо знайти основний контент-контейнер
    const contentContainer = doc.querySelector('.r-body, .r-content, article, main') || doc.body;

    if (contentContainer) {
      // Збираємо всі параграфи
      const paragraphs = contentContainer.querySelectorAll('p, .r-paragraph, .r-text');
      paragraphs.forEach((p) => {
        const text = p.textContent?.trim() || '';
        if (text && text.length > 10) {
          // Ігноруємо дуже короткі тексти
          contentParts.push(text);
        }
      });
    }

    const content = contentParts.join('\n\n').trim();
    console.log(`✅ [Raja Vidya EN] Chapter ${chapterNumber} content: ${content.length} chars`);

    if (!content) {
      console.warn(`⚠️ [Raja Vidya EN] No content found for chapter ${chapterNumber}`);
      return null;
    }

    return {
      chapter_number: chapterNumber,
      title_en: title || `Chapter ${chapterNumber}`,
      content_en: content,
    };
  } catch (error) {
    console.error('❌ [Raja Vidya EN] Parse error:', error);
    return null;
  }
}

/**
 * Об'єднує українську та англійську версії глави
 */
export function mergeRajaVidyaChapters(
  ua: RajaVidyaChapterUA | null,
  en: RajaVidyaChapterEN | null
): any {
  if (!ua && !en) return null;

  const chapterNumber = ua?.chapter_number || en?.chapter_number || 1;

  return {
    chapter_number: chapterNumber,
    chapter_type: 'text' as const,
    title_ua: ua?.title_ua || '',
    title_en: en?.title_en || '',
    content_ua: ua?.content_ua || '',
    content_en: en?.content_en || '',
    verses: [], // Raja Vidya - текстова книга без окремих віршів
  };
}

/**
 * Витягує всі глави з українського EPUB
 */
export function extractRajaVidyaChaptersFromEPUB(epubHtml: string) {
  return parseRajaVidyaEPUB(epubHtml);
}
