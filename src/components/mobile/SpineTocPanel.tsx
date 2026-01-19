// src/components/mobile/SpineTocPanel.tsx
// Table of Contents panel for Spine Navigation
// Список книг та глав у стилі Neu Bible

import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooks } from "@/contexts/BooksContext";
import { cn } from "@/lib/utils";
import { Book, ChevronRight, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SpineTocPanelProps {
  open: boolean;
  onClose: () => void;
  currentBookId?: string;
}

export function SpineTocPanel({ open, onClose, currentBookId }: SpineTocPanelProps) {
  const { t, language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasCantoStructure } = useBooks();

  // Fetch books from database
  const { data: books } = useQuery({
    queryKey: ["books-toc"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, slug, title_uk, title_en, has_cantos, display_category, display_order")
        .eq("is_published", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

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
        side="left"
        className="w-[calc(100%-4rem)] sm:w-80 mr-16 p-0"
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
                      ? (book.title_uk || book.title_en || book.slug)
                      : (book.title_en || book.title_uk || book.slug);
                    const hasCanto = book.has_cantos || hasCantoStructure(book.slug);
                    const isCurrentBook = currentBookId === book.slug;

                    return (
                      <button
                        key={book.id}
                        onClick={() => handleBookClick(book.slug)}
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
                              {hasCanto
                                ? t("Пісні", "Cantos")
                                : t("Глави", "Chapters")}
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
