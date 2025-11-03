import DOMPurify from "dompurify";

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
    // ✅ НОВІ ПРАВИЛА ТРАНСЛІТЕРАЦІЇ
    .replace(/джджг/g, 'жджх')  // спочатку 3 символи
    .replace(/джг/g, 'джх')     // потім 2 символи
    .replace(/проджджгіта/g, 'проджджхіта')  // специфічне слово
    .trim();
}

export function normalizeSynonyms(text: string): string {
  // Format: "term – meaning; term2 – meaning2" or "term – meaning, term2 – meaning2"
  return text
    .replace(/—/g, '–') // standardize to en dash
    .replace(/\s*[-—]\s*/g, ' – ') // ensure spacing around dashes
    .replace(/\s*[;,]\s*/g, '; ') // normalize both ; and , to "; "
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

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style',
      'width', 'height', 'colspan', 'rowspan'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
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
