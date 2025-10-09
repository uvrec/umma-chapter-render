import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, BookOpen, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type ContinueItem = {
  id: string;
  type: "audio" | "text";
  title: string;
  subtitle?: string;
  href: string;
  progress: number; // 0-100
  timestamp?: string;
  duration?: number;
};

export const ContinueListening = () => {
  const { user } = useAuth();

  // Fetch user's listening progress
  const { data: audioProgress, isLoading: audioLoading } = useQuery({
    queryKey: ["continue-listening", user?.id],
    enabled: !!user,
    staleTime: 30_000,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("audio_events")
        .select(
          `
          track_id,
          position_ms,
          duration_ms,
          created_at,
          audio_tracks!inner (
            id,
            title_ua,
            audio_url,
            duration,
            audio_playlists (
              title_ua,
              slug,
              audio_categories (
                slug
              )
            )
          )
        `,
        )
        .eq("user_id", user.id)
        .eq("event_type", "pause")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data || [];
    },
  });

  // Get last read chapter/verse from localStorage (since we don't have reading progress in DB yet)
  const getLastReadItem = (): ContinueItem | null => {
    const lastRead = localStorage.getItem("vv_last_read");
    if (!lastRead) return null;

    try {
      const parsed = JSON.parse(lastRead);
      return {
        id: parsed.id || "unknown",
        type: "text",
        title: parsed.title || "Останнє читання",
        subtitle: parsed.subtitle,
        href: parsed.href || "/library",
        progress: 0,
        timestamp: parsed.timestamp,
      };
    } catch {
      return null;
    }
  };

  const continueItems: ContinueItem[] = [];

  // Add audio progress
  if (audioProgress && audioProgress.length > 0) {
    const item = audioProgress[0];
    const track = (item as any).audio_tracks;
    const catSlug = track?.audio_playlists?.audio_categories?.slug;
    const playlistSlug = track?.audio_playlists?.slug;

    const progress = item.duration_ms ? Math.round((item.position_ms / item.duration_ms) * 100) : 0;

    continueItems.push({
      id: item.track_id,
      type: "audio",
      title: track?.title_ua || "Аудіо трек",
      subtitle: track?.audio_playlists?.title_ua,
      href: catSlug && playlistSlug ? `/audiobooks/${catSlug}/${playlistSlug}` : `/audiobooks`,
      progress,
      timestamp: new Date(item.created_at).toLocaleString("uk-UA", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: item.duration_ms ? Math.round(item.duration_ms / 1000) : undefined,
    });
  }

  // Add reading progress
  const lastRead = getLastReadItem();
  if (lastRead) {
    continueItems.push(lastRead);
  }

  // Don't show section if no items
  if (continueItems.length === 0 && !audioLoading) {
    return null;
  }

  const formatTime = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h2 className="mb-4 font-serif text-2xl font-semibold">Продовжити</h2>

      {audioLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {continueItems.map((item) => (
            <Card key={item.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {item.type === "audio" ? "Продовжити прослуховування" : "Продовжити читання"}
                </div>

                <div className="mb-2 text-base font-semibold">{item.title}</div>

                {item.subtitle && <div className="mb-3 truncate text-sm text-muted-foreground">{item.subtitle}</div>}

                {item.progress > 0 && (
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Прогрес: {item.progress}%</span>
                      {item.duration && (
                        <span>
                          {formatTime(Math.round((item.progress / 100) * item.duration))} / {formatTime(item.duration)}
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button variant="secondary" size="sm" asChild>
                    <a href={item.href}>
                      {item.type === "audio" ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Продовжити
                        </>
                      ) : (
                        <>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Відкрити
                        </>
                      )}
                    </a>
                  </Button>
                  {item.timestamp && <span className="text-xs text-muted-foreground">{item.timestamp}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
