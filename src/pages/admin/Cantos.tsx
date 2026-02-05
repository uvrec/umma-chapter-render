import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, BookOpen, Eye, EyeOff } from "lucide-react";
import { PreviewShareButton } from "@/components/PreviewShareButton";
import { Badge } from "@/components/ui/badge";
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
  const queryClient = useQueryClient();
  const [cantoToDelete, setCantoToDelete] = useState<{ id: string; title: string } | null>(null);

  const { data: book } = useQuery({
    queryKey: ["admin-book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("id", bookId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId,
  });

  const { data: cantos, isLoading } = useQuery({
    queryKey: ["admin-cantos", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cantos")
        .select(`*, chapters(id, chapter_number)`)
        .eq("book_id", bookId)
        .order("canto_number", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!bookId,
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

  const togglePublishMutation = useMutation({
    mutationFn: async ({ cantoId, isPublished }: { cantoId: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from("cantos")
        .update({ is_published: isPublished })
        .eq("id", cantoId);
      if (error) throw error;
    },
    onSuccess: (_, { isPublished }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-cantos", bookId] });
      toast.success(isPublished ? "Пісню опубліковано" : "Пісню приховано");
    },
    onError: (error: Error) => {
      toast.error(`Помилка: ${error.message}`);
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

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Книги", href: "/admin/books" },
    { label: book?.title_uk || "Пісні" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Пісні</h1>
            <p className="text-muted-foreground">{book?.title_uk}</p>
          </div>
          <Button asChild>
            <Link to={`/admin/cantos/${bookId}/new`}>
              <Plus className="w-4 h-4 mr-2" />
              Додати пісню
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Завантаження...</p>
          </div>
        ) : cantos && cantos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cantos.map((canto) => (
              <Card key={canto.id} className={!canto.is_published ? "opacity-60 border-dashed" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Пісня {canto.canto_number}
                        {canto.is_published ? (
                          <Badge variant="default" className="bg-green-500">
                            <Eye className="w-3 h-3 mr-1" />
                            Опубліковано
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Приховано
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{canto.title_uk}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{canto.title_en}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={canto.is_published ? "outline" : "default"}
                      onClick={() => togglePublishMutation.mutate({
                        cantoId: canto.id,
                        isPublished: !canto.is_published
                      })}
                      disabled={togglePublishMutation.isPending}
                    >
                      {canto.is_published ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Приховати
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Опублікувати
                        </>
                      )}
                    </Button>
                    <PreviewShareButton
                      resourceType="canto"
                      resourceId={canto.id}
                      variant="outline"
                      size="sm"
                    />
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
                            canto.chapters.sort((a: any, b: any) => a.chapter_number - b.chapter_number)[0].id
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
    </AdminLayout>
  );
};

export default Cantos;
