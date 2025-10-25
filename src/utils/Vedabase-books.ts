// src/utils/Vedabase-books.ts
// Конфігурація книг з Vedabase/Gitabase для імпорту

export const VEDABASE_BOOKS = [
  { slug: 'bg', name: 'Bhagavad-gita As It Is', vedabaseSlug: 'bg', gitabaseSlug: 'bg' },
  { slug: 'sb', name: 'Srimad-Bhagavatam', vedabaseSlug: 'sb', gitabaseSlug: null },
  { slug: 'cc', name: 'Caitanya-caritamrta', vedabaseSlug: 'cc', gitabaseSlug: null },
  { slug: 'iso', name: 'Sri Isopanisad', vedabaseSlug: 'iso', gitabaseSlug: 'iso' },
  { slug: 'noi', name: 'Nectar of Instruction', vedabaseSlug: 'noi', gitabaseSlug: 'noi' },
] as const;

export function getBookConfig(slug: string) {
  return VEDABASE_BOOKS.find((b) => b.slug === slug);
}

export function buildVedabaseUrl(bookSlug: string, canto?: number, chapter?: number, verse?: string) {
  let url = `https://vedabase.io/en/library/${bookSlug}`;
  if (canto) url += `/${canto}`;
  if (chapter) url += `/${chapter}`;
  if (verse) url += `/${verse}`;
  return url;
}

export function buildGitabaseUrl(bookSlug: string, chapter?: number, verse?: string) {
  let url = `https://gitabase.org/${bookSlug}`;
  if (chapter) url += `/${chapter}`;
  if (verse) url += `/${verse}`;
  return url;
}
