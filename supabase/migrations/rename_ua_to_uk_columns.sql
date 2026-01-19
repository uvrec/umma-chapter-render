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
-- TABLE: appearance_days
-- =====================================================
ALTER TABLE appearance_days
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE appearance_days
  RENAME COLUMN observances_ua TO observances_uk;
ALTER TABLE appearance_days
  RENAME COLUMN person_name_ua TO person_name_uk;
ALTER TABLE appearance_days
  RENAME COLUMN person_title_ua TO person_title_uk;
ALTER TABLE appearance_days
  RENAME COLUMN short_description_ua TO short_description_uk;

-- =====================================================
-- TABLE: audio_categories
-- =====================================================
ALTER TABLE audio_categories
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE audio_categories
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: audio_playlists
-- =====================================================
ALTER TABLE audio_playlists
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE audio_playlists
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: audio_tracks
-- =====================================================
ALTER TABLE audio_tracks
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: blog_categories
-- =====================================================
ALTER TABLE blog_categories
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE blog_categories
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: blog_posts
-- =====================================================
ALTER TABLE blog_posts
  RENAME COLUMN audio_commentary_ua_url TO audio_commentary_uk_url;
ALTER TABLE blog_posts
  RENAME COLUMN audio_poetry_translation_ua_url TO audio_poetry_translation_uk_url;
ALTER TABLE blog_posts
  RENAME COLUMN audio_synonyms_ua_url TO audio_synonyms_uk_url;
ALTER TABLE blog_posts
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE blog_posts
  RENAME COLUMN excerpt_ua TO excerpt_uk;
ALTER TABLE blog_posts
  RENAME COLUMN meta_description_ua TO meta_description_uk;
ALTER TABLE blog_posts
  RENAME COLUMN poetry_translation_ua TO poetry_translation_uk;
ALTER TABLE blog_posts
  RENAME COLUMN search_vector_ua TO search_vector_uk;
ALTER TABLE blog_posts
  RENAME COLUMN synonyms_ua TO synonyms_uk;
ALTER TABLE blog_posts
  RENAME COLUMN title_ua TO title_uk;
ALTER TABLE blog_posts
  RENAME COLUMN translation_ua TO translation_uk;

-- =====================================================
-- TABLE: blog_tags
-- =====================================================
ALTER TABLE blog_tags
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: book_pages
-- =====================================================
ALTER TABLE book_pages
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE book_pages
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: books
-- =====================================================
ALTER TABLE books
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE books
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: calendar_events
-- =====================================================
ALTER TABLE calendar_events
  RENAME COLUMN custom_description_ua TO custom_description_uk;
ALTER TABLE calendar_events
  RENAME COLUMN custom_name_ua TO custom_name_uk;

-- =====================================================
-- TABLE: calendar_locations
-- =====================================================
ALTER TABLE calendar_locations
  RENAME COLUMN city_ua TO city_uk;
ALTER TABLE calendar_locations
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: cantos
-- =====================================================
ALTER TABLE cantos
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE cantos
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: chapters
-- =====================================================
ALTER TABLE chapters
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE chapters
  RENAME COLUMN summary_ua TO summary_uk;
ALTER TABLE chapters
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: chapters_archive
-- =====================================================
ALTER TABLE chapters_archive
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE chapters_archive
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: chat_messages
-- =====================================================
ALTER TABLE chat_messages
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE chat_messages
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: content_tattvas
-- =====================================================
ALTER TABLE content_tattvas
  RENAME COLUMN content_ua TO content_uk;

-- =====================================================
-- TABLE: daily_quotes
-- =====================================================
ALTER TABLE daily_quotes
  RENAME COLUMN author_ua TO author_uk;
ALTER TABLE daily_quotes
  RENAME COLUMN quote_ua TO quote_uk;
ALTER TABLE daily_quotes
  RENAME COLUMN source_ua TO source_uk;

-- =====================================================
-- TABLE: ekadashi_info
-- =====================================================
ALTER TABLE ekadashi_info
  RENAME COLUMN benefits_ua TO benefits_uk;
ALTER TABLE ekadashi_info
  RENAME COLUMN fasting_rules_ua TO fasting_rules_uk;
ALTER TABLE ekadashi_info
  RENAME COLUMN glory_text_ua TO glory_text_uk;
ALTER TABLE ekadashi_info
  RENAME COLUMN glory_title_ua TO glory_title_uk;
ALTER TABLE ekadashi_info
  RENAME COLUMN name_ua TO name_uk;
ALTER TABLE ekadashi_info
  RENAME COLUMN prabhupada_instructions_ua TO prabhupada_instructions_uk;
ALTER TABLE ekadashi_info
  RENAME COLUMN presiding_deity_ua TO presiding_deity_uk;
ALTER TABLE ekadashi_info
  RENAME COLUMN recommended_activities_ua TO recommended_activities_uk;
ALTER TABLE ekadashi_info
  RENAME COLUMN story_ua TO story_uk;

-- =====================================================
-- TABLE: festival_categories
-- =====================================================
ALTER TABLE festival_categories
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE festival_categories
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: gv_authors
-- =====================================================
ALTER TABLE gv_authors
  RENAME COLUMN biography_ua TO biography_uk;
ALTER TABLE gv_authors
  RENAME COLUMN name_ua TO name_uk;
ALTER TABLE gv_authors
  RENAME COLUMN significance_ua TO significance_uk;
