import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Mic, Mail } from 'lucide-react';
export const Library = () => {
  const {
    language,
    t
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
      } = await supabase.from('books').select('id, slug, title_ua, title_en, cover_image_url, has_cantos').eq('is_published', true).order('display_order');
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

        {/* Library Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Link
            to="/library"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('Книги', 'Books')}</span>
            <span className="text-xs opacity-80">({books.length})</span>
          </Link>
          <Link
            to="/library/lectures"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span>{t('Лекції', 'Lectures')}</span>
          </Link>
          <Link
            to="/library/letters"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>{t('Листи', 'Letters')}</span>
          </Link>
        </div>

        {/* Loading skeleton - адаптивна сітка */}
        {isLoading && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-3 sm:h-4 w-3/4 mx-auto" />
              </div>)}
          </div>}

        {/* Books Grid - адаптивна сітка */}
        {!isLoading && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {books.map(book => <Link key={book.id} to={`/veda-reader/${book.slug}`} className="group cursor-pointer">
                {/* Book Cover */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
                  {book.cover_image_url ? <img src={book.cover_image_url} alt={language === 'ua' ? book.title_ua : book.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-3xl sm:text-5xl opacity-50">📖</span>
                    </div>}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Book Title - адаптивний */}
                <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors px-1">
                  {language === 'ua' ? book.title_ua : book.title_en}
                </h3>
              </Link>)}
          </div>}

        {/* Empty state */}
        {!isLoading && books.length === 0 && <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t('Книги ще не додані', 'No books available yet')}
            </p>
          </div>}
      </div>
    </div>;
};