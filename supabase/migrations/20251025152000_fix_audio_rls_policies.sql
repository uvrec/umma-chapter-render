-- Fix RLS policies for audio_tracks to allow authenticated users to insert
-- Replace admin-only policies with authenticated user policies

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Admins can manage playlists" ON public.audio_playlists;

-- Simple policies for authenticated users (USING before WITH CHECK!)
CREATE POLICY "Authenticated can manage tracks" 
ON public.audio_tracks 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated can manage playlists" 
ON public.audio_playlists 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);