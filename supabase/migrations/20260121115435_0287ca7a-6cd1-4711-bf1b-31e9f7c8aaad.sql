-- ============================================
-- FIX 1: Restrict profiles table access
-- Users should only read their own profile
-- ============================================

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create restrictive policy - users can only view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- ============================================
-- FIX 2: Enable RLS on content_tattvas table
-- ============================================

-- Enable RLS
ALTER TABLE public.content_tattvas ENABLE ROW LEVEL SECURITY;

-- Allow public read access (content classification is public reference data)
CREATE POLICY "Anyone can view content tattvas"
ON public.content_tattvas
FOR SELECT
USING (true);

-- Only authenticated users with admin role could modify (restrict writes)
-- For now, block all non-admin writes by requiring a condition that's never true for regular users
CREATE POLICY "Only admins can insert content tattvas"
ON public.content_tattvas
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Only admins can update content tattvas"
ON public.content_tattvas
FOR UPDATE
USING (false);

CREATE POLICY "Only admins can delete content tattvas"
ON public.content_tattvas
FOR DELETE
USING (false);