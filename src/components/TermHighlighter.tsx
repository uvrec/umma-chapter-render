// TermHighlighter.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSanskritTerms } from "@/hooks/useSanskritTerms";
import { useLanguage } from "@/contexts/LanguageContext";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

/**
 * Підсвічує терміни за українською транслітерацією санскриту
 * (йоґа, д̣, т̣, ш́, н̣, н̃, а̄, ӯ, р̣, р̣̄, л̣, л̣̄ тощо) і робить їх клікабельними.
 * Використовує craft-сумісну поверхню (`verse-surface`) у тултіпі.
 */
interface TermHighlighterProps {
  text: string;
  className?: string;
  /** "dotted" | "solid" — стиль підкреслення лінка */
  underlineStyle?: "dotted" | "solid";
  /** якщо true — тултіп відключено, лишається лише лінк */
  disableHover?: boolean;
}

/** м’яка мапа: латинські IAST → українські діакритики (для lookup, НЕ для відображення) */
const latinToUA: Array<[RegExp, string]> = [
  [/ṭ/g, "т̣"],
  [/ḍ/g, "д̣"],
  [/ṇ/g, "н̣"],
  [/ñ/g, "н̃"],
  [/ś/g, "ш́"],
  [/ṣ/g, "ш"],

  // довгі голосні
  [/ā/g, "а̄"],
  // за потреби можна також уніфікувати лат. ī → і̄ (залишено як коментар)
  // [/ī/g, "і̄"],
  [/ū/g, "ӯ"],

  // р/л із крапкою та макроном
  [/ṝ|ṝ/g, "р̣̄"],
  [/ṛ|ṛ/g, "р̣"],
  [/ḹ|ḹ/g, "л̣̄"],
  [/ḷ|ḷ/g, "л̣"],

  // базові латинські найменування, якщо зустрінуться в тексті
  [/yoga/gi, "йоґа"],
  [/bhakti/gi, "бгакті"],
];

/** нормалізує слово для пошуку в глосарії, зберігаючи вигляд у тексті */
function normalizeForLookup(raw: string): string {
  const nfc = raw.normalize("NFC");
  // зняти крайні лапки/дужки
  const stripped = nfc.replace(/^["'“”‘’([]+/, "").replace(/["'“”‘’)\]]+$/, "");
  // м’яко привести можливу латинку з діакритиками до укр-правил
  return latinToUA.reduce((acc, [re, repl]) => acc.replace(re, repl), stripped);
}

export const TermHighlighter = ({
  text,
  className = "",
  underlineStyle = "dotted",
  disableHover = false,
}: TermHighlighterProps) => {
  const { isTermPresent, getTermData, getGlossaryLink, isLoading } = useSanskritTerms();
  const { language } = useLanguage();

  // токени: слова (літери + комбінуючі знаки + внутр. апостроф/дефіс) та роздільники
  // \p{L} — літера будь-якого алфавіту, \p{M} — комбінуючі діакритики (крапки/макрони/наголоси)
  const tokens = useMemo(
    () => text.match(/([\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*)|(\s+|[.,;:!?…()[\]{}—–-])/gu) || [text],
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
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{first.term}</h4>
                {first.meaning && <p className="text-sm text-muted-foreground">{first.meaning}</p>}
                {(first.reference || data.length > 1) && (
                  <div className="pt-2 text-xs text-muted-foreground">
                    {first.reference && (
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">{language === "ua" ? "З" : "From"}:</span>
                        <span>{first.reference}</span>
                      </div>
                    )}
                    {data.length > 1 && (
                      <p className="pt-1">
                        {language === "ua" ? `+${data.length - 1} інших віршів` : `+${data.length - 1} more verses`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </span>
  );
};
