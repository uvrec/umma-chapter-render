// src/components/InlineBannerEditor.tsx
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Edit2, Upload, Save, X } from "lucide-react";

type HeroSettings = {
  background_image: string;
  logo_image: string;
  subtitle_uk: string;
  subtitle_en: string;
  quote_uk: string;
  quote_en: string;
  quote_author_uk: string;
  quote_author_en: string;
};

type InlineBannerEditorProps = {
  settings: HeroSettings;
  onUpdate: () => void;
};

export function InlineBannerEditor({ settings, onUpdate }: InlineBannerEditorProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedSettings, setEditedSettings] = useState(settings);

  const handleOpen = () => {
    setEditedSettings(settings);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings" as any)
        .update({ value: editedSettings })
        .eq("key", "home_hero");

      if (error) throw error;

      toast({
        title: "Збережено!",
        description: "Зміни застосовано",
      });
      setOpen(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error saving:", error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти",
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

        const {
          data: { publicUrl },
        } = supabase.storage.from("assets").getPublicUrl(filePath);

        setEditedSettings((prev) => ({ ...prev, [field]: publicUrl }));

        toast({
          title: "Завантажено!",
          description: "Зображення додано",
        });
      } catch (error: any) {
        console.error("Upload error:", error);
        toast({
          title: "Помилка",
          description: error.message || "Не вдалося завантажити",
          variant: "destructive",
        });
      }
    };

    input.click();
  };

  return (
    <>
      {/* Floating Edit Button - hidden on mobile */}
      <Button
        onClick={handleOpen}
        size="sm"
        className="hidden md:flex fixed top-20 right-4 z-50 shadow-lg"
        variant="secondary"
      >
        <Edit2 className="w-4 h-4 mr-2" />
        Редагувати банер
      </Button>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редагування банера головної сторінки</DialogTitle>
            <DialogDescription>
              Змініть зображення, тексти та налаштування Hero-секції
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="images">Зображення</TabsTrigger>
              <TabsTrigger value="texts">Тексти</TabsTrigger>
              <TabsTrigger value="quote">Цитата</TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="space-y-4">
              {/* Background */}
              <div className="space-y-2">
                <Label>Фонове зображення</Label>
                <div className="flex gap-2">
                  <Input
                    value={editedSettings.background_image}
                    onChange={(e) =>
                      setEditedSettings({ ...editedSettings, background_image: e.target.value })
                    }
                    placeholder="URL або завантажте..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleImageUpload("background_image")}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {editedSettings.background_image && (
                  <img
                    src={editedSettings.background_image}
                    alt="Background preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Logo */}
              <div className="space-y-2">
                <Label>Логотип</Label>
                <div className="flex gap-2">
                  <Input
                    value={editedSettings.logo_image}
                    onChange={(e) =>
                      setEditedSettings({ ...editedSettings, logo_image: e.target.value })
                    }
                    placeholder="URL або завантажте..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleImageUpload("logo_image")}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {editedSettings.logo_image && (
                  <div className="flex justify-center">
                    <img
                      src={editedSettings.logo_image}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="texts" className="space-y-4">
              <div className="space-y-2">
                <Label>Підзаголовок (Українська)</Label>
                <Input
                  value={editedSettings.subtitle_uk}
                  onChange={(e) =>
                    setEditedSettings({ ...editedSettings, subtitle_uk: e.target.value })
                  }
                  placeholder="Бібліотека ведичних аудіокниг"
                />
              </div>

              <div className="space-y-2">
                <Label>Підзаголовок (English)</Label>
                <Input
                  value={editedSettings.subtitle_en}
                  onChange={(e) =>
                    setEditedSettings({ ...editedSettings, subtitle_en: e.target.value })
                  }
                  placeholder="Library of Vedic audiobooks"
                />
              </div>
            </TabsContent>

            <TabsContent value="quote" className="space-y-4">
              <div className="space-y-2">
                <Label>Цитата (Українська)</Label>
                <Textarea
                  value={editedSettings.quote_uk}
                  onChange={(e) =>
                    setEditedSettings({ ...editedSettings, quote_uk: e.target.value })
                  }
                  rows={3}
                  placeholder="Введіть цитату..."
                />
              </div>

              <div className="space-y-2">
                <Label>Цитата (English)</Label>
                <Textarea
                  value={editedSettings.quote_en}
                  onChange={(e) =>
                    setEditedSettings({ ...editedSettings, quote_en: e.target.value })
                  }
                  rows={3}
                  placeholder="Enter quote..."
                />
              </div>

              <div className="space-y-2">
                <Label>Автор (Українська)</Label>
                <Input
                  value={editedSettings.quote_author_uk}
                  onChange={(e) =>
                    setEditedSettings({ ...editedSettings, quote_author_uk: e.target.value })
                  }
                  placeholder="Шріла Прабгупада"
                />
              </div>

              <div className="space-y-2">
                <Label>Автор (English)</Label>
                <Input
                  value={editedSettings.quote_author_en}
                  onChange={(e) =>
                    setEditedSettings({ ...editedSettings, quote_author_en: e.target.value })
                  }
                  placeholder="Srila Prabhupada"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Скасувати
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Збереження..." : "Зберегти"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
