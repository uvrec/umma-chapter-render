-- ============================================================================
-- Cleanup: Remove duplicate unified_search and add trigram indexes
-- ============================================================================
-- 1. Remove the basic 4-param unified_search (keep advanced 5-param version)
-- 2. Add pg_trgm indexes for ILIKE fallback performance
-- ============================================================================

-- ============================================================================
-- 1. DROP DUPLICATE unified_search SIGNATURES
-- ============================================================================
-- The 4-param version conflicts with the 5-param advanced version
-- when called with default arguments, causing ERROR 42725 (ambiguous function)

-- Drop the basic 4-param version (returns result_id as TEXT)
DROP FUNCTION IF EXISTS public.unified_search(TEXT, TEXT, TEXT[], INTEGER);

-- Keep the advanced 5-param version from Part 3 (returns result_id as UUID)
-- It has: phrase search, wildcard, proximity support via parse_advanced_query

-- ============================================================================
-- 2. ENSURE pg_trgm EXTENSION IS ENABLED
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- 3. ADD TRIGRAM INDEXES FOR ILIKE FALLBACK PERFORMANCE
-- ============================================================================
-- These indexes speed up ILIKE '%pattern%' queries used when:
-- - Complex wildcard patterns (e.g., *word* or te?t)
-- - Short queries (< 3 chars)
-- - Proximity search fallback

-- Verses: translation fields (most commonly searched)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_translation_uk_trgm
  ON public.verses USING GIN (translation_uk gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_translation_en_trgm
  ON public.verses USING GIN (translation_en gin_trgm_ops);

-- Verses: commentary fields (secondary search target)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_commentary_uk_trgm
  ON public.verses USING GIN (commentary_uk gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_commentary_en_trgm
  ON public.verses USING GIN (commentary_en gin_trgm_ops);

-- Verses: synonyms fields
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_synonyms_uk_trgm
  ON public.verses USING GIN (synonyms_uk gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_synonyms_en_trgm
  ON public.verses USING GIN (synonyms_en gin_trgm_ops);

-- Blog posts: title and content
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_title_uk_trgm
  ON public.blog_posts USING GIN (title_uk gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_title_en_trgm
  ON public.blog_posts USING GIN (title_en gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_content_uk_trgm
  ON public.blog_posts USING GIN (content_uk gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_content_en_trgm
  ON public.blog_posts USING GIN (content_en gin_trgm_ops);

-- ============================================================================
-- 4. GRANT EXECUTE ON REMAINING unified_search
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.unified_search(text, text, text[], integer, integer) TO anon, authenticated;

-- ============================================================================
-- SUMMARY:
-- - Removed: unified_search(TEXT, TEXT, TEXT[], INTEGER) - basic 4-param
-- - Kept: unified_search(text, text, text[], integer, integer) - advanced 5-param
-- - Added trigram indexes for ILIKE performance on:
--   * verses: translation_uk/en, commentary_uk/en, synonyms_uk/en
--   * blog_posts: title_uk/en, content_uk/en
-- ============================================================================
