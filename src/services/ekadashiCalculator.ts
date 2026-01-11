/**
 * Ekadashi Calculator Service
 *
 * Calculates fasting times for Ekadashi based on geolocation following ISKCON rules:
 * - Fasting starts at sunrise on Ekadashi day
 * - Parana (breaking fast) happens after sunrise on Dvadashi (12th day)
 * - Parana must be within Dvadashi tithi
 * - Hari Vasara (first 1/4 of Dvadashi) should be avoided for parana
 *
 * Uses astronomy-engine for precise astronomical calculations
 */

import * as Astronomy from 'astronomy-engine';

// ============================================
// TYPES
// ============================================

export interface GeoLocation {
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
}

export interface EkadashiFastingTimes {
  // Fasting start (sunrise on Ekadashi)
  fastingStart: Date;
  fastingStartFormatted: string;

  // Fasting end / Parana times
  paranaDate: Date;
  paranaStart: Date;
  paranaEnd: Date;
  paranaStartFormatted: string;
  paranaEndFormatted: string;

  // Hari Vasara (first 1/4 of Dvadashi - avoid breaking fast during this time)
  hariVasaraEnd?: Date;
  hariVasaraEndFormatted?: string;

  // Sunrise/Sunset on Ekadashi day
  ekadashiSunrise: Date;
  ekadashiSunset: Date;
  ekadashiSunriseFormatted: string;
  ekadashiSunsetFormatted: string;

  // Sunrise on Dvadashi (parana day)
  dvadashiSunrise: Date;
  dvadashiSunriseFormatted: string;

  // Location info
  location: GeoLocation;

  // Additional info
  isDvadashiParana: boolean; // true if parana is on Dvadashi
  notes_ua?: string;
  notes_en?: string;
}

export interface DailyPanchangTimes {
  date: Date;
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dayDuration: number; // in minutes
  nightDuration: number; // in minutes

  // Muhurtas (48-minute periods)
  brahmamuhurata: { start: Date; end: Date };
  pratahkala: { start: Date; end: Date }; // Morning period, best for parana

  sunriseFormatted: string;
  sunsetFormatted: string;
}

// Fasting levels for appearance/disappearance days
export type FastingLevel = 'nirjala' | 'full' | 'half' | 'none';

// Event types
export type VaishnavEventType = 'ekadashi' | 'appearance' | 'disappearance' | 'festival';

/**
 * Universal fasting times for any Vaishnava event
 * (appearances, disappearances, festivals, etc.)
 */
export interface VaishnavEventFastingTimes {
  // Event info
  eventType: VaishnavEventType;
  eventName?: string;
  eventDate: Date;
  eventDateFormatted: string;

  // Fasting level
  fastingLevel: FastingLevel;
  fastingLevelDescription_ua: string;
  fastingLevelDescription_en: string;

  // Fasting start (sunrise on event day)
  fastingStart: Date;
  fastingStartFormatted: string;

  // Fasting end / Breaking fast time
  fastingEnd: Date;
  fastingEndFormatted: string;
  breakFastDescription_ua: string;
  breakFastDescription_en: string;

  // Sunrise/Sunset on event day
  sunrise: Date;
  sunset: Date;
  sunriseFormatted: string;
  sunsetFormatted: string;

  // Solar noon (important for "fasting until noon")
  solarNoon: Date;
  solarNoonFormatted: string;

  // Next day sunrise (for breaking fast next morning)
  nextDaySunrise?: Date;
  nextDaySunriseFormatted?: string;

  // Location info
  location: GeoLocation;

  // Additional notes
  notes_ua: string;
  notes_en: string;
}

// ============================================
// ASTRONOMICAL CALCULATIONS
// ============================================

/**
 * Creates an Astronomy.Observer for a given location
 */
function createObserver(location: GeoLocation): Astronomy.Observer {
  return new Astronomy.Observer(
    location.latitude,
    location.longitude,
    0 // elevation in meters
  );
}

/**
 * Calculate sunrise and sunset for a specific date and location
 */
