-- Migration: Rename all _ua columns to _uk (ISO 639-1 standard)
-- This script renames all Ukrainian language columns from _ua suffix to _uk suffix
--
-- IMPORTANT NOTES:
-- 1. Run this in a transaction and verify before committing
-- 2. Make a backup before running this migration
-- 3. Views that reference these columns will automatically update (PostgreSQL handles this)
-- 4. Database functions that SELECT columns will continue to work
-- 5. After migration, verify with: SELECT column_name FROM information_schema.columns
--    WHERE table_schema = 'public' AND column_name LIKE '%_ua' ORDER BY table_name, column_name;
--
-- AFFECTED VIEWS (will auto-update):
-- - blog_posts_public
-- - book_pages_with_metadata
-- - books_with_mapping
-- - mv_blog_recent_published
-- - readable_chapters
-- - tattva_stats
-- - verses_with_metadata
-- - verses_with_structure
-- - verses_with_synonyms
--
-- AFFECTED FUNCTIONS (may need review):
-- - get_calendar_events
-- - get_chapter_verses
-- - get_tattva_breadcrumb
-- - get_tattva_verses
-- - get_today_events
-- - create_blog_post
-- - get_book_by_vedabase_slug
-- - get_featured_quote_categories

BEGIN;

-- =====================================================
-- PART 1: RENAME COLUMNS
-- =====================================================

-- =====================================================
-- TABLE: appearance_days
-- =====================================================
ALTER TABLE public.appearance_days RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.appearance_days RENAME COLUMN observances_ua TO observances_uk;
ALTER TABLE public.appearance_days RENAME COLUMN person_name_ua TO person_name_uk;
ALTER TABLE public.appearance_days RENAME COLUMN person_title_ua TO person_title_uk;
ALTER TABLE public.appearance_days RENAME COLUMN short_description_ua TO short_description_uk;

-- =====================================================
-- TABLE: audio_categories
-- =====================================================
ALTER TABLE public.audio_categories RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.audio_categories RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: audio_playlists
-- =====================================================
ALTER TABLE public.audio_playlists RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.audio_playlists RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: audio_tracks
-- =====================================================
ALTER TABLE public.audio_tracks RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: blog_categories
-- =====================================================
ALTER TABLE public.blog_categories RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.blog_categories RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: blog_posts
-- =====================================================
ALTER TABLE public.blog_posts RENAME COLUMN audio_commentary_ua_url TO audio_commentary_uk_url;
ALTER TABLE public.blog_posts RENAME COLUMN audio_poetry_translation_ua_url TO audio_poetry_translation_uk_url;
ALTER TABLE public.blog_posts RENAME COLUMN audio_synonyms_ua_url TO audio_synonyms_uk_url;
ALTER TABLE public.blog_posts RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.blog_posts RENAME COLUMN excerpt_ua TO excerpt_uk;
ALTER TABLE public.blog_posts RENAME COLUMN meta_description_ua TO meta_description_uk;
ALTER TABLE public.blog_posts RENAME COLUMN poetry_translation_ua TO poetry_translation_uk;
ALTER TABLE public.blog_posts RENAME COLUMN search_vector_ua TO search_vector_uk;
ALTER TABLE public.blog_posts RENAME COLUMN synonyms_ua TO synonyms_uk;
ALTER TABLE public.blog_posts RENAME COLUMN title_ua TO title_uk;
ALTER TABLE public.blog_posts RENAME COLUMN translation_ua TO translation_uk;

-- =====================================================
-- TABLE: blog_tags
-- =====================================================
ALTER TABLE public.blog_tags RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: book_pages
-- =====================================================
ALTER TABLE public.book_pages RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.book_pages RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: books
-- =====================================================
ALTER TABLE public.books RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.books RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: calendar_events
-- =====================================================
ALTER TABLE public.calendar_events RENAME COLUMN custom_description_ua TO custom_description_uk;
ALTER TABLE public.calendar_events RENAME COLUMN custom_name_ua TO custom_name_uk;

