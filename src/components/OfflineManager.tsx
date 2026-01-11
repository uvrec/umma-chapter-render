/**
 * OfflineManager - UI для керування офлайн завантаженнями
 *
 * Функції:
 * - Перегляд завантажених книг/глав
 * - Завантаження нового контенту
 * - Видалення з кешу
 * - Статистика сховища
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Download,
  Trash2,
  HardDrive,
  Book,
  CheckCircle,
  Wifi,
  WifiOff,
  Loader2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useOfflineDownload } from '@/hooks/useOfflineDownload';
import { toast } from 'sonner';

interface BookWithChapters {
  id: string;
  slug: string;
  title_ua: string;
  title_en: string;
  has_cantos: boolean;
  chapters: Array<{
    id: string;
    chapter_number: number;
    title_ua: string;
  }>;
  cantos?: Array<{
    id: string;
    canto_number: number;
    title_ua: string;
    chapters: Array<{
      id: string;
      chapter_number: number;
      title_ua: string;
    }>;
  }>;
}

export function OfflineManager() {
  const {
    progress,
    cachedChapters,
    isOnline,
    downloadBook,
    removeChapter,
    removeBook,
    clearCache,
    resetProgress,
    isChapterCached,
    getStats,
  } = useOfflineDownload();

  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const stats = getStats();

  // Завантажуємо список книг з главами
  const { data: books, isLoading } = useQuery({
    queryKey: ['offline-books-list'],
    queryFn: async () => {
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('id, slug, title_ua, title_en, has_cantos')
        .order('title_ua');

      if (booksError) throw booksError;

      const result: BookWithChapters[] = [];

      for (const book of booksData || []) {
        const bookWithChapters: BookWithChapters = {
          ...book,
          chapters: [],
          cantos: [],
        };

        if (book.has_cantos) {
          // Книга з піснями (СБ)
          const { data: cantos } = await supabase
            .from('cantos')
            .select('id, canto_number, title_ua')
            .eq('book_id', book.id)
            .order('canto_number');

          for (const canto of cantos || []) {
            const { data: chapters } = await supabase
              .from('chapters')
              .select('id, chapter_number, title_ua')
              .eq('canto_id', canto.id)
              .order('chapter_number');

            bookWithChapters.cantos?.push({
              ...canto,
              chapters: chapters || [],
            });
          }
        } else {
          // Книга без пісень (БГ, Ізо)
          const { data: chapters } = await supabase
            .from('chapters')
            .select('id, chapter_number, title_ua')
            .eq('book_id', book.id)
            .order('chapter_number');

          bookWithChapters.chapters = chapters || [];
        }

        result.push(bookWithChapters);
      }

      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });

  // Підрахувати скільки глав книги закешовано
  const getBookCachedCount = (book: BookWithChapters): { cached: number; total: number } => {
    let total = 0;
    let cached = 0;

    if (book.has_cantos && book.cantos) {
      for (const canto of book.cantos) {
        for (const chapter of canto.chapters) {
          total++;
          if (isChapterCached(chapter.id)) cached++;
        }
      }
    } else {
      for (const chapter of book.chapters) {
        total++;
        if (isChapterCached(chapter.id)) cached++;
      }
    }

    return { cached, total };
  };

  // Toggle expanded book
  const toggleBook = (bookId: string) => {
    setExpandedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  // Завантажити книгу
  const handleDownloadBook = async (book: BookWithChapters, cantoId?: string) => {
    resetProgress();
    const success = await downloadBook(book.id, book.slug, cantoId);
    if (success) {
      toast.success(`"${book.title_ua}" завантажено для офлайн`);
    } else {
      toast.error('Помилка завантаження');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header з статусом */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Офлайн режим</h3>
            <p className="text-sm text-muted-foreground">
              Завантажуйте книги для читання без інтернету
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="outline" className="gap-1">
              <Wifi className="h-3 w-3" />
              Онлайн
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <WifiOff className="h-3 w-3" />
              Офлайн
            </Badge>
          )}
        </div>
      </div>

      {/* Статистика */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.totalChapters}</div>
              <div className="text-xs text-muted-foreground">Глав</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalBooks}</div>
              <div className="text-xs text-muted-foreground">Книг</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.estimatedSize}</div>
              <div className="text-xs text-muted-foreground">Розмір</div>
            </div>
          </div>

          {stats.totalChapters > 0 && (
            <div className="mt-4 pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Очистити весь кеш
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Очистити офлайн кеш?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Це видалить всі {stats.totalChapters} завантажених глав.
                      Вам потрібно буде завантажити їх знову.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Скасувати</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        clearCache();
                        toast.success('Кеш очищено');
                      }}
                    >
                      Очистити
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Прогрес завантаження */}
      {progress.status === 'downloading' && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{progress.currentItem}</span>
                <span className="font-medium">
                  {progress.current} / {progress.total}
                </span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список книг */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {books?.map(book => {
            const { cached, total } = getBookCachedCount(book);
            const isFullyCached = cached === total && total > 0;
            const isExpanded = expandedBooks.has(book.id);

            return (
              <Collapsible
                key={book.id}
                open={isExpanded}
                onOpenChange={() => toggleBook(book.id)}
              >
                <Card className={cn(isFullyCached && 'border-green-500/50')}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <Book className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-base">{book.title_ua}</CardTitle>
                        </div>

                        <div className="flex items-center gap-2">
                          {isFullyCached ? (
                            <Badge variant="default" className="gap-1 bg-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Завантажено
                            </Badge>
                          ) : cached > 0 ? (
                            <Badge variant="secondary">
                              {cached} / {total}
                            </Badge>
                          ) : (
                            <Badge variant="outline">{total} глав</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-4">
                      {/* Кнопка завантажити всю книгу */}
                      {!isFullyCached && isOnline && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mb-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadBook(book);
                          }}
                          disabled={progress.status === 'downloading'}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Завантажити всю книгу ({total} глав)
                        </Button>
                      )}

                      {/* Список глав або пісень */}
                      {book.has_cantos && book.cantos ? (
                        <div className="space-y-2">
                          {book.cantos.map(canto => (
                            <div key={canto.id} className="pl-4 border-l-2">
                              <div className="flex items-center justify-between py-1">
                                <span className="text-sm font-medium">
                                  Пісня {canto.canto_number}: {canto.title_ua}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {canto.chapters.filter(c => isChapterCached(c.id)).length} / {canto.chapters.length}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {book.chapters.map(chapter => {
                            const isCached = isChapterCached(chapter.id);
                            return (
                              <div
                                key={chapter.id}
                                className={cn(
                                  'text-xs px-2 py-1 rounded border flex items-center justify-between',
                                  isCached
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : 'bg-muted/50'
                                )}
                              >
                                <span>Гл. {chapter.chapter_number}</span>
                                {isCached && (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Кнопка видалити книгу з кешу */}
                      {cached > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-4 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBook(book.id);
                            toast.success(`"${book.title_ua}" видалено з кешу`);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Видалити з офлайн ({cached} глав)
                        </Button>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Підказка якщо офлайн */}
      {!isOnline && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
          <CardContent className="pt-6 text-center">
            <WifiOff className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Ви офлайн. Доступні тільки завантажені книги.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OfflineManager;
