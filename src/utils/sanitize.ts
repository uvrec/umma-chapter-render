// src/utils/sanitize.ts
/**
 * Basic HTML sanitization for trusted sources (Vedabase/Gitabase)
 * Removes potentially dangerous scripts while preserving formatting
 */

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'i', 'b',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td'
];

const ALLOWED_ATTRS = ['href', 'title', 'class', 'id', 'style'];

/**
 * Strip dangerous HTML while keeping safe formatting
 * For production, consider using library like DOMPurify or sanitize-html
 */
export function sanitizeHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  
  // Remove script tags and their content
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove iframe, object, embed
  cleaned = cleaned.replace(/<(iframe|object|embed)[^>]*>.*?<\/\1>/gi, '');
  
  // Remove event handlers (onclick, onerror, etc.)
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  cleaned = cleaned.replace(/javascript:/gi, '');
  
  // Mark as from trusted source
  return cleaned.trim();
}

/**
 * Extract plain text from HTML (for search/preview)
 */
export function htmlToText(html: string | null | undefined): string | null {
  if (!html) return null;
  
  return html
    .replace(/<[^>]+>/g, ' ')  // Remove tags
    .replace(/\s+/g, ' ')       // Normalize whitespace
    .trim();
}

/**
 * Truncate HTML to approximate character limit
 */
export function truncateHtml(html: string | null, maxLength: number): string | null {
  if (!html) return null;
  
  const text = htmlToText(html);
  if (!text || text.length <= maxLength) return html;
  
  return text.substring(0, maxLength) + '...';
}
