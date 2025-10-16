-- Add is_published field to verses, cantos, and chapters tables for hiding/showing content

-- Add is_published to verses (default true to keep existing verses visible)
ALTER TABLE public.verses 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.verses.is_published IS 'Controls whether the verse is visible to public users';

-- Add is_published to cantos (default true to keep existing cantos visible)
ALTER TABLE public.cantos 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.cantos.is_published IS 'Controls whether the canto is visible to public users';

-- Add is_published to chapters (default true to keep existing chapters visible)
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.chapters.is_published IS 'Controls whether the chapter is visible to public users';

-- Update RLS policies for verses to check is_published
DROP POLICY IF EXISTS "Anyone can view verses" ON public.verses;
CREATE POLICY "Anyone can view published verses" 
ON public.verses 
FOR SELECT 
USING (is_published = true OR auth.uid() IS NOT NULL);

-- Update RLS policies for cantos to check is_published
DROP POLICY IF EXISTS "Anyone can view cantos" ON public.cantos;
CREATE POLICY "Anyone can view published cantos" 
ON public.cantos 
FOR SELECT 
USING (is_published = true OR auth.uid() IS NOT NULL);

-- Update RLS policies for chapters to check is_published
DROP POLICY IF EXISTS "Anyone can view chapters" ON public.chapters;
CREATE POLICY "Anyone can view published chapters" 
ON public.chapters 
FOR SELECT 
USING (is_published = true OR auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verses_is_published ON public.verses(is_published);
CREATE INDEX IF NOT EXISTS idx_cantos_is_published ON public.cantos(is_published);
CREATE INDEX IF NOT EXISTS idx_chapters_is_published ON public.chapters(is_published);