-- Create verse_lectures junction table for linking lectures to verses in the library
-- This enables showing "Related Lectures" on verse pages and "Referenced Verses" on lecture pages

CREATE TABLE public.verse_lectures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Reference to the verse (through chapter -> book/canto structure)
  verse_id UUID REFERENCES public.verses(id) ON DELETE CASCADE,

  -- Reference to the lecture
  lecture_id UUID NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,

  -- Book reference for cases where verse doesn't exist yet in our library
  book_slug TEXT NOT NULL,  -- 'bg', 'sb', 'scc', 'noi', 'iso'
  canto_number INTEGER,     -- For SB (1-12) or CC lilas (1=adi, 2=madhya, 3=antya)
  chapter_number INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER,        -- For verse ranges (e.g., 2.7-11)

  -- Whether this is the primary topic of the lecture or just a reference
  is_primary BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- Prevent duplicate links
  UNIQUE(lecture_id, book_slug, canto_number, chapter_number, verse_start)
);

-- Indexes for efficient queries
CREATE INDEX idx_verse_lectures_verse_id ON public.verse_lectures(verse_id);
CREATE INDEX idx_verse_lectures_lecture_id ON public.verse_lectures(lecture_id);
CREATE INDEX idx_verse_lectures_book_chapter ON public.verse_lectures(book_slug, canto_number, chapter_number, verse_start);
CREATE INDEX idx_verse_lectures_primary ON public.verse_lectures(is_primary) WHERE is_primary = true;

-- Enable RLS
ALTER TABLE public.verse_lectures ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, admin write)
CREATE POLICY "Anyone can view verse-lecture links"
  ON public.verse_lectures FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert verse-lecture links"
  ON public.verse_lectures FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update verse-lecture links"
  ON public.verse_lectures FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete verse-lecture links"
  ON public.verse_lectures FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to find verse_id by book/chapter/verse reference
-- This can be used during import to link existing verses
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

  -- Find verse
  SELECT id INTO v_verse_id
  FROM public.verses
  WHERE chapter_id = v_chapter_id
    AND verse_number = p_verse_number;

  RETURN v_verse_id;
END;
$$;

-- Function to get lectures for a specific verse
CREATE OR REPLACE FUNCTION public.get_verse_lectures(
  p_book_slug TEXT,
  p_canto_number INTEGER,
  p_chapter_number INTEGER,
  p_verse_number INTEGER
) RETURNS SETOF public.lectures
LANGUAGE sql
STABLE
AS $$
  SELECT l.*
  FROM public.lectures l
  JOIN public.verse_lectures vl ON l.id = vl.lecture_id
  WHERE vl.book_slug = p_book_slug
    AND (vl.canto_number = p_canto_number OR (vl.canto_number IS NULL AND p_canto_number IS NULL))
    AND vl.chapter_number = p_chapter_number
    AND (
      vl.verse_start = p_verse_number
      OR (vl.verse_end IS NOT NULL AND p_verse_number BETWEEN vl.verse_start AND vl.verse_end)
    )
  ORDER BY vl.is_primary DESC, l.lecture_date;
$$;

COMMENT ON TABLE public.verse_lectures IS 'Junction table linking lectures to verses they reference or discuss';
COMMENT ON COLUMN public.verse_lectures.is_primary IS 'True if the verse is the main topic of the lecture, false for passing references';
COMMENT ON COLUMN public.verse_lectures.verse_id IS 'Direct FK to verse if it exists in our library, NULL otherwise';
