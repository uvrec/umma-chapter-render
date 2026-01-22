-- ============================================================================
-- Sadhana: Default privileges and friends viewing policies
-- ============================================================================

-- ============================================================================
-- 1. DEFAULT PRIVILEGES для майбутніх таблиць
-- ============================================================================
-- Автоматично надавати GRANT на нові таблиці в схемі public

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- ============================================================================
-- 2. RLS політики для друзів (user_sadhana_friends)
-- ============================================================================

-- Політика для перегляду щоденних записів друзів
-- Друзі можуть бачити записи один одного (взаємна підписка)
DROP POLICY IF EXISTS "friends_can_view_daily" ON public.user_sadhana_daily;
CREATE POLICY "friends_can_view_daily" ON public.user_sadhana_daily
  FOR SELECT
  USING (
    -- Власні записи
    auth.uid() = user_id
    OR
    -- Друзі можуть бачити (якщо є взаємна підписка)
    EXISTS (
      SELECT 1 FROM public.user_sadhana_friends f1
      JOIN public.user_sadhana_friends f2
        ON f1.user_id = f2.friend_id
        AND f1.friend_id = f2.user_id
      WHERE f1.user_id = auth.uid()
        AND f1.friend_id = user_sadhana_daily.user_id
    )
    OR
    -- Публічні профілі
    EXISTS (
      SELECT 1 FROM public.user_sadhana_config c
      WHERE c.user_id = user_sadhana_daily.user_id
        AND c.is_public = true
    )
  );

-- Політика для перегляду конфігу друзів
DROP POLICY IF EXISTS "friends_can_view_config" ON public.user_sadhana_config;
CREATE POLICY "friends_can_view_config" ON public.user_sadhana_config
  FOR SELECT
  USING (
    -- Власний конфіг
    auth.uid() = user_id
    OR
    -- Публічні профілі
    is_public = true
    OR
    -- Друзі можуть бачити (взаємна підписка)
    EXISTS (
      SELECT 1 FROM public.user_sadhana_friends f1
      JOIN public.user_sadhana_friends f2
        ON f1.user_id = f2.friend_id
        AND f1.friend_id = f2.user_id
      WHERE f1.user_id = auth.uid()
        AND f1.friend_id = user_sadhana_config.user_id
    )
  );

-- Політика для перегляду місячної статистики друзів
DROP POLICY IF EXISTS "friends_can_view_monthly_stats" ON public.user_sadhana_monthly_stats;
CREATE POLICY "friends_can_view_monthly_stats" ON public.user_sadhana_monthly_stats
  FOR SELECT
  USING (
    -- Власна статистика
    auth.uid() = user_id
    OR
    -- Друзі можуть бачити (взаємна підписка)
    EXISTS (
      SELECT 1 FROM public.user_sadhana_friends f1
      JOIN public.user_sadhana_friends f2
        ON f1.user_id = f2.friend_id
        AND f1.friend_id = f2.user_id
      WHERE f1.user_id = auth.uid()
        AND f1.friend_id = user_sadhana_monthly_stats.user_id
    )
    OR
    -- Публічні профілі
    EXISTS (
      SELECT 1 FROM public.user_sadhana_config c
      WHERE c.user_id = user_sadhana_monthly_stats.user_id
        AND c.is_public = true
    )
  );

-- ============================================================================
-- 3. Індекси для оптимізації JOIN-ів у політиках
-- ============================================================================

-- Індекс для швидкого пошуку взаємних підписок
CREATE INDEX IF NOT EXISTS idx_sadhana_friends_lookup
  ON public.user_sadhana_friends(user_id, friend_id);

CREATE INDEX IF NOT EXISTS idx_sadhana_friends_reverse
  ON public.user_sadhana_friends(friend_id, user_id);

-- ============================================================================
-- Результат:
-- - Нові таблиці автоматично отримують GRANT для authenticated
-- - Друзі можуть бачити записи один одного (взаємна підписка)
-- - Публічні профілі видимі всім
-- - Індекси оптимізують перевірку дружби
-- ============================================================================
