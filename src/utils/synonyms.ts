/**
 * Утиліта для парсингу синонімів (послівного перекладу)
 * Використовується в VerseCard та VedaReaderDB
 */

export interface SynonymPair {
  term: string;
  meaning: string;
}

/**
 * Парсить рядок синонімів у масив пар {term, meaning}
 */
export function parseSynonyms(raw: string): SynonymPair[] {
  if (!raw) return [];
  
  const parts = raw
    .split(/[;]+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  const dashVariants = [" — ", " – ", " - ", "—", "–", "-", " —\n", " –\n", " -\n", "—\n", "–\n", "-\n"];
  const pairs: SynonymPair[] = [];

  for (const part of parts) {
    let idx = -1;
    let used = "";
    for (const d of dashVariants) {
      idx = part.indexOf(d);
      if (idx !== -1) {
        used = d;
        break;
      }
    }
    if (idx === -1) {
      pairs.push({ term: part, meaning: "" });
      continue;
    }
    const term = part.slice(0, idx).trim();
    const meaning = part.slice(idx + used.length).trim();
    if (term) pairs.push({ term, meaning });
  }
  return pairs;
}

/**
 * Відкриває глосарій в новій вкладці для заданого терміна
 */
export function openGlossary(term: string) {
  const url = `/glossary?search=${encodeURIComponent(term)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Детект скрипту (Bengali чи Devanagari)
 */
export function detectScript(text: string): "bengali" | "devanagari" | "none" {
  if (!text) return "none";
  // Bengali Unicode range: U+0980–U+09FF
  if (/[\u0980-\u09FF]/.test(text)) return "bengali";
  // Devanagari Unicode range: U+0900–U+097F
  if (/[\u0900-\u097F]/.test(text)) return "devanagari";
  return "none";
}
