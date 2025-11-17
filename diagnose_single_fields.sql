-- 🔍 Діагностика застарілих одинарних полів
-- Проблема: В БД існують одинарні поля (transliteration, synonyms)
--           замість подвійних (transliteration_ua/en, synonyms_ua/en)

-- ============================================================
-- 1. Перевірити схему таблиці verses
-- ============================================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'verses'
    AND column_name IN (
        'sanskrit', 'sanskrit_ua', 'sanskrit_en',
        'transliteration', 'transliteration_ua', 'transliteration_en',
        'synonyms', 'synonyms_ua', 'synonyms_en'
    )
ORDER BY column_name;

-- ============================================================
-- 2. Статистика: які поля заповнені
-- ============================================================
SELECT
    COUNT(*) as total_verses,
    COUNT(*) FILTER (WHERE deleted_at IS NULL) as not_deleted,

    -- Sanskrit (одинарне)
    COUNT(sanskrit) FILTER (WHERE sanskrit IS NOT NULL AND sanskrit != '') as has_sanskrit_single,
    COUNT(sanskrit_ua) FILTER (WHERE sanskrit_ua IS NOT NULL AND sanskrit_ua != '') as has_sanskrit_ua,
    COUNT(sanskrit_en) FILTER (WHERE sanskrit_en IS NOT NULL AND sanskrit_en != '') as has_sanskrit_en,

    -- Transliteration
    COUNT(transliteration) FILTER (WHERE transliteration IS NOT NULL AND transliteration != '') as has_translit_single,
    COUNT(transliteration_ua) FILTER (WHERE transliteration_ua IS NOT NULL AND transliteration_ua != '') as has_translit_ua,
    COUNT(transliteration_en) FILTER (WHERE transliteration_en IS NOT NULL AND transliteration_en != '') as has_translit_en,

    -- Synonyms
    COUNT(synonyms) FILTER (WHERE synonyms IS NOT NULL AND synonyms != '') as has_synonyms_single,
    COUNT(synonyms_ua) FILTER (WHERE synonyms_ua IS NOT NULL AND synonyms_ua != '') as has_synonyms_ua,
    COUNT(synonyms_en) FILTER (WHERE synonyms_en IS NOT NULL AND synonyms_en != '') as has_synonyms_en
FROM verses;

-- ============================================================
-- 3. Статистика по книгах
-- ============================================================
SELECT
    b.slug,
    b.title_ua,
    COUNT(*) as total_verses,

    -- Які поля використовуються
    COUNT(v.transliteration) FILTER (WHERE v.transliteration IS NOT NULL) as single_translit,
    COUNT(v.transliteration_ua) FILTER (WHERE v.transliteration_ua IS NOT NULL) as ua_translit,
    COUNT(v.transliteration_en) FILTER (WHERE v.transliteration_en IS NOT NULL) as en_translit,

    COUNT(v.synonyms) FILTER (WHERE v.synonyms IS NOT NULL) as single_synonyms,
    COUNT(v.synonyms_ua) FILTER (WHERE v.synonyms_ua IS NOT NULL) as ua_synonyms,
    COUNT(v.synonyms_en) FILTER (WHERE v.synonyms_en IS NOT NULL) as en_synonyms
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
LEFT JOIN cantos ca ON ca.id = ch.canto_id
LEFT JOIN books b ON b.id = COALESCE(ca.book_id, ch.book_id)
WHERE v.deleted_at IS NULL
GROUP BY b.slug, b.title_ua
ORDER BY b.slug;

-- ============================================================
-- 4. Знайти вірші що використовують ТІЛЬКИ одинарні поля
-- ============================================================
SELECT
    b.slug as book,
    COUNT(*) as verses_using_single_fields
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
LEFT JOIN cantos ca ON ca.id = ch.canto_id
LEFT JOIN books b ON b.id = COALESCE(ca.book_id, ch.book_id)
WHERE v.deleted_at IS NULL
    AND (
        -- Використовує одинарні поля
        (v.transliteration IS NOT NULL AND v.transliteration != '')
        OR (v.synonyms IS NOT NULL AND v.synonyms != '')
    )
    AND (
        -- НЕ використовує подвійні
        (v.transliteration_ua IS NULL OR v.transliteration_ua = '')
        OR (v.transliteration_en IS NULL OR v.transliteration_en = '')
    )
GROUP BY b.slug
ORDER BY verses_using_single_fields DESC;

-- ============================================================
-- 5. Приклади віршів з одинарними полями (для аналізу)
-- ============================================================
SELECT
    b.slug,
    v.verse_number,
    CASE
        WHEN v.transliteration IS NOT NULL THEN LEFT(v.transliteration, 80)
        ELSE NULL
    END as translit_sample,
    CASE
        WHEN v.synonyms IS NOT NULL THEN LEFT(v.synonyms, 80)
        ELSE NULL
    END as synonyms_sample,
    v.transliteration_ua IS NOT NULL as has_ua,
    v.transliteration_en IS NOT NULL as has_en
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
LEFT JOIN cantos ca ON ca.id = ch.canto_id
LEFT JOIN books b ON b.id = COALESCE(ca.book_id, ch.book_id)
WHERE v.deleted_at IS NULL
    AND (v.transliteration IS NOT NULL OR v.synonyms IS NOT NULL)
ORDER BY b.slug, ch.chapter_number, v.verse_number
LIMIT 20;

-- ============================================================
-- 6. Перевірити чи є конфлікти (обидва заповнені)
-- ============================================================
SELECT
    'Конфлікт: обидва translit заповнені' as issue,
    b.slug,
    COUNT(*) as count
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
LEFT JOIN cantos ca ON ca.id = ch.canto_id
LEFT JOIN books b ON b.id = COALESCE(ca.book_id, ch.book_id)
WHERE v.deleted_at IS NULL
    AND v.transliteration IS NOT NULL
    AND v.transliteration != ''
    AND (v.transliteration_ua IS NOT NULL AND v.transliteration_ua != '')
GROUP BY b.slug

UNION ALL

SELECT
    'Конфлікт: обидва synonyms заповнені' as issue,
    b.slug,
    COUNT(*) as count
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
LEFT JOIN cantos ca ON ca.id = ch.canto_id
LEFT JOIN books b ON b.id = COALESCE(ca.book_id, ch.book_id)
WHERE v.deleted_at IS NULL
    AND v.synonyms IS NOT NULL
    AND v.synonyms != ''
    AND (v.synonyms_ua IS NOT NULL AND v.synonyms_ua != '')
GROUP BY b.slug
ORDER BY issue, slug;
