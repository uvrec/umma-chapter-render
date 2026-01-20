-- ============================================================================
-- Add explicit GRANT for sadhana tables to authenticated role
-- ============================================================================
-- RLS policies control row-level access, but table-level privileges
-- must also be granted for operations to work.
-- ============================================================================

-- user_sadhana_config - user settings and goals
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sadhana_config TO authenticated;

-- user_sadhana_daily - daily tracking entries
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sadhana_daily TO authenticated;

-- user_reading_goals - "Page by Page Be a Sage" reading goals
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_reading_goals TO authenticated;

-- user_sadhana_friends - social subscriptions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sadhana_friends TO authenticated;

-- user_sadhana_monthly_stats - pre-aggregated monthly statistics
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sadhana_monthly_stats TO authenticated;

-- Performance index for public profile queries
CREATE INDEX IF NOT EXISTS idx_user_sadhana_config_public
  ON public.user_sadhana_config(user_id, is_public)
  WHERE is_public = true;

-- ============================================================================
-- Note: RLS policies already control:
-- - Users can only manage their own rows
-- - Public profiles (is_public = true) are visible to others
-- ============================================================================
