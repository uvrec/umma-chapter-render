/**
 * TypeScript типи для Вайшнавського календаря
 */

// ============================================
// ОСНОВНІ ТИПИ
// ============================================

export type Paksha = 'shukla' | 'krishna';
export type FastingLevel = 'nirjala' | 'full' | 'half' | 'none';
export type EventType = 'appearance' | 'disappearance';
export type CalendarView = 'month' | 'week' | 'list';

// ============================================
// МІСЯЦІ ТА ТІТХІ
// ============================================

export interface VaishnavMonth {
  id: number;
  name_sanskrit: string;
  name_ua: string;
  name_en: string;
  month_number: number;
  description_ua?: string;
  description_en?: string;
}

export interface TithiType {
  id: number;
  tithi_number: number;
  paksha: Paksha;
  name_sanskrit: string;
  name_ua: string;
  name_en: string;
  is_ekadashi: boolean;
}

// ============================================
// ЕКАДАШІ
// ============================================

export interface EkadashiInfo {
  id: string;
  slug: string;
  vaishnava_month_id: number;
  paksha: Paksha;

  // Назви
  name_sanskrit: string;
  name_ua: string;
  name_en: string;

  // Слава з Падма Пурани
  glory_title_ua?: string;
  glory_title_en?: string;
  glory_text_ua?: string;
  glory_text_en?: string;
  glory_source?: string;

  // Божество та рекомендації
  presiding_deity_ua?: string;
  presiding_deity_en?: string;
  recommended_activities_ua?: string;
  recommended_activities_en?: string;

  // Правила посту
  fasting_rules_ua?: string;
  fasting_rules_en?: string;
  breaking_fast_time?: string;

  // Благословення
  benefits_ua?: string;
  benefits_en?: string;

  // Історія
  story_ua?: string;
  story_en?: string;
  mantras?: string[];

  // Медіа
  image_url?: string;

  // Мета
  sort_order: number;
  is_major: boolean;
  created_at: string;
  updated_at: string;
}

export interface EkadashiWithMonth extends EkadashiInfo {
  month: VaishnavMonth;
}

// ============================================
// СВЯТА ТА ЯВЛЕННЯ
// ============================================

export interface FestivalCategory {
  id: number;
  slug: string;
  name_ua: string;
  name_en: string;
  description_ua?: string;
  description_en?: string;
  icon?: string;
  color?: string;
  sort_order: number;
}

export interface AppearanceDay {
  id: string;
  slug: string;
  category_id: number;
  event_type: EventType;

  // Інформація про особу/Божество
  person_name_sanskrit?: string;
  person_name_ua: string;
  person_name_en: string;
  person_title_ua?: string;
  person_title_en?: string;

  // Місячний календар
  vaishnava_month_id?: number;
  tithi_number?: number;
  paksha?: Paksha;

  // Опис
  description_ua?: string;
  description_en?: string;
  short_description_ua?: string;
  short_description_en?: string;

  // Обряди
  observances_ua?: string;
  observances_en?: string;
  fasting_level?: FastingLevel;

  // Медіа
  image_url?: string;

