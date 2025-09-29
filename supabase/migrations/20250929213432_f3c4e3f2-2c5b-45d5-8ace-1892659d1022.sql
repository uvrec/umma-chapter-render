-- Add cover_image_url column to books table
ALTER TABLE public.books 
ADD COLUMN cover_image_url text;

-- Add a comment to describe the column
COMMENT ON COLUMN public.books.cover_image_url IS 'URL or path to the book cover image';