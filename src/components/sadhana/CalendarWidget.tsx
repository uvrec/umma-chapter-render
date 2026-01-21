/**
 * CalendarWidget - Мінімалістичний віджет вайшнавського календаря для Sadhana
 *
 * Показує:
 * - Сьогоднішні події (екадаші, свята, явлення)
 * - Наступний екадаші (якщо сьогодні не екадаші)
 * - Рівень посту
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTodayEvents, getNextEkadashi } from '@/services/calendarService';
import { CalendarEventDisplay, TodayEvents } from '@/types/calendar';
import { cn } from '@/lib/utils';
import {
  Moon,
  Sun,
  Calendar,
  Sparkles,
  ChevronRight,
  UtensilsCrossed,
} from 'lucide-react';

interface CalendarWidgetProps {
  className?: string;
  compact?: boolean;
}

// Іконки за типом події
const eventIcons: Record<string, typeof Moon> = {
  ekadashi: Moon,
  festival: Sparkles,
  appearance: Sun,
  disappearance: Moon,
  parana: UtensilsCrossed,
};

// Кольори за типом події
const eventColors: Record<string, string> = {
  ekadashi: 'text-indigo-500',
  festival: 'text-amber-500',
  appearance: 'text-emerald-500',
  disappearance: 'text-purple-500',
  parana: 'text-orange-500',
};

// Рівні посту
const fastingLabels = {
  nirjala: { uk: 'Повний піст (без води)', en: 'Complete fast (no water)' },
  full: { uk: 'Повний піст', en: 'Full fast' },
  half: { uk: 'Напівпіст', en: 'Half fast' },
  none: { uk: 'Без посту', en: 'No fast' },
};

export function CalendarWidget({ className, compact = false }: CalendarWidgetProps) {
  const { t, language, getLocalizedPath } = useLanguage();
  const [todayData, setTodayData] = useState<TodayEvents | null>(null);
  const [nextEkadashi, setNextEkadashi] = useState<{
    event: CalendarEventDisplay;
    daysUntil: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCalendarData() {
      try {
        const [today, upcoming] = await Promise.all([
          getTodayEvents(),
          getNextEkadashi(),
        ]);

        setTodayData(today);

        if (upcoming && upcoming.days_until > 0) {
          setNextEkadashi({
            event: upcoming.event,
            daysUntil: upcoming.days_until,
          });
        }
      } catch (error) {
        console.error('Failed to load calendar data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCalendarData();
  }, []);

  if (isLoading) {
    return null; // Не показуємо лоадер для мінімалізму
  }

  const hasEvents = todayData?.events && todayData.events.length > 0;
  const todayEkadashi = todayData?.events?.find(e => e.is_ekadashi);

  // Якщо нічого показувати - показуємо тільки наступний екадаші
  if (!hasEvents && !nextEkadashi) {
    return null;
  }

  // Компактний режим - тільки одна лінія
  if (compact) {
    if (todayEkadashi) {
      return (
        <Link
          to={getLocalizedPath('/calendar')}
          className={cn(
            "flex items-center gap-2 text-sm py-2 px-3 rounded-lg",
            "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300",
            className
          )}
        >
          <Moon className="w-4 h-4" />
          <span className="font-medium">
            {language === 'uk' ? todayEkadashi.name_uk : todayEkadashi.name_en}
          </span>
          {todayEkadashi.fasting_level && todayEkadashi.fasting_level !== 'none' && (
            <span className="text-xs opacity-75">
              • {fastingLabels[todayEkadashi.fasting_level][language]}
            </span>
          )}
        </Link>
      );
    }

    if (nextEkadashi) {
      return (
        <Link
          to={getLocalizedPath('/calendar')}
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            "hover:text-foreground transition-colors",
            className
          )}
        >
          <Calendar className="w-4 h-4" />
          <span>
            {t('Екадаші через', 'Ekadashi in')} {nextEkadashi.daysUntil}{' '}
            {nextEkadashi.daysUntil === 1
              ? t('день', 'day')
              : nextEkadashi.daysUntil < 5
              ? t('дні', 'days')
              : t('днів', 'days')}
          </span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      );
    }

    return null;
  }

  // Повний режим
  return (
    <div className={cn("space-y-3", className)}>
      {/* Сьогоднішні події */}
      {hasEvents && (
        <div className="space-y-2">
          {todayData?.events?.map((event) => {
            const Icon = eventIcons[event.event_type] || Calendar;
            const colorClass = eventColors[event.event_type] || 'text-muted-foreground';

            return (
              <Link
                key={event.event_id}
                to={getLocalizedPath(
                  event.is_ekadashi
                    ? `/calendar/ekadashi/${event.event_id}`
                    : '/calendar'
                )}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-colors",
                  "bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", colorClass)} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {language === 'uk' ? event.name_uk : event.name_en}
                  </div>
                  {event.fasting_level && event.fasting_level !== 'none' && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <UtensilsCrossed className="w-3 h-3" />
                      {fastingLabels[event.fasting_level][language]}
                    </div>
                  )}
                  {event.parana_start && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                      {t('Парана:', 'Parana:')} {event.parana_start}
                      {event.parana_end && ` - ${event.parana_end}`}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Наступний екадаші */}
      {!todayEkadashi && nextEkadashi && (
        <Link
          to={getLocalizedPath('/calendar')}
          className={cn(
            "flex items-center justify-between py-2 text-sm",
            "text-muted-foreground hover:text-foreground transition-colors"
          )}
        >
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            <span>
              {language === 'uk' ? nextEkadashi.event.name_uk : nextEkadashi.event.name_en}
            </span>
          </div>
          <span className="text-xs">
            {t('через', 'in')} {nextEkadashi.daysUntil}{' '}
            {nextEkadashi.daysUntil === 1
              ? t('день', 'day')
              : nextEkadashi.daysUntil < 5
              ? t('дні', 'days')
              : t('днів', 'days')}
          </span>
        </Link>
      )}
    </div>
  );
}
