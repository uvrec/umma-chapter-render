/**
 * Vaishnava Calendar Service
 * Provides calendar data, ekadashi info, festivals, and user settings
 *
 * Uses static JSON data as primary source (reliable, complete)
 * Falls back to Supabase for additional data
 */

import { supabase } from "@/integrations/supabase/client";
import {
  getEventsForDateRange as getStaticEventsForDateRange,
  getNextEkadashiFromDate as getStaticNextEkadashi,
  type CalendarEventData,
} from "@/data/calendar";
import type {
  CalendarEventDisplay,
  CalendarFilters,
  CalendarLocation,
  EkadashiInfo,
  EkadashiWithMonth,
  VaishnavMonth,
  VaishnaFestival,
  AppearanceDay,
  FestivalCategory,
  UserCalendarSettings,
  TodayEvents,
  MonthData,
  DayData,
  TithiType,
} from "@/types/calendar";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { uk } from "date-fns/locale";

// ============================================
// HELPER: Convert static data to CalendarEventDisplay
// ============================================

function convertStaticEventToDisplay(event: CalendarEventData, index: number): CalendarEventDisplay {
  const typeColorMap: Record<string, string> = {
    ekadashi: "#8B5CF6",    // Purple
    festival: "#EF4444",     // Red
    appearance: "#F59E0B",   // Amber
    disappearance: "#6B7280", // Gray
    parana: "#22C55E",       // Green
    caturmasya: "#3B82F6",   // Blue
    info: "#9CA3AF",         // Light gray
  };

  return {
    event_id: `static-${event.date}-${index}`,
    event_date: event.date,
    event_type: event.type,
    name_ua: event.name_ua,
    name_en: event.name_en,
    description_ua: event.fasting_note_ua,
    description_en: event.fasting_note_en,
    category_slug: event.type,
    category_color: typeColorMap[event.type] || "#8B5CF6",
    is_ekadashi: event.type === "ekadashi",
    is_major: event.is_major || event.type === "ekadashi",
    fasting_level: event.fasting || undefined,
    parana_start: event.parana_start,
    parana_end: event.parana_end || undefined,
  };
}

// ============================================
// CALENDAR EVENTS
// ============================================

/**
 * Get calendar events for a date range
 * Uses static JSON data as primary source
 */
export async function getCalendarEvents(
  filters: CalendarFilters
): Promise<CalendarEventDisplay[]> {
  // First, try to get events from static JSON data (reliable source)
  const staticEvents = getStaticEventsForDateRange(
    filters.start_date,
    filters.end_date,
    "germany" // Default location - can be extended
  );

  if (staticEvents.length > 0) {
    return staticEvents.map((event, index) => convertStaticEventToDisplay(event, index));
  }

  // Fallback to Supabase if no static data available
  try {
    const { data, error } = await (supabase as any).rpc("get_calendar_events", {
      p_start_date: filters.start_date,
      p_end_date: filters.end_date,
      p_location_id: filters.location_id || null,
    });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      event_id: row.event_id,
      event_date: row.event_date,
      event_type: row.event_type,
      name_ua: row.name_ua,
      name_en: row.name_en,
      description_ua: row.description_ua,
      description_en: row.description_en,
      category_slug: row.category_slug,
      category_color: row.category_color || "#8B5CF6",
      is_ekadashi: row.is_ekadashi || false,
      is_major: row.is_major || false,
      moon_phase: row.moon_phase,
      sunrise_time: row.sunrise_time,
      sunset_time: row.sunset_time,
    }));
  } catch (error) {
    console.error("Failed to get calendar events:", error);
    return [];
  }
}

/**
 * Get today's events
 */
export async function getTodayEvents(
  locationId?: string
): Promise<TodayEvents> {
  const today = format(new Date(), "yyyy-MM-dd");

  try {
    const { data, error } = await (supabase as any).rpc("get_today_events", {
      p_location_id: locationId || null,
    });

    if (error) throw error;

    const events: CalendarEventDisplay[] = (data || []).map((row: any) => ({
      event_id: row.event_id,
      event_date: today,
      event_type: row.event_type,
      name_ua: row.name_ua,
      name_en: row.name_en,
      description_ua: row.short_description_ua,
      description_en: row.short_description_en,
      category_color: row.category_color || "#8B5CF6",
      is_ekadashi: row.is_ekadashi || false,
      is_major: true,
    }));

    // Get next ekadashi
    const nextEkadashi = await getNextEkadashi(locationId);

    return {
      date: today,
      events,
      next_ekadashi: nextEkadashi,
    };
  } catch (error) {
    console.error("Failed to get today events:", error);
    return {
      date: today,
      events: [],
    };
  }
}

