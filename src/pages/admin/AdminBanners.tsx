import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2, Image as ImageIcon, ExternalLink } from "lucide-react";

interface BannerSetting {
  key: string;
  value: {
    url: string | null;
    enabled: boolean;
  };
  description: string;
}

const BANNER_CONFIGS = [
  {
    key: "home_hero_banner",
    title: "Головна сторінка - Hero баннер",
    description: "Фоновий баннер Hero секції на головній",
  },
  {
    key: "audiobooks_hero_banner",
    title: "Аудіокниги - Hero баннер",
    description: "Фоновий баннер на сторінці аудіокниг",
  },
  {
    key: "reader_hero_banner",
    title: "Читалка - Hero баннер",
    description: "Фоновий баннер в читалці Веда",
  },
  {
    key: "blog_hero_banner",
    title: "Блог - Hero баннер",
    description: "Фоновий баннер на сторінці блогу",
  },
];

export default function AdminBanners() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLocalizedPath } = useLanguage();
  const { toast } = useToast();

  const [banners, setBanners] = useState<Record<string, BannerSetting>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkAuth = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (error || !data) {
      toast({
        title: "Немає доступу",
        description: "Тільки адміністратори можуть керувати баннерами",
        variant: "destructive",
      });
      navigate(getLocalizedPath("/"));
    }
  };

  const loadBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("*")
        .in(
          "key",
          BANNER_CONFIGS.map((b) => b.key),
        );

      if (error) throw error;

      const bannersMap: Record<string, BannerSetting> = {};
      data?.forEach((setting: any) => {
        bannersMap[setting.key] = {
          key: setting.key,
          value: setting.value as { url: string | null; enabled: boolean },
          description: setting.description || "",
        };
      });

      setBanners(bannersMap);
    } catch (error) {
      console.error("Error loading banners:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити баннери",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (key: string, file: File) => {
    try {
      setUploading(key);

      const fileExt = file.name.split(".").pop();
      const fileName = `${key}-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("page-media").upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("page-media").getPublicUrl(filePath);

      const newValue = {
        url: urlData.publicUrl,
        enabled: banners[key]?.value?.enabled ?? true,
      };

      const { error: updateError } = await (supabase as any).from("site_settings").update({ value: newValue }).eq("key", key);

      if (updateError) throw updateError;

      setBanners((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: newValue,
        },
      }));

      toast({
        title: "Успіх",
        description: "Баннер завантажено",
      });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити баннер",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleToggle = async (key: string, enabled: boolean) => {
    try {
      const newValue = {
        ...banners[key].value,
        enabled,
      };

      const { error } = await (supabase as any).from("site_settings").update({ value: newValue }).eq("key", key);

      if (error) throw error;

      setBanners((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: newValue,
        },
      }));

      toast({
        title: "Збережено",
        description: enabled ? "Баннер увімкнено" : "Баннер вимкнено",
      });
    } catch (error) {
      console.error("Error toggling banner:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося оновити статус",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Видалити цей баннер?")) return;

    try {
      const newValue = {
        url: null,
        enabled: false,
      };

      const { error } = await (supabase as any).from("site_settings").update({ value: newValue }).eq("key", key);

      if (error) throw error;

      setBanners((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: newValue,
        },
      }));

      toast({
        title: "Видалено",
        description: "Баннер видалено",
      });
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося видалити баннер",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Управління баннерами</h1>
        <p className="text-muted-foreground">Завантажуйте та керуйте Hero баннерами для різних сторінок сайту</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {BANNER_CONFIGS.map((config) => {
          const banner = banners[config.key];
          const hasImage = banner?.value?.url;
          const isEnabled = banner?.value?.enabled ?? false;

          return (
            <Card key={config.key} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{config.title}</h3>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>

                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  {hasImage ? (
                    <img src={banner.value.url!} alt={config.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`toggle-${config.key}`} className="cursor-pointer">
                      Показувати баннер
                    </Label>
                    <Switch
                      id={`toggle-${config.key}`}
                      checked={isEnabled}
                      onCheckedChange={(checked) => handleToggle(config.key, checked)}
                      disabled={!hasImage}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Label htmlFor={`file-${config.key}`} className="flex-1">
                      <Button variant="outline" className="w-full" disabled={uploading === config.key} asChild>
                        <span>
                          {uploading === config.key ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          {hasImage ? "Замінити" : "Завантажити"}
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id={`file-${config.key}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(config.key, file);
                      }}
                    />

                    {hasImage && (
                      <>
                        <Button variant="outline" size="icon" asChild>
                          <a href={banner.value.url!} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(config.key)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
          Повернутися до адмін-панелі
        </Button>
      </div>
    </div>
  );
}
