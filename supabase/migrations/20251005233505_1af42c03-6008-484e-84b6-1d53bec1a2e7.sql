-- Fix Srimad-Bhagavatam chapter structure
-- First clear book_id, then set canto_id to link chapter to Canto 1
UPDATE chapters 
SET book_id = NULL,
    canto_id = (
      SELECT id FROM cantos 
      WHERE book_id = (SELECT id FROM books WHERE slug = 'srimad-bhagavatam') 
      AND canto_number = 1
    )
WHERE id = 'ec4d3bb4-fcb4-46ee-9a59-413798d70ee2';