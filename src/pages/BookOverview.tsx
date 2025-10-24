import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export const BookOverview = () => {
  const { bookId, slug } = useParams();
  const bookSlug = slug || bookId;
  const { language, t } = useLanguage();

  // Читаємо dualMode з localStorage
  const [dualMode, setDualMode] = useState(() => localStorage.getItem("vv_reader_dualMode") === "true");

  // Слухаємо зміни з GlobalSettingsPanel
  useEffect(() => {
    const handler = () => {
      setDualMode(localStorage.getItem("vv_reader_dualMode") === "true");
    };
    window.addEventListener("vv-reader-prefs-changed", handler);
    return () => window.removeEventListener("vv-reader-prefs-changed", handler);
  }, []);

  // Fetch book
  const { data: book } = useQuery({
    queryKey: ["book", bookSlug],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("slug", bookSlug).single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookSlug,
  });

  // Fetch cantos if book has them
  const { data: cantos = [], isLoading: cantosLoading } = useQuery({
    queryKey: ["cantos", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase.from("cantos").select("*").eq("book_id", book.id).order("canto_number");
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && book?.has_cantos === true,
  });

  // Fetch chapters if book doesn't have cantos
  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("book_id", book.id)
        .order("chapter_number");
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && book?.has_cantos !== true,
  });

  // Fetch intro chapters
  const { data: introChapters = [], isLoading: introLoading } = useQuery({
    queryKey: ["intro-chapters", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase
        .from("intro_chapters")
        .select("*")
        .eq("book_id", book.id)
        .order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id,
  });

  const isLoading = cantosLoading || chaptersLoading || introLoading;

  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const bookDescription = language === "ua" ? book?.description_ua : book?.description_en;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Завантаження...", "Loading...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: t("Бібліотека", "Library"), href: "/library" }, { label: bookTitle || "" }]} />

        <div className="mt-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{bookTitle}</h1>
              {bookDescription && <p className="text-lg text-muted-foreground mb-6">{bookDescription}</p>}

              {/* Intro chapters links */}
              {introChapters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Вступні матеріали:</h3>
                  <ul className="space-y-2">
                    {introChapters.map((intro) => (
                      <li key={intro.id}>
                        <Link
                          to={`/veda-reader/${bookSlug}/intro/${intro.slug}`}
                          className="text-primary hover:underline"
                        >
                          {language === "ua" ? intro.title_ua : intro.title_en}
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
            {book?.has_cantos ? t("Пісні", "Cantos") : t("Глави", "Chapters")}
          </h2>

          <div className="space-y-1">
            {book?.has_cantos
              ? // Cantos як список
                cantos.map((canto) => {
                  const cantoTitleUa = canto.title_ua;
                  const cantoTitleEn = canto.title_en;

                  return dualMode ? (
                    // Side-by-side для cantos
                    <Link
                      key={canto.id}
                      to={`/veda-reader/${bookSlug}/canto/${canto.canto_number}`}
                      className="block py-3 px-2 transition-colors hover:bg-accent rounded"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-primary">Пісня {canto.canto_number}</span>
                          <span className="text-base text-foreground hover:text-primary transition-colors">
                            {cantoTitleUa}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 border-l border-border pl-6">
                          <span className="text-sm font-semibold text-primary">Canto {canto.canto_number}</span>
                          <span className="text-base text-foreground hover:text-primary transition-colors">
                            {cantoTitleEn}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // Одна мова для cantos
                    <Link
                      key={canto.id}
                      to={`/veda-reader/${bookSlug}/canto/${canto.canto_number}`}
                      className="block py-3 px-2 transition-colors hover:bg-accent rounded"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-primary">
                          {t("Пісня", "Canto")} {canto.canto_number}
                        </span>
                        <span className="text-base text-foreground hover:text-primary transition-colors">
                          {language === "ua" ? cantoTitleUa : cantoTitleEn}
                        </span>
                      </div>
                    </Link>
                  );
                })
              : // Chapters як список
                chapters.map((chapter) => {
                  const chapterTitleUa = chapter.title_ua;
                  const chapterTitleEn = chapter.title_en;

                  return dualMode ? (
                    // Side-by-side для chapters
                    <Link
                      key={chapter.id}
                      to={`/veda-reader/${bookSlug}/${chapter.chapter_number}`}
                      className="block py-3 px-2 transition-colors hover:bg-accent rounded"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-primary">Глава {chapter.chapter_number}</span>
                          <span className="text-base text-foreground hover:text-primary transition-colors">
                            {chapterTitleUa}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 border-l border-border pl-6">
                          <span className="text-sm font-semibold text-primary">Chapter {chapter.chapter_number}</span>
                          <span className="text-base text-foreground hover:text-primary transition-colors">
                            {chapterTitleEn}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // Одна мова для chapters
                    <Link
                      key={chapter.id}
                      to={`/veda-reader/${bookSlug}/${chapter.chapter_number}`}
                      className="block py-3 px-2 transition-colors hover:bg-accent rounded"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-primary">
                          {t("Глава", "Chapter")} {chapter.chapter_number}
                        </span>
                        <span className="text-base text-foreground hover:text-primary transition-colors">
                          {language === "ua" ? chapterTitleUa : chapterTitleEn}
                        </span>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};
