-- Bold Ukrainian book titles in commentary_ua
-- Makes book titles bold (wrapped in <strong>) throughout all Ukrainian commentary texts
-- Automatically uses titles from gv_book_references table
-- Handles declension forms (different endings) and optional quotes around titles

BEGIN;

-- ============================================================================
-- HELPER FUNCTION: Extract stem from Ukrainian word (remove common endings)
-- ============================================================================
CREATE OR REPLACE FUNCTION extract_ua_stem(title TEXT)
RETURNS TEXT AS $$
DECLARE
  stem TEXT := title;
BEGIN
  -- Remove common Ukrainian noun endings to get the stem
  -- Order matters: longer endings first
  stem := REGEXP_REPLACE(stem, '(ою|ам|ами|ах|ія|іє|ія|ії)$', '', 'i');
  stem := REGEXP_REPLACE(stem, '(а|и|і|у|о|я|ю|є)$', '', 'i');
  RETURN stem;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- HELPER FUNCTION: Wrap book title in <strong> tags with declension support
-- ============================================================================
CREATE OR REPLACE FUNCTION bold_book_title_ua(
  input_text TEXT,
  title_base TEXT,
  title_endings TEXT[] DEFAULT ARRAY['', 'а', 'и', 'і', 'у', 'ою', 'ам', 'ами', 'ах', 'о', 'я', 'ю', 'є', 'ія', 'ії', 'ію']
) RETURNS TEXT AS $$
DECLARE
  result TEXT := input_text;
  ending TEXT;
  pattern TEXT;
BEGIN
  -- Skip if input is null or empty
  IF result IS NULL OR result = '' THEN
    RETURN result;
  END IF;

  -- Skip if title_base is too short (avoid false matches)
  IF LENGTH(title_base) < 4 THEN
    RETURN result;
  END IF;

  -- Process each possible ending
  FOREACH ending IN ARRAY title_endings
  LOOP
    -- Build pattern: optional opening quote + title + ending + optional closing quote
    -- Use word boundary to avoid matching parts of longer words
    -- Avoid matching if already inside <strong> tags
    pattern := '(?<![а-яіїєґА-ЯІЇЄҐ])([«"''„"]?)(' || title_base || ending || ')([»"''""]?)(?![а-яіїєґА-ЯІЇЄҐ])(?![^<]*</strong>)';

    -- Replace with <strong> wrapped version, preserving quotes
    result := REGEXP_REPLACE(
      result,
      pattern,
      '\1<strong>\2</strong>\3',
      'g'  -- case sensitive for Ukrainian
    );
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MAIN PROCEDURE: Process all book titles from gv_book_references
-- ============================================================================
CREATE OR REPLACE FUNCTION process_all_book_titles_bold() RETURNS void AS $$
DECLARE
  book_rec RECORD;
  stem TEXT;
  affected_count INTEGER;
BEGIN
  -- Process each book from gv_book_references that has Ukrainian title
  FOR book_rec IN
    SELECT DISTINCT title_ua
    FROM gv_book_references
    WHERE title_ua IS NOT NULL
      AND title_ua <> ''
      AND LENGTH(title_ua) >= 5  -- Skip very short titles
    ORDER BY LENGTH(title_ua) DESC  -- Process longer titles first to avoid substring issues
  LOOP
    -- Extract stem from the title
    stem := extract_ua_stem(book_rec.title_ua);

    -- Skip if stem is too short
    IF LENGTH(stem) < 4 THEN
      CONTINUE;
    END IF;

    -- Update commentary_ua for all verses containing this title
    UPDATE verses
    SET commentary_ua = bold_book_title_ua(commentary_ua, stem)
    WHERE is_published = true
      AND commentary_ua IS NOT NULL
      AND commentary_ua <> ''
      AND commentary_ua ~ stem  -- Only update if contains the stem
      AND commentary_ua !~ ('<strong>[^<]*' || stem || '[^<]*</strong>');  -- Not already bold

    GET DIAGNOSTICS affected_count = ROW_COUNT;
    IF affected_count > 0 THEN
      RAISE NOTICE 'Processed title "%" (stem: "%"), affected % verses', book_rec.title_ua, stem, affected_count;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SPECIFIC BOOK TITLES (manually added for common references)
-- These ensure the most important/frequent titles are correctly processed
-- ============================================================================

-- Бгаґавад-ґіта (most common reference)
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Бгаґавад-ґіт', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Бгаґавад-ґіт'
  AND commentary_ua !~* '<strong>[^<]*Бгаґавад-ґіт[^<]*</strong>';

-- Шрімад-Бгаґаватам
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Шрімад-Бгаґаватам', ARRAY['', 'і', 'у', 'ом'])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Шрімад-Бгаґаватам'
  AND commentary_ua !~* '<strong>[^<]*Шрімад-Бгаґаватам[^<]*</strong>';

