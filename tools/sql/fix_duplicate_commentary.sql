-- ============================================================================
-- FIX DUPLICATE PARAGRAPHS IN COMMENTARY/PURPORT
-- ============================================================================
-- Проблема: під час імпорту деякі параграфи в пояснень (commentary_en)
-- дублювалися через неправильний парсинг вкладених HTML елементів.
--
-- Цей скрипт:
-- 1. Знаходить вірші з дубльованими параграфами
-- 2. Видаляє дублікати, зберігаючи порядок
-- ============================================================================

-- Функція для видалення СУСІДНІХ дублікатів РЕЧЕНЬ (безпечно!)
-- Видаляє тільки коли те саме речення йде підряд - це точно помилка імпорту
-- Приклад: "Text here. Text here." → "Text here."
CREATE OR REPLACE FUNCTION remove_adjacent_duplicate_sentences(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    sentences TEXT[];
    result_sentences TEXT[] := '{}';
    sent TEXT;
    prev_sent TEXT := '';
BEGIN
    IF input_text IS NULL OR input_text = '' THEN
        RETURN input_text;
    END IF;

    -- Розбиваємо на речення (по ". " - крапка з пробілом)
    sentences := regexp_split_to_array(input_text, '\.\s+');

    FOREACH sent IN ARRAY sentences LOOP
        IF trim(sent) = '' THEN
            CONTINUE;
        END IF;

        -- Додаємо тільки якщо НЕ збігається з попереднім реченням
        IF lower(trim(sent)) != lower(trim(prev_sent)) THEN
            result_sentences := array_append(result_sentences, trim(sent));
        END IF;
        prev_sent := sent;
    END LOOP;

    RETURN array_to_string(result_sentences, '. ') ||
           CASE WHEN input_text ~ '\.$' THEN '.' ELSE '' END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- ПЕРЕВІРКА: Знайти вірші з потенційними дублікатами
-- ============================================================================
-- Ця команда показує кількість віршів з дублікатами ДО виправлення

SELECT
    'commentary_en' as field,
    COUNT(*) as verses_with_duplicates
FROM verses
WHERE commentary_en IS NOT NULL
  AND commentary_en != ''
  AND length(remove_adjacent_duplicate_sentences(commentary_en)) < length(commentary_en)

UNION ALL

SELECT
    'commentary_uk' as field,
    COUNT(*) as verses_with_duplicates
FROM verses
WHERE commentary_uk IS NOT NULL
  AND commentary_uk != ''
  AND length(remove_adjacent_duplicate_sentences(commentary_uk)) < length(commentary_uk);

-- ============================================================================
-- ВИПРАВЛЕННЯ: Оновити commentary_en (видалити дублікати)
-- ============================================================================
-- УВАГА: Спочатку запустіть SELECT вище, щоб перевірити кількість
-- Потім РОЗКОМЕНТУЙТЕ команду UPDATE нижче

/*
UPDATE verses
SET commentary_en = remove_adjacent_duplicate_sentences(commentary_en)
WHERE commentary_en IS NOT NULL
  AND commentary_en != ''
  AND length(remove_adjacent_duplicate_sentences(commentary_en)) < length(commentary_en);
*/

-- ============================================================================
-- ВИПРАВЛЕННЯ: Оновити commentary_uk (видалити дублікати)
-- ============================================================================

/*
UPDATE verses
SET commentary_uk = remove_adjacent_duplicate_sentences(commentary_uk)
WHERE commentary_uk IS NOT NULL
  AND commentary_uk != ''
  AND length(remove_adjacent_duplicate_sentences(commentary_uk)) < length(commentary_uk);
*/

-- ============================================================================
-- ПЕРЕВІРКА КОНКРЕТНОГО ВІРША
-- ============================================================================
-- Замініть chapter_id та verse_number на потрібні значення

/*
SELECT
    v.verse_number,
    c.chapter_number,
    length(v.commentary_en) as original_length,
    length(remove_adjacent_duplicate_sentences(v.commentary_en)) as fixed_length,
    v.commentary_en as original,
    remove_adjacent_duplicate_sentences(v.commentary_en) as fixed
FROM verses v
JOIN chapters c ON c.id = v.chapter_id
WHERE c.chapter_number = 6
  AND v.verse_number = '264'
LIMIT 1;
*/

-- ============================================================================
-- ВИДАЛЕННЯ ФУНКЦІЇ (опційно, після завершення)
-- ============================================================================
-- DROP FUNCTION IF EXISTS remove_adjacent_duplicate_sentences(TEXT);
