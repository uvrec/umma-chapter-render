-- Fix RLS security issues

-- Enable RLS on book_pages table
ALTER TABLE public.book_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for book_pages table
-- Admins can manage all book pages
CREATE POLICY "Admins can manage book_pages"
ON public.book_pages
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can only read published book pages
CREATE POLICY "Public can read published book_pages"
ON public.book_pages
FOR SELECT
TO public
USING (is_published = true);

-- Authenticated users can read published book pages
CREATE POLICY "Authenticated can read published book_pages"
ON public.book_pages
FOR SELECT
TO authenticated
USING (is_published = true);

-- Enable RLS on backup/archive tables to prevent exposure
ALTER TABLE public.chapters_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verses_archive ENABLE ROW LEVEL SECURITY;

-- Only admins can access archive tables
CREATE POLICY "Only admins can access chapters_archive"
ON public.chapters_archive
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can access verses_archive"
ON public.verses_archive
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));