-- Бгаґаватам (short form)
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Бгаґаватам', ARRAY['', 'і', 'у', 'ом'])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~ '(?<![а-яА-Я-])Бгаґаватам'
  AND commentary_ua !~ '<strong>[^<]*Бгаґаватам[^<]*</strong>';

-- Чайтанья-чарітамріта (both spellings)
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Чайтанья-чарітамріт', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Чайтанья-чарітамріт'
  AND commentary_ua !~* '<strong>[^<]*Чайтанья-чарітамріт[^<]*</strong>';

UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Чаітанья-чарітамріт', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Чаітанья-чарітамріт'
  AND commentary_ua !~* '<strong>[^<]*Чаітанья-чарітамріт[^<]*</strong>';

-- Нектар настанов
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Нектар настанов', ARRAY['', 'і', 'ам', 'ами'])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Нектар настанов'
  AND commentary_ua !~* '<strong>[^<]*Нектар настанов[^<]*</strong>';

-- Нектар відданості
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Нектар відданост', ARRAY['і', 'ю', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Нектар відданост'
  AND commentary_ua !~* '<strong>[^<]*Нектар відданост[^<]*</strong>';

-- Бгакті-расамріта-сіндгу
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Бгакті-расамріта-сіндг', ARRAY['у', 'і', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Бгакті-расамріта-сіндг'
  AND commentary_ua !~* '<strong>[^<]*Бгакті-расамріта-сіндг[^<]*</strong>';

-- Шрі Ішопанішад / Ішопанішад
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Ішопанішад', ARRAY['', 'і', 'у', 'ом'])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Ішопанішад'
  AND commentary_ua !~* '<strong>[^<]*Ішопанішад[^<]*</strong>';

-- Веданта-сутра
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Веданта-сутр', ARRAY['а', 'и', 'і', 'у', 'ою', 'ах', 'ами', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Веданта-сутр'
  AND commentary_ua !~* '<strong>[^<]*Веданта-сутр[^<]*</strong>';

-- Брагма-самхіта
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Брагма-самхіт', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Брагма-самхіт'
  AND commentary_ua !~* '<strong>[^<]*Брагма-самхіт[^<]*</strong>';

-- Упанішади
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Упанішад', ARRAY['и', 'ах', 'ами', 'ам', '', 'а', 'і', 'у', 'ою'])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Упанішад'
  AND commentary_ua !~* '<strong>[^<]*Упанішад[^<]*</strong>';

-- Махабгарата
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Махабгарат', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Махабгарат'
  AND commentary_ua !~* '<strong>[^<]*Махабгарат[^<]*</strong>';

-- Рамаяна
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Рамаян', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Рамаян'
  AND commentary_ua !~* '<strong>[^<]*Рамаян[^<]*</strong>';

-- Пурани (generic)
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Пуран', ARRAY['и', 'а', 'ах', 'ами', 'ою', 'і', 'у', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~ '(?<![а-яА-Я-])Пуран[аиіуоюях]'
  AND commentary_ua !~ '<strong>[^<]*Пуран[^<]*</strong>';

-- Вішну-пурана
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Вішну-пуран', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Вішну-пуран'
  AND commentary_ua !~* '<strong>[^<]*Вішну-пуран[^<]*</strong>';

-- Падма-пурана
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Падма-пуран', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Падма-пуран'
  AND commentary_ua !~* '<strong>[^<]*Падма-пуран[^<]*</strong>';

-- Бгаґавата-пурана
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Бгаґавата-пуран', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Бгаґавата-пуран'
  AND commentary_ua !~* '<strong>[^<]*Бгаґавата-пуран[^<]*</strong>';

-- Ґаруда-пурана
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Ґаруда-пуран', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Ґаруда-пуран'
  AND commentary_ua !~* '<strong>[^<]*Ґаруда-пуран[^<]*</strong>';

-- Скандха-пурана / Сканда-пурана
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Сканд', ARRAY['а-пурана', 'а-пурани', 'а-пурані', 'а-пурану', 'а-пураною'])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Сканд[ха]?-пуран'
  AND commentary_ua !~* '<strong>[^<]*Сканд[^<]*</strong>';

-- Нарада-пурана
UPDATE verses
SET commentary_ua = bold_book_title_ua(commentary_ua, 'Нарада-пуран', ARRAY['а', 'и', 'і', 'у', 'ою', ''])
WHERE is_published = true
  AND commentary_ua IS NOT NULL AND commentary_ua <> ''
  AND commentary_ua ~* 'Нарада-пуран'
  AND commentary_ua !~* '<strong>[^<]*Нарада-пуран[^<]*</strong>';

-- ============================================================================
-- Now process all remaining titles from gv_book_references
-- ============================================================================
SELECT process_all_book_titles_bold();

-- ============================================================================
-- Cleanup: Drop helper functions (keep bold_book_title_ua for future use)
-- ============================================================================
DROP FUNCTION IF EXISTS extract_ua_stem;
DROP FUNCTION IF EXISTS process_all_book_titles_bold;

COMMIT;
