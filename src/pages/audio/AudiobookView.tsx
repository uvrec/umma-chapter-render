// AudiobookView.tsx - ВИПРАВЛЕНО
// Зменшена картинка, layout зліва картинка+опис, справа плеєр

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Music } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Track = {
  id: string;
  title_ua?: string | null;
  title_en?: string | null;
  audio_url: string | null;
  duration?: number | null;
  track_number?: number | null;
  is_published?: boolean | null;
};

type Playlist = {
  id: string;
  title_ua?: string | null;
  title_en?: string | null;
  author?: string | null;
  year?: number | null;
  cover_image_url?: string | null;
  description_ua?: string | null;
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

  const { data: audiobook, isLoading } = useQuery({
    queryKey: ["audiobook", id],
    enabled: !!id,
    queryFn: async (): Promise<Playlist | null> => {
      const { data, error } = await supabase
        .from("audio_playlists")
        .select(
          `
          *,
          tracks:audio_tracks(*)
        `,
        )
        .eq("id", id)
        .eq("is_published", true)
        .order("track_number", { foreignTable: "audio_tracks", ascending: true })
        .maybeSingle();

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

  const tracks =
    audiobook.tracks?.map((track) => ({
      id: track.id,
      title: track.title_ua || track.title_en || "Без назви",
      duration: formatDuration(track.duration),
      src: track.audio_url!,
    })) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <Link to="/audiobooks" className="inline-flex items-center mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до аудіокниг
          </Link>

          {/* ВИПРАВЛЕНО: Layout зліва картинка, справа плеєр */}
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            {/* Ліва колонка: Картинка + Опис */}
            <div>
              <Card className="p-6">
                {/* ВИПРАВЛЕНО: Зменшена картинка */}
                {audiobook.cover_image_url && (
                  <div className="w-full max-w-xs mx-auto mb-6 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={audiobook.cover_image_url}
                      alt={audiobook.title_ua || audiobook.title_en || "Аудіокнига"}
                      className="w-full h-auto object-cover aspect-[3/4]"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      {audiobook.title_ua || audiobook.title_en || "Аудіокнига"}
                    </h1>
                    {audiobook.author && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{audiobook.author}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Music className="w-4 h-4" />
                      <span>{tracks.length} треків</span>
                    </div>
                    {audiobook.year && (
                      <>
                        <span>•</span>
                        <span>{audiobook.year} р.</span>
                      </>
                    )}
                  </div>

                  {audiobook.description_ua && (
                    <div className="prose prose-sm text-foreground">
                      <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                      <p className="text-muted-foreground leading-relaxed">{audiobook.description_ua}</p>
                    </div>
                  )}

                  {audiobook.description_en && (
                    <div className="prose prose-sm text-foreground">
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-muted-foreground leading-relaxed">{audiobook.description_en}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Права колонка: Плеєр */}
            <div>
              {tracks.length > 0 ? (
                <PlaylistPlayer
                  tracks={tracks}
                  title={audiobook.title_ua || audiobook.title_en || "Аудіокнига"}
                  albumCover={audiobook.cover_image_url || undefined}
                />
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Немає доступних треків</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
