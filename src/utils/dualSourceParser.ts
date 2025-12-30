/**
 * ✅ ГІБРИДНИЙ ПАРСЕР Vedabase EN + Gitabase UA
 * Комбінує обидва джерела для створення повної двомовної бази даних
 */

import { normalizeVerseField } from './textNormalizer';

// ============================================================================
// INTERFACES
// ============================================================================

interface VedabaseData {
  bengali: string;
  transliteration_en: string; // IAST
  synonyms_en: string;
  translation_en: string;
  purport_en: string;
}

interface GitabaseData {
  transliteration_ua: string; // може бути зіпсована
  synonyms_ua: string; // може бути зіпсована
  translation_ua: string;
  purport_ua: string;
}

interface MergedVerseData {
  bengali: string;
  transliteration_en: string; // IAST (оригінал з Vedabase)
  transliteration_ua: string; // конвертовано з IAST або взято з Gitabase
  synonyms_en: string; // IAST терміни + англійські переклади
  synonyms_ua: string; // конвертовані терміни + українські переклади
  translation_en: string;
  translation_ua: string;
  purport_en: string;
  purport_ua: string;
  lila: string;
  chapter: number;
  verse: number | string;
  source_url_vedabase: string;
  source_url_gitabase: string;
}

// ============================================================================
// КОНВЕРТАЦІЯ IAST → УКРАЇНСЬКА КИРИЛИЦЯ З ДІАКРИТИКОЮ
// ============================================================================

/**
 * Конвертує IAST транслітерацію в українську кирилицю з діакритиками
 * Базовано на rules з tools/TRANSLITERATION_RULES.md та pre_import_normalizer.py
 */
function convertIASTtoUkrainian(iast: string): string {
  if (!iast) return '';
  
  const patterns: Record<string, string> = {
    // 3 символи (складні сполучення)
    'kṣa': 'кша', 'kṣe': 'кше', 'kṣi': 'кші', 'kṣu': 'кшу',
    'Kṣa': 'кша', 'Kṣe': 'кше', 'Kṣi': 'кші', 'Kṣu': 'кшу',
    'nya': 'нйа', 'nye': 'нйе', 'nyi': 'нйі', 'nyo': 'нйо', 'nyu': 'нйу',
    
    // 2 символи (діграфи та сполучення)
    'bh': 'бг', 'gh': 'ґг', 'dh': 'дг', 'th': 'тх', 'ph': 'пх',
    'Bh': 'Бг', 'Gh': 'Ґг', 'Dh': 'Дг', 'Th': 'Тх', 'Ph': 'Пх',
    'kh': 'кх', 'ch': 'чх', 'jh': 'джх', 'sh': 'сх',
    'Kh': 'Кх', 'Ch': 'Чх', 'Jh': 'Джх', 'Sh': 'Сх',
    'kṣ': 'кш', 'jñ': 'джн̃',
    'ai': 'аі', 'au': 'ау',
    
    // 1 символ діакритичні приголосні
    'ṣ': 'ш', 'ś': 'ш́', 'ṭ': 'т̣', 'ḍ': 'д̣', 'ṇ': 'н̣',
    'ṛ': 'р̣', 'ñ': 'н̃', 'ṅ': 'н̇', 'ṁ': 'м̇', 'ḥ': 'х̣',
    'Ṣ': 'Ш', 'Ś': 'Ш́', 'Ṭ': 'Т̣', 'Ḍ': 'Д̣', 'Ṇ': 'Н̣',
    'Ṛ': 'Р̣', 'Ñ': 'Н̃', 'Ṅ': 'Н̇', 'Ṁ': 'М̇', 'Ḥ': 'Х̣',
    
    // 1 символ довгі голосні
    'ā': 'а̄', 'ī': 'ı̄', 'ū': 'ӯ', 'ṝ': 'р̣̄',  // ī → ı̄ (dotless i + макрон, БЕЗ крапки!)
    'Ā': 'А̄', 'Ī': 'Ī', 'Ū': 'Ӯ', 'Ṝ': 'Р̣̄',  // Ī → Ī (велика без крапки)
    
    // 1 символ прості приголосні
    'k': 'к', 'g': 'ґ', 'c': 'ч', 'j': 'дж',
    't': 'т', 'd': 'д', 'p': 'п', 'b': 'б',
    'y': 'й', 'r': 'р', 'l': 'л', 'v': 'в',
    'w': 'в', 'h': 'х', 'm': 'м', 'n': 'н', 's': 'с',
    'K': 'К', 'G': 'Ґ', 'C': 'Ч', 'J': 'Дж',
    'T': 'Т', 'D': 'Д', 'P': 'П', 'B': 'Б',
    'Y': 'Й', 'R': 'Р', 'L': 'Л', 'V': 'В',
    'W': 'В', 'H': 'Х', 'M': 'М', 'N': 'Н', 'S': 'С',
    
    // 1 символ прості голосні
    'a': 'а', 'i': 'і', 'u': 'у', 'e': 'е', 'o': 'о',
    'A': 'А', 'I': 'І', 'U': 'У', 'E': 'Е', 'O': 'О',
  };
  
  const result: string[] = [];
  let i = 0;
  
  while (i < iast.length) {
    let matched = false;
    
    // Спробувати найдовші підрядки першими (3, потім 2, потім 1)
    for (const length of [3, 2, 1]) {
      if (i + length <= iast.length) {
        const substr = iast.substring(i, i + length);
        if (patterns[substr]) {
          result.push(patterns[substr]);
          i += length;
          matched = true;
          break;
        }
      }
    }
    
    if (!matched) {
      // Символ не в мапі (дефіс, пробіл, розділові знаки) - залишаємо як є
      result.push(iast[i]);
      i++;
    }
  }
  
  return result.join('');
}

