import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';

export const Library = () => {
  const { language, t } = useLanguage();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, slug, title_ua, title_en, cover_image_url, has_cantos')
        .eq('is_published', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Simple title - minimal spacing */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {t('Бібліотека', 'Library')}
          </h1>
          <p className="text-muted-foreground">
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

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Books Grid - 4 columns on desktop */}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/veda-reader/${book.slug}`}
                className="group cursor-pointer"
              >
                {/* Book Cover */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt={language === 'ua' ? book.title_ua : book.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-5xl opacity-50">📖</span>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Book Title */}
                <h3 className="mt-3 text-sm font-medium text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors px-1">
                  {language === 'ua' ? book.title_ua : book.title_en}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && books.length === 0 && (
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
