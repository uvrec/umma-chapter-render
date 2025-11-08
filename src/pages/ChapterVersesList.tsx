// ChapterVersesList.tsx — Список віршів з підтримкою dualMode

import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookOpen, Edit, Save, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import DOMPurify from "dompurify";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { toast } from "@/hooks/use-toast";

export const ChapterVersesList = () => {
  const { bookId, chapterId, cantoNumber, chapterNumber } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Читаємо налаштування з localStorage
  const [dualMode, setDualMode] = useState(() => localStorage.getItem("vv_reader_dualMode") === "true");
  const [showNumbers, setShowNumbers] = useState(() => localStorage.getItem("vv_reader_showNumbers") !== "false");
  const [flowMode, setFlowMode] = useState(() => localStorage.getItem("vv_reader_flowMode") === "true");
  
  // Editing state
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContentUa, setEditedContentUa] = useState("");
  const [editedContentEn, setEditedContentEn] = useState("");

  // Summary editing state
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummaryUa, setEditedSummaryUa] = useState("");
  const [editedSummaryEn, setEditedSummaryEn] = useState("");

  // Слухаємо зміни з GlobalSettingsPanel
  useEffect(() => {
    const handler = () => {
      setDualMode(localStorage.getItem("vv_reader_dualMode") === "true");
      setShowNumbers(localStorage.getItem("vv_reader_showNumbers") !== "false");
      setFlowMode(localStorage.getItem("vv_reader_flowMode") === "true");
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
        .select("id, chapter_number, title_ua, title_en, content_ua, content_en, summary_ua, summary_en")
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
        .select("id, chapter_number, title_ua, title_en, content_ua, content_en")
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
          "id, verse_number, sanskrit, transliteration, transliteration_en, transliteration_ua, translation_ua, translation_en, is_published, deleted_at",
        )
        .eq("chapter_id", chapter.id)
        .is("deleted_at", null)
        .eq("is_published", true)
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
          "id, verse_number, sanskrit, transliteration, transliteration_en, transliteration_ua, translation_ua, translation_en, is_published, deleted_at",
        )
        .eq("chapter_id", fallbackChapter.id)
        .is("deleted_at", null)
        .eq("is_published", true)
        .order("verse_number_sort", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!fallbackChapter?.id,
  });

  const verses = versesMain && versesMain.length > 0 ? versesMain : versesFallback || [];

  // Приховуємо «порожні» вірші без перекладу (обидві мови порожні)
  const versesFiltered = useMemo(
    () =>
      (verses || []).filter(
        (v: any) => (v?.translation_ua && v.translation_ua.trim().length > 0) || (v?.translation_en && v.translation_en.trim().length > 0)
      ),
    [verses]
  );

  // Get adjacent chapters for navigation
  const { data: adjacentChapters } = useQuery({
    queryKey: ["adjacent-chapters", book?.id, canto?.id, effectiveChapterParam, isCantoMode],
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return { prev: null, next: null };

      const currentNum = parseInt(effectiveChapterParam as string);
      const base = supabase.from("chapters").select("id, chapter_number, title_ua, title_en");

      if (isCantoMode && canto?.id) {
        const { data } = await base.eq("canto_id", canto.id).order("chapter_number");
        const chapters = data || [];
        const currentIdx = chapters.findIndex(c => c.chapter_number === currentNum);
        return {
          prev: currentIdx > 0 ? chapters[currentIdx - 1] : null,
          next: currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null
        };
      } else {
        const { data } = await base.eq("book_id", book.id).is("canto_id", null).order("chapter_number");
        const chapters = data || [];
        const currentIdx = chapters.findIndex(c => c.chapter_number === currentNum);
        return {
          prev: currentIdx > 0 ? chapters[currentIdx - 1] : null,
          next: currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null
        };
      }
    },
    enabled: !!book?.id && !!effectiveChapterParam
  });

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
  const chapterTitle = effectiveChapterObj
    ? language === "ua"
      ? effectiveChapterObj.title_ua
      : effectiveChapterObj.title_en
    : null;

  // Save chapter content mutation
  const saveContentMutation = useMutation({
    mutationFn: async () => {
      if (!effectiveChapterObj?.id) return;
      const { error } = await supabase
        .from("chapters")
        .update({
          content_ua: editedContentUa,
          content_en: editedContentEn
        })
        .eq("id", effectiveChapterObj.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter"] });
      setIsEditingContent(false);
      toast({ title: "Зміни збережено" });
    },
    onError: () => {
      toast({ title: "Помилка збереження", variant: "destructive" });
    }
  });

  // Save chapter summary mutation
  const saveSummaryMutation = useMutation({
    mutationFn: async () => {
      if (!effectiveChapterObj?.id) return;
      const { error } = await supabase
        .from("chapters")
        .update({
          summary_ua: editedSummaryUa,
          summary_en: editedSummaryEn
        })
        .eq("id", effectiveChapterObj.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter"] });
      setIsEditingSummary(false);
      toast({ title: language === "ua" ? "Summary збережено" : "Summary saved" });
    },
    onError: () => {
      toast({ title: language === "ua" ? "Помилка збереження" : "Save error", variant: "destructive" });
    }
  });

  // Initialize edited content when chapter loads
  useEffect(() => {
    if (effectiveChapterObj) {
      setEditedContentUa(effectiveChapterObj.content_ua || "");
      setEditedContentEn(effectiveChapterObj.content_en || "");
      setEditedSummaryUa((effectiveChapterObj as any).summary_ua || "");
      setEditedSummaryEn((effectiveChapterObj as any).summary_en || "");
    }
  }, [effectiveChapterObj]);

  const handleNavigate = (chapterNum: number) => {
    if (isCantoMode) {
      navigate(`/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNum}`);
    } else {
      navigate(`/veda-reader/${bookId}/${chapterNum}`);
    }
  };

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
            
            {/* Chapter Navigation */}
            <div className="flex items-center gap-2">
              {adjacentChapters?.prev && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigate(adjacentChapters.prev.chapter_number)}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {language === "ua" ? "Попередня" : "Previous"}
                </Button>
              )}
              {adjacentChapters?.next && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigate(adjacentChapters.next.chapter_number)}
                  className="gap-2"
                >
                  {language === "ua" ? "Наступна" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
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

          {/* Summary блок - Vedabase style */}
          {(effectiveChapterObj && ((effectiveChapterObj as any).summary_ua || (effectiveChapterObj as any).summary_en || user)) && (
            <div className="mb-8 rounded-lg border border-border bg-card p-6">
              {user && !isEditingSummary && (
                <div className="mb-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingSummary(true)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {language === "ua" ? "Редагувати summary" : "Edit summary"}
                  </Button>
                </div>
              )}

              {isEditingSummary ? (
                <div className="space-y-4">
                  <InlineTiptapEditor
                    content={editedSummaryUa}
                    onChange={setEditedSummaryUa}
                    label={language === "ua" ? "Український summary" : "Ukrainian summary"}
                  />
                  <InlineTiptapEditor
                    content={editedSummaryEn}
                    onChange={setEditedSummaryEn}
                    label={language === "ua" ? "English summary" : "English summary"}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveSummaryMutation.mutate()}
                      disabled={saveSummaryMutation.isPending}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {language === "ua" ? "Зберегти" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingSummary(false);
                        setEditedSummaryUa((effectiveChapterObj as any).summary_ua || "");
                        setEditedSummaryEn((effectiveChapterObj as any).summary_en || "");
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      {language === "ua" ? "Скасувати" : "Cancel"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {dualMode ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                          {language === "ua" ? "Короткий зміст" : "Summary"} (UA)
                        </p>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize((effectiveChapterObj as any).summary_ua || "")
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                          Summary (EN)
                        </p>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize((effectiveChapterObj as any).summary_en || "")
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                        {language === "ua" ? "Короткий зміст" : "Summary"}
                      </p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            language === "ua"
                              ? ((effectiveChapterObj as any).summary_ua || (effectiveChapterObj as any).summary_en || "")
                              : ((effectiveChapterObj as any).summary_en || (effectiveChapterObj as any).summary_ua || "")
                          )
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Огляд глави */}
          {effectiveChapterObj && (effectiveChapterObj.content_ua || effectiveChapterObj.content_en) && (
            <div className="mb-8 rounded-lg border border-border bg-card p-6">
              {user && !isEditingContent && (
                <div className="mb-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingContent(true)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {language === "ua" ? "Редагувати" : "Edit"}
                  </Button>
                </div>
              )}

              {isEditingContent ? (
                <div className="space-y-4">
                  <InlineTiptapEditor
                    content={editedContentUa}
                    onChange={setEditedContentUa}
                    label="Українська"
                  />
                  <InlineTiptapEditor
                    content={editedContentEn}
                    onChange={setEditedContentEn}
                    label="English"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveContentMutation.mutate()}
                      disabled={saveContentMutation.isPending}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {language === "ua" ? "Зберегти" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingContent(false);
                        setEditedContentUa(effectiveChapterObj.content_ua || "");
                        setEditedContentEn(effectiveChapterObj.content_en || "");
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      {language === "ua" ? "Скасувати" : "Cancel"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(
                      language === "ua" 
                        ? (effectiveChapterObj.content_ua || effectiveChapterObj.content_en || "")
                        : (effectiveChapterObj.content_en || effectiveChapterObj.content_ua || "")
                    )
                  }}
                />
              )}
            </div>
          )}

          {/* Список віршів */}
          {flowMode ? (
            /* Режим суцільного тексту - без контейнерів, номерів, рамок */
            <div className="prose prose-lg max-w-none">
              {versesFiltered.map((verse, idx) => {
                const text = language === "ua" ? verse.translation_ua : verse.translation_en;
                return (
                  <p key={verse.id} className="text-xl leading-relaxed md:text-2xl md:leading-loose text-foreground mb-6">
                    {text || <span className="italic text-muted-foreground">{language === "ua" ? "Немає перекладу" : "No translation"}</span>}
                  </p>
                );
              })}
            </div>
          ) : (
            /* Звичайний режим */
            <div className="space-y-6">
              {verses.map((verse) => {
                const translationUa = verse.translation_ua || "";
                const translationEn = verse.translation_en || "";

                return (
                  <div key={verse.id} className="space-y-3">
                    {/* Side-by-side якщо dualMode */}
                    {dualMode ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Українська */}
                        <div className="space-y-3">
                          {showNumbers && (
                            <Link
                              to={getVerseUrl(verse.verse_number)}
                              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                            >
                              ВІРШ {verse.verse_number}
                            </Link>
                          )}
                          <p className="text-xl leading-relaxed md:text-2xl md:leading-loose text-foreground">
                            {translationUa || <span className="italic text-muted-foreground">Немає перекладу</span>}
                          </p>
                        </div>

                        {/* Англійська */}
                        <div className="space-y-3 border-l border-border pl-6">
                          {showNumbers && (
                            <Link
                              to={getVerseUrl(verse.verse_number)}
                              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                            >
                              TEXT {verse.verse_number}
                            </Link>
                          )}
                          <p className="text-xl leading-relaxed md:text-2xl md:leading-loose text-foreground">
                            {translationEn || <span className="italic text-muted-foreground">No translation</span>}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Одна мова */
                      <div className="space-y-3">
                        {showNumbers && (
                          <Link
                            to={getVerseUrl(verse.verse_number)}
                            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                          >
                            {language === "ua" ? `ВІРШ ${verse.verse_number}` : `TEXT ${verse.verse_number}`}
                          </Link>
                        )}
                        <p className="text-xl leading-relaxed md:text-2xl md:leading-loose text-foreground">
                          {language === "ua"
                            ? translationUa || <span className="italic text-muted-foreground">Немає перекладу</span>
                            : translationEn || <span className="italic text-muted-foreground">No translation</span>}
                        </p>
                      </div>
                    )}

                    {/* Невеликий відступ замість роздільної лінії */}
                    <div className="h-4" />
                  </div>
                );
              })}
            </div>
          )}

          {verses.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">У цій главі ще немає віршів</p>
            </div>
          )}

          {/* Bottom Chapter Navigation */}
          {(adjacentChapters?.prev || adjacentChapters?.next) && (
            <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
              {adjacentChapters?.prev ? (
                <Button
                  variant="outline"
                  onClick={() => handleNavigate(adjacentChapters.prev.chapter_number)}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">
                      {language === "ua" ? "Попередня глава" : "Previous Chapter"}
                    </div>
                    <div className="font-medium">
                      {language === "ua" ? adjacentChapters.prev.title_ua : adjacentChapters.prev.title_en}
                    </div>
                  </div>
                </Button>
              ) : <div />}
              
              {adjacentChapters?.next ? (
                <Button
                  variant="outline"
                  onClick={() => handleNavigate(adjacentChapters.next.chapter_number)}
                  className="gap-2"
                >
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {language === "ua" ? "Наступна глава" : "Next Chapter"}
                    </div>
                    <div className="font-medium">
                      {language === "ua" ? adjacentChapters.next.title_ua : adjacentChapters.next.title_en}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : <div />}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
