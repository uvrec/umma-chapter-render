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

import {
  Observer,
  Body,
  MakeTime,
  SearchRiseSet,
  SearchHourAngle,
  MoonPhase,
  SearchMoonPhase,
  Illumination,
} from 'astronomy-engine';

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
 * Creates an Observer for a given location
 */
function createObserver(location: GeoLocation): Observer {
  return new Observer(
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
  const astroTime = MakeTime(searchDate);

  // Find sunrise
  const sunriseResult = SearchRiseSet(
    Body.Sun,
    observer,
    +1, // direction: +1 = rise
    astroTime,
    1 // limit search to 1 day
  );

  // Find sunset
  const sunsetResult = SearchRiseSet(
    Body.Sun,
    observer,
    -1, // direction: -1 = set
    astroTime,
    1
  );

  // Find solar noon (culmination)
  const noonResult = SearchHourAngle(
    Body.Sun,
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
  const descriptions: Record<FastingLevel, { uk: string; en: string }> = {
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
): { uk: string; en: string } {
  const eventTypeNames = {
    appearance: { uk: 'явлення', en: 'appearance' },
    disappearance: { uk: 'відходу', en: 'disappearance' },
    festival: { uk: 'свята', en: 'festival' },
    ekadashi: { uk: 'екадаші', en: 'ekadashi' },
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

  return { uk: notes_ua, en: notes_en };
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
    fastingLevelDescription_ua: levelDesc.uk,
    fastingLevelDescription_en: levelDesc.en,

    fastingStart: sunTimes.sunrise,
    fastingStartFormatted: formatTime(sunTimes.sunrise, location.timezone),

    fastingEnd: breakFastInfo.breakTime,
    fastingEndFormatted: formatTime(breakFastInfo.breakTime, location.timezone),
    breakFastDescription_ua: breakFastInfo.uk,
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

    notes_ua: notes.uk,
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
  const astroTime = MakeTime(date);
  return MoonPhase(astroTime) / 360; // Convert degrees to 0-1 range
}

/**
 * Get moon illumination percentage
 */
export function getMoonIllumination(date: Date): number {
  const astroTime = MakeTime(date);
  const phase = MoonPhase(astroTime);

  // Moon illumination based on phase angle
  // 0° = New Moon (0% illumination)
  // 180° = Full Moon (100% illumination)
  return Math.round((1 - Math.cos(phase * Math.PI / 180)) / 2 * 100);
}

/**
 * Find next new moon from a given date
 */
export function findNextNewMoon(date: Date): Date {
  const astroTime = MakeTime(date);
  const nextNewMoon = SearchMoonPhase(0, astroTime, 40); // Search for 0° = New Moon
  return nextNewMoon.date;
}

/**
 * Find next full moon from a given date
 */
export function findNextFullMoon(date: Date): Date {
  const astroTime = MakeTime(date);
  const nextFullMoon = SearchMoonPhase(180, astroTime, 40); // Search for 180° = Full Moon
  return nextFullMoon.date;
}

// ============================================
// TITHI CALCULATIONS
// ============================================

/**
 * Calculate tithi for a given date and time
 *
 * Tithi is based on the Moon's phase angle (0-360°), with each tithi spanning 12°
 * There are 30 tithis in a lunar month:
 * - Shukla Paksha (waxing, bright fortnight): tithis 1-15 (phase 0°-180°)
 * - Krishna Paksha (waning, dark fortnight): tithis 16-30 (phase 180°-360°)
 *
 * MoonPhase returns:
 * - 0° = New Moon (Amavasya - end of Krishna / start of Shukla)
 * - 90° = First Quarter
 * - 180° = Full Moon (Purnima - end of Shukla / start of Krishna)
 * - 270° = Last Quarter
 * - 360° = New Moon again
 *
 * @param date - The date and time to calculate tithi for
 * @returns { tithi: 1-30, paksha: 'shukla' | 'krishna', tithiInPaksha: 1-15 }
 */
export function calculateTithi(date: Date): { tithi: number; paksha: 'shukla' | 'krishna'; tithiInPaksha: number } {
  const astroTime = MakeTime(date);

  // MoonPhase returns 0-360° representing the lunar cycle
  // 0° = New Moon, 180° = Full Moon, 360° = New Moon again
  const moonPhase = MoonPhase(astroTime);

  // Calculate tithi (each tithi spans 12 degrees: 360° / 30 = 12°)
  const tithiFloat = moonPhase / 12;
  const tithi = Math.floor(tithiFloat) + 1; // 1-30

  // Determine paksha
  // Tithis 1-15 = Shukla Paksha (waxing moon, phase 0°-180°)
  // Tithis 16-30 = Krishna Paksha (waning moon, phase 180°-360°)
  const paksha = tithi <= 15 ? 'shukla' : 'krishna';
  const tithiInPaksha = tithi <= 15 ? tithi : tithi - 15;

  return { tithi, paksha, tithiInPaksha };
}

/**
 * Check if a date is Ekadashi using ISKCON rules
 *
 * ISKCON uses Brahma Muhurta (Arunodaya - 96 min before sunrise) as the check time:
 * 1. If Ekadashi (11th tithi) at Brahma Muhurta → that's Ekadashi day
 * 2. If Dashami (10th) at Brahma Muhurta → Ekadashi is "viddha" (contaminated)
 * 3. Mahadvadashi: If Dvadashi at Brahma Muhurta but Ekadashi was overnight
 *    and previous day was contaminated → observe today
 *
 * @param date - The date to check
 * @param location - Geographic location (required for accurate ISKCON calculation)
 */
export function isEkadashi(date: Date, location?: GeoLocation): boolean {
  // Simple check without location (legacy behavior - just check noon tithi)
  if (!location) {
    const { tithiInPaksha } = calculateTithi(date);
    return tithiInPaksha === 11;
  }

  // ISKCON-compliant check with location
  const result = isEkadashiISKCON(date, location);
  return result.isEkadashi;
}

/**
 * ISKCON-compliant Ekadashi detection
 *
 * Returns detailed information about whether a date is Ekadashi
 * according to ISKCON rules (Brahma Muhurta check + Mahadvadashi handling)
 */
export function isEkadashiISKCON(date: Date, location: GeoLocation): {
  isEkadashi: boolean;
  tithi: number;
  paksha: 'shukla' | 'krishna';
  checkType?: 'brahma_muhurta' | 'mahadvadashi';
} {
  const sunTimes = calculateSunTimes(date, location);
  const brahmaMuhurta = new Date(sunTimes.sunrise.getTime() - 96 * 60 * 1000);
  const tithiAtBrahma = calculateTithi(brahmaMuhurta);

  // Primary rule: Ekadashi at Brahma Muhurta
  if (tithiAtBrahma.tithiInPaksha === 11) {
    return {
      isEkadashi: true,
      tithi: tithiAtBrahma.tithiInPaksha,
      paksha: tithiAtBrahma.paksha,
      checkType: 'brahma_muhurta'
    };
  }

  // Mahadvadashi rule: Dvadashi at Brahma Muhurta, but check overnight
  if (tithiAtBrahma.tithiInPaksha === 12) {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevSunTimes = calculateSunTimes(prevDay, location);
    const tithiAtPrevSunset = calculateTithi(prevSunTimes.sunset);
    const prevBrahma = new Date(prevSunTimes.sunrise.getTime() - 96 * 60 * 1000);
    const tithiAtPrevBrahma = calculateTithi(prevBrahma);

    // If Ekadashi at prev sunset AND Dashami at prev Brahma Muhurta → Mahadvadashi
    if (tithiAtPrevSunset.tithiInPaksha === 11 && tithiAtPrevBrahma.tithiInPaksha === 10) {
      return {
        isEkadashi: true,
        tithi: 11,
        paksha: tithiAtPrevSunset.paksha,
        checkType: 'mahadvadashi'
      };
    }
  }

  return {
    isEkadashi: false,
    tithi: tithiAtBrahma.tithiInPaksha,
    paksha: tithiAtBrahma.paksha
  };
}

/**
 * Find next Ekadashi from a given date using ISKCON rules
 *
 * @param fromDate - Starting date for search
 * @param location - Geographic location (optional, uses simple tithi check if not provided)
 */
export function findNextEkadashi(fromDate: Date, location?: GeoLocation): Date {
  const searchDate = new Date(fromDate);

  // Search for up to 30 days
  for (let i = 0; i < 30; i++) {
    if (isEkadashi(searchDate, location)) {
      return searchDate;
    }
    searchDate.setDate(searchDate.getDate() + 1);
  }

  return searchDate;
}

/**
 * Find all Ekadashi dates in a year for a specific location
 *
 * Uses ISKCON rules and handles consecutive Brahma Muhurta Ekadashis
 * by preferring the later date (Shuddha Ekadashi)
 */
export function findAllEkadashisInYear(year: number, location: GeoLocation): Array<{
  date: Date;
  paksha: 'shukla' | 'krishna';
  checkType: 'brahma_muhurta' | 'mahadvadashi';
}> {
  const ekadashis: Array<{
    date: Date;
    paksha: 'shukla' | 'krishna';
    checkType: 'brahma_muhurta' | 'mahadvadashi';
  }> = [];

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const result = isEkadashiISKCON(currentDate, location);

    if (result.isEkadashi && result.checkType) {
      // Check if next day also has Ekadashi at Brahma Muhurta (same paksha)
      // If so, skip today and use tomorrow (Shuddha Ekadashi preference)
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextResult = isEkadashiISKCON(nextDay, location);

      if (nextResult.isEkadashi &&
          nextResult.paksha === result.paksha &&
          nextResult.checkType === 'brahma_muhurta') {
        // Skip today, will pick up tomorrow
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      ekadashis.push({
        date: new Date(currentDate),
        paksha: result.paksha,
        checkType: result.checkType
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return ekadashis;
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
export function formatDuration(minutes: number, locale: 'uk' | 'en' = 'uk'): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (locale === 'uk') {
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
  isEkadashiISKCON,
  findNextEkadashi,
  findAllEkadashisInYear,
  formatDuration,
  getDayLengthInfo,
};

export default ekadashiCalculator;
