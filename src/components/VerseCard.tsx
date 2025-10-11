import { useState } from "react";
import { Play, Pause, Edit, Save, X, Music4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAudio } from "@/components/GlobalAudioPlayer";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";

/* =========================
   Типи пропсів
   ========================= */
interface VerseCardProps {
  verseId?: string;
  verseNumber: string; // напр. "1.1.10" або "ШБ 1.1.10"
  bookName?: string;

  sanskritText: string; // Деванагарі
  transliteration?: string; // IAST / ваша локальна трансліт-схема
  synonyms?: string; // послівний "term — значення; term2 — значення2; ..."
  translation: string; // літературний переклад
  commentary?: string; // HTML (Tiptap) або пусто

  audioUrl?: string;

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

/* =========================
   Допоміжні функції
   ========================= */

// Розбити послівний текст на пари "термін — значення" зі стійкістю до різних тире/розділювачів
function parseSynonyms(raw: string): Array<{ term: string; meaning: string }> {
  if (!raw) return [];
  // Розділюємо за ; або , (поширений спосіб сегментувати пари)
  const parts = raw
    .split(/[;]+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  const dashVariants = [
    " — ",
    " – ",
    " - ",
    "—",
    "–",
    "-", // звичайні тире
    " —\n",
    " –\n",
    " -\n",
    "—\n",
    "–\n",
    "-\n", // тире+перенос
  ];

  const pairs: Array<{ term: string; meaning: string }> = [];
  for (const part of parts) {
    let idx = -1;
    let used = "";
    for (const d of dashVariants) {
      idx = part.indexOf(d);
      if (idx !== -1) {
        used = d;
        break;
      }
    }
    if (idx === -1) {
      // Якщо не знайшли тире — повертаємо як є (може бути "див. ...")
      pairs.push({ term: part, meaning: "" });
      continue;
    }
    const term = part.slice(0, idx).trim();
    const meaning = part.slice(idx + used.length).trim();
    if (term) pairs.push({ term, meaning });
  }
  return pairs;
}

// Відкрити глосарій у новій вкладці (без небажаних попапів)
function openGlossary(term: string) {
  const url = `/glossary?search=${encodeURIComponent(term)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* =========================
   Компонент
   ========================= */
export const VerseCard = ({
  verseId,
  verseNumber,
  bookName,
  sanskritText,
  transliteration = "",
  synonyms = "",
  translation,
  commentary = "",
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
}: VerseCardProps) => {
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

  const handlePlay = () => {
    if (!audioUrl) return;
    // Якщо вже наш трек — просто тумблер
    if (currentTrack?.id === verseNumber) {
      togglePlay();
      return;
    }
    playTrack({
      id: verseNumber,
      title: `Вірш ${verseNumber}`,
      src: audioUrl,
      verseNumber,
    });
  };

  const startEdit = () => {
    setEdited({
      sanskrit: sanskritText,
      transliteration,
      synonyms,
      translation,
      commentary,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEdited({
      sanskrit: sanskritText,
      transliteration,
      synonyms,
      translation,
      commentary,
    });
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (onVerseUpdate && verseId) {
      onVerseUpdate(verseId, edited);
      setIsEditing(false);
    }
  };

  const synonymPairs = textDisplaySettings.showSynonyms ? parseSynonyms(isEditing ? edited.synonyms : synonyms) : [];

  return (
    <Card className="verse-surface w-full animate-fade-in border-gray-100 bg-card shadow-sm dark:border-border">
      <div className="p-6">
        {/* Верхня панель: номер/книга/плей */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-8 items-center justify-center rounded-full bg-primary/10 px-3">
              <span className="text-sm font-semibold text-primary">Вірш {verseNumber}</span>
            </div>

            {bookName && <span className="rounded bg-muted px-2 py-1 text-sm text-muted-foreground">{bookName}</span>}

            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlay}
              className={`${isThisPlaying ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
              disabled={!audioUrl}
            >
              {isThisPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Пауза
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {audioUrl ? "Слухати" : "Аудіо незабаром"}
                </>
              )}
            </Button>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="default" size="sm" onClick={saveEdit}>
                    <Save className="mr-2 h-4 w-4" />
                    Зберегти
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    <X className="mr-2 h-4 w-4" />
                    Скасувати
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={startEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редагувати
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Деванагарі */}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritText) && (
          <div className="mb-10">
            {isEditing ? (
              <Textarea
                value={edited.sanskrit}
                onChange={(e) => setEdited((p) => ({ ...p, sanskrit: e.target.value }))}
                className="min-h-[100px] text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground"
              />
            ) : (
              <p className="whitespace-pre-line text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground">
                {sanskritText}
              </p>
            )}
          </div>
        )}

