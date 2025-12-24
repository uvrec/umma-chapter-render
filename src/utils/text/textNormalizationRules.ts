/**
 * Text Normalization Rules for Gaudiya Vaishnava philosophy texts
 *
 * Based on editorial standards from:
 * https://docs.google.com/spreadsheets/d/1YZT4-KaQBeEZu7R9qysirdt8yb-9psOIkXCalDPLuwY/edit?gid=627477148#gid=627477148
 */

export interface NormalizationRule {
  id: string;
  incorrect: string;
  correct: string;
  category: string;
  description?: string;
  caseSensitive?: boolean;
  regex?: boolean;
}

export interface RuleCategory {
  id: string;
  name_ua: string;
  name_en: string;
  description_ua?: string;
  description_en?: string;
}

/**
 * Categories of normalization rules
 */
export const ruleCategories: RuleCategory[] = [
  {
    id: "apostrophe",
    name_ua: "Апострофи та м'який знак",
    name_en: "Apostrophes and soft sign",
    description_ua: "Заміна апострофів на м'який знак після певних літер",
    description_en: "Replace apostrophes with soft sign after certain letters",
  },
  {
    id: "consonant_clusters",
    name_ua: "Консонантні кластери",
    name_en: "Consonant clusters",
    description_ua: "Виправлення транслітерації складних приголосних",
    description_en: "Fix transliteration of complex consonants",
  },
  {
    id: "names",
    name_ua: "Імена та терміни",
    name_en: "Names and terms",
    description_ua: "Стандартизація написання імен та термінів",
    description_en: "Standardize names and terms spelling",
  },
  {
    id: "typography",
    name_ua: "Типографіка",
    name_en: "Typography",
    description_ua: "Типографічні виправлення (тире, лапки, пробіли)",
    description_en: "Typography fixes (dashes, quotes, spaces)",
  },
  {
    id: "diacritics",
    name_ua: "Діакритика",
    name_en: "Diacritics",
    description_ua: "Виправлення діакритичних знаків",
    description_en: "Diacritics fixes",
  },
  {
    id: "spelling",
    name_ua: "Правопис",
    name_en: "Spelling",
    description_ua: "Загальні правописні виправлення",
    description_en: "General spelling fixes",
  },
  {
    id: "custom",
    name_ua: "Користувацькі",
    name_en: "Custom",
    description_ua: "Користувацькі правила",
    description_en: "Custom rules",
  },
];

/**
 * Default normalization rules based on Gaudiya Vaishnava editorial standards
 */
