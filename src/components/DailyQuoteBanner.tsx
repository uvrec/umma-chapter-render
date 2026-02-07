// src/components/DailyQuoteBanner.tsx
import { useEffect, useState } from "react";
import { useDailyQuote } from "@/hooks/useDailyQuote";
import { ExternalLink, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DailyQuoteBannerProps {
  className?: string;
}

export function DailyQuoteBanner({ className }: DailyQuoteBannerProps) {
  const { quote, isLoading, updateDisplayStats, rawQuote } = useDailyQuote();
  const [isVisible, setIsVisible] = useState(false);

  // Анімація появи
  useEffect(() => {
    if (quote?.text) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [quote?.text]);

  // Оновлюємо статистику при першому завантаженні
  useEffect(() => {
    if (rawQuote?.id && !rawQuote.last_displayed_at) {
      updateDisplayStats(rawQuote.id);
    }
  }, [rawQuote?.id, rawQuote?.last_displayed_at, updateDisplayStats]);

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="p-8">
          <div className="h-40 bg-muted/50" />
        </div>
      </div>
    );
  }

  if (!quote?.text) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >

      <div className="relative p-3 md:p-4 -mt-0.5">
        {/* Іконка лапок */}
        <div className="absolute top-3 left-3 text-white/10 dark:text-white/5">
          <Quote className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
        </div>

        <div className="relative z-10 space-y-2 max-w-5xl mx-auto">

          {/* Санскрит/Транслітерація (якщо вірш) */}
          {quote.sanskrit && (
            <div className="text-center space-y-2 pb-3 border-b border-white/20 dark:border-white/10">
              <p
                className="font-sanskrit leading-relaxed font-semibold text-white/90"
                style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}
              >
                {quote.sanskrit}
              </p>
              {quote.transliteration && (
                <p
                  className="italic font-medium text-white/80"
                  style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                >
                  {quote.transliteration}
                </p>
              )}
            </div>
          )}

          {/* Основна цитата */}
          <blockquote className="space-y-3">
            <p
              className="text-center leading-relaxed font-serif font-semibold tracking-tight text-white/90"
              style={{
                fontSize: quote.sanskrit
                  ? 'clamp(1rem, 3vw, 1.25rem)'
                  : 'clamp(1.125rem, 3.5vw, 1.5rem)',
              }}
            >
              <span className="relative inline-block">
                <span className="relative">"{quote.text}"</span>
              </span>
            </p>

            {/* Автор і джерело */}
            <footer className="flex flex-col items-center gap-2 pt-3">
              {quote.author && (
                <cite
                  className="not-italic font-semibold tracking-wide text-white/80"
                  style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                >
                  — {quote.author}
                </cite>
              )}

              {quote.source && (
                <cite
                  className="not-italic block text-center"
                  style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                >
                  {quote.link ? (
                    <Link
                      to={quote.link}
                      className="inline-flex items-center gap-1.5 italic font-semibold text-amber-400/70 hover:text-amber-300/90 transition-colors no-underline"
                    >
                      <span>{quote.source}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </Link>
                  ) : (
                    <span className="italic font-semibold text-amber-400/70">{quote.source}</span>
                  )}
                </cite>
              )}
            </footer>
          </blockquote>
        </div>
      </div>

    </div>
  );
}
