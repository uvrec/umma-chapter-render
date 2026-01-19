// src/components/mobile/SpineTocPanel.tsx
// Table of Contents panel for Spine Navigation
// Список книг та глав у стилі Neu Bible

import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooksContext } from "@/contexts/BooksContext";
import { cn } from "@/lib/utils";
import { Book, ChevronRight, BookOpen } from "lucide-react";

interface SpineTocPanelProps {
  open: boolean;
  onClose: () => void;
  currentBookId?: string;
}

export function SpineTocPanel({ open, onClose, currentBookId }: SpineTocPanelProps) {
  const { t, language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { books, getChaptersCount, hasCantoStructure } = useBooksContext();

  const handleBookClick = (bookId: string) => {
    navigate(getLocalizedPath(`/lib/${bookId}`));
    onClose();
  };

  // Group books by category
  const groupedBooks = useMemo(() => {
    if (!books) return {};

    const groups: { [key: string]: typeof books } = {};

    books.forEach((book) => {
      // Use category or default to "Книги" / "Books"
      const category = book.category || t("Книги", "Books");
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
        side="left"
        className="w-[calc(100%-4rem)] sm:w-80 ml-16 p-0"
      >
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-500" />
            {t("Бібліотека", "Library")}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
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
                    const bookName = language === "uk"
                      ? (book.name_uk || book.name_en || book.id)
                      : (book.name_en || book.name_uk || book.id);
                    const chaptersCount = getChaptersCount?.(book.id) || book.total_chapters;
                    const hasCanto = hasCantoStructure?.(book.id);
                    const isCurrentBook = currentBookId === book.id;

                    return (
                      <button
                        key={book.id}
                        onClick={() => handleBookClick(book.id)}
                        className={cn(
                          "w-full flex items-start gap-3 px-4 py-3 text-left",
                          "hover:bg-muted/50 active:bg-muted transition-colors",
                          isCurrentBook && "bg-brand-50 dark:bg-brand-950/30"
                        )}
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
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <BookOpen className="h-3 w-3" />
                            <span>
                              {chaptersCount
                                ? `${chaptersCount} ${hasCanto
                                    ? t("пісень", "cantos")
                                    : t("глав", "chapters")
                                  }`
                                : t("...", "...")}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            "h-5 w-5 text-muted-foreground/50",
                            isCurrentBook && "text-brand-400"
                          )}
                        />
                      </button>
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
