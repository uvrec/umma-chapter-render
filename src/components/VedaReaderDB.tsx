// src/components/VedaReaderDB.tsx
/**
 * ВИПРАВЛЕНА ЧИТАЛКА З БД
 *
 * ✅ Правильна синхронізація з GlobalSettingsPanel
 * ✅ Відстежування змін через vv-reader-prefs-changed
 * ✅ Всі налаштування працюють
 */

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { VerseCard } from "./VerseCard";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Verse {
  id: string;
  verse_number: string;
  sanskrit?: string;
  transliteration?: string;
  synonyms_en?: string;
  synonyms_ua?: string;
  translation_en?: string;
  translation_ua?: string;
  commentary_en?: string;
  commentary_ua?: string;
  display_blocks?: {
    sanskrit?: boolean;
    transliteration?: boolean;
    synonyms?: boolean;
    translation?: boolean;
    commentary?: boolean;
  };
}

interface Chapter {
  id: string;
  chapter_number: number;
  title_en?: string;
  title_ua?: string;
  canto_id?: string;
}

type TextDisplaySettings = {
  showSanskrit: boolean;
  showTransliteration: boolean;
  showSynonyms: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
};

type ContinuousReadingSettings = {
  enabled: boolean;
  showVerseNumbers: boolean;
  showSanskrit: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
};

