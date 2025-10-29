-- Drop all existing RLS policies on audio_events
DROP POLICY IF EXISTS "Admins can manage all audio events" ON public.audio_events;
DROP POLICY IF EXISTS "Admins can view all audio events" ON public.audio_events;
DROP POLICY IF EXISTS "Anon can insert audio events" ON public.audio_events;
DROP POLICY IF EXISTS "Service can view all audio events" ON public.audio_events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.audio_events;
DROP POLICY IF EXISTS "Users can insert own audio events" ON public.audio_events;
DROP POLICY IF EXISTS "Users can insert own events" ON public.audio_events;
DROP POLICY IF EXISTS "Users can select own events" ON public.audio_events;
DROP POLICY IF EXISTS "Users can update own events" ON public.audio_events;
DROP POLICY IF EXISTS "Users can view own audio events" ON public.audio_events;
DROP POLICY IF EXISTS "audio_events_delete_own" ON public.audio_events;
DROP POLICY IF EXISTS "audio_events_insert_auth" ON public.audio_events;
DROP POLICY IF EXISTS "audio_events_select_own" ON public.audio_events;
DROP POLICY IF EXISTS "audio_events_update_own" ON public.audio_events;

-- Create consolidated RLS policies
-- Admins have full access to all audio events
CREATE POLICY "Admins can manage audio events"
  ON public.audio_events
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can insert their own events
CREATE POLICY "Users can insert own audio events"
  ON public.audio_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Anonymous users can insert events (for tracking without login)
CREATE POLICY "Anonymous users can insert audio events"
  ON public.audio_events
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Users can view their own events
CREATE POLICY "Users can view own audio events"
  ON public.audio_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own events
CREATE POLICY "Users can update own audio events"
  ON public.audio_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own events
CREATE POLICY "Users can delete own audio events"
  ON public.audio_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);