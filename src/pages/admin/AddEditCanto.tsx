import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddEditCanto = () => {
  const { bookId, id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [cantoNumber, setCantoNumber] = useState<string>("");
  const [titleUa, setTitleUa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionUa, setDescriptionUa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // guard
  useEffect(() => {
    if (!user || !isAdmin) navigate("/auth");
  }, [user, isAdmin, navigate]);

  // fetch existing
  const { data: canto } = useQuery({
    queryKey: ["admin-canto", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("cantos").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user && isAdmin,
  });

  useEffect(() => {
    if (!canto) return;
    setCantoNumber(String(canto.canto_number ?? ""));
    setTitleUa(canto.title_ua ?? "");
    setTitleEn(canto.title_en ?? "");
    setDescriptionUa(canto.description_ua ?? "");
    setDescriptionEn(canto.description_en ?? "");
    setCoverImageUrl(canto.cover_image_url ?? "");
  }, [canto]);

  // save
  const mutation = useMutation({
    mutationFn: async () => {
      // валідація мінімальних вимог
      const num = Number.parseInt(cantoNumber, 10);
      if (!Number.isInteger(num) || num <= 0) {
        throw new Error("Номер пісні має бути додатнім цілим числом.");
      }
      const _titleUa = titleUa.trim();
      const _titleEn = titleEn.trim();
      if (!_titleUa || !_titleEn) {
        throw new Error("Заповніть обов'язкові поля: Назва (UA) та Title (EN).");
      }

      const payload = {
        canto_number: num,
        title_ua: _titleUa,
        title_en: _titleEn,
        description_ua: descriptionUa.trim() || null,
        description_en: descriptionEn.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
      };

      if (id) {
        const { error } = await supabase.from("cantos").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        // bookId має бути валідним UUID або числом — залежно від вашої схеми.
        // Якщо у вас UUID — просто передаємо як є; якщо numeric — перетворіть нижче.
        const base = { ...payload, book_id: bookId };
        const { error } = await supabase.from("cantos").insert([base]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // оновлюємо списки/деталі
      queryClient.invalidateQueries({ queryKey: ["admin-cantos"] });
      if (id) queryClient.invalidateQueries({ queryKey: ["admin-canto", id] });

      toast({ title: id ? "Canto оновлено" : "Canto створено" });
      navigate(`/admin/cantos/${bookId}`);
    },
    onError: (error: any) => {
      toast({ title: "Помилка", description: error?.message ?? String(error), variant: "destructive" });
    },
  });

  // upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = ""; // дозволити повторний вибір того ж файлу
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Помилка", description: "Оберіть файл зображення", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Помилка", description: "Розмір файлу до 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const safeBase = `${id || bookId || "canto"}-${cantoNumber || Date.now()}`.replace(/[^a-zA-Z0-9-_]/g, "");
      const path = `canto-covers/${safeBase}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("page-media").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("page-media").getPublicUrl(path);

      setCoverImageUrl(publicUrl);
      toast({ title: "Успіх", description: "Обкладинку завантажено" });
    } catch (err: any) {
      toast({ title: "Помилка", description: err?.message ?? String(err), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/admin/cantos/${bookId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{id ? "Редагувати Canto" : "Додати Canto"}</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{id ? "Редагувати Canto" : "Новий Canto"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cantoNumber">Номер Canto *</Label>
                <Input
                  id="cantoNumber"
                  type="number"
                  min={1}
                  step={1}
                  value={cantoNumber}
                  onChange={(e) => setCantoNumber(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="1"
                  required
                />
              </div>

              {/* Cover image */}
              <div className="space-y-4">
                <Label>Обкладинка пісні</Label>

                {coverImageUrl && (
                  <div className="relative w-48 h-64 bg-muted rounded-lg overflow-hidden">
                    <img src={coverImageUrl} alt="Canto cover preview" className="w-full h-full object-cover" />
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
                    id="canto-cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                <div>
                  <Label htmlFor="coverImageUrl" className="text-sm text-muted-foreground">
                    Або введіть URL вручну
                  </Label>
                  <Input
                    id="coverImageUrl"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://.../cover.jpg"
                  />
                </div>
              </div>

              <Tabs defaultValue="ua" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ua">Українська</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <TabsContent value="ua" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleUa">Назва (UA) *</Label>
                    <Input
                      id="titleUa"
                      value={titleUa}
                      onChange={(e) => setTitleUa(e.target.value)}
                      placeholder="Перша пісня"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionUa">Опис (UA)</Label>
                    <Textarea
                      id="descriptionUa"
                      value={descriptionUa}
                      onChange={(e) => setDescriptionUa(e.target.value)}
                      placeholder="Опис canto українською"
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">Title (EN) *</Label>
                    <Input
                      id="titleEn"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="First Canto"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">Description (EN)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Canto description in English"
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Збереження..." : "Зберегти"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/admin/cantos/${bookId}`)}>
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddEditCanto;
