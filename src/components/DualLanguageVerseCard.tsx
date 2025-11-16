// DualLanguageVerseCard.tsx
// Компонент для відображення віршів у двомовному режимі з вирівнюванням блоків по горизонталі
// Кожен тип блоку (sanskrit, transliteration, synonyms, translation, commentary)
// відображається в окремому рядку з двома колонками для синхронного читання

import { useState, useMemo } from "react";
import { Edit, Save, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAudio } from "@/contexts/ModernAudioContext";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
import { VerseNumberEditor } from "@/components/VerseNumberEditor";

/* =========================
   Типи пропсів
   ========================= */
interface DualLanguageVerseCardProps {
  verseId?: string;
  verseNumber: string;
  bookNameUa?: string;
  bookNameEn?: string;
  sanskritTextUa: string; // Окремий для української версії
  sanskritTextEn: string; // Окремий для англійської версії

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
  audioSynonymsUa?: string;
  audioSynonymsEn?: string;
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

/* =========================
   Допоміжні функції
   ========================= */

// Розбиття тексту на параграфи (НЕ ділити кожен <p> як окремий параграф)
function splitIntoParagraphs(text: string): string[] {
  if (!text) return [];

  // Нормалізуємо перенос рядків
  let html = text.replace(/\r\n/g, "\n");

  // Позначаємо явні розриви параграфів:
  // - подвійні (і більше) \n
  // - порожні HTML-параграфи: <p><br></p>, <p>&nbsp;</p>, <p> </p>
  const DELIM = "[[PARA_BREAK]]";
  html = html
    .replace(/\n{2,}/g, DELIM)
    .replace(/<p>\s*(?:<br\s*\/?>(?:\s*)?|&nbsp;|\u00A0|\s*)\s*<\/p>/gi, DELIM);

  // ВАЖЛИВО: не розбиваємо на кожному </p><p>, щоб цитати з кількох рядків (у трансліті всередині пояснення)
  // не вважались окремими параграфами кожен рядок.
  const parts = html
    .split(DELIM)
    .map(p => p.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts : [text.trim()];
}

// Парсинг синонімів
function parseSynonyms(raw: string): Array<{ term: string; meaning: string }> {
  if (!raw) return [];
  const parts = raw.split(/[;]+/g).map(p => p.trim()).filter(Boolean);
  const dashVariants = [" — ", " – ", " - ", "—", "–", "-", " —\n", " –\n", " -\n", "—\n", "–\n", "-\n"];
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
      pairs.push({ term: part, meaning: "" });
      continue;
    }
    const term = part.slice(0, idx).trim();
    const meaning = part.slice(idx + used.length).trim();
    if (term) pairs.push({ term, meaning });
  }
  return pairs;
}

