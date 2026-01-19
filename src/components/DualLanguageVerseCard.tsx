// DualLanguageVerseCard.tsx - Side-by-side view як на vedabase.io
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, X, Volume2, Star, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAudio } from "@/contexts/ModernAudioContext";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { VerseNumberEditor } from "@/components/VerseNumberEditor";
import { DualLanguageText } from "@/components/DualLanguageText";
import { addSanskritLineBreaks } from "@/utils/text/lineBreaks";
import { stripParagraphTags } from "@/utils/import/normalizers";
import { parseSynonymPairs, type SynonymPair } from "@/utils/glossaryParser";
import { addLearningVerse, isVerseInLearningList, LearningVerse } from "@/utils/learningVerses";
import { toast } from "sonner";
import DOMPurify from "dompurify";

// Перевіряє чи є реальний текстовий контент (не тільки HTML теги або пробіли)
const hasContent = (text: string | null | undefined): boolean => {
  if (!text) return false;
  const stripped = stripParagraphTags(text);
  return stripped.length > 0;
};

interface DualLanguageVerseCardProps {
  verseId?: string;
  verseNumber: string;
  bookName?: string;
  sanskritTextUk: string;
  sanskritTextEn: string;

  // Українська версія
  transliterationUk: string;
  synonymsUk: string;
  translationUk: string;
  commentaryUk: string;

  // Англійська версія
  transliterationEn: string;
  synonymsEn: string;
  translationEn: string;
  commentaryEn: string;

  // Аудіо URLs
  audioUrl?: string;
  audioSanskrit?: string;
  audioTranslationUk?: string;
  audioTranslationEn?: string;
  audioCommentaryUk?: string;
  audioCommentaryEn?: string;

  // Складені вірші
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
  onVerseUpdate?: (verseId: string, updates: any) => void;
  onVerseDelete?: (verseId: string) => void;
  onVerseNumberUpdate?: () => void;
  // Навігація між віршами
  onPrevVerse?: () => void;
  onNextVerse?: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
}

// openGlossary function moved inside component to use useNavigate hook

