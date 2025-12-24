// DualLanguageVerseCard.tsx - Side-by-side view як на vedabase.io
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAudio } from "@/contexts/ModernAudioContext";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { VerseNumberEditor } from "@/components/VerseNumberEditor";
import { DualLanguageText } from "@/components/DualLanguageText";
import { addSanskritLineBreaks } from "@/utils/text/lineBreaks";
import { stripParagraphTags } from "@/utils/import/normalizers";
import { splitIntoParagraphs, alignParagraphs } from "@/utils/paragraphSync";

interface DualLanguageVerseCardProps {
  verseId?: string;
  verseNumber: string;
  bookNameUa?: string;
  bookNameEn?: string;
  chapterTitleUa?: string;
  chapterTitleEn?: string;
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

  // Аудіо URLs
  audioUrl?: string;
  audioSanskrit?: string;
  audioTranslationUa?: string;
  audioTranslationEn?: string;
  audioCommentaryUa?: string;
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
  onVerseNumberUpdate?: () => void;
}

// Парсинг синонімів
function parseSynonyms(raw: string): Array<{
  term: string;
  meaning: string;
}> {
  if (!raw) return [];
  // Видаляємо HTML-теги перед парсингом
  const cleaned = raw.replace(/<[^>]*>/g, '').trim();
  const parts = cleaned
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

export const DualLanguageVerseCard = ({
  verseId,
  verseNumber,
  bookNameUa,
  bookNameEn,
  chapterTitleUa,
  chapterTitleEn,
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
  audioUrl,
  audioSanskrit,
  audioTranslationUa,
  audioTranslationEn,
  audioCommentaryUa,
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
  onVerseNumberUpdate,
}: DualLanguageVerseCardProps) => {
  const navigate = useNavigate();

  // ✅ Функція для відкриття глосарію - використовує navigate замість window.open для мобільних
  const openGlossary = useCallback((term: string) => {
    const url = `/glossary?search=${encodeURIComponent(term)}`;
    navigate(url);
  }, [navigate]);

  const { playTrack, currentTrack, togglePlay } = useAudio();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({
    sanskritUa: sanskritTextUa,
    sanskritEn: sanskritTextEn,
    transliterationUa,
    synonymsUa,
    translationUa,
    commentaryUa,
    transliterationEn,
    synonymsEn,
    translationEn,
    commentaryEn,
  });

  // Обробка санскриту для автоматичних розривів рядків
  const processedSanskritUa = useMemo(() => {
    return addSanskritLineBreaks(sanskritTextUa);
  }, [sanskritTextUa]);

  const processedSanskritEn = useMemo(() => {
    return addSanskritLineBreaks(sanskritTextEn);
  }, [sanskritTextEn]);

  // Парсинг синонімів
  const synonymsParsedUa = parseSynonyms(isEditing ? edited.synonymsUa : synonymsUa);
  const synonymsParsedEn = parseSynonyms(isEditing ? edited.synonymsEn : synonymsEn);

  // Функція для відтворення аудіо
  const playSection = (section: string, audioSrc?: string) => {
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
    });
  };

  const startEdit = () => {
    setEdited({
      sanskritUa: sanskritTextUa,
      sanskritEn: sanskritTextEn,
      transliterationUa,
      synonymsUa,
      translationUa,
      commentaryUa,
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
      onVerseUpdate(verseId, {
        sanskrit_ua: edited.sanskritUa,
        sanskrit_en: edited.sanskritEn,
        transliteration_ua: edited.transliterationUa,
        synonyms_ua: edited.synonymsUa,
        translation_ua: edited.translationUa,
        commentary_ua: edited.commentaryUa,
        transliteration_en: edited.transliterationEn,
        synonyms_en: edited.synonymsEn,
        translation_en: edited.translationEn,
        commentary_en: edited.commentaryEn,
      });
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto ${flowMode ? "" : "bg-card"}`}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight,
      }}
    >
      <div className={flowMode ? "py-6" : "p-6"}>
        {/* НАЗВА ГЛАВИ */}
        {(chapterTitleUa || chapterTitleEn) && (
          <div className="mb-8">
            <h1 className="text-center font-extrabold text-5xl">{chapterTitleUa || chapterTitleEn}</h1>
          </div>
        )}

        {/* НОМЕР ВІРША */}
        {showNumbers && (
          <div className="flex items-center justify-center mb-8">
            {isAdmin && verseId ? (
              <VerseNumberEditor verseId={verseId} currentNumber={verseNumber} onUpdate={onVerseNumberUpdate} />
            ) : (
              <span className="font-semibold text-5xl" style={{ color: "rgb(188, 115, 26)" }}>
                Вірш {verseNumber}
              </span>
            )}
          </div>
        )}

        {/* STICKY HEADER - Кнопки редагування */}
        {isAdmin && (
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {/* Індикатор складених віршів */}
                {is_composite && verse_count && start_verse && end_verse && (
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
                )}
              </div>

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
            </div>
          </div>
        )}

        {/* САНСКРИТ */}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritTextUa || sanskritTextEn) && (
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
              <div className="grid grid-cols-2 gap-8">
                <Textarea
                  value={edited.sanskritUa}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      sanskritUa: e.target.value,
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
            <div className="grid grid-cols-2 gap-8 text-center">
                <div
                  className="font-[Noto_Sans_Devanagari] whitespace-pre-line"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                >
                  {processedSanskritUa}
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
        {textDisplaySettings.showTransliteration && (isEditing || transliterationUa || transliterationEn) && (
          <div className="p-8">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-8">
                <Textarea
                  value={edited.transliterationUa}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      transliterationUa: e.target.value,
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
              <div className="grid grid-cols-2 gap-8">
                <div
                  className="italic whitespace-pre-line text-center"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                >
                  {isEditing ? edited.transliterationUa : transliterationUa}
                </div>
                <div
                  className="italic whitespace-pre-line text-center"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                >
                  {isEditing ? edited.transliterationEn : transliterationEn}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ПОСЛІВНИЙ ПЕРЕКЛАД */}
        {textDisplaySettings.showSynonyms && (isEditing || synonymsUa || synonymsEn) && (
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Ukrainian Synonyms */}
              <div>
                {(isEditing || synonymsUa) && (
                  <h3 className="text-xl font-bold mb-4 text-center">Послівний переклад</h3>
                )}
                {isEditing ? (
                  <Textarea
                    value={edited.synonymsUa}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        synonymsUa: e.target.value,
                      }))
                    }
                    className="text-base min-h-[200px]"
                  />
                ) : synonymsUa ? (
                  <p
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight,
                    }}
                    className="text-justify"
                  >
                    {synonymsParsedUa.map((syn, i) => {
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
                          {i < synonymsParsedUa.length - 1 && <span>; </span>}
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
                      lineHeight,
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
        {textDisplaySettings.showTranslation && (isEditing || translationUa || translationEn) && (
          <div className="p-8">
            {/* Заголовки - показуються тільки якщо є текст */}
            <div className="grid grid-cols-2 gap-8 mb-4">
              <div className="flex items-center justify-center gap-4">
                {(isEditing || translationUa) && (
                  <>
                    <h3 className="text-xl font-bold text-center">Переклад</h3>
                    <button
                      onClick={() => playSection("Переклад UA", audioTranslationUa)}
                      disabled={!audioTranslationUa && !audioUrl}
                      className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Слухати переклад"
                    >
                      <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-4">
                {(isEditing || translationEn) && (
                  <>
                    <h3 className="text-xl font-bold text-center">Translation</h3>
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
              <div className="grid grid-cols-2 gap-8">
                <Textarea
                  value={edited.translationUa}
                  onChange={(e) =>
                    setEdited((p) => ({
                      ...p,
                      translationUa: e.target.value,
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
              <DualLanguageText uaParagraphs={null} enParagraphs={null} uaText={translationUa} enText={translationEn} />
            )}
          </div>
        )}

        {/* ПОЯСНЕННЯ */}
        {textDisplaySettings.showCommentary && (isEditing || commentaryUa || commentaryEn) && (
          <div className="p-8">
            {/* Заголовки - показуються тільки якщо є текст */}
            <div className="grid grid-cols-2 gap-8 mb-4">
              <div className="flex items-center justify-center gap-4">
                {(isEditing || commentaryUa) && (
                  <>
                    <h3 className="text-xl font-bold text-center">Пояснення</h3>
                    <button
                      onClick={() => playSection("Пояснення UA", audioCommentaryUa)}
                      disabled={!audioCommentaryUa && !audioUrl}
                      className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Слухати пояснення"
                    >
                      <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-4">
                {(isEditing || commentaryEn) && (
                  <>
                    <h3 className="text-xl font-bold text-center">Purport</h3>
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
              <div className="grid grid-cols-2 gap-8">
                <EnhancedInlineEditor
                  content={edited.commentaryUa}
                  onChange={(html) =>
                    setEdited((p) => ({
                      ...p,
                      commentaryUa: html,
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
              <DualLanguageText uaParagraphs={null} enParagraphs={null} uaText={commentaryUa} enText={commentaryEn} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
