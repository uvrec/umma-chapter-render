-- ============================================================================
-- Fix: Restore SELECT permission on blog_posts with RLS policy
-- ============================================================================
-- This migration fixes an issue where blog posts are not visible because:
-- 1. SELECT was revoked from anon/authenticated users (20260119130000)
-- 2. The blog_posts_public view doesn't support JOINs to blog_categories
-- 3. The view is missing poetry mode columns
--
-- Solution: Re-grant SELECT with RLS policy that only allows viewing published posts
-- ============================================================================

BEGIN;

-- Re-grant SELECT permission to anon and authenticated users
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.blog_posts TO authenticated;

-- Ensure RLS is enabled on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing public read policy if exists
DROP POLICY IF EXISTS "blog_posts_public_read" ON public.blog_posts;

-- Create RLS policy that allows reading only published posts
CREATE POLICY "blog_posts_public_read" ON public.blog_posts
  FOR SELECT
  USING (
    is_published = true
    AND (published_at IS NULL OR published_at <= NOW())
  );

-- Note: Admins/editors should have separate policies for full access
-- Those policies should already exist from previous migrations

COMMIT;

-- ============================================================================
-- This allows the application to:
-- 1. Query blog_posts directly with JOINs to blog_categories
-- 2. Access all columns including poetry mode fields
-- 3. Still restricts access to only published posts via RLS
-- ============================================================================
