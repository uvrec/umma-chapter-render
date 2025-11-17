// src/components/DailyQuoteBanner.tsx
import { useEffect, useState } from "react";
import { useDailyQuote } from "@/hooks/useDailyQuote";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Quote, Sparkles } from "lucide-react";
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
        <Card className="p-8 bg-gradient-to-br from-amber-50/50 via-background to-orange-50/30 dark:from-amber-950/20 dark:via-background dark:to-orange-950/10">
          <div className="h-40 bg-muted/50 rounded" />
        </Card>
      </div>
    );
  }

  if (!quote?.text) return null;

  return (
    <Card
      className={cn(
        "relative overflow-hidden group",
        "backdrop-blur-[10px]",
        "bg-white/10 dark:bg-white/5",
        "border border-white/20 dark:border-white/10",
        "shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)]",
        "dark:hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.15)]",
        "transition-all duration-700 ease-out",
        "transform hover:scale-[1.02]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >

      <div className="relative p-3 md:p-4">
        {/* Іконка лапок з блиском */}
        <div className="absolute top-3 left-3 text-white/10 dark:text-white/5 transition-all duration-500 group-hover:text-white/15 dark:group-hover:text-white/10">
          <Quote className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
        </div>

        {/* Іконка зірочки (для акценту) */}
        <div className="absolute top-3 right-3 text-white/15 dark:text-white/10 animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="relative z-10 space-y-2 max-w-5xl mx-auto">

          {/* Санскрит/Транслітерація (якщо вірш) */}
          {quote.sanskrit && (
            <div className="text-center space-y-2 pb-3 border-b border-white/20 dark:border-white/10">
              <p
                className="font-sanskrit text-white/95 dark:text-white/90 leading-relaxed font-semibold drop-shadow-lg"
                style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}
              >
                {quote.sanskrit}
              </p>
              {quote.transliteration && (
                <p
                  className="text-white/80 dark:text-white/75 italic font-medium drop-shadow-md"
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
              className="text-center leading-relaxed font-serif font-semibold text-white/95 dark:text-white/90 tracking-tight drop-shadow-lg"
              style={{
                fontSize: quote.sanskrit
                  ? 'clamp(1rem, 3vw, 1.25rem)'      // Для віршів
                  : 'clamp(1.125rem, 3.5vw, 1.5rem)' // Для звичайних цитат
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
                  className="not-italic font-semibold text-white/90 dark:text-white/85 tracking-wide drop-shadow-md"
                  style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                >
                  — {quote.author}
                </cite>
              )}

              {quote.source && (
                <div
                  className="flex items-center gap-2 text-white/75 dark:text-white/70 font-medium"
                  style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                >
                  <span>{quote.source}</span>
                  {quote.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-6 text-white/75 hover:text-white/95 dark:text-white/70 dark:hover:text-white/90 hover:bg-white/10 transition-colors"
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

    </Card>
  );
}
