-- Fix: Restrict profiles table access - users can only view their own profile or admins can view all
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Users can only view their own profile, admins can view all
CREATE POLICY "Users view own profile or admin"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));