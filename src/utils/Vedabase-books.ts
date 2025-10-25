// src/utils/Vedabase-books.ts
// Конфігурація книг з Vedabase/Gitabase для імпорту

export const VEDABASE_BOOKS = [
  { 
    slug: 'bg', 
    name: 'Bhagavad-gita As It Is', 
    vedabaseSlug: 'bg', 
    gitabaseSlug: 'bg',
    our_slug: 'gita',
    name_ua: 'Бгагавад-ґіта як вона є',
    name_en: 'Bhagavad-gita As It Is',
    has_cantos: false,
    gitabase_available: true,
    gitabase_slug: 'bg'
  },
  { 
    slug: 'sb', 
    name: 'Srimad-Bhagavatam', 
    vedabaseSlug: 'sb', 
    gitabaseSlug: null,
    our_slug: 'bhagavatam',
    name_ua: 'Шрімад-Бгаґаватам',
    name_en: 'Srimad-Bhagavatam',
    has_cantos: true,
    gitabase_available: false,
    gitabase_slug: null
  },
  { 
    slug: 'cc', 
    name: 'Caitanya-caritamrta', 
    vedabaseSlug: 'cc', 
    gitabaseSlug: null,
    our_slug: 'scc',
    name_ua: 'Чайтанья-чарітамріта',
    name_en: 'Caitanya-caritamrta',
    has_cantos: true,
    gitabase_available: false,
    gitabase_slug: null
  },
  { 
    slug: 'iso', 
    name: 'Sri Isopanisad', 
    vedabaseSlug: 'iso', 
    gitabaseSlug: 'iso',
    our_slug: 'iso',
    name_ua: 'Шрі Ішопанішад',
    name_en: 'Sri Isopanisad',
    has_cantos: false,
    gitabase_available: true,
    gitabase_slug: 'iso'
  },
  { 
    slug: 'noi', 
    name: 'Nectar of Instruction', 
    vedabaseSlug: 'noi', 
    gitabaseSlug: 'noi',
    our_slug: 'noi',
    name_ua: 'Нектар настанови',
    name_en: 'Nectar of Instruction',
    has_cantos: false,
    gitabase_available: true,
    gitabase_slug: 'noi'
  },
  { 
    slug: 'transcripts', 
    name: 'Transcripts', 
    vedabaseSlug: 'transcripts', 
    gitabaseSlug: null,
    our_slug: 'lectures',
    name_ua: 'Лекції',
    name_en: 'Lectures',
    has_cantos: false,
    gitabase_available: false,
    gitabase_slug: null
  },
  { 
    slug: 'letters', 
    name: 'Letters', 
    vedabaseSlug: 'letters', 
    gitabaseSlug: null,
    our_slug: 'letters',
    name_ua: 'Листи',
    name_en: 'Letters',
    has_cantos: false,
    gitabase_available: false,
    gitabase_slug: null
  },
] as const;

export function getBookConfig(ourSlug: string) {
  return VEDABASE_BOOKS.find((b) => b.our_slug === ourSlug);
}

// Додаткова функція для пошуку по vedabase slug (якщо потрібно)
export function getBookConfigByVedabaseSlug(vedabaseSlug: string) {
  return VEDABASE_BOOKS.find((b) => b.slug === vedabaseSlug);
}

export function buildVedabaseUrl(
  bookConfig: typeof VEDABASE_BOOKS[number] | string, 
  options: { canto?: number; chapter?: number; verse?: string } = {}
) {
  const slug = typeof bookConfig === 'string' ? bookConfig : bookConfig.vedabaseSlug;
  let url = `https://vedabase.io/en/library/${slug}`;
  if (options.canto) url += `/${options.canto}`;
  if (options.chapter) url += `/${options.chapter}`;
  if (options.verse) url += `/${options.verse}`;
  return url;
}

export function buildGitabaseUrl(
  bookConfig: typeof VEDABASE_BOOKS[number] | string, 
  options: { chapter?: number; verse?: string } = {}
) {
  const slug = typeof bookConfig === 'string' ? bookConfig : bookConfig.gitabaseSlug || bookConfig.slug;
  let url = `https://gitabase.org/${slug}`;
  if (options.chapter) url += `/${options.chapter}`;
  if (options.verse) url += `/${options.verse}`;
  return url;
}
