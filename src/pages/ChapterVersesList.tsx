// ChapterVersesList.tsx — Список віршів з підтримкою dualMode

import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export const ChapterVersesList = () => {
  const { bookId, chapterId, cantoNumber, chapterNumber } = useParams();
  const { language } = useLanguage();
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

  const isCantoMode = !!cantoNumber;
  const effectiveChapterParam = isCantoMode ? chapterNumber : chapterId;

  const { data: book } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, slug, title_ua, title_en")
        .eq("slug", bookId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

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

  const { data: chapter, isLoading: isLoadingChapter } = useQuery({
    queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam, isCantoMode],
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;

      const base = supabase
        .from("chapters")
        .select("id, chapter_number, title_ua, title_en")
        .eq("chapter_number", parseInt(effectiveChapterParam as string));

      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book.id);

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id),
  });

  // Fallback: if canto-based chapter has no verses yet, also look for legacy book-only chapter
  const { data: fallbackChapter } = useQuery({
    queryKey: ["fallback-chapter", book?.id, effectiveChapterParam],
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      const { data, error } = await supabase
        .from("chapters")
        .select("id, chapter_number, title_ua, title_en")
        .eq("book_id", book.id)
        .eq("chapter_number", parseInt(effectiveChapterParam as string))
        .is("canto_id", null)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && !!effectiveChapterParam,
  });

  const { data: versesMain = [], isLoading: isLoadingVersesMain } = useQuery({
    queryKey: ["chapter-verses-list", chapter?.id],
    queryFn: async () => {
      if (!chapter?.id) return [] as any[];
      const { data, error } = await supabase
        .from("verses")
         .select(
          "id, verse_number, sanskrit, transliteration, transliteration_en, transliteration_ua, translation_ua, translation_en"
         )
        .eq("chapter_id", chapter.id)
        .order("verse_number_sort", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!chapter?.id,
  });

  const { data: versesFallback = [], isLoading: isLoadingVersesFallback } = useQuery({
    queryKey: ["chapter-verses-fallback", fallbackChapter?.id],
    queryFn: async () => {
      if (!fallbackChapter?.id) return [] as any[];
      const { data, error } = await supabase
        .from("verses")
         .select(
          "id, verse_number, sanskrit, transliteration, transliteration_en, transliteration_ua, translation_ua, translation_en"
         )
        .eq("chapter_id", fallbackChapter.id)
        .order("verse_number_sort", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!fallbackChapter?.id,
  });

  const verses = (versesMain && versesMain.length > 0) ? versesMain : (versesFallback || []);

  const isLoading = isLoadingChapter || isLoadingVersesMain || isLoadingVersesFallback;

  const getVerseUrl = (verseNumber: string) => {
    if (isCantoMode) {
      return `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNumber}`;
    }
    return `/veda-reader/${bookId}/${chapterId}/${verseNumber}`;
  };

  const handleBack = () => {
    if (isCantoMode) {
      navigate(`/veda-reader/${bookId}/canto/${cantoNumber}`);
    } else {
      navigate(`/veda-reader/${bookId}`);
    }
  };

  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const cantoTitle = canto ? (language === "ua" ? canto.title_ua : canto.title_en) : null;
  const effectiveChapterObj = chapter ?? fallbackChapter;
  const chapterTitle = effectiveChapterObj ? (language === "ua" ? effectiveChapterObj.title_ua : effectiveChapterObj.title_en) : null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background py-8">
          <div className="container mx-auto max-w-5xl px-4">
            <Skeleton className="mb-4 h-8 w-48" />
            <Skeleton className="mb-8 h-12 w-96" />
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
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
        <div className="container mx-auto max-w-6xl px-4">
          {/* Навігація */}
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
          </div>

          {/* Список віршів */}
          <div className="space-y-6">
            {verses.map((verse) => {
              const translationUa = verse.translation_ua || "";
              const translationEn = verse.translation_en || "";
              const sanskrit = verse.sanskrit || "";
              const transliterationUa = verse.transliteration_ua || verse.transliteration || "";
              const transliterationEn = verse.transliteration_en || verse.transliteration || "";

              return (
                <div key={verse.id} className="space-y-3">
                  {/* Side-by-side якщо dualMode */}
                  {dualMode ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Українська */}
                      <div className="space-y-3">
                        <Link
                          to={getVerseUrl(verse.verse_number)}
                          className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                        >
                          ВІРШ {verse.verse_number}
                        </Link>
                        {sanskrit && (
                          <p className="font-sanskrit text-[1.4em] leading-relaxed text-gray-700 dark:text-gray-300">
                            {sanskrit}
                          </p>
                        )}
                        {transliterationUa && (
                          <p className="font-sanskrit-italic italic text-sm text-muted-foreground">{transliterationUa}</p>
                        )}
                        <p className="text-base leading-relaxed text-foreground">
                          {translationUa || <span className="italic text-muted-foreground">Немає перекладу</span>}
                        </p>
                      </div>

                      {/* Англійська */}
                      <div className="space-y-3 border-l border-border pl-6">
                        <Link
                          to={getVerseUrl(verse.verse_number)}
                          className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                        >
                          TEXT {verse.verse_number}
                        </Link>
                        {sanskrit && (
                          <p className="font-sanskrit text-[1.4em] leading-relaxed text-gray-700 dark:text-gray-300">
                            {sanskrit}
                          </p>
                        )}
                        {transliterationEn && (
                          <p className="font-sanskrit-italic italic text-sm text-muted-foreground">{transliterationEn}</p>
                        )}
                        <p className="text-base leading-relaxed text-foreground">
                          {translationEn || <span className="italic text-muted-foreground">No translation</span>}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Одна мова */
                    <div className="space-y-3">
                      <Link
                        to={getVerseUrl(verse.verse_number)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                      >
                        {language === "ua" ? `ВІРШ ${verse.verse_number}` : `TEXT ${verse.verse_number}`}
                      </Link>
                      {sanskrit && (
                        <p className="font-sanskrit text-[1.4em] leading-relaxed text-gray-700 dark:text-gray-300">
                          {sanskrit}
                        </p>
                      )}
                      {(language === "ua" ? transliterationUa : transliterationEn) && (
                        <p className="font-sanskrit-italic italic text-sm text-muted-foreground">
                          {language === "ua" ? transliterationUa : transliterationEn}
                        </p>
                      )}
                      <p className="text-base leading-relaxed text-foreground">
                        {language === "ua"
                          ? translationUa || <span className="italic text-muted-foreground">Немає перекладу</span>
                          : translationEn || <span className="italic text-muted-foreground">No translation</span>}
                      </p>
                    </div>
                  )}

                  {/* Розділювач */}
                  <div className="border-b border-border" />
                </div>
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
