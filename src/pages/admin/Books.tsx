import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, ExternalLink, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Books = () => {
  const { user, isAdmin } = useAuth();
  const { getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const { data: books, isLoading } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from("books")
        .update({ is_published: !isPublished })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      toast.success("Статус книги оновлено");
    },
    onError: () => {
      toast.error("Помилка при оновленні статусу");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("books")
        .update({ deleted_at: new Date().toISOString() } as any)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      toast.success("Книгу видалено");
      setDeleteBookId(null);
    },
    onError: () => {
      toast.error("Помилка при видаленні книги");
      setDeleteBookId(null);
    },
  });

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
            <Button asChild>
              <Link to="/admin/books/new">
                <Plus className="w-4 h-4 mr-2" />
                Додати книгу
              </Link>
            </Button>
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
                  <CardTitle>
                    <Link
                      to={getLocalizedPath(`/lib/${book.slug}`)}
                      className="hover:text-primary hover:underline inline-flex items-center gap-2 transition-colors"
                    >
                      {book.title_uk}
                      <ExternalLink className="w-4 h-4 opacity-50" />
                    </Link>
                  </CardTitle>
                  <CardDescription>{book.title_en}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Slug: {book.slug}</p>
                      <p className="text-sm">
                        Статус:{" "}
                        <span className={book.is_published ? "text-green-600" : "text-orange-600"}>
                          {book.is_published ? "Опубліковано" : "Приховано"}
                        </span>
                      </p>
                    </div>
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
                      <Button size="sm" asChild variant="outline">
                        <Link to={`/admin/intro-chapters/${book.id}`}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Вступи
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublishMutation.mutate({ id: book.id, isPublished: book.is_published })}
                        disabled={togglePublishMutation.isPending}
                      >
                        {book.is_published ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Приховати
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Показати
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteBookId(book.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Видалити
                      </Button>
                    </div>
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

      <AlertDialog open={!!deleteBookId} onOpenChange={() => setDeleteBookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити книгу?</AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія приховає книгу з публічного доступу. Книга буде позначена як видалена, але залишиться в базі даних.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteBookId && deleteMutation.mutate(deleteBookId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Books;
