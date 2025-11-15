// Utility functions for managing learning words
// Used to save words from verses for learning in ScriptLearning tool

import { SRSMetadata } from './spacedRepetition';

export interface LearningWord {
  script: string;
  iast: string;
  ukrainian: string;
  meaning: string;
  usageCount?: number;
  book?: string;
  verseReference?: string;
  addedAt?: number;
  srs?: SRSMetadata; // Spaced repetition metadata
}

const STORAGE_KEY = 'scriptLearning_importedWords';

/**
 * Get all learning words from localStorage
 */
export function getLearningWords(): LearningWord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading learning words from localStorage:', error);
    return [];
  }
}

/**
 * Save learning words to localStorage
 */
export function saveLearningWords(words: LearningWord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch (error) {
    console.error('Error saving learning words to localStorage:', error);
  }
}

/**
 * Add a word to learning list
 * Returns true if added, false if already exists
 */
export function addLearningWord(word: LearningWord): boolean {
  const existingWords = getLearningWords();

  // Check if word already exists (by iast)
  const exists = existingWords.some(w => w.iast === word.iast);
  if (exists) {
    return false;
  }

  // Add timestamp
  const wordWithTimestamp = {
    ...word,
    addedAt: Date.now()
  };

  const updatedWords = [...existingWords, wordWithTimestamp];
  saveLearningWords(updatedWords);
  return true;
}

/**
 * Remove a word from learning list by iast
 */
export function removeLearningWord(iast: string): void {
  const existingWords = getLearningWords();
  const filtered = existingWords.filter(w => w.iast !== iast);
  saveLearningWords(filtered);
}

/**
 * Check if a word is already in learning list
 */
export function isWordInLearningList(iast: string): boolean {
  const words = getLearningWords();
  return words.some(w => w.iast === iast);
}

/**
 * Clear all learning words
 */
export function clearLearningWords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing learning words:', error);
  }
}

/**
 * Get learning words count
 */
export function getLearningWordsCount(): number {
  return getLearningWords().length;
}
