-- Add unique constraints to chapters table to prevent duplicates
-- and support upsert operations

-- For chapters with canto_id (e.g., Srimad Bhagavatam Cantos)
CREATE UNIQUE INDEX IF NOT EXISTS chapters_canto_chapter_unique 
  ON chapters(canto_id, chapter_number) 
  WHERE canto_id IS NOT NULL;

-- For chapters with book_id (e.g., Bhagavad Gita without cantos)  
CREATE UNIQUE INDEX IF NOT EXISTS chapters_book_chapter_unique 
  ON chapters(book_id, chapter_number) 
  WHERE book_id IS NOT NULL AND canto_id IS NULL;