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
        const parentSpan = span.parentElement?.closest('span.inline');
        if (parentSpan && parentSpan !== span) {
          return; // Skip nested span
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

    // Транслітерація UA (може бути зіпсована без діакритик)
    let transliteration_ua = '';
    const translitUaElement = doc.querySelector('.av-verse_text .text-center.italic em');
    if (translitUaElement) {
      transliteration_ua = translitUaElement.innerHTML
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();
    }

    // Послівний переклад UA (може бути зіпсований)
    let synonyms_ua = '';
    const synonymsUaContainer = doc.querySelector('.av-synonyms .text-justify');
    if (synonymsUaContainer) {
      const spans = synonymsUaContainer.querySelectorAll('span.inline');
      const parts: string[] = [];

      spans.forEach(span => {
        // ✅ FIX: Skip nested span.inline to avoid duplication
        const parentSpan = span.parentElement?.closest('span.inline');
        if (parentSpan && parentSpan !== span) {
          return; // Skip nested span
        }

        const text = span.textContent?.trim() || '';
        if (text) {
          const cleaned = text.replace(/;\s*$/, '').trim();
          if (cleaned) {
            parts.push(cleaned);
          }
        }
      });

      synonyms_ua = parts.join('; ');
    }

    // Літературний переклад UA
    let translation_ua = '';
    const translationUaElement = doc.querySelector('.av-translation strong');
    if (translationUaElement) {
      translation_ua = translationUaElement.textContent?.trim() || '';
    }

    // Пояснення UA
    let purport_ua = '';
    const purportUaContainer = doc.querySelector('.av-purport');
    if (purportUaContainer) {
      const paragraphs = purportUaContainer.querySelectorAll('p, div');
      const parts: string[] = [];
      
      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text && text.length > 10) {
          parts.push(text);
        }
      });
      
      purport_ua = parts.join('\n\n');
    }

    return {
      transliteration_ua,
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
      
      // Витягуємо український переклад (після '—')
      let uaTranslation = '';
      if (uaPair) {
        const uaParts = uaPair.split('—').map(p => p.trim());
        uaTranslation = uaParts[1] || enParts[1] || ''; // fallback на англійський якщо немає українського
      } else {
        uaTranslation = enParts[1] || '';
      }
      
      // Конвертуємо IAST термін в українську кирилицю
      const ukrainianTerm = convertIASTtoUkrainian(iastTerm);
      
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
    return convertIASTtoUkrainian(synonyms_en);
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
  
  // Застосовуємо нормалізацію
  const merged: MergedVerseData = {
    bengali: normalizeVerseField(vedabase.bengali, 'sanskrit'),
    transliteration_en: vedabase.transliteration_en, // IAST без змін
    transliteration_ua: normalizeVerseField(transliteration_ua, 'transliteration_ua'),
    synonyms_en: vedabase.synonyms_en, // IAST без змін (тільки видалення дублікатів вже зроблено в parseVedabaseCC)
    synonyms_ua: normalizeVerseField(synonyms_ua, 'synonyms'),
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
  return `https://gitabase.com/ukr/CC/${lilaNum}/${chapter}/${verse}`;
}
