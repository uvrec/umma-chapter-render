-- ============================================================================
-- СТВОРЕННЯ ТАБЛИЦІ audio_events для аналітики прослуховування
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audio_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.audio_tracks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,  -- 'play', 'pause', 'complete', 'skip'
  position_ms INTEGER,       -- позиція в мілісекундах
  duration_ms INTEGER,       -- тривалість прослуховування
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_audio_events_track_id ON public.audio_events(track_id);
CREATE INDEX IF NOT EXISTS idx_audio_events_user_id ON public.audio_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_events_created_at ON public.audio_events(created_at DESC);

-- Коментарі
COMMENT ON TABLE public.audio_events IS 'Аналітика прослуховування аудіо треків';
COMMENT ON COLUMN public.audio_events.event_type IS 'Тип події: play, pause, complete, skip';
