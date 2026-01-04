// Utility to parse Sanskrit/Bengali terms from verse synonyms

export interface GlossaryTerm {
  term: string;
  meaning: string;
  reference: string;
  book: string;
  link: string;
  verseNumber: string;
}

export interface GlossaryTermWithUsage {
  term: string;
  usageCount: number;
  allOccurrences: GlossaryTerm[];
}

// Function to normalize text by removing diacritical marks
export const normalizeSanskritText = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Remove Latin Sanskrit diacritical marks
    .replace(/[āĀ]/g, 'a')
    .replace(/[īĪ]/g, 'i')
    .replace(/[ūŪ]/g, 'u')
    .replace(/[ēĒ]/g, 'e')
    .replace(/[ōŌ]/g, 'o')
    .replace(/[ṛṜ]/g, 'r')
    .replace(/[ṝṜ̄]/g, 'r')
    .replace(/[ḷḶ]/g, 'l')
    .replace(/[ḹḸ̄]/g, 'l')
    .replace(/[ṁṀṃṂ]/g, 'm')
    .replace(/[ṅṄ]/g, 'n')
    .replace(/[ñÑ]/g, 'n')
    .replace(/[ṇṆ]/g, 'n')
    .replace(/[śŚ]/g, 's')
    .replace(/[ṣṢ]/g, 's')
    .replace(/[ṭṬ]/g, 't')
    .replace(/[ḍḌ]/g, 'd')
    .replace(/[ḥḤ]/g, 'h')
    .replace(/[ḻḺ]/g, 'l')
    // Remove combining marks and special characters
    .replace(/[\u0300-\u036f]/g, '') // combining diacritical marks
    .replace(/[̇̄̃̂̌]/g, '') // additional combining marks
    .replace(/ʼ/g, '') // apostrophes
    .replace(/[ˆˇ˘˙˚˛˜˝]/g, '') // additional diacritics
    // Ukrainian/Cyrillic transliteration marks
    .replace(/[ії]/g, 'и')
    .replace(/[єэ]/g, 'е')
    .replace(/[ґг]/g, 'г')
    // Ukrainian Sanskrit diacritical marks
    .replace(/а̄/g, 'а')
    .replace(/ӯ/g, 'у')
    .replace(/ш́/g, 'ш')
    .replace(/т̣/g, 'т')
    .replace(/д̣/g, 'д')
    .replace(/р̣̄/g, 'р')
    .replace(/р̣/g, 'р')
    .replace(/н̣/g, 'н')
    .replace(/н̃/g, 'н')
    .replace(/н̇/g, 'н')
    .replace(/м̇/g, 'м')
    .replace(/х̣/g, 'х')
    .replace(/л̣/g, 'л')
    .replace(/ом̇/g, 'ом');
};

// Simple synonym pair interface for VerseCard/DualLanguageVerseCard rendering
export interface SynonymPair {
  term: string;
  meaning: string;
}

// Dash separators used to split term from meaning
const DASH_SEPARATORS = [' — ', ' – ', ' - ', '—', '–', '-', ' —\n', ' –\n', ' -\n', '—\n', '–\n', '-\n'];

/**
 * Parse synonyms string into term-meaning pairs.
 * Used by VerseCard and DualLanguageVerseCard for rendering.
 * This is the single source of truth for synonym parsing.
 */
