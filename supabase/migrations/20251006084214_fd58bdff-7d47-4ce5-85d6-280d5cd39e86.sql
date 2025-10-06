-- Create storage bucket for verse audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verse-audio',
  'verse-audio',
  true,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/m4a', 'audio/wav', 'audio/ogg', 'audio/webm']
);

-- Create RLS policies for verse audio bucket
CREATE POLICY "Anyone can view verse audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'verse-audio');

CREATE POLICY "Admins can upload verse audio"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verse-audio' 
  AND auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can update verse audio"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'verse-audio' 
  AND auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

CREATE POLICY "Admins can delete verse audio"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'verse-audio' 
  AND auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);