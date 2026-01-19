-- Створити enum для типів лекцій
CREATE TYPE lecture_type AS ENUM (
  'Conversation',
  'Walk',
  'Morning Walk',
  'Lecture',
  'Bhagavad-gita',
  'Srimad-Bhagavatam',
  'Nectar of Devotion',
  'Sri Isopanisad',
  'Sri Caitanya-caritamrta',
  'Initiation',
  'Room Conversation',
  'Interview',
  'Arrival',
  'Departure',
  'Festival',
  'Bhajan',
  'Kirtan',
  'Other'
);

-- Створити таблицю lectures
CREATE TABLE public.lectures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_uk TEXT,
  lecture_date DATE NOT NULL,
  location_en TEXT NOT NULL,
  location_uk TEXT,
  lecture_type lecture_type NOT NULL DEFAULT 'Other',
  audio_url TEXT,
  book_slug TEXT,
  canto_number INTEGER,
  chapter_number INTEGER,
  verse_number TEXT,
  description_en TEXT,
  description_uk TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Створити індекси для lectures
CREATE INDEX idx_lectures_slug ON public.lectures(slug);
CREATE INDEX idx_lectures_date ON public.lectures(lecture_date DESC);
CREATE INDEX idx_lectures_type ON public.lectures(lecture_type);
CREATE INDEX idx_lectures_location ON public.lectures(location_en);
CREATE INDEX idx_lectures_book ON public.lectures(book_slug, canto_number, chapter_number);

-- Створити таблицю lecture_paragraphs
CREATE TABLE public.lecture_paragraphs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  paragraph_number INTEGER NOT NULL,
  content_en TEXT NOT NULL,
  content_uk TEXT,
  audio_timecode INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lecture_id, paragraph_number)
);

-- Створити індекси для lecture_paragraphs
CREATE INDEX idx_lecture_paragraphs_lecture ON public.lecture_paragraphs(lecture_id, paragraph_number);

-- Створити таблицю letters
CREATE TABLE public.letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  recipient_en TEXT NOT NULL,
  recipient_uk TEXT,
  letter_date DATE NOT NULL,
  location_en TEXT NOT NULL,
  location_uk TEXT,
  reference TEXT,
  address_block TEXT,
  content_en TEXT NOT NULL,
  content_uk TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Створити індекси для letters
CREATE INDEX idx_letters_slug ON public.letters(slug);
CREATE INDEX idx_letters_date ON public.letters(letter_date DESC);
CREATE INDEX idx_letters_recipient ON public.letters(recipient_en);
CREATE INDEX idx_letters_location ON public.letters(location_en);

-- Тригер для оновлення updated_at в lectures
CREATE TRIGGER update_lectures_updated_at
  BEFORE UPDATE ON public.lectures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Тригер для оновлення updated_at в letters
CREATE TRIGGER update_letters_updated_at
  BEFORE UPDATE ON public.letters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS для всіх таблиць
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- RLS політики для lectures (публічний перегляд, адміни можуть керувати)
CREATE POLICY "Anyone can view lectures"
  ON public.lectures
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert lectures"
  ON public.lectures
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update lectures"
  ON public.lectures
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete lectures"
  ON public.lectures
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS політики для lecture_paragraphs (публічний перегляд, адміни можуть керувати)
CREATE POLICY "Anyone can view lecture paragraphs"
  ON public.lecture_paragraphs
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert lecture paragraphs"
  ON public.lecture_paragraphs
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update lecture paragraphs"
  ON public.lecture_paragraphs
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete lecture paragraphs"
  ON public.lecture_paragraphs
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS політики для letters (публічний перегляд, адміни можуть керувати)
CREATE POLICY "Anyone can view letters"
  ON public.letters
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert letters"
  ON public.letters
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update letters"
  ON public.letters
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete letters"
  ON public.letters
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));