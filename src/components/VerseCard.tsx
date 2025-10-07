import { useState } from "react";
import { Play, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAudio } from '@/components/GlobalAudioPlayer';
import { InlineTiptapEditor } from '@/components/InlineTiptapEditor';
import { TiptapRenderer } from '@/components/blog/TiptapRenderer';

interface VerseCardProps {
  verseId?: string;
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
  isAdmin?: boolean;
  onVerseUpdate?: (verseId: string, updates: any) => void;
}

export const VerseCard = ({
  verseId,
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
  },
  isAdmin = false,
  onVerseUpdate
}: VerseCardProps) => {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({
    sanskrit: sanskritText,
    transliteration: transliteration || '',
    synonyms: synonyms || '',
    translation: translation,
    commentary: commentary || ''
  });
  
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedFields({
      sanskrit: sanskritText,
      transliteration: transliteration || '',
      synonyms: synonyms || '',
      translation: translation,
      commentary: commentary || ''
    });
  };

  const handleSave = () => {
    if (onVerseUpdate && verseId) {
      onVerseUpdate(verseId, editedFields);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFields({
      sanskrit: sanskritText,
      transliteration: transliteration || '',
      synonyms: synonyms || '',
      translation: translation,
      commentary: commentary || ''
    });
  };

  const isCurrentlyPlaying = currentTrack?.id === verseNumber && isPlaying;
  return (
    <Card className="w-full bg-card border-gray-100 dark:border-border shadow-sm animate-fade-in">
      <div className="p-6">
        {/* Verse Number and Book */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="px-3 h-8 bg-primary/10 rounded-full flex items-center justify-center">
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
          {isAdmin && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="default" size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Зберегти
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Скасувати
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редагувати
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sanskrit Text */}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritText) && (
          <div className="mb-10">
            {isEditing ? (
              <Textarea
                value={editedFields.sanskrit}
                onChange={(e) => setEditedFields({ ...editedFields, sanskrit: e.target.value })}
                className="text-center text-[32px] leading-[1.8] font-sanskrit text-gray-600 dark:text-foreground min-h-[100px]"
              />
            ) : (
              <p className="text-center text-[32px] leading-[1.8] font-sanskrit text-gray-600 dark:text-foreground whitespace-pre-line">
                {sanskritText}
              </p>
            )}
          </div>
        )}

        {/* Transliteration */}
        {textDisplaySettings.showTransliteration && (isEditing || transliteration) && (
          <div className="mb-8">
            {isEditing ? (
              <Textarea
                value={editedFields.transliteration}
                onChange={(e) => setEditedFields({ ...editedFields, transliteration: e.target.value })}
                className="text-center font-sanskrit-italic italic text-[22px] text-gray-500 dark:text-muted-foreground min-h-[80px]"
              />
            ) : (
              <div className="text-center space-y-1">
                {transliteration.split('\n').map((line, index) => (
                  <p key={index} className="font-sanskrit-italic italic text-[22px] text-gray-500 dark:text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Word-for-word synonyms */}
        {textDisplaySettings.showSynonyms && (isEditing || synonyms) && (
          <div className="mb-6 pt-6 border-t border-border">
            <h4 className="text-[21px] font-bold text-foreground mb-4">
              Послівний переклад:
            </h4>
            {isEditing ? (
              <Textarea
                value={editedFields.synonyms}
                onChange={(e) => setEditedFields({ ...editedFields, synonyms: e.target.value })}
                className="text-[21px] text-foreground min-h-[100px]"
              />
            ) : (
              <p className="text-[21px] text-foreground leading-relaxed">
                {synonyms.split(/[;,]/).map((part, index) => {
                  const cleanPart = part.trim();

                  // Support multiple separator variations (dash/en-dash/em-dash), optional spaces and line breaks
                  const separators = [' – ', ' — ', ' - ', '–', '—', '-', ' –\n', ' —\n', ' -\n', '–\n', '—\n', '-\n'];
                  let dashIndex = -1;
                  let separator = '';
                  for (const sep of separators) {
                    dashIndex = cleanPart.indexOf(sep);
                    if (dashIndex !== -1) { separator = sep; break; }
                  }

                  if (dashIndex !== -1) {
                    const term = cleanPart.substring(0, dashIndex).trim();
                    const meaning = cleanPart.substring(dashIndex + separator.length).trim().replace(/^\n+/, '');
                    const trimmedTerm = term.trim();
                    const trimmedMeaning = meaning.trim();

                    // Split terms by spaces (preserve hyphenated words as one piece)
                    const words = trimmedTerm.split(/\s+/).filter(w => w.length > 0);

                    return (
                      <span key={index}>
                        {words.map((word, wordIndex) => (
                          <span key={wordIndex}>
                            <span
                              className="cursor-pointer hover:underline font-sanskrit-italic italic text-destructive hover:text-destructive/80"
                              onClick={() => window.open(`/glossary?search=${encodeURIComponent(word)}`, '_blank', 'noopener,noreferrer')}
                            >
                              {word}
                            </span>
                            {wordIndex < words.length - 1 && ' '}
                          </span>
                        ))}
                        <span> — {trimmedMeaning}</span>
                        {index < synonyms.split(/[;,]/).length - 1 && '; '}
                      </span>
                    );
                  }

                  return (
                    <span key={index}>
                      {cleanPart}
                      {index < synonyms.split(/[;,]/).length - 1 && '; '}
                    </span>
                  );
                })}
              </p>
            )}
          </div>
        )}

        {/* Literary Translation */}
        {textDisplaySettings.showTranslation && (isEditing || translation) && (
          <div className="mb-6 pt-6 border-t border-border">
            <h4 className="text-[21px] font-bold text-foreground mb-4">
              Літературний переклад:
            </h4>
            {isEditing ? (
              <Textarea
                value={editedFields.translation}
                onChange={(e) => setEditedFields({ ...editedFields, translation: e.target.value })}
                className="text-[23px] text-foreground font-medium min-h-[100px]"
              />
            ) : (
              <p className="text-[23px] text-foreground leading-relaxed font-medium">
                {translation}
              </p>
            )}
          </div>
        )}

        {/* Commentary */}
        {textDisplaySettings.showCommentary && (isEditing || commentary) && (
          <div className="pt-6 border-t border-border">
            <h4 className="text-[21px] font-bold text-foreground mb-4">
              Коментар:
            </h4>
            {isEditing ? (
              <InlineTiptapEditor
                content={editedFields.commentary}
                onChange={(html) => setEditedFields({ ...editedFields, commentary: html })}
                label="Редагувати коментар"
              />
            ) : (
              <TiptapRenderer 
                content={commentary || ''} 
                className="text-[22px] leading-relaxed"
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};