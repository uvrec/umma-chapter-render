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
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, X } from "lucide-react";
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
  const [hasCantos, setHasCantos] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(999);
  const [uploading, setUploading] = useState(false);

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
      setHasCantos(book.has_cantos || false);
      setDisplayOrder(book.display_order ?? 999);
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
        has_cantos: hasCantos,
        display_order: displayOrder,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Помилка",
        description: "Будь ласка, виберіть файл зображення",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Помилка",
        description: "Розмір файлу не повинен перевищувати 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${slug || Date.now()}-cover.${fileExt}`;
      const filePath = `book-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('page-media')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('page-media')
        .getPublicUrl(filePath);

      setCoverImageUrl(publicUrl);
      toast({
        title: "Успіх",
        description: "Обкладинку завантажено",
      });
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="displayOrder">Порядок відображення</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 999)}
                  placeholder="999"
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Менше число = вище в списку (0-10 для топу)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Обкладинка книги</Label>
              
              {/* Image Preview */}
              {coverImageUrl && (
                <div className="relative w-48 h-64 bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={coverImageUrl} 
                    alt="Book cover preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverImageUrl("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById('cover-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Завантаження..." : "Завантажити файл"}
                </Button>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Manual URL Input */}
              <div>
                <Label htmlFor="coverImageUrl" className="text-sm text-muted-foreground">
                  Або введіть URL вручну
                </Label>
                <Input
                  id="coverImageUrl"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              {/* Technical Requirements */}
              <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded">
                <p className="font-semibold">Технічні вимоги до обкладинок:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Формат: JPG, PNG, WEBP</li>
                  <li>Розмір: 800x1200px (співвідношення 2:3)</li>
                  <li>Розмір файлу: до 5MB</li>
                  <li>Мінімальна якість: 72 DPI</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasCantos"
                checked={hasCantos}
                onCheckedChange={setHasCantos}
              />
              <Label htmlFor="hasCantos">Має структуру cantos (томи/пісні)</Label>
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
