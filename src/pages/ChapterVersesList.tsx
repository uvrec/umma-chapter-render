// ChapterVersesList.tsx — Список всіх віршів глави з посиланнями
// Відповідає Vedabase side-by-side списку віршів

import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen } from "lucide-react";

export const ChapterVersesList = () => {
  const { bookId, chapterId, cantoNumber, chapterNumber } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Визначаємо режим: canto або звичайна книга
  const isCantoMode = !!cantoNumber;
  const effectiveChapterParam = isCantoMode ? chapterNumber : chapterId;

  // Завантажуємо книгу
  const { data: book } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, slug, title_ua, title_en, has_cantos")
        .eq("slug", bookId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Завантажуємо canto (якщо є)
  const { data: canto } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber],
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      const { data, error } = await supabase
        .from("cantos")
        .select("id, canto_number, title_ua, title_en")
        .eq("book_id", book.id)
        .eq("canto_number", parseInt(cantoNumber))
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isCantoMode && !!book?.id && !!cantoNumber,
  });

  // Завантажуємо главу
  const { data: chapter, isLoading: isLoadingChapter } = useQuery({
    queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam, isCantoMode],
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;

      const base = supabase
        .from("chapters")
        .select("id, chapter_number, title_ua, title_en, content_ua, content_en")
        .eq("chapter_number", parseInt(effectiveChapterParam));

      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book.id);

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id),
  });

  // Завантажуємо список віршів
  const { data: verses = [], isLoading: isLoadingVerses } = useQuery({
    queryKey: ["chapter-verses-list", chapter?.id],
    queryFn: async () => {
      if (!chapter?.id) return [];
      const { data, error } = await supabase
        .from("verses")
        .select("id, verse_number, translation_ua, translation_en")
        .eq("chapter_id", chapter.id)
        .order("verse_number_sort", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!chapter?.id,
  });

  const isLoading = isLoadingChapter || isLoadingVerses;

  // Формуємо URL для конкретного вірша
  const getVerseUrl = (verseNumber: string) => {
    if (isCantoMode) {
      return `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNumber}`;
    }
    return `/veda-reader/${bookId}/${chapterId}/${verseNumber}`;
  };

  // Назад до глави (або до списку глав)
  const handleBack = () => {
    if (isCantoMode) {
      navigate(`/veda-reader/${bookId}/canto/${cantoNumber}`);
    } else {
      navigate(`/veda-reader/${bookId}`);
    }
  };

  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const cantoTitle = canto ? (language === "ua" ? canto.title_ua : canto.title_en) : null;
  const chapterTitle = chapter ? (language === "ua" ? chapter.title_ua : chapter.title_en) : null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background py-8">
          <div className="container mx-auto max-w-5xl px-4">
            <Skeleton className="mb-4 h-8 w-48" />
            <Skeleton className="mb-8 h-12 w-96" />
            <div className="space-y-2">
              {[...Array(20)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Хлібні крихти + кнопка назад */}
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </div>

          {/* Заголовок */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{bookTitle}</span>
              {cantoTitle && (
                <>
                  <span>→</span>
                  <span>{cantoTitle}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground">{chapterTitle || `Глава ${chapter?.chapter_number}`}</h1>
            <p className="mt-2 text-muted-foreground">
              {verses.length} {verses.length === 1 ? "вірш" : verses.length < 5 ? "вірші" : "віршів"}
            </p>
          </div>

          {/* Side-by-side список віршів */}
          <div className="space-y-1">
            {verses.map((verse) => {
              const translationUa = verse.translation_ua || "";
              const translationEn = verse.translation_en || "";

              return (
                <Link
                  key={verse.id}
                  to={getVerseUrl(verse.verse_number)}
                  className="block rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:bg-accent"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Українська колонка */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                          ВІРШ {verse.verse_number}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm text-foreground">
                        {translationUa || <span className="text-muted-foreground italic">Немає перекладу</span>}
                      </p>
                    </div>

                    {/* Англійська колонка */}
                    <div className="space-y-2 border-l border-border pl-4 md:pl-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                          TEXT {verse.verse_number}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm text-foreground">
                        {translationEn || <span className="text-muted-foreground italic">No translation</span>}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {verses.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">У цій главі ще немає віршів</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
