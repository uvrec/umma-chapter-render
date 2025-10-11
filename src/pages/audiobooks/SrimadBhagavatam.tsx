import { Header } from "@/components/Header";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SrimadBhagavatam = () => {
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const slug = slugParam || "srimad-bhagavatam-1";

  const { data: playlist, isLoading } = useQuery({
    queryKey: ["audiobook-playlist", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_playlists")
        .select(
          `
          *,
          tracks:audio_tracks(*)
        `,
        )
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const formatDuration = (sec?: number | null) => {
    if (typeof sec !== "number" || Number.isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const tracks =
    playlist?.tracks
      ?.sort((a: any, b: any) => {
        // якщо є track_number — сортуємо по ньому, інакше по створенню/назві
        const an = a.track_number ?? 0;
        const bn = b.track_number ?? 0;
        if (an !== bn) return an - bn;
        return (a.title_ua || a.title || "").localeCompare(b.title_ua || b.title || "");
      })
      .map((t: any) => ({
        id: t.id,
        title: t.title_ua || t.title,
        duration: t.duration ? formatDuration(t.duration) : "0:00",
        src: t.audio_url,
      })) || [];

  // Демо-рев’ю (залишив як у вас — за потреби теж переведемо на БД)
  const sampleReviews = [
    {
      id: "1",
      userName: "Віктор",
      avatar: "",
      rating: 5,
      comment:
        "Шрімад-Бгагаватам - це справжня скарбниця духовного знання. Переклад і коментарі Прабгупади роблять цей стародавній текст зрозумілим і актуальним. Диктор читає з великою повагою та розумінням.",
      tags: ["Духовний", "Освітній", "Глибокий", "Натхненний", "Чудовий голос"],
      bookRating: 5,
      speakerRating: 5,
    },
    {
      id: "2",
      userName: "Анна",
      avatar: "",
      rating: 4,
      comment:
        "Дуже цікаві історії та філософські роздуми. Допомагає краще зрозуміти ведичну культуру та мудрість. Рекомендую всім, хто шукає глибші відповіді на життєві питання.",
      tags: ["Цікавий", "Мудрий", "Корисний", "Добре структурований"],
      bookRating: 4,
      speakerRating: 4,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Завантаження...</div>
        </main>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Аудіокнигу не знайдено</div>
          <div className="text-center mt-6">
            <Link to="/audiobooks">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад до аудіокниг
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
                {playlist.cover_image_url && (
                  <div className="aspect-square w-full mb-6 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={playlist.cover_image_url}
                      alt={playlist.title_ua || playlist.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">{playlist.title_ua || playlist.title}</h1>
                    {(playlist.author || playlist.narrator) && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>
                          {playlist.author}
                          {playlist.narrator ? ` · Диктор: ${playlist.narrator}` : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{playlist.subtitle_ua || playlist.subtitle || "Аудіокнига"}</span>
                    </div>
                    {playlist.year && (
                      <>
                        <span>•</span>
                        <span>{playlist.year} р.</span>
                      </>
                    )}
                  </div>

                  {(playlist.description_ua || playlist.description) && (
                    <div className="prose prose-sm text-foreground">
                      <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {playlist.description_ua || playlist.description}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Player */}
            <div className="lg:col-span-2">
              {tracks.length > 0 ? (
                <PlaylistPlayer
                  tracks={tracks}
                  title={playlist.title_ua || playlist.title}
                  albumCover={playlist.cover_image_url}
                />
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Немає доступних треків</p>
                </Card>
              )}
            </div>
          </div>

          {/* Reviews Section (демо) */}
          <ReviewsSection
            bookTitle={playlist.title_ua || playlist.title}
            overallRating={4.6}
            totalReviews={34}
            bookRating={4.7}
            speakerRating={4.5}
            reviews={sampleReviews}
          />
        </div>
      </main>
    </div>
  );
};

export default SrimadBhagavatam;
