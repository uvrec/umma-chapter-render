import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, Image as ImageIcon, ExternalLink, Trash2 } from "lucide-react";

interface AudiobooksPageSettings {
  title_uk: string;
  title_en: string;
  subtitle_uk: string;
  subtitle_en: string;
  hero_image_url: string | null;
  description_uk: string;
  description_en: string;
}

export default function AdminAudiobooks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLocalizedPath } = useLanguage();
  const { toast } = useToast();

  const [settings, setSettings] = useState<AudiobooksPageSettings>({
    title_uk: "Аудіокниги",
    title_en: "Audiobooks",
    subtitle_uk: "Слухайте духовні твори в дорозі",
    subtitle_en: "Listen to spiritual works on the go",
    hero_image_url: null,
    description_uk: "",
    description_en: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAuth();
    loadSettings();
  }, [user]);

  const checkAuth = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (error || !data) {
      toast({
        title: "Немає доступу",
        description: "Тільки адміністратори можуть редагувати налаштування",
        variant: "destructive",
      });
      navigate(getLocalizedPath("/"));
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);

      // Завантажуємо налаштування з site_settings
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("value")
        .eq("key", "audiobooks_page")
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data?.value) {
        setSettings(data.value as AudiobooksPageSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити налаштування",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Перевіряємо чи існує запис
      const { data: existing } = await (supabase as any)
        .from("site_settings")
        .select("id")
        .eq("key", "audiobooks_page")
        .single();

      if (existing) {
        // Оновлюємо існуючий запис
        const { error } = await (supabase as any)
          .from("site_settings")
          .update({
            value: settings,
            description: "Налаштування сторінки Аудіокниги",
          })
          .eq("key", "audiobooks_page");

        if (error) throw error;
      } else {
        // Створюємо новий запис
        const { error } = await (supabase as any).from("site_settings").insert({
          key: "audiobooks_page",
          value: settings,
          description: "Налаштування сторінки Аудіокниги",
        });

        if (error) throw error;
      }

      toast({
        title: "Збережено",
        description: "Налаштування успішно оновлено",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти налаштування",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `audiobooks-hero-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("page-media").upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("page-media").getPublicUrl(filePath);

      setSettings((prev) => ({
        ...prev,
        hero_image_url: urlData.publicUrl,
      }));

      toast({
        title: "Завантажено",
        description: "Зображення успішно завантажено",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити зображення",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = () => {
    if (!confirm("Видалити зображення?")) return;
    setSettings((prev) => ({
      ...prev,
      hero_image_url: null,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Редагування сторінки Аудіокниги</h1>
        <p className="text-muted-foreground">Керуйте заголовками, описом та Hero зображенням сторінки</p>
      </div>

      <div className="space-y-6">
        {/* Hero зображення */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Hero зображення</h2>

          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative mb-4">
            {settings.hero_image_url ? (
              <img src={settings.hero_image_url} alt="Hero banner" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Label htmlFor="hero-image" className="flex-1">
              <Button variant="outline" className="w-full" disabled={uploading} asChild>
                <span>
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {settings.hero_image_url ? "Замінити" : "Завантажити"}
                </span>
              </Button>
            </Label>
            <Input
              id="hero-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />

            {settings.hero_image_url && (
              <>
                <Button variant="outline" size="icon" asChild>
                  <a href={settings.hero_image_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="destructive" size="icon" onClick={handleDeleteImage}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Заголовки */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Заголовки та підзаголовки</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title-ua">Заголовок (UK)</Label>
              <Input
                id="title-ua"
                value={settings.title_uk}
                onChange={(e) => setSettings((prev) => ({ ...prev, title_uk: e.target.value }))}
                placeholder="Аудіокниги"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title-en">Title (EN)</Label>
              <Input
                id="title-en"
                value={settings.title_en}
                onChange={(e) => setSettings((prev) => ({ ...prev, title_en: e.target.value }))}
                placeholder="Audiobooks"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle-ua">Підзаголовок (UK)</Label>
              <Input
                id="subtitle-ua"
                value={settings.subtitle_uk}
                onChange={(e) => setSettings((prev) => ({ ...prev, subtitle_uk: e.target.value }))}
                placeholder="Слухайте духовні твори в дорозі"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle-en">Subtitle (EN)</Label>
              <Input
                id="subtitle-en"
                value={settings.subtitle_en}
                onChange={(e) => setSettings((prev) => ({ ...prev, subtitle_en: e.target.value }))}
                placeholder="Listen to spiritual works on the go"
              />
            </div>
          </div>
        </Card>

        {/* Описи */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Описи (SEO)</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="desc-ua">Опис (UK)</Label>
              <Textarea
                id="desc-ua"
                value={settings.description_uk}
                onChange={(e) => setSettings((prev) => ({ ...prev, description_uk: e.target.value }))}
                placeholder="Короткий опис сторінки для пошукових систем"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc-en">Description (EN)</Label>
              <Textarea
                id="desc-en"
                value={settings.description_en}
                onChange={(e) => setSettings((prev) => ({ ...prev, description_en: e.target.value }))}
                placeholder="Short page description for search engines"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Кнопки дій */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Зберегти зміни
          </Button>
        </div>
      </div>
    </div>
  );
}
