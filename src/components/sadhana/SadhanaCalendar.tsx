/**
 * SadhanaCalendar - "My Graph" view
 * Shows daily sadhana entries in a calendar-style list with progress indicators
 */

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSadhana } from '@/hooks/useSadhana';
import { SadhanaDaily } from '@/services/sadhanaService';
import {
  Sun,
  Music,
  Book,
  Moon,
  ChevronLeft,
  ChevronRight,
  Flame,
  LogIn,
} from 'lucide-react';

interface SadhanaCalendarProps {
  onSelectDate?: (date: string) => void;
  selectedDate?: string;
}

export function SadhanaCalendar({ onSelectDate, selectedDate }: SadhanaCalendarProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { getDailyEntries, streak, config, isLoading } = useSadhana();

  // State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<SadhanaDaily[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

  // Load entries for current month
  useEffect(() => {
    if (!user?.id) return;

    const loadEntries = async () => {
      setIsLoadingEntries(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const data = await getDailyEntries(startDate, endDate);
      setEntries(data);
      setIsLoadingEntries(false);
    };

    loadEntries();
  }, [currentMonth, user?.id, getDailyEntries]);

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    if (next <= new Date()) {
      setCurrentMonth(next);
    }
  };

  // Get days in current month view
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const days: Array<{
      date: string;
      dayNum: number;
      weekDay: string;
      entry?: SadhanaDaily;
      isToday: boolean;
      isFuture: boolean;
    }> = [];

    const lastDay = new Date(year, month + 1, 0).getDate();
    const entryMap = new Map(entries.map(e => [e.entryDate, e]));

    for (let d = lastDay; d >= 1; d--) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const weekDays = language === 'ua'
        ? ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

      days.push({
        date: dateStr,
        dayNum: d,
        weekDay: weekDays[date.getDay()],
        entry: entryMap.get(dateStr),
        isToday: dateStr === todayStr,
        isFuture: date > today,
      });
    }

    return days;
  }, [currentMonth, entries, language]);

  // Calculate completion for an entry
  const calculateCompletion = (entry: SadhanaDaily): number => {
    const target = config?.japaRoundsTarget || 16;
    const japaPercent = Math.min(100, (entry.japaTotal / target) * 100);
    const readingTarget = config?.readingMinutesTarget || 30;
    const readingPercent = Math.min(100, (entry.readingMinutes / readingTarget) * 100);

    return Math.round((japaPercent + readingPercent) / 2);
  };

  // Format month name
  const monthName = currentMonth.toLocaleDateString(
    language === 'ua' ? 'uk-UA' : 'en-US',
    { month: 'long', year: 'numeric' }
  );

  // If not logged in
  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <LogIn className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('Увійдіть для перегляду графіка', 'Sign in to view your graph')}
          </h3>
          <Button asChild>
            <a href="/auth">{t('Увійти', 'Sign In')}</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with streak */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-500" />
            <span className="font-semibold">
              {t('Streak:', 'Streak:')} {streak.currentStreak} {t('днів', 'days')}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('Найдовший:', 'Longest:')} {streak.longestStreak}
          </div>
        </div>
      </Card>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <h2 className="text-lg font-semibold capitalize">{monthName}</h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          disabled={currentMonth.getMonth() === new Date().getMonth() &&
            currentMonth.getFullYear() === new Date().getFullYear()}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Days list */}
      {isLoading || isLoadingEntries ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-2">
          {daysInMonth.map(({ date, dayNum, weekDay, entry, isToday, isFuture }) => (
            <Card
              key={date}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedDate === date ? 'ring-2 ring-brand-500' : ''
              } ${isToday ? 'bg-brand-50 dark:bg-brand-950' : ''} ${
                isFuture ? 'opacity-50 pointer-events-none' : ''
              }`}
              onClick={() => !isFuture && onSelectDate?.(date)}
            >
              <div className="flex items-center gap-4">
                {/* Day number */}
                <div className={`text-2xl font-bold w-12 ${isToday ? 'text-brand-600' : ''}`}>
                  {dayNum}
                </div>
                <div className="text-sm text-muted-foreground w-8 uppercase">
                  {weekDay}
                </div>

                {/* Entry indicators */}
                <div className="flex-1 flex items-center gap-3 text-muted-foreground">
                  {/* Wake up */}
                  <div className="flex items-center gap-1" title={t('Підйом', 'Wake up')}>
                    <Sun className="w-4 h-4" />
                    <span className="text-xs">
                      {entry?.wakeUpTime || '—'}
                    </span>
                  </div>

                  {/* Japa */}
                  <div className="flex items-center gap-1" title={t('Джапа', 'Japa')}>
                    <Music className="w-4 h-4" />
                    <span className="text-xs">
                      {entry?.japaTotal || 0}
                    </span>
                  </div>

                  {/* Reading */}
                  <div className="flex items-center gap-1" title={t('Читання', 'Reading')}>
                    <Book className="w-4 h-4" />
                    <span className="text-xs">
                      {entry ? `${Math.floor(entry.readingMinutes / 60)}:${String(entry.readingMinutes % 60).padStart(2, '0')}` : '0'}
                    </span>
                  </div>

                  {/* Bed time */}
                  <div className="flex items-center gap-1" title={t('Відбій', 'Bed time')}>
                    <Moon className="w-4 h-4" />
                    <span className="text-xs">
                      {entry?.bedTime || '—'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                {entry && (
                  <div className="w-24">
                    <Progress
                      value={calculateCompletion(entry)}
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
