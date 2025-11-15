// Utility functions for managing learning verses (slokas)
// Used to save entire verses for learning in ScriptLearning tool

export interface LearningVerse {
  verseId: string;
  verseNumber: string;
  bookName: string;
  bookSlug?: string;
  cantoNumber?: string;
  chapterNumber?: string;

  // Verse content
  sanskritText: string;
  transliteration?: string;
  translation: string;
  commentary?: string;

  // Audio URLs (if available)
  audioUrl?: string;
  audioSanskrit?: string;
  audioTranslation?: string;

  // Metadata
  addedAt?: number;
}

const STORAGE_KEY = 'scriptLearning_verses';

/**
 * Get all learning verses from localStorage
 */
export function getLearningVerses(): LearningVerse[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading learning verses from localStorage:', error);
    return [];
  }
}

/**
 * Save learning verses to localStorage
 */
export function saveLearningVerses(verses: LearningVerse[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verses));
  } catch (error) {
    console.error('Error saving learning verses to localStorage:', error);
  }
}

/**
 * Add a verse to learning list
 * Returns true if added, false if already exists
 */
export function addLearningVerse(verse: LearningVerse): boolean {
  const existingVerses = getLearningVerses();

  // Check if verse already exists (by verseId)
  const exists = existingVerses.some(v => v.verseId === verse.verseId);
  if (exists) {
    return false;
  }

  // Add timestamp
  const verseWithTimestamp = {
    ...verse,
    addedAt: Date.now()
  };

  const updatedVerses = [...existingVerses, verseWithTimestamp];
  saveLearningVerses(updatedVerses);
  return true;
}

/**
 * Remove a verse from learning list by verseId
 */
export function removeLearningVerse(verseId: string): void {
  const existingVerses = getLearningVerses();
  const filtered = existingVerses.filter(v => v.verseId !== verseId);
  saveLearningVerses(filtered);
}

/**
 * Check if a verse is already in learning list
 */
export function isVerseInLearningList(verseId: string): boolean {
  const verses = getLearningVerses();
  return verses.some(v => v.verseId === verseId);
}

/**
 * Clear all learning verses
 */
export function clearLearningVerses(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing learning verses:', error);
  }
}

/**
 * Get learning verses count
 */
export function getLearningVersesCount(): number {
  return getLearningVerses().length;
}

/**
 * Get verse by ID
 */
export function getLearningVerseById(verseId: string): LearningVerse | undefined {
  const verses = getLearningVerses();
  return verses.find(v => v.verseId === verseId);
}
