import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";
import type { Track } from "./GlobalAudioPlayer.types";
import { useAudio } from "./GlobalAudioPlayer";

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

const title = (lang: "ua" | "en", ua?: string | null, en?: string | null) =>
  lang === "ua" ? (ua ?? en ?? "Без назви") : (en ?? ua ?? "Untitled");

export function convertSupabaseTrackToPlayerTrack(
  track: AudioTrack,
  playlist?: AudioPlaylist,
  language: "ua" | "en" = "ua",
): Track {
  return {
    id: track.id,
    title: title(language, track.title_ua, track.title_en),
    src: track.file_url,
    verseNumber: `Трек ${track.track_number}`,
    coverImage: playlist?.cover_image_url || undefined,
    duration: track.duration ?? undefined,
    metadata: {
      artist: playlist?.author || "Vedavoice",
      album: title(language, playlist?.title_ua, playlist?.title_en),
    },
  };
}

export async function loadTrackFromSupabase(id: string, language: "ua" | "en" = "ua"): Promise<Track | null> {
  const { data: track, error: te } = await supabase
    .from<any, AudioTrack>("audio_tracks")
    .select("id,title_ua,title_en,file_url,playlist_id,track_number,duration,lyrics_ua,lyrics_en")
    .eq("id", id)
    .single();

  if (te || !track) return null;

  const { data: playlist } = await supabase
    .from<any, AudioPlaylist>("audio_playlists")
    .select("id,title_ua,title_en,cover_image_url,author")
    .eq("id", track.playlist_id)
    .maybeSingle();

  return convertSupabaseTrackToPlayerTrack(track as AudioTrack, playlist ?? undefined, language);
}

export async function loadPlaylistTracks(playlistId: string, language: "ua" | "en" = "ua"): Promise<Track[]> {
  const [{ data: playlist, error: pe }, { data: tracks, error: te }] = await Promise.all([
    supabase
      .from<any, AudioPlaylist>("audio_playlists")
      .select("id,title_ua,title_en,cover_image_url,author")
      .eq("id", playlistId)
      .single(),
    supabase
      .from<any, AudioTrack>("audio_tracks")
      .select("id,title_ua,title_en,file_url,playlist_id,track_number,duration,lyrics_ua,lyrics_en")
      .eq("playlist_id", playlistId)
      .order("track_number", { ascending: true }),
  ]);

  if (pe || !playlist || te || !tracks?.length) return [];
  return (tracks as AudioTrack[]).map((t) => convertSupabaseTrackToPlayerTrack(t, playlist as AudioPlaylist, language));
}

export async function loadRecentTracks(
  userId: string | null,
  limit = 10,
  language: "ua" | "en" = "ua",
): Promise<Track[]> {
  if (!userId) return [];
  const { data: events } = await supabase
    .from<any, { track_id: string }>("audio_events")
    .select("track_id")
    .eq("user_id", userId)
    .eq("event_type", "play")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!events?.length) return [];
  const ids = Array.from(new Set(events.map((e) => e.track_id)));

  const { data: tracks } = await supabase
    .from<any, any>("audio_tracks")
    .select(
      `
      id,title_ua,title_en,file_url,playlist_id,track_number,duration,lyrics_ua,lyrics_en,
      playlist:audio_playlists ( id,title_ua,title_en,cover_image_url,author )
    `,
    )
    .in("id", ids);

  if (!tracks?.length) return [];

  const map = new Map(
    tracks.map((t: any) => [
      t.id,
      convertSupabaseTrackToPlayerTrack(t as AudioTrack, t.playlist as AudioPlaylist | undefined, language),
    ]),
  );
  return ids.map((id) => map.get(id)).filter(Boolean) as Track[];
}

export async function trackPlayEvent(
  trackId: string,
  userId: string | null,
  positionMs = 0,
  durationMs: number | null = null,
) {
  const { error } = await supabase.from<any, any>("audio_events").insert({
    track_id: trackId,
    user_id: userId,
    event_type: "play",
    position_ms: Math.max(0, Math.floor(positionMs)),
    duration_ms: durationMs,
  });
  if (error) console.error("Failed to track play event:", error);
}

export function useSupabasePlaylist(playlistId: string | null, language: "ua" | "en" = "ua") {
  const audio = useAudio();
  const setQueue = (audio as any)?.setQueue;
  useEffect(() => {
    let off = false;
    if (!playlistId || !setQueue) return;
    (async () => {
      const t = await loadPlaylistTracks(playlistId, language);
      if (!off && t.length) setQueue(t);
    })();
    return () => {
      off = true;
    };
  }, [playlistId, language, setQueue]);
  return {};
}

export function useAudioTracking(userId: string | null) {
  const { currentTrack, isPlaying, currentTime, duration } = useAudio() as any;
  const last = useRef<number>(-10000);
  useEffect(() => {
    if (!currentTrack || !isPlaying) return;
    const h = setTimeout(async () => {
      const now = Date.now();
      if (now - last.current >= 30_000) {
        last.current = now;
        await trackPlayEvent(
          currentTrack.id,
          userId,
          Math.floor(currentTime * 1000),
          Number.isFinite(duration) ? Math.floor((duration ?? 0) * 1000) : null,
        );
      }
    }, 3000);
    return () => clearTimeout(h);
  }, [currentTrack?.id, isPlaying, currentTime, duration, userId]);
}
