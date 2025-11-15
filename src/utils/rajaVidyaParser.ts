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

    // Діагностика: дивимось які класи є в документі
    const allClasses = new Set<string>();
    doc.querySelectorAll('[class]').forEach(el => {
      el.classList.forEach(cls => allClasses.add(cls));
    });
    console.log(`📊 [Raja Vidya UA] Унікальних класів у HTML: ${allClasses.size}`);
    console.log(`📋 [Raja Vidya UA] Класи:`, Array.from(allClasses).slice(0, 20).join(', '));

    // Діагностика: які заголовки є
    const allH1 = doc.querySelectorAll('h1');
    console.log(`📌 [Raja Vidya UA] Знайдено h1 елементів: ${allH1.length}`);
    allH1.forEach((h1, i) => {
      console.log(`  h1[${i}]: class="${h1.className}" text="${h1.textContent?.substring(0, 50)}"`);
    });

    // Знаходимо всі h1.header-number (маркери початку глав)
    let chapterHeaders = doc.querySelectorAll('h1.header-number');
    console.log(`📚 [Raja Vidya UA] Found ${chapterHeaders.length} h1.header-number elements`);

    // Fallback 1: якщо не знайдено h1.header-number, шукаємо просто h1 з текстом "глава"
    if (chapterHeaders.length === 0) {
      console.log(`⚠️ [Raja Vidya UA] Fallback: шукаємо h1 з текстом "глава"`);
      chapterHeaders = Array.from(allH1).filter(h1 => /глава/i.test(h1.textContent || '')) as any;
      console.log(`📚 [Raja Vidya UA] Fallback знайшов ${chapterHeaders.length} глав`);
    }

    // Fallback 2: якщо все ще нічого, шукаємо будь-які h1/h2 з українськими числівниками
    if (chapterHeaders.length === 0) {
      console.log(`⚠️ [Raja Vidya UA] Fallback 2: шукаємо h1/h2 з числівниками`);
      const allHeadings = doc.querySelectorAll('h1, h2');
      chapterHeaders = Array.from(allHeadings).filter(h =>
        /(перша|друга|третя|четверта|п'ята|шоста|сьома|восьма)/i.test(h.textContent || '')
      ) as any;
      console.log(`📚 [Raja Vidya UA] Fallback 2 знайшов ${chapterHeaders.length} глав`);
    }

    chapterHeaders.forEach((headerNumberEl, index) => {
      // Отримуємо номер глави з тексту (наприклад, "глава перша")
      const headerNumberText = headerNumberEl.textContent?.trim().toLowerCase() || '';
      console.log(`📖 [Raja Vidya UA] Processing chapter header: "${headerNumberText}"`);

      // Витягуємо українське слово з "глава перша"
      const match = headerNumberText.match(/глава\s+([а-яіїєґ']+)/i);
      const chapterWord = match ? match[1].toLowerCase().replace(/['ʼ`]/g, "'") : '';
      const chapterNumber = ukrainianChapterNumbers[chapterWord] || (index + 1);

      console.log(`✅ [Raja Vidya UA] Chapter word: "${chapterWord}" -> number: ${chapterNumber}`);

      // Знаходимо наступний елемент - назву глави
      // Спробуємо h1.header, але якщо не знайдено - візьмемо будь-який наступний h1/h2
      let titleEl = headerNumberEl.nextElementSibling;
      let titleFound = false;

      // Спробуємо знайти h1.header
      while (titleEl && !titleFound) {
        if (titleEl.matches('h1.header, h1, h2')) {
          titleFound = true;
          break;
        }
        titleEl = titleEl.nextElementSibling;
      }

      const title = titleEl?.textContent?.trim() || `Глава ${chapterNumber}`;
      console.log(`📝 [Raja Vidya UA] Chapter ${chapterNumber} title: "${title}"`);

      // ✅ Збираємо весь контент глави зі збереженням HTML форматування
      const contentParts: string[] = [];
      let currentEl = titleEl?.nextElementSibling || headerNumberEl.nextElementSibling;

      while (currentEl) {
        const text = currentEl.textContent?.trim() || '';

        // Зупиняємося на наступній главі (h1 з "глава" або числівником)
        if (currentEl.matches('h1, h2')) {
          const heading = text.toLowerCase();
          if (/(глава|перша|друга|третя|четверта|п'ята|шоста|сьома|восьма)/i.test(heading)) {
            console.log(`🛑 [Raja Vidya UA] Зупинка на наступній главі: "${text.substring(0, 50)}"`);
            break;
          }
        }

        // ✅ Збираємо HTML замість простого тексту
        if (text && text.length > 5) {
          const innerHTML = currentEl.innerHTML.trim();

          // Спеціальна обробка віршів (div.quoted-anustubh або схоже)
          if (currentEl.matches('div[class*="quoted"], div[class*="verse"]')) {
            contentParts.push(`<div class="verse">${innerHTML}</div>`);
          }
          // Посилання (p.reference або схоже)
          else if (currentEl.matches('p[class*="reference"], [class*="source"]') || /^\{[A-Z]+/.test(text)) {
            contentParts.push(`<p class="reference">${innerHTML}</p>`);
          }
          // Звичайний параграф
          else if (currentEl.matches('p')) {
            contentParts.push(`<p>${innerHTML}</p>`);
          }
          // Інший div
          else if (currentEl.matches('div')) {
            contentParts.push(`<div>${innerHTML}</div>`);
          }
        }

        currentEl = currentEl.nextElementSibling;
      }

      // ✅ Об'єднуємо HTML
      const content = contentParts.join('\n').trim();
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

    // Діагностика: які класи є
    const allClasses = new Set<string>();
    doc.querySelectorAll('[class]').forEach(el => {
      el.classList.forEach(cls => allClasses.add(cls));
    });
    console.log(`📊 [Raja Vidya EN] Унікальних класів: ${allClasses.size}`);
    console.log(`📋 [Raja Vidya EN] Класи (перші 30):`, Array.from(allClasses).slice(0, 30).join(', '));

    // Витягуємо номер глави з URL: https://vedabase.io/en/library/rv/1/ -> 1
    const chapterMatch = url.match(/\/rv\/(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 1;

    // Знаходимо заголовок глави
    let title = '';
    const titleEl = doc.querySelector('h1, h2, .r-title, .chapter-title, [class*="title"]');
    if (titleEl) {
      title = titleEl.textContent?.trim() || '';
      console.log(`📝 [Raja Vidya EN] Chapter ${chapterNumber} title: "${title}"`);
    }

    // ✅ ПОКРАЩЕНО: Збираємо HTML замість простого тексту для збереження форматування
    const contentParts: string[] = [];

    // Шукаємо основний контент-контейнер з різними варіантами
    const possibleContainers = [
      '.r-body',
      '.r-content',
      '.r-chapter',
      'article',
      'main',
      '#content',
      '.content',
      '.entry-content',
      '[role="main"]'
    ];

    let contentContainer = null;
    for (const selector of possibleContainers) {
      contentContainer = doc.querySelector(selector);
      if (contentContainer) {
        console.log(`✅ [Raja Vidya EN] Знайдено контейнер: ${selector}`);
        break;
      }
    }

    if (!contentContainer) {
      console.log(`⚠️ [Raja Vidya EN] Не знайдено спеціального контейнера, використовую body`);
      contentContainer = doc.body;
    }

    if (contentContainer) {
      // ✅ Збираємо параграфи зі збереженням HTML структури
      const paragraphs = contentContainer.querySelectorAll('p, div.verse, div.text, .r-paragraph, .r-text');
      console.log(`📊 [Raja Vidya EN] Знайдено параграфів: ${paragraphs.length}`);

      paragraphs.forEach((p, index) => {
        // Пропускаємо заголовки та навігацію
        if (p.closest('nav, header, footer, .navigation, .menu')) {
          return;
        }

        const text = p.textContent?.trim() || '';
        if (text && text.length > 10) {
          // Зберігаємо innerHTML для збереження форматування
          const innerHTML = p.innerHTML.trim();
          contentParts.push(`<p>${innerHTML}</p>`);

          if (index < 3) {
            console.log(`  [${index}] ${text.substring(0, 80)}...`);
          }
        }
      });

      // Якщо не знайдено параграфів, спробуємо взяти весь innerHTML контейнера
      if (contentParts.length === 0) {
        console.log(`⚠️ [Raja Vidya EN] Параграфів не знайдено, беру весь innerHTML контейнера`);
        const containerHTML = contentContainer.innerHTML.trim();
        if (containerHTML) {
          contentParts.push(containerHTML);
        }
      }
    }

    // ✅ Об'єднуємо з HTML тегами для збереження форматування
    const content = contentParts.join('\n').trim();
    console.log(`✅ [Raja Vidya EN] Chapter ${chapterNumber} content: ${content.length} chars (HTML)`);

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
