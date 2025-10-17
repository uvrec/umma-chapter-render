// src/utils/text/transliteration.ts
/**
 * Правила транслітерації санскриту та бенгалі на українську кирилицю
 * Документація: https://www.prabhupada.website/transliteration/rules
 */

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

  // Сполучення голосних (порядок важливий!)
  ai: "аі",
  aya: "айа",
  āye: "а̄йе",

  // Сполучення приголосних (спочатку довші)
  kṣ: "кш",
  ḍh: "д̣г",
  bh: "бг",
  gh: "ґг",
  dh: "дг",
  jh: "джх",
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
  ṣ: "ш",
  ṭ: "т̣",
  ḍ: "д̣",
  ṛ: "р̣",
  "r̥̄": "р̣̄",
  ṇ: "н̣",
  ñ: "н̃",
  ṅ: "н̇",
  ṁ: "м̇",
  ḥ: "х̣",

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
};

// Маппінг Деванагарі → українська кирилиця
export const DEVANAGARI_TO_CYRILLIC: Record<string, string> = {
  // Голосні
  "अ": "а",
  "आ": "а̄",
  "इ": "і",
  "ई": "ī",
  "उ": "у",
  "ऊ": "ӯ",
  "ए": "е",
  "ओ": "о",
  "ऐ": "аі",
  "औ": "ау",

  // Приголосні
  "क": "к",
  "ख": "кх",
  "ग": "ґ",
  "घ": "ґг",
  "च": "ч",
  "छ": "чх",
  "ज": "дж",
  "झ": "джх",
  "ट": "т̣",
  "ठ": "т̣х",
  "ड": "д̣",
  "ढ": "д̣г",
  "त": "т",
  "थ": "тх",
  "द": "д",
  "ध": "дг",
  "प": "п",
  "फ": "пх",
  "ब": "б",
  "भ": "бг",
  "य": "й",
  "र": "р",
  "ल": "л",
  "व": "в",
  "श": "ш́",
  "ष": "ш",
  "स": "с",
  "ह": "х",

  // Носові та анусвара
  "ङ": "н̇",
  "ञ": "н̃",
  "ण": "н̣",
  "न": "н",
  "म": "м",
  "ं": "м̇",
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
  "অ": "а",
  "আ": "а̄",
  "ই": "і",
  "ঈ": "ī",
  "উ": "у",
  "ঊ": "ӯ",
  "এ": "е",
  "ও": "о",
  "ঐ": "аі",
  "ঔ": "ау",

  // Приголосні
  "ক": "к",
  "খ": "кх",
  "গ": "ґ",
  "ঘ": "ґг",
  "চ": "ч",
  "ছ": "чх",
  "জ": "дж",
  "ঝ": "джх",
  "ট": "т̣",
  "ঠ": "т̣х",
  "ড": "д̣",
  "ঢ": "д̣г",
  "ত": "т",
  "থ": "тх",
  "দ": "д",
  "ধ": "дг",
  "প": "п",
  "ফ": "пх",
  "ব": "б",
  "ভ": "бг",
  "য": "й",
  "র": "р",
  "ল": "л",
  "শ": "ш́",
  "ষ": "ш",
  "স": "с",
  "হ": "х",

  // Носові
  "ঙ": "н̇",
  "ঞ": "н̃",
  "ণ": "н̣",
  "ন": "н",
  "ম": "м",
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
  let result = "";

  // Обробка по символам
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    // Обробка приголосна + матра
    if (DEVANAGARI_TO_CYRILLIC[char]) {
      result += DEVANAGARI_TO_CYRILLIC[char];

      // Перевірка матри
      if (nextChar && DEVANAGARI_TO_CYRILLIC[nextChar]) {
        const nextMapping = DEVANAGARI_TO_CYRILLIC[nextChar];
        // Якщо наступний символ - матра (голосний знак)
        if (nextMapping && nextChar.match(/[\u093E-\u094F\u0955-\u0957]/)) {
          result += nextMapping;
          i++; // Пропускаємо матру
        }
      }
    } else {
      result += char; // Зберігаємо невідомі символи
    }
  }

  return result;
}

/**
 * Транслітерація Бенгалі → українська кирилиця
 */
export function transliterateBengali(text: string): string {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (BENGALI_TO_CYRILLIC[char]) {
      result += BENGALI_TO_CYRILLIC[char];

      // Перевірка матри (голосні знаки)
      if (nextChar && BENGALI_TO_CYRILLIC[nextChar]) {
        const nextMapping = BENGALI_TO_CYRILLIC[nextChar];
        // Якщо наступний символ - матра
        if (nextMapping && nextChar.match(/[\u09BE-\u09CC]/)) {
          result += nextMapping;
          i++;
        }
      }
    } else {
      result += char;
    }
  }

  return result;
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
  textType: "shloka" | "purport"
): string {
  let result = "";

  // Крок 1: Транслітерація згідно з обраним режимом
  if (mode === "iast") {
    result = transliterateIAST(inputText);
  } else if (mode === "devanagari") {
    result = transliterateDevanagari(inputText);
  } else if (mode === "bengali") {
    result = transliterateBengali(inputText);
  }

  // Крок 2: Застосування правил капіталізації
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
    shloka: [
      "kṛṣṇa",
      "mahāprabhu",
      "gaṅgā",
      "paḍiyā-paḍiyākṣaṇe",
      "svānubhāva",
      "akrūra",
      "eśa mūrchita",
      "bhāsaya",
    ],
    purport: "Kṛṣṇa є верховною особистістю бога. Mahāprabhu з'явився в Навадвіпі на березі Gaṅgā.",
  },
  devanagari: {
    shloka: ["कृष्ण", "महाप्रभु", "गङ्गा", "सञ्जय उवाच", "दृष्ट्वा तु पाण्डवानीकं"],
    purport: "कृष्ण є верховною особистістю. Mahāprabhu прийшов.",
  },
  bengali: {
    shloka: [
      "কৃষ্ণ",
      "মহাপ্রভু",
      "গঙ্গা",
      "বন্দে গুরূনীশভক্তানীশমীশাবতারকান্‌",
      "তৎপ্রকাশাংশ্চ তচ্ছক্তীঃ কৃষ্ণচৈতন্যসংজ্ঞকম্‌",
    ],
    purport: "কৃষ্ণ є верховною особистістю. মহাপ্রভু прийшов.",
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
