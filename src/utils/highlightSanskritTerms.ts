import { normalizeSanskritText } from './glossaryParser';

interface TermsMap {
  [normalizedTerm: string]: boolean;
}

/**
 * Highlights Sanskrit terms in HTML content by wrapping them in anchor tags
 * @param htmlContent - Sanitized HTML content
 * @param termsMap - Map of normalized terms to check against
 * @param language - Current language ('uk' or 'en')
 * @returns HTML string with Sanskrit terms highlighted
 */
export function highlightSanskritTerms(
  htmlContent: string,
  termsMap: TermsMap,
  language: string
): string {
  if (!htmlContent || Object.keys(termsMap).length === 0) {
    return htmlContent;
  }

  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Regex patterns for diacritized words
  const ukrainianDiacritics = 'а̄īӯш́т̣д̣р̣р̣̄н̣н̃н̇м̇х̣л̣';
  const latinDiacritics = 'āīūṛṝḷḹṁḥṅñṭḍṇśṣ';
  
  const ukrainianPattern = new RegExp(
    `[а-яіїєґА-ЯІЇЄҐ${ukrainianDiacritics}]+[${ukrainianDiacritics}][а-яіїєґА-ЯІЇЄҐ${ukrainianDiacritics}]*`,
    'g'
  );
  
  const latinPattern = new RegExp(
    `[a-zA-Z${latinDiacritics}]+[${latinDiacritics}][a-zA-Z${latinDiacritics}]*`,
    'g'
  );

  const pattern = language === 'uk' ? ukrainianPattern : latinPattern;

  // Function to process text nodes
  function processTextNode(textNode: Text) {
    const text = textNode.textContent || '';
    const matches: { word: string; index: number }[] = [];
    let match;

    // Find all diacritized words
    while ((match = pattern.exec(text)) !== null) {
      const word = match[0];
      const normalized = normalizeSanskritText(word);
      
      // Check if this term exists in our glossary
      if (termsMap[normalized]) {
        matches.push({ word, index: match.index });
      }
    }

    // If no matches, nothing to do
    if (matches.length === 0) return;

    // Build new content with links
    const parent = textNode.parentNode;
    if (!parent) return;

    let lastIndex = 0;
    const fragment = document.createDocumentFragment();

    matches.forEach(({ word, index }) => {
      // Add text before the match
      if (index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.substring(lastIndex, index))
        );
      }

      // Create link for the term
      const link = document.createElement('a');
      link.href = `/glossary?search=${encodeURIComponent(word)}`;
      link.className = 'font-sanskrit-italic italic text-primary hover:text-primary/80 underline decoration-dotted hover:decoration-solid transition-colors';
      link.setAttribute('data-sanskrit-term', 'true');
      link.textContent = word;
      link.onclick = (e) => {
        e.preventDefault();
        window.open(link.href, '_blank', 'noopener,noreferrer');
      };
      fragment.appendChild(link);

      lastIndex = index + word.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    // Replace the text node with our fragment
    parent.replaceChild(fragment, textNode);
  }

  // Walk through all text nodes
  function walkTextNodes(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node as Text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      
      // Skip links and code blocks
      if (
        element.tagName === 'A' ||
        element.tagName === 'CODE' ||
        element.tagName === 'PRE' ||
        element.hasAttribute('data-sanskrit-term')
      ) {
        return;
      }

      // Process children
      const children = Array.from(node.childNodes);
      children.forEach(walkTextNodes);
    }
  }

  walkTextNodes(doc.body);

  // Return the processed HTML
  return doc.body.innerHTML;
}
