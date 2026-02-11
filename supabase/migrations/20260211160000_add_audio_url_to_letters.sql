-- Add audio_url column to letters table
ALTER TABLE public.letters ADD COLUMN IF NOT EXISTS audio_url TEXT;
