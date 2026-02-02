// BlogPoetryContent.tsx - компонент для відображення блог-постів у режимі поезії
// Схожий на VerseCard, але для блог-постів

import { Volume2 } from "lucide-react";
import { TiptapRenderer } from "./TiptapRenderer";
import { Button } from "@/components/ui/button";

interface BlogPoetryContentProps {
  sanskrit?: string | null;
  transliteration?: string | null;
  synonyms?: string | null;
  poetryTranslation?: string | null;
  commentary?: string | null;
  audioSanskritUrl?: string | null;
  audioTransliterationUrl?: string | null;
  audioPoetryTranslationUrl?: string | null;
  audioCommentaryUrl?: string | null;
  displayBlocks?: {
    sanskrit?: boolean;
    transliteration?: boolean;
    synonyms?: boolean;
    translation?: boolean;
    commentary?: boolean;
  };
  language: "uk" | "en";
}

// Функція для відкриття глосарію з пошуком по терміну
function openGlossary(term: string) {
  const url = `/glossary?search=${encodeURIComponent(term)}`;
  window.open(url, "_blank");
}

export function BlogPoetryContent({
  sanskrit,
  transliteration,
  synonyms,
  poetryTranslation,
  commentary,
  audioSanskritUrl,
  audioTransliterationUrl,
  audioPoetryTranslationUrl,
  audioCommentaryUrl,
  displayBlocks = {},
  language,
}: BlogPoetryContentProps) {
  const labels = {
    uk: {
      synonyms: "Послівний переклад",
      translation: "Літературний переклад",
      commentary: "Пояснення",
    },
    en: {
      synonyms: "Word-by-word translation",
      translation: "Literary translation",
      commentary: "Purport",
    },
  };

  // Парсинг послівного перекладу (формат: "слово1 — значення1; слово2 — значення2")
  const parseSynonyms = (text: string) => {
    return text
      .split(";")
      .map((pair) => pair.trim())
      .filter((pair) => pair.length > 0)
      .map((pair) => {
        const [term, meaning] = pair.split("—").map((s) => s.trim());
        return { term, meaning };
      });
  };

  const showSanskrit = displayBlocks.sanskrit !== false && sanskrit;
  const showTransliteration = displayBlocks.transliteration !== false && transliteration;
  const showSynonyms = displayBlocks.synonyms !== false && synonyms;
  const showTranslation = displayBlocks.translation !== false && poetryTranslation;
  const showCommentary = displayBlocks.commentary !== false && commentary;

  return (
    <div className="space-y-6">
      {/* Sanskrit/Bengali Original */}
      {showSanskrit && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {language === "uk" ? "Оригінал" : "Original"}
            </h3>
            {audioSanskritUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const audio = new Audio(audioSanskritUrl);
                  audio.play();
                }}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="blog-sanskrit whitespace-pre-wrap">{sanskrit}</div>
        </div>
      )}

      {/* Transliteration */}
      {showTransliteration && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {language === "uk" ? "Транслітерація" : "Transliteration"}
            </h3>
            {audioTransliterationUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const audio = new Audio(audioTransliterationUrl);
                  audio.play();
                }}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="blog-translit whitespace-pre-wrap">{transliteration}</div>
        </div>
      )}

      {/* Word-by-word Translation (Synonyms) - з посиланнями на глосарій */}
      {showSynonyms && synonyms && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
            {labels[language].synonyms}
          </h3>
          <div className="blog-synonyms">
            {parseSynonyms(synonyms).map((pair, i) => {
              // Розбиваємо термін на окремі слова для посилань на глосарій
              const words = pair.term.split(/\s+/).map((w) => w.trim()).filter(Boolean);

              return (
                <span key={i}>
                  {words.map((w, wi) => (
                    <span key={wi}>
                      <span
                        role="link"
                        tabIndex={0}
                        onClick={() => openGlossary(w)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGlossary(w)}
                        className="cursor-pointer font-serif font-semibold italic text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-primary/50"
                        title="Відкрити у глосарії"
                      >
                        {w}
                      </span>
                      {wi < words.length - 1 && " "}
                    </span>
                  ))}
                  {pair.meaning && <span> — {pair.meaning}</span>}
                  {i < parseSynonyms(synonyms).length - 1 && <span>; </span>}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Literary Translation */}
      {showTranslation && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {labels[language].translation}
            </h3>
            {audioPoetryTranslationUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const audio = new Audio(audioPoetryTranslationUrl);
                  audio.play();
                }}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="prose-reader font-bold whitespace-pre-wrap">{poetryTranslation}</div>
        </div>
      )}

      {/* Commentary/Purport */}
      {showCommentary && commentary && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {labels[language].commentary}
            </h3>
            {audioCommentaryUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const audio = new Audio(audioCommentaryUrl);
                  audio.play();
                }}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <TiptapRenderer content={commentary} displayBlocks={{}} className="!max-w-none commentary-text" />
          </div>
        </div>
      )}
    </div>
  );
}
