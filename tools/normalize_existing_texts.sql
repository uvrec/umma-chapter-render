-- ============================================================================
-- Скрипт нормалізації існуючих текстів Чайтанья-чарітамріти
-- ============================================================================
--
-- ВИКОРИСТАННЯ:
--   1. Створіть резервну копію:
--      pg_dump -U your_user -h your_host -d vedavoice -t verses > backup_verses_$(date +%Y%m%d_%H%M%S).sql
--
--   2. Виконайте цей скрипт:
--      psql -U your_user -h your_host -d vedavoice -f tools/normalize_existing_texts.sql
--
--   3. Або виконайте через Supabase SQL Editor (скопіюйте весь файл)
--
-- ЩО РОБИТЬ:
--   - Нормалізує українські тексти (synonyms_ua, translation_ua, commentary_ua)
--   - Видаляє дублікати слів з англійських synonyms_en
--   - Застосовує правила: н'→нь, санн'ясі→санньясі, джг→джх, джджг→джджх
--
-- ============================================================================

-- Перевірка: показати кілька віршів ДО нормалізації
\echo '=== ПРИКЛАД ВІРШІВ ДО НОРМАЛІЗАЦІЇ ==='
SELECT
  b.slug AS book,
  v.verse_number,
  LEFT(v.synonyms_ua, 50) AS synonyms_before,
  LEFT(v.translation_ua, 50) AS translation_before
FROM verses v
JOIN chapters ch ON v.chapter_id = ch.id
JOIN books b ON ch.book_id = b.id
WHERE b.slug LIKE 'cc-%'
  AND (v.synonyms_ua LIKE '%н''%' OR v.translation_ua LIKE '%н''%' OR v.commentary_ua LIKE '%н''%')
LIMIT 5;

-- ============================================================================
-- ФУНКЦІЯ 1: Нормалізація українських текстів
-- ============================================================================

CREATE OR REPLACE FUNCTION normalize_ukrainian_cc_texts()
RETURNS TABLE(verse_id UUID, changed_fields TEXT[], before_sample TEXT, after_sample TEXT) AS $$
DECLARE
  verse_record RECORD;
  normalized_synonyms TEXT;
  normalized_translation TEXT;
  normalized_commentary TEXT;
  changes TEXT[];
BEGIN
  FOR verse_record IN
    SELECT v.id, v.verse_number, v.synonyms_ua, v.translation_ua, v.commentary_ua,
           b.slug AS book_slug
    FROM verses v
    JOIN chapters ch ON v.chapter_id = ch.id
    JOIN books b ON ch.book_id = b.id
    WHERE b.slug LIKE 'cc-%'
      AND (v.synonyms_ua IS NOT NULL OR v.translation_ua IS NOT NULL OR v.commentary_ua IS NOT NULL)
  LOOP
    changes := ARRAY[]::TEXT[];

    -- Synonyms
    normalized_synonyms := verse_record.synonyms_ua;
    IF normalized_synonyms IS NOT NULL THEN
      -- 1. Апостроф після "н" → м'який знак (н' → нь)
      normalized_synonyms := regexp_replace(normalized_synonyms, 'н''', 'нь', 'g');
      normalized_synonyms := regexp_replace(normalized_synonyms, 'Н''', 'Нь', 'g');

      -- 2. Санн'ясі → Санньясі
      normalized_synonyms := replace(normalized_synonyms, 'санн''яс', 'санньяс');
      normalized_synonyms := replace(normalized_synonyms, 'Санн''яс', 'Санньяс');

      -- 3. джджг → джджх
      normalized_synonyms := replace(normalized_synonyms, 'джджг', 'джджх');

      -- 4. джг → джх (negative lookahead через regex)
      normalized_synonyms := regexp_replace(normalized_synonyms, 'джг(?!джх)', 'джх', 'g');

      IF normalized_synonyms != verse_record.synonyms_ua THEN
        changes := array_append(changes, 'synonyms_ua');
      END IF;
    END IF;

    -- Translation
    normalized_translation := verse_record.translation_ua;
    IF normalized_translation IS NOT NULL THEN
      normalized_translation := regexp_replace(normalized_translation, 'н''', 'нь', 'g');
      normalized_translation := regexp_replace(normalized_translation, 'Н''', 'Нь', 'g');
      normalized_translation := replace(normalized_translation, 'санн''яс', 'санньяс');
      normalized_translation := replace(normalized_translation, 'Санн''яс', 'Санньяс');
      normalized_translation := replace(normalized_translation, 'джджг', 'джджх');
      normalized_translation := regexp_replace(normalized_translation, 'джг(?!джх)', 'джх', 'g');

      IF normalized_translation != verse_record.translation_ua THEN
        changes := array_append(changes, 'translation_ua');
      END IF;
    END IF;

    -- Commentary
    normalized_commentary := verse_record.commentary_ua;
    IF normalized_commentary IS NOT NULL THEN
      normalized_commentary := regexp_replace(normalized_commentary, 'н''', 'нь', 'g');
      normalized_commentary := regexp_replace(normalized_commentary, 'Н''', 'Нь', 'g');
      normalized_commentary := replace(normalized_commentary, 'санн''яс', 'санньяс');
      normalized_commentary := replace(normalized_commentary, 'Санн''яс', 'Санньяс');
      normalized_commentary := replace(normalized_commentary, 'джджг', 'джджх');
      normalized_commentary := regexp_replace(normalized_commentary, 'джг(?!джх)', 'джх', 'g');

      IF normalized_commentary != verse_record.commentary_ua THEN
        changes := array_append(changes, 'commentary_ua');
      END IF;
    END IF;

    -- Оновлюємо і повертаємо результат якщо щось змінилося
    IF array_length(changes, 1) > 0 THEN
      UPDATE verses
      SET
        synonyms_ua = normalized_synonyms,
        translation_ua = normalized_translation,
        commentary_ua = normalized_commentary,
        updated_at = NOW()
      WHERE id = verse_record.id;

      -- Повертаємо інформацію про зміни
      verse_id := verse_record.id;
      changed_fields := changes;
      before_sample := LEFT(verse_record.synonyms_ua, 80);
      after_sample := LEFT(normalized_synonyms, 80);
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ФУНКЦІЯ 2: Видалення дублікатів у synonyms_en
-- ============================================================================

