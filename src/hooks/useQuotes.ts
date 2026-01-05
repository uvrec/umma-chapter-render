/**
 * Hooks for working with Vaniquotes data
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
 */
export function useFeaturedQuoteCategories(limit = 10) {
  return useQuery({
    queryKey: ["quote-categories", "featured", limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_featured_quote_categories", {
        p_limit: limit,
      });

      if (error) throw error;
      return data as QuoteCategory[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Отримати всі категорії
 */
export function useQuoteCategories() {
  return useQuery({
    queryKey: ["quote-categories", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_categories")
        .select("*")
        .order("quotes_count", { ascending: false });

      if (error) throw error;
      return data as QuoteCategory[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Отримати категорію за slug
 */
export function useQuoteCategory(slug: string) {
  return useQuery({
    queryKey: ["quote-category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as QuoteCategory;
    },
    enabled: !!slug,
  });
}

/**
 * Пошук цитат
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
  const { categorySlug, sourceType, bookSlug, limit = 20, offset = 0 } = options || {};

  return useQuery({
    queryKey: ["quotes", "search", query, categorySlug, sourceType, bookSlug, limit, offset],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_quotes", {
        p_query: query || null,
        p_category_slug: categorySlug || null,
        p_source_type: sourceType || null,
        p_book_slug: bookSlug || null,
        p_limit: limit,
        p_offset: offset,
      });

      if (error) throw error;
      return data as Quote[];
    },
    enabled: !!query || !!categorySlug,
  });
}

/**
 * Отримати цитати для конкретного вірша
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
      const { data, error } = await supabase.rpc("get_verse_quotes", {
        p_book_slug: bookSlug,
        p_canto_number: cantoNumber,
        p_chapter_number: chapterNumber,
        p_verse_number: verseNumber,
      });

      if (error) throw error;
      return data as Quote[];
    },
    enabled: !!bookSlug && !!chapterNumber && !!verseNumber,
  });
}

/**
 * Отримати сторінки цитат для категорії
 */
export function useCategoryQuotePages(categoryId: string) {
  return useQuery({
    queryKey: ["quote-pages", "category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_page_categories")
        .select(`
          quote_pages (
            id,
            slug,
            title,
            title_ua,
            vaniquotes_url
          )
        `)
        .eq("category_id", categoryId);

      if (error) throw error;
      return data.map((d) => d.quote_pages) as QuotePage[];
    },
    enabled: !!categoryId,
  });
}

/**
 * Отримати цитати для сторінки
 */
export function usePageQuotes(pageId: string) {
  return useQuery({
    queryKey: ["quotes", "page", pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("quote_page_id", pageId)
        .order("created_at");

      if (error) throw error;
      return data as Quote[];
    },
    enabled: !!pageId,
  });
}

/**
 * Отримати випадкову цитату
 */
export function useRandomQuote() {
  return useQuery({
    queryKey: ["quotes", "random", Date.now()],
    queryFn: async () => {
      // Отримати загальну кількість
      const { count } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true });

      if (!count || count === 0) return null;

      // Вибрати випадковий offset
      const randomOffset = Math.floor(Math.random() * count);

      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          quote_pages (title)
        `)
        .range(randomOffset, randomOffset)
        .single();

      if (error) throw error;

      return {
        ...data,
        page_title: data.quote_pages?.title,
      } as Quote;
    },
    staleTime: 0, // Always fetch fresh
  });
}
