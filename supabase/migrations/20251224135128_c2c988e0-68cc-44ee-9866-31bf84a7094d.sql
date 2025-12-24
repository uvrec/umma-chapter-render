-- Create user_learning_items table for storing words and verses with SRS metadata
CREATE TABLE IF NOT EXISTS public.user_learning_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('word', 'verse')),
  item_id TEXT NOT NULL,
  item_data JSONB NOT NULL,
  srs_ease_factor NUMERIC DEFAULT 2.5,
  srs_interval INTEGER DEFAULT 0,
  srs_repetitions INTEGER DEFAULT 0,
  srs_last_reviewed TIMESTAMPTZ,
  srs_next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create user_learning_progress table for overall user progress
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  total_reviews INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]'::jsonb,
  daily_goal INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_learning_activity table for daily statistics
CREATE TABLE IF NOT EXISTS public.user_learning_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reviews_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  words_added INTEGER DEFAULT 0,
  verses_added INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Enable RLS
ALTER TABLE public.user_learning_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_activity ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_learning_items
CREATE POLICY "Users can view own learning items"
  ON public.user_learning_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning items"
  ON public.user_learning_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning items"
  ON public.user_learning_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own learning items"
  ON public.user_learning_items FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for user_learning_progress
CREATE POLICY "Users can view own learning progress"
  ON public.user_learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress"
  ON public.user_learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress"
  ON public.user_learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for user_learning_activity
CREATE POLICY "Users can view own learning activity"
  ON public.user_learning_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning activity"
  ON public.user_learning_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning activity"
  ON public.user_learning_activity FOR UPDATE
  USING (auth.uid() = user_id);

-- Function for upserting learning activity
CREATE OR REPLACE FUNCTION public.upsert_learning_activity(
  p_user_id UUID,
  p_reviews INTEGER DEFAULT 0,
  p_correct INTEGER DEFAULT 0,
  p_words INTEGER DEFAULT 0,
  p_verses INTEGER DEFAULT 0,
  p_time INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_learning_activity (
    user_id, activity_date, reviews_count, correct_count, words_added, verses_added, time_spent_seconds
  ) VALUES (
    p_user_id, CURRENT_DATE, p_reviews, p_correct, p_words, p_verses, p_time
  )
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    reviews_count = user_learning_activity.reviews_count + EXCLUDED.reviews_count,
    correct_count = user_learning_activity.correct_count + EXCLUDED.correct_count,
    words_added = user_learning_activity.words_added + EXCLUDED.words_added,
    verses_added = user_learning_activity.verses_added + EXCLUDED.verses_added,
    time_spent_seconds = user_learning_activity.time_spent_seconds + EXCLUDED.time_spent_seconds;
END;
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_learning_items_user_id ON public.user_learning_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_items_next_review ON public.user_learning_items(srs_next_review);
CREATE INDEX IF NOT EXISTS idx_user_learning_activity_user_date ON public.user_learning_activity(user_id, activity_date);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_learning_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_learning_items_updated_at
  BEFORE UPDATE ON public.user_learning_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_learning_updated_at();

CREATE TRIGGER update_user_learning_progress_updated_at
  BEFORE UPDATE ON public.user_learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_learning_updated_at();