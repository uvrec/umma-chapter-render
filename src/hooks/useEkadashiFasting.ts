/**
 * useEkadashiFasting - React hooks for Ekadashi fasting calculations
 *
 * Provides convenient hooks for calculating fasting times based on geolocation
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ekadashiCalculator, {
  type GeoLocation,
  type EkadashiFastingTimes,
  type DailyPanchangTimes,
  type SunTimes,
  type VaishnavEventFastingTimes,
  type VaishnavEventType,
  type FastingLevel,
} from '@/services/ekadashiCalculator';
import type { CalendarLocation } from '@/types/calendar';

// ============================================
// TYPES
// ============================================

interface UseEkadashiFastingOptions {
  enabled?: boolean;
}

interface UseSunTimesResult {
  sunTimes: SunTimes | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseEkadashiFastingResult {
  fastingTimes: EkadashiFastingTimes | null;
  isLoading: boolean;
  error: Error | null;
  calculate: (ekadashiDate: Date, location: GeoLocation) => void;
}

interface UseDailyPanchangResult {
  panchang: DailyPanchangTimes | null;
  tithi: { tithi: number; paksha: 'shukla' | 'krishna'; tithiInPaksha: number } | null;
  moonPhase: number | null;
  moonIllumination: number | null;
  isLoading: boolean;
  error: Error | null;
}

// ============================================
// HOOK: useSunTimes
// ============================================

/**
 * Hook for getting sunrise/sunset times for a specific date and location
 */
export function useSunTimes(
  date: Date | null,
  location: GeoLocation | null,
  options: UseEkadashiFastingOptions = {}
): UseSunTimesResult {
  const { enabled = true } = options;

  const queryKey = useMemo(
    () => ['sunTimes', date?.toISOString().split('T')[0], location?.latitude, location?.longitude],
    [date, location?.latitude, location?.longitude]
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!date || !location) return null;
      return ekadashiCalculator.calculateSunTimes(date, location);
    },
    enabled: enabled && !!date && !!location,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - sun times don't change within a day
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return {
    sunTimes: data || null,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

// ============================================
// HOOK: useEkadashiFasting
// ============================================

/**
 * Hook for calculating Ekadashi fasting times
 */
export function useEkadashiFasting(): UseEkadashiFastingResult {
  const [fastingTimes, setFastingTimes] = useState<EkadashiFastingTimes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculate = useCallback((ekadashiDate: Date, location: GeoLocation) => {
    setIsLoading(true);
    setError(null);

    try {
      const times = ekadashiCalculator.calculateEkadashiFastingTimes(ekadashiDate, location);
      setFastingTimes(times);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to calculate fasting times'));
      setFastingTimes(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fastingTimes,
    isLoading,
    error,
    calculate,
  };
}

// ============================================
// HOOK: useEkadashiFastingForDate
// ============================================

/**
 * Hook for automatically calculating fasting times when date/location changes
 */
export function useEkadashiFastingForDate(
  ekadashiDate: Date | null,
  location: GeoLocation | null,
  options: UseEkadashiFastingOptions = {}
): {
  fastingTimes: EkadashiFastingTimes | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { enabled = true } = options;

  const queryKey = useMemo(
    () => [
      'ekadashiFasting',
      ekadashiDate?.toISOString().split('T')[0],
      location?.latitude,
      location?.longitude,
    ],
    [ekadashiDate, location?.latitude, location?.longitude]
  );

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!ekadashiDate || !location) return null;
      return ekadashiCalculator.calculateEkadashiFastingTimes(ekadashiDate, location);
    },
    enabled: enabled && !!ekadashiDate && !!location,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return {
    fastingTimes: data || null,
    isLoading,
    error: error as Error | null,
  };
}

// ============================================
// HOOK: useDailyPanchang
// ============================================

/**
 * Hook for getting daily Panchang information (sunrise, sunset, tithi, moon phase)
 */
export function useDailyPanchang(
  date: Date | null,
  location: GeoLocation | null,
  options: UseEkadashiFastingOptions = {}
): UseDailyPanchangResult {
  const { enabled = true } = options;

  const queryKey = useMemo(
    () => ['dailyPanchang', date?.toISOString().split('T')[0], location?.latitude, location?.longitude],
    [date, location?.latitude, location?.longitude]
  );

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!date || !location) return null;

      const panchang = ekadashiCalculator.calculateDailyPanchang(date, location);
      const tithi = ekadashiCalculator.calculateTithi(date);
      const moonPhase = ekadashiCalculator.calculateMoonPhase(date);
      const moonIllumination = ekadashiCalculator.getMoonIllumination(date);

      return {
        panchang,
        tithi,
        moonPhase,
        moonIllumination,
      };
    },
    enabled: enabled && !!date && !!location,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    panchang: data?.panchang || null,
    tithi: data?.tithi || null,
    moonPhase: data?.moonPhase ?? null,
    moonIllumination: data?.moonIllumination ?? null,
    isLoading,
    error: error as Error | null,
  };
}

