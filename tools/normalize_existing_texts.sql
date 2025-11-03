-- ============================================================================
-- Скрипт нормалізації існуючих текстів Чайтанья-чарітамріти
-- Об'єднує розширені правила з main та RPC структуру для UI
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
--   - Застосовує правила: н'→нь (крім ачар'я/антар'ямі), санньяс, джг→джх
--   - Виправляє mojibake, діакритику, імена, придихові приголосні
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
-- ДОПОМІЖНА ФУНКЦІЯ: Нормалізація одного текстового поля
-- ============================================================================

CREATE OR REPLACE FUNCTION normalize_ukrainian_text(text_input TEXT)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    result := text_input;

    IF result IS NULL OR result = '' THEN
        RETURN result;
    END IF;

    -- 1. ВИПРАВЛЕННЯ MOJIBAKE
    result := REPLACE(result, E'\ufeff', ''); -- BOM
    result := REPLACE(result, E'\u00A0', ' '); -- non-breaking space
    result := REPLACE(result, 'â€™', '''');
    result := REPLACE(result, 'â€œ', '"');
    result := REPLACE(result, 'â€', '"');

    -- 2. ВИПРАВЛЕННЯ НЕПРАВИЛЬНИХ ДІАКРИТИЧНИХ СИМВОЛІВ
    result := REPLACE(result, 'а̣', 'а');
    result := REPLACE(result, 'і̣', 'і');
    result := REPLACE(result, 'е̣', 'е');
    result := REPLACE(result, 'о̣', 'о');
    result := REPLACE(result, 'у̣', 'у');

    -- 3. ВИПРАВЛЕННЯ ІМЕН ТА ТЕРМІНІВ
    -- Чайтанья (нйа → ння)
    result := REGEXP_REPLACE(result, 'Шрі Чайтан''я-чарітамріта', 'Шрі Чайтанья-чарітамріта', 'g');
    result := REGEXP_REPLACE(result, 'Чайтан''я-чарітамріта', 'Чайтанья-чарітамріта', 'g');
    result := REGEXP_REPLACE(result, 'Чайтан''я-бгаґавата', 'Чайтанья-бгаґавата', 'g');
    result := REGEXP_REPLACE(result, '\mЧайтан''я\M', 'Чайтанья', 'g');
    result := REGEXP_REPLACE(result, '\mЧайтан''ї\M', 'Чайтаньї', 'g');
    result := REGEXP_REPLACE(result, '\mЧайтан''ю\M', 'Чайтанью', 'g');
    result := REGEXP_REPLACE(result, '\mчаітанйа\M', 'Чайтанья', 'gi');
    result := REGEXP_REPLACE(result, '\mчаітанйі\M', 'Чайтаньї', 'gi');
    result := REGEXP_REPLACE(result, '\mчаітанйу\M', 'Чайтанью', 'gi');

    -- Нітьянанда
    result := REGEXP_REPLACE(result, '\mНіт''янанд', 'Нітьянанд', 'g');
    result := REGEXP_REPLACE(result, '\mніт''янанд', 'нітьянанд', 'g');

    -- Інші імена
    result := REGEXP_REPLACE(result, '\mҐопінатга\M', 'Ґопінатха', 'g');
    result := REGEXP_REPLACE(result, '\mҐопінатгу\M', 'Ґопінатху', 'g');
    result := REGEXP_REPLACE(result, '\mенерґі', 'енергі', 'g');
    result := REGEXP_REPLACE(result, '\mАчйут', 'Ачьют', 'g');
    result := REGEXP_REPLACE(result, '\mАдвайт', 'Адваіт', 'g');

    -- Санньяса
    result := REGEXP_REPLACE(result, '\mсанн''яс', 'санньяс', 'g');
    result := REGEXP_REPLACE(result, '\mСанн''яс', 'Санньяс', 'g');

    -- Специфічні виправлення
    result := REGEXP_REPLACE(result, '\mпроджджгіт', 'проджджхіт', 'g');
    result := REGEXP_REPLACE(result, '\mДжгарікханд', 'Джхарікханд', 'g');

    -- 4. ВИПРАВЛЕННЯ ПРИДИХОВИХ ПРИГОЛОСНИХ
    result := REGEXP_REPLACE(result, 'джджг', 'джджх', 'g');
    result := REGEXP_REPLACE(result, 'Джджг', 'Джджх', 'g');
    result := REGEXP_REPLACE(result, 'джг', 'джх', 'g');
    result := REGEXP_REPLACE(result, 'Джг', 'Джх', 'g');
    result := REGEXP_REPLACE(result, 'тг', 'тх', 'g');
    result := REGEXP_REPLACE(result, 'Тг', 'Тх', 'g');
    result := REGEXP_REPLACE(result, 'кг', 'кх', 'g');
    result := REGEXP_REPLACE(result, 'Кг', 'Кх', 'g');
    result := REGEXP_REPLACE(result, 'пг', 'пх', 'g');
    result := REPLACE(result, 'Пг', 'Пх', 'g');
    result := REGEXP_REPLACE(result, 'чг', 'чх', 'g');
    result := REGEXP_REPLACE(result, 'Чг', 'Чх', 'g');

    -- 5. НОРМАЛІЗАЦІЯ АПОСТРОФА ПІСЛЯ "Н"
    -- н' → нь (КРІМ виключень: ачар'я, антар'ямі)
    -- Зберігаємо виключення
    result := REPLACE(result, 'ачар''я', '___ACHARYA___');
    result := REPLACE(result, 'Ачар''я', '___ACHARYA_CAP___');
    result := REPLACE(result, 'антар''ямі', '___ANTARYAMI___');
    result := REPLACE(result, 'Антар''ямі', '___ANTARYAMI_CAP___');
    result := REPLACE(result, 'антар''ям', '___ANTARYAM___');
    result := REPLACE(result, 'Антар''ям', '___ANTARYAM_CAP___');

    -- Замінюємо н' → нь
    result := REPLACE(result, 'н''', 'нь');
    result := REPLACE(result, 'Н''', 'Нь');

    -- Відновлюємо виключення
    result := REPLACE(result, '___ACHARYA___', 'ачар''я');
    result := REPLACE(result, '___ACHARYA_CAP___', 'Ачар''я');
    result := REPLACE(result, '___ANTARYAMI___', 'антар''ямі');
    result := REPLACE(result, '___ANTARYAMI_CAP___', 'Антар''ямі');
    result := REPLACE(result, '___ANTARYAM___', 'антар''ям');
    result := REPLACE(result, '___ANTARYAM_CAP___', 'Антар''ям');

    -- 6. ВИДАЛЕННЯ ЗАЙВИХ ПРОБІЛІВ
    result := REGEXP_REPLACE(result, '\s+', ' ', 'g');
    result := TRIM(result);

    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- ФУНКЦІЯ 1: Нормалізація українських текстів (з детальним виводом)
