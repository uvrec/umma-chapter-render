/**
 * Утиліти для синхронізації параграфів між мовами
 */

export interface Paragraph {
  index: number;
  text: string;
}

/**
 * Розбиває текст на параграфи та створює структуровані дані
 * @param text - Текст для розбиття
 * @returns Масив об'єктів {index, text}
 */
export function splitIntoParagraphs(text: string | null | undefined): Paragraph[] {
  if (!text) return [];

  // Розбити по подвійних переносах рядків або більше
  const paragraphs = text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return paragraphs.map((text, index) => ({
    index,
    text: text.replace(/\n/g, ' ').trim(), // Одиничні \n замінюємо на пробіли
  }));
}

/**
 * Вирівнює кількість параграфів між двома мовами
 * Якщо в одній мові більше параграфів - додає порожні в іншу
 * @param paragraphs1 - Параграфи першої мови
 * @param paragraphs2 - Параграфи другої мови
 * @returns Кортеж [aligned1, aligned2] з однаковою кількістю елементів
 */
export function alignParagraphs(
  paragraphs1: Paragraph[],
  paragraphs2: Paragraph[]
): [Paragraph[], Paragraph[]] {
  const maxLength = Math.max(paragraphs1.length, paragraphs2.length);

  const aligned1 = [...paragraphs1];
  const aligned2 = [...paragraphs2];

  // Додати порожні параграфи до меншого масиву
  while (aligned1.length < maxLength) {
    aligned1.push({ index: aligned1.length, text: '' });
  }
  while (aligned2.length < maxLength) {
    aligned2.push({ index: aligned2.length, text: '' });
  }

  return [aligned1, aligned2];
}

/**
 * Конвертує масив параграфів в JSONB для Supabase
 */
export function paragraphsToJsonb(paragraphs: Paragraph[]): string {
  return JSON.stringify(paragraphs);
}

/**
 * Парсить JSONB з Supabase в масив параграфів
 */
export function jsonbToParagraphs(jsonb: any): Paragraph[] {
  if (!jsonb) return [];
  if (typeof jsonb === 'string') {
    try {
      return JSON.parse(jsonb);
    } catch {
      return [];
    }
  }
  if (Array.isArray(jsonb)) {
    return jsonb;
  }
  return [];
}