// ============================================================================
// ПАРСЕРИ
// ============================================================================

/**
 * Парсить Vedabase EN сторінку
 */
export function parseVedabaseCC(html: string, url: string): VedabaseData | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Bengali/Sanskrit text - support for combined verses (e.g., CC Madhya 17.228-229)
    let bengali = '';

    // Шукаємо всі блоки .av-bengali (може бути кілька для об'єднаних віршів)
    const bengaliContainers = doc.querySelectorAll('.av-bengali div.text-center');
    if (bengaliContainers.length > 0) {
      const bengaliBlocks: string[] = [];
      bengaliContainers.forEach(container => {
        if (container.textContent && container.textContent.trim().length > 10) {
          const block = container.innerHTML
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<[^>]*>/g, '')
            .trim();
          bengaliBlocks.push(block);
        }
      });

      if (bengaliBlocks.length > 0) {
        bengali = bengaliBlocks.join('\n\n');
        if (bengaliBlocks.length > 1) {
          console.log(`✅ Bengali знайдено: ${bengaliBlocks.length} blocks (combined verse)`);
        } else {
          console.log(`✅ Bengali знайдено: ${bengali.substring(0, 50)}...`);
        }
      }
    } else {
      console.warn('⚠️ Bengali НЕ знайдено через .av-bengali div.text-center');
    }

    // Якщо не знайшли через .av-bengali - шукаємо <r class="verse">
    if (!bengali) {
      const rTags = doc.querySelectorAll('r.verse, r[class*="verse"]');
      if (rTags.length > 0) {
        bengali = rTags[0].textContent?.trim() || '';
        if (bengali) {
          console.log(`✅ Bengali знайдено через <r> тег`);
        }
      }
    }

    // ⚠️ NoI FIX: Якщо все ще не знайшли - шукаємо просто .av-bengali (без вкладеного div)
    if (!bengali) {
      const bengaliDirect = doc.querySelector('.av-bengali');
      if (bengaliDirect) {
        bengali = bengaliDirect.textContent?.trim() || '';
        if (bengali) {
          console.log(`✅ Bengali знайдено через .av-bengali (NoI structure)`);
        }
      }
    }

    if (!bengali) {
      console.warn('⚠️ Bengali НЕ знайдено на сторінці');
    }

    // Transliteration (IAST) - support for combined verses
    let transliteration_en = '';

    // Шукаємо всі блоки .av-verse_text (може бути кілька для об'єднаних віршів)
    const translitContainers = doc.querySelectorAll('.av-verse_text .text-center.italic em');
    if (translitContainers.length > 0) {
      const translitBlocks: string[] = [];
      translitContainers.forEach(element => {
        const block = element.innerHTML
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .trim();
        if (block && block.split(/\s+/).length > 2) {
          translitBlocks.push(block);
        }
      });

      if (translitBlocks.length > 0) {
        transliteration_en = translitBlocks.join('\n\n');
        if (translitBlocks.length > 1) {
          console.log(`✅ Transliteration знайдено: ${translitBlocks.length} blocks (combined verse)`);
        }
      }
    }

    // Synonyms (IAST + English)
    let synonyms_en = '';
    const synonymsContainer = doc.querySelector('.av-synonyms .text-justify');
    if (synonymsContainer) {
      const spans = synonymsContainer.querySelectorAll('span.inline');
      const parts: string[] = [];
      const seen = new Set<string>();

      spans.forEach(span => {
        // ✅ FIX: Skip nested span.inline to avoid duplication
        // Check if parent element (not the span itself) is span.inline
        let parent = span.parentElement;
        while (parent) {
          if (parent.classList.contains('inline') && parent.tagName === 'SPAN') {
            return; // Skip - this is nested span
          }
          parent = parent.parentElement;
        }

        const text = span.textContent?.trim() || '';
        if (text) {
          const cleaned = text.replace(/;\s*$/, '').trim();
          if (cleaned && !seen.has(cleaned)) {
            seen.add(cleaned);
            parts.push(cleaned);
          }
        }
      });

      synonyms_en = parts.join('; ');
    }

    // Translation (English)
    let translation_en = '';
    const translationElement = doc.querySelector('.av-translation strong');
    if (translationElement) {
      translation_en = translationElement.textContent?.trim() || '';
    }

    // Purport (English)
    let purport_en = '';
    const purportContainer = doc.querySelector('.av-purport');
    if (purportContainer) {
      // ✅ FIX: Беремо тільки прямі дочірні <p> щоб уникнути дублювання
      // querySelectorAll(':scope > p') - тільки direct children
      let paragraphs = purportContainer.querySelectorAll(':scope > p');

      // Якщо немає прямих <p>, пробуємо взяти всі <p> (fallback для різних структур)
      if (paragraphs.length === 0) {
        paragraphs = purportContainer.querySelectorAll('p');
      }

      const parts: string[] = [];
      const seen = new Set<string>(); // Додаткова перевірка на дублікати

      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text && text.length > 10 && !seen.has(text)) {
          seen.add(text);
          parts.push(text);
        }
      });

      purport_en = parts.join('\n\n');
    }

    if (!transliteration_en && !translation_en) {
      // Витягуємо verse info з URL
      const urlParts = url.split('/');
      const lila = urlParts[urlParts.length - 3];
      const chapter = urlParts[urlParts.length - 2];
      const verse = urlParts[urlParts.length - 1];
      console.warn(`❌ Vedabase ${lila} ${chapter}:${verse} - не знайдено transliteration/translation для ${url}`);
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
    // Витягуємо verse info з URL для контексту
    const urlParts = url.split('/');
    const lila = urlParts[urlParts.length - 3];
    const chapter = urlParts[urlParts.length - 2];
    const verse = urlParts[urlParts.length - 1];
    console.error(`❌ Помилка парсингу Vedabase (${lila} ${chapter}:${verse}) з ${url}:`, error);
    return null;
  }
}

