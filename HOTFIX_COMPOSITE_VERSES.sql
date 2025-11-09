-- ⚡ HOTFIX: Негайне виправлення для composite verses
-- Виконайте цей SQL в Supabase Dashboard → SQL Editor

-- ============================================================================
-- ЧАСТИНА 1: Виправлення verse_number_sort (усуває помилку "integer out of range")
-- ============================================================================

-- Видаляємо старий generated column що викликає overflow
ALTER TABLE verses DROP COLUMN IF EXISTS verse_number_sort;

-- Створюємо новий з виправленою формулою (витягує тільки ПЕРШЕ число)
ALTER TABLE verses ADD COLUMN verse_number_sort bigint
  GENERATED ALWAYS AS (
    (regexp_match(verse_number, '^\s*(\d+)'))[1]::bigint * 1000000
    + COALESCE((NULLIF(regexp_replace(split_part(verse_number, '.', 2), '[^0-9]', '', 'g'), ''))::bigint, 0) * 1000
    + COALESCE((NULLIF(regexp_replace(split_part(verse_number, '.', 3), '[^0-9]', '', 'g'), ''))::bigint, 0)
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_verses_verse_number_sort ON verses(chapter_id, verse_number_sort);

-- ============================================================================
-- ЧАСТИНА 2: Додавання підтримки composite verses (автоматичні метадані)
-- ============================================================================

-- Додаємо нові колонки
ALTER TABLE verses ADD COLUMN IF NOT EXISTS is_composite boolean DEFAULT false;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS start_verse integer;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS end_verse integer;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS verse_count integer DEFAULT 1;
ALTER TABLE verses ADD COLUMN IF NOT EXISTS sort_key bigint;

-- Створюємо функцію для автоматичного парсингу
CREATE OR REPLACE FUNCTION parse_composite_verse()
RETURNS TRIGGER AS $$
DECLARE
  verse_str TEXT;
  dash_pos INTEGER;
  start_num INTEGER;
  end_num INTEGER;
BEGIN
  verse_str := TRIM(NEW.verse_number);
  dash_pos := POSITION('-' IN verse_str);

  IF dash_pos > 0 THEN
    -- Composite verse (e.g., "48-49")
    BEGIN
      start_num := (regexp_match(verse_str, '^(\d+)-'))[1]::INTEGER;
      end_num := (regexp_match(verse_str, '-(\d+)$'))[1]::INTEGER;

      NEW.is_composite := TRUE;
      NEW.start_verse := start_num;
      NEW.end_verse := end_num;
      NEW.verse_count := end_num - start_num + 1;
      NEW.sort_key := start_num::BIGINT;

    EXCEPTION WHEN OTHERS THEN
      NEW.is_composite := FALSE;
      NEW.start_verse := NULL;
      NEW.end_verse := NULL;
      NEW.verse_count := 1;
      BEGIN
        NEW.sort_key := (regexp_match(verse_str, '(\d+)'))[1]::BIGINT;
      EXCEPTION WHEN OTHERS THEN
        NEW.sort_key := 0;
      END;
    END;
  ELSE
    -- Simple verse (e.g., "48")
    BEGIN
      start_num := verse_str::INTEGER;
      NEW.is_composite := FALSE;
      NEW.start_verse := start_num;
      NEW.end_verse := start_num;
      NEW.verse_count := 1;
      NEW.sort_key := start_num::BIGINT;
    EXCEPTION WHEN OTHERS THEN
      NEW.is_composite := FALSE;
      NEW.start_verse := NULL;
      NEW.end_verse := NULL;
      NEW.verse_count := 1;
      BEGIN
        NEW.sort_key := (regexp_match(verse_str, '(\d+)'))[1]::BIGINT;
      EXCEPTION WHEN OTHERS THEN
        NEW.sort_key := 0;
      END;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Створюємо тригер
DROP TRIGGER IF EXISTS set_composite_verse_metadata ON verses;

CREATE TRIGGER set_composite_verse_metadata
  BEFORE INSERT OR UPDATE OF verse_number ON verses
  FOR EACH ROW
  EXECUTE FUNCTION parse_composite_verse();

-- Оновлюємо існуючі вірші для заповнення нових полів
UPDATE verses SET verse_number = verse_number WHERE verse_number IS NOT NULL;

-- Створюємо індекс для sort_key
CREATE INDEX IF NOT EXISTS idx_verses_sort_key ON verses(chapter_id, sort_key);

-- ============================================================================
-- ГОТОВО! Тепер можна знову спробувати імпорт
-- ============================================================================

-- Перевірка: подивитися на composite verses
-- SELECT verse_number, is_composite, start_verse, end_verse, verse_count, sort_key
-- FROM verses
-- WHERE is_composite = true
-- LIMIT 10;
