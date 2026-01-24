// AudiobookView.tsx - Mobile uses global player, Desktop uses embedded player
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ArrowLeft, User, Music, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAudio } from "@/contexts/ModernAudioContext";
import { cn } from "@/lib/utils";

type Track = {
  id: string;
  title_uk?: string | null;
  title_en?: string | null;
  audio_url: string | null;
  duration?: number | null;
  track_number?: number | null;
  is_published?: boolean | null;
};

type Playlist = {
  id: string;
  title_uk?: string | null;
  title_en?: string | null;
  author?: string | null;
  year?: number | null;
  cover_image_url?: string | null;
  description_uk?: string | null;
  description_en?: string | null;
  is_published?: boolean | null;
  tracks?: Track[];
};

function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${`${s}`.padStart(2, "0")}`;
}

export const AudiobookView = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { playPlaylist, currentTrack, isPlaying } = useAudio();

  // Check if id is a UUID or a slug
  const isUUID = id ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) : false;

  const { data: audiobook, isLoading } = useQuery({
    queryKey: ["audiobook", id],
    enabled: !!id,
    queryFn: async (): Promise<Playlist | null> => {
      let query = supabase
        .from("audio_playlists")
        .select(`*, tracks:audio_tracks(*)`)
        .eq("is_published", true)
        .order("track_number", { foreignTable: "audio_tracks", ascending: true });

      if (isUUID) {
        query = query.eq("id", id);
      } else {
        query = query.eq("slug", id);
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const filteredTracks =
        (data.tracks as Track[] | undefined)?.filter((t) => t.audio_url && (t.is_published ?? true)) ?? [];

      filteredTracks.sort((a, b) => {
        const A = a.track_number ?? Number.MAX_SAFE_INTEGER;
        const B = b.track_number ?? Number.MAX_SAFE_INTEGER;
        if (A !== B) return A - B;
        return String(a.id).localeCompare(String(b.id));
      });

      return { ...data, tracks: filteredTracks } as Playlist;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Завантаження...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Аудіокнига не знайдена</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Tracks for PlaylistPlayer (desktop)
  const playlistTracks =
    audiobook.tracks?.map((track) => ({
      id: track.id,
      title: track.title_uk || track.title_en || "Без назви",
      duration: formatDuration(track.duration),
      src: track.audio_url!,
    })) ?? [];

  // Tracks for global player (mobile)
  const globalPlayerTracks =
    audiobook.tracks?.map((track) => ({
      id: track.id,
      title: track.title_uk || track.title_en || "Без назви",
      title_uk: track.title_uk || undefined,
      title_en: track.title_en || undefined,
      src: track.audio_url!,
      coverImage: audiobook.cover_image_url || undefined,
      artist: audiobook.author || undefined,
      album: audiobook.title_uk || audiobook.title_en || undefined,
      duration: track.duration || undefined,
      track_number: track.track_number || undefined,
    })) ?? [];

  const handlePlayTrack = (index: number) => {
    playPlaylist(globalPlayerTracks, index);
  };

  // Mobile layout - simple track list, plays via global player
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        <main className="container mx-auto px-4 py-4">
          {/* Back */}
          <Link to="/audio" className="inline-flex items-center mb-4 text-primary hover:text-primary/80 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Назад
          </Link>

          {/* Compact header */}
          <div className="flex gap-3 mb-4">
            {audiobook.cover_image_url && (
              <div className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <img
                  src={audiobook.cover_image_url}
                  alt={audiobook.title_uk || audiobook.title_en || ""}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-foreground line-clamp-2 mb-1">
                {audiobook.title_uk || audiobook.title_en || "Аудіокнига"}
              </h1>
              {audiobook.author && (
                <p className="text-sm text-muted-foreground truncate">{audiobook.author}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {playlistTracks.length} треків
                {audiobook.year && ` • ${audiobook.year}`}
              </p>
            </div>
          </div>

          {/* Track list */}
          <div className="divide-y divide-border/50">
            {audiobook.tracks?.map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const title = track.title_uk || track.title_en || "Без назви";

              return (
                <div
                  key={track.id}
                  onClick={() => handlePlayTrack(index)}
                  className={cn(
                    "flex items-center gap-3 py-3 cursor-pointer active:bg-muted/50",
                    isCurrentTrack && "text-primary"
                  )}
                >
                  <span className="w-6 text-center text-sm text-muted-foreground">
                    {isCurrentTrack && isPlaying ? (
                      <Play className="w-4 h-4 text-primary fill-primary mx-auto" />
                    ) : (
                      track.track_number || index + 1
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", isCurrentTrack && "text-primary")}>
                      {title}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              );
            })}
          </div>

          {playlistTracks.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Немає доступних треків
            </div>
          )}
        </main>
      </div>
    );
  }

  // Desktop layout - embedded PlaylistPlayer
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <Link to="/audio" className="inline-flex items-center mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до аудіокниг
          </Link>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Left column: Info */}
            <div>
              {audiobook.cover_image_url && (
                <div className="w-full bg-muted rounded-lg overflow-hidden mb-6">
                  <img
                    src={audiobook.cover_image_url}
                    alt={audiobook.title_uk || audiobook.title_en || "Аудіокнига"}
                    className="w-full h-auto object-cover aspect-[3/4]"
                  />
                </div>
              )}

              <h1 className="text-2xl font-bold text-foreground mb-2">
                {audiobook.title_uk || audiobook.title_en || "Аудіокнига"}
              </h1>

              {audiobook.author && (
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <User className="w-4 h-4" />
                  <span>{audiobook.author}</span>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  <span>{playlistTracks.length} треків</span>
                </div>
                {audiobook.year && <span>{audiobook.year} р.</span>}
              </div>

              {audiobook.description_uk && (
                <div className="prose prose-sm text-foreground">
                  <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                  <p className="text-muted-foreground leading-relaxed">{audiobook.description_uk}</p>
                </div>
              )}
            </div>

            {/* Right column: Player */}
            <div>
              {playlistTracks.length > 0 ? (
                <PlaylistPlayer
                  tracks={playlistTracks}
                  title={audiobook.title_uk || audiobook.title_en || "Аудіокнига"}
                  albumCover={audiobook.cover_image_url || undefined}
                />
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Немає доступних треків</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