/**
 * Get next upcoming ekadashi
 * Uses static JSON data as primary source
 */
export async function getNextEkadashi(
  locationId?: string
): Promise<{ event: CalendarEventDisplay; days_until: number } | undefined> {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  // First try static data
  const staticNextEkadashi = getStaticNextEkadashi(todayStr, "germany");

  if (staticNextEkadashi) {
    const eventDate = new Date(staticNextEkadashi.date);
    const daysUntil = Math.ceil(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      event: {
        event_id: `static-ekadashi-${staticNextEkadashi.date}`,
        event_date: staticNextEkadashi.date,
        event_type: "ekadashi",
        name_ua: staticNextEkadashi.name_ua,
        name_en: staticNextEkadashi.name_en,
        description_ua: staticNextEkadashi.fasting_note_ua,
        description_en: staticNextEkadashi.fasting_note_en,
        category_color: "#8B5CF6",
        is_ekadashi: true,
        is_major: true,
        fasting_level: staticNextEkadashi.fasting || undefined,
      },
      days_until: daysUntil,
    };
  }

  // Fallback to Supabase
  const endDate = addMonths(today, 1);

  try {
    const { data, error } = await (supabase as any)
      .from("calendar_events")
      .select(
        `
        id,
        event_date,
        ekadashi_id,
        parana_start_time,
        parana_end_time,
        ekadashi_info (
          name_ua,
          name_en,
          glory_title_ua,
          glory_title_en
        )
      `
      )
      .not("ekadashi_id", "is", null)
      .gte("event_date", format(today, "yyyy-MM-dd"))
      .lte("event_date", format(endDate, "yyyy-MM-dd"))
      .order("event_date", { ascending: true })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      const row = data[0] as any;
      const eventDate = new Date(row.event_date);
      const daysUntil = Math.ceil(
        (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        event: {
          event_id: row.id,
          event_date: row.event_date,
          event_type: "ekadashi",
          name_ua: row.ekadashi_info?.name_ua || "Екадаші",
          name_en: row.ekadashi_info?.name_en || "Ekadashi",
          description_ua: row.ekadashi_info?.glory_title_ua,
          description_en: row.ekadashi_info?.glory_title_en,
          category_color: "#8B5CF6",
          is_ekadashi: true,
          is_major: true,
        },
        days_until: daysUntil,
      };
    }

    return undefined;
  } catch (error) {
    console.error("Failed to get next ekadashi:", error);
    return undefined;
  }
}

// ============================================
// MONTH VIEW DATA
// ============================================

/**
 * Get month data with events for calendar view
 */
export async function getMonthData(
  year: number,
  month: number, // 0-11
  locationId?: string
): Promise<MonthData> {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);

  // Get calendar grid dates (including days from prev/next months)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Fetch events for the entire visible range
  const events = await getCalendarEvents({
    start_date: format(calendarStart, "yyyy-MM-dd"),
    end_date: format(calendarEnd, "yyyy-MM-dd"),
    location_id: locationId,
  });

  // Group events by date
  const eventsByDate = new Map<string, CalendarEventDisplay[]>();
  for (const event of events) {
    const dateKey = event.event_date;
    if (!eventsByDate.has(dateKey)) {
      eventsByDate.set(dateKey, []);
    }
    eventsByDate.get(dateKey)!.push(event);
  }

  // Build day data
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const days: DayData[] = allDays.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return {
      date,
      day_of_month: date.getDate(),
      is_current_month: isSameMonth(date, monthStart),
      is_today: isToday(date),
      events: eventsByDate.get(dateStr) || [],
    };
  });

  return {
    year,
    month,
    days,
  };
}

// ============================================
// EKADASHI
// ============================================

/**
 * Get all ekadashi info
 */
export async function getAllEkadashis(): Promise<EkadashiInfo[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("ekadashi_info")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Failed to get ekadashis:", error);
    return [];
  }
}

