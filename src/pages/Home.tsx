import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Search, Users, ArrowRight } from "lucide-react";
import { useAudio } from "@/components/GlobalAudioPlayer/GlobalAudioPlayer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Home = () => {
  const { setQueue, playTrack } = useAudio();

  // Завантаження плейлиста Шрімад-Бгаґаватам за замовченням
  const { data: bhagavatamPlaylist } = useQuery({
    queryKey: ["default-playlist"],
    queryFn: async () => {
      const { data: playlist, error: playlistError } = await supabase
        .from("audio_playlists")
        .select("id, title_ua, title_en")
        .eq("id", "fc2a05f5-151b-482e-8040-341d8d247657")
        .single();

      if (playlistError) throw playlistError;

      const { data: tracks, error: tracksError } = await supabase
        .from("audio_tracks")
        .select("id, title_ua, title_en, audio_url, duration, track_number")
        .eq("playlist_id", playlist.id)
        .order("track_number");

      if (tracksError) throw tracksError;

      return {
        playlist,
        tracks: tracks.map((track) => ({
          id: track.id,
          title: track.title_ua,
          src: track.audio_url,
          duration: track.duration || undefined,
          metadata: {
            playlistTitle: playlist.title_ua,
          },
        })),
      };
    },
    staleTime: 10 * 60 * 1000, // 10 хвилин
  });

  // Автоматичне завантаження плейлиста при монтуванні
  useEffect(() => {
    if (bhagavatamPlaylist?.tracks && bhagavatamPlaylist.tracks.length > 0) {
      setQueue(bhagavatamPlaylist.tracks);
    }
  }, [bhagavatamPlaylist, setQueue]);

  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background with geometric shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
          {/* Geometric decorations */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-secondary/15 blur-3xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-6xl text-primary mb-4">ॐ</div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Прабгупада</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  солов'їною
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Ведична бібліотека з коментарями Бгактіведанти Свамі Прабгупади та ачар'ями
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link to="/library">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Переглянути бібліотеку
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  if (bhagavatamPlaylist?.tracks && bhagavatamPlaylist.tracks.length > 0) {
                    playTrack(bhagavatamPlaylist.tracks[0]);
                  }
                }}
                disabled={!bhagavatamPlaylist?.tracks || bhagavatamPlaylist.tracks.length === 0}
              >
                <Headphones className="w-5 h-5 mr-2" />
                Слухати Бгаґаватам
              </Button>
            </div>
          </div>
          
          {/* Right side - Visual element */}
          <div className="relative flex justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              {/* Main circle with Om symbol */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 backdrop-blur-sm border border-primary/20">
                
              </div>
              {/* Floating elements */}
              
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-secondary/15 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">духовний шлях</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">переклади та коментарі авторитетних духовних учителів</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/library">
                  Почати читання
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://send.monobank.ua/jar/3PZv1t9hAa" target="_blank" rel="noopener noreferrer">
                  Підтримати проект
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>;
};