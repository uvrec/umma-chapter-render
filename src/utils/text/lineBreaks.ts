/**
 * Utility to add proper line breaks to Sanskrit and transliteration text
 * based on Devanagari punctuation and meter patterns
 */

/**
 * Adds line breaks to Sanskrit text based on Devanagari punctuation
 * Splits at: invocations (ॐ), single danda (।), and preserves double danda (॥) with verse numbers
 */
export function addSanskritLineBreaks(text: string): string {
  // Перевірка на коректність вхідних даних
  if (!text || typeof text !== 'string') return text || '';
  if (!text.trim()) return text;

  try {
    // ✅ ВИПРАВЛЕННЯ: Якщо текст вже має розриви рядків (\n),
    // це означає що він був відредагований вручну - НЕ ОБРОБЛЯТИ!
    if (text.includes('\n')) {
      return text;
    }

    // Remove existing line breaks to start fresh
    let cleaned = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Step 2: Handle invocation (ॐ) - should be on its own line
    cleaned = cleaned.replace(/^(ॐ[^।॥]+)/i, '$1\n');

    // Step 3: Split at single danda (।) but not double danda (॥)
    // Add line break after single danda if not followed by another danda
    cleaned = cleaned.replace(/।(?!।)/g, '।\n');

    // Step 4: Keep double danda (॥) with any following verse number on same line
    cleaned = cleaned.replace(/॥\s*(\d+)?\s*॥/g, '॥ $1 ॥');

    // Clean up multiple line breaks and trim each line
    const lines = cleaned.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return lines.join('\n');
  } catch (error) {
    console.error('Error in addSanskritLineBreaks:', error, 'Text:', text?.substring(0, 100));
    // У разі помилки повертаємо оригінальний текст
    return text;
  }
}

/**
 * Splits each line of already-processed Sanskrit text at the midpoint (by words)
 * to create more lines for narrow/mobile displays.
 * E.g. 2 lines → 4 lines (each half-verse splits into two quarter-verses)
 */
export function splitSanskritForMobile(text: string): string {
  if (!text || typeof text !== 'string') return text || '';

  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Split line into words
    const words = trimmed.split(/\s+/);

    // Only split if the line has enough words (4+) to make a meaningful split
    if (words.length >= 4) {
      const mid = Math.ceil(words.length / 2);
      result.push(words.slice(0, mid).join(' '));
      result.push(words.slice(mid).join(' '));
    } else {
      result.push(trimmed);
    }
  }

  return result.join('\n');
}

/**
 * Adds line breaks to transliteration based on Sanskrit line breaks
 * Assumes transliteration roughly follows same structure as Sanskrit
 */
export function addTransliterationLineBreaks(sanskrit: string, transliteration: string): string {
  if (!transliteration || !transliteration.trim()) return transliteration;
  if (!sanskrit || !sanskrit.trim()) {
    // Fallback: use basic heuristics
    return transliteration.replace(/\s+/g, ' ').trim();
  }
  
  // Count line breaks in Sanskrit
  const sanskritLines = sanskrit.split('\n').length;
  
  // Remove existing line breaks
  let cleaned = transliteration.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  // If Sanskrit has invocation (ॐ), split first line
  if (sanskrit.match(/^ॐ/)) {
    // Find first word boundary after reasonable invocation length
    const firstLineMatch = cleaned.match(/^(\S+(?:\s+\S+){0,5})/);
    if (firstLineMatch) {
      cleaned = cleaned.replace(firstLineMatch[1], firstLineMatch[1] + '\n');
    }
  }
  
  // Try to split into similar number of lines as Sanskrit
  const words = cleaned.split(/\s+/);
  const wordsPerLine = Math.ceil(words.length / sanskritLines);
  
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    const lineWords = words.slice(i, i + wordsPerLine);
    lines.push(lineWords.join(' '));
  }
  
  return lines.join('\n');
}

/**
 * Process a verse and add line breaks to Sanskrit only (Devanagari/Bengali)
 * Transliteration is returned unchanged
 */
export function processVerseLineBreaks(verse: {
  sanskrit?: string | null;
  transliteration?: string | null;
}): {
  sanskrit?: string;
  transliteration?: string;
} {
  const result: { sanskrit?: string; transliteration?: string } = {};

  // Обробляємо ТІЛЬКИ санскрит (деванаґарі/бенгалі)
  if (verse.sanskrit) {
    result.sanskrit = addSanskritLineBreaks(verse.sanskrit);
  }

  // Транслітерацію залишаємо БЕЗ ЗМІН
  if (verse.transliteration) {
    result.transliteration = verse.transliteration;
  }

  return result;
}