export const DualLanguageVerseCard = ({
  verseId,
  verseNumber,
  bookName,
  sanskritTextUk,
  sanskritTextEn,
  transliterationUk,
  synonymsUk,
  translationUk,
  commentaryUk,
  transliterationEn,
  synonymsEn,
  translationEn,
  commentaryEn,
  audioUrl,
  audioSanskrit,
  audioTranslationUk,
  audioTranslationEn,
  audioCommentaryUk,
  audioCommentaryEn,
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
  onVerseDelete,
  onVerseNumberUpdate,
  onPrevVerse,
  onNextVerse,
  isPrevDisabled,
  isNextDisabled,
  prevLabel,
  nextLabel,
}: DualLanguageVerseCardProps) => {
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

  const { playVerseWithChapterContext, currentTrack, togglePlay } = useAudio();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddedToLearning, setIsAddedToLearning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Видалення вірша
  const handleDelete = useCallback(() => {
    if (verseId && onVerseDelete) {
      onVerseDelete(verseId);
      setShowDeleteConfirm(false);
    }
  }, [verseId, onVerseDelete]);

  // Check if verse is already in learning list
  useEffect(() => {
    if (verseId) {
      setIsAddedToLearning(isVerseInLearningList(verseId));
    }
  }, [verseId]);

  // Add verse to learning list
  const handleAddToLearning = useCallback(() => {
    if (!verseId) {
      toast.error("Не вдалося додати вірш - відсутній ID");
      return;
    }

    const verse: LearningVerse = {
      verseId,
      verseNumber,
      bookName: bookName || "Невідома книга",
      bookSlug: undefined,
      chapterNumber: undefined,
      sanskritText: sanskritTextUk || sanskritTextEn || "",
      transliteration: transliterationUk || transliterationEn,
      translation: translationUk || translationEn || "",
      commentary: commentaryUk || commentaryEn,
      audioUrl,
      audioSanskrit,
      audioTranslation: audioTranslationUk || audioTranslationEn,
    };

    const added = addLearningVerse(verse);
    if (added) {
      setIsAddedToLearning(true);
      toast.success("Вірш додано до вивчення");
    } else {
      toast.info("Вірш вже у списку для вивчення");
    }
  }, [
    verseId, verseNumber, bookName,
    sanskritTextUk, sanskritTextEn, transliterationUk, transliterationEn,
    translationUk, translationEn, commentaryUk, commentaryEn,
    audioUrl, audioSanskrit, audioTranslationUk, audioTranslationEn
  ]);

  const [edited, setEdited] = useState({
    sanskritUk: sanskritTextUk,
    sanskritEn: sanskritTextEn,
    transliterationUk,
    synonymsUk,
    translationUk,
    commentaryUk,
    transliterationEn,
    synonymsEn,
    translationEn,
    commentaryEn,
  });

  // Обробка санскриту для автоматичних розривів рядків
  const processedSanskritUk = useMemo(() => {
    return addSanskritLineBreaks(sanskritTextUk);
  }, [sanskritTextUk]);

  const processedSanskritEn = useMemo(() => {
    return addSanskritLineBreaks(sanskritTextEn);
  }, [sanskritTextEn]);

  // Парсинг синонімів - єдиний парсер з glossaryParser.ts
  const synonymsParsedUk = parseSynonymPairs(isEditing ? edited.synonymsUk : synonymsUk);
  const synonymsParsedEn = parseSynonymPairs(isEditing ? edited.synonymsEn : synonymsEn);

  // Функція для відтворення аудіо
  const playSection = (section: string, audioSrc?: string) => {
    const src = audioSrc || audioUrl;
    if (!src) return;
    const trackId = `${verseNumber}-${section}`;
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
      verseId: verseId,
      verseNumber: verseNumber,
    });
  };

  const startEdit = () => {
    setEdited({
      sanskritUk: sanskritTextUk,
      sanskritEn: sanskritTextEn,
      transliterationUk,
      synonymsUk,
      translationUk,
      commentaryUk,
      transliterationEn,
      synonymsEn,
      translationEn,
      commentaryEn,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (onVerseUpdate && verseId) {
      // Only save fields that have actually changed to prevent cross-contamination
      const updates: Record<string, string> = {};

      if (edited.sanskritUk !== sanskritTextUk) updates.sanskrit_uk = edited.sanskritUk;
      if (edited.sanskritEn !== sanskritTextEn) updates.sanskrit_en = edited.sanskritEn;
      if (edited.transliterationUk !== transliterationUk) updates.transliteration_uk = edited.transliterationUk;
      if (edited.transliterationEn !== transliterationEn) updates.transliteration_en = edited.transliterationEn;
      if (edited.synonymsUk !== synonymsUk) updates.synonyms_uk = edited.synonymsUk;
      if (edited.synonymsEn !== synonymsEn) updates.synonyms_en = edited.synonymsEn;
      if (edited.translationUk !== translationUk) updates.translation_uk = edited.translationUk;
      if (edited.translationEn !== translationEn) updates.translation_en = edited.translationEn;
      if (edited.commentaryUk !== commentaryUk) updates.commentary_uk = edited.commentaryUk;
      if (edited.commentaryEn !== commentaryEn) updates.commentary_en = edited.commentaryEn;

      if (Object.keys(updates).length > 0) {
        onVerseUpdate(verseId, updates);
      }
      setIsEditing(false);
    }
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight,
      }}
    >
      <div className={flowMode ? "py-6" : "p-6"}>
        {/* НОМЕР ВІРША */}
        {showNumbers && (
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center justify-center gap-4">
              {isAdmin && verseId ? (
                <VerseNumberEditor verseId={verseId} currentNumber={verseNumber} onUpdate={onVerseNumberUpdate} />
              ) : (
                <span className="font-semibold text-5xl" style={{ color: "rgb(188, 115, 26)" }}>
                  ВІРШ {verseNumber}
                </span>
              )}
              {/* Кнопка "Додати до вивчення" */}
              {verseId && (
                <button
                  onClick={handleAddToLearning}
                  disabled={isAddedToLearning}
                  className="transition-colors disabled:cursor-default"
                  title={isAddedToLearning ? "Вже у списку для вивчення" : "Додати до вивчення"}
                >
                  <Star
                    className={`h-4 w-4 ${isAddedToLearning ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground hover:text-amber-400'}`}
                  />
                </button>
              )}
            </div>
            {bookName && (
              <span className="mt-2 text-sm text-muted-foreground">{bookName}</span>
            )}
          </div>
        )}

        {/* КНОПКА РЕДАГУВАННЯ - sticky при редагуванні */}
        {isAdmin && (
          <div className={`flex justify-center mb-4 ${isEditing ? 'sticky top-0 z-50 bg-background/95 backdrop-blur-sm py-3 -mx-6 px-6 border-b shadow-sm' : ''}`}>
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
                Складений вірш: {verse_count} {verse_count === 1 ? "вірш" : verse_count < 5 ? "вірші" : "віршів"}{" "}
                ({start_verse}-{end_verse})
              </span>
            </div>
          </div>
        )}

        {/* САНСКРИТ */}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritTextUk || sanskritTextEn) && (
          <div className="mb-10">
            {/* Аудіо кнопка для санскриту */}
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
              <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8">
                <Textarea
                  value={edited.sanskritUk}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      sanskritUk: e.target.value,
                    }))
                  }
                  className="font-[Noto_Sans_Devanagari] text-2xl text-center min-h-[200px]"
                />
                <Textarea
                  value={edited.sanskritEn}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      sanskritEn: e.target.value,
                    }))
                  }
                  className="font-[Noto_Sans_Devanagari] text-2xl text-center min-h-[200px]"
                />
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8 text-center">
                <div
                  className="font-[Noto_Sans_Devanagari] whitespace-pre-line"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                >
                  {processedSanskritUk}
                </div>
                <div
                  className="font-[Noto_Sans_Devanagari] whitespace-pre-line"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                >
                  {processedSanskritEn}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ТРАНСЛІТЕРАЦІЯ */}
        {textDisplaySettings.showTransliteration && (isEditing || transliterationUk || transliterationEn) && (
          <div className="p-8">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8">
                <Textarea
                  value={edited.transliterationUk}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      transliterationUk: e.target.value,
                    }))
                  }
                  className="italic text-lg text-center min-h-[150px]"
                />
                <Textarea
                  value={edited.transliterationEn}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      transliterationEn: e.target.value,
                    }))
                  }
                  className="italic text-lg text-center min-h-[150px]"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8">
                <div
                  className="italic text-center transliteration-lines"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(
                    (transliterationUk || '').includes('<span class="line">')
                      ? (transliterationUk || '')
                      : (transliterationUk || '').replace(/\n/g, '<br>'),
                    { ADD_TAGS: ['span', 'br'], ADD_ATTR: ['class'] }
                  ) }}
                />
                <div
                  className="italic text-center transliteration-lines"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(
                    (transliterationEn || '').includes('<span class="line">')
                      ? (transliterationEn || '')
                      : (transliterationEn || '').replace(/\n/g, '<br>'),
                    { ADD_TAGS: ['span', 'br'], ADD_ATTR: ['class'] }
                  ) }}
                />
              </div>
            )}
          </div>
        )}

        {/* ПОСЛІВНИЙ ПЕРЕКЛАД */}
        {textDisplaySettings.showSynonyms && (isEditing || synonymsUk || synonymsEn) && (
          <div className="p-8" data-synced-section="synonyms">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8">
              {/* Ukrainian Synonyms */}
              <div>
                {(isEditing || synonymsUk) && (
                  <h3 className="text-xl font-bold mb-4 text-center">Послівний переклад</h3>
                )}
                {isEditing ? (
                  <Textarea
                    value={edited.synonymsUk}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        synonymsUk: e.target.value,
                      }))
                    }
                    className="text-base min-h-[200px]"
                  />
                ) : synonymsUk ? (
                  <p
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.4,
                    }}
                    className="text-justify"
                  >
                    {synonymsParsedUk.map((syn, i) => {
                      const words = syn.term
                        .split(/\s+/)
                        .map((w) => w.trim())
                        .filter(Boolean);
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
                          {syn.meaning && <span> — {syn.meaning}</span>}
                          {i < synonymsParsedUk.length - 1 && <span>; </span>}
                        </span>
                      );
                    })}
                  </p>
                ) : null}
              </div>

              {/* English Synonyms */}
              <div>
                {(isEditing || synonymsEn) && <h3 className="text-xl font-bold mb-4 text-center">Synonyms</h3>}
                {isEditing ? (
                  <Textarea
                    value={edited.synonymsEn}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        synonymsEn: e.target.value,
                      }))
                    }
                    className="text-base min-h-[200px]"
                  />
                ) : synonymsEn ? (
                  <p
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.4,
                    }}
                    className="text-justify"
                  >
                    {synonymsParsedEn.map((syn, i) => {
                      const words = syn.term
                        .split(/\s+/)
                        .map((w) => w.trim())
                        .filter(Boolean);
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
                                title="Open in glossary"
                                className="cursor-pointer italic"
                                style={{ color: "#BC731B", WebkitTapHighlightColor: 'rgba(188, 115, 27, 0.3)' }}
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
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* ПЕРЕКЛАД */}
        {textDisplaySettings.showTranslation && (isEditing || translationUk || translationEn) && (
          <div className="p-8">
            {/* Заголовки - показуються тільки якщо є текст */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8 mb-4">
              <div className="flex items-center justify-center gap-1 sm:gap-4">
                {(isEditing || translationUk) && (
                  <>
                    <h3 className="text-sm sm:text-xl font-bold text-center">Переклад</h3>
                    <button
                      onClick={() => playSection("Переклад UA", audioTranslationUk)}
                      disabled={!audioTranslationUk && !audioUrl}
                      className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Слухати переклад"
                    >
                      <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-4">
                {(isEditing || translationEn) && (
                  <>
                    <h3 className="text-sm sm:text-xl font-bold text-center">Translation</h3>
                    <button
                      onClick={() => playSection("Translation EN", audioTranslationEn)}
                      disabled={!audioTranslationEn && !audioUrl}
                      className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Listen to translation"
                    >
                      <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8">
                <Textarea
                  value={edited.translationUk}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      translationUk: e.target.value,
                    }))
                  }
                  className="text-base min-h-[150px]"
                />
                <Textarea
                  value={edited.translationEn}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      translationEn: e.target.value,
                    }))
                  }
                  className="text-base min-h-[150px]"
                />
              </div>
            ) : (
              <DualLanguageText uaParagraphs={null} enParagraphs={null} uaText={translationUk} enText={translationEn} bold fontSize={fontSize} lineHeight={lineHeight} />
            )}
          </div>
        )}

        {/* ПОЯСНЕННЯ */}
        {textDisplaySettings.showCommentary && (isEditing || hasContent(commentaryUk) || hasContent(commentaryEn)) && (
          <div className="p-8">
            {/* Заголовки - показуються тільки якщо є текст */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8 mb-4">
              <div className="flex items-center justify-center gap-1 sm:gap-4">
                {(isEditing || hasContent(commentaryUk)) && (
                  <>
                    <h3 className="text-sm sm:text-xl font-bold text-center">Пояснення</h3>
                    <button
                      onClick={() => playSection("Пояснення UA", audioCommentaryUk)}
                      disabled={!audioCommentaryUk && !audioUrl}
                      className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Слухати пояснення"
                    >
                      <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-4">
                {(isEditing || hasContent(commentaryEn)) && (
                  <>
                    <h3 className="text-sm sm:text-xl font-bold text-center">Purport</h3>
                    <button
                      onClick={() => playSection("Purport EN", audioCommentaryEn)}
                      disabled={!audioCommentaryEn && !audioUrl}
                      className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Listen to purport"
                    >
                      <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8">
                <EnhancedInlineEditor
                  content={edited.commentaryUk}
                  onChange={(html) =>
                    setEdited((p) => ({
                      ...p,
                      commentaryUk: html,
                    }))
                  }
                  label="Редагувати коментар UA"
                />
                <EnhancedInlineEditor
                  content={edited.commentaryEn}
                  onChange={(html) =>
                    setEdited((p) => ({
                      ...p,
                      commentaryEn: html,
                    }))
                  }
                  label="Edit commentary EN"
                />
              </div>
            ) : (
              <DualLanguageText uaParagraphs={null} enParagraphs={null} uaText={commentaryUk} enText={commentaryEn} enableDropCap fontSize={fontSize} lineHeight={lineHeight} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
