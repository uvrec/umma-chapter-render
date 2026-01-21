-- ============================================================================
-- Fix: Restore public access to glossary functions
-- ============================================================================
-- Glossary is public educational content - should be accessible to anon
-- ============================================================================

-- get_glossary_stats - needed for sidebar categories
GRANT EXECUTE ON FUNCTION public.get_glossary_stats(text) TO anon;

-- get_glossary_term_by_name - needed for term details
GRANT EXECUTE ON FUNCTION public.get_glossary_term_by_name(text, text) TO anon;

-- ============================================================================
-- SUMMARY:
-- Glossary functions now accessible to both anon and authenticated
-- ============================================================================
