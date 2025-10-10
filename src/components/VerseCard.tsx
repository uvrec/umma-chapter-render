// VerseCard.tsx — повна версія з клікабельними термінами (італік), аудіоконтролем,
// адмін-редагуванням (Textarea + InlineTiptapEditor для коментаря)

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Play, Pause, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAudio } from "@/components/GlobalAudioPlayer";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";

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
  onVerseUpdate?: (verseId: string, updates: any) => Promise<void> | void;
}

/** Парсер «Послівного перекладу». Повертає масив записів { terms: string[], meaning: string } */
function parseSynonyms(raw?: string) {
  const input = (raw || "").trim();
  if (!input) return [] as Array<{ terms: string[]; meaning: string }>;

  // Розбиваємо на записи за ; або , (ігноруємо порожні)
  const chunks = input
    .split(/[;,]/)
    .map((c) => c.trim())
    .filter(Boolean);

  const seps = [" — ", " – ", " - ", "—", "–", "-"];

  return chunks.map((chunk) => {
    let idx = -1;
    let sep = "";
    for (const s of seps) {
      idx = chunk.indexOf(s);
      if (idx !== -1) {
        sep = s;
        break;
      }
    }
    // Якщо тире не знайшли — повертаємо chunk як термін без значення
    if (idx === -1) return { terms: [chunk], meaning: "" };

    const lhs = chunk.slice(0, idx).trim();
    const rhs = chunk
      .slice(idx + sep.length)
      .trim()
      .replace(/^\n+/, "");

    // Терміни ділимо по пробілах, зберігаємо дефісні як одне слово
    const terms = lhs.split(/\s+/).filter(Boolean);
    return { terms, meaning: rhs };
  });
}

