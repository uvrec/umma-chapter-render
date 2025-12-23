/**
 * Сервіс трекінгу прогресу читання
 * Зберігає позицію читання в localStorage
 */

export interface ReadingPosition {
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  cantoNumber?: number;
  chapterNumber: number;
  chapterTitle: string;
  verseNumber?: string;
  scrollPosition?: number;
  percentRead: number;
  lastReadAt: number;
}

const STORAGE_KEY = 'veda_reading_progress';
const MAX_HISTORY = 10;

/**
 * Отримати всі збережені позиції
 */
export function getAllReadingPositions(): ReadingPosition[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ReadingPosition[];
  } catch {
    return [];
  }
}

/**
 * Отримати останню позицію читання
 */
export function getLastReadingPosition(): ReadingPosition | null {
  const positions = getAllReadingPositions();
  if (positions.length === 0) return null;
  return positions.sort((a, b) => b.lastReadAt - a.lastReadAt)[0];
}

/**
 * Отримати останні N позицій
 */
export function getRecentReadingPositions(limit: number = 5): ReadingPosition[] {
  const positions = getAllReadingPositions();
  return positions.sort((a, b) => b.lastReadAt - a.lastReadAt).slice(0, limit);
}

/**
 * Зберегти позицію читання
 */
export function saveReadingPosition(position: Omit<ReadingPosition, 'lastReadAt'>): void {
  try {
    const positions = getAllReadingPositions();
    
    // Унікальний ключ для глави
    const key = position.cantoNumber
      ? `${position.bookSlug}-${position.cantoNumber}-${position.chapterNumber}`
      : `${position.bookSlug}-${position.chapterNumber}`;
    
    // Видаляємо стару позицію для цієї глави якщо є
    const filtered = positions.filter((p) => {
      const pKey = p.cantoNumber
        ? `${p.bookSlug}-${p.cantoNumber}-${p.chapterNumber}`
        : `${p.bookSlug}-${p.chapterNumber}`;
      return pKey !== key;
    });
    
    // Додаємо нову позицію
    const newPosition: ReadingPosition = {
      ...position,
      lastReadAt: Date.now(),
    };
    
    filtered.unshift(newPosition);
    
    // Обмежуємо історію
    const limited = filtered.slice(0, MAX_HISTORY);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to save reading position:', error);
  }
}

/**
 * Оновити відсоток прочитаного
 */
export function updateReadingPercent(
  bookSlug: string,
  chapterNumber: number,
  percentRead: number,
  cantoNumber?: number
): void {
  const positions = getAllReadingPositions();
  
  const key = cantoNumber
    ? `${bookSlug}-${cantoNumber}-${chapterNumber}`
    : `${bookSlug}-${chapterNumber}`;
  
  const position = positions.find((p) => {
    const pKey = p.cantoNumber
      ? `${p.bookSlug}-${p.cantoNumber}-${p.chapterNumber}`
      : `${p.bookSlug}-${p.chapterNumber}`;
    return pKey === key;
  });
  
  if (position) {
    position.percentRead = Math.min(100, Math.max(0, percentRead));
    position.lastReadAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }
}

/**
 * Отримати URL для продовження читання
 */
export function getReadingUrl(position: ReadingPosition): string {
  const base = `/veda-reader/${position.bookSlug}`;
  
  if (position.cantoNumber) {
    const url = `${base}/canto/${position.cantoNumber}/chapter/${position.chapterNumber}`;
    return position.verseNumber ? `${url}/${position.verseNumber}` : url;
  }
  
  const url = `${base}/${position.chapterNumber}`;
  return position.verseNumber ? `${url}/${position.verseNumber}` : url;
}

/**
 * Очистити історію читання
 */
export function clearReadingHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Видалити конкретну позицію
 */
export function removeReadingPosition(
  bookSlug: string,
  chapterNumber: number,
  cantoNumber?: number
): void {
  const positions = getAllReadingPositions();
  
  const key = cantoNumber
    ? `${bookSlug}-${cantoNumber}-${chapterNumber}`
    : `${bookSlug}-${chapterNumber}`;
  
  const filtered = positions.filter((p) => {
    const pKey = p.cantoNumber
      ? `${p.bookSlug}-${p.cantoNumber}-${p.chapterNumber}`
      : `${p.bookSlug}-${p.chapterNumber}`;
    return pKey !== key;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
