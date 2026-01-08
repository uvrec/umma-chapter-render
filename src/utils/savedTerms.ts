/**
 * Utility functions for managing saved glossary terms (bookmarks)
 * Stored in localStorage, can be extended to sync with Supabase
 */

export interface SavedTerm {
  id: string;
  term: string;
  meaning: string;
  bookSlug: string;
  bookTitle: string;
  verseNumber: string;
  chapterNumber: number;
  cantoNumber?: number;
  verseLink: string;
  savedAt: number;
  notes?: string;
}

const STORAGE_KEY = 'vv_saved_glossary_terms';

/**
 * Generate unique ID
 */
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Get all saved terms from localStorage
 */
export function getSavedTerms(): SavedTerm[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading saved terms from localStorage:', error);
    return [];
  }
}

/**
 * Save terms to localStorage
 */
export function saveSavedTerms(terms: SavedTerm[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
  } catch (error) {
    console.error('Error saving terms to localStorage:', error);
  }
}

/**
 * Add a term to saved list
 * Returns the saved term if added, null if already exists
 */
export function addSavedTerm(term: Omit<SavedTerm, 'id' | 'savedAt'>): SavedTerm | null {
  const existingTerms = getSavedTerms();

  // Check if term already exists (by term text and verse link)
  const exists = existingTerms.some(
    t => t.term.toLowerCase() === term.term.toLowerCase() && t.verseLink === term.verseLink
  );

  if (exists) {
    return null;
  }

  const newTerm: SavedTerm = {
    ...term,
    id: generateId(),
    savedAt: Date.now(),
  };

  const updatedTerms = [...existingTerms, newTerm];
  saveSavedTerms(updatedTerms);
  return newTerm;
}

/**
 * Remove a term from saved list by ID
 */
export function removeSavedTerm(id: string): void {
  const existingTerms = getSavedTerms();
  const filtered = existingTerms.filter(t => t.id !== id);
  saveSavedTerms(filtered);
}

/**
 * Check if a term is saved (by term text - checks any occurrence)
 */
export function isTermSaved(term: string): boolean {
  const terms = getSavedTerms();
  return terms.some(t => t.term.toLowerCase() === term.toLowerCase());
}

/**
 * Check if a specific term+verse combination is saved
 */
export function isTermVerseSaved(term: string, verseLink: string): boolean {
  const terms = getSavedTerms();
  return terms.some(
    t => t.term.toLowerCase() === term.toLowerCase() && t.verseLink === verseLink
  );
}

/**
 * Get all saved instances of a term
 */
export function getSavedInstancesOfTerm(term: string): SavedTerm[] {
  const terms = getSavedTerms();
  return terms.filter(t => t.term.toLowerCase() === term.toLowerCase());
}

/**
 * Update notes for a saved term
 */
export function updateSavedTermNotes(id: string, notes: string): void {
  const terms = getSavedTerms();
  const updated = terms.map(t => t.id === id ? { ...t, notes } : t);
  saveSavedTerms(updated);
}

/**
 * Clear all saved terms
 */
export function clearSavedTerms(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing saved terms:', error);
  }
}

/**
 * Get saved terms count
 */
export function getSavedTermsCount(): number {
  return getSavedTerms().length;
}

/**
 * Get unique saved terms count (by term text)
 */
export function getUniqueSavedTermsCount(): number {
  const terms = getSavedTerms();
  const unique = new Set(terms.map(t => t.term.toLowerCase()));
  return unique.size;
}
