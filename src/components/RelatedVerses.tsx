/**
 * RelatedVerses - Display cross-referenced verses for the current verse
 *
 * Features:
 * - Shows related verses from cross_references table
 * - Displays verse reference, transliteration snippet, and translation snippet
 * - Click to navigate to the related verse
 * - Collapsible for cleaner UI
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp, Link2, ExternalLink, BookOpen } from "lucide-react";
import { getBookPrefix } from "@/utils/bookPrefixes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  getVerseReferences,
  CrossReference,
  ReferenceType,
} from "@/services/semanticSearch";

interface RelatedVersesProps {
  verseId: string;
  className?: string;
  /** Initially expanded? */
  defaultExpanded?: boolean;
  /** Maximum number of related verses to show */
  limit?: number;
}


// Reference type labels
const REFERENCE_LABELS: Record<ReferenceType, { uk: string; en: string }> = {
  citation: { uk: "Цитата", en: "Citation" },
  explanation: { uk: "Пояснення", en: "Explanation" },
  parallel: { uk: "Паралель", en: "Parallel" },
  contrast: { uk: "Контраст", en: "Contrast" },
  prerequisite: { uk: "Передумова", en: "Prerequisite" },
  followup: { uk: "Продовження", en: "Follow-up" },
  related: { uk: "Пов'язано", en: "Related" },
};

/**
 * Build URL for a related verse
 */
function buildVerseUrl(ref: CrossReference): string {
  const { bookSlug, cantoNumber, chapterNumber, verseNumber } = ref;

  // Extract first verse number for composite verses like "7-8"
  const verseNum = String(verseNumber).includes("-")
    ? String(verseNumber).split("-")[0]
    : verseNumber;

  if (bookSlug === "noi") {
    return `/lib/noi/${verseNum}`;
  }

  if (cantoNumber) {
    return `/lib/${bookSlug}/${cantoNumber}/${chapterNumber}/${verseNum}`;
  }

  return `/lib/${bookSlug}/${chapterNumber}/${verseNum}`;
}

/**
 * Format verse reference for display
 */
function formatReference(ref: CrossReference, language: "uk" | "en"): string {
  const bookAbbr = getBookPrefix(ref.bookSlug, language);

  if (ref.cantoNumber) {
    return `${bookAbbr} ${ref.cantoNumber}.${ref.chapterNumber}.${ref.verseNumber}`;
  }

  return `${bookAbbr} ${ref.chapterNumber}.${ref.verseNumber}`;
}

export function RelatedVerses({
  verseId,
  className,
  defaultExpanded = false,
  limit = 5,
}: RelatedVersesProps) {
  const { language, t, getLocalizedPath } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Fetch related verses
  const {
    data: relatedVerses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["related-verses", verseId, language, limit],
    queryFn: () =>
      getVerseReferences(verseId, {
        language: language as "uk" | "en",
        limit,
      }),
    enabled: !!verseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Don't render if no related verses
  if (!isLoading && relatedVerses.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-t pt-4 mt-6",
        className
      )}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Link2 className="h-4 w-4" />
          <span className="text-sm font-medium">
            {t("Пов'язані вірші", "Related Verses")}
          </span>
          {!isLoading && (
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
              {relatedVerses.length}
            </span>
          )}
        </div>
        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <p className="text-sm text-destructive py-2">
              {t("Помилка завантаження", "Error loading")}
            </p>
          ) : (
            // Related verses list
            <div className="space-y-2">
              {relatedVerses.map((ref) => (
                <RelatedVerseCard
                  key={ref.id}
                  reference={ref}
                  language={language as "uk" | "en"}
                  getLocalizedPath={getLocalizedPath}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual related verse card
 */
function RelatedVerseCard({
  reference,
  language,
  getLocalizedPath,
}: {
  reference: CrossReference;
  language: "uk" | "en";
  getLocalizedPath: (path: string) => string;
}) {
  const url = getLocalizedPath(buildVerseUrl(reference));
  const formattedRef = formatReference(reference, language);
  const typeLabel = reference.referenceType
    ? REFERENCE_LABELS[reference.referenceType]?.[language]
    : null;

  return (
    <Link
      to={url}
      className={cn(
        "block p-3 rounded-lg transition-colors",
        "bg-muted/30 hover:bg-muted/50",
        "border border-transparent hover:border-primary/20"
      )}
    >
      {/* Header: Reference + Type */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-sm font-medium text-primary">
            {formattedRef}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {typeLabel && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {typeLabel}
            </span>
          )}
          {reference.confidence !== null && reference.confidence >= 0.8 && (
            <span className="text-[10px] text-green-600 dark:text-green-400">
              ★
            </span>
          )}
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* Transliteration snippet */}
      {reference.transliteration && (
        <p className="text-xs text-muted-foreground italic mb-1 line-clamp-1">
          {reference.transliteration}
        </p>
      )}

      {/* Translation snippet */}
      {reference.translation && (
        <p className="text-sm text-foreground/80 line-clamp-2">
          {reference.translation}
        </p>
      )}
    </Link>
  );
}

export default RelatedVerses;
