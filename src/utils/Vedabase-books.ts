/**
 * Конфігурація всіх книг Vedabase
 * Використовується для універсального імпорту
 */

export interface VedabaseBook {
  slug: string;
  our_slug?: string;
  name_en: string;
  name_ua: string;
  has_cantos: boolean;
  url_pattern: string;
  gitabase_available: boolean;
  gitabase_slug?: string;
  structure_type: "full" | "text_only" | "mixed";
}

export const VEDABASE_BOOKS: VedabaseBook[] = [
  // ✅ ПРОТЕСТОВАНІ: Основні книги
  {
    slug: "bg",
    our_slug: "gita",
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
    our_slug: "bhagavatam",
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
    our_slug: "scc",
    name_en: "Śrī Caitanya-caritāmṛta",
    name_ua: "Шрі Чайтанья-чарітамріта",
    has_cantos: true,
    url_pattern: "/library/cc/{lila}/{chapter}/{verse}/",
    gitabase_available: true,
    gitabase_slug: "CC",
    structure_type: "full",
  },
  {
    slug: "iso",
    our_slug: "iso",
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
    our_slug: "noi",
    name_en: "Nectar of Instruction",
    name_ua: "Нектар настанов",
    has_cantos: false,
    url_pattern: "/library/noi/{verse}/",
    gitabase_available: false,
    structure_type: "full",
  },
  {
    slug: "bs",
    name_en: "Śrī Brahma-saṁhitā",
    name_ua: "Шрі Брахма-самгіта",
    has_cantos: false,
    url_pattern: "/library/bs/{verse}/",
    gitabase_available: false,
    structure_type: "full",
  },

  // 📖 Текстові книги
  {
    slug: "bbd",
    name_en: "Beyond Birth and Death",
    name_ua: "За межами народження і смерті",
    has_cantos: false,
    url_pattern: "/library/bbd/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
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
    url_pattern: "/library/ssr/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
  },
  {
    slug: "pqn",
    name_en: "Perfect Questions, Perfect Answers",
    name_ua: "Досконалі запитання, досконалі відповіді",
    has_cantos: false,
    url_pattern: "/library/pqn/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
  },
  {
    slug: "lob",
    name_en: "Light of the Bhāgavata",
    name_ua: "Світло Бгаґаватам",
    has_cantos: false,
    url_pattern: "/library/lob/{verse}/",
    gitabase_available: false,
    structure_type: "full",
  },
  {
    slug: "rvs",
    name_en: "Rāja-Vidyā: The King of Knowledge",
    name_ua: "Раджа-відья: Цар знання",
    has_cantos: false,
    url_pattern: "/library/rvs/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
  },
  {
    slug: "ea",
    name_en: "Easy Journey to Other Planets",
    name_ua: "Легка подорож на інші планети",
    has_cantos: false,
    url_pattern: "/library/ea/{chapter}/",
    gitabase_available: false,
    structure_type: "text_only",
  },

  // 🎤 ЛЕКЦІЇ
  {
    slug: "lectures",
    name_en: "Lectures by Srila Prabhupada",
    name_ua: "Лекції Шріли Прабгупади",
    has_cantos: false,
    url_pattern: "/library/lectures/",
    gitabase_available: false,
    structure_type: "text_only",
  },

  // ✉️ ЛИСТИ
  {
    slug: "letters",
    name_en: "Letters by Srila Prabhupada",
    name_ua: "Листи Шріли Прабгупади",
    has_cantos: false,
    url_pattern: "/library/letters/",
    gitabase_available: false,
    structure_type: "text_only",
  },
];

export const CC_LILAS: { [key: string]: string } = {
  "1": "adi",
  "2": "madhya",
  "3": "antya",
};

export function getBookConfig(slug: string): VedabaseBook | undefined {
  return VEDABASE_BOOKS.find((book) => book.slug === slug);
}

export function getBookConfigByOurSlug(ourSlug: string): VedabaseBook | undefined {
  return VEDABASE_BOOKS.find((book) => book.our_slug === ourSlug || book.slug === ourSlug);
}

export function getOurSlug(vedabaseBook: VedabaseBook): string {
  return vedabaseBook.our_slug || vedabaseBook.slug;
}

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

  url = url.replace(/\{[^}]+\}/g, "").replace(/\/+$/, "");

  return baseUrl + url + "/";
}

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

  if (book.slug === "bg") {
    return `${baseUrl}/${slug}/${params.chapter}/${params.verse || ""}`;
  } else if (book.slug === "sb") {
    return `${baseUrl}/${slug}/${params.canto}/${params.chapter}/${params.verse || ""}`;
  } else if (book.slug === "cc") {
    return `${baseUrl}/${slug}/${params.canto}/${params.chapter}/${params.verse || ""}`;
  } else if (book.slug === "iso") {
    return `${baseUrl}/${slug}/${params.verse || ""}`;
  }

  return null;
}

export type BookSlug = (typeof VEDABASE_BOOKS)[number]["slug"];