/**
 * Парсить Gitabase UA сторінку
 */
export function parseGitabaseCC(html: string, url: string): GitabaseData | null {
  const DEBUG = import.meta.env.DEV;

  if (DEBUG) {
    console.log(`[Gitabase DEBUG] parseGitabaseCC called for URL: ${url}`);
    console.log(`[Gitabase DEBUG] HTML length: ${html?.length || 0} chars`);
    console.log(`[Gitabase DEBUG] HTML preview:`, html?.substring(0, 200));
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    if (DEBUG) {
      console.log(`[Gitabase DEBUG] DOM parsed, body exists:`, !!doc.body);
      console.log(`[Gitabase DEBUG] All divs count:`, doc.querySelectorAll('div').length);
    }

    // ⚠️ NOTE: transliteration_ua НЕ парситься з Gitabase!
    // Ми беремо IAST терміни з Vedabase і конвертуємо через convertIASTtoUkrainian()

    let synonyms_ua = '';
    let translation_ua = '';
    let purport_ua = '';

    // ТОЧНІ СЕЛЕКТОРИ З GITABASE (підтверджені користувачем):
    // 1. Синоніми: div.dia_text
    // 2. Переклад: div.row:nth-child(5) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(1) > b:nth-child(1)
    // 3. Пояснення: div.row:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > p (всі параграфи)

    if (DEBUG) console.log('[Gitabase] Parsing with EXACT nth-child selectors from user...');

    // 1. СИНОНІМИ - div.dia_text
    const diaTextEl = doc.querySelector('div.dia_text');
    if (diaTextEl) {
      synonyms_ua = diaTextEl.textContent?.trim() || '';
      if (DEBUG) {
        console.log(`✅ [Gitabase] Found synonyms_ua via div.dia_text (${synonyms_ua.length} chars)`);
        console.log(`   First 200 chars:`, synonyms_ua.substring(0, 200));
      }

      // Перевірка чи не англійські слова (ознака що Puppeteer не виконав JS)
      if (synonyms_ua.includes(' — by ') || synonyms_ua.includes(' — the ') ||
          synonyms_ua.includes(' — of ') || synonyms_ua.includes(' — in ') ||
          synonyms_ua.includes(' — to ')) {
        console.error(`❌ [Gitabase] CRITICAL: synonyms_ua містить англійські слова! Puppeteer НЕ виконав JavaScript!`);
        console.error(`   Edge function повернула статичний HTML замість rendered HTML.`);
        console.error(`   Перевірте чи задеплоїлась оновлена версія fetch-html з Puppeteer!`);
      } else {
        if (DEBUG) console.log(`✅ [Gitabase] synonyms_ua виглядає коректно (українські переклади)`);
      }
    } else {
      console.error('❌ [Gitabase] div.dia_text NOT FOUND - Puppeteer не спрацював або HTML порожній!');
      if (DEBUG) console.error('   Перевірте логи edge function fetch-html для діагностики.');
    }

    // 2. ПЕРЕКЛАД - ТОЧНИЙ селектор
    const translationEl = doc.querySelector('div.row:nth-child(5) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(1) > b:nth-child(1)');
    if (translationEl) {
      translation_ua = translationEl.textContent?.trim() || '';
      if (DEBUG) console.log(`[Gitabase] Found translation_ua via EXACT selector (${translation_ua.length} chars):`, translation_ua.substring(0, 100) + '...');
    } else {
      if (DEBUG) console.warn('[Gitabase] EXACT translation selector NOT FOUND, trying fallback h4 > b');
      // Fallback
      const h4b = doc.querySelector('h4 > b');
      if (h4b) {
        translation_ua = h4b.textContent?.trim() || '';
        if (DEBUG) console.log(`[Gitabase] Found translation_ua via h4>b fallback (${translation_ua.length} chars)`);
      }
    }

    // 3. ПОЯСНЕННЯ - ТОЧНИЙ контейнер, всі параграфи
    const commentaryContainer = doc.querySelector('div.row:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)');
    if (commentaryContainer) {
      // ✅ FIX: Беремо тільки прямі дочірні <p> щоб уникнути дублювання
      let paragraphs = Array.from(commentaryContainer.querySelectorAll(':scope > p'));

      // Якщо немає прямих <p>, беремо всі <p> (fallback)
      if (paragraphs.length === 0) {
        paragraphs = Array.from(commentaryContainer.querySelectorAll('p'));
      }

      if (DEBUG) console.log(`[Gitabase] Found commentary container with ${paragraphs.length} paragraphs`);

      const parts: string[] = [];
      const seen = new Set<string>(); // Додаткова перевірка на дублікати

      paragraphs.forEach(p => {
        const text = p.textContent?.trim() || '';
        if (text.length > 50 && !seen.has(text)) {
          seen.add(text);
          parts.push(text);
        }
      });

      purport_ua = parts.join('\n\n');
      if (DEBUG) console.log(`[Gitabase] Found purport_ua from EXACT selector (${purport_ua.length} chars total, ${parts.length} unique paragraphs)`);
    } else {
      if (DEBUG) console.warn('[Gitabase] EXACT commentary selector NOT FOUND, trying fallback div.row');

      // Fallback - всі div.row
      const rows = Array.from(doc.querySelectorAll('div.row'));
      if (DEBUG) console.log(`[Gitabase] Fallback: Found ${rows.length} div.row elements`);

      const commentaryParts: string[] = [];
      const seen = new Set<string>(); // Перевірка на дублікати

      for (const row of rows) {
        const paragraphs = Array.from(row.querySelectorAll('p'));
        for (const p of paragraphs) {
          const text = p.textContent?.trim() || '';
          if (text.length > 100 && text !== translation_ua && text !== synonyms_ua && !seen.has(text)) {
            seen.add(text);
            commentaryParts.push(text);
          }
        }
      }

      if (commentaryParts.length > 0) {
        purport_ua = commentaryParts.join('\n\n');
        if (DEBUG) console.log(`[Gitabase] Found purport_ua via fallback (${purport_ua.length} chars, ${commentaryParts.length} unique paragraphs)`);
      }
    }

    if (DEBUG) {
      console.log(`[Gitabase] FINAL RESULTS:`, {
        hasSynonyms: !!synonyms_ua,
        hasTranslation: !!translation_ua,
        hasCommentary: !!purport_ua,
        synonymsLength: synonyms_ua.length,
        translationLength: translation_ua.length,
        commentaryLength: purport_ua.length,
      });
    }

    return {
      transliteration_ua: '', // ❌ НЕ використовуємо з Gitabase - конвертуємо з IAST замість цього
      synonyms_ua,
      translation_ua,
      purport_ua
    };

  } catch (error) {
    // Витягуємо verse info з URL для контексту
    const urlParts = url.split('/');
    const lilaNum = urlParts[urlParts.length - 3];
    const chapter = urlParts[urlParts.length - 2];
    const verse = urlParts[urlParts.length - 1];
    console.error(`❌ Помилка парсингу Gitabase (lila ${lilaNum}, ${chapter}:${verse}) з ${url}:`, error);
    return null;
  }
}

