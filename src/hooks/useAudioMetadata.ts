// src/hooks/useAudioMetadata.ts
// Мінімально робочий хук для витягування метаданих і завантаження аудіо у Supabase
import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

      // 1) Завантажуємо файл у storage
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3';
      const path = `uploads/${playlistId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('audio-files').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      setProgress(50);

      const { data: publicUrlData } = supabase.storage.from('audio-files').getPublicUrl(path);
      const audioUrl = publicUrlData.publicUrl;

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
      const { data: inserted, error: insErr } = await supabase
        .from('audio_tracks')
        .insert({
          title_ua: title,
          title_en: title,
          playlist_id: playlistId,
          audio_url: audioUrl,
          track_number,
          duration: md?.duration ? Math.round(md.duration) : null,
          file_format: ext,
        })
        .select('id')
        .single();

      if (insErr) throw insErr;

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