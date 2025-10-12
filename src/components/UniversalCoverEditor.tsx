import { useState, useRef } from "react";
import { Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const MAX_IMAGE_MB = 5;

interface UniversalCoverEditorProps {
  // Основні параметри
  itemId: string;
  itemSlug: string; // для генерації імені файлу
  currentCoverUrl: string | null;
  currentCoverPath: string | null;
  
  // Налаштування таблиці
  tableName: string; // 'books', 'audio_playlists', etc.
  queryKey: string[]; // для invalidate, наприклад: ['library-books']
  
  // Налаштування Storage
  storageBucket?: string; // за замовчуванням 'page-media'
  storageFolder?: string; // за замовчуванням 'book-covers' або 'audio-covers'
  
  // UI
  isOpen: boolean;
  onClose: () => void;
  title?: string; // заголовок діалогу
}

export const UniversalCoverEditor = ({
  itemId,
  itemSlug,
  currentCoverUrl,
  currentCoverPath,
  tableName,
  queryKey,
  storageBucket = 'page-media',
  storageFolder,
  isOpen,
  onClose,
  title = "Редагувати обкладинку",
}: UniversalCoverEditorProps) => {
  const [coverImageUrl, setCoverImageUrl] = useState(currentCoverUrl || "");
  const [coverImagePath, setCoverImagePath] = useState<string | null>(currentCoverPath || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Визначаємо папку автоматично якщо не вказано
  const folder = storageFolder || (tableName === 'books' ? 'book-covers' : 
                                    tableName === 'audio_playlists' ? 'audio-covers' : 
                                    'covers');

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
      const fileName = `${itemSlug}-cover-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Видалити стару обкладинку
      if (coverImagePath) {
        await supabase.storage.from(storageBucket).remove([coverImagePath]);
      }

      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(storageBucket).getPublicUrl(filePath);

      setCoverImageUrl(publicUrl);
      setCoverImagePath(filePath);

      toast({ title: "Успіх", description: "Обкладинку завантажено" });
    } catch (error: any) {
      toast({ title: "Помилка", description: String(error?.message || error), variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (coverImagePath) {
        const { error } = await supabase.storage.from(storageBucket).remove([coverImagePath]);
        if (error) throw error;
      }
      setCoverImageUrl("");
      setCoverImagePath(null);
      toast({ title: "Обкладинка видалена" });
    } catch (error: any) {
      setCoverImageUrl("");
      setCoverImagePath(null);
      toast({
        title: "Обкладинку прибрано",
        description: "Файл у сховищі не вдалось видалити: " + String(error?.message || error),
      });
    }
  };

  const handleSave = async () => {
    if (uploading) return;

    if (coverImageUrl && !isValidHttpsOrEmpty(coverImageUrl)) {
      toast({ title: "Помилка", description: "Невірний URL. Використовуйте https://", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from(tableName as any)
        .update({
          cover_image_url: coverImageUrl.trim() || null,
        })
        .eq("id", itemId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Успіх", description: "Обкладинку оновлено" });
      onClose();
    } catch (error: any) {
      toast({ title: "Помилка", description: String(error?.message || error), variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Поточна обкладинка */}
          {coverImageUrl && (
            <div className="relative w-full aspect-[2/3] max-w-[200px] mx-auto">
              <img src={coverImageUrl} alt="Обкладинка" className="w-full h-full object-cover rounded shadow-md" />
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

          {/* Завантаження файлу */}
          <div>
            <Label htmlFor="cover-upload">Завантажити нову обкладинку</Label>
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
              id="cover-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Або URL */}
          <div>
            <Label htmlFor="coverImageUrl" className="text-sm text-muted-foreground">
              Або введіть URL вручну (https://)
            </Label>
            <Input
              id="coverImageUrl"
              value={coverImageUrl}
              onChange={(e) => {
                setCoverImageUrl(e.target.value);
                setCoverImagePath(null);
              }}
              placeholder="https://example.com/cover.jpg"
              className="mt-2"
            />
            {!!coverImageUrl && !isValidHttpsOrEmpty(coverImageUrl) && (
              <p className="text-xs text-destructive mt-1">Невірний URL. Використовуйте https://</p>
            )}
          </div>

          {/* Технічні вимоги */}
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
