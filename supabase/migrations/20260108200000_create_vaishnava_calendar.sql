-- Create Vaishnava Calendar tables
-- Supports lunar calendar, ekadashi schedules, festivals, and appearance/disappearance days

BEGIN;

-- ============================================
-- 1. CORE REFERENCE TABLES
-- ============================================

-- Lunar months (Vedic calendar)
CREATE TABLE IF NOT EXISTS public.vaishnava_months (
  id SERIAL PRIMARY KEY,
  name_sanskrit TEXT NOT NULL UNIQUE,
  name_ua TEXT NOT NULL,
  name_en TEXT NOT NULL,
  month_number INTEGER NOT NULL CHECK (month_number BETWEEN 1 AND 12),
  description_ua TEXT,
  description_en TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert 12 Vedic months
INSERT INTO vaishnava_months (name_sanskrit, name_ua, name_en, month_number) VALUES
  ('Mādhava', 'Мадгава', 'Madhava', 1),
  ('Mādhusūdana', 'Мадгусудана', 'Madhusudana', 2),
  ('Trivikrama', 'Трівікрама', 'Trivikrama', 3),
  ('Vāmana', 'Вамана', 'Vamana', 4),
  ('Śrīdhara', 'Шрідгара', 'Shridhara', 5),
  ('Hṛṣīkeśa', 'Хрішікеша', 'Hrishikesha', 6),
  ('Padmanābha', 'Падманабга', 'Padmanabha', 7),
  ('Dāmodara', 'Дамодара', 'Damodara', 8),
  ('Keśava', 'Кешава', 'Keshava', 9),
  ('Nārāyaṇa', 'Нараяна', 'Narayana', 10),
  ('Govinda', 'Говінда', 'Govinda', 11),
  ('Viṣṇu', 'Вішну', 'Vishnu', 12)
ON CONFLICT (name_sanskrit) DO NOTHING;

-- Tithi (lunar day) types
CREATE TABLE IF NOT EXISTS public.tithi_types (
  id SERIAL PRIMARY KEY,
  tithi_number INTEGER NOT NULL CHECK (tithi_number BETWEEN 1 AND 15),
  paksha TEXT NOT NULL CHECK (paksha IN ('shukla', 'krishna')),
  name_sanskrit TEXT NOT NULL,
  name_ua TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_ekadashi BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tithi_number, paksha)
);

-- Insert tithi types (1-15 for each paksha)
INSERT INTO tithi_types (tithi_number, paksha, name_sanskrit, name_ua, name_en, is_ekadashi) VALUES
  -- Shukla paksha (waxing moon)
  (1, 'shukla', 'Pratipadā', 'Пратіпада', 'Pratipada', false),
  (2, 'shukla', 'Dvitīyā', 'Двітія', 'Dvitiya', false),
  (3, 'shukla', 'Tṛtīyā', 'Трітія', 'Tritiya', false),
  (4, 'shukla', 'Caturthī', 'Чатуртхі', 'Chaturthi', false),
  (5, 'shukla', 'Pañcamī', 'Панчамі', 'Panchami', false),
  (6, 'shukla', 'Ṣaṣṭhī', 'Шаштхі', 'Shashthi', false),
  (7, 'shukla', 'Saptamī', 'Саптамі', 'Saptami', false),
  (8, 'shukla', 'Aṣṭamī', 'Аштамі', 'Ashtami', false),
  (9, 'shukla', 'Navamī', 'Навамі', 'Navami', false),
  (10, 'shukla', 'Daśamī', 'Дашамі', 'Dashami', false),
  (11, 'shukla', 'Ekādaśī', 'Екадаші', 'Ekadashi', true),
  (12, 'shukla', 'Dvādaśī', 'Двадаші', 'Dvadashi', false),
  (13, 'shukla', 'Trayodaśī', 'Трайодаші', 'Trayodashi', false),
  (14, 'shukla', 'Caturdaśī', 'Чатурдаші', 'Chaturdashi', false),
  (15, 'shukla', 'Pūrṇimā', 'Пурніма', 'Purnima', false),
  -- Krishna paksha (waning moon)
  (1, 'krishna', 'Pratipadā', 'Пратіпада', 'Pratipada', false),
  (2, 'krishna', 'Dvitīyā', 'Двітія', 'Dvitiya', false),
  (3, 'krishna', 'Tṛtīyā', 'Трітія', 'Tritiya', false),
  (4, 'krishna', 'Caturthī', 'Чатуртхі', 'Chaturthi', false),
  (5, 'krishna', 'Pañcamī', 'Панчамі', 'Panchami', false),
  (6, 'krishna', 'Ṣaṣṭhī', 'Шаштхі', 'Shashthi', false),
  (7, 'krishna', 'Saptamī', 'Саптамі', 'Saptami', false),
  (8, 'krishna', 'Aṣṭamī', 'Аштамі', 'Ashtami', false),
  (9, 'krishna', 'Navamī', 'Навамі', 'Navami', false),
  (10, 'krishna', 'Daśamī', 'Дашамі', 'Dashami', false),
  (11, 'krishna', 'Ekādaśī', 'Екадаші', 'Ekadashi', true),
  (12, 'krishna', 'Dvādaśī', 'Двадаші', 'Dvadashi', false),
  (13, 'krishna', 'Trayodaśī', 'Трайодаші', 'Trayodashi', false),
  (14, 'krishna', 'Caturdaśī', 'Чатурдаші', 'Chaturdashi', false),
  (15, 'krishna', 'Amāvāsyā', 'Амавасья', 'Amavasya', false)
