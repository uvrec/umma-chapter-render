// src/components/mobile/SpineSearchOverlay.tsx
// Full-screen search overlay for Spine Navigation (Neu Bible-style)
// ✅ SEARCH BETTER: Like "SPOTLIGHT" - live search results as you type
// Мінімалістичний дизайн без шапки, без X кнопки

import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Book, Hash, User, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  type: "book" | "verse" | "keyword" | "person" | "glossary" | "recent";
  id: string;
  title: string;
  subtitle?: string;
  path: string;
}

interface SpineSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

// ✅ Recent searches storage
const RECENT_SEARCHES_KEY = "vv_recent_searches";
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  const recent = getRecentSearches().filter(s => s !== query);
  recent.unshift(query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT_SEARCHES)));
}

// ✅ Book aliases for better verse reference parsing
const BOOK_ALIASES: Record<string, string[]> = {
  bg: ["bg", "bhagavad-gita", "bhagavadgita", "gita", "бг", "гіта", "бхагавад"],
  sb: ["sb", "srimad-bhagavatam", "bhagavatam", "шб", "бхагаватам"],
  cc: ["cc", "caitanya-caritamrta", "caitanya", "чч", "чайтанья"],
  noi: ["noi", "nectar-of-instruction", "упадешамрита", "упадешамріта"],
  iso: ["iso", "isopanisad", "isha", "ішопанішад"],
};

function findBookByAlias(alias: string, books: any[]): any | undefined {
  const aliasLower = alias.toLowerCase().replace(/[-\s]/g, '');

  // Direct slug match
  const directMatch = books.find(b => b.slug.toLowerCase() === aliasLower);
  if (directMatch) return directMatch;

  // Alias match
  for (const [slug, aliases] of Object.entries(BOOK_ALIASES)) {
    if (aliases.some(a => aliasLower.includes(a) || a.includes(aliasLower))) {
      return books.find(b => b.slug === slug);
    }
  }

  // Title match
  return books.find(b =>
    b.title_uk?.toLowerCase().includes(aliasLower) ||
    b.title_en?.toLowerCase().includes(aliasLower)
  );
}