export function calculateSunTimes(date: Date, location: GeoLocation): SunTimes {
  const observer = createObserver(location);

  // Start searching from midnight of the given date
  const searchDate = new Date(date);
  searchDate.setHours(0, 0, 0, 0);
  const astroTime = Astronomy.MakeTime(searchDate);

  // Find sunrise
  const sunriseResult = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    +1, // direction: +1 = rise
    astroTime,
    1 // limit search to 1 day
  );

  // Find sunset
  const sunsetResult = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    -1, // direction: -1 = set
    astroTime,
    1
  );

  // Find solar noon (culmination)
  const noonResult = Astronomy.SearchHourAngle(
    Astronomy.Body.Sun,
    observer,
    0, // hour angle 0 = meridian crossing
    astroTime,
    +1
  );

  if (!sunriseResult || !sunsetResult) {
    throw new Error('Could not calculate sun times for this location and date');
  }

  return {
    sunrise: sunriseResult.date,
    sunset: sunsetResult.date,
    solarNoon: noonResult.time.date,
  };
}

/**
 * Calculate daily Panchang times including muhurtas
 */
export function calculateDailyPanchang(date: Date, location: GeoLocation): DailyPanchangTimes {
  const sunTimes = calculateSunTimes(date, location);

  const dayDuration = (sunTimes.sunset.getTime() - sunTimes.sunrise.getTime()) / (1000 * 60);
  const nightDuration = 24 * 60 - dayDuration;

  // Brahma Muhurta: 1 hour 36 minutes before sunrise (2 muhurtas = 96 minutes)
  const brahmaMuhurtaStart = new Date(sunTimes.sunrise.getTime() - 96 * 60 * 1000);
  const brahmaMuhurtaEnd = new Date(sunTimes.sunrise.getTime() - 48 * 60 * 1000);

  // Pratahkala: First part of the day after sunrise (approximately first 3 hours)
  // This is the preferred time for breaking Ekadashi fast
  const pratahkalaStart = sunTimes.sunrise;
  const pratahkalaEnd = new Date(sunTimes.sunrise.getTime() + 3 * 60 * 60 * 1000);

  return {
    date,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    solarNoon: sunTimes.solarNoon,
    dayDuration,
    nightDuration,
    brahmamuhurata: { start: brahmaMuhurtaStart, end: brahmaMuhurtaEnd },
    pratahkala: { start: pratahkalaStart, end: pratahkalaEnd },
    sunriseFormatted: formatTime(sunTimes.sunrise, location.timezone),
    sunsetFormatted: formatTime(sunTimes.sunset, location.timezone),
  };
}

// ============================================
// EKADASHI FASTING CALCULATIONS
// ============================================

/**
 * Calculate Ekadashi fasting times
 *
 * @param ekadashiDate - The date of Ekadashi
 * @param location - Geographic location
 * @param dvadashiEndTime - Optional: When Dvadashi tithi ends (for precise parana calculation)
 */
