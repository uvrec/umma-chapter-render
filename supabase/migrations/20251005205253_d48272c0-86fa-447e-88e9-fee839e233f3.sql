-- Enable Row Level Security on audio_events table
ALTER TABLE public.audio_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own audio events
CREATE POLICY "Users can view own audio events"
ON public.audio_events
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own audio events
CREATE POLICY "Users can insert own audio events"
ON public.audio_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all audio events for analytics
CREATE POLICY "Admins can view all audio events"
ON public.audio_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can manage all audio events
CREATE POLICY "Admins can manage all audio events"
ON public.audio_events
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));