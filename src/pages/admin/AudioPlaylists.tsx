import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AudioCategory = {
  id: string;
  name_uk: string;
  name_en: string;
  slug: string;
  display_order: number;
};

type PlaylistRow = {
  id: string;
  title_uk: string | null;
  title_en: string | null;
  description_uk: string | null;
  description_en: string | null;
  category_id: string | null;
  cover_image_url: string | null;
  author: string | null;
  year: number | null;
  is_published: boolean | null;
  display_order: number | null;
  category?: Pick<AudioCategory, "id" | "name_uk" | "name_en" | "slug"> | null;
  tracks?: Array<{ count: number }>;
};

export default function AudioPlaylists() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categories } = useQuery({
    queryKey: ["audio-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_categories")
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as AudioCategory[];
    },
    staleTime: 60_000,
  });

  const {
    data: playlists,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["audio-playlists", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("audio_playlists")
        .select(
          `
          *,
          category:audio_categories ( id, name_uk, name_en, slug ),
          tracks:audio_tracks ( count )
        `,
        )
        .order("display_order", { ascending: true, nullsFirst: false });

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as PlaylistRow[];
    },
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("audio_playlists")
        .insert({
          title_en: "New Playlist",
          title_uk: "Новий плейліст",
          is_published: false,
          display_order: 100000,
          category_id: selectedCategory !== "all" ? selectedCategory : null,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (row) => {
      navigate(`/admin/audio-playlists/${row.id}`);
    },
  });

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Аудіо плейлісти" },
  ];

  const safePlaylists = playlists ?? [];

  if (isLoading) {
    return (
      <AdminLayout breadcrumbs={breadcrumbs}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Аудіо плейлісти</h1>
              <p className="text-muted-foreground">Управління аудіо контентом</p>
            </div>
            <div className="h-10 w-40 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-5 w-2/3 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout breadcrumbs={breadcrumbs}>
        <div className="p-6">
          <p className="text-destructive">Помилка завантаження: {(error as any)?.message || "Невідома"}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Аудіо плейлісти</h1>
            <p className="text-muted-foreground">Управління аудіо контентом</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Фільтр за категорією" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі категорії</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name_uk}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              {createMutation.isPending ? "Створюю..." : "Додати плейліст"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {safePlaylists.map((playlist) => {
            const trackCount = playlist.tracks?.[0]?.count ?? 0;
            const img = playlist.cover_image_url?.trim() || "";

            return (
              <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                {img && (
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={img}
                      alt={playlist.title_uk || "Обкладинка плейліста"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader className="pt-0">
                  <CardTitle className="flex justify-between items-start gap-3">
                    <span className="line-clamp-2">{playlist.title_uk || "Без назви"}</span>
                    <Badge variant={playlist.is_published ? "default" : "secondary"}>
                      {playlist.is_published ? "Опубліковано" : "Чернетка"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {playlist.description_uk && <p className="line-clamp-2">{playlist.description_uk}</p>}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        <span>{trackCount} треків</span>
                      </div>
                      {playlist.category?.name_uk && <Badge variant="outline">{playlist.category.name_uk}</Badge>}
                    </div>
                    {playlist.author && <p className="text-xs">Автор: {playlist.author}</p>}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      aria-label="Редагувати плейліст"
                      onClick={() => navigate(`/admin/audio-playlists/${playlist.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Редагувати / Треки
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {safePlaylists.length === 0 ? (
          <Card className="p-12 text-center mt-6">
            <p className="text-muted-foreground mb-4">Немає плейлістів</p>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              {createMutation.isPending ? "Створюю..." : "Створити перший плейліст"}
            </Button>
          </Card>
        ) : null}
      </div>
    </AdminLayout>
  );
}