ALTER TABLE gv_authors
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: gv_book_catalogues
-- =====================================================
ALTER TABLE gv_book_catalogues
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE gv_book_catalogues
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: gv_catalogue_books
-- =====================================================
ALTER TABLE gv_catalogue_books
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE gv_catalogue_books
  RENAME COLUMN significance_ua TO significance_uk;
ALTER TABLE gv_catalogue_books
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: intro_chapters
-- =====================================================
ALTER TABLE intro_chapters
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE intro_chapters
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: lecture_paragraphs
-- =====================================================
ALTER TABLE lecture_paragraphs
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE lecture_paragraphs
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: lectures
-- =====================================================
ALTER TABLE lectures
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE lectures
  RENAME COLUMN location_ua TO location_uk;
ALTER TABLE lectures
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: letters
-- =====================================================
ALTER TABLE letters
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE letters
  RENAME COLUMN location_ua TO location_uk;
ALTER TABLE letters
  RENAME COLUMN recipient_ua TO recipient_uk;

-- =====================================================
-- TABLE: pages
-- =====================================================
ALTER TABLE pages
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE pages
  RENAME COLUMN meta_description_ua TO meta_description_uk;
ALTER TABLE pages
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: prabhupada_events
-- =====================================================
ALTER TABLE prabhupada_events
  RENAME COLUMN content_preview_ua TO content_preview_uk;
ALTER TABLE prabhupada_events
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE prabhupada_events
  RENAME COLUMN location_ua TO location_uk;
ALTER TABLE prabhupada_events
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: quote_categories
-- =====================================================
ALTER TABLE quote_categories
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE quote_categories
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: quote_pages
-- =====================================================
ALTER TABLE quote_pages
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: quotes
-- =====================================================
ALTER TABLE quotes
  RENAME COLUMN text_ua TO text_uk;

-- =====================================================
-- TABLE: static_page_metadata
-- =====================================================
ALTER TABLE static_page_metadata
  RENAME COLUMN meta_description_ua TO meta_description_uk;
ALTER TABLE static_page_metadata
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- TABLE: tattvas
-- =====================================================
ALTER TABLE tattvas
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE tattvas
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: tithi_types
-- =====================================================
ALTER TABLE tithi_types
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: vaishnava_festivals
-- =====================================================
ALTER TABLE vaishnava_festivals
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE vaishnava_festivals
  RENAME COLUMN name_ua TO name_uk;
ALTER TABLE vaishnava_festivals
  RENAME COLUMN observances_ua TO observances_uk;
ALTER TABLE vaishnava_festivals
  RENAME COLUMN short_description_ua TO short_description_uk;
ALTER TABLE vaishnava_festivals
  RENAME COLUMN significance_ua TO significance_uk;

-- =====================================================
-- TABLE: vaishnava_months
-- =====================================================
ALTER TABLE vaishnava_months
  RENAME COLUMN description_ua TO description_uk;
ALTER TABLE vaishnava_months
  RENAME COLUMN name_ua TO name_uk;

-- =====================================================
-- TABLE: verses
-- =====================================================
ALTER TABLE verses
  RENAME COLUMN commentary_ua TO commentary_uk;
ALTER TABLE verses
  RENAME COLUMN explanation_ua_audio_url TO explanation_uk_audio_url;
ALTER TABLE verses
  RENAME COLUMN sanskrit_ua TO sanskrit_uk;
ALTER TABLE verses
  RENAME COLUMN synonyms_ua TO synonyms_uk;
ALTER TABLE verses
  RENAME COLUMN translation_ua TO translation_uk;
ALTER TABLE verses
  RENAME COLUMN transliteration_ua TO transliteration_uk;

-- =====================================================
-- TABLE: verses_archive
-- =====================================================
ALTER TABLE verses_archive
  RENAME COLUMN commentary_ua TO commentary_uk;
ALTER TABLE verses_archive
  RENAME COLUMN synonyms_ua TO synonyms_uk;
ALTER TABLE verses_archive
  RENAME COLUMN translation_ua TO translation_uk;

-- =====================================================
-- TABLE: verses_backup_danda_fix
-- =====================================================
ALTER TABLE verses_backup_danda_fix
  RENAME COLUMN commentary_ua TO commentary_uk;
ALTER TABLE verses_backup_danda_fix
  RENAME COLUMN synonyms_ua TO synonyms_uk;
ALTER TABLE verses_backup_danda_fix
  RENAME COLUMN translation_ua TO translation_uk;

-- =====================================================
-- TABLE: verse_lyrics
-- =====================================================
ALTER TABLE verse_lyrics
  RENAME COLUMN orig_sanskrit_ua TO orig_sanskrit_uk;

-- =====================================================
-- TABLE: sanskrit_lexicon (glossary)
-- =====================================================
ALTER TABLE sanskrit_lexicon
  RENAME COLUMN content_ua TO content_uk;
ALTER TABLE sanskrit_lexicon
  RENAME COLUMN excerpt_ua TO excerpt_uk;
ALTER TABLE sanskrit_lexicon
  RENAME COLUMN meta_description_ua TO meta_description_uk;
ALTER TABLE sanskrit_lexicon
  RENAME COLUMN title_ua TO title_uk;

-- =====================================================
-- Verify the changes
-- =====================================================
-- You can run these queries after the migration to verify:
--
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema = 'public' AND column_name LIKE '%_ua'
-- ORDER BY table_name, column_name;
--
-- This should return no rows if all renames were successful

COMMIT;
