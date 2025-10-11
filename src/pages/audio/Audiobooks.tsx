import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Music, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import bhagavadGitaCover from "@/assets/bhagavad-gita-audiobook.png";
import srimadBhagavatamCover from "@/assets/srimad-bhagavatam-audiobook.png";
import sriIsopanishadCover from "@/assets/sri-isopanishad-audiobook.png";

type PlaylistRow = {
  id: string;
  title_ua?: string | null;
  description_ua?: string | null;
  cover_image_url?: string | null;
  year?: number | null;
  is_published?: boolean | null;
  // alias for relation
  tracks?: { count: number }[]; // comes as an array with a single {count}
};

const FALLBACK_COVER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 533'>
      <rect width='100%' height='100%' fill='#f1f5f9'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#94a3b8' font-family='Arial' font-size='18'>
        Обкладинка відсутня
      </text>
    </svg>`,
  );

export const Audiobooks = () => {
  // 1) Отримуємо id категорії "audiobooks"
  const {
    data: category,
    isLoading: catLoading,
    isError: catError,
  } = useQuery({
    queryKey: ["audiobooks-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_categories")
        .select("id")
        .eq("slug", "audiobooks")
        .maybeSingle();
      if (error) throw error;
      return data as { id: string } | null;
    },
  });

  // 2) Плейлісти аудіокниг (опубліковані), з підрахунком треків
  const {
    data: audiobooks,
    isLoading: listLoading,
    isError: listError,
  } = useQuery({
    queryKey: ["audiobooks-playlists", category?.id],
    enabled: !!category?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_playlists")
        .select(
          `
            id,
            title_ua,
            description_ua,
            cover_image_url,
            year,
            is_published,
            tracks:audio_tracks(count)
          `,
        )
        .eq("category_id", category!.id)
        .eq("is_published", true)
        // NULLS LAST — щоб без display_order не заважали зверху
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("title_ua", { ascending: true });
      if (error) throw error;
      return (data || []) as PlaylistRow[];
    },
  });

  // 3) Статичні картки (приклади/популярні)
  const staticAudiobooks = [
    {
      id: "bhagavad-gita",
      title: "Бгаґавад-ґіта як вона є",
      author: "Шріла Прабгупада",
      description: "Повний переклад та коментарі до найважливішого твору ведичної літератури",
      cover: bhagavadGitaCover,
    },
    {
      id: "srimad-bhagavatam-1",
      title: "Шрімад-Бгаґаватам, Том 1",
      author: "Шріла Прабгупада",
      description: "Перший том найсвятішого Пурани, що розкриває природу Абсолютної Істини",
      cover: srimadBhagavatamCover,
    },
    {
      id: "sri-isopanishad",
      title: "Шрі Ішопанішад",
      author: "Шріла Прабгупада",
      description: "Досконале керівництво з самореалізації через 18 мантр древньої мудрості",
      cover: sriIsopanishadCover,
    },
  ];

  const loading = catLoading || listLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/audio">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до аудіо
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">Аудіокниги</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Колекція ведичних писань у аудіо форматі з професійним озвученням
          </p>
        </div>

        {/* Скелетони/помилки/порожньо */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[3/4] bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  <div className="h-9 bg-muted rounded w-full animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && (catError || listError) && (
          <div className="text-center text-sm text-destructive my-8">
            Не вдалося завантажити аудіокниги. Спробуйте пізніше.
          </div>
        )}

        {!loading && !catError && !listError && (
          <>
            {/* Динамічні з БД (якщо є категорія та плейлісти) */}
            {category?.id && (audiobooks?.length ?? 0) > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4">Каталог</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {audiobooks!.map((book) => {
                    const trackCount = book.tracks?.[0]?.count ?? 0;
                    const title = book.title_ua || "Без назви";
                    const description = book.description_ua || "";
                    const imgSrc = book.cover_image_url || FALLBACK_COVER;

                    return (
                      <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-[3/4] bg-muted">
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <img
                            src={imgSrc}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = FALLBACK_COVER;
                            }}
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Аудіокнига</Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Music className="w-3 h-3 mr-1" />
                              {trackCount}
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                          {description && (
                            <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{description}</p>
                          )}
                          {book.year && <div className="text-xs text-muted-foreground mb-4">Рік: {book.year}</div>}
                          <Link to={`/audiobooks/${book.id}`} className="flex-1">
                            <Button className="w-full">
                              <Play className="w-4 h-4 mr-2" />
                              Слухати
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            {/* Статичні (для промо/прикладів) */}
            <h2 className="text-xl font-semibold mb-4">Рекомендовані</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staticAudiobooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/4] bg-muted">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img
                      src={book.cover || FALLBACK_COVER}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_COVER;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Аудіокнига</Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{book.title}</h3>
                    {book.author && <p className="text-sm text-primary mb-3">{book.author}</p>}
                    <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{book.description}</p>
                    <Link to={`/audiobooks/${book.id}`} className="flex-1">
                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Слухати
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Якщо категорія є, але плейлістів немає */}
            {category?.id && (audiobooks?.length ?? 0) === 0 && (
              <Card className="p-8 text-center mt-12">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                  <ImageOff className="w-5 h-5" />
                  <span>Поки що немає опублікованих аудіокниг у цій категорії.</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Додайте плейлісти в адмінці та позначте як опубліковані.
                </p>
              </Card>
            )}

            {/* Support */}
            <Card className="p-8 text-center mt-12 bg-gradient-to-r from-primary/5 to-secondary/5">
              <h3 className="text-2xl font-semibold text-foreground mb-4">Підтримайте проєкт</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Допоможіть нам створювати більше якісних аудіокниг ведичної літератури
              </p>
              <Link to="/donation">
                <Button size="lg">Підтримати проєкт</Button>
              </Link>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Audiobooks;
