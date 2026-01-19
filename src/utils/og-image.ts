/**
 * Open Graph Image Generator Utility
 *
 * Generates URLs for dynamic OG images using query parameters.
 * Can be used with:
 * - Vercel OG (@vercel/og)
 * - Cloudinary text overlays
 * - Custom OG image API endpoint
 *
 * For now, returns static images or generates via external service.
 */

import { SITE_CONFIG } from '@/lib/constants';

const OG_IMAGE_BASE = 'https://og-image.vedavoice.org'; // Future OG image service
const CLOUDINARY_BASE = 'https://res.cloudinary.com/vedavoice/image/upload';

interface OgImageParams {
  title: string;
  subtitle?: string;
  type?: 'book' | 'chapter' | 'verse' | 'blog' | 'default';
  bookSlug?: string;
  language?: 'uk' | 'en';
}

/**
 * Generate OG image URL for a book
 */
export function getBookOgImage(
  bookSlug: string,
  titleUk: string,
  titleEn: string,
  language: 'uk' | 'en' = 'uk'
): string {
  const title = language === 'uk' ? titleUk : titleEn;

  // Check for custom book cover images
  const bookCovers: Record<string, string> = {
    bg: `${SITE_CONFIG.baseUrl}/lovable-uploads/bg-cover.jpg`,
    sb: `${SITE_CONFIG.baseUrl}/lovable-uploads/sb-cover.jpg`,
    cc: `${SITE_CONFIG.baseUrl}/lovable-uploads/cc-cover.jpg`,
    iso: `${SITE_CONFIG.baseUrl}/lovable-uploads/iso-cover.jpg`,
    noi: `${SITE_CONFIG.baseUrl}/lovable-uploads/noi-cover.jpg`,
  };

  if (bookCovers[bookSlug]) {
    return bookCovers[bookSlug];
  }

  // Fallback to default social image
  return SITE_CONFIG.socialImage;
}

/**
 * Generate OG image URL for a chapter
 */
export function getChapterOgImage(
  bookSlug: string,
  bookTitle: string,
  chapterNumber: number,
  chapterTitle: string,
  cantoNumber?: number,
  language: 'uk' | 'en' = 'uk'
): string {
  // For chapters, use the book cover or generate dynamic image
  // In the future, this can call an OG image generation service
  return getBookOgImage(bookSlug, bookTitle, bookTitle, language);
}

/**
 * Generate OG image URL for a verse
 */
export function getVerseOgImage(
  bookSlug: string,
  chapterNumber: number,
  verseNumber: string,
  cantoNumber?: number
): string {
  // Use book cover for verses
  return getBookOgImage(bookSlug, '', '', 'uk');
}

/**
 * Generate OG image URL for a blog post
 */
export function getBlogPostOgImage(
  coverImage?: string | null,
  fallbackTitle?: string
): string {
  if (coverImage) {
    return coverImage;
  }

  return SITE_CONFIG.socialImage;
}

/**
 * Generate dynamic OG image URL using Cloudinary text overlays
 * This is a more advanced option that creates images on-the-fly
 */
export function generateCloudinaryOgImage(params: OgImageParams): string {
  const { title, subtitle, type = 'default' } = params;

  // URL-encode text for Cloudinary
  const encodedTitle = encodeURIComponent(title).replace(/%20/g, '%20');
  const encodedSubtitle = subtitle
    ? encodeURIComponent(subtitle).replace(/%20/g, '%20')
    : '';

  // Background colors based on type
  const backgrounds: Record<string, string> = {
    book: 'c_fill,w_1200,h_630,b_rgb:1a1a2e',
    chapter: 'c_fill,w_1200,h_630,b_rgb:16213e',
    verse: 'c_fill,w_1200,h_630,b_rgb:0f3460',
    blog: 'c_fill,w_1200,h_630,b_rgb:e94560',
    default: 'c_fill,w_1200,h_630,b_rgb:1a1a2e',
  };

  const bg = backgrounds[type];

  // Build Cloudinary URL with text overlay
  // Note: This requires a Cloudinary account and proper setup
  const transformations = [
    bg,
    `l_text:Arial_48_bold:${encodedTitle},co_white,g_center,y_-40`,
    subtitle ? `l_text:Arial_32:${encodedSubtitle},co_white,g_center,y_60` : '',
  ]
    .filter(Boolean)
    .join('/');

  return `${CLOUDINARY_BASE}/${transformations}/og-template.png`;
}

/**
 * Future: Generate OG image via custom API endpoint
 * This would use @vercel/og or similar on the server
 */
export function generateOgImageUrl(params: OgImageParams): string {
  const searchParams = new URLSearchParams();

  searchParams.set('title', params.title);
  if (params.subtitle) searchParams.set('subtitle', params.subtitle);
  if (params.type) searchParams.set('type', params.type);
  if (params.bookSlug) searchParams.set('book', params.bookSlug);
  if (params.language) searchParams.set('lang', params.language);

  return `${OG_IMAGE_BASE}/api/og?${searchParams.toString()}`;
}

/**
 * Get the best available OG image for content
 * Falls back gracefully if dynamic generation is not available
 */
export function getOgImage(params: OgImageParams): string {
  // For now, use static images
  // In production, this can switch to dynamic generation

  if (params.type === 'book' && params.bookSlug) {
    return getBookOgImage(params.bookSlug, params.title, params.title, params.language);
  }

  if (params.type === 'blog') {
    return getBlogPostOgImage(null, params.title);
  }

  return SITE_CONFIG.socialImage;
}
