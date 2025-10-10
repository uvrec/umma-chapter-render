import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { VerseCard } from "@/components/VerseCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { verses } from "@/data/verses";
import { useAuth } from "@/contexts/AuthContext";

export const IndividualVerse = () => {
  const { bookId, verseNumber } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

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

  const getFilteredVerses = (bid?: string) => {
    if (!bid) return verses;
    switch (bid) {
      case "srimad-bhagavatam":
        return verses.filter((v) => v.number.startsWith("ШБ"));
      case "bhagavad-gita":
        return verses.filter((v) => v.number.startsWith("БГ"));
      case "sri-isopanishad":
        return verses.filter((v) => v.number.startsWith("ШІІ"));
      default:
        return verses;
    }
  };

  const filteredVerses = getFilteredVerses(bookId);
  const currentVerse = filteredVerses.find((v) => v.number === verseNumber);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [verseNumber]);

  if (!currentVerse) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-2xl font-bold">Вірш не знайдено</h1>
            <Link to={`/verses/${bookId}`}>
              <Button variant="outline" className="hover:bg-foreground/5 hover:border hover:border-foreground/20">
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Breadcrumb
            items={[
              { label: "Головна", href: "/" },
              { label: "Бібліотека", href: "/library" },
              { label: getBookTitle(bookId), href: `/verses/${bookId}` },
              { label: `Вірш ${verseNumber}` },
            ]}
          />

          <div className="mb-8 flex items-center justify-between">
            <Link
              to={`/verses/${bookId}`}
              className="flex items-center rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Повернутися до читання
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">{getBookTitle(bookId)}</h1>
            <p className="text-muted-foreground">Вірш {verseNumber}</p>
          </div>

          {/* прозора поверхня для тем/крафту */}
          <div className="verse-surface rounded-lg p-0">
            <VerseCard
              verseNumber={currentVerse.number}
              sanskritText={currentVerse.sanskrit}
              transliteration={currentVerse.transliteration}
              synonyms={currentVerse.synonyms}
              translation={currentVerse.translation}
              commentary={currentVerse.commentary}
              bookName={currentVerse.book}
              audioUrl={currentVerse.audioUrl}
              textDisplaySettings={{
                showSanskrit: true,
                showTransliteration: true,
                showSynonyms: true,
                showTranslation: true,
                showCommentary: true,
              }}
              isAdmin={isAdmin} // ← інлайн-адмін-редагування в картці
              onVerseUpdate={() => {}} // ← під’єднай вашу мутацію за потреби
              makeTranslationBold // ← повертає «bold» для перекладу
              centerBookTitle // ← назва твору по центру
              transparentCovers // ← обкладинки без білого фону
            />
          </div>

          {/* Навігація між віршами */}
          <div className="border-t pt-8">
            <div className="flex items-center justify-between">
              {prevVerse ? (
                <Link to={`/verses/${bookId}/${prevVerse.number}`}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-foreground/5 hover:border hover:border-foreground/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Попередній вірш
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {currentIndex + 1} з {filteredVerses.length}
                </p>
              </div>

              {nextVerse ? (
                <Link to={`/verses/${bookId}/${nextVerse.number}`}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-foreground/5 hover:border hover:border-foreground/20"
                  >
                    Наступний вірш
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
