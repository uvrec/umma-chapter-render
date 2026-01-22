-- Sadhana tracking system for "Page by Page Be a Sage" and personal sadhana chart
-- Includes daily tracking, reading goals, statistics, and social features

BEGIN;

-- ============================================================================
-- 1. User Sadhana Config - Personal goals and settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_sadhana_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Display settings
  display_name TEXT,
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT false, -- visible in "Other Graphs"

  -- Japa goals
  japa_rounds_target INTEGER DEFAULT 16,
  japa_before_730_target INTEGER DEFAULT 16, -- ideal: all rounds in brahma-muhurta

  -- Reading goals
  reading_minutes_target INTEGER DEFAULT 30,

  -- Wake up goal
  wake_up_target TIME DEFAULT '04:00',
  bed_time_target TIME DEFAULT '22:00',

  -- Enabled tracking items (for UI toggles)
  track_service BOOLEAN DEFAULT true,
  track_yoga BOOLEAN DEFAULT false,
  track_lections BOOLEAN DEFAULT true,
  track_kirtan BOOLEAN DEFAULT true,

  -- Reminder settings
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_time TIME DEFAULT '04:00',

  -- Timezone for proper date handling
  timezone TEXT DEFAULT 'UTC',

  -- Localization
  language TEXT DEFAULT 'uk' CHECK (language IN ('ua', 'en')), -- Ukrainian, English

  -- Device info for push notifications
  fcm_token TEXT, -- Firebase Cloud Messaging token
  apns_token TEXT, -- Apple Push Notification Service token

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id)
);

-- ============================================================================
-- 2. User Sadhana Daily - Daily tracking log
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_sadhana_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Wake up time (stored as TIME, e.g., 04:30)
  wake_up_time TIME,

  -- Japa rounds by time slot
  japa_before_730 INTEGER DEFAULT 0,  -- before 7:30 AM (brahma-muhurta)
  japa_before_1000 INTEGER DEFAULT 0, -- before 10:00 AM
  japa_before_1800 INTEGER DEFAULT 0, -- before 6:00 PM
  japa_after_1800 INTEGER DEFAULT 0,  -- after 6:00 PM

  -- Calculated total japa
  japa_total INTEGER GENERATED ALWAYS AS (
    COALESCE(japa_before_730, 0) +
    COALESCE(japa_before_1000, 0) +
    COALESCE(japa_before_1800, 0) +
    COALESCE(japa_after_1800, 0)
  ) STORED,

  -- Reading (in minutes)
  reading_minutes INTEGER DEFAULT 0,

  -- Kirtan (in minutes)
  kirtan_minutes INTEGER DEFAULT 0,

  -- Boolean activities
  service_done BOOLEAN DEFAULT false,
  yoga_done BOOLEAN DEFAULT false,
  lections_attended BOOLEAN DEFAULT false,

  -- Bed time
  bed_time TIME,

  -- Optional notes
  notes TEXT,

  -- Completion percentage (calculated by trigger or client)
  completion_percent NUMERIC(5,2) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, entry_date)
);

-- ============================================================================
-- 3. User Reading Goals - "Page by Page Be a Sage" feature
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Book info
  book_slug TEXT NOT NULL,
  book_title TEXT,

  -- Goal parameters
  time_unit TEXT NOT NULL CHECK (time_unit IN ('day', 'week', 'month', 'year')),
  duration INTEGER NOT NULL, -- number of time units (e.g., 10 weeks)
  track_by TEXT NOT NULL DEFAULT 'pages' CHECK (track_by IN ('pages', 'slokas')),

  -- Book totals (for calculation)
  total_pages INTEGER,
  total_slokas INTEGER,

  -- Calculated daily target
  target_per_day NUMERIC(10,2), -- pages or slokas per day

  -- Progress tracking
  started_at DATE NOT NULL DEFAULT CURRENT_DATE,
  target_date DATE, -- calculated end date
  current_page INTEGER DEFAULT 0,
  current_sloka INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ,

  -- Reminder
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_time TIME,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, book_slug, started_at)
);

-- ============================================================================
-- 4. User Sadhana Friends - Social subscriptions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_sadhana_friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Status
  is_favorite BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- ============================================================================