export const VedaReaderDB = () => {
  const { bookSlug, cantoNum, chapterNum } = useParams();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);

  // Налаштування з localStorage
  const [fontSize, setFontSize] = useState<number>(() => {
    const s = localStorage.getItem("vv_reader_fontSize");
    return s ? Number(s) : 18;
  });

  const [lineHeight, setLineHeight] = useState<number>(() => {
    const s = localStorage.getItem("vv_reader_lineHeight");
    return s ? Number(s) : 1.6;
  });

  const [dualLanguageMode, setDualLanguageMode] = useState<boolean>(
    () => localStorage.getItem("vv_reader_dualMode") === "true",
  );

  const [textDisplaySettings, setTextDisplaySettings] = useState<TextDisplaySettings>(() => {
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

  const [continuousReadingSettings, setContinuousReadingSettings] = useState<ContinuousReadingSettings>(() => {
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

  // Оновлюємо CSS змінні при зміні fontSize і lineHeight
  useEffect(() => {
    document.documentElement.style.setProperty("--vv-reader-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--vv-reader-line-height", String(lineHeight));
  }, [fontSize, lineHeight]);

  // Слухаємо події від GlobalSettingsPanel
  useEffect(() => {
    const syncFromLS = () => {
      console.log("🔄 [VedaReaderDB] Syncing from localStorage");

      const fs = localStorage.getItem("vv_reader_fontSize");
      if (fs) {
        const newFontSize = Number(fs);
        console.log("  fontSize:", newFontSize);
        setFontSize(newFontSize);
      }

      const lh = localStorage.getItem("vv_reader_lineHeight");
      if (lh) {
        const newLineHeight = Number(lh);
        console.log("  lineHeight:", newLineHeight);
        setLineHeight(newLineHeight);
      }

      const dualMode = localStorage.getItem("vv_reader_dualMode") === "true";
      console.log("  dualMode:", dualMode);
      setDualLanguageMode(dualMode);

      try {
        const b = localStorage.getItem("vv_reader_blocks");
        if (b) {
          const parsed = JSON.parse(b);
          console.log("  blocks:", parsed);
          setTextDisplaySettings({
            showSanskrit: parsed.showSanskrit ?? true,
            showTransliteration: parsed.showTransliteration ?? true,
            showSynonyms: parsed.showSynonyms ?? true,
            showTranslation: parsed.showTranslation ?? true,
            showCommentary: parsed.showCommentary ?? true,
          });
        }
      } catch {}

      try {
        const c = localStorage.getItem("vv_reader_continuous");
        if (c) {
          const parsed = JSON.parse(c);
          console.log("  continuous:", parsed);
          setContinuousReadingSettings({
            enabled: parsed.enabled ?? false,
            showVerseNumbers: parsed.showVerseNumbers ?? true,
            showSanskrit: parsed.showSanskrit ?? false,
            showTransliteration: parsed.showTransliteration ?? false,
            showTranslation: parsed.showTranslation ?? true,
            showCommentary: parsed.showCommentary ?? false,
          });
        }
      } catch {}
    };

    const onPrefs = () => {
      console.log("📡 [VedaReaderDB] Received vv-reader-prefs-changed event");
      syncFromLS();
    };

    const onStorage = (e: StorageEvent) => {
      if (!e.key || !e.key.startsWith("vv_reader_")) return;
      console.log("📡 [VedaReaderDB] Received storage event:", e.key);
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

  // Завантаження даних з БД
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Отримуємо книгу
        const { data: book } = await supabase.from("books").select("id").eq("vedabase_slug", bookSlug).single();

        if (!book) {
          console.error("Книга не знайдена");
          setLoading(false);
          return;
        }

        // Отримуємо розділ
        let chapterQuery = supabase
          .from("chapters")
          .select("*")
          .eq("book_id", book.id)
          .eq("chapter_number", parseInt(chapterNum || "1"));

        if (cantoNum) {
          const { data: canto } = await supabase
            .from("cantos")
            .select("id")
            .eq("book_id", book.id)
            .eq("canto_number", parseInt(cantoNum))
            .single();

          if (canto) {
            chapterQuery = chapterQuery.eq("canto_id", canto.id);
          }
        }

        const { data: chapterData } = await chapterQuery.single();
        setChapter(chapterData);

        if (!chapterData) {
          console.error("Розділ не знайдений");
          setLoading(false);
          return;
        }

        // Отримуємо вірші
        const { data: versesData } = await supabase
          .from("verses")
          .select("*")
          .eq("chapter_id", chapterData.id)
          .order("verse_number");

        setVerses(versesData || []);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookSlug, cantoNum, chapterNum]);

  const getDisplayVerseNumber = (verseNumber: string): string => {
    const parts = verseNumber.split(/[\s.]+/);
    return parts[parts.length - 1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">{t("Розділ не знайдено", "Chapter not found")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Breadcrumb
            items={[
              { label: t("Головна", "Home"), href: "/" },
              { label: bookSlug || "", href: `/veda-reader/${bookSlug}` },
              ...(cantoNum
                ? [{ label: `${t("Пісня", "Canto")} ${cantoNum}`, href: `/veda-reader/${bookSlug}/canto/${cantoNum}` }]
                : []),
              { label: `${t("Розділ", "Chapter")} ${chapterNum}` },
            ]}
          />

          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t("Розділ", "Chapter")} {chapter.chapter_number}
            </h1>
            {chapter.title_ua && (
              <h2 className="text-xl text-muted-foreground">
                {dualLanguageMode && chapter.title_en ? `${chapter.title_ua} / ${chapter.title_en}` : chapter.title_ua}
              </h2>
            )}
          </div>

          {verses.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground">{t("Немає віршів", "No verses found")}</p>
            </div>
          ) : continuousReadingSettings.enabled ? (
            // Безперервне читання
            <div className="space-y-6">
              {verses.map((v) => (
                <div key={v.id} className="pb-6 border-b border-border last:border-0">
                  {continuousReadingSettings.showVerseNumbers && (
                    <div className="mb-4 text-center">
                      <span className="inline-block rounded bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                        {t("Текст", "Text")} {getDisplayVerseNumber(v.verse_number)}
                      </span>
                    </div>
                  )}

                  {continuousReadingSettings.showSanskrit && v.sanskrit && (
                    <div className="mb-6">
                      <p className="whitespace-pre-line text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground">
                        {v.sanskrit}
                      </p>
                    </div>
                  )}

                  {continuousReadingSettings.showTransliteration && v.transliteration && (
                    <div className="mb-6">
                      <div className="space-y-1 text-center">
                        {v.transliteration.split("\n").map((line, i) => (
                          <p
                            key={i}
                            className="font-sanskrit-italic italic text-[1.22em] leading-relaxed text-gray-500 dark:text-muted-foreground"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {continuousReadingSettings.showTranslation && (
                    <div className="mb-6">
                      {dualLanguageMode ? (
                        <div className="space-y-4">
                          {v.translation_ua && <p className="text-base leading-relaxed">{v.translation_ua}</p>}
                          {v.translation_en && (
                            <p className="text-base leading-relaxed text-muted-foreground italic">{v.translation_en}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-base leading-relaxed">{v.translation_ua || v.translation_en}</p>
                      )}
                    </div>
                  )}

                  {continuousReadingSettings.showCommentary && (
                    <div>
                      {dualLanguageMode ? (
                        <div className="space-y-4">
                          {v.commentary_ua && (
                            <div className="prose dark:prose-invert max-w-none">{v.commentary_ua}</div>
                          )}
                          {v.commentary_en && (
                            <div className="prose dark:prose-invert max-w-none text-muted-foreground italic">
                              {v.commentary_en}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="prose dark:prose-invert max-w-none">{v.commentary_ua || v.commentary_en}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Звичайний режим (картки)
            <div className="space-y-6">
              {verses.map((v) => (
                <VerseCard
                  key={v.id}
                  number={getDisplayVerseNumber(v.verse_number)}
                  sanskrit={textDisplaySettings.showSanskrit ? v.sanskrit : undefined}
                  transliteration={textDisplaySettings.showTransliteration ? v.transliteration : undefined}
                  synonyms={textDisplaySettings.showSynonyms ? v.synonyms_ua || v.synonyms_en : undefined}
                  translation={textDisplaySettings.showTranslation ? v.translation_ua || v.translation_en : undefined}
                  commentary={textDisplaySettings.showCommentary ? v.commentary_ua || v.commentary_en : undefined}
                  dualLanguageMode={dualLanguageMode}
                  translationEn={textDisplaySettings.showTranslation && dualLanguageMode ? v.translation_en : undefined}
                  commentaryEn={textDisplaySettings.showCommentary && dualLanguageMode ? v.commentary_en : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
