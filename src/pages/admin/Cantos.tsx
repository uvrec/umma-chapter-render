import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, BookOpen } from "lucide-react";
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
import { toast } from "sonner";

const Cantos = () => {
  const { bookId } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cantoToDelete, setCantoToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const { data: book } = useQuery({
    queryKey: ["admin-book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("id", bookId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && !!bookId,
  });

  const { data: cantos, isLoading } = useQuery({
    queryKey: ["admin-cantos", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cantos")
        .select(`
          *,
          chapters(id, chapter_number)
        `)
        .eq("book_id", bookId)
        .order("canto_number", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && !!bookId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (cantoId: string) => {
      const { error } = await supabase.from("cantos").delete().eq("id", cantoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cantos", bookId] });
      toast.success("Пісню успішно видалено");
      setCantoToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(`Помилка при видаленні: ${error.message}`);
    },
  });

  const handleDeleteClick = (canto: any) => {
    setCantoToDelete({ id: canto.id, title: `Пісня ${canto.canto_number}: ${canto.title_uk}` });
  };

  const handleConfirmDelete = () => {
    if (cantoToDelete) {
      deleteMutation.mutate(cantoToDelete.id);
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
                <Link to="/admin/books">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад до книг
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Пісні: {book?.title_uk || "Завантаження..."}</h1>
            </div>
            <Button asChild>
              <Link to={`/admin/cantos/${bookId}/new`}>
                <Plus className="w-4 h-4 mr-2" />
                Додати пісню
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p>Завантаження...</p>
        ) : cantos && cantos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cantos.map((canto) => (
              <Card key={canto.id}>
                <CardHeader>
                  <CardTitle>Пісня {canto.canto_number}</CardTitle>
                  <CardDescription>{canto.title_uk}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{canto.title_en}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" asChild variant="outline">
                      <Link to={`/admin/cantos/${bookId}/${canto.id}/edit`}>Редагувати</Link>
                    </Button>
                    <Button size="sm" asChild variant="outline">
                      <Link to={`/admin/chapters/canto/${canto.id}`}>Глави</Link>
                    </Button>
                    {canto.chapters && canto.chapters.length > 0 && (
                      <Button size="sm" asChild variant="outline">
                        <Link
                          to={`/admin/scripture?chapterId=${
                            canto.chapters.sort((a, b) => a.chapter_number - b.chapter_number)[0].id
                          }`}
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          Вірші
                        </Link>
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(canto)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Видалити
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Пісень не знайдено</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!cantoToDelete} onOpenChange={() => setCantoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
            <AlertDialogDescription>
              Це призведе до видалення <strong>{cantoToDelete?.title}</strong> та всіх пов'язаних з ним глав і віршів.
              Цю дію неможливо скасувати.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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

export default Cantos;
