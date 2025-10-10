import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  // Fetch intro chapters
  const { data: introChapters = [], isLoading: introLoading } = useQuery({
    queryKey: ['intro-chapters', book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase
        .from('intro_chapters')
        .select('*')
        .eq('book_id', book.id)
        .order('display_order');
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id
  });

  const isLoading = cantosLoading || chaptersLoading || introLoading;

  const bookTitle = language === 'ua' ? book?.title_ua : book?.title_en;
  const bookDescription = language === 'ua' ? book?.description_ua : book?.description_en;

  // Canto cover image comes from DB field if present
  const getCantoCoverImage = (_cantoNumber: number) => {
    return null;
  };
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
            {book?.cover_image_url && bookId !== 'srimad-bhagavatam' && (
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
              
              {/* Intro chapters links */}
              {introChapters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Вступні матеріали:</h3>
                  <ul className="space-y-2">
                    {introChapters.map((intro) => (
                      <li key={intro.id}>
                        <Link 
                          to={`/veda-reader/${bookId}/intro/${intro.slug}`}
                          className="text-primary hover:underline"
                        >
                          {language === 'ua' ? intro.title_ua : intro.title_en}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cantos or Chapters list */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {book?.has_cantos 
              ? t('Пісні', 'Cantos')
              : t('Глави', 'Chapters')
            }
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {book?.has_cantos ? (
              // Display cantos as cards like in library
              cantos.map((canto) => {
                const coverImage = canto.cover_image_url || null;
                const cantoTitle = language === 'ua' ? canto.title_ua : canto.title_en;
                const cantoDescription = language === 'ua' ? canto.description_ua : canto.description_en;
                
                return (
                  <Card key={canto.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                    <div className="aspect-[3/4] rounded-t-lg overflow-hidden bg-transparent">
                      <Link to={`/veda-reader/${bookId}/canto/${canto.canto_number}`} className="block w-full h-full">
                        {coverImage ? (
                          <img 
                            src={coverImage} 
                            alt={cantoTitle}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                            <div className="text-center p-4">
                              <div className="text-6xl mb-4 text-primary">ॐ</div>
                              {cantoTitle && (
                                <div className="text-lg font-semibold text-foreground/80 line-clamp-3">
                                  {cantoTitle}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Link>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1 text-center">
                        {language === 'ua' ? 'Пісня' : 'Canto'} {canto.canto_number}
                      </p>
                      {cantoTitle && (
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-center">
                          {cantoTitle}
                        </h3>
                      )}
                      {cantoDescription && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3 text-center font-light">
                          {cantoDescription}
                        </p>
                      )}
                      <div className="flex items-center justify-center">
                        <Link to={`/veda-reader/${bookId}/canto/${canto.canto_number}`}>
                          <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {language === 'ua' ? 'Читати' : 'Read'}
                          </Badge>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
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