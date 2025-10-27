/**
 * ✅ РЕАЛЬНИЙ ПАРСЕР Gitabase Chaitanya-charitamrita
 * Основано на аналізі https://gitabase.com/ukr/CC/1/1/1
 * 
 * КРИТИЧНО: ВСІ ТЕКСТИ з Gitabase потребують нормалізації:
 * - convertIASTtoUkrainian() для транслітерації
 * - normalizeText() для всіх українських текстів
 */

import { convertIASTtoUkrainian, normalizeVerseField } from './textNormalizer';

interface GitabaseVerseData {
  transliteration_ua: string; // Транслітерація ПІСЛЯ normalizeText + convertIASTtoUkrainian
  synonyms_ua: string;         // Послівний переклад ПІСЛЯ normalizeText
  translation_ua: string;      // Переклад ПІСЛЯ normalizeText
  purport_ua: string;          // Пояснення ПІСЛЯ normalizeText
  lila: string;                // '1'=Adi, '2'=Madhya, '3'=Antya
  chapter: number;
  verse: number;
  source_url: string;
}

/**
 * Парсить сторінку Gitabase CC verse
 * @param html - HTML контент сторінки
 * @param url - URL сторінки (напр: https://gitabase.com/ukr/CC/1/1/1)
 * @returns Структуровані дані вірша
 */
