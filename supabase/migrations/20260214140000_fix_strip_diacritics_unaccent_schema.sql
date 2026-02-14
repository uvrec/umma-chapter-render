-- ============================================================================
-- FIX: strip_diacritics() — remove dependency on unaccent extension
-- ============================================================================
-- Problem: strip_diacritics() calls unaccent() which may not be available
-- or may live in a different schema (extensions vs public) on Supabase.
--
-- Solution: Use translate() for IAST/Latin precomposed characters instead
-- of unaccent(). This is a pure SQL approach with zero extension dependency.
-- Combined with regexp_replace() for combining diacritical marks (Cyrillic).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.strip_diacritics(input_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT regexp_replace(
    translate(
      input_text,
      -- IAST precomposed characters (lowercase + uppercase)
      'āīūṛṝḷḹēōṃḥśṣṭḍṇñṅĀĪŪṚṜḶḸĒŌṂḤŚṢṬḌṆÑṄàáâãäåèéêëìíîïòóôõöùúûüýÿÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝ',
      -- ASCII replacements
      'aiurrlleomhsstdnnnaIURRLLEOMHSSTDNNNaaaaaaeeeeiiiioooooeuuuuyYAAAAAEEEEIIIIOOOOOUUUUY'
    ),
    -- Strip combining diacritical marks (U+0300-U+036F) for Cyrillic
    E'[\u0300-\u036F]', '', 'g'
  );
$$;

COMMENT ON FUNCTION public.strip_diacritics IS
'Strips diacritical marks from text: translate() for IAST precomposed chars (ā→a, ś→s), regexp_replace for combining marks (а̄→а). No extension dependencies.';

GRANT EXECUTE ON FUNCTION public.strip_diacritics(text) TO anon, authenticated;
