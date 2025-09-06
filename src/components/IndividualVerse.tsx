import { useParams, Link } from "react-router-dom";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { VerseCard } from "./VerseCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { verses } from "@/data/verses";

export const IndividualVerse = () => {
  const { bookId, verseNumber } = useParams();

  const getBookTitle = (bookId?: string): string => {
    switch (bookId) {
      case 'srimad-bhagavatam':
        return 'Шрімад-Бгаґаватам';
      case 'bhagavad-gita':
        return 'Бгаґавад-ґіта';
      case 'sri-isopanishad':
        return 'Шрі Ішопанішад';
      default:
        return 'Ведичні тексти';
    }
  };

  const getFilteredVerses = (bookId?: string) => {
    if (!bookId) return verses;
    
    switch (bookId) {
      case 'srimad-bhagavatam':
        return verses.filter(v => v.number.startsWith('ШБ'));
      case 'bhagavad-gita':
        return verses.filter(v => v.number.startsWith('БГ'));
      case 'sri-isopanishad':
        return verses.filter(v => v.number.startsWith('ШІІ'));
      default:
        return verses;
    }
  };

  const filteredVerses = getFilteredVerses(bookId);
  const currentVerse = filteredVerses.find(v => v.number === verseNumber);

  if (!currentVerse) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Вірш не знайдено</h1>
            <Link to={`/verses/${bookId}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Повернутися до читання
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentIndex = filteredVerses.findIndex(v => v.number === verseNumber);
  const prevVerse = currentIndex > 0 ? filteredVerses[currentIndex - 1] : null;
  const nextVerse = currentIndex < filteredVerses.length - 1 ? filteredVerses[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={[
            { label: "Головна", href: "/" },
            { label: "Бібліотека", href: "/library" },
            { label: getBookTitle(bookId), href: `/verses/${bookId}` },
            { label: `Вірш ${verseNumber}` }
          ]} />
          
          <div className="flex items-center justify-between mb-8">
            <Link 
              to={`/verses/${bookId}`}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Повернутися до читання
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{getBookTitle(bookId)}</h1>
            <p className="text-muted-foreground">
              Вірш {verseNumber}
            </p>
          </div>

          <div className="mb-8">
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
                showCommentary: true
              }}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t">
            {prevVerse ? (
              <Link to={`/verses/${bookId}/${prevVerse.number}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Попередній вірш
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} з {filteredVerses.length}
              </p>
            </div>
            
            {nextVerse ? (
              <Link to={`/verses/${bookId}/${nextVerse.number}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  Наступний вірш
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};