import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useEffect, useState } from "react";
export const BookOverview = () => {
  const {
    bookId,
    slug
  } = useParams();
  const bookSlug = slug || bookId;
  const {
    language,
    t
  } = useLanguage();
  const navigate = useNavigate();
  const {
    dualLanguageMode
  } = useReaderSettings();

  // Fetch book
  const {
    data: book
  } = useQuery({
    queryKey: ["book", bookSlug],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("books").select("*").eq("slug", bookSlug).single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookSlug
  });

  // Fetch cantos if book has them
  const {
    data: cantos = [],
    isLoading: cantosLoading
  } = useQuery({
    queryKey: ["cantos", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const {
        data,
        error
      } = await supabase.from("cantos").select("*").eq("book_id", book.id).order("canto_number");
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && book?.has_cantos === true
  });

  // Fetch chapters if book doesn't have cantos
  const {
    data: chapters = [],
    isLoading: chaptersLoading
  } = useQuery({
    queryKey: ["chapters", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const {
        data,
        error
      } = await supabase.from("chapters").select("*").eq("book_id", book.id).order("chapter_number");
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && book?.has_cantos !== true
  });

  // Special handling for NoI: fetch verses from chapter 1 to show as list
  const {
    data: noiVerses = [],
    isLoading: noiVersesLoading
  } = useQuery({
    queryKey: ["noi-verses", book?.id],
    queryFn: async () => {
      if (!book?.id || bookSlug !== 'noi') return [];

      // NoI має всі тексти в главі 1
      const {
        data: chapter1,
        error: chapterError
      } = await supabase.from("chapters").select("id").eq("book_id", book.id).eq("chapter_number", 1).maybeSingle();
      if (chapterError || !chapter1) return [];
      const {
        data,
        error
      } = await supabase.from("verses").select("id, verse_number, translation_ua, translation_en").eq("chapter_id", chapter1.id).is("deleted_at", null).eq("is_published", true).order("sort_key", {
        ascending: true
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!book?.id && bookSlug === 'noi'
  });

  // Fetch intro chapters
  const {
    data: introChapters = [],
    isLoading: introLoading
  } = useQuery({
    queryKey: ["intro-chapters", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const {
        data,
        error
      } = await supabase.from("intro_chapters").select("*").eq("book_id", book.id).order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id
  });
  const isLoading = cantosLoading || chaptersLoading || introLoading || noiVersesLoading;
  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const bookDescription = language === "ua" ? book?.description_ua : book?.description_en;
  if (isLoading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Завантаження...", "Loading...")}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{
        label: t("Бібліотека", "Library"),
        href: "/library"
      }, {
        label: bookTitle || ""
      }]} />

        <div className="mt-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book info */}
            <div className="flex-1">
              <h1 style={{
              fontFamily: "var(--font-primary)"
            }} className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center">{bookTitle}</h1>
              {bookDescription && <p className="text-lg text-muted-foreground mb-6 text-center">{bookDescription}</p>}

              {/* Intro chapters links */}
              {introChapters.length > 0 && <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Вступні матеріали:</h3>
                  <ul className="space-y-2">
                    {introChapters.map(intro => <li key={intro.id}>
                        <Link to={`/lib/${bookSlug}/intro/${intro.slug}`} className="text-primary hover:underline">
                          {language === "ua" ? intro.title_ua : intro.title_en}
                        </Link>
                      </li>)}
                  </ul>
                </div>}
            </div>
          </div>
        </div>

        {/* Cantos or Chapters list */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {book?.has_cantos ? t("Пісні", "Cantos") : t("Глави", "Chapters")}
          </h2>

          <div className="space-y-1">
            {book?.has_cantos ?
          // Cantos як список
          cantos.map(canto => {
            const cantoTitleUa = canto.title_ua;
            const cantoTitleEn = canto.title_en;
            return dualLanguageMode ?
            // Side-by-side для cantos
            <Link key={canto.id} to={`/lib/${bookSlug}/${canto.canto_number}`} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
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
                    </Link> :
            // Одна мова для cantos
            <Link key={canto.id} to={`/lib/${bookSlug}/${canto.canto_number}`} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">
                          {t("Пісня", "Canto")} {canto.canto_number}
                        </span>
                        <span className="text-lg text-foreground">
                          {language === "ua" ? cantoTitleUa : cantoTitleEn}
                        </span>
                      </div>
                    </Link>;
          }) :
          // NoI: show verses as list, otherwise chapters
          bookSlug === 'noi' && noiVerses.length > 0 ? noiVerses.map(verse => {
            const titleUa = verse.translation_ua ? `${verse.verse_number}. ${verse.translation_ua}` : `Текст ${verse.verse_number}`;
            const titleEn = verse.translation_en ? `${verse.verse_number}. ${verse.translation_en}` : `Text ${verse.verse_number}`;
            return dualLanguageMode ? <Link key={verse.id} to={`/lib/noi/${verse.verse_number}`} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="flex items-start gap-3">
                            <span className="text-lg font-bold text-primary whitespace-nowrap">
                              {verse.verse_number}
                            </span>
                            <span className="text-lg text-foreground">{titleUa}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-lg font-bold text-primary whitespace-nowrap">
                              {verse.verse_number}
                            </span>
                            <span className="text-lg text-foreground">{titleEn}</span>
                          </div>
                        </div>
                      </Link> : <Link key={verse.id} to={`/lib/noi/${verse.verse_number}`} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary">
                            {language === "ua" ? `Текст ${verse.verse_number}` : `Text ${verse.verse_number}`}
                          </span>
                          <span className="text-lg text-foreground">
                            {language === "ua" ? titleUa : titleEn}
                          </span>
                        </div>
                      </Link>;
          }) :
          // Regular chapters
          chapters.map(chapter => {
            const chapterTitleUa = chapter.title_ua;
            const chapterTitleEn = chapter.title_en;
            return dualLanguageMode ?
            // Side-by-side для chapters
            <Link key={chapter.id} to={`/lib/${bookSlug}/${chapter.chapter_number}`} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
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
                    </Link> :
            // Одна мова для chapters
            <Link key={chapter.id} to={`/lib/${bookSlug}/${chapter.chapter_number}`} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">
                          {t("Глава", "Chapter")} {chapter.chapter_number}
                        </span>
                        <span className="text-lg text-foreground">
                          {language === "ua" ? chapterTitleUa : chapterTitleEn}
                        </span>
                      </div>
                    </Link>;
          })}
          </div>
        </div>
      </div>
    </div>;
};