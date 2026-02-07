/**
 * Book prefix abbreviations for verse display
 * Ukrainian page shows Ukrainian abbreviations, English shows Latin
 */

const prefixesUk: Record<string, string> = {
  sb: "ШБ",       // Шрімад-Бгаґаватам
  bg: "БҐ",       // Бгаґавад-ґіта
  cc: "ЧЧ",       // Чайтанья-чарітамріта
  scc: "ШЧЧ",     // Шрі Чайтанья-чарітамріта
  scb: "ШЧБ",     // Шрі Чайтанья-бгаґаватам
  noi: "НН",       // Нектар настанов
  iso: "Ішо",      // Шрі Ішопанішада
  nod: "НВ",       // Нектар відданості
  saranagati: "Шар",// Шаранаґаті
  td: "ТД",        // Трансцендентний щоденник
  pp: "ПП",        // Прабгупада-правах
  sova: "СОВА",    // Пісні ачар'їв-вайшнавів
  poy: "ДЙ",       // Досконалість йоги
  tpj: "ПСП",      // Подорож самопізнання
  sos: "НС",       // Наука самоусвідомлення
  eji: "ЛВ",       // Легкий шлях в інший світ
};

const prefixesEn: Record<string, string> = {
  sb: "SB",
  bg: "BG",
  cc: "CC",
  scc: "SCC",
  scb: "SCB",
  noi: "NOI",
  iso: "ISO",
  nod: "NOD",
  saranagati: "Sar",
  td: "TD",
  pp: "PP",
  sova: "SOVA",
  poy: "POY",
  tpj: "TPJ",
  sos: "SOS",
  eji: "EJI",
};

/**
 * Get book prefix abbreviation based on slug and language
 */
export function getBookPrefix(slug: string | undefined, language?: string): string {
  if (!slug) return "";
  const key = slug.toLowerCase();
  if (language === "en") {
    return prefixesEn[key] || slug.toUpperCase();
  }
  // Default: Ukrainian
  return prefixesUk[key] || slug.toUpperCase();
}
