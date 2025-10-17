import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const CantoOverview = () => {
  const { bookId, cantoNumber } = useParams();
  const { language } = useLanguage();

  const { data: book, isLoading: bookLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("slug", bookId).maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!bookId,
  });

  const { data: canto, isLoading: cantoLoading } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cantos")
        .select("*")
        .eq("book_id", book!.id)
        .eq("canto_number", parseInt(cantoNumber!))
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && !!cantoNumber,
  });

  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ["canto-chapters", canto?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("canto_id", canto!.id)
        .order("chapter_number", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!canto?.id,
  });

  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const cantoTitle = language === "ua" ? canto?.title_ua : canto?.title_en;
  const cantoDescription = language === "ua" ? canto?.description_ua : canto?.description_en;

  // 🔥 FIX: Перевіряємо loading ПЕРЕД перевіркою даних!
  const isLoading = bookLoading || cantoLoading || chaptersLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Завантаження...</p>
          </div>
        </main>
      </div>
    );
  }

  // 🔥 FIX: Перевіряємо відсутність даних ТІЛЬКИ після завантаження
  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Книгу не знайдено</p>
            <Link to="/library" className="inline-block mt-4 text-primary hover:underline">
              ← Повернутись до бібліотеки
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!canto) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Бібліотека", href: "/library" },
              { label: bookTitle || "", href: `/veda-reader/${bookId}` },
            ]}
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Пісню #{cantoNumber} не знайдено</p>
            <Link to={`/veda-reader/${bookId}`} className="inline-block mt-4 text-primary hover:underline">
              ← Назад до книги
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ✅ Тут ми знаємо, що book і canto існують
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Бібліотека", href: "/library" },
            { label: bookTitle || "", href: `/veda-reader/${bookId}` },
            { label: `Пісня ${cantoNumber}: ${cantoTitle}` },
          ]}
        />

        <div className="mb-8 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Пісня {cantoNumber}: {cantoTitle}
          </h1>
          {cantoDescription && <p className="text-lg text-muted-foreground max-w-3xl">{cantoDescription}</p>}
        </div>

        <div className="space-y-3">
          {chapters.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {chapters.length} {chapters.length === 1 ? "глава" : chapters.length < 5 ? "глави" : "глав"}
              </p>
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapter.chapter_number}`}
                  className="block"
                >
                  <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                    <CardHeader className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-primary font-semibold min-w-[80px]">Глава {chapter.chapter_number}</div>
                        <CardDescription className="text-base">
                          {language === "ua" ? chapter.title_ua : chapter.title_en}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground mb-2">Для цієї пісні ще немає глав</p>
              <Link
                to="/admin/import"
                className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Перейти до імпорту
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CantoOverview;
