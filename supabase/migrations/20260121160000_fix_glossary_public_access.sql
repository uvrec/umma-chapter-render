-- ============================================================================
-- Fix: Restore public access to glossary functions
-- ============================================================================
-- Glossary is public educational content - should be accessible to anon
-- ============================================================================

-- ============================================================================
-- 1. GRANT SELECT on materialized views used by get_glossary_stats
-- ============================================================================
-- These are the underlying data sources - without SELECT, the function fails

GRANT SELECT ON public.glossary_stats_cache_uk TO anon, authenticated;
GRANT SELECT ON public.glossary_stats_cache_en TO anon, authenticated;

-- Also grant on glossary_terms if needed
GRANT SELECT ON public.glossary_terms TO anon, authenticated;

-- ============================================================================
-- 2. GRANT EXECUTE on glossary functions
-- ============================================================================

-- get_glossary_stats - needed for sidebar categories
DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.get_glossary_stats(text) TO anon, authenticated;
EXCEPTION WHEN undefined_function THEN
  RAISE NOTICE 'Function public.get_glossary_stats(text) not found';
END $$;

-- get_glossary_term_by_name - needed for term details
DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.get_glossary_term_by_name(text, text) TO anon, authenticated;
EXCEPTION WHEN undefined_function THEN
  RAISE NOTICE 'Function public.get_glossary_term_by_name(text, text) not found';
END $$;

-- get_glossary_terms_grouped - for GlossaryDB page
DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.get_glossary_terms_grouped TO anon, authenticated;
EXCEPTION WHEN undefined_function THEN
  RAISE NOTICE 'Function public.get_glossary_terms_grouped not found';
END $$;

-- get_glossary_term_details - for expanded term view
DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.get_glossary_term_details TO anon, authenticated;
EXCEPTION WHEN undefined_function THEN
  RAISE NOTICE 'Function public.get_glossary_term_details not found';
END $$;

-- ============================================================================
-- SUMMARY:
-- - SELECT on glossary_stats_cache_uk/en materialized views
-- - SELECT on glossary_terms table
-- - EXECUTE on all glossary functions for anon + authenticated
-- ============================================================================
