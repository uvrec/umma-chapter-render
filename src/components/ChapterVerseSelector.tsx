/**
 * ChapterVerseSelector - Segmented header navigation like Vedabase app
 *
 * Features:
 * - Two-button header: [Chapter X] [Text Y]
 * - Grid layout for verse selection (6 columns)
 * - Range groups for long chapters (30+ verses): [1-10] [11-20] ...
 * - Progress indicator with current position
 * - Shows verse preview on hover (first words)
 * - Shows chapter titles
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

// Threshold for showing range groups
const RANGE_THRESHOLD = 30;
const RANGE_SIZE = 10;

interface Chapter {
  id: string;
  chapter_number: number;
  title_ua?: string;
  title_en?: string;
}

interface Verse {
  id: string;
  verse_number: string;
  translation_ua?: string;
  translation_en?: string;
  sanskrit_ua?: string;
  sanskrit_en?: string;
}

interface ChapterVerseSelectorProps {
  chapters: Chapter[];
  verses: Verse[];
  currentChapterIndex: number;
  currentVerseIndex: number;
  bookId?: string;
  cantoNumber?: string;
  isCantoMode?: boolean;
  className?: string;
}

export function ChapterVerseSelector({
  chapters,
  verses,
  currentChapterIndex,
  currentVerseIndex,
  bookId,
  cantoNumber,
  isCantoMode,
  className,
}: ChapterVerseSelectorProps) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [chapterOpen, setChapterOpen] = useState(false);
  const [verseOpen, setVerseOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<number | null>(null);
  const currentVerseRef = useRef<HTMLButtonElement>(null);
  const currentChapterRef = useRef<HTMLButtonElement>(null);

  const currentChapter = chapters[currentChapterIndex];
  const currentVerse = verses[currentVerseIndex];

  // Calculate range groups for long chapters
  const ranges = useMemo(() => {
    if (verses.length <= RANGE_THRESHOLD) return [];
    const rangeCount = Math.ceil(verses.length / RANGE_SIZE);
    return Array.from({ length: rangeCount }, (_, i) => ({
      index: i,
      start: i * RANGE_SIZE + 1,
      end: Math.min((i + 1) * RANGE_SIZE, verses.length),
    }));
  }, [verses.length]);

  // Get the range that contains the current verse
  const currentVerseRange = useMemo(() => {
    if (ranges.length === 0) return null;
    return Math.floor(currentVerseIndex / RANGE_SIZE);
  }, [currentVerseIndex, ranges.length]);

  // Filter verses by selected range
  const filteredVerses = useMemo(() => {
    if (ranges.length === 0 || selectedRange === null) return verses;
    const start = selectedRange * RANGE_SIZE;
    const end = Math.min((selectedRange + 1) * RANGE_SIZE, verses.length);
    return verses.slice(start, end);
  }, [verses, ranges.length, selectedRange]);

  // Reset selected range when verse popover opens
  useEffect(() => {
    if (verseOpen && ranges.length > 0) {
      setSelectedRange(currentVerseRange);
    }
  }, [verseOpen, ranges.length, currentVerseRange]);

  // Scroll to current item when popover opens
  useEffect(() => {
    if (verseOpen && currentVerseRef.current) {
      currentVerseRef.current.scrollIntoView({ block: "center" });
    }
  }, [verseOpen]);

  useEffect(() => {
    if (chapterOpen && currentChapterRef.current) {
      currentChapterRef.current.scrollIntoView({ block: "center" });
    }
  }, [chapterOpen]);

  // Build URL for chapter navigation
  const buildChapterUrl = (chapter: Chapter) => {
    if (isCantoMode) {
      return `/lib/${bookId}/${cantoNumber}/${chapter.chapter_number}`;
    }
    return `/lib/${bookId}/${chapter.chapter_number}`;
  };

  // Build URL for verse navigation
  const buildVerseUrl = (verse: Verse) => {
    const verseNum = String(verse.verse_number).includes('-')
      ? String(verse.verse_number).split('-')[0]
      : verse.verse_number;

    if (bookId === 'noi') {
      return `/lib/noi/${verseNum}`;
    }

    if (isCantoMode) {
      return `/lib/${bookId}/${cantoNumber}/${currentChapter?.chapter_number}/${verseNum}`;
    }

    return `/lib/${bookId}/${currentChapter?.chapter_number}/${verseNum}`;
  };

  // Handle chapter selection
  const handleChapterSelect = (chapter: Chapter, index: number) => {
    if (index !== currentChapterIndex) {
      navigate(buildChapterUrl(chapter));
    }
    setChapterOpen(false);
  };

  // Handle verse selection
  const handleVerseSelect = (verse: Verse, index: number) => {
    if (index !== currentVerseIndex) {
      navigate(buildVerseUrl(verse));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setVerseOpen(false);
  };

  // Get chapter title
  const getChapterTitle = (chapter: Chapter) => {
    const title = language === "ua" ? chapter.title_ua : chapter.title_en;
    return title || `${t("Глава", "Chapter")} ${chapter.chapter_number}`;
  };

  // Get verse preview text (first 30 chars of translation)
  const getVersePreview = (verse: Verse) => {
    const text = language === "ua"
      ? (verse.translation_ua || verse.sanskrit_ua)
      : (verse.translation_en || verse.sanskrit_en);
    if (!text) return "";
    // Strip HTML and truncate
    const clean = text.replace(/<[^>]*>/g, '').trim();
    return clean.length > 35 ? clean.slice(0, 35) + "…" : clean;
  };

  // Get verse display number (short form)
  const getVerseLabel = (verse: Verse) => {
    const num = String(verse.verse_number);
    if (num.includes('-')) return num;
    const parts = num.split('.');
    return parts[parts.length - 1];
  };

  if (!currentChapter || !currentVerse) return null;

  return (
    <div className={cn("flex items-center justify-center gap-0", className)}>
      {/* Chapter selector */}
      {chapters.length > 1 && (
        <Popover open={chapterOpen} onOpenChange={setChapterOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-l-lg",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "text-sm font-medium"
              )}
            >
              {t("Глава", "Chapter")} {currentChapter.chapter_number}
              <ChevronDown className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 p-0 max-h-[60vh] overflow-hidden"
            align="center"
          >
            <div className="overflow-y-auto max-h-[60vh]">
              {chapters.map((chapter, index) => {
                const isCurrent = index === currentChapterIndex;
                return (
                  <button
                    key={chapter.id}
                    ref={isCurrent ? currentChapterRef : undefined}
                    onClick={() => handleChapterSelect(chapter, index)}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors",
                      "border-b border-border/50 last:border-b-0",
                      "hover:bg-muted/50",
                      isCurrent && "bg-primary/10"
                    )}
                  >
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {t("Глава", "Chapter")} {chapter.chapter_number}
                    </div>
                    <div className={cn(
                      "font-medium mt-0.5",
                      isCurrent && "text-primary"
                    )}>
                      {getChapterTitle(chapter)}
                    </div>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Verse selector */}
      <Popover open={verseOpen} onOpenChange={setVerseOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1 px-3 py-1.5",
              chapters.length > 1 ? "rounded-r-lg" : "rounded-lg",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
              "text-sm font-medium"
            )}
          >
            {t("Вірш", "Text")} {getVerseLabel(currentVerse)}
            <ChevronDown className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto min-w-[280px] max-w-[340px] p-3 max-h-[60vh] overflow-hidden"
          align="center"
        >
          {/* Range tabs for long chapters */}
          {ranges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3 pb-2 border-b">
              {ranges.map((range) => {
                const isActive = selectedRange === range.index;
                const containsCurrent = currentVerseRange === range.index;
                return (
                  <button
                    key={range.index}
                    onClick={() => setSelectedRange(range.index)}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-colors",
                      isActive && "bg-primary text-primary-foreground",
                      !isActive && containsCurrent && "bg-primary/20 text-primary",
                      !isActive && !containsCurrent && "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {range.start}-{range.end}
                  </button>
                );
              })}
            </div>
          )}

          <div className="overflow-y-auto max-h-[calc(60vh-100px)]">
            {/* Grid layout for verses */}
            <div className="grid grid-cols-6 gap-1.5">
              {filteredVerses.map((verse) => {
                // Find the actual index in the full verses array
                const actualIndex = verses.findIndex((v) => v.id === verse.id);
                const isCurrent = actualIndex === currentVerseIndex;
                const isPast = actualIndex < currentVerseIndex;
                return (
                  <button
                    key={verse.id}
                    ref={isCurrent ? currentVerseRef : undefined}
                    onClick={() => handleVerseSelect(verse, actualIndex)}
                    className={cn(
                      "h-9 w-9 rounded-md text-xs font-mono transition-all",
                      "flex items-center justify-center",
                      "hover:scale-105",
                      isCurrent && "bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/30",
                      isPast && !isCurrent && "bg-primary/20 text-primary",
                      !isPast && !isCurrent && "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                    title={getVersePreview(verse) || `${t("Вірш", "Text")} ${verse.verse_number}`}
                  >
                    {getVerseLabel(verse)}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Progress indicator */}
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{currentVerseIndex + 1} / {verses.length}</span>
              <span>{Math.round(((currentVerseIndex + 1) / verses.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentVerseIndex + 1) / verses.length) * 100}%` }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ChapterVerseSelector;
