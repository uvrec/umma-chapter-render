-- Add cover image URL to cantos for admin-managed covers
ALTER TABLE public.cantos
ADD COLUMN IF NOT EXISTS cover_image_url text;

-- No RLS changes needed (table already has RLS). This is a nullable field for optional covers.
