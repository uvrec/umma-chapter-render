// src/utils/text/transliteration.ts
/**
 * Правила транслітерації санскриту та бенгалі на українську кирилицю
 * Документація:
 */

import { devanagariToIAST, bengaliToIAST, convertIASTtoUkrainian } from "@/utils/textNormalizer";

// Маппінг для латиниці IAST → українська кирилиця
export const IAST_TO_CYRILLIC: Record<string, string> = {
  // Голосні
  ā: "а̄",
  ī: "ī",
  ū: "ӯ",
  a: "а",
  i: "і",
  u: "у",
  e: "е",
  o: "о",

  // Великі голосні з діакритикою
  Ā: "А̄",
  Ī: "Ī",
  Ū: "Ӯ",
  A: "А",
  I: "І",
  U: "У",
  E: "Е",
  O: "О",

  // Сполучення голосних (порядок важливий!)
  ai: "аі",
  aya: "айа",
  āye: "а̄йе",
  āya: "а̄йа",

  // Сполучення приголосних (спочатку довші - 3 символи, потім 2)
  jjh: "жджх", // ✅ НОВЕ: 3 символи (ПЕРШЕ!)
  kṣ: "кш",
  ḍh: "д̣г",
  bh: "бг",
  gh: "ґг",
  dh: "дг",
  jh: "джх", // ✅ ОНОВЛЕНО: jh → джх
  th: "тх",
  kh: "кх",
  ch: "чх",
  ph: "пх",
  hy: "хй",
  ye: "йе",
  ya: "йа",
  ṅg: "н̇ґ",
  ñi: "н̃і",
  ṛṣṇ: "р̣шн̣",
  cch: "ччх",

  // Приголосні з діакритикою
  ś: "ш́",
  Ś: "Ш́",
  ṣ: "ш",
  ṭ: "т̣",
  ḍ: "д̣",
  ṛ: "р̣",
  r̥̄: "р̣̄",
  ṇ: "н̣",
  ñ: "н̃",
  ṅ: "н̇",
  ṁ: "м\u0307", // м + combining dot above (U+0307)
  ḥ: "х̣",

  // Великі приголосні з діакритикою
  Ś: "Ш́",
  Ṣ: "Ш",
  Ṭ: "Т̣",
  Ḍ: "Д̣",
  Ṛ: "Р̣",
  R̥̄: "Р̣̄",
  Ṇ: "Н̣",
  Ñ: "Н̃",
  Ṅ: "Н̇",
  Ṁ: "М\u0307", // М + combining dot above (U+0307)
  Ḥ: "Х̣",

  // Звичайні приголосні
  k: "к",
  g: "ґ",
  d: "д",
  t: "т",
  p: "п",
  b: "б",
  n: "н",
  m: "м",
  r: "р",
  l: "л",
  v: "в",
  s: "с",
  h: "х",
  j: "дж",
  c: "ч",

  // Великі приголосні
  K: "К",
  G: "Ґ",
  D: "Д",
  T: "Т",
  P: "П",
  B: "Б",
  N: "Н",
  M: "М",
  R: "Р",
  L: "Л",
  V: "В",
  S: "С",
  H: "Х",
  J: "Дж",
  C: "Ч",
};

// Маппінг Деванагарі → українська кирилиця
export const DEVANAGARI_TO_CYRILLIC: Record<string, string> = {
  // Голосні
  अ: "а",
  आ: "а̄",
  इ: "і",
  ई: "ī",
  उ: "у",
  ऊ: "ӯ",
  ए: "е",
  ओ: "о",
  ऐ: "аі",
  औ: "ау",

  // Приголосні
  क: "к",
  ख: "кх",
  ग: "ґ",
  घ: "ґг",
  च: "ч",
  छ: "чх",
  ज: "дж",
  झ: "джх",
  ट: "т̣",
  ठ: "т̣х",
  ड: "д̣",
  ढ: "д̣г",
  त: "т",
  थ: "тх",
  द: "д",
  ध: "дг",
  प: "п",
  फ: "пх",
  ब: "б",
  भ: "бг",
  य: "й",
  र: "р",
  ल: "л",
  व: "в",
  श: "ш́",
  ष: "ш",
  स: "с",
  ह: "х",

  // Носові та анусвара
  ङ: "н̇",
  ञ: "н̃",
  ण: "н̣",
  न: "н",
  म: "м",
  "ं": "м\u0307", // м + combining dot above (U+0307)
  "ः": "х̣",

  // Матри (знаки голосних)
  "ा": "а̄",
  "ि": "і",
  "ी": "ī",
  "ु": "у",
  "ू": "ӯ",
  "े": "е",
  "ो": "о",
  "ै": "аі",
  "ौ": "ау",

  // Вірама (халант)
  "्": "",

  // Спеціальні символи
  "ृ": "р̣",
  "ॄ": "р̣̄",
  "ॢ": "л̣",
  "ॣ": "л̣̄",
};

