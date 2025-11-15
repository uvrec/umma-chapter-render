-- Create daily_quotes table for managing quotes displayed on homepage
-- Supports both verse quotes (from verses table) and custom quotes

-- Create the table
CREATE TABLE IF NOT EXISTS daily_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Type of quote: 'verse' (from database) or 'custom' (manually entered)
  quote_type TEXT NOT NULL CHECK (quote_type IN ('verse', 'custom')),

  -- For verse type: reference to verses table
  verse_id UUID REFERENCES verses(id) ON DELETE CASCADE,

  -- For custom type: bilingual quote content
  quote_ua TEXT,
  quote_en TEXT,
  author_ua TEXT,
  author_en TEXT,
  source_ua TEXT,
  source_en TEXT,

  -- Display settings
  priority INTEGER DEFAULT 50 CHECK (priority >= 0 AND priority <= 100),
  is_active BOOLEAN DEFAULT true,

  -- Statistics
  display_count INTEGER DEFAULT 0,
  last_displayed_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_quotes_is_active ON daily_quotes(is_active);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_priority ON daily_quotes(priority DESC);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_last_displayed ON daily_quotes(last_displayed_at);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_verse_id ON daily_quotes(verse_id);

-- Add trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_daily_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER daily_quotes_updated_at
  BEFORE UPDATE ON daily_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_quotes_updated_at();

-- Enable Row Level Security
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active quotes
CREATE POLICY "Allow public read access to active quotes"
  ON daily_quotes
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to read all quotes
CREATE POLICY "Allow authenticated users to read all quotes"
  ON daily_quotes
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert/update/delete quotes
-- (In production, you may want to restrict this to admins only)
CREATE POLICY "Allow authenticated users to manage quotes"
  ON daily_quotes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default quote from Srila Prabhupada
INSERT INTO daily_quotes (
  quote_type,
  quote_ua,
  quote_en,
  author_ua,
  author_en,
  source_ua,
  source_en,
  priority,
  is_active
) VALUES (
  'custom',
  'За моєї відсутності читайте книжки. Все, про що я говорю, я написав у книжках. Ви можете підтримувати зв''язок зі мною через мої книги.',
  'In my absence, read my books. Everything I have spoken, I have written in my books. You can associate with me by reading my books.',
  'Шріла Прабгупада',
  'Srila Prabhupada',
  'Лист',
  'Letter',
  100,
  true
) ON CONFLICT DO NOTHING;

-- Create or update site_settings for verse_of_the_day configuration
INSERT INTO site_settings (key, value, description)
VALUES (
  'verse_of_the_day',
  jsonb_build_object(
    'enabled', true,
    'rotation_mode', 'sequential',
    'current_index', 0,
    'last_updated', NULL
  ),
  'Configuration for daily verse/quote rotation on homepage'
)
ON CONFLICT (key) DO UPDATE
SET value = COALESCE(site_settings.value, EXCLUDED.value);

-- Add comment to table
COMMENT ON TABLE daily_quotes IS 'Stores quotes (verses or custom) displayed on the homepage banner';
COMMENT ON COLUMN daily_quotes.quote_type IS 'Type of quote: verse (from verses table) or custom (manually entered)';
COMMENT ON COLUMN daily_quotes.priority IS 'Display priority (0-100), higher = more frequent display';
COMMENT ON COLUMN daily_quotes.display_count IS 'Number of times this quote has been displayed';
