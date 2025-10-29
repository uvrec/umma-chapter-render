import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit, Eye, EyeOff, Trash2, CheckSquare, Square } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

const Verses = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [selectedCantoId, setSelectedCantoId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [deleteVerseId, setDeleteVerseId] = useState<string | null>(null);
  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const { data: books } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("title_ua");
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const selectedBook = books?.find((b) => b.id === selectedBookId);

  const { data: cantos } = useQuery({
    queryKey: ["admin-cantos", selectedBookId],
    queryFn: async () => {
      if (!selectedBookId) return [];
      const { data, error } = await supabase
        .from("cantos")
        .select("*")
        .eq("book_id", selectedBookId)
        .order("canto_number");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBookId && !!selectedBook?.has_cantos,
  });

  const { data: chapters } = useQuery({
    queryKey: ["admin-chapters", selectedBookId, selectedCantoId],
    queryFn: async () => {
      if (!selectedBookId) return [];

      let query = supabase.from("chapters").select("*, books(title_ua), cantos(title_ua, canto_number)");

      if (selectedBook?.has_cantos && selectedCantoId) {
        query = query.eq("canto_id", selectedCantoId);
      } else if (!selectedBook?.has_cantos) {
        query = query.eq("book_id", selectedBookId);
      } else {
        return [];
      }

      const { data, error } = await query.order("chapter_number");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBookId && (!!selectedCantoId || !selectedBook?.has_cantos),
  });

  // Вірші: сортуємо одразу в БД по verse_number_sort (генерована колонка)
  const { data: verses, isLoading } = useQuery({
    queryKey: ["admin-verses", selectedChapterId],
    queryFn: async () => {
      if (!selectedChapterId) return [];
      const { data, error } = await supabase
        .from("verses")
        .select("*")
        .eq("chapter_id", selectedChapterId)
        .is("deleted_at", null)
        .order("verse_number_sort", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedChapterId,
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase.from("verses").update({ is_published: !isPublished }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      toast.success("Статус вірша оновлено");
    },
    onError: () => {
      toast.error("Помилка при оновленні статусу");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("verses")
        .update({ deleted_at: new Date().toISOString() } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      toast.success("Вірш видалено");
      setDeleteVerseId(null);
    },
    onError: () => {
      toast.error("Помилка при видаленні вірша");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("verses")
        .update({ deleted_at: new Date().toISOString() } as any)
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      toast.success(`Видалено ${selectedVerses.size} віршів`);
      setSelectedVerses(new Set());
      setBulkDeleteMode(false);
    },
    onError: () => {
      toast.error("Помилка при масовому видаленні");
    },
  });

  const toggleVerseSelection = (id: string) => {
    const newSelected = new Set(selectedVerses);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVerses(newSelected);
  };

  const selectRange = (startIdx: number, endIdx: number) => {
    if (!verses) return;
    const newSelected = new Set(selectedVerses);
    for (let i = startIdx; i <= endIdx; i++) {
      if (verses[i]) {
        newSelected.add(verses[i].id);
      }
    }
    setSelectedVerses(newSelected);
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
              <h1 className="text-2xl font-bold">Вірші</h1>
            </div>
            <div className="flex gap-2">
              {selectedChapterId && bulkDeleteMode && selectedVerses.size > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm(`Видалити ${selectedVerses.size} вибраних віршів?`)) {
                      bulkDeleteMutation.mutate(Array.from(selectedVerses));
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Видалити вибрані ({selectedVerses.size})
                </Button>
              )}
              {selectedChapterId && verses && verses.length > 0 && (
                <Button
                  variant={bulkDeleteMode ? "secondary" : "outline"}
                  onClick={() => {
                    setBulkDeleteMode(!bulkDeleteMode);
                    setSelectedVerses(new Set());
                  }}
                >
                  {bulkDeleteMode ? "Скасувати" : "Масове видалення"}
                </Button>
              )}
              {selectedChapterId && (
                <Button asChild>
                  <Link to={`/admin/verses/new?chapterId=${selectedChapterId}`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Додати вірш
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Оберіть книгу</label>
            <Select
              value={selectedBookId}
              onValueChange={(value) => {
                setSelectedBookId(value);
                setSelectedCantoId("");
                setSelectedChapterId("");
              }}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Виберіть книгу" />
              </SelectTrigger>
              <SelectContent>
                {books?.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title_ua}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBook?.has_cantos && (
            <div>
              <label className="text-sm font-medium mb-2 block">Оберіть пісню</label>
              <Select
                value={selectedCantoId}
                onValueChange={(value) => {
                  setSelectedCantoId(value);
                  setSelectedChapterId("");
                }}
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Виберіть пісню" />
                </SelectTrigger>
                <SelectContent>
                  {cantos?.map((canto) => (
                    <SelectItem key={canto.id} value={canto.id}>
                      Пісня {canto.canto_number}: {canto.title_ua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {((selectedBook?.has_cantos && selectedCantoId) || (!selectedBook?.has_cantos && selectedBookId)) && (
            <div>
              <label className="text-sm font-medium mb-2 block">Оберіть главу</label>
              <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Виберіть главу" />
                </SelectTrigger>
                <SelectContent>
                  {chapters?.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      Глава {chapter.chapter_number}: {chapter.title_ua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {selectedChapterId && (
          <>
            {isLoading ? (
              <p>Завантаження...</p>
            ) : verses && verses.length > 0 ? (
              <div className="space-y-4">
                {verses.map((verse, idx) => (
                  <Card key={verse.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {bulkDeleteMode && (
                          <Checkbox
                            checked={selectedVerses.has(verse.id)}
                            onCheckedChange={() => toggleVerseSelection(verse.id)}
                            className="mt-1"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{verse.verse_number}</h3>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded ${
                                verse.is_published
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-orange-500/10 text-orange-500"
                              }`}
                            >
                              {verse.is_published ? "Опубліковано" : "Приховано"}
                            </span>
                          </div>
                          {verse.sanskrit && <p className="text-sm text-muted-foreground mb-2">{verse.sanskrit}</p>}
                          {verse.translation_ua && (
                            <p className="text-sm mb-2">{verse.translation_ua.substring(0, 100)}...</p>
                          )}
                          {verse.translation_en ? (
                            <span className="inline-block px-2 py-1 text-xs bg-blue-500/10 text-blue-500 rounded">
                              Є англійський переклад
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-500/10 text-gray-500 rounded">
                              Немає англійського перекладу
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              togglePublishMutation.mutate({
                                id: verse.id,
                                isPublished: verse.is_published ?? true,
                              })
                            }
                          >
                            {verse.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/admin/verses/${verse.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteVerseId(verse.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
                  <p className="text-muted-foreground">Віршів не знайдено в цьому розділі</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <AlertDialog open={!!deleteVerseId} onOpenChange={() => setDeleteVerseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити вірш?</AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія видалить вірш з бази даних. Цю операцію неможливо скасувати.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteVerseId && deleteMutation.mutate(deleteVerseId)}
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

export default Verses;
