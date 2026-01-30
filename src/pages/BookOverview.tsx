import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { BookSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { getBookOgImage } from "@/utils/og-image";
import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Swipeable row for cantos with chapter numbers
function SwipeableCantoRow({
  label,
  chapterCount,
  onRowClick,
  onChapterClick,
}: {
  label: string;
  chapterCount: number;
  onRowClick: () => void;
  onChapterClick: (chapter: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartRef = useRef<{ x: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = touchStartRef.current.x - e.touches[0].clientX;
    const containerWidth = containerRef.current?.offsetWidth || 300;
    if (isExpanded) {
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-containerWidth + newTranslate);
    } else {
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-newTranslate);
    }
  }, [isExpanded]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = containerWidth * 0.3;
    if (isExpanded) {
      if (translateX > -containerWidth + threshold) {
        setIsExpanded(false);
        setTranslateX(0);
      } else {
        setTranslateX(-containerWidth);
      }
    } else {
      if (translateX < -threshold) {
        setIsExpanded(true);
        setTranslateX(-containerWidth);
      } else {
        setTranslateX(0);
      }
    }
    touchStartRef.current = null;
  }, [isExpanded, translateX]);

  const handleRowTap = () => {
    if (!isExpanded) onRowClick();
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTranslateX(0);
  };

  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);
  const containerWidth = containerRef.current?.offsetWidth || 300;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex will-change-transform"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: touchStartRef.current ? 'none' : 'transform 200ms ease-out',
          width: `${containerWidth * 2}px`,
        }}
      >
        {/* Row info */}
        <div
          className="flex items-center gap-3 px-4 py-4 cursor-pointer active:bg-muted/50"
          style={{ width: `${containerWidth}px` }}
          onClick={handleRowTap}
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground">{label}</div>
            {chapterCount > 0 && (
              <div className="text-sm text-muted-foreground">{chapterCount} глав</div>
            )}
          </div>
        </div>

        {/* Chapter numbers */}
        <div className="flex items-center bg-muted/50" style={{ width: `${containerWidth}px` }}>
          <button onClick={handleClose} className="h-full px-2 flex items-center text-muted-foreground">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 px-2 py-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => onChapterClick(chapter)}
                  className={cn(
                    "min-w-[36px] h-9 px-2",
                    "text-sm font-medium",
                    "text-foreground hover:text-brand-600 active:text-brand-700",
                    "rounded-md hover:bg-brand-100/50 active:bg-brand-200/50"
                  )}
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Swipeable row for chapters with verse numbers
function SwipeableChapterRow({
  chapterNum,
  title,
  verseCount,
  onRowClick,
  onVerseClick,
}: {
  chapterNum: number;
  title: string;
  verseCount: number;
  onRowClick: () => void;
  onVerseClick: (verse: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartRef = useRef<{ x: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = touchStartRef.current.x - e.touches[0].clientX;
    const containerWidth = containerRef.current?.offsetWidth || 300;
    if (isExpanded) {
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-containerWidth + newTranslate);
    } else {
      const newTranslate = Math.max(0, Math.min(deltaX, containerWidth));
      setTranslateX(-newTranslate);
    }
  }, [isExpanded]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = containerWidth * 0.3;
    if (isExpanded) {
      if (translateX > -containerWidth + threshold) {
        setIsExpanded(false);
        setTranslateX(0);
      } else {
        setTranslateX(-containerWidth);
      }
    } else {
      if (translateX < -threshold) {
        setIsExpanded(true);
        setTranslateX(-containerWidth);
      } else {
        setTranslateX(0);
      }
    }
    touchStartRef.current = null;
  }, [isExpanded, translateX]);

  const handleRowTap = () => {
    if (!isExpanded) onRowClick();
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTranslateX(0);
  };

  const verses = Array.from({ length: verseCount }, (_, i) => i + 1);
  const containerWidth = containerRef.current?.offsetWidth || 300;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex will-change-transform"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: touchStartRef.current ? 'none' : 'transform 200ms ease-out',
          width: `${containerWidth * 2}px`,
        }}
      >
        {/* Chapter info */}
        <div
          className="flex items-center gap-3 px-4 py-4 cursor-pointer active:bg-muted/50"
          style={{ width: `${containerWidth}px` }}
          onClick={handleRowTap}
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground">{chapterNum}. {title}</div>
            {verseCount > 0 && (
              <div className="text-sm text-muted-foreground">{verseCount} віршів</div>
            )}
          </div>
        </div>

        {/* Verse numbers */}
        <div className="flex items-center bg-muted/50" style={{ width: `${containerWidth}px` }}>
          <button onClick={handleClose} className="h-full px-2 flex items-center text-muted-foreground">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 px-2 py-2">
              {verses.map((verse) => (
                <button
                  key={verse}
                  onClick={() => onVerseClick(verse)}
                  className={cn(
                    "min-w-[36px] h-9 px-2",
                    "text-sm font-medium",
                    "text-foreground hover:text-brand-600 active:text-brand-700",
                    "rounded-md hover:bg-brand-100/50 active:bg-brand-200/50"
                  )}
                >
                  {verse}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const isMobile = useIsMobile();

  // Fetch book
  const {
    data: book,
    isLoading: bookLoading
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

  // Fetch cantos if book has them (with chapter counts)
  const {
    data: cantos = [],
    isLoading: cantosLoading
  } = useQuery({
    queryKey: ["cantos-with-counts", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const {
        data,
        error
      } = await supabase.from("cantos").select("*").eq("book_id", book.id).order("canto_number");
      if (error) throw error;

      // Fetch chapter counts for each canto
      const cantosWithCounts = await Promise.all(
        (data || []).map(async (canto) => {
          const { count } = await supabase
            .from("chapters")
            .select("*", { count: "exact", head: true })
            .eq("canto_id", canto.id);
          return { ...canto, chapter_count: count || 0 };
        })
      );
      return cantosWithCounts;
    },
    enabled: !!book?.id && book?.has_cantos === true
  });

  // Fetch chapters if book doesn't have cantos (with verse counts)
  const {
    data: chapters = [],
    isLoading: chaptersLoading
  } = useQuery({
    queryKey: ["chapters-with-verse-counts", book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const {
        data,
        error
      } = await supabase.from("chapters").select("*").eq("book_id", book.id).order("chapter_number");
      if (error) throw error;

      // Fetch verse counts for each chapter
      const chaptersWithCounts = await Promise.all(
        (data || []).map(async (chapter) => {
          const { count } = await supabase
            .from("verses")
            .select("*", { count: "exact", head: true })
            .eq("chapter_id", chapter.id)
            .is("deleted_at", null);
          return { ...chapter, verse_count: count || 0 };
        })
      );
      return chaptersWithCounts;
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
  const isLoading = bookLoading || cantosLoading || chaptersLoading || introLoading || noiVersesLoading;
  const bookTitle = language === "uk" ? book?.title_uk : book?.title_en;
  const bookDescription = language === "uk" ? book?.description_uk : book?.description_en;

  // SEO metadata
  const ogImage = book ? getBookOgImage(bookSlug || '', book.title_uk || '', book.title_en || '', language) : SITE_CONFIG.socialImage;
  const canonicalUrl = `${SITE_CONFIG.baseUrl}/${language}/lib/${bookSlug}`;
  const alternateUkUrl = `${SITE_CONFIG.baseUrl}/uk/lib/${bookSlug}`;
  const alternateEnUrl = `${SITE_CONFIG.baseUrl}/en/lib/${bookSlug}`;

  if (isLoading) {
    return <div className="min-h-screen bg-background">
        {!isMobile && <Header />}
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Завантаження...", "Loading...")}</p>
        </div>
      </div>;
  }

  // Mobile: Minimalist view like library
  if (isMobile) {
    return <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${bookTitle || t('Книга', 'Book')} | ${SITE_CONFIG.siteName}`}</title>
        <meta name="description" content={bookDescription || `${bookTitle} - ${t('священне писання ведичної традиції', 'sacred scripture of the Vedic tradition')}`} />
      </Helmet>

      {/* Book Title */}
      <div className="px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-semibold text-primary">
          {bookTitle}
        </h1>
      </div>

      {/* Cantos/Chapters - swipeable rows like library */}
      <div className="divide-y divide-border/50">
        {book?.has_cantos ?
          cantos.map(canto => (
            <SwipeableCantoRow
              key={canto.id}
              label={language === "uk" ? canto.title_uk : canto.title_en}
              chapterCount={(canto as any).chapter_count || 0}
              onRowClick={() => navigate(getLocalizedPath(`/lib/${bookSlug}/${canto.canto_number}`))}
              onChapterClick={(chapter) => navigate(getLocalizedPath(`/lib/${bookSlug}/${canto.canto_number}/${chapter}`))}
            />
          )) :
          bookSlug === 'noi' && noiVerses.length > 0 ?
            noiVerses.map(verse => (
              <Link
                key={verse.id}
                to={getLocalizedPath(`/lib/noi/${verse.verse_number}`)}
                className="block px-4 py-4 active:bg-muted/50"
              >
                <div className="font-medium text-foreground">
                  {language === "uk"
                    ? (verse.translation_uk || `Текст ${verse.verse_number}`)
                    : (verse.translation_en || `Text ${verse.verse_number}`)}
                </div>
              </Link>
            )) :
            chapters.map(chapter => (
              <SwipeableChapterRow
                key={chapter.id}
                chapterNum={chapter.chapter_number}
                title={language === "uk" ? chapter.title_uk : chapter.title_en}
                verseCount={(chapter as any).verse_count || 0}
                onRowClick={() => navigate(getLocalizedPath(`/lib/${bookSlug}/${chapter.chapter_number}`))}
                onVerseClick={(verse) => navigate(getLocalizedPath(`/lib/${bookSlug}/${chapter.chapter_number}/${verse}`))}
              />
            ))
        }
      </div>

      {/* Intro chapters - AFTER main chapters */}
      {introChapters.length > 0 && (
        <div className="divide-y divide-border/50 mt-4 pt-4 border-t">
          {introChapters.map(intro => (
            <Link
              key={intro.id}
              to={getLocalizedPath(`/lib/${bookSlug}/intro/${intro.slug}`)}
              className="block px-4 py-4 active:bg-muted/50"
            >
              <div className="font-medium text-muted-foreground">
                {language === "uk" ? intro.title_uk : intro.title_en}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>;
  }

  // Desktop: Full view
  return <div className="min-h-screen bg-background">
      {/* SEO Metadata */}
      <Helmet>
        <title>{`${bookTitle || t('Книга', 'Book')} | ${SITE_CONFIG.siteName}`}</title>
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
            </div>
          </div>
        </div>

        {/* Intro chapters + Cantos/Chapters list */}
        <div className="mb-8">
          <div className="space-y-1">
            {/* Intro chapters - same style as chapters */}
            {introChapters.map(intro => {
              const introTitleUk = intro.title_uk;
              const introTitleEn = intro.title_en;
              return dualLanguageMode ? (
                <Link key={intro.id} to={getLocalizedPath(`/lib/${bookSlug}/intro/${intro.slug}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="text-lg text-primary">{introTitleUk}</div>
                    <div className="text-lg text-primary">{introTitleEn}</div>
                  </div>
                </Link>
              ) : (
                <Link key={intro.id} to={getLocalizedPath(`/lib/${bookSlug}/intro/${intro.slug}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                  <div className="text-lg text-primary">
                    {language === "uk" ? introTitleUk : introTitleEn}
                  </div>
                </Link>
              );
            })}

            {/* Cantos or Chapters */}
            {book?.has_cantos ?
          // Cantos як список
          cantos.map(canto => {
            const cantoTitleUk = canto.title_uk;
            const cantoTitleEn = canto.title_en;
            return dualLanguageMode ?
            // Side-by-side для cantos
            <Link key={canto.id} to={getLocalizedPath(`/lib/${bookSlug}/${canto.canto_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                      <div className="grid gap-8 md:grid-cols-2">
                        <div className="text-lg text-foreground">{cantoTitleUk}</div>
                        <div className="text-lg text-foreground">{cantoTitleEn}</div>
                      </div>
                    </Link> :
            // Одна мова для cantos
            <Link key={canto.id} to={getLocalizedPath(`/lib/${bookSlug}/${canto.canto_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                      <div className="text-lg text-foreground">
                        {language === "uk" ? cantoTitleUk : cantoTitleEn}
                      </div>
                    </Link>;
          }) :
          // NoI: show verses as list, otherwise chapters
          bookSlug === 'noi' && noiVerses.length > 0 ? noiVerses.map(verse => {
            const titleUk = verse.translation_uk || `Текст ${verse.verse_number}`;
            const titleEn = verse.translation_en || `Text ${verse.verse_number}`;
            return dualLanguageMode ? <Link key={verse.id} to={getLocalizedPath(`/lib/noi/${verse.verse_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                        <div className="grid gap-8 md:grid-cols-2">
                          <div className="text-lg text-foreground">{titleUk}</div>
                          <div className="text-lg text-foreground">{titleEn}</div>
                        </div>
                      </Link> : <Link key={verse.id} to={getLocalizedPath(`/lib/noi/${verse.verse_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                        <div className="text-lg text-foreground">
                          {language === "uk" ? titleUk : titleEn}
                        </div>
                      </Link>;
          }) :
          // Regular chapters
          chapters.map(chapter => {
            const chapterTitleUk = chapter.title_uk;
            const chapterTitleEn = chapter.title_en;
            return dualLanguageMode ?
            // Side-by-side для chapters
            <Link key={chapter.id} to={getLocalizedPath(`/lib/${bookSlug}/${chapter.chapter_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                      <div className="grid gap-8 md:grid-cols-2">
                        <div className="text-lg text-foreground">{chapterTitleUk}</div>
                        <div className="text-lg text-foreground">{chapterTitleEn}</div>
                      </div>
                    </Link> :
            // Одна мова для chapters
            <Link key={chapter.id} to={getLocalizedPath(`/lib/${bookSlug}/${chapter.chapter_number}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                      <div className="text-lg text-foreground">
                        {language === "uk" ? chapterTitleUk : chapterTitleEn}
                      </div>
                    </Link>;
          })}
          </div>
        </div>
      </div>
    </div>;
};