-- ============================================================================

CREATE OR REPLACE FUNCTION normalize_ukrainian_cc_texts_detailed()
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

    -- Нормалізуємо
    normalized_synonyms := normalize_ukrainian_text(verse_record.synonyms_ua);
    normalized_translation := normalize_ukrainian_text(verse_record.translation_ua);
    normalized_commentary := normalize_ukrainian_text(verse_record.commentary_ua);

    IF normalized_synonyms != verse_record.synonyms_ua THEN
      changes := array_append(changes, 'synonyms_ua');
    END IF;

    IF normalized_translation != verse_record.translation_ua THEN
      changes := array_append(changes, 'translation_ua');
    END IF;

    IF normalized_commentary != verse_record.commentary_ua THEN
      changes := array_append(changes, 'commentary_ua');
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
-- ФУНКЦІЯ 2: Видалення дублікатів у synonyms_en (з детальним виводом)
-- ============================================================================

CREATE OR REPLACE FUNCTION remove_duplicate_words_in_synonyms_detailed()
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
    words := string_to_array(verse_record.synonyms_en, ' ');
    unique_words := ARRAY[]::TEXT[];

    FOREACH word IN ARRAY words
    LOOP
      IF NOT (word = ANY(unique_words)) THEN
        unique_words := array_append(unique_words, word);
      END IF;
    END LOOP;

    cleaned_synonyms := array_to_string(unique_words, ' ');

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
FROM normalize_ukrainian_cc_texts_detailed();

\echo ''
\echo '=== ПОЧИНАЄМО ВИДАЛЕННЯ ДУБЛІКАТІВ У SYNONYMS_EN ==='
\echo ''

-- Виконуємо видалення дублікатів
SELECT
  verse_id,
  removed_count AS duplicates_removed,
  LEFT(before_text, 60) AS before,
  LEFT(after_text, 60) AS after
FROM remove_duplicate_words_in_synonyms_detailed();

-- ============================================================================
-- СТАТИСТИКА ПІСЛЯ НОРМАЛІЗАЦІЇ
-- ============================================================================

\echo ''
\echo '=== СТАТИСТИКА ПІСЛЯ НОРМАЛІЗАЦІЇ ==='

-- Перевіряємо скільки залишилось н' (має бути 0 крім ачар'я/антар'ямі)
SELECT
  COUNT(*) AS verses_with_apostrophe_n,
  COUNT(DISTINCT b.slug) AS books_affected
FROM verses v
JOIN chapters ch ON v.chapter_id = ch.id
JOIN books b ON ch.book_id = b.id
WHERE b.slug LIKE 'cc-%'
  AND (v.synonyms_ua LIKE '%н''%' OR v.translation_ua LIKE '%н''%' OR v.commentary_ua LIKE '%н''%')
  AND v.synonyms_ua NOT LIKE '%ачар''я%'
  AND v.synonyms_ua NOT LIKE '%антар''ямі%';

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
\echo 'ВИКЛЮЧЕННЯ: слова "ачар''я" та "антар''ямі" зберігають апостроф'
\echo ''
