-- ============================================================================
-- SECURITY FIX: Add SET search_path and GRANT EXECUTE to functions
-- ============================================================================
-- This migration fixes security issues identified in audit:
-- 1. SECURITY DEFINER functions without SET search_path (search_path hijacking risk)
-- 2. Missing GRANT EXECUTE for RPC-callable functions
-- ============================================================================

-- ============================================================================
-- PART 1: GRANT EXECUTE for PUBLIC functions (anon + authenticated)
-- ============================================================================

-- Search functions
GRANT EXECUTE ON FUNCTION public.search_verses_fulltext(text, text, boolean, boolean, boolean, boolean, boolean, uuid[], integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.unified_search(text, text, text[], integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_suggest_terms(text, text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_topic_statistics(text, text) TO anon, authenticated;

-- Tattvas functions
GRANT EXECUTE ON FUNCTION public.search_tattvas(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_tattva_verses(text, integer, integer, boolean) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_verse_tattvas(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_tattva_breadcrumb(text) TO anon, authenticated;

-- Synonyms functions
GRANT EXECUTE ON FUNCTION public.search_synonyms(text, text, text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_unique_synonym_terms(text, text, integer) TO anon, authenticated;

-- Sanskrit lexicon functions
GRANT EXECUTE ON FUNCTION public.search_sanskrit_lexicon(text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_sanskrit_by_meaning(text, integer) TO anon, authenticated;

-- Blog functions
GRANT EXECUTE ON FUNCTION public.increment_blog_post_views(uuid) TO anon, authenticated;

-- Glossary functions
GRANT EXECUTE ON FUNCTION public.get_glossary_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_glossary_terms_grouped(text, text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_glossary_term_details(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_glossary_term_by_name(text, text) TO anon, authenticated;

-- Lectures
GRANT EXECUTE ON FUNCTION public.get_verse_lectures(uuid) TO anon, authenticated;

-- ============================================================================
-- PART 2: GRANT EXECUTE for AUTHENTICATED-ONLY functions
-- ============================================================================

-- Sadhana functions
GRANT EXECUTE ON FUNCTION public.upsert_sadhana_daily(date, boolean, boolean, integer, integer, integer, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_sadhana_streak(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_sadhana_monthly_stats(uuid, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_sadhana_users(integer) TO authenticated;

-- Reading session functions
GRANT EXECUTE ON FUNCTION public.end_reading_session(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_reading_stats(uuid) TO authenticated;

-- Calendar functions
GRANT EXECUTE ON FUNCTION public.get_calendar_events(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_today_events(date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_calendar_settings(uuid) TO authenticated;

-- Learning functions
GRANT EXECUTE ON FUNCTION public.upsert_learning_activity(uuid, text, text, integer) TO authenticated;

-- Admin check function
GRANT EXECUTE ON FUNCTION public.has_role(text) TO authenticated;

-- ============================================================================
-- PART 3: Admin functions (authenticated, protected by has_role in code)
-- ============================================================================
GRANT EXECUTE ON FUNCTION public.normalize_ukrainian_cc_texts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_duplicate_words_in_synonyms() TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_html_encoding_remnants() TO authenticated;
GRANT EXECUTE ON FUNCTION public.fix_html_encoding_remnants() TO authenticated;

-- ============================================================================
-- PART 4: ALTER FUNCTION to add SET search_path for SECURITY DEFINER
-- ============================================================================
-- Note: ALTER FUNCTION ... SET search_path works for existing functions

-- Tattvas functions
ALTER FUNCTION public.get_tattva_breadcrumb(text) SET search_path = public;
ALTER FUNCTION public.get_tattva_verses(text, integer, integer, boolean) SET search_path = public;
ALTER FUNCTION public.get_verse_tattvas(uuid) SET search_path = public;
ALTER FUNCTION public.search_tattvas(text) SET search_path = public;

-- Synonyms functions
ALTER FUNCTION public.search_synonyms(text, text, text, integer, integer) SET search_path = public;
ALTER FUNCTION public.get_unique_synonym_terms(text, text, integer) SET search_path = public;

-- Glossary functions
ALTER FUNCTION public.get_glossary_term_by_name(text, text) SET search_path = public;
ALTER FUNCTION public.search_glossary_by_translation(text, text, integer, integer) SET search_path = public;
ALTER FUNCTION public.search_glossary_similar(text, text, real, integer) SET search_path = public;
ALTER FUNCTION public.search_glossary_terms(text, text, integer, integer) SET search_path = public;

-- Search functions
ALTER FUNCTION public.search_suggest_terms(text, text, integer) SET search_path = public;

-- Knowledge compiler functions
ALTER FUNCTION public.compile_canto_knowledge(text, integer, text) SET search_path = public;
ALTER FUNCTION public.compile_chapter_knowledge(text, integer, integer, text) SET search_path = public;
ALTER FUNCTION public.compile_verse_knowledge(uuid, text) SET search_path = public;

-- Blog function
ALTER FUNCTION public.increment_blog_post_views(uuid) SET search_path = public;

-- Admin/utility functions
ALTER FUNCTION public.debug_set_verse_display_blocks() SET search_path = public;
ALTER FUNCTION public.find_html_encoding_remnants() SET search_path = public;
ALTER FUNCTION public.fix_html_encoding_remnants() SET search_path = public;
ALTER FUNCTION public.normalize_ukrainian_cc_texts() SET search_path = public;
ALTER FUNCTION public.remove_duplicate_words_in_synonyms() SET search_path = public;
ALTER FUNCTION public.update_intro_chapters_order(jsonb) SET search_path = public;

-- ============================================================================
-- VERIFICATION QUERIES (run manually to verify)
-- ============================================================================
-- Check SECURITY DEFINER functions now have search_path:
-- SELECT proname, proconfig FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public' AND p.prosecdef = true;

-- Check grants:
-- SELECT routine_name, grantee, privilege_type
-- FROM information_schema.routine_privileges
-- WHERE routine_schema = 'public' AND grantee IN ('anon', 'authenticated');
