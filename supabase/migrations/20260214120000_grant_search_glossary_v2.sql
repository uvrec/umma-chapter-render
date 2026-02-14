-- ============================================================================
-- Fix: Grant EXECUTE on search_glossary_terms_v2 to public users
-- ============================================================================
-- This function was missing from the original GRANT migration
-- (20260121160000_fix_glossary_public_access.sql)
-- Without this GRANT, anon/authenticated users get permission denied
-- ============================================================================

-- search_glossary_terms_v2 — single-query glossary search with pagination
DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.search_glossary_terms_v2(text, text, text, text, text, integer, integer) TO anon, authenticated;
EXCEPTION WHEN undefined_function THEN
  RAISE NOTICE 'Function public.search_glossary_terms_v2 not found — run 20260107120000_fix_glossary_functions.sql first';
END $$;
