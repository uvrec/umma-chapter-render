-- Create verse_lyrics table for audio-text synchronization
-- Supports LRC format (standard lyrics format) and our JSON timestamp format
-- v2: Added CHECK constraints, improved indexes, tightened RLS

BEGIN;

CREATE TABLE IF NOT EXISTS public.verse_lyrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id UUID NOT NULL REFERENCES public.verses(id) ON DELETE CASCADE,
  audio_type TEXT NOT NULL DEFAULT 'full',
  language TEXT NOT NULL DEFAULT 'sa',

  -- LRC format content (simple, human-editable)
  lrc_content TEXT,

  -- JSON timestamps for more complex sync (word-level, sections)
  timestamps JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Metadata
  total_duration REAL,                              -- Audio duration in seconds
  sync_type TEXT NOT NULL DEFAULT 'line',
  is_enhanced BOOLEAN NOT NULL DEFAULT false,       -- Enhanced LRC (word-level timing)

  -- Audit fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),

  -- Unique constraint
  UNIQUE (verse_id, audio_type, language),

  -- Guardrail checks for enum-like columns
  CONSTRAINT verse_lyrics_audio_type_chk CHECK (
    audio_type = ANY (ARRAY['full', 'recitation', 'explanation_uk', 'explanation_en'])
  ),
  CONSTRAINT verse_lyrics_language_chk CHECK (
    language = ANY (ARRAY['sa', 'en', 'ua'])
  ),
  CONSTRAINT verse_lyrics_sync_type_chk CHECK (
    sync_type = ANY (ARRAY['section', 'line', 'word'])
  ),
  -- Ensure timestamps is always an array
  CONSTRAINT verse_lyrics_timestamps_array_chk CHECK (
    jsonb_typeof(timestamps) = 'array'
  )
);

-- Add comments
COMMENT ON TABLE public.verse_lyrics IS 'Audio-text synchronization data for verses (LRC and JSON formats)';
COMMENT ON COLUMN public.verse_lyrics.lrc_content IS 'Standard LRC format lyrics with timestamps';
COMMENT ON COLUMN public.verse_lyrics.timestamps IS 'JSON array of {start, end, text, section, lineIndex} objects';
COMMENT ON COLUMN public.verse_lyrics.sync_type IS 'Granularity: section (blocks), line (paragraphs), word (karaoke)';

-- Indexes for common access patterns
CREATE INDEX IF NOT EXISTS idx_verse_lyrics_verse_id ON public.verse_lyrics(verse_id);
CREATE INDEX IF NOT EXISTS idx_verse_lyrics_key ON public.verse_lyrics(verse_id, audio_type, language);
-- Extended index for filtering by is_enhanced (word-level sync pages)
CREATE INDEX IF NOT EXISTS idx_verse_lyrics_key_enh ON public.verse_lyrics(verse_id, audio_type, language, is_enhanced);
-- Optional JSONB index if you plan to query timestamps by keys:
-- CREATE INDEX IF NOT EXISTS idx_verse_lyrics_timestamps_gin ON public.verse_lyrics USING GIN (timestamps);

-- Enable RLS
ALTER TABLE public.verse_lyrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Read: public access for both anonymous and authenticated users
DROP POLICY IF EXISTS verse_lyrics_select_policy ON public.verse_lyrics;
CREATE POLICY verse_lyrics_select_policy ON public.verse_lyrics
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Write policies: authenticated users only
-- Note: If you use public.user_roles, further restrict with:
-- WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin','editor')))

DROP POLICY IF EXISTS verse_lyrics_insert_policy ON public.verse_lyrics;
CREATE POLICY verse_lyrics_insert_policy ON public.verse_lyrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS verse_lyrics_update_policy ON public.verse_lyrics;
CREATE POLICY verse_lyrics_update_policy ON public.verse_lyrics
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS verse_lyrics_delete_policy ON public.verse_lyrics;
CREATE POLICY verse_lyrics_delete_policy ON public.verse_lyrics
  FOR DELETE
  TO authenticated
  USING (true);

-- Trigger function for updated_at with proper security settings
CREATE OR REPLACE FUNCTION public.update_verse_lyrics_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS verse_lyrics_updated_at_trigger ON public.verse_lyrics;
CREATE TRIGGER verse_lyrics_updated_at_trigger
  BEFORE UPDATE ON public.verse_lyrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_verse_lyrics_updated_at();

-- Trigger to auto-fill created_by on INSERT (with subselect for safety)
CREATE OR REPLACE FUNCTION public.set_verse_lyrics_created_by()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := (SELECT auth.uid());
  IF NEW.created_by IS NULL AND current_user_id IS NOT NULL THEN
    NEW.created_by := current_user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS verse_lyrics_set_created_by_trigger ON public.verse_lyrics;
CREATE TRIGGER verse_lyrics_set_created_by_trigger
  BEFORE INSERT ON public.verse_lyrics
  FOR EACH ROW
  EXECUTE FUNCTION public.set_verse_lyrics_created_by();

COMMIT;

/*
LRC Format Examples:

Simple (line-level):
[00:00.50]धर्मक्षेत्रे कुरुक्षेत्रे
[00:02.30]समवेता युयुत्सवः

Enhanced (word-level):
[00:00.50]<00:00.50>धर्म<00:01.00>क्षेत्रे <00:01.50>कुरु<00:02.00>क्षेत्रे

JSON timestamps format:
[
  {
    "start": 0.5,
    "end": 2.3,
    "text": "धर्मक्षेत्रे कुरुक्षेत्रे",
    "type": "line",
    "section": "sanskrit",
    "lineIndex": 0
  }
]
*/
