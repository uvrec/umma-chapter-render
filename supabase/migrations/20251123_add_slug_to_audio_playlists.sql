-- Add slug field to audio_playlists for URL-friendly access
ALTER TABLE audio_playlists ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_audio_playlists_slug ON audio_playlists(slug);

-- Update existing audiobooks with slugs based on their titles
UPDATE audio_playlists SET slug = 'gita' WHERE title_ua ILIKE '%бгаґавад-ґіт%' OR title_en ILIKE '%bhagavad%gita%';
UPDATE audio_playlists SET slug = 'bhagavatam' WHERE title_ua ILIKE '%бгаґават%' OR title_en ILIKE '%bhagavat%';
UPDATE audio_playlists SET slug = 'iso' WHERE title_ua ILIKE '%ішопанішад%' OR title_en ILIKE '%isopanishad%';
UPDATE audio_playlists SET slug = 'noi' WHERE title_ua ILIKE '%нектар настанов%' OR title_en ILIKE '%nectar%instruction%';
