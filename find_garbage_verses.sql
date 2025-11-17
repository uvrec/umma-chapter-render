-- 🔍 Пошук "сміттєвих" даних в Śrīmad-Bhāgavatam
-- Виявляє вірші з неправильними джерелами або порожніми полями

WITH book_info AS (
    SELECT id FROM books WHERE slug = 'srimad-bhagavatam' LIMIT 1
),
all_cantos AS (
    SELECT id, canto_number FROM cantos WHERE book_id = (SELECT id FROM book_info)
),
all_chapters AS (
    SELECT ch.id, c.canto_number, ch.chapter_number
    FROM chapters ch
    JOIN cantos c ON c.id = ch.canto_id
    WHERE ch.canto_id IN (SELECT id FROM all_cantos)
)

-- 1. Вірші з Gitabase URL (НЕ має бути для SB!)
SELECT
    'Gitabase URL знайдено (ПОМИЛКА!)' as issue_type,
    ac.canto_number,
    ac.chapter_number,
    v.verse_number,
    v.id,
    LEFT(v.translation_ua, 100) as translation_preview
FROM verses v
JOIN all_chapters ac ON ac.id = v.chapter_id
WHERE v.chapter_id IN (SELECT id FROM all_chapters)
    AND v.deleted_at IS NULL
    AND (
        -- Шукаємо будь-які згадки gitabase в різних полях
        v.transliteration_ua ILIKE '%gitabase%'
        OR v.synonyms_ua ILIKE '%gitabase%'
        OR v.translation_ua ILIKE '%gitabase%'
        OR v.commentary_ua ILIKE '%gitabase%'
    )
ORDER BY ac.canto_number, ac.chapter_number, v.verse_number
LIMIT 20;

-- 2. Вірші з порожніми перекладами (обидві мови)
SELECT
    'Порожні переклади' as issue_type,
    COUNT(*) as count,
    ac.canto_number,
    ac.chapter_number
FROM verses v
JOIN all_chapters ac ON ac.id = v.chapter_id
WHERE v.chapter_id IN (SELECT id FROM all_chapters)
    AND v.deleted_at IS NULL
    AND v.is_published = true
    AND (v.translation_ua IS NULL OR v.translation_ua = '')
    AND (v.translation_en IS NULL OR v.translation_en = '')
GROUP BY ac.canto_number, ac.chapter_number
HAVING COUNT(*) > 0
ORDER BY ac.canto_number, ac.chapter_number;

-- 3. Вірші з дуже короткими перекладами (менше 10 символів)
SELECT
    'Дуже короткі переклади' as issue_type,
    ac.canto_number,
    ac.chapter_number,
    v.verse_number,
    LENGTH(v.translation_ua) as ua_len,
    LENGTH(v.translation_en) as en_len,
    v.translation_ua,
    v.translation_en
FROM verses v
JOIN all_chapters ac ON ac.id = v.chapter_id
WHERE v.chapter_id IN (SELECT id FROM all_chapters)
    AND v.deleted_at IS NULL
    AND v.is_published = true
    AND (
        (v.translation_ua IS NOT NULL AND LENGTH(v.translation_ua) < 10)
        OR (v.translation_en IS NOT NULL AND LENGTH(v.translation_en) < 10)
    )
ORDER BY ac.canto_number, ac.chapter_number, v.verse_number
LIMIT 20;

-- 4. Вірші зі "спамом" (повторення символів)
SELECT
    'Можливий спам/сміття' as issue_type,
    ac.canto_number,
    ac.chapter_number,
    v.verse_number,
    LEFT(v.translation_ua, 100) as ua_preview,
    LEFT(v.translation_en, 100) as en_preview
FROM verses v
JOIN all_chapters ac ON ac.id = v.chapter_id
WHERE v.chapter_id IN (SELECT id FROM all_chapters)
    AND v.deleted_at IS NULL
    AND (
        v.translation_ua ~ '(.)\1{10,}' -- 10+ повторюваних символів
        OR v.translation_en ~ '(.)\1{10,}'
        OR v.translation_ua ILIKE '%undefined%'
        OR v.translation_ua ILIKE '%null%'
        OR v.translation_ua ILIKE '%[object%'
    )
ORDER BY ac.canto_number, ac.chapter_number, v.verse_number
LIMIT 20;
