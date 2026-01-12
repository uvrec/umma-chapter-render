-- Seed LRC timestamps for first verses with audio
-- This migration adds sample LRC data to demonstrate the audio-text sync feature

BEGIN;

-- Insert sample LRC for Bhagavad Gita 1.1 (if exists with audio)
INSERT INTO public.verse_lyrics (verse_id, audio_type, language, lrc_content, sync_type)
SELECT
  v.id,
  'full',
  'sa',
  '[00:00.00]धृतराष्ट्र उवाच
[00:02.50]धर्मक्षेत्रे कुरुक्षेत्रे
[00:05.00]समवेता युयुत्सवः
[00:07.50]मामकाः पाण्डवाश्चैव
[00:10.00]किमकुर्वत सञ्जय',
  'line'
FROM public.verses v
JOIN public.chapters c ON v.chapter_id = c.id
JOIN public.books b ON c.book_id = b.id
WHERE v.verse_number = '1'
  AND c.chapter_number = 1
  AND b.slug = 'bhagavad-gita'
  AND v.full_verse_audio_url IS NOT NULL
ON CONFLICT (verse_id, audio_type, language) DO NOTHING;

-- Insert sample LRC for transliteration (Ukrainian)
INSERT INTO public.verse_lyrics (verse_id, audio_type, language, lrc_content, sync_type)
SELECT
  v.id,
  'full',
  'ua',
  '[00:00.00]дгр̣тара̄шт̣ра ува̄ча
[00:02.50]дгарма-кшетре куру-кшетре
[00:05.00]самавета̄ йуйутсавах̣
[00:07.50]ма̄мака̄х̣ па̄н̣д̣ава̄ш́ чаіва
[00:10.00]кім акурвата сан̃джайа',
  'line'
FROM public.verses v
JOIN public.chapters c ON v.chapter_id = c.id
JOIN public.books b ON c.book_id = b.id
WHERE v.verse_number = '1'
  AND c.chapter_number = 1
  AND b.slug = 'bhagavad-gita'
  AND v.full_verse_audio_url IS NOT NULL
ON CONFLICT (verse_id, audio_type, language) DO NOTHING;

-- Insert sample LRC for Bhagavad Gita 1.2 (if exists with audio)
INSERT INTO public.verse_lyrics (verse_id, audio_type, language, lrc_content, sync_type)
SELECT
  v.id,
  'full',
  'sa',
  '[00:00.00]सञ्जय उवाच
[00:02.00]दृष्ट्वा तु पाण्डवानीकं
[00:04.50]व्यूढं दुर्योधनस्तदा
[00:07.00]आचार्यमुपसंगम्य
[00:09.50]राजा वचनमब्रवीत्',
  'line'
FROM public.verses v
JOIN public.chapters c ON v.chapter_id = c.id
JOIN public.books b ON c.book_id = b.id
WHERE v.verse_number = '2'
  AND c.chapter_number = 1
  AND b.slug = 'bhagavad-gita'
  AND v.full_verse_audio_url IS NOT NULL
ON CONFLICT (verse_id, audio_type, language) DO NOTHING;

-- Insert sample for Srimad Bhagavatam 1.1.1 (if exists with audio)
INSERT INTO public.verse_lyrics (verse_id, audio_type, language, lrc_content, sync_type)
SELECT
  v.id,
  'full',
  'sa',
  '[00:00.00]ॐ नमो भगवते वासुदेवाय
[00:04.00]जन्माद्यस्य यतोऽन्वयादितरतश्चार्थेष्वभिज्ञः स्वराट्
[00:10.00]तेने ब्रह्म हृदा य आदिकवये मुह्यन्ति यत्सूरयः
[00:16.00]तेजोवारिमृदां यथा विनिमयो यत्र त्रिसर्गोऽमृषा
[00:22.00]धाम्ना स्वेन सदा निरस्तकुहकं सत्यं परं धीमहि',
  'line'
FROM public.verses v
JOIN public.chapters c ON v.chapter_id = c.id
WHERE v.verse_number = '1'
  AND c.chapter_number = 1
  AND v.full_verse_audio_url IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.cantos cn
    JOIN public.books b ON cn.book_id = b.id
    WHERE c.canto_id = cn.id
      AND cn.canto_number = 1
      AND b.slug = 'srimad-bhagavatam'
  )
ON CONFLICT (verse_id, audio_type, language) DO NOTHING;

COMMIT;

/*
Note: These sample timestamps are approximate and should be adjusted
using the LRC Editor in the admin panel for accurate synchronization.

The LRC format uses [MM:SS.CC] where:
- MM = minutes
- SS = seconds
- CC = centiseconds (hundredths of a second)
*/
