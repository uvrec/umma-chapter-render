-- Видалення вірша 4 з SCC 3.1
-- URL: /veda-reader/scc/canto/3/chapter/1/4

-- Знаходимо та видаляємо вірш
DELETE FROM verses
WHERE verse_number = '4'
  AND chapter_id IN (
    SELECT c.id
    FROM chapters c
    JOIN cantos ct ON c.canto_id = ct.id
    JOIN books b ON ct.book_id = b.id
    WHERE b.slug = 'scc'
      AND ct.canto_number = 3
      AND c.chapter_number = 1
  );

-- Перевірка результату
SELECT
  b.slug as book,
  ct.canto_number,
  c.chapter_number,
  v.verse_number,
  v.id
FROM verses v
JOIN chapters c ON v.chapter_id = c.id
JOIN cantos ct ON c.canto_id = ct.id
JOIN books b ON ct.book_id = b.id
WHERE b.slug = 'scc'
  AND ct.canto_number = 3
  AND c.chapter_number = 1
ORDER BY v.verse_number;
