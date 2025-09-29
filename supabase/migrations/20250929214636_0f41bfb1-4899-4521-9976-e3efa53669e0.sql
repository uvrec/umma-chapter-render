-- Create cantos table
CREATE TABLE public.cantos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  canto_number INTEGER NOT NULL,
  title_ua TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ua TEXT,
  description_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, canto_number)
);

-- Add has_cantos column to books table
ALTER TABLE public.books 
ADD COLUMN has_cantos BOOLEAN DEFAULT FALSE;

-- Add canto_id to chapters table
ALTER TABLE public.chapters
ADD COLUMN canto_id UUID REFERENCES public.cantos(id) ON DELETE CASCADE;

-- Make book_id nullable in chapters (since chapters can now belong to either a book or a canto)
ALTER TABLE public.chapters
ALTER COLUMN book_id DROP NOT NULL;

-- Add constraint: either book_id or canto_id must be set (but not both)
ALTER TABLE public.chapters
ADD CONSTRAINT chapters_book_or_canto_check 
CHECK (
  (book_id IS NOT NULL AND canto_id IS NULL) OR 
  (book_id IS NULL AND canto_id IS NOT NULL)
);

-- Enable RLS on cantos table
ALTER TABLE public.cantos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cantos table
CREATE POLICY "Anyone can view cantos"
ON public.cantos
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert cantos"
ON public.cantos
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update cantos"
ON public.cantos
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete cantos"
ON public.cantos
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));