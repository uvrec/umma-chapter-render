// DualLanguageVerseCard.tsx - Side-by-side view як на vedabase.io
import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";

interface DualLanguageVerseCardProps {
  verseId?: string;
  verseNumber: string;
  
  // Sanskrit (однаковий для обох мов)
  sanskritTextUa: string;
  sanskritTextEn: string;

  // Українська версія
  transliterationUa: string;
  synonymsUa: string;
  translationUa: string;
  commentaryUa: string;

  // Англійська версія
  transliterationEn: string;
  synonymsEn: string;
  translationEn: string;
  commentaryEn: string;

  isAdmin?: boolean;
  onVerseUpdate?: (verseId: string, updates: any) => void;
}

function parseSynonyms(raw: string): Array<{ term: string; meaning: string }> {
  if (!raw) return [];
  return raw
    .split(/[;]+/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((pair) => {
      const [term, meaning] = pair.split(/[—–-]/);
      return {
        term: term?.trim() || "",
        meaning: meaning?.trim() || "",
      };
    })
    .filter((s) => s.term && s.meaning);
}

export function DualLanguageVerseCard({
  verseId,
  verseNumber,
  sanskritTextUa,
  sanskritTextEn,
  transliterationUa,
  synonymsUa,
  translationUa,
  commentaryUa,
  transliterationEn,
  synonymsEn,
  translationEn,
  commentaryEn,
  isAdmin,
  onVerseUpdate,
}: DualLanguageVerseCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    sanskritTextUa,
    sanskritTextEn,
    transliterationUa,
    transliterationEn,
    synonymsUa,
    synonymsEn,
    translationUa,
    translationEn,
    commentaryUa,
    commentaryEn,
  });

  const handleSave = () => {
    if (verseId && onVerseUpdate) {
      onVerseUpdate(verseId, {
        sanskrit_ua: editedData.sanskritTextUa,
        sanskrit_en: editedData.sanskritTextEn,
        transliteration_ua: editedData.transliterationUa,
        transliteration_en: editedData.transliterationEn,
        synonyms_ua: editedData.synonymsUa,
        synonyms_en: editedData.synonymsEn,
        translation_ua: editedData.translationUa,
        translation_en: editedData.translationEn,
        commentary_ua: editedData.commentaryUa,
        commentary_en: editedData.commentaryEn,
      });
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedData({
      sanskritTextUa,
      sanskritTextEn,
      transliterationUa,
      transliterationEn,
      synonymsUa,
      synonymsEn,
      translationUa,
      translationEn,
      commentaryUa,
      commentaryEn,
    });
    setEditMode(false);
  };

  const synonymsParsedUa = parseSynonyms(editedData.synonymsUa);
  const synonymsParsedEn = parseSynonyms(editedData.synonymsEn);

  return (
    <div className="w-full max-w-7xl mx-auto bg-card rounded-lg">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex justify-end gap-2 p-4 border-b border-border">
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Редагувати
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Зберегти
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Скасувати
              </Button>
            </>
          )}
        </div>
      )}

      {/* Header - Dual Language */}
      <div className="grid grid-cols-2 gap-8 p-8 border-b border-border">
        <div>
          <h1 className="text-4xl font-bold text-center">ВІРШ {verseNumber}</h1>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-center">Text {verseNumber}</h1>
        </div>
      </div>

      {/* Sanskrit - Devanagari (same for both columns) */}
      <div className="p-8 border-b border-border bg-background/50">
        <div className="text-center">
          {editMode ? (
            <div className="grid grid-cols-2 gap-8">
              <Textarea
                value={editedData.sanskritTextUa}
                onChange={(e) =>
                  setEditedData({ ...editedData, sanskritTextUa: e.target.value })
                }
                className="font-[Noto_Sans_Devanagari] text-2xl text-center min-h-[200px]"
              />
              <Textarea
                value={editedData.sanskritTextEn}
                onChange={(e) =>
                  setEditedData({ ...editedData, sanskritTextEn: e.target.value })
                }
                className="font-[Noto_Sans_Devanagari] text-2xl text-center min-h-[200px]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              <div className="font-[Noto_Sans_Devanagari] text-2xl whitespace-pre-line leading-relaxed">
                {editedData.sanskritTextUa}
              </div>
              <div className="font-[Noto_Sans_Devanagari] text-2xl whitespace-pre-line leading-relaxed">
                {editedData.sanskritTextEn}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transliteration */}
      <div className="p-8 border-b border-border">
        {editMode ? (
          <div className="grid grid-cols-2 gap-8">
            <Textarea
              value={editedData.transliterationUa}
              onChange={(e) =>
                setEditedData({ ...editedData, transliterationUa: e.target.value })
              }
              className="italic text-lg text-center min-h-[150px]"
            />
            <Textarea
              value={editedData.transliterationEn}
              onChange={(e) =>
                setEditedData({ ...editedData, transliterationEn: e.target.value })
              }
              className="italic text-lg text-center min-h-[150px]"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            <div className="italic text-lg whitespace-pre-line leading-relaxed text-center">
              {editedData.transliterationUa}
            </div>
            <div className="italic text-lg whitespace-pre-line leading-relaxed text-center">
              {editedData.transliterationEn}
            </div>
          </div>
        )}
      </div>

      {/* Synonyms */}
      <div className="p-8 border-b border-border">
        <div className="grid grid-cols-2 gap-8">
          {/* Ukrainian Synonyms */}
          <div>
            <h3 className="text-xl font-bold mb-4">Synonyms</h3>
            {editMode ? (
              <Textarea
                value={editedData.synonymsUa}
                onChange={(e) =>
                  setEditedData({ ...editedData, synonymsUa: e.target.value })
                }
                className="text-base min-h-[200px]"
              />
            ) : (
              <div className="text-base leading-relaxed space-y-2">
                {synonymsParsedUa.map((syn, i) => (
                  <div key={i}>
                    <span className="italic text-accent">{syn.term}</span>
                    {" — "}
                    <span>{syn.meaning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* English Synonyms */}
          <div>
            <h3 className="text-xl font-bold mb-4">Synonyms</h3>
            {editMode ? (
              <Textarea
                value={editedData.synonymsEn}
                onChange={(e) =>
                  setEditedData({ ...editedData, synonymsEn: e.target.value })
                }
                className="text-base min-h-[200px]"
              />
            ) : (
              <div className="text-base leading-relaxed space-y-2">
                {synonymsParsedEn.map((syn, i) => (
                  <div key={i}>
                    <span className="italic text-accent">{syn.term}</span>
                    {" — "}
                    <span>{syn.meaning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Translation */}
      <div className="p-8 border-b border-border">
        <div className="grid grid-cols-2 gap-8">
          {/* Ukrainian Translation */}
          <div>
            <h3 className="text-xl font-bold mb-4">Переклад</h3>
            {editMode ? (
              <Textarea
                value={editedData.translationUa}
                onChange={(e) =>
                  setEditedData({ ...editedData, translationUa: e.target.value })
                }
                className="text-base min-h-[150px]"
              />
            ) : (
              <div className="text-base leading-relaxed">
                <TiptapRenderer content={editedData.translationUa} />
              </div>
            )}
          </div>

          {/* English Translation */}
          <div>
            <h3 className="text-xl font-bold mb-4">Translation</h3>
            {editMode ? (
              <Textarea
                value={editedData.translationEn}
                onChange={(e) =>
                  setEditedData({ ...editedData, translationEn: e.target.value })
                }
                className="text-base min-h-[150px]"
              />
            ) : (
              <div className="text-base leading-relaxed">
                <TiptapRenderer content={editedData.translationEn} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Commentary */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Ukrainian Commentary */}
          <div>
            <h3 className="text-xl font-bold mb-4">Коментар</h3>
            {editMode ? (
              <Textarea
                value={editedData.commentaryUa}
                onChange={(e) =>
                  setEditedData({ ...editedData, commentaryUa: e.target.value })
                }
                className="text-base min-h-[300px]"
              />
            ) : (
              <div className="text-base leading-relaxed">
                <TiptapRenderer content={editedData.commentaryUa} />
              </div>
            )}
          </div>

          {/* English Commentary */}
          <div>
            <h3 className="text-xl font-bold mb-4">Purport</h3>
            {editMode ? (
              <Textarea
                value={editedData.commentaryEn}
                onChange={(e) =>
                  setEditedData({ ...editedData, commentaryEn: e.target.value })
                }
                className="text-base min-h-[300px]"
              />
            ) : (
              <div className="text-base leading-relaxed">
                <TiptapRenderer content={editedData.commentaryEn} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
