-- Add support for composite verses (verse ranges like "48-49", "256-266")
-- This migration adds metadata fields and a trigger to automatically parse composite verses

-- 1. Add new columns for composite verse metadata
ALTER TABLE verses ADD COLUMN IF NOT EXISTS is_composite boolean DEFAULT false;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS start_verse integer;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS end_verse integer;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS verse_count integer DEFAULT 1;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS sort_key bigint;

-- 2. Add comments explaining the fields
COMMENT ON COLUMN verses.is_composite IS 'True if this verse represents a range (e.g., "48-49")';
COMMENT ON COLUMN verses.start_verse IS 'First verse number in the range (e.g., 48 for "48-49")';
COMMENT ON COLUMN verses.end_verse IS 'Last verse number in the range (e.g., 49 for "48-49")';
COMMENT ON COLUMN verses.verse_count IS 'Number of verses in the range (e.g., 2 for "48-49")';
COMMENT ON COLUMN verses.sort_key IS 'Sorting key based on start_verse (ensures "48-49" appears between 48 and 50)';

-- 3. Create function to parse composite verse numbers
CREATE OR REPLACE FUNCTION parse_composite_verse()
RETURNS TRIGGER AS $$
DECLARE
  verse_str TEXT;
  dash_pos INTEGER;
  start_num INTEGER;
  end_num INTEGER;
BEGIN
  -- Get the verse_number as string
  verse_str := TRIM(NEW.verse_number);

  -- Check if it contains a dash (composite verse)
  dash_pos := POSITION('-' IN verse_str);

  IF dash_pos > 0 THEN
    -- This is a composite verse (e.g., "48-49")
    BEGIN
      -- Extract start and end numbers
      start_num := (regexp_match(verse_str, '^(\d+)-'))[1]::INTEGER;
      end_num := (regexp_match(verse_str, '-(\d+)$'))[1]::INTEGER;

      -- Set composite verse fields
      NEW.is_composite := TRUE;
      NEW.start_verse := start_num;
      NEW.end_verse := end_num;
      NEW.verse_count := end_num - start_num + 1;
      NEW.sort_key := start_num::BIGINT;

      -- Update verse_number_sort to use start_verse for proper ordering
      -- This ensures "48-49" sorts as 48000000 (between 48 and 50)
      -- We still use the generated column, but sort_key helps with composite logic

    EXCEPTION WHEN OTHERS THEN
      -- If parsing fails, treat as simple verse
      NEW.is_composite := FALSE;
      NEW.start_verse := NULL;
      NEW.end_verse := NULL;
      NEW.verse_count := 1;

      -- Try to extract first number for sort_key
      BEGIN
        NEW.sort_key := (regexp_match(verse_str, '(\d+)'))[1]::BIGINT;
      EXCEPTION WHEN OTHERS THEN
        NEW.sort_key := 0;
      END;
    END;
  ELSE
    -- This is a simple verse (e.g., "48")
    BEGIN
      start_num := verse_str::INTEGER;
      NEW.is_composite := FALSE;
      NEW.start_verse := start_num;
      NEW.end_verse := start_num;
      NEW.verse_count := 1;
      NEW.sort_key := start_num::BIGINT;
    EXCEPTION WHEN OTHERS THEN
      -- If it's not a number, extract first digits
      NEW.is_composite := FALSE;
      NEW.start_verse := NULL;
      NEW.end_verse := NULL;
      NEW.verse_count := 1;

      BEGIN
        NEW.sort_key := (regexp_match(verse_str, '(\d+)'))[1]::BIGINT;
      EXCEPTION WHEN OTHERS THEN
        NEW.sort_key := 0;
      END;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to automatically parse composite verses on INSERT or UPDATE
DROP TRIGGER IF EXISTS set_composite_verse_metadata ON verses;

CREATE TRIGGER set_composite_verse_metadata
  BEFORE INSERT OR UPDATE OF verse_number ON verses
  FOR EACH ROW
  EXECUTE FUNCTION parse_composite_verse();

-- 5. Update existing verses to populate the new fields
UPDATE verses SET verse_number = verse_number WHERE verse_number IS NOT NULL;

-- 6. Create index on sort_key for efficient sorting
CREATE INDEX IF NOT EXISTS idx_verses_sort_key ON verses(chapter_id, sort_key);

-- 7. Add helpful comment
COMMENT ON TRIGGER set_composite_verse_metadata ON verses IS
  'Automatically parses verse_number to set composite verse metadata (is_composite, start_verse, end_verse, verse_count, sort_key)';