export function calculateEkadashiFastingTimes(
  ekadashiDate: Date,
  location: GeoLocation,
  dvadashiEndTime?: Date
): EkadashiFastingTimes {
  // Calculate sun times for Ekadashi day
  const ekadashiSunTimes = calculateSunTimes(ekadashiDate, location);

  // Calculate sun times for Dvadashi (next day - parana day)
  const dvadashiDate = new Date(ekadashiDate);
  dvadashiDate.setDate(dvadashiDate.getDate() + 1);
  const dvadashiSunTimes = calculateSunTimes(dvadashiDate, location);

  // Fasting starts at sunrise on Ekadashi
  const fastingStart = ekadashiSunTimes.sunrise;

  // Parana (breaking fast) - default rules:
  // 1. Start after sunrise on Dvadashi
  // 2. Best time is Pratahkala (first ~3 hours after sunrise)
  // 3. Avoid Hari Vasara (first 1/4 of Dvadashi tithi)

  // Calculate Pratahkala end (3 hours after Dvadashi sunrise)
  const pratahkalaEnd = new Date(dvadashiSunTimes.sunrise.getTime() + 3 * 60 * 60 * 1000);

  // Default parana window: sunrise to 3 hours after sunrise (Pratahkala)
  let paranaStart = dvadashiSunTimes.sunrise;
  let paranaEnd = pratahkalaEnd;

  // If Dvadashi tithi end time is provided, adjust parana end
  // Parana must be completed before Dvadashi ends
  if (dvadashiEndTime && dvadashiEndTime < paranaEnd) {
    paranaEnd = dvadashiEndTime;

    // If Dvadashi ends before sunrise, parana should still start at sunrise
    // but end time will be limited
    if (dvadashiEndTime < paranaStart) {
      paranaEnd = new Date(paranaStart.getTime() + 30 * 60 * 1000); // 30 min window after sunrise
    }
  }

  // Calculate Hari Vasara (first 1/4 of Dvadashi)
  // This is a simplified calculation - ideally should use actual tithi duration
  // For now, we estimate it as first hour after sunrise
  const hariVasaraEnd = new Date(dvadashiSunTimes.sunrise.getTime() + 60 * 60 * 1000);

  // If parana start falls within Hari Vasara, move it to after Hari Vasara
  if (paranaStart < hariVasaraEnd) {
    const adjustedParanaStart = hariVasaraEnd;
    // Only adjust if it doesn't exceed parana end time
    if (adjustedParanaStart < paranaEnd) {
      paranaStart = adjustedParanaStart;
    }
  }

  // Generate notes
  const notes_ua = generateNotesUa(paranaStart, paranaEnd, hariVasaraEnd, dvadashiEndTime);
  const notes_en = generateNotesEn(paranaStart, paranaEnd, hariVasaraEnd, dvadashiEndTime);

  return {
    fastingStart,
    fastingStartFormatted: formatTime(fastingStart, location.timezone),

    paranaDate: dvadashiDate,
    paranaStart,
    paranaEnd,
    paranaStartFormatted: formatTime(paranaStart, location.timezone),
    paranaEndFormatted: formatTime(paranaEnd, location.timezone),

    hariVasaraEnd,
    hariVasaraEndFormatted: formatTime(hariVasaraEnd, location.timezone),

    ekadashiSunrise: ekadashiSunTimes.sunrise,
    ekadashiSunset: ekadashiSunTimes.sunset,
    ekadashiSunriseFormatted: formatTime(ekadashiSunTimes.sunrise, location.timezone),
    ekadashiSunsetFormatted: formatTime(ekadashiSunTimes.sunset, location.timezone),

    dvadashiSunrise: dvadashiSunTimes.sunrise,
    dvadashiSunriseFormatted: formatTime(dvadashiSunTimes.sunrise, location.timezone),

    location,
    isDvadashiParana: true,
    notes_ua,
    notes_en,
  };
}

// ============================================
// APPEARANCE/DISAPPEARANCE FASTING CALCULATIONS
// ============================================

/**
 * Get fasting level descriptions
 */
function getFastingLevelDescriptions(level: FastingLevel): {
  ua: string;
  en: string;
} {
  const descriptions: Record<FastingLevel, { ua: string; en: string }> = {
    nirjala: {
      ua: 'Повний піст без води (ніраджала)',
      en: 'Complete fast without water (nirjala)',
    },
    full: {
      ua: 'Повний піст (без зернових та бобових)',
      en: 'Full fast (no grains or beans)',
    },
    half: {
      ua: 'Піст до полудня',
      en: 'Fast until noon',
    },
    none: {
      ua: 'Без посту (святкування)',
      en: 'No fasting (celebration)',
    },
  };

  return descriptions[level];
}

/**
 * Get break fast descriptions based on fasting level
 */
function getBreakFastDescriptions(
  level: FastingLevel,
  solarNoon: Date,
  nextSunrise: Date,
  timezone?: string
): {
  ua: string;
  en: string;
  breakTime: Date;
} {
  const noonFormatted = formatTime(solarNoon, timezone);
  const nextSunriseFormatted = formatTime(nextSunrise, timezone);

  switch (level) {
    case 'nirjala':
      return {
        ua: `Переривання посту наступного дня після сходу сонця (${nextSunriseFormatted})`,
        en: `Break fast next day after sunrise (${nextSunriseFormatted})`,
        breakTime: nextSunrise,
      };
    case 'full':
      return {
        ua: `Переривання посту наступного дня після сходу сонця (${nextSunriseFormatted})`,
        en: `Break fast next day after sunrise (${nextSunriseFormatted})`,
        breakTime: nextSunrise,
      };
    case 'half':
      return {
        ua: `Переривання посту після полудня (${noonFormatted})`,
        en: `Break fast after noon (${noonFormatted})`,
        breakTime: solarNoon,
      };
    case 'none':
      return {
        ua: 'Піст не потрібен',
        en: 'No fasting required',
        breakTime: solarNoon,
      };
  }
}

