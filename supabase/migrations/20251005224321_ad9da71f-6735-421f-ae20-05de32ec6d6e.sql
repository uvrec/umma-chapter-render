-- Create static_page_metadata table for managing metadata of static pages
CREATE TABLE public.static_page_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_ua TEXT NOT NULL,
  title_en TEXT NOT NULL,
  meta_description_ua TEXT,
  meta_description_en TEXT,
  hero_image_url TEXT,
  og_image TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.static_page_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view static page metadata"
  ON public.static_page_metadata
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage static page metadata"
  ON public.static_page_metadata
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_static_page_metadata_updated_at
  BEFORE UPDATE ON public.static_page_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for contact page
INSERT INTO public.static_page_metadata (
  slug, 
  title_ua, 
  title_en, 
  meta_description_ua, 
  meta_description_en,
  seo_keywords
) VALUES (
  'contact',
  'Контакти',
  'Contact Us',
  'Зв''яжіться з нами. Ми відповімо на всі ваші запитання про ведичні знання та наш проєкт.',
  'Contact us. We will answer all your questions about Vedic knowledge and our project.',
  'контакти, contact, зв''язок, електронна пошта, соціальні мережі'
);