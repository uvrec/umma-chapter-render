-- Split display_blocks for verses into language-specific keys and fix defaults
-- 1) Update trigger function to set language-specific flags on insert/update when NEW.display_blocks is NULL
CREATE OR REPLACE FUNCTION public.set_verse_display_blocks()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.display_blocks IS NULL THEN
    NEW.display_blocks = jsonb_build_object(
      -- Language-specific visibility
      'sanskrit_ua',        (NEW.sanskrit IS NOT NULL AND length(trim(NEW.sanskrit)) > 0)
                            OR (NEW.sanskrit_ua IS NOT NULL AND length(trim(NEW.sanskrit_ua)) > 0),
      'sanskrit_en',        (NEW.sanskrit IS NOT NULL AND length(trim(NEW.sanskrit)) > 0)
                            OR (NEW.sanskrit_en IS NOT NULL AND length(trim(NEW.sanskrit_en)) > 0),
      'transliteration_ua', (NEW.transliteration IS NOT NULL AND length(trim(NEW.transliteration)) > 0)
                            OR (NEW.transliteration_ua IS NOT NULL AND length(trim(NEW.transliteration_ua)) > 0),
      'transliteration_en', (NEW.transliteration IS NOT NULL AND length(trim(NEW.transliteration)) > 0)
                            OR (NEW.transliteration_en IS NOT NULL AND length(trim(NEW.transliteration_en)) > 0),
      -- Shared blocks
      'synonyms',           ((NEW.synonyms_ua IS NOT NULL AND length(trim(NEW.synonyms_ua)) > 0)
                             OR (NEW.synonyms_en IS NOT NULL AND length(trim(NEW.synonyms_en)) > 0)),
      'translation',        ((NEW.translation_ua IS NOT NULL AND length(trim(NEW.translation_ua)) > 0)
                             OR (NEW.translation_en IS NOT NULL AND length(trim(NEW.translation_en)) > 0)),
      'commentary',         ((NEW.commentary_ua IS NOT NULL AND length(trim(NEW.commentary_ua)) > 0)
                             OR (NEW.commentary_en IS NOT NULL AND length(trim(NEW.commentary_en)) > 0)),
      -- Legacy combined keys kept for backward compatibility
      'sanskrit',           (NEW.sanskrit IS NOT NULL AND length(trim(NEW.sanskrit)) > 0)
                            OR (NEW.sanskrit_ua IS NOT NULL AND length(trim(NEW.sanskrit_ua)) > 0)
                            OR (NEW.sanskrit_en IS NOT NULL AND length(trim(NEW.sanskrit_en)) > 0),
      'transliteration',    (NEW.transliteration IS NOT NULL AND length(trim(NEW.transliteration)) > 0)
                            OR (NEW.transliteration_ua IS NOT NULL AND length(trim(NEW.transliteration_ua)) > 0)
                            OR (NEW.transliteration_en IS NOT NULL AND length(trim(NEW.transliteration_en)) > 0)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 2) Update debugging helper to reflect the new logic (optional but helpful)
CREATE OR REPLACE FUNCTION public.debug_set_verse_display_blocks()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sanskrit_any boolean;
  v_sanskrit_ua boolean;
  v_sanskrit_en boolean;
  v_translit_any boolean;
  v_translit_ua boolean;
  v_translit_en boolean;
  v_synonyms_present boolean;
  v_translation_present boolean;
  v_commentary_present boolean;
