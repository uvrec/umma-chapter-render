/**
 * ReadingGoal - "Page by Page Be a Sage" feature
 * Helps users set and track reading goals for Vedic scriptures
 */

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSadhana } from '@/hooks/useSadhana';
import { ReadingGoal as ReadingGoalType } from '@/services/sadhanaService';
import {
  Book,
  Calendar,
  Target,
  Clock,
  Bell,
  Plus,
  Check,
  ChevronRight,
  LogIn,
  Trash2,
  BookOpen,
} from 'lucide-react';

interface ReadingGoalProps {
  className?: string;
}

// Available books for reading goals
const BOOKS = [
  { slug: 'bg', title: 'Бгаґавад-ґіта', titleEn: 'Bhagavad-gita', pages: 700, slokas: 700 },
  { slug: 'sb', title: 'Шрімад-Бгаґаватам', titleEn: 'Srimad-Bhagavatam', pages: 18000, slokas: 12000 },
  { slug: 'cc', title: 'Чайтан\'я-чарітамріта', titleEn: 'Caitanya-caritamrta', pages: 6000, slokas: 11555 },
  { slug: 'kb', title: 'Крішна', titleEn: 'Krsna Book', pages: 1800, slokas: 0 },
  { slug: 'tqk', title: 'Вчення Господа Капіли', titleEn: 'Teachings of Lord Kapila', pages: 300, slokas: 0 },
  { slug: 'nod', title: 'Нектар відданості', titleEn: 'Nectar of Devotion', pages: 420, slokas: 0 },
  { slug: 'noi', title: 'Нектар настанов', titleEn: 'Nectar of Instruction', pages: 80, slokas: 11 },
];

const TIME_UNITS = [
  { value: 'day' as const, label: 'день', labelEn: 'day' },
  { value: 'week' as const, label: 'тиждень', labelEn: 'week' },
  { value: 'month' as const, label: 'місяць', labelEn: 'month' },
  { value: 'year' as const, label: 'рік', labelEn: 'year' },
];

