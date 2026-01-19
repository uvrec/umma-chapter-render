import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { NewTrackDialog } from "@/components/admin/audio/NewTrackDialog";
import { getSignedAudioUrl } from "@/utils/storage/signedUrl";

export default function AudioPlaylistEdit() {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [openNew, setOpenNew] = useState(false);

  useEffect(() => { if (!user || !isAdmin) navigate("/auth"); }, [user, isAdmin, navigate]);

  const { data: playlist } = useQuery({
    queryKey: ["playlist", id],
    enabled: !!id && !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_playlists")
        .select("*, tracks:audio_tracks(* )")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  // Підставляємо підписані URL у треки перед програванням
  const [signedTracks, setSignedTracks] = useState<any[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!playlist?.tracks) return;
      const out = [];
      for (const t of playlist.tracks) {
        const src = t.audio_url ?? "";
        out.push({
          id: t.id,
          title: t.title_uk ?? t.title_en ?? "Без назви",
          duration: t.duration ? `${Math.floor(t.duration/60)}:${String(t.duration%60).padStart(2,"0")}` : "0:00",
          src
        });
      }
      if (!cancelled) setSignedTracks(out);
    })();
    return () => { cancelled = true; };
  }, [playlist?.tracks]);

  const refetchAll = () => {
    qc.invalidateQueries({ queryKey: ["playlist", id] });
  };

  if (!playlist) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/audio-playlists")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Плейліст: {playlist.title_uk || playlist.title_en}</h1>
          <div className="ml-auto">
            <Button onClick={() => setOpenNew(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Додати трек
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <div className="space-y-3">
            {playlist.tracks?.length ? (
              playlist.tracks
                .sort((a: any, b: any) => (a.track_number ?? 1e9) - (b.track_number ?? 1e9))
                .map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between border-b last:border-0 py-3">
                    <div>
                      <div className="font-medium">{t.track_number ? `${t.track_number}. ` : ""}{t.title_uk || t.title_en}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.audio_url ? "audio url" : "—"}
                        {t.duration ? ` • ${t.duration}s` : ""}
                      </div>
                    </div>
                    <Link to={`/admin/audio-tracks/${t.id}/edit`}>
                      <Button size="sm" variant="outline"><Pencil className="w-4 h-4 mr-2" /> Редагувати</Button>
                    </Link>
                  </div>
                ))
            ) : (
              <div className="text-sm text-muted-foreground">Поки немає треків</div>
            )}
          </div>
        </Card>

        {/* Тут можна показати програвач з signedTracks, якщо потрібно */}
        {/* <PlaylistPlayer tracks={signedTracks} title={playlist.title_uk} albumCover={playlist.cover_image_url}/> */}
      </main>

      <NewTrackDialog
        open={openNew}
        onOpenChange={setOpenNew}
        playlistId={id!}
        onCreated={refetchAll}
      />
    </div>
  );
}
