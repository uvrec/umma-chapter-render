/**
 * Hook for calculating Ekadashi dates using the astronomical calculator
 * Integrates with the calendar to display calculated ekadashis
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import {
  findAllEkadashisInYear,
  isEkadashiISKCON,
  type GeoLocation,
} from '@/services/ekadashiCalculator';
import type { CalendarEventDisplay } from '@/types/calendar';

interface CalculatedEkadashi {
  date: Date;
  dateStr: string;
  paksha: 'shukla' | 'krishna';
  checkType: 'brahma_muhurta' | 'mahadvadashi';
}

/**
 * Calculate all ekadashis for a given year
 */
export function useYearEkadashis(year: number, location: GeoLocation | null) {
  return useQuery({
    queryKey: ['calculated_ekadashis', year, location?.latitude, location?.longitude],
    queryFn: () => {
      if (!location) return [];
      const ekadashis = findAllEkadashisInYear(year, location);
      return ekadashis.map(e => ({
        ...e,
        dateStr: format(e.date, 'yyyy-MM-dd'),
      }));
    },
    enabled: !!location,
    staleTime: Infinity, // Astronomical calculations don't change
    gcTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });
}

/**
 * Get ekadashis for a specific month
 */
export function useMonthEkadashis(
  year: number,
  month: number, // 0-11
  location: GeoLocation | null
) {
  const { data: yearEkadashis, isLoading } = useYearEkadashis(year, location);

  const monthEkadashis = useMemo(() => {
    if (!yearEkadashis) return [];

    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(monthStart);

    return yearEkadashis.filter(e => {
      return e.date >= monthStart && e.date <= monthEnd;
    });
  }, [yearEkadashis, year, month]);

  return {
    ekadashis: monthEkadashis,
    isLoading,
  };
}

/**
 * Convert calculated ekadashis to CalendarEventDisplay format
 */
export function ekadashiToCalendarEvent(
  ekadashi: CalculatedEkadashi,
  language: 'uk' | 'en'
): CalendarEventDisplay {
  const pakshaName = {
    shukla: { uk: 'Шукла', en: 'Shukla' },
    krishna: { uk: 'Крішна', en: 'Krishna' },
  };

  const name = language === 'uk'
    ? `${pakshaName[ekadashi.paksha].uk} Екадаші`
    : `${pakshaName[ekadashi.paksha].en} Ekadashi`;

  const description = language === 'uk'
    ? `Екадаші ${pakshaName[ekadashi.paksha].uk} пакші. Піст від зернових.`
    : `Ekadashi of ${pakshaName[ekadashi.paksha].en} paksha. Fast from grains.`;

  return {
    event_id: `calc-ekadashi-${ekadashi.dateStr}`,
    event_date: ekadashi.dateStr,
    event_type: 'ekadashi',
    name_uk: `${pakshaName[ekadashi.paksha].uk} Екадаші`,
    name_en: `${pakshaName[ekadashi.paksha].en} Ekadashi`,
    description_uk: description,
    description_en: description,
    category_slug: 'ekadashi',
    category_color: '#8B5CF6',
    is_ekadashi: true,
    is_major: true,
    fasting_level: 'full',
  };
}

/**
 * Hook to get calendar events merged with calculated ekadashis
 */
export function useCalendarWithEkadashis(
  year: number,
  month: number,
  location: GeoLocation | null,
  dbEvents: CalendarEventDisplay[],
  language: 'uk' | 'en'
) {
  const { ekadashis, isLoading } = useMonthEkadashis(year, month, location);

  const mergedEvents = useMemo(() => {
    if (!ekadashis.length) return dbEvents;

    // Create a map of existing DB events by date
    const eventsByDate = new Map<string, CalendarEventDisplay[]>();
    for (const event of dbEvents) {
      const dateKey = event.event_date;
      if (!eventsByDate.has(dateKey)) {
        eventsByDate.set(dateKey, []);
      }
      eventsByDate.get(dateKey)!.push(event);
    }

    // Add calculated ekadashis (if not already in DB)
    for (const ekadashi of ekadashis) {
      const dateKey = ekadashi.dateStr;
      const existing = eventsByDate.get(dateKey) || [];

      // Check if there's already an ekadashi event for this date
      const hasEkadashi = existing.some(e => e.is_ekadashi);

      if (!hasEkadashi) {
        const ekadashiEvent = ekadashiToCalendarEvent(ekadashi, language);
        if (!eventsByDate.has(dateKey)) {
          eventsByDate.set(dateKey, []);
        }
        eventsByDate.get(dateKey)!.push(ekadashiEvent);
      }
    }

    // Flatten back to array
    const result: CalendarEventDisplay[] = [];
    for (const events of eventsByDate.values()) {
      result.push(...events);
    }
    return result;
  }, [dbEvents, ekadashis, language]);

  return {
    events: mergedEvents,
    calculatedEkadashis: ekadashis,
    isLoading,
  };
}

/**
 * Check if a specific date is Ekadashi (real-time calculation)
 */
export function useIsEkadashi(date: Date | null, location: GeoLocation | null) {
  return useMemo(() => {
    if (!date || !location) return null;
    return isEkadashiISKCON(date, location);
  }, [date, location]);
}
