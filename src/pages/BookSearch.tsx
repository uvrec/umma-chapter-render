/**
 * Повнотекстовий пошук по книгах
 * UA/EN з підсвічуванням збігів та фільтрами
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Book, ChevronRight, Loader2, X, HelpCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import DOMPurify from 'dompurify';

interface SearchResult {
  verse_id: string;
  verse_number: string;
  chapter_id: string;
  chapter_number: number;
  chapter_title: string;
  book_id: string;
  book_title: string;
  book_slug: string;
  canto_id: string | null;
  canto_number: number | null;
  canto_title: string | null;
  sanskrit: string | null;
  transliteration: string | null;
  synonyms: string | null;
  translation: string | null;
  commentary: string | null;
  relevance_rank: number;
  matched_in: string[];
  search_snippet: string;
}

interface Book {
  id: string;
  title_ua: string;
  title_en: string;
  slug: string;
}

export default function BookSearch() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Фільтри
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [includeTranslation, setIncludeTranslation] = useState(true);
  const [includeCommentary, setIncludeCommentary] = useState(true);
  const [includeSynonyms, setIncludeSynonyms] = useState(true);
  const [includeSanskrit, setIncludeSanskrit] = useState(false);
  const [includeTransliteration, setIncludeTransliteration] = useState(false);

  // Завантажити список книг
  const { data: books = [] } = useQuery({
    queryKey: ['books-for-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, title_ua, title_en, slug')
        .eq('is_published', true)
        .order('display_order');
      
      if (error) throw error;
      return data as Book[];
    },
  });

  // Пошук
  const { data: results = [], isLoading, isFetching } = useQuery({
    queryKey: [
      'book-search',
      submittedQuery,
      language,
      selectedBooks,
      includeTranslation,
      includeCommentary,
      includeSynonyms,
      includeSanskrit,
      includeTransliteration,
    ],
    queryFn: async () => {
      if (!submittedQuery.trim()) return [];

      const { data, error } = await supabase.rpc('search_verses_fulltext', {
        search_query: submittedQuery.trim(),
        language_code: language,
        include_sanskrit: includeSanskrit,
        include_transliteration: includeTransliteration,
        include_synonyms: includeSynonyms,
        include_translation: includeTranslation,
        include_commentary: includeCommentary,
        book_ids: selectedBooks.length > 0 ? selectedBooks : null,
        limit_count: 100,
      });

      if (error) throw error;
      return (data || []) as SearchResult[];
    },
    enabled: submittedQuery.trim().length >= 2,
  });

  // Виконати пошук
  const handleSearch = () => {
    if (searchQuery.trim().length < 2) return;
    setSubmittedQuery(searchQuery);
    setSearchParams({ q: searchQuery });
  };

  // Очистити пошук
  const handleClear = () => {
    setSearchQuery('');
    setSubmittedQuery('');
    setSearchParams({});
  };

  // Підсвітити збіги в тексті
  const highlightMatches = (text: string | null, query: string): string => {
    if (!text || !query) return text || '';
    
    const sanitized = DOMPurify.sanitize(text);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return sanitized.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">$1</mark>'
    );
  };

  // Групувати результати по книгах
  const groupedResults = useMemo(() => {
    const groups: Record<string, { book: { title: string; slug: string }; results: SearchResult[] }> = {};
    
    results.forEach((result) => {
      if (!groups[result.book_id]) {
        groups[result.book_id] = {
          book: { title: result.book_title, slug: result.book_slug },
          results: [],
        };
      }
      groups[result.book_id].results.push(result);
    });
    
    return Object.values(groups);
  }, [results]);

  // Перехід до вірша
  const navigateToVerse = (result: SearchResult) => {
    const path = result.canto_number
      ? `/veda-reader/${result.book_slug}/canto/${result.canto_number}/chapter/${result.chapter_number}/${result.verse_number}`
      : `/veda-reader/${result.book_slug}/${result.chapter_number}/${result.verse_number}`;
    navigate(path);
  };

  // Toggle book filter
  const toggleBookFilter = (bookId: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('Пошук по книгах', 'Search Books')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'Знайдіть потрібний вірш у священних текстах',
              'Find the verse you need in sacred texts'
            )}
          </p>
        </div>

        {/* Поле пошуку */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t(
                'Введіть слово або фразу...',
                'Enter a word or phrase...'
              )}
              className="pl-10 pr-10 h-12 text-lg"
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} size="lg" className="h-12">
            {isLoading || isFetching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t('Знайти', 'Search')
            )}
          </Button>
        </div>

        {/* Фільтри та допомога */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Filter className="h-4 w-4" />
                {t('Фільтри', 'Filters')}
                {(selectedBooks.length > 0 || !includeTranslation || !includeCommentary) && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedBooks.length + (includeTranslation ? 0 : 1) + (includeCommentary ? 0 : 1)}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          <Collapsible open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                {t('Синтаксис пошуку', 'Search syntax')}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* Панель фільтрів */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleContent className="mb-6">
            <div className="py-4 space-y-4 border rounded-lg p-4 bg-muted/30">
              {/* Фільтр по книгах */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t('Книги', 'Books')}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {books.map((book) => (
                    <Button
                      key={book.id}
                      variant={selectedBooks.includes(book.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleBookFilter(book.id)}
                      className="gap-1"
                    >
                      <Book className="h-3 w-3" />
                      {language === 'ua' ? book.title_ua : book.title_en}
                    </Button>
                  ))}
                  {selectedBooks.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBooks([])}
                    >
                      {t('Скинути', 'Clear')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Де шукати */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t('Шукати в', 'Search in')}
                </Label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeTranslation}
                      onCheckedChange={(v) => setIncludeTranslation(!!v)}
                    />
                    <span className="text-sm">{t('Переклад', 'Translation')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeCommentary}
                      onCheckedChange={(v) => setIncludeCommentary(!!v)}
                    />
                    <span className="text-sm">{t('Коментар', 'Commentary')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeSynonyms}
                      onCheckedChange={(v) => setIncludeSynonyms(!!v)}
                    />
                    <span className="text-sm">{t('Синоніми', 'Synonyms')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeSanskrit}
                      onCheckedChange={(v) => setIncludeSanskrit(!!v)}
                    />
                    <span className="text-sm">{t('Санскрит', 'Sanskrit')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeTransliteration}
                      onCheckedChange={(v) => setIncludeTransliteration(!!v)}
                    />
                    <span className="text-sm">{t('Транслітерація', 'Transliteration')}</span>
                  </label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Допомога по синтаксису пошуку */}
        <Collapsible open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <CollapsibleContent className="mb-6">
            <div className="py-4 border rounded-lg p-4 bg-muted/30 space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">{t('Фразовий пошук', 'Phrase search')}</h3>
                <p className="text-muted-foreground mb-1">
                  {t(
                    'Використовуйте лапки для пошуку точної фрази:',
                    'Use quotation marks to search for an exact phrase:'
                  )}
                </p>
                <code className="bg-muted px-2 py-1 rounded text-primary">
                  {language === 'ua' ? '"чисте віддане служіння"' : '"Supreme Personality of Godhead"'}
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('Оператор OR (або)', 'OR operator')}</h3>
                <p className="text-muted-foreground mb-1">
                  {t(
                    'Пробіл між словами означає "або" - знайде документи з будь-яким словом:',
                    'Space between words means "or" - finds documents with any word:'
                  )}
                </p>
                <code className="bg-muted px-2 py-1 rounded text-primary">
                  {language === 'ua' ? 'крішна арджуна' : 'krishna arjuna'}
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('Оператор AND (і)', 'AND operator')}</h3>
                <p className="text-muted-foreground mb-1">
                  {t(
                    'Використовуйте AND для пошуку документів з обома словами:',
                    'Use AND to find documents containing both words:'
                  )}
                </p>
                <code className="bg-muted px-2 py-1 rounded text-primary">
                  {language === 'ua' ? 'крішна AND арджуна' : 'krishna AND arjuna'}
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('Виключення (NOT)', 'Exclusion (NOT)')}</h3>
                <p className="text-muted-foreground mb-1">
                  {t(
                    'Використовуйте мінус для виключення слова:',
                    'Use minus to exclude a word:'
                  )}
                </p>
                <code className="bg-muted px-2 py-1 rounded text-primary">
                  {language === 'ua' ? 'крішна -арджуна' : 'krishna -arjuna'}
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('Комбінований пошук', 'Combined search')}</h3>
                <p className="text-muted-foreground mb-1">
                  {t(
                    'Комбінуйте різні оператори:',
                    'Combine different operators:'
                  )}
                </p>
                <code className="bg-muted px-2 py-1 rounded text-primary">
                  {language === 'ua' ? '"віддане служіння" AND бгакті -карма' : '"devotional service" AND bhakti -karma'}
                </code>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Результати */}
        {submittedQuery && (
          <div className="space-y-6">
            {/* Статистика */}
            <div className="text-sm text-muted-foreground">
              {results.length > 0 ? (
                t(
                  `Знайдено ${results.length} ${results.length === 1 ? 'результат' : results.length < 5 ? 'результати' : 'результатів'}`,
                  `Found ${results.length} ${results.length === 1 ? 'result' : 'results'}`
                )
              ) : !isLoading && !isFetching ? (
                t('Нічого не знайдено', 'No results found')
              ) : null}
            </div>

            {/* Згруповані результати */}
            {groupedResults.map((group) => (
              <div key={group.book.slug} className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Book className="h-5 w-5 text-primary" />
                  {group.book.title}
                  <Badge variant="outline">{group.results.length}</Badge>
                </h2>

                <div className="space-y-2">
                  {group.results.map((result) => (
                    <div
                      key={result.verse_id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors py-3"
                      onClick={() => navigateToVerse(result)}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Референс */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-primary">
                                {result.canto_number
                                  ? `${result.canto_number}.${result.chapter_number}.${result.verse_number}`
                                  : `${result.chapter_number}.${result.verse_number}`}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {result.chapter_title}
                              </span>
                            </div>

                            {/* Snippet з підсвічуванням */}
                            <p
                              className="text-sm line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: highlightMatches(result.search_snippet, submittedQuery),
                              }}
                            />

                            {/* Де знайдено */}
                            {result.matched_in?.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {result.matched_in.map((field) => (
                                  <Badge key={field} variant="secondary" className="text-xs">
                                    {t(
                                      field === 'translation'
                                        ? 'переклад'
                                        : field === 'commentary'
                                        ? 'коментар'
                                        : field === 'synonyms'
                                        ? 'синоніми'
                                        : field,
                                      field
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Loading skeleton */}
            {(isLoading || isFetching) && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="py-4">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Порожній стан */}
        {!submittedQuery && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>{t('Введіть пошуковий запит', 'Enter a search query')}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
