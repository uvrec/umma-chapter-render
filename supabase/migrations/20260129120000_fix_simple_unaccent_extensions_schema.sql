-- ============================================================================
-- FIX: Ukrainian text search configuration with extensions.unaccent
-- ============================================================================
-- The unaccent extension was moved to the 'extensions' schema.
-- This migration recreates the text search configuration to properly
-- reference extensions.unaccent (schema-qualified) so it works regardless
-- of search_path settings.
-- ============================================================================

-- Drop and recreate the configuration with proper schema-qualified reference
DROP TEXT SEARCH CONFIGURATION IF EXISTS public.simple_unaccent;

CREATE TEXT SEARCH CONFIGURATION public.simple_unaccent (COPY = simple);

-- Use schema-qualified reference to unaccent in extensions schema
ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH extensions.unaccent, simple;

COMMENT ON TEXT SEARCH CONFIGURATION public.simple_unaccent IS
  'Text search config for Ukrainian: accent-insensitive using extensions.unaccent + simple tokenizer';

-- ============================================================================
-- Verify the configuration is working
-- ============================================================================
-- This will fail the migration if the configuration doesn't work properly
DO $$
DECLARE
  test_result boolean;
BEGIN
  -- Test that the configuration works with unaccent
  SELECT to_tsvector('public.simple_unaccent', 'тест') IS NOT NULL INTO test_result;

  IF NOT test_result THEN
    RAISE EXCEPTION 'simple_unaccent configuration verification failed';
  END IF;

  RAISE NOTICE 'simple_unaccent configuration verified successfully';
END $$;