export function SpineSearchOverlay({ open, onClose }: SpineSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t, getLocalizedPath, language } = useLanguage();

  // ✅ Smooth translate-x animation on open/close
  useEffect(() => {
    if (open && !isVisible) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else if (!open && isAnimating) {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, isVisible, isAnimating]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [open]);

  // Fetch books for search
  const { data: books } = useQuery({
    queryKey: ["books-search"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, slug, title_uk, title_en, has_cantos")
        .eq("is_published", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Focus input when overlay opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // ✅ SEARCH BETTER: Optimized search with single joined query
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
        book.title_uk?.toLowerCase().includes(searchLower) ||
        book.title_en?.toLowerCase().includes(searchLower) ||
        book.slug.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      matchingBooks.forEach(book => {
        newResults.push({
          type: "book",
          id: book.id,
          title: language === "uk" ? (book.title_uk || book.title_en || book.slug) : (book.title_en || book.title_uk || book.slug),
          path: getLocalizedPath(`/lib/${book.slug}`),
        });
      });
    }

    // ✅ 2. Enhanced verse reference parsing
    const versePatterns = [
      /^([a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+)\s*(\d+)[.:](\d+)[.:](\d+)$/,
      /^([a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+)\s*(\d+)[.:](\d+)$/,
      /^([a-zA-Zа-яА-ЯіїєґІЇЄҐ]+)(\d+)[.:](\d+)$/,
    ];

    for (const pattern of versePatterns) {
      const match = searchQuery.match(pattern);
      if (match && books) {
        const bookRef = match[1];
        const matchedBook = findBookByAlias(bookRef, books);

        if (matchedBook) {
          let path: string;
          let verseDisplay: string;

          if (match.length === 5) {
            const [, , canto, chapter, verse] = match;
            path = `/lib/${matchedBook.slug}/${canto}/${chapter}/${verse}`;
            verseDisplay = `${canto}.${chapter}.${verse}`;
          } else {
            const [, , chapter, verse] = match;
            path = `/lib/${matchedBook.slug}/${chapter}/${verse}`;
            verseDisplay = `${chapter}.${verse}`;
          }

          const bookTitle = language === "uk" ? matchedBook.title_uk : matchedBook.title_en;
          newResults.unshift({
            type: "verse",
            id: `${matchedBook.slug}-${verseDisplay}`,
            title: `${bookTitle} ${verseDisplay}`,
            subtitle: t("Перейти до вірша", "Go to verse"),
            path: getLocalizedPath(path),
          });
          break;
        }
      }
    }

    // ✅ 3. Optimized verse content search with canto support - search ALL published books
    if (searchQuery.length >= 3) {
      try {
        // Search in translation_uk
        const { data: verseDataUk } = await supabase
          .from("verses")
          .select(`
            id,
            verse_number,
            translation_uk,
            chapter:chapters!inner(
              chapter_number,
              book_id,
              canto_id,
              canto:cantos(canto_number, book_id),
              book:books(slug, title_uk, title_en, has_cantos, is_published)
            )
          `)
          .ilike("translation_uk", `%${searchQuery}%`)
          .limit(15);

        // Search in translation_en
        const { data: verseDataEn } = await supabase
          .from("verses")
          .select(`
            id,
            verse_number,
            translation_en,
            chapter:chapters!inner(
              chapter_number,
              book_id,
              canto_id,
              canto:cantos(canto_number, book_id),
              book:books(slug, title_uk, title_en, has_cantos, is_published)
            )
          `)
          .ilike("translation_en", `%${searchQuery}%`)
          .limit(15);

        // Combine and deduplicate results
        const allVerses = [...(verseDataUk || []), ...(verseDataEn || [])];
        const seenIds = new Set<string>();

        for (const verse of allVerses) {
          if (seenIds.has(verse.id)) continue;
          seenIds.add(verse.id);

          const chapter = verse.chapter as any;
          if (!chapter?.book) continue;

          // Only include published books
          if (chapter.book.is_published === false) continue;

          const translation = language === "uk"
            ? (verse as any).translation_uk
            : (verse as any).translation_en;
          const preview = translation?.substring(0, 80) + (translation && translation.length > 80 ? "..." : "");
          const bookTitle = language === "uk" ? chapter.book.title_uk : chapter.book.title_en;

          // Handle canto-based books (SB, CC)
          const cantoNumber = chapter.canto?.canto_number;
          const hasCantos = chapter.book.has_cantos;

          let versePath: string;
          let verseRef: string;

          if (hasCantos && cantoNumber) {
            versePath = `/lib/${chapter.book.slug}/${cantoNumber}/${chapter.chapter_number}/${verse.verse_number}`;
            verseRef = `${cantoNumber}.${chapter.chapter_number}.${verse.verse_number}`;
          } else {
            versePath = `/lib/${chapter.book.slug}/${chapter.chapter_number}/${verse.verse_number}`;
            verseRef = `${chapter.chapter_number}.${verse.verse_number}`;
          }

          newResults.push({
            type: "keyword",
            id: verse.id,
            title: `${bookTitle || chapter.book.slug.toUpperCase()} ${verseRef}`,
            subtitle: preview,
            path: getLocalizedPath(versePath),
          });
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
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
    navigate(result.path);
    handleClose();
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    performSearch(search);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      setQuery("");
      setResults([]);
    }, 300);
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "book":
        return <Book className="h-5 w-5" />;
      case "verse":
        return <Hash className="h-5 w-5" />;
      case "person":
        return <User className="h-5 w-5" />;
      case "glossary":
        return <BookOpen className="h-5 w-5" />;
      case "recent":
        return <Clock className="h-5 w-5" />;
      default:
        return <Search className="h-5 w-5" />;
    }
  };

  if (!isVisible && !open) return null;

  return (
    <div
      className={cn(
        "fixed left-14 top-0 bottom-0 z-[40] flex flex-col",
        "transition-transform duration-300 ease-out",
        "bg-background",
        isAnimating ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ width: 'calc(100% - 56px)' }}
    >
      {/* Minimal Search Input - no colored header */}
      <div className="px-4 pt-safe pb-2 pt-4">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Пошук книг, віршів...", "Search books, verses...")}
            className="w-full bg-muted/50 border-0 pl-10 pr-4 py-3 text-lg
              placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-border
              rounded-lg"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
        </div>
      </div>

      {/* Results Area - tap anywhere to close */}
      <div
        className="flex-1 overflow-y-auto"
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
              <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>{t("Нічого не знайдено", "No results found")}</p>
              <p className="text-sm mt-1 text-muted-foreground/60">
                {t("Спробуйте інший запит", "Try a different search")}
              </p>
            </div>
          )}

          {/* Results list */}
          {!isLoading && results.length > 0 && (
            <div className="space-y-1">
              {["verse", "book", "keyword", "glossary"].map((type) => {
                const typeResults = results.filter(r => r.type === type);
                if (typeResults.length === 0) return null;

                return (
                  <div key={type} className="py-2">
                    <div className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide px-2 py-2">
                      {type === "book" && t("Книги", "Books")}
                      {type === "verse" && t("Перейти до вірша", "Go to verse")}
                      {type === "keyword" && t("Результати пошуку", "Search results")}
                      {type === "glossary" && t("Глосарій", "Glossary")}
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
                        <span className="text-muted-foreground mt-0.5">
                          {getResultIcon(result.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          {result.subtitle && (
                            <div className="text-sm text-muted-foreground/70 truncate">
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

          {/* Recent searches when query is empty */}
          {!query && recentSearches.length > 0 && (
            <div className="py-4">
              <div className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide px-2 py-2">
                {t("Нещодавні пошуки", "Recent searches")}
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-3 text-left",
                    "hover:bg-muted/50 active:bg-muted rounded-lg transition-colors"
                  )}
                >
                  <Clock className="h-5 w-5 text-muted-foreground/60" />
                  <span className="truncate">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!query && recentSearches.length === 0 && (
            <div className="py-16 text-center">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-10" />
              <p className="text-muted-foreground/50">
                {t("Введіть запит для пошуку", "Enter a search query")}
              </p>
              <p className="text-sm text-muted-foreground/30 mt-2">
                {t("Наприклад: БГ 2.13 або karma", "E.g.: BG 2.13 or karma")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpineSearchOverlay;
