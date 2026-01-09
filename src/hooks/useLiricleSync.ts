/**
 * useLiricleSync - Hook для синхронізації аудіо з текстом через Liricle
 *
 * Використовує бібліотеку Liricle для парсингу LRC формату
 * та синхронізації з поточним часом аудіо
 */

import Liricle from 'liricle';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useAudio } from '@/contexts/ModernAudioContext';

// Типи для Liricle (відповідають LineData/WordData з liricle.d.ts)
interface LiricleLine {
  index?: number; // optional, як в LineData
  time: number; // час в СЕКУНДАХ
  text: string;
  words?: LiricleWord[] | null;
}

interface LiricleWord {
  index?: number; // optional, як в WordData
  time: number; // час в СЕКУНДАХ
  text: string;
}

// Стан синхронізації
export interface LiricleSyncState {
  isActiveVerse: boolean;
  currentLine: LiricleLine | null;
  currentLineIndex: number | null;
  currentWord: LiricleWord | null;
  currentWordIndex: number | null;
  progress: number; // 0-100% прогрес в поточному рядку
  lines: LiricleLine[];
}

// Опції hook
interface UseLiricleSyncOptions {
  enabled?: boolean;
  onLineChange?: (line: LiricleLine | null) => void;
  onWordChange?: (word: LiricleWord | null) => void;
}

/**
 * Головний hook для Liricle синхронізації
 */
export function useLiricleSync(
  verseId: string | undefined,
  lrcContent: string | null | undefined,
  options: UseLiricleSyncOptions = {}
): LiricleSyncState {
  const { enabled = true, onLineChange, onWordChange } = options;
  const { currentTime, currentTrack, isPlaying, duration } = useAudio();

  // Liricle instance (зберігаємо в ref щоб не перестворювати)
  const liricleRef = useRef<Liricle | null>(null);

  // Стан
  const [currentLine, setCurrentLine] = useState<LiricleLine | null>(null);
  const [currentWord, setCurrentWord] = useState<LiricleWord | null>(null);
  const [lines, setLines] = useState<LiricleLine[]>([]);

  // Ініціалізація Liricle
  useEffect(() => {
    if (!lrcContent || !enabled) {
      setLines([]);
      setCurrentLine(null);
      setCurrentWord(null);
      return;
    }

    // Soft cleanup flag (Liricle не має методу off())
    let cancelled = false;

    // Створюємо новий Liricle instance
    const liricle = new Liricle();
    liricleRef.current = liricle;

    // Завантажуємо LRC контент (enhanced визначається автоматично)
    liricle.load({ text: lrcContent });

    // Отримуємо рядки через подію 'load' (типи виводяться автоматично)
    liricle.on('load', (data) => {
      if (cancelled) return;
      if (data.lines) {
        setLines(data.lines);
      }
    });

    // Sync подія - синхронізація поточного рядка/слова
    liricle.on('sync', (line, word) => {
      if (cancelled) return;
      setCurrentLine(line);
      setCurrentWord(word);
      if (onLineChange) onLineChange(line);
      if (onWordChange) onWordChange(word);
    });

    return () => {
      // Soft cleanup - блокуємо setState після unmount
      cancelled = true;
      liricleRef.current = null;
    };
  }, [lrcContent, enabled, onLineChange, onWordChange]);

  // Синхронізація з поточним часом аудіо
  useEffect(() => {
    if (!liricleRef.current || !enabled) return;

    // Перевіряємо чи цей вірш зараз грає
    const isActiveVerse = !!(
      currentTrack?.verseId &&
      verseId &&
      currentTrack.verseId === verseId &&
      isPlaying
    );

    if (isActiveVerse) {
      // Liricle працює в СЕКУНДАХ
      liricleRef.current.sync(currentTime);
    } else {
      // Скидаємо стан якщо не грає
      setCurrentLine(null);
      setCurrentWord(null);
    }
  }, [currentTime, verseId, currentTrack, isPlaying, enabled]);

  // Обчислюємо прогрес в поточному рядку
  const progress = useMemo(() => {
    if (!currentLine || !lines.length) return 0;

    // Знаходимо індекс поточного рядка (index optional, тому fallback на findIndex)
    const lineIndex =
      currentLine.index ?? lines.findIndex((l) => l.time === currentLine.time);
    if (lineIndex === -1) return 0;

    const nextLine = lines[lineIndex + 1];

    if (!nextLine) {
      // Останній рядок - використовуємо тривалість аудіо
      if (!duration) return 0;
      const lineStart = currentLine.time; // вже в секундах
      const lineEnd = duration;
      const elapsed = currentTime - lineStart;
      return Math.min(100, Math.max(0, (elapsed / (lineEnd - lineStart)) * 100));
    }

    const lineStart = currentLine.time; // вже в секундах
    const lineEnd = nextLine.time;
    const elapsed = currentTime - lineStart;

    return Math.min(100, Math.max(0, (elapsed / (lineEnd - lineStart)) * 100));
  }, [currentLine, lines, currentTime, duration]);

  // Чи активний цей вірш
  const isActiveVerse = !!(
    currentTrack?.verseId &&
    verseId &&
    currentTrack.verseId === verseId &&
    isPlaying
  );

  return {
    isActiveVerse,
    currentLine,
    currentLineIndex: currentLine?.index ?? null,
    currentWord,
    currentWordIndex: currentWord?.index ?? null,
    progress,
    lines,
  };
}

/**
 * Утиліта для конвертації JSON timestamps в LRC формат
 */
export function timestampsToLRC(
  timestamps: Array<{
    start: number;
    end?: number;
    text: string;
    section?: string;
  }>,
  _enhanced: boolean = false
): string {
  const lines: string[] = [];

  for (const ts of timestamps) {
    const minutes = Math.floor(ts.start / 60);
    const seconds = ts.start % 60;
    const timeStr = `${String(minutes).padStart(2, '0')}:${seconds.toFixed(2).padStart(5, '0')}`;

    lines.push(`[${timeStr}]${ts.text}`);
  }

  return lines.join('\n');
}

/**
 * Утиліта для парсингу LRC в JSON timestamps
 */
export function parseLRCToTimestamps(
  lrcContent: string
): Array<{
  start: number;
  text: string;
  lineIndex: number;
}> {
  const timestamps: Array<{ start: number; text: string; lineIndex: number }> = [];
  const lineRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.+)/g;

  let match;
  let index = 0;

  while ((match = lineRegex.exec(lrcContent)) !== null) {
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);

    const start = minutes * 60 + seconds + milliseconds / 1000;

    timestamps.push({
      start,
      text: match[4].trim(),
      lineIndex: index++,
    });
  }

  return timestamps;
}

/**
 * Hook для seek до конкретного рядка
 */
export function useSeekToLine() {
  const { seek } = useAudio();

  const seekToLine = useCallback(
    (line: LiricleLine | { time: number }) => {
      if (line && 'time' in line) {
        // Liricle повертає час в секундах
        seek(line.time);
      }
    },
    [seek]
  );

  return seekToLine;
}

export default useLiricleSync;
