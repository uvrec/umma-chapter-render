-- Фаза 3.1 & 3.2: Створення таблиць для аудіо-контенту з RLS політиками

-- Категорії аудіо (Аудіокниги, Лекції, Музика, Подкасти)
CREATE TABLE IF NOT EXISTS public.audio_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_uk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_uk TEXT,
  description_en TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Плейлісти/Альбоми
CREATE TABLE IF NOT EXISTS public.audio_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.audio_categories(id) ON DELETE CASCADE,
  title_uk TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_uk TEXT,
  description_en TEXT,
  cover_image_url TEXT,
  author TEXT,
  year INTEGER,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Треки (тільки посилання)
CREATE TABLE IF NOT EXISTS public.audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.audio_playlists(id) ON DELETE CASCADE,
  title_uk TEXT NOT NULL,
  title_en TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration INTEGER,
  track_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_audio_playlists_category ON public.audio_playlists(category_id);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_playlist ON public.audio_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_audio_categories_slug ON public.audio_categories(slug);

-- Тригери для updated_at
CREATE TRIGGER update_audio_playlists_updated_at
BEFORE UPDATE ON public.audio_playlists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audio_tracks_updated_at
BEFORE UPDATE ON public.audio_tracks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS політики
ALTER TABLE public.audio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

-- Всі можуть читати категорії
CREATE POLICY "Anyone can view categories" ON public.audio_categories 
FOR SELECT USING (true);

-- Всі можуть читати опубліковані плейлісти
CREATE POLICY "Anyone can view published playlists" ON public.audio_playlists 
FOR SELECT USING (is_published = true);

-- Всі можуть читати треки опублікованих плейлістів
CREATE POLICY "Anyone can view tracks" ON public.audio_tracks 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.audio_playlists 
    WHERE id = audio_tracks.playlist_id 
    AND is_published = true
  )
);

-- Тільки адміни можуть управляти категоріями
CREATE POLICY "Admins can manage categories" ON public.audio_categories 
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Тільки адміни можуть управляти плейлістами
CREATE POLICY "Admins can manage playlists" ON public.audio_playlists 
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Тільки адміни можуть управляти треками
CREATE POLICY "Admins can manage tracks" ON public.audio_tracks 
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Фаза 4: Початкові дані
INSERT INTO public.audio_categories (name_uk, name_en, slug, icon, display_order) VALUES
  ('Аудіокниги', 'Audiobooks', 'audiobooks', 'BookAudio', 1),
  ('Лекції', 'Lectures', 'lectures', 'Mic', 2),
  ('Музика', 'Music', 'music', 'Music', 3),
  ('Подкасти', 'Podcasts', 'podcasts', 'Radio', 4)
ON CONFLICT (slug) DO NOTHING;