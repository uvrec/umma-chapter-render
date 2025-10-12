// src/components/VedaReader.tsx
// Підчищена версія під оновлений SettingsPanel:
// - єдиний набір станів (без дублікатів)
// - збереження в LocalStorage (fontSize, dualMode, blocks, lineHeight)
// - data-reader-root="true" на контейнері читанки (для керування міжряддям)
// - verse-surface для блоків і continuous wrapper

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { VerseCard } from "./VerseCard";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { SettingsPanel, type ContinuousReadingSettings } from "./SettingsPanel";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import { verses as ALL_VERSES } from "@/data/verses";

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

/** Ключі LocalStorage */
const LS = {
  fontSize: "vv_reader_fontSize",
  dual: "vv_reader_dualMode",
  blocks: "vv_reader_blocks",
  lineHeight: "vv_reader_lineHeight",
} as const;

/** Хелпери читання з LS */
function readNum(key: string, def: number) {
  const raw = localStorage.getItem(key);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : def;
}
function readBool(key: string, def: boolean) {
  const raw = localStorage.getItem(key);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return def;
}
function readBlocks() {
  try {
    const raw = localStorage.getItem(LS.blocks);
    if (!raw) {
      return {
        showSanskrit: true,
        showTransliteration: true,
        showSynonyms: true,
        showTranslation: true,
        showCommentary: true,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      showSanskrit: parsed.showSanskrit ?? true,
      showTransliteration: parsed.showTransliteration ?? true,
      showSynonyms: parsed.showSynonyms ?? true,
      showTranslation: parsed.showTranslation ?? true,
      showCommentary: parsed.showCommentary ?? true,
    };
  } catch {
    return {
      showSanskrit: true,
      showTransliteration: true,
      showSynonyms: true,
      showTranslation: true,
      showCommentary: true,
    };
  }
}

export const VedaReader = () => {
  const { bookId } = useParams();

  // === СТАНИ ЧИТАНКИ (єдині, без дублів) ===
  const [showSettings, setShowSettings] = useState(false);

  const [fontSize, setFontSize] = useState<number>(() => readNum(LS.fontSize, 18));
  const [lineHeight, setLineHeight] = useState<number>(() => readNum(LS.lineHeight, 1.6));

  const [dualLanguageMode, setDualLanguageMode] = useState<boolean>(() => readBool(LS.dual, false));
  const [textDisplaySettings, setTextDisplaySettings] = useState(readBlocks);

  // Локальний перемикач craft-вигляду для контейнерів віршів (глобальна тема керується ThemeProvider/SettingsPanel)
  const [craftPaperMode, setCraftPaperMode] = useState(false);

  const [originalLanguage, setOriginalLanguage] = useState<OriginalLanguage>("sanskrit");

  const [continuousReadingSettings, setContinuousReadingSettings] = useState<ContinuousReadingSettings>({
    enabled: false,
    showVerseNumbers: true,
    showSanskrit: false,
    showTransliteration: false,
    showTranslation: true,
    showCommentary: false,
  });

  // якір для швидкого скролу між віршами
  const containerRef = useRef<HTMLDivElement | null>(null);

  // === ПЕРСИСТ У LS ===
  useEffect(() => {
    localStorage.setItem(LS.fontSize, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(LS.lineHeight, String(lineHeight));
  }, [lineHeight]);

  useEffect(() => {
    localStorage.setItem(LS.dual, String(dualLanguageMode));
  }, [dualLanguageMode]);

  useEffect(() => {
    localStorage.setItem(LS.blocks, JSON.stringify(textDisplaySettings));
  }, [textDisplaySettings]);

  // Застосувати fontSize + lineHeight на контейнер читанки (атрибут data-reader-root="true")
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-reader-root="true"]');
    if (root) {
      root.style.fontSize = `${fontSize}px`;
      root.style.lineHeight = String(lineHeight);
    }
  }, [fontSize, lineHeight]);

  const getBookTitle = (bid?: string): string => {
    switch (bid) {
      case "srimad-bhagavatam":
      case "bhagavatam":
        return "Шрімад-Бгаґаватам";
      case "bhagavad-gita":
      case "gita":
        return "Бгаґавад-ґіта";
      case "sri-isopanishad":
      case "iso":
        return "Шрі Ішопанішад";
      case "noi":
        return "Нектар настанов";
      default:
        return "Ведичні тексти";
    }
  };

  const filteredVerses: Verse[] = useMemo(() => {
    if (!bookId) return ALL_VERSES;
    switch (bookId) {
      case "srimad-bhagavatam":
      case "bhagavatam":
        return ALL_VERSES.filter((v) => v.number.startsWith("ШБ"));
      case "bhagavad-gita":
      case "gita":
        return ALL_VERSES.filter((v) => v.number.startsWith("БГ"));
      case "sri-isopanishad":
      case "iso":
        return ALL_VERSES.filter((v) => v.number.startsWith("ШІІ"));
      default:
        return ALL_VERSES;
    }
  }, [bookId]);

  const handleVerseSelect = (verseNumber: string) => {
    const el = document.getElementById(`verse-${verseNumber}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // гарячі клавіші ←/→ для переходу між блоками-віршами (в режимі не continuous)
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

      // знайти поточний вірш у в’юпорті
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

  const originalHeader = (lang: OriginalLanguage) =>
    lang === "sanskrit" ? "संस्कृत" : lang === "english" ? "English" : "বাংলা";

  return (
    <div
      className={`min-h-screen ${
        craftPaperMode && !continuousReadingSettings.enabled ? "craft-paper-bg" : "bg-background"
      }`}
    >
      <Header />

      <main className="container mx-auto px-4 py-8" ref={containerRef}>
        {/* ГОЛОВНИЙ КОНТЕЙНЕР ЧИТАНКИ: data-reader-root */}
        <div className="mx-auto max-w-4xl" data-reader-root="true">
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

          {/* Навігація по "голові" (заглушка під майбутні розділи) */}
          <div className="mt-12 flex items-center justify-between border-t pt-8">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                /* TODO: переходи між главами */
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Попередня глава
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Глава</p>
              <p className="font-medium">{getBookTitle(bookId)}</p>
            </div>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                /* TODO: переходи між главами */
              }}
            >
              Наступна глава
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </main>

      {/* ЄДИНА панель налаштувань, яку ми залишаємо для читанки */}
      <SettingsPanel
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
