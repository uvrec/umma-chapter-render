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

-- Функція для видалення СУСІДНІХ дублікатів параграфів (безпечно!)
-- Видаляє тільки коли той самий текст йде підряд - це точно помилка імпорту
CREATE OR REPLACE FUNCTION remove_adjacent_duplicate_paragraphs(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    paragraphs TEXT[];
    result_paragraphs TEXT[] := '{}';
    para TEXT;
    prev_hash TEXT := '';
    para_hash TEXT;
BEGIN
    IF input_text IS NULL OR input_text = '' THEN
        RETURN input_text;
    END IF;

    -- Розбиваємо на параграфи (роздільник: подвійний перенос рядка)
    paragraphs := string_to_array(input_text, E'\n\n');

    -- Проходимо по кожному параграфу
    FOREACH para IN ARRAY paragraphs LOOP
        -- Нормалізуємо текст для порівняння (прибираємо зайві пробіли, lowercase)
        para_hash := lower(regexp_replace(trim(para), '\s+', ' ', 'g'));

        -- Пропускаємо порожні параграфи
        IF length(para_hash) < 10 THEN
            CONTINUE;
        END IF;

        -- Додаємо тільки якщо НЕ збігається з ПОПЕРЕДНІМ (сусіднім) параграфом
        IF para_hash != prev_hash THEN
            result_paragraphs := array_append(result_paragraphs, trim(para));
            prev_hash := para_hash;
        END IF;
    END LOOP;

    RETURN array_to_string(result_paragraphs, E'\n\n');
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
  AND length(remove_adjacent_duplicate_paragraphs(commentary_en)) < length(commentary_en)

UNION ALL

SELECT
    'commentary_ua' as field,
    COUNT(*) as verses_with_duplicates
FROM verses
WHERE commentary_ua IS NOT NULL
  AND commentary_ua != ''
  AND length(remove_adjacent_duplicate_paragraphs(commentary_ua)) < length(commentary_ua);

-- ============================================================================
-- ВИПРАВЛЕННЯ: Оновити commentary_en (видалити дублікати)
-- ============================================================================
-- УВАГА: Спочатку запустіть SELECT вище, щоб перевірити кількість
-- Потім РОЗКОМЕНТУЙТЕ команду UPDATE нижче

/*
UPDATE verses
SET commentary_en = remove_adjacent_duplicate_paragraphs(commentary_en)
WHERE commentary_en IS NOT NULL
  AND commentary_en != ''
  AND length(remove_adjacent_duplicate_paragraphs(commentary_en)) < length(commentary_en);
*/

-- ============================================================================
-- ВИПРАВЛЕННЯ: Оновити commentary_ua (видалити дублікати)
-- ============================================================================

/*
UPDATE verses
SET commentary_ua = remove_adjacent_duplicate_paragraphs(commentary_ua)
WHERE commentary_ua IS NOT NULL
  AND commentary_ua != ''
  AND length(remove_adjacent_duplicate_paragraphs(commentary_ua)) < length(commentary_ua);
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
    length(remove_adjacent_duplicate_paragraphs(v.commentary_en)) as fixed_length,
    v.commentary_en as original,
    remove_adjacent_duplicate_paragraphs(v.commentary_en) as fixed
FROM verses v
JOIN chapters c ON c.id = v.chapter_id
WHERE c.chapter_number = 6
  AND v.verse_number = '264'
LIMIT 1;
*/

-- ============================================================================
-- ВИДАЛЕННЯ ФУНКЦІЇ (опційно, після завершення)
-- ============================================================================
-- DROP FUNCTION IF EXISTS remove_adjacent_duplicate_paragraphs(TEXT);
