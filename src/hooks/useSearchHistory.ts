/**
 * useSearchHistory - Hook для зберігання історії пошуку в localStorage
 *
 * Функціонал:
 * - Зберігає останні 10 пошукових запитів
 * - Персистентне зберігання в localStorage
 * - Дедуплікація запитів
 * - Очищення історії
 */

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'veda_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount?: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Завантажити історію з localStorage при монтуванні
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SearchHistoryItem[];
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // Зберегти історію в localStorage
  const saveHistory = useCallback((items: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setHistory(items);
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }, []);

  // Додати новий пошуковий запит
  const addToHistory = useCallback(
    (query: string, resultCount?: number) => {
      if (!query || query.trim().length < 2) return;

      const trimmedQuery = query.trim();
      const newItem: SearchHistoryItem = {
        query: trimmedQuery,
        timestamp: Date.now(),
        resultCount,
      };

      // Видаляємо дублікати та додаємо новий запит на початок
      const filteredHistory = history.filter(
        (item) => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
      );

      const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      saveHistory(updatedHistory);
    },
    [history, saveHistory]
  );

  // Видалити конкретний запит з історії
  const removeFromHistory = useCallback(
    (query: string) => {
      const updatedHistory = history.filter(
        (item) => item.query.toLowerCase() !== query.toLowerCase()
      );
      saveHistory(updatedHistory);
    },
    [history, saveHistory]
  );

  // Очистити всю історію
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }, []);

  // Отримати тільки текстові запити
  const queries = history.map((item) => item.query);

  return {
    history,
    queries,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
