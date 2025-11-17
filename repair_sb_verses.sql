-- 🔧 Виправлення віршів Śrīmad-Bhāgavatam
-- ВАЖЛИВО: Спочатку запустіть diagnose_sb_verses.sql щоб побачити що буде виправлено!
-- ВАЖЛИВО: Зробіть backup якщо це можливо!

-- ============================================================
-- КРОК 1: Перевірка перед виправленням
-- ============================================================
\echo '=== ПЕРЕВІРКА: Скільки віршів буде виправлено ==='

WITH book_info AS (
    SELECT id FROM books WHERE slug = 'srimad-bhagavatam' LIMIT 1
),
all_cantos AS (
    SELECT id FROM cantos WHERE book_id = (SELECT id FROM book_info)
),
all_chapters AS (
    SELECT id FROM chapters WHERE canto_id IN (SELECT id FROM all_cantos)
)
SELECT
    'Вірші до виправлення:' as info,
    COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as will_restore_deleted,
    COUNT(*) FILTER (WHERE is_published = false) as will_publish
FROM verses
WHERE chapter_id IN (SELECT id FROM all_chapters)
    AND (deleted_at IS NOT NULL OR is_published = false);

\echo '\n'
\echo '⚠️  УВАГА: Ви збираєтеся виправити вірші Śrīmad-Bhāgavatam'
\echo '⚠️  Це встановить deleted_at = NULL і is_published = true'
\echo '\n'
\echo 'Якщо ви впевнені, виконайте наступні команди:\n'

-- ============================================================
-- КРОК 2: Відновлення віршів (РОЗКОМЕНТУЙТЕ ЦЕЙ БЛОК)
-- ============================================================

-- BEGIN;  -- Почати транзакцію

-- -- 2.1. Відновити deleted вірші
-- WITH book_info AS (
--     SELECT id FROM books WHERE slug = 'srimad-bhagavatam' LIMIT 1
-- ),
-- all_cantos AS (
--     SELECT id FROM cantos WHERE book_id = (SELECT id FROM book_info)
-- ),
-- all_chapters AS (
--     SELECT id FROM chapters WHERE canto_id IN (SELECT id FROM all_cantos)
-- )
-- UPDATE verses
-- SET deleted_at = NULL
-- WHERE chapter_id IN (SELECT id FROM all_chapters)
--     AND deleted_at IS NOT NULL;

-- -- 2.2. Опублікувати unpublished вірші
-- WITH book_info AS (
--     SELECT id FROM books WHERE slug = 'srimad-bhagavatam' LIMIT 1
-- ),
-- all_cantos AS (
--     SELECT id FROM cantos WHERE book_id = (SELECT id FROM book_info)
-- ),
-- all_chapters AS (
--     SELECT id FROM chapters WHERE canto_id IN (SELECT id FROM all_cantos)
-- )
-- UPDATE verses
-- SET is_published = true
-- WHERE chapter_id IN (SELECT id FROM all_chapters)
--     AND is_published = false;

-- -- 2.3. Показати результат
-- \echo '\n=== РЕЗУЛЬТАТ: Скільки віршів виправлено ===\n'

-- WITH book_info AS (
--     SELECT id FROM books WHERE slug = 'srimad-bhagavatam' LIMIT 1
-- ),
-- all_cantos AS (
--     SELECT id FROM cantos WHERE book_id = (SELECT id FROM book_info)
-- ),
-- all_chapters AS (
--     SELECT id FROM chapters WHERE canto_id IN (SELECT id FROM all_cantos)
-- )
-- SELECT
--     'Після виправлення:' as info,
--     COUNT(*) as total_verses,
--     COUNT(*) FILTER (WHERE deleted_at IS NULL AND is_published = true) as visible_verses,
--     COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as still_deleted,
--     COUNT(*) FILTER (WHERE is_published = false) as still_unpublished
-- FROM verses
-- WHERE chapter_id IN (SELECT id FROM all_chapters);

-- COMMIT;  -- Завершити транзакцію (закоментуйте цей рядок якщо щось пішло не так і треба ROLLBACK)

\echo '\n✅ Виправлення завершено! Перевірте сайт.\n'
