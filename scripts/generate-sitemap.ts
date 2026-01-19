/**
 * Sitemap Generator with hreflang support
 *
 * Generates a comprehensive sitemap.xml including:
 * - Static pages (home, library, blog, about)
 * - All published books with their chapters/cantos
 * - All published blog posts
 *
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = 'https://vedavoice.org';
const LANGUAGES = ['uk', 'en'] as const;
const DEFAULT_LANG = 'uk';

interface SitemapUrl {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

function generateUrlEntry(url: SitemapUrl): string {
  const ukUrl = `${BASE_URL}/uk${url.path}`;
  const enUrl = `${BASE_URL}/en${url.path}`;

  const entries: string[] = [];

  for (const lang of LANGUAGES) {
    const locUrl = `${BASE_URL}/${lang}${url.path}`;
    entries.push(`  <url>
    <loc>${locUrl}</loc>
    <xhtml:link rel="alternate" hreflang="uk" href="${ukUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${ukUrl}" />
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`);
  }

  return entries.join('\n');
}

async function getStaticPages(): Promise<SitemapUrl[]> {
  return [
    { path: '', changefreq: 'daily', priority: 1.0 },
    { path: '/library', changefreq: 'weekly', priority: 0.9 },
    { path: '/blog', changefreq: 'daily', priority: 0.8 },
    { path: '/library/lectures', changefreq: 'weekly', priority: 0.7 },
    { path: '/library/letters', changefreq: 'weekly', priority: 0.7 },
    { path: '/glossary', changefreq: 'monthly', priority: 0.6 },
    { path: '/calendar', changefreq: 'daily', priority: 0.7 },
    { path: '/audio', changefreq: 'weekly', priority: 0.7 },
    { path: '/quotes', changefreq: 'weekly', priority: 0.6 },
    { path: '/about', changefreq: 'monthly', priority: 0.5 },
  ];
}

async function getBooks(): Promise<SitemapUrl[]> {
  const { data: books, error } = await supabase
    .from('books')
    .select('slug, has_cantos, updated_at')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  const urls: SitemapUrl[] = [];

  for (const book of books || []) {
    // Book overview page
    urls.push({
      path: `/lib/${book.slug}`,
      changefreq: 'monthly',
      priority: 0.9,
      lastmod: book.updated_at?.split('T')[0],
    });

    if (book.has_cantos) {
      // Fetch cantos for this book
      const { data: cantos } = await supabase
        .from('cantos')
        .select('canto_number, id')
        .eq('book_id', book.slug)
        .order('canto_number');

      // Actually need to get book id first
      const { data: bookData } = await supabase
        .from('books')
        .select('id')
        .eq('slug', book.slug)
        .single();

      if (bookData) {
        const { data: cantosData } = await supabase
          .from('cantos')
          .select('canto_number, id, updated_at')
          .eq('book_id', bookData.id)
          .eq('is_published', true)
          .order('canto_number');

        for (const canto of cantosData || []) {
          // Canto overview page
          urls.push({
            path: `/lib/${book.slug}/${canto.canto_number}`,
            changefreq: 'monthly',
            priority: 0.8,
            lastmod: canto.updated_at?.split('T')[0],
          });

          // Fetch chapters for this canto
          const { data: chapters } = await supabase
            .from('chapters')
            .select('chapter_number, updated_at')
            .eq('canto_id', canto.id)
            .order('chapter_number');

          for (const chapter of chapters || []) {
            urls.push({
              path: `/lib/${book.slug}/${canto.canto_number}/${chapter.chapter_number}`,
              changefreq: 'monthly',
              priority: 0.7,
              lastmod: chapter.updated_at?.split('T')[0],
            });
          }
        }
      }
    } else {
      // Non-canto book - fetch chapters directly
      const { data: bookData } = await supabase
        .from('books')
        .select('id')
        .eq('slug', book.slug)
        .single();

      if (bookData) {
        const { data: chapters } = await supabase
          .from('chapters')
          .select('chapter_number, updated_at')
          .eq('book_id', bookData.id)
          .is('canto_id', null)
          .order('chapter_number');

        for (const chapter of chapters || []) {
          urls.push({
            path: `/lib/${book.slug}/${chapter.chapter_number}`,
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: chapter.updated_at?.split('T')[0],
          });
        }
      }
    }
  }

  return urls;
}

async function getBlogPosts(): Promise<SitemapUrl[]> {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return (posts || []).map(post => ({
    path: `/blog/${post.slug}`,
    changefreq: 'monthly' as const,
    priority: 0.6,
    lastmod: (post.updated_at || post.published_at)?.split('T')[0],
  }));
}

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...');

  const staticPages = await getStaticPages();
  console.log(`📄 Static pages: ${staticPages.length}`);

  const bookPages = await getBooks();
  console.log(`📚 Book pages: ${bookPages.length}`);

  const blogPosts = await getBlogPosts();
  console.log(`📝 Blog posts: ${blogPosts.length}`);

  const allUrls = [...staticPages, ...bookPages, ...blogPosts];
  console.log(`📊 Total URLs: ${allUrls.length * 2} (x2 for UK/EN)`);

  const urlEntries = allUrls.map(generateUrlEntry).join('\n\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

${urlEntries}

</urlset>
`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap written to ${outputPath}`);
  console.log(`📈 Total URL entries: ${allUrls.length * 2}`);
}

generateSitemap().catch(console.error);
