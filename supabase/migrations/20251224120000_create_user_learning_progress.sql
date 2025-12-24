-- Create user learning progress table for syncing learning data across devices
-- This table stores words, verses, and overall progress for authenticated users

-- Main learning items table (words and verses)
CREATE TABLE IF NOT EXISTS user_learning_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('word', 'verse')),
  item_id TEXT NOT NULL, -- iast for words, verseId for verses

  -- Item data (stored as JSONB for flexibility)
  item_data JSONB NOT NULL,

  -- SRS metadata
  srs_ease_factor NUMERIC(4,2) DEFAULT 2.5,
  srs_interval INTEGER DEFAULT 0,
  srs_repetitions INTEGER DEFAULT 0,
  srs_last_reviewed TIMESTAMPTZ,
  srs_next_review TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint per user + item
  UNIQUE(user_id, item_type, item_id)
);

-- User learning progress/stats table
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Streak tracking
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login_date DATE,

  -- Review stats
  total_reviews INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,

  -- Achievements (stored as JSONB array)
  achievements JSONB DEFAULT '[]'::jsonb,

  -- Daily goals history (stored as JSONB array, keep last 30 days)
  daily_goals JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Daily activity log for graphs
CREATE TABLE IF NOT EXISTS user_learning_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Daily stats
  reviews_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  words_added INTEGER DEFAULT 0,
  verses_added INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- One record per user per day
  UNIQUE(user_id, activity_date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_learning_items_user_id ON user_learning_items(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_items_type ON user_learning_items(item_type);
CREATE INDEX IF NOT EXISTS idx_learning_items_next_review ON user_learning_items(srs_next_review);
CREATE INDEX IF NOT EXISTS idx_learning_activity_user_date ON user_learning_activity(user_id, activity_date DESC);

-- Enable RLS
ALTER TABLE user_learning_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

-- user_learning_items policies
CREATE POLICY "Users can view their own learning items"
  ON user_learning_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning items"
  ON user_learning_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning items"
  ON user_learning_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning items"
  ON user_learning_items FOR DELETE
  USING (auth.uid() = user_id);

-- user_learning_progress policies
CREATE POLICY "Users can view their own progress"
  ON user_learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- user_learning_activity policies
CREATE POLICY "Users can view their own activity"
  ON user_learning_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON user_learning_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
  ON user_learning_activity FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_learning_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_learning_items_updated_at
  BEFORE UPDATE ON user_learning_items
  FOR EACH ROW EXECUTE FUNCTION update_learning_updated_at();

CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON user_learning_progress
  FOR EACH ROW EXECUTE FUNCTION update_learning_updated_at();

CREATE TRIGGER update_learning_activity_updated_at
  BEFORE UPDATE ON user_learning_activity
  FOR EACH ROW EXECUTE FUNCTION update_learning_updated_at();

-- Function to upsert daily activity
CREATE OR REPLACE FUNCTION upsert_learning_activity(
  p_user_id UUID,
  p_reviews INTEGER DEFAULT 0,
  p_correct INTEGER DEFAULT 0,
  p_words_added INTEGER DEFAULT 0,
  p_verses_added INTEGER DEFAULT 0,
  p_time_spent INTEGER DEFAULT 0
)
RETURNS user_learning_activity AS $$
DECLARE
  result user_learning_activity;
BEGIN
  INSERT INTO user_learning_activity (
    user_id,
    activity_date,
    reviews_count,
    correct_count,
    words_added,
    verses_added,
    time_spent_seconds
  )
  VALUES (
    p_user_id,
    CURRENT_DATE,
    p_reviews,
    p_correct,
    p_words_added,
    p_verses_added,
    p_time_spent
  )
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    reviews_count = user_learning_activity.reviews_count + p_reviews,
    correct_count = user_learning_activity.correct_count + p_correct,
    words_added = user_learning_activity.words_added + p_words_added,
    verses_added = user_learning_activity.verses_added + p_verses_added,
    time_spent_seconds = user_learning_activity.time_spent_seconds + p_time_spent,
    updated_at = now()
  RETURNING * INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION upsert_learning_activity TO authenticated;
