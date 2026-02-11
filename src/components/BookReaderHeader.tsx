/**
 * BookReaderHeader - Header with pill navigation for book reader
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 *
 * Features:
 * - Hamburger menu (BookDrawer)
 * - Pill badge showing current position (Chapter X | Text Y)
 * - Chapter and Verse selector popovers
 * - Bookmark and Settings icons
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookDrawer } from "@/components/BookDrawer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { cn } from "@/lib/utils";

interface Chapter {
  chapter_number: number;
  title_uk?: string;
  title_en?: string;
}

interface Verse {
  verse_number: string;
  transliteration_uk?: string;
  transliteration_en?: string;
}

interface BookReaderHeaderProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
  chapterNumber?: number;
  verseNumber?: string;
  chapters?: Chapter[];
  verses?: Verse[];
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  // For intro chapters (Introduction, Preface, etc.)
  introTitle?: string;
}

export const BookReaderHeader = ({
  bookTitle,
  bookSlug,
  cantoNumber,
  chapterNumber,
  verseNumber,
  chapters = [],
  verses = [],
  isBookmarked = false,
  onBookmarkToggle,
  introTitle,
}: BookReaderHeaderProps) => {
  const { language, t, getLocalizedPath } = useLanguage();
  const { dualLanguageMode, setDualLanguageMode } = useReaderSettings();
  const navigate = useNavigate();
  const [chapterPopoverOpen, setChapterPopoverOpen] = useState(false);
  const [versePopoverOpen, setVersePopoverOpen] = useState(false);

  // Build navigation paths
  const getChapterPath = (chapter: number) => {
    if (cantoNumber) {
      return getLocalizedPath(`/lib/${bookSlug}/${cantoNumber}/${chapter}/1`);
    }
    return getLocalizedPath(`/lib/${bookSlug}/${chapter}/1`);
  };

  const getVersePath = (verse: string) => {
    if (cantoNumber) {
      return getLocalizedPath(`/lib/${bookSlug}/${cantoNumber}/${chapterNumber}/${verse}`);
    }
    return getLocalizedPath(`/lib/${bookSlug}/${chapterNumber}/${verse}`);
  };

  // Get current chapter title
  const currentChapter = useMemo(() => {
    return chapters.find((c) => c.chapter_number === chapterNumber);
  }, [chapters, chapterNumber]);

  const currentChapterTitle = currentChapter
    ? language === "uk"
      ? currentChapter.title_uk
      : currentChapter.title_en
    : null;

  // Truncate transliteration for verse list
  const truncateTranslit = (text: string | undefined, maxLength: number = 25) => {
    if (!text) return "";
    const clean = text.replace(/\n/g, " ").trim();
    if (clean.length <= maxLength) return clean;
    return clean.substring(0, maxLength) + "...";
  };

  // If it's an intro chapter, show simple pill
  if (introTitle) {
    return (
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between px-2 py-2">
          {/* Menu button */}
          <BookDrawer
            bookTitle={bookTitle}
            bookSlug={bookSlug}
            cantoNumber={cantoNumber}
          />

          {/* Intro title pill */}
          <div className="flex-1 flex justify-center">
            <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <span className="text-sm font-medium">{introTitle}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={onBookmarkToggle}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant={dualLanguageMode ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setDualLanguageMode(!dualLanguageMode)}
              title={t("Двомовний режим", "Dual language")}
            >
              <BookOpen className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="flex items-center justify-between px-2 py-2">
        {/* Menu button */}
        <BookDrawer
          bookTitle={bookTitle}
          bookSlug={bookSlug}
          cantoNumber={cantoNumber}
          chapterNumber={chapterNumber}
          verseNumber={verseNumber}
        />

        {/* Navigation pill */}
        <div className="flex-1 flex justify-center">
          <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-full flex items-center overflow-hidden">
            {/* Chapter selector */}
            <Popover open={chapterPopoverOpen} onOpenChange={setChapterPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 text-sm font-medium",
                    "hover:bg-primary-foreground/10 transition-colors",
                    "border-r border-primary-foreground/20"
                  )}
                >
                  <span>
                    {t("Розділ", "Chapter")} {chapterNumber}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-72 p-0"
                align="center"
                sideOffset={8}
              >
                <ScrollArea className="h-80">
                  <div className="py-2">
                    {chapters.map((chapter) => {
                      const title =
                        language === "uk" ? chapter.title_uk : chapter.title_en;
                      const isActive = chapter.chapter_number === chapterNumber;

                      return (
                        <button
                          key={chapter.chapter_number}
                          className={cn(
                            "w-full px-4 py-3 text-left transition-colors",
                            "hover:bg-primary/10",
                            isActive && "bg-primary/15 text-primary"
                          )}
                          onClick={() => {
                            navigate(getChapterPath(chapter.chapter_number));
                            setChapterPopoverOpen(false);
                          }}
                        >
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            {t("Розділ", "Chapter")} {chapter.chapter_number}
                          </div>
                          <div className="font-medium">{title}</div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Verse selector */}
            <Popover open={versePopoverOpen} onOpenChange={setVersePopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 text-sm font-medium",
                    "hover:bg-primary-foreground/10 transition-colors"
                  )}
                >
                  <span>
                    {t("Текст", "Text")} {verseNumber}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                align="center"
                sideOffset={8}
              >
                <ScrollArea className="h-80">
                  <div className="py-2">
                    {verses.map((verse) => {
                      const translit =
                        language === "uk"
                          ? verse.transliteration_uk
                          : verse.transliteration_en;
                      const isActive = verse.verse_number === verseNumber;

                      return (
                        <button
                          key={verse.verse_number}
                          className={cn(
                            "w-full px-4 py-2.5 text-left transition-colors flex items-baseline gap-3",
                            "hover:bg-primary/10",
                            isActive && "bg-primary/15 text-primary"
                          )}
                          onClick={() => {
                            navigate(getVersePath(verse.verse_number));
                            setVersePopoverOpen(false);
                          }}
                        >
                          <span className="font-medium min-w-[3rem]">
                            {t("Текст", "Text")} {verse.verse_number}
                          </span>
                          <span className="text-sm text-muted-foreground italic truncate">
                            {truncateTranslit(translit)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onBookmarkToggle}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant={dualLanguageMode ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setDualLanguageMode(!dualLanguageMode)}
            title={t("Двомовний режим", "Dual language")}
          >
            <BookOpen className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Optional: Chapter title subtitle */}
      {currentChapterTitle && (
        <div className="text-center pb-2 px-4">
          <span className="text-xs text-primary-foreground/80">
            {currentChapterTitle}
          </span>
        </div>
      )}
    </header>
  );
};

export default BookReaderHeader;
