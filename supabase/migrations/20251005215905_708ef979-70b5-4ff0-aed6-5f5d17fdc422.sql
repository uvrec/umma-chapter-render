-- Enable RLS on pages table if not already enabled
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;

-- Policy for anonymous and authenticated users to view only published pages
CREATE POLICY "Anyone can view published pages"
ON public.pages
FOR SELECT
USING (is_published = true);

-- Policy for admins to manage all pages (including unpublished)
CREATE POLICY "Admins can select all pages"
ON public.pages
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert pages"
ON public.pages
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update pages"
ON public.pages
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete pages"
ON public.pages
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));