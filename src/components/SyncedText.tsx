/**
 * SyncedText - Компонент для відображення тексту з синхронізацією аудіо
 *
 * Features:
 * - Підсвітка активного рядка під час програвання аудіо
 * - Автоскрол до активного сегменту
 * - Підтримка line-level та section-level синхронізації
 * - Karaoke-style прогрес всередині рядка (опціонально)
 */

import { useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAudioSync, useAutoScroll, AudioTimestamp } from '@/hooks/useAudioSync';

interface SyncedTextProps {
  text: string;
  verseId?: string;
  section?: 'sanskrit' | 'transliteration' | 'synonyms' | 'translation' | 'commentary';
  timestamps?: AudioTimestamp[];
  className?: string;
  lineClassName?: string;
  activeLineClassName?: string;
  showProgress?: boolean;      // Показувати прогрес всередині рядка (karaoke style)
  autoScroll?: boolean;        // Автоматичний скрол до активного рядка
  isActive?: boolean;          // Зовнішній контроль активності секції
  renderLine?: (line: string, index: number, isActive: boolean) => React.ReactNode;
}

export function SyncedText({
  text,
  verseId,
  section,
  timestamps = [],
  className,
  lineClassName,
  activeLineClassName,
  showProgress = false,
  autoScroll = true,
  isActive: externalIsActive,
  renderLine,
}: SyncedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Фільтруємо timestamps для цієї секції
  const sectionTimestamps = useMemo(() => {
    if (!section) return timestamps;
    return timestamps.filter(t => t.section === section);
  }, [timestamps, section]);

  // Хук синхронізації
  const { activeLineIndex, isActiveVerse, progress } = useAudioSync(verseId, sectionTimestamps);

  // Визначаємо чи секція активна
  const isActive = externalIsActive ?? isActiveVerse;

  // Автоскрол
  useAutoScroll(activeLineIndex, containerRef, autoScroll && isActive);

  // Розбиваємо текст на рядки
  const lines = useMemo(() => {
    return text.split('\n').filter(line => line.trim());
  }, [text]);

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
                isLineActive && "synced-line-active"
              )}
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
              )
            )}
            style={
              showProgress && isLineActive
                ? { '--sync-progress': `${progress}%` } as React.CSSProperties
                : undefined
            }
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
