-- ============================================================================
-- Revoke CREATE privilege on public schema
-- ============================================================================
-- Prevents accidental creation of objects (tables, functions, extensions)
-- in the public schema. Only USAGE is granted for accessing existing objects.
-- ============================================================================

-- Revoke CREATE from PUBLIC (default role for all users)
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Keep USAGE so users can still access objects in public schema
GRANT USAGE ON SCHEMA public TO PUBLIC;

-- Ensure service roles retain necessary privileges
GRANT USAGE ON SCHEMA extensions TO PUBLIC;

-- ============================================================================
-- Verification
-- ============================================================================
DO $$
DECLARE
  has_create boolean;
BEGIN
  -- Check if PUBLIC role still has CREATE on public schema
  SELECT has_schema_privilege('public', 'public', 'CREATE') INTO has_create;

  IF has_create THEN
    RAISE WARNING 'PUBLIC role still has CREATE privilege on public schema';
  ELSE
    RAISE NOTICE 'CREATE privilege successfully revoked from PUBLIC on public schema';
  END IF;
END $$;
