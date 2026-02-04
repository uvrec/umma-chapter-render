-- ============================================
-- Create RPC function for Prabhupada Timeline
-- Aggregates lectures, letters, and diary entries
-- ============================================

-- Create composite type for timeline items
DO $$ BEGIN
  CREATE TYPE public.timeline_item AS (
    event_date DATE,
    event_type TEXT,
    title_en TEXT,
    title_uk TEXT,
    location_en TEXT,
    location_uk TEXT,
    slug TEXT,
    extra_type TEXT,
    book_slug TEXT,
    chapter_number INTEGER,
    verse_number TEXT
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create the RPC function
CREATE OR REPLACE FUNCTION public.get_prabhupada_timeline(
  p_year INTEGER DEFAULT NULL,
  p_month INTEGER DEFAULT NULL,
  p_event_types TEXT[] DEFAULT ARRAY['lecture', 'letter', 'diary']
)
RETURNS SETOF public.timeline_item
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  -- Lectures
  SELECT
    lecture_date AS event_date,
    'lecture'::TEXT AS event_type,
    title_en,
    title_uk,
    location_en,
    location_uk,
    slug,
    lecture_type AS extra_type,
    book_slug,
    chapter_number,
    verse_number::TEXT
  FROM public.lectures
  WHERE 'lecture' = ANY(p_event_types)
    AND (p_year IS NULL OR EXTRACT(YEAR FROM lecture_date) = p_year)
    AND (p_month IS NULL OR EXTRACT(MONTH FROM lecture_date) = p_month)

  UNION ALL

  -- Letters
  SELECT
    letter_date AS event_date,
    'letter'::TEXT AS event_type,
    recipient_en AS title_en,
    recipient_uk AS title_uk,
    location_en,
    location_uk,
    slug,
    NULL::TEXT AS extra_type,
    NULL::TEXT AS book_slug,
    NULL::INTEGER AS chapter_number,
    NULL::TEXT AS verse_number
  FROM public.letters
  WHERE 'letter' = ANY(p_event_types)
    AND (p_year IS NULL OR EXTRACT(YEAR FROM letter_date) = p_year)
    AND (p_month IS NULL OR EXTRACT(MONTH FROM letter_date) = p_month)

  UNION ALL

  -- Diary entries (Transcendental Diary - book slug 'td')
  SELECT
    v.event_date,
    'diary'::TEXT AS event_type,
    c.title_en,
    c.title_uk,
    NULL::TEXT AS location_en,
    NULL::TEXT AS location_uk,
    b.slug || '/' || c.chapter_number || '/' || v.verse_number AS slug,
    'diary_entry'::TEXT AS extra_type,
    b.slug AS book_slug,
    c.chapter_number,
    v.verse_number
  FROM public.verses v
  JOIN public.chapters c ON v.chapter_id = c.id
  JOIN public.books b ON c.book_id = b.id
  WHERE b.slug = 'td'
    AND v.event_date IS NOT NULL
    AND 'diary' = ANY(p_event_types)
    AND (p_year IS NULL OR EXTRACT(YEAR FROM v.event_date) = p_year)
    AND (p_month IS NULL OR EXTRACT(MONTH FROM v.event_date) = p_month)

  ORDER BY event_date ASC;
$$;

-- Grant execute permission to everyone (public read)
GRANT EXECUTE ON FUNCTION public.get_prabhupada_timeline(INTEGER, INTEGER, TEXT[]) TO anon;
GRANT EXECUTE ON FUNCTION public.get_prabhupada_timeline(INTEGER, INTEGER, TEXT[]) TO authenticated;

-- Create function to get available years in the timeline
CREATE OR REPLACE FUNCTION public.get_timeline_years()
RETURNS TABLE(year INTEGER, lecture_count BIGINT, letter_count BIGINT, diary_count BIGINT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  WITH years AS (
    SELECT DISTINCT EXTRACT(YEAR FROM lecture_date)::INTEGER AS year FROM public.lectures
    UNION
    SELECT DISTINCT EXTRACT(YEAR FROM letter_date)::INTEGER AS year FROM public.letters
    UNION
    SELECT DISTINCT EXTRACT(YEAR FROM event_date)::INTEGER AS year FROM public.verses v
    JOIN public.chapters c ON v.chapter_id = c.id
    JOIN public.books b ON c.book_id = b.id
    WHERE b.slug = 'td' AND v.event_date IS NOT NULL
  ),
  lecture_counts AS (
    SELECT EXTRACT(YEAR FROM lecture_date)::INTEGER AS year, COUNT(*) AS cnt
    FROM public.lectures
    GROUP BY EXTRACT(YEAR FROM lecture_date)
  ),
  letter_counts AS (
    SELECT EXTRACT(YEAR FROM letter_date)::INTEGER AS year, COUNT(*) AS cnt
    FROM public.letters
    GROUP BY EXTRACT(YEAR FROM letter_date)
  ),
  diary_counts AS (
    SELECT EXTRACT(YEAR FROM v.event_date)::INTEGER AS year, COUNT(*) AS cnt
    FROM public.verses v
    JOIN public.chapters c ON v.chapter_id = c.id
    JOIN public.books b ON c.book_id = b.id
    WHERE b.slug = 'td' AND v.event_date IS NOT NULL
    GROUP BY EXTRACT(YEAR FROM v.event_date)
  )
  SELECT
    y.year,
    COALESCE(lec.cnt, 0) AS lecture_count,
    COALESCE(let.cnt, 0) AS letter_count,
    COALESCE(d.cnt, 0) AS diary_count
  FROM years y
  LEFT JOIN lecture_counts lec ON y.year = lec.year
  LEFT JOIN letter_counts let ON y.year = let.year
  LEFT JOIN diary_counts d ON y.year = d.year
  ORDER BY y.year;
$$;

GRANT EXECUTE ON FUNCTION public.get_timeline_years() TO anon;
GRANT EXECUTE ON FUNCTION public.get_timeline_years() TO authenticated;

-- Create function to get locations for a given year
CREATE OR REPLACE FUNCTION public.get_timeline_locations(p_year INTEGER)
RETURNS TABLE(location TEXT, count BIGINT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT location_en AS location, COUNT(*) AS count
  FROM (
    SELECT location_en FROM public.lectures
    WHERE EXTRACT(YEAR FROM lecture_date) = p_year
    UNION ALL
    SELECT location_en FROM public.letters
    WHERE EXTRACT(YEAR FROM letter_date) = p_year
  ) combined
  WHERE location_en IS NOT NULL AND location_en != ''
  GROUP BY location_en
  ORDER BY count DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_timeline_locations(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_timeline_locations(INTEGER) TO authenticated;

COMMENT ON FUNCTION public.get_prabhupada_timeline IS 'Get unified timeline of Prabhupada activities: lectures, letters, diary entries';
COMMENT ON FUNCTION public.get_timeline_years IS 'Get available years with counts per event type';
COMMENT ON FUNCTION public.get_timeline_locations IS 'Get locations for a given year with counts';
