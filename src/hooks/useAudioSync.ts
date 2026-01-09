/**
 * useAudioSync - Hook для синхронізації аудіо з текстом
 *
 * Підтримує два режими:
 * 1. Section-level (простий) — підсвічує цілі блоки (санскрит, переклад, коментар)
 * 2. Line-level (детальний) — підсвічує окремі рядки тексту
 *
 * Використовує timestamps з бази даних або автоматичний поділ за тривалістю.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAudio } from '@/contexts/ModernAudioContext';

// Типи для timestamps
export interface AudioTimestamp {
  start: number;      // Час початку в секундах
  end: number;        // Час закінчення в секундах
  text?: string;      // Текст сегменту (опціонально)
  type: 'section' | 'line' | 'word';
  section?: 'sanskrit' | 'transliteration' | 'synonyms' | 'translation' | 'commentary';
  lineIndex?: number; // Індекс рядка для line type
}

// Стан синхронізації
export interface SyncState {
  isActiveVerse: boolean;       // Чи цей вірш зараз грає
  activeSection: string | null; // Активна секція ('sanskrit', 'translation', etc.)
  activeLineIndex: number | null;
  progress: number;             // Прогрес 0-100% в поточному сегменті
  currentTimestamp: AudioTimestamp | null;
}

// Структура для section-level синхронізації
export interface SectionTimings {
  sanskrit?: { start: number; end: number };
  transliteration?: { start: number; end: number };
  synonyms?: { start: number; end: number };
  translation?: { start: number; end: number };
  commentary?: { start: number; end: number };
}

/**
 * Простий hook для section-level синхронізації
 * Автоматично розподіляє час між секціями пропорційно
 */
export function useAudioSyncSimple(
  verseId: string | undefined,
  sectionTimings?: SectionTimings
): SyncState {
  const { currentTime, currentTrack, isPlaying, duration } = useAudio();

  const syncState = useMemo(() => {
    // Перевіряємо чи цей вірш зараз грає
    const isActiveVerse = !!(
      currentTrack?.verseId &&
      verseId &&
      currentTrack.verseId === verseId &&
      isPlaying
    );

    if (!isActiveVerse || !duration) {
      return {
        isActiveVerse: false,
        activeSection: null,
        activeLineIndex: null,
        progress: 0,
        currentTimestamp: null,
      };
    }

    // Якщо є явні timestamps, використовуємо їх
    if (sectionTimings) {
      const sections = Object.entries(sectionTimings) as [string, { start: number; end: number }][];
      for (const [sectionName, timing] of sections) {
        if (currentTime >= timing.start && currentTime < timing.end) {
          const sectionDuration = timing.end - timing.start;
          const elapsed = currentTime - timing.start;
          const progress = sectionDuration > 0 ? (elapsed / sectionDuration) * 100 : 0;

          return {
            isActiveVerse: true,
            activeSection: sectionName,
            activeLineIndex: null,
            progress,
            currentTimestamp: {
              start: timing.start,
              end: timing.end,
              type: 'section' as const,
              section: sectionName as AudioTimestamp['section'],
            },
          };
        }
      }
    }

    // Автоматичний розподіл: ділимо на 4 частини
    // 0-25% санскрит, 25-50% транслітерація, 50-75% переклад, 75-100% коментар
    const progress = (currentTime / duration) * 100;
    let activeSection: string;

    if (progress < 15) {
      activeSection = 'sanskrit';
    } else if (progress < 30) {
      activeSection = 'transliteration';
    } else if (progress < 50) {
      activeSection = 'synonyms';
    } else if (progress < 75) {
      activeSection = 'translation';
    } else {
      activeSection = 'commentary';
    }

    return {
      isActiveVerse: true,
      activeSection,
      activeLineIndex: null,
      progress,
      currentTimestamp: null,
    };
  }, [verseId, currentTrack, isPlaying, currentTime, duration, sectionTimings]);

  return syncState;
}

/**
 * Детальний hook з підтримкою line-level timestamps
 */
export function useAudioSync(
  verseId: string | undefined,
  timestamps: AudioTimestamp[] = []
): SyncState {
  const { currentTime, currentTrack, isPlaying } = useAudio();

  const syncState = useMemo(() => {
    const isActiveVerse = !!(
      currentTrack?.verseId &&
      verseId &&
      currentTrack.verseId === verseId &&
      isPlaying
    );

    if (!isActiveVerse || timestamps.length === 0) {
      return {
        isActiveVerse,
        activeSection: null,
        activeLineIndex: null,
        progress: 0,
        currentTimestamp: null,
      };
    }

    // Binary search для знаходження активного timestamp
    const activeTimestamp = findActiveTimestamp(timestamps, currentTime);

    if (!activeTimestamp) {
      return {
        isActiveVerse: true,
        activeSection: null,
        activeLineIndex: null,
        progress: 0,
        currentTimestamp: null,
      };
    }

    // Обчислюємо прогрес всередині сегменту
    const segmentDuration = activeTimestamp.end - activeTimestamp.start;
    const elapsed = currentTime - activeTimestamp.start;
    const progress = segmentDuration > 0 ? (elapsed / segmentDuration) * 100 : 0;

    return {
      isActiveVerse: true,
      activeSection: activeTimestamp.section || null,
      activeLineIndex: activeTimestamp.lineIndex ?? null,
      progress: Math.min(100, Math.max(0, progress)),
      currentTimestamp: activeTimestamp,
    };
  }, [verseId, currentTrack, isPlaying, currentTime, timestamps]);

  return syncState;
}

/**
 * Binary search для ефективного пошуку активного timestamp
 */
function findActiveTimestamp(
  timestamps: AudioTimestamp[],
  time: number
): AudioTimestamp | null {
  if (timestamps.length === 0) return null;

  // Сортуємо за start time
  const sorted = [...timestamps].sort((a, b) => a.start - b.start);

  let left = 0;
  let right = sorted.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const ts = sorted[mid];

    if (time >= ts.start && time < ts.end) {
      return ts;
    }

    if (time < ts.start) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return null;
}

/**
 * Hook для автоскролу до активного елемента
 */
export function useAutoScroll(
  activeLineIndex: number | null,
  containerRef: React.RefObject<HTMLElement>,
  enabled: boolean = true
) {
  const lastScrolledIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || activeLineIndex === null || !containerRef.current) return;

    // Уникаємо повторного скролу до того ж рядка
    if (lastScrolledIndex.current === activeLineIndex) return;
    lastScrolledIndex.current = activeLineIndex;

    // Знаходимо елемент з data-line-index
    const lineElement = containerRef.current.querySelector(
      `[data-line-index="${activeLineIndex}"]`
    );

    if (lineElement) {
      lineElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex, containerRef, enabled]);
}

/**
 * Генерує автоматичні timestamps на основі тексту та тривалості
 * Корисно коли немає ручних timestamps
 */
export function generateAutoTimestamps(
  text: string,
  duration: number,
  section: AudioTimestamp['section']
): AudioTimestamp[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0 || duration <= 0) return [];

  const timePerLine = duration / lines.length;

  return lines.map((line, index) => ({
    start: index * timePerLine,
    end: (index + 1) * timePerLine,
    text: line.trim(),
    type: 'line' as const,
    section,
    lineIndex: index,
  }));
}

export default useAudioSync;
