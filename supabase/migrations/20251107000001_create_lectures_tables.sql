-- Create lectures table for storing lecture metadata
CREATE TABLE IF NOT EXISTS public.lectures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE, -- vedabase ID (e.g., '720218levis')
  title_en TEXT NOT NULL,
  title_uk TEXT,
  lecture_date DATE NOT NULL,
  location_en TEXT NOT NULL,
  location_uk TEXT,
  lecture_type TEXT NOT NULL, -- 'Conversation', 'Walk', 'Lecture', 'Bhagavad-gita', 'Srimad-Bhagavatam', etc.
  audio_url TEXT,
  book_slug TEXT, -- Reference to book (e.g., 'bg', 'sb') if lecture is about a specific text
  canto_number INTEGER, -- For multi-volume books like SB
  chapter_number INTEGER, -- Chapter reference if applicable
  verse_number TEXT, -- Verse reference if applicable
  description_en TEXT,
  description_uk TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lecture_paragraphs table for storing lecture content
CREATE TABLE IF NOT EXISTS public.lecture_paragraphs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  paragraph_number INTEGER NOT NULL,
  content_en TEXT NOT NULL,
  content_uk TEXT,
  audio_timecode INTEGER, -- Time in seconds for audio synchronization
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lecture_id, paragraph_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lectures_date ON public.lectures(lecture_date DESC);
CREATE INDEX IF NOT EXISTS idx_lectures_type ON public.lectures(lecture_type);
CREATE INDEX IF NOT EXISTS idx_lectures_location ON public.lectures(location_en);
CREATE INDEX IF NOT EXISTS idx_lectures_book ON public.lectures(book_slug, chapter_number, verse_number);
CREATE INDEX IF NOT EXISTS idx_lecture_paragraphs_lecture_id ON public.lecture_paragraphs(lecture_id, paragraph_number);

-- Enable RLS on lectures tables
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_paragraphs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lectures (public read, admin write)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lectures' AND policyname = 'Anyone can view lectures') THEN
    CREATE POLICY "Anyone can view lectures" ON public.lectures FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lectures' AND policyname = 'Admins can insert lectures') THEN
    CREATE POLICY "Admins can insert lectures" ON public.lectures FOR INSERT TO authenticated
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lectures' AND policyname = 'Admins can update lectures') THEN
    CREATE POLICY "Admins can update lectures" ON public.lectures FOR UPDATE TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lectures' AND policyname = 'Admins can delete lectures') THEN
    CREATE POLICY "Admins can delete lectures" ON public.lectures FOR DELETE TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- RLS Policies for lecture_paragraphs (public read, admin write)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lecture_paragraphs' AND policyname = 'Anyone can view lecture paragraphs') THEN
    CREATE POLICY "Anyone can view lecture paragraphs" ON public.lecture_paragraphs FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lecture_paragraphs' AND policyname = 'Admins can insert lecture paragraphs') THEN
    CREATE POLICY "Admins can insert lecture paragraphs" ON public.lecture_paragraphs FOR INSERT TO authenticated
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lecture_paragraphs' AND policyname = 'Admins can update lecture paragraphs') THEN
    CREATE POLICY "Admins can update lecture paragraphs" ON public.lecture_paragraphs FOR UPDATE TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lecture_paragraphs' AND policyname = 'Admins can delete lecture paragraphs') THEN
    CREATE POLICY "Admins can delete lecture paragraphs" ON public.lecture_paragraphs FOR DELETE TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_lectures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at (drop first if exists)
DROP TRIGGER IF EXISTS update_lectures_updated_at_trigger ON public.lectures;
CREATE TRIGGER update_lectures_updated_at_trigger
  BEFORE UPDATE ON public.lectures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lectures_updated_at();
