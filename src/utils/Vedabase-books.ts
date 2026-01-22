// src/utils/Vedabase-books.ts
// Централізована конфігурація книг з Vedabase/Gitabase для імпорту
// КРИТИЧНО: Gitabase Ukrainian version доступний ТІЛЬКИ для CC та NoI!

export const VEDABASE_BOOKS = [
  {
    slug: "bg",
    name: "Bhagavad-gita As It Is",
    vedabaseSlug: "bg",
    our_slug: "bg",
    name_uk: "Бгаґавад-ґіта як вона є",
    name_en: "Bhagavad-gita As It Is",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    // Парсинг
    templateId: "bhagavad-gita",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  {
    slug: "sb",
    name: "Srimad-Bhagavatam",
    vedabaseSlug: "sb",
    our_slug: "sb",
    name_uk: "Шрімад-Бгаґаватам",
    name_en: "Srimad-Bhagavatam",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    // Структура книги
    isMultiVolume: true,
    has_cantos: true,
    volumeLabel: "Пісня",
    cantos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    // Парсинг
    templateId: "srimad-bhagavatam",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело - iskconpress (канти 1-10, 11-12 немає)
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/sb",
  },
  {
    slug: "cc",
    name: "Caitanya-caritamrta",
    vedabaseSlug: "cc",
    our_slug: "scc",
    name_uk: "Шрі Чайтанья-чарітамріта",
    name_en: "Caitanya-caritamrta",
    // Структура книги
    isMultiVolume: true,
    has_cantos: true,
    volumeLabel: "Ліла",
    cantos: ["adi", "madhya", "antya"],
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: true, // ✅ Є UK версія на Gitabase
    gitabase_available: true,
    gitabaseSlug: "CC",
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  {
    slug: "iso",
    name: "Sri Isopanisad",
    vedabaseSlug: "iso",
    our_slug: "iso",
    name_uk: "Шрі Ішопанішад",
    name_en: "Sri Isopanisad",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Мантра",
    cantos: undefined,
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  {
    slug: "noi",
    name: "Nectar of Instruction",
    vedabaseSlug: "noi",
    our_slug: "noi",
    name_uk: "Нектар настанов",
    name_en: "Nectar of Instruction",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Текст",
    cantos: undefined,
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: true, // ✅ Є UK версія на Gitabase
    gitabase_available: true,
    gitabaseSlug: "NoI",
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
    // ⚠️ ОСОБЛИВА СТРУКТУРА: NoI не має глав, тільки 11 текстів
    // URL: /noi/{textNumber}/ (не /noi/{chapter}/{verse}/)
    // Для імпорту: chapter=1 (фіксована), verse=1-11 (номери текстів)
    hasSpecialStructure: true as boolean | undefined,
  },
  {
    slug: "nod",
    name: "Nectar of Devotion",
    vedabaseSlug: "nod",
    our_slug: "nod",
    name_uk: "Нектар відданості",
    name_en: "Nectar of Devotion",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  {
    slug: "kb",
    name: "Krsna, The Supreme Personality of Godhead",
    vedabaseSlug: "kb",
    our_slug: "kb",
    name_uk: "Крішна — Верховна Особистість Бога",
    name_en: "Krsna, The Supreme Personality of Godhead",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  {
    slug: "tlk",
    name: "Teachings of Lord Kapila",
    vedabaseSlug: "tlk",
    our_slug: "tlk",
    name_uk: "Наука самоусвідомлення",
    name_en: "Teachings of Lord Kapila",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  {
    slug: "bs",
    name: "Brahma-saṁhitā",
    vedabaseSlug: "bs",
    our_slug: "bs",
    name_uk: "Брахма-самгіта",
    name_en: "Brahma-saṁhitā",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Вірш",
    cantos: undefined,
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  {
    slug: "transcripts",
    name: "Transcripts",
    vedabaseSlug: "transcripts",
    our_slug: "lectures",
    name_uk: "Лекції",
    name_en: "Lectures",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Лекція",
    cantos: undefined,
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  {
    slug: "letters",
    name: "Letters",
    vedabaseSlug: "letters",
    our_slug: "letters",
    name_uk: "Листи",
    name_en: "Letters",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Лист",
    cantos: undefined,
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело (опціонально)
    source: undefined as string | undefined,
    sourceUrl: undefined as string | undefined,
    author: undefined as string | undefined,
    author_uk: undefined as string | undefined,
  },
  // ========== КНИГИ BHAKTIVINODA THAKUR ==========
  {
    slug: "saranagati",
    name: "Śaraṇāgati",
    vedabaseSlug: null,
    our_slug: "saranagati",
    name_uk: "Шаранагаті",
    name_en: "Śaraṇāgati - Songs of Surrender",
    // Автор
    author: "Bhaktivinoda Thakur",
    author_uk: "Бгактівінод Тхакур",
    // Джерело
    source: "kksongs",
    sourceUrl: "https://kksongs.org/authors/literature/saranagati.html",
    // Структура книги
    isMultiVolume: false,
    has_cantos: true, // ✅ 9 cantos (sections), 54 songs total
    volumeLabel: "Song", // Пісня
    cantos: [
      { number: 1, name: "Dainya", name_uk: "Смирення", songs: 7 },
      { number: 2, name: "Ātma Nivedana", name_uk: "Посвячення себе", songs: 8 },
      { number: 3, name: "Goptṛtve-Varaṇa", name_uk: "Вибір Захисника", songs: 4 },
      { number: 4, name: "Avaśya Rakṣibe Kṛṣṇa", name_uk: "Крішна неодмінно захистить", songs: 6 },
      { number: 5, name: "Bhakti-Pratikūla-Bhāva", name_uk: "Відкинути несприятливе для бгакті", songs: 5 },
      { number: 6, name: "Svīkara", name_uk: "Прийняти сприятливе", songs: 5 },
      { number: 7, name: "Bhajana Lālasā", name_uk: "Прагнення до бгаджану", songs: 13 },
      { number: 8, name: "Siddhi Lālasā", name_uk: "Прагнення до досконалості", songs: 3 },
      { number: 9, name: "Vijñapti & Śrī Nāma Māhātmya", name_uk: "Молитва і слава Святого Імені", songs: 2 },
    ],
    // Парсинг
    templateId: "kksongs-songs", // ✅ Bengali, transliteration, synonyms, translation, commentary
    // Gitabase
    hasGitabaseUK: false, // ❌ Імпортується з kksongs.org (Bengali + EN)
    gitabase_available: false,
    gitabaseSlug: null,
  },
  // ========== RAJA VIDYA (VEDABASE) ==========
  {
    slug: "rv",
    name: "Raja Vidya",
    vedabaseSlug: "rv",
    our_slug: "rvs",
    name_uk: "Раджа відья",
    name_en: "Raja Vidya - The King of Knowledge",
    // Автор
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    // Структура книги
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    // Парсинг
    templateId: "raja-vidya",
    // Gitabase
    hasGitabaseUK: false, // ❌ UK версії НЕМАЄ на Gitabase (українську беремо з файлу)
    gitabase_available: false,
    gitabaseSlug: null,
    // Джерело
    source: "vedabase",
    sourceUrl: "https://vedabase.io/en/library/rv/",
  },
  // ========== TRANSCENDENTAL DIARY (PRABHUPADAVANI.ORG) ==========
  {
    slug: "td",
    name: "Transcendental Diary",
    vedabaseSlug: null,
    our_slug: "td",
    name_uk: "Трансцендентний щоденник",
    name_en: "Transcendental Diary",
    // Автор
    author: "Hari Sauri dasa",
    author_uk: "Харі Шаурі дас",
    // Джерело
    source: "prabhupadavani",
    sourceUrl: "https://prabhupadavani.org/bio/transcendental-diary/",
    // Структура книги - 5 томів
    isMultiVolume: true,
    has_cantos: true, // ✅ 5 volumes
    volumeLabel: "Том", // Volume
    cantos: [1, 2, 3, 4, 5],
    // Парсинг
    templateId: "transcendental-diary",
    // Gitabase
    hasGitabaseUK: false, // ❌ Імпортується з prabhupadavani.org (EN only for now)
    gitabase_available: false,
    gitabaseSlug: null,
    // Metadata
    volumeInfo: [
      { number: 1, title: "Volume 1", subtitle: "November 1975 – April 1976", chapters: 12 },
      { number: 2, title: "Volume 2", subtitle: "April 1976 – June 1976", chapters: 6 },
      { number: 3, title: "Volume 3", subtitle: "June 1976 – August 1976", chapters: 6 },
      { number: 4, title: "Volume 4", subtitle: "August 1976 – October 1976", chapters: 6 },
      { number: 5, title: "Volume 5", subtitle: "October 1976 – November 1977", chapters: 8 },
    ] as Array<{ number: number; title: string; subtitle: string; chapters: number }> | undefined,
  },
  // ========== CHAITANYA BHAGAVATA (WISDOMLIB.ORG) ==========
  {
    slug: "scb",
    name: "Chaitanya Bhagavata",
    vedabaseSlug: null,
    our_slug: "scb",
    name_uk: "Шрі Чайтанья-бгаґавата",
    name_en: "Sri Chaitanya Bhagavata",
    // Автор
    author: "Vrindavan Das Thakur",
    author_uk: "Вріндаван Дас Тхакур",
    // Джерело
    source: "wisdomlib",
    sourceUrl: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata",
    // Структура книги
    isMultiVolume: true,
    has_cantos: true, // ✅ 3 khaṇḍas: Ādi, Madhya, Antya
    volumeLabel: "Khaṇḍa", // Розділ
    cantos: ["adi", "madhya", "antya"],
    // Парсинг
    templateId: "default",
    // Gitabase
    hasGitabaseUK: false, // ❌ Імпортується з wisdomlib.org (Bengali + EN)
    gitabase_available: false,
    gitabaseSlug: null,
    // Specific URLs for each khaṇḍa
    khandaUrls: {
      adi: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1092508.html",
      madhya: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1098648.html",
      antya: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1108871.html",
      intro: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1112454.html",
      gaudiya_bhasya_1: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1112455.html",
      gaudiya_bhasya_2: "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata/d/doc1095577.html",
    } as Record<string, string> | undefined,
  },
  // ========== PRABHUPADA'S SMALL BOOKS (ISKCONPRESS) ==========
  {
    slug: "bbd",
    name: "Beyond Birth and Death",
    vedabaseSlug: "bbd",
    our_slug: "bbd",
    name_uk: "По той бік народження і смерті",
    name_en: "Beyond Birth and Death",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/bbd",
  },
  {
    slug: "ekc",
    name: "Elevation to Kṛṣṇa Consciousness",
    vedabaseSlug: "ekc",
    our_slug: "ekc",
    name_uk: "Підняття до свідомості Крішни",
    name_en: "Elevation to Kṛṣṇa Consciousness",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/ekc",
  },
  {
    slug: "lcfl",
    name: "Life Comes From Life",
    vedabaseSlug: "lcfl",
    our_slug: "lcfl",
    name_uk: "Життя походить від життя",
    name_en: "Life Comes From Life",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Бесіда",
    cantos: undefined,
    templateId: "conversations",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/lcfl",
  },
  {
    slug: "lob",
    name: "Light of the Bhāgavata",
    vedabaseSlug: "lob",
    our_slug: "lob",
    name_uk: "Світло Бгаґаватам",
    name_en: "Light of the Bhāgavata",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Текст",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/lob",
  },
  {
    slug: "mg",
    name: "The Matchless Gift",
    vedabaseSlug: "mg",
    our_slug: "mg",
    name_uk: "Неперевершений дар",
    name_en: "The Matchless Gift",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/mg",
  },
  {
    slug: "mm",
    name: "Mukunda-mālā-stotra",
    vedabaseSlug: "mm",
    our_slug: "mm",
    name_uk: "Мукунда-мала-стотра",
    name_en: "Mukunda-mālā-stotra",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Сутра",
    cantos: undefined,
    templateId: "verses",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/mm",
  },
  {
    slug: "mog",
    name: "Message of Godhead",
    vedabaseSlug: "mog",
    our_slug: "mog",
    name_uk: "Послання Бога",
    name_en: "Message of Godhead",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/mog",
  },
  {
    slug: "nbs",
    name: "Nārada-bhakti-sūtra",
    vedabaseSlug: "nbs",
    our_slug: "nbs",
    name_uk: "Нарада-бгакті-сутра",
    name_en: "Nārada-bhakti-sūtra",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Сутра",
    cantos: undefined,
    templateId: "verses",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/nbs",
  },
  {
    slug: "owk",
    name: "On the Way to Kṛṣṇa",
    vedabaseSlug: "owk",
    our_slug: "owk",
    name_uk: "На шляху до Крішни",
    name_en: "On the Way to Kṛṣṇa",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/owk",
  },
  {
    slug: "pop",
    name: "The Path of Perfection",
    vedabaseSlug: "pop",
    our_slug: "pop",
    name_uk: "Шлях досконалості",
    name_en: "The Path of Perfection",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/pop",
  },
  {
    slug: "ssr",
    name: "The Science of Self-Realization",
    vedabaseSlug: "ssr",
    our_slug: "ssr",
    name_uk: "Наука самоусвідомлення",
    name_en: "The Science of Self-Realization",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/ssr",
  },
  {
    slug: "tlc",
    name: "Teachings of Lord Caitanya",
    vedabaseSlug: "tlc",
    our_slug: "tlc",
    name_uk: "Вчення Господа Чайтан'ї",
    name_en: "Teachings of Lord Caitanya",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/tlc",
  },
  {
    slug: "tqk",
    name: "Teachings of Queen Kuntī",
    vedabaseSlug: "tqk",
    our_slug: "tqk",
    name_uk: "Вчення цариці Кунті",
    name_en: "Teachings of Queen Kuntī",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/tqk",
  },
  {
    slug: "ttp",
    name: "Teachings of Prahlāda Mahārāja",
    vedabaseSlug: "ttp",
    our_slug: "ttp",
    name_uk: "Вчення Прахлади Махараджа",
    name_en: "Teachings of Prahlāda Mahārāja",
    author: "A. C. Bhaktivedanta Swami Prabhupada",
    author_uk: "А. Ч. Бгактіведанта Свамі Прабгупада",
    isMultiVolume: false,
    has_cantos: false,
    volumeLabel: "Глава",
    cantos: undefined,
    templateId: "prose",
    hasGitabaseUK: false,
    gitabase_available: false,
    gitabaseSlug: null,
    source: "iskconpress",
    sourceUrl: "https://github.com/iskconpress/books/tree/master/ttp",
  },
] as const;

// Типи для TypeScript
export type VedabaseBook = (typeof VEDABASE_BOOKS)[number];
export type VedabaseBookSlug = VedabaseBook["slug"];
export type OurBookSlug = VedabaseBook["our_slug"];

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
  options: { canto?: number | string; chapter?: number; verse?: string } = {},
) {
  const slug = typeof bookConfig === "string" ? bookConfig : bookConfig.vedabaseSlug;
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
 * // => 'https://gitabase.com/ua/CC/1/1'
 */
export function buildGitabaseUrl(
  bookSlug: string,
  options: { lila?: number | string; chapter?: number; verse?: string | number } = {},
) {
  let url = `https://gitabase.com/ua/${bookSlug.toUpperCase()}`;
  if (options.lila) url += `/${options.lila}`;
  if (options.chapter) url += `/${options.chapter}`;
  if (options.verse) url += `/${options.verse}`;
  return url;
}