BEGIN
  v_sanskrit_ua := (NEW.sanskrit IS NOT NULL AND length(trim(NEW.sanskrit)) > 0)
                   OR (NEW.sanskrit_ua IS NOT NULL AND length(trim(NEW.sanskrit_ua)) > 0);
  v_sanskrit_en := (NEW.sanskrit IS NOT NULL AND length(trim(NEW.sanskrit)) > 0)
                   OR (NEW.sanskrit_en IS NOT NULL AND length(trim(NEW.sanskrit_en)) > 0);
  v_sanskrit_any := v_sanskrit_ua OR v_sanskrit_en;

  v_translit_ua := (NEW.transliteration IS NOT NULL AND length(trim(NEW.transliteration)) > 0)
                   OR (NEW.transliteration_ua IS NOT NULL AND length(trim(NEW.transliteration_ua)) > 0);
  v_translit_en := (NEW.transliteration IS NOT NULL AND length(trim(NEW.transliteration)) > 0)
                   OR (NEW.transliteration_en IS NOT NULL AND length(trim(NEW.transliteration_en)) > 0);
  v_translit_any := v_translit_ua OR v_translit_en;

  v_synonyms_present := ((NEW.synonyms_ua IS NOT NULL AND length(trim(NEW.synonyms_ua)) > 0)
                         OR (NEW.synonyms_en IS NOT NULL AND length(trim(NEW.synonyms_en)) > 0));
  v_translation_present := ((NEW.translation_ua IS NOT NULL AND length(trim(NEW.translation_ua)) > 0)
                            OR (NEW.translation_en IS NOT NULL AND length(trim(NEW.translation_en)) > 0));
  v_commentary_present := ((NEW.commentary_ua IS NOT NULL AND length(trim(NEW.commentary_ua)) > 0)
                           OR (NEW.commentary_en IS NOT NULL AND length(trim(NEW.commentary_en)) > 0));

  RAISE NOTICE 'DEBUG verse %', COALESCE(NEW.id::text, '<no id>');
  RAISE NOTICE '  sanskrit_any=% ua=% en=% translit_any=% ua=% en=%', v_sanskrit_any, v_sanskrit_ua, v_sanskrit_en, v_translit_any, v_translit_ua, v_translit_en;
  RAISE NOTICE '  translation=% commentary=% synonyms=%', v_translation_present, v_commentary_present, v_synonyms_present;

  NEW.display_blocks := jsonb_build_object(
    'sanskrit_ua', v_sanskrit_ua,
    'sanskrit_en', v_sanskrit_en,
    'transliteration_ua', v_translit_ua,
    'transliteration_en', v_translit_en,
    'synonyms', v_synonyms_present,
    'translation', v_translation_present,
    'commentary', v_commentary_present,
    'sanskrit', v_sanskrit_any,
    'transliteration', v_translit_any
  );

  RETURN NEW;
END;
$$;

-- 3) Count helper to be compatible with new keys
CREATE OR REPLACE FUNCTION public.count_visible_blocks(verse_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  blocks JSONB;
  count INTEGER := 0;
BEGIN
  SELECT display_blocks INTO blocks FROM verses WHERE id = verse_id;
  IF blocks IS NULL THEN
    RETURN 0;
  END IF;

  IF (blocks->>'sanskrit' = 'true') OR (blocks->>'sanskrit_ua' = 'true') OR (blocks->>'sanskrit_en' = 'true') THEN count := count + 1; END IF;
  IF (blocks->>'transliteration' = 'true') OR (blocks->>'transliteration_ua' = 'true') OR (blocks->>'transliteration_en' = 'true') THEN count := count + 1; END IF;
  IF (blocks->>'synonyms' = 'true') THEN count := count + 1; END IF;
  IF (blocks->>'translation' = 'true') THEN count := count + 1; END IF;
  IF (blocks->>'commentary' = 'true') THEN count := count + 1; END IF;
  RETURN count;
END;
$$;

-- 4) One-off data migration: expand existing display_blocks to include new keys using content and legacy flags
UPDATE public.verses v
SET display_blocks = coalesce(v.display_blocks, '{}'::jsonb)
  || jsonb_build_object(
      'sanskrit_ua',        ((v.display_blocks->>'sanskrit') = 'true')
                            OR (v.sanskrit IS NOT NULL AND length(trim(v.sanskrit)) > 0)
                            OR (v.sanskrit_ua IS NOT NULL AND length(trim(v.sanskrit_ua)) > 0),
      'sanskrit_en',        ((v.display_blocks->>'sanskrit') = 'true')
                            OR (v.sanskrit IS NOT NULL AND length(trim(v.sanskrit)) > 0)
                            OR (v.sanskrit_en IS NOT NULL AND length(trim(v.sanskrit_en)) > 0),
      'transliteration_ua', ((v.display_blocks->>'transliteration') = 'true')
                            OR (v.transliteration IS NOT NULL AND length(trim(v.transliteration)) > 0)
                            OR (v.transliteration_ua IS NOT NULL AND length(trim(v.transliteration_ua)) > 0),
      'transliteration_en', ((v.display_blocks->>'transliteration') = 'true')
                            OR (v.transliteration IS NOT NULL AND length(trim(v.transliteration)) > 0)
                            OR (v.transliteration_en IS NOT NULL AND length(trim(v.transliteration_en)) > 0)
    )
  || jsonb_build_object(
      -- also ensure legacy combined keys exist
      'sanskrit',        ((v.display_blocks->>'sanskrit') = 'true')
                         OR (v.sanskrit IS NOT NULL AND length(trim(v.sanskrit)) > 0)
                         OR (v.sanskrit_ua IS NOT NULL AND length(trim(v.sanskrit_ua)) > 0)
                         OR (v.sanskrit_en IS NOT NULL AND length(trim(v.sanskrit_en)) > 0),
      'transliteration', ((v.display_blocks->>'transliteration') = 'true')
                         OR (v.transliteration IS NOT NULL AND length(trim(v.transliteration)) > 0)
                         OR (v.transliteration_ua IS NOT NULL AND length(trim(v.transliteration_ua)) > 0)
                         OR (v.transliteration_en IS NOT NULL AND length(trim(v.transliteration_en)) > 0)
    );