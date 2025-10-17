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

  // Query 1: Book
  const {
    data: book,
    isLoading: bookLoading,
    error: bookError,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      console.log("🔍 Fetching book with slug:", bookId);
      const { data, error } = await supabase.from("books").select("*").eq("slug", bookId).maybeSingle();

      if (error) {
        console.error("❌ Book query error:", error);
        throw error;
      }
      console.log("✅ Book found:", data);
      return data;
    },
    enabled: !!bookId,
  });

  // Query 2: Canto
  const {
    data: canto,
    isLoading: cantoLoading,
    error: cantoError,
  } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber],
    queryFn: async () => {
      console.log("🔍 Fetching canto:", {
        bookId: book!.id,
        cantoNumber: parseInt(cantoNumber!),
      });

      const { data, error } = await supabase
        .from("cantos")
        .select("*")
        .eq("book_id", book!.id)
        .eq("canto_number", parseInt(cantoNumber!))
        .maybeSingle();

      if (error) {
        console.error("❌ Canto query error:", error);
        throw error;
      }
      console.log("✅ Canto found:", data);
      return data;
    },
    enabled: !!book?.id && !!cantoNumber,
  });

  // Query 3: Chapters
  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useQuery({
    queryKey: ["canto-chapters", canto?.id],
    queryFn: async () => {
      console.log("🔍 Fetching chapters for canto:", canto!.id);

      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("canto_id", canto!.id)
        .order("chapter_number", { ascending: true });

      if (error) {
        console.error("❌ Chapters query error:", error);
        throw error;
      }
      console.log("✅ Chapters found:", data?.length || 0, "chapters");
      return data || [];
    },
    enabled: !!canto?.id,
  });

  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const cantoTitle = language === "ua" ? canto?.title_ua : canto?.title_en;
  const cantoDescription = language === "ua" ? canto?.description_ua : canto?.description_en;

  // Debug logging
  console.log("📊 Component state:", {
    bookId,
    cantoNumber,
    bookLoading,
    cantoLoading,
    chaptersLoading,
    hasBook: !!book,
    hasCanto: !!canto,
    chaptersCount: chapters?.length || 0,
    bookError,
    cantoError,
    chaptersError,
  });

  // Loading state
  if (bookLoading || cantoLoading || chaptersLoading) {
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

  // Error states
  if (bookError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Помилка завантаження книги</p>
            <p className="text-sm text-muted-foreground">{bookError.message}</p>
            <Link to="/library" className="inline-block mt-4 text-primary hover:underline">
              ← Повернутись до бібліотеки
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Книгу з slug "{bookId}" не знайдено</p>
            <Link to="/library" className="inline-block mt-4 text-primary hover:underline">
              ← Повернутись до бібліотеки
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (cantoError) {
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
            <p className="text-destructive mb-4">Помилка завантаження пісні</p>
            <p className="text-sm text-muted-foreground">{cantoError.message}</p>
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
            <p className="text-muted-foreground">
              Пісню #{cantoNumber} не знайдено для книги "{bookTitle}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">Перевірте, чи існує ця пісня в базі даних</p>
            <Link to={`/veda-reader/${bookId}`} className="inline-block mt-4 text-primary hover:underline">
              ← Назад до книги
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Success - render the page with chapters
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

        {chaptersError ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Помилка завантаження глав</p>
            <p className="text-sm text-muted-foreground">{chaptersError.message}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters && chapters.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Знайдено {chapters.length} {chapters.length === 1 ? "глава" : chapters.length < 5 ? "глави" : "глав"}
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
                <p className="text-muted-foreground mb-2">Для цієї пісні ще немає глав у базі даних</p>
                <p className="text-sm text-muted-foreground">Використайте інструмент імпорту для додавання контенту</p>
                <Link
                  to="/admin/import"
                  className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Перейти до імпорту
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CantoOverview;
