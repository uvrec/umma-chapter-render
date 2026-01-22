// src/components/mobile/MobileLibraryList.tsx
// NeuBibel-style mobile library list: book name + count, swipe left reveals chapter slider

import { useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooks } from "@/contexts/BooksContext";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface BookData {
  id: string;
  slug: string;
  title_uk: string | null;
  title_en: string | null;
  has_cantos?: boolean | null;
  chapter_count?: number;
}

interface SwipeableBookRowProps {
  book: BookData;
  onBookClick: () => void;
  onChapterClick: (chapter: number) => void;
  language: string;
  t: (uk: string, en: string) => string;
  hasCanto: boolean;
}

// Swipeable book row - NeuBibel style
function SwipeableBookRow({
  book,
  onBookClick,
  onChapterClick,
  language,
  t,
  hasCanto,
}: SwipeableBookRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartRef = useRef<{ x: number; time: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bookName = language === "uk"
    ? (book.title_uk || book.title_en || book.slug)
    : (book.title_en || book.title_uk || book.slug);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      time: Date.now()
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = touchStartRef.current.x - e.touches[0].clientX;
    const containerWidth = containerRef.current?.offsetWidth || 300;

    if (isExpanded) {
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-containerWidth + newTranslate);
    } else {
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-newTranslate);
    }
  }, [isExpanded]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;

    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = containerWidth * 0.3;

    if (isExpanded) {
      if (translateX > -containerWidth + threshold) {
        setIsExpanded(false);
        setTranslateX(0);
      } else {
        setTranslateX(-containerWidth);
      }
    } else {
      if (translateX < -threshold) {
        setIsExpanded(true);
        setTranslateX(-containerWidth);
      } else {
        setTranslateX(0);
      }
    }

    touchStartRef.current = null;
  }, [isExpanded, translateX]);

  const handleBookTap = () => {
    if (!isExpanded) {
      onBookClick();
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTranslateX(0);
  };

  const chapters = useMemo(() => {
    return Array.from({ length: book.chapter_count || 0 }, (_, i) => i + 1);
  }, [book.chapter_count]);

  const containerWidth = containerRef.current?.offsetWidth || 300;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex will-change-transform"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: touchStartRef.current ? 'none' : 'transform 200ms ease-out',
          width: `${containerWidth * 2}px`,
        }}
      >
        {/* Book info (left panel) */}
        <div
          className="flex items-center gap-3 px-4 py-4 cursor-pointer active:bg-muted/50"
          style={{ width: `${containerWidth}px` }}
          onClick={handleBookTap}
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground">
              {bookName}
            </div>
            <div className="text-sm text-muted-foreground">
              {book.chapter_count || 0} {hasCanto ? t("Пісень", "Cantos") : t("Глав", "Chapters")}
            </div>
          </div>
        </div>

        {/* Chapter/Canto numbers (right panel - revealed on swipe) */}
        <div
          className="flex items-center bg-muted/50"
          style={{ width: `${containerWidth}px` }}
        >
          <button
            onClick={handleClose}
            className="h-full px-2 flex items-center text-muted-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Horizontal scrollable numbers */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 px-2 py-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => onChapterClick(chapter)}
                  className={cn(
                    "min-w-[36px] h-9 px-2",
                    "text-sm font-medium",
                    "text-foreground hover:text-brand-600 active:text-brand-700",
                    "rounded-md hover:bg-brand-100/50 active:bg-brand-200/50",
                    "transition-colors duration-100"
                  )}
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MobileLibraryListProps {
  books: BookData[];
  isLoading: boolean;
}

export function MobileLibraryList({ books, isLoading }: MobileLibraryListProps) {
  const { t, language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const { hasCantoStructure } = useBooks();

  const handleBookClick = useCallback((bookSlug: string) => {
    navigate(getLocalizedPath(`/lib/${bookSlug}`));
  }, [navigate, getLocalizedPath]);

  const handleChapterClick = useCallback((bookSlug: string, chapter: number) => {
    navigate(getLocalizedPath(`/lib/${bookSlug}/${chapter}`));
  }, [navigate, getLocalizedPath]);

  if (isLoading) {
    return (
      <div className="divide-y divide-border/50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-4 py-4 animate-pulse">
            <div className="h-4 w-40 bg-muted rounded mb-2" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("Книги ще не додані", "No books available yet")}
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {books.map((book) => {
        const hasCanto = book.has_cantos || hasCantoStructure(book.slug);

        return (
          <SwipeableBookRow
            key={book.id}
            book={book}
            onBookClick={() => handleBookClick(book.slug)}
            onChapterClick={(chapter) => handleChapterClick(book.slug, chapter)}
            language={language}
            t={t}
            hasCanto={hasCanto}
          />
        );
      })}
    </div>
  );
}

export default MobileLibraryList;
