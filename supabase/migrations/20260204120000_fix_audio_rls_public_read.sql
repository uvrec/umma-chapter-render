-- Fix RLS policies for audio tables to allow public read access
-- Issue: audio_tracks and audio_playlists don't have proper public SELECT policies
-- This causes the audiobooks page to fail for anonymous users

BEGIN;

-- ============================================
-- 1. FIX AUDIO_TRACKS RLS POLICIES
-- ============================================

-- Drop legacy "Users own" policies if they exist
DROP POLICY IF EXISTS "Users insert own" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users update own" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users select own" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users delete own" ON public.audio_tracks;

-- Drop old restrictive policy if exists
DROP POLICY IF EXISTS "Anyone can view tracks" ON public.audio_tracks;

-- Create proper public read access
DROP POLICY IF EXISTS "Anyone can view audio tracks" ON public.audio_tracks;
CREATE POLICY "Anyone can view audio tracks"
  ON public.audio_tracks
  FOR SELECT
  USING (true);

-- Ensure admin write policies exist
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

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can view published playlists" ON public.audio_playlists;
DROP POLICY IF EXISTS "audio_playlists_public_read_published" ON public.audio_playlists;
DROP POLICY IF EXISTS "audio_playlists_auth_read_all" ON public.audio_playlists;

-- Create simple public read access (all playlists, filtering by is_published done in app)
DROP POLICY IF EXISTS "Anyone can view playlists" ON public.audio_playlists;
CREATE POLICY "Anyone can view playlists"
  ON public.audio_playlists
  FOR SELECT
  USING (true);

-- Ensure admin write policies exist
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
-- 3. FIX AUDIO_CATEGORIES RLS POLICIES
-- ============================================

-- Ensure public read access for categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.audio_categories;
CREATE POLICY "Anyone can view categories"
  ON public.audio_categories
  FOR SELECT
  USING (true);

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE 'RLS Fix Applied:';
  RAISE NOTICE '- audio_tracks: public SELECT with USING(true)';
  RAISE NOTICE '- audio_playlists: public SELECT with USING(true)';
  RAISE NOTICE '- audio_categories: public SELECT with USING(true)';
  RAISE NOTICE '- All tables: admin-only INSERT/UPDATE/DELETE';
END $$;
