import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { extractAllTerms, normalizeSanskritText, GlossaryTerm } from "@/utils/glossaryParser";

type VerseRow = {
  id: string;
  verse_number: string;
  synonyms_ua: string | null;
  synonyms_en: string | null;
  chapters: {
    chapter_number: number;
    title_en: string | null;
    title_ua: string | null;
    books: { title_en: string | null; title_ua: string | null; slug: string } | null;
    cantos: {
      canto_number: number;
      title_en: string | null;
      title_ua: string | null;
      books: { title_en: string | null; title_ua: string | null; slug: string } | null;
    } | null;
  };
};

type Options = {
  /** опційно — обмежити за конкретною книгою */
  bookSlug?: string;
  /** опційно — обмежити за конкретною піснею */
  cantoNumber?: number;
  /** час кешу react-query */
  staleTimeMs?: number;
};

export const useSanskritTerms = (opts: Options = {}) => {
  const { bookSlug, cantoNumber, staleTimeMs = 5 * 60 * 1000 } = opts;

  const { data, isLoading, error } = useQuery({
    queryKey: ["verses-for-glossary", bookSlug, cantoNumber],
    staleTime: staleTimeMs,
    queryFn: async (): Promise<VerseRow[]> => {
      // Беріть тільки те, що реально потрібно
      let q = supabase
        .from("verses")
        .select(
          `
          id,
          verse_number,
          synonyms_ua,
          synonyms_en,
          chapters!inner(
            chapter_number,
            title_en,
            title_ua,
            books(
              title_en,
              title_ua,
              slug
            ),
            cantos(
              canto_number,
              title_en,
              title_ua,
              books(
                title_en,
                title_ua,
                slug
              )
            )
          )
        `,
        )
        // Упорядкуємо за книгою/піснею/главою/віршем — стабільний порядок
        .order("canto_number", { ascending: true, foreignTable: "chapters.cantos" })
        .order("chapter_number", { ascending: true, foreignTable: "chapters" })
        .order("verse_number", { ascending: true });

      if (bookSlug) {
        // якщо є canto — фільтруємо через cantos.books.slug, інакше — через chapters.books.slug
        q = q.or(`chapters.cantos.books.slug.eq.${bookSlug},chapters.books.slug.eq.${bookSlug}`);
      }

      if (typeof cantoNumber === "number") {
        q = q.eq("chapters.cantos.canto_number", cantoNumber);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as VerseRow[];
    },
  });

  // Зведений масив віршів, уже з "book" та "synonyms" та "verseLink"
  const verses = useMemo(() => {
    if (!data) return [];
    return data.map((verse) => {
      const bookNode = verse.chapters.cantos?.books || verse.chapters.books;
      const bookSlug = bookNode?.slug;
      const cantoNumber = verse.chapters.cantos?.canto_number;
      const chapterNumber = verse.chapters.chapter_number;

      // Build verseLink based on book structure (must match App.tsx routes)
      let verseLink = "";
      if (cantoNumber) {
        // Srimad-Bhagavatam structure with cantos
        verseLink = `/veda-reader/${bookSlug}/canto/${cantoNumber}/chapter/${chapterNumber}/${verse.verse_number}`;
      } else if (bookSlug && chapterNumber) {
        // Direct book-chapter structure
        verseLink = `/veda-reader/${bookSlug}/${chapterNumber}/${verse.verse_number}`;
      }

      return {
        ...verse,
        book: bookNode?.title_uk || bookNode?.title_en || "",
        book_slug: bookSlug,
        synonyms: verse.synonyms_uk || verse.synonyms_en || "",
        verseLink,
      };
    });
  }, [data]);

  const allTerms = useMemo<GlossaryTerm[]>(() => {
    if (!verses.length) return [];
    return extractAllTerms(verses);
  }, [verses]);

  const termMap = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const term of allTerms) {
      const key = normalizeSanskritText(term.term);
      const arr = map.get(key);
      if (arr) arr.push(term);
      else map.set(key, [term]);
    }
    return map;
  }, [allTerms]);

  const isTermPresent = useCallback((word: string): boolean => termMap.has(normalizeSanskritText(word)), [termMap]);

  const getTermData = useCallback(
    (word: string): GlossaryTerm[] => termMap.get(normalizeSanskritText(word)) || [],
    [termMap],
  );

  const getGlossaryLink = useCallback((word: string): string => `/glossary?search=${encodeURIComponent(word)}`, []);

  const getTermsMap = useCallback((): Record<string, boolean> => {
    const obj: Record<string, boolean> = {};
    termMap.forEach((_, key) => {
      obj[key] = true;
    });
    return obj;
  }, [termMap]);

  return {
    // дані
    allTerms,
    // утиліти
    isTermPresent,
    getTermData,
    getGlossaryLink,
    getTermsMap,
    // статуси
    isLoading,
    error,
  };
};