// ============================================================================
// MERGE ФУНКЦІЯ
// ============================================================================

/**
 * Об'єднує synonyms з EN (IAST) та UA (українські переклади)
 * 
 * EN: "caitanya — of Śrī Caitanya Mahāprabhu; caraṇa-ambhoja — at the lotus feet"
 * UA: "чайтанья — Шрі Чайтаньї Махапрабгу; чараа-амбгоджа — біля лотосових стіп"
 * 
 * Результат: "чаітанйа — Шрі Чайтаньї Махапрабгу; чаран̣а-амбгоджа — біля лотосових стіп"
 */
function mergeSynonyms(synonyms_en: string, synonyms_ua: string): string {
  if (!synonyms_en) return '';

  console.log('[mergeSynonyms] EN pairs:', synonyms_en.split(';').length);
  console.log('[mergeSynonyms] UA pairs:', synonyms_ua ? synonyms_ua.split(';').length : 0);

  try {
    // Розділяємо на пари
    const enPairs = synonyms_en.split(';').map(p => p.trim()).filter(p => p);
    const uaPairs = synonyms_ua.split(';').map(p => p.trim()).filter(p => p);

    const result: string[] = [];

    for (let i = 0; i < enPairs.length; i++) {
      const enPair = enPairs[i];
      const uaPair = uaPairs[i] || '';

      // Витягуємо термін IAST (до '—')
      const enParts = enPair.split('—').map(p => p.trim());
      const iastTerm = enParts[0] || '';

      // Конвертуємо IAST термін в українську кирилицю (з маленької літери, "нйа")
      const ukrainianTerm = convertIASTtoUkrainian(iastTerm).toLowerCase();

      // Витягуємо український переклад (після '—') ТІЛЬКИ з Gitabase
      let uaTranslation = '';
      if (uaPair) {
        const uaParts = uaPair.split('—').map(p => p.trim());
        uaTranslation = uaParts[1] || ''; // ✅ БЕЗ fallback на англійський!
      }

      // ❌ ВИДАЛЕНО fallback на англійський - краще порожній рядок, ніж маскувати проблему!
      if (!uaTranslation) {
        console.error(`❌ [mergeSynonyms] Missing UA translation for term ${i+1}/${enPairs.length}: "${iastTerm}"`);
        console.error(`   Gitabase parsing may have failed - check if Ukrainian synonyms were properly fetched`);
        // НЕ підставляти англійський - краще порожній рядок і побачити помилку!
        // uaTranslation залишається порожнім ''
      }

      // Об'єднуємо
      if (ukrainianTerm && uaTranslation) {
        result.push(`${ukrainianTerm} — ${uaTranslation}`);
      } else if (ukrainianTerm) {
        result.push(ukrainianTerm);
      }
    }

    return result.join('; ');

  } catch (error) {
    console.error('❌ Помилка mergeSynonyms:', error);
    // Fallback: просто конвертуємо англійські терміни
    return convertIASTtoUkrainian(synonyms_en).toLowerCase();
  }
}

