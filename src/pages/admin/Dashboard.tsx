// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  FileText,
  Library,
  LogOut,
  Upload,
  PenSquare,
  Headphones,
  Music,
  WrapText,
  FileEdit,
} from "lucide-react";

type QuickBook = { id: string; title_ua: string; has_cantos: boolean };

const Dashboard = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const [booksList, setBooksList] = useState<QuickBook[]>([]);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
      return;
    }
  }, [user, isAdmin, navigate]);

  // завантаження книг для “Швидкого переходу”
  useEffect(() => {
    if (!user || !isAdmin) return;
    supabase
      .from("books")
      .select("id, title_ua, has_cantos")
      .order("title_ua", { ascending: true })
      .then(({ data, error }) => {
        if (!error) setBooksList(data || []);
      });
  }, [user, isAdmin]);

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
    enabled: !!user && isAdmin,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Адмін-панель</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Книги</CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.books || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Розділи</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.chapters || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Вірші</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.verses || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Англійські переклади</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.versesWithEn || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.verses ? Math.round((stats.versesWithEn / stats.verses) * 100) : 0}% завершено
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Пости блогу</CardTitle>
              <PenSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.blogPosts || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Аудіо плейлісти</CardTitle>
              <Headphones className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.audioPlaylists || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Аудіо треки</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.audioTracks || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Дії */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Швидкий перехід */}
          <Card>
            <CardHeader>
              <CardTitle>Швидкий перехід</CardTitle>
              <CardDescription>Виберіть книгу і перейдіть до керування</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                className="w-full rounded-md border px-3 py-2 bg-background"
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) return;
                  const b = booksList.find((x) => x.id === id);
                  if (!b) return;
                  if (b.has_cantos) {
                    navigate(`/admin/cantos/${id}`);
                  } else {
                    navigate(`/admin/chapters/${id}`);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Обрати книгу…
                </option>
                {booksList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title_ua} {b.has_cantos ? "— Пісні" : "— Розділи"}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Книги</CardTitle>
              <CardDescription>Управління книгами</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/books">Переглянути книги</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Вірші</CardTitle>
              <CardDescription>Управління віршами</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/verses">Переглянути вірші</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Імпорт даних</CardTitle>
              <CardDescription>Імпорт глав і віршів з файлів</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/admin/vedabase-import-v2">
                  <Upload className="w-4 h-4 mr-2" />
                  Vedabase Import v2 (Рекомендовано)
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/web-import">Веб-імпорт (Playwright)</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/import-wizard">Імпорт з файлу</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/fix-verse-linebreaks">
                  <WrapText className="w-4 h-4 mr-2" />
                  Виправити розриви рядків
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/clean-bengali">
                  <FileEdit className="w-4 h-4 mr-2" />
                  Очистити бенгалі
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/data-migration">Старий імпорт</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Блог</CardTitle>
              <CardDescription>Управління блогом</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/admin/blog-posts">
                  <PenSquare className="w-4 h-4 mr-2" />
                  Пости
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/blog-categories">Категорії</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/blog-tags">Теги</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Для англійських перекладів: створіть категорію "Англійські переклади" в розділі "Категорії"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Аудіо контент</CardTitle>
              <CardDescription>Управління аудіо-бібліотекою</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/admin/audio-playlists">
                  <Headphones className="w-4 h-4 mr-2" />
                  Плейлісти
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/audio-categories">
                  <Music className="w-4 h-4 mr-2" />
                  Категорії
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Сторінки</CardTitle>
              <CardDescription>Управління контентом сторінок</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/admin/pages">
                  <FileEdit className="w-4 h-4 mr-2" />
                  Динамічні сторінки
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/static-pages">
                  <FileEdit className="w-4 h-4 mr-2" />
                  Статичні сторінки
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Банери</CardTitle>
              <CardDescription>Управління головною сторінкою</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/site-banners">
                  <FileEdit className="w-4 h-4 mr-2" />
                  Редагувати банери
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Повернутися на сайт</CardTitle>
              <CardDescription>Переглянути публічну версію</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Головна сторінка</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
