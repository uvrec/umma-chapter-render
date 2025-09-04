// Utility to parse Sanskrit/Bengali terms from verse synonyms

export interface GlossaryTerm {
  term: string;
  meaning: string;
  reference: string;
  book: string;
  link: string;
  verseNumber: string;
}

// Function to normalize text by removing diacritical marks
export const normalizeSanskritText = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Remove common Sanskrit diacritical marks
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
    .replace(/[ṇṆ]/g, 'n')
    .replace(/[ḥḤ]/g, 'h')
    .replace(/[ṛṜ]/g, 'r')
    .replace(/[ḻḺ]/g, 'l')
    // Remove combining marks and special characters
    .replace(/[\u0300-\u036f]/g, '') // combining diacritical marks
    .replace(/[̇̄̃̂̌]/g, '') // additional combining marks
    .replace(/ʼ/g, '') // apostrophes
    .replace(/[ˆˇ˘˙˚˛˜˝]/g, '') // additional diacritics
    // Ukrainian/Cyrillic specific
    .replace(/[її]/g, 'i')
    .replace(/[єэ]/g, 'e')
    .replace(/ʼ/g, '')
    .replace(/[ґг]/g, 'g')
    // Special Sanskrit characters
    .replace(/ом̇/g, 'ом')
    .replace(/м̇/g, 'м')
    .replace(/н̃/g, 'н')
    .replace(/р̣/g, 'р')
    .replace(/т̣/g, 'т')
    .replace(/д̣/g, 'д')
    .replace(/л̣/g, 'л')
    .replace(/ш́/g, 'ш')
    .replace(/с̣/g, 'с')
    .replace(/х̣/g, 'х');
};

export const parseTermsFromSynonyms = (synonyms: string, verseNumber: string, book: string): GlossaryTerm[] => {
  if (!synonyms) return [];
  
  const terms: GlossaryTerm[] = [];
  
  // Split by semicolon and process each term
  const termPairs = synonyms.split(';');
  
  termPairs.forEach((pair) => {
    const trimmedPair = pair.trim();
    
    // Split by dash to separate term from meaning
    const dashIndex = trimmedPair.indexOf(' — ');
    if (dashIndex !== -1) {
      const term = trimmedPair.substring(0, dashIndex).trim();
      const meaning = trimmedPair.substring(dashIndex + 3).trim();
      
      if (term && meaning) {
        // Generate link based on verse number
        const link = generateVerseLink(verseNumber);
        
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

const generateVerseLink = (verseNumber: string): string => {
  const lowerVerse = verseNumber.toLowerCase();
  
  if (lowerVerse.includes('шб') || lowerVerse.includes('sb')) {
    return `/verses/srimad-bhagavatam`;
  } else if (lowerVerse.includes('бг') || lowerVerse.includes('bg')) {
    return `/verses/bhagavad-gita`;
  } else if (lowerVerse.includes('īшо') || lowerVerse.includes('iso')) {
    return `/verses/isopanisad`;
  }
  
  return '/verses';
};

// Extract all terms from verses data
export const extractAllTerms = (verses: any[]): GlossaryTerm[] => {
  const allTerms: GlossaryTerm[] = [];
  
  verses.forEach((verse) => {
    if (verse.synonyms) {
      const termsFromVerse = parseTermsFromSynonyms(
        verse.synonyms,
        verse.number,
        verse.book
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