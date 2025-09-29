import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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

export default function Chapters() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [chapterNumber, setChapterNumber] = useState("");
  const [titleUa, setTitleUa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [editingChapter, setEditingChapter] = useState<any>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const { data: book } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId && !!user && isAdmin,
  });

  const { data: chapters, isLoading } = useQuery({
    queryKey: ["chapters", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("book_id", bookId)
        .order("chapter_number");
      if (error) throw error;
      return data;
    },
    enabled: !!bookId && !!user && isAdmin,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const chapterData = {
        book_id: bookId,
        chapter_number: parseInt(chapterNumber),
        title_ua: titleUa,
        title_en: titleEn || null,
      };

      const { error } = await supabase.from("chapters").insert(chapterData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      toast({ title: "Главу додано", description: "Зміни успішно збережено" });
      setIsAddingChapter(false);
      setChapterNumber("");
      setTitleUa("");
      setTitleEn("");
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const chapterData = {
        chapter_number: parseInt(chapterNumber),
        title_ua: titleUa,
        title_en: titleEn || null,
      };

      const { error } = await supabase
        .from("chapters")
        .update(chapterData)
        .eq("id", editingChapter.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      toast({ title: "Главу оновлено", description: "Зміни успішно збережено" });
      setEditingChapter(null);
      setChapterNumber("");
      setTitleUa("");
      setTitleEn("");
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (chapterId: string) => {
      const { error } = await supabase
        .from("chapters")
        .delete()
        .eq("id", chapterId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      toast({ title: "Главу видалено", description: "Зміни успішно збережено" });
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterNumber || !titleUa) {
      toast({
        title: "Помилка",
        description: "Заповніть обов'язкові поля",
        variant: "destructive",
      });
      return;
    }

    if (editingChapter) {
      updateMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  const startEditing = (chapter: any) => {
    setEditingChapter(chapter);
    setChapterNumber(chapter.chapter_number.toString());
    setTitleUa(chapter.title_ua);
    setTitleEn(chapter.title_en || "");
    setIsAddingChapter(true);
  };

  const cancelForm = () => {
    setIsAddingChapter(false);
    setEditingChapter(null);
    setChapterNumber("");
    setTitleUa("");
    setTitleEn("");
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
                  До книг
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Розділи</h1>
                {book && (
                  <p className="text-sm text-muted-foreground">{book.title_ua}</p>
                )}
              </div>
            </div>
            <Button onClick={() => setIsAddingChapter(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Додати розділ
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isAddingChapter && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingChapter ? "Редагувати розділ" : "Додати розділ"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="chapterNumber">Номер розділу *</Label>
                  <Input
                    id="chapterNumber"
                    type="number"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    placeholder="1"
                    required
                  />
                </div>

                <Tabs defaultValue="ua" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ua">Українська</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ua" className="space-y-4">
                    <div>
                      <Label htmlFor="titleUa">Назва *</Label>
                      <Input
                        id="titleUa"
                        value={titleUa}
                        onChange={(e) => setTitleUa(e.target.value)}
                        placeholder="Питання мудреців"
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4">
                    <div>
                      <Label htmlFor="titleEn">Title</Label>
                      <Input
                        id="titleEn"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="Questions by the Sages"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={addMutation.isPending || updateMutation.isPending}
                  >
                    {addMutation.isPending || updateMutation.isPending
                      ? "Збереження..."
                      : "Зберегти"}
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
          <p>Завантаження...</p>
        ) : chapters && chapters.length > 0 ? (
          <div className="grid gap-4">
            {chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Розділ {chapter.chapter_number}: {chapter.title_ua}
                      </h3>
                      {chapter.title_en && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {chapter.title_en}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(chapter)}
                      >
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
                              Це видалить розділ та всі вірші в ньому. Цю дію неможливо скасувати.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Скасувати</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(chapter.id)}
                            >
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
              <p className="text-muted-foreground">
                Розділів не знайдено для цієї книги
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
