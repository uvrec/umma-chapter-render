import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

export type AudioTrack = {
  id: string;
  title: string;
  src: string;
  playlist_title?: string;
  playlist_id?: string;
  track_number?: number;
};

type Options = {
  playlistId?: string;
  categorySlug?: string;
  limit?: number;
};

// ---- простий in-memory кеш blob-ів (живе до перезавантаження сторінки)
const mediaCache = new Map<string, { objectUrl: string; blob: Blob }>();

async function getCachedUrl(src: string): Promise<string> {
  const existing = mediaCache.get(src);
  if (existing) return existing.objectUrl;

  // однаковий запит повторно в мережу не піде — браузер сам ще й диск кеш заюзає,
  // але ми тримаємо Blob у пам'яті і віддаємо objectURL, щоб гарантовано уникнути перелоків
  const resp = await fetch(src, { cache: "force-cache" });
  if (!resp.ok) throw new Error(`Failed to fetch audio: ${resp.status}`);
  const blob = await resp.blob();
  const objectUrl = URL.createObjectURL(blob);
  mediaCache.set(src, { objectUrl, blob });
  return objectUrl;
}

export const useAudioQueue = (options?: Options) => {
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // джерело, яке точно з кешу/пам'яті
  const [currentPlayableSrc, setCurrentPlayableSrc] = useState<string | undefined>(undefined);
  // токен для “мʼякого” повтору, якщо ви не керуєте <audio/> напряму
  const [repeatToken, setRepeatToken] = useState(0);

  // опційний прив’язаний audio елемент (для миттєвого reset без remount)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const attachAudioEl = useCallback(
    (el: HTMLAudioElement | null) => {
      audioRef.current = el;
      // якщо вже є playableSrc — синхронізуємо
      if (el && currentPlayableSrc) {
        if (el.src !== currentPlayableSrc) el.src = currentPlayableSrc;
      }
    },
    [currentPlayableSrc],
  );

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ["audio-queue", options?.playlistId, options?.categorySlug, options?.limit],
    staleTime: 5 * 60 * 1000,
    enabled: !!(options?.playlistId || options?.categorySlug),
    queryFn: async () => {
      let query = supabase
        .from("audio_tracks")
        .select(
          `
            id,
            title_ua,
            audio_url,
            playlist_id,
            track_number,
            audio_playlists!inner (
              id,
              title_ua,
              slug,
              is_published,
              audio_categories ( slug )
            )
          `,
        )
        .eq("audio_playlists.is_published", true);

      if (options?.playlistId) query = query.eq("playlist_id", options.playlistId);
      if (options?.categorySlug) query = query.eq("audio_playlists.audio_categories.slug", options.categorySlug);

      query = query.order("track_number", { ascending: true });
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(
        (track: any): AudioTrack => ({
          id: track.id,
          title: track.title_uk,
          src: track.audio_url,
          playlist_title: track.audio_playlists?.title_uk,
          playlist_id: track.audio_playlists?.id ?? track.playlist_id ?? undefined,
          track_number: track.track_number ?? undefined,
        }),
      );
    },
  });

  useEffect(() => {
    if (tracks.length > 0) {
      setQueue(tracks);
    } else {
      setQueue([]);
      setCurrentIndex(0);
      localStorage.removeItem("vv_last_track_id");
      localStorage.removeItem("vv_last_playlist_id");
      setCurrentPlayableSrc(undefined);
    }
  }, [tracks]);

  // відновити останній
  useEffect(() => {
    if (queue.length === 0) return;
    const lastTrackId = localStorage.getItem("vv_last_track_id");
    if (!lastTrackId) return;
    const idx = queue.findIndex((t) => t.id === lastTrackId);
    if (idx !== -1) setCurrentIndex(idx);
  }, [queue]);

  // кешування поточного треку та прелоад наступного
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = queue[currentIndex];
      if (!t) {
        setCurrentPlayableSrc(undefined);
        return;
      }
      try {
        const url = await getCachedUrl(t.src);
        if (cancelled) return;
        setCurrentPlayableSrc(url);
        // синхронізуємо підʼєднаний аудіо-елемент
        if (audioRef.current && audioRef.current.src !== url) {
          audioRef.current.src = url;
        }
        // прелоад наступного (один вперед)
        const next = queue[(currentIndex + 1) % queue.length];
        if (next) {
          getCachedUrl(next.src).catch(() => {});
        }
      } catch {
        // якщо щось пішло не так — не ламаємо UX
        setCurrentPlayableSrc(undefined);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queue, currentIndex]);

  const persistCurrent = useCallback(
    (index: number) => {
      const track = queue[index];
      if (!track) return;
      localStorage.setItem("vv_last_track_id", track.id);
      if (track.playlist_id) localStorage.setItem("vv_last_playlist_id", track.playlist_id);
    },
    [queue],
  );

  const addToQueue = useCallback((track: AudioTrack) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback(
    (trackId: string) => {
      setQueue((prev) => {
        const idx = prev.findIndex((t) => t.id === trackId);
        if (idx === -1) return prev;
        const next = prev.filter((t) => t.id !== trackId);

        if (next.length === 0) {
          setCurrentIndex(0);
          setCurrentPlayableSrc(undefined);
          localStorage.removeItem("vv_last_track_id");
          localStorage.removeItem("vv_last_playlist_id");
        } else if (idx < currentIndex) {
          setCurrentIndex((i) => Math.max(0, i - 1));
        } else if (idx === currentIndex) {
          const clamped = Math.min(currentIndex, next.length - 1);
          setCurrentIndex(clamped);
          setTimeout(() => persistCurrent(clamped), 0);
        }
        return next;
      });
    },
    [currentIndex, persistCurrent],
  );

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(0);
    setCurrentPlayableSrc(undefined);
    localStorage.removeItem("vv_last_track_id");
    localStorage.removeItem("vv_last_playlist_id");
  }, []);

  const setTrack = useCallback(
    (index: number) => {
      if (index < 0 || index >= queue.length) return;
      setCurrentIndex(index);
      persistCurrent(index);
      // repeatToken не чіпаємо — це лише для явного repeat()
    },
    [queue.length, persistCurrent],
  );

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    const next = (currentIndex + 1) % queue.length;
    setTrack(next);
  }, [currentIndex, queue.length, setTrack]);

  const previousTrack = useCallback(() => {
    if (queue.length === 0) return;
    const prev = (currentIndex - 1 + queue.length) % queue.length;
    setTrack(prev);
  }, [currentIndex, queue.length, setTrack]);

  // головне: repeat з кешу
  const repeat = useCallback((audioEl?: HTMLAudioElement | null) => {
    // якщо дали <audio>, скинемо час і зіграємо з того ж objectURL
    const el = audioEl ?? audioRef.current ?? null;
    if (el) {
      try {
        el.currentTime = 0;
        // якщо пауза — одразу play (за потреби)
        if (el.paused) el.play().catch(() => {});
      } catch {}
    } else {
      // без доступу до елемента — інкрементимо токен для контролю зверху
      setRepeatToken((t) => t + 1);
    }
  }, []);

  const currentTrack = useMemo(() => queue[currentIndex], [queue, currentIndex]);

  return {
    // дані
    queue,
    currentIndex,
    currentTrack,
    isLoading,
    playableSrc: currentPlayableSrc, // <- використовуйте як src для <audio/>
    repeatToken, // <- можете прокинути як key у <audio key={repeatToken} />

    // керування
    addToQueue,
    removeFromQueue,
    clearQueue,
    setTrack,
    nextTrack,
    previousTrack,
    repeat,

    // опційно: дайте нам ваш елемент, щоб repeat працював миттєво
    attachAudioEl,
  };
};
