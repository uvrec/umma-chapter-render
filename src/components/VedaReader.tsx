import { useState } from "react";
import { useParams } from "react-router-dom";
import { VerseCard } from "./VerseCard";
import { AudioPlayer } from "./AudioPlayer";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { SettingsPanel, type ContinuousReadingSettings } from "./SettingsPanel";
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
  const [continuousReadingSettings, setContinuousReadingSettings] = useState<ContinuousReadingSettings>({
    enabled: false,
    showVerseNumbers: true,
    showSanskrit: false,
    showTransliteration: false,
    showTranslation: true,
    showCommentary: false
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

  const renderContinuousText = () => {
    return (
      <div className={`${craftPaperMode ? 'p-8 rounded-lg' : ''}`} style={{
        backgroundColor: craftPaperMode ? '#F3D4A5' : 'transparent'
      }}>
        {filteredVerses.map((verse, index) => (
          <div key={verse.number} className="mb-4">
            {continuousReadingSettings.showVerseNumbers && (
              <span className="font-bold text-red-600 mr-2">
                ВІРШ {verse.number.split('.').pop()}:
              </span>
            )}
            
            {continuousReadingSettings.showSanskrit && verse.sanskrit && (
              <div className="mb-2">
                <div className="font-medium text-lg leading-relaxed">{verse.sanskrit}</div>
              </div>
            )}
            
            {continuousReadingSettings.showTransliteration && verse.transliteration && (
              <div className="mb-2">
                <div className="italic leading-relaxed">{verse.transliteration}</div>
              </div>
            )}
            
            {continuousReadingSettings.showTranslation && (
              <span className="leading-relaxed">{verse.translation}</span>
            )}
            
            {continuousReadingSettings.showCommentary && verse.commentary && (
              <div className="mt-2">
                <div className="text-muted-foreground leading-relaxed">{verse.commentary}</div>
              </div>
            )}
            
            {index < filteredVerses.length - 1 && <span> </span>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${craftPaperMode && !continuousReadingSettings.enabled ? 'craft-paper-bg' : 'bg-background'}`}>
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
            {continuousReadingSettings.enabled ? (
              renderContinuousText()
            ) : (
              filteredVerses.map((verse, index) => (
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
              ))
            )}
          </div>

          {/* Chapter Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {/* TODO: Navigate to previous chapter */}}
            >
              <ArrowLeft className="w-4 h-4" />
              Попередня глава
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Глава 1</p>
              <p className="font-medium">{getBookTitle(bookId)}</p>
            </div>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {/* TODO: Navigate to next chapter */}}
            >
              Наступна глава
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
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
        continuousReadingSettings={continuousReadingSettings}
        onContinuousReadingSettingsChange={setContinuousReadingSettings}
      />

      <AudioPlayer
        verseNumber={playingVerse || ""}
        onClose={handleClosePlayer}
        isVisible={showAudioPlayer}
      />
    </div>
  );
};