export const defaultRules: NormalizationRule[] = [
  // === Апострофи та м'який знак ===
  {
    id: "apostrophe_n_1",
    incorrect: "н'я",
    correct: "ння",
    category: "apostrophe",
    description: "н'я → ння",
  },
  {
    id: "apostrophe_n_2",
    incorrect: "н'ї",
    correct: "ньї",
    category: "apostrophe",
    description: "н'ї → ньї",
  },
  {
    id: "apostrophe_n_3",
    incorrect: "н'є",
    correct: "нє",
    category: "apostrophe",
    description: "н'є → нє",
  },
  {
    id: "apostrophe_n_4",
    incorrect: "н'ю",
    correct: "ню",
    category: "apostrophe",
    description: "н'ю → ню",
  },

  // === Консонантні кластери ===
  {
    id: "cluster_jjg",
    incorrect: "джджг",
    correct: "джджх",
    category: "consonant_clusters",
    description: "джджг → джджх (аспірація)",
  },
  {
    id: "cluster_jg",
    incorrect: "джг",
    correct: "джх",
    category: "consonant_clusters",
    description: "джг → джх (аспірація)",
  },
  {
    id: "cluster_prodjjgita",
    incorrect: "проджджгіта",
    correct: "проджджхіта",
    category: "consonant_clusters",
    description: "проджджгіта → проджджхіта",
  },

  // === Імена та терміни ===
  {
    id: "sannyasi_1",
    incorrect: "Санн'ясі",
    correct: "Санньясі",
    category: "names",
    description: "Санн'ясі → Санньясі",
  },
  {
    id: "sannyasi_2",
    incorrect: "санн'ясі",
    correct: "санньясі",
    category: "names",
    description: "санн'ясі → санньясі",
  },
  {
    id: "sannyasi_3",
    incorrect: "санн'яса",
    correct: "санньяса",
    category: "names",
    description: "санн'яса → санньяса",
  },
  {
    id: "sannyasi_4",
    incorrect: "Санн'яса",
    correct: "Санньяса",
    category: "names",
    description: "Санн'яса → Санньяса",
  },
  {
    id: "sannyasi_5",
    incorrect: "санн'ясу",
    correct: "санньясу",
    category: "names",
    description: "санн'ясу → санньясу",
  },
  {
    id: "sannyasi_6",
    incorrect: "санн'ясам",
    correct: "санньясам",
    category: "names",
    description: "санн'ясам → санньясам",
  },
  {
    id: "sannyasi_7",
    incorrect: "санн'ясом",
    correct: "санньясом",
    category: "names",
    description: "санн'ясом → санньясом",
  },

  // Варіанти з "санн'яс"
  {
    id: "sannyasi_forms_1",
    incorrect: "санн'яс",
    correct: "санньяс",
    category: "names",
    description: "санн'яс → санньяс (всі форми)",
  },
  {
    id: "sannyasi_forms_2",
    incorrect: "Санн'яс",
    correct: "Санньяс",
    category: "names",
    description: "Санн'яс → Санньяс (всі форми)",
  },

  // Бгаґаватам
  {
    id: "bhagavatam_1",
    incorrect: "Бхаґаватам",
    correct: "Бгаґаватам",
    category: "names",
    description: "Бхаґаватам → Бгаґаватам",
  },
  {
    id: "bhagavatam_2",
    incorrect: "бхаґаватам",
    correct: "бгаґаватам",
    category: "names",
    description: "бхаґаватам → бгаґаватам",
  },
  {
    id: "bhagavatam_3",
    incorrect: "Бхагаватам",
    correct: "Бгаґаватам",
    category: "names",
    description: "Бхагаватам → Бгаґаватам",
  },

  // Бгаґавад-ґіта
  {
    id: "gita_1",
    incorrect: "Бхаґавад-ґіта",
    correct: "Бгаґавад-ґіта",
    category: "names",
    description: "Бхаґавад-ґіта → Бгаґавад-ґіта",
  },
  {
    id: "gita_2",
    incorrect: "Бхагавад-гіта",
    correct: "Бгаґавад-ґіта",
    category: "names",
    description: "Бхагавад-гіта → Бгаґавад-ґіта",
  },
  {
    id: "gita_3",
    incorrect: "Бхаґавад-гіта",
    correct: "Бгаґавад-ґіта",
    category: "names",
    description: "Бхаґавад-гіта → Бгаґавад-ґіта",
  },
  {
    id: "gita_4",
    incorrect: "бхаґавад-ґіта",
    correct: "бгаґавад-ґіта",
    category: "names",
    description: "бхаґавад-ґіта → бгаґавад-ґіта",
  },

  // Крішна / Кришна
  {
    id: "krishna_1",
    incorrect: "Крішна",
    correct: "Кр̣шн̣а",
    category: "names",
    description: "Крішна → Кр̣шн̣а (з діакритикою)",
  },
  {
    id: "krishna_2",
    incorrect: "Кришна",
    correct: "Кр̣шн̣а",
    category: "names",
    description: "Кришна → Кр̣шн̣а (з діакритикою)",
  },

  // Бгакті
  {
    id: "bhakti_1",
    incorrect: "бхакті",
    correct: "бгакті",
    category: "names",
    description: "бхакті → бгакті",
  },
  {
    id: "bhakti_2",
    incorrect: "Бхакті",
    correct: "Бгакті",
    category: "names",
    description: "Бхакті → Бгакті",
  },

  // Ґуру
  {
    id: "guru_1",
    incorrect: "гуру",
    correct: "ґуру",
    category: "names",
    description: "гуру → ґуру (українське ґ)",
  },
  {
    id: "guru_2",
    incorrect: "Гуру",
    correct: "Ґуру",
    category: "names",
    description: "Гуру → Ґуру (українське ґ)",
  },

  // Прабгупада
  {
    id: "prabhupada_1",
    incorrect: "Прабхупада",
    correct: "Прабгупа̄да",
    category: "names",
    description: "Прабхупада → Прабгупа̄да",
  },
  {
    id: "prabhupada_2",
    incorrect: "прабхупада",
    correct: "прабгупа̄да",
    category: "names",
    description: "прабхупада → прабгупа̄да",
  },

  // Махапрабгу
  {
    id: "mahaprabhu_1",
    incorrect: "Махапрабху",
    correct: "Маха̄прабгу",
    category: "names",
    description: "Махапрабху → Маха̄прабгу",
  },
  {
    id: "mahaprabhu_2",
    incorrect: "махапрабху",
    correct: "маха̄прабгу",
    category: "names",
    description: "махапрабху → маха̄прабгу",
  },

  // Чайтанья
  {
    id: "chaitanya_1",
    incorrect: "Чайтаньа",
    correct: "Чайтанья",
    category: "names",
    description: "Чайтаньа → Чайтанья",
  },

  // Вайшнав
  {
    id: "vaishnava_1",
    incorrect: "вайшнава",
    correct: "вайшн̣ава",
    category: "names",
    description: "вайшнава → вайшн̣ава",
  },
  {
    id: "vaishnava_2",
    incorrect: "Вайшнав",
    correct: "Вайшн̣ав",
    category: "names",
    description: "Вайшнав → Вайшн̣ав",
  },

  // === Типографіка ===
  {
    id: "typo_dash_1",
    incorrect: " - ",
    correct: " — ",
    category: "typography",
    description: "Дефіс → тире",
  },
  {
    id: "typo_dash_2",
    incorrect: "--",
    correct: "—",
    category: "typography",
    description: "Подвійний дефіс → тире",
  },
  {
    id: "typo_quotes_1",
    incorrect: "\"",
    correct: "«",
    category: "typography",
    description: "Прямі лапки → ялинки (відкриваюча)",
    regex: true,
  },
  {
    id: "typo_ellipsis",
    incorrect: "...",
    correct: "…",
    category: "typography",
    description: "Три крапки → еліпсис",
  },

  // === Діакритика ===
  {
    id: "diac_a_macron_1",
    incorrect: "а̄",
    correct: "ā",
    category: "diacritics",
    description: "Нормалізація а̄ (кирилиця + макрон) → ā (латиниця)",
  },

  // === Правопис ===
  {
    id: "spell_tse_1",
    incorrect: "являеться",
    correct: "є",
    category: "spelling",
    description: "являеться → є",
  },
  {
    id: "spell_tse_2",
    incorrect: "являється",
    correct: "є",
    category: "spelling",
    description: "являється → є",
  },
  {
    id: "spell_takozh",
    incorrect: "такоже",
    correct: "також",
    category: "spelling",
    description: "такоже → також",
  },
  {
    id: "spell_vidpovidno",
    incorrect: "відповідно до",
    correct: "згідно з",
    category: "spelling",
    description: "відповідно до → згідно з",
  },
];

