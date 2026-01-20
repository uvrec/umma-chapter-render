import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Search, Loader2, ChevronDown, BookOpen, Plus, GraduationCap, Star, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addLearningWord, isWordInLearningList, LearningWord } from '@/utils/learningWords';
import { addSavedTerm, isTermVerseSaved, getSavedTerms, removeSavedTerm, SavedTerm } from '@/utils/savedTerms';
import { useSanskritLexicon, LexiconEntry, GRAMMAR_LABELS } from '@/hooks/useSanskritLexicon';

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
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [searchType, setSearchType] = useState<'exact' | 'contains' | 'starts'>('contains');
  const [translation, setTranslation] = useState('');
  const [debouncedTranslation, setDebouncedTranslation] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  // State for saved terms and learning words (for reactivity)
  const [savedTermsState, setSavedTermsState] = useState<SavedTerm[]>(() => getSavedTerms());
  const [learningWordsSet, setLearningWordsSet] = useState<Set<string>>(() => {
    // Initialize with existing learning words
    try {
      const stored = localStorage.getItem('scriptLearning_importedWords');
      if (stored) {
        const words = JSON.parse(stored) as LearningWord[];
        return new Set(words.map(w => w.iast.toLowerCase()));
      }
    } catch {}
    return new Set();
  });

  // Handle adding term to learning
  const handleAddToLearning = (item: GlossaryTermResult) => {
    const word: LearningWord = {
      script: '', // No devanagari script available from glossary
      iast: item.term,
      ukrainian: item.meaning,
      meaning: item.meaning,
      book: item.book_title,
      verseReference: item.verse_link,
      addedAt: Date.now(),
    };

    const added = addLearningWord(word);
    if (added) {
      setLearningWordsSet(prev => new Set(prev).add(item.term.toLowerCase()));
      toast.success(t('Додано до вивчення', 'Added to learning'));
    } else {
      toast.info(t('Вже у списку вивчення', 'Already in learning list'));
    }
  };

  // Handle saving term (bookmark)
  const handleSaveTerm = (item: GlossaryTermResult) => {
    const isSaved = isTermVerseSaved(item.term, item.verse_link);

    if (isSaved) {
      // Find and remove the saved term
      const saved = savedTermsState.find(
        st => st.term.toLowerCase() === item.term.toLowerCase() && st.verseLink === item.verse_link
      );
      if (saved) {
        removeSavedTerm(saved.id);
        setSavedTermsState(getSavedTerms());
        toast.success(t('Видалено зі збережених', 'Removed from saved'));
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
        toast.success(t('Збережено', 'Saved'));
      }
    }
  };

  // Check if term is in learning list
  const isInLearning = (term: string) => learningWordsSet.has(term.toLowerCase());

  // Check if term+verse is saved
  const isSaved = (term: string, verseLink: string) =>
    savedTermsState.some(
      st => st.term.toLowerCase() === term.toLowerCase() && st.verseLink === verseLink
    );

  // Sanskrit lexicon for etymology
  const { lookupWord, lexiconAvailable, getGrammarLabel, getDictionaryLink } = useSanskritLexicon();
  const [etymologyData, setEtymologyData] = useState<Record<string, LexiconEntry[]>>({});
  const [loadingEtymology, setLoadingEtymology] = useState<Set<string>>(new Set());

  // Fetch etymology when term is expanded
  const fetchEtymology = useCallback(async (term: string) => {
    if (!lexiconAvailable || etymologyData[term] || loadingEtymology.has(term)) return;

    setLoadingEtymology(prev => new Set(prev).add(term));
    try {
      const results = await lookupWord(term);
      setEtymologyData(prev => ({ ...prev, [term]: results }));
    } finally {
      setLoadingEtymology(prev => {
        const next = new Set(prev);
        next.delete(term);
        return next;
      });
    }
  }, [lexiconAvailable, lookupWord, etymologyData, loadingEtymology]);

  // Debounce search inputs
  const debouncedSetSearch = useCallback(
    debounce((term: string) => setDebouncedSearchTerm(term), 400),
    []
  );

  const debouncedSetTranslation = useCallback(
    debounce((term: string) => setDebouncedTranslation(term), 400),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    debouncedSetTranslation(translation);
  }, [translation, debouncedSetTranslation]);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
      setDebouncedSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Fetch glossary statistics (книги з їх кількістю термінів)
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['glossary-stats', language],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc('get_glossary_stats', {
        search_language: language
      });

      if (error) throw error;
      return data?.[0] as GlossaryStats | undefined;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Check if there's an active search
  const hasSearch = debouncedSearchTerm || debouncedTranslation || selectedBook !== 'all';

  // Convert search mode
  const searchMode = searchType === 'starts' ? 'starts_with' : searchType;

  // Server-side search with pagination - grouped terms
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
    queryKey: ['glossary-grouped', language, debouncedSearchTerm, debouncedTranslation, searchMode, selectedBook],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await (supabase as any).rpc('get_glossary_terms_grouped', {
        search_term: debouncedSearchTerm || null,
        search_translation: debouncedTranslation || null,
        search_language: language,
        search_mode: searchMode,
        book_filter: selectedBook !== 'all' ? selectedBook : null,
        page_number: pageParam,
        page_size: PAGE_SIZE
      });

      if (error) throw error;
      return {
        terms: (data || []) as GroupedTermResult[],
        page: pageParam as number,
        totalCount: data?.[0]?.total_unique_terms || 0
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

  // Fetch details for expanded term
  const fetchTermDetails = async (termText: string) => {
    const { data, error } = await (supabase as any).rpc('get_glossary_term_details', {
      term_text: termText,
      search_language: language
    });

    if (error) throw error;
    return data as GlossaryTermResult[];
  };

  // Query for expanded term details
  const [expandedTermDetails, setExpandedTermDetails] = useState<Record<string, GlossaryTermResult[]>>({});
  const [loadingTerms, setLoadingTerms] = useState<Set<string>>(new Set());

  const toggleTermExpanded = async (term: string) => {
    const newExpanded = new Set(expandedTerms);

    if (newExpanded.has(term)) {
      newExpanded.delete(term);
    } else {
      newExpanded.add(term);

      // Fetch details if not already loaded
      if (!expandedTermDetails[term]) {
        setLoadingTerms(prev => new Set(prev).add(term));
        try {
          const details = await fetchTermDetails(term);
          setExpandedTermDetails(prev => ({ ...prev, [term]: details }));
        } finally {
          setLoadingTerms(prev => {
            const next = new Set(prev);
            next.delete(term);
            return next;
          });
        }
      }

      // Fetch etymology in parallel
      fetchEtymology(term);
    }

    setExpandedTerms(newExpanded);
  };

  // Aggregate all pages
  const allGroupedTerms = groupedData?.pages.flatMap(page => page.terms) || [];
  const totalUniqueTerms = groupedData?.pages[0]?.totalCount || 0;

  // Handle search button click
  const handleSearch = () => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Results - Main content area */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              {/* Search results statistics */}
              {hasSearch && totalUniqueTerms > 0 && (
                <div className="mb-4 text-sm text-muted-foreground">
                  {t('Знайдено', 'Found')} <span className="font-medium text-foreground">{totalUniqueTerms}</span> {t('термінів', 'terms')}
                  {allGroupedTerms.length < totalUniqueTerms && (
                    <span> ({t('показано', 'showing')} {allGroupedTerms.length})</span>
                  )}
                </div>
              )}

              <div className="space-y-3">
              {isLoadingStats || isLoadingGrouped ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin" />
                </div>
              ) : !hasSearch ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p>{t('Введіть запит для пошуку', 'Enter a search query')}</p>
                </div>
              ) : isErrorGrouped ? (
                <div className="py-12 text-center text-destructive">
                  <p>{t('Помилка завантаження', 'Error loading')}</p>
                </div>
              ) : allGroupedTerms.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p>{t('Нічого не знайдено', 'Nothing found')}</p>
                </div>
              ) : (
                <>
                  {allGroupedTerms.map((groupedTerm) => (
                    <div key={groupedTerm.term} className="border rounded-lg overflow-hidden">
                      {/* Term header - clickable to expand */}
                      <button
                        onClick={() => toggleTermExpanded(groupedTerm.term)}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 active:bg-muted/50 transition-colors text-left touch-manipulation"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-primary">
                            {groupedTerm.term}
                          </h3>
                          {groupedTerm.sample_meanings && groupedTerm.sample_meanings.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {groupedTerm.sample_meanings.slice(0, 3).join('; ')}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {groupedTerm.books?.slice(0, 3).map((book) => (
                              <Badge key={book} variant="outline" className="text-xs">
                                {book}
                              </Badge>
                            ))}
                            {groupedTerm.books?.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{groupedTerm.books.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="secondary">
                            {groupedTerm.usage_count} {t('використань', 'usages')}
                          </Badge>
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                              expandedTerms.has(groupedTerm.term) ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expanded details */}
                      {expandedTerms.has(groupedTerm.term) && (
                        <div className="border-t bg-muted/20 p-4">
                          {loadingTerms.has(groupedTerm.term) ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                          ) : expandedTermDetails[groupedTerm.term] ? (
                            <div className="space-y-4">
                              {/* Etymology section */}
                              {lexiconAvailable && (
                                <div className="mb-4">
                                  {loadingEtymology.has(groupedTerm.term) ? (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      {t('Завантаження етимології...', 'Loading etymology...')}
                                    </div>
                                  ) : etymologyData[groupedTerm.term]?.length > 0 ? (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        {t('Етимологія', 'Etymology')}
                                      </h4>
                                      <div className="space-y-2">
                                        {etymologyData[groupedTerm.term].slice(0, 3).map((entry, i) => (
                                          <div key={i} className="text-sm">
                                            <div className="flex items-baseline gap-2">
                                              {entry.word_devanagari && (
                                                <span className="text-lg font-medium">{entry.word_devanagari}</span>
                                              )}
                                              <span className="text-primary font-medium">{entry.word}</span>
                                              {entry.grammar && (
                                                <span className="text-xs text-muted-foreground">
                                                  ({getGrammarLabel(entry.grammar, language as 'uk' | 'en') || entry.grammar})
                                                </span>
                                              )}
                                            </div>
                                            {entry.meanings && (
                                              <p className="text-muted-foreground mt-0.5 line-clamp-2">
                                                {entry.meanings}
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      <Link
                                        to={getDictionaryLink(groupedTerm.term)}
                                        className="text-sm md:text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block py-1 touch-manipulation"
                                      >
                                        {t('Детальніше у словнику', 'More in dictionary')} →
                                      </Link>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                              {/* Group by book */}
                              {Object.entries(
                                expandedTermDetails[groupedTerm.term].reduce((acc, item) => {
                                  if (!acc[item.book_title]) acc[item.book_title] = [];
                                  acc[item.book_title].push(item);
                                  return acc;
                                }, {} as Record<string, GlossaryTermResult[]>)
                              ).map(([book, items]) => (
                                <div key={book}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-sm">{book}</span>
                                    <Badge variant="outline" className="text-xs">{items.length}</Badge>
                                  </div>
                                  <div className="space-y-2 ml-6">
                                    {items.map((item, idx) => {
                                      const cantoInfo = item.canto_number
                                        ? `${language === 'uk' ? 'Пісня' : 'Canto'} ${item.canto_number}, `
                                        : '';
                                      const reference = `${cantoInfo}${language === 'uk' ? 'Розділ' : 'Chapter'} ${item.chapter_number}, ${language === 'uk' ? 'Вірш' : 'Verse'} ${item.verse_number}`;
                                      const termInLearning = isInLearning(item.term);
                                      const termIsSaved = isSaved(item.term, item.verse_link);

                                      return (
                                        <div key={idx} className="border-l-2 border-primary/30 pl-3 py-1 group">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                              <p className="text-foreground">{item.meaning || '—'}</p>
                                              <Link
                                                to={getLocalizedPath(item.verse_link)}
                                                className="text-sm text-primary hover:underline inline-block py-1 touch-manipulation"
                                              >
                                                {reference}
                                              </Link>
                                            </div>
                                            {/* Action buttons - always visible on mobile, hover on desktop */}
                                            <TooltipProvider delayDuration={300}>
                                              <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                                                {/* Add to learning */}
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToLearning(item);
                                                      }}
                                                      className={`p-2 md:p-1.5 rounded-md transition-colors touch-manipulation ${
                                                        termInLearning
                                                          ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                                                          : 'text-muted-foreground hover:text-primary hover:bg-muted active:bg-muted'
                                                      }`}
                                                      aria-label={termInLearning
                                                        ? t('Вже у вивченні', 'Already in learning')
                                                        : t('Додати до вивчення', 'Add to learning')}
                                                    >
                                                      {termInLearning ? (
                                                        <Check className="h-5 w-5 md:h-4 md:w-4" />
                                                      ) : (
                                                        <GraduationCap className="h-5 w-5 md:h-4 md:w-4" />
                                                      )}
                                                    </button>
                                                  </TooltipTrigger>
                                                  <TooltipContent side="top" className="hidden md:block">
                                                    {termInLearning
                                                      ? t('Вже у вивченні', 'Already in learning')
                                                      : t('Додати до вивчення', 'Add to learning')}
                                                  </TooltipContent>
                                                </Tooltip>

                                                {/* Save/Bookmark */}
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSaveTerm(item);
                                                      }}
                                                      className={`p-2 md:p-1.5 rounded-md transition-colors touch-manipulation ${
                                                        termIsSaved
                                                          ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/30'
                                                          : 'text-muted-foreground hover:text-amber-500 hover:bg-muted active:bg-muted'
                                                      }`}
                                                      aria-label={termIsSaved
                                                        ? t('Видалити зі збережених', 'Remove from saved')
                                                        : t('Зберегти', 'Save')}
                                                    >
                                                      <Star className={`h-5 w-5 md:h-4 md:w-4 ${termIsSaved ? 'fill-current' : ''}`} />
                                                    </button>
                                                  </TooltipTrigger>
                                                  <TooltipContent side="top" className="hidden md:block">
                                                    {termIsSaved
                                                      ? t('Видалити зі збережених', 'Remove from saved')
                                                      : t('Зберегти', 'Save')}
                                                  </TooltipContent>
                                                </Tooltip>
                                              </div>
                                            </TooltipProvider>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Load more button */}
                  {hasNextPage && (
                    <div className="text-center py-4">
                      <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="w-full md:w-auto gap-2 h-11 md:h-10 touch-manipulation"
                      >
                        {isFetchingNextPage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        {t('Завантажити ще', 'Load more')}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar - Search & Categories */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="sticky top-4 space-y-4">
                {/* Search form - compact */}
                <div className="space-y-3">
                  <Input
                    placeholder={t('Термін...', 'Term...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Input
                    placeholder={t('Переклад...', 'Translation...')}
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">{t('Містить', 'Contains')}</SelectItem>
                      <SelectItem value="exact">{t('Точний збіг', 'Exact')}</SelectItem>
                      <SelectItem value="starts">{t('Починається з', 'Starts with')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} className="w-full gap-2">
                    <Search className="h-4 w-4" />
                    {t('Шукати', 'Search')}
                  </Button>
                </div>

                {/* Categories */}
                <div className="pt-4 border-t">
                  {isLoadingStats ? (
                    <div className="space-y-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-8 bg-muted animate-pulse rounded-md" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedBook('all')}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                          selectedBook === 'all'
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{t('Всі', 'All')}</span>
                          <span className="text-xs opacity-70">{statsData?.unique_terms || 0}</span>
                        </div>
                      </button>

                      {statsData?.book_stats?.map((book) => (
                        <button
                          key={book.slug}
                          onClick={() => setSelectedBook(book.slug)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                            selectedBook === book.slug
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <span className="truncate">{book.title}</span>
                            <span className="text-xs opacity-70">{book.unique}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved terms - compact */}
                {savedTermsState.length > 0 && (
                  <Link
                    to="/tools/script-learning"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md"
                  >
                    <Star className="h-4 w-4" />
                    {savedTermsState.length} {t('збережено', 'saved')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
