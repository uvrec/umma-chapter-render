// src/services/gvReferencesService.ts
// Service for fetching Gaudiya Vaishnava book references
// NOTE: Tables gv_authors, gv_book_references, gv_book_catalogues, gv_catalogue_books
// need to be created in Supabase and types regenerated for full type safety

import { supabase } from '@/integrations/supabase/client';
import type {
  GVAuthor,
  GVBookReference,
  GVBookCatalogue,
  GVBookFilters,
  AuthorEra,
} from '@/types/gv-references';

// Type assertion helper for tables not yet in generated types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromTable = (table: string) => supabase.from(table as any);

/**
 * Fetch all authors with optional filtering by era
 */
export async function fetchAuthors(era?: AuthorEra): Promise<GVAuthor[]> {
  let query = fromTable('gv_authors')
    .select('*')
    .eq('is_published', true)
    .order('display_order');

  if (era) {
    query = query.eq('era', era);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as GVAuthor[];
}

/**
 * Fetch a single author by slug
 */
export async function fetchAuthorBySlug(slug: string): Promise<GVAuthor | null> {
  const { data, error } = await fromTable('gv_authors')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data as GVAuthor;
}

/**
 * Fetch authors with their guru information
 */
export async function fetchAuthorsWithGuru(): Promise<GVAuthor[]> {
  const { data, error } = await fromTable('gv_authors')
    .select(`
      *,
      guru:guru_id (
        id,
        slug,
        name_transliteration,
        name_en,
        name_ua
      )
    `)
    .eq('is_published', true)
    .order('display_order');

  if (error) throw error;
  return data as GVAuthor[];
}

/**
 * Fetch all book references with optional filtering
 */
export async function fetchBookReferences(filters?: GVBookFilters): Promise<GVBookReference[]> {
  let query = fromTable('gv_book_references')
    .select(`
      *,
      author:author_id (
        id,
        slug,
        name_transliteration,
        name_en,
        name_ua,
        era
      )
    `)
    .eq('is_published', true)
    .order('display_order');

  if (filters) {
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.subcategory) {
      query = query.eq('subcategory', filters.subcategory);
    }
    if (filters.author_id) {
      query = query.eq('author_id', filters.author_id);
    }
    if (filters.importance_level) {
      query = query.gte('importance_level', filters.importance_level);
    }
    if (filters.original_language) {
      query = query.eq('original_language', filters.original_language);
    }
    if (filters.is_available_in_app !== undefined) {
      query = query.eq('is_available_in_app', filters.is_available_in_app);
    }
    if (filters.search) {
      query = query.or(
        `title_en.ilike.%${filters.search}%,title_ua.ilike.%${filters.search}%,title_transliteration.ilike.%${filters.search}%`
      );
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as GVBookReference[];
}

/**
 * Fetch books by author
 */
export async function fetchBooksByAuthor(authorSlug: string): Promise<GVBookReference[]> {
  // First get author id
  const author = await fetchAuthorBySlug(authorSlug);
  if (!author) return [];

  const { data, error } = await fromTable('gv_book_references')
    .select('*')
    .eq('author_id', author.id)
    .eq('is_published', true)
    .order('display_order');

  if (error) throw error;
  return data as GVBookReference[];
}

/**
 * Fetch all catalogues with their books
 */
export async function fetchCataloguesWithBooks(): Promise<GVBookCatalogue[]> {
  // Fetch catalogues
  const { data: catalogues, error: cataloguesError } = await fromTable('gv_book_catalogues')
    .select('*')
    .eq('is_published', true)
    .order('display_order');

  if (cataloguesError) throw cataloguesError;

  // Fetch all catalogue-book relationships
  const { data: catalogueBooks, error: cbError } = await fromTable('gv_catalogue_books')
    .select(`
      catalogue_id,
      book_id,
      display_order,
      book:book_id (
        id,
        slug,
        title_sanskrit,
        title_transliteration,
        title_en,
        title_ua,
        author_id,
        category,
        importance_level,
        internal_book_slug,
        is_available_in_app
      )
    `)
    .order('display_order');

  if (cbError) throw cbError;

  // Map books to catalogues
  const cataloguesWithBooks = catalogues.map((catalogue) => {
    const books = catalogueBooks
      .filter((cb) => cb.catalogue_id === catalogue.id)
      .map((cb) => cb.book as unknown as GVBookReference)
      .filter(Boolean);

    return {
      ...catalogue,
      books,
    } as GVBookCatalogue;
  });

  return cataloguesWithBooks;
}

/**
 * Fetch a single book reference by slug
 */
export async function fetchBookBySlug(slug: string): Promise<GVBookReference | null> {
  const { data, error } = await fromTable('gv_book_references')
    .select(`
      *,
      author:author_id (
        id,
        slug,
        name_sanskrit,
        name_transliteration,
        name_en,
        name_ua,
        title_transliteration,
        title_en,
        title_ua,
        era
      ),
      original_text:original_text_id (
        id,
        slug,
        title_transliteration,
        title_en,
        title_ua
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as GVBookReference;
}

/**
 * Get book counts by author
 */
export async function fetchAuthorBookCounts(): Promise<Record<string, number>> {
  const { data, error } = await fromTable('gv_book_references')
    .select('author_id')
    .eq('is_published', true);

  if (error) throw error;

  const counts: Record<string, number> = {};
  (data || []).forEach((book: { author_id?: string }) => {
    if (book.author_id) {
      counts[book.author_id] = (counts[book.author_id] || 0) + 1;
    }
  });

  return counts;
}

/**
 * Fetch books available in the app
 */
export async function fetchAvailableBooks(): Promise<GVBookReference[]> {
  return fetchBookReferences({ is_available_in_app: true });
}

/**
 * Get statistics about the reference collection
 */
export async function fetchReferenceStats(): Promise<{
  totalBooks: number;
  totalAuthors: number;
  availableInApp: number;
  byEra: Record<AuthorEra, number>;
}> {
  const [books, authors] = await Promise.all([
    fetchBookReferences(),
    fetchAuthors(),
  ]);

  const availableInApp = books.filter((b) => b.is_available_in_app).length;

  const byEra: Record<AuthorEra, number> = {
    founders: 0,
    gosvamis: 0,
    later_acharyas: 0,
    modern: 0,
    prabhupada_disciples: 0,
  };

  authors.forEach((author) => {
    if (author.era && byEra[author.era] !== undefined) {
      byEra[author.era]++;
    }
  });

  return {
    totalBooks: books.length,
    totalAuthors: authors.length,
    availableInApp,
    byEra,
  };
}
