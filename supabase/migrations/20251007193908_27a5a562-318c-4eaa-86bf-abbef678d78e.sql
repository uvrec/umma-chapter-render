-- Create intro_chapters table for book introductions, prefaces, etc.
CREATE TABLE IF NOT EXISTS public.intro_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  title_ua TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_ua TEXT,
  content_en TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book_id, slug)
);

-- Enable RLS
ALTER TABLE public.intro_chapters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view intro chapters"
  ON public.intro_chapters
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert intro chapters"
  ON public.intro_chapters
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update intro chapters"
  ON public.intro_chapters
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete intro chapters"
  ON public.intro_chapters
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_intro_chapters_updated_at
  BEFORE UPDATE ON public.intro_chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_intro_chapters_book_id ON public.intro_chapters(book_id);
CREATE INDEX idx_intro_chapters_slug ON public.intro_chapters(slug);