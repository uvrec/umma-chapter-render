-- =============================================================================
-- Fix Tattva System: Column Names, Category, and RPC Functions
-- =============================================================================

-- Part 1: Rename columns if they exist with old names
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

-- Part 2: Add category column with CHECK constraint (if not exists)
ALTER TABLE public.tattvas
ADD COLUMN IF NOT EXISTS category TEXT
CHECK (category IN ('sambandha', 'abhidheya', 'prayojana'));

COMMENT ON COLUMN public.tattvas.category IS 'Philosophical category: sambandha (relationship), abhidheya (process), prayojana (goal)';

-- Part 3: Set categories for existing records
-- Sambandha (relationship with God) - Krishna, Jiva, Maya
UPDATE public.tattvas SET category = 'sambandha' WHERE slug = 'krishna-tattva' AND category IS NULL;
UPDATE public.tattvas SET category = 'sambandha' WHERE slug = 'jiva-tattva' AND category IS NULL;
UPDATE public.tattvas SET category = 'sambandha' WHERE slug = 'maya-tattva' AND category IS NULL;

-- Abhidheya (method of attaining) - Bhakti, Guru
UPDATE public.tattvas SET category = 'abhidheya' WHERE slug = 'bhakti-tattva' AND category IS NULL;
UPDATE public.tattvas SET category = 'abhidheya' WHERE slug = 'guru-tattva' AND category IS NULL;

-- Prayojana tattvas
UPDATE public.tattvas SET category = 'prayojana' WHERE slug = 'prema-tattva' AND category IS NULL;
UPDATE public.tattvas SET category = 'prayojana' WHERE slug = 'nitya-lila' AND category IS NULL;

-- =============================================================================
-- Part 4: Recreate RPC Functions with Correct Column Names
-- =============================================================================

-- Drop existing functions to recreate with correct signatures
DROP FUNCTION IF EXISTS get_tattva_tree(UUID);
DROP FUNCTION IF EXISTS get_tattva_verses(TEXT, INTEGER, INTEGER, BOOLEAN);
DROP FUNCTION IF EXISTS get_verse_tattvas(UUID);
DROP FUNCTION IF EXISTS search_tattvas(TEXT);
DROP FUNCTION IF EXISTS get_tattva_breadcrumb(TEXT);

