// src/hooks/useAudioMetadata.ts
// Мінімально робочий хук для витягування метаданих і завантаження аудіо у Supabase
import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeFilename } from '@/utils/textNormalizer';

export type AudioMetadata = {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number; // сек
};

export const useAudioMetadata = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef<boolean>(false);

  const extractMetadata = useCallback(async (file: File): Promise<AudioMetadata | null> => {
    // Отримаємо тривалість через HTMLAudioElement
    const url = URL.createObjectURL(file);
    try {
      const duration = await new Promise<number>((resolve) => {
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.src = url;
        audio.onloadedmetadata = () => {
          resolve(Math.max(0, audio.duration || 0));
        };
        audio.onerror = () => resolve(0);
      });

      // Спробуємо вирізати назву з імені файлу
      const base = file.name.replace(/\.[^/.]+$/, '');
      return { title: base, duration };
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);

  const uploadToSupabase = useCallback(async (file: File, playlistId: string): Promise<{ success: boolean; track_id?: string; error?: string }> => {
    try {
      setIsProcessing(true);
      setProgress(5);

      console.log('Starting upload for file:', file.name, 'to playlist:', playlistId);

      // Перевіряємо доступ до storage
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      if (bucketError) console.error('Bucket error:', bucketError);

      // 1) Завантажуємо файл у storage
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3';
      const sanitizedName = sanitizeFilename(file.name);
      const path = `uploads/${playlistId}/${Date.now()}-${sanitizedName}`;

      console.log('Uploading to storage path:', path);
      console.log('Original filename:', file.name, '→ Sanitized:', sanitizedName);
      // Спочатку спробуємо audio-files, якщо не вийде - verse-audio
      let uploadError = null;
      let audioUrl = '';
      
      try {
        const { error: upErr } = await supabase.storage.from('audio-files').upload(path, file, { upsert: true });
        if (upErr) {
          console.warn('audio-files bucket failed:', upErr.message);
          uploadError = upErr;
        } else {
          console.log('Storage upload to audio-files successful');
          const { data: publicUrlData } = supabase.storage.from('audio-files').getPublicUrl(path);
          audioUrl = publicUrlData.publicUrl;
        }
      } catch (err) {
        console.warn('audio-files bucket not accessible, trying verse-audio');
        uploadError = err;
      }

      // Fallback до verse-audio bucket
      if (uploadError) {
        console.log('Trying verse-audio bucket as fallback');
        const { error: upErr2 } = await supabase.storage.from('verse-audio').upload(path, file, { upsert: true });
        if (upErr2) {
          console.error('Storage upload to verse-audio failed:', upErr2);
          throw upErr2;
        }
        console.log('Storage upload to verse-audio successful');
        const { data: publicUrlData } = supabase.storage.from('verse-audio').getPublicUrl(path);
        audioUrl = publicUrlData.publicUrl;
      }

      setProgress(50);

      // 2) Метадані
      const md = await extractMetadata(file);
      setProgress(70);

      // 3) Визначимо наступний track_number
      let track_number = 1;
      const { data: existingTracks } = await supabase
        .from('audio_tracks')
        .select('track_number')
        .eq('playlist_id', playlistId)
        .order('track_number', { ascending: false })
        .limit(1);
      if (existingTracks && existingTracks.length > 0) {
        track_number = (existingTracks[0] as any).track_number + 1;
      }

      // 4) Створюємо запис у audio_tracks
      const title = md?.title || file.name.replace(/\.[^/.]+$/, '');
      
      // Перевіряємо автентифікацію користувача
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Користувач не автентифікований. Увійдіть в систему для завантаження файлів.');
      }

      const insertData = {
        playlist_id: playlistId,
        title_ua: md?.title || file.name.replace(/\.[^/.]+$/, ""),
        title_en: md?.title || file.name.replace(/\.[^/.]+$/, ""),
        audio_url: audioUrl,
        track_number,
        duration: md?.duration ? Math.round(md.duration) : null,
      };      console.log('Inserting track data:', insertData);

      const { data: inserted, error: insErr } = await supabase
        .from('audio_tracks')
        .insert(insertData)
        .select('id')
        .single();

      if (insErr) {
        console.error('Insert error:', insErr);
        if (insErr.message.includes('row-level security policy')) {
          throw new Error('Недостатньо прав для додавання треків. Зверніться до адміністратора.');
        }
        throw insErr;
      }

      setProgress(100);
      return { success: true, track_id: (inserted as any).id as string };
    } catch (e: any) {
      console.error('uploadToSupabase error', e);
      return { success: false, error: e?.message || 'Upload failed' };
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [extractMetadata]);

  const uploadMultiple = useCallback(async (files: File[], playlistId: string) => {
    const results = [] as Array<{ success: boolean; track_id?: string; error?: string }>;
    for (let i = 0; i < files.length; i++) {
      if (abortRef.current) break;
      const res = await uploadToSupabase(files[i], playlistId);
      results.push(res);
    }
    return results;
  }, [uploadToSupabase]);

  const cancel = useCallback(() => {
    abortRef.current = true;
  }, []);

  return {
    isProcessing,
    progress,
    extractMetadata,
    uploadToSupabase,
    uploadMultiple,
    cancel,
  };
};