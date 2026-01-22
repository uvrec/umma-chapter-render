-- Create unique index on chapters for canto_id + chapter_number
CREATE UNIQUE INDEX IF NOT EXISTS chapters_canto_chapter_unique 
ON public.chapters (canto_id, chapter_number) 
WHERE canto_id IS NOT NULL;