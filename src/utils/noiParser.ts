/**
 * Спеціалізований парсер для NoI (Nectar of Instruction)
 * NoI має іншу HTML структуру ніж CC
 */

import { normalizeVerseField } from './textNormalizer';

export interface NoIVerseData {
  bengali: string;
  transliteration_en: string;
  synonyms_en: string;
  translation_en: string;
  commentary_en: string;
}

export interface NoIVerseDataUA {
  synonyms_uk: string;
  translation_uk: string;
  commentary_uk: string;
}

/**
 * Парсить NoI вірш з Vedabase (EN)
 */
export function parseNoIVedabase(html: string, url: string): NoIVerseData | null {
  console.log(`🔍 [NoI Vedabase] parseNoIVedabase called for: ${url}`);
  console.log(`📄 [NoI Vedabase] HTML length: ${html?.length || 0} characters`);

  if (!html || html.length < 100) {
    console.error(`❌ [NoI Vedabase] HTML is empty or too short (${html?.length || 0} chars)`);
    console.log(`📄 [NoI Debug] HTML content:`, html);
    return null;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.error(`❌ [NoI Vedabase] DOMParser error:`, parserError.textContent);
      return null;
    }

    // Debug: показуємо які класи доступні
    const allClasses = new Set<string>();
    doc.querySelectorAll('[class]').forEach(el => {
      el.classList.forEach(cls => allClasses.add(cls));
    });
    console.log(`[NoI Debug] Total unique classes in HTML:`, allClasses.size);
    const avClasses = Array.from(allClasses).filter(c => c.startsWith('av-'));
    console.log(`[NoI Debug] Classes starting with 'av-':`, avClasses);

    // Додаткова діагностика
    const bodyClasses = doc.body?.className || '';
    console.log(`[NoI Debug] Body classes:`, bodyClasses);
    console.log(`[NoI Debug] Total divs:`, doc.querySelectorAll('div').length);
    console.log(`[NoI Debug] Total paragraphs:`, doc.querySelectorAll('p').length);

    // Перевірка чи це React app що не завантажився
    const reactRoot = doc.querySelector('#root, #app, [data-reactroot], .react-root');
    console.log(`[NoI Debug] React root found:`, !!reactRoot);
    if (reactRoot) {
      const rootContent = reactRoot.textContent?.trim() || '';
      console.log(`[NoI Debug] React root content length:`, rootContent.length);
      if (rootContent.length < 100) {
        console.error(`❌ [NoI Debug] React root is nearly empty (${rootContent.length} chars) - JavaScript may not have executed!`);
        console.log(`[NoI Debug] Root content:`, rootContent);
      }
    }

    let bengali = '';
    let transliteration_en = '';
    let synonyms_en = '';
    let translation_en = '';
    let commentary_en = '';

    // 1. SANSKRIT/BENGALI - NoI використовує просто .av-bengali (без вкладеного div)
    const bengaliEl = doc.querySelector('.av-bengali');
    console.log(`[NoI Debug] querySelector('.av-bengali'):`, bengaliEl ? 'FOUND' : 'NOT FOUND');
    if (bengaliEl) {
      bengali = bengaliEl.textContent?.trim() || '';
      console.log(`✅ [NoI] Found bengali (${bengali.length} chars): "${bengali.substring(0, 60)}..."`);
    } else {
      console.warn('⚠️ [NoI] Bengali not found with .av-bengali selector');
    }

    // 2. TRANSLITERATION - шукаємо .av-verse_text або схоже
    const translitEl = doc.querySelector('.av-verse_text em, .av-verse_text');
    if (translitEl) {
      transliteration_en = translitEl.innerHTML
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();
      console.log(`✅ [NoI] Found transliteration (${transliteration_en.length} chars)`);
    } else {
      console.warn('⚠️ [NoI] Transliteration not found');
    }

    // 3. SYNONYMS - .av-synonyms
    const synonymsEl = doc.querySelector('.av-synonyms');
    if (synonymsEl) {
      // Беремо span.inline елементи
      const spans = synonymsEl.querySelectorAll('span.inline');
      const parts: string[] = [];
      const seen = new Set<string>();

      spans.forEach(span => {
        // Skip nested spans
        let parent = span.parentElement;
        while (parent && parent !== synonymsEl) {
          if (parent.classList.contains('inline') && parent.tagName === 'SPAN') {
            return;
          }
          parent = parent.parentElement;
        }

        const text = span.textContent?.trim() || '';
        if (text && !seen.has(text)) {
          seen.add(text);
          const cleaned = text.replace(/;\s*$/, '');
          if (cleaned) parts.push(cleaned);
        }
      });

      synonyms_en = parts.join('; ');
      console.log(`✅ [NoI] Found synonyms (${synonyms_en.length} chars, ${parts.length} terms)`);
    } else {
      console.warn('⚠️ [NoI] Synonyms not found');
    }

    // 4. TRANSLATION - .av-translation strong або .av-translation
    const translationEl = doc.querySelector('.av-translation strong, .av-translation');
    if (translationEl) {
      translation_en = translationEl.textContent?.trim() || '';
      console.log(`✅ [NoI] Found translation (${translation_en.length} chars)`);
    } else {
      console.warn('⚠️ [NoI] Translation not found');
    }

    // 5. PURPORT - .av-purport (тільки прямі <p>)
    const purportContainer = doc.querySelector('.av-purport');
    if (purportContainer) {
      let paragraphs = purportContainer.querySelectorAll(':scope > p');

      // Fallback: всі <p> якщо немає прямих
      if (paragraphs.length === 0) {
        paragraphs = purportContainer.querySelectorAll('p');
      }

      const parts: string[] = [];
      const seen = new Set<string>();

      paragraphs.forEach(p => {
        const text = p.textContent?.trim() || '';
        if (text.length > 10 && !seen.has(text)) {
          seen.add(text);
          parts.push(text);
        }
      });

      commentary_en = parts.join('\n\n');
      console.log(`✅ [NoI] Found purport (${commentary_en.length} chars, ${parts.length} paragraphs)`);
    } else {
      console.warn('⚠️ [NoI] Purport not found');
    }

    // Перевірка: хоча б щось повинно бути
    if (!bengali && !transliteration_en && !translation_en) {
      console.error(`❌ [NoI] No content found for ${url}`);
      console.log(`📄 [NoI Debug] HTML sample (first 2000 chars):`, html.substring(0, 2000));
      console.log(`📄 [NoI Debug] Document body classes:`, doc.body?.className || 'none');
      console.log(`📄 [NoI Debug] Document body id:`, doc.body?.id || 'none');

      // Try to find ANY text content to see if page loaded
      const bodyText = doc.body?.textContent?.trim().substring(0, 200) || '';
      console.log(`📄 [NoI Debug] Body text sample:`, bodyText);

      return null;
    }

    return {
      bengali,
      transliteration_en,
      synonyms_en,
      translation_en,
      commentary_en
    };

  } catch (error) {
    console.error(`❌ [NoI] Parse error for ${url}:`, error);
    return null;
  }
}