CREATE OR REPLACE FUNCTION remove_duplicate_words_in_synonyms()
RETURNS TABLE(verse_id UUID, before_text TEXT, after_text TEXT, removed_count INTEGER) AS $$
DECLARE
  verse_record RECORD;
  words TEXT[];
  unique_words TEXT[];
  word TEXT;
  cleaned_synonyms TEXT;
BEGIN
  FOR verse_record IN
    SELECT v.id, v.synonyms_en
    FROM verses v
    JOIN chapters ch ON v.chapter_id = ch.id
    JOIN books b ON ch.book_id = b.id
    WHERE b.slug LIKE 'cc-%'
      AND v.synonyms_en IS NOT NULL
      AND v.synonyms_en != ''
  LOOP
    -- Розбиваємо на слова
    words := string_to_array(verse_record.synonyms_en, ' ');

    -- Видаляємо дублікати зі збереженням порядку
    unique_words := ARRAY[]::TEXT[];

    FOREACH word IN ARRAY words
    LOOP
      IF NOT (word = ANY(unique_words)) THEN
        unique_words := array_append(unique_words, word);
      END IF;
    END LOOP;

    cleaned_synonyms := array_to_string(unique_words, ' ');

    -- Оновлюємо і повертаємо якщо щось змінилося
    IF cleaned_synonyms != verse_record.synonyms_en THEN
      UPDATE verses
      SET
        synonyms_en = cleaned_synonyms,
        updated_at = NOW()
      WHERE id = verse_record.id;

      verse_id := verse_record.id;
      before_text := verse_record.synonyms_en;
      after_text := cleaned_synonyms;
      removed_count := array_length(words, 1) - array_length(unique_words, 1);
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ВИКОНАННЯ НОРМАЛІЗАЦІЇ
-- ============================================================================

\echo ''
\echo '=== ПОЧИНАЄМО НОРМАЛІЗАЦІЮ УКРАЇНСЬКИХ ТЕКСТІВ ==='
\echo ''

-- Виконуємо нормалізацію українських текстів
SELECT
  verse_id,
  array_to_string(changed_fields, ', ') AS fields_changed,
  LEFT(before_sample, 60) AS before,
  LEFT(after_sample, 60) AS after
FROM normalize_ukrainian_cc_texts();

\echo ''
\echo '=== ПОЧИНАЄМО ВИДАЛЕННЯ ДУБЛІКАТІВ У SYNONYMS_EN ==='
\echo ''

-- Виконуємо видалення дублікатів
SELECT
  verse_id,
  removed_count AS duplicates_removed,
  LEFT(before_text, 60) AS before,
  LEFT(after_text, 60) AS after
FROM remove_duplicate_words_in_synonyms();

-- ============================================================================
-- СТАТИСТИКА ПІСЛЯ НОРМАЛІЗАЦІЇ
-- ============================================================================

\echo ''
\echo '=== СТАТИСТИКА ПІСЛЯ НОРМАЛІЗАЦІЇ ==='

-- Перевіряємо скільки залишилось н' (має бути 0 або дуже мало в коректних випадках)
SELECT
  COUNT(*) AS verses_with_apostrophe_n,
  COUNT(DISTINCT b.slug) AS books_affected
FROM verses v
JOIN chapters ch ON v.chapter_id = ch.id
JOIN books b ON ch.book_id = b.id
WHERE b.slug LIKE 'cc-%'
  AND (v.synonyms_ua LIKE '%н''%' OR v.translation_ua LIKE '%н''%' OR v.commentary_ua LIKE '%н''%');

-- Підрахунок всіх віршів CC
SELECT
  b.slug AS book,
  COUNT(*) AS total_verses,
  COUNT(v.synonyms_ua) AS has_synonyms_ua,
  COUNT(v.translation_ua) AS has_translation_ua,
  COUNT(v.commentary_ua) AS has_commentary_ua
FROM verses v
JOIN chapters ch ON v.chapter_id = ch.id
JOIN books b ON ch.book_id = b.id
WHERE b.slug LIKE 'cc-%'
GROUP BY b.slug
ORDER BY b.slug;

\echo ''
\echo '=== НОРМАЛІЗАЦІЯ ЗАВЕРШЕНА ==='
\echo ''
\echo 'Перевірте результати вище.'
\echo 'Якщо все правильно - база даних оновлена.'
\echo 'Якщо потрібно відкотити зміни - використовуйте резервну копію.'
\echo ''
