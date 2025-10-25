/**
 * Нормалізатор тексту для vedavoice.org
 * Виправляє помилки з Gitabase та конвертує англійську транслітерацію в українську
 *
 * ✅ ВИПРАВЛЕНО: використовує combining characters для українських літер
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
  "\uF0A0": "",
};

// ============================================================================
// 2. Діакритичні символи
// ============================================================================

const DIACRITIC_FIXES: Record<string, string> = {
  // Залишаємо як є - combining characters
  а̣: "а",
  і̣: "і",
};

// ============================================================================
// 3. Словникові заміни (тільки для перекладів/коментарів)
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
// 4. Виправлення приголосних сполучень (для транслітерації)
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
// 5. IAST латиниця → українська кирилиця (ВИПРАВЛЕНО!)
// ============================================================================

/**
 * Конвертує англійську транслітерацію (IAST) в українську
 * ✅ ВИПРАВЛЕНО: використовує combining characters
 * Приклад: "vande gurūn" → "ванде ґурӯн"
 */
export function convertIASTtoUkrainian(text: string): string {
  if (!text) return text;

  const patterns: Record<string, string> = {
    // 3 символи (найдовші першими!)
    nya: "нйа",
    nye: "нйе",
    nyi: "нйі",
    nyo: "нйо",
    nyu: "нйу",

    // 2 символи (діграфи)
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

    // 1 символ з діакритикою
    ṣ: "ш",
    ś: "ш́",
    ṭ: "т̣",
    ḍ: "д̣",
    ṇ: "н̣",
    ӣ: "ī",
    ṛ: "р̣",
    ñ: "н̃",
    ṅ: "н̇",
    ṁ: "м̇",
    ḥ: "х̣",

    // ✅ ВИПРАВЛЕНО: Довгі голосні з combining characters
    ā: "а\u0304", // а + combining macron
    ī: "\u0131\u0304", // dotless i + combining macron (для правильного рендерингу)
    ū: "у\u0304", // у + combining macron
    ṝ: "р̣\u0304", // р̣ + combining macron

    // Великі літери
    Ā: "А\u0304",
    Ī: "\u0131\u0304", // dotless i + macron
    Ū: "У\u0304",

    // Прості приголосні
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

    // Прості голосні
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
// ОСНОВНІ ФУНКЦІЇ НОРМАЛІЗАЦІЇ
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

  // Видаляємо "Текст 1:", "18:" на початку
  let result = text.replace(/^\s*\d+\s*:\s*/, "");
  result = result.replace(/^\s*Текст\s+\d+\s*:\s*/i, "");

  // Множинні пробіли → один пробіл
  result = result.replace(/\s+/g, " ");

  // Видаляємо зайві пробіли навколо знаків пунктуації
  result = result.replace(/\s+([,.;:!?])/g, "$1");

  return result.trim();
}

// ============================================================================
// ПУБЛІЧНІ ФУНКЦІЇ
// ============================================================================

/**
 * Нормалізує одне поле віршу
 * @param text - Текст для нормалізації
 * @param fieldType - Тип поля: 'sanskrit' | 'transliteration' | 'transliteration_en' | 'synonyms' | 'translation' | 'commentary'
 */
export function normalizeVerseField(text: string, fieldType: string): string {
  if (!text) return text;

  // 1. Видаляємо mojibake
  let result = normalizeMojibake(text);

  // 2. Видаляємо артефакти Gitabase
  result = removeGitabaseArtifacts(result);

  // 3. Залежно від типу поля
  switch (fieldType) {
    case "sanskrit":
      // Санскрит - тільки діакритика
      result = normalizeDiacritics(result);
      break;

    case "transliteration_en":
      // Англійська транслітерація з Vedabase → українська
      result = convertIASTtoUkrainian(result);
      result = normalizeDiacritics(result);
      result = normalizeWordReplacements(result);
      break;

    case "transliteration":
      // Українська транслітерація - НЕ застосовуємо словникові заміни!
      // Залишаємо "чайтанйа" як є (не "чайтанья")
      result = normalizeDiacritics(result);
      result = normalizeConsonantClusters(result);
      break;

    case "synonyms":
    case "translation":
    case "commentary":
      // Українські тексти - всі правила
      result = normalizeDiacritics(result);
      result = normalizeWordReplacements(result);
      // Виправляємо тільки неправильні поєднання (тг→тх, але не нйа→нья!)
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
    transliteration_ua: normalizeVerseField(verse.transliteration_ua || "", "transliteration"),
    transliteration_en: normalizeVerseField(verse.transliteration_en || "", "transliteration_en"),
    synonyms_en: normalizeVerseField(verse.synonyms_en || "", "synonyms"),
    synonyms_ua: normalizeVerseField(verse.synonyms_ua || "", "synonyms"),
    translation_en: normalizeVerseField(verse.translation_en || "", "translation"),
    translation_ua: normalizeVerseField(verse.translation_ua || "", "translation"),
    commentary_en: normalizeVerseField(verse.commentary_en || "", "commentary"),
    commentary_ua: normalizeVerseField(verse.commentary_ua || "", "commentary"),
  };
}
