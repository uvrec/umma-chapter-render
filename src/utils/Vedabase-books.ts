/**
 * Конфігурація всіх книг Vedabase
 * Використовується для універсального імпорту
 */

export interface VedabaseBook {
  slug: string; // vedabase slug
  our_slug?: string; // наш slug в БД (якщо відрізняється)
  name_en: string;
  name_ua: string;
  has_cantos: boolean;
  url_pattern: string;
  gitabase_available: boolean;
  gitabase_slug?: string;
  structure_type: "full" | "text_only" | "mixed"; // Тип структури контенту
}

export const VEDABASE_BOOKS: VedabaseBook[] = [
  // Основні книги (Є в нашій БД з українською)
  {
    slug: "bg",
    our_slug: "gita", // В нашій БД називається "gita"
    name_en: "Bhagavad-gītā As It Is",
    name_ua: "Бгаґавад-ґіта як вона є",
    has_cantos: false,
    url_pattern: "/library/bg/{chapter}/{verse}/",
    gitabase_available: true,
    gitabase_slug: "BG",
    structure_type: "full",
  },
  {
    slug: "sb",
    our_slug: "bhagavatam", // В нашій БД називається "bhagavatam"
    name_en: "Śrīmad-Bhāgavatam",
    name_ua: "Шрімад-Бгаґаватам",
    has_cantos: true,
    url_pattern: "/library/sb/{canto}/{chapter}/{verse}/",
    gitabase_available: true,
    gitabase_slug: "SB",
    structure_type: "full",
  },
  {
    slug: "cc",
    our_slug: "scc", // В нашій БД називається "scc"
    name_en: "Śrī Caitanya-caritāmṛta",
    name_ua: "Шрі Чайтанья-чарітамріта",
    has_cantos: true, // Adi, Madhya, Antya
    url_pattern: "/library/cc/{lila}/{chapter}/{verse}/",
    gitabase_available: true,
    gitabase_slug: "CC",
    structure_type: "full",
  },
  {
    slug: "iso",
    our_slug: "iso", // Збіг slug
    name_en: "Śrī Īśopaniṣad",
    name_ua: "Шрі Ішопанішад",
    has_cantos: false,
    url_pattern: "/library/iso/{verse}/",
    gitabase_available: true,
    gitabase_slug: "ISO",
    structure_type: "full",
  },
  {
    slug: "noi",
    our_slug: "noi", // Збіг slug
    name_en: "Nectar of Instruction",
    name_ua: "Нектар настанов",
    has_cantos: false,
    url_pattern: "/library/noi/{verse}/",
    gitabase_available: false,
    structure_type: "full",
  },

  // Інші книги (тільки на Vedabase, немає в нашій БД)
  {
    slug: "nod",
    name_en: "The Nectar of Devotion",
    name_ua: "Нектар відданості",
    has_cantos: false,
    url_pattern: "/library/nod/{chapter}/{section}/",
    gitabase_available: false,
    structure_type: "text_only", // Тільки текст, без віршів
  },
  {
    slug: "kb",
    name_en: "Kṛṣṇa, the Supreme Personality of Godhead",
    name_ua: "Крішна, Верховна Особистість Бога",
    has_cantos: false,
    url_pattern: "/library/kb/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
  },
  {
    slug: "tlc",
    name_en: "Teachings of Lord Caitanya",
    name_ua: "Вчення Господа Чайтаньї",
    has_cantos: false,
    url_pattern: "/library/tlc/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
  },
  {
    slug: "tlk",
    name_en: "Teachings of Lord Kapila",
    name_ua: "Вчення Господа Капіли",
    has_cantos: false,
    url_pattern: "/library/tlk/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
  },
  {
    slug: "ssr",
    name_en: "The Science of Self-Realization",
    name_ua: "Наука самоусвідомлення",
    has_cantos: false,
    url_pattern: "/library/ssr/{chapter}/{section}/",
    gitabase_available: false,
    structure_type: "text_only",
  },
  {
    slug: "bs",
    name_en: "Śrī Brahma-saṁhitā",
    name_ua: "Шрі Брахма-самгіта",
    has_cantos: false,
    url_pattern: "/library/bs/{verse}/",
    gitabase_available: false,
    structure_type: "full", // Має вірші
  },
  {
    slug: "bbd",
    name_en: "Beyond Birth and Death",
    name_ua: "За межами народження і смерті",
    has_cantos: false,
    url_pattern: "/library/bbd/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
  },
];

