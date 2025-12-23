/**
 * Хук для роботи з офлайн-кешем глав
 */

import { useEffect, useState, useCallback } from 'react';
import { useNetworkState } from './useNetworkState';
import {
  cacheChapter,
  getCachedChapter,
  updateLastReadTime,
  isChapterCached,
  CachedChapter,
  getRecentlyReadChapters,
} from '@/services/offlineCache';

interface UseOfflineChapterOptions {
  autoCache?: boolean; // Автоматично кешувати при завантаженні
}

interface UseOfflineChapterResult {
  cachedChapter: CachedChapter | null;
  isCached: boolean;
  isLoading: boolean;
  cacheCurrentChapter: (data: CachedChapter) => Promise<void>;
  markAsRead: () => Promise<void>;
}

/**
 * Хук для роботи з офлайн главою
 */
export function useOfflineChapter(
  chapterId: string | undefined,
  options: UseOfflineChapterOptions = {}
): UseOfflineChapterResult {
  const { autoCache = true } = options;
  const { isOnline } = useNetworkState();
  
  const [cachedChapter, setCachedChapter] = useState<CachedChapter | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Завантажити з кешу при ініціалізації
  useEffect(() => {
    if (!chapterId) {
      setIsLoading(false);
      return;
    }

    const loadCached = async () => {
      setIsLoading(true);
      try {
        const cached = await getCachedChapter(chapterId);
        setCachedChapter(cached);
        setIsCached(cached !== null);
      } catch (error) {
        console.error('Error loading cached chapter:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCached();
  }, [chapterId]);

  // Кешувати главу
  const cacheCurrentChapter = useCallback(async (data: CachedChapter) => {
    try {
      await cacheChapter(data);
      setCachedChapter(data);
      setIsCached(true);
    } catch (error) {
      console.error('Error caching chapter:', error);
    }
  }, []);

  // Позначити як прочитану
  const markAsRead = useCallback(async () => {
    if (!chapterId) return;
    
    try {
      await updateLastReadTime(chapterId);
      // Оновити локальний стан
      if (cachedChapter) {
        setCachedChapter({
          ...cachedChapter,
          lastReadAt: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error marking chapter as read:', error);
    }
  }, [chapterId, cachedChapter]);

  return {
    cachedChapter,
    isCached,
    isLoading,
    cacheCurrentChapter,
    markAsRead,
  };
}

/**
 * Хук для отримання останніх прочитаних глав
 */
export function useRecentlyReadChapters(limit: number = 5) {
  const [chapters, setChapters] = useState<CachedChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const recent = await getRecentlyReadChapters(limit);
        setChapters(recent);
      } catch (error) {
        console.error('Error loading recently read chapters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [limit]);

  const refresh = useCallback(async () => {
    const recent = await getRecentlyReadChapters(limit);
    setChapters(recent);
  }, [limit]);

  return { chapters, isLoading, refresh };
}