        {/* Транслітерація */}
        {textDisplaySettings.showTransliteration && (isEditing || transliteration) && (
          <div className="mb-8">
            {isEditing ? (
              <Textarea
                value={edited.transliteration}
                onChange={(e) => setEdited((p) => ({ ...p, transliteration: e.target.value }))}
                className="min-h-[80px] text-center font-sanskrit-italic italic text-[1.22em] text-gray-500 dark:text-muted-foreground"
              />
            ) : (
              <div className="space-y-1 text-center">
                {transliteration.split("\n").map((line, idx) => (
                  <p
                    key={idx}
                    className="font-sanskrit-italic italic text-[1.22em] leading-relaxed text-gray-500 dark:text-muted-foreground"
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
            <h4 className="mb-4 text-[1.17em] font-bold text-foreground">Послівний переклад:</h4>
            {isEditing ? (
              <Textarea
                value={edited.synonyms}
                onChange={(e) => setEdited((p) => ({ ...p, synonyms: e.target.value }))}
                className="min-h-[120px] text-[21px]"
              />
            ) : (
              <p className="text-[1.17em] leading-relaxed text-foreground">
                {synonymPairs.length === 0 ? (
                  <span className="text-muted-foreground">{synonyms}</span>
                ) : (
                  synonymPairs.map((pair, i) => {
                    // Розбиваємо термін на слова (дефіс залишаємо цілим словом)
                    const words = pair.term
                      .split(/\s+/)
                      .map((w) => w.trim())
                      .filter(Boolean);

                    return (
                      <span key={i}>
                        {/* Терміни курсивом + клікабельні, ведуть у глосарій в новій вкладці */}
                        {words.map((w, wi) => (
                          <span key={wi}>
                            <span
                              role="link"
                              tabIndex={0}
                              onClick={() => openGlossary(w)}
                              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
                              className="cursor-pointer font-sanskrit-italic italic text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-primary/50"
                              title="Відкрити у глосарії"
                            >
                              {w}
                            </span>
                            {wi < words.length - 1 && " "}
                          </span>
                        ))}
                        {pair.meaning && <span> — {pair.meaning}</span>}
                        {i < synonymPairs.length - 1 && <span>; </span>}
                      </span>
                    );
                  })
                )}
              </p>
            )}
          </div>
        )}

        {/* Літературний переклад */}
        {textDisplaySettings.showTranslation && (isEditing || translation) && (
          <div className="mb-6 border-t border-border pt-6">
            <h4 className="mb-4 text-[1.17em] font-bold text-foreground">Літературний переклад:</h4>
            {isEditing ? (
              <Textarea
                value={edited.translation}
                onChange={(e) => setEdited((p) => ({ ...p, translation: e.target.value }))}
                className="min-h-[100px] text-[23px] font-medium"
              />
            ) : (
              <p className="text-[1.28em] font-medium leading-relaxed text-foreground">{translation}</p>
            )}
          </div>
        )}

        {/* Пояснення (Tiptap) */}
        {textDisplaySettings.showCommentary && (isEditing || commentary) && (
          <div className="border-t border-border pt-6">
            <h4 className="mb-4 text-[1.17em] font-bold text-foreground">Пояснення:</h4>
            {isEditing ? (
              <InlineTiptapEditor
                content={edited.commentary}
                onChange={(html) => setEdited((p) => ({ ...p, commentary: html }))}
                label="Редагувати Пояснення"
              />
            ) : (
              <TiptapRenderer content={commentary || ""} className="text-[1.22em] leading-relaxed" />
            )}
          </div>
        )}

        {/* Невеликий майданчик під плеєр (якщо потрібен статус) */}
        {audioUrl && (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Music4 className="h-4 w-4" />
            <span>{isThisPlaying ? "Відтворюється…" : "Готово до відтворення"}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
