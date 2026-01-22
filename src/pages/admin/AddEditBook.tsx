import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type BookRow = {
  id: string;
  slug: string;
  title_uk: string;
  title_en: string | null;
  description_uk: string | null;
  description_en: string | null;
  cover_image_url: string | null;
  cover_image_path?: string | null; // якщо тримаєте шлях у колонці — використаємо для видалення
  has_cantos: boolean;
  display_order: number | null;
};

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // kebab-case
const MAX_IMAGE_MB = 5;

function generateSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidHttpsOrEmpty(url: string) {
  if (!url) return true;
  try {
    const u = new URL(url);
    return /^https:$/i.test(u.protocol);
  } catch {
    return false;
  }
}

/** Витягуємо відносний шлях у бакеті з public URL Supabase, якщо можливо */
function extractStoragePathFromPublicUrl(publicUrl: string, bucket: string) {
  try {
    // формат: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const u = new URL(publicUrl);
    const idx = u.pathname.indexOf(`/object/public/${bucket}/`);
    if (idx === -1) return null;
    return u.pathname.substring(idx + `/object/public/${bucket}/`.length);
  } catch {
    return null;
  }
}

export default function AddEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const isEdit = !!id;

  const [slug, setSlug] = useState("");
  const [titleUk, setTitleUk] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionUk, setDescriptionUk] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImagePath, setCoverImagePath] = useState<string | null>(null); // шлях у бакеті, якщо відомий
  const [hasCantos, setHasCantos] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number | "">(999);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Гейт передчасного редіректу, поки контекст auth не ініціалізувався
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [authLoading, user, isAdmin, navigate]);

  const { data: book } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("books").select("*").eq("id", id).single<BookRow>();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user && isAdmin && !authLoading,
  });

  useEffect(() => {
    if (!book) return;
    setSlug(book.slug ?? "");
    setTitleUk(book.title_uk ?? "");
    setTitleEn(book.title_en ?? "");
    setDescriptionUk(book.description_uk ?? "");
    setDescriptionEn(book.description_en ?? "");
    setCoverImageUrl(book.cover_image_url ?? "");
    setCoverImagePath(
      book.cover_image_path ?? extractStoragePathFromPublicUrl(book.cover_image_url ?? "", "page-media"),
    );
    setHasCantos(!!book.has_cantos);
    setDisplayOrder(typeof book.display_order === "number" ? book.display_order : 999);
  }, [book]);

  // Автогенерація slug з назви, якщо slug порожній або не редагувався вручну
  const autoSlug = useMemo(() => generateSlug(titleUk || ""), [titleUk]);
  useEffect(() => {
    if (!isEdit && !slug && titleUk.trim()) {
      setSlug(autoSlug);
    }
  }, [autoSlug, isEdit, slug, titleUk]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!slug || !SLUG_REGEX.test(slug)) {
        throw new Error("Slug має бути у форматі kebab-case: латиниця/цифри та дефіси, наприклад: srimad-bhagavatam");
      }
      if (!titleUk.trim()) {
        throw new Error("Заповніть обов'язкове поле: Назва (UK)");
      }
      if (!isValidHttpsOrEmpty(coverImageUrl)) {
        throw new Error("URL обкладинки має бути https:// або залиште поле порожнім.");
      }

      const bookData = {
        slug,
        title_uk: titleUk.trim(),
        title_en: titleEn.trim() || null,
        description_uk: descriptionUk.trim() || null,
        description_en: descriptionEn.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        // якщо у вас є колонка для шляху у сховищі — збережемо (і надалі зможемо коректно видаляти файл)
        cover_image_path: coverImagePath ?? extractStoragePathFromPublicUrl(coverImageUrl, "page-media"),
        has_cantos: !!hasCantos,
        display_order: typeof displayOrder === "number" ? displayOrder : 999,
      };

      if (id) {
        const { error } = await supabase.from("books").update(bookData).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("books").insert(bookData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({
        title: isEdit ? "Книгу оновлено" : "Книгу додано",
        description: "Зміни успішно збережено",
      });
      navigate("/admin/books");
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: String(error?.message || error),
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Помилка", description: "Оберіть файл зображення", variant: "destructive" });
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast({ title: "Помилка", description: `Файл не більше ${MAX_IMAGE_MB}MB`, variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const safeSlug = slug || generateSlug(titleUk) || "book";
      const fileName = `${safeSlug}-cover-${Date.now()}.${fileExt}`;
      const filePath = `book-covers/${fileName}`;

      // Якщо була стара обкладинка у бакеті — видалимо, щоб не плодити сміття
      if (coverImagePath) {
        await supabase.storage.from("page-media").remove([coverImagePath]);
      }

      const { error: uploadError } = await supabase.storage.from("page-media").upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("page-media").getPublicUrl(filePath);

      setCoverImageUrl(publicUrl);
      setCoverImagePath(filePath);

      toast({ title: "Успіх", description: "Обкладинку завантажено" });
    } catch (error: any) {
      toast({ title: "Помилка", description: String(error?.message || error), variant: "destructive" });
    } finally {
      setUploading(false);
      // очистимо інпут, щоб можна було завантажити той самий файл повторно
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    try {
      // Спочатку видалимо з бакета (якщо знаємо шлях)
      if (coverImagePath) {
        const { error } = await supabase.storage.from("page-media").remove([coverImagePath]);
        if (error) throw error;
      }
      setCoverImageUrl("");
      setCoverImagePath(null);
      toast({ title: "Обкладинка видалена" });
    } catch (error: any) {
      // Якщо з бакета видалити не вдалося — все одно приберемо з поста
      setCoverImageUrl("");
      setCoverImagePath(null);
      toast({
        title: "Обкладинку прибрано з поста",
        description: "Файл у сховищі не вдалося видалити: " + String(error?.message || error),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mutation.isPending || uploading) return;
    mutation.mutate();
  };

  if (authLoading || !user || !isAdmin) {
    return null; // або спінер
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate("/admin/books")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад до книг
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Редагувати книгу" : "Додати книгу"}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Slug & order */}
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
                {!SLUG_REGEX.test(slug || "") && slug.length > 0 && (
                  <p className="text-xs text-destructive mt-1">Використовуйте латиницю/цифри та дефіси (kebab-case).</p>
                )}
              </div>

              <div>
                <Label htmlFor="displayOrder">Порядок відображення</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDisplayOrder(v === "" ? "" : Number.isFinite(+v) ? Math.max(0, parseInt(v, 10)) : 999);
                  }}
                  placeholder="999"
                  min={0}
                />
                <p className="text-xs text-muted-foreground mt-1">Менше число = вище в списку (0–10 для топу)</p>
              </div>
            </div>

            {/* Cover */}
            <div className="space-y-4">
              <Label>Обкладинка книги</Label>

              {coverImageUrl && (
                <div className="relative w-48 h-64 bg-muted rounded-lg overflow-hidden">
                  <img src={coverImageUrl} alt="Book cover preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Завантаження..." : "Завантажити файл"}
                </Button>
                <input
                  ref={fileInputRef}
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div>
                <Label htmlFor="coverImageUrl" className="text-sm text-muted-foreground">
                  Або введіть URL вручну (https://)
                </Label>
                <Input
                  id="coverImageUrl"
                  value={coverImageUrl}
                  onChange={(e) => {
                    setCoverImageUrl(e.target.value);
                    setCoverImagePath(null); // вручну введений URL — шляху у бакеті може не бути
                  }}
                  placeholder="https://example.com/cover.jpg"
                />
                {!!coverImageUrl && !isValidHttpsOrEmpty(coverImageUrl) && (
                  <p className="text-xs text-destructive mt-1">Невірний URL. Використовуйте https://</p>
                )}
              </div>

              <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded">
                <p className="font-semibold">Технічні вимоги до обкладинок:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Формат: JPG, PNG, WEBP</li>
                  <li>Розмір: 800×1200px (співвідношення 2:3)</li>
                  <li>Розмір файлу: до {MAX_IMAGE_MB}MB</li>
                  <li>Мінімальна якість: 72 DPI</li>
                </ul>
              </div>
            </div>

            {/* Flags */}
            <div className="flex items-center space-x-2">
              <Switch id="hasCantos" checked={hasCantos} onCheckedChange={setHasCantos} />
              <Label htmlFor="hasCantos">Має структуру cantos (томи/пісні)</Label>
            </div>

            {/* Translations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Українська колонка */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Українська</h3>
                <div>
                  <Label htmlFor="titleUk">Назва *</Label>
                  <Input
                    id="titleUk"
                    value={titleUk}
                    onChange={(e) => setTitleUk(e.target.value)}
                    placeholder="Шрімад-Бгаґаватам"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionUk">Опис</Label>
                  <Textarea
                    id="descriptionUk"
                    value={descriptionUk}
                    onChange={(e) => setDescriptionUk(e.target.value)}
                    placeholder="Опис книги українською..."
                    rows={6}
                  />
                </div>
              </div>

              {/* English колонка */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">English</h3>
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
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending || uploading}>
                {mutation.isPending ? "Збереження..." : "Зберегти"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/books")}>
                Скасувати
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
