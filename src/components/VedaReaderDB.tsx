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
import { parseSynonyms, openGlossary } from "@/utils/synonyms";

export function VedaReaderDB() {
  const { bookId, chapterId, cantoNumber, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isAdmin } = useAuth();
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
  const [dualLanguageMode, setDualLanguageMode] = useState<boolean>(
    () => localStorage.getItem("vv_reader_dualMode") === "true",
  );
  const [textDisplaySettings, setTextDisplaySettings] = useState(() => {
    try {
      const raw = localStorage.getItem("vv_reader_blocks");
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          showSanskritUa: parsed.showSanskritUa ?? parsed.showSanskrit ?? true,
          showSanskritEn: parsed.showSanskritEn ?? parsed.showSanskrit ?? true,
          showTransliterationUa: parsed.showTransliterationUa ?? parsed.showTransliteration ?? true,
          showTransliterationEn: parsed.showTransliterationEn ?? parsed.showTransliteration ?? true,
          showSynonyms: parsed.showSynonyms ?? true,
          showTranslation: parsed.showTranslation ?? true,
          showCommentary: parsed.showCommentary ?? true,
        };
      }
    } catch {}
    return {
      showSanskritUa: true,
      showSanskritEn: true,
      showTransliterationUa: true,
      showTransliterationEn: true,
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
          setTextDisplaySettings((prev) => ({
            ...prev,
            showSanskritUa: parsed.showSanskritUa ?? parsed.showSanskrit ?? prev.showSanskritUa,
            showSanskritEn: parsed.showSanskritEn ?? parsed.showSanskrit ?? prev.showSanskritEn,
            showTransliterationUa:
              parsed.showTransliterationUa ?? parsed.showTransliteration ?? prev.showTransliterationUa,
            showTransliterationEn:
              parsed.showTransliterationEn ?? parsed.showTransliteration ?? prev.showTransliterationEn,
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
    syncFromLS();
    return () => {
      window.removeEventListener("vv-reader-prefs-changed", onPrefs as any);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Інші функції та логіка залишаються без змін...
  // Тут мають бути всі useQuery, useMemo, функції навігації і т.д.
  // Я показую тільки виправлену частину JSX рендеру

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb та інший контент */}

        {/* Виправлена частина з Card */}
        <Card className="mb-6 p-8">
          <div>
            <div className="mb-8 text-center">
              <span className="inline-block rounded bg-muted px-4 py-2 text-lg font-bold text-muted-foreground">
                {t("Текст", "Text")} {/* Тут має бути getDisplayVerseNumber(currentVerse.verse_number) */}
              </span>
            </div>

            {/* Sanskrit */}
            {(language === "ua" ? textDisplaySettings.showSanskritUa : textDisplaySettings.showSanskritEn) && (
              <div className="mb-10">
                <p className="whitespace-pre-line text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground">
                  {/* Sanskrit text */}
                </p>
              </div>
            )}

            {/* Transliteration */}
            {(language === "ua"
              ? textDisplaySettings.showTransliterationUa
              : textDisplaySettings.showTransliterationEn) && (
              <div className="mb-10">
                <p className="whitespace-pre-line text-center font-transliteration text-[1.56em] leading-[1.7] text-muted-foreground">
                  {/* Transliteration text */}
                </p>
              </div>
            )}

            {/* Synonyms */}
            {textDisplaySettings.showSynonyms && (
              <div className="mb-6 border-t border-border pt-6">
                <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                  {t("Послівний переклад", "Word-for-word")}
                </h4>
                {dualLanguageMode ? (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="border-r border-border pr-4">
                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                      <div className="text-[1.17em] leading-relaxed text-foreground">{/* Ukrainian synonyms */}</div>
                    </div>
                    <div className="pl-4">
                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                      <div className="text-[1.17em] leading-relaxed text-foreground">{/* English synonyms */}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[1.17em] leading-relaxed text-foreground">{/* Single language synonyms */}</div>
                )}
              </div>
            )}

            {/* Translation */}
            {textDisplaySettings.showTranslation && (
              <div className="mb-6 border-t border-border pt-6">
                <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                  {t("Літературний переклад", "Translation")}
                </h4>
                {dualLanguageMode ? (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="border-r border-border pr-4">
                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                      <p className="text-[1.28em] font-medium leading-relaxed text-foreground whitespace-pre-line">
                        {/* Ukrainian translation */}
                      </p>
                    </div>
                    <div className="pl-4">
                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                      <p className="text-[1.28em] font-medium leading-relaxed text-foreground whitespace-pre-line">
                        {/* English translation */}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="font-medium leading-relaxed text-foreground whitespace-pre-line text-[1.28em]">
                    {/* Single language translation */}
                  </p>
                )}
              </div>
            )}

            {/* Commentary */}
            {textDisplaySettings.showCommentary && (
              <div className="border-t border-border pt-6">
                <h4 className="mb-4 text-center text-[1.17em] font-bold text-foreground">
                  {t("Пояснення", "Purport")}
                </h4>
                {dualLanguageMode ? (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="border-r border-border pr-4">
                      <div className="mb-2 text-sm font-semibold text-muted-foreground">Українська</div>
                      <TiptapRenderer content={""} className="text-[1.22em] leading-relaxed" />
                    </div>
                    <div className="pl-4">
                      <div className="mb-2 text-sm font-semibold text-muted-foreground">English</div>
                      <TiptapRenderer content={""} className="text-[1.22em] leading-relaxed" />
                    </div>
                  </div>
                ) : (
                  <TiptapRenderer content={""} className="text-[1.22em] leading-relaxed" />
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Admin editors */}
        {isAdmin && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UniversalInlineEditor
              table="verses"
              recordId={""}
              field="commentary_ua"
              initialValue={""}
              label={t("Пояснення", "Purport")}
              language="ua"
            />
            <UniversalInlineEditor
              table="verses"
              recordId={""}
              field="commentary_en"
              initialValue={""}
              label={t("Пояснення", "Purport")}
              language="en"
            />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={() => {}}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("Попередній", "Previous")}
          </Button>

          <span className="text-sm text-muted-foreground">{/* Verse counter */}</span>

          <Button variant="outline" onClick={() => {}}>
            {t("Наступний", "Next")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="border-t pt-6 mt-6">
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={() => {}}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t("Попередня глава", "Previous Chapter")}
            </Button>

            <span className="text-sm text-muted-foreground">{t("Глава", "Chapter")}</span>

            <Button variant="secondary" onClick={() => {}}>
              {t("Наступна глава", "Next Chapter")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VedaReaderDB;
