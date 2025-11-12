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
  purport_en: string;
}

export interface NoIVerseDataUA {
  synonyms_ua: string;
  translation_ua: string;
  purport_ua: string;
}

/**
 * Парсить NoI вірш з Vedabase (EN)
 */
export function parseNoIVedabase(html: string, url: string): NoIVerseData | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let bengali = '';
    let transliteration_en = '';
    let synonyms_en = '';
    let translation_en = '';
    let purport_en = '';

    // 1. SANSKRIT/BENGALI - NoI використовує просто .av-bengali (без вкладеного div)
    const bengaliEl = doc.querySelector('.av-bengali');
    if (bengaliEl) {
      bengali = bengaliEl.textContent?.trim() || '';
      console.log(`✅ [NoI] Found bengali (${bengali.length} chars)`);
    } else {
      console.warn('⚠️ [NoI] Bengali not found');
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

      purport_en = parts.join('\n\n');
      console.log(`✅ [NoI] Found purport (${purport_en.length} chars, ${parts.length} paragraphs)`);
    } else {
      console.warn('⚠️ [NoI] Purport not found');
    }

    // Перевірка: хоча б щось повинно бути
    if (!bengali && !transliteration_en && !translation_en) {
      console.error(`❌ [NoI] No content found for ${url}`);
      return null;
    }

    return {
      bengali,
      transliteration_en,
      synonyms_en,
      translation_en,
      purport_en
    };

  } catch (error) {
    console.error(`❌ [NoI] Parse error for ${url}:`, error);
    return null;
  }
}

/**
 * Парсить NoI вірш з Gitabase (UA)
 */
export function parseNoIGitabase(html: string, url: string): NoIVerseDataUA | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let synonyms_ua = '';
    let translation_ua = '';
    let purport_ua = '';

    console.log(`[NoI Gitabase] Parsing ${url}`);
    console.log(`[NoI Gitabase] HTML length: ${html?.length || 0} chars`);

    // 1. SYNONYMS - div.dia_text
    const synonymsEl = doc.querySelector('div.dia_text');
    if (synonymsEl) {
      synonyms_ua = synonymsEl.textContent?.trim() || '';
      // Нормалізація: прибираємо зайві пробіли
      synonyms_ua = normalizeVerseField(synonyms_ua, 'synonyms');
      console.log(`✅ [NoI UA] Found synonyms (${synonyms_ua.length} chars)`);
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
      translation_ua = translationEl.textContent?.trim() || '';
      // Нормалізація
      translation_ua = normalizeVerseField(translation_ua, 'translation');
      console.log(`✅ [NoI UA] Found translation (${translation_ua.length} chars)`);
    } else {
      console.warn('⚠️ [NoI UA] Translation not found');
    }

    // 3. PURPORT - всі <p> після translation (виключаючи synonyms та translation)
    const allParagraphs = doc.querySelectorAll('p');
    const parts: string[] = [];
    const seen = new Set<string>();

    allParagraphs.forEach(p => {
      const text = p.textContent?.trim() || '';

      // Пропускаємо короткі, дублікати, та text що вже є в synonyms/translation
      if (text.length > 50 &&
          !seen.has(text) &&
          text !== synonyms_ua &&
          text !== translation_ua) {
        seen.add(text);

        // Нормалізація кожного параграфу
        const normalized = normalizeVerseField(text, 'commentary');
        parts.push(normalized);
      }
    });

    purport_ua = parts.join('\n\n');
    console.log(`✅ [NoI UA] Found purport (${purport_ua.length} chars, ${parts.length} unique paragraphs)`);

    // Перевірка
    if (!synonyms_ua && !translation_ua && !purport_ua) {
      console.error(`❌ [NoI UA] No content found for ${url}`);
      return null;
    }

    return {
      synonyms_ua,
      translation_ua,
      purport_ua
    };

  } catch (error) {
    console.error(`❌ [NoI UA] Parse error for ${url}:`, error);
    return null;
  }
}
