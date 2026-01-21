-- ============================================================================
-- Fix: Remove SECURITY DEFINER from tattva_stats view
-- ============================================================================
-- Risk: SECURITY DEFINER with owner postgres can bypass RLS and leak data.
-- Fix: Recreate as SECURITY INVOKER (default) with explicit grants.
-- ============================================================================

-- 1) Recreate the view without SECURITY DEFINER (uses caller's privileges)
CREATE OR REPLACE VIEW public.tattva_stats AS
SELECT
  t.id,
  t.name_uk,
  t.name_en,
  t.slug,
  count(ct.id) AS verses_count,
  avg(ct.relevance_score) AS avg_relevance,
  count(CASE WHEN ct.tagged_by = 'ai' THEN 1 END) AS ai_tagged,
  count(CASE WHEN ct.tagged_by = 'manual' THEN 1 END) AS manual_tagged,
  count(CASE WHEN ct.tagged_by = 'seed' THEN 1 END) AS seed_tagged
FROM public.tattvas t
LEFT JOIN public.content_tattvas ct ON t.id = ct.tattva_id
GROUP BY t.id, t.name_uk, t.name_en, t.slug
ORDER BY t.display_order;

-- 2) Lock down privileges explicitly
REVOKE ALL ON public.tattva_stats FROM PUBLIC;

-- 3) Grant SELECT to appropriate roles
-- Tattva stats are public educational content, so allow both roles
GRANT SELECT ON public.tattva_stats TO authenticated;
GRANT SELECT ON public.tattva_stats TO anon;

-- 4) Add comment for documentation
COMMENT ON VIEW public.tattva_stats IS
'Aggregated tattva statistics. Uses SECURITY INVOKER (caller privileges).';
