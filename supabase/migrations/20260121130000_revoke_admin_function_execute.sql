-- ============================================================================
-- Security Hardening: Revoke EXECUTE on admin/utility functions
-- ============================================================================
-- These SECURITY DEFINER functions should NOT be callable from client.
-- Only service_role (Edge Functions/server) should have access.
-- ============================================================================

-- ============================================================================
-- 1. ADMIN/UTILITY FUNCTIONS - text normalization, cleanup, migrations
-- ============================================================================

-- Text normalization utilities (admin-only)
REVOKE EXECUTE ON FUNCTION public.normalize_ukrainian_cc_texts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.normalize_ukrainian_cc_texts() TO service_role;

-- Duplicate word removal (data cleanup)
REVOKE EXECUTE ON FUNCTION public.remove_duplicate_words_in_synonyms() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.remove_duplicate_words_in_synonyms() TO service_role;

-- HTML encoding finders/fixers (admin utilities)
REVOKE EXECUTE ON FUNCTION public.find_html_encoding_remnants() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.find_html_encoding_remnants() TO service_role;

REVOKE EXECUTE ON FUNCTION public.fix_html_encoding_remnants() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fix_html_encoding_remnants() TO service_role;

-- Chapter ordering (admin utility)
REVOKE EXECUTE ON FUNCTION public.update_intro_chapters_order() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_intro_chapters_order() TO service_role;

-- ============================================================================
-- 2. CACHE/MATERIALIZED VIEW REFRESH - should be called by cron/service
-- ============================================================================

REVOKE EXECUTE ON FUNCTION public.refresh_glossary_cache() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_glossary_cache() TO service_role;

-- ============================================================================
-- 3. KNOWLEDGE COMPILERS - aggregate lots of content, bypass RLS
-- ============================================================================

-- These compile knowledge from multiple sources - admin/AI only
DO $$
BEGIN
  -- compile_verse_knowledge may have different signatures
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'compile_verse_knowledge') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.compile_verse_knowledge FROM PUBLIC, anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.compile_verse_knowledge TO service_role';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'compile_chapter_knowledge') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.compile_chapter_knowledge FROM PUBLIC, anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.compile_chapter_knowledge TO service_role';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'compile_canto_knowledge') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.compile_canto_knowledge FROM PUBLIC, anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.compile_canto_knowledge TO service_role';
  END IF;
END $$;

-- ============================================================================
-- 4. DEBUG/INTERNAL FUNCTIONS
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'debug_set_verse_display_blocks') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.debug_set_verse_display_blocks FROM PUBLIC, anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.debug_set_verse_display_blocks TO service_role';
  END IF;
END $$;

-- ============================================================================
-- 5. STORAGE TRIGGER HELPERS - called by triggers, not clients
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'delete_book_cover_from_storage') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.delete_book_cover_from_storage() FROM PUBLIC, anon, authenticated';
    -- Note: Trigger functions don't need explicit GRANT - they run as definer
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'delete_audio_playlist_cover_from_storage') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.delete_audio_playlist_cover_from_storage() FROM PUBLIC, anon, authenticated';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_blog_post_author') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.set_blog_post_author() FROM PUBLIC, anon, authenticated';
  END IF;
END $$;

-- ============================================================================
-- SUMMARY:
-- Revoked client access (anon, authenticated) from:
-- - normalize_ukrainian_cc_texts (admin)
-- - remove_duplicate_words_in_synonyms (admin)
-- - find_html_encoding_remnants (admin)
-- - fix_html_encoding_remnants (admin)
-- - update_intro_chapters_order (admin)
-- - refresh_glossary_cache (cron/service)
-- - compile_*_knowledge (AI/service)
-- - debug_set_verse_display_blocks (debug)
-- - delete_*_cover_from_storage (trigger)
-- - set_blog_post_author (trigger)
--
-- These functions can now only be called via service_role (Edge Functions).
-- ============================================================================
