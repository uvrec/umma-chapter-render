-- =============================================================================
-- Security Hardening: Profiles & Stripe Customers tables
-- Fixes Lovable security scan issues:
--   1. "User Profile Data Could Be Stolen by Anyone"
--   2. "Customer Email Addresses Exposed to Public"
-- =============================================================================

-- ============================================
-- FIX 1: PROFILES TABLE - Defense in depth
-- ============================================

-- Revoke all access from anonymous role on profiles
REVOKE ALL ON public.profiles FROM anon;

-- Drop any potentially remaining permissive policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Ensure the restrictive policy exists: users can only see their own profile, admins see all
DROP POLICY IF EXISTS "Users view own profile or admin" ON public.profiles;
CREATE POLICY "Users view own profile or admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- Ensure insert/update policies are scoped to authenticated only
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Force RLS even for table owner (defense in depth)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;


-- ============================================
-- FIX 2: STRIPE_CUSTOMERS TABLE - Defense in depth
-- ============================================

-- Revoke all access from anonymous role on stripe_customers
REVOKE ALL ON public.stripe_customers FROM anon;

-- Drop any overly permissive policies
DROP POLICY IF EXISTS "Anyone can view stripe customers" ON public.stripe_customers;
DROP POLICY IF EXISTS "Public can view stripe customers" ON public.stripe_customers;

-- Ensure only authenticated users can see their own record
DROP POLICY IF EXISTS "Users can view own customer record" ON public.stripe_customers;
CREATE POLICY "Users can view own customer record"
  ON public.stripe_customers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled and forced
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_customers FORCE ROW LEVEL SECURITY;


-- ============================================
-- ADDITIONAL: Revoke anon from other sensitive tables
-- ============================================

-- stripe_subscriptions
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stripe_subscriptions') THEN
    REVOKE ALL ON public.stripe_subscriptions FROM anon;
    ALTER TABLE public.stripe_subscriptions FORCE ROW LEVEL SECURITY;
  END IF;
END $$;

-- stripe_payment_history
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stripe_payment_history') THEN
    REVOKE ALL ON public.stripe_payment_history FROM anon;
    ALTER TABLE public.stripe_payment_history FORCE ROW LEVEL SECURITY;
  END IF;
END $$;

-- user_sadhana_config (has fcm/apns tokens)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sadhana_config') THEN
    REVOKE ALL ON public.user_sadhana_config FROM anon;
    ALTER TABLE public.user_sadhana_config FORCE ROW LEVEL SECURITY;
  END IF;
END $$;
