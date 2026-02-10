/**
 * Sanskrit Poetry Meters (Chandas / छन्दस्) Database
 *
 * Each meter is defined by its pattern of laghu (⏑, light) and guru (–, heavy) syllables.
 * Gaṇa system: groups of 3 syllables used as shorthand notation.
 *
 * The 8 gaṇas:
 *   ya = ⏑––   ra = –⏑–   ta = ––⏑   bha = –⏑⏑
 *   ja = ⏑–⏑   sa = ⏑⏑–   ma = –––   na  = ⏑⏑⏑
 *
 * Single markers:  la (l) = ⏑   ga (g) = –
 */

// L = laghu (light), G = guru (heavy)
export type SyllableWeight = "L" | "G";

// X = either (free, typically the last syllable of a pāda)
export type PatternSymbol = "L" | "G" | "X";

export interface MeterDefinition {
  id: string;
  /** Sanskrit name in IAST */
  nameIAST: string;
  /** Sanskrit name in Devanagari */
  nameDevanagari: string;
  /** Ukrainian transliteration */
  nameUkrainian: string;
  /** Number of syllables per pāda */
  syllablesPerPada: number;
  /** Gaṇa formula (e.g. "ta-bha-ja-ja-ga-ga") */
  ganaFormula: string;
  /** Pattern for one pāda: array of L/G/X */
  pattern: PatternSymbol[];
  /** Yati (caesura) positions — after which syllable numbers */
  ypiati?: number[];
  /** Category of the meter */
  category: "samavṛtta" | "ardhasamavṛtta" | "viṣamavṛtta" | "jāti";
  /** Brief description */
  description: string;
  /** Ukrainian description */
  descriptionUk: string;
  /** Known example verse in IAST */
  example?: {
    iast: string;
    devanagari?: string;
    source?: string;
  };
}

export const GANA_MAP: Record<string, PatternSymbol[]> = {
  ya: ["L", "G", "G"],
  ra: ["G", "L", "G"],
  ta: ["G", "G", "L"],
  bha: ["G", "L", "L"],
  ja: ["L", "G", "L"],
  sa: ["L", "L", "G"],
  ma: ["G", "G", "G"],
  na: ["L", "L", "L"],
  la: ["L"],
  ga: ["G"],
};

export const GANA_NAMES: Record<string, string> = {
  ya: "ya-gaṇa (⏑––)",
  ra: "ra-gaṇa (–⏑–)",
  ta: "ta-gaṇa (––⏑)",
  bha: "bha-gaṇa (–⏑⏑)",
  ja: "ja-gaṇa (⏑–⏑)",
  sa: "sa-gaṇa (⏑⏑–)",
  ma: "ma-gaṇa (–––)",
  na: "na-gaṇa (⏑⏑⏑)",
};

/**
 * Comprehensive database of classical Sanskrit meters.
 * Ordered roughly by syllable count and then by popularity.
 */
