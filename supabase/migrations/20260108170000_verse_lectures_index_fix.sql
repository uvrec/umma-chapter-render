-- Performance and correctness fixes for verse_lectures
-- 1. Add index on verses(chapter_id, verse_number) for find_verse_id lookups
-- 2. Fix trigger to handle composite verse numbers correctly

-- Index for efficient verse lookups by chapter and verse_number
CREATE INDEX IF NOT EXISTS idx_verses_chapter_verse_number
  ON public.verses(chapter_id, verse_number);

-- Updated trigger function that correctly handles composite verses
-- Matches verse_start with verses.start_verse (parsed integer) instead of verse_number text
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

  -- Update verse_lectures records that match this verse
  -- For simple verses: verse_start matches start_verse
  -- For composite verses (e.g., "48-49"): verse_start matches start_verse AND verse_end matches end_verse
  UPDATE public.verse_lectures
  SET verse_id = NEW.id
  WHERE verse_id IS NULL
    AND book_slug = v_book_slug
    AND (canto_number = v_canto_number OR (canto_number IS NULL AND v_canto_number IS NULL))
    AND chapter_number = v_chapter_number
    AND verse_start = NEW.start_verse
    AND (
      -- Simple verse: no verse_end in verse_lectures, and verse is not composite
      (verse_end IS NULL AND NOT COALESCE(NEW.is_composite, false))
      -- Or composite verse: verse_end matches
      OR (verse_end IS NOT NULL AND verse_end = NEW.end_verse)
      -- Or simple verse in verse_lectures matching start of composite verse
      OR (verse_end IS NULL AND COALESCE(NEW.is_composite, false) AND NEW.start_verse = verse_start)
    );

  RETURN NEW;
END;
$$;

-- Also update find_verse_id to handle composite verses by matching start_verse
CREATE OR REPLACE FUNCTION public.find_verse_id(
  p_book_slug TEXT,
  p_canto_number INTEGER,
  p_chapter_number INTEGER,
  p_verse_number TEXT
) RETURNS UUID
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_verse_id UUID;
  v_book_id UUID;
  v_chapter_id UUID;
  v_verse_int INTEGER;
BEGIN
  -- Find book
  SELECT id INTO v_book_id FROM public.books WHERE slug = p_book_slug;
  IF v_book_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Find chapter (with or without canto)
  IF p_canto_number IS NOT NULL THEN
    -- Book with cantos (SB, CC)
    SELECT c.id INTO v_chapter_id
    FROM public.chapters c
    JOIN public.cantos cn ON c.canto_id = cn.id
    WHERE cn.book_id = v_book_id
      AND cn.canto_number = p_canto_number
      AND c.chapter_number = p_chapter_number;
  ELSE
    -- Book without cantos (BG, NOI, ISO)
    SELECT id INTO v_chapter_id
    FROM public.chapters
    WHERE book_id = v_book_id
      AND chapter_number = p_chapter_number;
  END IF;

  IF v_chapter_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Try exact match first (handles both simple "14" and composite "48-49")
  SELECT id INTO v_verse_id
  FROM public.verses
  WHERE chapter_id = v_chapter_id
    AND verse_number = p_verse_number;

  -- If no exact match and input is numeric, try matching by start_verse
  IF v_verse_id IS NULL THEN
    BEGIN
      v_verse_int := p_verse_number::INTEGER;
      SELECT id INTO v_verse_id
      FROM public.verses
      WHERE chapter_id = v_chapter_id
        AND start_verse = v_verse_int
        AND NOT COALESCE(is_composite, false);
    EXCEPTION WHEN OTHERS THEN
      -- p_verse_number is not a simple integer, skip this fallback
      NULL;
    END;
  END IF;

  RETURN v_verse_id;
END;
$$;

COMMENT ON INDEX idx_verses_chapter_verse_number IS 'Index for efficient verse lookups in find_verse_id()';
