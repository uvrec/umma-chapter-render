-- Add chapter type support for text-only chapters (introductions, prefaces)
-- Step 1: Create enum for chapter types
CREATE TYPE chapter_type AS ENUM ('verses', 'text');

-- Step 2: Add columns to chapters table
ALTER TABLE chapters
  ADD COLUMN chapter_type chapter_type DEFAULT 'verses',
  ADD COLUMN content_ua text,
  ADD COLUMN content_en text;

-- Step 3: Add index for faster filtering by type
CREATE INDEX idx_chapters_type ON chapters(chapter_type);

-- Step 4: Add comment for documentation
COMMENT ON COLUMN chapters.chapter_type IS 'Type of chapter: verses (traditional with verse structure) or text (continuous text like preface)';
COMMENT ON COLUMN chapters.content_ua IS 'Full Ukrainian text content for text-type chapters';
COMMENT ON COLUMN chapters.content_en IS 'Full English text content for text-type chapters';