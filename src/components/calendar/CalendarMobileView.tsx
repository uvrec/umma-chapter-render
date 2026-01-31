/**
 * CalendarMobileView - Мобільне подання календаря
 * Функціональний мінімалізм без карток та контурів
 */

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { MonthData, DayData, CalendarEventDisplay } from '@/types/calendar';
import { format, isSameDay, startOfDay } from 'date-fns';
import { uk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ViewMode = 'list' | 'month';

interface CalendarMobileViewProps {
  monthData: MonthData;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  language: 'uk' | 'en';
  weekDays: string[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  monthName: string;
  year: number;
  selectedDateEvents: CalendarEventDisplay[];
}

// Get event color
const getEventColor = (event: CalendarEventDisplay): string => {
  if (event.category_color) return event.category_color;
  if (event.is_ekadashi) return '#8B5CF6';
  if (event.event_type === 'appearance') return '#F59E0B';
  if (event.event_type === 'disappearance') return '#6B7280';
  return '#3B82F6';
};

// Compact Month Widget - no borders
function CompactMonthWidget({
  monthData,
  selectedDate,
  onSelectDate,
  weekDays,
}: {
  monthData: MonthData;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  weekDays: string[];
}) {
  return (
    <div className="px-1">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              'text-center text-[11px] font-medium py-1',
              i >= 5 ? 'text-red-500/70' : 'text-muted-foreground'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {monthData.days.map((day, index) => {
          const isSelected = selectedDate && isSameDay(day.date, selectedDate);
          const hasEvents = day.events.length > 0;
          const isToday = day.is_today;

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                'relative aspect-square flex flex-col items-center justify-center rounded-lg transition-all',
                'active:scale-95 touch-manipulation',
                day.is_current_month ? 'text-foreground' : 'text-muted-foreground/30',
                isToday && !isSelected && 'bg-primary/10',
                isSelected && 'bg-primary text-primary-foreground'
              )}
            >
              <span
                className={cn(
                  'text-sm',
                  isToday && !isSelected && 'text-primary font-semibold'
                )}
              >
                {day.day_of_month}
              </span>

              {/* Event dots */}
              {hasEvents && day.is_current_month && (
                <div className="flex gap-0.5 mt-0.5 absolute bottom-1">
                  {day.events.slice(0, 3).map((event, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: isSelected ? 'currentColor' : getEventColor(event),
                        opacity: isSelected ? 0.7 : 1,
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Agenda List View - minimal
function AgendaListView({
  monthData,
  selectedDate,
  onSelectDate,
  language,
}: {
  monthData: MonthData;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  language: 'uk' | 'en';
}) {
  const daysWithEvents = useMemo(() => {
    const today = startOfDay(new Date());
    return monthData.days
      .filter(day => day.events.length > 0 && day.date >= today)
      .slice(0, 15);
  }, [monthData]);

  if (daysWithEvents.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        {language === 'uk' ? 'Немає подій цього місяця' : 'No events this month'}
      </div>
    );
  }

  return (
    <div className="space-y-1 mt-4">
      {daysWithEvents.map((day) => {
        const isSelected = selectedDate && isSameDay(day.date, selectedDate);
        const isToday = day.is_today;

        return (
          <button
            key={day.date.toISOString()}
            onClick={() => onSelectDate(day.date)}
            className={cn(
              'flex items-center gap-3 w-full text-left px-2 py-2.5 rounded-lg transition-colors',
              'active:bg-muted touch-manipulation',
              isSelected && 'bg-muted'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex flex-col items-center justify-center text-xs flex-shrink-0',
                isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}
            >
              <span className="font-medium uppercase leading-none text-[10px]">
                {format(day.date, 'EEE', { locale: language === 'uk' ? uk : undefined })}
              </span>
              <span className="text-base font-bold leading-none mt-0.5">{day.day_of_month}</span>
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              {day.events.slice(0, 2).map((event, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getEventColor(event) }}
                  />
                  <span className="text-sm truncate">
                    {language === 'uk' ? event.name_uk : event.name_en}
                  </span>
                </div>
              ))}
              {day.events.length > 2 && (
                <span className="text-xs text-muted-foreground ml-3.5">
                  +{day.events.length - 2}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Selected Day Events - minimal
function SelectedDayEvents({
  day,
  language,
}: {
  day: DayData | null;
  language: 'uk' | 'en';
}) {
  if (!day || day.events.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm mt-4">
        {language === 'uk' ? 'Немає подій' : 'No events'}
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">
        {format(day.date, 'd MMMM', { locale: language === 'uk' ? uk : undefined })}
      </p>
      {day.events.map((event, i) => (
        <div
          key={i}
          className="px-3 py-3 rounded-lg"
          style={{ backgroundColor: `${getEventColor(event)}10` }}
        >
          <div className="flex items-start gap-2">
            <div
              className="w-1 h-full min-h-[20px] rounded-full mt-0.5"
              style={{ backgroundColor: getEventColor(event) }}
            />
            <div>
              <p className="font-medium text-sm">
                {language === 'uk' ? event.name_uk : event.name_en}
              </p>
              {(event.is_ekadashi || event.event_type) && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {event.is_ekadashi
                    ? language === 'uk' ? 'Екадаші' : 'Ekadashi'
                    : event.event_type === 'appearance'
                    ? language === 'uk' ? 'Явлення' : 'Appearance'
                    : event.event_type === 'disappearance'
                    ? language === 'uk' ? 'Відхід' : 'Disappearance'
                    : null}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CalendarMobileView({
  monthData,
  selectedDate,
  onSelectDate,
  language,
  weekDays,
  onPreviousMonth,
  onNextMonth,
  onGoToToday,
  monthName,
  year,
}: CalendarMobileViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return monthData.days.find(d => isSameDay(d.date, selectedDate)) || null;
  }, [monthData, selectedDate]);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onPreviousMonth} className="h-9 w-9">
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <button
          onClick={onGoToToday}
          className="text-base font-semibold capitalize active:opacity-70 touch-manipulation"
        >
          {monthName} {year}
        </button>

        <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-9 w-9">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* View toggle - minimal */}
      <div className="flex items-center justify-center gap-1">
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="h-8 px-3 text-xs"
        >
          <List className="h-3.5 w-3.5 mr-1.5" />
          {language === 'uk' ? 'Список' : 'List'}
        </Button>
        <Button
          variant={viewMode === 'month' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('month')}
          className="h-8 px-3 text-xs"
        >
          <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
          {language === 'uk' ? 'Місяць' : 'Month'}
        </Button>
      </div>

      {/* Compact calendar */}
      <CompactMonthWidget
        monthData={monthData}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        weekDays={weekDays}
      />

      {/* Content */}
      {viewMode === 'list' ? (
        <AgendaListView
          monthData={monthData}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          language={language}
        />
      ) : (
        <SelectedDayEvents day={selectedDay} language={language} />
      )}
    </div>
  );
}

export default CalendarMobileView;
