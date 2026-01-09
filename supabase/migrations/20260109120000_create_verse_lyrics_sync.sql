-- Create verse_lyrics table for audio-text synchronization
-- Supports LRC format (standard lyrics format) and our JSON timestamp format

CREATE TABLE IF NOT EXISTS verse_lyrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id UUID NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  audio_type TEXT NOT NULL DEFAULT 'full',  -- 'full', 'recitation', 'explanation_ua', 'explanation_en'
  language TEXT NOT NULL DEFAULT 'sa',       -- 'sa' (sanskrit), 'en', 'ua'

  -- LRC format content (simple, human-editable)
  lrc_content TEXT,

  -- JSON timestamps for more complex sync (word-level, sections)
  timestamps JSONB,

  -- Metadata
  total_duration REAL,                       -- Audio duration in seconds
  sync_type TEXT DEFAULT 'line',             -- 'section', 'line', 'word'
  is_enhanced BOOLEAN DEFAULT false,         -- Enhanced LRC (word-level timing)

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),

  -- Unique constraint
  UNIQUE(verse_id, audio_type, language)
);

-- Add comments
COMMENT ON TABLE verse_lyrics IS 'Audio-text synchronization data for verses (LRC and JSON formats)';
COMMENT ON COLUMN verse_lyrics.lrc_content IS 'Standard LRC format lyrics with timestamps';
COMMENT ON COLUMN verse_lyrics.timestamps IS 'JSON array of {start, end, text, section, lineIndex} objects';
COMMENT ON COLUMN verse_lyrics.sync_type IS 'Granularity: section (blocks), line (paragraphs), word (karaoke)';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_verse_lyrics_verse_id ON verse_lyrics(verse_id);
CREATE INDEX IF NOT EXISTS idx_verse_lyrics_audio_type ON verse_lyrics(audio_type);
CREATE INDEX IF NOT EXISTS idx_verse_lyrics_language ON verse_lyrics(language);

-- Enable RLS
ALTER TABLE verse_lyrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read lyrics
CREATE POLICY "verse_lyrics_select_policy" ON verse_lyrics
  FOR SELECT USING (true);

-- Only authenticated users can insert/update (admins)
CREATE POLICY "verse_lyrics_insert_policy" ON verse_lyrics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "verse_lyrics_update_policy" ON verse_lyrics
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "verse_lyrics_delete_policy" ON verse_lyrics
  FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_verse_lyrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verse_lyrics_updated_at_trigger
  BEFORE UPDATE ON verse_lyrics
  FOR EACH ROW
  EXECUTE FUNCTION update_verse_lyrics_updated_at();

-- Add sample LRC format comment for reference
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
