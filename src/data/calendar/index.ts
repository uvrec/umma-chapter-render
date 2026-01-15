/**
 * Calendar data loader for static Vaishnava calendar events
 * Data sourced from vaisnavacalendar.info
 */

import germanyCalendar2026 from './germany-2026.json';

export interface CalendarMetadata {
  source: string;
  source_location: string;
  year: number;
  timezone: string;
  utc_offset: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  applicable_cities: string[];
  generated_at: string;
  notes: string;
}

export interface CalendarEventData {
  date: string;
  name_en: string;
  name_ua: string;
  type: 'ekadashi' | 'festival' | 'appearance' | 'disappearance' | 'parana' | 'caturmasya' | 'info';
  fasting: 'nirjala' | 'full' | 'half' | null;
  fasting_note_en?: string;
  fasting_note_ua?: string;
  ekadashi_name?: string;
  is_major?: boolean;
  parana_start?: string;
  parana_end?: string | null;
  caturmasya_month?: number;
  caturmasya_restriction_en?: string;
  caturmasya_restriction_ua?: string;
}

export interface CalendarData {
  metadata: CalendarMetadata;
  events: CalendarEventData[];
}

/**
 * Get calendar data for a specific location and year
 */
export function getCalendarData(location: string, year: number): CalendarData | null {
  const locationLower = location.toLowerCase();

  // Germany 2026
  if (year === 2026 && (
    locationLower.includes('germany') ||
    locationLower.includes('deutschland') ||
    locationLower.includes('frankfurt') ||
    locationLower.includes('würzburg') ||
    locationLower.includes('wurzburg') ||
    locationLower.includes('nürnberg') ||
    locationLower.includes('nurnberg') ||
    locationLower.includes('heidelberg') ||
    locationLower.includes('mannheim')
  )) {
    return germanyCalendar2026 as CalendarData;
  }

  return null;
}

/**
 * Get events for a specific date
 */
export function getEventsForDate(date: string, location: string = 'germany'): CalendarEventData[] {
  const year = parseInt(date.substring(0, 4), 10);
  const calendarData = getCalendarData(location, year);

  if (!calendarData) return [];

  return calendarData.events.filter(event => event.date === date);
}

/**
 * Get events for a date range
 */
export function getEventsForDateRange(
  startDate: string,
  endDate: string,
  location: string = 'germany'
): CalendarEventData[] {
  const year = parseInt(startDate.substring(0, 4), 10);
  const calendarData = getCalendarData(location, year);

  if (!calendarData) return [];

  return calendarData.events.filter(event =>
    event.date >= startDate && event.date <= endDate
  );
}

/**
 * Get all ekadashi events for a year
 */
export function getEkadashiEvents(year: number, location: string = 'germany'): CalendarEventData[] {
  const calendarData = getCalendarData(location, year);

  if (!calendarData) return [];

  return calendarData.events.filter(event => event.type === 'ekadashi');
}

/**
 * Get next ekadashi from a given date
 */
export function getNextEkadashiFromDate(
  fromDate: string,
  location: string = 'germany'
): CalendarEventData | null {
  const year = parseInt(fromDate.substring(0, 4), 10);
  const calendarData = getCalendarData(location, year);

  if (!calendarData) return null;

  const ekadashis = calendarData.events.filter(
    event => event.type === 'ekadashi' && event.date >= fromDate
  );

  return ekadashis.length > 0 ? ekadashis[0] : null;
}

/**
 * Get parana (fast breaking) info for a date
 */
export function getParanaForDate(date: string, location: string = 'germany'): CalendarEventData | null {
  const events = getEventsForDate(date, location);
  return events.find(event => event.type === 'parana') || null;
}

/**
 * Get all major festivals for a year
 */
export function getMajorFestivals(year: number, location: string = 'germany'): CalendarEventData[] {
  const calendarData = getCalendarData(location, year);

  if (!calendarData) return [];

  return calendarData.events.filter(event => event.is_major === true);
}

/**
 * Get all appearance/disappearance days for a year
 */
export function getAppearanceDays(year: number, location: string = 'germany'): CalendarEventData[] {
  const calendarData = getCalendarData(location, year);

  if (!calendarData) return [];

  return calendarData.events.filter(
    event => event.type === 'appearance' || event.type === 'disappearance'
  );
}

/**
 * Get Caturmasya info for a year
 */
export function getCaturmasyaInfo(year: number, location: string = 'germany'): CalendarEventData[] {
  const calendarData = getCalendarData(location, year);

  if (!calendarData) return [];

  return calendarData.events.filter(event => event.type === 'caturmasya');
}

/**
 * Get available locations
 */
export function getAvailableLocations(): { location: string; year: number; cities: string[] }[] {
  return [
    {
      location: 'germany',
      year: 2026,
      cities: germanyCalendar2026.metadata.applicable_cities
    }
  ];
}

/**
 * Check if calendar data is available for a location/year
 */
export function hasCalendarData(location: string, year: number): boolean {
  return getCalendarData(location, year) !== null;
}

// Export calendar data for direct access
export { germanyCalendar2026 };