/**
 * Parse CSV content into normalization rules
 */
export function parseCSVRules(csvContent: string): NormalizationRule[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const incorrectIdx = headers.findIndex((h) => h.includes("incorrect") || h.includes("неправильн") || h.includes("from") || h.includes("з"));
  const correctIdx = headers.findIndex((h) => h.includes("correct") || h.includes("правильн") || h.includes("to") || h.includes("на"));
  const categoryIdx = headers.findIndex((h) => h.includes("category") || h.includes("категор"));
  const descriptionIdx = headers.findIndex((h) => h.includes("description") || h.includes("опис") || h.includes("comment") || h.includes("комент"));

  if (incorrectIdx === -1 || correctIdx === -1) {
    throw new Error("CSV must have 'incorrect'/'неправильно' and 'correct'/'правильно' columns");
  }

  const rules: NormalizationRule[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length <= Math.max(incorrectIdx, correctIdx)) continue;

    const incorrect = values[incorrectIdx]?.trim();
    const correct = values[correctIdx]?.trim();

    if (!incorrect || !correct) continue;

    rules.push({
      id: `custom_${i}`,
      incorrect,
      correct,
      category: categoryIdx !== -1 ? values[categoryIdx]?.trim() || "custom" : "custom",
      description: descriptionIdx !== -1 ? values[descriptionIdx]?.trim() : undefined,
    });
  }

  return rules;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

/**
 * Parse tab-separated content (for Excel paste)
 */
