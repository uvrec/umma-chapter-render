import { Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VerseCardProps {
  verseNumber: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  commentary?: string;
  onPlay?: () => void;
  isPlaying?: boolean;
}

export const VerseCard = ({ 
  verseNumber, 
  arabicText, 
  transliteration, 
  translation, 
  commentary,
  onPlay,
  isPlaying = false 
}: VerseCardProps) => {
  return (
    <Card className="verse-container p-6 mb-6 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {verseNumber}
            </span>
            <Button 
              variant="play" 
              size="play"
              onClick={onPlay}
              className={`play-button ${isPlaying ? 'animate-pulse' : ''}`}
            >
              <Play className="w-5 h-5" fill="currentColor" />
            </Button>
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Arabic Text */}
      <div className="arabic-text mb-4 text-foreground leading-relaxed">
        {arabicText}
      </div>

      {/* Transliteration */}
      <div className="text-muted-foreground mb-3 italic text-sm leading-relaxed">
        {transliteration}
      </div>

      {/* Translation */}
      <div className="text-foreground mb-4 leading-relaxed">
        {translation}
      </div>

      {/* Commentary */}
      {commentary && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Пояснение к аяту:</h4>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {commentary}
          </div>
        </div>
      )}
    </Card>
  );
};