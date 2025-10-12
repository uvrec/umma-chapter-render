import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, Music, ImageOff, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UniversalCoverEditor } from "@/components/UniversalCoverEditor";

type PlaylistRow = {
  id: string;
  title_ua?: string | null;
  description_ua?: string | null;
  cover_image_url?: string | null;
  
  year?: number | null;
  is_published?: boolean | null;
  tracks?: { count: number }[];
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
  const { isAdmin, loading: authLoading } = useAuth();
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistRow | null>(null);

  // Отримуємо id категорії "audiobooks"
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

  // Плейлісти аудіокниг (опубліковані), з підрахунком треків
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
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("title_ua", { ascending: true });
      if (error) throw error;
      return (data || []) as PlaylistRow[];
    },
  });

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
            <h1 className="text-4xl md:text-5xl font-bold">Аудіокниги</h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Слухайте ведичну мудрість у виконанні Його Божественної Милості А.Ч. Бхактіведанти Свамі Прабгупади
          </p>
        </div>

        {/* Помилки */}
        {catError && (
          <div className="text-center py-8 text-destructive">
            Помилка завантаження категорії. Спробуйте оновити сторінку.
          </div>
        )}
        {listError && (
          <div className="text-center py-8 text-destructive">
            Помилка завантаження аудіокниг. Спробуйте оновити сторінку.
          </div>
        )}

        {/* Завантаження */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        )}

        {/* Сітка аудіокниг */}
        {!loading && !catError && !listError && audiobooks && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {audiobooks.map((book) => {
              const trackCount = book.tracks?.[0]?.count || 0;
              const coverUrl = book.cover_image_url?.trim() || FALLBACK_COVER;

              return (
                <Card key={book.id} className="group overflow-hidden hover:shadow-xl transition-all relative">
                  {/* Кнопка редагування для адмінів */}
                  {!authLoading && isAdmin && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingPlaylist(book);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}

                  <Link to={`/audiobooks/${book.id}`} className="block">
                    {/* Обкладинка */}
                    <div className="aspect-[2/3] bg-muted relative overflow-hidden">
                      <img
                        src={coverUrl}
                        alt={book.title_ua || "Обкладинка аудіокниги"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {!book.cover_image_url && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageOff className="w-16 h-16 text-muted-foreground opacity-20" />
                        </div>
                      )}
                    </div>

                    {/* Контент */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {book.title_ua || "Без назви"}
                      </h3>
                      {book.description_ua && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {book.description_ua}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          {trackCount} {trackCount === 1 ? "трек" : "треків"}
                        </Badge>
                        {book.year && (
                          <span className="text-xs text-muted-foreground">{book.year}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}

        {/* Порожньо */}
        {!loading && !catError && !listError && audiobooks?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Аудіокниги поки що відсутні</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Діалог редагування обкладинки */}
      {editingPlaylist && (
        <UniversalCoverEditor
          itemId={editingPlaylist.id}
          itemSlug={`audiobook-${editingPlaylist.id}`}
          currentCoverUrl={editingPlaylist.cover_image_url}
          currentCoverPath={null}
          tableName="audio_playlists"
          queryKey={["audiobooks-playlists", category?.id]}
          storageFolder="audio-covers"
          isOpen={!!editingPlaylist}
          onClose={() => setEditingPlaylist(null)}
          title="Редагувати обкладинку аудіокниги"
        />
      )}
    </div>
  );
};
