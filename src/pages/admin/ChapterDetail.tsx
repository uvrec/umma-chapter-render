// src/pages/admin/ChapterDetail.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalInlineEditor } from "@/components/UniversalInlineEditor";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ChapterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"ua" | "en">("ua");

  const { data: chapter, isLoading } = useQuery({
    queryKey: ["admin-chapter", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select(
          `
          *,
          book:books(id, title_ua, title_en),
          canto:cantos(id, canto_number, title_ua),
          verses(id, verse_number)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user && isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "✅ Главу видалено" });
      navigate(chapter?.book_id ? `/admin/chapters/${chapter.book_id}` : "/admin/books");
    },
    onError: (error: any) => {
      toast({
        title: "Помилка видалення",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (!confirm("Видалити цю главу? Всі вірші також будуть видалені!")) return;
    deleteMutation.mutate();
  };

  if (!user || !isAdmin) {
    return <div>Access denied</div>;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Завантаження...</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Главу не знайдено</div>
      </div>
    );
  }

  const isTextChapter = chapter.chapter_type === "text";
  const backLink = chapter.canto_id
    ? `/admin/chapters/canto/${chapter.canto_id}`
    : `/admin/chapters/${chapter.book_id}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to={backLink}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  До глав
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{chapter.title_ua}</h1>
                <p className="text-sm text-muted-foreground">
                  {chapter.book?.title_ua}
                  {chapter.canto && ` • Пісня ${chapter.canto.canto_number}`}
                  {` • Глава ${chapter.chapter_number}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isTextChapter && (
                <Button variant="outline" asChild>
                  <Link to={`/admin/verses?chapter=${chapter.id}`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Додати вірш
                  </Link>
                </Button>
              )}
              <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                <Trash2 className="w-4 h-4 mr-2" />
                Видалити
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Інформація про главу</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Номер:</span>
                <div className="font-medium">{chapter.chapter_number}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Тип:</span>
                <div className="font-medium">{isTextChapter ? "Текстова глава" : "Глава з віршами"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Віршів:</span>
                <div className="font-medium">{isTextChapter ? "—" : chapter.verses?.length || 0}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Книга:</span>
                <div className="font-medium">{chapter.book?.title_ua}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Title Editors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Назви глави</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Українська назва</label>
              <UniversalInlineEditor
                table="chapters"
                recordId={chapter.id}
                field="title_ua"
                initialValue={chapter.title_ua || ""}
                label="Назва UA"
                showToggle={true}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Англійська назва</label>
              <UniversalInlineEditor
                table="chapters"
                recordId={chapter.id}
                field="title_en"
                initialValue={chapter.title_en || ""}
                label="Назва EN"
                showToggle={true}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Editor for text chapters */}
        {isTextChapter && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Контент лекції/листа</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === "ua" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("ua")}
                  >
                    UA
                  </Button>
                  <Button
                    variant={activeTab === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("en")}
                  >
                    EN
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "ua" ? (
                <UniversalInlineEditor
                  table="chapters"
                  recordId={chapter.id}
                  field="content_ua"
                  initialValue={chapter.content_ua || ""}
                  label="Контент (українською)"
                  language="ua"
                  showToggle={true}
                  className="min-h-[400px]"
                />
              ) : (
                <UniversalInlineEditor
                  table="chapters"
                  recordId={chapter.id}
                  field="content_en"
                  initialValue={chapter.content_en || ""}
                  label="Контент (англійською)"
                  language="en"
                  showToggle={true}
                  className="min-h-[400px]"
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Verses list for verse chapters */}
        {!isTextChapter && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Вірші ({chapter.verses?.length || 0})</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/verses?chapter=${chapter.id}`}>Переглянути всі</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!chapter.verses || chapter.verses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Віршів поки немає</p>
                  <Button className="mt-4" asChild>
                    <Link to={`/admin/verses/new?chapter=${chapter.id}`}>Додати перший вірш</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {chapter.verses.slice(0, 10).map((verse: any) => (
                    <div
                      key={verse.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-muted/50"
                    >
                      <span className="font-medium">Вірш {verse.verse_number}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/verses/${verse.id}/edit`}>Редагувати</Link>
                      </Button>
                    </div>
                  ))}
                  {chapter.verses.length > 10 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" asChild>
                        <Link to={`/admin/verses?chapter=${chapter.id}`}>
                          Показати всі {chapter.verses.length} віршів
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
