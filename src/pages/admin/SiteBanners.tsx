// src/pages/admin/SiteBanners.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, Eye } from "lucide-react";
import { Link } from "react-router-dom";

type HeroSettings = {
  background_image: string;
  logo_image: string;
  subtitle_ua: string;
  subtitle_en: string;
  quote_ua: string;
  quote_en: string;
  quote_author_ua: string;
  quote_author_en: string;
};

export default function SiteBanners() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<HeroSettings>({
    background_image: "",
    logo_image: "",
    subtitle_ua: "",
    subtitle_en: "",
    quote_ua: "",
    quote_en: "",
    quote_author_ua: "",
    quote_author_en: "",
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    } else {
      loadSettings();
    }
  }, [user, isAdmin, navigate]);

  const loadSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("value")
        .eq("key", "home_hero")
        .single();

      if (error) throw error;

      if (data?.value) {
        setSettings(data.value as HeroSettings);
      }
    } catch (error: any) {
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
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("site_settings")
        .update({ value: settings })
        .eq("key", "home_hero");

      if (error) throw error;

      toast({
        title: "Успішно!",
        description: "Налаштування збережено",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти налаштування",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (field: "background_image" | "logo_image") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("assets")
          .getPublicUrl(filePath);

        setSettings((prev) => ({ ...prev, [field]: publicUrl }));

        toast({
          title: "Успішно!",
          description: "Зображення завантажено",
        });
      } catch (error: any) {
        console.error("Error uploading image:", error);
        toast({
          title: "Помилка",
          description: error.message || "Не вдалося завантажити зображення",
          variant: "destructive",
        });
      }
    };

    input.click();
  };

  if (!user || !isAdmin) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Банери та зображення</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/" target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  Переглянути
                </Link>
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Збереження..." : "Зберегти"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Фонове зображення */}
          <Card>
            <CardHeader>
              <CardTitle>Фонове зображення Hero-секції</CardTitle>
              <CardDescription>
                Рекомендований розмір: 1920x1080px або більше
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>URL зображення</Label>
                <div className="flex gap-2">
                  <Input
                    value={settings.background_image}
                    onChange={(e) =>
                      setSettings({ ...settings, background_image: e.target.value })
                    }
                    placeholder="/lovable-uploads/..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleImageUpload("background_image")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Завантажити
                  </Button>
                </div>
              </div>
              {settings.background_image && (
                <div className="mt-4">
                  <img
                    src={settings.background_image}
                    alt="Background preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Логотип */}
          <Card>
            <CardHeader>
              <CardTitle>Логотип</CardTitle>
              <CardDescription>
                Рекомендований розмір: 512x512px або більше (квадратне зображення)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>URL логотипу</Label>
                <div className="flex gap-2">
                  <Input
                    value={settings.logo_image}
                    onChange={(e) =>
                      setSettings({ ...settings, logo_image: e.target.value })
                    }
                    placeholder="/lovable-uploads/..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleImageUpload("logo_image")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Завантажити
                  </Button>
                </div>
              </div>
              {settings.logo_image && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={settings.logo_image}
                    alt="Logo preview"
                    className="w-64 h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Підзаголовок */}
          <Card>
            <CardHeader>
              <CardTitle>Підзаголовок</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Українською</Label>
                <Input
                  value={settings.subtitle_ua}
                  onChange={(e) =>
                    setSettings({ ...settings, subtitle_ua: e.target.value })
                  }
                  placeholder="Бібліотека ведичних аудіокниг"
                />
              </div>
              <div>
                <Label>Англійською</Label>
                <Input
                  value={settings.subtitle_en}
                  onChange={(e) =>
                    setSettings({ ...settings, subtitle_en: e.target.value })
                  }
                  placeholder="Library of Vedic audiobooks"
                />
              </div>
            </CardContent>
          </Card>

          {/* Цитата */}
          <Card>
            <CardHeader>
              <CardTitle>Цитата</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Цитата українською</Label>
                <Textarea
                  value={settings.quote_ua}
                  onChange={(e) =>
                    setSettings({ ...settings, quote_ua: e.target.value })
                  }
                  rows={4}
                  placeholder="За моєї відсутності читайте книжки..."
                />
              </div>
              <div>
                <Label>Цитата англійською</Label>
                <Textarea
                  value={settings.quote_en}
                  onChange={(e) =>
                    setSettings({ ...settings, quote_en: e.target.value })
                  }
                  rows={4}
                  placeholder="In my absence, read the books..."
                />
              </div>
              <div>
                <Label>Автор українською</Label>
                <Input
                  value={settings.quote_author_ua}
                  onChange={(e) =>
                    setSettings({ ...settings, quote_author_ua: e.target.value })
                  }
                  placeholder="Шріла Прабгупада"
                />
              </div>
              <div>
                <Label>Автор англійською</Label>
                <Input
                  value={settings.quote_author_en}
                  onChange={(e) =>
                    setSettings({ ...settings, quote_author_en: e.target.value })
                  }
                  placeholder="Srila Prabhupada"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
