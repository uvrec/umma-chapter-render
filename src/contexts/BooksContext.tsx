/**
 * BooksContext - контекст для зберігання інформації про книги
 * Використовується для динамічного визначення структури книг (канто/глави)
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BooksContextType {
  cantoBookSlugs: Set<string>;
  isLoaded: boolean;
  hasCantoStructure: (bookSlug: string) => boolean;
}

// Fallback список для початкового рендеру (поки не завантажено з БД)
// Експортується для використання в утилітах без React контексту
export const FALLBACK_CANTO_BOOKS = new Set([
  "sb", "cc", "scc", "saranagati", "td", "scb"
]);

/**
 * Статична перевірка чи книга має канто-структуру (використовує fallback)
 * Використовується в утилітах, де немає доступу до React контексту
 */
export function isCantoBookSlug(slug: string): boolean {
  return FALLBACK_CANTO_BOOKS.has(slug.toLowerCase());
}

const BooksContext = createContext<BooksContextType>({
  cantoBookSlugs: FALLBACK_CANTO_BOOKS,
  isLoaded: false,
  hasCantoStructure: (slug) => FALLBACK_CANTO_BOOKS.has(slug.toLowerCase()),
});

export function BooksProvider({ children }: { children: ReactNode }) {
  const [cantoBookSlugs, setCantoBookSlugs] = useState<Set<string>>(FALLBACK_CANTO_BOOKS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchCantoBooks() {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("slug")
          .eq("has_cantos", true)
          .eq("is_published", true);

        if (error) {
          console.error("Failed to fetch canto books:", error);
          return;
        }

        if (data && data.length > 0) {
          const slugs = new Set(data.map((book) => book.slug.toLowerCase()));
          setCantoBookSlugs(slugs);
        }
      } catch (error) {
        console.error("Failed to fetch canto books:", error);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchCantoBooks();
  }, []);

  const hasCantoStructure = (bookSlug: string): boolean => {
    return cantoBookSlugs.has(bookSlug.toLowerCase());
  };

  return (
    <BooksContext.Provider value={{ cantoBookSlugs, isLoaded, hasCantoStructure }}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  return useContext(BooksContext);
}

export function useHasCantoStructure(bookSlug: string): boolean {
  const { hasCantoStructure } = useBooks();
  return hasCantoStructure(bookSlug);
}
