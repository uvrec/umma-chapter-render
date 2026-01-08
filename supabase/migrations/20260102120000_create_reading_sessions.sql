-- Create reading sessions table for tracking reading time and progress
-- Tracks individual reading sessions with duration, book/chapter progress

BEGIN;

-- Reading sessions table
CREATE TABLE IF NOT EXISTS public.user_reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session location
  book_slug TEXT NOT NULL,
  book_title TEXT,
  canto_number INTEGER,
  chapter_number INTEGER NOT NULL,
  chapter_title TEXT,

  -- Session timing
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER, -- calculated on session end

  -- Reading progress in this session
  start_verse TEXT,
  end_verse TEXT,
  verses_read INTEGER DEFAULT 0,
  percent_read NUMERIC(5,2) DEFAULT 0, -- 0-100

  -- Session metadata
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  is_audio_session BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Book reading progress aggregate table
CREATE TABLE IF NOT EXISTS public.user_book_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  book_title TEXT,

  -- Progress stats
  total_chapters INTEGER DEFAULT 0,
  chapters_started INTEGER DEFAULT 0,
  chapters_completed INTEGER DEFAULT 0, -- 100% read
  overall_percent NUMERIC(5,2) DEFAULT 0,

  -- Time spent
  total_reading_seconds INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,

  -- Timestamps
  first_read_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ, -- when book was 100% completed

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, book_slug)
);

-- Chapter reading progress table
-- Uses generated column for UNIQUE constraint (COALESCE not allowed in UNIQUE directly)
CREATE TABLE IF NOT EXISTS public.user_chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  canto_number INTEGER,
  chapter_number INTEGER NOT NULL,
  chapter_title TEXT,

  -- Progress
  total_verses INTEGER DEFAULT 0,
  verses_read INTEGER DEFAULT 0,
  percent_read NUMERIC(5,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,

  -- Time spent
  reading_seconds INTEGER DEFAULT 0,
  session_count INTEGER DEFAULT 0,

  -- Last position
  last_verse TEXT,
  scroll_position NUMERIC(5,2),

  -- Timestamps
  first_read_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Normalized canto for unique constraint (NULL -> 0)
  canto_number_norm INTEGER GENERATED ALWAYS AS (COALESCE(canto_number, 0)) STORED,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, book_slug, canto_number_norm, chapter_number)
);

-- Daily reading stats aggregate
CREATE TABLE IF NOT EXISTS public.user_reading_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stats_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Daily aggregates
  reading_seconds INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  chapters_read INTEGER DEFAULT 0,
  verses_read INTEGER DEFAULT 0,
  books_touched INTEGER DEFAULT 0, -- unique books read that day

  -- Peak hour tracking (0-23)
  peak_reading_hour INTEGER,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, stats_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user ON user_reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book ON user_reading_sessions(book_slug);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_started ON user_reading_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_progress_user ON user_book_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_user ON user_chapter_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_book ON user_chapter_progress(book_slug);
CREATE INDEX IF NOT EXISTS idx_reading_daily_user_date ON user_reading_daily_stats(user_id, stats_date DESC);

-- Enable RLS
ALTER TABLE user_reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
-- Using (SELECT auth.uid()) for performance optimization

