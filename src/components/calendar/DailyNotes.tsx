/**
 * DailyNotes - Personal notes with sync to book highlights
 *
 * Features:
 * - Daily journal entry
 * - Shows verse notes/highlights created that day
 * - Links between daily notes and book content
 * - Mood tracking
 */

import { useState, useMemo, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRoutines } from '@/hooks/useRoutines';
import { useUserContent, HIGHLIGHT_COLORS } from '@/contexts/UserContentContext';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Smile,
  Meh,
  Frown,
  Heart,
  Edit3,
  BookOpen,
  Highlighter,
  StickyNote,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface DailyNotesProps {
  selectedDate?: Date;
  className?: string;
}

type Mood = 'great' | 'good' | 'neutral' | 'difficult';

const moodIcons: Record<Mood, { icon: React.ReactNode; color: string; label_ua: string; label_en: string }> = {
  great: { icon: <Heart className="w-4 h-4" />, color: 'text-pink-500', label_ua: 'Чудово', label_en: 'Great' },
  good: { icon: <Smile className="w-4 h-4" />, color: 'text-green-500', label_ua: 'Добре', label_en: 'Good' },
  neutral: { icon: <Meh className="w-4 h-4" />, color: 'text-amber-500', label_ua: 'Нейтрально', label_en: 'Neutral' },
  difficult: { icon: <Frown className="w-4 h-4" />, color: 'text-blue-500', label_ua: 'Складно', label_en: 'Difficult' },
};

export function DailyNotes({ selectedDate, className }: DailyNotesProps) {
  const { t, language } = useLanguage();
  const date = selectedDate || new Date();
  const dateStr = format(date, 'yyyy-MM-dd');

  const { todayNote, updateNote } = useRoutines(date);
  const { notes: allVerseNotes, highlights: allHighlights } = useUserContent();

  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(todayNote?.content || '');
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(todayNote?.mood as Mood);
  const [showVerseNotes, setShowVerseNotes] = useState(true);

  // Update local state when todayNote changes
  useEffect(() => {
    setNoteContent(todayNote?.content || '');
    setSelectedMood(todayNote?.mood as Mood);
  }, [todayNote]);

  // Get verse notes created on this date
  const verseNotesForDate = useMemo(() => {
    return allVerseNotes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return isSameDay(noteDate, date);
    });
  }, [allVerseNotes, date]);

  // Get highlights created on this date
  const highlightsForDate = useMemo(() => {
    return allHighlights.filter(highlight => {
      const highlightDate = new Date(highlight.createdAt);
      return isSameDay(highlightDate, date);
    });
  }, [allHighlights, date]);

  // Save note
  const handleSave = () => {
    updateNote(noteContent, { mood: selectedMood });
    setIsEditing(false);
  };

  // Toggle mood
  const handleMoodSelect = (mood: Mood) => {
    const newMood = selectedMood === mood ? undefined : mood;
    setSelectedMood(newMood);
    updateNote(noteContent, { mood: newMood });
  };

  // Get highlight color class
  const getHighlightColorClass = (color: string) => {
    const colorData = HIGHLIGHT_COLORS.find(c => c.id === color);
    return colorData?.className || 'bg-yellow-200';
  };

  // Build verse link
  const buildVerseLink = (bookSlug: string, cantoNumber: number | undefined, chapterNumber: number, verseNumber: string) => {
    if (cantoNumber) {
      return `/lib/${bookSlug}/${cantoNumber}/${chapterNumber}/${verseNumber}`;
    }
    return `/lib/${bookSlug}/${chapterNumber}/${verseNumber}`;
  };

  const dateFormatted = format(date, 'd MMMM yyyy', {
    locale: language === 'ua' ? uk : undefined,
  });

  const hasContent = noteContent.trim().length > 0 || verseNotesForDate.length > 0 || highlightsForDate.length > 0;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            {t('Щоденник', 'Journal')}
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {dateFormatted}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mood Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t('Настрій:', 'Mood:')}
          </span>
          <div className="flex items-center gap-1">
            {(Object.entries(moodIcons) as [Mood, typeof moodIcons[Mood]][]).map(([mood, data]) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={cn(
                  'p-1.5 rounded-full transition-all',
                  selectedMood === mood
                    ? `${data.color} bg-muted scale-110`
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                title={language === 'ua' ? data.label_ua : data.label_en}
              >
                {data.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Note Editor */}
        <div className="space-y-2">
          {isEditing ? (
            <>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={t(
                  'Записи дня, реалізації, духовні інсайти...',
                  'Daily reflections, realizations, spiritual insights...'
                )}
                className="min-h-[120px] text-sm resize-none"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSave}>
                  {t('Зберегти', 'Save')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setNoteContent(todayNote?.content || '');
                    setIsEditing(false);
                  }}
                >
                  {t('Скасувати', 'Cancel')}
                </Button>
              </div>
            </>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className={cn(
                'min-h-[60px] p-3 rounded-lg border border-dashed border-border cursor-text',
                'hover:border-primary/50 hover:bg-muted/30 transition-colors',
                noteContent ? 'border-solid' : ''
              )}
            >
              {noteContent ? (
                <p className="text-sm whitespace-pre-wrap">{noteContent}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {t('Натисніть, щоб додати запис...', 'Click to add entry...')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Verse Notes & Highlights Section */}
        {(verseNotesForDate.length > 0 || highlightsForDate.length > 0) && (
          <div className="pt-2 border-t">
            <button
              onClick={() => setShowVerseNotes(!showVerseNotes)}
              className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {t('Нотатки з книг цього дня', 'Book notes from this day')}
                <Badge variant="secondary" className="text-xs">
                  {verseNotesForDate.length + highlightsForDate.length}
                </Badge>
              </span>
              {showVerseNotes ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showVerseNotes && (
              <div className="mt-3 space-y-3">
                {/* Highlights */}
                {highlightsForDate.map(highlight => (
                  <Link
                    key={highlight.id}
                    to={buildVerseLink(
                      highlight.bookSlug,
                      highlight.cantoNumber,
                      highlight.chapterNumber,
                      highlight.verseNumber
                    )}
                    className="block group"
                  >
                    <div className={cn(
                      'p-2 rounded-lg transition-colors',
                      getHighlightColorClass(highlight.color),
                      'hover:ring-2 hover:ring-primary/20'
                    )}>
                      <div className="flex items-start gap-2">
                        <Highlighter className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-2">"{highlight.text}"</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {highlight.verseRef}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Verse Notes */}
                {verseNotesForDate.map(note => (
                  <Link
                    key={note.id}
                    to={buildVerseLink(
                      note.bookSlug,
                      note.cantoNumber,
                      note.chapterNumber,
                      note.verseNumber
                    )}
                    className="block group"
                  >
                    <div className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-start gap-2">
                        <StickyNote className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-2">{note.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              {note.verseRef}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                            </p>
                            {note.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                {note.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                                {note.tags.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{note.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!hasContent && (
          <div className="text-center py-4">
            <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {t(
                'Додайте записи або виділення в книгах',
                'Add entries or highlights in books'
              )}
            </p>
          </div>
        )}

        {/* Link to all notes */}
        {(verseNotesForDate.length > 0 || highlightsForDate.length > 0) && (
          <div className="pt-2 border-t">
            <Link
              to="/bookmarks"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              {t('Всі закладки та нотатки', 'All bookmarks & notes')}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DailyNotes;
