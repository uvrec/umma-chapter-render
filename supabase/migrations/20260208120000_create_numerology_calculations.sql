-- Numerology calculations tracking for analytics
-- Stores each calculation result for admin statistics dashboard

BEGIN;

-- ============================================================================
-- 1. Table: numerology_calculations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.numerology_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Which tool was used
  tool_type TEXT NOT NULL CHECK (tool_type IN ('numcal', 'calculator')),

  -- Birth date used (stored as date for grouping by month/day)
  birth_date DATE NOT NULL,

  -- Calculated numbers
  mind_number SMALLINT NOT NULL CHECK (mind_number BETWEEN 1 AND 9),
  action_number SMALLINT NOT NULL CHECK (action_number BETWEEN 1 AND 9),
  realization_number SMALLINT NOT NULL CHECK (realization_number BETWEEN 1 AND 9),
  result_number SMALLINT NOT NULL CHECK (result_number BETWEEN 1 AND 9),

  -- Formatted result (e.g. "7-1-8-7")
  formatted TEXT,

  -- Optional: logged-in user
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for admin queries
CREATE INDEX idx_numerology_calc_created ON public.numerology_calculations (created_at DESC);
CREATE INDEX idx_numerology_calc_tool ON public.numerology_calculations (tool_type);

-- ============================================================================
-- 2. RLS Policies
-- ============================================================================

ALTER TABLE public.numerology_calculations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (the tool is public)
CREATE POLICY "Anyone can insert numerology calculations"
  ON public.numerology_calculations FOR INSERT
  WITH CHECK (true);

-- Only admins can read (for statistics)
CREATE POLICY "Admins can view numerology calculations"
  ON public.numerology_calculations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete numerology calculations"
  ON public.numerology_calculations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

COMMIT;
