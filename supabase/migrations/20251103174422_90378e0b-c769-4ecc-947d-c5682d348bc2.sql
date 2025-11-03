-- Функція для нормалізації українських текстів Чайтанья-чарітамріти
CREATE OR REPLACE FUNCTION normalize_ukrainian_cc_texts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  verse_record RECORD;
  normalized_synonyms TEXT;
  normalized_translation TEXT;
  normalized_commentary TEXT;
BEGIN
  -- Тільки Чайтанья-чарітамріта (book slug = 'scc')
  FOR verse_record IN 
    SELECT v.id, v.synonyms_ua, v.translation_ua, v.commentary_ua
    FROM verses v
    JOIN chapters ch ON v.chapter_id = ch.id
    JOIN books b ON ch.book_id = b.id
    WHERE b.slug = 'scc'
      AND (v.synonyms_ua IS NOT NULL 
           OR v.translation_ua IS NOT NULL 
           OR v.commentary_ua IS NOT NULL)
  LOOP
    -- Застосувати нормалізацію
    normalized_synonyms := verse_record.synonyms_ua;
    normalized_translation := verse_record.translation_ua;
    normalized_commentary := verse_record.commentary_ua;
    
    -- Правило 1: Апостроф після н → м'який знак (н' → нь, Н' → Нь)
    IF normalized_synonyms IS NOT NULL THEN
      normalized_synonyms := REGEXP_REPLACE(normalized_synonyms, 'н''', 'нь', 'g');
      normalized_synonyms := REGEXP_REPLACE(normalized_synonyms, 'Н''', 'Нь', 'g');
    END IF;
    IF normalized_translation IS NOT NULL THEN
      normalized_translation := REGEXP_REPLACE(normalized_translation, 'н''', 'нь', 'g');
      normalized_translation := REGEXP_REPLACE(normalized_translation, 'Н''', 'Нь', 'g');
    END IF;
    IF normalized_commentary IS NOT NULL THEN
      normalized_commentary := REGEXP_REPLACE(normalized_commentary, 'н''', 'нь', 'g');
      normalized_commentary := REGEXP_REPLACE(normalized_commentary, 'Н''', 'Нь', 'g');
    END IF;
    
    -- Правило 2: Санн'ясі → Санньясі (всі форми: Санн'яс + і/у/а/о/ю)
    IF normalized_synonyms IS NOT NULL THEN
      normalized_synonyms := REGEXP_REPLACE(normalized_synonyms, 'Санн''яс([іуаою])', 'Санньяс\1', 'g');
      normalized_synonyms := REGEXP_REPLACE(normalized_synonyms, 'санн''яс([іуаою])', 'санньяс\1', 'g');
    END IF;
    IF normalized_translation IS NOT NULL THEN
      normalized_translation := REGEXP_REPLACE(normalized_translation, 'Санн''яс([іуаою])', 'Санньяс\1', 'g');
      normalized_translation := REGEXP_REPLACE(normalized_translation, 'санн''яс([іуаою])', 'санньяс\1', 'g');
    END IF;
    IF normalized_commentary IS NOT NULL THEN
      normalized_commentary := REGEXP_REPLACE(normalized_commentary, 'Санн''яс([іуаою])', 'Санньяс\1', 'g');
      normalized_commentary := REGEXP_REPLACE(normalized_commentary, 'санн''яс([іуаою])', 'санньяс\1', 'g');
    END IF;
    
    -- Правило 3: проджджгіта → проджджхіта
    IF normalized_synonyms IS NOT NULL THEN
      normalized_synonyms := REPLACE(normalized_synonyms, 'проджджгіта', 'проджджхіта');
      normalized_synonyms := REPLACE(normalized_synonyms, 'Проджджгіта', 'Проджджхіта');
    END IF;
    IF normalized_translation IS NOT NULL THEN
      normalized_translation := REPLACE(normalized_translation, 'проджджгіта', 'проджджхіта');
      normalized_translation := REPLACE(normalized_translation, 'Проджджгіта', 'Проджджхіта');
    END IF;
    IF normalized_commentary IS NOT NULL THEN
      normalized_commentary := REPLACE(normalized_commentary, 'проджджгіта', 'проджджхіта');
      normalized_commentary := REPLACE(normalized_commentary, 'Проджджгіта', 'Проджджхіта');
    END IF;
    
    -- Правило 4: джджг → джджх
    IF normalized_synonyms IS NOT NULL THEN
      normalized_synonyms := REPLACE(normalized_synonyms, 'джджг', 'джджх');
    END IF;
    IF normalized_translation IS NOT NULL THEN
      normalized_translation := REPLACE(normalized_translation, 'джджг', 'джджх');
    END IF;
    IF normalized_commentary IS NOT NULL THEN
      normalized_commentary := REPLACE(normalized_commentary, 'джджг', 'джджх');
    END IF;
    
    -- Правило 5: джг → джх (окремо від джджг!)
    IF normalized_synonyms IS NOT NULL THEN
      normalized_synonyms := REPLACE(normalized_synonyms, 'джг', 'джх');
    END IF;
    IF normalized_translation IS NOT NULL THEN
      normalized_translation := REPLACE(normalized_translation, 'джг', 'джх');
    END IF;
    IF normalized_commentary IS NOT NULL THEN
      normalized_commentary := REPLACE(normalized_commentary, 'джг', 'джх');
    END IF;
    
    -- Оновити запис
    UPDATE verses
    SET 
      synonyms_ua = normalized_synonyms,
      translation_ua = normalized_translation,
      commentary_ua = normalized_commentary
    WHERE id = verse_record.id;
  END LOOP;
  
  RAISE NOTICE 'Нормалізація завершена успішно';
END;
$$;

-- Функція для видалення дублів у англійських Synonyms
CREATE OR REPLACE FUNCTION remove_duplicate_words_in_synonyms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  verse_record RECORD;
  cleaned_synonyms TEXT;
  words TEXT[];
  unique_words TEXT[];
  word TEXT;
BEGIN
  FOR verse_record IN 
    SELECT v.id, v.synonyms_en
    FROM verses v
    JOIN chapters ch ON v.chapter_id = ch.id
    JOIN books b ON ch.book_id = b.id
    WHERE b.slug = 'scc'
      AND v.synonyms_en IS NOT NULL
      AND v.synonyms_en != ''
  LOOP
    -- Розділити на слова (по пробілах)
    words := STRING_TO_ARRAY(TRIM(verse_record.synonyms_en), ' ');
    unique_words := ARRAY[]::TEXT[];
    
    -- Видалити дублікати (зберігаючи порядок першої появи)
    FOREACH word IN ARRAY words
    LOOP
      -- Пропустити порожні рядки
      IF TRIM(word) = '' THEN
        CONTINUE;
      END IF;
      
      -- Додати якщо ще немає
      IF NOT (word = ANY(unique_words)) THEN
        unique_words := ARRAY_APPEND(unique_words, word);
      END IF;
    END LOOP;
    
    -- З'єднати назад з одним пробілом
    cleaned_synonyms := ARRAY_TO_STRING(unique_words, ' ');
    
    -- Оновити якщо змінилось
    IF cleaned_synonyms != verse_record.synonyms_en THEN
      UPDATE verses
      SET synonyms_en = cleaned_synonyms
      WHERE id = verse_record.id;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Видалення дублів завершено успішно';
END;
$$;