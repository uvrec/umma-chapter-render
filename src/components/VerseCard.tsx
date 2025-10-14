// src/components/VerseCard.improved.tsx
// ПОКРАЩЕНА ВЕРСІЯ: виправлено помилки parseSynonyms, додано React.memo, accessibility

import React, { useState, useMemo, useCallback } from "react";
import { Play, Pause, Edit, Save, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAudio } from "@/components/GlobalAudioPlayer";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";

/* =========================
   Типи
   ========================= */
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
  audioSanskrit?: string;
  audioSynonyms?: string;
  audioTranslation?: string;
  audioCommentary?: string;

  textDisplaySettings?: {
    showSanskrit: boolean;
    showTransliteration: boolean;
    showSynonyms: boolean;
    showTranslation: boolean;
    showCommentary: boolean;
  };

  isAdmin?: boolean;
  onVerseUpdate?: (
    verseId: string,
    updates: {
      sanskrit: string;
      transliteration: string;
      synonyms: string;
      translation: string;
      commentary: string;
    },
  ) => void;
}

interface SynonymPair {
  term: string;
  meaning: string;
}

/* =========================
   Допоміжні функції (ПОКРАЩЕНІ)
   ========================= */

/**
 * ВИПРАВЛЕНА ВЕРСІЯ: обробка всіх edge cases
 */
