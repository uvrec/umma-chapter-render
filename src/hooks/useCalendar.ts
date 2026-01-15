/**
 * React hooks для Вайшнавського календаря
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { useMonthEkadashis, ekadashiToCalendarEvent, useIsEkadashi } from "./useCalculatedEkadashis";
import type { GeoLocation } from "@/services/ekadashiCalculator";
import type {
  CalendarEventDisplay,
  MonthData,
  EkadashiInfo,
  EkadashiWithMonth,
  VaishnavMonth,
  CalendarLocation,
  UserCalendarSettings,
  TodayEvents,
  VaishnaFestival,
  AppearanceDay,
  FestivalCategory,
  CalendarView,
} from "@/types/calendar";
import * as calendarService from "@/services/calendarService";

// ============================================
// ОСНОВНИЙ HOOK КАЛЕНДАРЯ
// ============================================

interface UseCalendarOptions {
  initialDate?: Date;
  locationId?: string;
  geoLocation?: GeoLocation | null; // For calculated ekadashis
}

export function useCalendar(options: UseCalendarOptions = {}) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  // Feature flag: ?calc=true enables calculated ekadashis
  // Use window.location to avoid Router context issues
  const useCalculatedEkadashis = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("calc") === "true";
  }, []);

  // Стан календаря
  const [currentDate, setCurrentDate] = useState(options.initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<CalendarView>("month");

  // Поточний місяць та рік
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Діапазон дат для запиту
  const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd");

  // Завантаження даних місяця з БД
  const {
    data: dbMonthData,
    isLoading: isLoadingMonth,
    error: monthError,
  } = useQuery({
    queryKey: ["calendar_month", year, month, options.locationId],
    queryFn: () => calendarService.getMonthData(year, month, options.locationId),
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });

  // Розрахунок екадаші (якщо увімкнено)
  const { ekadashis: calculatedEkadashis, isLoading: isLoadingEkadashis } = useMonthEkadashis(
    year,
    month,
    useCalculatedEkadashis ? options.geoLocation || null : null
  );

  // Об'єднання даних БД з розрахованими екадаші
  const monthData = useMemo(() => {
    if (!dbMonthData) return null;
    if (!useCalculatedEkadashis || !calculatedEkadashis.length) return dbMonthData;

    // Clone the month data
    const mergedData: MonthData = {
      ...dbMonthData,
      days: dbMonthData.days.map(day => {
        const dateStr = format(day.date, "yyyy-MM-dd");

        // Check if there's a calculated ekadashi for this day
        const ekadashi = calculatedEkadashis.find(e => e.dateStr === dateStr);

        if (ekadashi) {
          // Check if DB already has an ekadashi event
          const hasDbEkadashi = day.events.some(e => e.is_ekadashi);

          if (!hasDbEkadashi) {
            // Add calculated ekadashi to events
            const ekadashiEvent = ekadashiToCalendarEvent(ekadashi, language as 'ua' | 'en');
            return {
              ...day,
              events: [ekadashiEvent, ...day.events],
            };
          }
        }

        return day;
      }),
    };

    return mergedData;
  }, [dbMonthData, calculatedEkadashis, useCalculatedEkadashis, language]);

  // Навігація
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  }, []);

  const goToMonth = useCallback((year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1));
  }, []);

  // Вибір дати
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Події вибраної дати
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate || !monthData) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const dayData = monthData.days.find(
      (d) => format(d.date, "yyyy-MM-dd") === dateStr
    );
    return dayData?.events || [];
  }, [selectedDate, monthData]);

  // Назва місяця для відображення
  const monthName = useMemo(() => {
    return calendarService.getMonthName(month, language);
  }, [month, language]);

  return {
    // Дані
    monthData,
    isLoading: isLoadingMonth,
    error: monthError,

    // Стан
    currentDate,
    selectedDate,
    selectedDateEvents,
    view,
    year,
    month,
    monthName,

    // Навігація
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    goToMonth,
    selectDate,
    setView,

    // Мова
    language,
  };
}

// ============================================
// HOOK ДЛЯ СЬОГОДНІШНІХ ПОДІЙ
// ============================================

export function useTodayEvents(locationId?: string, geoLocation?: GeoLocation | null) {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["today_events", locationId],
    queryFn: () => calendarService.getTodayEvents(locationId),
    staleTime: 10 * 60 * 1000, // 10 хвилин
    refetchOnWindowFocus: true,
  });

  // Перевірка чи сьогодні екадаші через астрономічний розрахунок
  const today = useMemo(() => new Date(), []);
  const calculatedEkadashi = useIsEkadashi(today, geoLocation || null);

  // Форматовані події
  const events = useMemo(() => {
    const dbEvents = data?.events || [];
    const formattedEvents = dbEvents.map((event) => ({
      ...event,
      name: language === "ua" ? event.name_ua : event.name_en,
      description:
        language === "ua" ? event.description_ua : event.description_en,
    }));

    // Якщо в БД немає екадаші, але астрономічний розрахунок каже що сьогодні екадаші
    const hasDbEkadashi = formattedEvents.some(e => e.is_ekadashi);
    if (!hasDbEkadashi && calculatedEkadashi?.isEkadashi && geoLocation) {
      const ekadashiEvent = ekadashiToCalendarEvent({
        date: today,
        dateStr: format(today, 'yyyy-MM-dd'),
        paksha: calculatedEkadashi.paksha,
        checkType: calculatedEkadashi.checkType ?? 'brahma_muhurta',
      }, language as 'ua' | 'en');

      return [
        {
          ...ekadashiEvent,
          name: language === "ua" ? ekadashiEvent.name_ua : ekadashiEvent.name_en,
          description: language === "ua" ? ekadashiEvent.description_ua : ekadashiEvent.description_en,
        },
        ...formattedEvents
      ];
    }

    return formattedEvents;
  }, [data?.events, language, calculatedEkadashi, geoLocation, today]);

  // Наступний екадаші
  const nextEkadashi = useMemo(() => {
    if (!data?.next_ekadashi) return null;
    return {
      ...data.next_ekadashi,
      event: {
        ...data.next_ekadashi.event,
        name:
          language === "ua"
            ? data.next_ekadashi.event.name_ua
            : data.next_ekadashi.event.name_en,
      },
    };
  }, [data?.next_ekadashi, language]);

  return {
    date: data?.date,
    events,
    nextEkadashi,
    tithi: data?.tithi,
    vaishnavMonth: data?.vaishnava_month,
    moonPhase: data?.moon_phase,
    isLoading,
    error,
    calculatedEkadashi,
  };
}

// ============================================
// HOOK ДЛЯ ЕКАДАШІ
// ============================================

export function useEkadashis() {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["ekadashis"],
    queryFn: calendarService.getAllEkadashis,
    staleTime: 60 * 60 * 1000, // 1 година
  });

  // Згруповані за місяцями
  const groupedByMonth = useMemo(() => {
    if (!data) return new Map<number, EkadashiInfo[]>();

    const grouped = new Map<number, EkadashiInfo[]>();
    for (const ekadashi of data) {
      const monthId = ekadashi.vaishnava_month_id;
      if (!grouped.has(monthId)) {
        grouped.set(monthId, []);
      }
      grouped.get(monthId)!.push(ekadashi);
    }
    return grouped;
  }, [data]);

  return {
    ekadashis: data || [],
    groupedByMonth,
    isLoading,
    error,
    language,
  };
}

export function useEkadashi(slug: string) {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["ekadashi", slug],
    queryFn: () => calendarService.getEkadashiBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000, // 1 година
  });

  // Наступні дати цього екадаші
  const { data: upcomingDates } = useQuery({
    queryKey: ["ekadashi_dates", data?.id],
    queryFn: () => calendarService.getUpcomingEkadashiDates(data!.id),
    enabled: !!data?.id,
    staleTime: 60 * 60 * 1000,
  });

  // Форматовані дані для відображення
  const formattedEkadashi = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      name: language === "ua" ? data.name_ua : data.name_en,
      gloryTitle:
        language === "ua" ? data.glory_title_ua : data.glory_title_en,
      gloryText: language === "ua" ? data.glory_text_ua : data.glory_text_en,
      presidingDeity:
        language === "ua" ? data.presiding_deity_ua : data.presiding_deity_en,
      recommendedActivities:
        language === "ua"
          ? data.recommended_activities_ua
          : data.recommended_activities_en,
      fastingRules:
        language === "ua" ? data.fasting_rules_ua : data.fasting_rules_en,
      benefits: language === "ua" ? data.benefits_ua : data.benefits_en,
      story: language === "ua" ? data.story_ua : data.story_en,
    };
  }, [data, language]);

  return {
    ekadashi: data,
    formattedEkadashi,
    upcomingDates: upcomingDates || [],
    isLoading,
    error,
  };
}

// ============================================
// HOOK ДЛЯ СВЯТ
// ============================================

export function useFestivals() {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["festivals"],
    queryFn: calendarService.getAllFestivals,
    staleTime: 60 * 60 * 1000,
  });

  const { data: categories } = useQuery({
    queryKey: ["festival_categories"],
    queryFn: calendarService.getFestivalCategories,
    staleTime: 60 * 60 * 1000,
  });

  return {
    festivals: data || [],
    categories: categories || [],
    isLoading,
    error,
    language,
  };
}

export function useFestival(slug: string) {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["festival", slug],
    queryFn: () => calendarService.getFestivalBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  });

  const formattedFestival = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      name: language === "ua" ? data.name_ua : data.name_en,
      description:
        language === "ua" ? data.description_ua : data.description_en,
      shortDescription:
        language === "ua"
          ? data.short_description_ua
          : data.short_description_en,
      significance:
        language === "ua" ? data.significance_ua : data.significance_en,
      observances:
        language === "ua" ? data.observances_ua : data.observances_en,
    };
  }, [data, language]);

  return {
    festival: data,
    formattedFestival,
    isLoading,
    error,
  };
}

// ============================================
// HOOK ДЛЯ ЯВЛЕНЬ/ВІДХОДІВ
// ============================================

export function useAppearanceDays() {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["appearance_days"],
    queryFn: calendarService.getAllAppearanceDays,
    staleTime: 60 * 60 * 1000,
  });

  // Розділені на явлення та відходи
  const { appearances, disappearances } = useMemo(() => {
    if (!data) return { appearances: [], disappearances: [] };
    return {
      appearances: data.filter((d) => d.event_type === "appearance"),
      disappearances: data.filter((d) => d.event_type === "disappearance"),
    };
  }, [data]);

  return {
    all: data || [],
    appearances,
    disappearances,
    isLoading,
    error,
    language,
  };
}

export function useAppearanceDay(slug: string) {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["appearance_day", slug],
    queryFn: () => calendarService.getAppearanceDayBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  });

  const formattedAppearanceDay = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      personName:
        language === "ua" ? data.person_name_ua : data.person_name_en,
      personTitle:
        language === "ua" ? data.person_title_ua : data.person_title_en,
      description:
        language === "ua" ? data.description_ua : data.description_en,
      shortDescription:
        language === "ua"
          ? data.short_description_ua
          : data.short_description_en,
      observances:
        language === "ua" ? data.observances_ua : data.observances_en,
    };
  }, [data, language]);

  return {
    appearanceDay: data,
    formattedAppearanceDay,
    isLoading,
    error,
  };
}

// ============================================
// HOOK ДЛЯ ЛОКАЦІЙ
// ============================================

export function useCalendarLocations() {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar_locations"],
    queryFn: calendarService.getPresetLocations,
    staleTime: 60 * 60 * 1000,
  });

  const formattedLocations = useMemo(() => {
    if (!data) return [];
    return data.map((loc) => ({
      ...loc,
      name: language === "ua" ? loc.name_ua : loc.name_en,
      city: language === "ua" ? loc.city_ua : loc.city_en,
    }));
  }, [data, language]);

  return {
    locations: data || [],
    formattedLocations,
    isLoading,
    error,
  };
}

// ============================================
// HOOK ДЛЯ НАЛАШТУВАНЬ КОРИСТУВАЧА
// ============================================

export function useCalendarSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar_settings"],
    queryFn: calendarService.getUserCalendarSettings,
    staleTime: 5 * 60 * 1000,
  });

  // Локальні налаштування для неавторизованих
  const localSettings = calendarService.getLocalCalendarSettings();

  // Мутація для оновлення
  const updateSettings = useMutation({
    mutationFn: calendarService.updateUserCalendarSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar_settings"] });
    },
  });

  // Зберегти локально
  const saveLocalSettings = useCallback(
    (settings: Partial<UserCalendarSettings>) => {
      calendarService.saveLocalCalendarSettings(settings);
    },
    []
  );

  // Ефективні налаштування (з БД або локальні)
  const effectiveSettings = data || localSettings;

  return {
    settings: effectiveSettings as Partial<UserCalendarSettings>,
    isLoading,
    error,
    updateSettings: updateSettings.mutateAsync,
    isSaving: updateSettings.isPending,
    saveLocalSettings,
    isLoggedIn: !!data,
  };
}

// ============================================
// HOOK ДЛЯ ВАЙШНАВСЬКИХ МІСЯЦІВ
// ============================================

export function useVaishnavMonths() {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["vaishnava_months"],
    queryFn: calendarService.getVaishnavMonths,
    staleTime: 60 * 60 * 1000,
  });

  const { data: currentMonth } = useQuery({
    queryKey: ["current_vaishnava_month"],
    queryFn: calendarService.getCurrentVaishnavMonth,
    staleTime: 24 * 60 * 60 * 1000, // 24 години
  });

  const formattedMonths = useMemo(() => {
    if (!data) return [];
    return data.map((m) => ({
      ...m,
      name: language === "ua" ? m.name_ua : m.name_en,
      description:
        language === "ua" ? m.description_ua : m.description_en,
    }));
  }, [data, language]);

  return {
    months: data || [],
    formattedMonths,
    currentMonth,
    isLoading,
    error,
  };
}

// ============================================
// HOOK ДЛЯ НАСТУПНОГО ЕКАДАШІ
// ============================================

export function useNextEkadashi(locationId?: string) {
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["next_ekadashi", locationId],
    queryFn: () => calendarService.getNextEkadashi(locationId),
    staleTime: 10 * 60 * 1000,
  });

  const formatted = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      event: {
        ...data.event,
        name: language === "ua" ? data.event.name_ua : data.event.name_en,
        description:
          language === "ua"
            ? data.event.description_ua
            : data.event.description_en,
      },
      formattedDate: data.event.event_date
        ? calendarService.formatCalendarDate(data.event.event_date, language)
        : "",
    };
  }, [data, language]);

  return {
    nextEkadashi: formatted,
    daysUntil: data?.days_until,
    isLoading,
    error,
  };
}
