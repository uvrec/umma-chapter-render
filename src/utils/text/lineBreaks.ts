/**
 * Utility to add proper line breaks to Sanskrit and transliteration text
 * based on Devanagari punctuation and meter patterns
 */

/**
 * Adds line breaks to Sanskrit text based on Devanagari punctuation
 * Splits at: invocations (ॐ), single danda (।), and preserves double danda (॥) with verse numbers
 */
export function addSanskritLineBreaks(text: string): string {
  if (!text || !text.trim()) return text;
  
  // Remove existing line breaks to start fresh
  let cleaned = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Step 1: Handle invocation (ॐ) - should be on its own line
  cleaned = cleaned.replace(/^(ॐ[^।॥]+)/i, '$1\n');
  
  // Step 2: Split at single danda (।) but not double danda (॥)
  // Add line break after single danda if not followed by another danda
  cleaned = cleaned.replace(/।(?!।)/g, '।\n');
  
  // Step 3: Keep double danda (॥) with any following verse number on same line
  cleaned = cleaned.replace(/॥\s*(\d+)?\s*॥/g, '॥ $1 ॥');
  
  // Clean up multiple line breaks and trim each line
  const lines = cleaned.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  return lines.join('\n');
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
 * Process a verse and add line breaks to both Sanskrit and transliteration
 */
export function processVerseLineBreaks(verse: {
  sanskrit?: string | null;
  transliteration?: string | null;
}): {
  sanskrit?: string;
  transliteration?: string;
} {
  const result: { sanskrit?: string; transliteration?: string } = {};
  
  if (verse.sanskrit) {
    result.sanskrit = addSanskritLineBreaks(verse.sanskrit);
  }
  
  if (verse.transliteration && result.sanskrit) {
    result.transliteration = addTransliterationLineBreaks(
      result.sanskrit,
      verse.transliteration
    );
  } else if (verse.transliteration) {
    result.transliteration = verse.transliteration;
  }
  
  return result;
}
