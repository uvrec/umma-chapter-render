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

export default function SiteBannersAdmin() {
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
    if (!user || !isAdmin) navigate("/auth");
    else loadSettings();
  }, [user, isAdmin, navigate]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "home_hero").single();
      if (error) throw error;
      if (data?.value) setSettings(data.value as HeroSettings);
    } catch (err) {
      toast({ title: "Помилка", description: "Не вдалося завантажити налаштування", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").update({ value: settings }).eq("key", "home_hero");
      if (error) throw error;
      toast({ title: "Успішно", description: "Налаштування збережено" });
    } catch (err: any) {
      toast({ title: "Помилка", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (field: keyof HeroSettings) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `banners/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("assets").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("assets").getPublicUrl(filePath);
        setSettings((prev) => ({ ...prev, [field]: data.publicUrl }));
      } catch (err) {
        toast({ title: "Помилка", description: "Не вдалося завантажити зображення", variant: "destructive" });
      }
    };
    input.click();
  };

  if (!user || !isAdmin) return null;
  if (loading) return <div className="p-8">Завантаження…</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Фонове зображення Hero</CardTitle>
            <CardDescription>1920x1080px або більше</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                value={settings.background_image}
                onChange={(e) => setSettings({ ...settings, background_image: e.target.value })}
                placeholder="URL зображення"
              />
              <Button variant="outline" onClick={() => handleImageUpload("background_image")}>
                <Upload className="w-4 h-4 mr-2" />
                Завантажити
              </Button>
            </div>
            {settings.background_image && (
              <img src={settings.background_image} alt="bg" className="w-full h-64 object-cover rounded-lg" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Логотип</CardTitle>
            <CardDescription>512x512px або більше</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                value={settings.logo_image}
                onChange={(e) => setSettings({ ...settings, logo_image: e.target.value })}
                placeholder="URL логотипу"
              />
              <Button variant="outline" onClick={() => handleImageUpload("logo_image")}>
                <Upload className="w-4 h-4 mr-2" />
                Завантажити
              </Button>
            </div>
            {settings.logo_image && (
              <div className="flex justify-center">
                <img src={settings.logo_image} alt="logo" className="w-48 h-48 object-contain" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
