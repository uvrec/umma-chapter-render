import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';

export const Library = () => {
  const { language, t } = useLanguage();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (bookId: string) => {
    setFailedImages(prev => new Set(prev).add(bookId));
  };

  const { data: books = [], isLoading, error, isError } = useQuery({
    queryKey: ['library-books'],
    queryFn: async () => {
      console.log('[Library] Fetching books from database...');
      const { data, error } = await supabase
        .from('books')
        .select('id, slug, title_ua, title_en, cover_image_url, has_cantos')
        .eq('is_published', true)
        .order('display_order', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('[Library] Failed to fetch books:', error);
        throw error;
      }

      console.log('[Library] Successfully fetched books:', data?.length, data);
      return data || [];
    },
    // Force refetch on mount to get fresh data
    refetchOnMount: true,
    staleTime: 0,
  });

  // Debug logging
  console.log('[Library] Render state:', { isLoading, isError, booksCount: books.length, error });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Simple title - адаптивний */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            {t('Бібліотека', 'Library')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t(
              'Повна колекція ведичної літератури з коментарями Його Божественної Милості А. Ч. Бгактіведанти Свамі Прабгупади',
              'Complete collection of Vedic literature with commentaries by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada'
            )}
          </p>
        </div>

        {/* Future tabs - commented for now */}
        {/* <div className="flex gap-6 mb-8 border-b border-border">
          <button className="pb-3 border-b-2 border-primary font-medium">
            {t('Книги', 'Books')}
            <span className="ml-2 text-sm text-muted-foreground">({books.length})</span>
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground transition-colors">
            {t('Лекції', 'Transcripts')}
          </button>
          <button className="pb-3 text-muted-foreground hover:text-foreground transition-colors">
            {t('Листи', 'Letters')}
          </button>
        </div> */}

        {/* Loading skeleton - адаптивна сітка */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-3 sm:h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Books Grid - адаптивна сітка */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/veda-reader/${book.slug}`}
                className="group cursor-pointer"
              >
                {/* Book Cover */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
                  {book.cover_image_url && !failedImages.has(book.id) ? (
                    <img
                      src={book.cover_image_url}
                      alt={language === 'ua' ? book.title_ua : book.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={() => handleImageError(book.id)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-3xl sm:text-5xl opacity-50">📖</span>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Book Title - адаптивний */}
                <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors px-1">
                  {language === 'ua' ? book.title_ua : book.title_en}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-destructive mb-2">
              {t('Помилка завантаження книг', 'Error loading books')}
            </p>
            <p className="text-sm text-muted-foreground">
              {error?.message || t('Спробуйте оновити сторінку', 'Please try refreshing the page')}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t('Книги ще не додані', 'No books available yet')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
