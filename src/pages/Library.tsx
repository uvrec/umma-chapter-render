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
export const Library = () => {
  const {
    language,
    t,
    getLocalizedPath
  } = useLanguage();
  const {
    data: books = [],
    isLoading
  } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('books').select('id, slug, title_uk, title_en, cover_image_url, has_cantos').eq('is_published', true).order('display_order');
      if (error) throw error;
      return data;
    }
  });

  return <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Simple title - адаптивний */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center text-primary font-serif">
            {t('Бібліотека', 'Library')}
          </h1>
        </div>

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
            {/* Loading skeleton - адаптивна сітка */}
            {isLoading && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    <Skeleton className="h-3 sm:h-4 w-3/4 mx-auto" />
                  </div>)}
              </div>}

            {/* Books Grid - адаптивна сітка */}
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

                    {/* Book Title - адаптивний */}
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