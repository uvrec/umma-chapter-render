/**
 * Управління листами - список та редагування
 * /admin/letters
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
import type { Letter } from "@/types/letter";
import { toast } from "sonner";

export default function LettersManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Завантажити листи
  const { data: letters = [], isLoading } = useQuery({
    queryKey: ["admin-letters"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("letters")
        .select("*")
        .order("letter_date", { ascending: false });

      if (error) throw error;
      return data as Letter[];
    },
  });

  // Мутація для видалення
  const deleteLetter = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("letters")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-letters"] });
      toast.success("Лист видалено");
      setDeleteId(null);
    },
  });

  // Фільтровані листи
  const filteredLetters = letters.filter(
    (l) =>
      l.recipient_en?.toLowerCase().includes(search.toLowerCase()) ||
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
            <Button variant="outline" onClick={() => navigate("/admin/letter-import")}>
              <Upload className="w-4 h-4 mr-2" />
              Імпорт
            </Button>
            <Button asChild>
              <Link to="/admin/letters/new">
                <Plus className="w-4 h-4 mr-2" />
                Новий лист
              </Link>
            </Button>
          </div>
        </div>

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Управління листами</h1>
          <p className="text-muted-foreground">
            {letters.length} листів в базі даних
          </p>
        </div>

        {/* Пошук */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Пошук за отримувачем, slug або локацією..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Таблиця листів */}
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
                    <TableHead>Отримувач</TableHead>
                    <TableHead>Локація</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>UA</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLetters.map((letter) => (
                    <TableRow key={letter.id}>
                      <TableCell className="font-mono text-sm">
                        {letter.letter_date}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{letter.recipient_en}</div>
                        <div className="text-xs text-muted-foreground">
                          {letter.slug}
                        </div>
                      </TableCell>
                      <TableCell>{letter.location_en}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{letter.reference}</Badge>
                      </TableCell>
                      <TableCell>
                        {letter.content_ua ? (
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
                            <Link to={`/admin/letters/${letter.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                `/library/letters/${letter.slug}`,
                                "_blank"
                              )
                            }
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(letter.id)}
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
              <AlertDialogTitle>Видалити лист?</AlertDialogTitle>
              <AlertDialogDescription>
                Ця дія видалить лист назавжди. Цю дію неможливо скасувати.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteLetter.mutate(deleteId)}
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