ON CONFLICT (tithi_number, paksha) DO NOTHING;

-- ============================================
-- 2. EKADASHI INFORMATION TABLE
-- ============================================

-- Master table of all 26 Ekadashis with Padma Purana texts
CREATE TABLE IF NOT EXISTS public.ekadashi_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identification
  slug TEXT NOT NULL UNIQUE,
  vaishnava_month_id INTEGER REFERENCES vaishnava_months(id),
  paksha TEXT NOT NULL CHECK (paksha IN ('shukla', 'krishna')),

  -- Names
  name_sanskrit TEXT NOT NULL,
  name_ua TEXT NOT NULL,
  name_en TEXT NOT NULL,

  -- Glory from Padma Purana
  glory_title_ua TEXT,
  glory_title_en TEXT,
  glory_text_ua TEXT,
  glory_text_en TEXT,
  glory_source TEXT, -- e.g., "Padma Purana, Uttara-khanda"

  -- Deity and recommendations
  presiding_deity_ua TEXT,
  presiding_deity_en TEXT,
  recommended_activities_ua TEXT,
  recommended_activities_en TEXT,

  -- Fasting rules
  fasting_rules_ua TEXT,
  fasting_rules_en TEXT,
  breaking_fast_time TEXT, -- e.g., "After sunrise on Dvadashi"

  -- Benefits
  benefits_ua TEXT,
  benefits_en TEXT,

  -- Additional content
  story_ua TEXT,
  story_en TEXT,
  mantras TEXT[],

  -- Media
  image_url TEXT,

  -- Metadata
  sort_order INTEGER DEFAULT 0,
  is_major BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. FESTIVAL TYPES AND FESTIVALS
-- ============================================

