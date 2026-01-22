/**
 * useSanskritLexicon - Hook for looking up words in the DCS Sanskrit lexicon
 *
 * Provides lookup functions for the Digital Corpus of Sanskrit dictionary.
 * Can be used standalone or in combination with useSanskritTerms for enhanced
 * term information in TermHighlighter.
 */

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LexiconEntry {
  id: number;
  word: string;
  word_devanagari: string | null;
  grammar: string | null;
  preverbs: string | null;
  meanings: string | null;
}

// Grammar labels for display
export const GRAMMAR_LABELS: Record<string, { ua: string; en: string }> = {
  m: { ua: "чол.", en: "m." },
  f: { ua: "жін.", en: "f." },
  n: { ua: "сер.", en: "n." },
  adj: { ua: "прикм.", en: "adj." },
  ind: { ua: "незм.", en: "ind." },
  "1. P.": { ua: "дієсл.", en: "v." },
  "1. Ā.": { ua: "дієсл.", en: "v." },
  "4. P.": { ua: "дієсл.", en: "v." },
  "6. P.": { ua: "дієсл.", en: "v." },
  "10. P.": { ua: "дієсл.", en: "v." },
};

/**
 * Normalize a word for lexicon search
 * Removes diacritics and converts to lowercase for matching
 */
export function normalizeLexiconWord(word: string): string {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
    .replace(/[āàáâãäå]/g, "a")
    .replace(/[īìíîï]/g, "i")
    .replace(/[ūùúûü]/g, "u")
    .replace(/[ṛṝ]/g, "r")
    .replace(/[ḷḹ]/g, "l")
    .replace(/[ṃṁ]/g, "m")
    .replace(/[ḥ]/g, "h")
    .replace(/[ṅṇñ]/g, "n")
    .replace(/[ṭ]/g, "t")
    .replace(/[ḍ]/g, "d")
    .replace(/[śṣ]/g, "s")
    // Ukrainian transliteration to Latin
    .replace(/[а]/g, "a")
    .replace(/[і]/g, "i")
    .replace(/[у]/g, "u")
    .replace(/[е]/g, "e")
    .replace(/[о]/g, "o")
    .replace(/[й]/g, "y")
    .replace(/[р]/g, "r")
    .replace(/[л]/g, "l")
    .replace(/[м]/g, "m")
    .replace(/[н]/g, "n")
    .replace(/[т]/g, "t")
    .replace(/[д]/g, "d")
    .replace(/[ш]/g, "s")
    .replace(/[с]/g, "s")
    .replace(/[к]/g, "k")
    .replace(/[г]/g, "g")
    .replace(/[х]/g, "h")
    .replace(/[б]/g, "b")
    .replace(/[п]/g, "p")
    .replace(/[в]/g, "v")
    .replace(/[ч]/g, "c")
    .replace(/[дж]/g, "j")
    .replace(/[ґ]/g, "g");
}

interface UseSanskritLexiconOptions {
  /** Enable/disable the hook */
  enabled?: boolean;
  /** Cache time in ms */
  staleTimeMs?: number;
}

export const useSanskritLexicon = (opts: UseSanskritLexiconOptions = {}) => {
  const { enabled = true, staleTimeMs = 10 * 60 * 1000 } = opts;

  // Check if lexicon table exists and has data
  const { data: lexiconAvailable, isLoading: checkingAvailability } = useQuery({
    queryKey: ["sanskrit-lexicon-available"],
    staleTime: staleTimeMs,
    enabled,
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from("sanskrit_lexicon")
          .select("*", { count: "exact", head: true });
        if (error) return false;
        return (count || 0) > 0;
      } catch {
        return false;
      }
    },
  });

  /**
   * Look up a word in the lexicon
   */
  const lookupWord = useCallback(
    async (word: string): Promise<LexiconEntry[]> => {
      if (!lexiconAvailable) return [];

      try {
        const { data, error } = await supabase.rpc("search_sanskrit_lexicon", {
          search_term: word,
          search_mode: "contains",
          grammar_filter: null,
          result_limit: 5,
        });

        if (error) {
          console.warn("Lexicon lookup error:", error);
          return [];
        }

        return (data as LexiconEntry[]) || [];
      } catch (e) {
        console.warn("Lexicon lookup failed:", e);
        return [];
      }
    },
    [lexiconAvailable]
  );

  /**
   * Get grammar label for display
   */
  const getGrammarLabel = useCallback(
    (grammar: string | null, language: "uk" | "en"): string | null => {
      if (!grammar) return null;
      const label = GRAMMAR_LABELS[grammar];
      return label ? label[language] : grammar;
    },
    []
  );

  /**
   * Get link to dictionary page for a word
   */
  const getDictionaryLink = useCallback(
    (word: string): string => `/tools/dictionary?search=${encodeURIComponent(word)}`,
    []
  );

  return {
    lexiconAvailable: lexiconAvailable ?? false,
    isLoading: checkingAvailability,
    lookupWord,
    getGrammarLabel,
    getDictionaryLink,
  };
};

export default useSanskritLexicon;
