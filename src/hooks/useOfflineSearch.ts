/**
 * useOfflineSearch — хук для офлайн-пошуку по завантажених книгах
 *
 * Використовує SQLite FTS5 на нативних платформах (iOS/Android)
 * та текстовий пошук по IndexedDB на вебі.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  offlineSearch,
  isOfflineSearchAvailable,
  getSearchIndexStats,
  OfflineSearchResult,
  OfflineSearchStats,
} from '@/services/offlineSearchService';

interface UseOfflineSearchOptions {
  language?: 'uk' | 'en';
  bookIds?: string[];
  limit?: number;
  debounceMs?: number;
}

interface UseOfflineSearchReturn {
  /** Результати пошуку */
  results: OfflineSearchResult[];
  /** Стан завантаження */
  isSearching: boolean;
  /** Помилка пошуку */
  error: string | null;
  /** Чи доступний офлайн-пошук (є проіндексовані дані) */
  isAvailable: boolean;
  /** Статистика індексу */
  stats: OfflineSearchStats | null;
  /** Виконати пошук */
  search: (query: string) => Promise<void>;
  /** Очистити результати */
  clearResults: () => void;
  /** Оновити статистику */
  refreshStats: () => Promise<void>;
}

export function useOfflineSearch(options: UseOfflineSearchOptions = {}): UseOfflineSearchReturn {
  const { language = 'uk', bookIds, limit = 50, debounceMs = 300 } = options;

  const [results, setResults] = useState<OfflineSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [stats, setStats] = useState<OfflineSearchStats | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef(0);

  // Перевіряємо доступність при монтуванні
  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const checkAvailability = useCallback(async () => {
    try {
      const available = await isOfflineSearchAvailable();
      setIsAvailable(available);
    } catch {
      setIsAvailable(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const indexStats = await getSearchIndexStats();
      setStats(indexStats);
      setIsAvailable(indexStats.totalIndexedVerses > 0);
    } catch {
      // ignore
    }
  }, []);

  const search = useCallback(async (query: string) => {
    // Очищуємо попередній debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmedQuery = query.trim();

    // Якщо запит порожній — очищуємо
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setResults([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    // Debounce
    const searchId = ++abortRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const searchResults = await offlineSearch(trimmedQuery, {
          language,
          bookIds,
          limit,
        });

        // Перевіряємо чи це ще актуальний запит
        if (searchId !== abortRef.current) return;

        setResults(searchResults);
      } catch (err) {
        if (searchId !== abortRef.current) return;
        console.error('[useOfflineSearch] Error:', err);
        setError(err instanceof Error ? err.message : 'Помилка пошуку');
        setResults([]);
      } finally {
        if (searchId === abortRef.current) {
          setIsSearching(false);
        }
      }
    }, debounceMs);
  }, [language, bookIds, limit, debounceMs]);

  const clearResults = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    abortRef.current++;
    setResults([]);
    setError(null);
    setIsSearching(false);
  }, []);

  // Cleanup при розмонтуванні
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    results,
    isSearching,
    error,
    isAvailable,
    stats,
    search,
    clearResults,
    refreshStats,
  };
}

export default useOfflineSearch;
