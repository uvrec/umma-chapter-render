-- ============================================================================
-- Guardrail: Block deployment if any extension is installed in public schema
-- ============================================================================
-- This migration acts as a safeguard to ensure extensions are always
-- installed in the 'extensions' schema, not 'public'.
-- ============================================================================

DO $$
DECLARE
  offenders text;
BEGIN
  SELECT string_agg(e.extname, ', ') INTO offenders
  FROM pg_extension e
  JOIN pg_namespace n ON n.oid = e.extnamespace
  WHERE n.nspname = 'public';

  IF offenders IS NOT NULL THEN
    RAISE EXCEPTION 'Extensions installed in public schema: %. Move them with: DROP EXTENSION <name>; CREATE EXTENSION <name> WITH SCHEMA extensions;', offenders;
  END IF;

  RAISE NOTICE 'Guardrail passed: no extensions in public schema';
END $$;
