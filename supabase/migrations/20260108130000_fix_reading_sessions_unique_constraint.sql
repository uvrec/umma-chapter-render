-- Fix reading sessions unique constraint
-- The original migration used COALESCE in UNIQUE which is not supported
-- This migration adds a generated column and fixes the constraint

BEGIN;

-- Add generated column for normalized canto number
ALTER TABLE public.user_chapter_progress
  ADD COLUMN IF NOT EXISTS canto_number_norm INTEGER GENERATED ALWAYS AS (COALESCE(canto_number, 0)) STORED;

-- Drop the old constraint if it exists (may fail silently if constraint doesn't exist)
DO $$
BEGIN
  -- Try to drop the old constraint by finding its name
  DECLARE
    constraint_name TEXT;
  BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.user_chapter_progress'::regclass
    AND contype = 'u'
    AND array_length(conkey, 1) >= 3;

    IF constraint_name IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.user_chapter_progress DROP CONSTRAINT IF EXISTS %I', constraint_name);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors
    NULL;
  END;
END$$;

-- Create the correct unique constraint using the generated column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'user_chapter_progress'
    AND c.contype = 'u'
    AND EXISTS (
      SELECT 1 FROM unnest(c.conkey) k
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = k
      WHERE a.attname = 'canto_number_norm'
    )
  ) THEN
    ALTER TABLE public.user_chapter_progress
      ADD CONSTRAINT user_chapter_progress_user_book_canto_chapter_key
      UNIQUE(user_id, book_slug, canto_number_norm, chapter_number);
  END IF;
END$$;

-- Update RLS policies to use SELECT wrapper for auth.uid() for better performance
DO $$
BEGIN
  -- Drop and recreate policies with (SELECT auth.uid()) optimization

  -- user_reading_sessions policies
  DROP POLICY IF EXISTS "Users can view their own reading sessions" ON user_reading_sessions;
  DROP POLICY IF EXISTS "Users can insert reading sessions" ON user_reading_sessions;
  DROP POLICY IF EXISTS "Users can update their own sessions" ON user_reading_sessions;

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
  DROP POLICY IF EXISTS "Users can view their own book progress" ON user_book_progress;
  DROP POLICY IF EXISTS "Users can insert book progress" ON user_book_progress;
  DROP POLICY IF EXISTS "Users can update their own book progress" ON user_book_progress;

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
  DROP POLICY IF EXISTS "Users can view their own chapter progress" ON user_chapter_progress;
  DROP POLICY IF EXISTS "Users can insert chapter progress" ON user_chapter_progress;
  DROP POLICY IF EXISTS "Users can update their own chapter progress" ON user_chapter_progress;

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
  DROP POLICY IF EXISTS "Users can view their own daily stats" ON user_reading_daily_stats;
  DROP POLICY IF EXISTS "Users can insert daily stats" ON user_reading_daily_stats;
  DROP POLICY IF EXISTS "Users can update their own daily stats" ON user_reading_daily_stats;

  CREATE POLICY "Users can view their own daily stats"
    ON user_reading_daily_stats FOR SELECT
    USING ((SELECT auth.uid()) = user_id);

  CREATE POLICY "Users can insert daily stats"
    ON user_reading_daily_stats FOR INSERT
    WITH CHECK ((SELECT auth.uid()) = user_id);

  CREATE POLICY "Users can update their own daily stats"
    ON user_reading_daily_stats FOR UPDATE
    USING ((SELECT auth.uid()) = user_id);
END$$;

-- Update end_reading_session function with proper security hardening
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

    INSERT INTO user_book_progress (user_id, book_slug, book_title, total_reading_seconds, total_sessions, first_read_at, last_read_at)
    VALUES (v_session.user_id, v_session.book_slug, v_session.book_title, v_duration, 1, now(), now())
    ON CONFLICT (user_id, book_slug)
    DO UPDATE SET
      total_reading_seconds = user_book_progress.total_reading_seconds + EXCLUDED.total_reading_seconds,
      total_sessions = user_book_progress.total_sessions + EXCLUDED.total_sessions,
      last_read_at = now(),
      updated_at = now();

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

-- Update get_user_reading_stats function with security hardening
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