// ============================================
// HOOK: useNextEkadashiCalculation
// ============================================

/**
 * Hook for finding and calculating the next Ekadashi
 */
export function useNextEkadashiCalculation(
  location: GeoLocation | null,
  options: UseEkadashiFastingOptions = {}
): {
  nextEkadashiDate: Date | null;
  fastingTimes: EkadashiFastingTimes | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { enabled = true } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ['nextEkadashi', location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location) return null;

      const today = new Date();
      const nextEkadashi = ekadashiCalculator.findNextEkadashi(today);
      const fastingTimes = ekadashiCalculator.calculateEkadashiFastingTimes(nextEkadashi, location);

      return {
        nextEkadashiDate: nextEkadashi,
        fastingTimes,
      };
    },
    enabled: enabled && !!location,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    nextEkadashiDate: data?.nextEkadashiDate || null,
    fastingTimes: data?.fastingTimes || null,
    isLoading,
    error: error as Error | null,
  };
}

// ============================================
// HOOK: useMoonPhases
// ============================================

/**
 * Hook for getting moon phase information
 */
export function useMoonPhases(
  date: Date | null,
  options: UseEkadashiFastingOptions = {}
): {
  phase: number | null;
  illumination: number | null;
  nextNewMoon: Date | null;
  nextFullMoon: Date | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { enabled = true } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ['moonPhases', date?.toISOString().split('T')[0]],
    queryFn: async () => {
      if (!date) return null;

      return {
        phase: ekadashiCalculator.calculateMoonPhase(date),
        illumination: ekadashiCalculator.getMoonIllumination(date),
        nextNewMoon: ekadashiCalculator.findNextNewMoon(date),
        nextFullMoon: ekadashiCalculator.findNextFullMoon(date),
      };
    },
    enabled: enabled && !!date,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    phase: data?.phase ?? null,
    illumination: data?.illumination ?? null,
    nextNewMoon: data?.nextNewMoon || null,
    nextFullMoon: data?.nextFullMoon || null,
    isLoading,
    error: error as Error | null,
  };
}

// ============================================
// HOOK: useLocationToGeo
// ============================================

/**
 * Convert CalendarLocation to GeoLocation for calculator
 */
export function useLocationToGeo(location: CalendarLocation | null): GeoLocation | null {
  return useMemo(() => {
    if (!location) return null;

    return {
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      timezone: location.timezone,
    };
  }, [location]);
}

// ============================================
// HOOK: useSunTimesForMonth
// ============================================

/**
 * Hook for getting sun times for an entire month
 */
export function useSunTimesForMonth(
  year: number,
  month: number,
  location: GeoLocation | null,
  options: UseEkadashiFastingOptions = {}
): {
  sunTimesMap: Map<string, SunTimes> | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { enabled = true } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ['sunTimesMonth', year, month, location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location) return null;

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0); // Last day of month

      return ekadashiCalculator.calculateSunTimesForRange(startDate, endDate, location);
    },
    enabled: enabled && !!location,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return {
    sunTimesMap: data || null,
    isLoading,
    error: error as Error | null,
  };
}

