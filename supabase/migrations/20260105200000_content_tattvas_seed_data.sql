-- =============================================================================
-- Content Tattvas - Schema updates and seed data
-- =============================================================================

-- Add tagged_by column to track source of tagging
ALTER TABLE public.content_tattvas ADD COLUMN IF NOT EXISTS tagged_by TEXT DEFAULT 'manual';

-- Add comment
COMMENT ON COLUMN public.content_tattvas.tagged_by IS 'Source of tagging: manual, ai, or import';

-- Add unique index for ON CONFLICT to work
CREATE UNIQUE INDEX IF NOT EXISTS content_tattvas_verse_tattva_uidx
  ON public.content_tattvas(verse_id, tattva_id);

-- =============================================================================
-- Seed data: Connect key verses to tattvas
-- These are foundational verses that clearly demonstrate each tattva
-- =============================================================================

-- Helper function to get verse ID by reference
CREATE OR REPLACE FUNCTION get_verse_id_by_ref(
  p_book_slug TEXT,
  p_chapter_number INTEGER,
  p_verse_number TEXT
) RETURNS UUID AS $$
  SELECT v.id
  FROM public.verses v
  JOIN public.chapters c ON v.chapter_id = c.id
  JOIN public.books b ON c.book_id = b.id
  WHERE b.slug = p_book_slug
    AND c.chapter_number = p_chapter_number
    AND v.verse_number = p_verse_number
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- Helper function to safely insert verse-tattva connection
CREATE OR REPLACE FUNCTION link_verse_to_tattva(
  p_book_slug TEXT,
  p_chapter_number INTEGER,
  p_verse_number TEXT,
  p_tattva_slug TEXT,
  p_relevance REAL DEFAULT 0.9,
  p_tagged_by TEXT DEFAULT 'seed'
) RETURNS VOID AS $$
DECLARE
  v_verse_id UUID;
  v_tattva_id UUID;
BEGIN
  -- Get verse ID
  v_verse_id := get_verse_id_by_ref(p_book_slug, p_chapter_number, p_verse_number);

  -- Get tattva ID
  SELECT id INTO v_tattva_id FROM public.tattvas WHERE slug = p_tattva_slug;

  -- Insert if both exist
  IF v_verse_id IS NOT NULL AND v_tattva_id IS NOT NULL THEN
    INSERT INTO public.content_tattvas (verse_id, tattva_id, relevance_score, tagged_by)
    VALUES (v_verse_id, v_tattva_id, p_relevance, p_tagged_by)
    ON CONFLICT (verse_id, tattva_id) DO UPDATE
    SET relevance_score = EXCLUDED.relevance_score,
        tagged_by = EXCLUDED.tagged_by;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- BHAGAVAD-GITA SEED DATA
-- =============================================================================

-- BG 2.12 - Soul eternality (jiva-tattva)
SELECT link_verse_to_tattva('bg', 2, '12', 'jiva-tattva', 1.0);

-- BG 2.13 - Transmigration of the soul
SELECT link_verse_to_tattva('bg', 2, '13', 'jiva-tattva', 1.0);

-- BG 2.14 - Material duality / temporary nature
SELECT link_verse_to_tattva('bg', 2, '14', 'maya-tattva', 0.9);

-- BG 2.17 - Soul is indestructible
SELECT link_verse_to_tattva('bg', 2, '17', 'jiva-tattva', 1.0);

-- BG 2.20 - Soul is eternal
SELECT link_verse_to_tattva('bg', 2, '20', 'jiva-tattva', 1.0);

-- BG 2.22 - Soul changes bodies
SELECT link_verse_to_tattva('bg', 2, '22', 'jiva-tattva', 0.95);

-- BG 4.7-8 - Krishna's appearance (krishna-tattva)
SELECT link_verse_to_tattva('bg', 4, '7', 'krishna-tattva', 1.0);
SELECT link_verse_to_tattva('bg', 4, '8', 'krishna-tattva', 1.0);

-- BG 4.34 - Approaching a spiritual master (guru-tattva)
SELECT link_verse_to_tattva('bg', 4, '34', 'guru-tattva', 1.0);

-- BG 7.4-5 - Material and spiritual energies (shakti-tattva)
SELECT link_verse_to_tattva('bg', 7, '4', 'shakti-tattva', 1.0);
SELECT link_verse_to_tattva('bg', 7, '5', 'shakti-tattva', 1.0);
SELECT link_verse_to_tattva('bg', 7, '5', 'jiva-tattva', 0.8);

-- BG 7.14 - Maya is difficult to overcome
SELECT link_verse_to_tattva('bg', 7, '14', 'maya-tattva', 1.0);

-- BG 8.5 - Remembering Krishna at death
SELECT link_verse_to_tattva('bg', 8, '5', 'krishna-tattva', 0.9);

