// AudiobookView.tsx - ВИПРАВЛЕНО
// Зменшена картинка, layout зліва картинка+опис, справа плеєр

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ArrowLeft, User, Music } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  // Check if id is a UUID or a slug
  const isUUID = id ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) : false;

  const { data: audiobook, isLoading } = useQuery({
    queryKey: ["audiobook", id],
    enabled: !!id,
    queryFn: async (): Promise<Playlist | null> => {
      // Build query based on whether we have a UUID or slug
      let query = supabase
        .from("audio_playlists")
        .select(
          `
          *,
          tracks:audio_tracks(*)
        `,
        )
        .eq("is_published", true)
        .order("track_number", { foreignTable: "audio_tracks", ascending: true });

      // Search by id or slug
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

  const tracks =
    audiobook.tracks?.map((track) => ({
      id: track.id,
      title: track.title_uk || track.title_en || "Без назви",
      duration: formatDuration(track.duration),
      src: track.audio_url!,
    })) ?? [];

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

          {/* Mobile: compact horizontal header, Desktop: sidebar layout */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
            {/* Ліва колонка: Інфо */}
            <div>
              {/* Mobile: горизонтальний компактний лейаут */}
              <div className="flex gap-4 lg:flex-col">
                {/* Картинка - маленька на мобільному */}
                {audiobook.cover_image_url && (
                  <div className="w-24 h-32 lg:w-full lg:h-auto flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={audiobook.cover_image_url}
                      alt={audiobook.title_uk || audiobook.title_en || "Аудіокнига"}
                      className="w-full h-full object-cover lg:aspect-[3/4]"
                    />
                  </div>
                )}

                {/* Інфо поруч з картинкою на мобільному */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg lg:text-2xl font-bold text-foreground mb-1 lg:mb-2 line-clamp-2">
                    {audiobook.title_uk || audiobook.title_en || "Аудіокнига"}
                  </h1>
                  {audiobook.author && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{audiobook.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                </div>
              </div>

              {/* Опис - тільки на десктопі або під картинкою */}
              {(audiobook.description_uk || audiobook.description_en) && (
                <div className="mt-4 lg:mt-6 hidden lg:block">
                  {audiobook.description_uk && (
                    <div className="prose prose-sm text-foreground mb-4">
                      <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                      <p className="text-muted-foreground leading-relaxed">{audiobook.description_uk}</p>
                    </div>
                  )}
                  {audiobook.description_en && (
                    <div className="prose prose-sm text-foreground">
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-muted-foreground leading-relaxed">{audiobook.description_en}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Права колонка: Плеєр */}
            <div>
              {tracks.length > 0 ? (
                <PlaylistPlayer
                  tracks={tracks}
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
