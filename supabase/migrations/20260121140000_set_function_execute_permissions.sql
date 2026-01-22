-- ============================================================================
-- Security: Set explicit EXECUTE permissions for search functions
-- ============================================================================
-- Allow-list approach: only grant to roles that need access
-- ============================================================================

-- ============================================================================
-- 1. PUBLIC SEARCH FUNCTIONS (anon + authenticated)
-- These are core search functions needed for public site functionality
-- ============================================================================

-- Unified search (5-param advanced version)
GRANT EXECUTE ON FUNCTION public.unified_search(text, text, text[], integer, integer) TO anon, authenticated;

-- Verse search (both signatures)
DO $$
BEGIN
  -- Basic 7-param version
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    WHERE p.proname = 'search_verses_fulltext'
    AND pg_get_function_identity_arguments(p.oid) LIKE 'text, text, text, integer%'
  ) THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.search_verses_fulltext(text, text, text, integer, integer, integer, integer) TO anon, authenticated';
  END IF;

  -- Advanced 9-param version
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    WHERE p.proname = 'search_verses_fulltext'
    AND pg_get_function_identity_arguments(p.oid) LIKE 'text, text, boolean%'
  ) THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.search_verses_fulltext(text, text, boolean, boolean, boolean, boolean, boolean, uuid[], integer) TO anon, authenticated';
  END IF;
END $$;

-- Glossary search
GRANT EXECUTE ON FUNCTION public.search_glossary_terms(text, text, integer, integer) TO anon, authenticated;

-- Synonyms search
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_synonyms') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.search_synonyms TO anon, authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_synonyms_with_canto') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.search_synonyms_with_canto TO anon, authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_synonyms_for_term') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_synonyms_for_term TO anon, authenticated';
  END IF;
END $$;

-- Similar glossary search
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_glossary_similar') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.search_glossary_similar TO anon, authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_glossary_by_translation') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.search_glossary_by_translation TO anon, authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_suggest_terms') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.search_suggest_terms TO anon, authenticated';
  END IF;
END $$;

-- Glossary grouped/details (for GlossaryDB page)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_glossary_terms_grouped') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_glossary_terms_grouped TO anon, authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_glossary_term_details') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_glossary_term_details TO anon, authenticated';
  END IF;
END $$;

-- ============================================================================
-- 2. AUTHENTICATED-ONLY FUNCTIONS
-- These require user to be logged in
-- ============================================================================

-- Glossary stats (authenticated only)
REVOKE EXECUTE ON FUNCTION public.get_glossary_stats(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_glossary_stats(text) TO authenticated;

-- Glossary term by name (authenticated only)
REVOKE EXECUTE ON FUNCTION public.get_glossary_term_by_name(text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_glossary_term_by_name(text, text) TO authenticated;

-- Blog search (authenticated only)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_blog_posts') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.search_blog_posts FROM anon';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.search_blog_posts TO authenticated';
  END IF;
END $$;

-- Vaishnava calendar (authenticated only)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_vaishnava_calendar_events') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.get_vaishnava_calendar_events FROM anon';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.get_vaishnava_calendar_events TO authenticated';
  END IF;
END $$;

-- ============================================================================
-- 3. HELPER FUNCTION (public - needed for language normalization)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'normalize_language_code') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.normalize_language_code(text) TO anon, authenticated';
  END IF;
END $$;

-- ============================================================================
-- SUMMARY:
--
-- PUBLIC (anon + authenticated):
-- - unified_search
-- - search_verses_fulltext (all versions)
-- - search_glossary_terms
-- - search_synonyms, search_synonyms_with_canto, get_synonyms_for_term
-- - search_glossary_similar, search_glossary_by_translation, search_suggest_terms
-- - get_glossary_terms_grouped, get_glossary_term_details
-- - normalize_language_code
--
-- AUTHENTICATED ONLY:
-- - get_glossary_stats
-- - get_glossary_term_by_name
-- - search_blog_posts
-- - get_vaishnava_calendar_events
-- ============================================================================