export function ReadingGoal({ className }: ReadingGoalProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { readingGoals, addReadingGoal, updateGoalProgress, markGoalComplete, isLoading } = useSadhana();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [duration, setDuration] = useState(12);
  const [trackBy, setTrackBy] = useState<'pages' | 'slokas'>('pages');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('06:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected book details
  const selectedBookDetails = useMemo(() => {
    return BOOKS.find(b => b.slug === selectedBook);
  }, [selectedBook]);

  // Calculate target per day
  const targetPerDay = useMemo(() => {
    if (!selectedBookDetails) return 0;

    const total = trackBy === 'pages' ? selectedBookDetails.pages : selectedBookDetails.slokas;
    if (total === 0) return 0;

    // Convert duration to days
    let totalDays = duration;
    switch (timeUnit) {
      case 'week': totalDays = duration * 7; break;
      case 'month': totalDays = duration * 30; break;
      case 'year': totalDays = duration * 365; break;
    }

    return Math.ceil(total / totalDays);
  }, [selectedBookDetails, duration, timeUnit, trackBy]);

  // Handle form submit
  const handleSubmit = async () => {
    if (!selectedBookDetails || !user?.id) return;

    setIsSubmitting(true);
    try {
      await addReadingGoal({
        bookSlug: selectedBook,
        bookTitle: language === 'ua' ? selectedBookDetails.title : selectedBookDetails.titleEn,
        timeUnit,
        duration,
        trackBy,
        totalPages: selectedBookDetails.pages,
        totalSlokas: selectedBookDetails.slokas,
        startedAt: new Date().toISOString().split('T')[0],
        currentPage: 0,
        currentSloka: 0,
        isActive: true,
        reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime : undefined,
      });

      // Reset form
      setShowForm(false);
      setSelectedBook('');
      setDuration(12);
      setTimeUnit('month');
      setTrackBy('pages');
      setReminderEnabled(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate progress for a goal
  const calculateProgress = (goal: ReadingGoalType) => {
    const total = goal.trackBy === 'pages' ? (goal.totalPages || 0) : (goal.totalSlokas || 0);
    const current = goal.trackBy === 'pages' ? goal.currentPage : goal.currentSloka;
    if (total === 0) return 0;
    return Math.min(100, Math.round((current / total) * 100));
  };

  // If not logged in
  if (!user) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <LogIn className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('Увійдіть для налаштування цілей', 'Sign in to set reading goals')}
          </h3>
          <Button asChild>
            <a href="/auth">{t('Увійти', 'Sign In')}</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-semibold">
              {t('Сторінка за сторінкою', 'Page by Page')}
            </h2>
          </div>
          {!showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" />
              {t('Нова ціль', 'New Goal')}
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t(
            'Встановіть ціль читання та відстежуйте прогрес',
            'Set a reading goal and track your progress'
          )}
        </p>
      </Card>

      {/* New Goal Form */}
      {showForm && (
        <Card className="p-4 border-brand-200 dark:border-brand-800">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t('Нова ціль читання', 'New Reading Goal')}
          </h3>

          <div className="space-y-4">
            {/* Book selection */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {t('Оберіть книгу', 'Select a book')}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {BOOKS.map(book => (
                  <button
                    key={book.slug}
                    onClick={() => setSelectedBook(book.slug)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedBook === book.slug
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                        : 'border-border hover:border-brand-300'
                    }`}
                  >
                    <div className="font-medium text-sm">
                      {language === 'ua' ? book.title : book.titleEn}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {book.pages} {t('стор.', 'pages')}
                      {book.slokas > 0 && ` / ${book.slokas} ${t('шлок', 'slokas')}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedBook && (
              <>
                {/* Time unit selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    {t('Часова одиниця', 'Time unit')}
                  </Label>
                  <div className="flex gap-2">
                    {TIME_UNITS.map(unit => (
                      <button
                        key={unit.value}
                        onClick={() => setTimeUnit(unit.value)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                          timeUnit === unit.value
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 font-medium'
                            : 'border-border hover:border-brand-300'
                        }`}
                      >
                        {language === 'ua' ? unit.label : unit.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    {t('Тривалість', 'Duration')}
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      {TIME_UNITS.find(u => u.value === timeUnit)?.[language === 'ua' ? 'label' : 'labelEn']}
                      {duration > 1 && (language === 'ua' ? 'ів' : 's')}
                    </span>
                  </div>
                </div>

                {/* Track by pages or slokas */}
                {selectedBookDetails && selectedBookDetails.slokas > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      {t('Відстежувати за', 'Track by')}
                    </Label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTrackBy('pages')}
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                          trackBy === 'pages'
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 font-medium'
                            : 'border-border hover:border-brand-300'
                        }`}
                      >
                        {t('Сторінками', 'Pages')}
                      </button>
                      <button
                        onClick={() => setTrackBy('slokas')}
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                          trackBy === 'slokas'
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 font-medium'
                            : 'border-border hover:border-brand-300'
                        }`}
                      >
                        {t('Шлоками', 'Slokas')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Target per day display */}
                <Card className="p-4 bg-brand-50 dark:bg-brand-950 border-brand-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-600">
                      {targetPerDay}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trackBy === 'pages'
                        ? t('сторінок на день', 'pages per day')
                        : t('шлок на день', 'slokas per day')
                      }
                    </div>
                  </div>
                </Card>

                {/* Reminder */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm">{t('Нагадування', 'Reminder')}</Label>
                  </div>
                  <Switch
                    checked={reminderEnabled}
                    onCheckedChange={setReminderEnabled}
                  />
                </div>

                {reminderEnabled && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedBook('');
                    }}
                  >
                    {t('Скасувати', 'Cancel')}
                  </Button>
                  <Button
                    className="flex-1 bg-brand-600 hover:bg-brand-700"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        {t('Створити', 'Create')}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Active Goals */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : readingGoals.length === 0 && !showForm ? (
        <Card className="p-6 text-center">
          <Book className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">
            {t('Немає активних цілей', 'No active goals')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t(
              'Створіть ціль читання, щоб почати відстежувати прогрес',
              'Create a reading goal to start tracking your progress'
            )}
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            {t('Створити ціль', 'Create Goal')}
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {readingGoals.filter(g => g.isActive).map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdateProgress={updateGoalProgress}
              onComplete={markGoalComplete}
            />
          ))}
        </div>
      )}

      {/* Completed Goals (collapsed) */}
      {readingGoals.filter(g => !g.isActive).length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm text-muted-foreground flex items-center gap-1">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            {t('Завершені цілі', 'Completed goals')} ({readingGoals.filter(g => !g.isActive).length})
          </summary>
          <div className="mt-2 space-y-2">
            {readingGoals.filter(g => !g.isActive).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={updateGoalProgress}
                onComplete={markGoalComplete}
                isCompleted
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// Goal Card component
interface GoalCardProps {
  goal: ReadingGoalType;
  onUpdateProgress: (goalId: string, currentPage?: number, currentSloka?: number) => Promise<void>;
  onComplete: (goalId: string) => Promise<void>;
  isCompleted?: boolean;
}

function GoalCard({ goal, onUpdateProgress, onComplete, isCompleted }: GoalCardProps) {
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(
    goal.trackBy === 'pages' ? goal.currentPage : goal.currentSloka
  );

  const total = goal.trackBy === 'pages' ? (goal.totalPages || 0) : (goal.totalSlokas || 0);
  const current = goal.trackBy === 'pages' ? goal.currentPage : goal.currentSloka;
  const progress = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  const handleSave = async () => {
    if (goal.trackBy === 'pages') {
      await onUpdateProgress(goal.id!, currentValue, undefined);
    } else {
      await onUpdateProgress(goal.id!, undefined, currentValue);
    }
    setIsEditing(false);
  };

  return (
    <Card className={`p-4 ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold">{goal.bookTitle}</h4>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            {t('Ціль:', 'Target:')} {goal.targetPerDay} {goal.trackBy === 'pages' ? t('стор./день', 'pages/day') : t('шлок/день', 'slokas/day')}
          </div>
        </div>
        {!isCompleted && progress >= 100 && (
          <Button
            size="sm"
            variant="ghost"
            className="text-green-600"
            onClick={() => onComplete(goal.id!)}
          >
            <Check className="w-4 h-4 mr-1" />
            {t('Завершити', 'Complete')}
          </Button>
        )}
      </div>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">
            {t('Прогрес', 'Progress')}
          </span>
          <span className="font-medium">
            {current} / {total} ({progress}%)
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Update progress */}
      {!isCompleted && (
        <div className="mt-3 pt-3 border-t">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={total}
                value={currentValue}
                onChange={(e) => setCurrentValue(parseInt(e.target.value) || 0)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                / {total}
              </span>
              <Button size="sm" onClick={handleSave}>
                {t('Зберегти', 'Save')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                {t('Скасувати', 'Cancel')}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                setCurrentValue(current);
                setIsEditing(true);
              }}
            >
              {t('Оновити прогрес', 'Update Progress')}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