-- 5. User Sadhana Monthly Stats - Pre-aggregated statistics
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_sadhana_monthly_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stats_month DATE NOT NULL, -- first day of month

  -- Aggregated averages
  avg_wake_up_time TIME,
  avg_bed_time TIME,

  -- Totals
  total_japa_rounds INTEGER DEFAULT 0,
  total_reading_minutes INTEGER DEFAULT 0,
  total_kirtan_minutes INTEGER DEFAULT 0,

  -- Counts
  days_tracked INTEGER DEFAULT 0,
  days_with_service INTEGER DEFAULT 0,
  days_with_yoga INTEGER DEFAULT 0,
  days_with_lections INTEGER DEFAULT 0,

  -- Streak at end of month
  streak_at_month_end INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, stats_month)
);

-- ============================================================================
-- 6. Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_sadhana_daily_user_date ON user_sadhana_daily(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_sadhana_daily_date ON user_sadhana_daily(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_reading_goals_user ON user_reading_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_goals_active ON user_reading_goals(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sadhana_friends_user ON user_sadhana_friends(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_friends_friend ON user_sadhana_friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_config_public ON user_sadhana_config(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_sadhana_monthly_user ON user_sadhana_monthly_stats(user_id, stats_month DESC);

-- ============================================================================
-- 7. Enable RLS
-- ============================================================================

ALTER TABLE user_sadhana_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sadhana_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sadhana_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sadhana_monthly_stats ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 8. RLS Policies
-- ============================================================================

DO $$
BEGIN
  -- user_sadhana_config policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_sadhana_config'
  ) THEN
    -- Own config
    CREATE POLICY "Users can manage their own config"
      ON user_sadhana_config FOR ALL
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id);

    -- View public profiles
    CREATE POLICY "Users can view public configs"
      ON user_sadhana_config FOR SELECT
      USING (is_public = true);
  END IF;

  -- user_sadhana_daily policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_sadhana_daily'
  ) THEN
    -- Own entries
    CREATE POLICY "Users can manage their own daily entries"
      ON user_sadhana_daily FOR ALL
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id);

    -- View friends' entries (if their profile is public)
    CREATE POLICY "Users can view friends daily entries"
      ON user_sadhana_daily FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM user_sadhana_config c
          WHERE c.user_id = user_sadhana_daily.user_id
          AND c.is_public = true
        )
      );
  END IF;

  -- user_reading_goals policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_reading_goals'
  ) THEN
    CREATE POLICY "Users can manage their own reading goals"
      ON user_reading_goals FOR ALL
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;

  -- user_sadhana_friends policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_sadhana_friends'
  ) THEN
    CREATE POLICY "Users can manage their own friend list"
      ON user_sadhana_friends FOR ALL
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;

  -- user_sadhana_monthly_stats policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_sadhana_monthly_stats'
  ) THEN
    CREATE POLICY "Users can view their own monthly stats"
      ON user_sadhana_monthly_stats FOR SELECT
      USING ((SELECT auth.uid()) = user_id);

    CREATE POLICY "Users can view friends monthly stats"
      ON user_sadhana_monthly_stats FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM user_sadhana_config c
          WHERE c.user_id = user_sadhana_monthly_stats.user_id
          AND c.is_public = true
        )
      );
  END IF;
END$$;

-- ============================================================================
-- 9. Functions
-- ============================================================================

-- Calculate reading goal target per day
CREATE OR REPLACE FUNCTION calculate_reading_goal_target()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
DECLARE
  v_total INTEGER;
  v_total_days INTEGER;
BEGIN
  -- Calculate total days based on time unit
  v_total_days := CASE NEW.time_unit
    WHEN 'day' THEN NEW.duration
    WHEN 'week' THEN NEW.duration * 7
    WHEN 'month' THEN NEW.duration * 30
    WHEN 'year' THEN NEW.duration * 365
  END;

  -- Get total based on track_by
  v_total := CASE NEW.track_by
    WHEN 'pages' THEN COALESCE(NEW.total_pages, 0)
    WHEN 'slokas' THEN COALESCE(NEW.total_slokas, 0)
  END;

  -- Calculate target per day
  IF v_total_days > 0 THEN
    NEW.target_per_day := ROUND(v_total::NUMERIC / v_total_days, 2);
  END IF;

  -- Calculate target date
  NEW.target_date := NEW.started_at + (v_total_days || ' days')::INTERVAL;

  RETURN NEW;
END;
$func$;

