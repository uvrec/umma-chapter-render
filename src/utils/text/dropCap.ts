/**
 * Applies drop-cap styling to the first letter of HTML text
 * Wraps the first letter in a span with drop-cap class
 *
 * Supports: Cyrillic (Ukrainian, Russian), Latin, and mixed text
 * Also supports letters with diacritical marks (combining accents)
 * And IAST transliteration characters (Śrīla, Kṛṣṇa, etc.)
 */

// Regex pattern for first letter matching (Cyrillic, Latin, IAST with diacritical marks)
const FIRST_LETTER_PATTERN = /^(\s*)([А-ЯA-ZҐЄІЇа-яa-zґєіїĀāĪīŪūṚṛṜṝḶḷḸḹĒēŌōṂṃḤḥŚśṢṣṆṇṬṭḌḍṄṅÑñ][\u0300-\u036F]*)/u;

/**
 * Applies drop-cap to the first letter within a string (for use inside paragraph content)
 */
function applyDropCapToContent(content: string): string {
  const match = content.match(FIRST_LETTER_PATTERN);
  if (match) {
    const [, prefix, letterWithDiacritics] = match;
    const upperLetter = letterWithDiacritics.charAt(0).toUpperCase() + letterWithDiacritics.slice(1);
    return `${prefix}<span class="drop-cap">${upperLetter}</span>${content.slice(match[0].length)}`;
  }
  return content;
}

/**
 * Formats explanation/purport HTML by adding proper classes to paragraphs:
 * - First <p> gets "purport first" class and drop-cap on first letter
 * - All other <p> elements get "purport" class (with text-indent)
 * - Preserves other elements (blockquote, ul, ol, etc.) unchanged
 */
export function formatExplanationParagraphs(html: string): string {
  if (!html) return html;

  // Check if already formatted
  if (html.includes('class="purport')) {
    return html;
  }

  let isFirstParagraph = true;

  // Match <p> tags with optional attributes
  return html.replace(/<p(\s[^>]*)?>([^]*?)<\/p>/gi, (match, attrs, content) => {
    const existingAttrs = attrs || '';

    if (isFirstParagraph) {
      isFirstParagraph = false;
      // First paragraph: add "purport first" class and apply drop-cap
      const formattedContent = applyDropCapToContent(content);

      // Check if there's already a class attribute
      if (existingAttrs.includes('class="') || existingAttrs.includes("class='")) {
        const newAttrs = existingAttrs.replace(/class=["']([^"']*)["']/, 'class="$1 purport first"');
        return `<p${newAttrs}>${formattedContent}</p>`;
      }
      return `<p class="purport first"${existingAttrs}>${formattedContent}</p>`;
    } else {
      // Other paragraphs: add "purport" class for text-indent
      if (existingAttrs.includes('class="') || existingAttrs.includes("class='")) {
        const newAttrs = existingAttrs.replace(/class=["']([^"']*)["']/, 'class="$1 purport"');
        return `<p${newAttrs}>${content}</p>`;
      }
      return `<p class="purport"${existingAttrs}>${content}</p>`;
    }
  });
}

export function applyDropCap(html: string): string {
  if (!html) return html;

  // Check if drop-cap is already applied
  if (html.includes('class="drop-cap"') || html.includes("class='drop-cap'")) {
    return html;
  }

  // Find the first letter (skip leading whitespace, tags, entities)
  // Matches: optional whitespace/tags, then first letter from:
  // - Cyrillic (А-Яа-яҐЄІЇґєії)
  // - Basic Latin (A-Za-z)
  // - Extended Latin for IAST: Āāīūṛṝḷḹēōṃḥśṣṇṭḍṅñ and capitals
  // Also captures combining diacritical marks (U+0300-U+036F) that follow the letter
  const match = html.match(/^(\s*(?:<[^>]*>\s*)*)([А-ЯA-ZҐЄІЇа-яa-zґєіїĀāĪīŪūṚṛṜṝḶḷḸḹĒēŌōṂṃḤḥŚśṢṣṆṇṬṭḌḍṄṅÑñ][\u0300-\u036F]*)/u);
  if (match) {
    const [, prefix, letterWithDiacritics] = match;
    // Uppercase the base letter, preserve diacritics
    const upperLetter = letterWithDiacritics.charAt(0).toUpperCase() + letterWithDiacritics.slice(1);
    return `${prefix}<span class="drop-cap">${upperLetter}</span>${html.slice(match[0].length)}`;
  }
  return html;
}
