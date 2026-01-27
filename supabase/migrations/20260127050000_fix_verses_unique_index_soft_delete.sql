-- Fix verses unique index to exclude soft-deleted verses
-- This allows creating new verses with the same verse_number after soft-deleting old ones

-- Drop the old index that doesn't account for soft deletes
drop index if exists verses_chapter_verse_unique;

-- Create new partial index that only enforces uniqueness for non-deleted verses
create unique index verses_chapter_verse_unique
on public.verses (chapter_id, verse_number)
where deleted_at is null;
