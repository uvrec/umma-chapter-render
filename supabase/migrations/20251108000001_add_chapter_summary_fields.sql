-- Add summary fields to chapters table
-- Summary is a short description of the chapter content that appears before the verses list
-- Similar to vedabase.io/en/library/cc/madhya/8/

ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS summary_ua TEXT,
  ADD COLUMN IF NOT EXISTS summary_en TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.chapters.summary_ua IS 'Ukrainian summary/description of the chapter content, displayed before verses';
COMMENT ON COLUMN public.chapters.summary_en IS 'English summary/description of the chapter content, displayed before verses';
