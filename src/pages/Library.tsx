import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Edit, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { BookCoverEditor } from "@/components/BookCoverEditor";
import { BannerEditor } from "@/components/BannerEditor";

type DbBook = {
  id: string;
  slug: string;
  title_ua: string | null;
  title_en: string | null;
  description_ua: string | null;
  description_en: string | null;
  cover_image_url: string | null;
  purchase_url: string | null;
  display_order: number | null;
  is_featured: boolean | null;
  has_cantos: boolean | null;
  is_published?: boolean | null;
};

export const Library = () => {
  const { language } = useLanguage();
  const { isAdmin, loading: authLoading } = useAuth();
  const [editingBook, setEditingBook] = useState<DbBook | null>(null);
  const [editingBanner, setEditingBanner] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png");

  const {
    data: dbBooks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["library-books", isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          "id, slug, title_ua, title_en, description_ua, description_en, cover_image_url, purchase_url, display_order, is_featured, has_cantos",
        )
        .order("display_order", { ascending: true })
        .order("is_featured", { ascending: false })
        .order("title_ua", { ascending: true });

      if (error) throw error;
      
      // Фільтруємо приховані книги (якщо потрібно в майбутньому)
      // На разі повертаємо всі книги, бо поля is_published ще немає
      return (data || []) as DbBook[];
    },
    staleTime: 60_000,
    enabled: !authLoading,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Banner */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg mb-12 overflow-hidden shadow-lg group">
          <img src={bannerUrl} alt="Студія звукозапису" className="w-full h-full object-cover" loading="lazy" />
          {!authLoading && isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setEditingBanner(true)}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Змінити банер
            </Button>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="w-56 h-56 md:w-72 md:h-72 drop-shadow-2xl">
              <img
                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png"
                alt="Прабгупада соловйиною"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Бібліотека</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ведичні писання з коментарями Його Божественної Милості А.Ч. Бхактіведанти Свамі Прабгупади
          </p>
        </div>

        {/* Books */}
        <section>
          {isLoading ? (
            <div className="text-center py-12">Завантаження книг...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Помилка завантаження: {String(error)}</div>
          ) : dbBooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Книги не знайдено</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dbBooks.map((book) => {
                const title = language === "ua" ? book.title_ua : book.title_en || book.title_ua;
                const description =
                  language === "ua" ? book.description_ua : book.description_en || book.description_ua;

                return (
                  <Card
                    key={book.id}
                    className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
                  >
                    {/* Кнопка редагування для адмінів */}
                    {!authLoading && isAdmin && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingBook(book);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    {/* ✅ ВИПРАВЛЕНО: Змінено посилання з /library/ на /veda-reader/ */}
                    <Link to={`/veda-reader/${book.slug}`}>
                      <div className="aspect-[2/3] overflow-hidden bg-muted">
                        {book.cover_image_url ? (
                          <img
                            src={book.cover_image_url}
                            alt={title || "Обкладинка книги"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <BookOpen className="w-16 h-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
                        {description && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{description}</p>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Читати
                          </Badge>
                          {book.purchase_url && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Headphones className="w-3 h-3" />
                              Аудіо
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />

      {/* Діалог редагування обкладинки */}
      {editingBook && (
        <BookCoverEditor
          bookId={editingBook.id}
          bookSlug={editingBook.slug}
          currentCoverUrl={editingBook.cover_image_url}
          currentCoverPath={null}
          isOpen={!!editingBook}
          onClose={() => setEditingBook(null)}
        />
      )}

      {/* Діалог редагування банера */}
      {editingBanner && (
        <BannerEditor
          pageSlug="library"
          currentBannerUrl={bannerUrl}
          isOpen={editingBanner}
          onClose={() => setEditingBanner(false)}
          onSave={(newUrl) => setBannerUrl(newUrl)}
          title="Редагувати банер бібліотеки"
        />
      )}
    </div>
  );
};
