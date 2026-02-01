// CantoOverview.tsx - список глав канту з підтримкою dualLanguageMode

import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Swipeable chapter row with verse numbers
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
            <div className="text-sm text-muted-foreground">{verseCount} віршів</div>
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

export const CantoOverview = () => {
  // Support both /veda-reader/ and /lib/ URL patterns
  const params = useParams<{
    bookId?: string;
    cantoNumber?: string;
    // /lib/ param: for canto books, p1 is the canto number
    p1?: string;
  }>();

  // Normalize params from /lib/ format
  // /lib/sb/1 → canto=1
  const bookId = params.bookId;
  const cantoNumber = params.cantoNumber ?? params.p1;
  const navigate = useNavigate();

  const {
    language,
    t,
    getLocalizedPath
  } = useLanguage();
  const {
    dualLanguageMode
  } = useReaderSettings();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();

  // Get preview token directly from URL (not from global state which may not be set yet)
  const previewToken = searchParams.get('preview');

  // Helper to add preview token to navigation paths
  const getPathWithPreview = (path: string) => {
    const localizedPath = getLocalizedPath(path);
    if (previewToken) {
      return `${localizedPath}?preview=${previewToken}`;
    }
    return localizedPath;
  };

  // Fetch book with preview token support
  const {
    data: book
  } = useQuery({
    queryKey: ["book", bookId, previewToken],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)("get_book_with_preview", {
        p_book_slug: bookId,
        p_token: previewToken
      });
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!bookId
  });

  // Fetch canto with preview token support
  const {
    data: canto,
    isLoading: cantoLoading
  } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber, previewToken],
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      const { data, error } = await (supabase.rpc as any)("get_canto_by_number_with_preview", {
        p_book_id: book.id,
        p_canto_number: parseInt(cantoNumber),
        p_token: previewToken
      });
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!book?.id && !!cantoNumber
  });

  // Fetch chapters with preview token support
  const {
    data: chapters = [],
    isLoading: chaptersLoading
  } = useQuery({
    queryKey: ["chapters-with-verse-counts", canto?.id, previewToken],
    queryFn: async () => {
      if (!canto?.id) return [];
      const { data, error } = await (supabase.rpc as any)("get_chapters_by_canto_with_preview", {
        p_canto_id: canto.id,
        p_token: previewToken
      });
      if (error) throw error;

      // Fetch verse counts for each chapter
      const chaptersWithCounts = await Promise.all(
        (data || []).map(async (chapter: any) => {
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
    enabled: !!canto?.id
  });
  const bookTitle = language === "uk" ? book?.title_uk : book?.title_en;
  const cantoTitle = language === "uk" ? canto?.title_uk : canto?.title_en;
  const cantoDescription = language === "uk" ? canto?.description_uk : canto?.description_en;
  if (cantoLoading || chaptersLoading) {
    return <div className="min-h-screen bg-background">
        {!isMobile && <Header />}
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Завантаження...", "Loading...")}</p>
        </main>
      </div>;
  }
  if (!canto) {
    return <div className="min-h-screen bg-background">
        {!isMobile && <Header />}
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Пісню не знайдено", "Canto not found")}</p>
        </main>
      </div>;
  }

  // Mobile: Minimalist chapter list with swipeable verse numbers
  if (isMobile) {
    return <div className="min-h-screen bg-background">
      {/* Canto title only */}
      <div className="px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-primary">{cantoTitle}</h1>
      </div>

      {/* Chapters with swipeable verse numbers */}
      <div className="divide-y divide-border/50">
        {chapters && chapters.length > 0 ? chapters.map(chapter => {
          const chapterTitle = language === "uk" ? chapter.title_uk : chapter.title_en;
          const chapterNum = chapter.chapter_number;

          return (
            <SwipeableChapterRow
              key={chapter.id}
              chapterNum={chapterNum}
              title={chapterTitle || ""}
              verseCount={(chapter as any).verse_count || 0}
              onRowClick={() => navigate(getPathWithPreview(`/lib/${bookId}/${cantoNumber}/${chapterNum}`))}
              onVerseClick={(verse) => navigate(getPathWithPreview(`/lib/${bookId}/${cantoNumber}/${chapterNum}/${verse}`))}
            />
          );
        }) : <p className="text-center py-8 text-muted-foreground">{t("Ще немає глав", "No chapters yet")}</p>}
      </div>
    </div>;
  }

  // Desktop: Full view
  return <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{
        label: t("Бібліотека", "Library"),
        href: getLocalizedPath("/library")
      }, {
        label: bookTitle || "",
        href: getLocalizedPath(`/lib/${bookId}`)
      }, {
        label: `${t("Пісня", "Canto")} ${cantoNumber}: ${cantoTitle}`
      }]} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center text-primary">
            {t("Пісня", "Canto")} {cantoNumber}: {cantoTitle}
          </h1>
          {cantoDescription && <p className="text-lg text-muted-foreground text-center">{cantoDescription}</p>}
        </div>

        <div className="space-y-1">
          {chapters && chapters.length > 0 ? chapters.map(chapter => {
          const chapterTitleUk = chapter.title_uk;
          const chapterTitleEn = chapter.title_en;
          const chapterNum = chapter.chapter_number; // Це вже просто номер глави (1, 2, 3...)

          return dualLanguageMode ?
          // Side-by-side для chapters
          <Link key={chapter.id} to={getPathWithPreview(`/lib/${bookId}/${cantoNumber}/${chapterNum}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <span className="text-lg font-bold text-primary whitespace-nowrap">Глава {chapterNum}</span>
                      <span className="text-lg text-foreground">{chapterTitleUk}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg font-bold text-primary whitespace-nowrap">Chapter {chapterNum}</span>
                      <span className="text-lg text-foreground">{chapterTitleEn}</span>
                    </div>
                  </div>
                </Link> :
          // Одна мова для chapters
          <Link key={chapter.id} to={getPathWithPreview(`/lib/${bookId}/${cantoNumber}/${chapterNum}`)} className="block py-3 px-4 transition-all hover:bg-primary/5 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      {t("Глава", "Chapter")} {chapterNum}
                    </span>
                    <span className="text-lg text-foreground">
                      {language === "uk" ? chapterTitleUk : chapterTitleEn}
                    </span>
                  </div>
                </Link>;
        }) : <p className="text-center text-muted-foreground">{t("Ще немає глав", "No chapters yet")}</p>}
        </div>
      </main>
    </div>;
};
export default CantoOverview;