/**
 * Маппінг ліл Chaitanya-caritamrita
 */
export const CC_LILAS: { [key: string]: string } = {
  "1": "adi",
  "2": "madhya",
  "3": "antya",
};

/**
 * Отримати конфігурацію книги по slug
 */
export function getBookConfig(slug: string): VedabaseBook | undefined {
  return VEDABASE_BOOKS.find((book) => book.slug === slug);
}

/**
 * Отримати конфігурацію книги по нашому slug
 */
export function getBookConfigByOurSlug(ourSlug: string): VedabaseBook | undefined {
  return VEDABASE_BOOKS.find((book) => book.our_slug === ourSlug || book.slug === ourSlug);
}

/**
 * Отримати наш slug для імпорту (наш slug або vedabase slug якщо наш не вказаний)
 */
export function getOurSlug(vedabaseBook: VedabaseBook): string {
  return vedabaseBook.our_slug || vedabaseBook.slug;
}

/**
 * Сформувати URL для Vedabase
 */
export function buildVedabaseUrl(
  book: VedabaseBook,
  params: {
    canto?: string;
    lila?: string;
    chapter?: string;
    verse?: string;
  },
): string {
  const baseUrl = "https://vedabase.io/en";
  let url = book.url_pattern;

  // Для CC використовуємо назви ліл
  if (book.slug === "cc" && params.canto) {
    const lilaName = CC_LILAS[params.canto] || "adi";
    url = url.replace("{lila}", lilaName);
  } else if (params.canto) {
    url = url.replace("{canto}", params.canto);
  }

  if (params.chapter) {
    url = url.replace("{chapter}", params.chapter);
  }

  if (params.verse) {
    url = url.replace("{verse}", params.verse);
  }

  // Видаляємо незамінені плейсхолдери для отримання базового URL глави
  url = url.replace(/\{[^}]+\}/g, "").replace(/\/+$/, "");

  return baseUrl + url + "/";
}

/**
 * Сформувати URL для Gitabase
 */
export function buildGitabaseUrl(
  book: VedabaseBook,
  params: {
    canto?: string;
    chapter?: string;
    verse?: string;
  },
): string | null {
  if (!book.gitabase_available || !book.gitabase_slug) {
    return null;
  }

  const baseUrl = "https://gitabase.com/ukr";
  const slug = book.gitabase_slug;

  // Формат для різних книг
  if (book.slug === "bg") {
    // BG: https://gitabase.com/ukr/BG/1/1
    return `${baseUrl}/${slug}/${params.chapter}/${params.verse || ""}`;
  } else if (book.slug === "sb") {
    // SB: https://gitabase.com/ukr/SB/1/1/1
    return `${baseUrl}/${slug}/${params.canto}/${params.chapter}/${params.verse || ""}`;
  } else if (book.slug === "cc") {
    // CC: https://gitabase.com/ukr/CC/1/1/1
    return `${baseUrl}/${slug}/${params.canto}/${params.chapter}/${params.verse || ""}`;
  } else if (book.slug === "iso") {
    // ISO: https://gitabase.com/ukr/ISO/1
    return `${baseUrl}/${slug}/${params.verse || ""}`;
  }

  return null;
}

/**
 * Типи для TypeScript
 */
export type BookSlug = (typeof VEDABASE_BOOKS)[number]["slug"];
