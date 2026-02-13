-- Fix search_path for timeline SECURITY DEFINER functions
-- Prevents search_path hijacking attacks
-- Uses DO blocks to skip gracefully if functions don't exist yet

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_prabhupada_timeline'
  ) THEN
    ALTER FUNCTION public.get_prabhupada_timeline(integer, integer, text[]) SET search_path = public;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_timeline_years'
  ) THEN
    ALTER FUNCTION public.get_timeline_years() SET search_path = public;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_timeline_locations'
  ) THEN
    ALTER FUNCTION public.get_timeline_locations(integer) SET search_path = public;
  END IF;
END $$;