-- Festival categories
CREATE TABLE IF NOT EXISTS public.festival_categories (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_ua TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ua TEXT,
  description_en TEXT,
  icon TEXT, -- Lucide icon name
  color TEXT, -- For calendar display
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO festival_categories (slug, name_ua, name_en, icon, color, sort_order) VALUES
  ('ekadashi', 'Екадаші', 'Ekadashi', 'Moon', '#8B5CF6', 1),
  ('appearance', 'Явлення', 'Appearance', 'Sunrise', '#F59E0B', 2),
  ('disappearance', 'Відхід', 'Disappearance', 'Sunset', '#6B7280', 3),
  ('major-festival', 'Головні свята', 'Major Festivals', 'Star', '#EF4444', 4),
  ('fasting', 'Пости', 'Fasting Days', 'Calendar', '#10B981', 5),
  ('special', 'Особливі дні', 'Special Days', 'Sparkles', '#3B82F6', 6)
ON CONFLICT (slug) DO NOTHING;

-- Appearance/Disappearance days of Lord and Devotees
CREATE TABLE IF NOT EXISTS public.appearance_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER REFERENCES festival_categories(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('appearance', 'disappearance')),

  -- Person/Deity info
  person_name_sanskrit TEXT,
  person_name_ua TEXT NOT NULL,
  person_name_en TEXT NOT NULL,
  person_title_ua TEXT, -- e.g., "Верховний Господь", "Ачар'я"
  person_title_en TEXT,

  -- Lunar calendar position (for recurring calculation)
  vaishnava_month_id INTEGER REFERENCES vaishnava_months(id),
  tithi_number INTEGER CHECK (tithi_number BETWEEN 1 AND 15),
  paksha TEXT CHECK (paksha IN ('shukla', 'krishna')),

  -- Description
  description_ua TEXT,
  description_en TEXT,
  short_description_ua TEXT,
  short_description_en TEXT,

  -- Observances
  observances_ua TEXT,
  observances_en TEXT,
  fasting_level TEXT CHECK (fasting_level IN ('nirjala', 'full', 'half', 'none')),

  -- Media
  image_url TEXT,

  -- Metadata
  is_major BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- General festivals table
CREATE TABLE IF NOT EXISTS public.vaishnava_festivals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER REFERENCES festival_categories(id),

  -- Names
  name_sanskrit TEXT,
  name_ua TEXT NOT NULL,
  name_en TEXT NOT NULL,

  -- Lunar calendar position
  vaishnava_month_id INTEGER REFERENCES vaishnava_months(id),
  tithi_number INTEGER CHECK (tithi_number BETWEEN 1 AND 15),
  paksha TEXT CHECK (paksha IN ('shukla', 'krishna')),

  -- Description
  description_ua TEXT,
  description_en TEXT,
  short_description_ua TEXT,
  short_description_en TEXT,

  -- Significance
  significance_ua TEXT,
  significance_en TEXT,

  -- Observances
  observances_ua TEXT,
  observances_en TEXT,
  fasting_level TEXT CHECK (fasting_level IN ('nirjala', 'full', 'half', 'none')),

  -- Related content
  related_verses TEXT[], -- verse references
  related_books TEXT[], -- book slugs

  -- Media
  image_url TEXT,
  gallery_urls TEXT[],

  -- Metadata
  is_major BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. CALENDAR EVENTS (Actual dates)
-- ============================================

-- Calculated calendar events for specific years
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Date info
  event_date DATE NOT NULL,
  year INTEGER NOT NULL,

  -- Event reference (one of these should be set)
  ekadashi_id UUID REFERENCES ekadashi_info(id),
  festival_id UUID REFERENCES vaishnava_festivals(id),
  appearance_day_id UUID REFERENCES appearance_days(id),

  -- Override values (for location-specific adjustments)
  custom_name_ua TEXT,
  custom_name_en TEXT,
  custom_description_ua TEXT,
  custom_description_en TEXT,

  -- Lunar data for this specific date
  tithi_number INTEGER,
  paksha TEXT,
  vaishnava_month_id INTEGER REFERENCES vaishnava_months(id),
  moon_phase NUMERIC(5,2), -- 0-100 percentage

  -- Timing
  sunrise_time TIME,
  sunset_time TIME,
  ekadashi_start_time TIMESTAMPTZ,
  ekadashi_end_time TIMESTAMPTZ,
  parana_start_time TIMESTAMPTZ, -- Breaking fast window
  parana_end_time TIMESTAMPTZ,

  -- Location reference
  location_id UUID REFERENCES calendar_locations(id),
  timezone TEXT,

  -- Metadata
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Ensure unique events per date/location
  UNIQUE(event_date, ekadashi_id, location_id),
  UNIQUE(event_date, festival_id, location_id),
  UNIQUE(event_date, appearance_day_id, location_id)
);

-- ============================================
-- 5. LOCATIONS TABLE
-- ============================================

