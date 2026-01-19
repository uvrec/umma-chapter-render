-- Fix RLS security issues
-- Note: These tables may not exist in all environments, so we check first

-- Enable RLS on book_pages table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_pages') THEN
    ALTER TABLE public.book_pages ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Admins can manage book_pages" ON public.book_pages;
    DROP POLICY IF EXISTS "Public can read published book_pages" ON public.book_pages;
    DROP POLICY IF EXISTS "Authenticated can read published book_pages" ON public.book_pages;

    -- Create policies for book_pages table
    CREATE POLICY "Admins can manage book_pages"
    ON public.book_pages
    FOR ALL
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));

    CREATE POLICY "Public can read published book_pages"
    ON public.book_pages
    FOR SELECT
    TO public
    USING (is_published = true);

    CREATE POLICY "Authenticated can read published book_pages"
    ON public.book_pages
    FOR SELECT
    TO authenticated
    USING (is_published = true);

    RAISE NOTICE 'RLS enabled on book_pages';
  ELSE
    RAISE NOTICE 'Table book_pages does not exist, skipping...';
  END IF;
END $$;

-- Enable RLS on backup/archive tables to prevent exposure (if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chapters_archive') THEN
    ALTER TABLE public.chapters_archive ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Only admins can access chapters_archive" ON public.chapters_archive;

    CREATE POLICY "Only admins can access chapters_archive"
    ON public.chapters_archive
    FOR ALL
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));

    RAISE NOTICE 'RLS enabled on chapters_archive';
  ELSE
    RAISE NOTICE 'Table chapters_archive does not exist, skipping...';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'verses_archive') THEN
    ALTER TABLE public.verses_archive ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Only admins can access verses_archive" ON public.verses_archive;

    CREATE POLICY "Only admins can access verses_archive"
    ON public.verses_archive
    FOR ALL
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));

    RAISE NOTICE 'RLS enabled on verses_archive';
  ELSE
    RAISE NOTICE 'Table verses_archive does not exist, skipping...';
  END IF;
END $$;
