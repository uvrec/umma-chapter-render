-- Fix orphaned chapters for multi-volume books (CC, SB, etc.)
-- These chapters have book_id but should have canto_id

-- Step 1: Identify orphaned chapters
-- These are chapters that:
-- 1. Have book_id but no canto_id
-- 2. Belong to books with has_cantos = true
SELECT
  c.id as chapter_id,
  c.chapter_number,
  c.title_ua,
  b.slug as book_slug,
  b.title_ua as book_title
FROM chapters c
JOIN books b ON c.book_id = b.id
WHERE
  c.book_id IS NOT NULL
  AND c.canto_id IS NULL
  AND b.has_cantos = true;

-- Step 2: For SCC book specifically, fix chapters by mapping them to the correct canto
-- Assuming:
-- - Adi-lila (canto 1): chapters 1-17
-- - Madhya-lila (canto 2): chapters 1-25
-- - Antya-lila (canto 3): chapters 1-20

-- First, let's see what cantos exist for SCC
SELECT
  c.id as canto_id,
  c.canto_number,
  c.title_ua,
  c.title_en,
  b.slug as book_slug
FROM cantos c
JOIN books b ON c.book_id = b.id
WHERE b.slug = 'scc'
ORDER BY c.canto_number;

-- If cantos exist, we can fix orphaned chapters by moving them from book_id to canto_id
-- Example for chapter 6 of Antya-lila (canto 3):
/*
UPDATE chapters
SET
  canto_id = (SELECT id FROM cantos WHERE book_id = (SELECT id FROM books WHERE slug = 'scc') AND canto_number = 3),
  book_id = NULL
WHERE
  book_id = (SELECT id FROM books WHERE slug = 'scc')
  AND canto_id IS NULL
  AND chapter_number = 6;
*/

-- More general fix: Update all orphaned SCC chapters
-- (This assumes you know which chapter numbers belong to which canto)
/*
-- Fix Antya-lila chapters (if they exist)
UPDATE chapters
SET
  canto_id = (SELECT id FROM cantos WHERE book_id = (SELECT id FROM books WHERE slug = 'scc') AND canto_number = 3),
  book_id = NULL
WHERE
  book_id = (SELECT id FROM books WHERE slug = 'scc')
  AND canto_id IS NULL;
*/
