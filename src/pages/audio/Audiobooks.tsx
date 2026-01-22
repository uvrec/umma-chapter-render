import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  title_uk?: string | null;
  description_uk?: string | null;
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
            title_uk,
            description_uk,
            cover_image_url,
            year,
            is_published,
            tracks:audio_tracks(count)
          `,
        )
        .eq("category_id", category!.id)
        .eq("is_published", true)
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("title_uk", { ascending: true });
      if (error) throw error;
      return (data || []) as PlaylistRow[];
    },
  });

  const loading = catLoading || listLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <Link to="/audio">
            <Button variant="ghost" className="mb-4" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden xs:inline">Назад до аудіо</span>
            </Button>
          </Link>
        </div>

        {/* Hero - адаптивний */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mr-3 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Аудіокниги</h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
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

        {/* Сітка аудіокниг - адаптивна */}
        {!loading && !catError && !listError && audiobooks && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {audiobooks.map((book) => {
              const trackCount = book.tracks?.[0]?.count || 0;
              const coverUrl = book.cover_image_url?.trim() || FALLBACK_COVER;

              return (
                <div key={book.id} className="group overflow-hidden transition-all relative">
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
                        alt={book.title_uk || "Обкладинка аудіокниги"}
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
                        {book.title_uk || "Без назви"}
                      </h3>
                      {book.description_uk && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {book.description_uk}
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
                </div>
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