export const METERS: MeterDefinition[] = [
  // ==================== 8 syllables ====================
  {
    id: "anustubh",
    nameIAST: "Anuṣṭubh (Śloka)",
    nameDevanagari: "अनुष्टुभ् (श्लोक)",
    nameUkrainian: "Анушт̣убг (Шлока)",
    syllablesPerPada: 8,
    ganaFormula: "variable (see rules)",
    pattern: ["X", "X", "X", "X", "L", "G", "L", "X"],
    category: "samavṛtta",
    description:
      "The most common Sanskrit meter. 4 pādas of 8 syllables. Even pādas: positions 5-7 are ⏑–⏑ (pathyā). The last syllable is always free.",
    descriptionUk:
      "Найпоширеніший санскритський розмір. 4 пади по 8 складів. Парні пади: позиції 5-7 — ⏑–⏑ (патхйа̄). Останній склад вільний.",
    example: {
      iast: "dharma-kṣetre kuru-kṣetre\nsamavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāś caiva\nkim akurvata sañjaya",
      devanagari:
        "धर्मक्षेत्रे कुरुक्षेत्रे\nसमवेता युयुत्सवः\nमामकाः पाण्डवाश्चैव\nकिमकुर्वत सञ्जय",
      source: "Bhagavad-gītā 1.1",
    },
  },

  // ==================== 11 syllables ====================
  {
    id: "indravajra",
    nameIAST: "Indravajrā",
    nameDevanagari: "इन्द्रवज्रा",
    nameUkrainian: "Індраваджра̄",
    syllablesPerPada: 11,
    ganaFormula: "ta-ta-ja-ga-ga",
    pattern: ["G", "G", "L", "G", "G", "L", "L", "G", "L", "G", "G"],
    category: "samavṛtta",
    description:
      "11-syllable meter with a strong, majestic cadence. Often mixed with Upendravajrā to form Upajāti.",
    descriptionUk:
      "11-складовий розмір з сильною, величною каденцією. Часто змішується з Упендраваджрою, утворюючи Упаджа̄ті.",
    example: {
      iast: "senānīnām ahaṃ skandaḥ\nsarasām asmi sāgaraḥ",
      source: "Bhagavad-gītā 10.24 (adapted)",
    },
  },
  {
    id: "upendravajra",
    nameIAST: "Upendravajrā",
    nameDevanagari: "उपेन्द्रवज्रा",
    nameUkrainian: "Упендраваджра̄",
    syllablesPerPada: 11,
    ganaFormula: "ja-ta-ja-ga-ga",
    pattern: ["L", "G", "L", "G", "G", "L", "L", "G", "L", "G", "G"],
    category: "samavṛtta",
    description:
      "11-syllable meter, lighter opening than Indravajrā. Together they form the Upajāti family.",
    descriptionUk:
      "11-складовий розмір, легший початок ніж Індраваджра̄. Разом вони утворюють сімейство Упаджа̄ті.",
  },
  {
    id: "upajati",
    nameIAST: "Upajāti",
    nameDevanagari: "उपजाति",
    nameUkrainian: "Упаджа̄ті",
    syllablesPerPada: 11,
    ganaFormula: "mix of Indravajrā and Upendravajrā",
    // Upajāti allows each pāda to be either Indravajrā or Upendravajrā pattern
    pattern: ["X", "G", "L", "G", "G", "L", "L", "G", "L", "G", "G"],
    category: "samavṛtta",
    description:
      "A mixed 11-syllable meter. Each pāda can follow either Indravajrā (––⏑...) or Upendravajrā (⏑–⏑...) pattern.",
    descriptionUk:
      "Змішаний 11-складовий розмір. Кожна па̄да може слідувати або Індраваджрі (––⏑...) або Упендраваджрі (⏑–⏑...) патерну.",
    example: {
      iast: "yad yad ācarati śreṣṭhas\ntat tad evetaro janaḥ\nsa yat pramāṇaṃ kurute\nlokas tad anuvartate",
      devanagari:
        "यद्यदाचरति श्रेष्ठस्\nतत्तदेवेतरो जनः\nस यत्प्रमाणं कुरुते\nलोकस्तदनुवर्तते",
      source: "Bhagavad-gītā 3.21",
    },
  },
  {
    id: "rathoddhata",
    nameIAST: "Rathoddhatā",
    nameDevanagari: "रथोद्धता",
    nameUkrainian: "Ратходдгата̄",
    syllablesPerPada: 11,
    ganaFormula: "ra-na-ra-la-ga",
    pattern: ["G", "L", "G", "L", "L", "L", "G", "L", "G", "L", "G"],
    category: "samavṛtta",
    description: "11-syllable meter with a lively, chariot-like rhythm.",
    descriptionUk: "11-складовий розмір з жвавим ритмом, подібним до колісниці.",
  },
  {
    id: "svagata",
    nameIAST: "Svāgatā",
    nameDevanagari: "स्वागता",
    nameUkrainian: "Сва̄ґата̄",
    syllablesPerPada: 11,
    ganaFormula: "ra-na-bha-ga-ga",
    pattern: ["G", "L", "G", "L", "L", "L", "G", "L", "L", "G", "G"],
    category: "samavṛtta",
    description: "11-syllable meter with a welcoming cadence.",
    descriptionUk: "11-складовий розмір з привітною каденцією.",
  },

  // ==================== 12 syllables ====================
  {
    id: "vamsastha",
    nameIAST: "Vaṃśastha",
    nameDevanagari: "वंशस्थ",
    nameUkrainian: "Вам̇шастха",
    syllablesPerPada: 12,
    ganaFormula: "ja-ta-ja-ra",
    pattern: ["L", "G", "L", "G", "G", "L", "L", "G", "L", "G", "L", "G"],
    category: "samavṛtta",
    description: "12-syllable meter with alternating patterns. Name means 'standing in lineage'.",
    descriptionUk:
      "12-складовий розмір з чергуванням. Назва означає «стоячий в лінії».",
  },
  {
    id: "drutavilambita",
    nameIAST: "Drutavilambita",
    nameDevanagari: "द्रुतविलम्बित",
    nameUkrainian: "Друтавіламбіта",
    syllablesPerPada: 12,
    ganaFormula: "na-bha-bha-ra",
    pattern: ["L", "L", "L", "G", "L", "L", "G", "L", "L", "G", "L", "G"],
    category: "samavṛtta",
    description:
      "12-syllable meter with a fast-slow rhythm, as its name suggests: 'quick and delayed'.",
    descriptionUk:
      "12-складовий розмір з ритмом швидко-повільно, як вказує назва: «швидкий і затриманий».",
  },

  // ==================== 13 syllables ====================
  {
    id: "praharsini",
    nameIAST: "Praharṣiṇī",
    nameDevanagari: "प्रहर्षिणी",
    nameUkrainian: "Прахаршін̣ī",
    syllablesPerPada: 13,
    ganaFormula: "ma-na-ja-ra-ga",
    pattern: ["G", "G", "G", "L", "L", "L", "L", "G", "L", "G", "L", "G", "G"],
    ypiati: [3, 10],
    category: "samavṛtta",
    description: "13-syllable meter meaning 'delightful', with caesura after 3 and 10.",
    descriptionUk:
      "13-складовий розмір, назва означає «чарівний», з цезурою після 3-го та 10-го складу.",
  },
  {
    id: "rucira",
    nameIAST: "Rucirā",
    nameDevanagari: "रुचिरा",
    nameUkrainian: "Ручіра̄",
    syllablesPerPada: 13,
    ganaFormula: "ja-bha-sa-ja-ga",
    pattern: ["L", "G", "L", "G", "L", "L", "L", "L", "G", "L", "G", "L", "G"],
    category: "samavṛtta",
    description: "13-syllable meter meaning 'beautiful, radiant'.",
    descriptionUk: "13-складовий розмір, назва означає «красивий, сяючий».",
  },

  // ==================== 14 syllables ====================
  {
    id: "vasantatilaka",
    nameIAST: "Vasantatilakā",
    nameDevanagari: "वसन्ततिलका",
    nameUkrainian: "Васантатілака̄",
    syllablesPerPada: 14,
    ganaFormula: "ta-bha-ja-ja-ga-ga",
    pattern: ["G", "G", "L", "G", "L", "L", "L", "G", "L", "L", "G", "L", "G", "G"],
    ypiati: [8],
    category: "samavṛtta",
    description:
      "14-syllable meter meaning 'ornament of spring'. One of the most beautiful and popular meters. Caesura after 8.",
    descriptionUk:
      "14-складовий розмір, назва означає «прикраса весни». Один з найкрасивіших та найпопулярніших розмірів. Цезура після 8-го складу.",
    example: {
      iast: "unnidra-hema-nalinī-dalitānivāsāḥ\nśakti-trayī-bharaṇa-śīlita-jānu-deśāḥ",
      source: "Classical example",
    },
  },

  // ==================== 15 syllables ====================
  {
    id: "malini",
    nameIAST: "Mālinī",
    nameDevanagari: "मालिनी",
    nameUkrainian: "Ма̄лінī",
    syllablesPerPada: 15,
    ganaFormula: "na-na-ma-ya-ya",
    pattern: [
      "L", "L", "L", "L", "L", "L", "G", "G", "G", "L", "G", "G", "L", "G", "G",
    ],
    ypiati: [8],
    category: "samavṛtta",
    description:
      "15-syllable meter meaning 'garlanded woman'. Distinguished by 6 light syllables at the start. Caesura after 8.",
    descriptionUk:
      "15-складовий розмір, назва означає «жінка з ґірляндою». Відрізняється 6 легкими складами на початку. Цезура після 8-го складу.",
    example: {
      iast: "harir abhimata-gopa-vadhū-nikara-\nvilasite raha-udita-rāga-vasāt",
      source: "Gīta-govinda",
    },
  },

  // ==================== 17 syllables ====================
  {
    id: "mandakranta",
    nameIAST: "Mandākrāntā",
    nameDevanagari: "मन्दाक्रान्ता",
    nameUkrainian: "Манда̄кра̄нта̄",
    syllablesPerPada: 17,
    ganaFormula: "ma-bha-na-ta-ta-ga-ga",
    pattern: [
      "G", "G", "G", "G", "L", "L", "L", "L", "L", "G", "G", "L", "G", "G", "L", "G", "G",
    ],
    ypiati: [4, 10],
    category: "samavṛtta",
    description:
      "17-syllable meter meaning 'slow-paced'. Kālidāsa's masterful choice for Meghadūta. Caesura after 4 and 10.",
    descriptionUk:
      "17-складовий розмір, назва означає «повільно крокуючий». Майстерний вибір Ка̄ліда̄си для «Меґхадӯти». Цезура після 4-го та 10-го складу.",
    example: {
      iast: "kaś cit kāntā-virahaguruṇā svādhikāra-pramattaḥ\nśāpenāstaṃgamita-mahimā varṣabhogyeṇa bhartuḥ",
      devanagari:
        "कश्चित् कान्ता-विरहगुरुणा स्वाधिकारप्रमत्तः\nशापेनास्तंगमितमहिमा वर्षभोग्येण भर्तुः",
      source: "Meghadūta 1",
    },
  },
  {
    id: "sikhirini",
    nameIAST: "Śikhariṇī",
    nameDevanagari: "शिखरिणी",
    nameUkrainian: "Шікхарін̣ī",
    syllablesPerPada: 17,
    ganaFormula: "ya-ma-na-sa-bha-la-ga",
    pattern: [
      "L", "G", "G", "G", "G", "G", "L", "L", "L", "L", "L", "G", "G", "L", "L", "L", "G",
    ],
    ypiati: [6],
    category: "samavṛtta",
    description:
      "17-syllable meter meaning 'crested, peaked'. Opens with a light syllable followed by five heavy ones. Caesura after 6.",
    descriptionUk:
      "17-складовий розмір, назва означає «з гребенем, вершинний». Починається з легкого складу, за яким слідують п'ять важких. Цезура після 6-го складу.",
  },
  {
    id: "prthvi",
    nameIAST: "Pṛthvī",
    nameDevanagari: "पृथ्वी",
    nameUkrainian: "Пр̣тхвī",
    syllablesPerPada: 17,
    ganaFormula: "ja-sa-ja-sa-ya-la-ga",
    pattern: [
      "L", "G", "L", "L", "L", "G", "L", "G", "L", "L", "L", "G", "L", "G", "G", "L", "G",
    ],
    ypiati: [8],
    category: "samavṛtta",
    description:
      "17-syllable meter meaning 'the earth'. Caesura after 8.",
    descriptionUk:
      "17-складовий розмір, назва означає «земля». Цезура після 8-го складу.",
  },
  {
    id: "harini",
    nameIAST: "Hariṇī",
    nameDevanagari: "हरिणी",
    nameUkrainian: "Харін̣ī",
    syllablesPerPada: 17,
    ganaFormula: "na-sa-ma-ra-sa-la-ga",
    pattern: [
      "L", "L", "L", "L", "L", "G", "G", "G", "G", "G", "L", "G", "L", "L", "G", "L", "G",
    ],
    ypiati: [6, 10],
    category: "samavṛtta",
    description:
      "17-syllable meter meaning 'deer-like, graceful'. Caesura after 6 and 10.",
    descriptionUk:
      "17-складовий розмір, назва означає «оленеподібний, граціозний». Цезура після 6-го та 10-го складу.",
  },

  // ==================== 19 syllables ====================
  {
    id: "sardula",
    nameIAST: "Śārdūlavikrīḍita",
    nameDevanagari: "शार्दूलविक्रीडित",
    nameUkrainian: "Ша̄рдӯлавікрīд̣іта",
    syllablesPerPada: 19,
    ganaFormula: "ma-sa-ja-sa-ta-ta-ga",
    pattern: [
      "G", "G", "G", "L", "L", "G", "L", "G", "L", "L", "L", "G", "G", "G", "L", "G", "G", "L", "G",
    ],
    ypiati: [12],
    category: "samavṛtta",
    description:
      "19-syllable meter meaning 'tiger's play'. One of the grandest meters. Caesura after 12.",
    descriptionUk:
      "19-складовий розмір, назва означає «гра тигра». Один з найвеличніших розмірів. Цезура після 12-го складу.",
    example: {
      iast: "mattebha-vinyasta-padaṃ sahāraṃ\nlīlā-ravendu-praṇayopahāram",
      source: "Classical example",
    },
  },

  // ==================== 21 syllables ====================
  {
    id: "sragdhara",
    nameIAST: "Sragdharā",
    nameDevanagari: "स्रग्धरा",
    nameUkrainian: "Сраґдхара̄",
    syllablesPerPada: 21,
    ganaFormula: "ma-ra-bha-na-ya-ya-ya",
    pattern: [
      "G", "G", "G", "G", "L", "G", "G", "L", "L", "L", "L", "L", "L", "G", "G", "L", "G", "G", "L", "G", "G",
    ],
    ypiati: [7, 14],
    category: "samavṛtta",
    description:
      "21-syllable meter meaning 'garland-bearer'. The longest common classical meter. Caesura after 7 and 14.",
    descriptionUk:
      "21-складовий розмір, назва означає «та, що несе ґірлянду». Найдовший поширений класичний розмір. Цезура після 7-го та 14-го складу.",
  },

  // ==================== Ardhasamavṛtta (half-even) ====================
  {
    id: "puspitagra",
    nameIAST: "Puṣpitāgrā",
    nameDevanagari: "पुष्पिताग्रा",
    nameUkrainian: "Пушпіта̄ґра̄",
    syllablesPerPada: 12,
    ganaFormula: "odd: na-na-ra-ya (12); even: na-ja-ja-ra-ya (13)",
    pattern: ["L", "L", "L", "L", "L", "L", "G", "L", "G", "L", "G", "G"],
    category: "ardhasamavṛtta",
    description:
      "Half-even meter: odd pādas have 12 syllables (na-na-ra-ya), even pādas have 13 (na-ja-ja-ya-ya). Commonly found in the Bhāgavata Purāṇa.",
    descriptionUk:
      "Напівсиметричний розмір: непарні пади мають 12 складів, парні — 13. Часто зустрічається в Бга̄ґавата Пура̄н̣і.",
  },
  {
    id: "viyogini",
    nameIAST: "Viyoginī",
    nameDevanagari: "वियोगिनी",
    nameUkrainian: "Війоґінī",
    syllablesPerPada: 10,
    ganaFormula: "odd: sa-sa-ja-ga (10); even: sa-sa-ja-ga-la (11)",
    pattern: ["L", "L", "G", "L", "L", "G", "L", "G", "L", "G"],
    category: "ardhasamavṛtta",
    description:
      "Half-even meter: odd pādas 10 syllables, even pādas 11 syllables. Name means 'one who is separated'.",
    descriptionUk:
      "Напівсиметричний розмір: непарні пади — 10 складів, парні — 11. Назва означає «розлучена».",
  },

  // ==================== Jāti (mora-based) ====================
  {
    id: "arya",
    nameIAST: "Āryā",
    nameDevanagari: "आर्या",
    nameUkrainian: "А̄рйа̄",
    syllablesPerPada: 0,
    ganaFormula: "mātrā-based: 12+18+12+15 mātrās",
    pattern: [],
    category: "jāti",
    description:
      "Mora-based (mātrā) meter, not syllable-count based. Structure: 4 pādas with 12, 18, 12, and 15 mātrās respectively. Very important in Prakrit and classical Sanskrit poetry.",
    descriptionUk:
      "Мора-базований (ма̄тра̄) розмір, не заснований на кількості складів. Структура: 4 пади з 12, 18, 12, та 15 ма̄трами відповідно. Дуже важливий у пракриті та класичній санскритській поезії.",
  },
];

/**
 * Convert a PatternSymbol array to a human-readable string
 */
export function patternToString(pattern: PatternSymbol[]): string {
  return pattern.map((s) => (s === "G" ? "–" : s === "L" ? "⏑" : "×")).join(" ");
}

/**
 * Convert a PatternSymbol array to a compact display
 */
export function patternToCompact(pattern: PatternSymbol[]): string {
  return pattern.map((s) => (s === "G" ? "–" : s === "L" ? "⏑" : "×")).join("");
}

/**
 * Get a meter by its id
 */
export function getMeterById(id: string): MeterDefinition | undefined {
  return METERS.find((m) => m.id === id);
}

/**
 * Get all meters grouped by syllable count
 */
export function getMetersBySyllableCount(): Map<number, MeterDefinition[]> {
  const grouped = new Map<number, MeterDefinition[]>();
  for (const meter of METERS) {
    const key = meter.syllablesPerPada || 0;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(meter);
  }
  return grouped;
}