export const parseSynonymPairs = (raw: string): SynonymPair[] => {
  if (!raw) return [];

  // Remove HTML tags before parsing
  const cleaned = raw.replace(/<[^>]*>/g, '').trim();

  // Split ONLY by semicolon (comma is used inside meanings like "те, Верховний")
  const parts = cleaned
    .split(/;/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pairs: SynonymPair[] = [];

  for (const part of parts) {
    let dashIndex = -1;
    let separator = '';

    for (const sep of DASH_SEPARATORS) {
      dashIndex = part.indexOf(sep);
      if (dashIndex !== -1) {
        separator = sep;
        break;
      }
    }

    if (dashIndex === -1) {
      // No separator found - add term without meaning
      pairs.push({
        term: part,
        meaning: '',
      });
      continue;
    }

    const term = part.slice(0, dashIndex).trim();
    const meaning = part.slice(dashIndex + separator.length).trim().replace(/^\n+/, '');

    if (term) {
      pairs.push({
        term,
        meaning,
      });
    }
  }

  return pairs;
};

export const parseTermsFromSynonyms = (synonyms: string, verseNumber: string, book: string, verseLink?: string): GlossaryTerm[] => {
  if (!synonyms) return [];

  const terms: GlossaryTerm[] = [];

  // Remove HTML tags before parsing (e.g., <em>манах</em> -> манах)
  const cleaned = synonyms.replace(/<[^>]*>/g, '');

  // Split ONLY by semicolon (comma is used inside meanings like "те, Верховний")
  const termPairs = cleaned.split(/;/);

  termPairs.forEach((pair) => {
    const trimmedPair = pair.trim();
    if (!trimmedPair) return;

    // Try all separator variations (same order as VerseCard.tsx for consistency)
    const separators = [' — ', ' – ', ' - ', '—', '–', '-', ' —\n', ' –\n', ' -\n', '—\n', '–\n', '-\n'];
    let dashIndex = -1;
    let separator = '';

    for (const sep of separators) {
      dashIndex = trimmedPair.indexOf(sep);
      if (dashIndex !== -1) {
        separator = sep;
        break;
      }
    }

    // Use provided verseLink if available, otherwise fallback to glossary search
    const link = verseLink || '/glossary';

    if (dashIndex === -1) {
      // No separator found - add term without meaning (same as VerseCard.tsx)
      terms.push({
        term: trimmedPair,
        meaning: '',
        reference: verseNumber,
        book,
        link,
        verseNumber
      });
    } else {
      const term = trimmedPair.substring(0, dashIndex).trim();
      const meaning = trimmedPair.substring(dashIndex + separator.length).trim().replace(/^\n+/, '');

      // Add term even if meaning is empty (consistent with VerseCard.tsx)
      if (term) {
        terms.push({
          term,
          meaning,
          reference: verseNumber,
          book,
          link,
          verseNumber
        });
      }
    }
  });

  return terms;
};

// Extract all terms from verses data
// Expects verses with: synonyms, verse_number, book, and optionally verseLink
export const extractAllTerms = (verses: any[]): GlossaryTerm[] => {
  const allTerms: GlossaryTerm[] = [];

  verses.forEach((verse) => {
    if (verse.synonyms) {
      const termsFromVerse = parseTermsFromSynonyms(
        verse.synonyms,
        verse.verse_number,
        verse.book,
        verse.verseLink // Pass the correct verseLink from database query
      );
      allTerms.push(...termsFromVerse);
    }
  });

  return allTerms;
};

// Group terms by their Sanskrit/Bengali text
export const groupTermsByText = (terms: GlossaryTerm[]): { [key: string]: GlossaryTerm[] } => {
  const grouped: { [key: string]: GlossaryTerm[] } = {};
  
  terms.forEach((term) => {
    const key = term.term.toLowerCase().trim();
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(term);
  });
  
  return grouped;
};

// Calculate usage count for each unique term
export const calculateTermUsage = (terms: GlossaryTerm[]): GlossaryTermWithUsage[] => {
  const termMap = new Map<string, GlossaryTerm[]>();
  
  terms.forEach((term) => {
    const key = term.term.toLowerCase().trim();
    if (!termMap.has(key)) {
      termMap.set(key, []);
    }
    termMap.get(key)!.push(term);
  });
  
  const withUsage: GlossaryTermWithUsage[] = [];
  termMap.forEach((occurrences, term) => {
    withUsage.push({
      term,
      usageCount: occurrences.length,
      allOccurrences: occurrences
    });
  });
  
  return withUsage.sort((a, b) => b.usageCount - a.usageCount);
};

// Search terms with different strategies and diacritic normalization
export const searchTerms = (
  terms: GlossaryTerm[],
  query: string,
  searchType: 'exact' | 'contains' | 'starts' = 'contains'
): GlossaryTerm[] => {
  if (!query) return terms;
  
  const normalizedQuery = normalizeSanskritText(query);
  
  return terms.filter((term) => {
    const normalizedTerm = normalizeSanskritText(term.term);
    const normalizedMeaning = normalizeSanskritText(term.meaning);
    
    let termMatch = false;
    let meaningMatch = false;
    
    switch (searchType) {
      case 'exact':
        termMatch = normalizedTerm === normalizedQuery;
        meaningMatch = normalizedMeaning === normalizedQuery;
        break;
      case 'starts':
        termMatch = normalizedTerm.startsWith(normalizedQuery);
        meaningMatch = normalizedMeaning.startsWith(normalizedQuery);
        break;
      default: // contains
        termMatch = normalizedTerm.includes(normalizedQuery);
        meaningMatch = normalizedMeaning.includes(normalizedQuery);
    }
    
    return termMatch || meaningMatch;
  });
};