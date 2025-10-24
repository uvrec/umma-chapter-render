// src/components/VedaReader.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { VerseCard } from "./VerseCard";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { GlobalSettingsPanel, type ContinuousReadingSettings } from "@/components/GlobalSettingsPanel";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import { verses as ALL_VERSES } from "@/data/verses";
import { useReaderSettings } from "@/hooks/useReaderSettings";

type OriginalLanguage = "sanskrit" | "english" | "bengali";

interface Verse {
  number: string;
  book?: string;
  sanskrit: string;
  transliteration?: string;
  synonyms?: string;
  translation: string;
  commentary?: string;
  audioUrl?: string;
}

export const VedaReader = () => {
  const { bookId } = useParams();
  const [showSettings, setShowSettings] = useState(false);

  // ← головні налаштування беруться з useReaderSettings()
  const {
    fontSize,
    setFontSize,
    lineHeight, // застосовується через data-reader-root атрибут
    dualLanguageMode,
    setDualLanguageMode,
    textDisplaySettings,
    setTextDisplaySettings,
    continuousReadingSettings,
    setContinuousReadingSettings,
  } = useReaderSettings();

  // локальна “крафт-кнопка” залишаємо, але тема керується глобально
  const [craftPaperMode, setCraftPaperMode] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState<OriginalLanguage>("sanskrit");

  // якір для швидкого скролу між віршами
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getBookTitle = (bid?: string): string => {
    switch (bid) {
      case "srimad-bhagavatam":
        return "Шрімад-Бгаґаватам";
      case "bhagavad-gita":
        return "Бгаґавад-ґіта";
      case "sri-isopanishad":
        return "Шрі Ішопанішада";
      default:
        return "Ведичні тексти";
    }
  };

  const filteredVerses: Verse[] = useMemo(() => {
    if (!bookId) return ALL_VERSES;
    switch (bookId) {
      case "srimad-bhagavatam":
        return ALL_VERSES.filter((v) => v.number.startsWith("ШБ"));
      case "bhagavad-gita":
        return ALL_VERSES.filter((v) => v.number.startsWith("БГ"));
      case "sri-isopanishad":
        return ALL_VERSES.filter((v) => v.number.startsWith("ШІІ"));
      default:
        return ALL_VERSES;
    }
  }, [bookId]);

  const handleVerseSelect = (verseNumber: string) => {
    const el = document.getElementById(`verse-${verseNumber}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // хоткеї ←/→ між віршами (коли не continuous)
  useEffect(() => {
    if (continuousReadingSettings.enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const editable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (document.activeElement as HTMLElement | null)?.isContentEditable;
      if (editable) return;

      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const anchors = filteredVerses
        .map((v) => document.getElementById(`verse-${v.number}`))
        .filter(Boolean) as HTMLElement[];
      if (!anchors.length) return;

      const viewportMid = window.scrollY + window.innerHeight / 2;
      let currentIdx = 0;
      for (let i = 0; i < anchors.length; i++) {
        const r = anchors[i].getBoundingClientRect();
        const yMid = window.scrollY + r.top + r.height / 2;
        if (yMid > viewportMid) {
          currentIdx = Math.max(0, i - 1);
          break;
        }
        if (i === anchors.length - 1) currentIdx = i;
      }

      const nextIdx =
        e.key === "ArrowLeft" ? Math.max(0, currentIdx - 1) : Math.min(anchors.length - 1, currentIdx + 1);
      anchors[nextIdx].scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filteredVerses, continuousReadingSettings.enabled]);

  const renderContinuousText = () => (
    <div className={`verse-surface ${craftPaperMode ? "p-8 rounded-lg" : ""}`}>
      {filteredVerses.map((verse, index) => {
        const verseShort = verse.number.split(".").pop();
        return (
          <div key={verse.number} className="mb-4">
            {continuousReadingSettings.showVerseNumbers && (
              <Link
                to={`/verses/${bookId}/${verse.number}`}
                className="mr-2 cursor-pointer underline font-bold text-red-600 hover:text-red-700"
              >
                ВІРШ {verseShort}:
              </Link>
            )}

            {continuousReadingSettings.showSanskrit && verse.sanskrit && (
              <div className="mb-2">
                <div className="text-lg leading-relaxed font-medium">{verse.sanskrit}</div>
              </div>
            )}

            {continuousReadingSettings.showTransliteration && verse.transliteration && (
              <div className="mb-2 italic leading-relaxed">{verse.transliteration}</div>
            )}

            {continuousReadingSettings.showTranslation && <span className="leading-relaxed">{verse.translation}</span>}

            {continuousReadingSettings.showCommentary && verse.commentary && (
              <div className="mt-2 leading-relaxed text-muted-foreground">{verse.commentary}</div>
            )}

            {index < filteredVerses.length - 1 && <span> </span>}
          </div>
        );
      })}
    </div>
  );

  // базові стилі (fontSize) — lineHeight керується хуком через data-reader-root
  const contentStyle: React.CSSProperties = { fontSize: `${fontSize}px` };

  const originalHeader = (lang: OriginalLanguage) =>
    lang === "sanskrit" ? "संस्कृत" : lang === "english" ? "English" : "বাংলা";

  return (
    <div
      className={`min-h-screen ${craftPaperMode && !continuousReadingSettings.enabled ? "craft-paper-bg" : "bg-background"}`}
    >
      <Header />

      <main className="container mx-auto px-4 py-8" ref={containerRef}>
        <div
          className="mx-auto max-w-4xl"
          style={contentStyle}
          data-reader-root="true" // ← важливо для автоматичного міжряддя
        >
          <Breadcrumb
            items={[
              { label: "Головна", href: "/" },
              { label: "Бібліотека", href: "/library" },
              { label: getBookTitle(bookId) },
            ]}
          />

          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/library"
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Повернутися до бібліотеки
            </Link>

            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Налаштування
            </Button>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">{getBookTitle(bookId)}</h1>
            <p className="text-muted-foreground">Віршів: {filteredVerses.length}</p>
          </div>

          <div className="space-y-8">
            {continuousReadingSettings.enabled
              ? renderContinuousText()
              : filteredVerses.map((verse) => (
                  <div key={verse.number} id={`verse-${verse.number}`}>
                    {dualLanguageMode ? (
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Оригінал */}
                        <div className="verse-surface rounded-lg p-6">
                          <h4 className="mb-4 text-center font-semibold">{originalHeader(originalLanguage)}</h4>
                          <VerseCard
                            verseNumber={verse.number}
                            bookName={verse.book}
                            sanskritText={verse.sanskrit}
                            transliteration={originalLanguage === "sanskrit" ? verse.transliteration : ""}
                            synonyms={originalLanguage === "sanskrit" ? verse.synonyms : ""}
                            translation={
                              originalLanguage === "english"
                                ? "English translation coming soon..."
                                : originalLanguage === "bengali"
                                  ? "বাংলা অনুবাদ শীঘ্রই আসছে..."
                                  : verse.translation
                            }
                            commentary={originalLanguage === "sanskrit" ? verse.commentary : ""}
                            audioUrl={verse.audioUrl}
                            textDisplaySettings={
                              originalLanguage === "sanskrit"
                                ? textDisplaySettings
                                : {
                                    showSanskrit: false,
                                    showTransliteration: false,
                                    showSynonyms: false,
                                    showTranslation: true,
                                    showCommentary: false,
                                  }
                            }
                          />
                        </div>

                        {/* Український переклад */}
                        <div className="verse-surface rounded-lg p-6">
                          <h4 className="mb-4 text-center font-semibold">Українська</h4>
                          <VerseCard
                            verseNumber={verse.number}
                            bookName={verse.book}
                            sanskritText=""
                            transliteration=""
                            synonyms=""
                            translation={verse.translation}
                            commentary={verse.commentary}
                            audioUrl={verse.audioUrl}
                            textDisplaySettings={{
                              showSanskrit: false,
                              showTransliteration: false,
                              showSynonyms: false,
                              showTranslation: true,
                              showCommentary: true,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <VerseCard
                        verseNumber={verse.number}
                        bookName={verse.book}
                        sanskritText={verse.sanskrit}
                        transliteration={verse.transliteration}
                        synonyms={verse.synonyms}
                        translation={verse.translation}
                        commentary={verse.commentary}
                        audioUrl={verse.audioUrl}
                        textDisplaySettings={textDisplaySettings}
                      />
                    )}
                  </div>
                ))}
          </div>

          {/* Навігація по главі (заглушка) */}
          <div className="mt-12 flex items-center justify-between border-t pt-8">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Попередня глава
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Глава</p>
              <p className="font-medium">{getBookTitle(bookId)}</p>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              Наступна глава
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </main>

      <GlobalSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        craftPaperMode={craftPaperMode}
        onCraftPaperToggle={setCraftPaperMode}
        verses={filteredVerses}
        currentVerse={filteredVerses[0]?.number || ""}
        onVerseSelect={handleVerseSelect}
        dualLanguageMode={dualLanguageMode}
        onDualLanguageModeToggle={setDualLanguageMode}
        textDisplaySettings={textDisplaySettings}
        onTextDisplaySettingsChange={setTextDisplaySettings}
        originalLanguage={originalLanguage}
        onOriginalLanguageChange={(v) => setOriginalLanguage(v as OriginalLanguage)}
        continuousReadingSettings={continuousReadingSettings}
        onContinuousReadingSettingsChange={setContinuousReadingSettings}
      />
    </div>
  );
};
