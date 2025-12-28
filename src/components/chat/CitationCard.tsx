import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from "lucide-react";
import type { Citation } from "./types";

interface CitationCardProps {
  citation: Citation;
  className?: string;
}

export function CitationCard({ citation, className }: CitationCardProps) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${citation.reference}: ${citation.quote}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build internal link
  const internalPath = citation.bookSlug && citation.chapterNumber && citation.verseNumber
    ? `/book/${citation.bookSlug}/chapter/${citation.chapterNumber}/verse/${citation.verseNumber}`
    : `/book/${citation.bookSlug || 'bg'}`;

  return (
    <Card
      className={cn(
        "border-l-4 border-l-brand-500 bg-muted/30",
        "hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400">
            <BookOpen className="h-4 w-4" />
            <span>{citation.reference}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopy}
              title={language === 'ua' ? 'Копіювати' : 'Copy'}
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <Link to={internalPath}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title={language === 'ua' ? 'Відкрити' : 'Open'}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-2">
          <p
            className={cn(
              "text-sm text-muted-foreground italic",
              !isExpanded && "line-clamp-2"
            )}
          >
            "{citation.quote}"
          </p>
          {citation.quote.length > 150 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-6 px-2 text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  {language === 'ua' ? 'Згорнути' : 'Show less'}
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  {language === 'ua' ? 'Показати більше' : 'Show more'}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CitationsListProps {
  citations: Citation[];
  className?: string;
}

export function CitationsList({ citations, className }: CitationsListProps) {
  const { language } = useLanguage();

  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {language === 'ua' ? 'Джерела' : 'Sources'}
      </h4>
      <div className="grid gap-2">
        {citations.map((citation, index) => (
          <CitationCard key={`${citation.verseId}-${index}`} citation={citation} />
        ))}
      </div>
    </div>
  );
}
