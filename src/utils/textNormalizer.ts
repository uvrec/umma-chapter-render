/**
 * ✅ ВИПРАВЛЕНИЙ textNormalizer.ts
 * - Правильний ı̄ (dotless i + macron) замість ӣ
 * - Повна підтримка IAST конвертації
 * - Додано функції для Деванагарі та Бенгалі (для UI транслітератора)
 */

// ============================================================================
// 1. MOJIBAKE і неправильні символи
// ============================================================================

const MOJIBAKE_REPLACEMENTS: Record<string, string> = {
  "�": "",
  "â€™": "'",
  "â€œ": '"',
  "â€": '"',
  'â€"': "—",
  'â€"': "–",
  "''": "'",
  "``": '"',
  "Ã¡": "á",
  "Ã©": "é",
  "Ã­": "í",
  "Ã³": "ó",
  Ãº: "ú",
  "": "",
  "\ufeff": "",
};

// ============================================================================
// 2. Діакритичні символи - ✅ ВИПРАВЛЕНО
// ============================================================================

const DIACRITIC_FIXES: Record<string, string> = {
  ā: "а̄", // а + combining macron
  ī: "\u0131\u0304", // ✅ dotless i + combining macron (НЕ кирилиця!)
  ū: "ӯ", // у з макроном (готовий символ)
  ṝ: "р̣̄",
  ṭ: "т̣",
  ḍ: "д̣",
  ṇ: "н̣",
  ṣ: "ш",
  ṛ: "р̣",
  ś: "ш́",
  ñ: "н̃",
  ṅ: "н̇",
  ṁ: "м̇",
  ḥ: "х̣",
  а̣: "а",
  і̣: "і",
};

// ============================================================================
// 3. Словникові заміни
// ============================================================================

const WORD_REPLACEMENTS: Record<string, string> = {
  "Шрі Чайтан'я-чарітамріта": "Шрі Чайтанья-чарітамріта",
  "Чайтан'я": "Чайтанья",
  "Ніт'янанда": "Нітьянанда",
  енерґія: "енергія",
  Ачйута: "Ачьюта",
  Адвайта: "Адваіта",
};

// ============================================================================
// 4. Виправлення приголосних сполучень
// ============================================================================

const CONSONANT_CLUSTERS: Record<string, string> = {
  тг: "тх",
  пг: "пх",
  кг: "кх",
  чг: "чх",
  Тг: "Тх",
  Пг: "Пх",
  Кг: "Кх",
  Чг: "Чх",
};

// ============================================================================
// 5. IAST латиниця → українська кирилиця - ✅ ВИПРАВЛЕНО
// ============================================================================

/**
 * Конвертує IAST латиницю в українську кирилицю
 * ✅ ПРАВИЛЬНО конвертує ī → ı̄ (dotless i)
 */
