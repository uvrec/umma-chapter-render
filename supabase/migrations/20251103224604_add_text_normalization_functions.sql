-- ============================================================================
-- SQL функції для нормалізації українських текстів Чайтанья-чарітамріти
-- Об'єднує розширені правила нормалізації з RPC інтерфейсом для UI
-- ============================================================================

-- ДОПОМІЖНА ФУНКЦІЯ: Нормалізація одного текстового поля
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
    result := REGEXP_REPLACE(result, 'Пг', 'Пх', 'g');
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
-- RPC ФУНКЦІЯ 1: Нормалізація українських текстів
-- ============================================================================

CREATE OR REPLACE FUNCTION normalize_ukrainian_cc_texts()
RETURNS void AS $$
DECLARE
  verse_record RECORD;
  normalized_synonyms TEXT;
  normalized_translation TEXT;
  normalized_commentary TEXT;
  rows_updated INTEGER := 0;
BEGIN
  FOR verse_record IN
    SELECT v.id, v.synonyms_ua, v.translation_ua, v.commentary_ua
    FROM verses v
    JOIN chapters ch ON v.chapter_id = ch.id
    JOIN books b ON ch.book_id = b.id
    WHERE b.slug LIKE 'cc-%'
      AND (v.synonyms_ua IS NOT NULL OR v.translation_ua IS NOT NULL OR v.commentary_ua IS NOT NULL)
  LOOP
    -- Нормалізуємо через допоміжну функцію
    normalized_synonyms := normalize_ukrainian_text(verse_record.synonyms_ua);
    normalized_translation := normalize_ukrainian_text(verse_record.translation_ua);
    normalized_commentary := normalize_ukrainian_text(verse_record.commentary_ua);

    -- Оновлюємо тільки якщо щось змінилося
    IF normalized_synonyms != verse_record.synonyms_ua
       OR normalized_translation != verse_record.translation_ua
       OR normalized_commentary != verse_record.commentary_ua THEN

      UPDATE verses
      SET
        synonyms_ua = normalized_synonyms,
        translation_ua = normalized_translation,
        commentary_ua = normalized_commentary,
        updated_at = NOW()
      WHERE id = verse_record.id;

      rows_updated := rows_updated + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Нормалізовано % віршів', rows_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RPC ФУНКЦІЯ 2: Видалення дублікатів у synonyms_en
-- ============================================================================

CREATE OR REPLACE FUNCTION remove_duplicate_words_in_synonyms()
RETURNS void AS $$
DECLARE
  verse_record RECORD;
  words TEXT[];
  unique_words TEXT[];
  word TEXT;
  cleaned_synonyms TEXT;
  rows_updated INTEGER := 0;
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

      rows_updated := rows_updated + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Очищено synonyms_en у % віршах', rows_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Коменти для документації
COMMENT ON FUNCTION normalize_ukrainian_text(TEXT) IS
'Допоміжна функція: нормалізує український текст згідно з академічними правилами транслітерації. Зберігає виключення: ачар''я, антар''ямі.';

COMMENT ON FUNCTION normalize_ukrainian_cc_texts() IS
'RPC функція для UI: нормалізує українські тексти Чайтанья-чарітамріти (synonyms_ua, translation_ua, commentary_ua)';

COMMENT ON FUNCTION remove_duplicate_words_in_synonyms() IS
'RPC функція для UI: видаляє повторювані слова з synonyms_en зі збереженням порядку';