/**
 * Головна функція об'єднання Vedabase + Gitabase
 */
export function mergeVedabaseAndGitabase(
  vedabase: VedabaseData | null,
  gitabase: GitabaseData | null,
  lila: string,
  chapter: number,
  verse: number | string,
  vedabaseUrl: string,
  gitabaseUrl: string
): MergedVerseData | null {

  if (!vedabase) {
    console.warn(`❌ Немає даних Vedabase для ${lila} ${chapter}:${verse} (${vedabaseUrl})`);
    return null;
  }
  
  // Транслітерація UA: конвертуємо з IAST (Gitabase часто зіпсована)
  const transliteration_ua = convertIASTtoUkrainian(vedabase.transliteration_en);
  
  // Synonyms UA: об'єднуємо IAST терміни (конвертовані) + українські переклади
  const synonyms_ua = mergeSynonyms(
    vedabase.synonyms_en,
    gitabase?.synonyms_ua || ''
  );
  
  // ✅ Нормалізуємо ТІЛЬКИ праву частину synonyms_ua (переклади), НЕ ліву (транслітерацію)
  const normalizedSynonymsUa = synonyms_ua.split(';').map(pair => {
    const parts = pair.split('—').map(p => p.trim());
    if (parts.length === 2) {
      const term = parts[0]; // транслітерація - БЕЗ нормалізації
      const translation = normalizeVerseField(parts[1], 'translation'); // переклад - З нормалізацією
      return `${term} — ${translation}`;
    }
    return pair; // якщо немає —, залишаємо як є
  }).join('; ');

  // Застосовуємо нормалізацію
  const merged: MergedVerseData = {
    bengali: normalizeVerseField(vedabase.bengali, 'sanskrit'),
    transliteration_en: vedabase.transliteration_en, // IAST без змін
    transliteration_ua: transliteration_ua, // ✅ БЕЗ нормалізації слів! (тільки діакритика)
    synonyms_en: vedabase.synonyms_en, // IAST без змін
    synonyms_ua: normalizedSynonymsUa, // ✅ Нормалізовані ТІЛЬКИ переклади, НЕ терміни
    translation_en: normalizeVerseField(vedabase.translation_en, 'translation'),
    translation_ua: normalizeVerseField(gitabase?.translation_ua || '', 'translation'),
    purport_en: normalizeVerseField(vedabase.purport_en, 'commentary'),
    purport_ua: normalizeVerseField(gitabase?.purport_ua || '', 'commentary'),
    lila,
    chapter,
    verse,
    source_url_vedabase: vedabaseUrl,
    source_url_gitabase: gitabaseUrl
  };
  
  console.log(`✅ Merged verse: ${lila} ${chapter}:${verse}`, {
    hasVedabase: !!vedabase,
    hasGitabase: !!gitabase,
    hasTranslationUA: !!gitabase?.translation_ua,
    hasSynonymsUA: !!gitabase?.synonyms_ua
  });

  return merged;
}

// ============================================================================
// URL ГЕНЕРАТОРИ
// ============================================================================

export function generateVedabaseURL(lila: string, chapter: number, verse: number | string): string {
  return `https://vedabase.io/en/library/cc/${lila}/${chapter}/${verse}`;
}

export function generateGitabaseURL(lilaNum: number, chapter: number, verse: number | string): string {
  return `https://gitabase.com/ua/CC/${lilaNum}/${chapter}/${verse}`;
}
