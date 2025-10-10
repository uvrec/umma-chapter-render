// VedaReaderDB.tsx — оновлена версія: інтеграція з новим VerseCard, мовно-залежне збереження,
// хоткеї (←/→), стабільні ключі запитів, глобальний fontSize/lineHeight,
// craft-папір: виправлено клас контейнера і додано verse-surface на текстову главу.

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VerseCard } from "@/components/VerseCard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";

export const VedaReaderDB = () => {
  const { bookId, chapterId, cantoNumber, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Глобальний розмір шрифту для сторінки рідера
  const [fontSize, setFontSize] = useState(18);
  const [craftPaperMode, setCraftPaperMode] = useState(false);
  const [dualLanguageMode, setDualLanguageMode] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState<"sanskrit" | "ua" | "en">("sanskrit");

  const [textDisplaySettings, setTextDisplaySettings] = useState({
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true,
  });

  const [continuousReadingSettings, setContinuousReadingSettings] = useState({
    enabled: false,
    showVerseNumbers: true,
    showSanskrit: true,
    showTransliteration: true,
    showTranslation: true,
    showCommentary: true,
  });

  // Витягає відображуваний номер (останній сегмент)
  const getDisplayVerseNumber = (verseNumber: string): string => {
    const parts = verseNumber.split(/[\s.]+/);
    return parts[parts.length - 1] || verseNumber;
  };

  // Режим пісень (canto), якщо у URL є cantoNumber
  const isCantoMode = !!cantoNumber;
  const effectiveChapterParam = isCantoMode ? chapterNumber : chapterId;

  // BOOK
  const { data: book } = useQuery({
    queryKey: ["book", bookId],
    staleTime: 60_000,
    enabled: !!bookId,
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

  // CANTO (лише в canto mode)
  const { data: canto } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber],
    staleTime: 60_000,
    enabled: isCantoMode && !!book?.id && !!cantoNumber,
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      const { data, error } = await supabase
        .from("cantos")
        .select("id, canto_number, title_ua, title_en, book_id")
        .eq("book_id", book.id)
        .eq("canto_number", parseInt(cantoNumber))
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // CHAPTER
  const { data: chapter } = useQuery({
    queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam, isCantoMode],
    staleTime: 60_000,
    enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id),
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;

      const base = supabase
        .from("chapters")
        .select("id, book_id, canto_id, chapter_number, chapter_type, title_ua, title_en, content_ua, content_en")
        .eq("chapter_number", parseInt(effectiveChapterParam));

      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book.id);
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Якщо книга має канто, але URL без canto — редірект на canto/1
  useEffect(() => {
    if (!isCantoMode && book?.has_cantos && effectiveChapterParam && chapter === null) {
      navigate(`/veda-reader/${bookId}/canto/${1}/chapter/${effectiveChapterParam}`, { replace: true });
    }
  }, [isCantoMode, book?.has_cantos, effectiveChapterParam, chapter, bookId, navigate]);

  // Усі глави для навігації
  const { data: allChapters = [] } = useQuery({
    queryKey: ["allChapters", book?.id, canto?.id, isCantoMode],
    staleTime: 60_000,
    enabled: isCantoMode ? !!canto?.id : !!book?.id,
    queryFn: async () => {
      if (!book?.id) return [];
      const base = supabase.from("chapters").select("id, book_id, canto_id, chapter_number").order("chapter_number");
      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book.id);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Парсер для числового сортування віршів
  const parseVerseNumber = (verseNumber: string): number[] => {
    const full = verseNumber.match(/(\d+)\.(\d+)\.(\d+)/);
    if (full) return [parseInt(full[1]), parseInt(full[2]), parseInt(full[3])];
    const parts = verseNumber.split(".").map((p) => parseInt(p.match(/\d+/)?.[0] || "0"));
    return parts.length > 0 ? parts : [0];
  };

  // Вірші глави
  const { data: rawVerses = [], isLoading } = useQuery({
    queryKey: ["verses", chapter?.id],
    staleTime: 30_000,
    enabled: !!chapter?.id,
    queryFn: async () => {
      if (!chapter?.id) return [];
      const { data, error } = await supabase
        .from("verses")
        .select(
          "id, chapter_id, verse_number, sanskrit, transliteration, synonyms_ua, synonyms_en, translation_ua, translation_en, commentary_ua, commentary_en, audio_url",
        )
        .eq("chapter_id", chapter.id);
      if (error) throw error;
      return data || [];
    },
  });

  // Сортування
  const verses = useMemo(() => {
    const copy = [...rawVerses];
    copy.sort((a, b) => {
      const aParts = parseVerseNumber(a.verse_number);
      const bParts = parseVerseNumber(b.verse_number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const av = aParts[i] || 0;
        const bv = bParts[i] || 0;
        if (av !== bv) return av - bv;
      }
      return 0;
    });
    return copy;
  }, [rawVerses]);

  // Поточні дані
  const currentVerse = verses[currentVerseIndex];
  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const chapterTitle = language === "ua" ? chapter?.title_ua : chapter?.title_en;

  const currentChapterIndex = useMemo(
    () => allChapters.findIndex((ch) => ch.chapter_number === parseInt(effectiveChapterParam || "1")),
    [allChapters, effectiveChapterParam],
  );

  // Мутація з мовно-залежним мапінгом полів
  const updateVerseMutation = useMutation({
    mutationKey: ["updateVerse"],
    mutationFn: async ({ verseId, updates }: { verseId: string; updates: any }) => {
      const payload: Record<string, any> = {
        sanskrit: updates.sanskrit,
        transliteration: updates.transliteration,
        audio_url: updates.audio_url,
      };

      if (language === "ua") {
        payload.synonyms_ua = updates.synonyms;
        payload.translation_ua = updates.translation;
        payload.commentary_ua = updates.commentary;
      } else {
        payload.synonyms_en = updates.synonyms;
        payload.translation_en = updates.translation;
        payload.commentary_en = updates.commentary;
      }

      const { data, error } = await supabase.from("verses").update(payload).eq("id", verseId).select().single();
      if (error) throw error;
      return data;
    },
    onMutate: async ({ verseId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["verses", chapter?.id] });
      const prev = queryClient.getQueryData<any[]>(["verses", chapter?.id]);
      if (prev) {
        const next = prev.map((v) =>
          v.id === verseId
            ? {
                ...v,
                sanskrit: updates.sanskrit,
                transliteration: updates.transliteration,
                ...(language === "ua"
                  ? {
                      synonyms_ua: updates.synonyms,
                      translation_ua: updates.translation,
                      commentary_ua: updates.commentary,
                    }
                  : {
                      synonyms_en: updates.synonyms,
                      translation_en: updates.translation,
                      commentary_en: updates.commentary,
                    }),
              }
            : v,
        );
        queryClient.setQueryData(["verses", chapter?.id], next);
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["verses", chapter?.id], ctx.prev);
      toast({ title: "Помилка", description: "Не вдалося зберегти зміни", variant: "destructive" });
    },
    onSuccess: () => {
      toast({ title: "Успішно збережено", description: "Вірш оновлено" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["verses", chapter?.id] });
    },
  });

  // Навігація по віршах
  const handlePrevVerse = useCallback(() => {
    setCurrentVerseIndex((i) => Math.max(0, i - 1));
  }, []);
  const handleNextVerse = useCallback(() => {
    setCurrentVerseIndex((i) => Math.min(verses.length - 1, i + 1));
  }, [verses.length]);

  // Гарячі клавіші ← / →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const editable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (document.activeElement as HTMLElement | null)?.isContentEditable;
      if (editable) return;

      if (e.key === "ArrowLeft") handlePrevVerse();
      if (e.key === "ArrowRight") handleNextVerse();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlePrevVerse, handleNextVerse]);

  // Навігація між главами
  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = allChapters[currentChapterIndex - 1];
      const path = isCantoMode
        ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${prevChapter.chapter_number}`
        : `/veda-reader/${bookId}/${prevChapter.chapter_number}`;
      navigate(path);
      setCurrentVerseIndex(0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      const path = isCantoMode
        ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${nextChapter.chapter_number}`
        : `/veda-reader/${bookId}/${nextChapter.chapter_number}`;
      navigate(path);
      setCurrentVerseIndex(0);
    }
  };

  // Скелетон-завантаження
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

  if (!chapter) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="mb-4 text-muted-foreground">{t("Немає даних для цієї глави", "No data for this chapter")}</p>
          <Button
            variant="outline"
            onClick={() =>
              navigate(isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}` : `/veda-reader/${bookId}`)
            }
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("Назад", "Back")}
          </Button>
        </div>
      </div>
    );
  }

  const isTextChapter = chapter.chapter_type === "text" || verses.length === 0;

  // Глобальне застосування розміру шрифту до контенту рідера
  const readerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    lineHeight: 1.6,
  };

  return (
    <div className={`min-h-screen ${craftPaperMode ? "craft-paper-bg" : "bg-background"}`}>
      <Header />

      <div className="container mx-auto px-4 py-8" style={readerStyle}>
        <Breadcrumb
          items={
            isCantoMode
              ? [
                  { label: t("Бібліотека", "Library"), href: "/library" },
                  { label: bookTitle || "", href: `/veda-reader/${bookId}` },
                  {
                    label: `${t("Пісня", "Canto")} ${cantoNumber}`,
                    href: `/veda-reader/${bookId}/canto/${cantoNumber}`,
                  },
                  { label: chapterTitle || "" },
                ]
              : [
                  { label: t("Бібліотека", "Library"), href: "/library" },
                  { label: bookTitle || "", href: `/veda-reader/${bookId}` },
                  { label: chapterTitle || "" },
                ]
          }
        />

        <div className="mt-4 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{bookTitle}</h1>
          <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {isTextChapter ? (
          <Card className="verse-surface p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <TiptapRenderer
                content={language === "ua" ? chapter.content_ua || "" : chapter.content_en || chapter.content_ua || ""}
              />
            </div>

            <div className="mt-8 flex items-center justify-between border-t pt-8">
              <Button variant="secondary" onClick={handlePrevChapter} disabled={currentChapterIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("Попередня глава", "Previous Chapter")}
              </Button>

              <span className="text-sm text-muted-foreground">
                {t("Глава", "Chapter")} {currentChapterIndex + 1} {t("з", "of")} {allChapters.length}
              </span>

              <Button
                variant="secondary"
                onClick={handleNextChapter}
                disabled={currentChapterIndex === allChapters.length - 1}
              >
                {t("Наступна глава", "Next Chapter")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : continuousReadingSettings.enabled ? (
          <div className="space-y-8">
            {verses.map((verse) => {
              const verseIdx = getDisplayVerseNumber(verse.verse_number);
              const fullVerseNumber = isCantoMode
                ? `${cantoNumber}.${chapterNumber}.${verseIdx}`
                : `${chapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;

              return (
                <VerseCard
                  key={verse.id}
                  verseId={verse.id}
                  verseNumber={fullVerseNumber}
                  bookName={chapterTitle}
                  sanskritText={verse.sanskrit || ""}
                  transliteration={verse.transliteration || ""}
                  synonyms={language === "ua" ? verse.synonyms_ua || "" : verse.synonyms_en || ""}
                  translation={language === "ua" ? verse.translation_ua || "" : verse.translation_en || ""}
                  commentary={language === "ua" ? verse.commentary_ua || "" : verse.commentary_en || ""}
                  audioUrl={verse.audio_url || ""}
                  textDisplaySettings={textDisplaySettings}
                  isAdmin={isAdmin}
                  onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({ verseId, updates })}
                />
              );
            })}
          </div>
        ) : (
          <>
            {currentVerse &&
              (() => {
                const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
                const fullVerseNumber = isCantoMode
                  ? `${cantoNumber}.${chapterNumber}.${verseIdx}`
                  : `${chapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;

                return (
                  <div className="space-y-6">
                    {dualLanguageMode ? (
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <VerseCard
                          verseId={currentVerse.id}
                          verseNumber={fullVerseNumber}
                          bookName={chapter?.title_ua}
                          sanskritText={currentVerse.sanskrit || ""}
                          transliteration={currentVerse.transliteration || ""}
                          synonyms={currentVerse.synonyms_ua || ""}
                          translation={currentVerse.translation_ua || ""}
                          commentary={currentVerse.commentary_ua || ""}
                          audioUrl={currentVerse.audio_url || ""}
                          textDisplaySettings={textDisplaySettings}
                          isAdmin={isAdmin}
                          onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({ verseId, updates })}
                        />
                        <VerseCard
                          verseId={currentVerse.id}
                          verseNumber={fullVerseNumber}
                          bookName={book?.title_en}
                          sanskritText={currentVerse.sanskrit || ""}
                          transliteration={currentVerse.transliteration || ""}
                          synonyms={currentVerse.synonyms_en || ""}
                          translation={currentVerse.translation_en || ""}
                          commentary={currentVerse.commentary_en || ""}
                          audioUrl={currentVerse.audio_url || ""}
                          textDisplaySettings={textDisplaySettings}
                          isAdmin={false}
                          onVerseUpdate={() => {}}
                        />
                      </div>
                    ) : (
                      <VerseCard
                        verseId={currentVerse.id}
                        verseNumber={fullVerseNumber}
                        bookName={chapterTitle}
                        sanskritText={currentVerse.sanskrit || ""}
                        transliteration={currentVerse.transliteration || ""}
                        synonyms={language === "ua" ? currentVerse.synonyms_ua || "" : currentVerse.synonyms_en || ""}
                        translation={
                          language === "ua" ? currentVerse.translation_ua || "" : currentVerse.translation_en || ""
                        }
                        commentary={
                          language === "ua" ? currentVerse.commentary_ua || "" : currentVerse.commentary_en || ""
                        }
                        audioUrl={currentVerse.audio_url || ""}
                        textDisplaySettings={textDisplaySettings}
                        isAdmin={isAdmin}
                        onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({ verseId, updates })}
                      />
                    )}

                    <div className="flex items-center justify-between">
                      <Button variant="outline" onClick={handlePrevVerse} disabled={currentVerseIndex === 0}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t("Попередній", "Previous")}
                      </Button>

                      <span className="text-sm text-muted-foreground">
                        {currentVerseIndex + 1} {t("з", "of")} {verses.length}
                      </span>

                      <Button
                        variant="outline"
                        onClick={handleNextVerse}
                        disabled={currentVerseIndex === verses.length - 1}
                      >
                        {t("Наступний", "Next")}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <Button variant="secondary" onClick={handlePrevChapter} disabled={currentChapterIndex === 0}>
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          {t("Попередня глава", "Previous Chapter")}
                        </Button>

                        <span className="text-sm text-muted-foreground">
                          {t("Глава", "Chapter")} {currentChapterIndex + 1} {t("з", "of")} {allChapters.length}
                        </span>

                        <Button
                          variant="secondary"
                          onClick={handleNextChapter}
                          disabled={currentChapterIndex === allChapters.length - 1}
                        >
                          {t("Наступна глава", "Next Chapter")}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </>
        )}
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        craftPaperMode={craftPaperMode}
        onCraftPaperToggle={setCraftPaperMode}
        verses={verses.map((v) => ({
          number: v.verse_number,
          book: bookTitle,
          translation: language === "ua" ? v.translation_ua : v.translation_en,
        }))}
        currentVerse={currentVerse?.verse_number || ""}
        onVerseSelect={(verseNum) => {
          const index = verses.findIndex((v) => v.verse_number === verseNum);
          if (index !== -1) setCurrentVerseIndex(index);
        }}
        dualLanguageMode={dualLanguageMode}
        onDualLanguageModeToggle={setDualLanguageMode}
        textDisplaySettings={textDisplaySettings}
        onTextDisplaySettingsChange={setTextDisplaySettings}
        originalLanguage={originalLanguage}
        onOriginalLanguageChange={(lang) => setOriginalLanguage(lang as "sanskrit" | "ua" | "en")}
        continuousReadingSettings={continuousReadingSettings}
        onContinuousReadingSettingsChange={setContinuousReadingSettings}
      />
    </div>
  );
};
