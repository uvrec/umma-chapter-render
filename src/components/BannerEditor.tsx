import { useState, useRef } from "react";
import { Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const MAX_IMAGE_MB = 10;

interface BannerEditorProps {
  pageId?: string; // ID сторінки з таблиці pages
  pageSlug: string; // slug для генерації імені файлу
  currentBannerUrl: string | null;
  tableName?: string; // 'pages' за замовчуванням
  queryKey?: string[]; // для invalidate
  isOpen: boolean;
  onClose: () => void;
  onSave?: (newUrl: string) => void; // callback для оновлення стану в батьківському компоненті
  title?: string;
}

export const BannerEditor = ({
  pageId,
  pageSlug,
  currentBannerUrl,
  tableName = 'pages',
  queryKey = ['pages'],
  isOpen,
  onClose,
  onSave,
  title = "Редагувати банер",
}: BannerEditorProps) => {
  const [bannerUrl, setBannerUrl] = useState(currentBannerUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const isValidHttpsOrEmpty = (url: string) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return /^https:$/i.test(u.protocol);
    } catch {
      return false;
    }
  };

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
      const fileName = `${pageSlug}-banner-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("page-media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("page-media").getPublicUrl(filePath);

      setBannerUrl(publicUrl);
      toast({ title: "Успіх", description: "Банер завантажено" });
    } catch (error: any) {
      toast({ title: "Помилка", description: String(error?.message || error), variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setBannerUrl("");
    toast({ title: "Банер видалено" });
  };

  const handleSave = async () => {
    if (uploading) return;

    if (bannerUrl && !isValidHttpsOrEmpty(bannerUrl)) {
      toast({ title: "Помилка", description: "Невірний URL. Використовуйте https://", variant: "destructive" });
      return;
    }

    try {
      // Якщо є pageId, оновлюємо в базі даних
      if (pageId) {
        const { error } = await supabase
          .from(tableName as any)
          .update({
            banner_image_url: bannerUrl.trim() || null,
          })
          .eq("id", pageId);

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey });
      }

      // Викликаємо callback якщо є
      if (onSave) {
        onSave(bannerUrl.trim());
      }

      toast({ title: "Успіх", description: "Банер оновлено" });
      onClose();
    } catch (error: any) {
      toast({ title: "Помилка", description: String(error?.message || error), variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Поточний банер */}
          {bannerUrl && (
            <div className="relative w-full aspect-[3/1] max-w-full mx-auto">
              <img 
                src={bannerUrl} 
                alt="Банер" 
                className="w-full h-full object-cover rounded shadow-md" 
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {!bannerUrl && (
            <div className="w-full aspect-[3/1] bg-muted rounded flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Банер відсутній</p>
              </div>
            </div>
          )}

          {/* Завантаження файлу */}
          <div>
            <Label htmlFor="banner-upload">Завантажити новий банер</Label>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Завантаження..." : "Завантажити файл"}
            </Button>
            <input
              ref={fileInputRef}
              id="banner-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Або URL */}
          <div>
            <Label htmlFor="bannerUrl" className="text-sm text-muted-foreground">
              Або введіть URL вручну (https://)
            </Label>
            <Input
              id="bannerUrl"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://example.com/banner.jpg"
              className="mt-2"
            />
            {!!bannerUrl && !isValidHttpsOrEmpty(bannerUrl) && (
              <p className="text-xs text-destructive mt-1">Невірний URL. Використовуйте https://</p>
            )}
          </div>

          {/* Технічні вимоги */}
          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded">
            <p className="font-semibold">Технічні вимоги до банерів:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Формат: JPG, PNG, WEBP</li>
              <li>Оптимальний розмір: 1920×640px (співвідношення 3:1)</li>
              <li>Розмір файлу: до {MAX_IMAGE_MB}MB</li>
              <li>Мінімальна якість: 72 DPI</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={uploading}>
            <Check className="mr-2 h-4 w-4" />
            Зберегти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
