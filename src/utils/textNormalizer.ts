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
  "â€•": "–",
  "''": "'",
  "``": '"',
  "Ã¡": "á",
  "Ã©": "é",
  "Ã­": "í",
  "Ã³": "ó",
  Ãº: "ú",
  "": "",
  "\ufeff": "",
  "\u00A0": " ", // non-breaking space
  "\u2018": "'", // left single quotation mark
  "\u2019": "'", // right single quotation mark
  "\u201C": '"', // left double quotation mark
  "\u201D": '"', // right double quotation mark
  "\u2013": "-", // en dash
  "\u2014": "—", // em dash
  "\r\n": "\n", // Windows line endings
  "\r": "\n", // Mac line endings
  "\t": " ", // tabs to spaces
};

// ============================================================================
// 2. Діакритичні символи - ✅ ВИПРАВЛЕНО
// ============================================================================

const DIACRITIC_FIXES: Record<string, string> = {
  ā: "ā", // precomposed a with macron (U+0101 -> keep as is)
  ī: "ī", // precomposed i with macron (U+012B -> keep as is)
  ū: "ū", // precomposed u with macron (U+016B -> keep as is)
  ṝ: "ṝ", // precomposed r with dot below and macron
  ḷ: "ḷ", // precomposed l with dot below -> л̣
  ḹ: "ḹ", // precomposed l with dot below and macron -> л̣̄
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
  // Чайтанья (виправлення після транслітерації: нйа → нья)
  "Шрі Чайтан'я-чарітамріта": "Шрі Чайтанья-чарітамріта",
  "Чайтан'я-чарітамріта": "Чайтанья-чарітамріта",
  "Чайтан'я-чандродая-натака": "Чайтанья-чандродая-натака",
  "Чайтан'я-бгаґавата": "Чайтанья-бгаґавата",
  "Чайтан'я": "Чайтанья",
  "Чайтан'ї": "Чайтаньї",
  "Чайтан'ю": "Чайтанью",
  "Чайтан'єю": "Чайтаньєю",
  чаітанйа: "Чайтанья",
  Чаітанйа: "Чайтанья",
  чаітанйі: "Чайтаньї",
  чаітанйу: "Чайтанью",

  // Нітьянанда (апостроф ' → м'який знак ь)
  "Ніт'янанда": "Нітьянанда",
  "Ніт'янанди": "Нітьянанди",
  "Ніт'янанді": "Нітьянанді",
  "Ніт'янанду": "Нітьянанду",
  "Ніт'янандою": "Нітьянандою",

  // Ґопінатха → Ґопінатха
  Ґопінатга: "Ґопінатха",
  Ґопінатгу: "Ґопінатху",

  // Енергія (ґ → г)
  енерґія: "енергія",
  енерґії: "енергії",
  енерґію: "енергію",
  енерґією: "енергією",
  енерґіями: "енергіями",

  // Санньясі
  "санн'ясі": "санньясі",
  "Санн'ясі": "Санньясі",
  "санн'яса": "саньяса",
  "Санн'яса": "Саньяса",
  "санн'ясу": "саньясу",
  "санн'ясою": "саньясою",
  "санн'ясам": "саньясам",
  "санн'ясами": "саньясами",

  // Специфічні виправлення
  проджджгіта: "проджджхіта",
  Проджджгіта: "Проджджхіта",

  // Інші
  Ачйута: "Ачьюта",
  Адвайта: "Адваіта",
  Джгарікханда: "Джхарікханда",
  Пуруши: "Пуруши",
};

// ============================================================================
// 4. Виправлення приголосних сполучень
// ============================================================================

const CONSONANT_CLUSTERS: Record<string, string> = {
  // Придихові приголосні (h після приголосної)
  бх: "бг",
  Бх: "Бг",
  БХ: "БГ",
  гх: "ґг", // ✅ ВИПРАВЛЕНО: латинська g
  Гх: "Ґг",
  дх: "дг",
  Дх: "Дг",
  тг: "тх",
  пг: "пх",
  кг: "кх",
  чг: "чх",
  Тг: "Тх",
  Пг: "Пх",
  Кг: "Кх",
  Чг: "Чх",

  // Складні випадки
  джг: "джх",
  Джг: "Джх",
  джджг: "джджх",
  Джджг: "Джджх",
};

// ============================================================================
// 5. IAST латиниця → українська кирилиця - ✅ ВИПРАВЛЕНО
// ============================================================================

/**
 * Конвертує англійську транслітерацію (IAST) в українську
 * Приклад: "vande gurūn" → "ванде ґурӯн"
 */
