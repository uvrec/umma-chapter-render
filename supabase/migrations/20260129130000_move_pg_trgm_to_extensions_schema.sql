-- ============================================================================
-- Move pg_trgm extension from public to extensions schema
-- ============================================================================
-- Best practice: avoid installing extensions in public schema to:
-- - Keep public schema clean
-- - Minimize privilege exposure
-- - Make permissions/ownership clearer
-- ============================================================================

-- Ensure extensions schema exists (Supabase projects already have it)
CREATE SCHEMA IF NOT EXISTS extensions;

-- Drop from public and recreate in extensions schema
-- Note: User-created trigram indexes are NOT dropped by this operation,
-- only the extension's own objects are affected
DROP EXTENSION IF EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- ============================================================================
-- Verification
-- ============================================================================
DO $$
DECLARE
  ext_schema text;
BEGIN
  -- Verify pg_trgm is now in extensions schema
  SELECT n.nspname INTO ext_schema
  FROM pg_extension e
  JOIN pg_namespace n ON n.oid = e.extnamespace
  WHERE e.extname = 'pg_trgm';

  IF ext_schema IS NULL THEN
    RAISE EXCEPTION 'pg_trgm extension not found after migration';
  END IF;

  IF ext_schema != 'extensions' THEN
    RAISE EXCEPTION 'pg_trgm is in schema "%" instead of "extensions"', ext_schema;
  END IF;

  -- Test that trigram functions work via search_path
  PERFORM show_trgm('test');

  RAISE NOTICE 'pg_trgm successfully moved to extensions schema';
END $$;