// Маппінг Бенгалі → українська кирилиця
export const BENGALI_TO_CYRILLIC: Record<string, string> = {
  // Голосні
  অ: "а",
  আ: "а̄",
  ই: "і",
  ঈ: "ī",
  উ: "у",
  ঊ: "ӯ",
  এ: "е",
  ও: "о",
  ঐ: "аі",
  ঔ: "ау",

  // Приголосні
  ক: "к",
  খ: "кх",
  গ: "ґ",
  ঘ: "ґг",
  চ: "ч",
  ছ: "чх",
  জ: "дж",
  ঝ: "джх",
  ট: "т̣",
  ঠ: "т̣х",
  ড: "д̣",
  ঢ: "д̣г",
  ত: "т",
  থ: "тх",
  দ: "д",
  ধ: "дг",
  প: "п",
  ফ: "пх",
  ব: "б",
  ভ: "бг",
  য: "й",
  র: "р",
  ল: "л",
  শ: "ш́",
  ষ: "ш",
  স: "с",
  হ: "х",

  // Носові
  ঙ: "н̇",
  ঞ: "н̃",
  ণ: "н̣",
  ন: "н",
  ম: "м",
  "ং": "м̇",
  "ঃ": "х̣",

  // Матри
  "া": "а̄",
  "ি": "і",
  "ী": "ī",
  "ু": "у",
  "ূ": "ӯ",
  "ে": "е",
  "ো": "о",
  "ৈ": "аі",
  "ৌ": "ау",

  // Хосонто (вірама)
  "্": "",

  // Спеціальні
  "ৃ": "р̣",
  "ৄ": "р̣̄",
};

// Заборонені літери (не використовувати в результаті)
export const FORBIDDEN_LETTERS = ["є", "и", "ь", "ю", "я", "ы", "э"];

/**
 * Валідація результату транслітерації
 */