export function convertIASTtoUkrainian(text: string): string {
  if (!text) return text;

  // ✅ Unicode нормалізація - перетворює combining у precomposed
  text = text.normalize("NFC");

  const patterns: Record<string, string> = {
    // ============ PRECOMPOSED Unicode (як повертає Sanscript) ============
    // y + довгі голосні (ПЕРШІ!)
    "y\u0101": "йа̄", // yā
    "y\u012B": "йī", // yī
    "y\u016B": "йӯ", // yū

    // Довгі голосні (precomposed)
    "\u0101": "а̄", // ā
    "\u012B": "ī", // ī
    "\u016B": "ӯ", // ū
    "\u1E5D": "р̣̄", // ṝ
    "\u1E38": "л̣̄", // ḹ
    "\u1E6D": "т̣", // ṭ
    "\u1E0D": "д̣", // ḍ
    "\u1E47": "н̣", // ṇ
    "\u1E63": "ш", // ṣ
    "\u1E5B": "р̣", // ṛ
    "\u015B": "ш́", // ś
    "\u00F1": "н̃", // ñ
    "\u1E45": "н̇", // ṅ
    "\u1E41": "м̇", // ṁ (dot above)
    "\u1E43": "м̣", // ṃ (dot below)
    "\u1E25": "х̣", // ḥ
    "\u1E37": "л̣", // ḷ
    "\u0100": "А̄", // Ā
    "\u012A": "Ī", // Ī
    "\u016A": "Ӯ", // Ū

    // ============ ВЕЛИКІ PRECOMPOSED Unicode ============
    "\u015A": "Ш́", // Ś → Ш́
    "\u1E62": "Ш", // Ṣ → Ш
    "\u1E6C": "Т̣", // Ṭ → Т̣
    "\u1E0C": "Д̣", // Ḍ → Д̣
    "\u1E5A": "Р̣", // Ṛ → Р̣
    "\u1E46": "Н̣", // Ṇ → Н̣
    "\u00D1": "Н̃", // Ñ → Н̃
    "\u1E44": "Н̇", // Ṅ → Н̇
    "\u1E40": "М̇", // Ṁ → М̇
    "\u1E42": "М̣", // Ṃ → М̣
    "\u1E24": "Х̣", // Ḥ → Х̣
    "\u1E36": "Л̣", // Ḷ → Л̣

    // ============ COMBINING DIACRITICS (запасний варіант) ============
    // Якщо NFC нормалізація не спрацювала
    "a\u0304": "а̄", // a + combining macron
    "i\u0304": "ī", // i + combining macron
    "u\u0304": "ӯ", // u + combining macron
    "A\u0304": "А̄", // A + combining macron
    "I\u0304": "Ī", // I + combining macron
    "U\u0304": "Ӯ", // U + combining macron
    "r\u0323\u0304": "р̣̄", // r + combining dot below + macron
    "r\u0323": "р̣", // r + combining dot below
    "t\u0323": "т̣", // t + combining dot below
    "d\u0323": "д̣", // d + combining dot below
    "n\u0323": "н̣", // n + combining dot below
    "s\u0323": "ш", // s + combining dot below
    "s\u0301": "ш́", // s + combining acute
    "n\u0303": "н̃", // n + combining tilde
    "n\u0307": "н̇", // n + combining dot above
    "m\u0307": "м̇", // m + combining dot above
    "h\u0323": "х̣", // h + combining dot below
    "l\u0323": "л̣", // l + combining dot below

    // ============ ВЕЛИКІ COMBINING DIACRITICS ============
    "S\u0301": "Ш́", // S + acute
    "S\u0323": "Ш", // S + dot below
    "T\u0323": "Т̣", // T + dot below
    "D\u0323": "Д̣", // D + dot below
    "R\u0323": "Р̣", // R + dot below
    "N\u0323": "Н̣", // N + dot below
    "N\u0303": "Н̃", // N + tilde
    "N\u0307": "Н̇", // N + dot above
    "M\u0307": "М̇", // M + dot above
    "H\u0323": "Х̣", // H + dot below
    "L\u0323": "Л̣", // L + dot below

    // ============ 3 символи (СПОЧАТКУ!) ============
    nya: "нйа",
    nye: "нйе",
    nyi: "нйі",
    nyo: "нйо",
    nyu: "нйу",
    сch: "ччх",
    jjh: "жджх", // ✅ НОВЕ: jjh → жджх (3 символи)
    джджг: "жджх", // ✅ НОВЕ: кирилична версія

    // ============ 2 символи ============
    bh: "бг",
    gh: "ґг",
    dh: "дг",
    th: "тх",
    ph: "пх",
    kh: "кх",
    ch: "чх",
    jh: "джх", // ✅ ОНОВЛЕНО: jh → джх
    джг: "джх", // ✅ НОВЕ: кирилична версія джг → джх
    sh: "сх",
    kṣ: "кш",
    jñ: "джн̃",
    ai: "аі",
    au: "ау",

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

/**
 * Виправляє апостроф після "н" в українській мові
 * Правило: н' → нь, Н' → Нь
 * За винятком випадків де апостроф правильний (ачар'я, антар'ямі)
 */
function fixApostropheAfterN(text: string): string {
  if (!text) return text;

  // Виключення - слова де апостроф після н правильний
  const exceptions = ["ачар'я", "Ачар'я", "антар'ямі", "Антар'ямі", "антар'ям", "Антар'ям"];

  let result = text;

  // Зберігаємо виключення (заміняємо тимчасовим placeholder)
  const placeholders: Record<string, string> = {};
  exceptions.forEach((exception, idx) => {
    const placeholder = `__EXCEPTION_${idx}__`;
    if (result.includes(exception)) {
      placeholders[placeholder] = exception;
      result = result.split(exception).join(placeholder);
    }
  });

  // Тепер робимо заміну н' → нь
  result = result.replace(/н'/g, "нь").replace(/Н'/g, "Нь");

  // Відновлюємо виключення
  Object.entries(placeholders).forEach(([placeholder, original]) => {
    result = result.split(placeholder).join(original);
  });

  return result;
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
      // ЗАЛИШАЄМО БЕЗ ЗМІН - оригінальний IAST!
      break;

    case "transliteration":
      result = normalizeDiacritics(result);
      result = normalizeConsonantClusters(result);
      // НЕ застосовуємо normalizeWordReplacements!
      break;

    case "synonyms":
    case "translation":
    case "commentary":
      result = normalizeDiacritics(result);
      result = normalizeWordReplacements(result);
      result = fixApostropheAfterN(result); // ✅ ТІЛЬКИ для українського тексту!
      for (const [old, newVal] of Object.entries(CONSONANT_CLUSTERS)) {
        result = result.split(old).join(newVal);
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

// ============================================================================
// 8. Санітизація імен файлів для Storage
// ============================================================================

/**
 * Транслітерує українську кирилицю в латиницю для імен файлів
 */
const CYRILLIC_TO_LATIN: Record<string, string> = {
  // Українська
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ye",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "yi",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "yu",
  я: "ya",

  А: "A",
  Б: "B",
  В: "V",
  Г: "H",
  Ґ: "G",
  Д: "D",
  Е: "E",
  Є: "Ye",
  Ж: "Zh",
  З: "Z",
  И: "Y",
  І: "I",
  Ї: "Yi",
  Й: "Y",
  К: "K",
  Л: "L",
  М: "M",
  Н: "N",
  О: "O",
  П: "P",
  Р: "R",
  С: "S",
  Т: "T",
  У: "U",
  Ф: "F",
  Х: "Kh",
  Ц: "Ts",
  Ч: "Ch",
  Ш: "Sh",
  Щ: "Shch",
  Ь: "",
  Ю: "Yu",
  Я: "Ya",

  // Російська (додаткові літери)
  ы: "y",
  э: "e",
  ъ: "",
  Ы: "Y",
  Э: "E",
  Ъ: "",
};

/**
 * Санітизує ім'я файлу для Supabase Storage
 * - Транслітерує кирилицю в латиницю
 * - Замінює пробіли та спецсимволи на дефіси
 * - Зберігає розширення файлу
 * - Обмежує довжину імені
 *
 * @param filename - оригінальне ім'я файлу
 * @param maxLength - максимальна довжина (за замовчуванням 200)
 * @returns санітизоване ім'я файлу
 *
 * @example
 * sanitizeFilename("Бгактівінод Тхакур - Все моє життя.mp3")
 * // => "Bhaktivinod-Thakur-Vse-moye-zhyttya.mp3"
 */
export function sanitizeFilename(filename: string, maxLength: number = 200): string {
  if (!filename) return "file";

  // Відокремлюємо розширення
  const lastDotIndex = filename.lastIndexOf(".");
  const name = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  const ext = lastDotIndex > 0 ? filename.substring(lastDotIndex) : "";

  // Транслітеруємо кирилицю
  let result = "";
  for (const char of name) {
    if (CYRILLIC_TO_LATIN[char]) {
      result += CYRILLIC_TO_LATIN[char];
    } else {
      result += char;
    }
  }

  // Замінюємо пробіли та спецсимволи на дефіси
  result = result
    .replace(/\s+/g, "-") // пробіли → дефіс
    .replace(/[^\w\-\.]/g, "-") // спецсимволи → дефіс
    .replace(/-+/g, "-") // множинні дефіси → один
    .replace(/^-+|-+$/g, ""); // видаляємо дефіси на початку/кінці

  // Обмежуємо довжину (залишаємо місце для розширення)
  const maxNameLength = maxLength - ext.length;
  if (result.length > maxNameLength) {
    result = result.substring(0, maxNameLength);
  }

  // Якщо ім'я порожнє після санітизації
  if (!result) {
    result = "file";
  }

  return result + ext;
}