export function parseTSVRules(tsvContent: string): NormalizationRule[] {
  const lines = tsvContent.trim().split("\n");
  const rules: NormalizationRule[] = [];

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split("\t").map((p) => p.trim());
    if (parts.length < 2) continue;

    const incorrect = parts[0];
    const correct = parts[1];

    if (!incorrect || !correct || incorrect === correct) continue;

    rules.push({
      id: `tsv_${i}`,
      incorrect,
      correct,
      category: parts[2] || "custom",
      description: parts[3],
    });
  }

  return rules;
}

/**
 * Parse simple text file with "incorrect → correct" or "incorrect -> correct" format
 */
export function parseTextRules(textContent: string): NormalizationRule[] {
  const lines = textContent.trim().split("\n");
  const rules: NormalizationRule[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#") || line.startsWith("//")) continue;

    // Try different separators
    let parts: string[] = [];
    if (line.includes("→")) {
      parts = line.split("→").map((p) => p.trim());
    } else if (line.includes("->")) {
      parts = line.split("->").map((p) => p.trim());
    } else if (line.includes("=>")) {
      parts = line.split("=>").map((p) => p.trim());
    } else if (line.includes("\t")) {
      parts = line.split("\t").map((p) => p.trim());
    }

    if (parts.length < 2) continue;

    const incorrect = parts[0];
    const correct = parts[1];

    if (!incorrect || !correct || incorrect === correct) continue;

    rules.push({
      id: `text_${i}`,
      incorrect,
      correct,
      category: "custom",
      description: parts[2],
    });
  }

  return rules;
}

/**
 * Apply normalization rules to text
 */
export function applyNormalizationRules(
  text: string,
  rules: NormalizationRule[],
  enabledCategories?: Set<string>
): { result: string; changes: NormalizationChange[] } {
  let result = text;
  const changes: NormalizationChange[] = [];

  for (const rule of rules) {
    // Skip if category filtering is enabled and this category is not enabled
    if (enabledCategories && !enabledCategories.has(rule.category)) {
      continue;
    }

    const flags = rule.caseSensitive ? "g" : "gi";

    let pattern: RegExp;
    if (rule.regex) {
      try {
        pattern = new RegExp(rule.incorrect, flags);
      } catch {
        pattern = new RegExp(escapeRegExp(rule.incorrect), flags);
      }
    } else {
      pattern = new RegExp(escapeRegExp(rule.incorrect), flags);
    }

    let match;
    const tempResult = result;
    while ((match = pattern.exec(tempResult)) !== null) {
      changes.push({
        ruleId: rule.id,
        original: match[0],
        replacement: rule.correct,
        position: match.index,
        category: rule.category,
      });
      // Prevent infinite loop for zero-length matches
      if (match.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
    }

    result = result.replace(pattern, rule.correct);
  }

  return { result, changes };
}

export interface NormalizationChange {
  ruleId: string;
  original: string;
  replacement: string;
  position: number;
  category: string;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Get statistics about applied changes
 */
export function getChangeStatistics(changes: NormalizationChange[]): Record<string, number> {
  const stats: Record<string, number> = {};

  for (const change of changes) {
    if (!stats[change.category]) {
      stats[change.category] = 0;
    }
    stats[change.category]++;
  }

  return stats;
}

/**
 * Merge custom rules with default rules
 */
export function mergeRules(
  customRules: NormalizationRule[],
  includeDefaults: boolean = true
): NormalizationRule[] {
  if (!includeDefaults) {
    return customRules;
  }

  // Custom rules take precedence (by id)
  const customIds = new Set(customRules.map((r) => r.id));
  const filteredDefaults = defaultRules.filter((r) => !customIds.has(r.id));

  return [...customRules, ...filteredDefaults];
}

/**
 * Export rules to CSV format
 */
export function exportRulesToCSV(rules: NormalizationRule[]): string {
  const headers = ["id", "incorrect", "correct", "category", "description"];
  const lines = [headers.join(",")];

  for (const rule of rules) {
    const values = [
      rule.id,
      `"${rule.incorrect.replace(/"/g, '""')}"`,
      `"${rule.correct.replace(/"/g, '""')}"`,
      rule.category,
      rule.description ? `"${rule.description.replace(/"/g, '""')}"` : "",
    ];
    lines.push(values.join(","));
  }

  return lines.join("\n");
}