-- =====================================================
-- TABLE: calendar_locations
-- =====================================================
ALTER TABLE public.calendar_locations RENAME COLUMN city_ua TO city_uk;
ALTER TABLE public.calendar_locations RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: cantos
-- =====================================================
ALTER TABLE public.cantos RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.cantos RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: chapters
-- =====================================================
ALTER TABLE public.chapters RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.chapters RENAME COLUMN summary_ua TO summary_uk;
ALTER TABLE public.chapters RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: chapters_archive
-- =====================================================
ALTER TABLE public.chapters_archive RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.chapters_archive RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: chapters_backup_20251014 (backup table)
-- =====================================================
ALTER TABLE public.chapters_backup_20251014 RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.chapters_backup_20251014 RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: chat_messages
-- =====================================================
ALTER TABLE public.chat_messages RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.chat_messages RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: content_tattvas
-- =====================================================
ALTER TABLE public.content_tattvas RENAME COLUMN content_ua TO content_uk;

-- =====================================================
-- TABLE: daily_quotes
-- =====================================================
ALTER TABLE public.daily_quotes RENAME COLUMN author_ua TO author_uk;
ALTER TABLE public.daily_quotes RENAME COLUMN quote_ua TO quote_uk;
ALTER TABLE public.daily_quotes RENAME COLUMN source_ua TO source_uk;

-- =====================================================
-- TABLE: ekadashi_info
-- =====================================================
ALTER TABLE public.ekadashi_info RENAME COLUMN benefits_ua TO benefits_uk;
ALTER TABLE public.ekadashi_info RENAME COLUMN fasting_rules_ua TO fasting_rules_uk;
ALTER TABLE public.ekadashi_info RENAME COLUMN glory_text_ua TO glory_text_uk;
ALTER TABLE public.ekadashi_info RENAME COLUMN glory_title_ua TO glory_title_uk;
ALTER TABLE public.ekadashi_info RENAME COLUMN name_ua TO name_uk;
ALTER TABLE public.ekadashi_info RENAME COLUMN prabhupada_instructions_ua TO prabhupada_instructions_uk;
ALTER TABLE public.ekadashi_info RENAME COLUMN presiding_deity_ua TO presiding_deity_uk;
ALTER TABLE public.ekadashi_info RENAME COLUMN recommended_activities_ua TO recommended_activities_uk;
ALTER TABLE public.ekadashi_info RENAME COLUMN story_ua TO story_uk;

-- =====================================================
-- TABLE: festival_categories
-- =====================================================
ALTER TABLE public.festival_categories RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.festival_categories RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: gv_authors
-- =====================================================
ALTER TABLE public.gv_authors RENAME COLUMN biography_ua TO biography_uk;
ALTER TABLE public.gv_authors RENAME COLUMN name_ua TO name_uk;
ALTER TABLE public.gv_authors RENAME COLUMN significance_ua TO significance_uk;
ALTER TABLE public.gv_authors RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: gv_book_catalogues
-- =====================================================
ALTER TABLE public.gv_book_catalogues RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.gv_book_catalogues RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: gv_book_references
-- =====================================================
ALTER TABLE public.gv_book_references RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.gv_book_references RENAME COLUMN significance_ua TO significance_uk;
ALTER TABLE public.gv_book_references RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: gv_catalogue_books
-- =====================================================
ALTER TABLE public.gv_catalogue_books RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.gv_catalogue_books RENAME COLUMN significance_ua TO significance_uk;
ALTER TABLE public.gv_catalogue_books RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: intro_chapters
-- =====================================================
ALTER TABLE public.intro_chapters RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.intro_chapters RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: lecture_paragraphs
-- =====================================================
ALTER TABLE public.lecture_paragraphs RENAME COLUMN content_ua TO content_uk;

-- =====================================================
-- TABLE: lectures
-- =====================================================
ALTER TABLE public.lectures RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.lectures RENAME COLUMN location_ua TO location_uk;
ALTER TABLE public.lectures RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: letters
-- =====================================================
ALTER TABLE public.letters RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.letters RENAME COLUMN location_ua TO location_uk;
ALTER TABLE public.letters RENAME COLUMN recipient_ua TO recipient_uk;

-- =====================================================
-- TABLE: pages
-- =====================================================
ALTER TABLE public.pages RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.pages RENAME COLUMN meta_description_ua TO meta_description_uk;
ALTER TABLE public.pages RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: prabhupada_events
-- =====================================================
ALTER TABLE public.prabhupada_events RENAME COLUMN content_preview_ua TO content_preview_uk;
ALTER TABLE public.prabhupada_events RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.prabhupada_events RENAME COLUMN location_ua TO location_uk;
ALTER TABLE public.prabhupada_events RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: quote_categories
-- =====================================================
ALTER TABLE public.quote_categories RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.quote_categories RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: quote_pages
-- =====================================================
ALTER TABLE public.quote_pages RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: quotes
-- =====================================================
ALTER TABLE public.quotes RENAME COLUMN text_ua TO text_uk;

