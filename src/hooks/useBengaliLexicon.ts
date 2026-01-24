/**
 * useBengaliLexicon - Hook for looking up words in the Bengali lexicon
 *
 * Provides lookup functions for the English-Bengali dictionary.
 */

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BengaliLexiconEntry {
  id: number;
  word_en: string;
  word_bn: string;
}

interface UseBengaliLexiconOptions {
  /** Enable/disable the hook */
  enabled?: boolean;
  /** Cache time in ms */
  staleTimeMs?: number;
}

export const useBengaliLexicon = (opts: UseBengaliLexiconOptions = {}) => {
  const { enabled = true, staleTimeMs = 10 * 60 * 1000 } = opts;

  // Check if lexicon table exists and has data
  const { data: lexiconAvailable, isLoading: checkingAvailability } = useQuery({
    queryKey: ["bengali-lexicon-available"],
    staleTime: staleTimeMs,
    enabled,
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from("bengali_lexicon")
          .select("*", { count: "exact", head: true });
        if (error) return false;
        return (count || 0) > 0;
      } catch {
        return false;
      }
    },
  });

  /**
   * Look up an English word in the lexicon
   */
  const lookupWord = useCallback(
    async (word: string): Promise<BengaliLexiconEntry[]> => {
      if (!lexiconAvailable) return [];

      try {
        const { data, error } = await supabase.rpc("search_bengali_lexicon", {
          search_term: word,
          search_mode: "contains",
          result_limit: 5,
        });

        if (error) {
          console.warn("Bengali lexicon lookup error:", error);
          return [];
        }

        return (data as BengaliLexiconEntry[]) || [];
      } catch (e) {
        console.warn("Bengali lexicon lookup failed:", e);
        return [];
      }
    },
    [lexiconAvailable]
  );

  /**
   * Look up a Bengali word
   */
  const lookupBengaliWord = useCallback(
    async (word: string): Promise<BengaliLexiconEntry[]> => {
      if (!lexiconAvailable) return [];

      try {
        const { data, error } = await supabase.rpc("search_bengali_by_bengali", {
          search_term: word,
          result_limit: 5,
        });

        if (error) {
          console.warn("Bengali lookup error:", error);
          return [];
        }

        return (data as BengaliLexiconEntry[]) || [];
      } catch (e) {
        console.warn("Bengali lookup failed:", e);
        return [];
      }
    },
    [lexiconAvailable]
  );

  /**
   * Get link to dictionary page for a word
   */
  const getDictionaryLink = useCallback(
    (word: string): string => `/tools/bengali-dictionary?search=${encodeURIComponent(word)}`,
    []
  );

  return {
    lexiconAvailable: lexiconAvailable ?? false,
    isLoading: checkingAvailability,
    lookupWord,
    lookupBengaliWord,
    getDictionaryLink,
  };
};

export default useBengaliLexicon;
