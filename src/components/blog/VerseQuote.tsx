import React from "react";
import { VersesDisplay } from "@/components/VersesDisplay";
import type { VerseData } from "@/types/verse-display";
import { Quote } from "lucide-react";

interface VerseQuoteProps {
  verse: VerseData;
  language: 'ua' | 'en';
  title?: string;
  className?: string;
  editable?: boolean;
  onBlockToggle?: (block: keyof VerseData["display_blocks"], visible: boolean) => void;
}

/**
 * Blog-styled verse quote block wrapping the universal VersesDisplay
 * Adds pleasant craft-themed framing, spacing, and optional title.
 */
export function VerseQuote({ verse, language, title, className = "", editable = false, onBlockToggle }: VerseQuoteProps) {
  return (
    <section
      className={[
        "rounded-xl",
        "border",
        "border-primary/20",
        "bg-primary/5 dark:bg-primary/10",
        "p-6 sm:p-8",
        "shadow-sm",
        "verse-surface",
        className,
      ].join(" ")}
    >
      {/* Editorial header: quote icon + decorative line */}
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
          <Quote className="h-4 w-4" />
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
      </div>

      {title && (
        <h3 className="mb-5 text-xs sm:text-sm tracking-wide uppercase font-semibold text-primary/80">
          {title}
        </h3>
      )}

      <VersesDisplay
        language={language}
        verse={verse}
        className="[&_.sanskrit-block]:mb-4 [&_.translation-block]:mt-4 [&_.commentary-block]:mt-4"
        editable={editable}
        onBlockToggle={onBlockToggle}
      />
    </section>
  );
}

export default VerseQuote;
