import { useState } from "react";
import { useParams } from "react-router-dom";
import { VerseCard } from "./VerseCard";
import { AudioPlayer } from "./AudioPlayer";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { SettingsPanel } from "./SettingsPanel";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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

import { verses } from "@/data/verses";

export const VedaReader = () => {
  const { bookId } = useParams();
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [playingVerse, setPlayingVerse] = useState<string | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [craftPaperMode, setCraftPaperMode] = useState(false);
  const [dualLanguageMode, setDualLanguageMode] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState("sanskrit");
  const [textDisplaySettings, setTextDisplaySettings] = useState({
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true
  });

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

  const getFilteredVerses = (bookId?: string): Verse[] => {
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

  const handlePlayVerse = (verseNumber: string) => {
    if (playingVerse === verseNumber) {
      setPlayingVerse(null);
      setShowAudioPlayer(false);
    } else {
      setPlayingVerse(verseNumber);
      setShowAudioPlayer(true);
    }
  };

  const handleClosePlayer = () => {
    setShowAudioPlayer(false);
    setPlayingVerse(null);
  };

  const handleVerseSelect = (verseNumber: string) => {
    const verse = filteredVerses.find(v => v.number === verseNumber);
    if (verse) {
      const verseElement = document.getElementById(`verse-${verseNumber}`);
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const filteredVerses = getFilteredVerses(bookId);
  const currentAudioUrl = filteredVerses.find(v => v.number === playingVerse)?.audioUrl || undefined;

  return (
    <div className={`min-h-screen ${craftPaperMode ? 'craft-paper-bg' : 'bg-background'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={[
            { label: "Головна", href: "/" },
            { label: "Бібліотека", href: "/library" },
            { label: getBookTitle(bookId) }
          ]} />
          
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/library" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Повернутися до бібліотеки
            </Link>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Налаштування
            </Button>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{getBookTitle(bookId)}</h1>
            <p className="text-muted-foreground">
              Глава {currentVerse} • {filteredVerses.length} віршів
            </p>
          </div>

          <div className="space-y-8" style={{ fontSize: `${fontSize}px` }}>
            {filteredVerses.map((verse, index) => (
              <div key={verse.number} id={`verse-${verse.number}`}>
                {dualLanguageMode ? (
                  <div className="grid grid-cols-2 gap-6">
                    {/* Original Language Column */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="font-semibold mb-4 text-center">
                        {originalLanguage === 'sanskrit' ? 'संस्कृत' : 
                         originalLanguage === 'english' ? 'English' : 'বাংলা'}
                      </h4>
                      <VerseCard
                        verseNumber={verse.number}
                        sanskritText={verse.sanskrit}
                        transliteration={originalLanguage === 'sanskrit' ? verse.transliteration : ''}
                        synonyms={originalLanguage === 'sanskrit' ? verse.synonyms : ''}
                        translation={originalLanguage === 'english' ? "English translation coming soon..." : originalLanguage === 'bengali' ? "বাংলা অনুবাদ শীঘ্রই আসছে..." : verse.translation}
                        commentary={originalLanguage === 'sanskrit' ? verse.commentary : ''}
                        bookName={verse.book}
                        isPlaying={playingVerse === verse.number}
                        onPlay={() => handlePlayVerse(verse.number)}
                        textDisplaySettings={originalLanguage === 'sanskrit' ? textDisplaySettings : {
                          showSanskrit: originalLanguage === 'sanskrit',
                          showTransliteration: false,
                          showSynonyms: false,
                          showTranslation: true,
                          showCommentary: originalLanguage === 'sanskrit'
                        }}
                      />
                    </div>

                    {/* Ukrainian Translation Column */}
                    <div className="bg-muted/10 p-6 rounded-lg">
                      <h4 className="font-semibold mb-4 text-center">Українська</h4>
                      <VerseCard
                        verseNumber={verse.number}
                        sanskritText=""
                        transliteration=""
                        synonyms=""
                        translation={verse.translation}
                        commentary={verse.commentary}
                        bookName={verse.book}
                        isPlaying={playingVerse === verse.number}
                        onPlay={() => handlePlayVerse(verse.number)}
                        textDisplaySettings={{
                          showSanskrit: false,
                          showTransliteration: false,
                          showSynonyms: false,
                          showTranslation: true,
                          showCommentary: true
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <VerseCard
                    verseNumber={verse.number}
                    sanskritText={verse.sanskrit}
                    transliteration={verse.transliteration}
                    synonyms={verse.synonyms}
                    translation={verse.translation}
                    commentary={verse.commentary}
                    bookName={verse.book}
                    isPlaying={playingVerse === verse.number}
                    onPlay={() => handlePlayVerse(verse.number)}
                    textDisplaySettings={textDisplaySettings}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        craftPaperMode={craftPaperMode}
        onCraftPaperToggle={setCraftPaperMode}
        verses={filteredVerses}
        currentVerse={playingVerse || filteredVerses[0]?.number || ""}
        onVerseSelect={handleVerseSelect}
        dualLanguageMode={dualLanguageMode}
        onDualLanguageModeToggle={setDualLanguageMode}
        textDisplaySettings={textDisplaySettings}
        onTextDisplaySettingsChange={setTextDisplaySettings}
        originalLanguage={originalLanguage}
        onOriginalLanguageChange={setOriginalLanguage}
      />

      <AudioPlayer
        verseNumber={playingVerse || ""}
        onClose={handleClosePlayer}
        isVisible={showAudioPlayer}
      />
    </div>
  );
};