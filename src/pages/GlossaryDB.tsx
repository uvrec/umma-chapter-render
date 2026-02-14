import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search, Loader2, ChevronDown, Plus, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { debounce } from "lodash";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addLearningWord, LearningWord } from "@/utils/learningWords";
import { addSavedTerm, isTermVerseSaved, getSavedTerms, removeSavedTerm, SavedTerm } from "@/utils/savedTerms";
import { useSanskritLexicon } from "@/hooks/useSanskritLexicon";
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

const PAGE_SIZE = 50;

// Book slug → short abbreviation
const BOOK_ABBR: Record<string, string> = {
  bg: "BG",
  sb: "ŚB",
  cc: "CC",
  noi: "NoI",
  iso: "Śrī Īśo",
  bs: "BS",
};

function formatVerseRef(item: GlossaryTermResult): string {
  const abbr = BOOK_ABBR[item.book_slug] || item.book_slug.toUpperCase();
  if (item.canto_number) {
    return `${abbr} ${item.canto_number}.${item.chapter_number}.${item.verse_number}`;
  }
  return `${abbr} ${item.chapter_number}.${item.verse_number}`;
}

// Detect Bengali script
const isBengaliTerm = (term: string) => /[\u0980-\u09FF]/.test(term);

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

  const { lexiconAvailable, getDictionaryLink: getSanskritDictLink } = useSanskritLexicon();
  const { lexiconAvailable: bengaliAvailable, getDictionaryLink: getBengaliDictLink } = useBengaliLexicon();

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
    const saved = isTermVerseSaved(item.term, item.verse_link);

    if (saved) {
      const found = savedTermsState.find(
        (st) => st.term.toLowerCase() === item.term.toLowerCase() && st.verseLink === item.verse_link,
      );
      if (found) {
        removeSavedTerm(found.id);
        setSavedTermsState(getSavedTerms());
        toast.success(t("Видалено зі збережених", "Removed from saved"));
      }
    } else {
      addSavedTerm({
        term: item.term,
        meaning: item.meaning,
        bookSlug: item.book_slug,
        bookTitle: item.book_title,
        verseNumber: item.verse_number,
        chapterNumber: item.chapter_number,
        cantoNumber: item.canto_number ?? undefined,
        verseLink: item.verse_link,
      });
      setSavedTermsState(getSavedTerms());
      toast.success(t("Збережено", "Saved"));
    }
  };

  const isInLearning = (term: string) => learningWordsSet.has(term.toLowerCase());
  const isItemSaved = (term: string, verseLink: string) =>
    savedTermsState.some((st) => st.term.toLowerCase() === term.toLowerCase() && st.verseLink === verseLink);

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

  // Single query using search_glossary_terms_v2 — returns flat results with full context
  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useInfiniteQuery({
    queryKey: ["glossary-v2", language, debouncedSearchTerm, debouncedTranslation, searchMode, selectedBook],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await (supabase as any).rpc("search_glossary_terms_v2", {
        search_term: debouncedSearchTerm || null,
        search_translation: debouncedTranslation || null,
        search_language: language,
        search_mode: searchMode,
        book_filter: selectedBook !== "all" ? selectedBook : null,
        page_number: pageParam,
        page_size: PAGE_SIZE,
      });

      if (error) throw error;
      const results = (data || []) as GlossaryTermResult[];
      return {
        results,
        page: pageParam as number,
        totalCount: results[0]?.total_count || 0,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, p) => acc + p.results.length, 0);
      if (loadedCount < lastPage.totalCount) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!hasSearch,
  });

  // Flatten all results from all pages
  const allResults = searchData?.pages.flatMap((p) => p.results) || [];
  const totalCount = searchData?.pages[0]?.totalCount || 0;

  // Group results by term (lowercase) for display
  const groupedByTerm = useMemo(() => {
    const groups: { term: string; items: GlossaryTermResult[] }[] = [];
    const map = new Map<string, GlossaryTermResult[]>();

    for (const item of allResults) {
      const key = item.term.toLowerCase();
      if (!map.has(key)) {
        const arr: GlossaryTermResult[] = [];
        map.set(key, arr);
        groups.push({ term: item.term, items: arr });
      }
      map.get(key)!.push(item);
    }

    return groups;
  }, [allResults]);

  const handleSearch = () => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    }
  };

  const toggleExpand = (term: string) => {
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term);
      else next.add(term);
      return next;
    });
  };

  const INLINE_LIMIT = isMobile ? 2 : 3;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Search bar */}
        <div className="mb-6">
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

        {/* Two-column layout */}
        <div className="flex gap-8">
          {/* Main results */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            {hasSearch && totalCount > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                {t("Знайдено", "Found")} <span className="font-medium">{totalCount}</span> {t("результатів", "results")}
                {allResults.length < totalCount && (
                  <span className="text-muted-foreground/70">
                    {" "}({t("показано", "showing")} {allResults.length})
                  </span>
                )}
              </p>
            )}

            {/* Results */}
            <div>
              {isLoadingStats || isLoadingSearch ? (
                <div className="py-16 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                </div>
              ) : !hasSearch ? (
                <div className="py-4 sm:py-16 text-center text-muted-foreground">
                  <p className="hidden sm:block">{t("Введіть запит для пошуку", "Enter a search query")}</p>
                </div>
              ) : isErrorSearch ? (
                <div className="py-16 text-center text-destructive">
                  <p>{t("Помилка завантаження", "Error loading")}</p>
                </div>
              ) : groupedByTerm.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <p>{t("Нічого не знайдено", "Nothing found")}</p>
                </div>
              ) : (
                <>
                  {groupedByTerm.map(({ term, items }) => {
                    const isExpanded = expandedTerms.has(term.toLowerCase());
                    const hasMore = items.length > INLINE_LIMIT;
                    const visibleItems = isExpanded ? items : items.slice(0, INLINE_LIMIT);

                    return (
                      <div key={term.toLowerCase()} className={isMobile ? "py-2 border-b border-border" : "mb-6"}>
                        {/* Term heading + dictionary links */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className={isMobile ? "font-semibold italic text-foreground" : "text-xl font-bold text-foreground"}>
                            {term}
                          </span>
                          {items.length > 1 && (
                            <span className="text-sm font-normal text-muted-foreground">
                              ({items.length})
                            </span>
                          )}
                          {/* Dictionary links */}
                          <span className="flex items-center gap-1.5 ml-1">
                            {lexiconAvailable && !isBengaliTerm(term) && (
                              <Link
                                to={getLocalizedPath(getSanskritDictLink(term))}
                                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                title={t("Санскритський словник", "Sanskrit Dictionary")}
                              >
                                <BookOpen className="h-3 w-3" />
                                {!isMobile && <span>Skt</span>}
                              </Link>
                            )}
                            {bengaliAvailable && isBengaliTerm(term) && (
                              <Link
                                to={getLocalizedPath(getBengaliDictLink(term))}
                                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                title={t("Бенгальський словник", "Bengali Dictionary")}
                              >
                                <BookOpen className="h-3 w-3" />
                                {!isMobile && <span>Bn</span>}
                              </Link>
                            )}
                          </span>
                        </div>

                        {/* Verse occurrences with meaning + verse ref */}
                        <div className={isMobile ? "ml-3 mt-1 space-y-0.5" : "pl-8 mt-1 space-y-0.5"}>
                          {visibleItems.map((item, idx) => (
                            <div key={`${item.verse_link}-${idx}`} className="py-0.5 flex items-baseline gap-1 flex-wrap">
                              <span className={isMobile ? "text-foreground italic text-sm min-w-0" : "text-foreground"}>
                                {item.meaning || "—"}
                              </span>
                              {!isMobile && <span className="text-muted-foreground">—</span>}
                              <Link
                                to={getLocalizedPath(item.verse_link)}
                                className={isMobile
                                  ? "text-primary text-xs font-medium whitespace-nowrap shrink-0"
                                  : "text-primary hover:underline font-medium"
                                }
                              >
                                {formatVerseRef(item)}
                              </Link>
                              {!isMobile && (
                                <>
                                  <button
                                    onClick={(e) => { e.preventDefault(); handleSaveTerm(item); }}
                                    className={`ml-1 text-xs px-1.5 py-0.5 rounded transition-colors ${
                                      isItemSaved(item.term, item.verse_link)
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                    }`}
                                    title={t("Зберегти", "Save")}
                                  >
                                    {isItemSaved(item.term, item.verse_link) ? "★" : "☆"}
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
                                </>
                              )}
                            </div>
                          ))}
                          {/* Show more / collapse */}
                          {hasMore && (
                            <button
                              onClick={() => toggleExpand(term.toLowerCase())}
                              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 pt-1"
                            >
                              <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                              {isExpanded
                                ? t("Згорнути", "Collapse")
                                : t(`Ще ${items.length - INLINE_LIMIT}`, `${items.length - INLINE_LIMIT} more`)}
                            </button>
                          )}
                        </div>
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
              <div className="text-sm font-semibold text-foreground mb-2">
                {t("Книги", "Books")}
              </div>
              <div className="space-y-0.5">
                {isLoadingStats ? (
                  <div className="py-3 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : statsData?.book_stats?.map((book) => (
                  <button
                    key={book.slug}
                    onClick={() => setSelectedBook(selectedBook === book.slug ? "all" : book.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted/50 text-left ${
                      selectedBook === book.slug ? "bg-primary/10 font-medium text-primary" : "text-foreground"
                    }`}
                  >
                    <span>{book.title}</span>
                    <span className="text-muted-foreground text-xs">({book.unique})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