export function convertIASTtoUkrainian(text: string): string {
  if (!text) return text;

  const patterns: Record<string, string> = {
    // ✅ 3 символи (найдовші першими!)
    nya: "нйа",
    nye: "нйе",
    nyi: "нйі",
    nyo: "нйо",
    nyu: "нйу",

    // ✅ 2 символи (діграфи)
    bh: "бг",
    gh: "ґг",
    dh: "дг",
    th: "тх",
    ph: "пх",
    kh: "кх",
    ch: "ч",
    jh: "джх",
    sh: "ш",
    kṣ: "кш",
    jñ: "джн̃",
    ai: "аі",
    au: "ау",

    // ✅ 1 символ з діакритикою
    ṣ: "ш",
    ś: "ш́",
    ṭ: "т̣",
    ḍ: "д̣",
    ṇ: "н̣",
    ṛ: "р̣",
    ñ: "н̃",
    ṅ: "н̇",
    ṁ: "м̇",
    ḥ: "х̣",

    // ✅ Довгі голосні - ВИПРАВЛЕНО!
    ā: "а̄", // а + combining macron
    ī: "\u0131\u0304", // ✅ dotless i + combining macron (правильно!)
    ū: "ӯ", // у з макроном
    ṝ: "р̣̄",
    Ā: "А̄",
    Ī: "\u0131\u0304", // ✅ Велике також dotless i
    Ū: "Ӯ",

    // ✅ Візарга як двокрапка
    ":": "х̣",

    // ✅ Прості приголосні
    k: "к",
    g: "ґ",
    c: "ч",
    j: "дж",
    t: "т",
    d: "д",
    p: "п",
    b: "б",
    y: "й",
    r: "р",
    l: "л",
    v: "в",
    w: "в",
    h: "х",
    m: "м",
    n: "н",
    s: "с",

    K: "К",
    G: "Ґ",
    C: "Ч",
    J: "Дж",
    T: "Т",
    D: "Д",
    P: "П",
    B: "Б",
    Y: "Й",
    R: "Р",
    L: "Л",
    V: "В",
    W: "В",
    H: "Х",
    M: "М",
    N: "Н",
    S: "С",

    // ✅ Прості голосні
    a: "а",
    i: "і",
    u: "у",
    e: "е",
    o: "о",
    A: "А",
    I: "І",
    U: "У",
    E: "Е",
    O: "О",
  };

  let result = "";
  let i = 0;

  while (i < text.length) {
    let matched = false;

    // Пробуємо найдовші підрядки першими (3, 2, 1)
    for (const length of [3, 2, 1]) {
      if (i + length <= text.length) {
        const substr = text.substring(i, i + length);
        if (patterns[substr]) {
          result += patterns[substr];
          i += length;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      // Символ не в мапі - залишаємо як є
      result += text[i];
      i++;
    }
  }

  return result;
}

// ============================================================================
// 6. Деванагарі → IAST (для UI транслітератора)
// ============================================================================

/**
 * Конвертує Деванагарі в IAST
 */
export function devanagariToIAST(text: string): string {
  const vowels: Record<string, string> = {
    अ: "a",
    आ: "ā",
    इ: "i",
    ई: "ī",
    उ: "u",
    ऊ: "ū",
    ऋ: "ṛ",
    ॠ: "ṝ",
    ऌ: "ḷ",
    ॡ: "ḹ",
    ए: "e",
    ऐ: "ai",
    ओ: "o",
    औ: "au",
  };

  const consonants: Record<string, string> = {
    क: "ka",
    ख: "kha",
    ग: "ga",
    घ: "gha",
    ङ: "ṅa",
    च: "ca",
    छ: "cha",
    ज: "ja",
    झ: "jha",
    ञ: "ña",
    ट: "ṭa",
    ठ: "ṭha",
    ड: "ḍa",
    ढ: "ḍha",
    ण: "ṇa",
    त: "ta",
    थ: "tha",
    द: "da",
    ध: "dha",
    न: "na",
    प: "pa",
    फ: "pha",
    ब: "ba",
    भ: "bha",
    म: "ma",
    य: "ya",
    र: "ra",
    ल: "la",
    व: "va",
    श: "śa",
    ष: "ṣa",
    स: "sa",
    ह: "ha",
  };

  const matras: Record<string, string> = {
    "ा": "ā",
    "ि": "i",
    "ी": "ī",
    "ु": "u",
    "ू": "ū",
    "ृ": "ṛ",
    "ॄ": "ṝ",
    "ॢ": "ḷ",
    "ॣ": "ḹ",
    "े": "e",
    "ै": "ai",
    "ो": "o",
    "ौ": "au",
  };

  const other: Record<string, string> = {
    "्": "",
    "ं": "ṁ",
    "ः": "ḥ",
    "ँ": "ṁ",
    "।": ".",
    "॥": "||",
    ॐ: "oṁ", // OM
    ऽ: "", // аваграха (видаляємо)
    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
  };

  let result = "";
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    // ✅ ЗБЕРІГАЄМО ПРОБІЛИ
    if (char === " " || char === "\n" || char === "\t") {
      result += char;
      i++;
      continue;
    }

    if (vowels[char]) {
      result += vowels[char];
      i++;
    } else if (consonants[char]) {
      result += consonants[char];
      i++;

      // Перевірка вірами (видаляє 'a')
      if (i < text.length && text[i] === "्") {
        result = result.slice(0, -1);
        i++;
      }
      // Перевірка матри
      else if (i < text.length && matras[text[i]]) {
        result = result.slice(0, -1) + matras[text[i]];
        i++;
      }
    } else if (other[char]) {
      result += other[char];
      i++;
    } else {
      result += char;
      i++;
    }
  }

  return result;
}

// ============================================================================
// 7. Бенгалі → IAST (для UI транслітератора)
// ============================================================================

/**
 * Конвертує Бенгалі в IAST
 */
export function bengaliToIAST(text: string): string {
  const vowels: Record<string, string> = {
    অ: "a",
    আ: "ā",
    ই: "i",
    ঈ: "ī",
    উ: "u",
    ঊ: "ū",
    ঋ: "ṛ",
    ৠ: "ṝ",
    ঌ: "ḷ",
    ৡ: "ḹ",
    এ: "e",
    ঐ: "ai",
    ও: "o",
    ঔ: "au",
  };

  const consonants: Record<string, string> = {
    ক: "ka",
    খ: "kha",
    গ: "ga",
    ঘ: "gha",
    ঙ: "ṅa",
    চ: "ca",
    ছ: "cha",
    জ: "ja",
    ঝ: "jha",
    ঞ: "ña",
    ট: "ṭa",
    ঠ: "ṭha",
    ড: "ḍa",
    ঢ: "ḍha",
    ণ: "ṇa",
    ত: "ta",
    থ: "tha",
    দ: "da",
    ধ: "dha",
    ন: "na",
    প: "pa",
    ফ: "pha",
    ব: "va",
    ভ: "bha",
    ম: "ma", // ✅ ব = va (санскрит!)
    য: "ya",
    র: "ra",
    ল: "la",
    ৱ: "va",
    ব়: "va",
    শ: "śa",
    ষ: "ṣa",
    স: "sa",
    হ: "ha",
  };

  const matras: Record<string, string> = {
    "া": "ā",
    "ি": "i",
    "ী": "ī",
    "ু": "u",
    "ূ": "ū",
    "ৃ": "ṛ",
    "ৄ": "ṝ",
    "ৢ": "ḷ",
    "ৣ": "ḹ",
    "ে": "e",
    "ৈ": "ai",
    "ো": "o",
    "ৌ": "au",
  };

  const other: Record<string, string> = {
    "্": "",
    "ং": "ṁ",
    "ঃ": "ḥ",
    "ঁ": "ṁ",
    "।": ".",
    "॥": "||",
    ঽ: "'", // аваграха
    ৎ: "t", // кхондо то
    "়": "", // нукта (видаляємо)
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };

  let result = "";
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    // ✅ ЗБЕРІГАЄМО ПРОБІЛИ
    if (char === " " || char === "\n" || char === "\t") {
      result += char;
      i++;
      continue;
    }

    if (vowels[char]) {
      result += vowels[char];
      i++;
    } else if (consonants[char]) {
      result += consonants[char];
      i++;

      // Перевірка хосонто (видаляє 'a')
      if (i < text.length && text[i] === "্") {
        result = result.slice(0, -1);
        i++;
      }
      // Перевірка матри
      else if (i < text.length && matras[text[i]]) {
        result = result.slice(0, -1) + matras[text[i]];
        i++;
      }
    } else if (other[char]) {
      result += other[char];
      i++;
    } else {
      result += char;
      i++;
    }
  }

  return result;
}

