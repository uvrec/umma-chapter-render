-- Famous verses table
-- Stores references to famous/important verses that can be highlighted and navigated
CREATE TABLE IF NOT EXISTS famous_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id UUID NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  canto_number INT,
  chapter_number INT NOT NULL,
  verse_number TEXT NOT NULL,

  -- Ordering for navigation within book
  display_order INT NOT NULL DEFAULT 0,

  -- Optional metadata
  description_uk TEXT,
  description_en TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure unique verse per book (no duplicates)
  UNIQUE(verse_id)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_famous_verses_book ON famous_verses(book_slug);
CREATE INDEX IF NOT EXISTS idx_famous_verses_book_order ON famous_verses(book_slug, display_order);
CREATE INDEX IF NOT EXISTS idx_famous_verses_chapter ON famous_verses(book_slug, canto_number, chapter_number);

-- RLS policies
ALTER TABLE famous_verses ENABLE ROW LEVEL SECURITY;

-- Everyone can read famous verses
CREATE POLICY "Famous verses are publicly readable"
  ON famous_verses FOR SELECT
  USING (true);

-- Only admins can modify
CREATE POLICY "Only admins can insert famous verses"
  ON famous_verses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Only admins can update famous verses"
  ON famous_verses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Only admins can delete famous verses"
  ON famous_verses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Function to get famous verses for a book with verse details
CREATE OR REPLACE FUNCTION get_famous_verses_for_book(p_book_slug TEXT)
RETURNS TABLE (
  id UUID,
  verse_id UUID,
  book_slug TEXT,
  canto_number INT,
  chapter_number INT,
  verse_number TEXT,
  display_order INT,
  description_uk TEXT,
  description_en TEXT,
  sanskrit TEXT,
  transliteration TEXT,
  translation_uk TEXT,
  translation_en TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    fv.id,
    fv.verse_id,
    fv.book_slug,
    fv.canto_number,
    fv.chapter_number,
    fv.verse_number,
    fv.display_order,
    fv.description_uk,
    fv.description_en,
    v.sanskrit,
    v.transliteration,
    v.translation_uk,
    v.translation_en
  FROM famous_verses fv
  JOIN verses v ON fv.verse_id = v.id
  WHERE fv.book_slug = p_book_slug
  ORDER BY fv.display_order, fv.canto_number, fv.chapter_number, v.verse_number_sort;
$$;

-- Function to check if a verse is famous
CREATE OR REPLACE FUNCTION is_verse_famous(p_verse_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM famous_verses WHERE verse_id = p_verse_id
  );
$$;

-- Function to get adjacent famous verses (for navigation)
CREATE OR REPLACE FUNCTION get_adjacent_famous_verses(
  p_verse_id UUID,
  p_book_slug TEXT
)
RETURNS TABLE (
  prev_verse_id UUID,
  prev_chapter INT,
  prev_canto INT,
  prev_verse_number TEXT,
  next_verse_id UUID,
  next_chapter INT,
  next_canto INT,
  next_verse_number TEXT
)
LANGUAGE sql
STABLE
AS $$
  WITH current AS (
    SELECT display_order
    FROM famous_verses
    WHERE verse_id = p_verse_id AND book_slug = p_book_slug
  ),
  prev AS (
    SELECT verse_id, chapter_number, canto_number, verse_number
    FROM famous_verses
    WHERE book_slug = p_book_slug
      AND display_order < (SELECT display_order FROM current)
    ORDER BY display_order DESC
    LIMIT 1
  ),
  next AS (
    SELECT verse_id, chapter_number, canto_number, verse_number
    FROM famous_verses
    WHERE book_slug = p_book_slug
      AND display_order > (SELECT display_order FROM current)
    ORDER BY display_order ASC
    LIMIT 1
  )
  SELECT
    prev.verse_id,
    prev.chapter_number,
    prev.canto_number,
    prev.verse_number,
    next.verse_id,
    next.chapter_number,
    next.canto_number,
    next.verse_number
  FROM (SELECT 1) AS dummy
  LEFT JOIN prev ON true
  LEFT JOIN next ON true;
$$;

COMMENT ON TABLE famous_verses IS 'Stores references to famous/important verses for highlighting and navigation';
