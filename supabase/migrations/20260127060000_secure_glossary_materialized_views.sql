-- ============================================================================
-- Security Fix: Revoke direct access to glossary materialized views
-- ============================================================================
-- Materialized views don't support RLS, so direct access bypasses security.
-- Access should go through SECURITY DEFINER functions instead.
-- ============================================================================

-- Revoke direct SELECT from anon/authenticated
-- The get_glossary_stats() function uses SECURITY DEFINER and will still work
REVOKE SELECT ON MATERIALIZED VIEW public.glossary_stats_cache_uk FROM anon, authenticated;
REVOKE SELECT ON MATERIALIZED VIEW public.glossary_stats_cache_en FROM anon, authenticated;

-- Ensure service_role and postgres can still access for maintenance/refresh
GRANT SELECT ON MATERIALIZED VIEW public.glossary_stats_cache_uk TO service_role, postgres;
GRANT SELECT ON MATERIALIZED VIEW public.glossary_stats_cache_en TO service_role, postgres;

-- ============================================================================
-- Note: The following functions already have SECURITY DEFINER and will
-- continue to work because they run with elevated privileges:
--   - get_glossary_stats(text)
--   - get_glossary_term_by_name(text, text)
--   - get_glossary_terms_grouped()
--   - get_glossary_term_details()
-- ============================================================================
