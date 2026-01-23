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

  // Auto-fetch details for single-usage terms
  useEffect(() => {
    const singleUsageTerms = allGroupedTerms.filter(
      (t) => t.usage_count === 1 && !expandedTermDetails[t.term] && !loadingTerms.has(t.term)
    );

    singleUsageTerms.slice(0, 20).forEach(async (term) => {
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
  }, [allGroupedTerms]);

  const handleSearch = () => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Search bar - horizontal */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Input
              placeholder={t("Термін (санскрит)...", "Term (Sanskrit)...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Input
              placeholder={t("Переклад...", "Translation...")}
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">{t("Містить", "Contains")}</SelectItem>
                <SelectItem value="exact">{t("Точний", "Exact")}</SelectItem>
                <SelectItem value="starts">{t("Починається", "Starts with")}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              {t("Шукати", "Search")}
            </Button>
          </div>

          {/* Filter by book - horizontal pills */}
          {!isLoadingStats && statsData?.book_stats && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedBook("all")}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedBook === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {t("Всі", "All")} ({statsData?.unique_terms || 0})
              </button>
              {statsData?.book_stats?.map((book) => (
                <button
                  key={book.slug}
                  onClick={() => setSelectedBook(book.slug)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedBook === book.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {book.title} ({book.unique})
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          {hasSearch && totalUniqueTerms > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {t("Знайдено", "Found")} <span className="font-medium">{totalUniqueTerms}</span> {t("термінів", "terms")}
              {allGroupedTerms.length < totalUniqueTerms && (
                <span className="text-muted-foreground/70">
                  {" "}
                  ({t("показано", "showing")} {allGroupedTerms.length})
                </span>
              )}
            </p>
          )}

          {/* Results */}
          <div className="space-y-1">
            {isLoadingStats || isLoadingGrouped ? (
              <div className="py-16 text-center text-muted-foreground">
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              </div>
            ) : !hasSearch ? (
              <div className="py-16 text-center text-muted-foreground">
                <p>{t("Введіть запит для пошуку", "Enter a search query")}</p>
              </div>
            ) : isErrorGrouped ? (
              <div className="py-16 text-center text-destructive">
                <p>{t("Помилка завантаження", "Error loading")}</p>
              </div>
            ) : allGroupedTerms.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <p>{t("Нічого не знайдено", "Nothing found")}</p>
              </div>
            ) : (
              <>
                {allGroupedTerms.map((groupedTerm) => {
                  const singleUsageDetails = groupedTerm.usage_count === 1 ? expandedTermDetails[groupedTerm.term]?.[0] : null;
                  const isMultiUsage = groupedTerm.usage_count > 1;
                  const isLoading = loadingTerms.has(groupedTerm.term);

                  return (
                  <div key={groupedTerm.term}>
                    {/* Term row */}
                    {singleUsageDetails ? (
                      // Single usage - entire row is clickable link
                      <Link
                        to={getLocalizedPath(singleUsageDetails.verse_link)}
                        className="py-2.5 flex items-center justify-between text-left group hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-primary font-medium">{groupedTerm.term}</span>
                          <span className="text-muted-foreground mx-2">—</span>
                          <span className="text-foreground">{singleUsageDetails.meaning || groupedTerm.sample_meanings?.[0] || "—"}</span>
                        </div>
                        <div className="ml-4 text-sm text-muted-foreground group-hover:text-primary transition-colors shrink-0 flex items-center gap-2">
                          <span className="text-xs opacity-60">{singleUsageDetails.book_title}</span>
                          <span>
                            {singleUsageDetails.canto_number ? `${singleUsageDetails.canto_number}.` : ""}
                            {singleUsageDetails.chapter_number}.{singleUsageDetails.verse_number}
                          </span>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ) : (
                      // Multi usage or loading - expandable row
                      <button
                        onClick={() => toggleTermExpanded(groupedTerm.term)}
                        className="w-full py-2.5 flex items-center justify-between hover:bg-muted/30 transition-colors text-left rounded-lg px-2 -mx-2"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-primary font-medium">{groupedTerm.term}</span>
                          {groupedTerm.sample_meanings && groupedTerm.sample_meanings.length > 0 && (
                            <span className="text-muted-foreground ml-3">
                              {groupedTerm.sample_meanings.slice(0, 2).join("; ")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          ) : (
                            <>
                              {/* Show books where term appears */}
                              {groupedTerm.books && groupedTerm.books.length > 0 && (
                                <span className="text-xs text-muted-foreground/70">
                                  {groupedTerm.books.slice(0, 2).join(", ")}
                                  {groupedTerm.books.length > 2 && ` +${groupedTerm.books.length - 2}`}
                                </span>
                              )}
                              {isMultiUsage && (
                                <>
                                  <span className="text-xs text-muted-foreground font-medium">
                                    {groupedTerm.usage_count}
                                  </span>
                                  <ChevronDown
                                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                                      expandedTerms.has(groupedTerm.term) ? "rotate-180" : ""
                                    }`}
                                  />
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </button>
                    )}

                    {/* Expanded details - only for multi-usage terms */}
                    {isMultiUsage && expandedTerms.has(groupedTerm.term) && (
                      <div className="pb-3 pl-4 space-y-1">
                        {loadingTerms.has(groupedTerm.term) ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : expandedTermDetails[groupedTerm.term] ? (
                          <>
                            {/* Etymology - minimal */}
                            {lexiconAvailable && etymologyData[groupedTerm.term]?.length > 0 && (
                              <div className="text-sm text-muted-foreground pb-2 mb-2">
                                {etymologyData[groupedTerm.term].slice(0, 1).map((entry, i) => (
                                  <span key={i}>
                                    {entry.word_devanagari && <span className="mr-2">{entry.word_devanagari}</span>}
                                    {entry.grammar && <span className="text-xs mr-2">({getGrammarLabel(entry.grammar, language as "uk" | "en") || entry.grammar})</span>}
                                    {entry.meanings && <span className="text-foreground/70">{entry.meanings}</span>}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Verses list - clickable rows */}
                            {expandedTermDetails[groupedTerm.term].map((item, idx) => (
                              <Link
                                key={idx}
                                to={getLocalizedPath(item.verse_link)}
                                className="flex items-center justify-between gap-4 py-1.5 text-sm hover:bg-muted/30 rounded px-2 -mx-2 transition-colors group"
                              >
                                <span className="text-foreground flex-1 min-w-0 truncate">{item.meaning || "—"}</span>
                                <span className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 flex items-center gap-2">
                                  <span className="text-xs opacity-60">{item.book_title}</span>
                                  <span>
                                    {item.canto_number ? `${item.canto_number}.` : ""}
                                    {item.chapter_number}.{item.verse_number}
                                  </span>
                                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                              </Link>
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
                  <div className="pt-6 text-center">
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
      </div>
    </div>
  );
}
