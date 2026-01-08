/**
 * SadhanaStats - Statistics view
 * Shows monthly aggregated statistics with charts
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSadhana } from '@/hooks/useSadhana';
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Music,
  Book,
  Moon,
  Flame,
  TrendingUp,
  LogIn,
} from 'lucide-react';

interface SadhanaStatsProps {
  className?: string;
}

export function SadhanaStats({ className }: SadhanaStatsProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { monthlyStats, refreshStats, streak, isLoadingStats } = useSadhana();

  // State
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Load stats on mount and when year changes
  useEffect(() => {
    if (user?.id) {
      refreshStats(selectedYear);
    }
  }, [selectedYear, user?.id, refreshStats]);

  // Navigate years
  const goToPreviousYear = () => setSelectedYear(prev => prev - 1);
  const goToNextYear = () => {
    if (selectedYear < new Date().getFullYear()) {
      setSelectedYear(prev => prev + 1);
    }
  };

  // Get month name
  const getMonthName = (monthNum: number) => {
    const date = new Date(2000, monthNum - 1, 1);
    return date.toLocaleDateString(
      language === 'ua' ? 'uk-UA' : 'en-US',
      { month: 'short' }
    );
  };

  // If not logged in
  if (!user) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <LogIn className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('Увійдіть для перегляду статистики', 'Sign in to view statistics')}
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
      {/* Summary card */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-semibold">
            {t('Статистика', 'Statistics')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-brand-50 dark:bg-brand-950 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-brand-500" />
            </div>
            <div className="text-2xl font-bold text-brand-600">
              {streak.currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('Поточний streak', 'Current streak')}
            </div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {streak.longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('Найдовший', 'Longest')}
            </div>
          </div>
        </div>
      </Card>

      {/* Year navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPreviousYear}>
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <h2 className="text-lg font-semibold">{selectedYear}</h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextYear}
          disabled={selectedYear >= new Date().getFullYear()}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Monthly stats */}
      {isLoadingStats ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : monthlyStats.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            {t('Немає даних за цей рік', 'No data for this year')}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {monthlyStats.map((stat) => (
            <Card key={stat.monthNum} className="p-4">
              <div className="flex items-center gap-4">
                {/* Month name */}
                <div className="w-12 text-lg font-bold text-brand-600 capitalize">
                  {getMonthName(stat.monthNum)}
                </div>

                {/* Stats row */}
                <div className="flex-1 flex items-center gap-4 text-sm text-muted-foreground">
                  {/* Wake up */}
                  <div className="flex items-center gap-1" title={t('Середній підйом', 'Avg wake up')}>
                    <Sun className="w-4 h-4" />
                    <span>{stat.avgWakeUp || '—'}</span>
                  </div>

                  {/* Japa */}
                  <div className="flex items-center gap-1" title={t('Всього джапи', 'Total japa')}>
                    <Music className="w-4 h-4" />
                    <span>{stat.totalJapa}</span>
                  </div>

                  {/* Reading */}
                  <div className="flex items-center gap-1" title={t('Читання (год:хв)', 'Reading (hrs:min)')}>
                    <Book className="w-4 h-4" />
                    <span>
                      {Math.floor(stat.totalReadingMinutes / 60)}:
                      {String(stat.totalReadingMinutes % 60).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Bed time */}
                  <div className="flex items-center gap-1" title={t('Середній відбій', 'Avg bed time')}>
                    <Moon className="w-4 h-4" />
                    <span>{stat.avgBedTime || '—'}</span>
                  </div>
                </div>

                {/* Days tracked / streak */}
                <div className="text-right">
                  <div className="text-lg font-bold">{stat.daysTracked}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('днів', 'days')}
                  </div>
                </div>
              </div>

              {/* Progress bar - japa quality */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{t('Якість джапи (до 7:30)', 'Japa quality (before 7:30)')}</span>
                  <span>{stat.japaQualityPercent}%</span>
                </div>
                <Progress value={stat.japaQualityPercent} className="h-2" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
