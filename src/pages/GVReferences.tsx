// src/pages/GVReferences.tsx
// Gaudiya Vaishnava Book References Catalogue

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  BookOpen,
  Users,
  Library,
  Search,
  ExternalLink,
  Star,
  ChevronRight,
} from 'lucide-react';
import {
  fetchAuthors,
  fetchCataloguesWithBooks,
  fetchReferenceStats,
} from '@/services/gvReferencesService';
import {
  eraDisplayNames,
  categoryDisplayNames,
  importanceLevelNames,
  type GVAuthor,
  type GVBookCatalogue,
  type AuthorEra,
} from '@/types/gv-references';

export const GVReferences = () => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data
  const { data: catalogues = [], isLoading: loadingCatalogues } = useQuery({
    queryKey: ['gv-catalogues'],
    queryFn: fetchCataloguesWithBooks,
  });

  const { data: authors = [], isLoading: loadingAuthors } = useQuery({
    queryKey: ['gv-authors'],
    queryFn: () => fetchAuthors(),
  });

  const { data: stats } = useQuery({
    queryKey: ['gv-stats'],
    queryFn: fetchReferenceStats,
  });

  // Group authors by era
  const authorsByEra = authors.reduce(
    (acc, author) => {
      const era = author.era || 'modern';
      if (!acc[era]) acc[era] = [];
      acc[era].push(author);
      return acc;
    },
    {} as Record<AuthorEra, GVAuthor[]>
  );

  // Filter catalogues by search
  const filteredCatalogues = catalogues.map((catalogue) => ({
    ...catalogue,
    books: catalogue.books?.filter((book) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        book.title_en?.toLowerCase().includes(query) ||
        book.title_ua?.toLowerCase().includes(query) ||
        book.title_transliteration?.toLowerCase().includes(query) ||
        book.title_sanskrit?.includes(searchQuery)
      );
    }),
  })).filter((c) => !searchQuery || (c.books && c.books.length > 0));

  const eraOrder: AuthorEra[] = ['founders', 'gosvamis', 'later_acharyas', 'modern', 'prabhupada_disciples'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Title */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-primary font-serif">
            {t('Бібліографія ґаудіа-вайшнавізму', 'Gaudiya Vaishnava Bibliography')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Повний каталог священних текстів та творів ачар\'їв традиції',
              'Complete catalogue of sacred texts and works by acharyas of the tradition'
            )}
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{stats.totalBooks}</div>
              <div className="text-xs text-muted-foreground">{t('Книг', 'Books')}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{stats.totalAuthors}</div>
              <div className="text-xs text-muted-foreground">{t('Авторів', 'Authors')}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{stats.availableInApp}</div>
              <div className="text-xs text-muted-foreground">{t('В додатку', 'In App')}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="catalogues" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="catalogues" className="flex items-center gap-2">
              <Library className="w-4 h-4" />
              <span>{t('Каталоги', 'Catalogues')}</span>
            </TabsTrigger>
            <TabsTrigger value="authors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{t('Ачар\'ї', 'Acharyas')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Catalogues Tab */}
          <TabsContent value="catalogues">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('Пошук книг...', 'Search books...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Loading */}
            {loadingCatalogues && (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            )}

            {/* Catalogues */}
            {!loadingCatalogues && (
              <Accordion type="multiple" className="space-y-2">
                {filteredCatalogues.map((catalogue) => (
                  <AccordionItem
                    key={catalogue.id}
                    value={catalogue.id}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div className="text-left">
                          <div className="font-medium">
                            {language === 'ua' ? catalogue.name_ua : catalogue.name_en}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {catalogue.books?.length || 0} {t('книг', 'books')}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 py-2">
                        {catalogue.books?.map((book) => (
                          <div
                            key={book.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              {/* Sanskrit title */}
                              {book.title_sanskrit && (
                                <div className="text-sm text-muted-foreground font-serif">
                                  {book.title_sanskrit}
                                </div>
                              )}
                              {/* Transliteration */}
                              <div className="font-medium text-primary">
                                {book.title_transliteration}
                              </div>
                              {/* Translation */}
                              <div className="text-sm text-foreground">
                                {language === 'ua' ? book.title_ua : book.title_en}
                              </div>
                              {/* Badges */}
                              <div className="flex flex-wrap gap-1 mt-1">
                                {book.importance_level >= 5 && (
                                  <Badge variant="default" className="text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    {t('Необхідний', 'Essential')}
                                  </Badge>
                                )}
                                {book.is_available_in_app && (
                                  <Badge variant="secondary" className="text-xs">
                                    {t('В додатку', 'In App')}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {/* Link to book if available */}
                            {book.is_available_in_app && book.internal_book_slug && (
                              <Link
                                to={`/veda-reader/${book.internal_book_slug}`}
                                className="flex items-center gap-1 text-sm text-primary hover:underline shrink-0"
                              >
                                {t('Читати', 'Read')}
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Empty state */}
            {!loadingCatalogues && filteredCatalogues.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? t('Книги не знайдено', 'No books found')
                    : t('Каталоги ще не додані', 'No catalogues yet')}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Authors Tab */}
          <TabsContent value="authors">
            {loadingAuthors && (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            )}

            {!loadingAuthors && (
              <div className="space-y-8">
                {eraOrder.map((era) => {
                  const eraAuthors = authorsByEra[era];
                  if (!eraAuthors || eraAuthors.length === 0) return null;

                  return (
                    <div key={era}>
                      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        {language === 'ua'
                          ? eraDisplayNames[era].ua
                          : eraDisplayNames[era].en}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({eraAuthors.length})
                        </span>
                      </h2>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {eraAuthors.map((author) => (
                          <div
                            key={author.id}
                            className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                          >
                            {/* Sanskrit name */}
                            {author.name_sanskrit && (
                              <div className="text-sm text-muted-foreground font-serif mb-1">
                                {author.name_sanskrit}
                              </div>
                            )}
                            {/* Transliteration */}
                            <div className="font-medium text-primary">
                              {author.title_transliteration
                                ? `${author.title_transliteration} ${author.name_transliteration}`
                                : author.name_transliteration}
                            </div>
                            {/* Translation */}
                            <div className="text-sm text-foreground">
                              {language === 'ua'
                                ? `${author.title_ua || ''} ${author.name_ua}`.trim()
                                : `${author.title_en || ''} ${author.name_en}`.trim()}
                            </div>
                            {/* Life dates */}
                            {(author.birth_year || author.death_year) && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {author.birth_year || '?'} — {author.death_year || t('наш час', 'present')}
                              </div>
                            )}
                            {/* Significance */}
                            {(author.significance_ua || author.significance_en) && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                {language === 'ua' ? author.significance_ua : author.significance_en}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GVReferences;