CREATE TRIGGER trg_calculate_reading_goal
  BEFORE INSERT OR UPDATE ON user_reading_goals
  FOR EACH ROW
  EXECUTE FUNCTION calculate_reading_goal_target();

-- Upsert daily sadhana entry
CREATE OR REPLACE FUNCTION upsert_sadhana_daily(
  p_user_id UUID,
  p_entry_date DATE,
  p_wake_up_time TIME DEFAULT NULL,
  p_japa_before_730 INTEGER DEFAULT NULL,
  p_japa_before_1000 INTEGER DEFAULT NULL,
  p_japa_before_1800 INTEGER DEFAULT NULL,
  p_japa_after_1800 INTEGER DEFAULT NULL,
  p_reading_minutes INTEGER DEFAULT NULL,
  p_kirtan_minutes INTEGER DEFAULT NULL,
  p_service_done BOOLEAN DEFAULT NULL,
  p_yoga_done BOOLEAN DEFAULT NULL,
  p_lections_attended BOOLEAN DEFAULT NULL,
  p_bed_time TIME DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS user_sadhana_daily
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
DECLARE
  v_result user_sadhana_daily;
BEGIN
  INSERT INTO user_sadhana_daily (
    user_id, entry_date, wake_up_time,
    japa_before_730, japa_before_1000, japa_before_1800, japa_after_1800,
    reading_minutes, kirtan_minutes,
    service_done, yoga_done, lections_attended,
    bed_time, notes
  )
  VALUES (
    p_user_id, p_entry_date, p_wake_up_time,
    COALESCE(p_japa_before_730, 0), COALESCE(p_japa_before_1000, 0),
    COALESCE(p_japa_before_1800, 0), COALESCE(p_japa_after_1800, 0),
    COALESCE(p_reading_minutes, 0), COALESCE(p_kirtan_minutes, 0),
    COALESCE(p_service_done, false), COALESCE(p_yoga_done, false),
    COALESCE(p_lections_attended, false),
    p_bed_time, p_notes
  )
  ON CONFLICT (user_id, entry_date)
  DO UPDATE SET
    wake_up_time = COALESCE(EXCLUDED.wake_up_time, user_sadhana_daily.wake_up_time),
    japa_before_730 = COALESCE(EXCLUDED.japa_before_730, user_sadhana_daily.japa_before_730),
    japa_before_1000 = COALESCE(EXCLUDED.japa_before_1000, user_sadhana_daily.japa_before_1000),
    japa_before_1800 = COALESCE(EXCLUDED.japa_before_1800, user_sadhana_daily.japa_before_1800),
    japa_after_1800 = COALESCE(EXCLUDED.japa_after_1800, user_sadhana_daily.japa_after_1800),
    reading_minutes = COALESCE(EXCLUDED.reading_minutes, user_sadhana_daily.reading_minutes),
    kirtan_minutes = COALESCE(EXCLUDED.kirtan_minutes, user_sadhana_daily.kirtan_minutes),
    service_done = COALESCE(EXCLUDED.service_done, user_sadhana_daily.service_done),
    yoga_done = COALESCE(EXCLUDED.yoga_done, user_sadhana_daily.yoga_done),
    lections_attended = COALESCE(EXCLUDED.lections_attended, user_sadhana_daily.lections_attended),
    bed_time = COALESCE(EXCLUDED.bed_time, user_sadhana_daily.bed_time),
    notes = COALESCE(EXCLUDED.notes, user_sadhana_daily.notes),
    updated_at = now()
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$func$;

REVOKE ALL ON FUNCTION upsert_sadhana_daily FROM PUBLIC;
GRANT EXECUTE ON FUNCTION upsert_sadhana_daily TO authenticated;

-- Get user's current streak
CREATE OR REPLACE FUNCTION get_sadhana_streak(p_user_id UUID)
RETURNS TABLE (
  current_streak INTEGER,
  longest_streak INTEGER,
  last_entry_date DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
DECLARE
  v_current INTEGER := 0;
  v_longest INTEGER := 0;
  v_streak INTEGER := 0;
  v_prev_date DATE;
  v_last_date DATE;
  rec RECORD;
BEGIN
  -- Get entries ordered by date desc
  FOR rec IN
    SELECT entry_date
    FROM user_sadhana_daily
    WHERE user_id = p_user_id
    ORDER BY entry_date DESC
  LOOP
    IF v_prev_date IS NULL THEN
      -- First record
      v_streak := 1;
      v_last_date := rec.entry_date;

      -- Check if streak is current (today or yesterday)
      IF rec.entry_date >= CURRENT_DATE - 1 THEN
        v_current := 1;
      END IF;
    ELSIF v_prev_date - rec.entry_date = 1 THEN
      -- Consecutive day
      v_streak := v_streak + 1;
      IF v_current > 0 THEN
        v_current := v_streak;
      END IF;
    ELSE
      -- Gap in streak
      IF v_streak > v_longest THEN
        v_longest := v_streak;
      END IF;
      v_streak := 1;
    END IF;

    v_prev_date := rec.entry_date;
  END LOOP;

  -- Final check for longest
  IF v_streak > v_longest THEN
    v_longest := v_streak;
  END IF;

  RETURN QUERY SELECT v_current, v_longest, v_last_date;
END;
$func$;

REVOKE ALL ON FUNCTION get_sadhana_streak FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_sadhana_streak TO authenticated;

-- Get monthly statistics
CREATE OR REPLACE FUNCTION get_sadhana_monthly_stats(
  p_user_id UUID,
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
)
RETURNS TABLE (
  month_num INTEGER,
  month_name TEXT,
  avg_wake_up TEXT,
  total_japa INTEGER,
  japa_quality_percent NUMERIC,
  total_reading_minutes INTEGER,
  avg_bed_time TEXT,
  days_tracked INTEGER,
  streak_score INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  RETURN QUERY
  SELECT
    EXTRACT(MONTH FROM d.entry_date)::INTEGER as month_num,
    TO_CHAR(d.entry_date, 'Mon') as month_name,
    TO_CHAR(
      MAKE_TIME(
        AVG(EXTRACT(HOUR FROM d.wake_up_time))::INTEGER,
        AVG(EXTRACT(MINUTE FROM d.wake_up_time))::INTEGER,
        0
      ),
      'HH24:MI'
    ) as avg_wake_up,
    SUM(d.japa_total)::INTEGER as total_japa,
    ROUND(
      SUM(d.japa_before_730)::NUMERIC / NULLIF(SUM(d.japa_total), 0) * 100,
      1
    ) as japa_quality_percent,
    SUM(d.reading_minutes)::INTEGER as total_reading_minutes,
    TO_CHAR(
      MAKE_TIME(
        AVG(EXTRACT(HOUR FROM d.bed_time))::INTEGER,
        AVG(EXTRACT(MINUTE FROM d.bed_time))::INTEGER,
        0
      ),
      'HH24:MI'
    ) as avg_bed_time,
    COUNT(*)::INTEGER as days_tracked,
    0::INTEGER as streak_score -- calculated separately
  FROM user_sadhana_daily d
  WHERE d.user_id = p_user_id
    AND EXTRACT(YEAR FROM d.entry_date) = p_year
  GROUP BY EXTRACT(MONTH FROM d.entry_date), TO_CHAR(d.entry_date, 'Mon')
  ORDER BY month_num DESC;
END;
$func$;

REVOKE ALL ON FUNCTION get_sadhana_monthly_stats FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_sadhana_monthly_stats TO authenticated;

-- Get public sadhana users for "Other Graphs"
CREATE OR REPLACE FUNCTION get_public_sadhana_users(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  current_streak INTEGER,
  today_japa INTEGER,
  today_reading INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  RETURN QUERY
  SELECT
    c.user_id,
    c.display_name,
    c.avatar_url,
    COALESCE(s.current_streak, 0)::INTEGER,
    COALESCE(d.japa_total, 0)::INTEGER as today_japa,
    COALESCE(d.reading_minutes, 0)::INTEGER as today_reading
  FROM user_sadhana_config c
  LEFT JOIN LATERAL (
    SELECT * FROM get_sadhana_streak(c.user_id)
  ) s ON true
  LEFT JOIN user_sadhana_daily d
    ON d.user_id = c.user_id
    AND d.entry_date = CURRENT_DATE
  WHERE c.is_public = true
  ORDER BY s.current_streak DESC NULLS LAST, c.display_name
  LIMIT p_limit
  OFFSET p_offset;
END;
$func$;

REVOKE ALL ON FUNCTION get_public_sadhana_users FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_public_sadhana_users TO authenticated;

COMMIT;
