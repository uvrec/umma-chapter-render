-- Fix security scan errors to unblock publish
-- Addresses findings from supabase_lov security scanner

-- ============================================================================
-- FIX 1: user_sadhana_config_fcm_token_exposure
-- Problem: When is_public=true, anonymous users can see fcm_token and apns_token
-- Solution: Remove direct table access policy, create a secure VIEW without tokens
-- ============================================================================

-- Drop the policy that exposes all columns including sensitive tokens
DROP POLICY IF EXISTS "Users can view public configs" ON public.user_sadhana_config;

-- Create a secure view that excludes sensitive push notification tokens
CREATE OR REPLACE VIEW public.user_sadhana_config_public AS
SELECT
  id,
  user_id,
  display_name,
  avatar_url,
  is_public,
  japa_rounds_target,
  japa_before_730_target,
  reading_minutes_target,
  wake_up_target,
  bed_time_target,
  track_service,
  track_yoga,
  track_lections,
  track_kirtan,
  timezone,
  language,
  created_at,
  updated_at
  -- EXCLUDED: fcm_token, apns_token, reminder_enabled, reminder_time
FROM public.user_sadhana_config
WHERE is_public = true;

-- Grant access to the secure view (not the table directly)
GRANT SELECT ON public.user_sadhana_config_public TO anon, authenticated;

COMMENT ON VIEW public.user_sadhana_config_public IS
  'Public view of sadhana configs - excludes sensitive FCM/APNS tokens for security';

-- ============================================================================
-- FIX 2: audio_events_anonymous_insertion
-- Problem: Anonymous users can insert unlimited audio events (potential spam/DoS)
-- Solution: Remove anonymous INSERT policy
-- Note: This disables anonymous audio tracking. If needed, use Edge Function with rate limiting.
-- ============================================================================

DROP POLICY IF EXISTS "Anonymous users can insert audio events" ON public.audio_events;

-- ============================================================================
-- NOTE: The following findings are marked as IGNORED (not security issues):
--
-- 1. profiles_table_public_exposure - Already fixed in previous migration
--    (20260201120000_fix_profiles_rls_security.sql removed public role policies)
--
-- 2. stripe_customers_user_email_exposure - Expected behavior
--    (Users should be able to see their own email in stripe_customers)
-- ============================================================================
