import { useParams, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  // Special handling for NoI: fetch verses from chapter 1 to show as list
  const { data: noiVerses = [], isLoading: noiVersesLoading } = useQuery({
    queryKey: ["noi-verses", book?.id],
    queryFn: async () => {
      if (!book?.id || bookSlug !== 'noi') return [];

      // NoI має всі тексти в главі 1
      const { data: chapter1, error: chapterError } = await supabase
        .from("chapters")
        .select("id")
        .eq("book_id", book.id)
        .eq("chapter_number", 1)
        .maybeSingle();

      if (chapterError || !chapter1) return [];

      const { data, error } = await supabase
        .from("verses")
        .select("id, verse_number, translation_ua, translation_en")
        .eq("chapter_id", chapter1.id)
        .is("deleted_at", null)
        .eq("is_published", true)
        .order("verse_number_sort");

      if (error) throw error;
      return data || [];
    },
    enabled: !!book?.id && bookSlug === 'noi',
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

  const isLoading = cantosLoading || chaptersLoading || introLoading || noiVersesLoading;

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

  // Special rendering for NoI - beautiful overview page
  if (bookSlug === 'noi' && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
          <Breadcrumb
            items={[
              { label: t("Бібліотека", "Library"), href: "/library" },
              { label: bookTitle || "" },
            ]}
          />

          <div className="mt-8 mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" 
                style={{ fontFamily: "var(--font-primary)" }}>
              {bookTitle}
            </h1>
            {bookDescription && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {bookDescription}
              </p>
            )}
          </div>

          {/* Introduction Card */}
          {introChapters.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground" style={{ fontFamily: "var(--font-ui)" }}>
                {language === "ua" ? "Передмова" : "Introduction"}
              </h2>
              <Link to={`/veda-reader/noi/0`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 bg-card border-border group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors" 
                            style={{ fontFamily: "var(--font-primary)" }}>
                          {language === "ua" ? introChapters[0].title_ua : introChapters[0].title_en}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {language === "ua" 
                            ? (introChapters[0].content_ua || "").replace(/<[^>]*>/g, '').substring(0, 150) + "..."
                            : (introChapters[0].content_en || "").replace(/<[^>]*>/g, '').substring(0, 150) + "..."}
                        </p>
                      </div>
                      <BookOpen className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          )}

          {/* 11 Texts Grid */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-foreground" style={{ fontFamily: "var(--font-ui)" }}>
              {language === "ua" ? "Одинадцять настанов" : "Eleven Instructions"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noiVerses.map((verse) => {
              const verseNum = verse.verse_number;
              const translation = (dualMode 
                ? `${verse.translation_ua || ''}\n\n${verse.translation_en || ''}`
                : (language === "ua" ? verse.translation_ua : verse.translation_en)) || "";
              const excerpt = translation.substring(0, 120) + (translation.length > 120 ? "..." : "");

              return (
                <Link key={verse.id} to={`/veda-reader/noi/${verseNum}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 bg-card border-border group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <Badge variant="secondary" className="text-sm font-semibold">
                          {language === "ua" ? `Текст ${verseNum}` : `Text ${verseNum}`}
                        </Badge>
                        <BookOpen className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                        {excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </main>
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
                      className="block py-3 px-4 transition-all hover:bg-primary/5 rounded"
                    >
                      <div className="grid gap-8 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <span className="text-lg font-bold text-primary whitespace-nowrap">
                            Пісня {canto.canto_number}
                          </span>
                          <span className="text-lg text-foreground">{cantoTitleUa}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-lg font-bold text-primary whitespace-nowrap">
                            Canto {canto.canto_number}
                          </span>
                          <span className="text-lg text-foreground">{cantoTitleEn}</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // Одна мова для cantos
                    <Link
                      key={canto.id}
                      to={`/veda-reader/${bookSlug}/canto/${canto.canto_number}`}
                      className="block py-3 px-4 transition-all hover:bg-primary/5 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">
                          {t("Пісня", "Canto")} {canto.canto_number}
                        </span>
                        <span className="text-lg text-foreground">
                          {language === "ua" ? cantoTitleUa : cantoTitleEn}
                        </span>
                      </div>
                    </Link>
                  );
                })
              : // NoI: show verses as list, otherwise chapters
                bookSlug === 'noi' && noiVerses.length > 0
                ? noiVerses.map((verse) => {
                    const titleUa = verse.translation_ua ? `${verse.verse_number}. ${verse.translation_ua.substring(0, 80)}...` : `Текст ${verse.verse_number}`;
                    const titleEn = verse.translation_en ? `${verse.verse_number}. ${verse.translation_en.substring(0, 80)}...` : `Text ${verse.verse_number}`;

                    return dualMode ? (
                      <Link
                        key={verse.id}
                        to={`/veda-reader/noi/${verse.verse_number}`}
                        className="block py-3 px-4 transition-all hover:bg-primary/5 rounded"
                      >
                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="flex items-start gap-3">
                            <span className="text-lg font-bold text-primary whitespace-nowrap">
                              {verse.verse_number}
                            </span>
                            <span className="text-lg text-foreground line-clamp-2">{titleUa}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-lg font-bold text-primary whitespace-nowrap">
                              {verse.verse_number}
                            </span>
                            <span className="text-lg text-foreground line-clamp-2">{titleEn}</span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={verse.id}
                        to={`/veda-reader/noi/${verse.verse_number}`}
                        className="block py-3 px-4 transition-all hover:bg-primary/5 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary">
                            {language === "ua" ? `Текст ${verse.verse_number}` : `Text ${verse.verse_number}`}
                          </span>
                          <span className="text-lg text-foreground line-clamp-2">
                            {language === "ua" ? titleUa : titleEn}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                : // Regular chapters
                  chapters.map((chapter) => {
                  const chapterTitleUa = chapter.title_ua;
                  const chapterTitleEn = chapter.title_en;

                  return dualMode ? (
                    // Side-by-side для chapters
                    <Link
                      key={chapter.id}
                      to={`/veda-reader/${bookSlug}/${chapter.chapter_number}`}
                      className="block py-3 px-4 transition-all hover:bg-primary/5 rounded"
                    >
                      <div className="grid gap-8 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <span className="text-lg font-bold text-primary whitespace-nowrap">
                            Глава {chapter.chapter_number}
                          </span>
                          <span className="text-lg text-foreground">{chapterTitleUa}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-lg font-bold text-primary whitespace-nowrap">
                            Chapter {chapter.chapter_number}
                          </span>
                          <span className="text-lg text-foreground">{chapterTitleEn}</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // Одна мова для chapters
                    <Link
                      key={chapter.id}
                      to={`/veda-reader/${bookSlug}/${chapter.chapter_number}`}
                      className="block py-3 px-4 transition-all hover:bg-primary/5 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">
                          {t("Глава", "Chapter")} {chapter.chapter_number}
                        </span>
                        <span className="text-lg text-foreground">
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
