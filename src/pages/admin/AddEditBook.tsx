import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AddEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [slug, setSlug] = useState("");
  const [titleUa, setTitleUa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionUa, setDescriptionUa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const { data: book } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user && isAdmin,
  });

  useEffect(() => {
    if (book) {
      setSlug(book.slug);
      setTitleUa(book.title_ua);
      setTitleEn(book.title_en || "");
      setDescriptionUa(book.description_ua || "");
      setDescriptionEn(book.description_en || "");
      setCoverImageUrl(book.cover_image_url || "");
    }
  }, [book]);

  const mutation = useMutation({
    mutationFn: async () => {
      const bookData = {
        slug,
        title_ua: titleUa,
        title_en: titleEn || null,
        description_ua: descriptionUa || null,
        description_en: descriptionEn || null,
        cover_image_url: coverImageUrl || null,
      };

      if (id) {
        const { error } = await supabase
          .from("books")
          .update(bookData)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("books").insert(bookData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({
        title: id ? "Книгу оновлено" : "Книгу додано",
        description: "Зміни успішно збережено",
      });
      navigate("/admin/books");
    },
    onError: (error) => {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !titleUa) {
      toast({
        title: "Помилка",
        description: "Заповніть обов'язкові поля: slug та назва UA",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate();
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/books")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад до книг
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Редагувати книгу" : "Додати книгу"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="srimad-bhagavatam"
                required
              />
            </div>

            <div>
              <Label htmlFor="coverImageUrl">URL обкладинки</Label>
              <Input
                id="coverImageUrl"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://example.com/cover.jpg або /assets/book-cover.jpg"
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
                    placeholder="Шрімад-Бгаґаватам"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionUa">Опис</Label>
                  <Textarea
                    id="descriptionUa"
                    value={descriptionUa}
                    onChange={(e) => setDescriptionUa(e.target.value)}
                    placeholder="Опис книги українською..."
                    rows={6}
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
                    placeholder="Srimad-Bhagavatam"
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionEn">Description</Label>
                  <Textarea
                    id="descriptionEn"
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Book description in English..."
                    rows={6}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Збереження..." : "Зберегти"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/books")}
              >
                Скасувати
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
