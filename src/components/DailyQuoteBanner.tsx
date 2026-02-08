// src/components/DailyQuoteBanner.tsx
import { useEffect, useState } from "react";
import { useDailyQuote } from "@/hooks/useDailyQuote";
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
        <div className="relative z-10 space-y-2 max-w-4xl mx-auto">

          {/* Санскрит/Транслітерація (якщо вірш) */}
          {quote.sanskrit && (
            <div className="text-center space-y-2 pb-3 border-b border-white/15">
              <p
                className="font-sanskrit leading-relaxed font-semibold text-white/80"
                style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}
              >
                {quote.sanskrit}
              </p>
              {quote.transliteration && (
                <p
                  className="italic font-medium text-white/60"
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
              className="text-center leading-snug italic text-white/90"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 500,
                fontSize: quote.sanskrit
                  ? 'clamp(1.25rem, 3.5vw, 1.75rem)'
                  : 'clamp(1.5rem, 4vw, 2rem)',
                letterSpacing: '0.01em',
              }}
            >
              "{quote.text}"
            </p>

            {/* Автор і джерело */}
            <footer className="flex flex-col items-center gap-1.5 pt-2">
              {quote.author && (
                <cite
                  className="not-italic text-white/60"
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontWeight: 600,
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                    letterSpacing: '0.05em',
                  }}
                >
                  — {quote.author}
                </cite>
              )}

              {quote.source && (
                <cite
                  className="not-italic block text-center"
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                  }}
                >
                  {quote.link ? (
                    <Link
                      to={quote.link}
                      className="italic font-semibold text-amber-400/70 hover:text-amber-300/90 transition-colors no-underline"
                    >
                      {quote.source}
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
