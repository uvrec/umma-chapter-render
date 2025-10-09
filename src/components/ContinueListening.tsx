import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import { getInProgress, AudioProgress } from "@/lib/audioTracking";
import { useNavigate } from "react-router-dom";

interface TrackWithPlaylist {
  id: string;
  title_ua: string;
  duration: number;
  playlist_id: string;
  audio_playlists: {
    id: string;
    title_ua: string;
    category_id: string;
    audio_categories: {
      slug: string;
    } | null;
  } | null;
}

export function ContinueListening() {
  const navigate = useNavigate();
  const [inProgressTracks, setInProgressTracks] = useState<AudioProgress[]>([]);

  useEffect(() => {
    const progress = getInProgress(6);
    setInProgressTracks(progress);
  }, []);

  const trackIds = inProgressTracks.map((p) => p.trackId);

  const { data: tracks, isLoading } = useQuery({
    queryKey: ["continue-listening", trackIds],
    queryFn: async () => {
      if (trackIds.length === 0) return [];

      const { data, error } = await supabase
        .from("audio_tracks")
        .select(
          `
          id,
          title_ua,
          duration,
          playlist_id,
          audio_playlists!inner (
            id,
            title_ua,
            category_id,
            audio_categories (
              slug
            )
          )
        `
        )
        .in("id", trackIds);

      if (error) throw error;
      return data as TrackWithPlaylist[];
    },
    enabled: trackIds.length > 0,
  });

  if (isLoading || !tracks || tracks.length === 0) {
    return null;
  }

  const tracksWithProgress = tracks
    .map((track) => {
      const progress = inProgressTracks.find((p) => p.trackId === track.id);
      return { ...track, progress };
    })
    .filter((t) => t.progress);

  if (tracksWithProgress.length === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercent = (track: (typeof tracksWithProgress)[0]) => {
    if (!track.progress || !track.duration) return 0;
    return (track.progress.position / track.duration) * 100;
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h2 className="mb-6 font-serif text-2xl font-semibold">Продовжити слухати</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracksWithProgress.map((track) => {
          const categorySlug = track.audio_playlists?.audio_categories?.slug;
          const playlistId = track.playlist_id;
          const href = categorySlug ? `/audiobooks/${categorySlug}/${playlistId}?track=${track.id}` : "#";
          const progressPercent = getProgressPercent(track);

          return (
            <Card key={track.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="mb-2">
                  <div className="text-sm font-semibold truncate">{track.title_ua}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {track.audio_playlists?.title_ua || "Невідомий плейлист"}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(href)}
                  >
                    <Play className="mr-2 h-3 w-3" />
                    Продовжити
                  </Button>
                  {track.progress && track.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(track.progress.position)} / {formatTime(track.duration)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
