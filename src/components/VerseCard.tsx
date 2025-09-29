import { Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAudio } from '@/components/GlobalAudioPlayer';

interface VerseCardProps {
  verseNumber: string;
  bookName?: string;
  sanskritText: string;
  transliteration?: string;
  synonyms?: string;
  translation: string;
  commentary?: string;
  audioUrl?: string;
  textDisplaySettings?: {
    showSanskrit: boolean;
    showTransliteration: boolean;
    showSynonyms: boolean;
    showTranslation: boolean;
    showCommentary: boolean;
  };
}

export const VerseCard = ({
  verseNumber,
  bookName,
  sanskritText,
  transliteration,
  synonyms,
  translation,
  commentary,
  audioUrl,
  textDisplaySettings = {
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true
  }
}: VerseCardProps) => {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  
  const handlePlay = () => {
    if (audioUrl) {
      playTrack({
        id: verseNumber,
        title: `Вірш ${verseNumber}`,
        src: audioUrl,
        verseNumber
      });
    }
  };

  const isCurrentlyPlaying = currentTrack?.id === verseNumber && isPlaying;
  return (
    <Card className="w-full bg-card border-border animate-fade-in">
      <div className="p-6">
        {/* Verse Number and Book */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">{verseNumber}</span>
            </div>
            {bookName && (
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                {bookName}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePlay} 
              className={`${isCurrentlyPlaying ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
              disabled={!audioUrl}
            >
              <Play className={`w-4 h-4 mr-2 ${isCurrentlyPlaying ? 'fill-current' : ''}`} />
              {isCurrentlyPlaying ? 'Відтворюється' : audioUrl ? 'Слухати' : 'Аудіо незабаром'}
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Sanskrit Text */}
        {textDisplaySettings.showSanskrit && sanskritText && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-center text-xl leading-relaxed font-mono text-foreground whitespace-pre-line">
              {sanskritText}
            </p>
          </div>
        )}

        {/* Transliteration */}
        {textDisplaySettings.showTransliteration && transliteration && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
              Транслітерація:
            </h4>
            <p className="italic leading-relaxed whitespace-pre-line text-center text-slate-800 font-medium text-base">
              {transliteration}
            </p>
          </div>
        )}

        {/* Word-for-word synonyms */}
        {textDisplaySettings.showSynonyms && synonyms && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
              Послівний переклад:
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {synonyms.split(';').map((part, index) => {
                const cleanPart = part.trim();
                if (cleanPart.includes(' – ')) {
                  const [term, meaning] = cleanPart.split(' – ');
                  // Split term into individual words
                  const words = term.trim().split(/[\s-]+/).filter(w => w.length > 0);
                  return (
                    <span key={index}>
                      {words.map((word, wordIndex) => (
                        <span key={wordIndex}>
                          <span 
                            className="cursor-pointer text-primary hover:underline" 
                            onClick={() => window.open(`/glossary?search=${encodeURIComponent(word)}`, '_blank')}
                          >
                            {word}
                          </span>
                          {wordIndex < words.length - 1 && (term.includes('-') ? '-' : ' ')}
                        </span>
                      ))}
                      <span> — {meaning.trim()}</span>
                      {index < synonyms.split(';').length - 1 && '; '}
                    </span>
                  );
                }
                return <span key={index}>{cleanPart}</span>;
              })}
            </p>
          </div>
        )}

        {/* Literary Translation */}
        {textDisplaySettings.showTranslation && translation && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
              Літературний переклад:
            </h4>
            <p className="text-base text-foreground leading-relaxed font-medium">
              {translation}
            </p>
          </div>
        )}

        {/* Commentary */}
        {textDisplaySettings.showCommentary && commentary && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 text-center">
              Коментар:
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {commentary}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};