/**
 * Парсить NoI вірш з Gitabase (UK)
 */
export function parseNoIGitabase(html: string, url: string): NoIVerseDataUA | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let synonyms_uk = '';
    let translation_uk = '';
    let commentary_uk = '';

    console.log(`[NoI Gitabase] Parsing ${url}`);
    console.log(`[NoI Gitabase] HTML length: ${html?.length || 0} chars`);

    // 1. SYNONYMS - div.dia_text
    const synonymsEl = doc.querySelector('div.dia_text');
    if (synonymsEl) {
      synonyms_uk = synonymsEl.textContent?.trim() || '';
      // Нормалізація: прибираємо зайві пробіли
      synonyms_uk = normalizeVerseField(synonyms_uk, 'synonyms');
      console.log(`✅ [NoI UA] Found synonyms (${synonyms_uk.length} chars)`);
    } else {
      console.warn('⚠️ [NoI UA] Synonyms (div.dia_text) not found');
    }

    // 2. TRANSLATION - шукаємо <b> в заголовку
    // Можливі варіанти: h4 > b, h3 > b, або просто перший <b> з довгим текстом
    let translationEl = doc.querySelector('h4 > b, h3 > b');
    if (!translationEl) {
      // Fallback: перший <b> з текстом > 20 символів
      const allB = doc.querySelectorAll('b');
      for (const b of allB) {
        const text = b.textContent?.trim() || '';
        if (text.length > 20 && !text.includes('—')) {
          translationEl = b;
          break;
        }
      }
    }

    if (translationEl) {
      translation_uk = translationEl.textContent?.trim() || '';
      // Нормалізація
      translation_uk = normalizeVerseField(translation_uk, 'translation');
      console.log(`✅ [NoI UA] Found translation (${translation_uk.length} chars)`);
    } else {
      console.warn('⚠️ [NoI UA] Translation not found');
    }

    // 3. PURPORT - шукаємо специфічний контейнер або фільтруємо параграфи
    // Спроба 1: Точний контейнер як у CC (можливо NoI має таку ж структуру)
    let purportContainer = doc.querySelector('div.row:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)');

    // Спроба 2: Будь-який div.row після translation що містить багато <p>
    if (!purportContainer) {
      const rows = Array.from(doc.querySelectorAll('div.row'));
      for (const row of rows) {
        const paragraphs = row.querySelectorAll('p');
        if (paragraphs.length >= 3) { // Purport зазвичай має кілька параграфів
          purportContainer = row;
          console.log(`[NoI UA] Found purport container via fallback (${paragraphs.length} paragraphs)`);
          break;
        }
      }
    }

    const parts: string[] = [];
    const seen = new Set<string>();

    // Функція для перевірки чи містить текст транслітерацію (IAST символи)
    const hasTransliteration = (text: string): boolean => {
      // IAST діакритичні символи
      const iastPattern = /[āīūṛṝḷḹṁṃḥṅñṭḍṇśṣ]/i;
      return iastPattern.test(text);
    };

    // Функція для перевірки чи це synonyms (містить багато " — ")
    const isSynonyms = (text: string): boolean => {
      const dashCount = (text.match(/ — /g) || []).length;
      return dashCount >= 3; // Synonyms зазвичай мають багато " — "
    };

    let allParagraphs: NodeListOf<HTMLElement>;
    if (purportContainer) {
      // Беремо параграфи з контейнера
      allParagraphs = purportContainer.querySelectorAll('p');
      console.log(`[NoI UA] Using purport container with ${allParagraphs.length} paragraphs`);
    } else {
      // Fallback: всі <p> на сторінці, але з жорсткою фільтрацією
      allParagraphs = doc.querySelectorAll('p');
      console.log(`[NoI UA] Using all <p> tags (${allParagraphs.length}) with strict filtering`);
    }

    allParagraphs.forEach(p => {
      const text = p.textContent?.trim() || '';

      // Пропускаємо:
      // - Короткі (< 50 chars)
      // - Дублікати
      // - Те що вже є в synonyms/translation
      // - Текст з транслітерацією (це не purport, а transliteration блок)
      // - Synonyms-подібний текст (багато " — ")
      if (text.length > 50 &&
          !seen.has(text) &&
          text !== synonyms_uk &&
          text !== translation_uk &&
          !hasTransliteration(text) &&
          !isSynonyms(text)) {
        seen.add(text);

        // Нормалізація: прибирає зайві пробіли, фіксить цитати, транслітерацію всередині
        const normalized = normalizeVerseField(text, 'commentary');
        parts.push(normalized);
      }
    });

    commentary_uk = parts.join('\n\n');
    console.log(`✅ [NoI UA] Found purport (${commentary_uk.length} chars, ${parts.length} unique paragraphs)`);

    // Перевірка
    if (!synonyms_uk && !translation_uk && !commentary_uk) {
      console.error(`❌ [NoI UA] No content found for ${url}`);
      return null;
    }

    return {
      synonyms_uk,
      translation_uk,
      commentary_uk
    };

  } catch (error) {
    console.error(`❌ [NoI UA] Parse error for ${url}:`, error);
    return null;
  }
}
