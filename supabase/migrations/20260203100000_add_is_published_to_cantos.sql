-- =============================================================================
-- COMPREHENSIVE FIX: Add is_published to ALL tables that need it
-- =============================================================================
-- Problem: RPC functions filter by is_published = TRUE, but:
-- 1. Books table was missing is_published column (causing RPC errors!)
-- 2. Cantos table was missing is_published column
-- 3. Some chapters/verses have is_published = NULL or FALSE (from old imports)
-- 4. This causes content to disappear for non-admin users
--
-- Privacy Policy:
-- - Admins can see and edit everything
-- - Admins can grant access via preview tokens to anyone (even unregistered)
-- - Users with valid preview tokens can see unpublished content
-- - Everyone else sees only published content
--
-- Solution: Add is_published to all tables and ensure existing content is published
-- =============================================================================

-- =============================================================================
-- Step 1: Fix BOOKS table - add is_published column
-- =============================================================================
ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Set all existing books to published (they were visible before)
UPDATE public.books SET is_published = true WHERE is_published IS NULL OR is_published = false;

-- Add NOT NULL constraint
ALTER TABLE public.books
  ALTER COLUMN is_published SET NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_books_is_published ON public.books(is_published);

COMMENT ON COLUMN public.books.is_published IS 'Whether this book is published and visible to non-admin users';

-- =============================================================================
-- Step 2: Fix CANTOS table - add is_published column
-- =============================================================================
ALTER TABLE public.cantos
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Publish ALL cantos (fix NULL and FALSE values)
UPDATE public.cantos SET is_published = true WHERE is_published IS NULL OR is_published = false;

-- Add NOT NULL constraint
ALTER TABLE public.cantos
  ALTER COLUMN is_published SET NOT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_cantos_is_published ON public.cantos(is_published);

COMMENT ON COLUMN public.cantos.is_published IS 'Whether this canto is published and visible to non-admin users';

-- =============================================================================
-- Step 3: Fix CHAPTERS table - ensure all are published
-- =============================================================================
-- Column should already exist from earlier migration, but ensure it does
ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Publish ALL chapters (fix NULL and FALSE values)
UPDATE public.chapters SET is_published = true WHERE is_published IS NULL OR is_published = false;

-- =============================================================================
-- Step 4: Fix VERSES table - ensure all are published
-- =============================================================================
-- Column should already exist, but ensure it does
ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Publish ALL verses (fix NULL and FALSE values)
UPDATE public.verses SET is_published = true WHERE is_published IS NULL OR is_published = false;

-- =============================================================================
-- Verification
-- =============================================================================
DO $$
DECLARE
  unpublished_books INTEGER;
  unpublished_cantos INTEGER;
  unpublished_chapters INTEGER;
  unpublished_verses INTEGER;
BEGIN
  SELECT COUNT(*) INTO unpublished_books FROM public.books WHERE is_published = false;
  SELECT COUNT(*) INTO unpublished_cantos FROM public.cantos WHERE is_published = false;
  SELECT COUNT(*) INTO unpublished_chapters FROM public.chapters WHERE is_published = false;
  SELECT COUNT(*) INTO unpublished_verses FROM public.verses WHERE is_published = false;

  RAISE NOTICE 'After migration:';
  RAISE NOTICE '  Unpublished books: %', unpublished_books;
  RAISE NOTICE '  Unpublished cantos: %', unpublished_cantos;
  RAISE NOTICE '  Unpublished chapters: %', unpublished_chapters;
  RAISE NOTICE '  Unpublished verses: %', unpublished_verses;

  IF unpublished_books > 0 OR unpublished_cantos > 0 OR unpublished_chapters > 0 THEN
    RAISE WARNING 'Some content is still unpublished - check if this is intentional';
  ELSE
    RAISE NOTICE 'All content is now published!';
  END IF;
END $$;