/**
 * Generate notes for appearance/disappearance day fasting
 */
function generateEventFastingNotes(
  eventType: VaishnavEventType,
  level: FastingLevel,
  eventName?: string
): { ua: string; en: string } {
  const eventTypeNames = {
    appearance: { ua: 'явлення', en: 'appearance' },
    disappearance: { ua: 'відходу', en: 'disappearance' },
    festival: { ua: 'свята', en: 'festival' },
    ekadashi: { ua: 'екадаші', en: 'ekadashi' },
  };

  const typeName = eventTypeNames[eventType];
  const name = eventName || '';

  let notes_ua = '';
  let notes_en = '';

  if (eventType === 'appearance') {
    notes_ua = `День явлення ${name}. `;
    notes_en = `Appearance day of ${name}. `;

    if (level === 'half') {
      notes_ua += 'Рекомендується дотримуватись посту до полудня, а потім святкувати з прасадом.';
      notes_en += 'It is recommended to fast until noon, then celebrate with prasadam.';
    } else if (level === 'full') {
      notes_ua += 'Рекомендується повний піст без зернових. Святкування з прасадом наступного дня.';
      notes_en += 'Full fast without grains is recommended. Celebrate with prasadam the next day.';
    }
  } else if (eventType === 'disappearance') {
    notes_ua = `День відходу ${name}. `;
    notes_en = `Disappearance day of ${name}. `;

    if (level === 'half') {
      notes_ua += 'Рекомендується дотримуватись посту до полудня на честь відданого.';
      notes_en += 'It is recommended to fast until noon in honor of the devotee.';
    } else if (level === 'full') {
      notes_ua += 'Рекомендується повний піст на честь відданого.';
      notes_en += 'Full fast is recommended in honor of the devotee.';
    }
  } else if (eventType === 'festival') {
    notes_ua = `Свято ${name}. `;
    notes_en = `Festival of ${name}. `;

    if (level !== 'none') {
      notes_ua += 'Дотримуйтесь рекомендованого посту та беріть участь у святкуванні.';
      notes_en += 'Follow the recommended fasting and participate in the celebration.';
    } else {
      notes_ua += 'Беріть участь у святкуванні з прасадом!';
      notes_en += 'Participate in the celebration with prasadam!';
    }
  }

  return { ua: notes_ua, en: notes_en };
}

/**
 * Calculate fasting times for appearance/disappearance days and festivals
 *
 * @param eventDate - The date of the event
 * @param location - Geographic location
 * @param eventType - Type of event (appearance, disappearance, festival)
 * @param fastingLevel - Level of fasting for this event
 * @param eventName - Optional name of the event/person
 */
export function calculateVaishnavEventFastingTimes(
  eventDate: Date,
  location: GeoLocation,
  eventType: VaishnavEventType,
  fastingLevel: FastingLevel = 'half',
  eventName?: string
): VaishnavEventFastingTimes {
  // Calculate sun times for event day
  const sunTimes = calculateSunTimes(eventDate, location);

  // Calculate next day sunrise (for breaking fast)
  const nextDay = new Date(eventDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDaySunTimes = calculateSunTimes(nextDay, location);

  // Get descriptions
  const levelDesc = getFastingLevelDescriptions(fastingLevel);
  const breakFastInfo = getBreakFastDescriptions(
    fastingLevel,
    sunTimes.solarNoon,
    nextDaySunTimes.sunrise,
    location.timezone
  );
  const notes = generateEventFastingNotes(eventType, fastingLevel, eventName);

  // Format event date
  const eventDateFormatted = eventDate.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: location.timezone,
  });

  return {
    eventType,
    eventName,
    eventDate,
    eventDateFormatted,

    fastingLevel,
    fastingLevelDescription_ua: levelDesc.ua,
    fastingLevelDescription_en: levelDesc.en,

    fastingStart: sunTimes.sunrise,
    fastingStartFormatted: formatTime(sunTimes.sunrise, location.timezone),

    fastingEnd: breakFastInfo.breakTime,
    fastingEndFormatted: formatTime(breakFastInfo.breakTime, location.timezone),
    breakFastDescription_ua: breakFastInfo.ua,
    breakFastDescription_en: breakFastInfo.en,

    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    sunriseFormatted: formatTime(sunTimes.sunrise, location.timezone),
    sunsetFormatted: formatTime(sunTimes.sunset, location.timezone),

    solarNoon: sunTimes.solarNoon,
    solarNoonFormatted: formatTime(sunTimes.solarNoon, location.timezone),

    nextDaySunrise: nextDaySunTimes.sunrise,
    nextDaySunriseFormatted: formatTime(nextDaySunTimes.sunrise, location.timezone),

    location,

    notes_ua: notes.ua,
    notes_en: notes.en,
  };
}