function parseSynonyms(raw: string): SynonymPair[] {
  // Захист від пустих значень
  if (!raw || typeof raw !== "string") return [];

  const trimmed = raw.trim();
  if (!trimmed) return [];

  // Розділяємо по крапці з комою
  const parts = trimmed
    .split(/;+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return [];

  // Можливі варіанти тире
  const dashVariants = [" — ", " – ", " - ", "—", "–", "-", " —\n", " –\n", " -\n", "—\n", "–\n", "-\n"];

  const pairs: SynonymPair[] = [];

  for (const part of parts) {
    let idx = -1;
    let usedDash = "";

    // Шукаємо перше входження будь-якого тире
    for (const dash of dashVariants) {
      idx = part.indexOf(dash);
      if (idx !== -1) {
        usedDash = dash;
        break;
      }
    }

    // Якщо тире не знайдено - весь текст є терміном
    if (idx === -1) {
      const cleaned = part.replace(/\s+/g, " ").trim();
      if (cleaned) {
        pairs.push({ term: cleaned, meaning: "" });
      }
      continue;
    }

    // Розділяємо на термін і значення
    const term = part.slice(0, idx).replace(/\s+/g, " ").trim();
    const meaning = part
      .slice(idx + usedDash.length)
      .replace(/\s+/g, " ")
      .trim();

    if (term) {
      pairs.push({ term, meaning });
    }
  }

  return pairs;
}

/**
 * Відкриває глосарій у новій вкладці
 */
function openGlossary(term: string) {
  const url = `/glossary?search=${encodeURIComponent(term)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* =========================
   Компонент з React.memo
   ========================= */
export const VerseCard = React.memo<VerseCardProps>(
  ({
    verseId,
    verseNumber,
    bookName,
    sanskritText,
    transliteration = "",
    synonyms = "",
    translation,
    commentary = "",
    audioUrl,
    audioSanskrit,
    audioSynonyms,
    audioTranslation,
    audioCommentary,
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
    const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();

    const [isEditing, setIsEditing] = useState(false);
    const [edited, setEdited] = useState({
      sanskrit: sanskritText,
      transliteration,
      synonyms,
      translation,
      commentary,
    });

    const isThisPlaying = currentTrack?.id === verseNumber && isPlaying;

    // useMemo для дорогих обчислень
    const synonymPairs = useMemo(() => {
      if (!textDisplaySettings.showSynonyms) return [];
      const raw = isEditing ? edited.synonyms : synonyms;
      return parseSynonyms(raw);
    }, [textDisplaySettings.showSynonyms, isEditing, edited.synonyms, synonyms]);

    // useCallback для стабільності функцій
    const playSection = useCallback(
      (section: string, audioSrc?: string) => {
        const src = audioSrc || audioUrl;
        if (!src) return;

        const trackId = `${verseNumber}-${section}`;

        if (currentTrack?.id === trackId) {
          togglePlay();
          return;
        }

        playTrack({
          id: trackId,
          title: `${verseNumber} — ${section}`,
          src,
          verseNumber,
        });
      },
      [audioUrl, verseNumber, currentTrack, togglePlay, playTrack],
    );

    const startEdit = useCallback(() => {
      setEdited({
        sanskrit: sanskritText,
        transliteration,
        synonyms,
        translation,
        commentary,
      });
      setIsEditing(true);
    }, [sanskritText, transliteration, synonyms, translation, commentary]);

    const cancelEdit = useCallback(() => {
      setEdited({
        sanskrit: sanskritText,
        transliteration,
        synonyms,
        translation,
        commentary,
      });
      setIsEditing(false);
    }, [sanskritText, transliteration, synonyms, translation, commentary]);

    const saveEdit = useCallback(() => {
      if (onVerseUpdate && verseId) {
        onVerseUpdate(verseId, edited);
        setIsEditing(false);
      }
    }, [verseId, edited, onVerseUpdate]);

    return (
      <Card className="verse-surface w-full animate-fade-in border-gray-100 bg-card shadow-sm dark:border-border">
        <div className="p-6">
          {/* Верхня панель */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex h-8 items-center justify-center rounded-full bg-primary/10 px-3"
                role="status"
                aria-label={`Вірш ${verseNumber}`}
              >
                <span className="text-sm font-semibold text-primary">Вірш {verseNumber}</span>
              </div>

              {bookName && (
                <span
                  className="rounded bg-muted px-2 py-1 text-sm text-muted-foreground"
                  role="note"
                  aria-label={`Книга: ${bookName}`}
                >
                  {bookName}
                </span>
              )}
            </div>

            {isAdmin && (
              <div className="flex gap-2" role="group" aria-label="Дії редагування">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={saveEdit}
                      className="gap-2"
                      aria-label="Зберегти зміни"
                    >
                      <Save className="h-4 w-4" />
                      Зберегти
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                      className="gap-2"
                      aria-label="Скасувати редагування"
                    >
                      <X className="h-4 w-4" />
                      Скасувати
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={startEdit}
                    className="gap-2"
                    aria-label="Редагувати вірш"
                  >
                    <Edit className="h-4 w-4" />
                    Редагувати
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Санскрит */}
          {textDisplaySettings.showSanskrit && (isEditing || sanskritText) && (
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-center gap-4">
                <h4 className="sr-only">Санскрит</h4>
                <button
                  onClick={() => playSection("Санскрит", audioSanskrit)}
                  disabled={!audioSanskrit && !audioUrl}
                  className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Слухати санскрит"
                  type="button"
                >
                  <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {isEditing ? (
                <Textarea
                  value={edited.sanskrit}
                  onChange={(e) => setEdited((p) => ({ ...p, sanskrit: e.target.value }))}
                  className="min-h-[100px] text-center font-devanagari text-[1.67em] text-foreground"
                  aria-label="Редагувати текст санскриту"
                />
              ) : (
                <div className="space-y-2 text-center" lang="sa">
                  {sanskritText.split("\n").map((line, idx) => (
                    <p key={idx} className="font-devanagari text-[1.67em] font-medium leading-[2.2] text-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Транслітерація */}
          {textDisplaySettings.showTransliteration && (isEditing || transliteration) && (
            <div className="mb-6 border-t border-border pt-6">
              {isEditing ? (
                <Textarea
                  value={edited.transliteration}
                  onChange={(e) => setEdited((p) => ({ ...p, transliteration: e.target.value }))}
                  className="min-h-[80px] text-center font-sanskrit-italic italic text-[1.22em] text-gray-500 dark:text-muted-foreground"
                  aria-label="Редагувати транслітерацію"
                />
              ) : (
                <div className="space-y-1 text-center" lang="sa-Latn">
                  {transliteration.split("\n").map((line, idx) => (
                    <p
                      key={idx}
                      className="translit font-sanskrit-italic italic text-[1.22em] leading-relaxed text-gray-500 dark:text-muted-foreground"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Послівний переклад */}
          {textDisplaySettings.showSynonyms && (isEditing || synonyms) && (
            <div className="mb-6 border-t border-border pt-6">
              <div className="mb-4 flex items-center justify-center gap-4">
                <h4 className="text-[1.17em] font-bold text-foreground">Послівний переклад</h4>
                <button
                  onClick={() => playSection("Послівний переклад", audioSynonyms)}
                  disabled={!audioSynonyms && !audioUrl}
                  className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Слухати послівний переклад"
                  type="button"
                >
                  <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {isEditing ? (
                <Textarea
                  value={edited.synonyms}
                  onChange={(e) => setEdited((p) => ({ ...p, synonyms: e.target.value }))}
                  className="min-h-[120px] text-[21px]"
                  aria-label="Редагувати послівний переклад"
                />
              ) : (
                <div className="text-[1.17em] leading-relaxed text-foreground">
                  {synonymPairs.length === 0 ? (
                    <span className="text-muted-foreground">{synonyms}</span>
                  ) : (
                    synonymPairs.map((pair, i) => {
                      const words = pair.term
                        .split(/\s+/)
                        .map((w) => w.trim())
                        .filter(Boolean);

                      return (
                        <span key={i}>
                          {words.map((w, wi) => (
                            <span key={wi}>
                              <button
                                onClick={() => openGlossary(w)}
                                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
                                className="cursor-pointer font-sanskrit-italic italic text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
                                title={`Відкрити "${w}" у глосарії`}
                                type="button"
                                aria-label={`Шукати термін ${w} у глосарії`}
                              >
                                {w}
                              </button>
                              {wi < words.length - 1 && " "}
                            </span>
                          ))}
                          {pair.meaning && <span> — {pair.meaning}</span>}
                          {i < synonymPairs.length - 1 && <span>; </span>}
                        </span>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* Літературний переклад */}
          {textDisplaySettings.showTranslation && (isEditing || translation) && (
            <div className="mb-6 border-t border-border pt-6">
              <div className="mb-4 flex items-center justify-center gap-4">
                <h4 className="text-[1.17em] font-bold text-foreground">Літературний переклад</h4>
                <button
                  onClick={() => playSection("Літературний переклад", audioTranslation)}
                  disabled={!audioTranslation && !audioUrl}
                  className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Слухати переклад"
                  type="button"
                >
                  <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {isEditing ? (
                <InlineTiptapEditor
                  content={edited.translation}
                  onChange={(val) => setEdited((p) => ({ ...p, translation: val }))}
                  placeholder="Літературний переклад..."
                />
              ) : (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <TiptapRenderer content={translation} />
                </div>
              )}
            </div>
          )}

          {/* Пояснення */}
          {textDisplaySettings.showCommentary && (isEditing || commentary) && (
            <div className="border-t border-border pt-6">
              <div className="mb-4 flex items-center justify-center gap-4">
                <h4 className="text-[1.17em] font-bold text-foreground">Пояснення</h4>
                <button
                  onClick={() => playSection("Пояснення", audioCommentary)}
                  disabled={!audioCommentary && !audioUrl}
                  className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Слухати пояснення"
                  type="button"
                >
                  <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {isEditing ? (
                <InlineTiptapEditor
                  content={edited.commentary}
                  onChange={(val) => setEdited((p) => ({ ...p, commentary: val }))}
                  placeholder="Пояснення..."
                />
              ) : (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <TiptapRenderer content={commentary} />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  },
  // Custom comparison function for React.memo
  (prevProps, nextProps) => {
    // Re-render only if these props change
    return (
      prevProps.verseId === nextProps.verseId &&
      prevProps.isAdmin === nextProps.isAdmin &&
      prevProps.sanskritText === nextProps.sanskritText &&
      prevProps.transliteration === nextProps.transliteration &&
      prevProps.synonyms === nextProps.synonyms &&
      prevProps.translation === nextProps.translation &&
      prevProps.commentary === nextProps.commentary &&
      JSON.stringify(prevProps.textDisplaySettings) === JSON.stringify(nextProps.textDisplaySettings)
    );
  },
);

VerseCard.displayName = "VerseCard";
