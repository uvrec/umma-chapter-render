/**
 * SyncedText - Компонент для відображення тексту з синхронізацією аудіо
 *
 * Features:
 * - Підсвітка активного рядка під час програвання аудіо
 * - Автоскрол до активного сегменту
 * - Підтримка line-level та section-level синхронізації
 * - Karaoke-style прогрес всередині рядка (опціонально)
 * - Інтеграція з Liricle для LRC формату
 */

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useAudioSync, useAutoScroll, AudioTimestamp } from '@/hooks/useAudioSync';
import { useLiricleSync, useSeekToLine } from '@/hooks/useLiricleSync';

interface SyncedTextProps {
  text: string;
  verseId?: string;
  section?: 'sanskrit' | 'transliteration' | 'synonyms' | 'translation' | 'commentary';
  timestamps?: AudioTimestamp[];
  lrcContent?: string | null;  // LRC формат для Liricle синхронізації
  className?: string;
  lineClassName?: string;
  activeLineClassName?: string;
  showProgress?: boolean;      // Показувати прогрес всередині рядка (karaoke style)
  autoScroll?: boolean;        // Автоматичний скрол до активного рядка
  isActive?: boolean;          // Зовнішній контроль активності секції
  clickToSeek?: boolean;       // Клік на рядок перемотує аудіо
  renderLine?: (line: string, index: number, isActive: boolean) => React.ReactNode;
}

export function SyncedText({
  text,
  verseId,
  section,
  timestamps = [],
  lrcContent,
  className,
  lineClassName,
  activeLineClassName,
  showProgress = false,
  autoScroll = true,
  isActive: externalIsActive,
  clickToSeek = false,
  renderLine,
}: SyncedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seekToLine = useSeekToLine();

  // Використовуємо Liricle якщо є LRC контент
  const liricleSync = useLiricleSync(verseId, lrcContent, {
    enabled: !!lrcContent,
  });

  // Фільтруємо timestamps для цієї секції (fallback)
  const sectionTimestamps = useMemo(() => {
    if (!section) return timestamps;
    return timestamps.filter(t => t.section === section);
  }, [timestamps, section]);

  // Fallback хук синхронізації
  const audioSync = useAudioSync(verseId, sectionTimestamps);

  // Вибираємо джерело синхронізації: Liricle або fallback
  const activeLineIndex = lrcContent
    ? liricleSync.currentLineIndex
    : audioSync.activeLineIndex;

  const isActiveVerse = lrcContent
    ? liricleSync.isActiveVerse
    : audioSync.isActiveVerse;

  const progress = lrcContent
    ? liricleSync.progress
    : audioSync.progress;

  // Визначаємо чи секція активна
  const isActive = externalIsActive ?? isActiveVerse;

  // Автоскрол
  useAutoScroll(activeLineIndex, containerRef, autoScroll && isActive);

  // Розбиваємо текст на рядки (Liricle може надати свої рядки)
  const lines = useMemo(() => {
    if (lrcContent && liricleSync.lines.length > 0) {
      return liricleSync.lines.map(l => l.text);
    }
    return text.split('\n').filter(line => line.trim());
  }, [text, lrcContent, liricleSync.lines]);

  // Обробник кліку для seek
  const handleLineClick = useCallback((index: number) => {
    if (!clickToSeek || !lrcContent) return;

    const line = liricleSync.lines[index];
    if (line) {
      seekToLine(line);
    }
  }, [clickToSeek, lrcContent, liricleSync.lines, seekToLine]);

  return (
    <div ref={containerRef} className={cn("synced-text", className)}>
      {lines.map((line, index) => {
        const isLineActive = isActive && activeLineIndex === index;

        // Якщо є кастомний рендер
        if (renderLine) {
          return (
            <div
              key={index}
              data-line-index={index}
              className={cn(
                isLineActive && "synced-line-active",
                clickToSeek && lrcContent && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={() => handleLineClick(index)}
            >
              {renderLine(line, index, isLineActive)}
            </div>
          );
        }

        return (
          <div
            key={index}
            data-line-index={index}
            className={cn(
              "synced-line transition-all duration-200",
              lineClassName,
              isLineActive && cn(
                "synced-line-active",
                activeLineClassName
              ),
              clickToSeek && lrcContent && "cursor-pointer hover:bg-muted/50"
            )}
            style={
              showProgress && isLineActive
                ? { '--sync-progress': `${progress}%` } as React.CSSProperties
                : undefined
            }
            onClick={() => handleLineClick(index)}
          >
            {showProgress && isLineActive ? (
              <span className="synced-line-progress">{line}</span>
            ) : (
              line
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * SyncedSection - Обгортка для цілої секції (коли немає line-level timestamps)
 * Підсвічує всю секцію коли вона активна
 */
interface SyncedSectionProps {
  children: React.ReactNode;
  isActive: boolean;
  section: 'sanskrit' | 'transliteration' | 'synonyms' | 'translation' | 'commentary';
  className?: string;
  activeClassName?: string;
}

export function SyncedSection({
  children,
  isActive,
  section,
  className,
  activeClassName,
}: SyncedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Автоскрол до секції коли вона стає активною
  useEffect(() => {
    if (isActive && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isActive]);

  return (
    <div
      ref={sectionRef}
      data-synced-section={section}
      className={cn(
        "synced-section transition-all duration-300",
        className,
        isActive && cn(
          "synced-section-active",
          activeClassName
        )
      )}
    >
      {children}
    </div>
  );
}

/**
 * HighlightIndicator - Візуальний індикатор активного аудіо
 * Показує пульсуючу іконку або смужку
 */
interface HighlightIndicatorProps {
  isActive: boolean;
  type?: 'pulse' | 'bar' | 'wave';
  className?: string;
}

export function HighlightIndicator({
  isActive,
  type = 'pulse',
  className,
}: HighlightIndicatorProps) {
  if (!isActive) return null;

  return (
    <div className={cn("highlight-indicator", `highlight-indicator-${type}`, className)}>
      {type === 'pulse' && (
        <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}
      {type === 'bar' && (
        <div className="h-full w-1 bg-primary rounded animate-pulse" />
      )}
      {type === 'wave' && (
        <div className="flex items-end gap-0.5 h-4">
          <div className="w-0.5 bg-primary rounded animate-wave-1" style={{ height: '40%' }} />
          <div className="w-0.5 bg-primary rounded animate-wave-2" style={{ height: '70%' }} />
          <div className="w-0.5 bg-primary rounded animate-wave-3" style={{ height: '100%' }} />
          <div className="w-0.5 bg-primary rounded animate-wave-2" style={{ height: '70%' }} />
          <div className="w-0.5 bg-primary rounded animate-wave-1" style={{ height: '40%' }} />
        </div>
      )}
    </div>
  );
}

export default SyncedText;
