-- Hide empty "Light of the Bhagavata" (lob) from public library
-- It has no chapters/content yet. Keep in admin so it can be managed later.

UPDATE public.books
SET is_published = false
WHERE slug = 'lob';
