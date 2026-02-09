-- Hide empty "Padma Purana" (pp) from public library
-- The book has no cantos or chapters yet but was showing as published,
-- resulting in empty pages when users navigate to it (e.g. /uk/lib/pp/6).

UPDATE public.books
SET is_published = false
WHERE slug = 'pp';
