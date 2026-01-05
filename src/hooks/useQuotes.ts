/**
 * Hooks for working with Vaniquotes data
 *
 * NOTE: These hooks are temporarily stubbed until the quote tables
 * (quote_categories, quote_pages, quotes) are created in the database.
 * Currently only daily_quotes table exists.
 */

import { useQuery } from "@tanstack/react-query";

export interface Quote {
  id: string;
  text_en: string;
  text_ua?: string;
  text_html?: string;
  source_type: string;
  source_reference?: string;
  book_slug?: string;
  chapter_number?: number;
  verse_number?: string;
  page_title?: string;
  categories?: string[];
}

export interface QuoteCategory {
  id: string;
  slug: string;
  title: string;
  title_ua?: string;
  description?: string;
  quotes_count: number;
  parent_id?: string;
}

export interface QuotePage {
  id: string;
  slug: string;
  title: string;
  title_ua?: string;
  vaniquotes_url?: string;
}

/**
 * Отримати популярні категорії цитат
 * STUBBED: Returns empty array until quote_categories table exists
 */
export function useFeaturedQuoteCategories(_limit = 10) {
  return useQuery({
    queryKey: ["quote-categories", "featured", _limit],
    queryFn: async () => {
      // Stubbed - tables don't exist yet
      return [] as QuoteCategory[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Отримати всі категорії
 * STUBBED: Returns empty array until quote_categories table exists
 */
export function useQuoteCategories() {
  return useQuery({
    queryKey: ["quote-categories", "all"],
    queryFn: async () => {
      // Stubbed - table doesn't exist yet
      return [] as QuoteCategory[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Отримати категорію за slug
 * STUBBED: Returns null until quote_categories table exists
 */
export function useQuoteCategory(slug: string) {
  return useQuery({
    queryKey: ["quote-category", slug],
    queryFn: async () => {
      // Stubbed - table doesn't exist yet
      return null as QuoteCategory | null;
    },
    enabled: !!slug,
  });
}

/**
 * Пошук цитат
 * STUBBED: Returns empty array until quotes table exists
 */
export function useSearchQuotes(
  query: string,
  options?: {
    categorySlug?: string;
    sourceType?: string;
    bookSlug?: string;
    limit?: number;
    offset?: number;
  }
) {
  const { categorySlug } = options || {};

  return useQuery({
    queryKey: ["quotes", "search", query, options],
    queryFn: async () => {
      // Stubbed - table doesn't exist yet
      return [] as Quote[];
    },
    enabled: !!query || !!categorySlug,
  });
}

/**
 * Отримати цитати для конкретного вірша
 * STUBBED: Returns empty array until quotes table exists
 */
export function useVerseQuotes(
  bookSlug: string,
  cantoNumber: number | null,
  chapterNumber: number,
  verseNumber: string
) {
  return useQuery({
    queryKey: ["quotes", "verse", bookSlug, cantoNumber, chapterNumber, verseNumber],
    queryFn: async () => {
      // Stubbed - table doesn't exist yet
      return [] as Quote[];
    },
    enabled: !!bookSlug && !!chapterNumber && !!verseNumber,
  });
}

/**
 * Отримати сторінки цитат для категорії
 * STUBBED: Returns empty array until quote_pages table exists
 */
export function useCategoryQuotePages(categoryId: string) {
  return useQuery({
    queryKey: ["quote-pages", "category", categoryId],
    queryFn: async () => {
      // Stubbed - table doesn't exist yet
      return [] as QuotePage[];
    },
    enabled: !!categoryId,
  });
}

/**
 * Отримати цитати для сторінки
 * STUBBED: Returns empty array until quotes table exists
 */
export function usePageQuotes(pageId: string) {
  return useQuery({
    queryKey: ["quotes", "page", pageId],
    queryFn: async () => {
      // Stubbed - table doesn't exist yet
      return [] as Quote[];
    },
    enabled: !!pageId,
  });
}

/**
 * Отримати випадкову цитату
 * STUBBED: Returns null until quotes table exists
 */
export function useRandomQuote() {
  return useQuery({
    queryKey: ["quotes", "random"],
    queryFn: async () => {
      // Stubbed - table doesn't exist yet
      return null as Quote | null;
    },
    staleTime: 0,
  });
}
