-- 🔍 Пошук неправильної транслітерації "атга" (має бути "атха")
--
-- Проблема: "atha" → "атга" замість "атха"
-- Правило: th → тх (НІКОЛИ не "тг"!)

-- 1. Знайти вірші з "атга" в transliteration_ua
SELECT
    'transliteration_ua містить атга' as issue,
    v.id as verse_id,
    b.slug as book_slug,
    v.verse_number,
    v.transliteration_ua,
    LENGTH(v.transliteration_ua) as length
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
JOIN books b ON b.id = ch.book_id
WHERE v.transliteration_ua ILIKE '%атга%'
    AND v.deleted_at IS NULL
ORDER BY b.slug, ch.chapter_number, v.verse_number
LIMIT 20;

-- 2. Знайти вірші з "атга" в transliteration (одинарне поле)
SELECT
    'transliteration містить атга' as issue,
    v.id as verse_id,
    b.slug as book_slug,
    v.verse_number,
    v.transliteration,
    LENGTH(v.transliteration) as length
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
JOIN books b ON b.id = ch.book_id
WHERE v.transliteration ILIKE '%атга%'
    AND v.deleted_at IS NULL
ORDER BY b.slug, ch.chapter_number, v.verse_number
LIMIT 20;

-- 3. Знайти всі варіанти "т + г" що мають бути "т + х"
SELECT
    'Підозрілі тг комбінації' as issue,
    v.id as verse_id,
    b.slug as book_slug,
    v.verse_number,
    COALESCE(v.transliteration_ua, v.transliteration) as text_sample,
    -- Витягти контекст навколо "тг"
    SUBSTRING(COALESCE(v.transliteration_ua, v.transliteration) FROM POSITION('тг' IN COALESCE(v.transliteration_ua, v.transliteration)) - 5 FOR 15) as context
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
JOIN books b ON b.id = ch.book_id
WHERE (v.transliteration_ua ~ 'тг[аеіоуāīūр̣]' OR v.transliteration ~ 'тг[аеіоуāīūр̣]')
    AND v.deleted_at IS NULL
ORDER BY b.slug, ch.chapter_number, v.verse_number
LIMIT 50;

-- 4. Статистика по книгах
SELECT
    b.slug,
    b.title_ua,
    COUNT(*) FILTER (WHERE v.transliteration_ua ILIKE '%атга%') as ua_has_atga,
    COUNT(*) FILTER (WHERE v.transliteration ILIKE '%атга%') as single_has_atga,
    COUNT(*) FILTER (WHERE v.transliteration_ua ~ 'тг[аеіоу]') as ua_has_tg,
    COUNT(*) FILTER (WHERE v.transliteration ~ 'тг[аеіоу]') as single_has_tg,
    COUNT(*) as total_verses
FROM verses v
JOIN chapters ch ON ch.id = v.chapter_id
JOIN books b ON b.id = ch.book_id
WHERE v.deleted_at IS NULL
GROUP BY b.slug, b.title_ua
HAVING
    COUNT(*) FILTER (WHERE v.transliteration_ua ILIKE '%атга%') > 0
    OR COUNT(*) FILTER (WHERE v.transliteration ILIKE '%атга%') > 0
    OR COUNT(*) FILTER (WHERE v.transliteration_ua ~ 'тг[аеіоу]') > 0
    OR COUNT(*) FILTER (WHERE v.transliteration ~ 'тг[аеіоу]') > 0
ORDER BY ua_has_atga DESC, single_has_atga DESC;
