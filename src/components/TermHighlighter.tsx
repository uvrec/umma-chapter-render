// TermHighlighter.tsx
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSanskritTerms } from "@/hooks/useSanskritTerms";
import { useSanskritLexicon, LexiconEntry } from "@/hooks/useSanskritLexicon";
import { useLanguage } from "@/contexts/LanguageContext";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink } from "lucide-react";

/**
 * Підсвічує терміни за українською транслітерацією санскриту
 * (йоґа, д̣, т̣, ш́, н̣, н̃, а̄, ӯ, р̣, р̣̄, л̣, л̣̄ тощо) і робить їх клікабельними.
 * Використовує craft-сумісну поверхню (`verse-surface`) у тултіпі.
 *
 * Enhanced with DCS Sanskrit Lexicon integration for grammar and meanings.
 */
interface TermHighlighterProps {
  text: string;
  className?: string;
  /** "dotted" | "solid" — стиль підкреслення лінка */
  underlineStyle?: "dotted" | "solid";
  /** якщо true — тултіп відключено, лишається лише лінк */
  disableHover?: boolean;
  /** якщо true — показувати інформацію з DCS лексикону */
  showLexicon?: boolean;
}

/** м'яка мапа: латинські IAST → українські діакритики (для lookup, НЕ для відображення) */
const latinToUA: Array<[RegExp, string]> = [
  [/ṭ/g, "т̣"],
  [/ḍ/g, "д̣"],
  [/ṇ/g, "н̣"],
  [/ñ/g, "н̃"],
  [/ś/g, "ш́"],
  [/ṣ/g, "ш"],

  // довгі голосні
  [/ā/g, "а̄"],
  [/ū/g, "ӯ"],

  // р/л із крапкою та макроном
  [/ṝ|ṝ/g, "р̣̄"],
  [/ṛ|ṛ/g, "р̣"],
  [/ḹ|ḹ/g, "л̣̄"],
  [/ḷ|ḷ/g, "л̣"],

  // базові латинські найменування, якщо зустрінуться в тексті
  [/yoga/gi, "йоґа"],
  [/bhakti/gi, "бгакті"],
];

