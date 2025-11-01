// src/utils/Vedabase-books.ts
// Централізована конфігурація книг з Vedabase/Gitabase для імпорту
// КРИТИЧНО: Gitabase Ukrainian version доступний ТІЛЬКИ для CC та NoI!

export const VEDABASE_BOOKS = [
  {
    slug: 'bg',
    name: 'Bhagavad-gita As It Is',
    vedabaseSlug: 'bg',
    our_slug: 'gita',
    name_ua: 'Бгаґавад-ґіта як вона є',
    name_en: 'Bhagavad-gita As It Is',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Глава',
    cantos: undefined,
    // Парсинг
    templateId: 'bhagavad-gita',
    // Gitabase
    hasGitabaseUA: false, // ❌ UA версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'sb',
    name: 'Srimad-Bhagavatam',
    vedabaseSlug: 'sb',
    our_slug: 'bhagavatam',
    name_ua: 'Шрімад-Бгаґаватам',
    name_en: 'Srimad-Bhagavatam',
    // Структура книги
    isMultiVolume: true,
    has_cantos: true,
    volumeLabel: 'Пісня',
    cantos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    // Парсинг
    templateId: 'srimad-bhagavatam',
    // Gitabase
    hasGitabaseUA: false, // ❌ UA версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'cc',
    name: 'Caitanya-caritamrta',
    vedabaseSlug: 'cc',
    our_slug: 'scc',
    name_ua: 'Шрі Чайтанья-чарітамріта',
    name_en: 'Caitanya-caritamrta',
    // Структура книги
    isMultiVolume: true,
    has_cantos: true,
    volumeLabel: 'Ліла',
    cantos: ['adi', 'madhya', 'antya'],
    // Парсинг
    templateId: 'default',
    // Gitabase
    hasGitabaseUA: true, // ✅ Є UA версія на Gitabase
    gitabase_available: true,
    gitabaseSlug: 'CC',
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'iso',
    name: 'Sri Isopanisad',
    vedabaseSlug: 'iso',
    our_slug: 'iso',
    name_ua: 'Шрі Ішопанішад',
    name_en: 'Sri Isopanisad',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Мантра',
    cantos: undefined,
    // Парсинг
    templateId: 'default',
    // Gitabase
    hasGitabaseUA: false, // ❌ UA версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'noi',
    name: 'Nectar of Instruction',
    vedabaseSlug: 'noi',
    our_slug: 'noi',
    name_ua: 'Нектар настанов',
    name_en: 'Nectar of Instruction',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Текст',
    cantos: undefined,
    // Парсинг
    templateId: 'default',
    // Gitabase
    hasGitabaseUA: true, // ✅ Є UA версія на Gitabase
    gitabase_available: true,
    gitabaseSlug: 'NoI',
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'nod',
    name: 'Nectar of Devotion',
    vedabaseSlug: 'nod',
    our_slug: 'nod',
    name_ua: 'Нектар відданості',
    name_en: 'Nectar of Devotion',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Глава',
    cantos: undefined,
    // Парсинг
    templateId: 'default',
    // Gitabase
    hasGitabaseUA: false, // ❌ UA версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'kb',
    name: 'Krsna, The Supreme Personality of Godhead',
    vedabaseSlug: 'kb',
    our_slug: 'kb',
    name_ua: 'Крішна — Верховна Особистість Бога',
    name_en: 'Krsna, The Supreme Personality of Godhead',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Глава',
    cantos: undefined,
    // Парсинг
    templateId: 'default',
    // Gitabase
    hasGitabaseUA: false, // ❌ UA версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'tlk',
    name: 'Teachings of Lord Kapila',
    vedabaseSlug: 'tlk',
    our_slug: 'tlk',
    name_ua: 'Наука самоусвідомлення',
    name_en: 'Teachings of Lord Kapila',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Глава',
    cantos: undefined,
    // Парсинг
    templateId: 'default',
    // Gitabase
    hasGitabaseUA: false, // ❌ UA версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'transcripts',
    name: 'Transcripts',
    vedabaseSlug: 'transcripts',
    our_slug: 'lectures',
    name_ua: 'Лекції',
    name_en: 'Lectures',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Лекція',
    cantos: undefined,
    // Парсинг
    templateId: 'default',
    // Gitabase
    hasGitabaseUA: false, // ❌ UA версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  {
    slug: 'letters',
    name: 'Letters',
    vedabaseSlug: 'letters',
    our_slug: 'letters',
    name_ua: 'Листи',
    name_en: 'Letters',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Лист',
    cantos: undefined,
    // Парсинг
    templateId: 'default',
    // Gitabase
    hasGitabaseUA: false, // ❌ UA версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_ua: undefined as string | undefined,
  },
  // ========== КНИГИ BHAKTIVINODA THAKUR ==========
  {
    slug: 'saranagati',
    name: 'Śaraṇāgati',
    vedabaseSlug: null,
    our_slug: 'saranagati',
    name_ua: 'Шаранагаті',
    name_en: 'Śaraṇāgati - Songs of Surrender',
    // Автор
    author: 'Bhaktivinoda Thakur',
    author_ua: 'Бгактівінод Тхакур',
    // Джерело
    source: 'bhaktivinodainstitute',
    sourceUrl: 'https://bhaktivinodainstitute.org/writings/songs-poems/saranagati-surrendered-to-the-lords-shelter/',
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: 'Song', // Пісня
    cantos: undefined,
    // Парсинг
    templateId: 'bhaktivinoda-songs',
    // Gitabase
    hasGitabaseUA: false, // ❌ Тільки EN з bhaktivinodainstitute.org
    gitabase_available: false,
    gitabaseSlug: null,
  },
] as const;

