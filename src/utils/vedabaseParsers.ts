/**
 * vedabaseParsers.ts
 * Утиліти для парсингу та нормалізації номерів віршів
 * Підтримує прості вірші (наприклад, "5", "16.5") та складені (наприклад, "256-266")
 */

export interface ParsedVerseNumber {
  isComposite: boolean;
  startVerse: number;
  endVerse: number;
  displayNumber: string;
  sortKey: number;
  verseCount: number;
}

/**
 * Парсить номер вірша та визначає чи це складений вірш
 *
 * @param verseNumber - Номер вірша (наприклад, "256-266", "16.5", "42")
 * @returns ParsedVerseNumber - Розібраний об'єкт з інформацією про вірш
 *
 * @example
 * parseVerseNumber('256-266')
 * // → {isComposite: true, startVerse: 256, endVerse: 266, verseCount: 11, sortKey: 256, displayNumber: '256-266'}
 *
 * @example
 * parseVerseNumber('16.5')
 * // → {isComposite: false, startVerse: 5, endVerse: 5, verseCount: 1, sortKey: 5, displayNumber: '16.5'}
 *
 * @example
 * parseVerseNumber('42')
 * // → {isComposite: false, startVerse: 42, endVerse: 42, verseCount: 1, sortKey: 42, displayNumber: '42'}
 */
export function parseVerseNumber(verseNumber: string): ParsedVerseNumber {
  const trimmed = verseNumber.trim();

  // Перевірка на діапазон (256-266)
  const rangeMatch = trimmed.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    return {
      isComposite: true,
      startVerse: start,
      endVerse: end,
      displayNumber: trimmed,
      sortKey: start, // Сортуємо за першим номером в діапазоні
      verseCount: end - start + 1,
    };
  }

  // Простий вірш - витягуємо останнє число
  // Підтримує формати: "16.256", "256", "2.13.5"
  const parts = trimmed.split(/[.\s]+/).map(p => {
    const numMatch = p.match(/\d+/);
    return numMatch ? parseInt(numMatch[0], 10) : 0;
  });

  const lastNumber = parts[parts.length - 1] || 0;

  return {
    isComposite: false,
    startVerse: lastNumber,
    endVerse: lastNumber,
    displayNumber: trimmed,
    sortKey: lastNumber,
    verseCount: 1,
  };
}

/**
 * Нормалізує номер вірша (прибирає зайві пробіли)
 * Зберігає оригінальний формат для бази даних
 *
 * @param raw - Сирий номер вірша
 * @returns Нормалізований номер вірша
 *
 * @example
 * normalizeVerseNumber('  256-266  ') // → '256-266'
 * normalizeVerseNumber('16.5') // → '16.5'
 */
export function normalizeVerseNumber(raw: string): string {
  return raw.trim();
}

/**
 * Швидкий доступ до ключа сортування
 *
 * @param verseNumber - Номер вірша
 * @returns Ключ сортування (число)
 *
 * @example
 * getVerseSortKey('256-266') // → 256
 * getVerseSortKey('42') // → 42
 */
export function getVerseSortKey(verseNumber: string): number {
  return parseVerseNumber(verseNumber).sortKey;
}

/**
 * Перевіряє чи є номер вірша складеним
 *
 * @param verseNumber - Номер вірша
 * @returns true якщо вірш складений
 *
 * @example
 * isCompositeVerse('256-266') // → true
 * isCompositeVerse('42') // → false
 */
export function isCompositeVerse(verseNumber: string): boolean {
  return parseVerseNumber(verseNumber).isComposite;
}

/**
 * Витягує номер вірша з URL або HTML
 * Підтримує формати Vedabase, Gitabase та інші
 *
 * @param url - URL або текст
 * @returns Номер вірша або null
 *
 * @example
 * extractVerseNumberFromUrl('.../cc/madhya/16/265-266/') // → '265-266'
 * extractVerseNumberFromUrl('.../bg/2/13/') // → '13'
 * extractVerseNumberFromUrl('Verse 256-266') // → '256-266'
 */
export function extractVerseNumberFromUrl(url: string): string | null {
  // Спочатку шукаємо в URL (останній сегмент)
  const urlMatch = url.match(/\/(\d+(?:-\d+)?)\/?$/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // Якщо не знайдено, шукаємо в тексті
  const textMatch = url.match(/(?:Verse|Verses|Verset|Текст|Вірш|Вірші)\s+(\d+(?:-\d+)?)/i);
  if (textMatch) {
    return textMatch[1];
  }

  return null;
}
