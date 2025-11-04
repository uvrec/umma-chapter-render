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
    'ā': 'а̄', 'ī': 'і̄', 'ū': 'ӯ', 'ṝ': 'р̣̄',
    'Ā': 'А̄', 'Ī': 'І̄', 'Ū': 'Ӯ', 'Ṝ': 'Р̣̄',
    
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

    // Bengali/Sanskrit text - correct selector for all CC lilas
    let bengali = '';
    // Bengali is in .av-bengali container with text-center class
    const bengaliContainer = doc.querySelector('.av-bengali div.text-center');
    if (bengaliContainer && bengaliContainer.textContent) {
      bengali = bengaliContainer.innerHTML
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]*>/g, '')
        .trim();
      console.log(`✅ Bengali знайдено: ${bengali.substring(0, 50)}...`);
    } else {
      console.warn('⚠️ Bengali НЕ знайдено на сторінці');
    }
    
    // Якщо не знайшли через селектори - шукаємо <r class="verse">
    if (!bengali) {
      const rTags = doc.querySelectorAll('r.verse, r[class*="verse"]');
      if (rTags.length > 0) {
        bengali = rTags[0].textContent?.trim() || '';
        if (bengali) {
          console.log(`✅ Bengali знайдено через <r> тег`);
        }
      }
    }

    // Transliteration (IAST)
    let transliteration_en = '';
    const translitElement = doc.querySelector('.av-verse_text .text-center.italic em');
    if (translitElement) {
      transliteration_en = translitElement.innerHTML
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();
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
      const paragraphs = purportContainer.querySelectorAll('p, div');
      const parts: string[] = [];
      
      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text && text.length > 10) {
          parts.push(text);
        }
      });
      
      purport_en = parts.join('\n\n');
    }

    if (!transliteration_en && !translation_en) {
      console.warn('❌ Vedabase: не знайдено transliteration/translation для', url);
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
    console.error('Помилка парсингу Vedabase:', error);
    return null;
  }
}

/**
 * Парсить Gitabase UA сторінку
 */
