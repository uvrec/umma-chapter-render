/**
 * QuoteCard - Картка для відображення цитати
 */

import { Quote } from "@/hooks/useQuotes";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, Mail, Users, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuoteCardProps {
  quote: Quote;
  showSource?: boolean;
  showCategory?: boolean;
  className?: string;
}

const sourceTypeIcons: Record<string, React.ReactNode> = {
  book: <BookOpen className="h-3.5 w-3.5" />,
  lecture: <MessageSquare className="h-3.5 w-3.5" />,
  letter: <Mail className="h-3.5 w-3.5" />,
  conversation: <Users className="h-3.5 w-3.5" />,
};

const sourceTypeLabels: Record<string, { ua: string; en: string }> = {
  book: { ua: "Книга", en: "Book" },
  lecture: { ua: "Лекція", en: "Lecture" },
  letter: { ua: "Лист", en: "Letter" },
  conversation: { ua: "Бесіда", en: "Conversation" },
  unknown: { ua: "Джерело", en: "Source" },
};

export function QuoteCard({
  quote,
  showSource = true,
  showCategory = false,
  className,
}: QuoteCardProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const text = (language === "uk" && quote.text_ua) ? quote.text_ua : quote.text_en;
  const sourceLabel = sourceTypeLabels[quote.source_type] || sourceTypeLabels.unknown;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Генерувати посилання на вірш, якщо є
  const verseLink = quote.book_slug && quote.chapter_number && quote.verse_number
    ? `/veda-reader/${quote.book_slug}/${quote.chapter_number}/${quote.verse_number}`
    : null;

  return (
    <Card className={cn("group relative", className)}>
      <CardContent className="p-4 sm:p-6">
        {/* Quote text */}
        <blockquote className="text-base sm:text-lg leading-relaxed italic text-foreground/90 mb-4">
          "{text}"
        </blockquote>

        {/* Source and metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Source type badge */}
            {showSource && quote.source_type && (
              <Badge variant="secondary" className="gap-1.5">
                {sourceTypeIcons[quote.source_type]}
                {t(sourceLabel.ua, sourceLabel.en)}
              </Badge>
            )}

            {/* Source reference */}
            {quote.source_reference && (
              verseLink ? (
                <Link to={verseLink}>
                  <Badge
                    variant="outline"
                    className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {quote.source_reference}
                    <ExternalLink className="h-3 w-3" />
                  </Badge>
                </Link>
              ) : (
                <Badge variant="outline">{quote.source_reference}</Badge>
              )
            )}

            {/* Categories */}
            {showCategory && quote.categories && quote.categories.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {quote.categories[0]}
              </Badge>
            )}
          </div>

          {/* Copy button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1 text-green-500" />
                {t("Скопійовано", "Copied")}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                {t("Копіювати", "Copy")}
              </>
            )}
          </Button>
        </div>

        {/* Page title */}
        {quote.page_title && (
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
            {quote.page_title}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
