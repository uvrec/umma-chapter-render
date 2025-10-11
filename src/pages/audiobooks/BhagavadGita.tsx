// src/pages/audio/BhagavadGita.tsx
import { Header } from "@/components/Header";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// за бажанням — фолбек-картинка
import bhagavadGitaCover from "@/assets/bhagavad-gita-new.png";

type TrackRow = {
  id: string;
  title_ua: string | null;
  title_en: string | null;
  duration: number | null; // у секундах, якщо є
  duration_text?: string | null; // якщо зберігаєте як "mm:ss"
  audio_url: string | null;
  display_order?: number | null;
  track_number?: number | null;
  is_published?: boolean | null;
};

type PlaylistRow = {
  id: string;
  slug?: string | null;
  title_ua: string | null;
  title_en: string | null;
  author?: string | null;
  year?: string | number | null;
  description_ua?: string | null;
  description_en?: string | null;
  cover_image_url?: string | null;
  // якщо хочете тягнути треки в одному запиті:
  tracks?: TrackRow[];
};

function secToMMSS(sec?: number | null, fallback?: string | null) {
  if (typeof sec === "number" && !Number.isNaN(sec) && sec >= 0) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return fallback ?? "0:00";
}

export const BhagavadGita = () => {
  // дозволяємо і UUID, і людський slug у маршруті /audiobooks/:idOrSlug
  const { idOrSlug } = useParams<{ idOrSlug: string }>();

  // 1) витягуємо плейлист
  const {
    data: playlist,
    isLoading: isLoadingPlaylist,
    error: playlistError,
  } = useQuery({
    queryKey: ["audiobook-playlist", idOrSlug],
    enabled: !!idOrSlug,
    queryFn: async (): Promise<PlaylistRow | null> => {
      // Шукаємо або по id (uuid), або по slug (текстовий)
      // .or() в Supabase: поле=value з екрануванням крапки в uuid не потрібне
      const { data, error } = await supabase
        .from("audio_playlists")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // 2) витягуємо треки окремо (щоб мати гнучкий .order та фільтри)
  const { data: tracks = [], isLoading: isLoadingTracks } = useQuery({
    queryKey: ["audiobook-tracks", playlist?.id],
    enabled: !!playlist?.id,
    queryFn: async (): Promise<TrackRow[]> => {
      // підлаштуйте сортування під вашу схему: display_order або track_number
      const { data, error } = await supabase
        .from("audio_tracks")
        .select("*")
        .eq("playlist_id", playlist!.id)
        .eq("is_published", true)
        .order("display_order", { ascending: true }) // якщо є
        .order("track_number", { ascending: true }) // або запасний ключ
        .order("title_ua", { ascending: true }); // стабілізатор

      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoadingPlaylist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Завантаження...</div>
        </main>
      </div>
    );
  }

  if (playlistError || !playlist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Аудіокнига не знайдена</div>
          <div className="text-center mt-4">
            <Link to="/audiobooks">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                До списку аудіокниг
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Приводимо треки до формату PlaylistPlayer
  const playerTracks = tracks.map((t) => ({
    id: t.id,
    title: t.title_ua ?? t.title_en ?? "Без назви",
    duration: secToMMSS(t.duration, t.duration_text ?? undefined),
    src: t.audio_url ?? "",
  }));

  const cover = playlist.cover_image_url || bhagavadGitaCover;
  const title = playlist.title_ua ?? playlist.title_en ?? "Аудіокнига";
  const author = playlist.author ?? undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/audiobooks" className="inline-flex items-center mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до аудіокниг
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Book Info */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                {cover && (
                  <div className="aspect-square w-full mb-6 bg-muted rounded-lg overflow-hidden">
                    <img src={cover} alt={title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
                    {author && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{author}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{playerTracks.length} треків</span>
                    </div>
                    {playlist.year && (
                      <>
                        <span>•</span>
                        <span>{playlist.year}</span>
                      </>
                    )}
                  </div>

                  {playlist.description_ua && (
                    <div className="prose prose-sm text-foreground">
                      <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                      <p className="text-muted-foreground leading-relaxed">{playlist.description_ua}</p>
                    </div>
                  )}

                  {playlist.description_en && (
                    <div className="prose prose-sm text-foreground">
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-muted-foreground leading-relaxed">{playlist.description_en}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Player */}
            <div className="lg:col-span-2">
              {isLoadingTracks ? (
                <Card className="p-8 text-center">Завантаження треків…</Card>
              ) : playerTracks.length > 0 ? (
                <PlaylistPlayer tracks={playerTracks} title={title} albumCover={cover} />
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Немає доступних треків</p>
                </Card>
              )}
            </div>
          </div>

          {/* Відгуки — залишив компонент; за потреби можете також підключити до БД */}
          <ReviewsSection
            bookTitle={title}
            overallRating={4.5}
            totalReviews={47}
            bookRating={4.4}
            speakerRating={4.6}
            reviews={[]}
          />
        </div>
      </main>
    </div>
  );
};

export default BhagavadGita;
