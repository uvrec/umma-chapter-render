// FIXED Parser for bhaktivinodainstitute.org
// Правильно парсить структуру: (номер) транслітерація номер) переклад

export interface BhaktivinodaVerse {
  verse_number: string;
  sanskrit?: string;
  transliteration_en?: string;
  transliteration_ua?: string;
  synonyms_en?: string;
  synonyms_ua?: string;
  translation_en?: string;
  translation_ua?: string;
  commentary_en?: string;
  commentary_ua?: string;
}

export interface BhaktivinodaSong {
  song_number: number;
  title_en?: string;
  title_ua?: string;
  verses: BhaktivinodaVerse[];
}

/**
 * Parse bhaktivinoda institute page
 *
 * Структура на сайті:
 * (1)
 * transliteration line 1
 * transliteration line 2
 * 1) English translation here
 *
 * (2)
 * transliteration lines
 * 2) English translation
 *
 * (3-4)  ← подвійний номер = ДВА окремі вірші!
 * transliteration for verse 3
 * transliteration for verse 4
 * 3-4) English translation for both verses
 */
export function parseBhaktivinodaPage(html: string, url: string): BhaktivinodaSong[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Витягуємо весь текстовий контент
    const body = doc.body.textContent || '';

    return parseTextContent(body);
  } catch (error) {
    console.error('Error parsing bhaktivinoda page:', error);
    return [];
  }
}

/**
 * Парсинг текстового контенту
 */
function parseTextContent(text: string): BhaktivinodaSong[] {
  const verses: BhaktivinodaVerse[] = [];

  // Розбиваємо на блоки по номерах в дужках: (1), (2), (3-4), etc.
  const verseBlocks = text.split(/\n\(/).filter(block => block.trim());

  // Перший блок може бути заголовок, пропускаємо якщо не починається з цифри
  const startIndex = verseBlocks[0].match(/^\d/) ? 0 : 1;

  for (let i = startIndex; i < verseBlocks.length; i++) {
    const block = verseBlocks[i].trim();
    if (!block) continue;

    // Знаходимо номер вірша в початку блоку
    const verseNumMatch = block.match(/^(\d+(?:-\d+)?)\)/);
    if (!verseNumMatch) continue;

    const verseNumber = verseNumMatch[1]; // "1" або "3-4"

    // Витягуємо текст після номера
    const content = block.substring(verseNumMatch[0].length).trim();

    // Розділяємо на транслітерацію і переклад
    // Переклад починається з "номер) " - наприклад "1) " або "3-4) "
    const translationMatch = content.match(new RegExp(`\\n${verseNumber.replace('-', '-')}\\)\\s+(.+)`, 's'));

    if (!translationMatch) {
      // Якщо не знайшли переклад, весь блок = транслітерація
      verses.push({
        verse_number: verseNumber,
        transliteration_en: content.trim(),
        translation_en: ''
      });
      continue;
    }

    // Транслітерація = все до перекладу
    const transliterationEnd = content.indexOf(`\n${verseNumber})`);
    const transliteration = content.substring(0, transliterationEnd).trim();
    const translation = translationMatch[1].trim();

    // Перевіряємо чи це подвійний номер (3-4)
    if (verseNumber.includes('-')) {
      const [start, end] = verseNumber.split('-').map(n => parseInt(n));

      // Розділяємо транслітерацію на рядки
      const transLines = transliteration.split('\n').map(l => l.trim()).filter(l => l);

      // Якщо транслітерація має парну кількість рядків, ділимо порівну
      const linesPerVerse = Math.ceil(transLines.length / (end - start + 1));

      for (let v = start; v <= end; v++) {
        const startLine = (v - start) * linesPerVerse;
        const endLine = Math.min(startLine + linesPerVerse, transLines.length);
        const verseTrans = transLines.slice(startLine, endLine).join('\n');

        verses.push({
          verse_number: v.toString(),
          transliteration_en: verseTrans,
          translation_en: translation // Обидва вірші діляться одним перекладом
        });
      }
    } else {
      // Звичайний одинарний вірш
      verses.push({
        verse_number: verseNumber,
        transliteration_en: transliteration,
        translation_en: translation
      });
    }
  }

  if (verses.length === 0) {
    return [];
  }

  // Повертаємо як одну пісню з усіма віршами
  return [{
    song_number: 1,
    verses: verses
  }];
}

/**
 * Отримати назву пісні зі сторінки
 */
export function getBhaktivinodaTitle(html: string): { title_en: string; title_ua?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Шукаємо h1 або title
    const h1 = doc.querySelector('h1');
    const titleTag = doc.querySelector('title');

    let title_en = 'Untitled';

    if (h1?.textContent) {
      title_en = h1.textContent.trim();
    } else if (titleTag?.textContent) {
      title_en = titleTag.textContent.trim();
      // Видаляємо " - Bhaktivinoda Institute" якщо є
      title_en = title_en.replace(/\s*-\s*Bhaktivinoda Institute\s*$/i, '');
    }

    // Витягуємо номер пісні якщо є: "Dainya Song One" → "Song 1"
    const songMatch = title_en.match(/Song\s+(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|\d+)/i);
    if (songMatch) {
      const wordToNum: Record<string, string> = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
        'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
        'eleven': '11', 'twelve': '12', 'thirteen': '13'
      };
      const num = wordToNum[songMatch[1].toLowerCase()] || songMatch[1];
      title_en = `Song ${num}`;
    }

    return { title_en };
  } catch {
    return { title_en: 'Untitled' };
  }
}

/**
 * Конвертація в формат бази даних
 */
export function bhaktivinodaSongToChapter(song: BhaktivinodaSong, chapterNumber: number) {
  return {
    chapter_number: chapterNumber,
    title_en: song.title_en || `Song ${song.song_number}`,
    title_ua: song.title_ua || `Пісня ${song.song_number}`,
    chapter_type: 'verses' as const,
    verses: song.verses.map(v => ({
      verse_number: v.verse_number,
      sanskrit: v.sanskrit || '',
      transliteration_en: v.transliteration_en || '',
      transliteration_ua: v.transliteration_ua || '',
      synonyms_en: v.synonyms_en || '',
      synonyms_ua: v.synonyms_ua || '',
      translation_en: v.translation_en || '',
      translation_ua: v.translation_ua || '',
      commentary_en: v.commentary_en || '',
      commentary_ua: v.commentary_ua || '',
    }))
  };
}