export function parseGitabaseCC(html: string, url: string): GitabaseData | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // ⚠️ NOTE: transliteration_ua НЕ парситься з Gitabase!
    // Ми беремо IAST терміни з Vedabase і конвертуємо через convertIASTtoUkrainian()
    // Gitabase має зіпсовану транслітерацію без діакритик - не використовуємо!

    let synonyms_ua = '';
    let translation_ua = '';
    let purport_ua = '';

    // GITABASE СТРУКТУРА: Є КІЛЬКА .dia_text блоків у різному порядку
    // - Блок 1: Word-by-word (synonyms) - багато <i> тегів (>5), містить — та ;
    // - Блок 2: Translation - середній розмір (80-700 chars), один параграф
    // - Блок 3+: Commentary - все інше, може бути дуже довгим

    const diaBlocks = Array.from(doc.querySelectorAll('div.dia_text'));
    console.log(`[Gitabase] Found ${diaBlocks.length} .dia_text blocks`);

    // Класифікуємо кожен блок
    interface Block {
      index: number;
      text: string;
      length: number;
      hasItalics: boolean;
      italicCount: number;
      element: Element;
    }

    const blocks: Block[] = [];

    diaBlocks.forEach((div, idx) => {
      const text = div.textContent?.trim() || '';
      const hasCyrillic = /[\u0400-\u04FF]/.test(text);

      // Беремо тільки блоки з кирилицею (українською) та достатньо довгі
      if (hasCyrillic && text.length > 20) {
        const italics = div.querySelectorAll('i');
        blocks.push({
          index: idx,
          text,
          length: text.length,
          hasItalics: italics.length > 5,
          italicCount: italics.length,
          element: div
        });
      }
    });

    console.log(`[Gitabase] Classified ${blocks.length} Cyrillic blocks`);

    // Проходимо по блоках і класифікуємо їх
    for (const block of blocks) {
      // 1. SYNONYMS: багато <i> тегів, містить —, має ;, не занадто довгий
      if (!synonyms_ua && block.hasItalics) {
        const hasDashes = block.text.includes('—');
        const hasSemicolons = block.text.includes(';');
        const notTooLong = block.length < 2000;

        if (hasDashes && hasSemicolons && notTooLong && block.italicCount > 5) {
          synonyms_ua = block.text;
          console.log(`[Gitabase] Found synonyms_ua (${block.italicCount} <i> tags, ${block.length} chars):`, synonyms_ua.substring(0, 100) + '...');
          continue;
        }
      }

      // 2. TRANSLATION: середній розмір, НЕ багато — та ;
      if (!translation_ua && block.length >= 80 && block.length <= 700) {
        const dashCount = (block.text.match(/—/g) || []).length;
        const semicolonCount = (block.text.match(/;/g) || []).length;

        // Skip якщо це схоже на word-by-word (багато — та ;)
        if (dashCount > 3 && semicolonCount > 3) {
          continue;
        }

        // Skip якщо багато параграфів (це commentary)
        const pCount = block.element.querySelectorAll('p').length;
        if (pCount <= 2) {
          translation_ua = block.text;
          console.log(`[Gitabase] Found translation_ua (${block.length} chars):`, translation_ua.substring(0, 100) + '...');
          continue;
        }
      }

      // 3. COMMENTARY: все інше (після того як знайшли translation)
      if (translation_ua) {
        const dashCount = (block.text.match(/—/g) || []).length;
        const semicolonCount = (block.text.match(/;/g) || []).length;

        // Skip word-by-word blocks
        if (dashCount > 3 && semicolonCount > 3) {
          continue;
        }

        // Skip якщо це той самий блок що й translation
        if (block.text === translation_ua) {
          continue;
        }

        // Skip якщо блок занадто короткий для commentary
        if (block.length < 100) {
          continue;
        }

        // Витягуємо параграфи
        let commentaryText = block.text;

        // Видаляємо "ПОЯСНЕННЯ:" з початку
        if (commentaryText.startsWith('ПОЯСНЕННЯ:')) {
          commentaryText = commentaryText.substring('ПОЯСНЕННЯ:'.length).trim();
          console.log(`[Gitabase] Removed 'ПОЯСНЕННЯ:' marker from commentary`);
        }

        // Якщо вже є commentary - додаємо
        if (purport_ua) {
          purport_ua += '\n\n' + commentaryText;
        } else {
          purport_ua = commentaryText;
        }

        console.log(`[Gitabase] Found commentary block (${block.length} chars)`);
      }
    }

    // Fallback для translation якщо не знайдено
    if (!translation_ua) {
      const allParas = Array.from(doc.querySelectorAll('p, div'));
      for (const p of allParas) {
        const text = p.textContent?.trim() || '';
        const hasCyrillic = /[\u0400-\u04FF]/.test(text);

        if (hasCyrillic && text.length >= 80 && text.length <= 700) {
          const dashCount = (text.match(/—/g) || []).length;
          const semicolonCount = (text.match(/;/g) || []).length;

          // Skip word-by-word pattern
          if (dashCount > 3 && semicolonCount > 3) {
            continue;
          }

          translation_ua = text;
          console.log(`[Gitabase] Found translation_ua via fallback:`, translation_ua.substring(0, 100) + '...');
          break;
        }
      }
    }

    console.log(`[Gitabase] FINAL RESULTS:`, {
      hasSynonyms: !!synonyms_ua,
      hasTranslation: !!translation_ua,
      hasCommentary: !!purport_ua,
      synonymsLength: synonyms_ua.length,
      translationLength: translation_ua.length,
      commentaryLength: purport_ua.length,
    });

    return {
      transliteration_ua: '', // ❌ НЕ використовуємо з Gitabase - конвертуємо з IAST замість цього
      synonyms_ua,
      translation_ua,
      purport_ua
    };

  } catch (error) {
    console.error('Помилка парсингу Gitabase:', error);
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

      // ⚠️ ТИМЧАСОВИЙ fallback на англійський (поки Gitabase не парситься правильно)
      if (!uaTranslation) {
        console.warn(`[mergeSynonyms] Missing UA translation for term ${i+1}/${enPairs.length}: ${iastTerm}`);
        uaTranslation = enParts[1] || ''; // fallback на англійський
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
    console.error('Помилка mergeSynonyms:', error);
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
    console.warn('❌ Немає даних Vedabase для', vedabaseUrl);
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
  
  console.log('✅ Merged verse:', { lila, chapter, verse });
  
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
