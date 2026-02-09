// VerseCard.tsx — оновлена версія з окремими Volume2 кнопками для кожної секції
// Відповідає PDF шаблону: кожен блок (Санскрит, Послівний, Переклад, Пояснення) має свою кнопку Volume2
// + VerseNumberEditor для мануального редагування номерів віршів адміністратором
// + STICKY HEADER для верхньої панелі
// + Inline редактор для коментарів з автозбереженням

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, X, Volume2, GraduationCap, Play, Pause, ChevronLeft, ChevronRight, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookPrefix } from "@/utils/bookPrefixes";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { useAudio } from "@/contexts/ModernAudioContext";
import { VerseNumberEditor } from "@/components/VerseNumberEditor";
import { addLearningWord, isWordInLearningList } from "@/utils/learningWords";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { stripParagraphTags, sanitizeForRender } from "@/utils/import/normalizers";
import { addSanskritLineBreaks } from "@/utils/text/lineBreaks";
import { parseSynonymPairs } from "@/utils/glossaryParser";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatExplanationParagraphs } from "@/utils/text/dropCap";
// SyncedText removed - audio sync highlighting was poorly implemented

// Перевіряє чи є реальний текстовий контент (не тільки HTML теги або пробіли)
const hasContent = (text: string | null | undefined): boolean => {
  if (!text) return false;
  const stripped = stripParagraphTags(text);
  return stripped.length > 0;
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
  onVerseDelete?: (verseId: string) => void;
  onVerseNumberUpdate?: () => void; // коллбек після зміни номера
  language?: "uk" | "en"; // ✅ НОВЕ: мова інтерфейсу
  // Навігація між віршами
  onPrevVerse?: () => void;
  onNextVerse?: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  bookSlug?: string; // для визначення префіксу (ШБ, БҐ, etc.)
  isFamous?: boolean; // чи є цей вірш знаменитою шлокою
}

/* getBookPrefix imported from @/utils/bookPrefixes */

/* =========================
   Компонент
   ========================= */
