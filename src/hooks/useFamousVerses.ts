/**
 * Hook for famous verses functionality
 * - Check if a verse is famous
 * - Get all famous verses for a book
 * - Navigate between famous verses
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FamousVerse {
  id: string;
  verse_id: string;
  book_slug: string;
  canto_number: number | null;
  chapter_number: number;
  verse_number: string;
  display_order: number;
  description_uk: string | null;
  description_en: string | null;
  sanskrit: string | null;
  transliteration: string | null;
  translation_uk: string | null;
  translation_en: string | null;
}

export interface AdjacentFamousVerses {
  prev_verse_id: string | null;
  prev_chapter: number | null;
  prev_canto: number | null;
  prev_verse_number: string | null;
  next_verse_id: string | null;
  next_chapter: number | null;
  next_canto: number | null;
  next_verse_number: string | null;
}

/**
 * Get all famous verses for a book
 */
export function useFamousVersesForBook(bookSlug: string | undefined) {
  return useQuery({
    queryKey: ['famous-verses', bookSlug],
    queryFn: async () => {
      if (!bookSlug) return [];

      const { data, error } = await (supabase.rpc as any)('get_famous_verses_for_book', { p_book_slug: bookSlug });

      if (error) {
        console.error('Error fetching famous verses:', error);
        return [];
      }

      return (data || []) as FamousVerse[];
    },
    enabled: !!bookSlug,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Check if a specific verse is famous
 */
export function useIsVerseFamous(verseId: string | undefined) {
  return useQuery({
    queryKey: ['is-famous', verseId],
    queryFn: async () => {
      if (!verseId) return false;

      const { data, error } = await (supabase.rpc as any)('is_verse_famous', { p_verse_id: verseId });

      if (error) {
        console.error('Error checking if verse is famous:', error);
        return false;
      }

      return data as boolean;
    },
    enabled: !!verseId,
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Get adjacent famous verses for navigation
 */
export function useAdjacentFamousVerses(
  verseId: string | undefined,
  bookSlug: string | undefined
) {
  return useQuery({
    queryKey: ['adjacent-famous', verseId, bookSlug],
    queryFn: async () => {
      if (!verseId || !bookSlug) return null;

      const { data, error } = await (supabase.rpc as any)('get_adjacent_famous_verses', {
        p_verse_id: verseId,
        p_book_slug: bookSlug,
      });

      if (error) {
        console.error('Error fetching adjacent famous verses:', error);
        return null;
      }

      // RPC returns array, get first item
      const result = Array.isArray(data) ? data[0] : data;
      return result as AdjacentFamousVerses | null;
    },
    enabled: !!verseId && !!bookSlug,
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Get famous verse IDs set for quick lookup
 */
export function useFamousVerseIds(bookSlug: string | undefined) {
  const { data: famousVerses } = useFamousVersesForBook(bookSlug);

  const famousVerseIds = new Set(
    famousVerses?.map((v) => v.verse_id) || []
  );

  return famousVerseIds;
}
