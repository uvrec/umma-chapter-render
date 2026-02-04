/**
 * Секція "Продовжити читання" для головної сторінки
 */

import { Link } from 'react-router-dom';
import { BookOpen, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getRecentReadingPositions,
  getReadingUrl,
  removeReadingPosition,
  ReadingPosition,
} from '@/services/readingProgress';
import { useState, useEffect } from 'react';

interface ContinueReadingSectionProps {
  className?: string;
  maxItems?: number;
}

export function ContinueReadingSection({ className, maxItems = 3 }: ContinueReadingSectionProps) {
  const { t, getLocalizedPath } = useLanguage();
  const [positions, setPositions] = useState<ReadingPosition[]>([]);

  useEffect(() => {
    setPositions(getRecentReadingPositions(maxItems));
  }, [maxItems]);

  const handleRemove = (position: ReadingPosition, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeReadingPosition(position.bookSlug, position.chapterNumber, position.cantoNumber);
    setPositions(getRecentReadingPositions(maxItems));
  };

  if (positions.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return t(`${days} дн. тому`, `${days}d ago`);
    if (hours > 0) return t(`${hours} год. тому`, `${hours}h ago`);
    if (minutes > 0) return t(`${minutes} хв. тому`, `${minutes}m ago`);
    return t('Щойно', 'Just now');
  };

  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {t('Продовжити читання', 'Continue Reading')}
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {positions.map((position, idx) => (
          <Link key={idx} to={getLocalizedPath(getReadingUrl(position))} className="group block py-3 hover:bg-muted/30 transition-colors relative">
            {/* Remove button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleRemove(position, e)}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Book title */}
            <p className="text-sm font-medium text-primary truncate pr-6">
              {position.bookTitle}
            </p>

            {/* Chapter info */}
            <p className="text-sm text-muted-foreground truncate mt-1">
              {position.cantoNumber && `${t('Пісня', 'Canto')} ${position.cantoNumber} · `}
              {t('Глава', 'Chapter')} {position.chapterNumber}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {position.chapterTitle}
            </p>

            {/* Progress */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(position.lastReadAt)}
                </span>
                <span>{position.percentRead}%</span>
              </div>
              <Progress value={position.percentRead} className="h-1" />
            </div>

          </Link>
        ))}
      </div>
    </section>
  );
}
