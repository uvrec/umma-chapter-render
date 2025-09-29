import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const BookOverview = () => {
  const { bookId } = useParams();
  const { language, t } = useLanguage();

  // Fetch book
  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('slug', bookId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId
  });

  // Fetch cantos if book has them
  const { data: cantos = [], isLoading: cantosLoading } = useQuery({
    queryKey: ['cantos', book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase
        .from('cantos')
        .select('*')
        .eq('book_id', book.id)
        .order('canto_number');
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && book?.has_cantos === true
  });

  // Fetch chapters if book doesn't have cantos
  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ['chapters', book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', book.id)
        .order('chapter_number');
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && book?.has_cantos !== true
  });

  const isLoading = cantosLoading || chaptersLoading;

  const bookTitle = language === 'ua' ? book?.title_ua : book?.title_en;
  const bookDescription = language === 'ua' ? book?.description_ua : book?.description_en;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            {t('Завантаження...', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: t('Бібліотека', 'Library'), href: '/library' },
            { label: bookTitle || '' }
          ]}
        />

        <div className="mt-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book cover */}
            {book?.cover_image_url && (
              <div className="lg:w-1/3">
                <img 
                  src={book.cover_image_url} 
                  alt={bookTitle}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
              </div>
            )}
            
            {/* Book info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{bookTitle}</h1>
              {bookDescription && (
                <p className="text-lg text-muted-foreground mb-6">
                  {bookDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cantos or Chapters list */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {book?.has_cantos 
              ? t('Cantos', 'Cantos')
              : t('Глави', 'Chapters')
            }
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {book?.has_cantos ? (
              // Display cantos
              cantos.map((canto) => (
                <Link 
                  key={canto.id}
                  to={`/veda-reader/${bookId}/canto/${canto.canto_number}`}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">
                            Canto {canto.canto_number}
                          </p>
                          <h3 className="font-semibold text-foreground truncate">
                            {language === 'ua' ? canto.title_ua : canto.title_en}
                          </h3>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            ) : (
              // Display chapters
              chapters.map((chapter) => (
                <Link 
                  key={chapter.id}
                  to={`/veda-reader/${bookId}/${chapter.chapter_number}`}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">
                            {t('Глава', 'Chapter')} {chapter.chapter_number}
                          </p>
                          <h3 className="font-semibold text-foreground truncate">
                            {language === 'ua' ? chapter.title_ua : chapter.title_en}
                          </h3>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
