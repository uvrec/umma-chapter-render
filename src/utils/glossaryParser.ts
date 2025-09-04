// Utility to parse Sanskrit/Bengali terms from verse synonyms

export interface GlossaryTerm {
  term: string;
  meaning: string;
  reference: string;
  book: string;
  link: string;
  verseNumber: string;
}

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

// Search terms with different strategies
export const searchTerms = (
  terms: GlossaryTerm[],
  query: string,
  searchType: 'exact' | 'contains' | 'starts' = 'contains'
): GlossaryTerm[] => {
  if (!query) return terms;
  
  const queryLower = query.toLowerCase().trim();
  
  return terms.filter((term) => {
    const termLower = term.term.toLowerCase();
    const meaningLower = term.meaning.toLowerCase();
    
    let termMatch = false;
    let meaningMatch = false;
    
    switch (searchType) {
      case 'exact':
        termMatch = termLower === queryLower;
        meaningMatch = meaningLower === queryLower;
        break;
      case 'starts':
        termMatch = termLower.startsWith(queryLower);
        meaningMatch = meaningLower.startsWith(queryLower);
        break;
      default: // contains
        termMatch = termLower.includes(queryLower);
        meaningMatch = meaningLower.includes(queryLower);
    }
    
    return termMatch || meaningMatch;
  });
};