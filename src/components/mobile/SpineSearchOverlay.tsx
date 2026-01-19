// src/components/mobile/SpineSearchOverlay.tsx
// Full-screen search overlay for Spine Navigation (Neu Bible-style)
// Повноекранний пошук з градієнтним хедером

import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search, Book, Hash, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { useBooksContext } from "@/contexts/BooksContext";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  type: "book" | "verse" | "keyword" | "person";
  id: string;
  title: string;
  subtitle?: string;
  path: string;
}

interface SpineSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SpineSearchOverlay({ open, onClose }: SpineSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t, getLocalizedPath, language } = useLanguage();
  const { books } = useBooksContext();

  // Focus input when overlay opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Search logic
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchLower = searchQuery.toLowerCase().trim();
    const newResults: SearchResult[] = [];

    // 1. Search books by name
    if (books) {
      const matchingBooks = books.filter(book =>
        book.name_uk?.toLowerCase().includes(searchLower) ||
        book.name_en?.toLowerCase().includes(searchLower) ||
        book.id.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      matchingBooks.forEach(book => {
        newResults.push({
          type: "book",
          id: book.id,
          title: language === "uk" ? (book.name_uk || book.name_en || book.id) : (book.name_en || book.name_uk || book.id),
          subtitle: book.author_uk || book.author_en,
          path: getLocalizedPath(`/lib/${book.id}`),
        });
      });
    }

    // 2. Parse verse reference (e.g., "BG 2.1" or "Bhagavad-gita 2:1")
    const verseMatch = searchQuery.match(/^([a-zA-Z-]+)\s*(\d+)[.:](\d+)$/);
    if (verseMatch) {
      const [, bookRef, chapter, verse] = verseMatch;
      const bookId = bookRef.toLowerCase().replace(/-/g, '');

      // Try to find matching book
      const matchedBook = books?.find(b =>
        b.id.toLowerCase().includes(bookId) ||
        b.name_en?.toLowerCase().includes(bookRef.toLowerCase())
      );

      if (matchedBook) {
        newResults.unshift({
          type: "verse",
          id: `${matchedBook.id}-${chapter}-${verse}`,
          title: `${language === "uk" ? matchedBook.name_uk : matchedBook.name_en} ${chapter}.${verse}`,
          subtitle: t("Перейти до вірша", "Go to verse"),
          path: getLocalizedPath(`/lib/${matchedBook.id}/${chapter}/${verse}`),
        });
      }
    }

    // 3. Search verse content (limited)
    if (searchQuery.length >= 3) {
      try {
        const { data: verseData } = await supabase
          .from("verses")
          .select("id, verse_number, chapter_id, translation_uk, translation_en")
          .or(`translation_uk.ilike.%${searchQuery}%,translation_en.ilike.%${searchQuery}%`)
          .limit(10);

        if (verseData && verseData.length > 0) {
          for (const verse of verseData) {
            // Get chapter info
            const { data: chapterData } = await supabase
              .from("chapters")
              .select("book_id, chapter_number")
              .eq("id", verse.chapter_id)
              .single();

            if (chapterData) {
              const translation = language === "uk" ? verse.translation_uk : verse.translation_en;
              const preview = translation?.substring(0, 60) + (translation && translation.length > 60 ? "..." : "");

              newResults.push({
                type: "keyword",
                id: verse.id,
                title: `${chapterData.book_id} ${chapterData.chapter_number}.${verse.verse_number}`,
                subtitle: preview,
                path: getLocalizedPath(`/lib/${chapterData.book_id}/${chapterData.chapter_number}/${verse.verse_number}`),
              });
            }
          }
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    }

    setResults(newResults);
    setIsLoading(false);
  }, [books, language, getLocalizedPath, t]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    onClose();
    setQuery("");
    setResults([]);
  };

  const handleClose = () => {
    onClose();
    setQuery("");
    setResults([]);
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "book":
        return <Book className="h-5 w-5" />;
      case "verse":
        return <Hash className="h-5 w-5" />;
      case "person":
        return <User className="h-5 w-5" />;
      default:
        return <Search className="h-5 w-5" />;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-400 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4 mr-16">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Пошук книг, віршів...", "Search books, verses...")}
              className="w-full bg-white/90 border-0 pl-10 pr-4 py-3 text-lg
                placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/50
                rounded-lg shadow-inner"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 -mr-2 transition-colors"
            aria-label={t("Закрити", "Close")}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div
        className="flex-1 bg-background/95 backdrop-blur-sm overflow-y-auto mr-16"
        onClick={handleClose}
      >
        <div className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
          {/* Loading */}
          {isLoading && (
            <div className="py-8 text-center text-muted-foreground">
              {t("Пошук...", "Searching...")}
            </div>
          )}

          {/* No results */}
          {!isLoading && query && results.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{t("Нічого не знайдено", "No results found")}</p>
              <p className="text-sm mt-1">
                {t("Спробуйте інший запит", "Try a different search")}
              </p>
            </div>
          )}

          {/* Results list */}
          {!isLoading && results.length > 0 && (
            <div className="divide-y divide-border">
              {/* Group by type */}
              {["book", "verse", "keyword"].map((type) => {
                const typeResults = results.filter(r => r.type === type);
                if (typeResults.length === 0) return null;

                return (
                  <div key={type} className="py-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-2">
                      {type === "book" && t("Книги", "Books")}
                      {type === "verse" && t("Вірші", "Verses")}
                      {type === "keyword" && t("Результати", "Results")}
                    </div>
                    {typeResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          "w-full flex items-start gap-3 px-2 py-3 text-left",
                          "hover:bg-muted/50 active:bg-muted rounded-lg transition-colors"
                        )}
                      >
                        <span className="text-brand-500 mt-0.5">
                          {getResultIcon(result.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          {result.subtitle && (
                            <div className="text-sm text-muted-foreground truncate">
                              {result.subtitle}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tap to close hint */}
          {!query && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground/60 italic">
                {t("Торкніться, щоб закрити", "Tap to close")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpineSearchOverlay;
