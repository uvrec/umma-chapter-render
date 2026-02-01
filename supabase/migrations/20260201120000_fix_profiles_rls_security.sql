-- Fix Security Scan Error: Remove RLS policies that use 'public' role
-- These policies are redundant since authenticated-only policies already exist

-- Drop the old policies that use public role (includes anonymous users)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- The following authenticated-only policies remain and cover the same functionality:
-- - profiles_insert_own (INSERT for authenticated)
-- - profiles_select_self_or_admin (SELECT for authenticated)
-- - profiles_update_self (UPDATE for authenticated)