export function parseGitabaseCC(html: string, url: string): GitabaseVerseData | null {
  try {
    // Створюємо DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Витягуємо lila, chapter, verse з URL
    // URL формат: https://gitabase.com/ukr/CC/1/1/1
    const urlParts = url.split('/');
    const lilaNum = urlParts[urlParts.length - 3]; // '1', '2', '3'
    const chapter = parseInt(urlParts[urlParts.length - 2]);
    const verse = parseInt(urlParts[urlParts.length - 1]);

    // Мапінг: '1'→'adi', '2'→'madhya', '3'→'antya'
    const lilaMap: Record<string, string> = {
      '1': 'adi',
      '2': 'madhya',
      '3': 'antya'
    };
    const lila = lilaMap[lilaNum] || 'unknown';

    // Gitabase структура: БЕЗІМЕННІ блоки тексту
    // 1. Транслітерація - перший блок тексту (IAST латиниця)
    // 2. Послівний - другий блок (українською)
    // 3. "Текст" → Переклад (заголовок "Текст", потім текст)
    // 4. "Комментарий" → Пояснення (заголовок "Комментарий", потім довгий текст)

    // Шукаємо всі текстові блоки - зазвичай це параграфи або div
    const allElements = doc.querySelectorAll('p, blockquote, div');
    const textBlocks: string[] = [];

    // Збираємо текстові блоки, які не є навігацією
    allElements.forEach(el => {
      const text = el.textContent?.trim() || '';
      // Фільтруємо: не менше 15 символів, не навігаційні посилання
      if (text.length > 15 && 
          !text.includes('<<') && 
          !text.includes('>>') &&
          !text.includes('gitabase.com') &&
          !el.querySelector('a[href*="/CC/"]')) {
        textBlocks.push(text);
      }
    });

    // Витягуємо структурні елементи
    let transliteration_raw = '';
    let synonyms_raw = '';
    let translation_raw = '';
    let purport_raw = '';

    // 1. ТРАНСЛІТЕРАЦІЯ - перший блок (IAST латиниця)
    // Розпізнаємо по латинських літерах з діакритикою
    for (let i = 0; i < textBlocks.length; i++) {
      const block = textBlocks[i];
      if (/[āīūṛṣṭḍṇśñṅṁḥ]/.test(block) && /^[a-zA-Zāīūṛṣṭḍṇśñṅṁḥ\s\-'']+$/.test(block)) {
        transliteration_raw = block;
        textBlocks.splice(i, 1); // Видаляємо з масиву
        break;
      }
    }

    // 2. ПОСЛІВНИЙ - другий блок (містить — з тире)
    for (let i = 0; i < textBlocks.length; i++) {
      const block = textBlocks[i];
      if (block.includes(' — ') && block.length < 500) {
        synonyms_raw = block;
        textBlocks.splice(i, 1);
        break;
      }
    }

    // 3. ПЕРЕКЛАД - шукаємо "Текст" (заголовок) або короткий блок
    const textIndex = textBlocks.findIndex(b => b === 'Текст' || b.trim() === 'Текст');
    if (textIndex !== -1 && textIndex + 1 < textBlocks.length) {
      translation_raw = textBlocks[textIndex + 1];
      textBlocks.splice(textIndex, 2); // Видаляємо заголовок і текст
    } else {
      // Якщо немає заголовка, шукаємо короткий блок (100-600 символів)
      for (let i = 0; i < textBlocks.length; i++) {
        const block = textBlocks[i];
        if (block.length > 100 && block.length < 600) {
          translation_raw = block;
          textBlocks.splice(i, 1);
          break;
        }
      }
    }

    // 4. ПОЯСНЕННЯ - шукаємо "Комментарий" або решта тексту (довгий)
    const purportIndex = textBlocks.findIndex(b => b === 'Комментарий' || b.includes('Комментарий'));
    if (purportIndex !== -1) {
      // Збираємо всі блоки після "Комментарий"
      const purportParts = textBlocks.slice(purportIndex + 1);
      purport_raw = purportParts.join('\n\n');
    } else {
      // Якщо немає заголовка, беремо решту довгих блоків
      purport_raw = textBlocks.filter(b => b.length > 200).join('\n\n');
    }

    // ============ НОРМАЛІЗАЦІЯ - КРИТИЧНО! ============
    
    // Транслітерація: IAST → українська кирилиця, потім normalizeVerseField
    const transliteration_ua = transliteration_raw 
      ? normalizeVerseField(convertIASTtoUkrainian(transliteration_raw), 'transliteration')
      : '';

    // Послівний: українська нормалізація
    const synonyms_ua = synonyms_raw 
      ? normalizeVerseField(synonyms_raw, 'synonyms')
      : '';

    // Переклад: українська нормалізація
    const translation_ua = translation_raw 
      ? normalizeVerseField(translation_raw, 'translation')
      : '';

    // Пояснення: українська нормалізація
    const purport_ua = purport_raw 
      ? normalizeVerseField(purport_raw, 'commentary')
      : '';

    // Перевірка
    if (!transliteration_ua && !translation_ua) {
      console.warn('Не знайдено transliteration і translation для', url);
      return null;
    }

    return {
      transliteration_ua,
      synonyms_ua,
      translation_ua,
      purport_ua,
      lila,
      chapter,
      verse,
      source_url: url
    };

  } catch (error) {
    console.error('Помилка парсингу Gitabase CC:', error);
    return null;
  }
}

/**
 * Генерує URL для Gitabase CC verse
 * @param lila - 'adi', 'madhya', 'antya' або '1', '2', '3'
 * @param chapter - номер глави
 * @param verse - номер вірша
 * @returns URL
 */
export function generateGitabaseURL(lila: string | number, chapter: number, verse: number): string {
  // Конвертуємо lila в номер
  const lilaMap: Record<string, string> = {
    'adi': '1',
    'madhya': '2',
    'antya': '3',
    '1': '1',
    '2': '2',
    '3': '3'
  };
  
  const lilaNum = lilaMap[lila.toString().toLowerCase()] || '1';
  return `https://gitabase.com/ukr/CC/${lilaNum}/${chapter}/${verse}`;
}

/**
 * Витягує максимальний номер вірша з сторінки глави
 * @param html - HTML контент сторінки глави
 * @returns максимальний номер вірша
 */
export function getMaxVerseFromGitabaseChapter(html: string): number {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Шукаємо всі посилання на вірші
    const verseLinks = doc.querySelectorAll('a[href*="/CC/"]');
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
