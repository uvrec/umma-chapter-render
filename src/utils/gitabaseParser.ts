/**
 * ✅ РЕАЛЬНИЙ ПАРСЕР Gitabase Chaitanya-charitamrita
 * Основано на аналізі https://gitabase.com/uk/CC/1/1/1
 * 
 * КРИТИЧНО: ВСІ ТЕКСТИ з Gitabase потребують нормалізації:
 * - convertIASTtoUkrainian() для транслітерації
 * - normalizeText() для всіх українських текстів
 */

import { convertIASTtoUkrainian, normalizeVerseField } from './textNormalizer';

interface GitabaseVerseData {
  transliteration_uk: string; // Транслітерація ПІСЛЯ normalizeText + convertIASTtoUkrainian
  synonyms_uk: string;         // Послівний переклад ПІСЛЯ normalizeText
  translation_uk: string;      // Переклад ПІСЛЯ normalizeText
  commentary_uk: string;          // Пояснення ПІСЛЯ normalizeText
  lila: string;                // '1'=Adi, '2'=Madhya, '3'=Antya
  chapter: number;
  verse: number | string;      // ✅ може бути "263-264" для складених віршів
  source_url: string;
}

/**
 * Парсить сторінку Gitabase CC verse
 * @param html - HTML контент сторінки
 * @param url - URL сторінки (напр: https://gitabase.com/uk/CC/1/1/1)
 * @returns Структуровані дані вірша
 */
export function parseGitabaseCC(html: string, url: string): GitabaseVerseData | null {
  try {
    // Створюємо DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Витягуємо lila, chapter, verse з URL
    // URL формат: https://gitabase.com/uk/CC/1/1/1
    // або https://gitabase.com/uk/CC/1/1/263-264 для складених віршів
    const urlParts = url.split('/');
    const lilaNum = urlParts[urlParts.length - 3]; // '1', '2', '3'
    const chapter = parseInt(urlParts[urlParts.length - 2]);
    const verseStr = urlParts[urlParts.length - 1];
    // ✅ Підтримка складених віршів: зберігаємо як string якщо містить дефіс
    const verse = verseStr.includes('-') ? verseStr : parseInt(verseStr);

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

    // 1. ТРАНСЛІТЕРАЦІЯ - ✅ ВИПРАВЛЕНО: збираємо ВСІ блоки (для composite verses)
    // Розпізнаємо по латинських літерах з діакритикою
    const transliterationParts: string[] = [];
    for (let i = textBlocks.length - 1; i >= 0; i--) {
      const block = textBlocks[i];
      if (/[āīūṛṣṭḍṇśñṅṁḥ]/.test(block) && /^[a-zA-Zāīūṛṣṭḍṇśñṅṁḥ\s\-'']+$/.test(block)) {
        transliterationParts.unshift(block); // Додаємо на початок щоб зберегти порядок
        textBlocks.splice(i, 1); // Видаляємо з масиву
      }
    }
    transliteration_raw = transliterationParts.join('\n');
    if (transliterationParts.length > 1) {
      console.log(`📝 Знайдено ${transliterationParts.length} блоків транслітерації (composite verse)`);
    }

    // 2. ПОСЛІВНИЙ - ✅ ВИПРАВЛЕНО: збираємо ВСІ блоки (для composite verses)
    const synonymsParts: string[] = [];
    for (let i = textBlocks.length - 1; i >= 0; i--) {
      const block = textBlocks[i];
      if (block.includes(' — ') && block.length < 500) {
        synonymsParts.unshift(block); // Додаємо на початок щоб зберегти порядок
        textBlocks.splice(i, 1);
      }
    }
    synonyms_raw = synonymsParts.join('; ');
    if (synonymsParts.length > 1) {
      console.log(`📖 Знайдено ${synonymsParts.length} блоків синонімів (composite verse)`);
    }

    // 3. ПЕРЕКЛАД - ✅ ВИПРАВЛЕНО: збираємо ВСІ блоки перекладу (для composite verses)
    const textIndex = textBlocks.findIndex(b => b === 'Текст' || b.trim() === 'Текст');
    const translationParts: string[] = [];

    if (textIndex !== -1) {
      // Після заголовка "Текст" можуть бути декілька блоків перекладу
      textBlocks.splice(textIndex, 1); // Видаляємо заголовок

      // Збираємо всі короткі блоки після заголовка (до наступного заголовка)
      while (textBlocks.length > 0) {
        const block = textBlocks[0];
        // Якщо це новий заголовок - зупиняємось
        if (block === 'Комментарий' || block.includes('Комментарий')) {
          break;
        }
        // Якщо це схоже на переклад (100-1000 символів) - додаємо
        if (block.length > 100 && block.length < 1000) {
          translationParts.push(block);
          textBlocks.splice(0, 1);
        } else {
          break;
        }
      }
    } else {
      // Fallback: шукаємо короткі блоки (100-600 символів)
      for (let i = textBlocks.length - 1; i >= 0; i--) {
        const block = textBlocks[i];
        if (block.length > 100 && block.length < 600) {
          translationParts.unshift(block);
          textBlocks.splice(i, 1);
        }
      }
    }

    translation_raw = translationParts.join(' '); // Об'єднуємо через пробіл
    if (translationParts.length > 1) {
      console.log(`📄 Знайдено ${translationParts.length} блоків перекладу (composite verse)`);
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
    const transliteration_uk = transliteration_raw 
      ? normalizeVerseField(convertIASTtoUkrainian(transliteration_raw), 'transliteration')
      : '';

    // Послівний: українська нормалізація
    const synonyms_uk = synonyms_raw 
      ? normalizeVerseField(synonyms_raw, 'synonyms')
      : '';

    // Переклад: українська нормалізація
    const translation_uk = translation_raw 
      ? normalizeVerseField(translation_raw, 'translation')
      : '';

    // Пояснення: українська нормалізація
    const commentary_uk = purport_raw 
      ? normalizeVerseField(purport_raw, 'commentary')
      : '';

    // Перевірка
    if (!transliteration_uk && !translation_uk) {
      console.warn(`❌ Gitabase ${lila} ${chapter}:${verse} - не знайдено transliteration і translation для ${url}`);
      return null;
    }

    return {
      transliteration_uk,
      synonyms_uk,
      translation_uk,
      commentary_uk,
      lila,
      chapter,
      verse,
      source_url: url
    };

  } catch (error) {
    // Витягуємо verse info з URL для контексту
    const urlParts = url.split('/');
    const lilaNum = urlParts[urlParts.length - 3];
    const chapter = urlParts[urlParts.length - 2];
    const verse = urlParts[urlParts.length - 1];
    console.error(`❌ Помилка парсингу Gitabase CC (lila ${lilaNum}, ${chapter}:${verse}) з ${url}:`, error);
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
  return `https://gitabase.com/uk/CC/${lilaNum}/${chapter}/${verse}`;
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
    console.error('❌ Gitabase - Помилка визначення maxVerse:', error);
    return 0;
  }
}