-- 4.1. get_tattva_tree — hierarchical tree of tattvas
CREATE OR REPLACE FUNCTION get_tattva_tree(p_parent_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_ua TEXT,
  description_en TEXT,
  description_ua TEXT,
  category TEXT,
  parent_id UUID,
  display_order INT,
  depth INT,
  children_count BIGINT,
  verses_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE tree AS (
    SELECT t.*, 0 AS depth
    FROM public.tattvas t
    WHERE (p_parent_id IS NULL AND t.parent_id IS NULL)
       OR (p_parent_id IS NOT NULL AND t.parent_id = p_parent_id)
    UNION ALL
    SELECT t.*, tree.depth + 1
    FROM public.tattvas t
    JOIN tree ON t.parent_id = tree.id
    WHERE tree.depth < 5
  )
  SELECT
    tree.id,
    tree.slug,
    tree.name_en,
    tree.name_ua,
    tree.description_en,
    tree.description_ua,
    tree.category,
    tree.parent_id,
    tree.display_order,
    tree.depth,
    (SELECT COUNT(*) FROM public.tattvas c WHERE c.parent_id = tree.id) AS children_count,
    (SELECT COUNT(*) FROM public.content_tattvas ct WHERE ct.tattva_id = tree.id) AS verses_count
  FROM tree
  ORDER BY tree.depth, tree.display_order;
END;
$$;

-- 4.2. get_tattva_verses — verses for a category with pagination
CREATE OR REPLACE FUNCTION get_tattva_verses(
  p_tattva_slug TEXT,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0,
  p_include_children BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
  verse_id UUID,
  book_slug TEXT,
  book_title TEXT,
  canto_number INT,
  chapter_number INT,
  verse_number TEXT,
  sanskrit TEXT,
  translation_ua TEXT,
  translation_en TEXT,
  relevance_score FLOAT,
  tattva_name TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_tattva_id UUID;
BEGIN
  -- Get tattva ID
  SELECT t.id INTO v_tattva_id FROM public.tattvas t WHERE t.slug = p_tattva_slug;

  IF v_tattva_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH target_tattvas AS (
    SELECT t.id, t.name_ua FROM public.tattvas t WHERE t.id = v_tattva_id
    UNION ALL
    SELECT t.id, t.name_ua FROM public.tattvas t
    WHERE p_include_children AND t.parent_id = v_tattva_id
  )
  SELECT
    v.id AS verse_id,
    b.slug AS book_slug,
    COALESCE(b.title_ua, b.title) AS book_title,
    can.canto_number,
    ch.chapter_number,
    v.verse_number,
    v.sanskrit,
    v.translation_ua,
    v.translation_en,
    ct.relevance_score::FLOAT,
    tt.name_ua AS tattva_name
  FROM public.content_tattvas ct
  JOIN target_tattvas tt ON tt.id = ct.tattva_id
  JOIN public.verses v ON v.id = ct.verse_id
  JOIN public.chapters ch ON ch.id = v.chapter_id
  LEFT JOIN public.cantos can ON can.id = ch.canto_id
  JOIN public.books b ON b.id = COALESCE(can.book_id, ch.book_id)
  ORDER BY ct.relevance_score DESC, b.display_order, ch.chapter_number, v.verse_number
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- 4.3. get_verse_tattvas — tattvas for a specific verse
CREATE OR REPLACE FUNCTION get_verse_tattvas(p_verse_id UUID)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_ua TEXT,
  category TEXT,
  relevance_score FLOAT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.slug,
    t.name_en,
    t.name_ua,
    t.category,
    ct.relevance_score::FLOAT
  FROM public.content_tattvas ct
  JOIN public.tattvas t ON t.id = ct.tattva_id
  WHERE ct.verse_id = p_verse_id
  ORDER BY ct.relevance_score DESC;
END;
$$;

-- 4.4. search_tattvas — search by name and description
CREATE OR REPLACE FUNCTION search_tattvas(p_query TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_ua TEXT,
  description_ua TEXT,
  description_en TEXT,
  category TEXT,
  parent_id UUID,
  parent_slug TEXT,
  verses_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.slug,
    t.name_en,
    t.name_ua,
    t.description_ua,
    t.description_en,
    t.category,
    t.parent_id,
    p.slug AS parent_slug,
    (SELECT COUNT(*) FROM public.content_tattvas ct WHERE ct.tattva_id = t.id) AS verses_count
  FROM public.tattvas t
  LEFT JOIN public.tattvas p ON p.id = t.parent_id
  WHERE
    t.name_ua ILIKE '%' || p_query || '%'
    OR t.name_en ILIKE '%' || p_query || '%'
    OR t.description_ua ILIKE '%' || p_query || '%'
    OR t.description_en ILIKE '%' || p_query || '%'
  ORDER BY
    CASE WHEN t.name_ua ILIKE p_query || '%' THEN 0 ELSE 1 END,
    t.display_order;
END;
$$;

-- 4.5. get_tattva_breadcrumb — breadcrumb path
CREATE OR REPLACE FUNCTION get_tattva_breadcrumb(p_tattva_slug TEXT)
RETURNS TABLE (
  id UUID,
  name_ua TEXT,
  name_en TEXT,
  slug TEXT,
  depth INT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE path AS (
    SELECT t.id, t.name_ua, t.name_en, t.slug, t.parent_id, 0 AS depth
    FROM public.tattvas t
    WHERE t.slug = p_tattva_slug
    UNION ALL
    SELECT t.id, t.name_ua, t.name_en, t.slug, t.parent_id, path.depth + 1
    FROM public.tattvas t
    JOIN path ON t.id = path.parent_id
  )
  SELECT path.id, path.name_ua, path.name_en, path.slug, path.depth
  FROM path
  ORDER BY path.depth DESC;
END;
$$;

-- =============================================================================
-- Part 5: Grant access permissions
-- =============================================================================

-- All functions accessible for anonymous users (read-only)
GRANT EXECUTE ON FUNCTION get_tattva_tree TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_tattva_verses TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_verse_tattvas TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_tattvas TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_tattva_breadcrumb TO anon, authenticated;

-- =============================================================================
-- Part 6: Comments for documentation
-- =============================================================================

COMMENT ON FUNCTION get_tattva_tree IS 'Get hierarchical tree of tattvas with counts';
COMMENT ON FUNCTION get_tattva_verses IS 'Get verses associated with a tattva with pagination';
COMMENT ON FUNCTION get_verse_tattvas IS 'Get tattvas for a specific verse';
COMMENT ON FUNCTION search_tattvas IS 'Search tattvas by name or description';
COMMENT ON FUNCTION get_tattva_breadcrumb IS 'Get breadcrumb path for navigation';