export const VerseCard: React.FC<VerseCardProps> = ({
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
    showCommentary: true,
  },
  isAdmin = false,
  onVerseUpdate,
}) => {
  const { playTrack, pause, currentTrack, isPlaying } = useAudio();

  // Адмін-редагування
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedFields, setEditedFields] = useState({
    sanskrit: sanskritText,
    transliteration: transliteration || "",
    synonyms: synonyms || "",
    translation: translation,
    commentary: commentary || "",
  });

  // Синхронізація локального стану, коли прийшли нові пропси (і ми не редагуємо)
  useEffect(() => {
    if (isEditing) return;
    setEditedFields({
      sanskrit: sanskritText,
      transliteration: transliteration || "",
      synonyms: synonyms || "",
      translation: translation,
      commentary: commentary || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verseId, sanskritText, transliteration, synonyms, translation, commentary]);

  // Аудіо
  const isCurrent = currentTrack?.id === verseNumber;
  const canPlay = Boolean(audioUrl);

  const handlePlay = useCallback(() => {
    if (!canPlay) return;
    if (isCurrent && isPlaying) {
      pause();
      return;
    }
    playTrack({
      id: verseNumber,
      title: `Вірш ${verseNumber}`,
      src: audioUrl!,
      verseNumber,
    });
  }, [audioUrl, canPlay, isCurrent, isPlaying, pause, playTrack, verseNumber]);

  // Редагування
  const handleEdit = () => {
    setIsEditing(true);
    setEditedFields({
      sanskrit: sanskritText,
      transliteration: transliteration || "",
      synonyms: synonyms || "",
      translation: translation,
      commentary: commentary || "",
    });
  };

  const handleSave = async () => {
    if (!onVerseUpdate || !verseId) {
      setIsEditing(false);
      return;
    }
    try {
      setSaving(true);
      await onVerseUpdate(verseId, editedFields);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFields({
      sanskrit: sanskritText,
      transliteration: transliteration || "",
      synonyms: synonyms || "",
      translation: translation,
      commentary: commentary || "",
    });
  };

  // Послівний — підготовка
  const synonymsParts = useMemo(() => parseSynonyms(synonyms), [synonyms]);

  return (
    <Card className="verse-surface w-full animate-fade-in border-gray-100 bg-card shadow-sm dark:border-border">
      <div className="p-6">
        {/* Верхній рядок: номер/книга/плеєр/редагування */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 items-center justify-center rounded-full bg-primary/10 px-3">
              <span className="text-sm font-semibold text-primary">{verseNumber}</span>
            </div>
            {bookName && <span className="rounded bg-muted px-2 py-1 text-sm text-muted-foreground">{bookName}</span>}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlay}
              disabled={!canPlay}
              aria-pressed={isCurrent && isPlaying}
              className={`${isCurrent && isPlaying ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
            >
              {isCurrent && isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Пауза
                </>
              ) : canPlay ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Слухати
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4 opacity-50" />
                  Аудіо незабаром
                </>
              )}
            </Button>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="default" size="sm" onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Збереження…" : "Зберегти"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                    <X className="mr-2 h-4 w-4" />
                    Скасувати
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редагувати
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Санскрит */}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritText) && (
          <section className="mb-10" aria-labelledby={`sanskrit-${verseNumber}`}>
            <h3 id={`sanskrit-${verseNumber}`} className="sr-only">
              Санскрит
            </h3>
            {isEditing ? (
              <Textarea
                value={editedFields.sanskrit}
                onChange={(e) => setEditedFields((p) => ({ ...p, sanskrit: e.target.value }))}
                className="min-h-[100px] text-center text-[32px] leading-[1.8] font-sanskrit text-gray-600 dark:text-foreground"
              />
            ) : (
              <p className="whitespace-pre-line text-center text-[32px] leading-[1.8] font-sanskrit text-gray-600 dark:text-foreground">
                {sanskritText}
              </p>
            )}
          </section>
        )}

        {/* Транслітерація */}
        {textDisplaySettings.showTransliteration && (isEditing || transliteration) && (
          <section className="mb-8" aria-labelledby={`translit-${verseNumber}`}>
            <h3 id={`translit-${verseNumber}`} className="sr-only">
              Транслітерація
            </h3>
            {isEditing ? (
              <Textarea
                value={editedFields.transliteration}
                onChange={(e) => setEditedFields((p) => ({ ...p, transliteration: e.target.value }))}
                className="min-h-[80px] text-center text-[22px] italic font-sanskrit-italic text-gray-500 dark:text-muted-foreground"
              />
            ) : (
              <div className="space-y-1 text-center">
                {(transliteration || "")
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <p
                      key={i}
                      className="text-[22px] leading-relaxed italic font-sanskrit-italic text-gray-500 dark:text-muted-foreground"
                    >
                      {line}
                    </p>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Послівний переклад */}
        {textDisplaySettings.showSynonyms && (isEditing || synonyms) && (
          <section className="mb-6 border-t border-border pt-6" aria-labelledby={`synonyms-${verseNumber}`}>
            <h3 id={`synonyms-${verseNumber}`} className="mb-4 text-[21px] font-bold text-foreground">
              Послівний переклад:
            </h3>
            {isEditing ? (
              <Textarea
                value={editedFields.synonyms}
                onChange={(e) => setEditedFields((p) => ({ ...p, synonyms: e.target.value }))}
                className="min-h-[100px] text-[21px] text-foreground"
              />
            ) : (
              <p className="text-[21px] leading-relaxed text-foreground">
                {synonymsParts.length === 0
                  ? synonyms || ""
                  : synonymsParts.map((entry, i) => (
                      <span key={i}>
                        {/* Кожний термін — курсив і клікабельний (відкриває глосарій у новій вкладці) */}
                        {entry.terms.map((w, wi) => (
                          <span key={wi}>
                            <button
                              type="button"
                              className="cursor-pointer italic font-sanskrit-italic text-destructive hover:underline hover:text-destructive/80"
                              onClick={() =>
                                window.open(
                                  `/glossary?search=${encodeURIComponent(w)}`,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                              aria-label={`Відкрити глосарій для: ${w}`}
                            >
                              {w}
                            </button>
                            {wi < entry.terms.length - 1 && " "}
                          </span>
                        ))}
                        {entry.meaning && <span> — {entry.meaning}</span>}
                        {i < synonymsParts.length - 1 && "; "}
                      </span>
                    ))}
              </p>
            )}
          </section>
        )}

        {/* Літературний переклад */}
        {textDisplaySettings.showTranslation && (isEditing || translation) && (
          <section className="mb-6 border-t border-border pt-6" aria-labelledby={`translation-${verseNumber}`}>
            <h3 id={`translation-${verseNumber}`} className="mb-4 text-[21px] font-bold text-foreground">
              Літературний переклад:
            </h3>
            {isEditing ? (
              <Textarea
                value={editedFields.translation}
                onChange={(e) => setEditedFields((p) => ({ ...p, translation: e.target.value }))}
                className="min-h-[100px] text-[23px] font-medium text-foreground"
              />
            ) : (
              <p className="text-[23px] font-medium leading-relaxed text-foreground">{translation}</p>
            )}
          </section>
        )}

        {/* Коментар */}
        {textDisplaySettings.showCommentary && (isEditing || commentary) && (
          <section className="border-t border-border pt-6" aria-labelledby={`commentary-${verseNumber}`}>
            <h3 id={`commentary-${verseNumber}`} className="mb-4 text-[21px] font-bold text-foreground">
              Коментар:
            </h3>
            {isEditing ? (
              <InlineTiptapEditor
                content={editedFields.commentary}
                onChange={(html) => setEditedFields((p) => ({ ...p, commentary: html }))}
                label="Редагувати коментар"
              />
            ) : (
              <TiptapRenderer content={commentary || ""} className="text-[22px] leading-relaxed" />
            )}
          </section>
        )}
      </div>
    </Card>
  );
};
