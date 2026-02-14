-- ============================================================================
-- FIX: strip_diacritics() — qualify unaccent with extensions schema
-- ============================================================================
-- Problem: strip_diacritics() calls unaccent() without schema qualification.
-- On Supabase the unaccent extension lives in the 'extensions' schema, so
-- calling bare unaccent() fails with "function unaccent(text) does not exist"
-- when search_path does not include 'extensions'.
--
-- Solution: Use extensions.unaccent() explicitly. Add a fallback so the
-- function still works if unaccent is installed in public schema (local dev).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.strip_diacritics(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
PARALLEL SAFE
AS $$
BEGIN
  -- Try extensions.unaccent first (Supabase production)
  BEGIN
    RETURN regexp_replace(
      extensions.unaccent(input_text),
      E'[\u0300-\u036F]', '', 'g'
    );
  EXCEPTION WHEN undefined_function OR undefined_schema THEN
    -- Fallback: try public.unaccent (local dev / self-hosted)
    BEGIN
      RETURN regexp_replace(
        public.unaccent(input_text),
        E'[\u0300-\u036F]', '', 'g'
      );
    EXCEPTION WHEN undefined_function THEN
      -- Last resort: just strip combining marks without unaccent
      RETURN regexp_replace(
        input_text,
        E'[\u0300-\u036F]', '', 'g'
      );
    END;
  END;
END;
$$;

COMMENT ON FUNCTION public.strip_diacritics IS
'Strips diacritical marks from text: extensions.unaccent for Latin precomposed (ā→a), regexp_replace for combining marks (а̄→а). Falls back gracefully if unaccent is unavailable.';

GRANT EXECUTE ON FUNCTION public.strip_diacritics(text) TO anon, authenticated;
