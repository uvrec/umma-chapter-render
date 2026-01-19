/**
 * useOfflineDownload - Hook для завантаження книг/глав для офлайн режиму
 *
 * Функції:
 * - Завантаження окремих глав
 * - Batch завантаження цілої книги/пісні
 * - Відстеження прогресу
 * - Перевірка статусу офлайн
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  cacheChapter,
  getCachedChapter,
  getAllCachedChapters,
  removeCachedChapter,
  clearAllCache,
  CachedChapter,
} from '@/services/offlineCache';

// Types
export interface DownloadProgress {
  current: number;
  total: number;
  currentItem: string;
  status: 'idle' | 'downloading' | 'complete' | 'error';
  error?: string;
}

export interface BookDownloadInfo {
  bookId: string;
  bookSlug: string;
  titleUa: string;
  totalChapters: number;
  downloadedChapters: number;
  isFullyDownloaded: boolean;
}

export interface OfflineStats {
  totalChapters: number;
  totalBooks: number;
  estimatedSize: string;
}

// Hook
export function useOfflineDownload() {
  const [progress, setProgress] = useState<DownloadProgress>({
    current: 0,
    total: 0,
    currentItem: '',
    status: 'idle',
  });
  const [cachedChapters, setCachedChapters] = useState<CachedChapter[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Відстежуємо онлайн/офлайн статус
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Завантажуємо список закешованих глав
  const refreshCachedChapters = useCallback(async () => {
    const chapters = await getAllCachedChapters();
    setCachedChapters(chapters);
  }, []);

  useEffect(() => {
    refreshCachedChapters();
  }, [refreshCachedChapters]);

  // Завантажити одну главу
  const downloadChapter = useCallback(async (
    chapterId: string,
    bookSlug: string
  ): Promise<boolean> => {
    try {
      // Перевіряємо чи вже закешовано
      const existing = await getCachedChapter(chapterId);
      if (existing) return true;

      // Завантажуємо главу з віршами
      const { data: chapter, error: chapterError } = await supabase
        .from('chapters')
        .select(`
          id,
          book_id,
          canto_id,
          chapter_number,
          title_uk,
          title_en
        `)
        .eq('id', chapterId)
        .single();

      if (chapterError || !chapter) {
        console.error('Error fetching chapter:', chapterError);
        return false;
      }

      // Завантажуємо вірші
      const { data: verses, error: versesError } = await supabase
        .from('verses')
        .select(`
          id,
          verse_number,
          sanskrit_uk,
          sanskrit_en,
          transliteration_uk,
          transliteration_en,
          synonyms_uk,
          synonyms_en,
          translation_uk,
          translation_en,
          commentary_uk,
          commentary_en,
          full_verse_audio_url
        `)
        .eq('chapter_id', chapterId)
        .order('verse_number_sort');

      if (versesError) {
        console.error('Error fetching verses:', versesError);
        return false;
      }

      // Зберігаємо в кеш
      const cachedChapter: CachedChapter = {
        id: chapter.id,
        bookId: chapter.book_id || '',
        bookSlug,
        cantoId: chapter.canto_id || undefined,
        chapterNumber: chapter.chapter_number,
        titleUa: chapter.title_uk || '',
        titleEn: chapter.title_en || '',
        versesJson: JSON.stringify(verses || []),
        cachedAt: Date.now(),
      };

      await cacheChapter(cachedChapter);
      await refreshCachedChapters();

      return true;
    } catch (error) {
      console.error('Download chapter error:', error);
      return false;
    }
  }, [refreshCachedChapters]);

  // Завантажити всю книгу
  const downloadBook = useCallback(async (
    bookId: string,
    bookSlug: string,
    cantoId?: string
  ): Promise<boolean> => {
    try {
      setProgress({
        current: 0,
        total: 0,
        currentItem: 'Завантаження списку глав...',
        status: 'downloading',
      });

      // Отримуємо список глав
      let query = supabase
        .from('chapters')
        .select('id, chapter_number, title_uk')
        .order('chapter_number');

      if (cantoId) {
        query = query.eq('canto_id', cantoId);
      } else {
        query = query.eq('book_id', bookId);
      }

      const { data: chapters, error } = await query;

      if (error || !chapters || chapters.length === 0) {
        setProgress(prev => ({
          ...prev,
          status: 'error',
          error: 'Не вдалося отримати список глав',
        }));
        return false;
      }

      setProgress({
        current: 0,
        total: chapters.length,
        currentItem: '',
        status: 'downloading',
      });

      // Завантажуємо кожну главу
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];

        setProgress({
          current: i,
          total: chapters.length,
          currentItem: `Глава ${chapter.chapter_number}: ${chapter.title_uk}`,
          status: 'downloading',
        });

        const success = await downloadChapter(chapter.id, bookSlug);

        if (!success) {
          console.warn(`Failed to download chapter ${chapter.chapter_number}`);
          // Продовжуємо з наступною главою
        }

        // Невелика затримка щоб не перевантажувати
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setProgress({
        current: chapters.length,
        total: chapters.length,
        currentItem: 'Завершено!',
        status: 'complete',
      });

      return true;
    } catch (error) {
      setProgress(prev => ({
        ...prev,
        status: 'error',
        error: (error as Error).message,
      }));
      return false;
    }
  }, [downloadChapter]);

  // Видалити главу з кешу
  const removeChapter = useCallback(async (chapterId: string) => {
    await removeCachedChapter(chapterId);
    await refreshCachedChapters();
  }, [refreshCachedChapters]);

  // Видалити всю книгу з кешу
  const removeBook = useCallback(async (bookId: string) => {
    const chaptersToRemove = cachedChapters.filter(c => c.bookId === bookId);
    for (const chapter of chaptersToRemove) {
      await removeCachedChapter(chapter.id);
    }
    await refreshCachedChapters();
  }, [cachedChapters, refreshCachedChapters]);

  // Очистити весь кеш
  const clearCache = useCallback(async () => {
    await clearAllCache();
    await refreshCachedChapters();
  }, [refreshCachedChapters]);

  // Перевірити чи глава закешована
  const isChapterCached = useCallback((chapterId: string): boolean => {
    return cachedChapters.some(c => c.id === chapterId);
  }, [cachedChapters]);

  // Отримати інформацію про завантажені книги
  const getDownloadedBooks = useCallback((): BookDownloadInfo[] => {
    const bookMap = new Map<string, BookDownloadInfo>();

    for (const chapter of cachedChapters) {
      if (!bookMap.has(chapter.bookId)) {
        bookMap.set(chapter.bookId, {
          bookId: chapter.bookId,
          bookSlug: chapter.bookSlug,
          titleUa: '', // Потрібно отримати окремо
          totalChapters: 0, // Потрібно отримати окремо
          downloadedChapters: 0,
          isFullyDownloaded: false,
        });
      }

      const info = bookMap.get(chapter.bookId)!;
      info.downloadedChapters++;
    }

    return Array.from(bookMap.values());
  }, [cachedChapters]);

  // Статистика офлайн сховища
  const getStats = useCallback((): OfflineStats => {
    const uniqueBooks = new Set(cachedChapters.map(c => c.bookId));

    // Приблизна оцінка розміру (1 глава ≈ 50-100 KB)
    const estimatedBytes = cachedChapters.length * 75 * 1024;
    const estimatedMB = (estimatedBytes / (1024 * 1024)).toFixed(1);

    return {
      totalChapters: cachedChapters.length,
      totalBooks: uniqueBooks.size,
      estimatedSize: `~${estimatedMB} MB`,
    };
  }, [cachedChapters]);

  // Скинути прогрес
  const resetProgress = useCallback(() => {
    setProgress({
      current: 0,
      total: 0,
      currentItem: '',
      status: 'idle',
    });
  }, []);

  return {
    // State
    progress,
    cachedChapters,
    isOnline,

    // Actions
    downloadChapter,
    downloadBook,
    removeChapter,
    removeBook,
    clearCache,
    resetProgress,
    refreshCachedChapters,

    // Helpers
    isChapterCached,
    getDownloadedBooks,
    getStats,
  };
}

export default useOfflineDownload;
