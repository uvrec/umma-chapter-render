import { useState } from "react";
import { Link } from "react-router-dom";
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

  // Build internal link - correct format for veda-reader
  // For SB with canto: /lib/sb/canto/1/chapter/1/1
  // For other books: /lib/bg/2/2
  const buildInternalPath = () => {
    if (!citation.bookSlug) return '/lib/bg';
    if (!citation.chapterNumber || !citation.verseNumber) {
      return `/lib/${citation.bookSlug}`;
    }
    // Books with canto structure: SB (Srimad-Bhagavatam) and SCC (Sri Caitanya-caritamrta)
    if ((citation.bookSlug === 'sb' || citation.bookSlug === 'scc') && citation.cantoNumber) {
      return `/lib/${citation.bookSlug}/canto/${citation.cantoNumber}/chapter/${citation.chapterNumber}/${citation.verseNumber}`;
    }
    // Other books use simple structure
    return `/lib/${citation.bookSlug}/${citation.chapterNumber}/${citation.verseNumber}`;
  };

  const internalPath = buildInternalPath();

  return (
    <div className={cn("py-2", className)}>
      <div className="flex items-start justify-between gap-2">
        <Link
          to={internalPath}
          className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          <span>{citation.reference}</span>
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-60 hover:opacity-100"
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
              className="h-6 w-6 opacity-60 hover:opacity-100"
              title={language === 'ua' ? 'Відкрити' : 'Open'}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-1 pl-6">
        <p
          className={cn(
            "text-sm text-muted-foreground italic",
            !isExpanded && "line-clamp-2"
          )}
        >
          "{citation.quote}"
        </p>
        {citation.quote.length > 150 && (
          <button
            className="mt-1 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" />
                {language === 'ua' ? 'Згорнути' : 'Show less'}
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                {language === 'ua' ? 'Показати більше' : 'Show more'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
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
    <div className={cn("pt-2", className)}>
      <p className="text-xs text-muted-foreground mb-1">
        {language === 'ua' ? 'Джерела' : 'Sources'}
      </p>
      <div className="divide-y divide-border/30">
        {citations.map((citation, index) => (
          <CitationCard key={`${citation.verseId}-${index}`} citation={citation} />
        ))}
      </div>
    </div>
  );
}
