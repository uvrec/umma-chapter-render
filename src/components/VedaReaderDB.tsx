// Виправлена версія VedaReaderDB.tsx
// Помилка була в незакритих JSX тегах

import { useEffect, useState } from "react";
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

export function VedaReaderDB() {
  const { bookId, cantoNumber, chapterParam } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [dualLanguageMode, setDualLanguageMode] = useState(false);
  const [craftPaperMode, setCraftPaperMode] = useState(false);

  const [textDisplaySettings, setTextDisplaySettings] = useState({
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true,
  });

  const [originalLanguage, setOriginalLanguage] = useState<"sanskrit" | "ua" | "en">("sanskrit");
  const [continuousReadingSettings, setContinuousReadingSettings] = useState({
    enabled: false,
    autoNextChapter: false,
  });

  const isAdmin = user?.role === "admin";
  const isCantoMode = Boolean(cantoNumber);

  const effectiveChapterParam = isCantoMode ? `${cantoNumber}.${chapterParam}` : chapterParam;

  // Завантаження книги
  const { data: book } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("id", bookId).single();

      if (error) throw error;
      return data;
    },
    enabled: Boolean(bookId),
  });

  // Завантаження canto якщо є
  const { data: canto } = useQuery({
    queryKey: ["canto", bookId, cantoNumber],
    queryFn: async () => {
      if (!cantoNumber) return null;

      const { data, error } = await supabase
        .from("cantos")
        .select("*")
        .eq("book_id", bookId)
        .eq("canto_number", parseInt(cantoNumber))
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: Boolean(bookId && cantoNumber),
  });

  // Завантаження глави
  const { data: chapter, isLoading } = useQuery({
    queryKey: ["chapter", bookId, effectiveChapterParam],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("book_id", bookId)
        .eq("chapter_number", effectiveChapterParam || "")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: Boolean(bookId && effectiveChapterParam),
  });

  // Завантаження віршів
  const { data: verses = [] } = useQuery({
    queryKey: ["verses", chapter?.id],
    queryFn: async () => {
      if (!chapter?.id) return [];

      const { data, error } = await supabase
        .from("verses")
        .select("*")
        .eq("chapter_id", chapter.id)
        .order("verse_number");

      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(chapter?.id),
  });

  // Завантаження всіх глав книги
  const { data: allChapters = [] } = useQuery({
    queryKey: ["chapters", bookId],
    queryFn: async () => {
      let query = supabase
        .from("chapters")
        .select("*")
        .eq("book_id", bookId || "");

      if (isCantoMode && cantoNumber) {
        query = query.like("chapter_number", `${cantoNumber}.%`);
      }

      const { data, error } = await query.order("chapter_number");

      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(bookId),
  });

  const updateVerseMutation = useMutation({
    mutationFn: async ({ verseId, updates }: { verseId: string; updates: any }) => {
      const { error } = await supabase.from("verses").update(updates).eq("id", verseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses", chapter?.id] });
      toast({ title: t("Вірш оновлено", "Verse updated") });
    },
    onError: () => {
      toast({
        title: t("Помилка оновлення вірша", "Error updating verse"),
        variant: "destructive",
      });
    },
  });

  const currentVerse = verses[currentVerseIndex];
  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const cantoTitle = language === "ua" ? canto?.title_ua : canto?.title_en;
  const chapterTitle = language === "ua" ? chapter?.title_ua : chapter?.title_en;

  const currentChapterIndex = allChapters.findIndex((ch) => ch.chapter_number === effectiveChapterParam);

  const getDisplayVerseNumber = (verseNum: string) => {
    if (!verseNum) return "";
    const parts = verseNum.split(".");
    return parts[parts.length - 1];
  };

  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1);
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    } else if (continuousReadingSettings.autoNextChapter && currentChapterIndex < allChapters.length - 1) {
      handleNextChapter();
    }
  };

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

  const readerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
  };

  return (
    <div className={`min-h-screen ${craftPaperMode ? "craft-paper-bg" : "bg-background"}`}>
      <Header />

      <div className="container mx-auto px-4 py-8" style={readerStyle} data-reader-root="true">
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
                          bookName={chapterTitle}
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
                          bookName={chapterTitle}
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

                    <div className="flex items-center justify-between border-t pt-6">
                      <Button onClick={handlePrevVerse} disabled={currentVerseIndex === 0}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t("Попередній вірш", "Previous Verse")}
                      </Button>

                      <span className="text-sm text-muted-foreground">
                        {t("Вірш", "Verse")} {currentVerseIndex + 1} {t("з", "of")} {verses.length}
                      </span>

                      <Button onClick={handleNextVerse} disabled={currentVerseIndex === verses.length - 1}>
                        {t("Наступний вірш", "Next Verse")}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
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
                  </div>
                );
              })()}
          </>
        )}
      </div>

      <SettingsPanel
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        dualLanguageMode={dualLanguageMode}
        onDualLanguageModeChange={setDualLanguageMode}
        craftPaperMode={craftPaperMode}
        onCraftPaperModeChange={setCraftPaperMode}
        textDisplaySettings={textDisplaySettings}
        onTextDisplaySettingsChange={setTextDisplaySettings}
        originalLanguage={originalLanguage}
        onOriginalLanguageChange={(lang) => setOriginalLanguage(lang as "sanskrit" | "ua" | "en")}
        continuousReadingSettings={continuousReadingSettings}
        onContinuousReadingSettingsChange={setContinuousReadingSettings}
        verses={verses.map((v) => ({
          number: v.verse_number,
          translation: language === "ua" ? v.translation_ua : v.translation_en,
        }))}
        currentVerse={currentVerse?.verse_number || ""}
        onVerseSelect={(verseNum) => {
          const index = verses.findIndex((v) => v.verse_number === verseNum);
          if (index !== -1) setCurrentVerseIndex(index);
        }}
      />
    </div>
  );
}
