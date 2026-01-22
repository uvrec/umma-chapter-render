-- Bengali Lexicon (English to Bengali Dictionary)
-- Source: https://github.com/MinhasKamal/BengaliDictionary (via Nafisa41/Dictionary--English-to-Bangla-)
-- License: GPL-3.0
-- Contains 103,650 English words with Bengali translations

-- Main lexicon table
CREATE TABLE IF NOT EXISTS bengali_lexicon (
  id BIGSERIAL PRIMARY KEY,
  word_en TEXT NOT NULL UNIQUE,    -- English word (unique for upsert)
  word_bn TEXT NOT NULL,           -- Bengali translation(s)

  -- Search optimization
  word_en_normalized TEXT,         -- Normalized for search (lowercase)

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_bengali_lexicon_word_en ON bengali_lexicon(word_en);
CREATE INDEX IF NOT EXISTS idx_bengali_lexicon_word_en_normalized ON bengali_lexicon(word_en_normalized);

-- Full-text search index for Bengali meanings
CREATE INDEX IF NOT EXISTS idx_bengali_lexicon_word_bn_gin ON bengali_lexicon
  USING gin(to_tsvector('simple', COALESCE(word_bn, '')));

-- Full-text search index for English words
CREATE INDEX IF NOT EXISTS idx_bengali_lexicon_word_en_gin ON bengali_lexicon
  USING gin(to_tsvector('english', COALESCE(word_en, '')));

-- Function to normalize English words for search
CREATE OR REPLACE FUNCTION normalize_english_word(word TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(TRIM(word));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Search function for Bengali dictionary by English word
CREATE OR REPLACE FUNCTION search_bengali_lexicon(
  search_term TEXT,
  search_mode TEXT DEFAULT 'contains',  -- 'exact', 'starts_with', 'contains'
  result_limit INT DEFAULT 50
)
RETURNS TABLE (
  id BIGINT,
  word_en TEXT,
  word_bn TEXT,
  relevance FLOAT
) AS $$
DECLARE
  normalized_term TEXT;
BEGIN
  normalized_term := normalize_english_word(search_term);

  RETURN QUERY
  SELECT
    l.id,
    l.word_en,
    l.word_bn,
    CASE
      WHEN l.word_en_normalized = normalized_term THEN 1.0
      WHEN l.word_en_normalized LIKE normalized_term || '%' THEN 0.8
      WHEN l.word_en_normalized LIKE '%' || normalized_term || '%' THEN 0.5
      ELSE 0.3
    END::FLOAT as relevance
  FROM bengali_lexicon l
  WHERE
    CASE search_mode
      WHEN 'exact' THEN l.word_en_normalized = normalized_term
      WHEN 'starts_with' THEN l.word_en_normalized LIKE normalized_term || '%'
      ELSE l.word_en_normalized LIKE '%' || normalized_term || '%'
    END
  ORDER BY relevance DESC, LENGTH(l.word_en) ASC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Search by Bengali word/meaning
CREATE OR REPLACE FUNCTION search_bengali_by_bengali(
  search_term TEXT,
  result_limit INT DEFAULT 50
)
RETURNS TABLE (
  id BIGINT,
  word_en TEXT,
  word_bn TEXT,
  relevance FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.word_en,
    l.word_bn,
    CASE
      WHEN l.word_bn = search_term THEN 1.0
      WHEN l.word_bn LIKE search_term || '%' THEN 0.8
      WHEN l.word_bn LIKE '%' || search_term || '%' THEN 0.5
      ELSE ts_rank(to_tsvector('simple', COALESCE(l.word_bn, '')), plainto_tsquery('simple', search_term))
    END::FLOAT as relevance
  FROM bengali_lexicon l
  WHERE
    l.word_bn LIKE '%' || search_term || '%'
    OR to_tsvector('simple', COALESCE(l.word_bn, '')) @@ plainto_tsquery('simple', search_term)
  ORDER BY relevance DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Get word by ID
CREATE OR REPLACE FUNCTION get_bengali_word(word_id BIGINT)
RETURNS TABLE (
  id BIGINT,
  word_en TEXT,
  word_bn TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.word_en,
    l.word_bn
  FROM bengali_lexicon l
  WHERE l.id = word_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security
ALTER TABLE bengali_lexicon ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Bengali lexicon is publicly readable"
  ON bengali_lexicon
  FOR SELECT
  TO public
  USING (true);

-- Comment for attribution
COMMENT ON TABLE bengali_lexicon IS 'Bengali lexicon from MinhasKamal/BengaliDictionary. License: GPL-3.0. Contains ~103,650 English-Bengali word pairs.';