  // Мета
  is_major: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface VaishnaFestival {
  id: string;
  slug: string;
  category_id: number;

  // Назви
  name_sanskrit?: string;
  name_ua: string;
  name_en: string;

  // Місячний календар
  vaishnava_month_id?: number;
  tithi_number?: number;
  paksha?: Paksha;

  // Опис
  description_ua?: string;
  description_en?: string;
  short_description_ua?: string;
  short_description_en?: string;

  // Значення
  significance_ua?: string;
  significance_en?: string;

  // Обряди
  observances_ua?: string;
  observances_en?: string;
  fasting_level?: FastingLevel;

  // Пов'язаний контент
  related_verses?: string[];
  related_books?: string[];

  // Медіа
  image_url?: string;
  gallery_urls?: string[];

  // Мета
  is_major: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// ПОДІЇ КАЛЕНДАРЯ
// ============================================

export interface CalendarEvent {
  id: string;
  event_date: string; // ISO date
  year: number;

  // Посилання на подію
  ekadashi_id?: string;
  festival_id?: string;
  appearance_day_id?: string;

  // Перевизначені значення
  custom_name_ua?: string;
  custom_name_en?: string;
  custom_description_ua?: string;
  custom_description_en?: string;

  // Місячні дані
  tithi_number?: number;
  paksha?: Paksha;
  vaishnava_month_id?: number;
  moon_phase?: number;

  // Час
  sunrise_time?: string;
  sunset_time?: string;
  ekadashi_start_time?: string;
  ekadashi_end_time?: string;
  parana_start_time?: string;
  parana_end_time?: string;

  // Локація
  location_id?: string;
  timezone?: string;

  // Мета
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Розширена подія з деталями
export interface CalendarEventWithDetails extends CalendarEvent {
  ekadashi?: EkadashiInfo;
  festival?: VaishnaFestival;
  appearance_day?: AppearanceDay;
  month?: VaishnavMonth;
  category?: FestivalCategory;
}

// Спрощена подія для відображення
export interface CalendarEventDisplay {
  event_id: string;
  event_date: string;
  event_type: 'ekadashi' | 'festival' | 'appearance' | 'disappearance' | 'parana' | 'caturmasya' | 'info' | 'other';
  name_ua: string;
  name_en: string;
  description_ua?: string;
  description_en?: string;
  category_slug?: string;
  category_color?: string;
  is_ekadashi: boolean;
  is_major: boolean;
  moon_phase?: number;
  sunrise_time?: string;
  sunset_time?: string;

  // Тітхі та пакша
  tithi_number?: number;
  tithi_name_ua?: string;
  tithi_name_en?: string;
  paksha?: Paksha;

  // Піст
  fasting_level?: FastingLevel;

  // Парана (для екадаші)
  parana_start?: string; // HH:MM format
  parana_end?: string;
  parana_next_day?: boolean; // чи парана наступного дня
  hari_vasara_end?: string; // кінець Hari Vasara (заборонений час для парани)

  // Екадаші часи
  ekadashi_start?: string;
  ekadashi_end?: string;

  // Вайшнавський місяць
  vaishnava_month_name_ua?: string;
  vaishnava_month_name_en?: string;
}

// ============================================
// ЛОКАЦІЇ
// ============================================

export interface CalendarLocation {
  id: string;
  name_ua: string;
  name_en: string;

  // Координати
  latitude: number;
  longitude: number;

  // Часовий пояс
  timezone: string;
  utc_offset?: number;

  // Географія
  country_code?: string;
  city_ua?: string;
  city_en?: string;

  // Флаги
  is_preset: boolean;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

// ============================================
// НАЛАШТУВАННЯ КОРИСТУВАЧА
// ============================================

export interface UserCalendarSettings {
  id: string;
  user_id: string;

  // Локація
  location_id?: string;
  custom_latitude?: number;
  custom_longitude?: number;
  timezone: string;

  // Налаштування відображення
  show_ekadashi: boolean;
  show_festivals: boolean;
  show_appearances: boolean;
  show_disappearances: boolean;
  show_moon_phase: boolean;
  show_sunrise_sunset: boolean;

  // Сповіщення
  notify_ekadashi: boolean;
  notify_festivals: boolean;
  notify_day_before: boolean;
  notification_time?: string;

  // Налаштування посту
  fasting_level: FastingLevel;

  // Вигляд календаря
  default_view: CalendarView;
  week_starts_monday: boolean;

  created_at: string;
  updated_at: string;
}

export interface UserCalendarSettingsWithLocation extends UserCalendarSettings {
  location?: CalendarLocation;
}

// ============================================
// ФІЛЬТРИ ТА ПОШУК
// ============================================

export interface CalendarFilters {
  start_date: string;
  end_date: string;
  location_id?: string;
  event_types?: ('ekadashi' | 'festival' | 'appearance')[];
  categories?: string[];
  show_minor?: boolean;
}

export interface CalendarDateRange {
  start: Date;
  end: Date;
}

// ============================================
// МІСЯЧНИЙ ОГЛЯД
// ============================================

export interface MonthData {
  year: number;
  month: number; // 0-11
  days: DayData[];
  vaishnava_month?: VaishnavMonth;
}

export interface DayData {
  date: Date;
  day_of_month: number;
  is_current_month: boolean;
  is_today: boolean;
  events: CalendarEventDisplay[];
  tithi?: TithiType;
  paksha?: Paksha;
  moon_phase?: number;
  sunrise?: string;
  sunset?: string;
  vaishnava_month?: VaishnavMonth;
}

// ============================================
// ПАРАНА (ПЕРЕРИВАННЯ ПОСТУ)
// ============================================

export interface ParanaTime {
  start_time: string; // ISO datetime
  end_time: string;
  description_ua: string;
  description_en: string;
  is_dvadashi_parana: boolean;
}

// ============================================
// ЧАСИ ПОСТУ ЕКАДАШІ (КАЛЬКУЛЯТОР)
// ============================================

export interface EkadashiFastingCalculation {
  // Початок посту (схід сонця на Екадаші)
  fastingStart: Date;
  fastingStartFormatted: string;

  // Кінець посту / Парана
  paranaDate: Date;
  paranaStart: Date;
  paranaEnd: Date;
  paranaStartFormatted: string;
  paranaEndFormatted: string;

  // Hari Vasara (перша чверть Двадаші - уникати парани)
  hariVasaraEnd?: Date;
  hariVasaraEndFormatted?: string;

  // Схід/Захід на день Екадаші
  ekadashiSunrise: Date;
  ekadashiSunset: Date;
  ekadashiSunriseFormatted: string;
  ekadashiSunsetFormatted: string;

  // Схід сонця на Двадаші
  dvadashiSunrise: Date;
  dvadashiSunriseFormatted: string;

  // Інформація про локацію
  location: {
    latitude: number;
    longitude: number;
    timezone?: string;
  };

  // Додаткова інформація
  isDvadashiParana: boolean;
  notes_ua?: string;
  notes_en?: string;
}

export interface SunTimesData {
  date: Date;
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  sunriseFormatted: string;
  sunsetFormatted: string;
}

export interface DailyPanchangData {
  date: Date;
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dayDuration: number; // у хвилинах
  nightDuration: number; // у хвилинах
  brahmamuhurata: { start: Date; end: Date };
  pratahkala: { start: Date; end: Date };
  sunriseFormatted: string;
  sunsetFormatted: string;
}

export interface TithiData {
  tithi: number; // 1-30
  paksha: Paksha;
  tithiInPaksha: number; // 1-15
}

export interface MoonPhaseData {
  phase: number; // 0-1 (0=новий місяць, 0.5=повний місяць)
  illumination: number; // 0-100%
  nextNewMoon: Date;
  nextFullMoon: Date;
}

// ============================================
// ЕКАДАШІ ДЕТАЛЬНИЙ ОГЛЯД
// ============================================

export interface EkadashiDetailView {
  ekadashi: EkadashiInfo;
  month: VaishnavMonth;
  upcoming_dates: CalendarEvent[];
  parana?: ParanaTime;
  related_ekadashis: EkadashiInfo[];
}

// ============================================
// СЬОГОДНІШНІ ПОДІЇ
// ============================================

export interface TodayEvents {
  date: string;
  events: CalendarEventDisplay[];
  tithi?: TithiType;
  vaishnava_month?: VaishnavMonth;
  moon_phase?: number;
  sunrise?: string;
  sunset?: string;
  next_ekadashi?: {
    event: CalendarEventDisplay;
    days_until: number;
  };
}

// ============================================
// API ВІДПОВІДІ
// ============================================

export interface CalendarEventsResponse {
  events: CalendarEventDisplay[];
  total: number;
  has_more: boolean;
}

export interface EkadashiListResponse {
  ekadashis: EkadashiInfo[];
  total: number;
}

export interface LocationsResponse {
  locations: CalendarLocation[];
  preset_locations: CalendarLocation[];
}
