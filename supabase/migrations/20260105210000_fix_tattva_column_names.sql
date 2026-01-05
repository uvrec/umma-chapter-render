-- =============================================================================
-- Fix Tattva Column Names: name_uk → name_ua, description_uk → description_ua
-- =============================================================================

-- Rename columns if they exist with old names
DO $$
BEGIN
  -- Check and rename name_uk to name_ua
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'tattvas'
    AND column_name = 'name_uk'
  ) THEN
    ALTER TABLE public.tattvas RENAME COLUMN name_uk TO name_ua;
    RAISE NOTICE 'Renamed name_uk to name_ua';
  END IF;

  -- Check and rename description_uk to description_ua
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'tattvas'
    AND column_name = 'description_uk'
  ) THEN
    ALTER TABLE public.tattvas RENAME COLUMN description_uk TO description_ua;
    RAISE NOTICE 'Renamed description_uk to description_ua';
  END IF;
END $$;

-- =============================================================================
-- Recreate RPC Functions with Correct Column Names
-- =============================================================================

-- Drop existing functions to recreate with correct signatures
DROP FUNCTION IF EXISTS get_tattva_tree(UUID);
DROP FUNCTION IF EXISTS get_tattva_verses(TEXT, INTEGER, INTEGER, BOOLEAN);
DROP FUNCTION IF EXISTS get_verse_tattvas(UUID);
DROP FUNCTION IF EXISTS search_tattvas(TEXT);
DROP FUNCTION IF EXISTS get_tattva_breadcrumb(TEXT);

-- Function to get tattva hierarchy (with children count)
CREATE OR REPLACE FUNCTION get_tattva_tree(p_parent_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name_ua TEXT,
  name_en TEXT,
  slug TEXT,
  description_ua TEXT,
  description_en TEXT,
  category TEXT,
  parent_id UUID,
  depth INTEGER,
  children_count BIGINT,
  verses_count BIGINT
) AS $$
WITH RECURSIVE tattva_tree AS (
  -- Base case: root level or children of specific parent
  SELECT
    t.id,
    t.name_ua,
    t.name_en,
    t.slug,
    t.description_ua,
    t.description_en,
    t.category,
    t.parent_id,
    t.display_order,
    0 AS depth
  FROM tattvas t
  WHERE (p_parent_id IS NULL AND t.parent_id IS NULL)
     OR (p_parent_id IS NOT NULL AND t.parent_id = p_parent_id)

  UNION ALL

  -- Recursive case: get children
  SELECT
    t.id,
    t.name_ua,
    t.name_en,
    t.slug,
    t.description_ua,
    t.description_en,
    t.category,
    t.parent_id,
    t.display_order,
    tt.depth + 1
  FROM tattvas t
  JOIN tattva_tree tt ON t.parent_id = tt.id
  WHERE tt.depth < 5  -- Max depth to prevent infinite recursion
)
SELECT
  tt.id,
  tt.name_ua,
  tt.name_en,
  tt.slug,
  tt.description_ua,
  tt.description_en,
  tt.category,
  tt.parent_id,
  tt.depth,
  (SELECT COUNT(*) FROM tattvas WHERE parent_id = tt.id) AS children_count,
  (SELECT COUNT(*) FROM content_tattvas WHERE tattva_id = tt.id) AS verses_count
FROM tattva_tree tt
ORDER BY tt.display_order, tt.name_en;
$$ LANGUAGE SQL STABLE;

