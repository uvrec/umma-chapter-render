// src/utils/text/lineBreaks.ts

/**
 * Утиліти для додавання коректних перенесень рядків у санскриті (Деванаґарі)
 * та узгодження перенесень у транслітерації.
 */

/** Деванаґарі цифри -> ASCII */
function devaDigitsToAscii(input: string): string {
  const map: Record<string, string> = {
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
  return input.replace(/[०-९]/g, (d) => map[d] ?? d);
}

/** Нормалізація пробілів/перенесень */
function normalizeSpaces(s?: string | null): string {
  if (!s) return "";
  return s.replace(/\r\n?/g, "\n").replace(/\s+/g, " ").trim();
}

/** Тонка нормалізація перед розбивкою: прибираємо лише «мʼякі» артефакти */
function softNormalizeBeforeSplit(s?: string | null): string {
  if (!s) return "";
  // Приберемо тільки \r та дубль-пробіли, збережемо існуючі \n для безпечного ресету нижче
  let out = s.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ");
  // Повністю обнуляємо існуючі перенесення, щоб розбивати «з нуля»
  out = out.replace(/\n+/g, " ").trim();
  return out;
}

/** Маркери/регекспи */
const INVOCATION_RE = /(^|\s)ॐ(\s|$)/; // інвокація «ॐ»
const SINGLE_DANDA_RE = /।(?!।)/g; // одинична данда
// Подвійна данда з опційним номером: "॥", "॥ 12 ॥", "॥ १२ ॥", "॥12॥" тощо
const DOUBLE_DANDA_NUM_RE = /॥\s*([०-९0-9]+)?\s*॥/g;

/**
 * Розбиває санскрит (Деванаґарі) за дандами:
 *  - «ॐ …» стає окремим рядком (якщо на початку)
 *  - після одиничної данди «।» додається перенесення (крім випадку подвійної данди)
 *  - послідовність «॥ <номер?> ॥» залишається на одному рядку, після неї — перенесення (якщо є текст далі)
 */
export function addSanskritLineBreaks(text: string): string {
  // Перевірка на коректність вхідних даних
  if (!text || typeof text !== 'string') return text || '';
  if (!text.trim()) return text;

  try {
    // 0) Обнулити наявні перенесення та зайві пробіли
    let s = softNormalizeBeforeSplit(text);

    // 1) Інвокація «ॐ» — якщо справді на початку вірша
    //    зробимо її окремим рядком: "ॐ ..." -> "ॐ\n..."
    if (/^ॐ[^\S\n]*\S/.test(s)) {
      s = s.replace(/^ॐ[^\S\n]*/i, "ॐ\n");
    }

    // 2) Подвійні данди з номером: гарантуємо компактний формат "॥ <num> ॥"
    //    і додамо перенос ПІСЛЯ такого блоку, якщо далі ще є текст.
    s = s.replace(DOUBLE_DANDA_NUM_RE, (_m, num) => {
      const asciiNum = num ? devaDigitsToAscii(String(num)) : "";
      // залишимо деванаґарі чи арабські — як було; формат лише нормалізуємо
      return asciiNum ? `॥ ${num} ॥` : "॥ ॥";
    });

    // Вставити перенос після завершеного блоку "॥ ... ॥", якщо потім ще йде текст
    s = s.replace(/(॥\s*[०-९0-9]*\s*॥)(\s*)(?=\S)/g, (_m, block) => `${block}\n`);

    // 3) Одиничні данди: ставимо перенос після «।», але НЕ якщо це частина «॥»
    s = s.replace(SINGLE_DANDA_RE, "।\n");

    // 4) Фінальна чистка
    const lines = s
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Уникаємо подвійних переносів на кінці
    return lines.join("\n");
  } catch (error) {
    console.error('Error in addSanskritLineBreaks:', error, 'Text:', text?.substring(0, 100));
    // У разі помилки повертаємо оригінальний текст
    return text;
  }
}

/**
 * Якщо в транслітерації є маркери '||' (double danda) або '|' (single danda),
 * спробуємо розбити саме ними. Інакше — спробуємо підлаштуватися під
 * кількість рядків санскриту (евристика за кількістю слів).
 */
export function addTransliterationLineBreaks(sanskrit: string, transliteration: string): string {
  if (!transliteration || !transliteration.trim()) return transliteration;

  // 0) Підрахунок рядків у санскриті
  const sanskritLines = (sanskrit || "").split("\n").filter(Boolean);
  const sanskritLineCount = Math.max(1, sanskritLines.length);

  // 1) Якщо трансліт містить явні маркери — користуємося ними
  const hasDouble = /(^|\s)\|\|(\s|$)/.test(transliteration);
  const hasSingle = /(^|\s)\|(\s|$)/.test(transliteration);

  if (hasDouble || hasSingle) {
    // Нормалізація пробілів
    const t = softNormalizeBeforeSplit(transliteration);

    // Спочатку розіб'ємо по '||', далі — по '|' усередині кожного сегмента,
    // щоб зберегти ієрархію (подвійні данди — сильніший роздільник).
    const doubleChunks = t.split(/\s*\|\|\s*/);
    const lines: string[] = [];
    doubleChunks.forEach((chunk, i) => {
      const singles = chunk.split(/\s*\|\s*/);
      singles.forEach((c, j) => {
        const trimmed = c.trim();
        if (trimmed) lines.push(trimmed);
      });
      // Не додаємо порожні рядки — чисто
    });

    // Якщо ліній стало забагато чи замало — нічого страшного,
    // головне, що вони відповідають маркерам, які бачив автор.
    return lines.join("\n");
  }

  // 2) Немає маркерів — мʼяка евристика: розбиваємо на ~рівні шматки
  const t = softNormalizeBeforeSplit(transliteration);
  const words = t.split(/\s+/);
  const perLine = Math.max(1, Math.round(words.length / sanskritLineCount));

  const out: string[] = [];
  for (let i = 0; i < words.length; i += perLine) {
    out.push(words.slice(i, i + perLine).join(" "));
  }

  // Підчистимо крайні випадки (одне-два слова «висять» у кінці)
  if (out.length > sanskritLineCount && out[out.length - 1].split(" ").length < 2) {
    out[out.length - 2] = `${out[out.length - 2]} ${out[out.length - 1]}`.trim();
    out.pop();
  }

  return out.join("\n");
}

/**
 * Обробка одного вірша: додає перенесення ТІЛЬКИ в санскриті (деванаґарі/бенгалі)
 * Транслітерацію залишає без змін
 */
export function processVerseLineBreaks(verse: { sanskrit?: string | null; transliteration?: string | null }): {
  sanskrit?: string;
  transliteration?: string;
} {
  const result: { sanskrit?: string; transliteration?: string } = {};

  // Обробляємо ТІЛЬКИ санскрит
  if (verse.sanskrit && verse.sanskrit.trim()) {
    result.sanskrit = addSanskritLineBreaks(verse.sanskrit);
  }

  // Транслітерацію залишаємо БЕЗ ЗМІН
  if (verse.transliteration && verse.transliteration.trim()) {
    result.transliteration = verse.transliteration;
  }

  return result;
}
