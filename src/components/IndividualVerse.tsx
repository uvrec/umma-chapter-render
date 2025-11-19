// src/components/IndividualVerse.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Download,
  Settings as SettingsIcon,
  Volume2,
  Home,
} from "lucide-react";
import { verses } from "@/data/verses";
import { useAuth } from "@/contexts/AuthContext";
import { useAudio } from "@/contexts/ModernAudioContext";
import { toast } from "@/hooks/use-toast";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { FONT_SIZE_MULTIPLIERS, LINE_HEIGHTS } from "@/constants/typography";

export const IndividualVerse = () => {
  const { bookId, verseNumber } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // залишено, якщо треба
  const { playTrack } = useAudio();

  // ✅ Назви блоків (поки що UA, можна додати мовний контекст)
  const blockLabels = {
    synonyms: 'Послівний переклад',
    translation: 'Літературний переклад',
    commentary: 'Пояснення',
  };

  // ← використовуємо єдиний хук
  const { fontSize, lineHeight } = useReaderSettings();

  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const getBookCode = (bid?: string): string => {
    switch (bid) {
      case "srimad-bhagavatam":
        return "ШБ";
      case "bhagavad-gita":
        return "БҐ";
      case "sri-isopanishad":
        return "ІШО";
      default:
        return "";
    }
  };

  const filteredVerses = (() => {
    const code = getBookCode(bookId);
    return code ? verses.filter((v) => v.number === verseNumber || v.number.startsWith(code)) : verses;
  })();

  const currentVerse = filteredVerses.find((v) => v.number === verseNumber);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [verseNumber]);

  if (!currentVerse) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mb-4 text-2xl font-bold">Вірш не знайдено</h1>
            <Link to={`/verses/${bookId}`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Повернутися до читання
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentIndex = filteredVerses.findIndex((v) => v.number === verseNumber);
  const prevVerse = currentIndex > 0 ? filteredVerses[currentIndex - 1] : null;
  const nextVerse = currentIndex < filteredVerses.length - 1 ? filteredVerses[currentIndex + 1] : null;

  // Хоткеї ← / →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (document.activeElement as HTMLElement | null)?.isContentEditable;
      if (isEditable) return;

      if (e.key === "ArrowLeft" && prevVerse) navigate(`/verses/${bookId}/${prevVerse.number}`);
      else if (e.key === "ArrowRight" && nextVerse) navigate(`/verses/${bookId}/${nextVerse.number}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bookId, navigate, prevVerse, nextVerse]);

  // Функції для іконок
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Закладку видалено" : "Додано до закладок",
      description: `Вірш ${verseNumber}`,
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `Вірш ${verseNumber}`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: "Посилання скопійовано", description: url });
    }
  };

  const handleDownload = () => {
    toast({ title: "Завантаження", description: "Функція в розробці" });
  };

  // Відтворення аудіо для кожної секції (якщо є)
  const playSection = (section: string) => {
    if (!currentVerse.audioUrl) {
      toast({ title: "Аудіо незабаром", description: `Для ${section}` });
      return;
    }
    playTrack({
      id: `${verseNumber}-${section}`,
      title: `${verseNumber} — ${section}`,
      src: currentVerse.audioUrl,
      url: currentVerse.audioUrl,
    });
  };

  const parseSynonyms = (raw: string): Array<{ term: string; meaning: string }> => {
    if (!raw) return [];
    const parts = raw
      .split(/[;]+/g)
      .map((p) => p.trim())
      .filter(Boolean);

    const dashVariants = [" — ", " – ", " - ", "—", "–", "-"];
    const pairs: Array<{ term: string; meaning: string }> = [];

    for (const part of parts) {
      let idx = -1;
      let used = "";
      for (const d of dashVariants) {
        idx = part.indexOf(d);
        if (idx !== -1) {
          used = d;
          break;
        }
      }
      if (idx === -1) {
        pairs.push({ term: part, meaning: "" });
        continue;
      }
      const term = part.slice(0, idx).trim();
      const meaning = part.slice(idx + used.length).trim();
      if (term) pairs.push({ term, meaning });
    }
    return pairs;
  };

  const openGlossary = (term: string) => {
    window.open(`/glossary?search=${encodeURIComponent(term)}`, "_blank", "noopener,noreferrer");
  };

  const synonymPairs = parseSynonyms(currentVerse.synonyms || "");

  // стиль контейнера (fontSize/lineHeight)
  const baseStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    lineHeight,
  };

  return (
    <div className="min-h-screen bg-background" style={baseStyle} data-reader-root="true">
      {/* Sticky Header з іконками */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <a href="/" className="hover:underline flex items-center gap-2">
                <Home className="h-5 w-5" /> Бібліотека
              </a>
              <span>›</span>
              <a href={`/verses/${bookId}`} className="hover:underline">
                {getBookTitle(bookId)}
              </a>
              <span>›</span>
              <span>Вірш {verseNumber}</span>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleBookmark}>
                <Bookmark className={`h-6 w-6 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload}>
                <Download className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <SettingsIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Великий заголовок */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-6xl font-bold">
            {getBookCode(bookId)} {verseNumber}
          </h1>
        </div>

        {/* Деванагарі */}
        {currentVerse.sanskrit && (
          <section className="mb-12">
            <div className="mb-4 flex justify-center">
              <button
                className="rounded-full p-3 hover:bg-accent transition-colors"
                aria-label="Слухати санскрит"
                onClick={() => playSection("Санскрит")}
              >
                <Volume2 className="h-8 w-8 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div
              className="text-center leading-relaxed font-sanskrit"
              style={{
                fontSize: `calc(var(--vv-reader-font-size) * ${FONT_SIZE_MULTIPLIERS.SANSKRIT})`,
                lineHeight: LINE_HEIGHTS.SANSKRIT
              }}
            >
              {currentVerse.sanskrit.split("\n").map((line, i) => (
                <div key={i} className="mb-4">
                  {line}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Транслітерація */}
        {currentVerse.transliteration && (
          <section className="mb-12">
            <div
              className="text-center italic text-muted-foreground font-sanskrit-italic"
              style={{
                fontSize: `calc(var(--vv-reader-font-size) * ${FONT_SIZE_MULTIPLIERS.TRANSLIT})`,
                lineHeight: LINE_HEIGHTS.RELAXED
              }}
            >
              {currentVerse.transliteration.split("\n").map((line, i) => (
                <div key={i} className="mb-3">
                  {line}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Послівний переклад */}
        {currentVerse.synonyms && (
          <section className="mb-12">
            <div className="mb-8 flex items-center justify-center gap-4">
              <h2
                className="font-bold"
                style={{
                  fontSize: `calc(var(--vv-reader-font-size) * ${FONT_SIZE_MULTIPLIERS.HEADING})`
                }}
              >
                {blockLabels.synonyms}
              </h2>
              <button
                className="rounded-full p-2 hover:bg-accent transition-colors"
                aria-label="Слухати послівний переклад"
                onClick={() => playSection("Послівний переклад")}
              >
                <Volume2 className="h-7 w-7 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <p style={{
              fontSize: `calc(var(--vv-reader-font-size) * ${FONT_SIZE_MULTIPLIERS.MEDIUM} - 1px)`,
              lineHeight: LINE_HEIGHTS.NORMAL
            }}>
              {synonymPairs.map((pair, i) => {
                const words = pair.term
                  .split(/\s+/)
                  .map((w) => w.trim())
                  .filter(Boolean);

                return (
                  <span key={i}>
                    {words.map((w, wi) => (
                      <span key={wi}>
                        <span
                          role="link"
                          tabIndex={0}
                          onClick={() => openGlossary(w)}
                          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
                          className="cursor-pointer italic"
                          style={{ color: '#BC731B' }}
                          title="Відкрити у глосарії"
                        >
                          {w}
                        </span>
                        {wi < words.length - 1 && " "}
                      </span>
                    ))}
                    {pair.meaning && <span> — {pair.meaning}</span>}
                    {i < synonymPairs.length - 1 && <span>; </span>}
                  </span>
                );
              })}
            </p>
          </section>
        )}

        {/* Літературний переклад */}
        {currentVerse.translation && (
          <section className="mb-12">
            <div className="mb-8 flex items-center justify-center gap-4">
              <h2
                className="font-bold"
                style={{
                  fontSize: `calc(var(--vv-reader-font-size) * ${FONT_SIZE_MULTIPLIERS.HEADING})`
                }}
              >
                {blockLabels.translation}
              </h2>
              <button
                className="rounded-full p-2 hover:bg-accent transition-colors"
                aria-label="Слухати переклад"
                onClick={() => playSection("Переклад")}
              >
                <Volume2 className="h-7 w-7 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div
              className="font-bold"
              style={{
                fontSize: `calc(var(--vv-reader-font-size) * ${FONT_SIZE_MULTIPLIERS.MEDIUM})`,
                lineHeight: LINE_HEIGHTS.NORMAL
              }}
            >
              {currentVerse.translation}
            </div>
          </section>
        )}

        {/* Пояснення */}
        {currentVerse.commentary && (
          <section className="mb-12">
            <div className="mb-8 flex items-center justify-center gap-4">
              <h2
                className="font-bold"
                style={{
                  fontSize: `calc(var(--vv-reader-font-size) * ${FONT_SIZE_MULTIPLIERS.HEADING})`
                }}
              >
                {blockLabels.commentary}
              </h2>
              <button
                className="rounded-full p-2 hover:bg-accent transition-colors"
                aria-label="Слухати пояснення"
                onClick={() => playSection("Пояснення")}
              >
                <Volume2 className="h-7 w-7 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div
              className="font-bold"
              style={{
                fontSize: `calc(var(--vv-reader-font-size) * ${FONT_SIZE_MULTIPLIERS.MEDIUM} + 2px)`,
                lineHeight: LINE_HEIGHTS.NORMAL
              }}
            >
              {currentVerse.commentary.split("\n\n").map((para, i) => (
                <p key={i} className="mb-6 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Навігація між віршами */}
        <div className="flex items-center justify-between pt-8">
          <Button
            variant="secondary"
            disabled={!prevVerse}
            onClick={() => prevVerse && navigate(`/verses/${bookId}/${prevVerse.number}`)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-5 w-5" /> Попередній вірш
          </Button>

          <Button
            variant="secondary"
            disabled={!nextVerse}
            onClick={() => nextVerse && navigate(`/verses/${bookId}/${nextVerse.number}`)}
            className="flex items-center gap-2"
          >
            Наступний вірш <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};