-- Function to get verses for a tattva (with pagination)
CREATE OR REPLACE FUNCTION get_tattva_verses(
  p_tattva_slug TEXT,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_include_children BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
  verse_id UUID,
  book_slug TEXT,
  book_title TEXT,
  canto_number INTEGER,
  chapter_number INTEGER,
  verse_number TEXT,
  sanskrit TEXT,
  translation_ua TEXT,
  translation_en TEXT,
  relevance_score REAL,
  tattva_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH target_tattvas AS (
    -- Get the target tattva and optionally its children
    SELECT t.id, t.name_en
    FROM tattvas t
    WHERE t.slug = p_tattva_slug
    UNION ALL
    SELECT t.id, t.name_en
    FROM tattvas t
    JOIN tattvas parent ON t.parent_id = parent.id
    WHERE parent.slug = p_tattva_slug AND p_include_children
  )
  SELECT
    v.id AS verse_id,
    b.slug AS book_slug,
    b.title AS book_title,
    vm.canto_number,
    vm.chapter_number,
    v.verse_number,
    v.sanskrit,
    v.translation_ua,
    v.translation_en,
    ct.relevance_score::REAL,
    tt.name_en AS tattva_name
  FROM content_tattvas ct
  JOIN target_tattvas tt ON ct.tattva_id = tt.id
  JOIN verses v ON ct.verse_id = v.id
  JOIN chapters ch ON v.chapter_id = ch.id
  JOIN books b ON ch.book_id = b.id
  LEFT JOIN verses_with_metadata vm ON vm.id = v.id
  ORDER BY ct.relevance_score DESC, b.display_order, vm.chapter_number, v.verse_number_sort
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get tattvas for a specific verse
CREATE OR REPLACE FUNCTION get_verse_tattvas(p_verse_id UUID)
RETURNS TABLE (
  id UUID,
  name_ua TEXT,
  name_en TEXT,
  slug TEXT,
  category TEXT,
  relevance_score REAL
) AS $$
SELECT
  t.id,
  t.name_ua,
  t.name_en,
  t.slug,
  t.category,
  ct.relevance_score::REAL
FROM content_tattvas ct
JOIN tattvas t ON ct.tattva_id = t.id
WHERE ct.verse_id = p_verse_id
ORDER BY ct.relevance_score DESC, t.display_order;
$$ LANGUAGE SQL STABLE;

-- Function to search tattvas
CREATE OR REPLACE FUNCTION search_tattvas(p_query TEXT)
RETURNS TABLE (
  id UUID,
  name_ua TEXT,
  name_en TEXT,
  slug TEXT,
  category TEXT,
  parent_slug TEXT,
  verses_count BIGINT
) AS $$
SELECT
  t.id,
  t.name_ua,
  t.name_en,
  t.slug,
  t.category,
  p.slug AS parent_slug,
  (SELECT COUNT(*) FROM content_tattvas WHERE tattva_id = t.id) AS verses_count
FROM tattvas t
LEFT JOIN tattvas p ON t.parent_id = p.id
WHERE
  t.name_ua ILIKE '%' || p_query || '%'
  OR t.name_en ILIKE '%' || p_query || '%'
  OR t.slug ILIKE '%' || p_query || '%'
  OR t.description_ua ILIKE '%' || p_query || '%'
  OR t.description_en ILIKE '%' || p_query || '%'
ORDER BY
  CASE WHEN t.name_en ILIKE p_query || '%' THEN 0 ELSE 1 END,
  t.display_order;
$$ LANGUAGE SQL STABLE;

-- Function to get breadcrumb path for a tattva
CREATE OR REPLACE FUNCTION get_tattva_breadcrumb(p_tattva_slug TEXT)
RETURNS TABLE (
  id UUID,
  name_ua TEXT,
  name_en TEXT,
  slug TEXT,
  depth INTEGER
) AS $$
WITH RECURSIVE breadcrumb AS (
  SELECT t.id, t.name_ua, t.name_en, t.slug, t.parent_id, 0 AS depth
  FROM tattvas t
  WHERE t.slug = p_tattva_slug

  UNION ALL

  SELECT t.id, t.name_ua, t.name_en, t.slug, t.parent_id, b.depth + 1
  FROM tattvas t
  JOIN breadcrumb b ON t.id = b.parent_id
  WHERE b.depth < 10
)
SELECT id, name_ua, name_en, slug, depth
FROM breadcrumb
ORDER BY depth DESC;
$$ LANGUAGE SQL STABLE;

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON FUNCTION get_tattva_tree IS 'Get hierarchical tree of tattvas with counts';
COMMENT ON FUNCTION get_tattva_verses IS 'Get verses associated with a tattva';
COMMENT ON FUNCTION get_verse_tattvas IS 'Get tattvas for a specific verse';
COMMENT ON FUNCTION search_tattvas IS 'Search tattvas by name or description';
COMMENT ON FUNCTION get_tattva_breadcrumb IS 'Get breadcrumb path for navigation';
