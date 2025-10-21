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
export function VedaReaderDB() {
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
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("vv_reader_fontSize");
    return saved ? Number(saved) : 18;
  });
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem("vv_reader_lineHeight");
    return saved ? Number(saved) : 1.6;
  });
  const [dualLanguageMode, setDualLanguageMode] = useState<boolean>(() => localStorage.getItem("vv_reader_dualMode") === "true");
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
          showCommentary: parsed.showCommentary ?? true
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
          showCommentary: parsed.showCommentary ?? false
        };
      }
    } catch {}
    return {
      enabled: false,
      showVerseNumbers: true,
      showSanskrit: false,
      showTransliteration: false,
      showTranslation: true,
      showCommentary: false
    };
  });
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-reader-root="true"]');
    if (root) root.style.lineHeight = String(lineHeight);
  }, [lineHeight]);
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
          setTextDisplaySettings(prev => ({
            ...prev,
            showSanskrit: parsed.showSanskrit ?? prev.showSanskrit,
            showTransliteration: parsed.showTransliteration ?? prev.showTransliteration,
            showSynonyms: parsed.showSynonyms ?? prev.showSynonyms,
            showTranslation: parsed.showTranslation ?? prev.showTranslation,
            showCommentary: parsed.showCommentary ?? prev.showCommentary
          }));
        }
      } catch {}
      try {
        const c = localStorage.getItem("vv_reader_continuous");
        if (c) {
          const parsed = JSON.parse(c);
          setContinuousReadingSettings(prev => ({
            ...prev,
            enabled: parsed.enabled ?? prev.enabled,
            showVerseNumbers: parsed.showVerseNumbers ?? prev.showVerseNumbers,
            showSanskrit: parsed.showSanskrit ?? prev.showSanskrit,
            showTransliteration: parsed.showTransliteration ?? prev.showTransliteration,
            showTranslation: parsed.showTranslation ?? prev.showTranslation,
            showCommentary: parsed.showCommentary ?? prev.showCommentary
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
    syncFromLS();
    return () => {
      window.removeEventListener("vv-reader-prefs-changed", onPrefs as any);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const getDisplayVerseNumber = (verseNumber: string): string => {
    const parts = verseNumber.split(/[\s.]+/);
    return parts[parts.length - 1] || verseNumber;
  };
  const isCantoMode = !!cantoNumber;
  const effectiveChapterParam = isCantoMode ? chapterNumber : chapterId;
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
  const {
    data: canto
  } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber],
    staleTime: 60_000,
    enabled: !!book?.id && !!cantoNumber,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("cantos").select("id, canto_number, title_ua, title_en").eq("book_id", book!.id).eq("canto_number", Number(cantoNumber)).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: chapter,
    isLoading: chapterLoading
  } = useQuery({
    queryKey: ["chapter", book?.id, canto?.id, effectiveChapterParam],
    staleTime: 60_000,
    enabled: !!book?.id && !!effectiveChapterParam,
    queryFn: async () => {
      let query = supabase.from("chapters").select("id, chapter_number, title_ua, title_en, content_ua, content_en, canto_id, book_id");

      // If in canto mode, query by chapter_number and canto_id
      if (isCantoMode && canto?.id) {
        query = query.eq("chapter_number", Number(effectiveChapterParam)).eq("canto_id", canto.id);
      } else {
        // Otherwise query by UUID
        query = query.eq("id", effectiveChapterParam);
      }
      const {
        data,
        error
      } = await query.maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: allChapters = []
  } = useQuery({
    queryKey: ["allChapters", book?.id, canto?.id],
    staleTime: 60_000,
    enabled: !!book?.id,
    queryFn: async () => {
      let query = supabase.from("chapters").select("id, chapter_number, title_ua, title_en, canto_id").eq("book_id", book!.id).order("chapter_number", {
        ascending: true
      });
      if (canto?.id) {
        query = query.eq("canto_id", canto.id);
      } else if (book?.has_cantos) {
        query = query.is("canto_id", null);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data || [];
    }
  });
  const {
    data: verses = [],
    isLoading: versesLoading
  } = useQuery({
    queryKey: ["verses", chapter?.id],
    staleTime: 60_000,
    enabled: !!chapter?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("verses").select("*").eq("chapter_id", chapter!.id).order("verse_number_sort", {
        ascending: true
      });
      if (error) throw error;
      return data || [];
    }
  });
  const currentVerse = verses[currentVerseIndex];
  const currentChapterIndex = useMemo(() => {
    if (!chapter) return -1;
    return allChapters.findIndex(ch => ch.id === chapter.id);
  }, [chapter, allChapters]);
  const handlePrevVerse = useCallback(() => {
    setCurrentVerseIndex(prev => Math.max(0, prev - 1));
  }, []);
  const handleNextVerse = useCallback(() => {
    setCurrentVerseIndex(prev => Math.min(verses.length - 1, prev + 1));
  }, [verses.length]);
  const handlePrevChapter = useCallback(() => {
    if (currentChapterIndex <= 0) return;
    const prevChapter = allChapters[currentChapterIndex - 1];
    if (!prevChapter) return;
    if (isCantoMode) {
      navigate(`/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${prevChapter.chapter_number}`);
    } else {
      navigate(`/veda-reader/${bookId}/${prevChapter.id}`);
    }
  }, [currentChapterIndex, allChapters, isCantoMode, navigate, bookId, cantoNumber]);
  const handleNextChapter = useCallback(() => {
    if (currentChapterIndex < 0 || currentChapterIndex >= allChapters.length - 1) return;
    const nextChapter = allChapters[currentChapterIndex + 1];
    if (!nextChapter) return;
    if (isCantoMode) {
      navigate(`/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${nextChapter.chapter_number}`);
    } else {
      navigate(`/veda-reader/${bookId}/${nextChapter.id}`);
    }
  }, [currentChapterIndex, allChapters, isCantoMode, navigate, bookId, cantoNumber]);
  const updateVerseMutation = useMutation({
    mutationFn: async ({ verseId, field, value }: { verseId: string; field: string; value: string }) => {
      const { error } = await supabase
        .from("verses")
        .update({ [field]: value })
        .eq("id", verseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses", chapter?.id] });
      toast({ title: language === "ua" ? "Збережено" : "Saved" });
    },
    onError: (err: any) => {
      console.error(err);
      toast({ title: language === "ua" ? "Помилка" : "Error", variant: "destructive" });
    },
  });
  const breadcrumbs = useMemo(() => {
    const items: Array<{
      label: string;
      href: string;
    }> = [{
      label: t("Головна", "Home"),
      href: "/"
    }, {
      label: t("Бібліотека", "Library"),
      href: "/library"
    }];
    if (book) {
      items.push({
        label: language === "ua" ? book.title_ua : book.title_en,
        href: `/veda-reader/${bookId}`
      });
    }
    if (canto) {
      items.push({
        label: language === "ua" ? canto.title_ua : canto.title_en,
        href: `/veda-reader/${bookId}/canto/${cantoNumber}`
      });
    }
    if (chapter) {
      const chTitle = language === "ua" ? chapter.title_ua : chapter.title_en;
      items.push({
        label: `${t("Глава", "Chapter")} ${chapter.chapter_number}: ${chTitle}`,
        href: isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapter.chapter_number}` : `/veda-reader/${bookId}/${chapter.id}`
      });
    }
    return items;
  }, [book, canto, chapter, bookId, cantoNumber, language, t, isCantoMode]);
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8" data-reader-root="true" style={{
      fontSize: `${fontSize}px`
    }}>
        {!bookId ? <div className="text-center">
            <p className="text-muted-foreground">{t("Виберіть книгу", "Select a book")}</p>
          </div> : chapterLoading || versesLoading ? <div className="text-center">
            <p className="text-muted-foreground">{t("Завантаження...", "Loading...")}</p>
          </div> : !chapter ? <div className="text-center">
            <p className="text-muted-foreground">{t("Глава не знайдена", "Chapter not found")}</p>
          </div> : <>
            <Breadcrumb items={breadcrumbs} />

            <div className="mb-6 text-center">
              <h1 className="mb-2 font-bold text-foreground text-5xl">
                {language === "ua" ? chapter.title_ua : chapter.title_en}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("Глава", "Chapter")} {chapter.chapter_number}
              </p>
            </div>

            {verses.length === 0 ? <div className="text-center">
                <p className="text-muted-foreground">{t("Немає віршів", "No verses found")}</p>
              </div> : (() => {
          if (continuousReadingSettings.enabled) {
            return <div className="space-y-6">
                      {verses.map(v => <div key={v.id} className="pb-6 border-b border-border last:border-0">
                          {continuousReadingSettings.showVerseNumbers && <div className="mb-4 text-center">
                              <span className="inline-block rounded bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                                {t("Текст", "Text")} {getDisplayVerseNumber(v.verse_number)}
                              </span>
                            </div>}

                          {continuousReadingSettings.showSanskrit && v.sanskrit && <div className="mb-6">
                              {isAdmin ? (
                                <UniversalInlineEditor
                                  table="verses"
                                  recordId={v.id}
                                  field="sanskrit"
                                  initialValue={v.sanskrit}
                                  label="Sanskrit"
                                  language={language}
                                  showToggle={true}
                                />
                              ) : (
                                <p className="whitespace-pre-line text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground">
                                  {v.sanskrit}
                                </p>
                              )}
                            </div>}

                          {continuousReadingSettings.showTransliteration && v.transliteration && <div className="mb-6">
                              {isAdmin ? (
                                <UniversalInlineEditor
                                  table="verses"
                                  recordId={v.id}
                                  field="transliteration"
                                  initialValue={v.transliteration}
                                  label="Transliteration"
                                  language={language}
                                  showToggle={true}
                                />
                              ) : (
                                <div className="space-y-1 text-center">
                                  {v.transliteration.split("\n").map((line, i) => <p key={i} className="font-sanskrit-italic italic text-[1.22em] leading-relaxed text-gray-500 dark:text-muted-foreground">
                                      {line}
                                    </p>)}
                                </div>
                              )}
                            </div>}

                          {continuousReadingSettings.showTranslation && <div className="mb-6">
                              {isAdmin ? (
                                dualLanguageMode ? (
                                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <div className="border-r border-border pr-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                      <UniversalInlineEditor
                                        table="verses"
                                        recordId={v.id}
                                        field="translation_ua"
                                        initialValue={v.translation_ua || ""}
                                        label="Translation UA"
                                        language="ua"
                                        showToggle={true}
                                      />
                                    </div>
                                    <div className="pl-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                      <UniversalInlineEditor
                                        table="verses"
                                        recordId={v.id}
                                        field="translation_en"
                                        initialValue={v.translation_en || ""}
                                        label="Translation EN"
                                        language="en"
                                        showToggle={true}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <UniversalInlineEditor
                                    table="verses"
                                    recordId={v.id}
                                    field={language === "ua" ? "translation_ua" : "translation_en"}
                                    initialValue={(language === "ua" ? v.translation_ua : v.translation_en) || ""}
                                    label={`Translation (${language.toUpperCase()})`}
                                    language={language}
                                    showToggle={true}
                                  />
                                )
                              ) : (
                                dualLanguageMode ? <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <div className="border-r border-border pr-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                      <p className="text-[1.28em] font-medium leading-relaxed text-foreground whitespace-pre-line">
                                        {v.translation_ua || "—"}
                                      </p>
                                    </div>
                                    <div className="pl-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                      <p className="text-[1.28em] font-medium leading-relaxed text-foreground whitespace-pre-line">
                                        {v.translation_en || "—"}
                                      </p>
                                    </div>
                                  </div> : <p className="text-[1.28em] font-medium leading-relaxed text-foreground whitespace-pre-line">
                                    {language === "ua" ? v.translation_ua : v.translation_en}
                                  </p>
                              )}
                            </div>}

                          {continuousReadingSettings.showCommentary && (v.commentary_ua || v.commentary_en) && <div className="border-t border-border pt-6">
                              {isAdmin ? (
                                dualLanguageMode ? (
                                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="border-r border-border pr-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                      <UniversalInlineEditor
                                        table="verses"
                                        recordId={v.id}
                                        field="commentary_ua"
                                        initialValue={v.commentary_ua || ""}
                                        label="Commentary UA"
                                        language="ua"
                                        showToggle={true}
                                      />
                                    </div>
                                    <div className="pl-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                      <UniversalInlineEditor
                                        table="verses"
                                        recordId={v.id}
                                        field="commentary_en"
                                        initialValue={v.commentary_en || ""}
                                        label="Commentary EN"
                                        language="en"
                                        showToggle={true}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <UniversalInlineEditor
                                    table="verses"
                                    recordId={v.id}
                                    field={language === "ua" ? "commentary_ua" : "commentary_en"}
                                    initialValue={(language === "ua" ? v.commentary_ua : v.commentary_en) || ""}
                                    label={`Commentary (${language.toUpperCase()})`}
                                    language={language}
                                    showToggle={true}
                                  />
                                )
                              ) : (
                                dualLanguageMode ? <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="border-r border-border pr-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                      <TiptapRenderer content={v.commentary_ua || ""} className="text-[1.22em] leading-relaxed" />
                                    </div>
                                    <div className="pl-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                      <TiptapRenderer content={v.commentary_en || ""} className="text-[1.22em] leading-relaxed" />
                                    </div>
                                  </div> : <TiptapRenderer content={language === "ua" ? v.commentary_ua || "" : v.commentary_en || ""} className="text-[1.22em] leading-relaxed" />
                              )}
                            </div>}
                        </div>)}

                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                          <Button variant="secondary" onClick={handlePrevChapter} disabled={currentChapterIndex === -1 || currentChapterIndex === 0}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            {t("Попередня глава", "Previous Chapter")}
                          </Button>

                          <span className="text-sm text-muted-foreground">
                            {t("Глава", "Chapter")} {currentChapterIndex + 1} {t("з", "of")} {allChapters.length}
                          </span>

                          <Button variant="secondary" onClick={handleNextChapter} disabled={currentChapterIndex === -1 || currentChapterIndex === allChapters.length - 1}>
                            {t("Наступна глава", "Next Chapter")}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>;
          }
          return <div className="mx-auto max-w-4xl">
                    <Card className="mb-6 p-8">
                      <div>
                        <div className="mb-8 text-center">
                          <span className="inline-block rounded bg-muted px-4 py-2 text-lg font-bold text-muted-foreground">
                            {t("Текст", "Text")} {getDisplayVerseNumber(currentVerse.verse_number)}
                          </span>
                        </div>

                        {textDisplaySettings.showSanskrit && currentVerse.sanskrit && <div className="mb-10">
                            {isAdmin ? (
                              <UniversalInlineEditor
                                table="verses"
                                recordId={currentVerse.id}
                                field="sanskrit"
                                initialValue={currentVerse.sanskrit}
                                label="Sanskrit"
                                language={language}
                                showToggle={true}
                              />
                            ) : (
                              <p className="whitespace-pre-line text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground">
                                {currentVerse.sanskrit}
                              </p>
                            )}
                          </div>}

                        {textDisplaySettings.showTransliteration && currentVerse.transliteration && <div className="mb-8">
                            {isAdmin ? (
                              <UniversalInlineEditor
                                table="verses"
                                recordId={currentVerse.id}
                                field="transliteration"
                                initialValue={currentVerse.transliteration}
                                label="Transliteration"
                                language={language}
                                showToggle={true}
                              />
                            ) : (
                              <div className="space-y-1 text-center">
                                {currentVerse.transliteration.split("\n").map((line, idx) => <p key={idx} className="font-sanskrit-italic italic leading-relaxed text-gray-500 dark:text-muted-foreground font-extralight text-3xl">
                                    {line}
                                  </p>)}
                              </div>
                            )}
                          </div>}

                        {textDisplaySettings.showSynonyms && (currentVerse.synonyms_ua || currentVerse.synonyms_en) && <div className="mb-6 border-t border-border pt-6">
                            <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                              {t("Послівний переклад", "Word-for-word")}
                            </h4>
                            {isAdmin ? (
                              dualLanguageMode ? (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                  <div className="border-r border-border pr-4">
                                    <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                    <UniversalInlineEditor
                                      table="verses"
                                      recordId={currentVerse.id}
                                      field="synonyms_ua"
                                      initialValue={currentVerse.synonyms_ua || ""}
                                      label="Synonyms UA"
                                      language="ua"
                                      showToggle={true}
                                    />
                                  </div>
                                  <div className="pl-4">
                                    <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                    <UniversalInlineEditor
                                      table="verses"
                                      recordId={currentVerse.id}
                                      field="synonyms_en"
                                      initialValue={currentVerse.synonyms_en || ""}
                                      label="Synonyms EN"
                                      language="en"
                                      showToggle={true}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <UniversalInlineEditor
                                  table="verses"
                                  recordId={currentVerse.id}
                                  field={language === "ua" ? "synonyms_ua" : "synonyms_en"}
                                  initialValue={(language === "ua" ? currentVerse.synonyms_ua : currentVerse.synonyms_en) || ""}
                                  label={`Synonyms (${language.toUpperCase()})`}
                                  language={language}
                                  showToggle={true}
                                />
                              )
                            ) : (
                              dualLanguageMode ? <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                                </div> : <p className="leading-relaxed text-foreground whitespace-pre-line text-3xl">
                                  {language === "ua" ? currentVerse.synonyms_ua : currentVerse.synonyms_en}
                                </p>
                            )}
                          </div>}

                        {textDisplaySettings.showTranslation && (currentVerse.translation_ua || currentVerse.translation_en) && <div className="mb-6 border-t border-border pt-6">
                              <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                                {t("Літературний переклад", "Translation")}
                              </h4>
                              {isAdmin ? (
                                dualLanguageMode ? (
                                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="border-r border-border pr-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                      <UniversalInlineEditor
                                        table="verses"
                                        recordId={currentVerse.id}
                                        field="translation_ua"
                                        initialValue={currentVerse.translation_ua || ""}
                                        label="Translation UA"
                                        language="ua"
                                        showToggle={true}
                                      />
                                    </div>
                                    <div className="pl-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                      <UniversalInlineEditor
                                        table="verses"
                                        recordId={currentVerse.id}
                                        field="translation_en"
                                        initialValue={currentVerse.translation_en || ""}
                                        label="Translation EN"
                                        language="en"
                                        showToggle={true}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <UniversalInlineEditor
                                    table="verses"
                                    recordId={currentVerse.id}
                                    field={language === "ua" ? "translation_ua" : "translation_en"}
                                    initialValue={(language === "ua" ? currentVerse.translation_ua : currentVerse.translation_en) || ""}
                                    label={`Translation (${language.toUpperCase()})`}
                                    language={language}
                                    showToggle={true}
                                  />
                                )
                              ) : (
                                dualLanguageMode ? <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                                  </div> : <p className="font-medium leading-relaxed text-foreground whitespace-pre-line text-3xl">
                                    {language === "ua" ? currentVerse.translation_ua : currentVerse.translation_en}
                                  </p>
                              )}
                            </div>}

                        {textDisplaySettings.showCommentary && (currentVerse.commentary_ua || currentVerse.commentary_en) && <div className="border-t border-border pt-6">
                              <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                                {t("Пояснення", "Purport")}
                              </h4>
                              {isAdmin ? (
                                dualLanguageMode ? (
                                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="border-r border-border pr-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                      <UniversalInlineEditor
                                        table="verses"
                                        recordId={currentVerse.id}
                                        field="commentary_ua"
                                        initialValue={currentVerse.commentary_ua || ""}
                                        label="Commentary UA"
                                        language="ua"
                                        showToggle={true}
                                      />
                                    </div>
                                    <div className="pl-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                      <UniversalInlineEditor
                                        table="verses"
                                        recordId={currentVerse.id}
                                        field="commentary_en"
                                        initialValue={currentVerse.commentary_en || ""}
                                        label="Commentary EN"
                                        language="en"
                                        showToggle={true}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <UniversalInlineEditor
                                    table="verses"
                                    recordId={currentVerse.id}
                                    field={language === "ua" ? "commentary_ua" : "commentary_en"}
                                    initialValue={(language === "ua" ? currentVerse.commentary_ua : currentVerse.commentary_en) || ""}
                                    label={`Commentary (${language.toUpperCase()})`}
                                    language={language}
                                    showToggle={true}
                                  />
                                )
                              ) : (
                                dualLanguageMode ? <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="border-r border-border pr-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                                      <TiptapRenderer content={currentVerse.commentary_ua || ""} className="text-[1.22em] leading-relaxed" />
                                    </div>
                                    <div className="pl-4">
                                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                                      <TiptapRenderer content={currentVerse.commentary_en || ""} className="text-[1.22em] leading-relaxed" />
                                    </div>
                                  </div> : <TiptapRenderer content={language === "ua" ? currentVerse.commentary_ua || "" : currentVerse.commentary_en || ""} className="text-[1.22em] leading-relaxed" />
                              )}
                            </div>}
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

                      <Button variant="outline" onClick={handleNextVerse} disabled={currentVerseIndex === verses.length - 1}>
                        {t("Наступний", "Next")}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <Button variant="secondary" onClick={handlePrevChapter} disabled={currentChapterIndex === -1 || currentChapterIndex === 0}>
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          {t("Попередня глава", "Previous Chapter")}
                        </Button>

                        <span className="text-sm text-muted-foreground">
                          {t("Глава", "Chapter")} {currentChapterIndex + 1} {t("з", "of")} {allChapters.length}
                        </span>

                        <Button variant="secondary" onClick={handleNextChapter} disabled={currentChapterIndex === -1 || currentChapterIndex === allChapters.length - 1}>
                          {t("Наступна глава", "Next Chapter")}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>;
        })()}
          </>}
      </div>
    </div>;
}
export default VedaReaderDB;