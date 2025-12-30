/**
 * Управління лекціями - список та редагування
 * /admin/lectures
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Loader2,
  Plus,
  Upload,
} from "lucide-react";
import type { Lecture } from "@/types/lecture";
import { toast } from "sonner";

export default function LecturesManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Завантажити лекції
  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ["admin-lectures"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("lectures")
        .select("*")
        .order("lecture_date", { ascending: false });

      if (error) throw error;
      return data as Lecture[];
    },
  });

  // Мутація для видалення
  const deleteLecture = useMutation({
    mutationFn: async (id: string) => {
      // Спочатку видалити параграфи
      await (supabase as any)
        .from("lecture_paragraphs")
        .delete()
        .eq("lecture_id", id);

      // Потім лекцію
      const { error } = await (supabase as any)
        .from("lectures")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lectures"] });
      toast.success("Лекцію видалено");
      setDeleteId(null);
    },
  });

  // Фільтровані лекції
  const filteredLectures = lectures.filter(
    (l) =>
      l.title_en?.toLowerCase().includes(search.toLowerCase()) ||
      l.slug?.toLowerCase().includes(search.toLowerCase()) ||
      l.location_en?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Навігація */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/lecture-import")}>
              <Upload className="w-4 h-4 mr-2" />
              Імпорт
            </Button>
            <Button asChild>
              <Link to="/admin/lectures/new">
                <Plus className="w-4 h-4 mr-2" />
                Нова лекція
              </Link>
            </Button>
          </div>
        </div>

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Управління лекціями</h1>
          <p className="text-muted-foreground">
            {lectures.length} лекцій в базі даних
          </p>
        </div>

        {/* Пошук */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Пошук за назвою, slug або локацією..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Таблиця лекцій */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Назва</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Локація</TableHead>
                    <TableHead>UA</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLectures.map((lecture) => (
                    <TableRow key={lecture.id}>
                      <TableCell className="font-mono text-sm">
                        {lecture.lecture_date}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{lecture.title_en}</div>
                        <div className="text-xs text-muted-foreground">
                          {lecture.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lecture.lecture_type}</Badge>
                      </TableCell>
                      <TableCell>{lecture.location_en}</TableCell>
                      <TableCell>
                        {lecture.title_ua ? (
                          <Badge variant="secondary">Так</Badge>
                        ) : (
                          <Badge variant="destructive">Ні</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link to={`/admin/lectures/${lecture.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `/library/lectures/${lecture.slug}`,
                                "_blank"
                              )
                            }
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(lecture.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Діалог підтвердження видалення */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Видалити лекцію?</AlertDialogTitle>
              <AlertDialogDescription>
                Ця дія видалить лекцію та всі її параграфи. Цю дію неможливо скасувати.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteLecture.mutate(deleteId)}
                className="bg-destructive text-destructive-foreground"
              >
                Видалити
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
      <Footer />
    </div>
  );
}
