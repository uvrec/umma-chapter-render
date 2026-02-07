/**
 * UnifiedSearch - Глобальний пошук по всьому сайту (Cmd+K / Ctrl+K)
 *
 * Функціонал:
 * - Пошук по віршах, блогу, лекціях, листах
 * - Історія пошуку
 * - Клавіатурні скорочення
 * - Підсвічування результатів
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, FileText, Clock, X, ArrowRight, Sparkles, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useDebounce } from '@/hooks/useDebounce';
import { offlineSearch, isOfflineSearchAvailable, OfflineSearchResult } from '@/services/offlineSearchService';

interface SuggestionResult {
  suggestion: string;
  frequency: number;
  source: string;
}

interface UnifiedSearchResult {
  result_type: string;
  result_id: string;
  title: string;
  subtitle: string | null;
  snippet: string | null;
  href: string;
  relevance: number;
  matched_in: string[];
}

interface UnifiedSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnifiedSearch({ open, onOpenChange }: UnifiedSearchProps) {
  const navigate = useNavigate();
  const { language, t, getLocalizedPath } = useLanguage();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineAvailable, setOfflineAvailable] = useState(false);

  // Відстежуємо онлайн/офлайн статус
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Перевіряємо чи є офлайн-дані
  useEffect(() => {
    if (open) {
      isOfflineSearchAvailable().then(setOfflineAvailable);
    }
  }, [open]);

  // Скидаємо query при закритті
  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  // Автокомпліт підказки (показуємо при 1+ символах) - використовуємо RPC search_suggest_terms
  const debouncedPrefix = useDebounce(query, 200);
  const { data: suggestions = [], isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['search-suggestions', debouncedPrefix, language],
    queryFn: async (): Promise<SuggestionResult[]> => {
      if (!debouncedPrefix || debouncedPrefix.length < 1) return [];

      try {
        // Використовуємо RPC функцію search_suggest_terms
        const { data, error } = await supabase.rpc('search_suggest_terms', {
          search_prefix: debouncedPrefix,
          language_code: language,
          limit_count: 6,
        });

        if (error) {
          console.error('Suggestions RPC error:', error);
          // Fallback на простий пошук якщо RPC не працює
          return fallbackSuggestions(debouncedPrefix);
        }

        return (data || []).map((item) => ({
          suggestion: item.suggestion,
          frequency: item.frequency,
          source: item.source,
        }));
      } catch {
        return fallbackSuggestions(debouncedPrefix);
      }
    },
    enabled: debouncedPrefix.length >= 1 && debouncedPrefix.length < 3,
    staleTime: 10 * 60 * 1000, // 10 хвилин
    gcTime: 30 * 60 * 1000,
  });

  // Fallback для підказок якщо RPC не доступний
  const fallbackSuggestions = async (prefix: string): Promise<SuggestionResult[]> => {
    const { data } = await supabase
      .from('verses')
      .select('translation_uk, translation_en')
      .or(
        language === 'uk'
          ? `translation_uk.ilike.%${prefix}%`
          : `translation_en.ilike.%${prefix}%`
      )
      .limit(6);

    const words = new Set<string>();
    data?.forEach((verse) => {
      const text = language === 'uk' ? verse.translation_uk : verse.translation_en;
      if (text) {
        const matches = text.toLowerCase().match(new RegExp(`\\b\\w*${prefix.toLowerCase()}\\w*\\b`, 'g'));
        matches?.forEach((w: string) => w.length > 2 && words.add(w));
      }
    });

    return Array.from(words).slice(0, 6).map((w, i) => ({
      suggestion: w,
      frequency: 6 - i,
      source: 'verses',
    }));
  };

  // Уніфікований пошук - використовуємо RPC unified_search з fallback
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['unified-search', debouncedQuery, language],
    queryFn: async (): Promise<UnifiedSearchResult[]> => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];

      try {
        // Використовуємо RPC функцію unified_search з Full-Text Search
        const { data, error } = await supabase.rpc('unified_search', {
          search_query: debouncedQuery,
          language_code: language,
          search_types: ['verses', 'blog'],
          limit_per_type: 8,
        });

        if (error) {
          console.error('Unified search RPC error:', error);
          // Fallback на простий пошук якщо RPC не працює
          return fallbackSearch(debouncedQuery);
        }

        return (data || []).map((item: UnifiedSearchResult) => ({
          result_type: item.result_type,
          result_id: item.result_id,
          title: item.title,
          subtitle: item.subtitle,
          snippet: item.snippet,
          href: item.href,
          relevance: item.relevance,
          matched_in: item.matched_in,
        }));
      } catch {
        return fallbackSearch(debouncedQuery);
      }
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 хвилин
    gcTime: 30 * 60 * 1000, // 30 хвилин
  });

  // Fallback пошук якщо RPC функція не доступна
  const fallbackSearch = async (searchQuery: string): Promise<UnifiedSearchResult[]> => {
    const searchResults: UnifiedSearchResult[] = [];
    const pattern = `%${searchQuery}%`;

    try {
      // Пошук у віршах
      const { data: verses } = await supabase
        .from('verses')
        .select(`
          id,
          verse_number,
          translation_uk,
          translation_en,
          chapters!inner(
            chapter_number,
            title_uk,
            title_en,
            canto_id,
            books!inner(slug, title_uk, title_en),
            cantos(canto_number)
          )
        `)
        .or(
          language === 'uk'
            ? `translation_uk.ilike.${pattern},synonyms_uk.ilike.${pattern}`
            : `translation_en.ilike.${pattern},synonyms_en.ilike.${pattern}`
        )
        .limit(8);

      verses?.forEach((verse: any) => {
        const book = verse.chapters.books;
        const chapter = verse.chapters;
        const canto = verse.chapters.cantos;

        const href = canto?.canto_number
          ? getLocalizedPath(`/lib/${book.slug}/${canto.canto_number}/${chapter.chapter_number}/${verse.verse_number}`)
          : getLocalizedPath(`/lib/${book.slug}/${chapter.chapter_number}/${verse.verse_number}`);

        searchResults.push({
          result_type: 'verse',
          result_id: verse.id,
          title: canto?.canto_number
            ? `${book.slug.toUpperCase()} ${canto.canto_number}.${chapter.chapter_number}.${verse.verse_number}`
            : `${book.slug.toUpperCase()} ${chapter.chapter_number}.${verse.verse_number}`,
          subtitle: language === 'uk' ? chapter.title_uk : chapter.title_en,
          snippet:
            (language === 'uk' ? verse.translation_uk : verse.translation_en)?.substring(0, 100) +
            '...',
          href,
          relevance: 1,
          matched_in: ['verse'],
        });
      });

      // Пошук у блозі
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, slug, title_uk, title_en, excerpt_uk, excerpt_en')
        .eq('is_published', true)
        .or(
          language === 'uk'
            ? `title_uk.ilike.${pattern},content_uk.ilike.${pattern}`
            : `title_en.ilike.${pattern},content_en.ilike.${pattern}`
        )
        .limit(5);

      posts?.forEach((post) => {
        searchResults.push({
          result_type: 'blog',
          result_id: post.id,
          title: language === 'uk' ? post.title_uk : post.title_en,
          subtitle: t('Блог', 'Blog'),
          snippet: (language === 'uk' ? post.excerpt_uk : post.excerpt_en)?.substring(0, 100),
          href: getLocalizedPath(`/blog/${post.slug}`),
          relevance: 0.8,
          matched_in: ['blog'],
        });
      });
    } catch (error) {
      console.error('Fallback search error:', error);
    }

    return searchResults;
  };

  // Офлайн-пошук (коли немає мережі і є завантажені дані)
  const { data: offlineResults = [], isLoading: isLoadingOffline } = useQuery({
    queryKey: ['offline-search', debouncedQuery, language],
    queryFn: async (): Promise<UnifiedSearchResult[]> => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];

      const offResults = await offlineSearch(debouncedQuery, {
        language,
        limit: 15,
      });

      return offResults.map((r: OfflineSearchResult) => {
        const href = r.cantoNumber
          ? getLocalizedPath(`/lib/${r.bookSlug}/${r.cantoNumber}/${r.chapterNumber}/${r.verseNumber}`)
          : getLocalizedPath(`/lib/${r.bookSlug}/${r.chapterNumber}/${r.verseNumber}`);

        return {
          result_type: 'verse' as const,
          result_id: r.verseId,
          title: r.cantoNumber
            ? `${r.bookSlug.toUpperCase()} ${r.cantoNumber}.${r.chapterNumber}.${r.verseNumber}`
            : `${r.bookSlug.toUpperCase()} ${r.chapterNumber}.${r.verseNumber}`,
          subtitle: r.matchedField.replace(/_uk|_en/g, ''),
          snippet: r.snippet,
          href,
          relevance: -r.rank,
          matched_in: [r.matchedField],
        };
      });
    },
    enabled: !isOnline && offlineAvailable && debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  // Використовуємо офлайн-результати коли немає мережі
  const activeResults = !isOnline && offlineAvailable ? offlineResults : results;
  const activeLoading = !isOnline ? isLoadingOffline : isLoading;

  // Групуємо результати по типу
  const groupedResults = useMemo(() => {
    return {
      verses: activeResults.filter((r) => r.result_type === 'verse'),
      blog: activeResults.filter((r) => r.result_type === 'blog'),
      lectures: activeResults.filter((r) => r.result_type === 'lecture'),
      letters: activeResults.filter((r) => r.result_type === 'letter'),
    };
  }, [activeResults]);

  // Обробка вибору результату
  const handleSelect = useCallback(
    (href: string) => {
      if (query.trim().length >= 2) {
        addToHistory(query.trim(), activeResults.length);
      }
      navigate(href);
      onOpenChange(false);
    },
    [query, activeResults.length, addToHistory, navigate, onOpenChange]
  );

  // Вибір з історії
  const handleHistorySelect = useCallback(
    (historyQuery: string) => {
      setQuery(historyQuery);
    },
    []
  );

  // Іконка для типу результату
  const getIcon = (type: string) => {
    switch (type) {
      case 'verse':
        return <BookOpen className="h-4 w-4 text-primary" />;
      case 'blog':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'lecture':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'letter':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const hasResults = activeResults.length > 0;
  const showHistory = !query && history.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t('Шукати вірші, статті...', 'Search verses, articles...')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[400px]">
        {/* Офлайн-індикатор */}
        {!isOnline && offlineAvailable && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            <WifiOff className="h-3 w-3" />
            {t('Офлайн-пошук по завантажених книгах', 'Offline search in downloaded books')}
          </div>
        )}

        {/* Стан завантаження */}
        {activeLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              {t('Пошук...', 'Searching...')}
            </span>
          </div>
        )}

        {/* Історія пошуку (коли немає запиту) */}
        {showHistory && (
          <CommandGroup
            heading={
              <div className="flex items-center justify-between">
                <span>{t('Останні пошуки', 'Recent searches')}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearHistory();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {t('Очистити', 'Clear')}
                </button>
              </div>
            }
          >
            {history.slice(0, 5).map((item) => (
              <CommandItem
                key={item.query + item.timestamp}
                onSelect={() => handleHistorySelect(item.query)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{item.query}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.resultCount !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {item.resultCount}
                    </Badge>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item.query);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Автокомпліт підказки (при 1-2 символах) */}
        {suggestions.length > 0 && query.length >= 1 && query.length < 2 && !isLoading && (
          <CommandGroup heading={t('Підказки', 'Suggestions')}>
            {suggestions.map((item, idx) => (
              <CommandItem
                key={`suggestion-${idx}`}
                onSelect={() => setQuery(item.suggestion)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>{item.suggestion}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.frequency}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Порожній стан */}
        {!activeLoading && query.length >= 2 && !hasResults && (
          <CommandEmpty>
            {!isOnline && !offlineAvailable
              ? t('Немає мережі та завантажених книг для пошуку', 'No network and no downloaded books for search')
              : t('Нічого не знайдено. Спробуйте інший запит.', 'No results found. Try another query.')}
          </CommandEmpty>
        )}

        {/* Підказка для короткого запиту (тільки якщо немає підказок) */}
        {!activeLoading && query.length > 0 && query.length < 2 && suggestions.length === 0 && !isLoadingSuggestions && (
          <CommandEmpty>
            {t('Введіть мінімум 2 символи', 'Enter at least 2 characters')}
          </CommandEmpty>
        )}

        {/* Результати: Вірші */}
        {groupedResults.verses.length > 0 && (
          <CommandGroup heading={t('Священні тексти', 'Sacred Texts')}>
            {groupedResults.verses.map((result) => (
              <CommandItem
                key={result.result_id}
                onSelect={() => handleSelect(result.href)}
                className="flex items-start gap-3 py-3"
              >
                {getIcon(result.result_type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">{result.title}</span>
                  </div>
                  {result.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                  )}
                  {result.snippet && (
                    <p
                      className="text-sm text-muted-foreground line-clamp-2 mt-1"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.snippet) }}
                    />
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Результати: Блог */}
        {groupedResults.blog.length > 0 && (
          <>
            {groupedResults.verses.length > 0 && <CommandSeparator />}
            <CommandGroup heading={t('Блог', 'Blog')}>
              {groupedResults.blog.map((result) => (
                <CommandItem
                  key={result.result_id}
                  onSelect={() => handleSelect(result.href)}
                  className="flex items-start gap-3 py-3"
                >
                  {getIcon(result.result_type)}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{result.title}</span>
                    {result.snippet && (
                      <p
                        className="text-sm text-muted-foreground line-clamp-2 mt-1"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.snippet) }}
                      />
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Швидкий перехід на сторінку пошуку */}
        {query.length >= 2 && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  addToHistory(query.trim());
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                  onOpenChange(false);
                }}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                <span>
                  {t('Розширений пошук за запитом', 'Extended search for')} "{query}"
                </span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>

      {/* Підказка клавіатурних скорочень */}
      <div className="border-t px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">↑↓</kbd>{' '}
            {t('Навігація', 'Navigate')}
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">↵</kbd> {t('Вибрати', 'Select')}
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Esc</kbd>{' '}
            {t('Закрити', 'Close')}
          </span>
        </div>
      </div>
    </CommandDialog>
  );
}

/**
 * Hook для глобального пошуку з Cmd+K / Ctrl+K
 */
export function useUnifiedSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) або Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
}
