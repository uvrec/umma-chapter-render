-- Migration: Rename all _ua columns to _uk (ISO 639-1 standard)
-- SAFE VERSION with IF EXISTS checks
--
-- This script renames all Ukrainian language columns from _ua suffix to _uk suffix
-- It uses DO blocks to safely skip columns that don't exist
--
-- IMPORTANT NOTES:
-- 1. Run this in a transaction and verify before committing
-- 2. Make a backup before running this migration
-- 3. Views that reference these columns will automatically update
-- 4. After migration, regenerate TypeScript types:
--    npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts

BEGIN;

-- =====================================================
-- HELPER FUNCTION: Safe column rename
-- =====================================================
CREATE OR REPLACE FUNCTION safe_rename_column(
  p_table_name TEXT,
  p_old_column TEXT,
  p_new_column TEXT
) RETURNS VOID AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = p_table_name
      AND column_name = p_old_column
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = p_table_name
      AND column_name = p_new_column
  ) THEN
    EXECUTE format('ALTER TABLE public.%I RENAME COLUMN %I TO %I',
                   p_table_name, p_old_column, p_new_column);
    RAISE NOTICE 'Renamed %.% to %', p_table_name, p_old_column, p_new_column;
  ELSE
    RAISE NOTICE 'Skipped %.% (column does not exist or target exists)', p_table_name, p_old_column;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 1: RENAME COLUMNS (using safe function)
-- =====================================================

