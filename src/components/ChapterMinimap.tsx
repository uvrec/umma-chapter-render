/**
 * ChapterMinimap - Visual navigation minimap for chapter content
 *
 * Features:
 * - Shows all verses as small blocks
 * - Current verse is highlighted
 * - Click to navigate to any verse
 * - Shows reading progress
 * - Responsive: hidden on mobile, visible on desktop
 */

import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Verse {
  id: string;
  verse_number: string;
  is_composite?: boolean;
  start_verse?: number;
  end_verse?: number;
}

interface ChapterMinimapProps {
  verses: Verse[];
  currentVerseIndex: number;
  bookId?: string;
  cantoNumber?: string;
  chapterNumber?: string;
  isCantoMode?: boolean;
  className?: string;
}

export function ChapterMinimap({
  verses,
  currentVerseIndex,
  bookId,
  cantoNumber,
  chapterNumber,
  isCantoMode,
  className,
}: ChapterMinimapProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Calculate progress percentage
  const progress = useMemo(() => {
    if (verses.length === 0) return 0;
    return ((currentVerseIndex + 1) / verses.length) * 100;
  }, [currentVerseIndex, verses.length]);

  // Build URL for verse navigation
  const buildVerseUrl = useCallback((verse: Verse) => {
    const verseNum = String(verse.verse_number).includes('-')
      ? String(verse.verse_number).split('-')[0]
      : verse.verse_number;

    if (bookId === 'noi') {
      return `/veda-reader/noi/${verseNum}`;
    }

    if (isCantoMode) {
      return `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNum}`;
    }

    return `/veda-reader/${bookId}/${chapterNumber}/${verseNum}`;
  }, [bookId, cantoNumber, chapterNumber, isCantoMode]);

  // Handle verse click
  const handleVerseClick = useCallback((verse: Verse, index: number) => {
    if (index === currentVerseIndex) return; // Already on this verse

    const url = buildVerseUrl(verse);
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentVerseIndex, buildVerseUrl, navigate]);

  // Get verse display number
  const getVerseLabel = (verse: Verse) => {
    const num = String(verse.verse_number);
    // For composite verses like "7-8", show shortened
    if (num.includes('-')) {
      return num;
    }
    // For long numbers in canto books, show just the verse number
    const parts = num.split('.');
    return parts[parts.length - 1];
  };

  if (verses.length === 0) return null;

  return (
    <div
      className={cn(
        "hidden lg:flex flex-col gap-2 fixed right-4 top-1/2 -translate-y-1/2 z-30",
        "bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border",
        "max-h-[70vh] overflow-hidden",
        className
      )}
    >
      {/* Header with progress */}
      <div className="text-xs text-muted-foreground text-center pb-1 border-b">
        <div className="font-medium">{currentVerseIndex + 1} / {verses.length}</div>
        <div className="text-[10px]">{Math.round(progress)}%</div>
      </div>

      {/* Verses grid */}
      <div
        className="flex flex-col gap-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        style={{ maxHeight: 'calc(70vh - 60px)' }}
      >
        {verses.map((verse, index) => {
          const isCurrent = index === currentVerseIndex;
          const isPast = index < currentVerseIndex;

          return (
            <button
              key={verse.id}
              onClick={() => handleVerseClick(verse, index)}
              className={cn(
                "w-8 h-5 rounded text-[9px] font-mono transition-all duration-150",
                "flex items-center justify-center",
                "hover:scale-110 hover:z-10",
                isCurrent && "bg-primary text-primary-foreground font-bold shadow-md scale-110",
                isPast && !isCurrent && "bg-primary/30 text-primary",
                !isPast && !isCurrent && "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
              title={`${t("Вірш", "Verse")} ${verse.verse_number}`}
            >
              {getVerseLabel(verse)}
            </button>
          );
        })}
      </div>

      {/* Progress bar at bottom */}
      <div className="pt-1 border-t">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for mobile - shows as horizontal strip
 */
export function ChapterMinimapCompact({
  verses,
  currentVerseIndex,
  bookId,
  cantoNumber,
  chapterNumber,
  isCantoMode,
  className,
}: ChapterMinimapProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Calculate progress
  const progress = useMemo(() => {
    if (verses.length === 0) return 0;
    return ((currentVerseIndex + 1) / verses.length) * 100;
  }, [currentVerseIndex, verses.length]);

  // Build URL for verse navigation
  const buildVerseUrl = useCallback((verse: Verse) => {
    const verseNum = String(verse.verse_number).includes('-')
      ? String(verse.verse_number).split('-')[0]
      : verse.verse_number;

    if (bookId === 'noi') {
      return `/veda-reader/noi/${verseNum}`;
    }

    if (isCantoMode) {
      return `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNum}`;
    }

    return `/veda-reader/${bookId}/${chapterNumber}/${verseNum}`;
  }, [bookId, cantoNumber, chapterNumber, isCantoMode]);

  // Handle click on progress bar
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const targetIndex = Math.floor(percentage * verses.length);
    const clampedIndex = Math.max(0, Math.min(targetIndex, verses.length - 1));

    if (clampedIndex !== currentVerseIndex) {
      const url = buildVerseUrl(verses[clampedIndex]);
      navigate(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [verses, currentVerseIndex, buildVerseUrl, navigate]);

  if (verses.length === 0) return null;

  return (
    <div
      className={cn(
        "lg:hidden fixed bottom-20 left-4 right-4 z-30",
        "bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* Current position indicator */}
        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
          {currentVerseIndex + 1}/{verses.length}
        </span>

        {/* Clickable progress bar */}
        <div
          className="flex-1 h-2 bg-muted rounded-full overflow-hidden cursor-pointer relative group"
          onClick={handleProgressClick}
          title={t("Клікніть для навігації", "Click to navigate")}
        >
          {/* Progress fill */}
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />

          {/* Hover indicator */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />

          {/* Current position marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md transition-all duration-300"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Percentage */}
        <span className="text-xs font-mono text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

export default ChapterMinimap;
