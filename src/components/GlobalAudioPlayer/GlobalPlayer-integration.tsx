import { useAudio } from "@/components/GlobalAudioPlayer";
import { loadTrackFromSupabase, loadPlaylistTracks, trackPlayEvent } from "@/components/GlobalAudioPlayer/GlobalAudioPlayer.supabase-adapter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Hero() {
  const { playTrack } = useAudio();
  const { user } = useAuth();

  const handleContinueListening = async (trackId: string) => {
    const track = await loadTrackFromSupabase(trackId, "ua");
    if (track) {
      playTrack(track);
      if (user) trackPlayEvent(track.id, user.id);
    }
  };

  return (
    <section>
      <button onClick={() => handleContinueListening("track-id-from-db")}>
        Продовжити прослуховування
      </button>
    </section>
  );
}

export function LatestAudioTracks() {
  const { playTrack, addToQueue } = useAudio();

  const { data: tracks } = useQuery({
    queryKey: ["audio-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_tracks")
        .select(`
          id,title_ua,title_en,audio_url,playlist_id,track_number,duration,
          playlist:audio_playlists(id,title_ua,title_en,cover_image_url,author)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as Array<{
        id: string; title_ua: string|null; title_en: string|null; audio_url: string;
        playlist_id: string; track_number: number; duration: number|null;
        playlist: { id: string; title_ua: string; title_en: string; cover_image_url: string|null; author: string|null } | null;
      }>;
    },
  });

  const handlePlay = (t: NonNullable<typeof tracks>[number]) => {
    playTrack({
      id: t.id,
      title: t.title_ua ?? t.title_en ?? "Без назви",
      src: t.audio_url,
      coverImage: t.playlist?.cover_image_url ?? undefined,
      verseNumber: `Трек ${t.track_number}`,
      metadata: {
        artist: t.playlist?.author || "Vedavoice",
        album: t.playlist ? t.playlist.title_ua ?? t.playlist.title_en ?? undefined : undefined,
      },
    });
  };

  const handleAddToQueue = (t: NonNullable<typeof tracks>[number]) => {
    addToQueue({ id: t.id, title: t.title_ua ?? t.title_en ?? "Без назви", src: t.audio_url });
  };

  return (
    <div>
      {tracks?.map((t) => (
        <div key={t.id}>
          <h3>{t.title_ua ?? t.title_en ?? "Без назви"}</h3>
          <button onClick={() => handlePlay(t)}>Грати зараз</button>
          <button onClick={() => handleAddToQueue(t)}>Додати до черги</button>
        </div>
      ))}
    </div>
  );
}

export function PlaylistCard({ playlistId }: { playlistId: string }) {
  const { playTrack, setQueue } = useAudio();
  const handlePlayPlaylist = async () => {
    const tracks = await loadPlaylistTracks(playlistId, "ua");
    if (!tracks.length) return;
    setQueue(tracks);
    playTrack(tracks[0]);
  };
  return <button onClick={handlePlayPlaylist}>Грати плейлист</button>;
}
