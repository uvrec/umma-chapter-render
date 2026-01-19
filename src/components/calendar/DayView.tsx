/**
 * DayView - NotePlan-like daily timeline view
 *
 * Features:
 * - Hour-by-hour time scale
 * - Event blocks positioned by time
 * - Routine items on timeline
 * - Current time indicator
 * - Day navigation
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { format, addDays, subDays, isToday, isSameDay } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRoutines } from '@/hooks/useRoutines';
import { ROUTINE_CATEGORIES } from '@/types/routines';
import type { CalendarEventDisplay } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Circle,
  CheckCircle2,
} from 'lucide-react';

interface DayViewProps {
  initialDate?: Date;
  events?: CalendarEventDisplay[];
  onDateChange?: (date: Date) => void;
  className?: string;
}

// Time scale configuration
const HOUR_HEIGHT = 60; // pixels per hour
const START_HOUR = 4;   // 4:00 AM
const END_HOUR = 23;    // 11:00 PM
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

export function DayView({ initialDate, events = [], onDateChange, className }: DayViewProps) {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const timelineRef = useRef<HTMLDivElement>(null);

  const {
    todayRoutines,
    getRoutineCompletion,
    toggleRoutineCompletion,
  } = useRoutines(selectedDate);

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (isToday(selectedDate) && timelineRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const scrollTo = (currentHour - START_HOUR - 1) * HOUR_HEIGHT;
      timelineRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [selectedDate]);

  // Handle date navigation
  const goToPreviousDay = () => {
    const newDate = subDays(selectedDate, 1);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const goToNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    onDateChange?.(today);
  };

  // Calculate current time position
  const currentTimePosition = useMemo(() => {
    if (!isToday(selectedDate)) return null;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (hours < START_HOUR || hours > END_HOUR) return null;
    return ((hours - START_HOUR) + minutes / 60) * HOUR_HEIGHT;
  }, [selectedDate]);

  // Update current time every minute
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Parse time string to hours
  const parseTime = (time?: string): number | null => {
    if (!time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    return hours + (minutes || 0) / 60;
  };

  // Calculate event position and height
  const getEventStyle = (startTime?: string, endTime?: string, duration?: number) => {
    const start = parseTime(startTime);
    if (start === null || start < START_HOUR || start > END_HOUR) return null;

    let height = HOUR_HEIGHT; // Default 1 hour
    if (endTime) {
      const end = parseTime(endTime);
      if (end !== null && end > start) {
        height = (end - start) * HOUR_HEIGHT;
      }
    } else if (duration) {
      height = (duration / 60) * HOUR_HEIGHT;
    }

    return {
      top: (start - START_HOUR) * HOUR_HEIGHT,
      height: Math.max(height, 24), // Minimum height
    };
  };

  // Get day name
  const dayName = format(selectedDate, 'EEEE', {
    locale: language === 'uk' ? uk : undefined,
  });
  const dateFormatted = format(selectedDate, 'd MMMM yyyy', {
    locale: language === 'uk' ? uk : undefined,
  });

  // Events for this day (filter and position)
  const dayEvents = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return events
      .filter(e => e.event_date === dateStr)
      .map(event => ({
        ...event,
        style: getEventStyle(event.sunrise_time), // Use sunrise as default time for events
      }));
  }, [events, selectedDate]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header with navigation */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <h2 className="text-lg font-semibold capitalize">{dayName}</h2>
            <p className="text-sm text-muted-foreground">{dateFormatted}</p>
          </div>

          <Button variant="ghost" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {!isToday(selectedDate) && (
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="mx-auto mt-2"
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            {t('Сьогодні', 'Today')}
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {/* Timeline */}
        <div
          ref={timelineRef}
          className="relative overflow-y-auto"
          style={{ height: '500px' }}
        >
          {/* Time labels column */}
          <div className="absolute left-0 top-0 w-14 bg-background z-10">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="absolute left-0 w-14 text-xs text-muted-foreground text-right pr-2"
                style={{
                  top: (hour - START_HOUR) * HOUR_HEIGHT - 6,
                  height: HOUR_HEIGHT,
                }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Timeline grid and events */}
          <div className="ml-14 relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
            {/* Hour lines */}
            {HOURS.map(hour => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-border/50"
                style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
              />
            ))}

            {/* Current time indicator */}
            {currentTimePosition !== null && (
              <div
                className="absolute left-0 right-0 z-20 pointer-events-none"
                style={{ top: currentTimePosition }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="flex-1 h-0.5 bg-red-500" />
                </div>
              </div>
            )}

            {/* Routine blocks */}
            {todayRoutines.map(routine => {
              const style = getEventStyle(routine.startTime, routine.endTime, routine.duration);
              if (!style) return null;

              const completion = getRoutineCompletion(routine.id);
              const isCompleted = completion?.completed || false;
              const categoryInfo = ROUTINE_CATEGORIES[routine.category];

              return (
                <div
                  key={routine.id}
                  className={cn(
                    'absolute left-1 right-1 rounded-md px-2 py-1 cursor-pointer transition-all',
                    'border-l-4 overflow-hidden',
                    isCompleted ? 'opacity-60' : 'hover:shadow-md'
                  )}
                  style={{
                    top: style.top,
                    height: style.height,
                    backgroundColor: `${categoryInfo.color}15`,
                    borderLeftColor: categoryInfo.color,
                  }}
                  onClick={() => toggleRoutineCompletion(routine.id)}
                >
                  <div className="flex items-start gap-1.5 h-full">
                    {isCompleted ? (
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: categoryInfo.color }}
                      />
                    ) : (
                      <Circle
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: categoryInfo.color }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          isCompleted && 'line-through'
                        )}
                        style={{ color: categoryInfo.color }}
                      >
                        {language === 'uk' && routine.title_uk
                          ? routine.title_uk
                          : routine.title}
                      </p>
                      {routine.startTime && style.height > 40 && (
                        <p className="text-xs text-muted-foreground">
                          {routine.startTime}
                          {routine.endTime && ` - ${routine.endTime}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Calendar events (ekadashi, festivals, etc.) */}
            {dayEvents.map(event => {
              if (!event.style) return null;

              return (
                <div
                  key={event.event_id}
                  className="absolute left-1 right-1 rounded-md px-2 py-1 border-l-4 overflow-hidden"
                  style={{
                    top: event.style.top,
                    height: event.style.height,
                    backgroundColor: `${event.category_color}15`,
                    borderLeftColor: event.category_color,
                  }}
                >
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: event.category_color }}
                  >
                    {language === 'uk' ? event.name_uk : event.name_en}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* All-day events section */}
        {dayEvents.filter(e => !e.sunrise_time).length > 0 && (
          <div className="border-t p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              {t('Весь день', 'All day')}
            </p>
            {dayEvents
              .filter(e => !e.sunrise_time)
              .map(event => (
                <div
                  key={event.event_id}
                  className="flex items-center gap-2 p-2 rounded-md"
                  style={{ backgroundColor: `${event.category_color}15` }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: event.category_color }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: event.category_color }}
                  >
                    {language === 'uk' ? event.name_uk : event.name_en}
                  </span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DayView;
