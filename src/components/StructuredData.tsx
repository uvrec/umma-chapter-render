/**
 * Structured Data (JSON-LD) components for SEO
 *
 * Implements Schema.org types:
 * - Book: for scripture books
 * - Chapter: for book chapters
 * - BlogPosting: for blog posts
 * - BreadcrumbList: for navigation
 * - WebSite: for site-wide search
 */

import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Прабгупада солов\'їною';
const SITE_NAME_EN = 'Vedavoice';
const BASE_URL = 'https://vedavoice.org';
const LOGO_URL = 'https://vedavoice.org/favicon.png';
const PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
};

interface BookSchemaProps {
  slug: string;
  titleUk: string;
  titleEn: string;
  descriptionUk?: string;
  descriptionEn?: string;
  author?: string;
  coverImage?: string;
  language: 'uk' | 'en';
}

export function BookSchema({
  slug,
  titleUk,
  titleEn,
  descriptionUk,
  descriptionEn,
  author = 'A.C. Bhaktivedanta Swami Prabhupada',
  coverImage,
  language,
}: BookSchemaProps) {
  const title = language === 'uk' ? titleUk : titleEn;
  const description = language === 'uk' ? descriptionUk : descriptionEn;
  const url = `${BASE_URL}/${language}/lib/${slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': url,
    name: title,
    headline: title,
    description: description || `${title} - священне писання ведичної традиції`,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: PUBLISHER,
    url: url,
    inLanguage: language === 'uk' ? 'uk-UA' : 'en-US',
    isAccessibleForFree: true,
    ...(coverImage && {
      image: {
        '@type': 'ImageObject',
        url: coverImage,
      },
    }),
    potentialAction: {
      '@type': 'ReadAction',
      target: url,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface ChapterSchemaProps {
  bookSlug: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  cantoNumber?: number;
  cantoTitle?: string;
  description?: string;
  language: 'uk' | 'en';
}

export function ChapterSchema({
  bookSlug,
  bookTitle,
  chapterNumber,
  chapterTitle,
  cantoNumber,
  cantoTitle,
  description,
  language,
}: ChapterSchemaProps) {
  const path = cantoNumber
    ? `/${language}/lib/${bookSlug}/${cantoNumber}/${chapterNumber}`
    : `/${language}/lib/${bookSlug}/${chapterNumber}`;
  const url = `${BASE_URL}${path}`;

  const fullTitle = cantoTitle
    ? `${bookTitle} - ${cantoTitle} - ${chapterTitle}`
    : `${bookTitle} - ${chapterTitle}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    '@id': url,
    name: chapterTitle,
    headline: fullTitle,
    description: description || `${chapterTitle} - глава ${chapterNumber}`,
    isPartOf: {
      '@type': 'Book',
      name: bookTitle,
      url: `${BASE_URL}/${language}/lib/${bookSlug}`,
    },
    position: chapterNumber,
    url: url,
    inLanguage: language === 'uk' ? 'uk-UA' : 'en-US',
    publisher: PUBLISHER,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface VerseSchemaProps {
  bookSlug: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  verseNumber: string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  cantoNumber?: number;
  language: 'uk' | 'en';
}

export function VerseSchema({
  bookSlug,
  bookTitle,
  chapterNumber,
  chapterTitle,
  verseNumber,
  sanskrit,
  transliteration,
  translation,
  cantoNumber,
  language,
}: VerseSchemaProps) {
  const path = cantoNumber
    ? `/${language}/lib/${bookSlug}/${cantoNumber}/${chapterNumber}/${verseNumber}`
    : `/${language}/lib/${bookSlug}/${chapterNumber}/${verseNumber}`;
  const url = `${BASE_URL}${path}`;

  const title = `${bookTitle} ${cantoNumber ? `${cantoNumber}.` : ''}${chapterNumber}.${verseNumber}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url,
    name: title,
    headline: title,
    description: translation?.substring(0, 160) || `Вірш ${verseNumber} з ${chapterTitle}`,
    articleBody: [sanskrit, transliteration, translation].filter(Boolean).join('\n\n'),
    isPartOf: {
      '@type': 'Chapter',
      name: chapterTitle,
      position: chapterNumber,
    },
    url: url,
    inLanguage: language === 'uk' ? 'uk-UA' : 'en-US',
    publisher: PUBLISHER,
    author: {
      '@type': 'Person',
      name: 'A.C. Bhaktivedanta Swami Prabhupada',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface BlogPostSchemaProps {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  authorName?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  language: 'uk' | 'en';
}

export function BlogPostSchema({
  slug,
  title,
  excerpt,
  content,
  coverImage,
  authorName = SITE_NAME,
  publishedAt,
  updatedAt,
  tags,
  language,
}: BlogPostSchemaProps) {
  const url = `${BASE_URL}/${language}/blog/${slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description: excerpt || title,
    ...(content && { articleBody: content.substring(0, 5000) }),
    ...(coverImage && {
      image: {
        '@type': 'ImageObject',
        url: coverImage,
      },
    }),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: PUBLISHER,
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    ...(tags && tags.length > 0 && { keywords: tags.join(', ') }),
    url: url,
    inLanguage: language === 'uk' ? 'uk-UA' : 'en-US',
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: BASE_URL,
    description: 'Ведичні писання українською мовою. Бгаґавад-ґіта, Шрімад-Бгаґаватам та інші священні тексти.',
    inLanguage: ['uk-UA', 'en-US'],
    publisher: PUBLISHER,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/uk/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface OrganizationSchemaProps {
  language?: 'uk' | 'en';
}

export function OrganizationSchema({ language = 'uk' }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: language === 'uk' ? SITE_NAME : SITE_NAME_EN,
    url: BASE_URL,
    logo: LOGO_URL,
    sameAs: [
      'https://t.me/prabhupada_uk',
      'https://www.instagram.com/prabhupada.ua/',
      'https://www.youtube.com/@prabhupadasolovyinoyu',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