-- BG 9.10 - Material nature works under Krishna's direction
SELECT link_verse_to_tattva('bg', 9, '10', 'shakti-tattva', 0.9);
SELECT link_verse_to_tattva('bg', 9, '10', 'krishna-tattva', 0.8);

-- BG 9.26 - Simple offerings with devotion (bhakti-tattva)
SELECT link_verse_to_tattva('bg', 9, '26', 'bhakti-tattva', 1.0);

-- BG 9.27-28 - Offering everything to Krishna
SELECT link_verse_to_tattva('bg', 9, '27', 'bhakti-tattva', 0.95);
SELECT link_verse_to_tattva('bg', 9, '28', 'bhakti-tattva', 0.9);

-- BG 10.8 - Krishna is source of everything
SELECT link_verse_to_tattva('bg', 10, '8', 'krishna-tattva', 1.0);

-- BG 10.10 - Krishna gives understanding (buddhi-yoga)
SELECT link_verse_to_tattva('bg', 10, '10', 'bhakti-tattva', 0.9);

-- BG 12.8-12 - Process of devotion
SELECT link_verse_to_tattva('bg', 12, '8', 'bhakti-tattva', 1.0);
SELECT link_verse_to_tattva('bg', 12, '9', 'bhakti-tattva', 0.9);

-- BG 14.5 - Three modes of material nature
SELECT link_verse_to_tattva('bg', 14, '5', 'maya-tattva', 1.0);

-- BG 15.7 - Living entity is part of Krishna
SELECT link_verse_to_tattva('bg', 15, '7', 'jiva-tattva', 1.0);
SELECT link_verse_to_tattva('bg', 15, '7', 'krishna-tattva', 0.7);

-- BG 15.15 - Krishna in everyone's heart
SELECT link_verse_to_tattva('bg', 15, '15', 'krishna-tattva', 0.95);

-- BG 18.55 - By devotion one can know Krishna
SELECT link_verse_to_tattva('bg', 18, '55', 'bhakti-tattva', 1.0);
SELECT link_verse_to_tattva('bg', 18, '55', 'krishna-tattva', 0.8);

-- BG 18.61 - Supersoul directs all beings
SELECT link_verse_to_tattva('bg', 18, '61', 'krishna-tattva', 0.9);

-- BG 18.65 - Always think of Krishna
SELECT link_verse_to_tattva('bg', 18, '65', 'bhakti-tattva', 1.0);
SELECT link_verse_to_tattva('bg', 18, '65', 'krishna-tattva', 0.8);

-- BG 18.66 - Surrender unto Krishna (most important)
SELECT link_verse_to_tattva('bg', 18, '66', 'bhakti-tattva', 1.0);
SELECT link_verse_to_tattva('bg', 18, '66', 'krishna-tattva', 0.9);

-- =============================================================================
-- SRIMAD-BHAGAVATAM SEED DATA (if available)
-- =============================================================================

-- SB 1.2.6 - Supreme occupation (bhagavata-dharma)
SELECT link_verse_to_tattva('sb', 2, '6', 'bhakti-tattva', 1.0);

-- SB 1.2.7 - Unmotivated service
SELECT link_verse_to_tattva('sb', 2, '7', 'bhakti-tattva', 0.95);

-- SB 1.2.11 - Three features of Absolute
SELECT link_verse_to_tattva('sb', 2, '11', 'krishna-tattva', 1.0);

-- SB 1.3.28 - Krishna is original source
SELECT link_verse_to_tattva('sb', 3, '28', 'krishna-tattva', 1.0);

-- =============================================================================
-- Cleanup helper functions (optional - keep for future use)
-- =============================================================================

-- COMMENT: Keep helper functions for future manual tagging
-- DROP FUNCTION IF EXISTS get_verse_id_by_ref;
-- DROP FUNCTION IF EXISTS link_verse_to_tattva;

-- =============================================================================
-- Create view for tattva statistics
-- =============================================================================

CREATE OR REPLACE VIEW public.tattva_stats AS
SELECT
  t.id,
  t.name_uk,
  t.name_en,
  t.slug,
  t.category,
  COUNT(ct.id) AS verses_count,
  AVG(ct.relevance_score) AS avg_relevance,
  COUNT(CASE WHEN ct.tagged_by = 'ai' THEN 1 END) AS ai_tagged,
  COUNT(CASE WHEN ct.tagged_by = 'manual' THEN 1 END) AS manual_tagged,
  COUNT(CASE WHEN ct.tagged_by = 'seed' THEN 1 END) AS seed_tagged
FROM public.tattvas t
LEFT JOIN public.content_tattvas ct ON t.id = ct.tattva_id
GROUP BY t.id, t.name_uk, t.name_en, t.slug, t.category
ORDER BY t.category, t.display_order;

COMMENT ON VIEW public.tattva_stats IS 'Statistics for tattva tagging coverage';

-- Grant access
GRANT SELECT ON public.tattva_stats TO authenticated;
GRANT SELECT ON public.tattva_stats TO anon;
