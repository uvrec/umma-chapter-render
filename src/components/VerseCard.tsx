// VerseCard.tsx — оновлена версія з окремими Volume2 кнопками для кожної секції
// Відповідає PDF шаблону: кожен блок (Санскрит, Послівний, Переклад, Пояснення) має свою кнопку Volume2
// + VerseNumberEditor для мануального редагування номерів віршів адміністратором
// + STICKY HEADER для верхньої панелі
// + Inline редактор для коментарів з автозбереженням

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, Edit, Save, X, Volume2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAudio } from "@/contexts/ModernAudioContext";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { VerseNumberEditor } from "@/components/VerseNumberEditor";
import { addLearningWord, isWordInLearningList } from "@/utils/learningWords";
import { toast } from "sonner";
// ✅ ВИДАЛЕНО: addSanskritLineBreaks - санскрит зберігається як звичайний текст з \n
import { FONT_SIZE_MULTIPLIERS, LINE_HEIGHTS } from "@/constants/typography";
import { stripParagraphTags } from "@/utils/import/normalizers";

/* =========================
   Допоміжні функції
   ========================= */

// Convert plain text to HTML (wrap in <p> tags, preserve line breaks)
const textToHtml = (text: string | undefined): string => {
  if (!text) return "";
  // Якщо вже HTML (містить теги), повертаємо як є
  if (text.includes("<") && text.includes(">")) return text;
  // Інакше конвертуємо plain text в HTML
  return text.split("\n").map(line => `<p>${line || '<br>'}</p>`).join("");
};

/* =========================
   Типи пропсів
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
  audioSanskrit?: string; // окреме аудіо для санскриту
  audioSynonyms?: string; // окреме аудіо для послівного
  audioTranslation?: string; // окреме аудіо для перекладу
  audioCommentary?: string; // окреме аудіо для пояснення

  // ✅ НОВЕ: Підтримка складених віршів
  is_composite?: boolean;
  start_verse?: number;
  end_verse?: number;
  verse_count?: number;
  textDisplaySettings?: {
    showSanskrit: boolean;
    showTransliteration: boolean;
    showSynonyms: boolean;
    showTranslation: boolean;
    showCommentary: boolean;
  };
  showNumbers?: boolean;
  fontSize?: number;
  lineHeight?: number;
  flowMode?: boolean;
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
  onVerseNumberUpdate?: () => void; // коллбек після зміни номера
  language?: "ua" | "en"; // ✅ НОВЕ: мова інтерфейсу
}

/* =========================
   Допоміжні функції
   ========================= */

