/**
 * Applies drop-cap styling to the first letter of HTML text
 * Wraps the first letter in a span with drop-cap class
 *
 * Supports: Cyrillic (Ukrainian, Russian), Latin, and mixed text
 */
export function applyDropCap(html: string): string {
  if (!html) return html;

  // Check if drop-cap is already applied
  if (html.includes('class="drop-cap"') || html.includes("class='drop-cap'")) {
    return html;
  }

  // Find the first letter (skip leading whitespace, tags, entities)
  // Matches: optional whitespace/tags, then first Cyrillic or Latin letter
  const match = html.match(/^(\s*(?:<[^>]*>\s*)*)([А-ЯA-ZҐЄІЇа-яa-zґєії])/u);
  if (match) {
    const [, prefix, letter] = match;
    return `${prefix}<span class="drop-cap">${letter.toUpperCase()}</span>${html.slice(match[0].length)}`;
  }
  return html;
}
