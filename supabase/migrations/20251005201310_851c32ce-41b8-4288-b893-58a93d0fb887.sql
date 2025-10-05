-- Create pages table for CMS
CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title_ua text NOT NULL,
  title_en text NOT NULL,
  meta_description_ua text,
  meta_description_en text,
  content_ua text,
  content_en text,
  hero_image_url text,
  banner_image_url text,
  sections jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT true,
  seo_keywords text,
  og_image text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published pages"
ON public.pages
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage pages"
ON public.pages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for page media
INSERT INTO storage.buckets (id, name, public)
VALUES ('page-media', 'page-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for page-media bucket
CREATE POLICY "Public can view page media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'page-media');

CREATE POLICY "Admins can upload page media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'page-media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update page media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'page-media'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete page media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'page-media'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Seed data with existing pages
INSERT INTO public.pages (slug, title_ua, title_en, content_ua, content_en, hero_image_url, is_published, sections) VALUES
('home', 'Головна', 'Home', 
 '<h1>Прабгупада солов''їною</h1><p>Ласкаво просимо до ведичної бібліотеки</p>',
 '<h1>Prabhupada by Nightingale</h1><p>Welcome to the Vedic Library</p>',
 NULL,
 true,
 '[
   {"type": "hero", "title_ua": "Прабгупада солов''їною", "title_en": "Prabhupada by Nightingale", "subtitle_ua": "Ведична бібліотека з аудіокнигами", "subtitle_en": "Vedic library with audiobooks"},
   {"type": "features", "items": [
     {"icon": "Library", "title_ua": "Бібліотека", "title_en": "Library", "description_ua": "Велика колекція ведичної літератури", "description_en": "Large collection of Vedic literature", "link": "/library"},
     {"icon": "Headphones", "title_ua": "Аудіокниги", "title_en": "Audiobooks", "description_ua": "Слухайте священні тексти", "description_en": "Listen to sacred texts", "link": "/audio"},
     {"icon": "BookOpen", "title_ua": "Глосарій", "title_en": "Glossary", "description_ua": "Санскритські терміни та визначення", "description_en": "Sanskrit terms and definitions", "link": "/glossary"}
   ]}
 ]'::jsonb),

('library', 'Бібліотека', 'Library',
 '<h1>Бібліотека ведичної літератури</h1>',
 '<h1>Vedic Literature Library</h1>',
 NULL,
 true,
 '[]'::jsonb),

('contact', 'Контакти', 'Contact',
 '<h1>Зв''яжіться з нами</h1><p>Ми завжди раді відповісти на ваші запитання</p>',
 '<h1>Contact Us</h1><p>We are always happy to answer your questions</p>',
 NULL,
 true,
 '[]'::jsonb),

('donation', 'Підтримати проєкт', 'Support the Project',
 '<h1>Підтримати проєкт</h1><p>Ваша підтримка допомагає нам розвивати цей ресурс</p>',
 '<h1>Support the Project</h1><p>Your support helps us develop this resource</p>',
 NULL,
 true,
 '[]'::jsonb),

('blog', 'Блог', 'Blog',
 '<h1>Блог</h1><p>Останні новини та статті</p>',
 '<h1>Blog</h1><p>Latest news and articles</p>',
 NULL,
 true,
 '[]'::jsonb),

('about', 'Про нас', 'About Us',
 '<h1>Про проєкт</h1><p>Інформація про нашу місію та цілі</p>',
 '<h1>About the Project</h1><p>Information about our mission and goals</p>',
 NULL,
 true,
 '[]'::jsonb);