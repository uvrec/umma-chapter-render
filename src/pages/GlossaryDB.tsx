import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Search, Loader2, ChevronDown, BookOpen, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { debounce } from 'lodash';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [searchType, setSearchType] = useState<'exact' | 'contains' | 'starts'>('contains');
  const [translation, setTranslation] = useState('');
  const [debouncedTranslation, setDebouncedTranslation] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

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
  const {
    data: groupedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingGrouped,
    isError: isErrorGrouped,
  } = useInfiniteQuery({
    queryKey: ['glossary-grouped', language, debouncedSearchTerm, debouncedTranslation, searchMode, selectedBook],
    queryFn: async ({ pageParam = 1 }) => {
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
        page: pageParam,
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
    enabled: hasSearch,
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {t('Глосарій', 'Glossary')}
          </h1>

          {/* Statistics - show when we have stats */}
          {statsData && !hasSearch && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 text-center bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {statsData.unique_terms?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('Унікальних термінів', 'Unique terms')}
                </div>
              </div>
              <div className="p-4 text-center bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {statsData.total_terms?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('Всього використань', 'Total usages')}
                </div>
              </div>
              <div className="p-4 text-center bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {statsData.books_count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('Книг', 'Books')}
                </div>
              </div>
            </div>
          )}

          {/* Search results statistics */}
          {hasSearch && totalUniqueTerms > 0 && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-center text-muted-foreground">
                {t('Знайдено', 'Found')} <span className="font-bold text-foreground">{totalUniqueTerms}</span> {t('термінів', 'terms')}
                {allGroupedTerms.length < totalUniqueTerms && (
                  <span className="text-sm"> ({t('показано', 'showing')} {allGroupedTerms.length})</span>
                )}
              </p>
            </div>
          )}

          {/* Search form */}
          <div className="py-6 mb-8 bg-card rounded-lg border p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('Шукати термін...', 'Search term...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder={t('Шукати переклад...', 'Search translation...')}
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">
                      {t('Містить', 'Contains')}
                    </SelectItem>
                    <SelectItem value="exact">
                      {t('Точний збіг', 'Exact match')}
                    </SelectItem>
                    <SelectItem value="starts">
                      {t('Починається з', 'Starts with')}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="gap-2">
                  <Search className="h-4 w-4" />
                  {t('Шукати', 'Search')}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Results */}
            <div className="lg:col-span-3 space-y-4">
              {isLoadingStats || isLoadingGrouped ? (
                <div className="py-8 text-center">
                  <div className="text-muted-foreground space-y-2">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
                    <p className="text-lg">
                      {t('Завантаження термінів...', 'Loading terms...')}
                    </p>
                  </div>
                </div>
              ) : !hasSearch ? (
                <div className="py-8 text-center">
                  <div className="text-muted-foreground space-y-2">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">
                      {t('Використовуйте пошук для перегляду термінів', 'Use search to view terms')}
                    </p>
                    <p className="text-sm">
                      {t('Введіть термін або переклад, або оберіть категорію', 'Enter a term or translation, or select a category')}
                    </p>
                  </div>
                </div>
              ) : isErrorGrouped ? (
                <div className="py-8 text-center">
                  <p className="text-destructive">
                    {t('Помилка завантаження', 'Error loading data')}
                  </p>
                </div>
              ) : allGroupedTerms.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {t('Термінів не знайдено', 'No terms found')}
                  </p>
                </div>
              ) : (
                <>
                  {allGroupedTerms.map((groupedTerm) => (
                    <div key={groupedTerm.term} className="border rounded-lg overflow-hidden">
                      {/* Term header - clickable to expand */}
                      <button
                        onClick={() => toggleTermExpanded(groupedTerm.term)}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
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
                                        ? `${language === 'ua' ? 'Пісня' : 'Canto'} ${item.canto_number}, `
                                        : '';
                                      const reference = `${cantoInfo}${language === 'ua' ? 'Розділ' : 'Chapter'} ${item.chapter_number}, ${language === 'ua' ? 'Вірш' : 'Verse'} ${item.verse_number}`;

                                      return (
                                        <div key={idx} className="border-l-2 border-primary/30 pl-3 py-1">
                                          <p className="text-foreground">{item.meaning || '—'}</p>
                                          <Link
                                            to={item.verse_link}
                                            className="text-sm text-primary hover:underline"
                                          >
                                            {reference}
                                          </Link>
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
                        className="gap-2"
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

            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                <h3 className="font-semibold">
                  {t('Категорії', 'Categories')}
                </h3>

                {isLoadingStats ? (
                  <div className="space-y-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedBook('all')}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedBook === 'all'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{t('Всі книги', 'All books')}</span>
                        <Badge variant={selectedBook === 'all' ? 'outline' : 'secondary'}>
                          {statsData?.unique_terms || 0}
                        </Badge>
                      </div>
                    </button>

                    {statsData?.book_stats?.map((book) => (
                      <button
                        key={book.slug}
                        onClick={() => setSelectedBook(book.slug)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedBook === book.slug
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className="truncate text-sm">{book.title}</span>
                          <Badge variant={selectedBook === book.slug ? 'outline' : 'secondary'}>
                            {book.unique}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick tips */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                  <h4 className="font-medium text-foreground mb-2">
                    {t('Поради', 'Tips')}
                  </h4>
                  <ul className="space-y-1 text-xs">
                    <li>• {t('Натисніть на термін, щоб побачити всі використання', 'Click on a term to see all usages')}</li>
                    <li>• {t('Використовуйте діакритику для точного пошуку', 'Use diacritics for precise search')}</li>
                    <li>• {t('Фільтруйте по книзі для швидкого пошуку', 'Filter by book for faster search')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
