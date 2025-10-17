import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";

const Books = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const togglePublish = async (id: string, is_published: boolean) => {
    const { error } = await supabase
      .from("books")
      .update({ is_published: !is_published })
      .eq("id", id);

    if (!error) {
      await queryClient.invalidateQueries({ queryKey: ["admin-books"] });
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Книги</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link to="/admin/books/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Додати книгу
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/vedabase-import-v2">Імпорт</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p>Завантаження...</p>
        ) : books && books.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Card key={book.id}>
                <CardHeader>
                  <CardTitle>{book.title_ua}</CardTitle>
                  <CardDescription>{book.title_en}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Slug: {book.slug}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Статус: {book.is_published ? "опубліковано" : "приховано"}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" asChild variant="outline">
                      <Link to={`/admin/books/${book.id}/edit`}>Редагувати</Link>
                    </Button>
                    {book.has_cantos ? (
                      <Button size="sm" asChild variant="outline">
                        <Link to={`/admin/cantos/${book.id}`}>Пісні</Link>
                      </Button>
                    ) : (
                      <Button size="sm" asChild variant="outline">
                        <Link to={`/admin/chapters/${book.id}`}>Глави</Link>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={book.is_published ? "destructive" : "secondary"}
                      onClick={() => togglePublish(book.id, book.is_published)}
                    >
                      {book.is_published ? "Приховати" : "Показати"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Книг не знайдено</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Books;
