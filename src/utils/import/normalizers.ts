export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u00A0/g, ' ') // non-breaking space
    .replace(/[\u2018\u2019]/g, "'") // smart quotes
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2013/g, '-') // en dash
    .replace(/\u2014/g, '—') // em dash
    .trim();
}

export function normalizeSynonyms(text: string): string {
  // Format: "term – meaning; term2 – meaning2"
  return text
    .replace(/—/g, '–') // standardize to en dash
    .replace(/\s*[-—]\s*/g, ' – ') // ensure spacing
    .replace(/\s*;\s*/g, '; ')
    .trim();
}

export function cleanHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractSanskritText(text: string): string | undefined {
  // Look for Devanagari script
  const devanagariMatch = text.match(/[\u0900-\u097F]+/);
  if (devanagariMatch) {
    return devanagariMatch[0];
  }
  
  // Look for IAST transliteration (with diacritics)
  const iastMatch = text.match(/[a-zA-Zāīūṛṝḷḹēōṃḥśṣṇṭḍ]+/);
  return iastMatch ? iastMatch[0] : undefined;
}
