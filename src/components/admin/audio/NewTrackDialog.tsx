import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { toSafeFilename } from "@/utils/storage/signedUrl";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  playlistId: string;
  onCreated?: () => void; // refetch tracks
};

export function NewTrackDialog({ open, onOpenChange, playlistId, onCreated }: Props) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [titleUa, setTitleUa] = useState("");
  const [trackNo, setTrackNo] = useState<number | undefined>(undefined);
  const [durationSec, setDurationSec] = useState<number | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // зчитати тривалість локального файлу (необов'язково, але зручно)
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      if (!isNaN(audio.duration)) {
        setDurationSec(Math.round(audio.duration));
      }
      URL.revokeObjectURL(url);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.name]);

  const reset = () => {
    setTitleUa("");
    setTrackNo(undefined);
    setDurationSec(undefined);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async () => {
    if (!file) {
      toast({ title: "Помилка", description: "Оберіть аудіофайл", variant: "destructive" });
      return;
    }
    if (!titleUa.trim()) {
      toast({ title: "Помилка", description: "Вкажіть назву треку (UA)", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      // 1) завантаження у storage
      const safeName = toSafeFilename(file.name || titleUa) || "track.mp3";
      const path = `playlists/${playlistId}/${safeName}`;

      const { error: upErr } = await supabase
        .storage
        .from("audio")
        .upload(path, file, {
          // якщо хочете перезаписувати — спочатку зробіть remove або використайте upsert через API storage v2
          cacheControl: "3600",
          upsert: false,
        });

      if (upErr) throw upErr;

      // 2) створення запису у audio_tracks
      const { error: insErr } = await supabase
        .from("audio_tracks")
        .insert({
          playlist_id: playlistId,
          title_ua: titleUa,
          track_number: trackNo ?? null,
          duration: durationSec ?? null,
          storage_path: path,   // <— ключове поле
          audio_url: null,      // signed URL НЕ зберігаємо
          is_published: true,
        });

      if (insErr) throw insErr;

      toast({ title: "Готово", description: "Трек завантажено і додано" });
      onOpenChange(false);
      reset();
      onCreated?.();
    } catch (e: any) {
      toast({ title: "Помилка додавання треку", description: e?.message ?? "Невідомо", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Новий трек</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="titleUa">Назва треку (UA)</Label>
            <Input id="titleUa" value={titleUa} onChange={(e) => setTitleUa(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="trackNo">Номер треку</Label>
              <Input
                id="trackNo"
                type="number"
                value={trackNo ?? ""}
                onChange={(e) => setTrackNo(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="1"
              />
            </div>
            <div>
              <Label htmlFor="dur">Тривалість (сек)</Label>
              <Input
                id="dur"
                type="number"
                value={durationSec ?? ""}
                onChange={(e) => setDurationSec(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="автовизначення"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="file">Аудіофайл (mp3, m4a, wav…)</Label>
            <Input
              id="file"
              type="file"
              accept="audio/*"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Файл буде збережений у бакеті <code>audio</code> за шляхом
              <code> playlists/{playlistId}/…</code>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Скасувати
          </Button>
          <Button onClick={onSubmit} disabled={isSaving}>
            {isSaving ? "Завантаження…" : "Додати"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
