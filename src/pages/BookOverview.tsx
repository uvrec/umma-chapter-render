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
import { BookSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { getBookOgImage } from "@/utils/og-image";
import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/lib/constants";
export const BookOverview = () => {
  const {
    bookId,
    slug
  } = useParams();
  const bookSlug = slug || bookId;
  const {
    language,
    t,
    getLocalizedPath
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
      } = await supabase.from("verses").select("id, verse_number, translation_uk, translation_en").eq("chapter_id", chapter1.id).is("deleted_at", null).eq("is_published", true).order("sort_key", {
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
  const bookTitle = language === "uk" ? book?.title_uk : book?.title_en;
  const bookDescription = language === "uk" ? book?.description_uk : book?.description_en;

  // SEO metadata
  const ogImage = book ? getBookOgImage(bookSlug || '', book.title_uk || '', book.title_en || '', language) : SITE_CONFIG.socialImage;
  const canonicalUrl = `${SITE_CONFIG.baseUrl}/${language}/lib/${bookSlug}`;
  const alternateUkUrl = `${SITE_CONFIG.baseUrl}/uk/lib/${bookSlug}`;
  const alternateEnUrl = `${SITE_CONFIG.baseUrl}/en/lib/${bookSlug}`;

  if (isLoading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Завантаження...", "Loading...")}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* SEO Metadata */}
      <Helmet>
        <title>{bookTitle} | {SITE_CONFIG.siteName}</title>
        <meta name="description" content={bookDescription || `${bookTitle} - ${t('священне писання ведичної традиції', 'sacred scripture of the Vedic tradition')}`} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="uk" href={alternateUkUrl} />
        <link rel="alternate" hrefLang="en" href={alternateEnUrl} />
        <link rel="alternate" hrefLang="x-default" href={alternateUkUrl} />
        <meta property="og:type" content="book" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={bookTitle || ''} />
        <meta property="og:description" content={bookDescription || ''} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={SITE_CONFIG.siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={bookTitle || ''} />
        <meta name="twitter:description" content={bookDescription || ''} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Structured Data */}
      {book && (
        <>
          <BookSchema
            slug={bookSlug || ''}
            titleUk={book.title_uk || ''}
            titleEn={book.title_en || ''}
            descriptionUk={book.description_uk}
            descriptionEn={book.description_en}
            coverImage={ogImage}
            language={language}
          />
          <BreadcrumbSchema
            items={[
              { name: t('Головна', 'Home'), url: `/${language}` },
              { name: t('Бібліотека', 'Library'), url: `/${language}/library` },
              { name: bookTitle || '', url: `/${language}/lib/${bookSlug}` },
            ]}
          />
        </>
      )}

      <Header />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{
        label: t("Бібліотека", "Library"),
        href: getLocalizedPath("/library")
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
                        <Link to={getLocalizedPath(`/lib/${bookSlug}/intro/${intro.slug}`)} className="text-primary hover:underline">
                          {language === "uk" ? intro.title_uk : intro.title_en}
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
            const cantoTitleUa = canto.title_uk;
            const cantoTitleEn = canto.title_en;
            return dualLanguageMode ?
            // Side-by-side для cantos
            <Link key={canto.id} to={getLocalizedPath(`/lib/${bookSlug}/${canto.canto_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
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
            <Link key={canto.id} to={getLocalizedPath(`/lib/${bookSlug}/${canto.canto_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">
                          {t("Пісня", "Canto")} {canto.canto_number}
                        </span>
                        <span className="text-lg text-foreground">
                          {language === "uk" ? cantoTitleUa : cantoTitleEn}
                        </span>
                      </div>
                    </Link>;
          }) :
          // NoI: show verses as list, otherwise chapters
          bookSlug === 'noi' && noiVerses.length > 0 ? noiVerses.map(verse => {
            const titleUa = verse.translation_uk ? `${verse.verse_number}. ${verse.translation_uk}` : `Текст ${verse.verse_number}`;
            const titleEn = verse.translation_en ? `${verse.verse_number}. ${verse.translation_en}` : `Text ${verse.verse_number}`;
            return dualLanguageMode ? <Link key={verse.id} to={getLocalizedPath(`/lib/noi/${verse.verse_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
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
                      </Link> : <Link key={verse.id} to={getLocalizedPath(`/lib/noi/${verse.verse_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary">
                            {language === "uk" ? `Текст ${verse.verse_number}` : `Text ${verse.verse_number}`}
                          </span>
                          <span className="text-lg text-foreground">
                            {language === "uk" ? titleUa : titleEn}
                          </span>
                        </div>
                      </Link>;
          }) :
          // Regular chapters
          chapters.map(chapter => {
            const chapterTitleUa = chapter.title_uk;
            const chapterTitleEn = chapter.title_en;
            return dualLanguageMode ?
            // Side-by-side для chapters
            <Link key={chapter.id} to={getLocalizedPath(`/lib/${bookSlug}/${chapter.chapter_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
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
            <Link key={chapter.id} to={getLocalizedPath(`/lib/${bookSlug}/${chapter.chapter_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">
                          {t("Глава", "Chapter")} {chapter.chapter_number}
                        </span>
                        <span className="text-lg text-foreground">
                          {language === "uk" ? chapterTitleUa : chapterTitleEn}
                        </span>
                      </div>
                    </Link>;
          })}
          </div>
        </div>
      </div>
    </div>;
};