function openGlossary(term: string) {
  const url = `/glossary?search=${encodeURIComponent(term)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* =========================
   Компонент для відображення синонімів
   ========================= */
const SynonymsBlock = ({ synonyms, isEditing, onEdit }: {
  synonyms: string;
  isEditing: boolean;
  onEdit?: (value: string) => void;
}) => {
  const synonymPairs = parseSynonyms(synonyms);

  if (isEditing) {
    return (
      <Textarea
        value={synonyms}
        onChange={e => onEdit?.(e.target.value)}
        className="min-h-[120px] synonyms-text"
      />
    );
  }

  return (
    <p className="synonyms-text text-foreground">
      {synonymPairs.length === 0 ? (
        <span className="text-muted-foreground">{synonyms}</span>
      ) : (
        synonymPairs.map((pair, i) => {
          const words = pair.term.split(/\s+/).map(w => w.trim()).filter(Boolean);
          return (
            <span key={i}>
              {words.map((w, wi) => (
                <span key={wi}>
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={() => openGlossary(w)}
                    onKeyDown={e => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
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
  );
};

/* =========================
   Основний компонент
   ========================= */
export const DualLanguageVerseCard = ({
  verseId,
  verseNumber,
  bookNameUa,
  bookNameEn,
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
  audioSynonymsUa,
  audioSynonymsEn,
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
    showCommentary: true
  },
  showNumbers = true,
  fontSize = 18,
  lineHeight = 1.6,
  flowMode = false,
  isAdmin = false,
  onVerseUpdate,
  onVerseNumberUpdate
}: DualLanguageVerseCardProps) => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();
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
    commentaryEn
  });

  // Розбиваємо commentary на параграфи
  const commentaryParagraphsUa = useMemo(() =>
    splitIntoParagraphs(isEditing ? edited.commentaryUa : commentaryUa),
    [commentaryUa, edited.commentaryUa, isEditing]
  );

  const commentaryParagraphsEn = useMemo(() =>
    splitIntoParagraphs(isEditing ? edited.commentaryEn : commentaryEn),
    [commentaryEn, edited.commentaryEn, isEditing]
  );

  // Синхронізація кількості параграфів (беремо максимум)
  const maxParagraphs = Math.max(commentaryParagraphsUa.length, commentaryParagraphsEn.length);

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
      src
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
      commentaryEn
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
        commentary_en: edited.commentaryEn
      });
      setIsEditing(false);
    }
  };

  return (
    <Card className={`verse-surface w-full animate-fade-in ${flowMode ? 'border-0 shadow-none' : 'border-gray-100 shadow-sm dark:border-border'} bg-card`}>
      <div className={flowMode ? "py-6" : "p-6"} style={{ fontSize: `${fontSize}px`, lineHeight }}>
        {/* STICKY HEADER - Верхня панель */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm pb-4 mb-4 -mx-6 px-6 -mt-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {showNumbers && (
                isAdmin && verseId ? (
                  <VerseNumberEditor
                    verseId={verseId}
                    currentNumber={verseNumber}
                    onUpdate={onVerseNumberUpdate}
                  />
                ) : (
                  <div className="flex h-8 items-center justify-center rounded-full bg-primary/10 px-3">
                    <span className="text-sm font-semibold text-primary">Вірш {verseNumber}</span>
                  </div>
                )
              )}

              {/* Індикатор складених віршів */}
              {isAdmin && is_composite && verse_count && start_verse && end_verse && (
                <div className="flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    Складений вірш: {verse_count} {verse_count === 1 ? 'вірш' : verse_count < 5 ? 'вірші' : 'віршів'} ({start_verse}-{end_verse})
                  </span>
                </div>
              )}
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

        {/* САНСКРИТ - два стовпці для кожної мови */}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritTextUa || sanskritTextEn) && (
          <div className="mb-10">
            <div className="grid grid-cols-2 gap-6">
              {/* UA */}
              <div>
                <div className="mb-4 flex justify-center">
                  <button
                    onClick={() => playSection("Санскрит UA", audioSanskrit)}
                    disabled={!audioSanskrit && !audioUrl}
                    className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Слухати санскрит UA"
                  >
                    <Volume2 className="h-7 w-7 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                {isEditing ? (
                  <Textarea
                    value={edited.sanskritUa}
                    onChange={e => setEdited(p => ({ ...p, sanskritUa: e.target.value }))}
                    className="min-h-[100px] text-center sanskrit-text"
                    style={{ fontSize: `${Math.round(fontSize * 1.5)}px` }}
                  />
                ) : (
                  <p className="whitespace-pre-line text-center sanskrit-text" style={{ fontSize: `${Math.round(fontSize * 1.5)}px` }}>
                    {sanskritTextUa}
                  </p>
                )}
              </div>

              {/* EN */}
              <div>
                <div className="mb-4 flex justify-center">
                  <button
                    onClick={() => playSection("Sanskrit EN", audioSanskrit)}
                    disabled={!audioSanskrit && !audioUrl}
                    className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Listen to Sanskrit EN"
                  >
                    <Volume2 className="h-7 w-7 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                {isEditing ? (
                  <Textarea
                    value={edited.sanskritEn}
                    onChange={e => setEdited(p => ({ ...p, sanskritEn: e.target.value }))}
                    className="min-h-[100px] text-center sanskrit-text"
                    style={{ fontSize: `${Math.round(fontSize * 1.5)}px` }}
                  />
                ) : (
                  <p className="whitespace-pre-line text-center sanskrit-text" style={{ fontSize: `${Math.round(fontSize * 1.5)}px` }}>
                    {sanskritTextEn}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ТРАНСЛІТЕРАЦІЯ - два стовпці */}
        {textDisplaySettings.showTransliteration && (isEditing || transliterationUa || transliterationEn) && (
          <div className="mb-8 pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* UA */}
              <div>
                {isEditing ? (
                  <Textarea
                    value={edited.transliterationUa}
                    onChange={e => setEdited(p => ({ ...p, transliterationUa: e.target.value }))}
                    className="min-h-[80px] text-center iast-text text-muted-foreground"
                    style={{ fontSize: `${Math.round(fontSize * 1.1)}px` }}
                  />
                ) : (
                  <div className="space-y-1 text-center">
                    {(transliterationUa || "").split("\n").map((line, idx) => (
                      <p key={idx} className="iast-text text-muted-foreground" style={{ fontSize: `${Math.round(fontSize * 1.1)}px` }}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* EN */}
              <div>
                {isEditing ? (
                  <Textarea
                    value={edited.transliterationEn}
                    onChange={e => setEdited(p => ({ ...p, transliterationEn: e.target.value }))}
                    className="min-h-[80px] text-center iast-text text-muted-foreground"
                    style={{ fontSize: `${Math.round(fontSize * 1.1)}px` }}
                  />
                ) : (
                  <div className="space-y-1 text-center">
                    {(transliterationEn || "").split("\n").map((line, idx) => (
                      <p key={idx} className="iast-text text-muted-foreground" style={{ fontSize: `${Math.round(fontSize * 1.1)}px` }}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ПОСЛІВНИЙ ПЕРЕКЛАД - два стовпці */}
        {textDisplaySettings.showSynonyms && (isEditing || synonymsUa || synonymsEn) && (
          <div className="mb-8 pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* UA */}
              <div>
                <div className="section-header flex items-center justify-center gap-4">
                  <h4 className="text-foreground">Послівний переклад</h4>
                  <button
                    onClick={() => playSection("Послівний переклад UA", audioSynonymsUa)}
                    disabled={!audioSynonymsUa && !audioUrl}
                    className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Слухати послівний переклад UA"
                  >
                    <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <SynonymsBlock
                  synonyms={isEditing ? edited.synonymsUa : synonymsUa}
                  isEditing={isEditing}
                  onEdit={value => setEdited(p => ({ ...p, synonymsUa: value }))}
                />
              </div>

              {/* EN */}
              <div>
                <div className="section-header flex items-center justify-center gap-4">
                  <h4 className="text-foreground">Synonyms</h4>
                  <button
                    onClick={() => playSection("Synonyms EN", audioSynonymsEn)}
                    disabled={!audioSynonymsEn && !audioUrl}
                    className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Listen to synonyms EN"
                  >
                    <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <SynonymsBlock
                  synonyms={isEditing ? edited.synonymsEn : synonymsEn}
                  isEditing={isEditing}
                  onEdit={value => setEdited(p => ({ ...p, synonymsEn: value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* ЛІТЕРАТУРНИЙ ПЕРЕКЛАД - два стовпці */}
        {textDisplaySettings.showTranslation && (isEditing || translationUa || translationEn) && (
          <div className="mb-8 pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* UA */}
              <div>
                <div className="section-header flex items-center justify-center gap-4">
                  <h4 className="text-foreground">Літературний переклад</h4>
                  <button
                    onClick={() => playSection("Переклад UA", audioTranslationUa)}
                    disabled={!audioTranslationUa && !audioUrl}
                    className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Слухати переклад UA"
                  >
                    <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                {isEditing ? (
                  <Textarea
                    value={edited.translationUa}
                    onChange={e => setEdited(p => ({ ...p, translationUa: e.target.value }))}
                    className="min-h-[100px] prose-reader font-semibold"
                  />
                ) : (
                  <p className="prose-reader text-foreground font-semibold">{translationUa}</p>
                )}
              </div>

              {/* EN */}
              <div>
                <div className="section-header flex items-center justify-center gap-4">
                  <h4 className="text-foreground">Translation</h4>
                  <button
                    onClick={() => playSection("Translation EN", audioTranslationEn)}
                    disabled={!audioTranslationEn && !audioUrl}
                    className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Listen to translation EN"
                  >
                    <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                {isEditing ? (
                  <Textarea
                    value={edited.translationEn}
                    onChange={e => setEdited(p => ({ ...p, translationEn: e.target.value }))}
                    className="min-h-[100px] prose-reader font-semibold"
                  />
                ) : (
                  <p className="prose-reader text-foreground font-semibold">{translationEn}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ПОЯСНЕННЯ - два стовпці, розбитий на параграфи */}
        {textDisplaySettings.showCommentary && (isEditing || commentaryUa || commentaryEn) && (
          <div className="pt-6">
            {/* Заголовки з кнопками аудіо */}
            <div className="section-header grid grid-cols-2 gap-6">
              {/* UA */}
              <div className="flex items-center justify-center gap-4">
                <h4 className="text-foreground">Пояснення</h4>
                <button
                  onClick={() => playSection("Пояснення UA", audioCommentaryUa)}
                  disabled={!audioCommentaryUa && !audioUrl}
                  className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Слухати пояснення UA"
                >
                  <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {/* EN */}
              <div className="flex items-center justify-center gap-4">
                <h4 className="text-foreground">Purport</h4>
                <button
                  onClick={() => playSection("Purport EN", audioCommentaryEn)}
                  disabled={!audioCommentaryEn && !audioUrl}
                  className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Listen to purport EN"
                >
                  <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>

            {/* Параграфи синхронізовані */}
            {isEditing ? (
              <div className="grid grid-cols-2 gap-6">
                <InlineTiptapEditor
                  content={edited.commentaryUa}
                  onChange={html => setEdited(p => ({ ...p, commentaryUa: html }))}
                  label="Редагувати коментар UA"
                />
                <InlineTiptapEditor
                  content={edited.commentaryEn}
                  onChange={html => setEdited(p => ({ ...p, commentaryEn: html }))}
                  label="Edit commentary EN"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: maxParagraphs }).map((_, index) => (
                  <div key={index} className="grid grid-cols-2 gap-6 pb-4">
                    {/* UA параграф */}
                    <div className="commentary-text">
                      {commentaryParagraphsUa[index] ? (
                        <TiptapRenderer content={commentaryParagraphsUa[index]} />
                      ) : (
                        <p className="text-muted-foreground italic text-sm">Немає тексту</p>
                      )}
                    </div>

                    {/* EN параграф */}
                    <div className="commentary-text">
                      {commentaryParagraphsEn[index] ? (
                        <TiptapRenderer content={commentaryParagraphsEn[index]} />
                      ) : (
                        <p className="text-muted-foreground italic text-sm">No text</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
