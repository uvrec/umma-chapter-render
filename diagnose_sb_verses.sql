-- 🔍 Діагностика стану віршів Śrīmad-Bhāgavatam
-- Виконайте цей скрипт у Supabase SQL Editor

-- ============================================================
-- 1. Знайти книгу Śrīmad-Bhāgavatam
-- ============================================================
SELECT
    id,
    slug,
    title_ua,
    title_en,
    is_published,
    has_cantos
FROM books
WHERE slug IN ('srimad-bhagavatam', 'bhagavatam', 'sb')
ORDER BY slug;

\echo '\n--- Книга знайдена, використовуйте ID з результату вище ---\n'

-- ============================================================
-- 2. Загальна статистика по всіх віршах
-- ============================================================
-- ЗАМІНІТЬ 'BOOK_ID_HERE' на реальний ID книги з результату вище!

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
    'ЗАГАЛЬНА СТАТИСТИКА' as category,
    COUNT(*) as total_verses,
    COUNT(*) FILTER (WHERE deleted_at IS NULL) as not_deleted,
    COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted,
    COUNT(*) FILTER (WHERE is_published = true) as published,
    COUNT(*) FILTER (WHERE is_published = false) as unpublished,
    COUNT(*) FILTER (WHERE translation_ua IS NULL OR translation_ua = '') as empty_ua,
    COUNT(*) FILTER (WHERE translation_en IS NULL OR translation_en = '') as empty_en,
    COUNT(*) FILTER (WHERE
        deleted_at IS NULL
        AND is_published = true
        AND (translation_ua IS NOT NULL AND translation_ua != '')
    ) as visible_verses
FROM verses
WHERE chapter_id IN (SELECT id FROM all_chapters);

-- ============================================================
-- 3. Статистика по кожній пісні
-- ============================================================
WITH book_info AS (
    SELECT id FROM books WHERE slug = 'srimad-bhagavatam' LIMIT 1
)
SELECT
    c.canto_number,
    c.title_ua as canto_title,
    COUNT(DISTINCT ch.id) as chapters_count,
    COUNT(v.id) as total_verses,
    COUNT(v.id) FILTER (WHERE v.deleted_at IS NULL AND v.is_published = true) as visible_verses,
    COUNT(v.id) FILTER (WHERE v.deleted_at IS NOT NULL) as deleted_verses,
    COUNT(v.id) FILTER (WHERE v.is_published = false) as unpublished_verses
FROM cantos c
LEFT JOIN chapters ch ON ch.canto_id = c.id
LEFT JOIN verses v ON v.chapter_id = ch.id
WHERE c.book_id = (SELECT id FROM book_info)
GROUP BY c.canto_number, c.title_ua
ORDER BY c.canto_number;

-- ============================================================
-- 4. Детальна статистика по главах (тільки проблемні)
-- ============================================================
-- Показує тільки глави де є проблеми (deleted або unpublished вірші)

WITH book_info AS (
    SELECT id FROM books WHERE slug = 'srimad-bhagavatam' LIMIT 1
)
SELECT
    canto.canto_number,
    ch.chapter_number,
    ch.title_ua as chapter_title,
    COUNT(v.id) as total_verses,
    COUNT(v.id) FILTER (WHERE v.deleted_at IS NULL AND v.is_published = true) as visible,
    COUNT(v.id) FILTER (WHERE v.deleted_at IS NOT NULL) as deleted,
    COUNT(v.id) FILTER (WHERE v.is_published = false) as unpublished,
    COUNT(v.id) FILTER (WHERE v.translation_ua IS NULL OR v.translation_ua = '') as empty_ua
FROM chapters ch
JOIN cantos canto ON canto.id = ch.canto_id
LEFT JOIN verses v ON v.chapter_id = ch.id
WHERE canto.book_id = (SELECT id FROM book_info)
GROUP BY canto.canto_number, ch.chapter_number, ch.title_ua
HAVING
    COUNT(v.id) FILTER (WHERE v.deleted_at IS NOT NULL) > 0
    OR COUNT(v.id) FILTER (WHERE v.is_published = false) > 0
ORDER BY canto.canto_number, ch.chapter_number;

-- ============================================================
-- 5. Приклади проблемних віршів (перші 20)
-- ============================================================
-- Показує конкретні вірші що не відображаються

WITH book_info AS (
    SELECT id FROM books WHERE slug = 'srimad-bhagavatam' LIMIT 1
),
all_cantos AS (
    SELECT id FROM cantos WHERE book_id = (SELECT id FROM book_info)
),
all_chapters AS (
    SELECT ch.id, canto.canto_number, ch.chapter_number, ch.title_ua
    FROM chapters ch
    JOIN cantos canto ON canto.id = ch.canto_id
    WHERE ch.canto_id IN (SELECT id FROM all_cantos)
)
SELECT
    ac.canto_number,
    ac.chapter_number,
    v.verse_number,
    v.is_published,
    v.deleted_at IS NOT NULL as is_deleted,
    LENGTH(v.translation_ua) as ua_length,
    LENGTH(v.translation_en) as en_length,
    CASE
        WHEN v.deleted_at IS NOT NULL THEN 'DELETED'
        WHEN v.is_published = false THEN 'UNPUBLISHED'
        WHEN (v.translation_ua IS NULL OR v.translation_ua = '')
             AND (v.translation_en IS NULL OR v.translation_en = '') THEN 'EMPTY_TRANSLATIONS'
        ELSE 'OK'
    END as problem
FROM verses v
JOIN all_chapters ac ON ac.id = v.chapter_id
WHERE
    v.deleted_at IS NOT NULL
    OR v.is_published = false
    OR (v.translation_ua IS NULL OR v.translation_ua = '')
ORDER BY ac.canto_number, ac.chapter_number, v.verse_number
LIMIT 20;

-- ============================================================
-- 6. Час останніх змін (коли дані були пошкоджені)
-- ============================================================
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
    DATE_TRUNC('minute', created_at) as time_bucket,
    COUNT(*) as verses_count,
    COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_count,
    COUNT(*) FILTER (WHERE is_published = false) as unpublished_count
FROM verses
WHERE chapter_id IN (SELECT id FROM all_chapters)
GROUP BY DATE_TRUNC('minute', created_at)
HAVING
    COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) > 0
    OR COUNT(*) FILTER (WHERE is_published = false) > 10
ORDER BY time_bucket DESC
LIMIT 10;

\echo '\n=== Діагностика завершена ===\n'
\echo 'Якщо є deleted або unpublished вірші, використайте repair_sb_verses.sql для виправлення\n'