// ============================================================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ============================================================================

function normalizeMojibake(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [old, newVal] of Object.entries(MOJIBAKE_REPLACEMENTS)) {
    result = result.replaceAll(old, newVal);
  }
  return result;
}

function normalizeDiacritics(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [old, newVal] of Object.entries(DIACRITIC_FIXES)) {
    result = result.replaceAll(old, newVal);
  }
  return result;
}

function normalizeWordReplacements(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [old, newVal] of Object.entries(WORD_REPLACEMENTS)) {
    result = result.replaceAll(old, newVal);
  }
  return result;
}

function normalizeConsonantClusters(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [old, newVal] of Object.entries(CONSONANT_CLUSTERS)) {
    result = result.replaceAll(old, newVal);
  }
  return result;
}

function removeGitabaseArtifacts(text: string): string {
  if (!text) return text;

  let result = text.replace(/^\s*\d+\s*:\s*/, "");
  result = result.replace(/^\s*Текст\s+\d+\s*:\s*/i, "");
  result = result.replace(/\s+/g, " ");
  result = result.replace(/\s+([,.;:!?])/g, "$1");

  return result.trim();
}

// ============================================================================
// ПУБЛІЧНІ ФУНКЦІЇ
// ============================================================================

/**
 * Нормалізує одне поле віршу
 */
export function normalizeVerseField(text: string, fieldType: string): string {
  if (!text) return text;

  let result = normalizeMojibake(text);
  result = removeGitabaseArtifacts(result);

  switch (fieldType) {
    case "sanskrit":
      result = normalizeDiacritics(result);
      break;

    case "transliteration_en":
      result = convertIASTtoUkrainian(result);
      result = normalizeDiacritics(result);
      result = normalizeWordReplacements(result);
      break;

    case "transliteration":
      result = normalizeDiacritics(result);
      result = normalizeConsonantClusters(result);
      break;

    case "synonyms":
    case "translation":
    case "commentary":
      result = normalizeDiacritics(result);
      result = normalizeWordReplacements(result);
      for (const [old, newVal] of Object.entries(CONSONANT_CLUSTERS)) {
        if (["тг", "пг", "кг", "чг", "Тг", "Пг", "Кг", "Чг"].includes(old)) {
          result = result.replaceAll(old, newVal);
        }
      }
      break;
  }

  return result;
}

/**
 * Нормалізує весь об'єкт віршу
 */
export function normalizeVerse(verse: any): any {
  return {
    ...verse,
    sanskrit: normalizeVerseField(verse.sanskrit || "", "sanskrit"),
    transliteration: normalizeVerseField(verse.transliteration || "", "transliteration"),
    synonyms_en: normalizeVerseField(verse.synonyms_en || "", "synonyms"),
    synonyms_ua: normalizeVerseField(verse.synonyms_ua || "", "synonyms"),
    translation_en: normalizeVerseField(verse.translation_en || "", "translation"),
    translation_ua: normalizeVerseField(verse.translation_ua || "", "translation"),
    commentary_en: normalizeVerseField(verse.commentary_en || "", "commentary"),
    commentary_ua: normalizeVerseField(verse.commentary_ua || "", "commentary"),
  };
}
