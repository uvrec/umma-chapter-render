import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VerseCard } from "@/components/VerseCard";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
import { UniversalInlineEditor } from "@/components/UniversalInlineEditor";

export const VedaReaderDB = () => {
  const { bookId, chapterId, cantoNumber, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  // Глобальні налаштування - синхронізуються з GlobalSettingsPanel
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("vv_reader_fontSize");
    return saved ? Number(saved) : 18;
  });
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem("vv_reader_lineHeight");
    return saved ? Number(saved) : 1.6;
  });
  const [dualLanguageMode, setDualLanguageMode] = useState<boolean>(
    () => localStorage.getItem("vv_reader_dualMode") === "true",
  );

  const [textDisplaySettings, setTextDisplaySettings] = useState(() => {
    try {
      const raw = localStorage.getItem("vv_reader_blocks");
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          showSanskrit: parsed.showSanskrit ?? true,
          showTransliteration: parsed.showTransliteration ?? true,
          showSynonyms: parsed.showSynonyms ?? true,
          showTranslation: parsed.showTranslation ?? true,
          showCommentary: parsed.showCommentary ?? true,
        };
      }
    } catch {}
    return {
      showSanskrit: true,
      showTransliteration: true,
      showSynonyms: true,
      showTranslation: true,
      showCommentary: true,
    };
  });

  const [continuousReadingSettings, setContinuousReadingSettings] = useState(() => {
    try {
      const raw = localStorage.getItem("vv_reader_continuous");
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          enabled: parsed.enabled ?? false,
          showVerseNumbers: parsed.showVerseNumbers ?? true,
          showSanskrit: parsed.showSanskrit ?? false,
          showTransliteration: parsed.showTransliteration ?? false,
          showTranslation: parsed.showTranslation ?? true,
          showCommentary: parsed.showCommentary ?? false,
        };
      }
    } catch {}
    return {
      enabled: false,
      showVerseNumbers: true,
      showSanskrit: false,
      showTransliteration: false,
      showTranslation: true,
      showCommentary: false,
    };
  });

  // Застосувати line-height до контейнера рідера
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-reader-root="true"]');
    if (root) root.style.lineHeight = String(lineHeight);
  }, [lineHeight]);

  // Слухач глобальних змін із GlobalSettingsPanel та між вкладками
  useEffect(() => {
    const syncFromLS = () => {
      const fs = localStorage.getItem("vv_reader_fontSize");
      if (fs) setFontSize(Number(fs));
      const lh = localStorage.getItem("vv_reader_lineHeight");
      if (lh) setLineHeight(Number(lh));
      const dualMode = localStorage.getItem("vv_reader_dualMode") === "true";
      setDualLanguageMode(dualMode);

      try {
        const b = localStorage.getItem("vv_reader_blocks");
        if (b) {
          const parsed = JSON.parse(b);
          setTextDisplaySettings((prev) => ({
            ...prev,
            showSanskrit: parsed.showSanskrit ?? prev.showSanskrit,
            showTransliteration: parsed.showTransliteration ?? prev.showTransliteration,
            showSynonyms: parsed.showSynonyms ?? prev.showSynonyms,
            showTranslation: parsed.showTranslation ?? prev.showTranslation,
            showCommentary: parsed.showCommentary ?? prev.showCommentary,
          }));
        }
      } catch {}
      try {
        const c = localStorage.getItem("vv_reader_continuous");
        if (c) {
          const parsed = JSON.parse(c);
          setContinuousReadingSettings((prev) => ({
            ...prev,
            enabled: parsed.enabled ?? prev.enabled,
            showVerseNumbers: parsed.showVerseNumbers ?? prev.showVerseNumbers,
            showSanskrit: parsed.showSanskrit ?? prev.showSanskrit,
            showTransliteration: parsed.showTransliteration ?? prev.showTransliteration,
            showTranslation: parsed.showTranslation ?? prev.showTranslation,
            showCommentary: parsed.showCommentary ?? prev.showCommentary,
          }));
        }
      } catch {}
    };

    const onPrefs = () => syncFromLS();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || !e.key.startsWith("vv_reader_")) return;
      syncFromLS();
    };

    window.addEventListener("vv-reader-prefs-changed", onPrefs as any);
    window.addEventListener("storage", onStorage);
    // Ініціалізація при монтуванні
    syncFromLS();

    return () => {
      window.removeEventListener("vv-reader-prefs-changed", onPrefs as any);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

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

  const currentChapterIndex = useMemo(() => {
    if (!chapter?.id) return -1;
    let idx = allChapters.findIndex((ch) => ch.id === chapter.id);
    if (idx === -1 && chapter.chapter_number) {
      idx = allChapters.findIndex((ch) => ch.chapter_number === chapter.chapter_number);
    }
    return idx >= 0 ? idx : -1;
  }, [allChapters, chapter?.id, chapter?.chapter_number]);

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
    if (currentChapterIndex === -1 || currentChapterIndex === 0) return;
    if (currentChapterIndex > 0 && currentChapterIndex < allChapters.length) {
      const prevChapter = allChapters[currentChapterIndex - 1];
      const path = isCantoMode
        ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${prevChapter.chapter_number}`
        : `/veda-reader/${bookId}/${prevChapter.chapter_number}`;
      navigate(path);
      setCurrentVerseIndex(0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex === -1 || currentChapterIndex >= allChapters.length - 1) return;
    if (currentChapterIndex >= 0 && currentChapterIndex < allChapters.length - 1) {
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
    lineHeight: String(lineHeight),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8" style={readerStyle} data-reader-root="true">
        <Breadcrumb
          items={
            isCantoMode
              ? [
                  { label: t("Бібліотека", "Library"), href: "/library" },
                  { label: bookTitle || "", href: `/veda-reader/${bookId}` },
                  {
                    label: `${t("Пісня", "Song")} ${cantoNumber}`,
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

        <div className="mt-4 mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold">{bookTitle}</h1>
        </div>

        <div className="mb-6">
          {isTextChapter ? (
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === -1 || currentChapterIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("Попередня глава", "Previous Chapter")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("Глава", "Chapter")} {currentChapterIndex + 1} {t("з", "of")} {allChapters.length}
              </span>
              <Button
                variant="secondary"
                onClick={handleNextChapter}
                disabled={currentChapterIndex === -1 || currentChapterIndex === allChapters.length - 1}
              >
                {t("Наступна глава", "Next Chapter")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrevVerse} disabled={currentVerseIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t("Попередній вірш", "Previous verse")}
                </Button>
                <Button variant="outline" onClick={handleNextVerse} disabled={currentVerseIndex === verses.length - 1}>
                  {t("Наступний вірш", "Next verse")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handlePrevChapter}
                  disabled={currentChapterIndex === -1 || currentChapterIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t("Попередня глава", "Previous Chapter")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleNextChapter}
                  disabled={currentChapterIndex === -1 || currentChapterIndex === allChapters.length - 1}
                >
                  {t("Наступна глава", "Next Chapter")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {isTextChapter ? (
          dualLanguageMode ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="verse-surface p-8">
                  <div className="text-center mb-4 text-sm font-semibold text-muted-foreground">Українська</div>
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    {isAdmin ? (
                      <UniversalInlineEditor
                        table="chapters"
                        recordId={chapter.id}
                        field="content_ua"
                        initialValue={chapter.content_ua || chapter.content_en || ""}
                        label={`Контент лекції (UA)`}
                        language="ua"
                        showToggle={true}
                      />
                    ) : (
                      <TiptapRenderer content={chapter.content_ua || chapter.content_en || ""} />
                    )}
                  </div>
                </Card>

                <Card className="verse-surface p-8">
                  <div className="text-center mb-4 text-sm font-semibold text-muted-foreground">English</div>
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    {isAdmin ? (
                      <UniversalInlineEditor
                        table="chapters"
                        recordId={chapter.id}
                        field="content_en"
                        initialValue={chapter.content_en || chapter.content_ua || ""}
                        label={`Контент лекції (EN)`}
                        language="en"
                        showToggle={true}
                      />
                    ) : (
                      <TiptapRenderer content={chapter.content_en || chapter.content_ua || ""} />
                    )}
                  </div>
                </Card>
              </div>

              <div className="flex items-center justify-between border-t pt-8">
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
          ) : (
            <Card className="verse-surface p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {isAdmin ? (
                  <UniversalInlineEditor
                    table="chapters"
                    recordId={chapter.id}
                    field={language === "ua" ? "content_ua" : "content_en"}
                    initialValue={
                      language === "ua"
                        ? chapter.content_ua || chapter.content_en || ""
                        : chapter.content_en || chapter.content_ua || ""
                    }
                    label={`Контент лекції (${language.toUpperCase()})`}
                    language={language}
                    showToggle={true}
                  />
                ) : (
                  <TiptapRenderer
                    content={
                      language === "ua"
                        ? chapter.content_ua || chapter.content_en || ""
                        : chapter.content_en || chapter.content_ua || ""
                    }
                  />
                )}
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
          )
        ) : continuousReadingSettings.enabled ? (
          <div className="space-y-8">
            {verses.map((verse) => {
              const verseIdx = getDisplayVerseNumber(verse.verse_number);
              const fullVerseNumber = isCantoMode
                ? `${cantoNumber}.${chapterNumber}.${verseIdx}`
                : `${chapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;

              // Налаштування для безперервного режиму
              const contSettings = {
                showSanskrit: continuousReadingSettings.showSanskrit,
                showTransliteration: continuousReadingSettings.showTransliteration,
                showSynonyms: false, // в безперервному режимі не показуємо
                showTranslation: continuousReadingSettings.showTranslation,
                showCommentary: continuousReadingSettings.showCommentary,
              };

              return (
                <div key={verse.id}>
                  {continuousReadingSettings.showVerseNumbers && (
                    <div className="mb-2 text-sm font-semibold text-primary">Вірш {fullVerseNumber}</div>
                  )}
                  <VerseCard
                    verseId={verse.id}
                    verseNumber={fullVerseNumber}
                    bookName={chapterTitle}
                    sanskritText={verse.sanskrit || ""}
                    transliteration={verse.transliteration || ""}
                    synonyms={language === "ua" ? verse.synonyms_ua || "" : verse.synonyms_en || ""}
                    translation={language === "ua" ? verse.translation_ua || "" : verse.translation_en || ""}
                    commentary={language === "ua" ? verse.commentary_ua || "" : verse.commentary_en || ""}
                    audioUrl={verse.audio_url || ""}
                    textDisplaySettings={contSettings}
                    showNumberBadge={false}
                    isAdmin={false}
                    onVerseUpdate={() => {}}
                  />
                </div>
              );
            })}

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
                    <Card className="verse-surface w-full animate-fade-in border-gray-100 bg-card shadow-sm dark:border-border">
                      <div className="p-6">
                        {/* Верхня панель: номер вірша */}
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex h-8 items-center justify-center rounded-full bg-primary/10 px-3">
                            <span className="text-sm font-semibold text-primary">Вірш {fullVerseNumber}</span>
                          </div>
                        </div>

                        {/* Санскрит (спільний для обох мов) */}
                        {textDisplaySettings.showSanskrit && currentVerse.sanskrit && (
                          <div className="mb-10">
                            <p className="whitespace-pre-line text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground">
                              {currentVerse.sanskrit}
                            </p>
                          </div>
                        )}

                        {/* Транслітерація (спільна) */}
                        {textDisplaySettings.showTransliteration && currentVerse.transliteration && (
                          <div className="mb-8">
                            <div className="space-y-1 text-center">
                              {currentVerse.transliteration.split("\n").map((line, idx) => (
                                <p
                                  key={idx}
                                  className="font-sanskrit-italic italic text-[1.22em] leading-relaxed text-gray-500 dark:text-muted-foreground"
                                >
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Послівний переклад */}
                        {textDisplaySettings.showSynonyms && (currentVerse.synonyms_ua || currentVerse.synonyms_en) && (
                          <div className="mb-6 border-t border-border pt-6">
                            <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                              {t("Послівний переклад", "Word-for-word")}
                            </h4>
                            {dualLanguageMode ? (
                              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div className="border-r border-border pr-4">
                                  <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                  <p className="text-[1.17em] leading-relaxed text-foreground whitespace-pre-line">
                                    {currentVerse.synonyms_ua || "—"}
                                  </p>
                                </div>
                                <div className="pl-4">
                                  <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                  <p className="text-[1.17em] leading-relaxed text-foreground whitespace-pre-line">
                                    {currentVerse.synonyms_en || "—"}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[1.17em] leading-relaxed text-foreground whitespace-pre-line">
                                {language === "ua" ? currentVerse.synonyms_ua : currentVerse.synonyms_en}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Літературний переклад */}
                        {textDisplaySettings.showTranslation &&
                          (currentVerse.translation_ua || currentVerse.translation_en) && (
                            <div className="mb-6 border-t border-border pt-6">
                              <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                                {t("Літературний переклад", "Translation")}
                              </h4>
                              {dualLanguageMode ? (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                  <div className="border-r border-border pr-4">
                                    <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                    <p className="text-[1.28em] font-medium leading-relaxed text-foreground whitespace-pre-line">
                                      {currentVerse.translation_ua || "—"}
                                    </p>
                                  </div>
                                  <div className="pl-4">
                                    <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                    <p className="text-[1.28em] font-medium leading-relaxed text-foreground whitespace-pre-line">
                                      {currentVerse.translation_en || "—"}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[1.28em] font-medium leading-relaxed text-foreground whitespace-pre-line">
                                  {language === "ua" ? currentVerse.translation_ua : currentVerse.translation_en}
                                </p>
                              )}
                            </div>
                          )}

                        {/* Пояснення */}
                        {textDisplaySettings.showCommentary &&
                          (currentVerse.commentary_ua || currentVerse.commentary_en) && (
                            <div className="border-t border-border pt-6">
                              <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                                {t("Пояснення", "Purport")}
                              </h4>
                              {dualLanguageMode ? (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                  <div className="border-r border-border pr-4">
                                    <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                    <TiptapRenderer
                                      content={currentVerse.commentary_ua || ""}
                                      className="text-[1.22em] leading-relaxed"
                                    />
                                  </div>
                                  <div className="pl-4">
                                    <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                    <TiptapRenderer
                                      content={currentVerse.commentary_en || ""}
                                      className="text-[1.22em] leading-relaxed"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <TiptapRenderer
                                  content={
                                    language === "ua"
                                      ? currentVerse.commentary_ua || ""
                                      : currentVerse.commentary_en || ""
                                  }
                                  className="text-[1.22em] leading-relaxed"
                                />
                              )}
                            </div>
                          )}
                      </div>
                    </Card>

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
                        <Button
                          variant="secondary"
                          onClick={handlePrevChapter}
                          disabled={currentChapterIndex === -1 || currentChapterIndex === 0}
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          {t("Попередня глава", "Previous Chapter")}
                        </Button>

                        <span className="text-sm text-muted-foreground">
                          {t("Глава", "Chapter")} {currentChapterIndex + 1} {t("з", "of")} {allChapters.length}
                        </span>

                        <Button
                          variant="secondary"
                          onClick={handleNextChapter}
                          disabled={currentChapterIndex === -1 || currentChapterIndex === allChapters.length - 1}
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
    </div>
  );
};
