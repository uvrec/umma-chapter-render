import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Mic, Mail, ChevronRight } from 'lucide-react';
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
  // Section cards for navigation
  const sectionCards = [
    {
      id: 'lectures',
      icon: Mic,
      title: t('Лекції', 'Transcripts'),
      description: t(
        'Лекції та бесіди Шріли Прабгупади',
        'Lectures and conversations by Srila Prabhupada'
      ),
      href: '/library/lectures',
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-500',
    },
    {
      id: 'letters',
      icon: Mail,
      title: t('Листи', 'Letters'),
      description: t(
        'Листування Шріли Прабгупади (1947-1977)',
        'Correspondence of Srila Prabhupada (1947-1977)'
      ),
      href: '/library/letters',
      color: 'from-amber-500/20 to-amber-600/20',
      iconColor: 'text-amber-500',
    },
  ];

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
          </TabsContent>

          {/* Lectures Tab */}
          <TabsContent value="lectures">
            <div className="space-y-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <Link to="/library/lectures">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20`}>
                          <Mic className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {t('Лекції та бесіди', 'Lectures & Conversations')}
                          </h3>
                          <p className="text-muted-foreground">
                            {t(
                              'Транскрипти лекцій Шріли Прабгупади з Бгаґавад-ґіти, Шрімад-Бгаґаватам та інших',
                              'Transcripts of Srila Prabhupada\'s lectures on Bhagavad-gita, Srimad-Bhagavatam and more'
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <div className="text-center py-8">
                <Link
                  to="/library/lectures"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  {t('Переглянути всі лекції', 'Browse all lectures')}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Letters Tab */}
          <TabsContent value="letters">
            <div className="space-y-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <Link to="/library/letters">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20`}>
                          <Mail className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {t('Листи Шріли Прабгупади', 'Letters of Srila Prabhupada')}
                          </h3>
                          <p className="text-muted-foreground">
                            {t(
                              'Листування з учнями та відомими особами (1947-1977)',
                              'Correspondence with disciples and notable figures (1947-1977)'
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <div className="text-center py-8">
                <Link
                  to="/library/letters"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  {t('Переглянути всі листи', 'Browse all letters')}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};