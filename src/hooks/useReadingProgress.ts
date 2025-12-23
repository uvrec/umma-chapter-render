/**
 * Хук для трекінгу прогресу читання
 */

import { useEffect, useCallback, useRef } from 'react';
import {
  saveReadingPosition,
  updateReadingPercent,
  getLastReadingPosition,
  getRecentReadingPositions,
  ReadingPosition,
} from '@/services/readingProgress';

interface UseReadingProgressParams {
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  cantoNumber?: number;
  verseNumber?: string;
}

export function useReadingProgress(params: UseReadingProgressParams) {
  const { bookId, bookSlug, bookTitle, chapterNumber, chapterTitle, cantoNumber, verseNumber } = params;
  const lastPercentRef = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Зберегти позицію при відкритті
  useEffect(() => {
    if (!bookSlug || !chapterNumber) return;

    saveReadingPosition({
      bookId,
      bookSlug,
      bookTitle,
      chapterNumber,
      chapterTitle,
      cantoNumber,
      verseNumber,
      percentRead: 0,
    });
  }, [bookId, bookSlug, bookTitle, chapterNumber, chapterTitle, cantoNumber, verseNumber]);

  // Обробник скролу
  const handleScroll = useCallback(() => {
    if (!bookSlug || !chapterNumber) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentRead = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    // Оновлюємо тільки якщо змінилося на 5%+
    if (Math.abs(percentRead - lastPercentRef.current) >= 5) {
      lastPercentRef.current = percentRead;

      // Дебаунс збереження
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        updateReadingPercent(bookSlug, chapterNumber, percentRead, cantoNumber);
      }, 500);
    }
  }, [bookSlug, chapterNumber, cantoNumber]);

  // Підписка на скрол
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Зберегти фінальну позицію при виході
  useEffect(() => {
    return () => {
      if (!bookSlug || !chapterNumber) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentRead = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      
      updateReadingPercent(bookSlug, chapterNumber, percentRead, cantoNumber);
    };
  }, [bookSlug, chapterNumber, cantoNumber]);

  return {
    updatePercent: (percent: number) => {
      updateReadingPercent(bookSlug, chapterNumber, percent, cantoNumber);
    },
  };
}

/**
 * Хук для отримання останніх прочитаних позицій
 */
export function useRecentReading(limit: number = 5) {
  const positions = getRecentReadingPositions(limit);
  const lastPosition = getLastReadingPosition();

  return {
    recentPositions: positions,
    lastPosition,
  };
}

export type { ReadingPosition };
