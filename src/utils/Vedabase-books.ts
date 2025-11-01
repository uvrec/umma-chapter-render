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
    has_cantos: true, // ✅ 9 cantos (sections), 54 songs total
    volumeLabel: 'Song', // Пісня
    cantos: [
      { number: 1, name: 'Dainya', name_ua: 'Смирення', songs: 7 },
      { number: 2, name: 'Ātma Nivedana', name_ua: 'Посвячення себе', songs: 8 },
      { number: 3, name: 'Goptṛtve-Varaṇa', name_ua: 'Вибір Захисника', songs: 4 },
      { number: 4, name: 'Avaśya Rakṣibe Kṛṣṇa', name_ua: 'Крішна неодмінно захистить', songs: 6 },
      { number: 5, name: 'Bhakti-Pratikūla-Bhāva', name_ua: 'Відкинути несприятливе для бгакті', songs: 5 },
      { number: 6, name: 'Svīkara', name_ua: 'Прийняти сприятливе', songs: 5 },
      { number: 7, name: 'Bhajana Lālasā', name_ua: 'Прагнення до бгаджану', songs: 13 },
      { number: 8, name: 'Siddhi Lālasā', name_ua: 'Прагнення до досконалості', songs: 3 },
      { number: 9, name: 'Vijñapti & Śrī Nāma Māhātmya', name_ua: 'Молитва і слава Святого Імені', songs: 2 }
    ],
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
 */
export function getBookConfigByVedabaseSlug(vedabaseSlug: string) {
  return VEDABASE_BOOKS.find((b) => b.slug === vedabaseSlug);
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