-- Calendar locations for timezone/sunrise calculations
CREATE TABLE IF NOT EXISTS public.calendar_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Location info
  name_ua TEXT NOT NULL,
  name_en TEXT NOT NULL,

  -- Coordinates
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,

  -- Timezone
  timezone TEXT NOT NULL, -- IANA timezone
  utc_offset INTEGER, -- minutes from UTC

  -- Geographic info
  country_code TEXT,
  city_ua TEXT,
  city_en TEXT,

  -- Presets
  is_preset BOOLEAN DEFAULT false, -- pre-configured locations
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert preset locations
INSERT INTO calendar_locations (name_ua, name_en, latitude, longitude, timezone, country_code, city_ua, city_en, is_preset) VALUES
  ('Київ', 'Kyiv', 50.4501, 30.5234, 'Europe/Kyiv', 'UA', 'Київ', 'Kyiv', true),
  ('Львів', 'Lviv', 49.8397, 24.0297, 'Europe/Kyiv', 'UA', 'Львів', 'Lviv', true),
  ('Одеса', 'Odesa', 46.4825, 30.7233, 'Europe/Kyiv', 'UA', 'Одеса', 'Odesa', true),
  ('Харків', 'Kharkiv', 49.9935, 36.2304, 'Europe/Kyiv', 'UA', 'Харків', 'Kharkiv', true),
  ('Дніпро', 'Dnipro', 48.4647, 35.0462, 'Europe/Kyiv', 'UA', 'Дніпро', 'Dnipro', true),
  ('Варшава', 'Warsaw', 52.2297, 21.0122, 'Europe/Warsaw', 'PL', 'Варшава', 'Warsaw', true),
  ('Лондон', 'London', 51.5074, -0.1278, 'Europe/London', 'GB', 'Лондон', 'London', true),
  ('Нью-Йорк', 'New York', 40.7128, -74.0060, 'America/New_York', 'US', 'Нью-Йорк', 'New York', true),
  ('Маяпур', 'Mayapur', 23.4231, 88.3880, 'Asia/Kolkata', 'IN', 'Маяпур', 'Mayapur', true),
  ('Вріндаван', 'Vrindavan', 27.5833, 77.7000, 'Asia/Kolkata', 'IN', 'Вріндаван', 'Vrindavan', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. USER CALENDAR SETTINGS
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_calendar_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Location
  location_id UUID REFERENCES calendar_locations(id),
  custom_latitude NUMERIC(10,7),
  custom_longitude NUMERIC(10,7),
  timezone TEXT DEFAULT 'Europe/Kyiv',

  -- Display preferences
  show_ekadashi BOOLEAN DEFAULT true,
  show_festivals BOOLEAN DEFAULT true,
  show_appearances BOOLEAN DEFAULT true,
  show_disappearances BOOLEAN DEFAULT true,
  show_moon_phase BOOLEAN DEFAULT true,
  show_sunrise_sunset BOOLEAN DEFAULT true,

  -- Notifications
  notify_ekadashi BOOLEAN DEFAULT false,
  notify_festivals BOOLEAN DEFAULT false,
  notify_day_before BOOLEAN DEFAULT true,
  notification_time TIME DEFAULT '06:00',

  -- Fasting preferences
  fasting_level TEXT DEFAULT 'full' CHECK (fasting_level IN ('nirjala', 'full', 'half', 'none')),

  -- Calendar view
  default_view TEXT DEFAULT 'month' CHECK (default_view IN ('month', 'week', 'list')),
  week_starts_monday BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id)
);

