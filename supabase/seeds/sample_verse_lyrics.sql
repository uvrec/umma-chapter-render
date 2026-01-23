-- Sample LRC data for testing audio-text synchronization
-- Run this after applying the verse_lyrics migration and having some verses with audio

-- Example: Insert sample LRC for Bhagavad-gita 1.1
-- This is a template - replace verse_id with actual UUID from your database

/*
To use this script:

1. First, find a verse with audio:
   SELECT id, verse_number, full_verse_audio_url FROM verses
   WHERE full_verse_audio_url IS NOT NULL LIMIT 10;

2. Then uncomment and modify the INSERT below with the correct verse_id

INSERT INTO public.verse_lyrics (verse_id, audio_type, language, lrc_content, sync_type)
VALUES (
  'YOUR-VERSE-UUID-HERE',  -- Replace with actual verse id
  'full',
  'sa',
  '[00:00.50]धृतराष्ट्र उवाच
[00:02.30]धर्मक्षेत्रे कुरुक्षेत्रे
[00:04.80]समवेता युयुत्सवः
[00:07.20]मामकाः पाण्डवाश्चैव
[00:09.50]किमकुर्वत सञ्जय',
  'line'
);

-- Ukrainian translation timestamps
INSERT INTO public.verse_lyrics (verse_id, audio_type, language, lrc_content, sync_type)
VALUES (
  'YOUR-VERSE-UUID-HERE',  -- Same verse id
  'full',
  'ua',
  '[00:12.00]Дгр̣тара̄шт̣ра сказав:
[00:14.50]О Сан̃джайо, що робили мої сини
[00:18.00]та сини Па̄н̣д̣у, зібравшись
[00:21.50]на священному полі Курукшетра,
[00:25.00]прагнучи битися?',
  'line'
);
*/

-- Helper query to find verses with audio for testing
-- SELECT
--   v.id,
--   v.verse_number,
--   c.title_uk as chapter,
--   b.title_uk as book,
--   v.full_verse_audio_url
-- FROM verses v
-- JOIN chapters c ON v.chapter_id = c.id
-- LEFT JOIN books b ON c.book_id = b.id
-- WHERE v.full_verse_audio_url IS NOT NULL
-- ORDER BY b.title_uk, c.chapter_number, v.verse_number_sort
-- LIMIT 20;

-- Verify inserted data
-- SELECT * FROM verse_lyrics ORDER BY created_at DESC LIMIT 10;
