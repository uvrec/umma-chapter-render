/**
 * Applies drop-cap styling to the first letter of HTML text
 * Wraps the first letter in a span with drop-cap class
 *
 * Supports: Cyrillic (Ukrainian, Russian), Latin, and mixed text
 * Also supports letters with diacritical marks (combining accents)
 */
export function applyDropCap(html: string): string {
  if (!html) return html;

  // Check if drop-cap is already applied
  if (html.includes('class="drop-cap"') || html.includes("class='drop-cap'")) {
    return html;
  }

  // Find the first letter (skip leading whitespace, tags, entities)
  // Matches: optional whitespace/tags, then first Cyrillic or Latin letter
  // Also captures combining diacritical marks (U+0300-U+036F) that follow the letter
  const match = html.match(/^(\s*(?:<[^>]*>\s*)*)([А-ЯA-ZҐЄІЇа-яa-zґєії][\u0300-\u036F]*)/u);
  if (match) {
    const [, prefix, letterWithDiacritics] = match;
    // Uppercase the base letter, preserve diacritics
    const upperLetter = letterWithDiacritics.charAt(0).toUpperCase() + letterWithDiacritics.slice(1);
    return `${prefix}<span class="drop-cap">${upperLetter}</span>${html.slice(match[0].length)}`;
  }
  return html;
}
