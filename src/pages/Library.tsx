import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Mic, Mail } from 'lucide-react';
import { LecturesContent } from '@/components/library/LecturesContent';
import { LettersContent } from '@/components/library/LettersContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileLibraryList } from '@/components/mobile/MobileLibraryList';
export const Library = () => {
  const {
    language,
    t,
    getLocalizedPath
  } = useLanguage();
  const isMobile = useIsMobile();

  // Fetch books with chapter counts for mobile view
  const {
    data: books = [],
    isLoading
  } = useQuery({
    queryKey: ['books-with-counts'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('books').select('id, slug, title_uk, title_en, cover_image_url, has_cantos').eq('is_published', true).order('display_order');
      if (error) throw error;

      // Fetch chapter/canto counts for each book
      const booksWithCounts = await Promise.all(
        (data || []).map(async (book) => {
          if (book.has_cantos) {
            const { count } = await supabase
              .from('cantos')
              .select('*', { count: 'exact', head: true })
              .eq('book_id', book.id);
            return { ...book, chapter_count: count || 0 };
          } else {
            const { count } = await supabase
              .from('chapters')
              .select('*', { count: 'exact', head: true })
              .eq('book_id', book.id);
            return { ...book, chapter_count: count || 0 };
          }
        })
      );

      return booksWithCounts;
    }
  });

  return <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-3 sm:py-4">
        {/* Tabs for sections */}
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="books" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">{t('Книги', 'Books')}</span>
              <span className="sm:hidden">{t('Книги', 'Books')}</span>
            </TabsTrigger>
            <TabsTrigger value="lectures" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">{t('Лекції', 'Transcripts')}</span>
              <span className="sm:hidden">{t('Лекції', 'Lectures')}</span>
            </TabsTrigger>
            <TabsTrigger value="letters" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">{t('Листи', 'Letters')}</span>
              <span className="sm:hidden">{t('Листи', 'Letters')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Books Tab */}
          <TabsContent value="books">
            {/* Mobile: Swipeable list (NeuBibel style) */}
            {isMobile ? (
              <MobileLibraryList books={books} isLoading={isLoading} />
            ) : (
              <>
                {/* Desktop: Loading skeleton */}
                {isLoading && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => <div key={i} className="space-y-2">
                        <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                        <Skeleton className="h-3 sm:h-4 w-3/4 mx-auto" />
                      </div>)}
                  </div>}

                {/* Desktop: Books Grid with covers */}
                {!isLoading && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {books.map(book => <Link key={book.id} to={getLocalizedPath(`/lib/${book.slug}`)} className="group cursor-pointer">
                        {/* Book Cover */}
                        <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
                          {book.cover_image_url ? <img src={book.cover_image_url} alt={language === 'uk' ? book.title_uk : book.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                              <span className="text-3xl sm:text-5xl opacity-50">📖</span>
                            </div>}

                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>

                        {/* Book Title */}
                        <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors px-1">
                          {language === 'uk' ? book.title_uk : book.title_en}
                        </h3>
                      </Link>)}
                  </div>}

                {/* Empty state */}
                {!isLoading && books.length === 0 && <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {t('Книги ще не додані', 'No books available yet')}
                    </p>
                  </div>}
              </>
            )}
          </TabsContent>

          {/* Lectures Tab */}
          <TabsContent value="lectures">
            <LecturesContent />
          </TabsContent>

          {/* Letters Tab */}
          <TabsContent value="letters">
            <LettersContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};