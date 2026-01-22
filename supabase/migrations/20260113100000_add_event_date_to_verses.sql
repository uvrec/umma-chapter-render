-- ============================================
-- Add event_date column to verses table
-- For indexing dates from Transcendental Diary, letters, etc.
-- ============================================

-- Add column if not exists
ALTER TABLE public.verses
ADD COLUMN IF NOT EXISTS event_date date;

-- Add index for date queries
CREATE INDEX IF NOT EXISTS idx_verses_event_date ON public.verses (event_date);

-- Add composite index for filtering by book + date
CREATE INDEX IF NOT EXISTS idx_verses_book_date ON public.verses (chapter_id, event_date);

COMMENT ON COLUMN public.verses.event_date IS 'Parsed date for diary entries, letters, etc. Allows chronological queries.';
