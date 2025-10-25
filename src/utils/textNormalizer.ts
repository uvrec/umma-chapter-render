// src/utils/textNormalizer.ts
// Нормалізація тексту для імпорту

export function normalizeVerseField(text: string | null | undefined): string {
  if (!text) return '';
  
  // Видаляємо зайві пробіли та переноси
  let normalized = text.trim();
  
  // Нормалізуємо Unicode
  try {
    normalized = normalized.normalize('NFC');
  } catch {}
  
  // Видаляємо подвійні пробіли
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Видаляємо подвійні переноси рядків
  normalized = normalized.replace(/\n{3,}/g, '\n\n');
  
  return normalized.trim();
}

export function cleanHtml(html: string | null | undefined): string {
  if (!html) return '';
  
  // Базова очистка HTML
  let clean = html.trim();
  
  // Видаляємо небезпечні теги
  clean = clean.replace(/<script[^>]*>.*?<\/script>/gis, '');
  clean = clean.replace(/<style[^>]*>.*?<\/style>/gis, '');
  
  return clean.trim();
}

export function extractVerseNumber(text: string): string | null {
  // Витягуємо номер вірша з тексту типу "1.1.1" або "Verse 1"
  const match = text.match(/\d+(\.\d+)?(\.\d+)?/);
  return match ? match[0] : null;
}
