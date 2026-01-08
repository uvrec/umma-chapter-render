-- Enhancements to verse_lectures junction table
-- 1. Function for reverse query "get verses for a lecture"
-- 2. Trigger to auto-update verse_id when new verses are added

-- Function to get all verse references for a specific lecture
-- Returns structured data about each verse reference
CREATE OR REPLACE FUNCTION public.get_lecture_verses(p_lecture_id UUID)
RETURNS TABLE (
  verse_lecture_id UUID,
  verse_id UUID,
  book_slug TEXT,
  canto_number INTEGER,
  chapter_number INTEGER,
  verse_start INTEGER,
  verse_end INTEGER,
  is_primary BOOLEAN,
  -- Formatted reference string (e.g., "BG 2.14" or "SB 1.2.3-5")
  reference_string TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    vl.id,
    vl.verse_id,
    vl.book_slug,
    vl.canto_number,
    vl.chapter_number,
    vl.verse_start,
    vl.verse_end,
    vl.is_primary,
    -- Build human-readable reference
    CASE
      WHEN vl.canto_number IS NOT NULL THEN
        -- Book with cantos (SB, CC)
        UPPER(vl.book_slug) || ' ' || vl.canto_number || '.' || vl.chapter_number || '.' ||
        vl.verse_start || COALESCE('-' || vl.verse_end::TEXT, '')
      ELSE
        -- Book without cantos (BG, NOI, ISO)
        UPPER(vl.book_slug) || ' ' || vl.chapter_number || '.' ||
        vl.verse_start || COALESCE('-' || vl.verse_end::TEXT, '')
    END
  FROM public.verse_lectures vl
  WHERE vl.lecture_id = p_lecture_id
  ORDER BY vl.is_primary DESC, vl.book_slug, vl.canto_number NULLS FIRST, vl.chapter_number, vl.verse_start;
$$;

COMMENT ON FUNCTION public.get_lecture_verses IS 'Get all verse references for a lecture with formatted reference strings';

-- Trigger function to auto-populate verse_id when a matching verse exists
-- This runs on INSERT and UPDATE of verse_lectures
CREATE OR REPLACE FUNCTION public.link_verse_lecture_to_verse()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only try to link if verse_id is not already set
  IF NEW.verse_id IS NULL THEN
    NEW.verse_id := public.find_verse_id(
      NEW.book_slug,
      NEW.canto_number,
      NEW.chapter_number,
      NEW.verse_start::TEXT
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger on verse_lectures to auto-link verses
DROP TRIGGER IF EXISTS trg_link_verse_lecture ON public.verse_lectures;
CREATE TRIGGER trg_link_verse_lecture
  BEFORE INSERT OR UPDATE ON public.verse_lectures
  FOR EACH ROW
  EXECUTE FUNCTION public.link_verse_lecture_to_verse();

-- Trigger function to update verse_lectures when new verses are added
-- This finds any verse_lectures records that reference the newly added verse
CREATE OR REPLACE FUNCTION public.update_verse_lectures_on_new_verse()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_book_slug TEXT;
  v_canto_number INTEGER;
  v_chapter_number INTEGER;
BEGIN
  -- Get book slug and chapter info for the new verse
  SELECT
    b.slug,
    cn.canto_number,
    c.chapter_number
  INTO v_book_slug, v_canto_number, v_chapter_number
  FROM public.chapters c
  JOIN public.books b ON b.id = COALESCE(c.book_id, (SELECT book_id FROM public.cantos WHERE id = c.canto_id))
  LEFT JOIN public.cantos cn ON c.canto_id = cn.id
  WHERE c.id = NEW.chapter_id;

  -- Update any verse_lectures records that match this verse
  UPDATE public.verse_lectures
  SET verse_id = NEW.id
  WHERE verse_id IS NULL
    AND book_slug = v_book_slug
    AND (canto_number = v_canto_number OR (canto_number IS NULL AND v_canto_number IS NULL))
    AND chapter_number = v_chapter_number
    AND verse_start::TEXT = NEW.verse_number;

  RETURN NEW;
END;
$$;

-- Trigger on verses table to update verse_lectures when new verses are added
DROP TRIGGER IF EXISTS trg_update_verse_lectures ON public.verses;
CREATE TRIGGER trg_update_verse_lectures
  AFTER INSERT ON public.verses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_verse_lectures_on_new_verse();

COMMENT ON FUNCTION public.link_verse_lecture_to_verse IS 'Auto-link verse_lectures to existing verses on insert/update';
COMMENT ON FUNCTION public.update_verse_lectures_on_new_verse IS 'Auto-update verse_lectures.verse_id when new verses are added to the library';
