// src/components/mobile/SpineTocPanel.tsx
// Table of Contents panel for Spine Navigation
// ✅ Neu Bible-style: Swipe book to reveal horizontal chapter list

import { useMemo, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooks } from "@/contexts/BooksContext";
import { cn } from "@/lib/utils";
import { Book, ChevronRight, BookOpen, ChevronLeft } from "lucide-react";
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

// ✅ Swipeable book row component
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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const bookName = language === "uk"
    ? (book.title_uk || book.title_en || book.slug)
    : (book.title_en || book.title_uk || book.slug);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    const threshold = 50;

    if (deltaX > threshold) {
      // Swipe left - expand chapters
      setIsExpanded(true);
    } else if (deltaX < -threshold) {
      // Swipe right - collapse chapters
      setIsExpanded(false);
    }

    setTouchStartX(null);
  };

  const handleClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      onBookClick();
    }
  };

  // Generate chapter numbers array
  const chapters = useMemo(() => {
    return Array.from({ length: book.chapter_count || 0 }, (_, i) => i + 1);
  }, [book.chapter_count]);

  return (
    <div
      ref={rowRef}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main book row */}
      <div
        className={cn(
          "flex items-start gap-3 px-4 py-3 text-left transition-transform duration-200",
          "hover:bg-muted/50 active:bg-muted cursor-pointer",
          isCurrentBook && "bg-brand-50 dark:bg-brand-950/30",
          isExpanded && "-translate-x-full"
        )}
        onClick={handleClick}
      >
        <Book
          className={cn(
            "h-5 w-5 mt-0.5 flex-shrink-0",
            isCurrentBook ? "text-brand-500" : "text-muted-foreground"
          )}
        />
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "font-medium truncate",
              isCurrentBook && "text-brand-600 dark:text-brand-400"
            )}
          >
            {bookName}
          </div>
          {/* ✅ Show chapter count */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <BookOpen className="h-3 w-3" />
            <span>
              {book.chapter_count || 0} {hasCanto
                ? t("Пісень", "Cantos")
                : t("Глав", "Chapters")}
            </span>
          </div>
        </div>
        <ChevronRight
          className={cn(
            "h-5 w-5 text-muted-foreground/50",
            isCurrentBook && "text-brand-400"
          )}
        />
      </div>

      {/* ✅ Horizontal chapter list (revealed on swipe) */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 right-0 flex items-center",
          "bg-muted/80 backdrop-blur-sm transition-transform duration-200",
          isExpanded ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Back button */}
        <button
          onClick={() => setIsExpanded(false)}
          className="h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={t("Назад", "Back")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Horizontal scrollable chapters */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-2 py-2">
            {chapters.map((chapter) => (
              <button
                key={chapter}
                onClick={() => onChapterClick(chapter)}
                className={cn(
                  "min-w-[40px] h-10 px-3 rounded-lg",
                  "text-sm font-medium",
                  "bg-background hover:bg-brand-100 dark:hover:bg-brand-900",
                  "text-foreground hover:text-brand-600 dark:hover:text-brand-400",
                  "transition-colors shadow-sm"
                )}
              >
                {chapter}
              </button>
            ))}
            {chapters.length === 0 && (
              <span className="text-sm text-muted-foreground px-2">
                {t("Немає глав", "No chapters")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpineTocPanel({ open, onClose, currentBookId }: SpineTocPanelProps) {
  const { t, language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasCantoStructure } = useBooks();

  // ✅ Fetch books with chapter counts
  const { data: books } = useQuery({
    queryKey: ["books-toc-with-chapters"],
    queryFn: async () => {
      // Get books
      const { data: booksData, error: booksError } = await supabase
        .from("books")
        .select("id, slug, title_uk, title_en, has_cantos, display_category, display_order")
        .eq("is_published", true)
        .order("display_order");

      if (booksError) throw booksError;

      // Get chapter counts for each book
      const booksWithCounts: BookWithChapters[] = await Promise.all(
        (booksData || []).map(async (book) => {
          // For canto books, count cantos; for others, count chapters
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
    // For canto books, this is actually canto number
    const path = hasCanto
      ? `/lib/${bookSlug}/${chapter}`  // canto
      : `/lib/${bookSlug}/${chapter}`; // chapter
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

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="w-[calc(100%-4rem)] sm:w-80 ml-16 p-0"
      >
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-500" />
            {t("Бібліотека", "Library")}
          </SheetTitle>
          {/* Swipe hint */}
          <p className="text-xs text-muted-foreground mt-1">
            {t("← Свайпніть книгу для вибору глави", "← Swipe book to select chapter")}
          </p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="py-2">
            {Object.entries(groupedBooks).map(([category, categoryBooks]) => (
              <div key={category} className="mb-4">
                {/* Category Header */}
                <div className="px-4 py-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {category}
                  </span>
                </div>

                {/* Books List */}
                <div className="space-y-0.5">
                  {categoryBooks.map((book) => {
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
              </div>
            ))}

            {/* Empty state */}
            {Object.keys(groupedBooks).length === 0 && (
              <div className="px-4 py-12 text-center text-muted-foreground">
                <Book className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>{t("Завантаження книг...", "Loading books...")}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default SpineTocPanel;