/**
 * Get ekadashi by slug with month info
 */
export async function getEkadashiBySlug(
  slug: string
): Promise<EkadashiWithMonth | null> {
  try {
    const { data, error } = await (supabase as any)
      .from("ekadashi_info")
      .select(
        `
        *,
        vaishnava_months (*)
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      ...data,
      month: data.vaishnava_months,
    };
  } catch (error) {
    console.error("Failed to get ekadashi:", error);
    return null;
  }
}

/**
 * Get upcoming ekadashi dates for a specific ekadashi
 */
export async function getUpcomingEkadashiDates(
  ekadashiId: string,
  limit: number = 5
): Promise<string[]> {
  const today = format(new Date(), "yyyy-MM-dd");

  try {
    const { data, error } = await (supabase as any)
      .from("calendar_events")
      .select("event_date")
      .eq("ekadashi_id", ekadashiId)
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((row: any) => row.event_date);
  } catch (error) {
    console.error("Failed to get upcoming ekadashi dates:", error);
    return [];
  }
}

// ============================================
// FESTIVALS
// ============================================

/**
 * Get all festivals
 */
export async function getAllFestivals(): Promise<VaishnaFestival[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("vaishnava_festivals")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Failed to get festivals:", error);
    return [];
  }
}

/**
 * Get festival by slug
 */
export async function getFestivalBySlug(
  slug: string
): Promise<VaishnaFestival | null> {
  try {
    const { data, error } = await (supabase as any)
      .from("vaishnava_festivals")
      .select(
        `
        *,
        festival_categories (*),
        vaishnava_months (*)
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return data || null;
  } catch (error) {
    console.error("Failed to get festival:", error);
    return null;
  }
}

/**
 * Get festival categories
 */
export async function getFestivalCategories(): Promise<FestivalCategory[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("festival_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Failed to get festival categories:", error);
    return [];
  }
}

// ============================================
// APPEARANCE DAYS
// ============================================

/**
 * Get all appearance/disappearance days
 */
export async function getAllAppearanceDays(): Promise<AppearanceDay[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("appearance_days")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Failed to get appearance days:", error);
    return [];
  }
}

/**
 * Get appearance day by slug
 */
