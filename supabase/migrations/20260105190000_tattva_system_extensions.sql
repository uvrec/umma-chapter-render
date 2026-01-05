-- =============================================================================
-- Tattva System Extensions - Functions and additional seed data
-- =============================================================================

-- Function to get tattva hierarchy (with children count)
CREATE OR REPLACE FUNCTION get_tattva_tree(p_parent_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name_uk TEXT,
  name_en TEXT,
  slug TEXT,
  description_uk TEXT,
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
    t.name_uk,
    t.name_en,
    t.slug,
    t.description_uk,
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
    t.name_uk,
    t.name_en,
    t.slug,
    t.description_uk,
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
  tt.name_uk,
  tt.name_en,
  tt.slug,
  tt.description_uk,
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
  tattva_id UUID,
  name_uk TEXT,
  name_en TEXT,
  slug TEXT,
  category TEXT,
  relevance_score REAL
) AS $$
SELECT
  t.id AS tattva_id,
  t.name_uk,
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
  name_uk TEXT,
  name_en TEXT,
  slug TEXT,
  category TEXT,
  parent_slug TEXT,
  verses_count BIGINT
) AS $$
SELECT
  t.id,
  t.name_uk,
  t.name_en,
  t.slug,
  t.category,
  p.slug AS parent_slug,
  (SELECT COUNT(*) FROM content_tattvas WHERE tattva_id = t.id) AS verses_count
FROM tattvas t
LEFT JOIN tattvas p ON t.parent_id = p.id
WHERE
  t.name_uk ILIKE '%' || p_query || '%'
  OR t.name_en ILIKE '%' || p_query || '%'
  OR t.slug ILIKE '%' || p_query || '%'
  OR t.description_uk ILIKE '%' || p_query || '%'
  OR t.description_en ILIKE '%' || p_query || '%'
ORDER BY
  CASE WHEN t.name_en ILIKE p_query || '%' THEN 0 ELSE 1 END,
  t.display_order;
$$ LANGUAGE SQL STABLE;

-- Function to get breadcrumb path for a tattva
CREATE OR REPLACE FUNCTION get_tattva_breadcrumb(p_tattva_slug TEXT)
RETURNS TABLE (
  id UUID,
  name_uk TEXT,
  name_en TEXT,
  slug TEXT,
  depth INTEGER
) AS $$
WITH RECURSIVE breadcrumb AS (
  SELECT t.id, t.name_uk, t.name_en, t.slug, t.parent_id, 0 AS depth
  FROM tattvas t
  WHERE t.slug = p_tattva_slug

  UNION ALL

  SELECT t.id, t.name_uk, t.name_en, t.slug, t.parent_id, b.depth + 1
  FROM tattvas t
  JOIN breadcrumb b ON t.id = b.parent_id
  WHERE b.depth < 10
)
SELECT id, name_uk, name_en, slug, depth
FROM breadcrumb
ORDER BY depth DESC;
$$ LANGUAGE SQL STABLE;

-- Add more seed data for guru-tattva subcategories
INSERT INTO tattvas (name_uk, name_en, slug, parent_id, description_uk, description_en, display_order)
SELECT
  'Yei kṛṣṇa-tattva-vetta',
  'Yei krsna-tattva-vetta',
  'yei-krsna-tattva-vetta',
  (SELECT id FROM tattvas WHERE slug = 'guru-tattva'),
  'Той, хто знає науку про Крішну, є духовним вчителем',
  'One who knows the science of Krishna is the spiritual master',
  1
WHERE NOT EXISTS (SELECT 1 FROM tattvas WHERE slug = 'yei-krsna-tattva-vetta');

INSERT INTO tattvas (name_uk, name_en, slug, parent_id, description_uk, description_en, display_order)
SELECT
  'Дікша та шікша',
  'Diksa and Siksa',
  'diksa-siksa',
  (SELECT id FROM tattvas WHERE slug = 'guru-tattva'),
  'Ініціюючий та наставляючий духовний вчитель',
  'Initiating and instructing spiritual master',
  2
WHERE NOT EXISTS (SELECT 1 FROM tattvas WHERE slug = 'diksa-siksa');

INSERT INTO tattvas (name_uk, name_en, slug, parent_id, description_uk, description_en, display_order)
SELECT
  'Учнівська послідовність',
  'Disciplic Succession',
  'parampara',
  (SELECT id FROM tattvas WHERE slug = 'guru-tattva'),
  'Ланцюг учнівської послідовності',
  'Chain of disciplic succession',
  3
WHERE NOT EXISTS (SELECT 1 FROM tattvas WHERE slug = 'parampara');

-- Add subcategories for bhakti-tattva
INSERT INTO tattvas (name_uk, name_en, slug, parent_id, description_uk, description_en, display_order)
SELECT
  'Дев''ять форм бгакті',
  'Nine Processes of Bhakti',
  'nava-vidha-bhakti',
  (SELECT id FROM tattvas WHERE slug = 'bhakti-tattva'),
  'Шраванам, кіртанам, смаранам та інші',
  'Sravanam, kirtanam, smaranam and others',
  1
WHERE NOT EXISTS (SELECT 1 FROM tattvas WHERE slug = 'nava-vidha-bhakti');

INSERT INTO tattvas (name_uk, name_en, slug, parent_id, description_uk, description_en, display_order)
SELECT
  'Садгана-бгакті',
  'Sadhana-bhakti',
  'sadhana-bhakti',
  (SELECT id FROM tattvas WHERE slug = 'bhakti-tattva'),
  'Регламентована практика відданості',
  'Regulated devotional practice',
  2
WHERE NOT EXISTS (SELECT 1 FROM tattvas WHERE slug = 'sadhana-bhakti');

INSERT INTO tattvas (name_uk, name_en, slug, parent_id, description_uk, description_en, display_order)
SELECT
  'Бгава та према',
  'Bhava and Prema',
  'bhava-prema',
  (SELECT id FROM tattvas WHERE slug = 'bhakti-tattva'),
  'Екстатична та чиста любов до Бога',
  'Ecstatic and pure love of God',
  3
WHERE NOT EXISTS (SELECT 1 FROM tattvas WHERE slug = 'bhava-prema');

-- Comments
COMMENT ON FUNCTION get_tattva_tree IS 'Get hierarchical tree of tattvas with counts';
COMMENT ON FUNCTION get_tattva_verses IS 'Get verses associated with a tattva';
COMMENT ON FUNCTION get_verse_tattvas IS 'Get tattvas for a specific verse';
COMMENT ON FUNCTION search_tattvas IS 'Search tattvas by name or description';
COMMENT ON FUNCTION get_tattva_breadcrumb IS 'Get breadcrumb path for navigation';
