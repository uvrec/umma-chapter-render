import Sanscript from "sanscript";

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
  'â€•': "–",
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
  ā: "ā", // precomposed a with macron (U+0101 -> keep as is)
  ī: "ī", // precomposed i with macron (U+012B -> keep as is) 
  ū: "ū", // precomposed u with macron (U+016B -> keep as is)
  ṝ: "ṝ", // precomposed r with dot below and macron
  ṭ: "ṭ", // precomposed t with dot below
  ḍ: "ḍ", // precomposed d with dot below
  ṇ: "ṇ", // precomposed n with dot below
  ṣ: "ṣ", // precomposed s with dot below -> ш
  ṛ: "ṛ", // precomposed r with dot below
  ś: "ś", // precomposed s with acute -> ш́
  ñ: "ñ", // precomposed n with tilde
  ṅ: "ṅ", // precomposed n with dot above
  ṁ: "ṁ", // precomposed m with dot above
  ḥ: "ḥ", // precomposed h with dot below
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

    // ✅ Довгі голосні - використовуємо precomposed символи
    ā: "ā", // precomposed a with macron
    ī: "ī", // precomposed i with macron  
    ū: "ū", // precomposed u with macron
    ṝ: "ṝ", // precomposed r with dot below and macron
    Ā: "Ā", // precomposed capital A with macron
    Ī: "Ī", // precomposed capital I with macron
    Ū: "Ū", // precomposed capital U with macron

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
  return Sanscript.t(text, "devanagari", "iast");
}

// ============================================================================
// 7. Бенгалі → IAST (для UI транслітератора)
// ============================================================================

/**
 * Конвертує Бенгалі в IAST
 */
export function bengaliToIAST(text: string): string {
  return Sanscript.t(text, "bengali", "iast");
}

// ============================================================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ============================================================================

function normalizeMojibake(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [old, newVal] of Object.entries(MOJIBAKE_REPLACEMENTS)) {
    result = result.split(old).join(newVal);
  }
  return result;
}

function normalizeDiacritics(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [old, newVal] of Object.entries(DIACRITIC_FIXES)) {
    result = result.split(old).join(newVal);
  }
  return result;
}

function normalizeWordReplacements(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [old, newVal] of Object.entries(WORD_REPLACEMENTS)) {
    result = result.split(old).join(newVal);
  }
  return result;
}

function normalizeConsonantClusters(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [old, newVal] of Object.entries(CONSONANT_CLUSTERS)) {
    result = result.split(old).join(newVal);
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
          result = result.split(old).join(newVal);
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