-- =====================================================
-- TABLE: sanskrit_lexicon (glossary)
-- =====================================================
ALTER TABLE public.sanskrit_lexicon RENAME COLUMN content_ua TO content_uk;
ALTER TABLE public.sanskrit_lexicon RENAME COLUMN excerpt_ua TO excerpt_uk;
ALTER TABLE public.sanskrit_lexicon RENAME COLUMN meta_description_ua TO meta_description_uk;
ALTER TABLE public.sanskrit_lexicon RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: static_page_metadata
-- =====================================================
ALTER TABLE public.static_page_metadata RENAME COLUMN meta_description_ua TO meta_description_uk;
ALTER TABLE public.static_page_metadata RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: tattvas
-- =====================================================
ALTER TABLE public.tattvas RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.tattvas RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: tithi_types
-- =====================================================
ALTER TABLE public.tithi_types RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: vaishnava_festivals
-- =====================================================
ALTER TABLE public.vaishnava_festivals RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.vaishnava_festivals RENAME COLUMN name_ua TO name_uk;
ALTER TABLE public.vaishnava_festivals RENAME COLUMN observances_ua TO observances_uk;
ALTER TABLE public.vaishnava_festivals RENAME COLUMN short_description_ua TO short_description_uk;
ALTER TABLE public.vaishnava_festivals RENAME COLUMN significance_ua TO significance_uk;

-- =====================================================
-- TABLE: vaishnava_months
-- =====================================================
ALTER TABLE public.vaishnava_months RENAME COLUMN description_ua TO description_uk;
ALTER TABLE public.vaishnava_months RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: verses
-- =====================================================
ALTER TABLE public.verses RENAME COLUMN commentary_ua TO commentary_uk;
ALTER TABLE public.verses RENAME COLUMN explanation_ua_audio_url TO explanation_uk_audio_url;
ALTER TABLE public.verses RENAME COLUMN sanskrit_ua TO sanskrit_uk;
ALTER TABLE public.verses RENAME COLUMN search_vector_ua TO search_vector_uk;
ALTER TABLE public.verses RENAME COLUMN synonyms_ua TO synonyms_uk;
ALTER TABLE public.verses RENAME COLUMN translation_ua TO translation_uk;
ALTER TABLE public.verses RENAME COLUMN transliteration_ua TO transliteration_uk;

-- =====================================================
-- TABLE: verses_archive
-- =====================================================
ALTER TABLE public.verses_archive RENAME COLUMN commentary_ua TO commentary_uk;
ALTER TABLE public.verses_archive RENAME COLUMN synonyms_ua TO synonyms_uk;
ALTER TABLE public.verses_archive RENAME COLUMN translation_ua TO translation_uk;

-- =====================================================
-- TABLE: verses_backup_20251014 (backup table)
-- =====================================================
ALTER TABLE public.verses_backup_20251014 RENAME COLUMN commentary_ua TO commentary_uk;
ALTER TABLE public.verses_backup_20251014 RENAME COLUMN synonyms_ua TO synonyms_uk;
ALTER TABLE public.verses_backup_20251014 RENAME COLUMN translation_ua TO translation_uk;

-- =====================================================
-- TABLE: verses_backup_danda_fix
-- =====================================================
ALTER TABLE public.verses_backup_danda_fix RENAME COLUMN orig_sanskrit_ua TO orig_sanskrit_uk;

-- =====================================================
-- TABLE: verse_lyrics
-- =====================================================
ALTER TABLE public.verse_lyrics RENAME COLUMN orig_sanskrit_ua TO orig_sanskrit_uk;

COMMIT;

-- =====================================================
-- PART 2: RENAME INDEXES (run separately, outside transaction)
-- These use CONCURRENTLY which cannot run inside a transaction
-- =====================================================

-- Create new indexes with _uk suffix
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

-- glossary_stats_cache indexes (if they exist)
DROP INDEX CONCURRENTLY IF EXISTS public.idx_glossary_stats_cache_ua_book;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_glossary_stats_cache_ua_term;
DROP INDEX CONCURRENTLY IF EXISTS public.idx_glossary_stats_cache_ua_unique;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these after the migration to verify:
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
