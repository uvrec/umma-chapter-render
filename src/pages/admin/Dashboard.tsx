import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Library,
  PenSquare,
  Headphones,
  Music,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

type QuickBook = { id: string; title_uk: string; has_cantos: boolean };

const Dashboard = () => {
  const [booksList, setBooksList] = useState<QuickBook[]>([]);

  // Load books for quick jump
  useEffect(() => {
    supabase
      .from("books")
      .select("id, title_uk, has_cantos")
      .order("title_uk", { ascending: true })
      .then(({ data, error }) => {
        if (!error) setBooksList(data || []);
      });
  }, []);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [booksRes, chaptersRes, versesRes, versesWithEnRes, blogPostsRes, audioPlaylistsRes, audioTracksRes] =
        await Promise.all([
          supabase.from("books").select("id", { count: "exact", head: true }),
          supabase.from("chapters").select("id", { count: "exact", head: true }),
          supabase.from("verses").select("id", { count: "exact", head: true }),
          supabase.from("verses").select("id", { count: "exact", head: true }).not("translation_en", "is", null),
          supabase.from("blog_posts").select("id", { count: "exact", head: true }),
          supabase.from("audio_playlists").select("id", { count: "exact", head: true }),
          supabase.from("audio_tracks").select("id", { count: "exact", head: true }),
        ]);

      return {
        books: booksRes.count || 0,
        chapters: chaptersRes.count || 0,
        verses: versesRes.count || 0,
        versesWithEn: versesWithEnRes.count || 0,
        blogPosts: blogPostsRes.count || 0,
        audioPlaylists: audioPlaylistsRes.count || 0,
        audioTracks: audioTracksRes.count || 0,
      };
    },
  });

  const translationProgress = stats?.verses
    ? Math.round((stats.versesWithEn / stats.verses) * 100)
    : 0;

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Книги</CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.books || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.chapters || 0} розділів
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Вірші</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.verses || 0}</div>
              <p className="text-xs text-muted-foreground">
                у всіх книгах
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Англійські переклади</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{translationProgress}%</div>
              <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${translationProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.versesWithEn || 0} з {stats?.verses || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Аудіо контент</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.audioTracks || 0}</div>
              <p className="text-xs text-muted-foreground">
                треків у {stats?.audioPlaylists || 0} плейлістах
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Jump */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Швидкий перехід до книги
              </CardTitle>
              <CardDescription>
                Виберіть книгу для редагування контенту
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {booksList.slice(0, 9).map((book) => (
                  <Button
                    key={book.id}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                    asChild
                  >
                    <Link to={book.has_cantos ? `/admin/cantos/${book.id}` : `/admin/chapters/${book.id}`}>
                      <div className="text-left">
                        <div className="font-medium truncate">{book.title_uk}</div>
                        <div className="text-xs text-muted-foreground">
                          {book.has_cantos ? "Пісні" : "Глави"}
                        </div>
                      </div>
                    </Link>
                  </Button>
                ))}
                {booksList.length > 9 && (
                  <Button variant="ghost" asChild>
                    <Link to="/admin/books">
                      Всі книги ({booksList.length})
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity / Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Блог
              </CardTitle>
              <CardDescription>
                Управління постами блогу
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Всього постів</span>
                <span className="font-bold">{stats?.blogPosts || 0}</span>
              </div>
              <Button asChild className="w-full">
                <Link to="/admin/blog-posts">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Керувати блогом
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/blog-posts/new">
                  Новий пост
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/admin/scripture">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Scripture Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Редагування віршів та глав
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/admin/audio-playlists">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Аудіо плейлісти
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {stats?.audioPlaylists || 0} плейлістів
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/admin/universal-import">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Імпорт контенту
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Завантаження нових книг
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/admin/lrc-editor">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  LRC Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Синхронізація аудіо з текстом
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
