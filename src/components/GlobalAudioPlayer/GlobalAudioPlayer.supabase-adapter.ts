// GlobalAudioPlayer.supabase-adapter.ts
// Адаптер для інтеграції GlobalAudioPlayer з існуючою Supabase базою

import { supabase } from "@/integrations/supabase/client";
import type { Track } from './GlobalAudioPlayer.types';

// Типи з вашої бази даних
type AudioTrack = {
  id: string;
  title_ua: string | null;
  title_en: string | null;
  file_url: string;
  playlist_id: string;
  track_number: number;
  duration: number | null;
  lyrics_ua: string | null;
  lyrics_en: string | null;
};

type AudioPlaylist = {
  id: string;
  title_ua: string;
  title_en: string;
  cover_image_url: string | null;
  author: string | null;
};

/**
 * Конвертує трек з Supabase в формат для GlobalAudioPlayer
 */
export function convertSupabaseTrackToPlayerTrack(
  track: AudioTrack,
  playlist?: AudioPlaylist,
  language: 'ua' | 'en' = 'ua'
): Track {
  return {
    id: track.id,
    title: language === 'ua' ? (track.title_ua || track.title_en || 'Без назви') : (track.title_en || track.title_ua || 'Untitled'),
    src: track.file_url,
    url: track.file_url,
    verseNumber: `Трек ${track.track_number}`,
    coverImage: playlist?.cover_image_url || undefined,
    duration: track.duration || undefined,
    metadata: {
      artist: playlist?.author || 'Vedavoice',
      album: language === 'ua' ? playlist?.title_ua : playlist?.title_en,
    }
  };
}

/**
 * Завантажує трек з бази даних по ID
 */
export async function loadTrackFromSupabase(
  trackId: string,
  language: 'ua' | 'en' = 'ua'
): Promise<Track | null> {
  const { data: track, error: trackError } = await supabase
    .from('audio_tracks')
    .select('*')
    .eq('id', trackId)
    .single();

  if (trackError || !track) {
    console.error('Failed to load track:', trackError);
    return null;
  }

  // Завантажуємо інформацію про плейлист для обкладинки
  const { data: playlist } = await supabase
    .from('audio_playlists')
    .select('id, title_ua, title_en, cover_image_url, author')
    .eq('id', track.playlist_id)
    .single();

  return convertSupabaseTrackToPlayerTrack(track, playlist || undefined, language);
}

/**
 * Завантажує всі треки з плейлиста
 */
export async function loadPlaylistTracks(
  playlistId: string,
  language: 'ua' | 'en' = 'ua'
): Promise<Track[]> {
  // Завантажуємо плейлист
  const { data: playlist, error: playlistError } = await supabase
    .from('audio_playlists')
    .select('*')
    .eq('id', playlistId)
    .single();

  if (playlistError || !playlist) {
    console.error('Failed to load playlist:', playlistError);
    return [];
  }

  // Завантажуємо треки
  const { data: tracks, error: tracksError } = await supabase
    .from('audio_tracks')
    .select('*')
    .eq('playlist_id', playlistId)
    .order('track_number');

  if (tracksError || !tracks) {
    console.error('Failed to load tracks:', tracksError);
    return [];
  }

  return tracks.map(track => convertSupabaseTrackToPlayerTrack(track, playlist, language));
}

/**
 * Завантажує останні відтворювані треки користувача
 */
export async function loadRecentTracks(
  userId: string | null,
  limit: number = 10,
  language: 'ua' | 'en' = 'ua'
): Promise<Track[]> {
  if (!userId) return [];

  const { data: events, error } = await supabase
    .from('audio_events')
    .select('track_id')
    .eq('user_id', userId)
    .eq('event_type', 'play')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !events) {
    console.error('Failed to load recent tracks:', error);
    return [];
  }

  // Унікальні ID треків
  const uniqueTrackIds = [...new Set(events.map(e => e.track_id))];

  // Завантажуємо треки
  const tracks: Track[] = [];
  for (const trackId of uniqueTrackIds) {
    const track = await loadTrackFromSupabase(trackId, language);
    if (track) tracks.push(track);
  }

  return tracks;
}

/**
 * Записує подію відтворення в базу (для аналітики)
 */
export async function trackPlayEvent(
  trackId: string,
  userId: string | null,
  positionMs: number = 0,
  durationMs: number | null = null
) {
  const { error } = await supabase
    .from('audio_events')
    .insert({
      track_id: trackId,
      user_id: userId,
      event_type: 'play',
      position_ms: positionMs,
      duration_ms: durationMs,
    });

  if (error) {
    console.error('Failed to track play event:', error);
  }
}

/**
 * Хук для завантаження плейлиста з бази та додавання до плеєра
 */
import { useEffect } from 'react';
import { useAudio } from './GlobalAudioPlayer';

export function useSupabasePlaylist(playlistId: string | null, language: 'ua' | 'en' = 'ua') {
  const { playlist, clearPlaylist } = useAudio();

  useEffect(() => {
    if (!playlistId) return;

    loadPlaylistTracks(playlistId, language).then(tracks => {
      clearPlaylist();
      tracks.forEach(track => {
        // Додаємо треки до плеєра
        // Тут потрібен метод addToPlaylist або setPlaylist
      });
    });
  }, [playlistId, language]);

  return { playlist };
}

/**
 * Хук для автоматичного трекінгу подій
 */
export function useAudioTracking(userId: string | null) {
  const { currentTrack, isPlaying, currentTime } = useAudio();

  useEffect(() => {
    if (!currentTrack || !isPlaying) return;

    // Трекаємо подію після 3 секунд відтворення
    const timer = setTimeout(() => {
      trackPlayEvent(currentTrack.id, userId, currentTime * 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentTrack, isPlaying, userId]);
}

/**
 * Приклад використання в компоненті
 */
export const SupabasePlayerIntegrationExample = () => {
  const { playTrack, addToPlaylist } = useAudio();
  const language = 'ua'; // або з context

  // Відтворити один трек
  const handlePlayTrack = async (trackId: string) => {
    const track = await loadTrackFromSupabase(trackId, language);
    if (track) {
      playTrack(track);
    }
  };

  // Додати весь плейлист до черги
  const handleAddPlaylist = async (playlistId: string) => {
    const tracks = await loadPlaylistTracks(playlistId, language);
    tracks.forEach(track => addToPlaylist(track));
  };

  return null; // приклад
};
