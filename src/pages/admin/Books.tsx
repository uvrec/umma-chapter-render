import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  BookOpen,
  MoreHorizontal,
  Pencil,
  List,
  Music,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const { getLocalizedPath } = useLanguage();
  const queryClient = useQueryClient();
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

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

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Книги" },
  ];

  const deleteBook = books?.find(b => b.id === deleteBookId);

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Книги</h1>
            <p className="text-muted-foreground text-sm">
              {books?.length || 0} книг у бібліотеці
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/books/new">
              <Plus className="w-4 h-4 mr-2" />
              Додати книгу
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Завантаження...</p>
          </div>
        ) : books && books.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Назва</TableHead>
                  <TableHead className="w-[100px]">Slug</TableHead>
                  <TableHead className="w-[120px]">Структура</TableHead>
                  <TableHead className="w-[120px]">Статус</TableHead>
                  <TableHead className="w-[80px] text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow
                    key={book.id}
                    className={!book.is_published ? "opacity-60" : ""}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{book.title_uk}</div>
                        <div className="text-sm text-muted-foreground">{book.title_en}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {book.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {book.has_cantos ? (
                        <Badge variant="outline" className="font-normal">
                          <Music className="w-3 h-3 mr-1" />
                          Пісні
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-normal">
                          <List className="w-3 h-3 mr-1" />
                          Глави
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {book.is_published ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20">
                          <Eye className="w-3 h-3 mr-1" />
                          Опубліковано
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Приховано
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Меню</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={getLocalizedPath(`/lib/${book.slug}`)}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Переглянути на сайті
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/books/${book.id}/edit`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Редагувати
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={book.has_cantos
                              ? `/admin/cantos/${book.id}`
                              : `/admin/chapters/${book.id}`
                            }>
                              {book.has_cantos ? (
                                <Music className="w-4 h-4 mr-2" />
                              ) : (
                                <List className="w-4 h-4 mr-2" />
                              )}
                              {book.has_cantos ? "Пісні" : "Глави"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/intro-chapters/${book.id}`}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Вступи
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => togglePublishMutation.mutate({
                              id: book.id,
                              isPublished: book.is_published
                            })}
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
                                Опублікувати
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteBookId(book.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Видалити
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Книг не знайдено</p>
            <Button asChild className="mt-4">
              <Link to="/admin/books/new">
                <Plus className="w-4 h-4 mr-2" />
                Додати першу книгу
              </Link>
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteBookId} onOpenChange={() => setDeleteBookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити книгу?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteBook && (
                <span className="block mb-2 font-medium text-foreground">
                  «{deleteBook.title_uk}»
                </span>
              )}
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
    </AdminLayout>
  );
};

export default Books;
