/**
 * Hooks for working with Vaniquotes data
 *
 * NOTE: These hooks are stubbed because the required tables (quotes, quote_categories, etc.)
 * do not exist yet. Only daily_quotes table exists.
 */

export interface Quote {
  id: string;
  text_en: string;
  text_uk?: string;
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
  title_uk?: string;
  description?: string;
  quotes_count: number;
  parent_id?: string;
}

export interface QuotePage {
  id: string;
  slug: string;
  title: string;
  title_uk?: string;
  vaniquotes_url?: string;
}

/**
 * Get featured quote categories (stubbed - table doesn't exist)
 */
export function useFeaturedQuoteCategories(_limit = 10) {
  return {
    data: [] as QuoteCategory[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get all categories (stubbed - table doesn't exist)
 */
export function useQuoteCategories() {
  return {
    data: [] as QuoteCategory[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get category by slug (stubbed - table doesn't exist)
 */
export function useQuoteCategory(_slug: string) {
  return {
    data: null as QuoteCategory | null,
    isLoading: false,
    error: null,
  };
}

/**
 * Search quotes (stubbed - table doesn't exist)
 */
export function useSearchQuotes(
  _query: string,
  _options?: {
    categorySlug?: string;
    sourceType?: string;
    bookSlug?: string;
    limit?: number;
    offset?: number;
  }
) {
  return {
    data: [] as Quote[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get quotes for a specific verse (stubbed - table doesn't exist)
 */
export function useVerseQuotes(
  _bookSlug: string,
  _cantoNumber: number | null,
  _chapterNumber: number,
  _verseNumber: string
) {
  return {
    data: [] as Quote[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get quote pages for category (stubbed - table doesn't exist)
 */
export function useCategoryQuotePages(_categoryId: string) {
  return {
    data: [] as QuotePage[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get quotes for page (stubbed - table doesn't exist)
 */
export function usePageQuotes(_pageId: string) {
  return {
    data: [] as Quote[],
    isLoading: false,
    error: null,
  };
}

/**
 * Get random quote (stubbed - table doesn't exist)
 */
export function useRandomQuote() {
  return {
    data: null as Quote | null,
    isLoading: false,
    error: null,
  };
}
