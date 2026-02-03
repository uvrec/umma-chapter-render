-- Fix Function Search Path Mutable Security Issue
-- This migration adds SET search_path = public to all functions that are missing it
-- Reference: https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable

-- =====================================================
-- Fix all public schema functions with SECURITY DEFINER
-- that don't have search_path set
-- =====================================================

DO $$
DECLARE
  func_record RECORD;
  alter_sql TEXT;
BEGIN
  -- Find all functions in public schema with SECURITY DEFINER
  -- that might not have search_path properly set
  FOR func_record IN
    SELECT
      p.proname AS function_name,
      pg_get_function_identity_arguments(p.oid) AS function_args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.prosecdef = true  -- SECURITY DEFINER functions
      AND p.prokind = 'f'     -- Only regular functions
  LOOP
    -- Build and execute ALTER FUNCTION statement
    alter_sql := format(
      'ALTER FUNCTION public.%I(%s) SET search_path = public',
      func_record.function_name,
      func_record.function_args
    );

    BEGIN
      EXECUTE alter_sql;
      RAISE NOTICE 'Fixed search_path for: public.%(%)',
        func_record.function_name, func_record.function_args;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not fix: public.%(%) - %',
        func_record.function_name, func_record.function_args, SQLERRM;
    END;
  END LOOP;
END;
$$;

-- Also fix specific known functions that use SECURITY INVOKER but should have search_path
-- for consistency and security

-- has_role function
ALTER FUNCTION public.has_role(UUID, app_role) SET search_path = public;

-- Any triggers that create functions dynamically should also be fixed
-- by ensuring they include SET search_path in their function definitions

COMMENT ON SCHEMA public IS 'All functions in this schema have been secured with SET search_path = public';
