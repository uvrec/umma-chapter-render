-- Add display_order column to books table for custom sorting
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_books_display_order ON public.books(display_order);

COMMENT ON COLUMN public.books.display_order IS 'Custom display order for books. Lower numbers appear first.';