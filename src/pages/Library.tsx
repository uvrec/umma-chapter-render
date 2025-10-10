import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Headphones } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export const Library = () => {
  const { language } = useLanguage();
  
  // Fetch books from database
  const { data: dbBooks = [], isLoading, error } = useQuery({
    queryKey: ['library-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('display_order', { ascending: true })
        .order('is_featured', { ascending: false })
        .order('title_ua');
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Banner with logo overlay */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg mb-12 overflow-hidden shadow-lg">
          <img 
            src="/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png" 
            alt="Студія звукозапису" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl">
              <img 
                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png" 
                alt="Прабгупада солов'їною" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Бібліотека</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Повна колекція ведичних писань з коментарями Його Божественної Милості А.Ч. Бхактіведанти Свамі Прабгупади
          </p>
        </div>

        {/* All Books Section */}
        <section>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Завантаження книг...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Помилка завантаження книг. Спробуйте оновити сторінку.</p>
            </div>
          ) : dbBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Книги поки що недоступні.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {dbBooks.map(book => {
              const title = language === 'ua' ? book.title_ua : book.title_en;
              const description = language === 'ua' ? book.description_ua : book.description_en;
              
              // Mapping book slugs to reader routes
              let verseLink = '';
              switch (book.slug) {
                case 'noi':
                  verseLink = '/veda-reader/noi';
                  break;
                case 'gita':
                  verseLink = '/veda-reader/gita';
                  break;
                case 'iso':
                  verseLink = '/veda-reader/iso';
                  break;
                case 'bhagavatam':
                  verseLink = '/veda-reader/bhagavatam';
                  break;
                default:
                  verseLink = book.has_cantos ? `/veda-reader/${book.slug}` : `/veda-reader/${book.slug}/1`;
              }
              
              // Mapping book slugs to audio routes
              const audioLink = (() => {
                switch (book.slug) {
                  case 'gita':
                    return '/audiobooks/bhagavad-gita';
                  case 'bhagavatam':
                    return '/audiobooks/srimad-bhagavatam';
                  case 'iso':
                    return '/audiobooks/sri-isopanishad';
                  default:
                    return '/audiobooks';
                }
              })();
              
              return (
                <Card key={book.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 flex flex-col">
                  <div className="aspect-[3/4] rounded-t-lg overflow-hidden bg-transparent">
                    {book.cover_image_url ? (
                      <Link to={verseLink} className="block w-full h-full">
                        <img 
                          src={book.cover_image_url} 
                          alt={title} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                        />
                      </Link>
                    ) : (
                      <Link to={verseLink} className="block w-full h-full">
                        <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <div className="text-center p-4">
                            <div className="text-6xl mb-4 text-primary">ॐ</div>
                            <div className="text-lg font-semibold text-foreground/80 line-clamp-3">{title}</div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <Link to={verseLink} className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-center hover:text-primary transition-colors">
                        {title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 text-center">
                      {description}
                    </p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <Link to={verseLink}>
                        <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                          <BookOpen className="w-3 h-3 mr-1" />
                          Читати
                        </Badge>
                      </Link>
                      <Link to={audioLink}>
                        <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors cursor-pointer">
                          <Headphones className="w-3 h-3 mr-1" />
                          Аудіо
                        </Badge>
                      </Link>
                      {book.purchase_url && (
                        <a href={book.purchase_url} target="_blank" rel="noopener noreferrer">
                          <Badge variant="default" className="hover:bg-primary/80 transition-colors">
                            Купити
                          </Badge>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};