export function validateOutput(text: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const letter of FORBIDDEN_LETTERS) {
    if (text.includes(letter)) {
      errors.push(`Заборонена літера: "${letter}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Транслітерація IAST латиниці → українська кирилиця
 */
export function transliterateIAST(text: string): string {
  let result = text;

  // Сортуємо ключі за довжиною (спочатку довші)
  const sortedKeys = Object.keys(IAST_TO_CYRILLIC).sort((a, b) => b.length - a.length);

  // Замінюємо кожну комбінацію
  for (const key of sortedKeys) {
    const regex = new RegExp(escapeRegExp(key), "g");
    result = result.replace(regex, IAST_TO_CYRILLIC[key]);
  }

  return result;
}

/**
 * Транслітерація Деванагарі → українська кирилиця
 */
export function transliterateDevanagari(text: string): string {
  // Крок 1: Деванагарі → IAST (через Sanscript для точності)
  const iastText = devanagariToIAST(text);
  // Крок 2: IAST → українська кирилиця (наша власна функція зі всіма правилами)
  return convertIASTtoUkrainian(iastText);
}

/**
 * Транслітерація Бенгалі → українська кирилиця
 */
export function transliterateBengali(text: string): string {
  // Крок 1: Бенгалі → IAST (через Sanscript для точності)
  const iastText = bengaliToIAST(text);
  // Крок 2: IAST → українська кирилиця (наша власна функція зі всіма правилами)
  return convertIASTtoUkrainian(iastText);
}

/**
 * Капіталізація після крапки (для блоку пояснення)
 */
export function capitalizeAfterPeriod(text: string): string {
  // Перша літера завжди велика
  let result = text.charAt(0).toUpperCase() + text.slice(1);

  // Велика літера після ". "
  result = result.replace(/\.\s+([а-яґєіїa-z])/g, (match, letter) => {
    return ". " + letter.toUpperCase();
  });

  return result;
}

/**
 * Основна функція обробки тексту
 */
export function processText(
  inputText: string,
  mode: "iast" | "devanagari" | "bengali",
  textType: "shloka" | "purport",
  options: {
    addHyphens?: boolean;
    convertNums?: boolean;
    preservePunct?: boolean;
  } = {},
): string {
  const { addHyphens = true, convertNums = true, preservePunct = true } = options;

  let result = "";

  // Крок 1: Транслітерація згідно з обраним режимом
  if (mode === "iast") {
    result = transliterateIAST(inputText);
  } else if (mode === "devanagari") {
    result = transliterateDevanagari(inputText);
  } else if (mode === "bengali") {
    result = transliterateBengali(inputText);
  }

  // Крок 2: Конвертувати цифри
  if (convertNums) {
    result = convertNumbers(result);
  }

  // Крок 3: Зберегти пунктуацію
  if (preservePunct) {
    result = preservePunctuation(result);
  }

  // Крок 4: Додати дефіси в композити
  if (addHyphens) {
    result = addCompoundHyphens(result);
  }

  // Крок 5: Застосування правил капіталізації
  if (textType === "shloka") {
    // У шлоках всі слова з маленької літери
    result = result.toLowerCase();
  } else if (textType === "purport") {
    // У поясненні велика літера тільки після крапки
    result = capitalizeAfterPeriod(result);
  }

  return result;
}

/**
 * Конвертує індійські цифри в арабські
 */
export function convertNumbers(text: string): string {
  const numbers: Record<string, string> = {
    // Деванагарі
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
    // Бенгалі
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

  let result = text;
  for (const [old, newChar] of Object.entries(numbers)) {
    result = result.replace(new RegExp(old, "g"), newChar);
  }
  return result;
}

/**
 * Зберігає та конвертує санскритську пунктуацію
 */
export function preservePunctuation(text: string): string {
  // Конвертувати данди в крапку
  let result = text.replace(/।/g, ".");
  // Подвійну данду залишаємо як є
  // Вже збережено ॥
  return result;
}

/**
 * Додає дефіси в композити (складні слова)
 */
export function addCompoundHyphens(text: string): string {
  let result = text;

  // Патерни для розпізнавання композитів
  const patterns: Array<[RegExp, string]> = [
    // Префікси + слово
    [/(маха̄)([а-яґіа̄ī̄ӯр̣н̣т̣д̣ш́м̇х̣н̃н̇]+)/g, "$1-$2"],
    [/(ш́рī)([а-яґіа̄ī̄ӯр̣н̣т̣д̣ш́м̇х̣н̃н̇]+)/g, "$1-$2"],
    [/(бгаґават)([а-яґіа̄ī̄ӯр̣н̣т̣д̣ш́м̇х̣н̃н̇]+)/g, "$1-$2"],

    // Дгарма-композити
    [/(дгарма)(кшетре|ш́а̄стра|йуддга)/g, "$1-$2"],

    // Кр̣шн̣а-композити
    [/(кр̣шн̣а)(чаітанйа|према|бгакті|ліла̄)/g, "$1-$2"],

    // Куру-композити
    [/(куру)(кшетре|ван̇ш́а)/g, "$1-$2"],

    // Па̄н̣д̣ава-композити
    [/(па̄н̣д̣ава̄)(ш́|н)/g, "$1-$2"],

    // Подвійні композити (ім'я-ім'я)
    [/(нітйа̄)(нанда)/g, "$1-$2"],
    [/(ра̄ма)(чандра)/g, "$1-$2"],
  ];

  for (const [pattern, replacement] of patterns) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * Escape спеціальних символів для RegExp
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Тестові приклади
 */
export const TEST_EXAMPLES = {
  iast: {
    shloka: ["kṛṣṇa", "mahāprabhu", "gaṅgā", "paḍiyā-paḍiyākṣaṇe", "svānubhāva", "akrūra", "eśa mūrchita", "bhāsaya"],
    purport: "Kṛṣṇa є верховною особистістю бога. Mahāprabhu з'явився в Навадвіпі на березі Gaṅgā.",
  },
  devanagari: {
    shloka: [
      "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।",
      "मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ।। १ ।।",
      "",
      "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।",
      "मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ।। ४७ ।।",
    ],
    purport: "धर्मक्षेत्रे означає місце паломництва. कृष्ण є верховною особистістю. भगवद्गीता є священним текстом.",
  },
  bengali: {
    shloka: [
      "বন্দে গুরূনীশভক্তানীশমীশাবতারকান্ ।",
      "তৎপ্রকাশাংশ্চ তচ্ছক্তীঃ কৃষ্ণচৈতন্যসংজ্ঞকম্ ॥ १ ॥",
      "",
      "বন্দে শ্রীকৃষ্ণচৈতন্যনিত্যানন্দৌ সহোদিতৌ ।",
      "গৌড়োদয়ে পুষ্পবন্তৌ চিত্রৌ শন্দৌ তমোনুদৌ ॥ २ ॥",
    ],
    purport: "কৃষ্ণ є верховною особистістю. মহাপ্রভু з'явився в Навадвіпі. শ্রীচৈতন্য প্রদав безмежну милість.",
  },
};

/**
 * Очікувані результати для тестування
 */
export const EXPECTED_RESULTS: Record<string, string> = {
  kṛṣṇa: "кр̣шн̣а",
  mahāprabhu: "махāпрабгу",
  gaṅgā: "ґан̇ґā",
  bhāsaya: "бгāсайа",
  eśa: "еш́а",
  "paḍiyā-paḍiyākṣaṇe": "пад̣ійā-пад̣ійāкшан̣е",
};
