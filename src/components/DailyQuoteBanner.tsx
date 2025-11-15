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
        "relative overflow-hidden backdrop-blur-sm group",
        "bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-background/95",
        "dark:from-amber-950/40 dark:via-orange-950/30 dark:to-background/95",
        "border-3 border-amber-300/60 dark:border-amber-700/40",
        "shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(251,191,36,0.4)]",
        "dark:hover:shadow-[0_20px_60px_-15px_rgba(251,191,36,0.2)]",
        "transition-all duration-700 ease-out",
        "transform hover:scale-[1.02]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
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

      <div className="relative p-8 md:p-12">
        {/* Іконка лапок з блиском */}
        <div className="absolute top-6 left-6 text-amber-400/20 dark:text-amber-600/20 transition-all duration-500 group-hover:text-amber-400/30 dark:group-hover:text-amber-600/30">
          <Quote className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1.5} />
        </div>

        {/* Іконка зірочки (для акценту) */}
        <div className="absolute top-6 right-6 text-amber-400/30 dark:text-amber-500/30 animate-pulse">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
        </div>

        <div className="relative z-10 space-y-7 max-w-4xl mx-auto">
          {/* Заголовок "Цитата дня" */}
          <div className="text-center">
            <Badge
              variant="outline"
              className="bg-amber-100/50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 px-4 py-1.5 text-sm font-semibold tracking-wide"
            >
              {quote.sanskrit ? "ШЛОКА ДНЯ" : "ЦИТАТА ДНЯ"}
            </Badge>
          </div>

          {/* Санскрит/Транслітерація (якщо вірш) */}
          {quote.sanskrit && (
            <div className="text-center space-y-3 pb-6 border-b-2 border-amber-300/40 dark:border-amber-700/40">
              <p className="text-xl md:text-2xl lg:text-3xl font-sanskrit text-amber-900 dark:text-amber-100 leading-relaxed font-semibold">
                {quote.sanskrit}
              </p>
              {quote.transliteration && (
                <p className="text-base md:text-lg text-amber-700 dark:text-amber-300 italic font-medium">
                  {quote.transliteration}
                </p>
              )}
            </div>
          )}

          {/* Основна цитата */}
          <blockquote className="space-y-6">
            <p className={cn(
              "text-center leading-relaxed",
              quote.sanskrit
                ? "text-2xl md:text-3xl lg:text-4xl" // Більший текст для віршів
                : "text-3xl md:text-4xl lg:text-5xl", // Ще більший для звичайних цитат
              "font-serif font-bold",
              "text-foreground dark:text-foreground",
              "tracking-tight",
              "drop-shadow-sm"
            )}>
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 dark:from-amber-600/20 dark:to-orange-600/20 blur-sm" />
                <span className="relative">"{quote.text}"</span>
              </span>
            </p>

            {/* Автор і джерело */}
            <footer className="flex flex-col items-center gap-3 pt-6">
              {quote.author && (
                <cite className="not-italic text-lg md:text-xl lg:text-2xl font-bold text-amber-900 dark:text-amber-100 tracking-wide">
                  — {quote.author}
                </cite>
              )}

              {quote.source && (
                <div className="flex items-center gap-3 text-base md:text-lg text-amber-700 dark:text-amber-300 font-medium">
                  <span>{quote.source}</span>
                  {quote.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      <Link to={quote.link}>
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Нижня декоративна смуга з анімацією */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent group-hover:via-amber-500/90 transition-all duration-500" />
    </Card>
  );
}
