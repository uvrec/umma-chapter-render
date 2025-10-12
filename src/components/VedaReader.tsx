// VedaReader.tsx — єдина панель налаштувань + робочі регулятори шрифту/міжряддя
// - додає data-reader-root для керування міжряддям із SettingsPanel
// - ініціалізація шрифту з localStorage ("vv_reader_fontSize")
// - craft-paper фон для карток віршів через клас verse-surface
// - хоткеї ←/→ для навігації між віршами, якщо не ввімкнено "неперервний" режим

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

export const VedaReader = () => {
  const { bookId } = useParams();

  // --- ЗБЕРЕЖЕННЯ/ЧИТАННЯ НАЛАШТУВАНЬ ---
  const readNumber = (key: string, def: number) => {
    const raw = localStorage.getItem(key);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : def;
  };

  // Розмір шрифту беремо з localStorage, якщо є
  const [fontSize, setFontSize] = useState<number>(() => readNumber("vv_reader_fontSize", 18));

  // line-height налаштовує SettingsPanel безпосередньо на елементі [data-reader-root],
  // але для коректної ініціалізації проставимо початкове значення один раз на mount.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-reader-root="true"]');
    if (root) {
      const initialLH = Number(localStorage.getItem("vv_reader_lineHeight") || "1.6");
      root.style.lineHeight = String(initialLH);
    }
  }, []);

  // локальний перемикач craft-фону для контейнерів віршів (тема глобально в ThemeProvider)
  const [craftPaperMode, setCraftPaperMode] = useState(false);

  // двомовний режим + мова оригіналу
  const [dualLanguageMode, setDualLanguageMode] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState<OriginalLanguage>("sanskrit");

  // які блоки показувати у стандартному (неперервному) режимі
  const [textDisplaySettings, setTextDisplaySettings] = useState({
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true,
  });

  // налаштування неперервного режиму
  const [continuousReadingSettings, setContinuousReadingSettings] = useState<ContinuousReadingSettings>({
    enabled: false,
    showVerseNumbers: true,
    showSanskrit: false,
    showTransliteration: false,
    showTranslation: true,
    showCommentary: false,
  });

  // якір для скролу до вибраного вірша
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getBookTitle = (bid?: string): string => {
    switch (bid) {
      case "srimad-bhagavatam":
        return "Шрімад-Бгаґаватам";
      case "bhagavad-gita":
        return "Бгаґавад-ґіта";
      case "sri-isopanishad":
        return "Шрі Ішопанішад";
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

  // клавіші ←/→ переходять між віршами у звичайному режимі
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

  // Стилі контейнера читання: ШРИФТ тут; МІЖРЯДДЯ ставить SettingsPanel через data-reader-root
  const contentStyle: React.CSSProperties = { fontSize: `${fontSize}px` };

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
        {/* ВАЖЛИВО: атрибут для керування міжряддям із SettingsPanel */}
        <div className="mx-auto max-w-4xl" style={contentStyle} data-reader-root="true">
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

            <Button variant="outline" size="sm" onClick={() => (window as any)._openReaderSettings?.()}>
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

          {/* Навігація “глава ← →” (поки заглушка) */}
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

      {/* ЄДИНА панель налаштувань. Додаю глобальний тригер у window, щоб відкривати зі сторінки. */}
      <SettingsPanel
        isOpen={false /* керуємо знизу через window-хак */}
        onClose={() => setTimeout(() => ((window as any)._readerSheetOpen = false), 0)}
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

// Маленький “гак”, щоб кнопка “Налаштування” відкривала цю ж панель без дублю GlobalSettingsPanel.
// Додаємо глобально функцію, яку викликає кнопка. Компонент SettingsPanel вже слухає свій open через пропси.
(function mountReaderSheetController() {
  (window as any)._openReaderSettings = () => {
    const ev = new CustomEvent("vv:open-reader-settings");
    window.dispatchEvent(ev);
  };
})();
