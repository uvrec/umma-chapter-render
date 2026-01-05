-- =====================================================
-- Tattvas System Enhancement Migration
-- =====================================================

-- 1. Add category column to tattvas table
ALTER TABLE tattvas ADD COLUMN IF NOT EXISTS category TEXT 
CHECK (category IN ('sambandha', 'abhidheya', 'prayojana'));

COMMENT ON COLUMN tattvas.category IS 'Philosophical category: sambandha (relationship), abhidheya (process), prayojana (goal)';

-- 2. Set categories for existing tattvas
UPDATE tattvas SET category = 'sambandha' WHERE slug = 'krishna-tattva';
UPDATE tattvas SET category = 'sambandha' WHERE slug = 'jiva-tattva';
UPDATE tattvas SET category = 'sambandha' WHERE slug = 'maya-tattva';
UPDATE tattvas SET category = 'abhidheya' WHERE slug = 'bhakti-tattva';
UPDATE tattvas SET category = 'abhidheya' WHERE slug = 'guru-tattva';

-- 3. Create get_tattva_verses function
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
  SELECT t.id INTO v_tattva_id FROM tattvas t WHERE t.slug = p_tattva_slug;
  
  IF v_tattva_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH target_tattvas AS (
    SELECT t.id, t.name_ua FROM tattvas t WHERE t.id = v_tattva_id
    UNION ALL
    SELECT t.id, t.name_ua FROM tattvas t 
    WHERE p_include_children AND t.parent_id = v_tattva_id
  )
  SELECT 
    v.id AS verse_id,
    b.slug AS book_slug,
    b.title_ua AS book_title,
    can.canto_number,
    ch.chapter_number,
    v.verse_number,
    v.sanskrit,
    v.translation_ua,
    v.translation_en,
    ct.relevance_score::FLOAT,
    tt.name_ua AS tattva_name
  FROM content_tattvas ct
  JOIN target_tattvas tt ON tt.id = ct.tattva_id
  JOIN verses v ON v.id = ct.verse_id
  JOIN chapters ch ON ch.id = v.chapter_id
  LEFT JOIN cantos can ON can.id = ch.canto_id
  JOIN books b ON b.id = COALESCE(can.book_id, ch.book_id)
  ORDER BY ct.relevance_score DESC, b.display_order, ch.chapter_number, v.verse_number
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- 4. Create get_verse_tattvas function
CREATE OR REPLACE FUNCTION get_verse_tattvas(p_verse_id UUID)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_ua TEXT,
  name_sanskrit TEXT,
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
    t.name_sanskrit,
    t.category,
    ct.relevance_score::FLOAT
  FROM content_tattvas ct
  JOIN tattvas t ON t.id = ct.tattva_id
  WHERE ct.verse_id = p_verse_id
  ORDER BY ct.relevance_score DESC;
END;
$$;

-- 5. Create search_tattvas function
CREATE OR REPLACE FUNCTION search_tattvas(p_query TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  name_en TEXT,
  name_ua TEXT,
  name_sanskrit TEXT,
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
    t.name_sanskrit,
    t.description_ua,
    t.description_en,
    t.category,
    t.parent_id,
    p.slug AS parent_slug,
    (SELECT COUNT(*) FROM content_tattvas ct WHERE ct.tattva_id = t.id) AS verses_count
  FROM tattvas t
  LEFT JOIN tattvas p ON p.id = t.parent_id
  WHERE 
    t.name_ua ILIKE '%' || p_query || '%'
    OR t.name_en ILIKE '%' || p_query || '%'
    OR t.name_sanskrit ILIKE '%' || p_query || '%'
    OR t.description_ua ILIKE '%' || p_query || '%'
    OR t.description_en ILIKE '%' || p_query || '%'
  ORDER BY 
    CASE WHEN t.name_ua ILIKE p_query || '%' THEN 0 ELSE 1 END,
    t.display_order;
END;
$$;

-- 6. Create get_tattva_breadcrumb function
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
    FROM tattvas t
    WHERE t.slug = p_tattva_slug
    UNION ALL
    SELECT t.id, t.name_ua, t.name_en, t.slug, t.parent_id, path.depth + 1
    FROM tattvas t
    JOIN path ON t.id = path.parent_id
  )
  SELECT path.id, path.name_ua, path.name_en, path.slug, path.depth
  FROM path
  ORDER BY path.depth DESC;
END;
$$;

-- 7. Grant permissions
GRANT EXECUTE ON FUNCTION get_tattva_verses TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_verse_tattvas TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_tattvas TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_tattva_breadcrumb TO anon, authenticated;