export const VerseCard = ({
  verseId,
  verseNumber,
  bookName,
  bookSlug,
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
  onVerseDelete,
  onVerseNumberUpdate,
  language = "uk",
  onPrevVerse,
  onNextVerse,
  isPrevDisabled,
  isNextDisabled,
  prevLabel,
  nextLabel,
  isFamous = false,
}: VerseCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    uk: {
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
  const labels = blockLabels[language] || blockLabels.uk;
  const { playVerseWithChapterContext, currentTrack, togglePlay, isPlaying } = useAudio();

  // ✅ Collapsible sections state for mobile (persisted in localStorage)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('vv_collapsed_sections');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Toggle section collapse (mobile only)
  const toggleSectionCollapse = useCallback((section: string) => {
    setCollapsedSections(prev => {
      const newState = { ...prev, [section]: !prev[section] };
      try {
        localStorage.setItem('vv_collapsed_sections', JSON.stringify(newState));
      } catch {}
      return newState;
    });
  }, []);

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

  // Audio sync block highlighting removed - it was poorly implemented
  // and didn't match the functional minimalism concept

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Видалення вірша
  const handleDelete = useCallback(() => {
    if (verseId && onVerseDelete) {
      onVerseDelete(verseId);
      setShowDeleteConfirm(false);
    }
  }, [verseId, onVerseDelete]);

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

    if (!src || !src.trim()) {
      return;
    }
    const trackId = `${verseNumber}-${section}`;

    // Якщо вже грає цей трек — тумблер
    if (currentTrack?.id === trackId || currentTrack?.verseId === verseId) {
      togglePlay();
      return;
    }
    // Use playVerseWithChapterContext to load all chapter verses with audio
    playVerseWithChapterContext({
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

  // Додаткові класи для знаменитих шлок
  const famousVerseClasses = isFamous
    ? 'border-l-4 border-primary/60 pl-4 bg-primary/5'
    : '';

  return (
    <div
      ref={verseRef}
      className={`verse-surface w-full animate-fade-in ${contourClasses} ${famousVerseClasses}`}
    >
      <div
        className="pb-6"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight,
        }}
      >
        {/* НОМЕР ВІРША - відцентрований */}
        {showNumbers && (
          <div className="flex flex-col items-center justify-center gap-2 mb-4 verse-number-block">
            {/* Mobile: кнопка tap-to-play для всіх користувачів */}
            <button
              onClick={() => (audioUrl || audioSanskrit || audioTranslation || audioCommentary) && playSection("Вірш", audioUrl || audioSanskrit || audioTranslation || audioCommentary)}
              className={`verse-number-clean md:hidden font-bold text-2xl whitespace-nowrap transition-colors ${isNowPlaying ? 'text-primary' : 'text-foreground'}`}
              disabled={!audioUrl && !audioSanskrit && !audioTranslation && !audioCommentary}
            >
              {getBookPrefix(bookSlug, language)} {verseNumber}
            </button>
            {/* Desktop: VerseNumberEditor для адмінів, звичайний span для інших */}
            {isAdmin && verseId ? (
              <div className="hidden md:block">
                <VerseNumberEditor verseId={verseId} currentNumber={verseNumber} onUpdate={onVerseNumberUpdate} bookSlug={bookSlug} />
              </div>
            ) : (
              <span className="hidden md:inline font-semibold text-5xl whitespace-nowrap" style={{ color: "rgb(188, 115, 26)" }}>
                {getBookPrefix(bookSlug, language)} {verseNumber}
              </span>
            )}
            {/* Назва глави - відцентрована під номером вірша (hidden on mobile) */}
            {bookName && (
              <span className="hidden md:block text-sm text-muted-foreground text-center verse-book-name">{bookName}</span>
            )}

            {/* Tap-to-jump: кнопка відтворення всього вірша (hidden on mobile) */}
            {(audioUrl || audioSanskrit || audioTranslation || audioCommentary) && (
              <button
                onClick={() => playSection("Вірш", audioUrl || audioSanskrit || audioTranslation || audioCommentary)}
                className={`
                  verse-play-btn mt-2 hidden md:flex items-center gap-2 px-4 py-2 rounded-full
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
                    {/* Анімована звукова хвилька */}
                    <div className="audio-wave-bars">
                      <div className="audio-wave-bar" />
                      <div className="audio-wave-bar" />
                      <div className="audio-wave-bar" />
                      <div className="audio-wave-bar" />
                      <div className="audio-wave-bar" />
                    </div>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span className="text-sm font-medium">{language === 'uk' ? 'Слухати' : 'Listen'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* КНОПКА РЕДАГУВАННЯ - по центру під номером вірша (hidden on mobile) */}
        {isAdmin && (
          <div className="hidden md:flex justify-center mb-4">
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
            ) : showDeleteConfirm ? (
              <div className="flex items-center gap-2 bg-destructive/10 rounded-lg px-4 py-2">
                <span className="text-sm text-destructive">Видалити цей вірш?</span>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Так, видалити
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Скасувати
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={startEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редагувати
                </Button>
                {onVerseDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Видалити
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* НАВІГАЦІЯ МІЖ ВІРШАМИ + АУДІО - приховано на мобільних (є свайп) */}
        {onPrevVerse && onNextVerse && !isMobile && (
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onPrevVerse} disabled={isPrevDisabled}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {prevLabel}
            </Button>
            {/* Аудіо кнопка для санскриту - по центру */}
            <button
              onClick={() => playSection("Санскрит", audioSanskrit)}
              disabled={!audioSanskrit && !audioUrl}
              className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Слухати санскрит"
            >
              <Volume2 className="h-7 w-7 text-muted-foreground hover:text-foreground" />
            </button>
            <Button variant="ghost" onClick={onNextVerse} disabled={isNextDisabled}>
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

        {/* Деванагарі */}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritText) && (
          <div className="mb-3" data-synced-section="sanskrit">
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
          <div className="mb-4" data-synced-section="transliteration">
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
        {textDisplaySettings.showSynonyms && (isEditing || hasContent(synonyms)) && (
          <div className="mb-6" data-synced-section="synonyms">
            {/* Mobile: центрована стрілка для collapse/expand */}
            {isMobile && (
              <button
                onClick={() => toggleSectionCollapse('synonyms')}
                className="flex items-center justify-center w-full py-1 text-muted-foreground active:bg-muted/30 rounded-lg transition-colors"
              >
                {collapsedSections.synonyms ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Desktop: Заголовок (без кнопки аудіо - для послівного перекладу не потрібна) */}
            <div className="section-header hidden md:flex items-center justify-center mb-4">
              <h4 className="text-foreground">{labels.synonyms}</h4>
            </div>

            {/* Content - collapsible on mobile */}
            {(!isMobile || !collapsedSections.synonyms) && (
              <>
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
                    className="text-justify synonyms-text"
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
                            {/* Learning button - hidden on mobile via CSS for clean reading */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToLearning(pair.term, pair.meaning || "");
                              }}
                              title="Додати до вивчення"
                              aria-label={`Додати "${pair.term}" до вивчення`}
                              className="hidden md:inline-flex items-center justify-center ml-1 p-1 rounded-md hover:bg-primary/10 transition-colors group text-sm"
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
              </>
            )}
          </div>
        )}

        {/* Літературний переклад з окремою кнопкою Volume2 */}
        {textDisplaySettings.showTranslation && (isEditing || hasContent(translation)) && (
          <div className="mb-6" data-synced-section="translation">
            {/* Заголовок + кнопка Volume2 (hidden on mobile via CSS for clean reading) */}
            <div className="section-header hidden md:flex items-center justify-center gap-4 mb-4">
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
        {textDisplaySettings.showCommentary && (isEditing || hasContent(commentary)) && (
          <div data-synced-section="commentary">
            {/* Заголовок + кнопка Volume2 (hidden on mobile via CSS for clean reading) */}
            <div className="section-header hidden md:flex items-center justify-center gap-4 mb-4">
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
                className="text-foreground text-justify"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
                dangerouslySetInnerHTML={{ __html: formatExplanationParagraphs(sanitizeForRender(commentary || "")) }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