-- user_reading_sessions policies
CREATE POLICY "Users can view their own reading sessions"
  ON user_reading_sessions FOR SELECT
  USING ((SELECT auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert reading sessions"
  ON user_reading_sessions FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own sessions"
  ON user_reading_sessions FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- user_book_progress policies
CREATE POLICY "Users can view their own book progress"
  ON user_book_progress FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert book progress"
  ON user_book_progress FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own book progress"
  ON user_book_progress FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- user_chapter_progress policies
CREATE POLICY "Users can view their own chapter progress"
  ON user_chapter_progress FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert chapter progress"
  ON user_chapter_progress FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own chapter progress"
  ON user_chapter_progress FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- user_reading_daily_stats policies
CREATE POLICY "Users can view their own daily stats"
  ON user_reading_daily_stats FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert daily stats"
  ON user_reading_daily_stats FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own daily stats"
  ON user_reading_daily_stats FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);

-- Function to end a reading session and update aggregates
CREATE OR REPLACE FUNCTION end_reading_session(
  p_session_id UUID,
  p_end_verse TEXT DEFAULT NULL,
  p_verses_read INTEGER DEFAULT 0,
  p_percent_read NUMERIC DEFAULT 0
)
RETURNS user_reading_sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
DECLARE
  v_session user_reading_sessions;
  v_duration INTEGER;
BEGIN
  UPDATE user_reading_sessions
  SET
    ended_at = now(),
    duration_seconds = EXTRACT(EPOCH FROM (now() - started_at))::INTEGER,
    end_verse = COALESCE(p_end_verse, end_verse),
    verses_read = COALESCE(p_verses_read, verses_read),
    percent_read = COALESCE(p_percent_read, percent_read)
  WHERE id = p_session_id
  RETURNING * INTO v_session;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session % not found or not accessible', p_session_id;
  END IF;

  IF v_session.user_id IS NOT NULL THEN
    v_duration := v_session.duration_seconds;

    -- Update book progress
    INSERT INTO user_book_progress (user_id, book_slug, book_title, total_reading_seconds, total_sessions, first_read_at, last_read_at)
    VALUES (v_session.user_id, v_session.book_slug, v_session.book_title, v_duration, 1, now(), now())
    ON CONFLICT (user_id, book_slug)
    DO UPDATE SET
      total_reading_seconds = user_book_progress.total_reading_seconds + EXCLUDED.total_reading_seconds,
      total_sessions = user_book_progress.total_sessions + EXCLUDED.total_sessions,
      last_read_at = now(),
      updated_at = now();

    -- Update chapter progress
    INSERT INTO user_chapter_progress (
      user_id, book_slug, canto_number, chapter_number, chapter_title,
      reading_seconds, session_count, last_verse, percent_read, first_read_at, last_read_at
    )
    VALUES (
      v_session.user_id, v_session.book_slug, v_session.canto_number, v_session.chapter_number, v_session.chapter_title,
      v_duration, 1, p_end_verse, p_percent_read, now(), now()
    )
    ON CONFLICT (user_id, book_slug, canto_number_norm, chapter_number)
    DO UPDATE SET
      reading_seconds = user_chapter_progress.reading_seconds + EXCLUDED.reading_seconds,
      session_count = user_chapter_progress.session_count + EXCLUDED.session_count,
      last_verse = COALESCE(EXCLUDED.last_verse, user_chapter_progress.last_verse),
      percent_read = GREATEST(user_chapter_progress.percent_read, EXCLUDED.percent_read),
      is_completed = CASE WHEN GREATEST(user_chapter_progress.percent_read, EXCLUDED.percent_read) >= 95 THEN true ELSE user_chapter_progress.is_completed END,
      completed_at = CASE WHEN GREATEST(user_chapter_progress.percent_read, EXCLUDED.percent_read) >= 95 AND user_chapter_progress.completed_at IS NULL THEN now() ELSE user_chapter_progress.completed_at END,
      last_read_at = now(),
      updated_at = now();

    -- Update daily stats
    INSERT INTO user_reading_daily_stats (user_id, stats_date, reading_seconds, sessions_count, verses_read)
    VALUES (v_session.user_id, CURRENT_DATE, v_duration, 1, COALESCE(p_verses_read, 0))
    ON CONFLICT (user_id, stats_date)
    DO UPDATE SET
      reading_seconds = user_reading_daily_stats.reading_seconds + EXCLUDED.reading_seconds,
      sessions_count = user_reading_daily_stats.sessions_count + EXCLUDED.sessions_count,
      verses_read = user_reading_daily_stats.verses_read + EXCLUDED.verses_read,
      updated_at = now();
  END IF;

  RETURN v_session;
END;
$func$;

-- Revoke public execution and grant to specific roles
REVOKE ALL ON FUNCTION end_reading_session(UUID, TEXT, INTEGER, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION end_reading_session(UUID, TEXT, INTEGER, NUMERIC) TO authenticated, anon;

-- Function to get book progress summary for a user
CREATE OR REPLACE FUNCTION get_user_reading_stats(p_user_id UUID)
RETURNS TABLE (
  total_reading_time INTEGER,
  total_sessions INTEGER,
  books_in_progress INTEGER,
  books_completed INTEGER,
  chapters_completed INTEGER,
  current_streak INTEGER,
  longest_streak INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(bp.total_reading_seconds)::INTEGER, 0) as total_reading_time,
    COALESCE(SUM(bp.total_sessions)::INTEGER, 0) as total_sessions,
    COUNT(*) FILTER (WHERE bp.overall_percent > 0 AND bp.overall_percent < 100)::INTEGER as books_in_progress,
    COUNT(*) FILTER (WHERE bp.completed_at IS NOT NULL)::INTEGER as books_completed,
    (SELECT COUNT(*) FROM user_chapter_progress WHERE user_id = p_user_id AND is_completed = true)::INTEGER as chapters_completed,
    COALESCE((SELECT current_streak FROM user_learning_progress WHERE user_id = p_user_id), 0)::INTEGER as current_streak,
    COALESCE((SELECT longest_streak FROM user_learning_progress WHERE user_id = p_user_id), 0)::INTEGER as longest_streak
  FROM user_book_progress bp
  WHERE bp.user_id = p_user_id;
END;
$func$;

REVOKE ALL ON FUNCTION get_user_reading_stats(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_user_reading_stats(UUID) TO authenticated;

COMMIT;
