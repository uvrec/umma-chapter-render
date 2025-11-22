import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScriptureTreeNav } from "@/components/admin/ScriptureTreeNav";
import { VerseQuickEdit } from "@/components/admin/VerseQuickEdit";
import {
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  FileText,
  CheckSquare,
  Square,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

export default function ScriptureManager() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    searchParams.get("chapterId")
  );
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const [isCreatingVerse, setIsCreatingVerse] = useState(false);
  const [deleteVerseId, setDeleteVerseId] = useState<{
    id: string;
    verseNumber: string;
  } | null>(null);

  // Bulk delete state
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  // Sync URL params when chapter selection changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedChapterId) params.set("chapterId", selectedChapterId);
    setSearchParams(params, { replace: true });
  }, [selectedChapterId, setSearchParams]);

  const { data: books } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("title_ua");
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: cantos } = useQuery({
    queryKey: ["admin-cantos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cantos")
        .select("*")
        .order("book_id, canto_number");
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: chapters } = useQuery({
    queryKey: ["admin-chapters-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*, books(title_ua), cantos(title_ua, canto_number)")
        .order("chapter_number");
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: verses, isLoading: versesLoading } = useQuery({
    queryKey: ["admin-verses", selectedChapterId],
    queryFn: async () => {
      if (!selectedChapterId) return [];
      const { data, error } = await supabase
        .from("verses")
        .select("*")
        .eq("chapter_id", selectedChapterId)
        .is("deleted_at", null)
        .order("sort_key", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedChapterId,
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from("verses")
        .update({ is_published: !isPublished })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      // Очищуємо кеш для адмінки і фронтенду
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      toast.success("Статус вірша оновлено");
    },
    onError: (error: any) => {
      toast.error(`Помилка: ${error?.message || ""}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from("verses")
        .update({ deleted_at: new Date().toISOString() } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      // Очищуємо кеш для адмінки і фронтенду
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      toast.success("Вірш видалено");
      setDeleteVerseId(null);
      if (selectedVerseId === deleteVerseId?.id) {
        setSelectedVerseId(null);
      }
    },
    onError: (error: any) => {
      toast.error(`Помилка: ${error?.message || ""}`);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async ({ ids, count }: { ids: string[]; count: number }) => {
      const { error } = await supabase
        .from("verses")
        .update({ deleted_at: new Date().toISOString() } as any)
        .in("id", ids);
      if (error) throw error;
      return { count };
    },
    onSuccess: (_, variables) => {
      // Очищуємо кеш для адмінки і фронтенду
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      toast.success(`Видалено ${variables.count} віршів`);
      setSelectedVerses(new Set());
      setBulkDeleteMode(false);
    },
    onError: (error: any, variables) => {
      toast.error(
        `Помилка при масовому видаленні (${variables.count} віршів): ${error?.message || ""}`
      );
    },
  });

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedVerseId(null); // Close quick edit panel
    setBulkDeleteMode(false); // Exit bulk delete mode
    setSelectedVerses(new Set()); // Clear selection
  };

  const toggleVerseSelection = (id: string, index: number, shiftKey: boolean) => {
    const newSelected = new Set(selectedVerses);

    if (shiftKey && lastSelectedIndex !== null && verses) {
      // Shift+click: select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      for (let i = start; i <= end; i++) {
        if (verses[i]) {
          newSelected.add(verses[i].id);
        }
      }
    } else {
      // Regular click: toggle single
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
    }

    setSelectedVerses(newSelected);
    setLastSelectedIndex(index);
  };

  const selectAll = () => {
    if (!verses) return;
    const allIds = new Set(verses.map((v) => v.id));
    setSelectedVerses(allIds);
  };

  const deselectAll = () => {
    setSelectedVerses(new Set());
  };

  const selectByRange = () => {
    if (!verses || !rangeInput.trim()) return;

    const match = rangeInput.match(/^(\d+)-(\d+)$/);
    if (!match) {
      toast.error("Введіть діапазон у форматі: 200-500");
      return;
    }

    const start = parseInt(match[1]);
    const end = parseInt(match[2]);

    if (start > end) {
      toast.error("Початок діапазону має бути меншим за кінець");
      return;
    }

    const newSelected = new Set(selectedVerses);
    verses.forEach((verse, idx) => {
      const verseNum = idx + 1; // assuming 1-based indexing
      if (verseNum >= start && verseNum <= end) {
        newSelected.add(verse.id);
      }
    });

    setSelectedVerses(newSelected);
    toast.success(`Вибрано вірші ${start}-${end}`);
    setRangeInput("");
  };

  const selectedChapter = chapters?.find((ch) => ch.id === selectedChapterId);

  if (!user || !isAdmin) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Scripture Manager</h1>
              {selectedChapter && (
                <p className="text-sm text-muted-foreground">
                  {selectedChapter.books?.title_ua}
                  {selectedChapter.cantos && ` → Пісня ${selectedChapter.cantos.canto_number}`}
                  {` → Розділ ${selectedChapter.chapter_number}`}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {selectedChapterId && bulkDeleteMode && selectedVerses.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (
                    confirm(`Видалити ${selectedVerses.size} вибраних віршів?`)
                  ) {
                    bulkDeleteMutation.mutate({
                      ids: Array.from(selectedVerses),
                      count: selectedVerses.size,
                    });
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Видалити ({selectedVerses.size})
              </Button>
            )}
            {selectedChapterId && verses && verses.length > 0 && (
              <Button
                variant={bulkDeleteMode ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setBulkDeleteMode(!bulkDeleteMode);
                  setSelectedVerses(new Set());
                  setLastSelectedIndex(null);
                }}
              >
                {bulkDeleteMode ? "Скасувати" : "Масове видалення"}
              </Button>
            )}
            {selectedChapterId && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedVerseId(null);
                  setIsCreatingVerse(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Створити вірш
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Tree Navigation */}
        <div className="w-64 flex-shrink-0">
          <ScriptureTreeNav
            books={books || []}
            cantos={cantos || []}
            chapters={chapters || []}
            selectedChapterId={selectedChapterId}
            onChapterSelect={handleChapterSelect}
          />
        </div>

        {/* Center Panel: Verses List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedChapterId ? (
            <>
              {/* Verses Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Вірші</h2>
                    <p className="text-sm text-muted-foreground">
                      {verses?.length || 0} віршів у розділі
                    </p>
                  </div>
                </div>
              </div>

              {/* Bulk Selection Toolbar */}
              {bulkDeleteMode && verses && verses.length > 0 && (
                <div className="p-4 border-b bg-muted/30">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button size="sm" variant="outline" onClick={selectAll}>
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Вибрати всі
                    </Button>
                    <Button size="sm" variant="outline" onClick={deselectAll}>
                      <Square className="w-4 h-4 mr-2" />
                      Зняти всі
                    </Button>
                    <div className="flex gap-2 items-center ml-4">
                      <Input
                        type="text"
                        placeholder="200-500"
                        value={rangeInput}
                        onChange={(e) => setRangeInput(e.target.value)}
                        className="w-32 h-8"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            selectByRange();
                          }
                        }}
                      />
                      <Button size="sm" onClick={selectByRange}>
                        Вибрати діапазон
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground ml-auto">
                      Вибрано: {selectedVerses.size} із {verses.length}
                    </span>
                  </div>
                </div>
              )}

              {/* Verses List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {versesLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Завантаження...
                    </div>
                  ) : verses && verses.length > 0 ? (
                    verses.map((verse: any, index: number) => (
                      <Card
                        key={verse.id}
                        className={cn(
                          "p-4 cursor-pointer transition-all hover:border-primary/50",
                          selectedVerseId === verse.id &&
                            "border-primary bg-primary/5",
                          bulkDeleteMode &&
                            selectedVerses.has(verse.id) &&
                            "border-destructive bg-destructive/5"
                        )}
                        onClick={(e) => {
                          if (bulkDeleteMode) {
                            toggleVerseSelection(verse.id, index, e.shiftKey);
                          } else {
                            setSelectedVerseId(verse.id);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          {bulkDeleteMode && (
                            <Checkbox
                              checked={selectedVerses.has(verse.id)}
                              onCheckedChange={() =>
                                toggleVerseSelection(verse.id, index, false)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-sm">
                                Вірш {verse.verse_number}
                              </span>
                              {!verse.is_published && (
                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                                  Чернетка
                                </span>
                              )}
                            </div>
                            {verse.translation_ua && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {verse.translation_ua}
                              </p>
                            )}
                          </div>

                          {!bulkDeleteMode && (
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePublishMutation.mutate({
                                    id: verse.id,
                                    isPublished: verse.is_published,
                                  });
                                }}
                                title={
                                  verse.is_published
                                    ? "Приховати"
                                    : "Опублікувати"
                                }
                              >
                                {verse.is_published ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                              <Button size="sm" variant="ghost" asChild>
                                <Link
                                  to={`/admin/verses/${verse.id}/edit`}
                                  target="_blank"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteVerseId({
                                    id: verse.id,
                                    verseNumber: verse.verse_number,
                                  });
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Віршів не знайдено</p>
                      <Button asChild size="sm" className="mt-4">
                        <Link to={`/admin/verses/new?chapterId=${selectedChapterId}`}>
                          <Plus className="w-4 h-4 mr-2" />
                          Додати перший вірш
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Виберіть розділ</p>
                <p className="text-sm mt-2">
                  Оберіть розділ з дерева навігації ліворуч
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Quick Edit */}
        <div className="w-96 flex-shrink-0">
          <VerseQuickEdit
            verseId={selectedVerseId}
            chapterId={selectedChapterId}
            mode={isCreatingVerse ? "create" : "edit"}
            onClose={() => {
              setSelectedVerseId(null);
              setIsCreatingVerse(false);
            }}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
              setIsCreatingVerse(false);
            }}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteVerseId}
        onOpenChange={() => setDeleteVerseId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити вірш?</AlertDialogTitle>
            <AlertDialogDescription>
              Ви впевнені, що хочете видалити вірш{" "}
              <strong>{deleteVerseId?.verseNumber}</strong>? Цю дію можна
              буде скасувати.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteVerseId) {
                  deleteMutation.mutate({ id: deleteVerseId.id });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
