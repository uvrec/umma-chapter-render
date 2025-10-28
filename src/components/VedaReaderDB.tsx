// VedaReaderDB.tsx — ENHANCED VERSION
// Додано: Sticky Header, Bookmark, Share, Download, Keyboard Navigation

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Settings, Bookmark, Share2, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VerseCard } from "@/components/VerseCard";
import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
export const VedaReaderDB = () => {
  const {
    bookId,
    chapterId,
    cantoNumber,
    chapterNumber
  } = useParams();
  const navigate = useNavigate();
  const {
    language,
    t
  } = useLanguage();
  const {
    isAdmin
  } = useAuth();
  const queryClient = useQueryClient();
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // 🆕 Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Читаємо налаштування з localStorage і слухаємо зміни
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("vv_reader_fontSize");
    return saved ? Number(saved) : 18;
  });
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem("vv_reader_lineHeight");
    return saved ? Number(saved) : 1.6;
  });
  const [dualLanguageMode, setDualLanguageMode] = useState(() => localStorage.getItem("vv_reader_dualMode") === "true");

  // Читаємо блоки з localStorage
  const [textDisplaySettings, setTextDisplaySettings] = useState(() => {
    try {
      const saved = localStorage.getItem("vv_reader_blocks");
      if (saved) {
        return {
          showSanskrit: true,
          showTransliteration: true,
          showSynonyms: true,
          showTranslation: true,
          showCommentary: true,
          ...JSON.parse(saved)
        };
      }
    } catch {}
    return {
      showSanskrit: true,
      showTransliteration: true,
      showSynonyms: true,
      showTranslation: true,
      showCommentary: true
    };
  });

  // Слухаємо зміни з GlobalSettingsPanel
  useEffect(() => {
    const handlePrefsChanged = () => {
      // Оновлюємо fontSize
      const newFontSize = localStorage.getItem("vv_reader_fontSize");
      if (newFontSize) setFontSize(Number(newFontSize));

      // Оновлюємо lineHeight
      const newLineHeight = localStorage.getItem("vv_reader_lineHeight");
      if (newLineHeight) setLineHeight(Number(newLineHeight));

      // Оновлюємо dualMode
      const newDualMode = localStorage.getItem("vv_reader_dualMode") === "true";
      setDualLanguageMode(newDualMode);

      // Оновлюємо blocks
      try {
        const blocksStr = localStorage.getItem("vv_reader_blocks");
        if (blocksStr) {
          const blocks = JSON.parse(blocksStr);
          setTextDisplaySettings({
            showSanskrit: blocks.sanskrit ?? true,
            showTransliteration: blocks.translit ?? true,
            showSynonyms: blocks.synonyms ?? true,
            showTranslation: blocks.translation ?? true,
            showCommentary: blocks.commentary ?? true
          });
        }
      } catch {}
    };
    window.addEventListener("vv-reader-prefs-changed", handlePrefsChanged);
    return () => window.removeEventListener("vv-reader-prefs-changed", handlePrefsChanged);
  }, []);
  const [craftPaperMode, setCraftPaperMode] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState<"sanskrit" | "ua" | "en">("sanskrit");
  const [continuousReadingSettings, setContinuousReadingSettings] = useState({
    enabled: false,
    showVerseNumbers: true,
    showSanskrit: true,
    showTransliteration: true,
    showTranslation: true,
    showCommentary: true
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
  const {
    data: book
  } = useQuery({
    queryKey: ["book", bookId],
    staleTime: 60_000,
    enabled: !!bookId,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("books").select("id, slug, title_ua, title_en, has_cantos").eq("slug", bookId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  // CANTO (лише в canto mode)
  const {
    data: canto
  } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber],
    staleTime: 60_000,
    enabled: isCantoMode && !!book?.id && !!cantoNumber,
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      const {
        data,
        error
      } = await supabase.from("cantos").select("id, canto_number, title_ua, title_en").eq("book_id", book.id).eq("canto_number", parseInt(cantoNumber)).maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  // CHAPTER
  const {
    data: chapter,
    isLoading: isLoadingChapter
  } = useQuery({
    queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam, isCantoMode],
    staleTime: 60_000,
    enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id),
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      const base = supabase.from("chapters").select("*").eq("chapter_number", parseInt(effectiveChapterParam));
      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book.id);
      const {
        data,
        error
      } = await query.maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  // VERSES
  const {
    data: verses = [],
    isLoading: isLoadingVerses
  } = useQuery({
    queryKey: ["verses", chapter?.id],
    staleTime: 60_000,
    enabled: !!chapter?.id,
    queryFn: async () => {
      if (!chapter?.id) return [];
      const {
        data,
        error
      } = await supabase.from("verses").select("*").eq("chapter_id", chapter.id).order("verse_number_sort", {
        ascending: true
      });
      if (error) throw error;
      return (data || []) as any[];
    }
  });

  // ALL CHAPTERS (для навігації між главами)
  const {
    data: allChapters = []
  } = useQuery({
    queryKey: isCantoMode ? ["all-chapters-canto", canto?.id] : ["all-chapters-book", book?.id],
    staleTime: 60_000,
    enabled: isCantoMode ? !!canto?.id : !!book?.id,
    queryFn: async () => {
      const base = supabase.from("chapters").select("id, chapter_number").order("chapter_number");
      const query = isCantoMode && canto?.id ? base.eq("canto_id", canto.id) : base.eq("book_id", book!.id);
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data || [];
    }
  });
  const isLoading = isLoadingChapter || isLoadingVerses;

  // Мутація для оновлення вірша
  const updateVerseMutation = useMutation({
    mutationFn: async ({
      verseId,
      updates
    }: {
      verseId: string;
      updates: any;
    }) => {
      const payload: any = {
        sanskrit: updates.sanskrit
      };

      // Transliteration - зберігати в правильне поле
      if (updates.transliteration_ua) {
        payload.transliteration_ua = updates.transliteration_ua;
      }
      if (updates.transliteration_en) {
        payload.transliteration_en = updates.transliteration_en;
      }
      // Fallback для single mode
      if (updates.transliteration && !updates.transliteration_ua && !updates.transliteration_en) {
        if (language === "ua") {
          payload.transliteration_ua = updates.transliteration;
        } else {
          payload.transliteration_en = updates.transliteration;
        }
      }

      // Інші поля залежать від мови
      if (language === "ua") {
        payload.synonyms_ua = updates.synonyms;
        payload.translation_ua = updates.translation;
        payload.commentary_ua = updates.commentary;
      } else {
        payload.synonyms_en = updates.synonyms;
        payload.translation_en = updates.translation;
        payload.commentary_en = updates.commentary;
      }
      const {
        error
      } = await supabase.from("verses").update(payload).eq("id", verseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["verses", chapter?.id]
      });
      toast({
        title: t("Збережено", "Saved"),
        description: t("Вірш оновлено", "Verse updated")
      });
    },
    onError: (err: any) => {
      toast({
        title: t("Помилка", "Error"),
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const cantoTitle = canto ? language === "ua" ? canto.title_ua : canto.title_en : null;
  const chapterTitle = chapter ? language === "ua" ? chapter.title_ua : chapter.title_en : null;
  const currentChapterIndex = allChapters.findIndex(ch => ch.id === chapter?.id);
  const currentVerse = verses[currentVerseIndex];

  // 🆕 Bookmark функція
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? t("Закладку видалено", "Bookmark removed") : t("Додано до закладок", "Added to bookmarks"),
      description: chapterTitle
    });
  };

  // 🆕 Share функція
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${bookTitle} - ${chapterTitle}`,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: t("Посилання скопійовано", "Link copied"),
        description: url
      });
    }
  };

  // 🆕 Download функція
  const handleDownload = () => {
    toast({
      title: t("Завантаження", "Download"),
      description: t("Функція в розробці", "Feature in development")
    });
  };

  // 🆕 Keyboard navigation (← →)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ігноруємо якщо фокус в input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if (e.key === "ArrowLeft" && currentVerseIndex > 0) {
        setCurrentVerseIndex(currentVerseIndex - 1);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else if (e.key === "ArrowRight" && currentVerseIndex < verses.length - 1) {
        setCurrentVerseIndex(currentVerseIndex + 1);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentVerseIndex, verses.length]);
  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };
  const handleNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };
  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = allChapters[currentChapterIndex - 1];
      const path = isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${prevChapter.chapter_number}` : `/veda-reader/${bookId}/${prevChapter.chapter_number}`;
      navigate(path);
      setCurrentVerseIndex(0);
    }
  };
  const handleNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      const path = isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${nextChapter.chapter_number}` : `/veda-reader/${bookId}/${nextChapter.chapter_number}`;
      navigate(path);
      setCurrentVerseIndex(0);
    }
  };

  // Скелетон-завантаження
  if (isLoading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Завантаження...", "Loading...")}</p>
        </div>
      </div>;
  }
  if (!chapter) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="mb-4 text-muted-foreground">{t("Немає даних для цієї глави", "No data for this chapter")}</p>
          <Button variant="outline" onClick={() => navigate(isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}` : `/veda-reader/${bookId}`)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("Назад", "Back")}
          </Button>
        </div>
      </div>;
  }
  const isTextChapter = chapter.chapter_type === "text" || verses.length === 0;

  // Глобальне застосування розміру шрифту до контенту рідера
  const readerStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`
  };
  return <div className={`min-h-screen ${craftPaperMode ? "craft-paper-bg" : "bg-background"}`}>
      <Header />

      {/* 🆕 Sticky Header з іконками */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" />
                {t("Бібліотека", "Library")}
              </a>
              <span>›</span>
              <a href={`/veda-reader/${bookId}`} className="hover:text-foreground transition-colors">
                {bookTitle}
              </a>
              {cantoTitle && <>
                  <span>›</span>
                  <a href={`/veda-reader/${bookId}/canto/${cantoNumber}`} className="hover:text-foreground transition-colors">
                    {cantoTitle}
                  </a>
                </>}
              <span>›</span>
              <span className="text-foreground font-medium">{chapterTitle}</span>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={toggleBookmark} title={t("Закладка", "Bookmark")}>
                <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} title={t("Поділитися", "Share")}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload} title={t("Завантажити", "Download")}>
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} title={t("Налаштування", "Settings")}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8" style={readerStyle} data-reader-root="true">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-center font-extrabold text-5xl">{chapterTitle}</h1>
        </div>

        {/* Intro/preface block (render above verses if present) */}
        {(language === "ua" ? chapter.content_ua : chapter.content_en) && !isTextChapter && (
          <Card className="verse-surface p-8 mb-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <TiptapRenderer content={language === "ua" ? chapter.content_ua || "" : chapter.content_en || ""} />
            </div>
          </Card>
        )}

        {isTextChapter ? <Card className="verse-surface p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <TiptapRenderer content={language === "ua" ? chapter.content_ua || "" : chapter.content_en || chapter.content_ua || ""} />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <Button variant="outline" onClick={handlePrevChapter} disabled={currentChapterIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("Попередня глава", "Previous Chapter")}
              </Button>

              <Button variant="outline" onClick={handleNextChapter} disabled={currentChapterIndex === allChapters.length - 1}>
                {t("Наступна глава", "Next Chapter")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card> : continuousReadingSettings.enabled ? <div className="space-y-8">
            {verses.map(verse => {
          const verseIdx = getDisplayVerseNumber(verse.verse_number);
          const fullVerseNumber = isCantoMode ? `${cantoNumber}.${chapterNumber}.${verseIdx}` : `${chapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;
          return <VerseCard key={verse.id} verseId={verse.id} verseNumber={fullVerseNumber} bookName={chapterTitle} sanskritText={language === "ua" ? (verse as any).sanskrit_ua || (verse as any).sanskrit || "" : (verse as any).sanskrit_en || (verse as any).sanskrit || ""} transliteration={language === "ua" ? (verse as any).transliteration_ua || "" : (verse as any).transliteration_en || ""} synonyms={language === "ua" ? (verse as any).synonyms_ua || "" : (verse as any).synonyms_en || ""} translation={language === "ua" ? (verse as any).translation_ua || "" : (verse as any).translation_en || ""} commentary={language === "ua" ? (verse as any).commentary_ua || "" : (verse as any).commentary_en || ""} audioUrl={(verse as any).audio_url || ""} textDisplaySettings={textDisplaySettings} isAdmin={isAdmin} onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
            verseId,
            updates
          })} />;
        })}
          </div> : <>
            {currentVerse && (() => {
          const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
          const fullVerseNumber = isCantoMode ? `${cantoNumber}.${chapterNumber}.${verseIdx}` : `${chapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;
          return <div className="space-y-6">
                    {dualLanguageMode ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <VerseCard key={`${currentVerse.id}-ua`} verseId={currentVerse.id} verseNumber={fullVerseNumber} bookName={chapterTitle} sanskritText={(currentVerse as any).sanskrit || ""} transliteration={(currentVerse as any).transliteration_ua || ""} synonyms={(currentVerse as any).synonyms_ua || ""} translation={(currentVerse as any).translation_ua || ""} commentary={(currentVerse as any).commentary_ua || ""} audioUrl={currentVerse.audio_url || ""} textDisplaySettings={textDisplaySettings} isAdmin={isAdmin} onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
                verseId,
                updates: {
                  sanskrit: updates.sanskrit,
                  transliteration_ua: updates.transliteration,
                  synonyms: updates.synonyms,
                  translation: updates.translation,
                  commentary: updates.commentary
                }
              })} />
                        <VerseCard key={`${currentVerse.id}-en`} verseId={currentVerse.id} verseNumber={fullVerseNumber} bookName={chapterTitle} sanskritText={(currentVerse as any).sanskrit || ""} transliteration={(currentVerse as any).transliteration_en || ""} synonyms={(currentVerse as any).synonyms_en || ""} translation={(currentVerse as any).translation_en || ""} commentary={(currentVerse as any).commentary_en || ""} audioUrl={currentVerse.audio_url || ""} textDisplaySettings={textDisplaySettings} isAdmin={isAdmin} onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
                verseId,
                updates: {
                  sanskrit: updates.sanskrit,
                  transliteration_en: updates.transliteration,
                  synonyms: updates.synonyms,
                  translation: updates.translation,
                  commentary: updates.commentary
                }
              })} />
                      </div> : <VerseCard key={currentVerse.id} verseId={currentVerse.id} verseNumber={fullVerseNumber} bookName={chapterTitle} sanskritText={(currentVerse as any).sanskrit || ""} transliteration={language === "ua" ? (currentVerse as any).transliteration_ua || "" : (currentVerse as any).transliteration_en || ""} synonyms={language === "ua" ? (currentVerse as any).synonyms_ua || "" : (currentVerse as any).synonyms_en || ""} translation={language === "ua" ? (currentVerse as any).translation_ua || "" : (currentVerse as any).translation_en || ""} commentary={language === "ua" ? (currentVerse as any).commentary_ua || "" : (currentVerse as any).commentary_en || ""} audioUrl={currentVerse.audio_url || ""} textDisplaySettings={textDisplaySettings} isAdmin={isAdmin} onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({
              verseId,
              updates
            })} />}

                    <div className="flex items-center justify-between border-t border-border pt-6">
                      <Button variant="outline" onClick={handlePrevVerse} disabled={currentVerseIndex === 0}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t("Попередній вірш", "Previous Verse")}
                      </Button>

                      <div className="text-sm text-muted-foreground">
                        {t("Вірш", "Verse")} {currentVerseIndex + 1} {t("з", "of")} {verses.length}
                      </div>

                      <Button variant="outline" onClick={handleNextVerse} disabled={currentVerseIndex === verses.length - 1}>
                        {t("Наступний вірш", "Next Verse")}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>;
        })()}
          </>}
      </div>

      {/* Глобальна панель налаштувань */}
      <GlobalSettingsPanel />
    </div>;
};