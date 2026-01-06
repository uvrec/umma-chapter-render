// VerseCard.tsx — оновлена версія з окремими Volume2 кнопками для кожної секції
// Відповідає PDF шаблону: кожен блок (Санскрит, Послівний, Переклад, Пояснення) має свою кнопку Volume2
// + VerseNumberEditor для мануального редагування номерів віршів адміністратором
// + STICKY HEADER для верхньої панелі
// + Inline редактор для коментарів з автозбереженням

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, X, Volume2, GraduationCap, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { useAudio } from "@/contexts/ModernAudioContext";
import { VerseNumberEditor } from "@/components/VerseNumberEditor";
import { addLearningWord, isWordInLearningList } from "@/utils/learningWords";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { stripParagraphTags } from "@/utils/import/normalizers";
import { addSanskritLineBreaks } from "@/utils/text/lineBreaks";
import { parseSynonymPairs } from "@/utils/glossaryParser";
import { applyDropCap } from "@/utils/text/dropCap";

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
  showVerseContour?: boolean;
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
  // Навігація між віршами
  onPrevVerse?: () => void;
  onNextVerse?: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
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
  showVerseContour = true,
  isAdmin = false,
  onVerseUpdate,
  onVerseNumberUpdate,
  language = "ua",
  onPrevVerse,
  onNextVerse,
  isPrevDisabled,
  isNextDisabled,
  prevLabel,
  nextLabel,
}: VerseCardProps) => {
  const navigate = useNavigate();

  // Ref для запобігання подвійному спрацюванню на мобільних (touch + click)
  const glossaryNavigationRef = useRef<boolean>(false);

  // ✅ Функція для відкриття глосарію - з захистом від подвійного виклику
  const openGlossary = useCallback((term: string) => {
    // Запобігаємо подвійному спрацюванню (touch + click на мобільних)
    if (glossaryNavigationRef.current) return;
    glossaryNavigationRef.current = true;

    const url = `/glossary?search=${encodeURIComponent(term)}`;
    navigate(url);

    // Скидаємо флаг після короткої затримки
    setTimeout(() => {
      glossaryNavigationRef.current = false;
    }, 300);
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
  const { playTrack, currentTrack, togglePlay, isPlaying } = useAudio();

  // Check if this verse is currently playing
  const isNowPlaying = useMemo(() => {
    if (!currentTrack || !isPlaying) return false;
    // Check by verseId first
    if (currentTrack.verseId && verseId) {
      return currentTrack.verseId === verseId;
    }
    // Fallback: check if track ID contains verse number
    return currentTrack.id?.startsWith(`${verseNumber}-`) || false;
  }, [currentTrack, verseId, verseNumber, isPlaying]);

  const verseRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to this verse when it starts playing
  useEffect(() => {
    if (isNowPlaying && verseRef.current) {
      verseRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isNowPlaying]);

  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({
    sanskrit: sanskritText,
    transliteration: transliteration || "",
    synonyms: synonyms || "",
    translation: translation || "",
    commentary: commentary || "",
  });

  // ✅ Оновлювати edited коли props змінюються (напр. при переході між віршами)
  useEffect(() => {
    setEdited({
      sanskrit: sanskritText,
      transliteration: transliteration || "",
      synonyms: synonyms || "",
      translation: translation || "",
      commentary: commentary || "",
    });
  }, [sanskritText, transliteration, synonyms, translation, commentary]);

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
      subtitle: bookName,
      src,
      url: src,
      // Verse sync data for audio-text highlighting
      verseId: verseId,
      verseNumber: verseNumber,
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

  // Автозбереження видалено - користувач зберігає вручну через кнопку "Зберегти"

  // Обробка санскриту для автоматичних розривів рядків (як у двомовному режимі)
  const processedSanskrit = useMemo(() => {
    return addSanskritLineBreaks(sanskritText);
  }, [sanskritText]);

  // Парсинг синонімів - використовуємо єдиний парсер з glossaryParser.ts
  const synonymPairs = parseSynonymPairs(isEditing ? edited.synonyms : synonyms);

  // Визначаємо класи для контуру
  const contourClasses = isNowPlaying
    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background now-playing'
    : showVerseContour
      ? 'ring-1 ring-primary/30 ring-offset-1 ring-offset-background verse-contour'
      : '';

  return (
    <div
      ref={verseRef}
      className={`verse-surface w-full animate-fade-in ${contourClasses}`}
    >
      <div
        className="py-6"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight,
        }}
      >
        {/* НОМЕР ВІРША - відцентрований */}
        {showNumbers && (
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            {isAdmin && verseId ? (
              <VerseNumberEditor verseId={verseId} currentNumber={verseNumber} onUpdate={onVerseNumberUpdate} />
            ) : (
              <span className="font-semibold text-5xl" style={{ color: "rgb(188, 115, 26)" }}>
                ВІРШ {verseNumber}
              </span>
            )}
            {/* Назва глави - відцентрована під номером вірша */}
            {bookName && (
              <span className="text-sm text-muted-foreground text-center">{bookName}</span>
            )}

            {/* Tap-to-jump: кнопка відтворення всього вірша */}
            {(audioUrl || audioSanskrit || audioTranslation || audioCommentary) && (
              <button
                onClick={() => playSection("Вірш", audioUrl || audioSanskrit || audioTranslation || audioCommentary)}
                className={`
                  mt-2 flex items-center gap-2 px-4 py-2 rounded-full
                  transition-all duration-200
                  ${isNowPlaying
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }
                `}
                aria-label={isNowPlaying ? "Пауза" : "Слухати вірш"}
              >
                {isNowPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span className="text-sm font-medium">{language === 'ua' ? 'Грає...' : 'Playing...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span className="text-sm font-medium">{language === 'ua' ? 'Слухати' : 'Listen'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* КНОПКА РЕДАГУВАННЯ - по центру під номером вірша */}
        {isAdmin && (
          <div className="flex justify-center mb-4">
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={saveEdit}>
                  <Save className="mr-2 h-4 w-4" />
                  Зберегти
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Скасувати
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={startEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Редагувати
              </Button>
            )}
          </div>
        )}

        {/* НАВІГАЦІЯ МІЖ ВІРШАМИ */}
        {onPrevVerse && onNextVerse && (
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={onPrevVerse} disabled={isPrevDisabled}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {prevLabel}
            </Button>
            <Button variant="outline" onClick={onNextVerse} disabled={isNextDisabled}>
              {nextLabel}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ІНДИКАТОР СКЛАДЕНИХ ВІРШІВ (тільки для адміна) */}
        {isAdmin && is_composite && verse_count && start_verse && end_verse && (
          <div className="flex justify-center mb-4">
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
          </div>
        )}

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
              <p className="whitespace-pre-line text-center sanskrit-text" style={{ fontSize: `${fontSize}px`, lineHeight }}>{processedSanskrit}</p>
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
              <div
                className="text-center iast-text text-muted-foreground italic transliteration-lines"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(
                  transliteration.includes('<span class="line">')
                    ? transliteration
                    : transliteration.replace(/\n/g, '<br>'),
                  { ADD_TAGS: ['span', 'br'], ADD_ATTR: ['class'] }
                ) }}
              />
            )}
          </div>
        )}

        {/* Послівний переклад з окремою кнопкою Volume2 */}
        {textDisplaySettings.showSynonyms && (isEditing || synonyms) && (
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

            {isEditing ? (
              <Textarea
                value={edited.synonyms}
                onChange={(e) =>
                  setEdited((p) => ({
                    ...p,
                    synonyms: e.target.value,
                  }))
                }
                className="text-base min-h-[200px]"
              />
            ) : synonyms ? (
              <p
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.4,
                }}
                className="text-justify"
              >
                {synonymPairs.map((pair, i) => {
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
                              style={{ color: "#BC731B", WebkitTapHighlightColor: 'rgba(188, 115, 27, 0.3)' }}
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
                  })}
              </p>
            ) : null}
          </div>
        )}

        {/* Літературний переклад з окремою кнопкою Volume2 */}
        {textDisplaySettings.showTranslation && (isEditing || translation) && (
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

            {isEditing ? (
              <EnhancedInlineEditor
                content={edited.translation}
                onChange={(html) =>
                  setEdited((p) => ({
                    ...p,
                    translation: html,
                  }))
                }
                label="Редагувати переклад"
                minHeight="150px"
                compact={true}
              />
            ) : (
              <p
                className="text-foreground text-justify font-bold"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
              >
                {stripParagraphTags(translation)}
              </p>
            )}
          </div>
        )}

        {/* Пояснення з окремою кнопкою Volume2 */}
        {textDisplaySettings.showCommentary && (isEditing || commentary) && (
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

            {isEditing ? (
              <EnhancedInlineEditor
                content={edited.commentary}
                onChange={(html) =>
                  setEdited((p) => ({
                    ...p,
                    commentary: html,
                  }))
                }
                label="Редагувати пояснення"
                minHeight="200px"
                compact={true}
              />
            ) : (
              <div
                className="text-foreground text-justify purport first"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
                dangerouslySetInnerHTML={{ __html: applyDropCap(DOMPurify.sanitize(commentary || "")) }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
