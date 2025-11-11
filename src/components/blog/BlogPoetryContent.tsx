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
  audioSynonymsUrl?: string | null;
  audioPoetryTranslationUrl?: string | null;
  audioCommentaryUrl?: string | null;
  displayBlocks?: {
    sanskrit?: boolean;
    transliteration?: boolean;
    synonyms?: boolean;
    translation?: boolean;
    commentary?: boolean;
  };
  language: "ua" | "en";
}

export function BlogPoetryContent({
  sanskrit,
  transliteration,
  synonyms,
  poetryTranslation,
  commentary,
  audioSanskritUrl,
  audioTransliterationUrl,
  audioSynonymsUrl,
  audioPoetryTranslationUrl,
  audioCommentaryUrl,
  displayBlocks = {},
  language,
}: BlogPoetryContentProps) {
  const labels = {
    ua: {
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
              {language === "ua" ? "Оригінал" : "Original"}
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
          <div className="font-sanskrit text-[1.78em] leading-relaxed whitespace-pre-wrap">{sanskrit}</div>
        </div>
      )}

      {/* Transliteration */}
      {showTransliteration && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {language === "ua" ? "Транслітерація" : "Transliteration"}
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
          <div className="font-sanskrit-italic text-4xl leading-relaxed whitespace-pre-wrap">{transliteration}</div>
        </div>
      )}

      {/* Word-by-word Translation (Synonyms) */}
      {showSynonyms && synonyms && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {labels[language].synonyms}
            </h3>
            {audioSynonymsUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const audio = new Audio(audioSynonymsUrl);
                  audio.play();
                }}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-4xl leading-relaxed space-y-2">
            {parseSynonyms(synonyms).map((item, idx) => (
              <div key={idx}>
                <span className="font-semibold">{item.term}</span>
                {item.meaning && (
                  <>
                    {" — "}
                    <span>{item.meaning}</span>
                  </>
                )}
                {idx < parseSynonyms(synonyms).length - 1 && <span className="text-muted-foreground">;</span>}
              </div>
            ))}
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
          <div className="text-4xl font-semibold leading-relaxed whitespace-pre-wrap">{poetryTranslation}</div>
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
            <TiptapRenderer content={commentary} displayBlocks={{}} className="!max-w-none text-4xl leading-relaxed" />
          </div>
        </div>
      )}
    </div>
  );
}
