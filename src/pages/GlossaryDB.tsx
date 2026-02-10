import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Search, Loader2, ChevronDown, ChevronRight, Plus } from "lucide-react";
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
    } catch {}
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

  const { lookupWord, lexiconAvailable, getGrammarLabel, getDictionaryLink } = useSanskritLexicon();
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

  const debouncedSetSearch = useCallback(
    debounce((term: string) => setDebouncedSearchTerm(term), 400),
    [],
  );

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

  // Auto-fetch details for visible single-usage terms (only first 5, lazy)
  useEffect(() => {
    if (!allGroupedTerms.length) return;
    const singleUsageTerms = allGroupedTerms.filter(
      (t) => t.usage_count === 1 && !expandedTermDetails[t.term] && !loadingTerms.has(t.term)
    );

    // Fetch only first 5 to avoid performance issues
    const batch = singleUsageTerms.slice(0, 5);
    if (batch.length === 0) return;

    batch.forEach(async (term) => {
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
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedData?.pages.length]);

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
                /* ===== MOBILE: compact word list ===== */
                <>
                  <div className="divide-y divide-border">
                    {allGroupedTerms.map((groupedTerm) => {
                      const singleUsageDetails = groupedTerm.usage_count === 1 ? expandedTermDetails[groupedTerm.term]?.[0] : null;
                      const isMultiUsage = groupedTerm.usage_count > 1;
                      const isExpanded = expandedTerms.has(groupedTerm.term);

                      return (
                        <div key={groupedTerm.term} className="py-2">
                          {/* Single usage — tap to go to verse */}
                          {singleUsageDetails ? (
                            <Link
                              to={getLocalizedPath(singleUsageDetails.verse_link)}
                              className="flex items-baseline justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <span className="font-semibold italic text-foreground">{groupedTerm.term}</span>
                                {(singleUsageDetails.meaning || groupedTerm.sample_meanings?.[0]) && (
                                  <span className="text-muted-foreground text-sm italic"> — {singleUsageDetails.meaning || groupedTerm.sample_meanings?.[0]}</span>
                                )}
                              </div>
                              <span className="text-primary text-xs font-medium whitespace-nowrap shrink-0">
                                {formatVerseRef(singleUsageDetails)}
                              </span>
                            </Link>
                          ) : (
                            <>
                              <div
                                className={`flex items-baseline justify-between gap-2 ${isMultiUsage ? "cursor-pointer" : ""}`}
                                onClick={isMultiUsage ? () => toggleTermExpanded(groupedTerm.term) : undefined}
                              >
                                <div className="min-w-0">
                                  <span className="font-semibold italic text-foreground">{groupedTerm.term}</span>
                                  {!isMultiUsage && groupedTerm.sample_meanings?.[0] && (
                                    <span className="text-muted-foreground text-sm italic"> — {groupedTerm.sample_meanings[0]}</span>
                                  )}
                                </div>
                                {isMultiUsage && (
                                  <span className="text-muted-foreground text-xs whitespace-nowrap shrink-0 flex items-center gap-0.5">
                                    ({groupedTerm.usage_count})
                                    <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                  </span>
                                )}
                              </div>
                              {/* Expanded usages */}
                              {isMultiUsage && isExpanded && (
                                <div className="ml-3 mt-1 space-y-1">
                                  {loadingTerms.has(groupedTerm.term) ? (
                                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                  ) : expandedTermDetails[groupedTerm.term]?.map((item, idx) => (
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
                                </div>
                              )}
                            </>
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
                /* ===== DESKTOP: full Vedabase-style ===== */
                <>
                  {allGroupedTerms.map((groupedTerm) => {
                    const singleUsageDetails = groupedTerm.usage_count === 1 ? expandedTermDetails[groupedTerm.term]?.[0] : null;
                    const isMultiUsage = groupedTerm.usage_count > 1;
                    const isExpanded = expandedTerms.has(groupedTerm.term);

                    return (
                      <div key={groupedTerm.term} className="mb-6">
                        {/* Single usage with details — entire block is a link */}
                        {singleUsageDetails ? (
                          <Link
                            to={getLocalizedPath(singleUsageDetails.verse_link)}
                            className="block hover:bg-muted/30 rounded-lg px-2 -mx-2 py-1 transition-colors group"
                          >
                            <div className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {groupedTerm.term}
                            </div>
                            <div className="pl-8 mt-1">
                              <span className="text-foreground">{singleUsageDetails.meaning || groupedTerm.sample_meanings?.[0] || "—"}</span>
                              <span className="text-muted-foreground"> — </span>
                              <span className="text-primary font-medium">
                                {formatVerseRef(singleUsageDetails)}
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <>
                            {/* Term — bold, large */}
                            <div
                              className={`text-xl font-bold text-foreground ${isMultiUsage ? "cursor-pointer hover:text-primary transition-colors" : ""}`}
                              onClick={isMultiUsage ? () => toggleTermExpanded(groupedTerm.term) : undefined}
                            >
                              {groupedTerm.term}
                              {isMultiUsage && (
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                  ({groupedTerm.usage_count})
                                  <ChevronDown className={`inline h-4 w-4 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                </span>
                              )}
                            </div>

                            {/* Single usage without details yet */}
                            {!isMultiUsage && loadingTerms.has(groupedTerm.term) ? (
                              <div className="pl-8 mt-1">
                                <span className="text-muted-foreground">{groupedTerm.sample_meanings?.[0] || "..."}</span>
                              </div>
                            ) : !isMultiUsage ? (
                              <div className="pl-8 mt-1">
                                <span className="text-foreground">{groupedTerm.sample_meanings?.[0] || "—"}</span>
                              </div>
                            ) : null}
                          </>
                        )}

                        {/* Multi usage — collapsed: show sample meanings */}
                        {isMultiUsage && !isExpanded && (
                          <div className="pl-8 mt-1">
                            <span className="text-muted-foreground">
                              {groupedTerm.sample_meanings?.slice(0, 3).join("; ") || "—"}
                            </span>
                          </div>
                        )}

                        {/* Multi usage — expanded: show all details */}
                        {isMultiUsage && isExpanded && (
                          <div className="pl-8 mt-2 space-y-1">
                            {loadingTerms.has(groupedTerm.term) ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : expandedTermDetails[groupedTerm.term] ? (
                              <>
                                {/* Etymology */}
                                {lexiconAvailable && etymologyData[groupedTerm.term]?.length > 0 && (
                                  <div className="text-sm text-muted-foreground pb-2">
                                    {etymologyData[groupedTerm.term].slice(0, 1).map((entry, i) => (
                                      <span key={i}>
                                        {entry.word_devanagari && <span className="mr-2">{entry.word_devanagari}</span>}
                                        {entry.grammar && <span className="text-xs mr-2">({getGrammarLabel(entry.grammar, language as "uk" | "en") || entry.grammar})</span>}
                                        {entry.meanings && <span className="text-foreground/70">{entry.meanings}</span>}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {/* Each usage */}
                                {expandedTermDetails[groupedTerm.term].map((item, idx) => (
                                  <div key={idx} className="py-0.5">
                                    <span className="text-foreground">{item.meaning || "—"}</span>
                                    <span className="text-muted-foreground"> — </span>
                                    <Link
                                      to={getLocalizedPath(item.verse_link)}
                                      className="text-primary hover:underline font-medium"
                                    >
                                      {formatVerseRef(item)}
                                    </Link>
                                  </div>
                                ))}
                              </>
                            ) : null}
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
