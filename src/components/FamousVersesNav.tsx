/**
 * FamousVersesNav - Navigation between famous verses
 * Shows a minimal floating bar for jumping between famous/important verses
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFamousVersesForBook, useAdjacentFamousVerses } from '@/hooks/useFamousVerses';
import { cn } from '@/lib/utils';

interface FamousVersesNavProps {
  bookSlug: string;
  currentVerseId?: string;
  cantoNumber?: number;
  chapterNumber: number;
  className?: string;
}

export function FamousVersesNav({
  bookSlug,
  currentVerseId,
  cantoNumber,
  chapterNumber,
  className,
}: FamousVersesNavProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const { data: famousVerses, isLoading } = useFamousVersesForBook(bookSlug);
  const { data: adjacent } = useAdjacentFamousVerses(currentVerseId, bookSlug);

  // Don't show if no famous verses or dismissed
  if (isLoading || !famousVerses?.length || dismissed) {
    return null;
  }

  // Build URL for a verse
  const buildVerseUrl = (
    canto: number | null,
    chapter: number,
    verseNumber: string
  ) => {
    if (canto) {
      return `/${bookSlug}/canto/${canto}/chapter/${chapter}/verse/${verseNumber}`;
    }
    return `/${bookSlug}/chapter/${chapter}/verse/${verseNumber}`;
  };

  const handlePrev = () => {
    if (adjacent?.prev_verse_id) {
      const url = buildVerseUrl(
        adjacent.prev_canto,
        adjacent.prev_chapter!,
        adjacent.prev_verse_number!
      );
      navigate(url);
    }
  };

  const handleNext = () => {
    if (adjacent?.next_verse_id) {
      const url = buildVerseUrl(
        adjacent.next_canto,
        adjacent.next_chapter!,
        adjacent.next_verse_number!
      );
      navigate(url);
    }
  };

  // Count famous verses in current chapter
  const famousInChapter = famousVerses.filter(
    (v) =>
      v.chapter_number === chapterNumber &&
      (cantoNumber === undefined || v.canto_number === cantoNumber)
  );

  // Current index among all famous verses
  const currentIndex = currentVerseId
    ? famousVerses.findIndex((v) => v.verse_id === currentVerseId)
    : -1;

  const isCurrentFamous = currentIndex !== -1;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm',
        className
      )}
    >
      {/* Label */}
      <span className="text-xs font-medium text-primary">
        {t('Шлоки', 'Verses')}
      </span>

      {/* Counter */}
      {isCurrentFamous && (
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1}/{famousVerses.length}
        </span>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={!adjacent?.prev_verse_id}
          className="h-7 w-7 p-0 rounded-full"
          title={t('Попередня знаменита шлока', 'Previous famous verse')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={!adjacent?.next_verse_id}
          className="h-7 w-7 p-0 rounded-full"
          title={t('Наступна знаменита шлока', 'Next famous verse')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dismiss button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDismissed(true)}
        className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-foreground"
        title={t('Приховати', 'Hide')}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export default FamousVersesNav;
