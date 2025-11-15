-- Add dual audio functionality to verses table
-- Allows separate audio files for each section (sanskrit, transliteration, synonyms, translation, commentary)
-- Matches blog_posts structure for consistency

-- Add new audio columns
ALTER TABLE verses
ADD COLUMN audio_sanskrit_url TEXT,
ADD COLUMN audio_transliteration_url TEXT,
ADD COLUMN audio_synonyms_ua_url TEXT,
ADD COLUMN audio_synonyms_en_url TEXT,
ADD COLUMN audio_translation_ua_url TEXT,
ADD COLUMN audio_translation_en_url TEXT,
ADD COLUMN audio_commentary_ua_url TEXT,
ADD COLUMN audio_commentary_en_url TEXT,
ADD COLUMN audio_metadata JSONB;

-- Migrate existing audio_url to audio_commentary_ua_url (most complete content)
-- This preserves backward compatibility
UPDATE verses
SET audio_commentary_ua_url = audio_url
WHERE audio_url IS NOT NULL
  AND audio_commentary_ua_url IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN verses.audio_sanskrit_url IS 'Audio recording of sanskrit/bengali text only';
COMMENT ON COLUMN verses.audio_transliteration_url IS 'Audio recording of transliteration';
COMMENT ON COLUMN verses.audio_synonyms_ua_url IS 'Audio recording of Ukrainian word-by-word translation';
COMMENT ON COLUMN verses.audio_synonyms_en_url IS 'Audio recording of English word-by-word translation';
COMMENT ON COLUMN verses.audio_translation_ua_url IS 'Audio recording of Ukrainian literary translation';
COMMENT ON COLUMN verses.audio_translation_en_url IS 'Audio recording of English literary translation';
COMMENT ON COLUMN verses.audio_commentary_ua_url IS 'Audio recording of Ukrainian commentary/purport';
COMMENT ON COLUMN verses.audio_commentary_en_url IS 'Audio recording of English commentary/purport';
COMMENT ON COLUMN verses.audio_metadata IS 'JSON metadata: duration, size, format, etc.';
COMMENT ON COLUMN verses.audio_url IS 'Legacy field - kept for backward compatibility';
