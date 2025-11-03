-- ============================================================================
-- SQL функції для нормалізації українських текстів Чайтанья-чарітамріти
-- ============================================================================

-- 1. Функція для нормалізації українських текстів (synonyms_ua, translation_ua, commentary_ua)
CREATE OR REPLACE FUNCTION normalize_ukrainian_cc_texts()
RETURNS void AS $$
DECLARE
  verse_record RECORD;
  normalized_synonyms TEXT;
  normalized_translation TEXT;
  normalized_commentary TEXT;
  rows_updated INTEGER := 0;
BEGIN
  -- Обробляємо всі вірші з книги CC (Чайтанья-чарітамріта)
  FOR verse_record IN
    SELECT v.id, v.synonyms_ua, v.translation_ua, v.commentary_ua
    FROM verses v
    JOIN chapters ch ON v.chapter_id = ch.id
    JOIN books b ON ch.book_id = b.id
    WHERE b.slug LIKE 'cc-%'  -- CC-adi, CC-madhya, CC-antya
      AND (v.synonyms_ua IS NOT NULL OR v.translation_ua IS NOT NULL OR v.commentary_ua IS NOT NULL)
  LOOP
    -- Нормалізуємо кожне поле

    -- Synonyms
    normalized_synonyms := verse_record.synonyms_ua;
    IF normalized_synonyms IS NOT NULL THEN
      -- 1. Апостроф після "н" → м'який знак (н' → нь)
      normalized_synonyms := regexp_replace(normalized_synonyms, 'н''', 'нь', 'g');
      normalized_synonyms := regexp_replace(normalized_synonyms, 'Н''', 'Нь', 'g');

      -- 2. Санн'ясі → Санньясі (всі відмінки)
      normalized_synonyms := replace(normalized_synonyms, 'санн''яс', 'санньяс');
      normalized_synonyms := replace(normalized_synonyms, 'Санн''яс', 'Санньяс');

      -- 3. джджг → джджх
      normalized_synonyms := replace(normalized_synonyms, 'джджг', 'джджх');

      -- 4. джг → джх (але НЕ замінювати в "джджг" - вже оброблено вище)
      normalized_synonyms := regexp_replace(normalized_synonyms, 'джг(?!джх)', 'джх', 'g');
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
    END IF;

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

-- 2. Функція для видалення дублікатів слів у synonyms_en
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
  -- Обробляємо всі вірші з книги CC з заповненим synonyms_en
  FOR verse_record IN
    SELECT v.id, v.synonyms_en
    FROM verses v
    JOIN chapters ch ON v.chapter_id = ch.id
    JOIN books b ON ch.book_id = b.id
    WHERE b.slug LIKE 'cc-%'
      AND v.synonyms_en IS NOT NULL
      AND v.synonyms_en != ''
  LOOP
    -- Розбиваємо на слова (по пробілах)
    words := string_to_array(verse_record.synonyms_en, ' ');

    -- Видаляємо дублікати зі збереженням порядку
    unique_words := ARRAY[]::TEXT[];

    FOREACH word IN ARRAY words
    LOOP
      -- Додаємо слово тільки якщо його ще немає в unique_words
      IF NOT (word = ANY(unique_words)) THEN
        unique_words := array_append(unique_words, word);
      END IF;
    END LOOP;

    -- З'єднуємо назад в рядок
    cleaned_synonyms := array_to_string(unique_words, ' ');

    -- Оновлюємо тільки якщо щось змінилося
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

-- Комент для документації
COMMENT ON FUNCTION normalize_ukrainian_cc_texts() IS
'Нормалізує українські тексти Чайтанья-чарітамріти: виправляє н''→нь, санн''ясі→санньясі, джг→джх, джджг→джджх';

COMMENT ON FUNCTION remove_duplicate_words_in_synonyms() IS
'Видаляє повторювані слова з synonyms_en зі збереженням порядку';
