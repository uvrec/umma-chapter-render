// NewHome-with-GlobalPlayer-integration.tsx
// Приклад як оновити NewHome.tsx для роботи з новим GlobalAudioPlayer

import { useAudio } from "@/components/GlobalAudioPlayer";
import { loadTrackFromSupabase, loadPlaylistTracks, trackPlayEvent } from "@/components/GlobalAudioPlayer/GlobalAudioPlayer.supabase-adapter";
import { useAuth } from "@/contexts/AuthContext"; // або ваш auth context

// Замість старого MiniPlayer, використовуйте:

function Hero() {
  const { playTrack } = useAudio();
  const { user } = useAuth(); // для трекінгу
  
  // Приклад: "Продовжити прослуховування" з базою даних
  const handleContinueListening = async (trackId: string) => {
    const track = await loadTrackFromSupabase(trackId, 'ua');
    if (track) {
      playTrack(track);
      
      // Опціонально: записати подію в базу
      if (user) {
        trackPlayEvent(track.id, user.id);
      }
    }
  };

  return (
    <section>
      {/* ... */}
      <button onClick={() => handleContinueListening('track-id-from-db')}>
        Продовжити прослуховування
      </button>
    </section>
  );
}

// Для списку треків:
function LatestAudioTracks() {
  const { playTrack, addToPlaylist } = useAudio();
  const { data: tracks } = useQuery({
    queryKey: ['audio-tracks'],
    queryFn: async () => {
      const { data } = await supabase
        .from('audio_tracks')
        .select(`
          *,
          playlist:audio_playlists(*)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      return data;
    }
  });

  const handlePlay = async (dbTrack: any) => {
    // Конвертуємо в формат плеєра
    const track = {
      id: dbTrack.id,
      title: dbTrack.title_ua || dbTrack.title_en,
      src: dbTrack.file_url,
      coverImage: dbTrack.playlist?.cover_image_url,
      verseNumber: `Трек ${dbTrack.track_number}`,
      metadata: {
        artist: dbTrack.playlist?.author || 'Vedavoice',
        album: dbTrack.playlist?.title_ua
      }
    };
    
    playTrack(track);
  };

  return (
    <div>
      {tracks?.map(track => (
        <div key={track.id}>
          <h3>{track.title_ua}</h3>
          <button onClick={() => handlePlay(track)}>
            Грати зараз
          </button>
          <button onClick={() => addToPlaylist({
            id: track.id,
            title: track.title_ua,
            src: track.file_url
          })}>
            Додати до черги
          </button>
        </div>
      ))}
    </div>
  );
}

// Для плейлиста:
function PlaylistCard({ playlistId }: { playlistId: string }) {
  const { playTrack, clearPlaylist } = useAudio();

  const handlePlayPlaylist = async () => {
    const tracks = await loadPlaylistTracks(playlistId, 'ua');
    
    if (tracks.length > 0) {
      // Очищаємо попередній плейлист
      clearPlaylist();
      
      // Відтворюємо перший трек
      playTrack(tracks[0]);
      
      // Додаємо решту треків
      tracks.slice(1).forEach(track => {
        // Потрібно додати метод addToPlaylist в context
        // або playTrack автоматично додає до плейлиста
      });
    }
  };

  return (
    <button onClick={handlePlayPlaylist}>
      Грати плейлист
    </button>
  );
}

// ВАЖЛИВО: Видаліть старий MiniPlayer компонент з NewHome.tsx
// Він більше не потрібен, бо GlobalAudioPlayer завжди внизу екрану

export { Hero, LatestAudioTracks, PlaylistCard };
