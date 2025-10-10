import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Playlist = {
  id: string;
  title_ua: string;
  title_en: string | null;
  description_ua: string | null;
  description_en: string | null;
  category_id: string | null;
  cover_image_url: string | null;
  author: string | null;
  year: number | null;
  is_published: boolean;
  display_order: number | null;
};

type Category = {
  id: string;
  name_ua: string;
};

type Track = {
  id: string;
  playlist_id: string;
  title_ua: string;
  title_en: string | null;
  audio_url: string;
  duration: number | null; // seconds
  track_number: number;
};

function safeInt(v: string | number, fallback: number) {
  const n = typeof v === "string" ? parseInt(v, 10) : v;
  return Number.isFinite(n) ? (n as number) : fallback;
}

function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return "N/A";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function isValidAudioUrl(u: string) {
  if (!u) return false;
  // дуже проста перевірка: прямий MP3/OGG/WAV/WebM або посилання на Spotify/SoundCloud
  return (
    /\.(mp3|m4a|aac|wav|ogg|webm)(\?.*)?$/i.test(u) || /^(https?:\/\/)?(open\.spotify\.com|soundcloud\.com)\//i.test(u)
  );
}

export default function AudioPlaylistEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new";

  const [formData, setFormData] = useState({
    title_ua: "",
    title_en: "",
    description_ua: "",
    description_en: "",
    category_id: "",
    cover_image_url: "",
    author: "",
    year: new Date().getFullYear(),
    is_published: false,
    display_order: 0,
  });

  const [trackDialog, setTrackDialog] = useState(false);
  const [trackForm, setTrackForm] = useState({
    title_ua: "",
    title_en: "",
    audio_url: "",
    duration: 0,
    track_number: 1,
  });

  // Категорії
  const { data: categories } = useQuery({
    queryKey: ["audio-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("audio_categories").select("*").order("display_order");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

  // Плейліст (edit)
  const { data: playlist } = useQuery({
    queryKey: ["audio-playlist", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase.from("audio_playlists").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Playlist;
    },
    enabled: !isNew,
  });

  // Треки
  const { data: tracks } = useQuery({
    queryKey: ["audio-tracks", id],
    queryFn: async () => {
      if (isNew) return [];
      const { data, error } = await supabase
        .from("audio_tracks")
        .select("*")
        .eq("playlist_id", id)
        .order("track_number");
      if (error) throw error;
      return (data ?? []) as Track[];
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (playlist) {
      setFormData({
        title_ua: playlist.title_ua || "",
        title_en: playlist.title_en || "",
        description_ua: playlist.description_ua || "",
        description_en: playlist.description_en || "",
        category_id: playlist.category_id || "",
        cover_image_url: playlist.cover_image_url || "",
        author: playlist.author || "",
        year: playlist.year ?? new Date().getFullYear(),
        is_published: !!playlist.is_published,
        display_order: playlist.display_order ?? 0,
      });
    }
  }, [playlist]);

  // Коли відкриваємо діалог нового треку — підставляємо наступний номер
  useEffect(() => {
    if (trackDialog) {
      setTrackForm((prev) => ({
        ...prev,
        track_number: (tracks?.length ?? 0) + 1,
      }));
    }
  }, [trackDialog, tracks]);

  // Збереження плейліста
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        year: safeInt(data.year, new Date().getFullYear()),
        display_order: safeInt(data.display_order, 0),
        title_en: data.title_en || null,
        description_ua: data.description_ua || null,
        description_en: data.description_en || null,
        category_id: data.category_id || null,
        cover_image_url: data.cover_image_url || null,
        author: data.author || null,
      };

      if (isNew) {
        const { data: newPlaylist, error } = await supabase.from("audio_playlists").insert([payload]).select().single();
        if (error) throw error;
        return newPlaylist as Playlist;
      } else {
        const { error } = await supabase.from("audio_playlists").update(payload).eq("id", id);
        if (error) throw error;
        return null;
      }
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["audio-playlists"] });
      if (!isNew) queryClient.invalidateQueries({ queryKey: ["audio-playlist", id] });
      toast.success(isNew ? "Плейліст створено" : "Плейліст оновлено");

      if (isNew && created) {
        navigate(`/admin/audio-playlists/${created.id}`);
      }
    },
    onError: (error: any) => {
      toast.error("Помилка: " + error.message);
    },
  });

  // Додавання треку
  const saveTrackMutation = useMutation({
    mutationFn: async (trackData: typeof trackForm) => {
      if (!id) throw new Error("Немає playlist_id");
      if (!trackData.title_ua.trim()) throw new Error("Вкажіть назву треку");
      if (!isValidAudioUrl(trackData.audio_url.trim())) {
        throw new Error("Невалідний URL аудіо (підтримка: прямий MP3/OGG/WAV/WebM або Spotify/SoundCloud)");
      }

      const payload = {
        playlist_id: id,
        title_ua: trackData.title_ua.trim(),
        title_en: trackData.title_en?.trim() || null,
        audio_url: trackData.audio_url.trim(),
        duration: safeInt(trackData.duration, 0) || null,
        track_number: safeInt(trackData.track_number, (tracks?.length ?? 0) + 1),
      };

      const { error } = await supabase.from("audio_tracks").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio-tracks", id] });
      toast.success("Трек додано");
      setTrackDialog(false);
      setTrackForm({
        title_ua: "",
        title_en: "",
        audio_url: "",
        duration: 0,
        track_number: (tracks?.length ?? 0) + 1,
      });
    },
    onError: (error: any) => {
      toast.error("Помилка: " + error.message);
    },
  });

  // Видалення треку
  const deleteTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      const { error } = await supabase.from("audio_tracks").delete().eq("id", trackId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio-tracks", id] });
      toast.success("Трек видалено");
    },
    onError: (error: any) => {
      toast.error("Помилка: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_ua.trim()) {
      toast.error("Вкажіть назву плейліста (UA)");
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTrackMutation.mutate(trackForm);
  };

  const tracksCount = tracks?.length ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/admin/audio-playlists">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до плейлістів
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Playlist Info */}
        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "Новий плейліст" : "Редагувати плейліст"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category_id">Категорія</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть категорію" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_ua">Назва (UA) *</Label>
                  <Input
                    id="title_ua"
                    value={formData.title_ua}
                    onChange={(e) => setFormData({ ...formData, title_ua: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">Назва (EN)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description_ua">Опис (UA)</Label>
                <Textarea
                  id="description_ua"
                  value={formData.description_ua}
                  onChange={(e) => setFormData({ ...formData, description_ua: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="cover_image_url">Обкладинка (URL)</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Автор</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Рік</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: safeInt(e.target.value, new Date().getFullYear()) })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Опубліковано</Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? "Збереження..." : "Зберегти"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tracks */}
        {!isNew && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Треки ({tracksCount})</CardTitle>
                <Dialog open={trackDialog} onOpenChange={setTrackDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setTrackDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Додати трек
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новий трек</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTrackSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="track_title_ua">Назва треку (UA) *</Label>
                        <Input
                          id="track_title_ua"
                          value={trackForm.title_ua}
                          onChange={(e) => setTrackForm({ ...trackForm, title_ua: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="audio_url">Посилання на аудіо *</Label>
                        <Input
                          id="audio_url"
                          value={trackForm.audio_url}
                          onChange={(e) => setTrackForm({ ...trackForm, audio_url: e.target.value })}
                          placeholder="https://... або Spotify/SoundCloud URL"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Підтримується: прямий MP3/OGG/WAV/WebM, Spotify, SoundCloud
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Тривалість (сек)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={trackForm.duration}
                            onChange={(e) => setTrackForm({ ...trackForm, duration: safeInt(e.target.value, 0) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="track_number">Номер треку</Label>
                          <Input
                            id="track_number"
                            type="number"
                            value={trackForm.track_number}
                            onChange={(e) =>
                              setTrackForm({
                                ...trackForm,
                                track_number: safeInt(e.target.value, (tracks?.length ?? 0) + 1),
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={saveTrackMutation.isPending}>
                        {saveTrackMutation.isPending ? "Додаємо…" : "Додати"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {tracks && tracks.length > 0 ? (
                <div className="space-y-2">
                  {tracks.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-default" />
                        <div>
                          <p className="font-medium">
                            {track.track_number}. {track.title_ua}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Видалити цей трек?")) {
                            deleteTrackMutation.mutate(track.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Немає треків. Додайте перший трек.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
