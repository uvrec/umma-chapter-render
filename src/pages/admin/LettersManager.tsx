/**
 * Управління листами - список та редагування
 * /admin/letters
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
import type { Letter } from "@/types/letter";
import { toast } from "sonner";

export default function LettersManager() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);

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

  // Мутація для оновлення листа
  const updateLetter = useMutation({
    mutationFn: async (letter: Partial<Letter> & { id: string }) => {
      const { error } = await (supabase as any)
        .from("letters")
        .update({
          recipient_en: letter.recipient_en,
          recipient_uk: letter.recipient_uk,
          location_en: letter.location_en,
          location_uk: letter.location_uk,
          content_en: letter.content_en,
          content_uk: letter.content_uk,
          letter_date: letter.letter_date,
        })
        .eq("id", letter.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-letters"] });
      toast.success("Лист оновлено");
      setEditingLetter(null);
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`);
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
    },
  });

  // Авто-транслітерація контенту
  const autoTransliterate = () => {
    if (!editingLetter?.content_en) return;

    const transliterated = transliterateIAST(editingLetter.content_en);
    setEditingLetter({
      ...editingLetter,
      content_uk: transliterated,
    });
    toast.success("Транслітерацію застосовано");
  };

  // AI переклад через Claude
  const [isTranslating, setIsTranslating] = useState(false);

  const translateWithAI = async () => {
    if (!editingLetter?.content_en) return;

    setIsTranslating(true);
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
            text: editingLetter.content_en,
            context: "letter",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Translation failed");
      }

      const data = await response.json();

      setEditingLetter({
        ...editingLetter,
        content_uk: data.translated,
      });

      toast.success(
        `Перекладено! Знайдено ${data.terms_found?.length || 0} санскритських термінів`
      );
    } catch (error: any) {
      toast.error(error.message || "Помилка перекладу. Перевірте налаштування API.");
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Фільтровані листи
  const filteredLetters = letters.filter(
    (l) =>
      l.recipient_en?.toLowerCase().includes(search.toLowerCase()) ||
      l.slug?.toLowerCase().includes(search.toLowerCase()) ||
      l.location_en?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user || !isAdmin) return null;

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

          <Button onClick={() => navigate("/admin/letter-import")}>
            Імпорт листів
          </Button>
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
                        {letter.content_uk ? (
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
                            onClick={() => setEditingLetter(letter)}
                          >
                            <Edit className="w-4 h-4" />
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
                            onClick={() => {
                              if (confirm("Видалити лист?")) {
                                deleteLetter.mutate(letter.id);
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
          open={!!editingLetter}
          onOpenChange={() => setEditingLetter(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Редагування листа</DialogTitle>
            </DialogHeader>

            {editingLetter && (
              <div className="space-y-6">
                {/* Метадані */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Отримувач (EN)</label>
                    <Input
                      value={editingLetter.recipient_en || ""}
                      onChange={(e) =>
                        setEditingLetter({
                          ...editingLetter,
                          recipient_en: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Отримувач (UK)</label>
                    <Input
                      value={editingLetter.recipient_uk || ""}
                      onChange={(e) =>
                        setEditingLetter({
                          ...editingLetter,
                          recipient_uk: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Локація (EN)</label>
                    <Input
                      value={editingLetter.location_en || ""}
                      onChange={(e) =>
                        setEditingLetter({
                          ...editingLetter,
                          location_en: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Локація (UK)</label>
                    <Input
                      value={editingLetter.location_uk || ""}
                      onChange={(e) =>
                        setEditingLetter({
                          ...editingLetter,
                          location_uk: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Дата листа</label>
                    <Input
                      type="date"
                      value={editingLetter.letter_date || ""}
                      onChange={(e) =>
                        setEditingLetter({
                          ...editingLetter,
                          letter_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Контент */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Текст листа</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={autoTransliterate}>
                        <Languages className="w-4 h-4 mr-2" />
                        Транслітерувати
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={translateWithAI}
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        English
                      </label>
                      <Textarea
                        value={editingLetter.content_en || ""}
                        onChange={(e) =>
                          setEditingLetter({
                            ...editingLetter,
                            content_en: e.target.value,
                          })
                        }
                        rows={15}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Українська
                      </label>
                      <Textarea
                        value={editingLetter.content_uk || ""}
                        onChange={(e) =>
                          setEditingLetter({
                            ...editingLetter,
                            content_uk: e.target.value,
                          })
                        }
                        rows={15}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingLetter(null)}
                  >
                    Скасувати
                  </Button>
                  <Button
                    onClick={() => updateLetter.mutate(editingLetter)}
                    disabled={updateLetter.isPending}
                  >
                    {updateLetter.isPending && (
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
