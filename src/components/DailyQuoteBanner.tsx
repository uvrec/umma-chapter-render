// src/components/DailyQuoteBanner.tsx
import { useEffect } from "react";
import { useDailyQuote } from "@/hooks/useDailyQuote";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DailyQuoteBannerProps {
  className?: string;
}

export function DailyQuoteBanner({ className }: DailyQuoteBannerProps) {
  const { quote, isLoading, updateDisplayStats, rawQuote } = useDailyQuote();

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
          <div className="h-32 bg-muted/50 rounded" />
        </Card>
      </div>
    );
  }

  if (!quote?.text) return null;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden backdrop-blur-sm",
        "bg-gradient-to-br from-amber-50/80 via-background/95 to-orange-50/60",
        "dark:from-amber-950/30 dark:via-background/95 dark:to-orange-950/20",
        "border-2 border-amber-200/50 dark:border-amber-800/30",
        "shadow-2xl hover:shadow-3xl transition-all duration-500",
        className
      )}
    >
      {/* Декоративний фон */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative p-6 md:p-10">
        {/* Іконка лапок */}
        <div className="absolute top-4 left-4 text-amber-300/30 dark:text-amber-700/30">
          <Quote className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1.5} />
        </div>

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          {/* Санскрит/Транслітерація (якщо вірш) */}
          {quote.sanskrit && (
            <div className="text-center space-y-2 pb-4 border-b border-amber-200/30 dark:border-amber-800/30">
              <p className="text-lg md:text-xl font-sanskrit text-amber-800 dark:text-amber-200 leading-relaxed">
                {quote.sanskrit}
              </p>
              {quote.transliteration && (
                <p className="text-sm md:text-base text-amber-700/80 dark:text-amber-300/80 italic">
                  {quote.transliteration}
                </p>
              )}
            </div>
          )}

          {/* Основна цитата */}
          <blockquote className="space-y-4">
            <p className={cn(
              "text-center leading-relaxed",
              quote.sanskrit 
                ? "text-xl md:text-2xl lg:text-3xl" // Менший текст якщо є санскрит
                : "text-2xl md:text-3xl lg:text-4xl", // Більший якщо тільки цитата
              "font-serif font-medium",
              "text-foreground/90 dark:text-foreground/95",
              "tracking-wide"
            )}>
              "{quote.text}"
            </p>

            {/* Автор і джерело */}
            <footer className="flex flex-col items-center gap-2 pt-4">
              {quote.author && (
                <cite className="not-italic text-base md:text-lg font-semibold text-amber-800 dark:text-amber-200">
                  — {quote.author}
                </cite>
              )}
              
              {quote.source && (
                <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                  <span>{quote.source}</span>
                  {quote.link && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="h-7 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
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

      {/* Нижня декоративна смуга */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
    </Card>
  );
}
