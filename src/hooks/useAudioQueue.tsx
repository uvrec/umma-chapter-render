import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export type AudioTrack = {
  id: string;
  title: string;
  src: string;
  playlist_title?: string;
  playlist_id?: string;
  track_number?: number;
};

/**
 * Hook для завантаження та управління чергою аудіо
 * Можна використовувати для:
 * - Завантаження всіх треків плейлиста
 * - Завантаження рекомендованих треків
 * - Завантаження треків на основі категорії
 */
export const useAudioQueue = (options?: { playlistId?: string; categorySlug?: string; limit?: number }) => {
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Завантажити треки на основі опцій
  const { data: tracks, isLoading } = useQuery({
    queryKey: ["audio-queue", options?.playlistId, options?.categorySlug, options?.limit],
    staleTime: 5 * 60 * 1000, // 5 хвилин
    queryFn: async () => {
      let query = supabase
        .from("audio_tracks")
        .select(
          `
          id,
          title_ua,
          audio_url,
          track_number,
          audio_playlists!inner (
            id,
            title_ua,
            slug,
            is_published,
            audio_categories (
              slug
            )
          )
        `,
        )
        .eq("audio_playlists.is_published", true);

      // Фільтр по плейлисту
      if (options?.playlistId) {
        query = query.eq("playlist_id", options.playlistId);
      }

      // Фільтр по категорії
      if (options?.categorySlug) {
        query = query.eq("audio_playlists.audio_categories.slug", options.categorySlug);
      }

      // Сортування
      query = query.order("track_number", { ascending: true });

      // Ліміт
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((track: any) => ({
        id: track.id,
        title: track.title_ua,
        src: track.audio_url,
        playlist_title: track.audio_playlists?.title_ua,
        playlist_id: track.audio_playlists?.id,
        track_number: track.track_number,
      }));
    },
    enabled: !!(options?.playlistId || options?.categorySlug),
  });

  // Оновити чергу коли прийдуть дані
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setQueue(tracks);
    }
  }, [tracks]);

  // Завантажити останній прослуханий трек з localStorage
  useEffect(() => {
    const lastTrackId = localStorage.getItem("vv_last_track_id");
    const lastPlaylistId = localStorage.getItem("vv_last_playlist_id");

    if (lastTrackId && queue.length > 0) {
      const index = queue.findIndex((t) => t.id === lastTrackId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [queue]);

  // Методи управління чергою
  const addToQueue = (track: AudioTrack) => {
    setQueue((prev) => [...prev, track]);
  };

  const removeFromQueue = (trackId: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(0);
  };

  const setTrack = (index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      const track = queue[index];
      localStorage.setItem("vv_last_track_id", track.id);
      if (track.playlist_id) {
        localStorage.setItem("vv_last_playlist_id", track.playlist_id);
      }
    }
  };

  const nextTrack = () => {
    setTrack((currentIndex + 1) % queue.length);
  };

  const previousTrack = () => {
    setTrack((currentIndex - 1 + queue.length) % queue.length);
  };

  return {
    queue,
    currentIndex,
    currentTrack: queue[currentIndex],
    isLoading,
    addToQueue,
    removeFromQueue,
    clearQueue,
    setTrack,
    nextTrack,
    previousTrack,
  };
};