function parseSynonyms(raw: string): Array<{
  term: string;
  meaning: string;
}> {
  if (!raw) return [];
  const parts = raw
    .split(/[;]+/g)
    .map((p) => p.trim())
    .filter(Boolean);
  const dashVariants = [" — ", " – ", " - ", "—", "–", "-", " —\n", " –\n", " -\n", "—\n", "–\n", "-\n"];
  const pairs: Array<{
    term: string;
    meaning: string;
  }> = [];
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
      pairs.push({
        term: part,
        meaning: "",
      });
      continue;
    }
    const term = part.slice(0, idx).trim();
    const meaning = part.slice(idx + used.length).trim();
    if (term)
      pairs.push({
        term,
        meaning,
      });
  }
  return pairs;
}
// openGlossary function moved inside component to use useNavigate hook

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
  audioSanskrit,
  audioSynonyms,
  audioTranslation,
  audioCommentary,
  is_composite = false,
  start_verse,
  end_verse,
  verse_count,
  textDisplaySettings = {
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true,
  },
  showNumbers = true,
  fontSize = 18,
  lineHeight = 1.6,
  flowMode = false,
  isAdmin = false,
  onVerseUpdate,
  onVerseNumberUpdate,
  language = "ua",
}: VerseCardProps) => {
  const navigate = useNavigate();

  // ✅ Функція для відкриття глосарію - використовує navigate замість window.open для мобільних
  const openGlossary = useCallback((term: string) => {
    const url = `/glossary?search=${encodeURIComponent(term)}`;
    navigate(url);
  }, [navigate]);

  // ✅ Назви блоків залежно від мови
  const blockLabels = {
    ua: {
      synonyms: "Послівний переклад",
      translation: "Літературний переклад",
      commentary: "Пояснення",
    },
    en: {
      synonyms: "Synonyms",
      translation: "Translation",
      commentary: "Purport",
    },
  };
  const labels = blockLabels[language];
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();
  const [isEditing, setIsEditing] = useState(false);

  // Debug: перевірка isAdmin та textDisplaySettings
  useEffect(() => {
    console.log('[VerseCard] Debug:', {
      isAdmin,
      verseId,
      verseNumber,
      hasSynonyms: !!synonyms,
      hasTranslation: !!translation,
      hasCommentary: !!commentary,
      textDisplaySettings
    });
  }, [isAdmin, verseId, verseNumber, synonyms, translation, commentary, textDisplaySettings]);
  const [edited, setEdited] = useState({
    sanskrit: sanskritText,
    transliteration: transliteration || "",
    synonyms: textToHtml(synonyms),
    translation: textToHtml(translation),
    commentary: textToHtml(commentary),
  });

  // ✅ Оновлювати edited коли props змінюються (напр. при переході між віршами)
  useEffect(() => {
    setEdited({
      sanskrit: sanskritText,
      transliteration: transliteration || "",
      synonyms: textToHtml(synonyms),
      translation: textToHtml(translation),
      commentary: textToHtml(commentary),
    });
  }, [sanskritText, transliteration, synonyms, translation, commentary]);
  const isThisPlaying = currentTrack?.id === verseNumber && isPlaying;

  // ✅ ВИДАЛЕНО: processedSanskrit - санскрит відображається як є, з \n
  // Автоматичні розриви застосовуються ТІЛЬКИ при імпорті, а не при рендерингу

  // Функція для відтворення конкретної секції
  const playSection = (section: string, audioSrc?: string) => {
    const src = audioSrc || audioUrl;
    if (!src) return;
    const trackId = `${verseNumber}-${section}`;

    // Якщо вже грає цей трек — тумблер
    if (currentTrack?.id === trackId) {
      togglePlay();
      return;
    }
    playTrack({
      id: trackId,
      title: `${verseNumber} — ${section}`,
      src,
      url: src,
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

  // ✅ НОВЕ: Автозбереження для адмінів
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (!isAdmin || !verseId || !onVerseUpdate) return;

    // Перевіряємо чи щось змінилося
    const hasChanges =
      edited.synonyms !== (synonyms || "") ||
      edited.translation !== translation ||
      edited.commentary !== (commentary || "");

    if (hasChanges) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        onVerseUpdate(verseId, edited);
        toast.success("Зміни збережено", { duration: 1500 });
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [edited.synonyms, edited.translation, edited.commentary, synonyms, translation, commentary, isAdmin, verseId, onVerseUpdate, edited]);

  const synonymPairs = textDisplaySettings.showSynonyms ? parseSynonyms(isEditing ? edited.synonyms : synonyms) : [];
  return (
    <div
      className="verse-surface w-full animate-fade-in"
    >
      <div
        className="py-6"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight,
        }}
      >
        {/* 🆕 STICKY HEADER - Верхня панель: номер/книга + кнопка редагування */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm pb-4 mb-4 -mx-6 px-6 -mt-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Якщо адмін — показуємо VerseNumberEditor */}
              {showNumbers &&
                (isAdmin && verseId ? (
                  <VerseNumberEditor verseId={verseId} currentNumber={verseNumber} onUpdate={onVerseNumberUpdate} />
                ) : (
                  <div className="flex h-8 items-center justify-center rounded-full bg-primary/10 px-3">
                    <span className="text-sm font-semibold text-primary">Вірш {verseNumber}</span>
                  </div>
                ))}

              {/* ✅ ІНДИКАТОР СКЛАДЕНИХ ВІРШІВ (тільки для адміна) */}
              {isAdmin && is_composite && verse_count && start_verse && end_verse && (
                <div className="flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Складений вірш: {verse_count} {verse_count === 1 ? "вірш" : verse_count < 5 ? "вірші" : "віршів"} (
                    {start_verse}-{end_verse})
                  </span>
                </div>
              )}

              {bookName && <span className="rounded bg-muted px-2 py-1 text-sm text-muted-foreground">{bookName}</span>}
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
        </div>

        {/* Деванагарі з окремою кнопкою Volume2 */}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritText) && (
          <div className="mb-10">
            {/* Кнопка Volume2 для Санскриту */}
            <div className="mb-4 flex justify-center">
              <button
                onClick={() => playSection("Санскрит", audioSanskrit)}
                disabled={!audioSanskrit && !audioUrl}
                className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Слухати санскрит"
              >
                <Volume2 className="h-7 w-7 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {isEditing ? (
              <Textarea
                value={edited.sanskrit}
                onChange={(e) =>
                  setEdited((p) => ({
                    ...p,
                    sanskrit: e.target.value,
                  }))
                }
                className="min-h-[100px] text-center sanskrit-text"
              />
            ) : (
              <p className="whitespace-pre-line text-center sanskrit-text" style={{ fontSize: `${fontSize}px`, lineHeight }}>{sanskritText}</p>
            )}
          </div>
        )}

        {/* Транслітерація */}
        {textDisplaySettings.showTransliteration && (isEditing || transliteration) && (
          <div className="mb-8">
            {isEditing ? (
              <Textarea
                value={edited.transliteration}
                onChange={(e) =>
                  setEdited((p) => ({
                    ...p,
                    transliteration: e.target.value,
                  }))
                }
                className="min-h-[80px] text-center iast-text text-muted-foreground"
              />
            ) : (
              <div className="space-y-1 text-center" style={{ fontSize: `${fontSize}px`, lineHeight }}>
                {transliteration.split("\n").map((line, idx) => (
                  <p key={idx} className="iast-text text-muted-foreground italic">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Послівний переклад з окремою кнопкою Volume2 */}
        {textDisplaySettings.showSynonyms && (synonyms || isAdmin) && (
          <div className="mb-6">
            {/* Заголовок + кнопка Volume2 */}
            <div className="section-header flex items-center justify-center gap-4 mb-8">
              <h4 className="text-foreground">{labels.synonyms}</h4>
              <button
                onClick={() => playSection("Послівний переклад", audioSynonyms)}
                disabled={!audioSynonyms && !audioUrl}
                className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Слухати послівний переклад"
              >
                <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {isAdmin ? (
              <EnhancedInlineEditor
                content={edited.synonyms}
                onChange={(html) =>
                  setEdited((p) => ({
                    ...p,
                    synonyms: html,
                  }))
                }
                label="Послівний переклад"
                editable={isEditing}
              />
            ) : (
              <p className="synonyms-text text-foreground" style={{ fontSize: `${fontSize}px`, lineHeight }}>
                {synonymPairs.length === 0 ? (
                  <span className="text-muted-foreground">{synonyms}</span>
                ) : (
                  synonymPairs.map((pair, i) => {
                    const words = pair.term
                      .split(/\s+/)
                      .map((w) => w.trim())
                      .filter(Boolean);

                    // Handler for adding word to learning
                    const handleAddToLearning = (word: string, meaning: string) => {
                      const added = addLearningWord({
                        script: word,
                        iast: word,
                        ukrainian: meaning,
                        meaning: meaning,
                        book: bookName,
                        verseReference: verseNumber,
                      });
                      if (added) {
                        toast.success(`Додано до вивчення: ${word}`);
                      } else {
                        toast.info(`Слово вже в списку: ${word}`);
                      }
                    };
                    return (
                      <span key={i}>
                        {words.map((w, wi) => (
                          <span key={wi}>
                            <span
                              role="link"
                              tabIndex={0}
                              onClick={() => openGlossary(w)}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                openGlossary(w);
                              }}
                              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
                              title="Відкрити у глосарії"
                              className="cursor-pointer italic"
                              style={{ color: '#BC731B', WebkitTapHighlightColor: 'rgba(188, 115, 27, 0.3)' }}
                            >
                              {w}
                            </span>
                            {wi < words.length - 1 && " "}
                          </span>
                        ))}
                        {pair.meaning && <span> — {pair.meaning}</span>}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToLearning(pair.term, pair.meaning || "");
                          }}
                          title="Додати до вивчення"
                          aria-label={`Додати "${pair.term}" до вивчення`}
                          className="inline-flex items-center justify-center ml-1 p-1 rounded-md hover:bg-primary/10 transition-colors group text-sm"
                        >
                          <GraduationCap
                            className={`h-4 w-4 ${isWordInLearningList(pair.term) ? "text-green-600" : "text-muted-foreground group-hover:text-primary"}`}
                          />
                        </button>
                        {i < synonymPairs.length - 1 && <span>; </span>}
                      </span>
                    );
                  })
                )}
              </p>
            )}
          </div>
        )}

        {/* Літературний переклад з окремою кнопкою Volume2 */}
        {textDisplaySettings.showTranslation && (translation || isAdmin) && (
          <div className="mb-6">
            {/* Заголовок + кнопка Volume2 */}
            <div className="section-header flex items-center justify-center gap-4 mb-8">
              <h4 className="text-foreground font-serif">{labels.translation}</h4>
              <button
                onClick={() => playSection("Літературний переклад", audioTranslation)}
                disabled={!audioTranslation && !audioUrl}
                className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Слухати переклад"
              >
                <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {isAdmin ? (
              <EnhancedInlineEditor
                content={edited.translation}
                onChange={(html) =>
                  setEdited((p) => ({
                    ...p,
                    translation: html,
                  }))
                }
                label="Переклад"
                editable={isEditing}
              />
            ) : (
              <p
                className="text-foreground text-justify"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
              >
                {stripParagraphTags(translation)}
              </p>
            )}
          </div>
        )}

        {/* Пояснення з окремою кнопкою Volume2 */}
        {textDisplaySettings.showCommentary && (commentary || isAdmin) && (
          <div>
            {/* Заголовок + кнопка Volume2 */}
            <div className="section-header flex items-center justify-center gap-4 mb-8">
              <h4 className="text-foreground font-serif">{labels.commentary}</h4>
              <button
                onClick={() => playSection("Пояснення", audioCommentary)}
                disabled={!audioCommentary && !audioUrl}
                className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Слухати пояснення"
              >
                <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {isAdmin ? (
              <EnhancedInlineEditor
                content={edited.commentary}
                onChange={(html) =>
                  setEdited((p) => ({
                    ...p,
                    commentary: html,
                  }))
                }
                label="Пояснення"
                editable={isEditing}
              />
            ) : (
              <div
                className="text-foreground text-justify"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
                dangerouslySetInnerHTML={{ __html: commentary || "" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
