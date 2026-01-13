-- Fix critical RLS vulnerabilities
-- Previously: any authenticated user could modify audio_tracks, audio_playlists, daily_quotes, verse_lyrics
-- After: only admins can modify these tables (via public.has_role function)

BEGIN;

-- ============================================
-- 1. FIX AUDIO_TRACKS RLS POLICIES
-- ============================================

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Authenticated can manage tracks" ON public.audio_tracks;

-- Keep public read access
DROP POLICY IF EXISTS "Anyone can view audio tracks" ON public.audio_tracks;
CREATE POLICY "Anyone can view audio tracks"
  ON public.audio_tracks
  FOR SELECT
  USING (true);

-- Admin-only write access
DROP POLICY IF EXISTS "Admins can insert audio tracks" ON public.audio_tracks;
CREATE POLICY "Admins can insert audio tracks"
  ON public.audio_tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update audio tracks" ON public.audio_tracks;
CREATE POLICY "Admins can update audio tracks"
  ON public.audio_tracks
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete audio tracks" ON public.audio_tracks;
CREATE POLICY "Admins can delete audio tracks"
  ON public.audio_tracks
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 2. FIX AUDIO_PLAYLISTS RLS POLICIES
-- ============================================

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Authenticated can manage playlists" ON public.audio_playlists;

-- Keep public read access
DROP POLICY IF EXISTS "Anyone can view playlists" ON public.audio_playlists;
CREATE POLICY "Anyone can view playlists"
  ON public.audio_playlists
  FOR SELECT
  USING (true);

-- Admin-only write access
DROP POLICY IF EXISTS "Admins can insert playlists" ON public.audio_playlists;
CREATE POLICY "Admins can insert playlists"
  ON public.audio_playlists
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update playlists" ON public.audio_playlists;
CREATE POLICY "Admins can update playlists"
  ON public.audio_playlists
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete playlists" ON public.audio_playlists;
CREATE POLICY "Admins can delete playlists"
  ON public.audio_playlists
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 3. FIX DAILY_QUOTES RLS POLICIES
-- ============================================

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated users to manage quotes" ON public.daily_quotes;

-- Keep existing public read for active quotes (policy "Allow public read access to active quotes" already exists)
-- Keep existing authenticated read for all quotes (policy "Allow authenticated users to read all quotes" already exists)

-- Admin-only write access
DROP POLICY IF EXISTS "Admins can insert quotes" ON public.daily_quotes;
CREATE POLICY "Admins can insert quotes"
  ON public.daily_quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update quotes" ON public.daily_quotes;
CREATE POLICY "Admins can update quotes"
  ON public.daily_quotes
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete quotes" ON public.daily_quotes;
CREATE POLICY "Admins can delete quotes"
  ON public.daily_quotes
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 4. FIX VERSE_LYRICS RLS POLICIES
-- ============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS verse_lyrics_insert_policy ON public.verse_lyrics;
DROP POLICY IF EXISTS verse_lyrics_update_policy ON public.verse_lyrics;
DROP POLICY IF EXISTS verse_lyrics_delete_policy ON public.verse_lyrics;

-- Keep existing public read (policy verse_lyrics_select_policy already exists)

-- Admin-only write access
CREATE POLICY verse_lyrics_insert_policy ON public.verse_lyrics
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY verse_lyrics_update_policy ON public.verse_lyrics
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY verse_lyrics_delete_policy ON public.verse_lyrics
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 5. ADD COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON POLICY "Anyone can view audio tracks" ON public.audio_tracks IS 'Public read access for audio tracks';
COMMENT ON POLICY "Admins can insert audio tracks" ON public.audio_tracks IS 'Only admins can add new audio tracks';
COMMENT ON POLICY "Admins can update audio tracks" ON public.audio_tracks IS 'Only admins can modify audio tracks';
COMMENT ON POLICY "Admins can delete audio tracks" ON public.audio_tracks IS 'Only admins can delete audio tracks';

COMMENT ON POLICY "Anyone can view playlists" ON public.audio_playlists IS 'Public read access for playlists';
COMMENT ON POLICY "Admins can insert playlists" ON public.audio_playlists IS 'Only admins can create playlists';
COMMENT ON POLICY "Admins can update playlists" ON public.audio_playlists IS 'Only admins can modify playlists';
COMMENT ON POLICY "Admins can delete playlists" ON public.audio_playlists IS 'Only admins can delete playlists';

COMMIT;

-- Security audit log
DO $$
BEGIN
  RAISE NOTICE 'RLS Security Fix Applied:';
  RAISE NOTICE '- audio_tracks: restricted to admin-only write';
  RAISE NOTICE '- audio_playlists: restricted to admin-only write';
  RAISE NOTICE '- daily_quotes: restricted to admin-only write';
  RAISE NOTICE '- verse_lyrics: restricted to admin-only write';
END $$;
