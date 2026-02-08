-- Hide lecture/letter collection entries from the public library
-- They remain visible in admin (/admin/books) since admin shows all non-deleted books
-- Lectures and Letters already have dedicated tabs in the library

BEGIN;

-- Ensure these entries are NOT soft-deleted (so they appear in admin)
-- but NOT published (so they disappear from public library)
UPDATE public.books
SET is_published = false, deleted_at = NULL
WHERE title_uk ILIKE '%Лекці%Прабгупад%'
   OR title_uk ILIKE '%лекці%шріл%';

UPDATE public.books
SET is_published = false, deleted_at = NULL
WHERE title_uk ILIKE '%Лист%Прабгупад%'
   OR title_uk ILIKE '%лист%шріл%';

COMMIT;
