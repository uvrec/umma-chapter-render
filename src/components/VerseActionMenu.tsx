/**
 * VerseActionMenu — Telegram-style context popup for verse actions
 *
 * Replaces modal dialogs with an anchored popup that preserves reading context.
 * Triggered by a "..." button on each verse card.
 */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Copy,
  Share2,
  Bookmark,
  BookmarkCheck,
  Highlighter,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VerseActionMenuProps {
  onCopy?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onHighlight?: () => void;
  onNavigate?: () => void;
  onLearn?: () => void;
  isBookmarked?: boolean;
  className?: string;
}

export function VerseActionMenu({
  onCopy,
  onShare,
  onBookmark,
  onHighlight,
  onNavigate,
  onLearn,
  isBookmarked = false,
  className = '',
}: VerseActionMenuProps) {
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 text-muted-foreground hover:text-foreground ${className}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onCopy && (
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="h-4 w-4 mr-2" />
            {t('Копіювати', 'Copy')}
          </DropdownMenuItem>
        )}
        {onShare && (
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            {t('Поділитися', 'Share')}
          </DropdownMenuItem>
        )}
        {onBookmark && (
          <DropdownMenuItem onClick={onBookmark}>
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
            {isBookmarked
              ? t('Видалити закладку', 'Remove bookmark')
              : t('Додати закладку', 'Bookmark')}
          </DropdownMenuItem>
        )}
        {onHighlight && (
          <DropdownMenuItem onClick={onHighlight}>
            <Highlighter className="h-4 w-4 mr-2" />
            {t('Виділити', 'Highlight')}
          </DropdownMenuItem>
        )}

        {(onNavigate || onLearn) && <DropdownMenuSeparator />}

        {onLearn && (
          <DropdownMenuItem onClick={onLearn}>
            <GraduationCap className="h-4 w-4 mr-2" />
            {t('Вчити напам\'ять', 'Learn by heart')}
          </DropdownMenuItem>
        )}
        {onNavigate && (
          <DropdownMenuItem onClick={onNavigate}>
            <ExternalLink className="h-4 w-4 mr-2" />
            {t('Відкрити сторінку вірша', 'Open verse page')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
