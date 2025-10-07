import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Headphones } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import smallBookIcon from "@/assets/small-book-icon.webp";

export const AllBooks = () => {
  const { language } = useLanguage();
  
  // Fetch books from database
  const { data: dbBooks = [] } = useQuery({
    queryKey: ['all-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('display_order', { ascending: true })
        .order('is_featured', { ascending: false })
        .order('title_ua');
      if (error) throw error;
      return data;
    }
  });

  const classicBooks = dbBooks.filter(book => book.display_category === 'classics');
  const smallBooks = dbBooks.filter(book => book.display_category === 'small');

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
          {/* Logo overlay at bottom center */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl">
              <img 
                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png" 
                alt="Прабгупада солов'їною" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Усі книги бібліотеки</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Повна колекція ведичних писань та додаткової літератури українською мовою
          </p>
        </div>

        {/* Classic Books Section */}
        <section className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-2xl font-semibold text-foreground mx-6">Основні писання</h2>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classicBooks.map(book => {
              const title = language === 'ua' ? book.title_ua : book.title_en;
              const description = language === 'ua' ? book.description_ua : book.description_en;
              const verseLink = book.has_cantos ? `/veda-reader/${book.slug}` : `/veda-reader/${book.slug}/1`;
              
              return (
                <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden">
                    {book.cover_image_url ? (
                      <Link to={verseLink} className="block w-full h-full">
                        <img src={book.cover_image_url} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </Link>
                    ) : (
                      <Link to={verseLink} className="block w-full h-full">
                        <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                          <div className="text-center p-4">
                            <div className="text-6xl mb-4 text-primary">ॐ</div>
                            <div className="text-lg font-semibold text-foreground/80 line-clamp-3">{title}</div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-center">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3 text-center font-light">{description}</p>
                    <div className="flex items-center justify-center gap-2">
                      <Link to={verseLink}>
                        <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                          <BookOpen className="w-3 h-3 mr-1" />
                          Читати
                        </Badge>
                      </Link>
                      <Link to="/audio/audiobooks">
                        <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors cursor-pointer">
                          <Headphones className="w-3 h-3 mr-1" />
                          Аудіокнига
                        </Badge>
                      </Link>
                      {book.purchase_url && (
                        <a href={book.purchase_url} target="_blank" rel="noopener noreferrer">
                          <Badge variant="default" className="hover:bg-primary/80 transition-colors">Купити</Badge>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Small Books Section */}
        <section>
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-2xl font-semibold text-foreground mx-6">Малі книги</h2>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {smallBooks.map(book => {
              const title = language === 'ua' ? book.title_ua : book.title_en;
              const description = language === 'ua' ? book.description_ua : book.description_en;
              const verseLink = book.has_cantos ? `/veda-reader/${book.slug}` : `/veda-reader/${book.slug}/1`;
              
              return (
                <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 rounded-t-lg overflow-hidden">
                    {book.cover_image_url ? (
                      <Link to={verseLink} className="block w-full h-full">
                        <img src={book.cover_image_url} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </Link>
                    ) : (
                      <Link to={verseLink} className="block w-full h-full">
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                          <div className="text-center p-3">
                            <div className="mb-2">
                              <img src={smallBookIcon} alt="Book icon" className="w-12 h-12 mx-auto" />
                            </div>
                            <div className="text-sm font-medium text-foreground/80 line-clamp-4">{title}</div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-foreground mb-2 text-sm line-clamp-2 text-center">{title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{description}</p>
                    <div className="flex items-center justify-center gap-2">
                      <Link to={verseLink}>
                        <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">Читати</Badge>
                      </Link>
                      {book.purchase_url && (
                        <a href={book.purchase_url} target="_blank" rel="noopener noreferrer">
                          <Badge variant="default" className="text-xs hover:bg-primary/80 transition-colors">Купити</Badge>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
