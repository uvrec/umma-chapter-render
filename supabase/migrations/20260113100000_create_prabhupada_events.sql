-- ============================================
-- Prabhupada Events / Timeline
-- Хронологічний індекс подій життя Шріли Прабгупади
-- ============================================
--
-- Джерела:
-- - Transcendental Diary (td)
-- - Srila Prabhupada Lilamrta (spl)
-- - Letters
-- - Lectures
-- - Morning Walks
-- - Room Conversations
--
-- Кожна дата = окремий запис з посиланням на джерело

CREATE TABLE IF NOT EXISTS public.prabhupada_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Date info
  event_date date NOT NULL,                    -- 1975-11-26
  date_display varchar(50) NOT NULL,           -- "November 26th, 1975"
  year smallint GENERATED ALWAYS AS (EXTRACT(YEAR FROM event_date)) STORED,
  month smallint GENERATED ALWAYS AS (EXTRACT(MONTH FROM event_date)) STORED,
  day smallint GENERATED ALWAYS AS (EXTRACT(DAY FROM event_date)) STORED,

  -- Location
  location_en varchar(255),                    -- "New Delhi, India"
  location_ua varchar(255),

  -- Summary/Title
  title_en varchar(500),                       -- Short description of events that day
  title_ua varchar(500),

  -- Source reference
  source_type varchar(50) NOT NULL,            -- 'diary', 'letter', 'lecture', 'conversation', 'biography'
  source_book_slug varchar(50),                -- 'td', 'spl', etc.
  source_volume smallint,                      -- Volume number
  source_chapter smallint,                     -- Chapter number
  source_verse varchar(50),                    -- Verse/entry number (for verses table link)
  source_url varchar(500),                     -- Direct link to content

  -- Content preview
  content_preview_en text,                     -- First 500 chars of content
  content_preview_ua text,

  -- Full content (optional, for standalone events)
  content_en text,
  content_ua text,

  -- Metadata
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Unique constraint: one entry per date per source
  UNIQUE (event_date, source_type, source_book_slug, source_volume, source_chapter, source_verse)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_prabhupada_events_date ON public.prabhupada_events (event_date);
CREATE INDEX IF NOT EXISTS idx_prabhupada_events_year ON public.prabhupada_events (year);
CREATE INDEX IF NOT EXISTS idx_prabhupada_events_year_month ON public.prabhupada_events (year, month);
CREATE INDEX IF NOT EXISTS idx_prabhupada_events_source ON public.prabhupada_events (source_type, source_book_slug);
CREATE INDEX IF NOT EXISTS idx_prabhupada_events_location ON public.prabhupada_events (location_en);

-- RLS
ALTER TABLE public.prabhupada_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for prabhupada_events"
  ON public.prabhupada_events
  FOR SELECT
  USING (is_published = true);

-- Comments
COMMENT ON TABLE public.prabhupada_events IS 'Chronological index of Srila Prabhupada events from various sources';
COMMENT ON COLUMN public.prabhupada_events.source_type IS 'Type: diary, letter, lecture, conversation, biography';
COMMENT ON COLUMN public.prabhupada_events.source_verse IS 'Links to verses.verse_number for diary entries';