/** нормалізує слово для пошуку в глосарії, зберігаючи вигляд у тексті */
function normalizeForLookup(raw: string): string {
  const nfc = raw.normalize("NFC");
  // зняти крайні лапки/дужки
  const stripped = nfc.replace(/^["'""''([]+/, "").replace(/["'""'')\]]+$/, "");
  // м'яко привести можливу латинку з діакритиками до укр-правил
  return latinToUA.reduce((acc, [re, repl]) => acc.replace(re, repl), stripped);
}

// Grammar badge colors
const GRAMMAR_COLORS: Record<string, string> = {
  m: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  f: "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
  n: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  adj: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  ind: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
};

export const TermHighlighter = ({
  text,
  className = "",
  underlineStyle = "dotted",
  disableHover = false,
  showLexicon = true,
}: TermHighlighterProps) => {
  const { isTermPresent, getTermData, getGlossaryLink, isLoading } = useSanskritTerms();
  const { lexiconAvailable, lookupWord, getGrammarLabel, getDictionaryLink } = useSanskritLexicon();
  const { language } = useLanguage();

  // токени: слова (літери + комбінуючі знаки + внутр. апостроф/дефіс) та роздільники
  const tokens = useMemo(
    () => text.match(/([\p{L}\p{M}]+(?:[''\-][\p{L}\p{M}]+)*)|(\s+|[.,;:!?…()[\]{}—–-])/gu) || [text],
    [text],
  );

  if (isLoading) return <span className={className}>{text}</span>;

  const linkBase =
    "text-primary underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 ring-primary";
  const linkUnderline = underlineStyle === "solid" ? "decoration-solid" : "decoration-dotted";

  return (
    <span className={className}>
      {tokens.map((tok, i) => {
        // не-слова повертаємо як є
        if (!tok || /\s+|[.,;:!?…()[\]{}—–-]/u.test(tok)) {
          return <span key={i}>{tok}</span>;
        }

        const lookup = normalizeForLookup(tok);
        if (!lookup || !isTermPresent(lookup)) {
          return <span key={i}>{tok}</span>;
        }

        const data = getTermData(lookup);
        const first = data?.[0];

        const linkEl = (
          <Link
            to={getGlossaryLink(lookup)}
            className={`${linkBase} ${linkUnderline}`}
            aria-label={first ? `${lookup} — ${language === "ua" ? "термін із глосарія" : "glossary term"}` : lookup}
            data-term={lookup}
          >
            {tok /* показуємо вихідне слово, не змінюємо написання з діакритиками */}
          </Link>
        );

        if (disableHover || !first) return <span key={i}>{linkEl}</span>;

        return (
          <HoverCard key={i} openDelay={120} closeDelay={80}>
            <HoverCardTrigger asChild>{linkEl}</HoverCardTrigger>
            <HoverCardContent className="w-80 verse-surface">
              <TermHoverContent
                term={first.term}
                meaning={first.meaning}
                reference={first.reference}
                additionalCount={data.length - 1}
                lookup={lookup}
                showLexicon={showLexicon && lexiconAvailable}
                lookupWord={lookupWord}
                getGrammarLabel={getGrammarLabel}
                getDictionaryLink={getDictionaryLink}
                language={language}
              />
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </span>
  );
};

// Separate component for hover content to handle async lexicon lookup
interface TermHoverContentProps {
  term: string;
  meaning?: string;
  reference?: string;
  additionalCount: number;
  lookup: string;
  showLexicon: boolean;
  lookupWord: (word: string) => Promise<LexiconEntry[]>;
  getGrammarLabel: (grammar: string | null, language: "ua" | "en") => string | null;
  getDictionaryLink: (word: string) => string;
  language: string;
}

const TermHoverContent = ({
  term,
  meaning,
  reference,
  additionalCount,
  lookup,
  showLexicon,
  lookupWord,
  getGrammarLabel,
  getDictionaryLink,
  language,
}: TermHoverContentProps) => {
  const [lexiconEntry, setLexiconEntry] = useState<LexiconEntry | null>(null);
  const [lexiconLoading, setLexiconLoading] = useState(false);

  useEffect(() => {
    if (!showLexicon) return;

    let cancelled = false;
    setLexiconLoading(true);

    lookupWord(lookup).then((entries) => {
      if (!cancelled && entries.length > 0) {
        setLexiconEntry(entries[0]);
      }
      setLexiconLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [lookup, showLexicon, lookupWord]);

  const grammarLabel = lexiconEntry?.grammar
    ? getGrammarLabel(lexiconEntry.grammar, language as "ua" | "en")
    : null;

  const grammarColor = lexiconEntry?.grammar
    ? GRAMMAR_COLORS[lexiconEntry.grammar] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    : "";

  return (
    <div className="space-y-2">
      {/* Header with term and Devanagari */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold">{term}</h4>
          {lexiconEntry?.word_devanagari && (
            <span className="text-lg text-muted-foreground">{lexiconEntry.word_devanagari}</span>
          )}
        </div>
        {grammarLabel && (
          <Badge variant="secondary" className={`text-xs ${grammarColor}`}>
            {grammarLabel}
          </Badge>
        )}
      </div>

      {/* Meaning from glossary */}
      {meaning && <p className="text-sm text-muted-foreground">{meaning}</p>}

      {/* Enhanced meaning from lexicon */}
      {lexiconEntry?.meanings && lexiconEntry.meanings !== meaning && (
        <div className="border-t border-border/50 pt-2">
          <p className="text-xs text-muted-foreground line-clamp-3">
            <span className="font-medium">DCS: </span>
            {lexiconEntry.meanings}
          </p>
        </div>
      )}

      {/* Reference and additional info */}
      {(reference || additionalCount > 0 || lexiconEntry) && (
        <div className="pt-2 text-xs text-muted-foreground border-t border-border/50">
          {reference && (
            <div className="flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              <span>{reference}</span>
            </div>
          )}
          {additionalCount > 0 && (
            <p className="pt-1">
              {language === "ua" ? `+${additionalCount} інших віршів` : `+${additionalCount} more verses`}
            </p>
          )}
          {lexiconEntry && (
            <Link
              to={getDictionaryLink(lexiconEntry.word)}
              className="inline-flex items-center gap-1 pt-1 text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              {language === "ua" ? "Детальніше в словнику" : "View in dictionary"}
            </Link>
          )}
        </div>
      )}

      {/* Loading state */}
      {lexiconLoading && (
        <div className="text-xs text-muted-foreground animate-pulse">
          {language === "ua" ? "Завантаження..." : "Loading..."}
        </div>
      )}
    </div>
  );
};
