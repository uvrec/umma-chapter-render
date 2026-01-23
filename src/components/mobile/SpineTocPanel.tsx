// src/components/mobile/SpineTocPanel.tsx
// Table of Contents panel for Spine Navigation
// ✅ Simplified: Clean list without cards, fast responsive swipe

import { useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// Sheet replaced with custom implementation for Spine offset support
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooks } from "@/contexts/BooksContext";
import { cn } from "@/lib/utils";
import { BookOpen, ChevronLeft, Mic, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SpineTocPanelProps {
  open: boolean;
  onClose: () => void;
  currentBookId?: string;
}

interface BookWithChapters {
  id: string;
  slug: string;
  title_uk: string | null;
  title_en: string | null;
  has_cantos: boolean | null;
  display_category: string | null;
  display_order: number | null;
  chapter_count: number;
}

// ✅ Simple swipeable book row - fast, no cards
function SwipeableBookRow({
  book,
  isCurrentBook,
  onBookClick,
  onChapterClick,
  language,
  t,
  hasCanto,
}: {
  book: BookWithChapters;
  isCurrentBook: boolean;
  onBookClick: () => void;
  onChapterClick: (chapter: number) => void;
  language: string;
  t: (uk: string, en: string) => string;
  hasCanto: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartRef = useRef<{ x: number; time: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bookName = language === "uk"
    ? (book.title_uk || book.title_en || book.slug)
    : (book.title_en || book.title_uk || book.slug);

  // Smooth animated swipe
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

    // Immediate visual feedback - no delay
    if (isExpanded) {
      // When expanded, allow swipe right to close
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-containerWidth + newTranslate);
    } else {
      // When collapsed, allow swipe left to expand
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-newTranslate);
    }
  }, [isExpanded]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;

    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = containerWidth * 0.3; // 30% threshold

    // Determine final state based on current position
    if (isExpanded) {
      if (translateX > -containerWidth + threshold) {
        // Close
        setIsExpanded(false);
        setTranslateX(0);
      } else {
        // Stay expanded
        setTranslateX(-containerWidth);
      }
    } else {
      if (translateX < -threshold) {
        // Expand
        setIsExpanded(true);
        setTranslateX(-containerWidth);
      } else {
        // Stay collapsed
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

  // Generate chapter numbers array
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
      {/* Sliding container */}
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
          className={cn(
            "flex items-center gap-3 px-4 py-3 cursor-pointer",
            "active:bg-muted/50",
            isCurrentBook && "bg-brand-50/50 dark:bg-brand-950/20"
          )}
          style={{ width: `${containerWidth}px` }}
          onClick={handleBookTap}
        >
          <div className="flex-1 min-w-0">
            <div className={cn(
              "font-medium truncate text-sm",
              isCurrentBook && "text-brand-600 dark:text-brand-400"
            )}>
              {bookName}
            </div>
            <div className="text-xs text-muted-foreground">
              {book.chapter_count || 0} {hasCanto ? t("Пісень", "Cantos") : t("Глав", "Ch.")}
            </div>
          </div>
        </div>

        {/* Chapter numbers (right panel - revealed on swipe) */}
        <div
          className="flex items-center bg-muted/50"
          style={{ width: `${containerWidth}px` }}
        >
          {/* Back button */}
          <button
            onClick={handleClose}
            className="h-full px-2 flex items-center text-muted-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Horizontal scrollable chapter numbers - SIMPLE, no cards */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-0.5 px-1 py-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => onChapterClick(chapter)}
                  className={cn(
                    "min-w-[32px] h-8 px-2",
                    "text-sm font-medium",
                    "text-foreground hover:text-brand-600 active:text-brand-700",
                    "rounded hover:bg-brand-100/50 active:bg-brand-200/50",
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

export function SpineTocPanel({ open, onClose, currentBookId }: SpineTocPanelProps) {
  const { t, language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const { hasCantoStructure } = useBooks();

  // ✅ Fetch books with chapter counts
  const { data: books } = useQuery({
    queryKey: ["books-toc-with-chapters"],
    queryFn: async () => {
      const { data: booksData, error: booksError } = await supabase
        .from("books")
        .select("id, slug, title_uk, title_en, has_cantos, display_category, display_order")
        .eq("is_published", true)
        .order("display_order");

      if (booksError) throw booksError;

      const booksWithCounts: BookWithChapters[] = await Promise.all(
        (booksData || []).map(async (book) => {
          if (book.has_cantos) {
            const { count } = await supabase
              .from("cantos")
              .select("*", { count: "exact", head: true })
              .eq("book_id", book.id);
            return { ...book, chapter_count: count || 0 };
          } else {
            const { count } = await supabase
              .from("chapters")
              .select("*", { count: "exact", head: true })
              .eq("book_id", book.id);
            return { ...book, chapter_count: count || 0 };
          }
        })
      );

      return booksWithCounts;
    },
  });

  const handleBookClick = useCallback((bookSlug: string) => {
    navigate(getLocalizedPath(`/lib/${bookSlug}`));
    onClose();
  }, [navigate, getLocalizedPath, onClose]);

  const handleChapterClick = useCallback((bookSlug: string, hasCanto: boolean, chapter: number) => {
    const path = `/lib/${bookSlug}/${chapter}`;
    navigate(getLocalizedPath(path));
    onClose();
  }, [navigate, getLocalizedPath, onClose]);

  // Group books by category
  const groupedBooks = useMemo(() => {
    if (!books) return {};

    const groups: { [key: string]: BookWithChapters[] } = {};

    books.forEach((book) => {
      const category = book.display_category || t("Книги", "Books");
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(book);
    });

    return groups;
  }, [books, t]);

  // Tab state for books/lectures/letters
  const [activeTab, setActiveTab] = useState<"books" | "lectures" | "letters">("books");

  const handleTabClick = (tab: "books" | "lectures" | "letters") => {
    if (tab === "books") {
      setActiveTab("books");
    } else {
      // Navigate to library page with appropriate tab
      const path = language === "uk" ? "/uk/library" : "/library";
      const tabParam = tab === "lectures" ? "?tab=lectures" : "?tab=letters";
      navigate(path + tabParam);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Custom overlay - starts after Spine */}
      <div
        className="fixed inset-0 left-14 z-[50] bg-black/80 animate-in fade-in-0 duration-300"
        onClick={onClose}
      />

      {/* Custom panel content - starts after Spine */}
      <div
        className={cn(
          "fixed inset-y-0 left-14 z-[60] w-[calc(100%-56px)] sm:w-80",
          "bg-background shadow-lg",
          "animate-in slide-in-from-left duration-300"
        )}
      >
        {/* Tabs */}
        <div className="flex border-b pt-4">
          <button
            onClick={() => handleTabClick("books")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
              activeTab === "books"
                ? "text-brand-500 border-b-2 border-brand-500"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="h-4 w-4" />
            {t("Книги", "Books")}
          </button>
          <button
            onClick={() => handleTabClick("lectures")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            <Mic className="h-4 w-4" />
            {t("Лекції", "Lectures")}
          </button>
          <button
            onClick={() => handleTabClick("letters")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            <Mail className="h-4 w-4" />
            {t("Листи", "Letters")}
          </button>
        </div>

        <ScrollArea className="h-[calc(100vh-60px)]">
          <div className="py-1">
            {/* Books List - flat, no category headers */}
            <div className="divide-y divide-border/30">
              {Object.values(groupedBooks).flat().map((book) => {
                  const hasCanto = book.has_cantos || hasCantoStructure(book.slug);
                  const isCurrentBook = currentBookId === book.slug;

                  return (
                    <SwipeableBookRow
                      key={book.id}
                      book={book}
                      isCurrentBook={isCurrentBook}
                      onBookClick={() => handleBookClick(book.slug)}
                      onChapterClick={(chapter) => handleChapterClick(book.slug, hasCanto, chapter)}
                      language={language}
                      t={t}
                      hasCanto={hasCanto}
                    />
                  );
                })}
              </div>

              {/* Empty state */}
              {Object.keys(groupedBooks).length === 0 && (
                <div className="px-4 py-12 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t("Завантаження...", "Loading...")}</p>
                </div>
              )}
            </div>
        </ScrollArea>
      </div>
    </>
  );
}

export default SpineTocPanel;
