// VerseCard.tsx — оновлена версія з окремими Volume2 кнопками для кожної секції
// Відповідає PDF шаблону: кожен блок (Санскрит, Послівний, Переклад, Пояснення) має свою кнопку Volume2
// + VerseNumberEditor для мануального редагування номерів віршів адміністратором
// + STICKY HEADER для верхньої панелі
//
// ✅ ВИПРАВЛЕНО: Замінено text-3xl, text-4xl, text-[21px], text-[23px] на відносний text-[1.22em],
// щоб шрифти коректно масштабувалися з VedaReader.
// ✅ ВИПРАВЛЕНО (синтаксис): Прибрано порожні рядки після ':' у тернарних операторах.

import { useState } from "react";
import { Play, Pause, Edit, Save, X, Volume2 } from "lucide-react";
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
  onVerseNumberUpdate?: () => void; // коллбек після зміни номера
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
  onVerseNumberUpdate,
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
  const isThisPlaying = currentTrack?.id === verseNumber && isPlaying; // Функція для відтворення конкретної секції

  const playSection = (section: string, audioSrc?: string) => {
    const src = audioSrc || audioUrl;
    if (!src) return;
    const trackId = `${verseNumber}-${section}`; // Якщо вже грає цей трек — тумблер

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
           {" "}
      <div className="p-6">
                {/* 🆕 STICKY HEADER - Верхня панель: номер/книга + кнопка редагування */}       {" "}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border pb-4 mb-4 -mx-6 px-6 -mt-6 pt-6">
                   {" "}
          <div className="flex items-center justify-between">
                       {" "}
            <div className="flex flex-wrap items-center gap-3">
                            {/* Якщо адмін — показуємо VerseNumberEditor */}             {" "}
              {isAdmin && verseId ? (
                <VerseNumberEditor verseId={verseId} currentNumber={verseNumber} onUpdate={onVerseNumberUpdate} />
              ) : (
                <div className="flex h-8 items-center justify-center rounded-full bg-primary/10 px-3">
                                    <span className="text-sm font-semibold text-primary">Вірш {verseNumber}</span>     
                           {" "}
                </div>
              )}
                           {" "}
              {bookName && <span className="rounded bg-muted px-2 py-1 text-sm text-muted-foreground">{bookName}</span>}
                         {" "}
            </div>
                       {" "}
            {isAdmin && (
              <div className="flex gap-2">
                               {" "}
                {isEditing ? (
                  <>
                                       {" "}
                    <Button variant="default" size="sm" onClick={saveEdit}>
                                            <Save className="mr-2 h-4 w-4" />                      Зберегти            
                             {" "}
                    </Button>
                                       {" "}
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                                            <X className="mr-2 h-4 w-4" />                      Скасувати              
                           {" "}
                    </Button>
                                     {" "}
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={startEdit}>
                                        <Edit className="mr-2 h-4 w-4" />                    Редагувати                
                     {" "}
                  </Button>
                )}
                             {" "}
              </div>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Деванагарі з окремою кнопкою Volume2 */}       {" "}
        {textDisplaySettings.showSanskrit && (isEditing || sanskritText) && (
          <div className="mb-10">
                        {/* Кнопка Volume2 для Санскриту */}           {" "}
            <div className="mb-4 flex justify-center">
                           {" "}
              <button
                onClick={() => playSection("Санскрит", audioSanskrit)}
                disabled={!audioSanskrit && !audioUrl}
                className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Слухати санскрит"
              >
                                <Volume2 className="h-7 w-7 text-muted-foreground hover:text-foreground" />           
                 {" "}
              </button>
                         {" "}
            </div>
                       {" "}
            {isEditing ? (
              <Textarea
                value={edited.sanskrit}
                onChange={(e) =>
                  setEdited((p) => ({
                    ...p,
                    sanskrit: e.target.value,
                  }))
                }
                className="min-h-[100px] text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground"
              />
            ) : (
              <p className="whitespace-pre-line text-center font-sanskrit text-[1.78em] leading-[1.8] text-gray-700 dark:text-foreground">
                                {sanskritText}             {" "}
              </p>
            )}
                     {" "}
          </div>
        )}
                {/* Транслітерація */}       {" "}
        {textDisplaySettings.showTransliteration && (isEditing || transliteration) && (
          <div className="mb-8">
                       {" "}
            {isEditing ? (
              <Textarea
                value={edited.transliteration}
                onChange={(e) =>
                  setEdited((p) => ({
                    ...p,
                    transliteration: e.target.value,
                  }))
                }
                className="min-h-[80px] text-center font-sanskrit-italic italic text-[1.22em] text-gray-500 dark:text-muted-foreground"
              />
            ) : (
              <div className="space-y-1 text-center">
                                {/* ✅ ВИПРАВЛЕНО: text-4xl замінено на text-[1.22em] */}               {" "}
                {transliteration.split("\n").map((line, idx) => (
                  <p
                    key={idx}
                    className="font-sanskrit-italic italic leading-relaxed text-gray-500 dark:text-muted-foreground text-[1.22em]"
                  >
                                        {line}                 {" "}
                  </p>
                ))}
                             {" "}
              </div>
            )}
                     {" "}
          </div>
        )}
                {/* Послівний переклад з окремою кнопкою Volume2 */}       {" "}
        {textDisplaySettings.showSynonyms && (isEditing || synonyms) && (
          <div className="mb-6 border-t border-border pt-6">
                        {/* Заголовок + кнопка Volume2 */}           {" "}
            <div className="mb-4 flex items-center justify-center gap-4">
                            <h4 className="text-[1.17em] font-bold text-foreground">Послівний переклад</h4>             {" "}
              <button
                onClick={() => playSection("Послівний переклад", audioSynonyms)}
                disabled={!audioSynonyms && !audioUrl}
                className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Слухати послівний переклад"
              >
                                <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />           
                 {" "}
              </button>
                         {" "}
            </div>
                        {/* ✅ ВИПРАВЛЕНО: text-[21px] замінено на text-[1.22em] */}           {" "}
            {isEditing ? (
              <Textarea
                value={edited.synonyms}
                onChange={(e) =>
                  setEdited((p) => ({
                    ...p,
                    synonyms: e.target.value,
                  }))
                }
                className="min-h-[120px] text-[1.22em]"
              />
            ) : (
              <p className="leading-relaxed text-foreground text-[1.22em]">
                                {/* ✅ ВИПРАВЛЕНО: text-3xl замінено на text-[1.22em] */}               {" "}
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
                                               {" "}
                        {words.map((w, wi) => (
                          <span key={wi}>
                                                       {" "}
                            <span
                              role="link"
                              tabIndex={0}
                              onClick={() => openGlossary(w)}
                              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
                              className="cursor-pointer font-sanskrit-italic italic text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-primary/50"
                              title="Відкрити у глосарії"
                            >
                                                            {w}                           {" "}
                            </span>
                                                        {wi < words.length - 1 && " "}                         {" "}
                          </span>
                        ))}
                                                {pair.meaning && <span> — {pair.meaning}</span>}                       {" "}
                        {i < synonymPairs.length - 1 && <span>; </span>}                     {" "}
                      </span>
                    );
                  })
                )}
                             {" "}
              </p>
            )}
                     {" "}
          </div>
        )}
                {/* Літературний переклад з окремою кнопкою Volume2 */}       {" "}
        {textDisplaySettings.showTranslation && (isEditing || translation) && (
          <div className="mb-6 border-t border-border pt-6">
                        {/* Заголовок + кнопка Volume2 */}           {" "}
            <div className="mb-4 flex items-center justify-center gap-4">
                            <h4 className="text-[1.17em] font-bold text-foreground">Літературний переклад</h4>         
                 {" "}
              <button
                onClick={() => playSection("Літературний переклад", audioTranslation)}
                disabled={!audioTranslation && !audioUrl}
                className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Слухати переклад"
              >
                                <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />           
                 {" "}
              </button>
                         {" "}
            </div>
                        {/* ✅ ВИПРАВЛЕНО: text-[23px] замінено на text-[1.22em] */}           {" "}
            {isEditing ? (
              <Textarea
                value={edited.translation}
                onChange={(e) =>
                  setEdited((p) => ({
                    ...p,
                    translation: e.target.value,
                  }))
                }
                className="min-h-[100px] text-[1.22em] font-medium"
              />
            ) : (
              <p className="font-medium leading-relaxed text-foreground text-[1.22em]">
                              {/* ✅ ВИПРАВЛЕНО: text-3xl замінено на text-[1.22em] */}              {translation}     
                     {" "}
              </p>
            )}
                     {" "}
          </div>
        )}
                {/* Пояснення з окремою кнопкою Volume2 */}       {" "}
        {textDisplaySettings.showCommentary && (isEditing || commentary) && (
          <div className="border-t border-border pt-6">
                        {/* Заголовок + кнопка Volume2 */}           {" "}
            <div className="mb-4 flex items-center justify-center gap-4">
                            <h4 className="text-[1.17em] text-foreground font-extrabold">Purport</h4>             {" "}
              <button
                onClick={() => playSection("Пояснення", audioCommentary)}
                disabled={!audioCommentary && !audioUrl}
                className="rounded-full p-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Слухати пояснення"
              >
                                <Volume2 className="h-6 w-6 text-muted-foreground hover:text-foreground" />           
                 {" "}
              </button>
                         {" "}
            </div>
                       {" "}
            {isEditing ? (
              <InlineTiptapEditor
                content={edited.commentary}
                onChange={(html) =>
                  setEdited((p) => ({
                    ...p,
                    commentary: html,
                  }))
                }
                label="Редагувати коментар"
              />
            ) : (
              <TiptapRenderer content={commentary || ""} className="text-[1.22em] leading-relaxed" />
            )}
                     {" "}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </Card>
  );
};
