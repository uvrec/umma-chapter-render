import { Link } from "react-router-dom";
import { useSanskritTerms } from "@/hooks/useSanskritTerms";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface TermHighlighterProps {
  text: string;
  className?: string;
}

export const TermHighlighter = ({ text, className = "" }: TermHighlighterProps) => {
  const { isTermPresent, getTermData, getGlossaryLink, isLoading } = useSanskritTerms();
  const { language } = useLanguage();

  if (isLoading) {
    return <span className={className}>{text}</span>;
  }

  // Split text into words while preserving punctuation and spaces
  const words = text.split(/(\s+|[.,;:!?—–-])/);

  return (
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.trim();
        
        // Skip empty strings, spaces, and punctuation
        if (!cleanWord || /^[\s.,;:!?—–-]+$/.test(word)) {
          return <span key={index}>{word}</span>;
        }

        // Check if word is a Sanskrit term
        if (isTermPresent(cleanWord)) {
          const termData = getTermData(cleanWord);
          const firstTerm = termData[0];
          
          return (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <Link
                  to={getGlossaryLink(cleanWord)}
                  className="text-primary underline decoration-dotted hover:decoration-solid transition-colors"
                >
                  {word}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{firstTerm.term}</h4>
                  <p className="text-sm text-muted-foreground">
                    {firstTerm.meaning}
                  </p>
                  <div className="flex items-center pt-2 text-xs text-muted-foreground">
                    <span className="font-medium mr-2">
                      {language === "ua" ? "З" : "From"}:
                    </span>
                    <span>{firstTerm.reference}</span>
                  </div>
                  {termData.length > 1 && (
                    <p className="text-xs text-muted-foreground pt-1">
                      {language === "ua" 
                        ? `+${termData.length - 1} інших віршів` 
                        : `+${termData.length - 1} more verses`}
                    </p>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        }

        return <span key={index}>{word}</span>;
      })}
    </span>
  );
};
