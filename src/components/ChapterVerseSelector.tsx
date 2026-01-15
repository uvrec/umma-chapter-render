/**
 * ChapterVerseSelector - Segmented header navigation like Vedabase app
 *
 * Features:
 * - Two-button header: [Chapter X] [Text Y]
 * - Popover dropdown with scrollable list
 * - Shows verse preview (first words)
 * - Shows chapter titles
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

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
  const currentVerseRef = useRef<HTMLButtonElement>(null);
  const currentChapterRef = useRef<HTMLButtonElement>(null);

  const currentChapter = chapters[currentChapterIndex];
  const currentVerse = verses[currentVerseIndex];

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
      return `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapter.chapter_number}`;
    }
    return `/veda-reader/${bookId}/${chapter.chapter_number}`;
  };

  // Build URL for verse navigation
  const buildVerseUrl = (verse: Verse) => {
    const verseNum = String(verse.verse_number).includes('-')
      ? String(verse.verse_number).split('-')[0]
      : verse.verse_number;

    if (bookId === 'noi') {
      return `/veda-reader/noi/${verseNum}`;
    }

    if (isCantoMode) {
      return `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${currentChapter?.chapter_number}/${verseNum}`;
    }

    return `/veda-reader/${bookId}/${currentChapter?.chapter_number}/${verseNum}`;
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
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* Chapter selector */}
      {chapters.length > 1 && (
        <Popover open={chapterOpen} onOpenChange={setChapterOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-0.5 px-2 py-1 rounded-md",
                "bg-primary/10 text-primary border border-primary/20",
                "hover:bg-primary/20 transition-colors",
                "text-xs font-medium"
              )}
            >
              <span className="text-muted-foreground">{t("Гл.", "Ch.")}</span>
              <span className="font-semibold">{currentChapter.chapter_number}</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-0 max-h-[50vh] overflow-hidden"
            align="center"
          >
            <div className="overflow-y-auto max-h-[50vh]">
              {chapters.map((chapter, index) => {
                const isCurrent = index === currentChapterIndex;
                return (
                  <button
                    key={chapter.id}
                    ref={isCurrent ? currentChapterRef : undefined}
                    onClick={() => handleChapterSelect(chapter, index)}
                    className={cn(
                      "w-full px-3 py-2 text-left transition-colors",
                      "border-b border-border/50 last:border-b-0",
                      "hover:bg-muted/50",
                      isCurrent && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-medium min-w-[28px]",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}>
                        {chapter.chapter_number}
                      </span>
                      <span className={cn(
                        "text-sm truncate",
                        isCurrent && "text-primary font-medium"
                      )}>
                        {getChapterTitle(chapter)}
                      </span>
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
              "flex items-center gap-0.5 px-2 py-1 rounded-md",
              "bg-primary/10 text-primary border border-primary/20",
              "hover:bg-primary/20 transition-colors",
              "text-xs font-medium"
            )}
          >
            <span className="text-muted-foreground">{t("В.", "V.")}</span>
            <span className="font-semibold">{getVerseLabel(currentVerse)}</span>
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 p-0 max-h-[50vh] overflow-hidden"
          align="center"
        >
          <div className="overflow-y-auto max-h-[50vh]">
            {verses.map((verse, index) => {
              const isCurrent = index === currentVerseIndex;
              const preview = getVersePreview(verse);
              return (
                <button
                  key={verse.id}
                  ref={isCurrent ? currentVerseRef : undefined}
                  onClick={() => handleVerseSelect(verse, index)}
                  className={cn(
                    "w-full px-3 py-2 text-left transition-colors",
                    "border-b border-border/50 last:border-b-0",
                    "hover:bg-muted/50",
                    isCurrent && "bg-primary/10"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className={cn(
                      "font-mono text-xs font-medium min-w-[32px]",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}>
                      {getVerseLabel(verse)}
                    </span>
                    {preview && (
                      <span className="text-xs text-muted-foreground truncate">
                        {preview}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ChapterVerseSelector;
