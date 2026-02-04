-- Cleanup redundant RLS policies for audio tables
-- Remove duplicate policies that were left after previous migrations

BEGIN;

-- Remove redundant ALL policy on audio_playlists (we have separate INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Admins can manage audio playlists" ON public.audio_playlists;
DROP POLICY IF EXISTS "Admins can manage playlists" ON public.audio_playlists;

-- Remove duplicate public read on audio_categories
DROP POLICY IF EXISTS "audio_categories_public_read" ON public.audio_categories;

-- Remove redundant ALL policy on audio_tracks if exists
DROP POLICY IF EXISTS "Admins can manage audio tracks" ON public.audio_tracks;

-- Remove redundant ALL policy on audio_categories if exists
DROP POLICY IF EXISTS "Admins can manage categories" ON public.audio_categories;

COMMIT;

DO $$
BEGIN
  RAISE NOTICE 'Cleanup completed: removed redundant RLS policies';
END $$;
