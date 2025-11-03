-- ============================================================================
-- SQL скрипт для нормалізації існуючих українських текстів
-- Виправляє транслітерацію, діакритику, апострофи згідно з академічними правилами
-- ============================================================================

-- ФУНКЦІЯ: Нормалізація українського тексту (коментарі, переклади, synonyms)
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
    result := REPLACE(result, 'â€™', ''''); -- right single quotation
    result := REPLACE(result, 'â€œ', '"'); -- left double quotation
    result := REPLACE(result, 'â€', '"'); -- right double quotation
    result := REPLACE(result, '  ', ' '); -- подвійні пробіли
    
    -- 2. ВИПРАВЛЕННЯ НЕПРАВИЛЬНИХ ДІАКРИТИЧНИХ СИМВОЛІВ
    -- Крапки під українськими літерами (помилки з Gitabase)
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
    
    -- Нітьянанда (апостроф → м'який знак)
    result := REGEXP_REPLACE(result, '\mНіт''янанд', 'Нітьянанд', 'g');
    result := REGEXP_REPLACE(result, '\mніт''янанд', 'нітьянанд', 'g');
    
    -- Ґопінатха
    result := REGEXP_REPLACE(result, '\mҐопінатга\M', 'Ґопінатха', 'g');
    result := REGEXP_REPLACE(result, '\mҐопінатгу\M', 'Ґопінатху', 'g');
    
    -- Енергія
    result := REGEXP_REPLACE(result, '\mенерґі', 'енергі', 'g');
    
    -- Санньяса
    result := REGEXP_REPLACE(result, '\mсанн''яс', 'саньяс', 'g');
    result := REGEXP_REPLACE(result, '\mСанн''яс', 'Саньяс', 'g');
    
    -- Специфічні виправлення
    result := REGEXP_REPLACE(result, '\mпроджджгіт', 'проджджхіт', 'g');
    result := REGEXP_REPLACE(result, '\mАчйут', 'Ачьют', 'g');
    result := REGEXP_REPLACE(result, '\mАдвайт', 'Адваіт', 'g');
    result := REGEXP_REPLACE(result, '\mДжгарікханд', 'Джхарікханд', 'g');
    
    -- 4. ВИПРАВЛЕННЯ ПРИДИХОВИХ ПРИГОЛОСНИХ
    result := REGEXP_REPLACE(result, 'тг', 'тх', 'g');
    result := REGEXP_REPLACE(result, 'Тг', 'Тх', 'g');
    result := REGEXP_REPLACE(result, 'кг', 'кх', 'g');
    result := REGEXP_REPLACE(result, 'Кг', 'Кх', 'g');
    result := REGEXP_REPLACE(result, 'пг', 'пх', 'g');
    result := REGEXP_REPLACE(result, 'Пг', 'Пх', 'g');
    result := REGEXP_REPLACE(result, 'чг', 'чх', 'g');
    result := REGEXP_REPLACE(result, 'Чг', 'Чх', 'g');
    result := REGEXP_REPLACE(result, 'джджг', 'джджх', 'g');
    result := REGEXP_REPLACE(result, 'Джджг', 'Джджх', 'g');
    result := REGEXP_REPLACE(result, 'джг', 'джх', 'g');
    result := REGEXP_REPLACE(result, 'Джг', 'Джх', 'g');
    
    -- 5. НОРМАЛІЗАЦІЯ АПОСТРОФА ПІСЛЯ "Н"
    -- н' → нь (КРІМ виключень: ачар'я, антар'ямі)
    -- Спочатку зберігаємо виключення
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
-- ЗАСТОСУВАННЯ НОРМАЛІЗАЦІЇ ДО ІСНУЮЧИХ ТЕКСТІВ
-- ============================================================================

-- ВАЖЛИВО: Створіть резервну копію перед виконанням!
-- pg_dump -U your_user -d your_database -t verses > backup_verses.sql

-- Нормалізація перекладів
UPDATE verses
SET translation_ua = normalize_ukrainian_text(translation_ua)
WHERE translation_ua IS NOT NULL 
  AND translation_ua != '';

-- Нормалізація коментарів
UPDATE verses
SET commentary_ua = normalize_ukrainian_text(commentary_ua)
WHERE commentary_ua IS NOT NULL 
  AND commentary_ua != '';

-- Нормалізація synonyms_ua
UPDATE verses
SET synonyms_ua = normalize_ukrainian_text(synonyms_ua)
WHERE synonyms_ua IS NOT NULL 
  AND synonyms_ua != '';


-- ============================================================================
-- СТАТИСТИКА ЗМІН
-- ============================================================================

-- Перевірка кількості віршів що будуть змінені (ВИКОНАТИ ПЕРЕД UPDATE)
SELECT 
    COUNT(*) as total_verses,
    COUNT(CASE WHEN translation_ua != normalize_ukrainian_text(translation_ua) THEN 1 END) as translation_changes,
    COUNT(CASE WHEN commentary_ua != normalize_ukrainian_text(commentary_ua) THEN 1 END) as commentary_changes,
    COUNT(CASE WHEN synonyms_ua != normalize_ukrainian_text(synonyms_ua) THEN 1 END) as synonyms_changes
FROM verses
WHERE translation_ua IS NOT NULL 
   OR commentary_ua IS NOT NULL 
   OR synonyms_ua IS NOT NULL;


-- ============================================================================
-- ПРИКЛАДИ ВИКОРИСТАННЯ
-- ============================================================================

-- Тестування функції на одному віршу
SELECT 
    verse_number,
    translation_ua as original,
    normalize_ukrainian_text(translation_ua) as normalized
FROM verses
WHERE book_id = 1 AND chapter_id = 1 AND verse_number = 1;

-- Пошук віршів з конкретними помилками
SELECT verse_number, translation_ua
FROM verses
WHERE translation_ua LIKE '%Чайтан''я%' 
   OR translation_ua LIKE '%н''%'
   OR translation_ua LIKE '%тг%'
LIMIT 10;


-- ============================================================================
-- ОЧИЩЕННЯ (якщо потрібно видалити функцію)
-- ============================================================================
-- DROP FUNCTION IF EXISTS normalize_ukrainian_text(TEXT);
