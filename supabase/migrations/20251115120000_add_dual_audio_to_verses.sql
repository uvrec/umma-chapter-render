-- Add dual audio functionality to verses table
-- Simplified structure: 4 audio fields instead of 8
-- Prioritizes primary use case (full verse audio) while supporting advanced scenarios

-- Add new audio columns
ALTER TABLE verses
ADD COLUMN full_verse_audio_url TEXT,         -- PRIMARY: Complete verse recording (95% use case)
ADD COLUMN recitation_audio_url TEXT,          -- Sanskrit/Bengali + Transliteration recitation
ADD COLUMN explanation_ua_audio_url TEXT,      -- Ukrainian: Synonyms + Translation + Commentary
ADD COLUMN explanation_en_audio_url TEXT,      -- English: Synonyms + Translation + Commentary
ADD COLUMN audio_metadata JSONB;                -- Duration, file size, format, timestamps, etc.

-- Migrate existing audio_url to full_verse_audio_url (correct semantics)
-- Old audio_url contains COMPLETE verse recordings (lectures), not just commentary
UPDATE verses
SET full_verse_audio_url = audio_url
WHERE audio_url IS NOT NULL
  AND full_verse_audio_url IS NULL;

-- Add column comments for documentation
COMMENT ON COLUMN verses.full_verse_audio_url IS 'Primary audio: complete verse recording/lecture (most common use case)';
COMMENT ON COLUMN verses.recitation_audio_url IS 'Audio of sanskrit/bengali text and transliteration only';
COMMENT ON COLUMN verses.explanation_ua_audio_url IS 'Ukrainian: word-by-word, translation, and commentary combined';
COMMENT ON COLUMN verses.explanation_en_audio_url IS 'English: word-by-word, translation, and commentary combined';
COMMENT ON COLUMN verses.audio_metadata IS 'JSONB metadata: {duration, file_size, format, uploaded_at, etc.}';
COMMENT ON COLUMN verses.audio_url IS 'LEGACY: kept for backward compatibility, use full_verse_audio_url instead';

-- Create index for audio metadata queries (optional, for future features)
CREATE INDEX IF NOT EXISTS idx_verses_audio_metadata ON verses USING GIN (audio_metadata);
