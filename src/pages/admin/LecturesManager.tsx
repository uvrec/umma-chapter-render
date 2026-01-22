/**
 * Управління лекціями - список та редагування
 * /admin/lectures
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Save,
  Loader2,
  Languages,
  Sparkles,
} from "lucide-react";
import { transliterateIAST } from "@/utils/text/transliteration";
import type { Lecture, LectureParagraph } from "@/types/lecture";
import { toast } from "sonner";

export default function LecturesManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [editingParagraphs, setEditingParagraphs] = useState<LectureParagraph[]>([]);

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

  // Завантажити параграфи для редагування
  const { data: paragraphs = [], refetch: refetchParagraphs } = useQuery({
    queryKey: ["lecture-paragraphs-edit", editingLecture?.id],
    queryFn: async () => {
      if (!editingLecture?.id) return [];
      const { data, error } = await (supabase as any)
        .from("lecture_paragraphs")
        .select("*")
        .eq("lecture_id", editingLecture.id)
        .order("paragraph_number");

      if (error) throw error;
      return data as LectureParagraph[];
    },
    enabled: !!editingLecture?.id,
  });

  // Мутація для оновлення лекції
  const updateLecture = useMutation({
    mutationFn: async (lecture: Partial<Lecture> & { id: string }) => {
      const { error } = await (supabase as any)
        .from("lectures")
        .update({
          title_en: lecture.title_en,
          title_ua: lecture.title_uk,
          location_en: lecture.location_en,
          location_ua: lecture.location_ua,
          lecture_type: lecture.lecture_type,
        })
        .eq("id", lecture.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lectures"] });
      toast.success("Лекцію оновлено");
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`);
    },
  });

  // Мутація для оновлення параграфів
  const updateParagraphs = useMutation({
    mutationFn: async (paragraphs: LectureParagraph[]) => {
      for (const p of paragraphs) {
        const { error } = await (supabase as any)
          .from("lecture_paragraphs")
          .update({
            content_en: p.content_en,
            content_ua: p.content_uk,
          })
          .eq("id", p.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      refetchParagraphs();
      toast.success("Параграфи оновлено");
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`);
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
    },
  });

  // Авто-транслітерація для параграфа
  const autoTransliterate = (index: number) => {
    const p = editingParagraphs[index];
    if (!p.content_en) return;

    // Транслітерувати санскритські терміни
    const transliterated = transliterateIAST(p.content_en);

    setEditingParagraphs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], content_ua: transliterated };
      return updated;
    });
  };

  // Авто-транслітерація всіх параграфів
  const autoTransliterateAll = () => {
    setEditingParagraphs((prev) =>
      prev.map((p) => ({
        ...p,
        content_ua: p.content_en ? transliterateIAST(p.content_en) : p.content_uk,
      }))
    );
    toast.success("Транслітерацію застосовано до всіх параграфів");
  };

  // AI переклад через Claude
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingIndex, setTranslatingIndex] = useState<number | null>(null);

  const translateParagraphWithAI = async (index: number) => {
    const p = editingParagraphs[index];
    if (!p.content_en) return;

    setTranslatingIndex(index);
    try {
      // Get the current user's session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Необхідно увійти в систему");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-claude`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            text: p.content_en,
            context: "lecture",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Translation failed");
      }

      const data = await response.json();

      setEditingParagraphs((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], content_ua: data.translated };
        return updated;
      });

      toast.success(`Параграф #${p.paragraph_number} перекладено`);
    } catch (error: any) {
      toast.error(error.message || "Помилка перекладу. Перевірте налаштування API.");
      console.error(error);
    } finally {
      setTranslatingIndex(null);
    }
  };

  const translateAllWithAI = async () => {
    const untranslated = editingParagraphs.filter(
      (p) => p.content_en && !p.content_uk
    );

    if (untranslated.length === 0) {
      toast.info("Всі параграфи вже перекладено");
      return;
    }

    setIsTranslating(true);
    let translated = 0;

    try {
      // Get the current user's session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Необхідно увійти в систему");
      }

      for (let i = 0; i < editingParagraphs.length; i++) {
        const p = editingParagraphs[i];
        if (!p.content_en || p.content_uk) continue;

        setTranslatingIndex(i);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-claude`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              text: p.content_en,
              context: "lecture",
            }),
          }
        );

        if (!response.ok) {
          console.error(`Failed to translate paragraph ${i}`);
          continue;
        }

        const data = await response.json();

        setEditingParagraphs((prev) => {
          const updated = [...prev];
          updated[i] = { ...updated[i], content_ua: data.translated };
          return updated;
        });

        translated++;
      }

      toast.success(`Перекладено ${translated} параграфів`);
    } catch (error) {
      toast.error("Помилка перекладу");
      console.error(error);
    } finally {
      setIsTranslating(false);
      setTranslatingIndex(null);
    }
  };

  // Фільтровані лекції
  const filteredLectures = lectures.filter(
    (l) =>
      l.title_en?.toLowerCase().includes(search.toLowerCase()) ||
      l.slug?.toLowerCase().includes(search.toLowerCase()) ||
      l.location_en?.toLowerCase().includes(search.toLowerCase())
  );

  // Відкрити редактор
  const openEditor = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setEditingParagraphs([]);
  };

  // Зберегти зміни
  const saveChanges = async () => {
    if (!editingLecture) return;

    await updateLecture.mutateAsync(editingLecture);

    if (editingParagraphs.length > 0) {
      await updateParagraphs.mutateAsync(editingParagraphs);
    }

    setEditingLecture(null);
  };

  // Коли параграфи завантажені - копіюємо в стейт
  if (paragraphs.length > 0 && editingParagraphs.length === 0) {
    setEditingParagraphs(paragraphs);
  }

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

          <Button onClick={() => navigate("/admin/lecture-import")}>
            Імпорт лекцій
          </Button>
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
                        {lecture.title_uk ? (
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
                            onClick={() => openEditor(lecture)}
                          >
                            <Edit className="w-4 h-4" />
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
                            onClick={() => {
                              if (confirm("Видалити лекцію?")) {
                                deleteLecture.mutate(lecture.id);
                              }
                            }}
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

        {/* Діалог редагування */}
        <Dialog
          open={!!editingLecture}
          onOpenChange={() => setEditingLecture(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Редагування лекції</DialogTitle>
            </DialogHeader>

            {editingLecture && (
              <div className="space-y-6">
                {/* Метадані */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Назва (EN)</label>
                    <Input
                      value={editingLecture.title_en || ""}
                      onChange={(e) =>
                        setEditingLecture({
                          ...editingLecture,
                          title_en: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Назва (UA)</label>
                    <Input
                      value={editingLecture.title_uk || ""}
                      onChange={(e) =>
                        setEditingLecture({
                          ...editingLecture,
                          title_ua: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Локація (EN)</label>
                    <Input
                      value={editingLecture.location_en || ""}
                      onChange={(e) =>
                        setEditingLecture({
                          ...editingLecture,
                          location_en: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Локація (UA)</label>
                    <Input
                      value={editingLecture.location_ua || ""}
                      onChange={(e) =>
                        setEditingLecture({
                          ...editingLecture,
                          location_ua: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Параграфи */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Параграфи ({editingParagraphs.length})
                      {isTranslating && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          Перекладаю {translatingIndex !== null ? `#${editingParagraphs[translatingIndex]?.paragraph_number}` : "..."}
                        </span>
                      )}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={autoTransliterateAll}
                      >
                        <Languages className="w-4 h-4 mr-2" />
                        Транслітерувати
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={translateAllWithAI}
                        disabled={isTranslating}
                      >
                        {isTranslating ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Перекласти AI
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {editingParagraphs.map((p, idx) => (
                      <Card key={p.id} className={`p-4 ${translatingIndex === idx ? "ring-2 ring-primary" : ""}`}>
                        <div className="flex justify-between items-start mb-2">
                          <Badge>#{p.paragraph_number}</Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => autoTransliterate(idx)}
                              title="Транслітерувати"
                            >
                              <Languages className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => translateParagraphWithAI(idx)}
                              disabled={translatingIndex === idx}
                              title="Перекласти AI"
                            >
                              {translatingIndex === idx ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-muted-foreground">
                              EN
                            </label>
                            <EnhancedInlineEditor
                              content={p.content_en || ""}
                              onChange={(html) => {
                                setEditingParagraphs((prev) => {
                                  const updated = [...prev];
                                  updated[idx] = {
                                    ...updated[idx],
                                    content_en: html,
                                  };
                                  return updated;
                                });
                              }}
                              minHeight="100px"
                              compact
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">
                              UA
                            </label>
                            <EnhancedInlineEditor
                              content={p.content_uk || ""}
                              onChange={(html) => {
                                setEditingParagraphs((prev) => {
                                  const updated = [...prev];
                                  updated[idx] = {
                                    ...updated[idx],
                                    content_ua: html,
                                  };
                                  return updated;
                                });
                              }}
                              minHeight="100px"
                              compact
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingLecture(null)}
                  >
                    Скасувати
                  </Button>
                  <Button
                    onClick={saveChanges}
                    disabled={updateLecture.isPending || updateParagraphs.isPending}
                  >
                    {(updateLecture.isPending || updateParagraphs.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <Save className="w-4 h-4 mr-2" />
                    Зберегти
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