// Типи для TypeScript
export type VedabaseBook = typeof VEDABASE_BOOKS[number];
export type VedabaseBookSlug = VedabaseBook['slug'];
export type OurBookSlug = VedabaseBook['our_slug'];

/**
 * Знайти конфігурацію книги по нашому внутрішньому slug (gita, bhagavatam, scc, etc.)
 */
export function getBookConfig(ourSlug: string) {
  return VEDABASE_BOOKS.find((b) => b.our_slug === ourSlug);
}

/**
 * Знайти конфігурацію книги по Vedabase slug (bg, sb, cc, etc.)
 * Також працює з книгами без vedabaseSlug (наприклад, bhaktivinoda книги)
 */
export function getBookConfigByVedabaseSlug(vedabaseSlug: string) {
  return VEDABASE_BOOKS.find((b) => b.slug === vedabaseSlug || b.vedabaseSlug === vedabaseSlug);
}

/**
 * Побудувати URL для Vedabase
 * @example buildVedabaseUrl('bg', { chapter: 1, verse: '1' })
 * // => 'https://vedabase.io/en/library/bg/1/1'
 * @example buildVedabaseUrl(bookConfig, { canto: 1, chapter: 2, verse: '3' })
 * // => 'https://vedabase.io/en/library/sb/1/2/3'
 */
export function buildVedabaseUrl(
  bookConfig: VedabaseBook | string,
  options: { canto?: number | string; chapter?: number; verse?: string } = {}
) {
  const slug = typeof bookConfig === 'string' ? bookConfig : bookConfig.vedabaseSlug;
  let url = `https://vedabase.io/en/library/${slug}`;
  if (options.canto) url += `/${options.canto}`;
  if (options.chapter) url += `/${options.chapter}`;
  if (options.verse) url += `/${options.verse}`;
  return url;
}

/**
 * Побудувати URL для Gitabase
 * ВАЖЛИВО: Gitabase Ukrainian доступний ТІЛЬКИ для CC та NoI!
 * @example buildGitabaseUrl('CC', { chapter: 1, verse: '1' })
 * // => 'https://gitabase.com/ukr/CC/1/1'
 */
export function buildGitabaseUrl(
  bookSlug: string,
  options: { lila?: number | string; chapter?: number; verse?: string | number } = {}
) {
  let url = `https://gitabase.com/ukr/${bookSlug.toUpperCase()}`;
  if (options.lila) url += `/${options.lila}`;
  if (options.chapter) url += `/${options.chapter}`;
  if (options.verse) url += `/${options.verse}`;
  return url;
}