export async function getAppearanceDayBySlug(
  slug: string
): Promise<AppearanceDay | null> {
  try {
    const { data, error } = await (supabase as any)
      .from("appearance_days")
      .select(
        `
        *,
        festival_categories (*),
        vaishnava_months (*)
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return data || null;
  } catch (error) {
    console.error("Failed to get appearance day:", error);
    return null;
  }
}

// ============================================
// LOCATIONS
// ============================================

/**
 * Get all preset locations
 */
export async function getPresetLocations(): Promise<CalendarLocation[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("calendar_locations")
      .select("*")
      .eq("is_preset", true)
      .eq("is_active", true)
      .order("name_ua", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Failed to get preset locations:", error);
    return [];
  }
}

/**
 * Get location by ID
 */
export async function getLocationById(
  id: string
): Promise<CalendarLocation | null> {
  try {
    const { data, error } = await (supabase as any)
      .from("calendar_locations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data || null;
  } catch (error) {
    console.error("Failed to get location:", error);
    return null;
  }
}

// ============================================
// USER SETTINGS
// ============================================

/**
 * Get or create user calendar settings
 */
export async function getUserCalendarSettings(): Promise<UserCalendarSettings | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await (supabase as any).rpc(
      "get_or_create_calendar_settings",
      {
        p_user_id: user.id,
      }
    );

    if (error) throw error;

    return data || null;
  } catch (error) {
    console.error("Failed to get user calendar settings:", error);
    return null;
  }
}

/**
 * Update user calendar settings
 */
export async function updateUserCalendarSettings(
  settings: Partial<UserCalendarSettings>
): Promise<UserCalendarSettings | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await (supabase as any)
      .from("user_calendar_settings")
      .update({
        location_id: settings.location_id,
        custom_latitude: settings.custom_latitude,
        custom_longitude: settings.custom_longitude,
        timezone: settings.timezone,
        show_ekadashi: settings.show_ekadashi,
        show_festivals: settings.show_festivals,
        show_appearances: settings.show_appearances,
        show_disappearances: settings.show_disappearances,
        show_moon_phase: settings.show_moon_phase,
        show_sunrise_sunset: settings.show_sunrise_sunset,
        notify_ekadashi: settings.notify_ekadashi,
        notify_festivals: settings.notify_festivals,
        notify_day_before: settings.notify_day_before,
        notification_time: settings.notification_time,
        fasting_level: settings.fasting_level,
        default_view: settings.default_view,
        week_starts_monday: settings.week_starts_monday,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return data || null;
  } catch (error) {
    console.error("Failed to update user calendar settings:", error);
    return null;
  }
}

// ============================================
// VAISHNAVA MONTHS
// ============================================

/**
 * Get all Vaishnava months
 */
export async function getVaishnavMonths(): Promise<VaishnavMonth[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("vaishnava_months")
      .select("*")
      .order("month_number", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Failed to get Vaishnava months:", error);
    return [];
  }
}

/**
 * Get current Vaishnava month (approximate)
 */
export async function getCurrentVaishnavMonth(): Promise<VaishnavMonth | null> {
  // This is a simplified approximation
  // In reality, Vaishnava months are determined by lunar calculations
  const gregorianMonth = new Date().getMonth(); // 0-11

  // Rough mapping (varies by year)
  // This should ideally come from calculated calendar data
  const monthMapping: Record<number, number> = {
    0: 9, // Jan -> Pausha/Narayana
    1: 10, // Feb -> Magha/Govinda
    2: 11, // Mar -> Phalguna/Vishnu
    3: 12, // Apr -> Chaitra/Madhava
    4: 1, // May -> Vaishakha/Madhusudana
    5: 2, // Jun -> Jyeshtha/Trivikrama
    6: 3, // Jul -> Ashadha/Vamana
    7: 4, // Aug -> Shravana/Shridhara
    8: 5, // Sep -> Bhadrapada/Hrishikesha
    9: 6, // Oct -> Ashvina/Padmanabha
    10: 7, // Nov -> Kartika/Damodara
    11: 8, // Dec -> Margashirsha/Keshava
  };

  try {
    const vaishnavMonthNumber = monthMapping[gregorianMonth] || 1;

    const { data, error } = await (supabase as any)
      .from("vaishnava_months")
      .select("*")
      .eq("month_number", vaishnavMonthNumber)
      .single();

    if (error) throw error;

    return data || null;
  } catch (error) {
    console.error("Failed to get current Vaishnava month:", error);
    return null;
  }
}

// ============================================
// TITHI TYPES
// ============================================

/**
 * Get all tithi types
 */
export async function getTithiTypes(): Promise<TithiType[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("tithi_types")
      .select("*")
      .order("paksha", { ascending: true })
      .order("tithi_number", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Failed to get tithi types:", error);
    return [];
  }
}

// ============================================
// LOCAL STORAGE FALLBACK
// ============================================

const LOCAL_SETTINGS_KEY = "veda_calendar_settings";

/**
 * Get calendar settings from localStorage (for non-logged users)
 */
export function getLocalCalendarSettings(): Partial<UserCalendarSettings> {
  try {
    const data = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!data) {
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        show_ekadashi: true,
        show_festivals: true,
        show_appearances: true,
        show_disappearances: true,
        show_moon_phase: true,
        default_view: "month",
        week_starts_monday: true,
      };
    }
    return JSON.parse(data);
  } catch {
    return {};
  }
}

/**
 * Save calendar settings to localStorage
 */
export function saveLocalCalendarSettings(
  settings: Partial<UserCalendarSettings>
): void {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save local calendar settings:", error);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date for display
 */
export function formatCalendarDate(
  date: Date | string,
  locale: "uk" | "en" = "uk"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy", { locale: locale === "uk" ? uk : undefined });
}

/**
 * Get month name
 */
export function getMonthName(
  month: number,
  locale: "uk" | "en" = "uk"
): string {
  const date = new Date(2024, month, 1);
  return format(date, "LLLL", { locale: locale === "uk" ? uk : undefined });
}

/**
 * Navigate to previous/next month
 */
export function navigateMonth(
  currentDate: Date,
  direction: "prev" | "next"
): Date {
  return direction === "prev"
    ? subMonths(currentDate, 1)
    : addMonths(currentDate, 1);
}
