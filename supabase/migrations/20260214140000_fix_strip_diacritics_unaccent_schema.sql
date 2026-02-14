-- ============================================================================
-- FIX: strip_diacritics() — remove dependency on unaccent extension
-- ============================================================================
-- Problem: strip_diacritics() calls unaccent() which may not be available
-- or may live in a different schema (extensions vs public) on Supabase.
--
-- Solution: Use translate() for precomposed characters (IAST Latin +
-- Ukrainian Cyrillic transliteration) instead of unaccent().
-- Combined with regexp_replace() for combining diacritical marks.
--
-- Sources for character mappings:
--   src/utils/text/transliteration.ts  (IAST_TO_CYRILLIC)
--   tools/import_gita_transliteration.py (convert_iast_to_ukrainian)
--   tools/translit_normalizer.py
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
      -- === IAST Latin precomposed ===
      -- ā ī ū ṛ ṝ ḷ ḹ ē ō ṃ ḥ ś ṣ ṭ ḍ ṇ ñ ṅ (lowercase)
      -- Ā Ī Ū Ṛ Ṝ Ḷ Ḹ Ē Ō Ṃ Ḥ Ś Ṣ Ṭ Ḍ Ṇ Ñ Ṅ (uppercase)
      -- === Common Latin accented ===
      -- à á â ã ä å è é ê ë ì í î ï ò ó ô õ ö ù ú û ü ý ÿ (lowercase)
      -- À Á Â Ã Ä Å È É Ê Ë Ì Í Î Ï Ò Ó Ô Õ Ö Ù Ú Û Ü Ý (uppercase)
      -- === Ukrainian Cyrillic precomposed (from transliteration.ts) ===
      -- ӯ Ӯ (у/У with macron — long ū in Cyrillic transliteration)
      -- ı   (dotless i U+0131 — base char after combining macron stripped from ı̄)
      -- ӣ Ӣ (и/И with macron — may appear in some texts)
      'āīūṛṝḷḹēōṃḥśṣṭḍṇñṅĀĪŪṚṜḶḸĒŌṂḤŚṢṬḌṆÑṄàáâãäåèéêëìíîïòóôõöùúûüýÿÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝӯӮıӣӢ',
      'aiurrlleomhsstdnnnaIURRLLEOMHSSTDNNNaaaaaaeeeeiiiioooooeuuuuyYAAAAAEEEEIIIIOOOOOUUUUYуУіиИ'
    ),
    -- Strip combining diacritical marks (U+0300-U+036F):
    -- macron (◌̄), dot above (◌̇), dot below (◌̣), acute (◌́),
    -- tilde (◌̃), breve (◌̆), candrabindu (◌̐), etc.
    -- Handles Ukrainian Cyrillic: а̄→а, н̇→н, ш́→ш, т̣→т, н̃→н, м̐→м
    E'[\u0300-\u036F]', '', 'g'
  );
$$;

COMMENT ON FUNCTION public.strip_diacritics IS
'Strips diacritical marks: translate() for IAST Latin (ā→a, ś→s) and Cyrillic precomposed (ӯ→у, ı→і), regexp_replace for combining marks (а̄→а, н̇→н, ш́→ш). No extension dependencies.';

GRANT EXECUTE ON FUNCTION public.strip_diacritics(text) TO anon, authenticated;
