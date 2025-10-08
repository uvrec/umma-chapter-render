import { Header } from "@/components/Header";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User, Music } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";

export const AudiobookView = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch audiobook details
  const { data: audiobook, isLoading } = useQuery({
    queryKey: ['audiobook', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_playlists')
        .select(`
          *,
          tracks:audio_tracks(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Завантаження...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Аудіокнига не знайдена</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Convert tracks to format expected by PlaylistPlayer
  const tracks = audiobook.tracks?.map((track: any, index: number) => ({
    id: track.id,
    title: track.title_ua,
    duration: track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : "0:00",
    src: track.audio_url
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/audio/audiobooks" className="inline-flex items-center mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до аудіокниг
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Book Info */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                {audiobook.cover_image_url && (
                  <div className="aspect-square w-full mb-6 bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={audiobook.cover_image_url} 
                      alt={audiobook.title_ua} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      {audiobook.title_ua}
                    </h1>
                    {audiobook.author && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{audiobook.author}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Music className="w-4 h-4" />
                      <span>{tracks.length} треків</span>
                    </div>
                    {audiobook.year && (
                      <>
                        <span>•</span>
                        <span>{audiobook.year} р.</span>
                      </>
                    )}
                  </div>

                  {audiobook.description_ua && (
                    <div className="prose prose-sm text-foreground">
                      <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {audiobook.description_ua}
                      </p>
                    </div>
                  )}

                  {audiobook.description_en && (
                    <div className="prose prose-sm text-foreground">
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {audiobook.description_en}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Player */}
            <div className="lg:col-span-2">
              {tracks.length > 0 ? (
                <PlaylistPlayer 
                  tracks={tracks} 
                  title={audiobook.title_ua}
                  albumCover={audiobook.cover_image_url}
                />
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Немає доступних треків</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
