import { Header } from "@/components/Header";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import fallbackCover from "@/assets/sri-isopanishad-audiobook.png";

const PLAYLIST_SLUG = "sri-isopanishad"; // змініть за потреби під ваш slug у audio_playlists

// тимчасові відгуки (залишив як є — якщо захочете, винесу в БД окремо)
const sampleReviews = [
  {
    id: "1",
    userName: "Дмитро",
    avatar: "",
    rating: 5,
    comment:
      "Шрі Ішопанішада - це концентрована мудрість у найчистішому вигляді. Кожна мантра - це окрема філософська перлина. Прабгупада майстерно розкриває глибинний зміст цих стародавніх віршів.",
    tags: ["Філософський", "Концентрований", "Мудрий", "Глибокий", "Ясний виклад"],
    bookRating: 5,
    speakerRating: 5,
  },
  {
    id: "2",
    userName: "Тетяна",
    avatar: "",
    rating: 4,
    comment:
      "Невелика, але дуже змістовна книга. Ідеально підходить для тих, хто тільки починає знайомитись з ведичною філософією. Диктор читає зрозуміло та з правильними наголосами.",
    tags: ["Початківцям", "Зрозуміло", "Змістовно", "Якісний запис"],
    bookRating: 4,
    speakerRating: 4,
  },
];

function formatDuration(seconds?: number | null, fallback?: string) {
  if (typeof seconds === "number" && !Number.isNaN(seconds)) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return fallback || "0:00";
}

export const SriIsopanishad = () => {
  // тягнемо один плейліст за slug + всі його треки
  const { data, isLoading, error } = useQuery({
    queryKey: ["audiobook", PLAYLIST_SLUG],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_playlists")
        .select(
          `
          *,
          tracks:audio_tracks(*)
        `,
        )
        .eq("slug", PLAYLIST_SLUG)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const cover = data?.cover_image_url || fallbackCover;

  // готуємо треки під формат PlaylistPlayer
  const tracks =
    data?.tracks?.map((t: any) => ({
      id: t.id,
      title: t.title_ua || t.title || "Без назви",
      duration: formatDuration(t.duration, t.duration_text),
      src: t.audio_url,
    })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/audiobooks" className="inline-flex items-center mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до аудіокниг
          </Link>

          {isLoading ? (
            <div className="text-center">Завантаження...</div>
          ) : error ? (
            <div className="text-center text-destructive">Помилка завантаження</div>
          ) : !data ? (
            <div className="text-center">Аудіокнига не знайдена</div>
          ) : (
            <>
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Інформація про книгу */}
                <div className="lg:col-span-1">
                  <Card className="p-6">
                    <div className="aspect-square w-full mb-6 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={cover}
                        alt={data.title_ua || data.title || "Аудіокнига"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                          {data.title_ua || data.title || "Шрі Ішопанішада"}
                        </h1>
                        {(data.author || "А. Ч. Бхактіведанта Свамі Прабгупада") && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{data.author || "А. Ч. Бхактіведанта Свамі Прабгупада"}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{data.tracks?.length || 0} треків</span>
                        </div>
                        {data.year && (
                          <>
                            <span>•</span>
                            <span>{data.year} р.</span>
                          </>
                        )}
                      </div>

                      {(data.description_ua || data.description_en) && (
                        <div className="prose prose-sm text-foreground">
                          <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {data.description_ua || data.description_en}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Плеєр */}
                <div className="lg:col-span-2">
                  {tracks.length > 0 ? (
                    <PlaylistPlayer
                      tracks={tracks}
                      title={data.title_ua || data.title || "Шрі Ішопанішада"}
                      albumCover={cover}
                    />
                  ) : (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">Немає доступних треків</p>
                    </Card>
                  )}
                </div>
              </div>

              {/* Відгуки (залишив демо) */}
              <ReviewsSection
                bookTitle={data.title_ua || data.title || "Шрі Ішопанішада"}
                overallRating={4.4}
                totalReviews={sampleReviews.length}
                bookRating={4.5}
                speakerRating={4.2}
                reviews={sampleReviews}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};