// ============================================
// HOOK: useVaishnavEventFasting
// ============================================

/**
 * Hook for calculating fasting times for appearance/disappearance days and festivals
 */
export function useVaishnavEventFasting(
  eventDate: Date | null,
  location: GeoLocation | null,
  eventType: VaishnavEventType,
  fastingLevel: FastingLevel = 'half',
  eventName?: string,
  options: UseEkadashiFastingOptions = {}
): {
  fastingTimes: VaishnavEventFastingTimes | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { enabled = true } = options;

  const queryKey = useMemo(
    () => [
      'vaishnavEventFasting',
      eventDate?.toISOString().split('T')[0],
      location?.latitude,
      location?.longitude,
      eventType,
      fastingLevel,
    ],
    [eventDate, location?.latitude, location?.longitude, eventType, fastingLevel]
  );

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!eventDate || !location) return null;
      return ekadashiCalculator.calculateVaishnavEventFastingTimes(
        eventDate,
        location,
        eventType,
        fastingLevel,
        eventName
      );
    },
    enabled: enabled && !!eventDate && !!location,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return {
    fastingTimes: data || null,
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Hook for calculating fasting times based on calendar event type
 */
export function useCalendarEventFasting(
  event: {
    event_date: string;
    event_type: string;
    name_ua?: string;
    name_en?: string;
    fasting_level?: string;
  } | null,
  location: GeoLocation | null,
  language: 'ua' | 'en' = 'ua',
  options: UseEkadashiFastingOptions = {}
): {
  fastingTimes: VaishnavEventFastingTimes | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { enabled = true } = options;

  const eventDate = useMemo(() => {
    if (!event?.event_date) return null;
    return new Date(event.event_date);
  }, [event?.event_date]);

  const eventType = useMemo((): VaishnavEventType => {
    if (!event?.event_type) return 'festival';
    const type = event.event_type.toLowerCase();
    if (type === 'appearance') return 'appearance';
    if (type === 'disappearance') return 'disappearance';
    if (type === 'ekadashi') return 'ekadashi';
    return 'festival';
  }, [event?.event_type]);

  const fastingLevel = useMemo((): FastingLevel => {
    if (!event?.fasting_level) return 'half';
    const level = event.fasting_level.toLowerCase();
    if (level === 'nirjala') return 'nirjala';
    if (level === 'full') return 'full';
    if (level === 'half') return 'half';
    if (level === 'none') return 'none';
    return 'half';
  }, [event?.fasting_level]);

  const eventName = language === 'ua' ? event?.name_ua : event?.name_en;

  return useVaishnavEventFasting(
    eventDate,
    location,
    eventType,
    fastingLevel,
    eventName,
    { enabled: enabled && eventType !== 'ekadashi' } // Ekadashi has its own calculator
  );
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook for invalidating calculator caches
 */
export function useInvalidateEkadashiCache() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sunTimes'] });
    queryClient.invalidateQueries({ queryKey: ['ekadashiFasting'] });
    queryClient.invalidateQueries({ queryKey: ['dailyPanchang'] });
    queryClient.invalidateQueries({ queryKey: ['nextEkadashi'] });
    queryClient.invalidateQueries({ queryKey: ['moonPhases'] });
    queryClient.invalidateQueries({ queryKey: ['sunTimesMonth'] });
  }, [queryClient]);
}

/**
 * Hook for prefetching sun times (useful for improving UX)
 */
export function usePrefetchSunTimes() {
  const queryClient = useQueryClient();

  return useCallback(
    async (dates: Date[], location: GeoLocation) => {
      for (const date of dates) {
        const dateKey = date.toISOString().split('T')[0];
        await queryClient.prefetchQuery({
          queryKey: ['sunTimes', dateKey, location.latitude, location.longitude],
          queryFn: () => ekadashiCalculator.calculateSunTimes(date, location),
          staleTime: 24 * 60 * 60 * 1000,
        });
      }
    },
    [queryClient]
  );
}