DO $$
BEGIN
  -- appearance_days
  PERFORM safe_rename_column('appearance_days', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('appearance_days', 'observances_ua', 'observances_uk');
  PERFORM safe_rename_column('appearance_days', 'person_name_ua', 'person_name_uk');
  PERFORM safe_rename_column('appearance_days', 'person_title_ua', 'person_title_uk');
  PERFORM safe_rename_column('appearance_days', 'short_description_ua', 'short_description_uk');

  -- audio_categories
  PERFORM safe_rename_column('audio_categories', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('audio_categories', 'name_ua', 'name_uk');

  -- audio_playlists
  PERFORM safe_rename_column('audio_playlists', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('audio_playlists', 'title_ua', 'title_uk');

  -- audio_tracks
  PERFORM safe_rename_column('audio_tracks', 'title_ua', 'title_uk');

  -- blog_categories
  PERFORM safe_rename_column('blog_categories', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('blog_categories', 'name_ua', 'name_uk');

  -- blog_posts
  PERFORM safe_rename_column('blog_posts', 'audio_commentary_ua_url', 'audio_commentary_uk_url');
  PERFORM safe_rename_column('blog_posts', 'audio_poetry_translation_ua_url', 'audio_poetry_translation_uk_url');
  PERFORM safe_rename_column('blog_posts', 'audio_synonyms_ua_url', 'audio_synonyms_uk_url');
  PERFORM safe_rename_column('blog_posts', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('blog_posts', 'excerpt_ua', 'excerpt_uk');
  PERFORM safe_rename_column('blog_posts', 'meta_description_ua', 'meta_description_uk');
  PERFORM safe_rename_column('blog_posts', 'poetry_translation_ua', 'poetry_translation_uk');
  PERFORM safe_rename_column('blog_posts', 'search_vector_ua', 'search_vector_uk');
  PERFORM safe_rename_column('blog_posts', 'synonyms_ua', 'synonyms_uk');
  PERFORM safe_rename_column('blog_posts', 'title_ua', 'title_uk');
  PERFORM safe_rename_column('blog_posts', 'translation_ua', 'translation_uk');

  -- blog_tags
  PERFORM safe_rename_column('blog_tags', 'name_ua', 'name_uk');

  -- book_pages
  PERFORM safe_rename_column('book_pages', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('book_pages', 'title_ua', 'title_uk');

  -- books
  PERFORM safe_rename_column('books', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('books', 'title_ua', 'title_uk');

  -- calendar_events
  PERFORM safe_rename_column('calendar_events', 'custom_description_ua', 'custom_description_uk');
  PERFORM safe_rename_column('calendar_events', 'custom_name_ua', 'custom_name_uk');

  -- calendar_locations
  PERFORM safe_rename_column('calendar_locations', 'city_ua', 'city_uk');
  PERFORM safe_rename_column('calendar_locations', 'name_ua', 'name_uk');

  -- cantos
  PERFORM safe_rename_column('cantos', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('cantos', 'title_ua', 'title_uk');

  -- chapters
  PERFORM safe_rename_column('chapters', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('chapters', 'summary_ua', 'summary_uk');
  PERFORM safe_rename_column('chapters', 'title_ua', 'title_uk');

  -- chapters_archive
  PERFORM safe_rename_column('chapters_archive', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('chapters_archive', 'title_ua', 'title_uk');

  -- chapters_backup_20251014 (backup table - may not exist)
  PERFORM safe_rename_column('chapters_backup_20251014', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('chapters_backup_20251014', 'title_ua', 'title_uk');

  -- chat_messages
  PERFORM safe_rename_column('chat_messages', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('chat_messages', 'title_ua', 'title_uk');

  -- content_tattvas
  PERFORM safe_rename_column('content_tattvas', 'content_ua', 'content_uk');

  -- daily_quotes
  PERFORM safe_rename_column('daily_quotes', 'author_ua', 'author_uk');
  PERFORM safe_rename_column('daily_quotes', 'quote_ua', 'quote_uk');
  PERFORM safe_rename_column('daily_quotes', 'source_ua', 'source_uk');

  -- ekadashi_info
  PERFORM safe_rename_column('ekadashi_info', 'benefits_ua', 'benefits_uk');
  PERFORM safe_rename_column('ekadashi_info', 'fasting_rules_ua', 'fasting_rules_uk');
  PERFORM safe_rename_column('ekadashi_info', 'glory_text_ua', 'glory_text_uk');
  PERFORM safe_rename_column('ekadashi_info', 'glory_title_ua', 'glory_title_uk');
  PERFORM safe_rename_column('ekadashi_info', 'name_ua', 'name_uk');
  PERFORM safe_rename_column('ekadashi_info', 'prabhupada_instructions_ua', 'prabhupada_instructions_uk');
  PERFORM safe_rename_column('ekadashi_info', 'presiding_deity_ua', 'presiding_deity_uk');
  PERFORM safe_rename_column('ekadashi_info', 'recommended_activities_ua', 'recommended_activities_uk');
  PERFORM safe_rename_column('ekadashi_info', 'story_ua', 'story_uk');

  -- festival_categories
  PERFORM safe_rename_column('festival_categories', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('festival_categories', 'name_ua', 'name_uk');

  -- gv_authors
  PERFORM safe_rename_column('gv_authors', 'biography_ua', 'biography_uk');
  PERFORM safe_rename_column('gv_authors', 'name_ua', 'name_uk');
  PERFORM safe_rename_column('gv_authors', 'significance_ua', 'significance_uk');
  PERFORM safe_rename_column('gv_authors', 'title_ua', 'title_uk');

  -- gv_book_catalogues
  PERFORM safe_rename_column('gv_book_catalogues', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('gv_book_catalogues', 'name_ua', 'name_uk');

  -- gv_book_references
  PERFORM safe_rename_column('gv_book_references', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('gv_book_references', 'significance_ua', 'significance_uk');
  PERFORM safe_rename_column('gv_book_references', 'title_ua', 'title_uk');

  -- gv_catalogue_books
  PERFORM safe_rename_column('gv_catalogue_books', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('gv_catalogue_books', 'significance_ua', 'significance_uk');
  PERFORM safe_rename_column('gv_catalogue_books', 'title_ua', 'title_uk');

  -- intro_chapters
  PERFORM safe_rename_column('intro_chapters', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('intro_chapters', 'title_ua', 'title_uk');

  -- lecture_paragraphs
  PERFORM safe_rename_column('lecture_paragraphs', 'content_ua', 'content_uk');

  -- lectures
  PERFORM safe_rename_column('lectures', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('lectures', 'location_ua', 'location_uk');
  PERFORM safe_rename_column('lectures', 'title_ua', 'title_uk');

  -- letters
  PERFORM safe_rename_column('letters', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('letters', 'location_ua', 'location_uk');
  PERFORM safe_rename_column('letters', 'recipient_ua', 'recipient_uk');

  -- pages
  PERFORM safe_rename_column('pages', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('pages', 'meta_description_ua', 'meta_description_uk');
  PERFORM safe_rename_column('pages', 'title_ua', 'title_uk');

  -- prabhupada_events
  PERFORM safe_rename_column('prabhupada_events', 'content_preview_ua', 'content_preview_uk');
  PERFORM safe_rename_column('prabhupada_events', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('prabhupada_events', 'location_ua', 'location_uk');
  PERFORM safe_rename_column('prabhupada_events', 'title_ua', 'title_uk');

  -- quote_categories
  PERFORM safe_rename_column('quote_categories', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('quote_categories', 'title_ua', 'title_uk');

  -- quote_pages
  PERFORM safe_rename_column('quote_pages', 'title_ua', 'title_uk');

  -- quotes
  PERFORM safe_rename_column('quotes', 'text_ua', 'text_uk');

  -- sanskrit_lexicon
  PERFORM safe_rename_column('sanskrit_lexicon', 'content_ua', 'content_uk');
  PERFORM safe_rename_column('sanskrit_lexicon', 'excerpt_ua', 'excerpt_uk');
  PERFORM safe_rename_column('sanskrit_lexicon', 'meta_description_ua', 'meta_description_uk');
  PERFORM safe_rename_column('sanskrit_lexicon', 'title_ua', 'title_uk');

  -- static_page_metadata
  PERFORM safe_rename_column('static_page_metadata', 'meta_description_ua', 'meta_description_uk');
  PERFORM safe_rename_column('static_page_metadata', 'title_ua', 'title_uk');

  -- tattvas
  PERFORM safe_rename_column('tattvas', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('tattvas', 'name_ua', 'name_uk');

  -- tithi_types
  PERFORM safe_rename_column('tithi_types', 'name_ua', 'name_uk');

  -- vaishnava_festivals
  PERFORM safe_rename_column('vaishnava_festivals', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('vaishnava_festivals', 'name_ua', 'name_uk');
  PERFORM safe_rename_column('vaishnava_festivals', 'observances_ua', 'observances_uk');
  PERFORM safe_rename_column('vaishnava_festivals', 'short_description_ua', 'short_description_uk');
  PERFORM safe_rename_column('vaishnava_festivals', 'significance_ua', 'significance_uk');

  -- vaishnava_months
  PERFORM safe_rename_column('vaishnava_months', 'description_ua', 'description_uk');
  PERFORM safe_rename_column('vaishnava_months', 'name_ua', 'name_uk');

  -- verses
  PERFORM safe_rename_column('verses', 'commentary_ua', 'commentary_uk');
  PERFORM safe_rename_column('verses', 'explanation_ua_audio_url', 'explanation_uk_audio_url');
  PERFORM safe_rename_column('verses', 'sanskrit_ua', 'sanskrit_uk');
  PERFORM safe_rename_column('verses', 'search_vector_ua', 'search_vector_uk');
  PERFORM safe_rename_column('verses', 'synonyms_ua', 'synonyms_uk');
  PERFORM safe_rename_column('verses', 'translation_ua', 'translation_uk');
  PERFORM safe_rename_column('verses', 'transliteration_ua', 'transliteration_uk');

  -- verses_archive
  PERFORM safe_rename_column('verses_archive', 'commentary_ua', 'commentary_uk');
  PERFORM safe_rename_column('verses_archive', 'synonyms_ua', 'synonyms_uk');
  PERFORM safe_rename_column('verses_archive', 'translation_ua', 'translation_uk');

  -- verses_backup_20251014 (backup table - may not exist)
  PERFORM safe_rename_column('verses_backup_20251014', 'commentary_ua', 'commentary_uk');
  PERFORM safe_rename_column('verses_backup_20251014', 'synonyms_ua', 'synonyms_uk');
  PERFORM safe_rename_column('verses_backup_20251014', 'translation_ua', 'translation_uk');

  -- verses_backup_danda_fix (backup table - may not exist)
  PERFORM safe_rename_column('verses_backup_danda_fix', 'orig_sanskrit_ua', 'orig_sanskrit_uk');

  -- verse_lyrics
  PERFORM safe_rename_column('verse_lyrics', 'orig_sanskrit_ua', 'orig_sanskrit_uk');

  RAISE NOTICE 'Column renaming completed!';
END $$;

-- Clean up helper function
DROP FUNCTION IF EXISTS safe_rename_column(TEXT, TEXT, TEXT);

COMMIT;

-- =====================================================
-- PART 2: RENAME INDEXES (run separately, outside transaction)
-- These use CONCURRENTLY which cannot run inside a transaction
-- =====================================================

-- Create new indexes with _uk suffix (if columns exist)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_search_vector_uk
  ON public.blog_posts USING GIN (search_vector_uk);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_search_vector_uk
  ON public.verses USING GIN (search_vector_uk);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_synonyms_uk_gin
  ON public.verses USING GIN (to_tsvector('simple', COALESCE(synonyms_uk, '')));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_synonyms_uk_pattern
  ON public.verses (synonyms_uk text_pattern_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_translation_uk_not_null
  ON public.verses ((translation_uk IS NOT NULL));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_verses_transliteration_uk
  ON public.verses (transliteration_uk);

-- Drop old indexes with _ua suffix
DROP INDEX CONCURRENTLY IF EXISTS public.idx_blog_posts_search_vector_ua;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_verses_search_vector_ua;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_verses_synonyms_ua_gin;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_verses_synonyms_ua_pattern;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_verses_translation_ua_not_null;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_verses_transliteration_ua;

-- glossary_stats_cache indexes
DROP INDEX CONCURRENTLY IF EXISTS public.idx_glossary_stats_cache_ua_book;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_glossary_stats_cache_ua_term;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_glossary_stats_cache_ua_unique;

-- =====================================================
-- VERIFICATION QUERIES (run after migration)
-- =====================================================
--
-- Check for remaining _ua columns:
-- SELECT table_name, column_name FROM information_schema.columns
-- WHERE table_schema = 'public' AND column_name LIKE '%_ua%'
-- ORDER BY table_name, column_name;
--
-- Check for remaining _ua indexes:
-- SELECT indexname FROM pg_indexes
-- WHERE schemaname = 'public' AND indexname LIKE '%_ua%';
--
-- Both should return no rows if all renames were successful
--
-- =====================================================
-- After migration, regenerate TypeScript types:
-- npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
-- =====================================================
