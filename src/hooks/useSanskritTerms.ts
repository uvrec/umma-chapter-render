import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { extractAllTerms, normalizeSanskritText, GlossaryTerm } from "@/utils/glossaryParser";

export const useSanskritTerms = () => {
  const { data: verses } = useQuery({
    queryKey: ["verses-for-glossary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verses")
        .select(`
          *,
          chapters (
            chapter_number,
            title_en,
            title_ua,
            books (
              title_en,
              title_ua,
              slug
            ),
            cantos (
              canto_number,
              title_en,
              title_ua
            )
          )
        `)
        .order("verse_number");

      if (error) throw error;
      
      // Transform data to match expected format for glossary parser
      return data.map(verse => ({
        ...verse,
        book: verse.chapters?.books?.title_ua || verse.chapters?.books?.title_en || '',
        synonyms: verse.synonyms_ua || verse.synonyms_en || ''
      }));
    },
  });

  const allTerms = verses ? extractAllTerms(verses) : [];

  // Create a map for fast term lookup (normalized term -> original terms)
  const termMap = new Map<string, GlossaryTerm[]>();
  allTerms.forEach((term) => {
    const normalized = normalizeSanskritText(term.term);
    if (!termMap.has(normalized)) {
      termMap.set(normalized, []);
    }
    termMap.get(normalized)?.push(term);
  });

  const isTermPresent = (word: string): boolean => {
    const normalized = normalizeSanskritText(word);
    return termMap.has(normalized);
  };

  const getTermData = (word: string): GlossaryTerm[] => {
    const normalized = normalizeSanskritText(word);
    return termMap.get(normalized) || [];
  };

  const getGlossaryLink = (word: string): string => {
    return `/glossary?search=${encodeURIComponent(word)}`;
  };

  const getTermsMap = (): { [normalizedTerm: string]: boolean } => {
    const map: { [normalizedTerm: string]: boolean } = {};
    termMap.forEach((_, key) => {
      map[key] = true;
    });
    return map;
  };

  return {
    allTerms,
    isTermPresent,
    getTermData,
    getGlossaryLink,
    getTermsMap,
    isLoading: !verses,
  };
};
