// src/pages/admin/Chapters.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, FileText, BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TiptapEditor } from "@/components/blog/TiptapEditor";
import { PreviewShareButton } from "@/components/PreviewShareButton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ChapterType = "verses" | "text";

interface ChapterForm {
  chapter_number: string;
  title_uk: string;
  title_en: string;
  chapter_type: ChapterType;
  content_uk: string;
  content_en: string;
}

export default function Chapters() {
  const { bookId, cantoId } = useParams();
  const queryClient = useQueryClient();

  const parentId = cantoId || bookId;
  const isCantoMode = !!cantoId;

  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);

  const [form, setForm] = useState<ChapterForm>({
    chapter_number: "",
    title_uk: "",
    title_en: "",
    chapter_type: "verses",
    content_uk: "",
    content_en: "",
  });

  const resetForm = () => {
    setForm({
      chapter_number: "",
      title_uk: "",
      title_en: "",
      chapter_type: "verses",
      content_uk: "",
      content_en: "",
    });
  };

  async function isChapterNumberTaken(params: {
    chapterNumber: number;
    bookId?: string | null;
    cantoId?: string | null;
    excludeId?: string | null;
  }) {
    const { chapterNumber, bookId, cantoId, excludeId } = params;

    let query = supabase
      .from("chapters")
      .select("id", { count: "exact", head: true })
      .eq("chapter_number", chapterNumber);

    if (cantoId) {
      query = query.eq("canto_id", cantoId);
    } else if (bookId) {
      query = query.eq("book_id", bookId);
    }

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { count, error } = await query;
    if (error) throw error;
    return (count ?? 0) > 0;
  }

  const { data: book } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      if (!bookId) return null;
      const { data, error } = await supabase.from("books").select("*").eq("id", bookId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId && !isCantoMode,
  });

  const { data: canto } = useQuery({
    queryKey: ["canto", cantoId],
    queryFn: async () => {
      const { data, error } = await supabase.from("cantos").select("*, books(*)").eq("id", cantoId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!cantoId,
  });

  const { data: chapters, isLoading } = useQuery({
    queryKey: ["chapters", parentId, isCantoMode],
    queryFn: async () => {
      const query = supabase.from("chapters").select("*").order("chapter_number");

      if (isCantoMode) {
        query.eq("canto_id", cantoId);
      } else {
        query.eq("book_id", bookId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!parentId,
  });

  const addMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from("chapters").insert(payload);
      if (error) throw error as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", parentId] });
      toast({ title: "Главу додано", description: "Зміни успішно збережено" });
      setIsAddingChapter(false);
      resetForm();
    },
    onError: (error: any) => {
      if (error?.code === "23505") {
        toast({
          title: "Номер вже зайнятий",
          description: "Глава з таким номером уже існує в цій книзі/пісні.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Помилка",
          description: error?.message ?? "Не вдалося зберегти главу",
          variant: "destructive",
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase
        .from("chapters")
        .update({
          chapter_number: payload.chapter_number,
          title_uk: payload.title_uk,
          title_en: payload.title_en,
          chapter_type: payload.chapter_type,
          content_uk: payload.content_uk,
          content_en: payload.content_en,
        })
        .eq("id", payload.id);
      if (error) throw error as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", parentId] });
      toast({ title: "Главу оновлено", description: "Зміни успішно збережено" });
      setEditingChapter(null);
      resetForm();
      setIsAddingChapter(false);
    },
    onError: (error: any) => {
      if (error?.code === "23505") {
        toast({
          title: "Номер вже зайнятий",
          description: "Глава з таким номером уже існує в цій книзі/пісні.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Помилка",
          description: error?.message ?? "Не вдалося оновити главу",
          variant: "destructive",
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (chapterId: string) => {
      const { error } = await supabase.from("chapters").delete().eq("id", chapterId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", parentId] });
      toast({ title: "Главу видалено", description: "Зміни успішно збережено" });
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: error?.message ?? "Не вдалося видалити главу",
        variant: "destructive",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ chapterId, isPublished }: { chapterId: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from("chapters")
        .update({ is_published: isPublished })
        .eq("id", chapterId);
      if (error) throw error;
    },
    onSuccess: (_, { isPublished }) => {
      queryClient.invalidateQueries({ queryKey: ["chapters", parentId] });
      toast({
        title: isPublished ? "Главу опубліковано" : "Главу приховано",
        description: "Зміни успішно збережено"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: error?.message ?? "Не вдалося змінити статус глави",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.chapter_number || !form.title_uk) {
      toast({
        title: "Помилка",
        description: "Заповніть обов'язкові поля",
        variant: "destructive",
      });
      return;
    }

    const num = parseInt(form.chapter_number, 10);
    if (Number.isNaN(num) || num <= 0) {
      toast({
        title: "Невірний номер",
        description: "Номер глави має бути додатним цілим числом.",
        variant: "destructive",
      });
      return;
    }

    const taken = await isChapterNumberTaken({
      chapterNumber: num,
      bookId: isCantoMode ? null : bookId!,
      cantoId: isCantoMode ? cantoId! : null,
      excludeId: editingChapter?.id ?? null,
    });

    if (taken) {
      toast({
        title: "Номер вже зайнятий",
        description: "Глава з таким номером уже існує в цій книзі/пісні.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      chapter_number: num,
      title_uk: form.title_uk,
      title_en: form.title_en || null,
      chapter_type: form.chapter_type,
      content_uk: form.chapter_type === "text" ? form.content_uk || null : null,
      content_en: form.chapter_type === "text" ? form.content_en || null : null,
    };

    if (editingChapter) {
      updateMutation.mutate({ id: editingChapter.id, ...payload });
    } else {
      addMutation.mutate(
        isCantoMode ? { ...payload, canto_id: cantoId! } : { ...payload, book_id: bookId! }
      );
    }
  };

  const startEditing = (chapter: any) => {
    setEditingChapter(chapter);
    setForm({
      chapter_number: String(chapter.chapter_number),
      title_uk: chapter.title_uk || "",
      title_en: chapter.title_en || "",
      chapter_type: chapter.chapter_type || "verses",
      content_uk: chapter.content_uk || "",
      content_en: chapter.content_en || "",
    });
    setIsAddingChapter(true);
  };

  const cancelForm = () => {
    setIsAddingChapter(false);
    setEditingChapter(null);
    resetForm();
  };

  const parentTitle = isCantoMode && canto
    ? `${canto.books?.title_uk} — Пісня ${canto.canto_number}`
    : book?.title_uk || "";

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Книги", href: "/admin/books" },
    ...(isCantoMode && canto?.book_id
      ? [{ label: "Пісні", href: `/admin/cantos/${canto.book_id}` }]
      : []),
    { label: parentTitle || "Глави" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Глави</h1>
            <p className="text-muted-foreground">{parentTitle}</p>
          </div>
          <Button onClick={() => setIsAddingChapter(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Додати главу
          </Button>
        </div>

        {isAddingChapter && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingChapter ? "Редагувати главу" : "Додати главу"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chapterNumber">Номер глави *</Label>
                    <Input
                      id="chapterNumber"
                      type="number"
                      value={form.chapter_number}
                      onChange={(e) => setForm((f) => ({ ...f, chapter_number: e.target.value }))}
                      placeholder="1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="chapterType">Тип глави *</Label>
                    <Select
                      value={form.chapter_type}
                      onValueChange={(v: ChapterType) => setForm((f) => ({ ...f, chapter_type: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verses">
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            З віршами (стандартна)
                          </span>
                        </SelectItem>
                        <SelectItem value="text">
                          <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Текстова (без віршів)
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Українська</h3>
                    <div>
                      <Label htmlFor="titleUa">Назва *</Label>
                      <Input
                        id="titleUa"
                        value={form.title_uk}
                        onChange={(e) => setForm((f) => ({ ...f, title_uk: e.target.value }))}
                        placeholder="Питання мудреців"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">English</h3>
                    <div>
                      <Label htmlFor="titleEn">Title</Label>
                      <Input
                        id="titleEn"
                        value={form.title_en}
                        onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
                        placeholder="Questions by the Sages"
                      />
                    </div>
                  </div>
                </div>

                {form.chapter_type === "text" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Контент глави</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2 block">Контент (українською)</Label>
                        <TiptapEditor
                          content={form.content_uk}
                          onChange={(html) => setForm((f) => ({ ...f, content_uk: html }))}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Контент (англійською)</Label>
                        <TiptapEditor
                          content={form.content_en}
                          onChange={(html) => setForm((f) => ({ ...f, content_en: html }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                    {addMutation.isPending || updateMutation.isPending ? "Збереження..." : "Зберегти"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelForm}>
                    Скасувати
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Завантаження...</p>
          </div>
        ) : chapters && chapters.length > 0 ? (
          <div className="grid gap-4">
            {chapters.map((chapter) => (
              <Card key={chapter.id} className={!chapter.is_published ? "opacity-60 border-dashed" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          Глава {chapter.chapter_number}: {chapter.title_uk}
                        </h3>
                        {chapter.chapter_type === "text" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <FileText className="h-3 w-3" />
                            Текстова
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <BookOpen className="h-3 w-3" />
                            З віршами
                          </span>
                        )}
                        {chapter.is_published ? (
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
                      </div>
                      {chapter.title_en && <p className="text-sm text-muted-foreground mt-1">{chapter.title_en}</p>}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant={chapter.is_published ? "outline" : "default"}
                        onClick={() => togglePublishMutation.mutate({
                          chapterId: chapter.id,
                          isPublished: !chapter.is_published
                        })}
                        disabled={togglePublishMutation.isPending}
                      >
                        {chapter.is_published ? (
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
                        resourceType="chapter"
                        resourceId={chapter.id}
                        variant="outline"
                        size="sm"
                      />
                      <Button size="sm" variant="outline" onClick={() => startEditing(chapter)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Редагувати
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {chapter.chapter_type === "text"
                                ? "Це видалить главу та весь її вміст."
                                : "Це видалить главу та всі вірші в ній."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Скасувати</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(chapter.id)}>
                              Видалити
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Глав не знайдено</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
