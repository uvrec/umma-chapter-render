import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Search, Loader2, ChevronDown, ChevronRight, Plus, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { debounce } from "lodash";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addLearningWord, isWordInLearningList, LearningWord } from "@/utils/learningWords";
import { addSavedTerm, isTermVerseSaved, getSavedTerms, removeSavedTerm, SavedTerm } from "@/utils/savedTerms";
import { useSanskritLexicon, LexiconEntry } from "@/hooks/useSanskritLexicon";
import { useBengaliLexicon } from "@/hooks/useBengaliLexicon";

interface GlossaryTermResult {
  term: string;
  meaning: string;
  verse_id: string;
  verse_number: string;
  chapter_number: number;
  canto_number: number | null;
  book_title: string;
  book_slug: string;
  verse_link: string;
  total_count: number;
}

interface GlossaryStats {
  total_terms: number;
  unique_terms: number;
  books_count: number;
  book_stats: Array<{
    slug: string;
    title: string;
    total: number;
    unique: number;
  }>;
}

interface GroupedTermResult {
  term: string;
  usage_count: number;
  books: string[];
  sample_meanings: string[];
  total_unique_terms: number;
}

const PAGE_SIZE = 30;

export default function GlossaryDB() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t, getLocalizedPath } = useLanguage();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [searchType, setSearchType] = useState<"exact" | "contains" | "starts">("contains");
  const [translation, setTranslation] = useState("");
  const [debouncedTranslation, setDebouncedTranslation] = useState("");
  const [selectedBook, setSelectedBook] = useState<string>("all");
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const [savedTermsState, setSavedTermsState] = useState<SavedTerm[]>(() => getSavedTerms());
  const [learningWordsSet, setLearningWordsSet] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("scriptLearning_importedWords");
      if (stored) {
        const words = JSON.parse(stored) as LearningWord[];
        return new Set(words.map((w) => w.iast.toLowerCase()));
      }
    } catch {
      // ignore
    }
    return new Set();
  });

  const handleAddToLearning = (item: GlossaryTermResult) => {
    const word: LearningWord = {
      script: "",
      iast: item.term,
      ukrainian: item.meaning,
      meaning: item.meaning,
      book: item.book_title,
      verseReference: item.verse_link,
      addedAt: Date.now(),
    };

    const added = addLearningWord(word);
    if (added) {
      setLearningWordsSet((prev) => new Set(prev).add(item.term.toLowerCase()));
      toast.success(t("Додано до вивчення", "Added to learning"));
    } else {
      toast.info(t("Вже у списку вивчення", "Already in learning list"));
    }
  };

  const handleSaveTerm = (item: GlossaryTermResult) => {
    const isSaved = isTermVerseSaved(item.term, item.verse_link);

    if (isSaved) {
      const saved = savedTermsState.find(
        (st) => st.term.toLowerCase() === item.term.toLowerCase() && st.verseLink === item.verse_link,
      );
      if (saved) {
        removeSavedTerm(saved.id);
        setSavedTermsState(getSavedTerms());
        toast.success(t("Видалено зі збережених", "Removed from saved"));
      }
    } else {
      const newTerm = addSavedTerm({
        term: item.term,
        meaning: item.meaning,
        bookSlug: item.book_slug,
        bookTitle: item.book_title,
        verseNumber: item.verse_number,
        chapterNumber: item.chapter_number,
        cantoNumber: item.canto_number ?? undefined,
        verseLink: item.verse_link,
      });

      if (newTerm) {
        setSavedTermsState(getSavedTerms());
        toast.success(t("Збережено", "Saved"));
      }
    }
  };

  const isInLearning = (term: string) => learningWordsSet.has(term.toLowerCase());
  const isSaved = (term: string, verseLink: string) =>
    savedTermsState.some((st) => st.term.toLowerCase() === term.toLowerCase() && st.verseLink === verseLink);

  const { lookupWord, lexiconAvailable, getGrammarLabel, getDictionaryLink: getSanskritDictLink } = useSanskritLexicon();
  const { lexiconAvailable: bengaliAvailable, getDictionaryLink: getBengaliDictLink } = useBengaliLexicon();
  const [etymologyData, setEtymologyData] = useState<Record<string, LexiconEntry[]>>({});
  const [loadingEtymology, setLoadingEtymology] = useState<Set<string>>(new Set());

  const fetchEtymology = useCallback(
    async (term: string) => {
      if (!lexiconAvailable || etymologyData[term] || loadingEtymology.has(term)) return;

      setLoadingEtymology((prev) => new Set(prev).add(term));
      try {
        const results = await lookupWord(term);
        setEtymologyData((prev) => ({ ...prev, [term]: results }));
      } finally {
        setLoadingEtymology((prev) => {
          const next = new Set(prev);
          next.delete(term);
          return next;
        });
      }
    },
    [lexiconAvailable, lookupWord, etymologyData, loadingEtymology],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((term: string) => setDebouncedSearchTerm(term), 400),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetTranslation = useCallback(
    debounce((term: string) => setDebouncedTranslation(term), 400),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    debouncedSetTranslation(translation);
  }, [translation, debouncedSetTranslation]);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
      setDebouncedSearchTerm(searchParam);
    }
  }, [searchParams]);

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["glossary-stats", language],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("get_glossary_stats", {
        search_language: language,
      });

      if (error) throw error;
      return data?.[0] as GlossaryStats | undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const hasSearch = debouncedSearchTerm || debouncedTranslation || selectedBook !== "all";
  const searchMode = searchType === "starts" ? "starts_with" : searchType;

  interface PageResult {
    terms: GroupedTermResult[];
    page: number;
    totalCount: number;
  }

  const {
    data: groupedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingGrouped,
    isError: isErrorGrouped,
  } = useInfiniteQuery<PageResult, Error>({
    queryKey: ["glossary-grouped", language, debouncedSearchTerm, debouncedTranslation, searchMode, selectedBook],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await (supabase as any).rpc("get_glossary_terms_grouped", {
        search_term: debouncedSearchTerm || null,
        search_translation: debouncedTranslation || null,
        search_language: language,
        search_mode: searchMode,
        book_filter: selectedBook !== "all" ? selectedBook : null,
        page_number: pageParam,
        page_size: PAGE_SIZE,
      });

      if (error) throw error;
      return {
        terms: (data || []) as GroupedTermResult[],
        page: pageParam as number,
        totalCount: data?.[0]?.total_unique_terms || 0,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, page) => acc + page.terms.length, 0);
      if (loadedCount < lastPage.totalCount) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!hasSearch,
  });

  const fetchTermDetails = async (termText: string) => {
    const { data, error } = await (supabase as any).rpc("get_glossary_term_details", {
      term_text: termText,
      search_language: language,
    });

    if (error) throw error;
    return data as GlossaryTermResult[];
  };

  const [expandedTermDetails, setExpandedTermDetails] = useState<Record<string, GlossaryTermResult[]>>({});
  const [loadingTerms, setLoadingTerms] = useState<Set<string>>(new Set());

  const toggleTermExpanded = async (term: string) => {
    const newExpanded = new Set(expandedTerms);

    if (newExpanded.has(term)) {
      newExpanded.delete(term);
    } else {
      newExpanded.add(term);

      if (!expandedTermDetails[term]) {
        setLoadingTerms((prev) => new Set(prev).add(term));
        try {
          const details = await fetchTermDetails(term);
          setExpandedTermDetails((prev) => ({ ...prev, [term]: details }));
        } finally {
          setLoadingTerms((prev) => {
            const next = new Set(prev);
            next.delete(term);
            return next;
          });
        }
      }

      fetchEtymology(term);
    }

    setExpandedTerms(newExpanded);
  };

  const allGroupedTerms = groupedData?.pages.flatMap((page) => page.terms) || [];
  const totalUniqueTerms = groupedData?.pages[0]?.totalCount || 0;

  // Auto-fetch details for all visible terms (batched to avoid overwhelming the server)
  useEffect(() => {
    if (!allGroupedTerms.length) return;
    const termsNeedingDetails = allGroupedTerms.filter(
      (t) => !expandedTermDetails[t.term] && !loadingTerms.has(t.term)
    );

    if (termsNeedingDetails.length === 0) return;

    // Fetch in batches of 10 with small delays between batches
    const fetchBatch = async (batch: GroupedTermResult[]) => {
      await Promise.all(
        batch.map(async (term) => {
          setLoadingTerms((prev) => new Set(prev).add(term.term));
          try {
            const details = await fetchTermDetails(term.term);
            setExpandedTermDetails((prev) => ({ ...prev, [term.term]: details }));
          } finally {
            setLoadingTerms((prev) => {
              const next = new Set(prev);
              next.delete(term.term);
              return next;
            });
          }
        })
      );
    };

    const BATCH_SIZE = 10;
    let cancelled = false;
    (async () => {
      for (let i = 0; i < termsNeedingDetails.length; i += BATCH_SIZE) {
        if (cancelled) break;
        await fetchBatch(termsNeedingDetails.slice(i, i + BATCH_SIZE));
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedData?.pages.length]);

  // Auto-fetch etymology for visible terms (batched)
  useEffect(() => {
    if (!lexiconAvailable || !allGroupedTerms.length) return;
    const termsNeedingEtymology = allGroupedTerms.filter(
      (t) => !etymologyData[t.term] && !loadingEtymology.has(t.term)
    );
    if (termsNeedingEtymology.length === 0) return;

    let cancelled = false;
    (async () => {
      const BATCH = 10;
      for (let i = 0; i < termsNeedingEtymology.length; i += BATCH) {
        if (cancelled) break;
        await Promise.all(
          termsNeedingEtymology.slice(i, i + BATCH).map((t) => fetchEtymology(t.term))
        );
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedData?.pages.length, lexiconAvailable]);

  // Helper to detect if a term looks like Bengali (contains Bengali Unicode)
  const isBengaliTerm = (term: string) => /[\u0980-\u09FF]/.test(term);

  const handleSearch = () => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    }
  };

  // Format verse reference like Vedabase: "ŚB 11.19.1"
  const formatVerseRef = (item: GlossaryTermResult) => {
    const bookAbbr = item.book_slug === "sb" ? "ŚB"
      : item.book_slug === "bg" ? "BG"
      : item.book_slug === "cc" ? "CC"
      : item.book_slug === "noi" ? "NoI"
      : item.book_slug === "iso" ? "Śrī Īśo"
      : item.book_slug === "bs" ? "BS"
      : item.book_title;
    const ref = item.canto_number
      ? `${bookAbbr} ${item.canto_number}.${item.chapter_number}.${item.verse_number}`
      : `${bookAbbr} ${item.chapter_number}.${item.verse_number}`;
    return ref;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Search bar — Vedabase-style */}
        <div className="mb-8 border border-border rounded-lg p-4 bg-card">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 hidden sm:block">{t("Слово", "Word")}</label>
              <Input
                placeholder={t("Термін...", "Word...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exact">{t("Точне слово", "Exact Word")}</SelectItem>
                  <SelectItem value="contains">{t("Містить", "Contains")}</SelectItem>
                  <SelectItem value="starts">{t("Починається", "Starts with")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="hidden sm:block flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">{t("Переклад", "Translation")}</label>
              <Input
                placeholder={t("Переклад...", "Translation...")}
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="mt-3">
            <Button onClick={handleSearch} size="sm">
              <Search className="h-4 w-4 mr-2" />
              {t("Шукати", "Search")}
            </Button>
          </div>
        </div>

        {/* Two-column layout: Results + Hierarchy sidebar */}
        <div className="flex gap-8">
          {/* Main results column */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            {hasSearch && totalUniqueTerms > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                {t("Знайдено", "Found")} <span className="font-medium">{totalUniqueTerms}</span> {t("термінів", "terms")}
                {allGroupedTerms.length < totalUniqueTerms && (
                  <span className="text-muted-foreground/70">
                    {" "}({t("показано", "showing")} {allGroupedTerms.length})
                  </span>
                )}
              </p>
            )}

            {/* Results — Vedabase-style */}
            <div>
              {isLoadingStats || isLoadingGrouped ? (
                <div className="py-16 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                </div>
              ) : !hasSearch ? (
                <div className="py-4 sm:py-16 text-center text-muted-foreground">
                  <p className="hidden sm:block">{t("Введіть запит для пошуку", "Enter a search query")}</p>
                </div>
              ) : isErrorGrouped ? (
                <div className="py-16 text-center text-destructive">
                  <p>{t("Помилка завантаження", "Error loading")}</p>
                </div>
              ) : allGroupedTerms.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <p>{t("Нічого не знайдено", "Nothing found")}</p>
                </div>
              ) : isMobile ? (
                /* ===== MOBILE: compact word list with inline details ===== */
                <>
                  <div className="divide-y divide-border">
                    {allGroupedTerms.map((groupedTerm) => {
                      const details = expandedTermDetails[groupedTerm.term];
                      const isLoading = loadingTerms.has(groupedTerm.term);
                      const isMultiUsage = groupedTerm.usage_count > 1;
                      const isExpanded = expandedTerms.has(groupedTerm.term);
                      const INLINE_LIMIT_MOBILE = 2;
                      const hasMoreUsages = details && details.length > INLINE_LIMIT_MOBILE;

                      return (
                        <div key={groupedTerm.term} className="py-2">
                          {/* Term heading + dictionary links */}
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="min-w-0 flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-semibold italic text-foreground">{groupedTerm.term}</span>
                              {lexiconAvailable && !isBengaliTerm(groupedTerm.term) && (
                                <Link
                                  to={getLocalizedPath(getSanskritDictLink(groupedTerm.term))}
                                  className="text-muted-foreground hover:text-primary"
                                  title="Skt"
                                >
                                  <BookOpen className="h-3 w-3" />
                                </Link>
                              )}
                              {bengaliAvailable && isBengaliTerm(groupedTerm.term) && (
                                <Link
                                  to={getLocalizedPath(getBengaliDictLink(groupedTerm.term))}
                                  className="text-muted-foreground hover:text-primary"
                                  title="Bn"
                                >
                                  <BookOpen className="h-3 w-3" />
                                </Link>
                              )}
                            </div>
                            {isMultiUsage && (
                              <span className="text-muted-foreground text-xs whitespace-nowrap shrink-0">
                                ({groupedTerm.usage_count})
                              </span>
                            )}
                          </div>

                          {/* Loading */}
                          {isLoading && !details && (
                            <div className="ml-3 mt-1">
                              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                            </div>
                          )}

                          {/* Usages with meaning + verse reference */}
                          {details && (
                            <div className="ml-3 mt-1 space-y-0.5">
                              {(isExpanded ? details : details.slice(0, INLINE_LIMIT_MOBILE)).map((item, idx) => (
                                <Link
                                  key={idx}
                                  to={getLocalizedPath(item.verse_link)}
                                  className="flex items-baseline justify-between gap-2 text-sm"
                                >
                                  <span className="text-foreground italic min-w-0">{item.meaning || "—"}</span>
                                  <span className="text-primary text-xs font-medium whitespace-nowrap shrink-0">
                                    {formatVerseRef(item)}
                                  </span>
                                </Link>
                              ))}
                              {hasMoreUsages && (
                                <button
                                  onClick={() => toggleTermExpanded(groupedTerm.term)}
                                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5"
                                >
                                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                  {isExpanded
                                    ? t("Згорнути", "Collapse")
                                    : t(`Ще ${details.length - INLINE_LIMIT_MOBILE}`, `${details.length - INLINE_LIMIT_MOBILE} more`)}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Fallback */}
                          {!details && !isLoading && groupedTerm.sample_meanings?.[0] && (
                            <div className="ml-3 mt-0.5">
                              <span className="text-muted-foreground text-sm italic">{groupedTerm.sample_meanings[0]}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {hasNextPage && (
                    <div className="pt-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="gap-1">
                        {isFetchingNextPage ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        {t("Ще", "More")}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                /* ===== DESKTOP: show all details inline ===== */
                <>
                  {allGroupedTerms.map((groupedTerm) => {
                    const details = expandedTermDetails[groupedTerm.term];
                    const isLoading = loadingTerms.has(groupedTerm.term);
                    const isMultiUsage = groupedTerm.usage_count > 1;
                    const isExpanded = expandedTerms.has(groupedTerm.term);
                    const INLINE_LIMIT = 3;
                    const hasMoreUsages = details && details.length > INLINE_LIMIT;

                    return (
                      <div key={groupedTerm.term} className="mb-6">
                        {/* Term heading + dictionary links */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xl font-bold text-foreground">
                            {groupedTerm.term}
                          </span>
                          {isMultiUsage && (
                            <span className="text-sm font-normal text-muted-foreground">
                              ({groupedTerm.usage_count})
                            </span>
                          )}
                          {/* Dictionary links */}
                          <span className="flex items-center gap-1.5 ml-1">
                            {lexiconAvailable && !isBengaliTerm(groupedTerm.term) && (
                              <Link
                                to={getLocalizedPath(getSanskritDictLink(groupedTerm.term))}
                                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                title={t("Санскритський словник", "Sanskrit Dictionary")}
                              >
                                <BookOpen className="h-3 w-3" />
                                <span>Skt</span>
                              </Link>
                            )}
                            {bengaliAvailable && isBengaliTerm(groupedTerm.term) && (
                              <Link
                                to={getLocalizedPath(getBengaliDictLink(groupedTerm.term))}
                                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                title={t("Бенгальський словник", "Bengali Dictionary")}
                              >
                                <BookOpen className="h-3 w-3" />
                                <span>Bn</span>
                              </Link>
                            )}
                          </span>
                        </div>

                        {/* Etymology from Sanskrit lexicon */}
                        {lexiconAvailable && etymologyData[groupedTerm.term]?.length > 0 && (
                          <div className="pl-8 mt-1 text-sm text-muted-foreground">
                            {etymologyData[groupedTerm.term].slice(0, 1).map((entry, i) => (
                              <span key={i}>
                                {entry.word_devanagari && <span className="mr-2">{entry.word_devanagari}</span>}
                                {entry.grammar && <span className="text-xs mr-2">({getGrammarLabel(entry.grammar, language as "uk" | "en") || entry.grammar})</span>}
                                {entry.meanings && <span className="text-foreground/70">{entry.meanings}</span>}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Loading state */}
                        {isLoading && !details && (
                          <div className="pl-8 mt-1">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground inline" />
                          </div>
                        )}

                        {/* Usages with meaning + verse reference — always visible */}
                        {details && (
                          <div className="pl-8 mt-1 space-y-0.5">
                            {(isExpanded ? details : details.slice(0, INLINE_LIMIT)).map((item, idx) => (
                              <div key={idx} className="py-0.5 flex items-baseline gap-1 flex-wrap">
                                <span className="text-foreground">{item.meaning || "—"}</span>
                                <span className="text-muted-foreground">—</span>
                                <Link
                                  to={getLocalizedPath(item.verse_link)}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {formatVerseRef(item)}
                                </Link>
                                <button
                                  onClick={(e) => { e.preventDefault(); handleSaveTerm(item); }}
                                  className={`ml-1 text-xs px-1.5 py-0.5 rounded transition-colors ${
                                    isSaved(item.term, item.verse_link)
                                      ? "text-primary bg-primary/10"
                                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                  }`}
                                  title={t("Зберегти", "Save")}
                                >
                                  {isSaved(item.term, item.verse_link) ? "★" : "☆"}
                                </button>
                                {!isInLearning(item.term) && (
                                  <button
                                    onClick={(e) => { e.preventDefault(); handleAddToLearning(item); }}
                                    className="text-xs text-muted-foreground hover:text-primary px-1"
                                    title={t("Додати до вивчення", "Add to learning")}
                                  >
                                    +
                                  </button>
                                )}
                              </div>
                            ))}
                            {/* Show more / collapse toggle */}
                            {hasMoreUsages && (
                              <button
                                onClick={() => toggleTermExpanded(groupedTerm.term)}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 pt-1"
                              >
                                <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                {isExpanded
                                  ? t("Згорнути", "Collapse")
                                  : t(`Ще ${details.length - INLINE_LIMIT}`, `${details.length - INLINE_LIMIT} more`)}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Fallback if details not loaded yet and not loading */}
                        {!details && !isLoading && (
                          <div className="pl-8 mt-1">
                            <span className="text-muted-foreground">
                              {groupedTerm.sample_meanings?.filter(Boolean).slice(0, 3).join("; ") || "—"}
                              {groupedTerm.books?.length > 0 && (
                                <span className="ml-2 text-xs">({groupedTerm.books.join(", ")})</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Load more */}
                  {hasNextPage && (
                    <div className="pt-4 text-center">
                      <Button
                        variant="ghost"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="gap-2"
                      >
                        {isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        {t("Ще", "More")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Hierarchy sidebar — desktop only */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20">
              <div className="rounded-lg overflow-hidden border border-border">
                <div className="bg-primary/90 text-primary-foreground px-4 py-3 font-semibold">
                  {t("Ієрархія", "Hierarchy")}
                </div>
                <div className="divide-y divide-border">
                  {isLoadingStats ? (
                    <div className="px-4 py-3 text-center">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
                    </div>
                  ) : statsData?.book_stats?.map((book) => (
                    <button
                      key={book.slug}
                      onClick={() => setSelectedBook(selectedBook === book.slug ? "all" : book.slug)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 text-left ${
                        selectedBook === book.slug ? "bg-primary/10 font-medium" : ""
                      }`}
                    >
                      <span className="text-foreground">{book.title}</span>
                      <span className="text-muted-foreground">({book.unique})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile book filter — removed for clean mobile experience */}
      </div>
    </div>
  );
}