/**
 * Calculate sun times for a range of dates (useful for calendar display)
 */
export function calculateSunTimesForRange(
  startDate: Date,
  endDate: Date,
  location: GeoLocation
): Map<string, SunTimes> {
  const result = new Map<string, SunTimes>();
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateKey = formatDateKey(currentDate);
    try {
      result.set(dateKey, calculateSunTimes(currentDate, location));
    } catch (error) {
      console.error(`Failed to calculate sun times for ${dateKey}:`, error);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

// ============================================
// MOON PHASE CALCULATIONS
// ============================================

/**
 * Calculate moon phase for a given date
 * Returns a value from 0 to 1:
 * - 0 = New Moon
 * - 0.25 = First Quarter
 * - 0.5 = Full Moon
 * - 0.75 = Last Quarter
 */
export function calculateMoonPhase(date: Date): number {
  const astroTime = Astronomy.MakeTime(date);
  return Astronomy.MoonPhase(astroTime) / 360; // Convert degrees to 0-1 range
}

/**
 * Get moon illumination percentage
 */
export function getMoonIllumination(date: Date): number {
  const astroTime = Astronomy.MakeTime(date);
  const phase = Astronomy.MoonPhase(astroTime);

  // Moon illumination based on phase angle
  // 0° = New Moon (0% illumination)
  // 180° = Full Moon (100% illumination)
  return Math.round((1 - Math.cos(phase * Math.PI / 180)) / 2 * 100);
}

/**
 * Find next new moon from a given date
 */
export function findNextNewMoon(date: Date): Date {
  const astroTime = Astronomy.MakeTime(date);
  const nextNewMoon = Astronomy.SearchMoonPhase(0, astroTime, 40); // Search for 0° = New Moon
  return nextNewMoon.date;
}

/**
 * Find next full moon from a given date
 */
export function findNextFullMoon(date: Date): Date {
  const astroTime = Astronomy.MakeTime(date);
  const nextFullMoon = Astronomy.SearchMoonPhase(180, astroTime, 40); // Search for 180° = Full Moon
  return nextFullMoon.date;
}

// ============================================
// TITHI CALCULATIONS (Approximate)
// ============================================

/**
 * Calculate approximate tithi for a given date and time
 *
 * Tithi is based on the angular distance between Sun and Moon (12° per tithi)
 * There are 30 tithis in a lunar month (15 in Shukla Paksha, 15 in Krishna Paksha)
 *
 * Returns: { tithi: 1-30, paksha: 'shukla' | 'krishna' }
 */
export function calculateTithi(date: Date): { tithi: number; paksha: 'shukla' | 'krishna'; tithiInPaksha: number } {
  const astroTime = Astronomy.MakeTime(date);

  // Get elongation (angular distance) between Moon and Sun
  const elongation = Astronomy.Elongation(Astronomy.Body.Moon, astroTime);

  // Calculate tithi (each tithi spans 12 degrees)
  // Elongation goes from 0° (New Moon) to 360° back to New Moon
  const tithiFloat = elongation.elongation / 12;
  const tithi = Math.floor(tithiFloat) + 1; // 1-30

  // Determine paksha
  // 1-15 = Shukla (waxing, bright fortnight)
  // 16-30 = Krishna (waning, dark fortnight)
  const paksha = tithi <= 15 ? 'shukla' : 'krishna';
  const tithiInPaksha = tithi <= 15 ? tithi : tithi - 15;

  return { tithi, paksha, tithiInPaksha };
}

/**
 * Check if a date is Ekadashi (11th tithi of either paksha)
 */
export function isEkadashi(date: Date): boolean {
  const { tithiInPaksha } = calculateTithi(date);
  return tithiInPaksha === 11;
}

/**
 * Find next Ekadashi from a given date
 */
export function findNextEkadashi(fromDate: Date): Date {
  const searchDate = new Date(fromDate);

  // Search for up to 30 days
  for (let i = 0; i < 30; i++) {
    if (isEkadashi(searchDate)) {
      return searchDate;
    }
    searchDate.setDate(searchDate.getDate() + 1);
  }

  return searchDate;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format time to HH:MM string
 */
function formatTime(date: Date, timezone?: string): string {
  try {
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    });
  } catch {
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Generate Ukrainian notes for parana
 */
function generateNotesUa(
  paranaStart: Date,
  paranaEnd: Date,
  hariVasaraEnd: Date,
  dvadashiEnd?: Date
): string {
  const notes: string[] = [];

  notes.push(`Парана (переривання посту) має бути здійснена після сходу сонця на Двадаші.`);

  if (hariVasaraEnd) {
    notes.push(`Уникайте Харі Васари (перша чверть Двадаші) до ${formatTime(hariVasaraEnd)}.`);
  }

  if (dvadashiEnd) {
    notes.push(`Двадаші тітхі закінчується о ${formatTime(dvadashiEnd)}. Парану слід завершити до цього часу.`);
  }

  notes.push(`Найкращий час для парани — Пратахкала (ранкова година), перші 3 години після сходу сонця.`);

  return notes.join(' ');
}

/**
 * Generate English notes for parana
 */
function generateNotesEn(
  paranaStart: Date,
  paranaEnd: Date,
  hariVasaraEnd: Date,
  dvadashiEnd?: Date
): string {
  const notes: string[] = [];

  notes.push(`Parana (breaking the fast) should be done after sunrise on Dvadashi.`);

  if (hariVasaraEnd) {
    notes.push(`Avoid Hari Vasara (first quarter of Dvadashi) until ${formatTime(hariVasaraEnd)}.`);
  }

  if (dvadashiEnd) {
    notes.push(`Dvadashi tithi ends at ${formatTime(dvadashiEnd)}. Parana should be completed before this time.`);
  }

  notes.push(`The best time for parana is Pratahkala (morning period), the first 3 hours after sunrise.`);

  return notes.join(' ');
}

/**
 * Format time duration in human-readable format
 */
export function formatDuration(minutes: number, locale: 'ua' | 'en' = 'ua'): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (locale === 'ua') {
    if (hours === 0) return `${mins} хв`;
    if (mins === 0) return `${hours} год`;
    return `${hours} год ${mins} хв`;
  } else {
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  }
}

/**
 * Get day length info for a location
 */
export function getDayLengthInfo(date: Date, location: GeoLocation): {
  dayLength: string;
  nightLength: string;
  dayMinutes: number;
  nightMinutes: number;
} {
  const panchang = calculateDailyPanchang(date, location);

  return {
    dayLength: formatDuration(panchang.dayDuration),
    nightLength: formatDuration(panchang.nightDuration),
    dayMinutes: panchang.dayDuration,
    nightMinutes: panchang.nightDuration,
  };
}

// ============================================
// EXPORT DEFAULT CALCULATOR
// ============================================

const ekadashiCalculator = {
  calculateSunTimes,
  calculateDailyPanchang,
  calculateEkadashiFastingTimes,
  calculateVaishnavEventFastingTimes,
  calculateSunTimesForRange,
  calculateMoonPhase,
  getMoonIllumination,
  findNextNewMoon,
  findNextFullMoon,
  calculateTithi,
  isEkadashi,
  findNextEkadashi,
  formatDuration,
  getDayLengthInfo,
};

export default ekadashiCalculator;
