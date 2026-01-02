/**
 * Hook for tracking reading sessions
 * Automatically starts/ends sessions and tracks progress
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  startReadingSession,
  endReadingSession,
  updateSessionProgress,
} from '@/services/readingSessionService';

interface UseReadingSessionParams {
  bookSlug: string;
  bookTitle?: string;
  cantoNumber?: number;
  chapterNumber: number;
  chapterTitle?: string;
  totalVerses?: number;
  enabled?: boolean;
}

export function useReadingSession({
  bookSlug,
  bookTitle,
  cantoNumber,
  chapterNumber,
  chapterTitle,
  totalVerses = 0,
  enabled = true,
}: UseReadingSessionParams) {
  const sessionStarted = useRef(false);
  const currentVerse = useRef<string | null>(null);
  const versesViewed = useRef<Set<string>>(new Set());

  // Start session when component mounts
  useEffect(() => {
    if (!enabled || !bookSlug || sessionStarted.current) return;

    sessionStarted.current = true;

    startReadingSession({
      bookSlug,
      bookTitle,
      cantoNumber,
      chapterNumber,
      chapterTitle,
    });

    // End session when page unloads
    const handleBeforeUnload = () => {
      endReadingSession();
    };

    // End session when visibility changes (tab hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        endReadingSession();
      } else if (sessionStarted.current) {
        // Resume session when visible again
        startReadingSession({
          bookSlug,
          bookTitle,
          cantoNumber,
          chapterNumber,
          chapterTitle,
          startVerse: currentVerse.current || undefined,
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      endReadingSession();
      sessionStarted.current = false;
    };
  }, [bookSlug, bookTitle, cantoNumber, chapterNumber, chapterTitle, enabled]);

  // Track verse visibility
  const trackVerseView = useCallback((verseNumber: string) => {
    if (!enabled) return;

    currentVerse.current = verseNumber;
    versesViewed.current.add(verseNumber);

    const percentRead = totalVerses > 0
      ? Math.min(100, (versesViewed.current.size / totalVerses) * 100)
      : 0;

    updateSessionProgress({
      endVerse: verseNumber,
      versesRead: versesViewed.current.size,
      percentRead,
    });
  }, [enabled, totalVerses]);

  // Track scroll position as percentage
  const trackScrollProgress = useCallback((scrollPercent: number) => {
    if (!enabled) return;

    updateSessionProgress({
      percentRead: Math.min(100, scrollPercent),
    });
  }, [enabled]);

  return {
    trackVerseView,
    trackScrollProgress,
    versesViewed: versesViewed.current.size,
  };
}
