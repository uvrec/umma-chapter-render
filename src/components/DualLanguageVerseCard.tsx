// DualLanguageVerseCard.tsx - Side-by-side view як на vedabase.io
import { useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
import { DualLanguageText } from "@/components/DualLanguageText";

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
  showNumbers?: boolean;
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

function openGlossary(term: string) {
  const url = `/glossary?search=${encodeURIComponent(term)}`;
  window.open(url, "_blank", "noopener,noreferrer");
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
  showNumbers = true,
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

      {/* Verse Number */}
      {showNumbers && (
        <div className="p-6 pb-0">
          <div className="flex h-8 items-center justify-center">
            <span className="text-lg font-semibold text-primary">Вірш {verseNumber}</span>
          </div>
        </div>
      )}

      {/* Sanskrit - Devanagari (same for both columns) */}
      <div className="p-8 bg-background/50">
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
          <div className="grid grid-cols-2 gap-8 text-center">
            <div className="font-[Noto_Sans_Devanagari] text-2xl whitespace-pre-line leading-relaxed">
              {editedData.sanskritTextUa}
            </div>
            <div className="font-[Noto_Sans_Devanagari] text-2xl whitespace-pre-line leading-relaxed">
              {editedData.sanskritTextEn}
            </div>
          </div>
        )}
      </div>

      {/* Transliteration */}
      <div className="p-8">
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
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Ukrainian Synonyms */}
          <div>
            <h3 className="text-xl font-bold mb-4">Послівний переклад</h3>
            {editMode ? (
              <Textarea
                value={editedData.synonymsUa}
                onChange={(e) =>
                  setEditedData({ ...editedData, synonymsUa: e.target.value })
                }
                className="text-base min-h-[200px]"
              />
            ) : (
              <p className="text-base leading-relaxed">
                {synonymsParsedUa.map((syn, i) => {
                  const words = syn.term.split(/\s+/).map((w) => w.trim()).filter(Boolean);
                  return (
                    <span key={i}>
                      {words.map((w, wi) => (
                        <span key={wi}>
                          <span
                            role="link"
                            tabIndex={0}
                            onClick={() => openGlossary(w)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
                            title="Відкрити у глосарії"
                            className="cursor-pointer italic"
                          >
                            {w}
                          </span>
                          {wi < words.length - 1 && " "}
                        </span>
                      ))}
                      {syn.meaning && <span> — {syn.meaning}</span>}
                      {i < synonymsParsedUa.length - 1 && <span>; </span>}
                    </span>
                  );
                })}
              </p>
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
              <p className="text-base leading-relaxed">
                {synonymsParsedEn.map((syn, i) => {
                  const words = syn.term.split(/\s+/).map((w) => w.trim()).filter(Boolean);
                  return (
                    <span key={i}>
                      {words.map((w, wi) => (
                        <span key={wi}>
                          <span
                            role="link"
                            tabIndex={0}
                            onClick={() => openGlossary(w)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
                            title="Open in glossary"
                            className="cursor-pointer italic"
                          >
                            {w}
                          </span>
                          {wi < words.length - 1 && " "}
                        </span>
                      ))}
                      {syn.meaning && <span> — {syn.meaning}</span>}
                      {i < synonymsParsedEn.length - 1 && <span>; </span>}
                    </span>
                  );
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Translation */}
      <div className="p-8">
        {/* Headers */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <h3 className="text-xl font-bold">Переклад</h3>
          <h3 className="text-xl font-bold">Translation</h3>
        </div>

        {editMode ? (
          <div className="grid grid-cols-2 gap-8">
            <Textarea
              value={editedData.translationUa}
              onChange={(e) =>
                setEditedData({ ...editedData, translationUa: e.target.value })
              }
              className="text-base min-h-[150px]"
            />
            <Textarea
              value={editedData.translationEn}
              onChange={(e) =>
                setEditedData({ ...editedData, translationEn: e.target.value })
              }
              className="text-base min-h-[150px]"
            />
          </div>
        ) : (
          <DualLanguageText
            uaParagraphs={null}
            enParagraphs={null}
            uaText={editedData.translationUa}
            enText={editedData.translationEn}
            className="text-base font-semibold"
          />
        )}
      </div>

      {/* Commentary */}
      <div className="p-8">
        {/* Headers */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <h3 className="text-xl font-bold">Пояснення</h3>
          <h3 className="text-xl font-bold">Purport</h3>
        </div>

        {editMode ? (
          <div className="grid grid-cols-2 gap-8">
            <Textarea
              value={editedData.commentaryUa}
              onChange={(e) =>
                setEditedData({ ...editedData, commentaryUa: e.target.value })
              }
              className="text-base min-h-[300px]"
            />
            <Textarea
              value={editedData.commentaryEn}
              onChange={(e) =>
                setEditedData({ ...editedData, commentaryEn: e.target.value })
              }
              className="text-base min-h-[300px]"
            />
          </div>
        ) : (
          <DualLanguageText
            uaParagraphs={null}
            enParagraphs={null}
            uaText={editedData.commentaryUa}
            enText={editedData.commentaryEn}
            className="text-base"
          />
        )}
      </div>
    </div>
  );
}
