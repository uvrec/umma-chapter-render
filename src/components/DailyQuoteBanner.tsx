// src/components/DailyQuoteBanner.tsx
import { useEffect, useState } from "react";
import { useDailyQuote } from "@/hooks/useDailyQuote";
import { Button } from "@/components/ui/button";
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
                <div
                  className="flex items-center gap-2 font-medium text-white/70"
                  style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                >
                  <span>{quote.source}</span>
                  {quote.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-6 text-white/70 hover:bg-white/10 transition-colors"
                    >
                      <Link to={quote.link}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </footer>
          </blockquote>
        </div>
      </div>

    </div>
  );
}