-- ============================================
-- 7. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_year ON calendar_events(year);
CREATE INDEX IF NOT EXISTS idx_calendar_events_month ON calendar_events(event_date, vaishnava_month_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_ekadashi ON calendar_events(ekadashi_id) WHERE ekadashi_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_calendar_events_festival ON calendar_events(festival_id) WHERE festival_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_calendar_events_location ON calendar_events(location_id);
CREATE INDEX IF NOT EXISTS idx_appearance_days_month ON appearance_days(vaishnava_month_id);
CREATE INDEX IF NOT EXISTS idx_festivals_month ON vaishnava_festivals(vaishnava_month_id);
CREATE INDEX IF NOT EXISTS idx_ekadashi_month ON ekadashi_info(vaishnava_month_id);
CREATE INDEX IF NOT EXISTS idx_user_calendar_settings_user ON user_calendar_settings(user_id);

-- ============================================
-- 8. ENABLE RLS
-- ============================================

ALTER TABLE vaishnava_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE tithi_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE ekadashi_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE festival_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE appearance_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaishnava_festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_calendar_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS POLICIES
-- ============================================

DO $$
BEGIN
  -- Public read access for reference tables
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vaishnava_months') THEN
    CREATE POLICY "Public read access for months" ON vaishnava_months FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tithi_types') THEN
    CREATE POLICY "Public read access for tithi types" ON tithi_types FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ekadashi_info') THEN
    CREATE POLICY "Public read access for ekadashi info" ON ekadashi_info FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'festival_categories') THEN
    CREATE POLICY "Public read access for festival categories" ON festival_categories FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appearance_days') THEN
    CREATE POLICY "Public read access for appearance days" ON appearance_days FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vaishnava_festivals') THEN
    CREATE POLICY "Public read access for festivals" ON vaishnava_festivals FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_events') THEN
    CREATE POLICY "Public read access for calendar events" ON calendar_events FOR SELECT USING (is_published = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_locations') THEN
    CREATE POLICY "Public read access for locations" ON calendar_locations FOR SELECT USING (is_active = true);
  END IF;

  -- User calendar settings - private
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_calendar_settings') THEN
    CREATE POLICY "Users can view own calendar settings"
      ON user_calendar_settings FOR SELECT
      USING ((SELECT auth.uid()) = user_id);

    CREATE POLICY "Users can insert own calendar settings"
      ON user_calendar_settings FOR INSERT
      WITH CHECK ((SELECT auth.uid()) = user_id);

    CREATE POLICY "Users can update own calendar settings"
      ON user_calendar_settings FOR UPDATE
      USING ((SELECT auth.uid()) = user_id);

    CREATE POLICY "Users can delete own calendar settings"
      ON user_calendar_settings FOR DELETE
      USING ((SELECT auth.uid()) = user_id);
  END IF;
END$$;

-- ============================================
-- 10. HELPER FUNCTIONS
-- ============================================

-- Get calendar events for a date range
CREATE OR REPLACE FUNCTION get_calendar_events(
  p_start_date DATE,
  p_end_date DATE,
  p_location_id UUID DEFAULT NULL
)
RETURNS TABLE (
  event_id UUID,
  event_date DATE,
  event_type TEXT,
  name_ua TEXT,
  name_en TEXT,
  description_ua TEXT,
  description_en TEXT,
  category_slug TEXT,
  category_color TEXT,
  is_ekadashi BOOLEAN,
  is_major BOOLEAN,
  moon_phase NUMERIC,
  sunrise_time TIME,
  sunset_time TIME
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  RETURN QUERY
  SELECT
    ce.id as event_id,
    ce.event_date,
    CASE
      WHEN ce.ekadashi_id IS NOT NULL THEN 'ekadashi'
      WHEN ce.festival_id IS NOT NULL THEN 'festival'
      WHEN ce.appearance_day_id IS NOT NULL THEN 'appearance'
      ELSE 'other'
    END as event_type,
    COALESCE(ce.custom_name_ua, ei.name_ua, vf.name_ua, ad.person_name_ua) as name_ua,
    COALESCE(ce.custom_name_en, ei.name_en, vf.name_en, ad.person_name_en) as name_en,
    COALESCE(ce.custom_description_ua, ei.glory_text_ua, vf.short_description_ua, ad.short_description_ua) as description_ua,
    COALESCE(ce.custom_description_en, ei.glory_text_en, vf.short_description_en, ad.short_description_en) as description_en,
    fc.slug as category_slug,
    fc.color as category_color,
    (ce.ekadashi_id IS NOT NULL) as is_ekadashi,
    COALESCE(ei.is_major, vf.is_major, ad.is_major, false) as is_major,
    ce.moon_phase,
    ce.sunrise_time,
    ce.sunset_time
  FROM calendar_events ce
  LEFT JOIN ekadashi_info ei ON ce.ekadashi_id = ei.id
  LEFT JOIN vaishnava_festivals vf ON ce.festival_id = vf.id
  LEFT JOIN appearance_days ad ON ce.appearance_day_id = ad.id
  LEFT JOIN festival_categories fc ON COALESCE(vf.category_id, ad.category_id) = fc.id
    OR (ce.ekadashi_id IS NOT NULL AND fc.slug = 'ekadashi')
  WHERE ce.event_date BETWEEN p_start_date AND p_end_date
    AND ce.is_published = true
    AND (p_location_id IS NULL OR ce.location_id = p_location_id)
  ORDER BY ce.event_date, COALESCE(ei.is_major, vf.is_major, ad.is_major, false) DESC;
END;
$func$;

REVOKE ALL ON FUNCTION get_calendar_events(DATE, DATE, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_calendar_events(DATE, DATE, UUID) TO authenticated, anon;

-- Get or create user calendar settings
CREATE OR REPLACE FUNCTION get_or_create_calendar_settings(p_user_id UUID)
RETURNS user_calendar_settings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
DECLARE
  v_settings user_calendar_settings;
  v_default_location_id UUID;
BEGIN
  -- Get default location (Kyiv)
  SELECT id INTO v_default_location_id
  FROM calendar_locations
  WHERE city_en = 'Kyiv' AND is_preset = true
  LIMIT 1;

  -- Try to get existing settings
  SELECT * INTO v_settings FROM user_calendar_settings WHERE user_id = p_user_id;

  -- Create if not exists
  IF NOT FOUND THEN
    INSERT INTO user_calendar_settings (user_id, location_id)
    VALUES (p_user_id, v_default_location_id)
    RETURNING * INTO v_settings;
  END IF;

  RETURN v_settings;
END;
$func$;

REVOKE ALL ON FUNCTION get_or_create_calendar_settings(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_or_create_calendar_settings(UUID) TO authenticated;

-- Get today's events
CREATE OR REPLACE FUNCTION get_today_events(
  p_location_id UUID DEFAULT NULL
)
RETURNS TABLE (
  event_id UUID,
  event_type TEXT,
  name_ua TEXT,
  name_en TEXT,
  short_description_ua TEXT,
  short_description_en TEXT,
  category_color TEXT,
  is_ekadashi BOOLEAN,
  parana_start_time TIMESTAMPTZ,
  parana_end_time TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    CASE
      WHEN ce.ekadashi_id IS NOT NULL THEN 'ekadashi'
      WHEN ce.festival_id IS NOT NULL THEN 'festival'
      WHEN ce.appearance_day_id IS NOT NULL THEN 'appearance'
      ELSE 'other'
    END,
    COALESCE(ce.custom_name_ua, ei.name_ua, vf.name_ua, ad.person_name_ua),
    COALESCE(ce.custom_name_en, ei.name_en, vf.name_en, ad.person_name_en),
    COALESCE(ei.glory_title_ua, vf.short_description_ua, ad.short_description_ua),
    COALESCE(ei.glory_title_en, vf.short_description_en, ad.short_description_en),
    COALESCE(fc.color, '#8B5CF6'),
    (ce.ekadashi_id IS NOT NULL),
    ce.parana_start_time,
    ce.parana_end_time
  FROM calendar_events ce
  LEFT JOIN ekadashi_info ei ON ce.ekadashi_id = ei.id
  LEFT JOIN vaishnava_festivals vf ON ce.festival_id = vf.id
  LEFT JOIN appearance_days ad ON ce.appearance_day_id = ad.id
  LEFT JOIN festival_categories fc ON
    CASE
      WHEN ce.ekadashi_id IS NOT NULL THEN fc.slug = 'ekadashi'
      ELSE COALESCE(vf.category_id, ad.category_id) = fc.id
    END
  WHERE ce.event_date = CURRENT_DATE
    AND ce.is_published = true
    AND (p_location_id IS NULL OR ce.location_id = p_location_id);
END;
$func$;

REVOKE ALL ON FUNCTION get_today_events(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_today_events(UUID) TO authenticated, anon;

COMMIT;
