import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, Play, Star, Music } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import bhagavadGitaCover from "@/assets/bhagavad-gita-audiobook.png";
import srimadBhagavatamCover from "@/assets/srimad-bhagavatam-audiobook.png";
import sriIsopanishadCover from "@/assets/sri-isopanishad-audiobook.png";

export const Audiobooks = () => {
  // Fetch audiobooks category
  const { data: categories } = useQuery({
    queryKey: ['audiobooks-category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_categories')
        .select('id')
        .eq('slug', 'audiobooks')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch audiobooks playlists
  const { data: audiobooks, isLoading } = useQuery({
    queryKey: ['audiobooks-playlists', categories?.id],
    enabled: !!categories?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_playlists')
        .select(`
          *,
          tracks:audio_tracks(count)
        `)
        .eq('category_id', categories!.id)
        .eq('is_published', true)
        .order('display_order');
      
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

  const staticAudiobooks = [
    {
      id: "bhagavad-gita",
      title: "Бгаґавад-ґіта як вона є",
      author: "Шріла Прабгупада",
      description: "Повний переклад та коментарі до найважливішого твору ведичної літератури",
      cover: bhagavadGitaCover,
      duration: "18 годин 45 хв",
      chapters: 18,
      rating: 4.9,
      reviews: 156,
      narrator: "Аніруддга дас",
      language: "Українська",
      size: "2.1 GB"
    },
    {
      id: "srimad-bhagavatam-1",
      title: "Шрімад-Бгаґаватам, Том 1",
      author: "Шріла Прабгупада", 
      description: "Перший том найсвятішого Пурани, що розкриває природу Абсолютної Істини",
      cover: srimadBhagavatamCover,
      duration: "25 годин 30 хв",
      chapters: 19,
      rating: 4.8,
      reviews: 89,
      narrator: "Аніруддга дас",
      language: "Українська", 
      size: "2.8 GB"
    },
    {
      id: "srimad-bhagavatam-2",
      title: "Шрімад-Бгаґаватам, Том 2",
      author: "Шріла Прабгупада",
      description: "Другий том священного писання з описом космічного прояву",
      cover: "/src/assets/srimad-bhagavatam-2-cover.webp", 
      duration: "22 годин 15 хв",
      chapters: 10,
      rating: 4.7,
      reviews: 72,
      narrator: "Аніруддга дас",
      language: "Українська",
      size: "2.5 GB"
    },
    {
      id: "sri-isopanishad",
      title: "Шрі Ішопанішад",
      author: "Шріла Прабгупада",
      description: "Досконале керівництво з самореалізації через 18 мантр древньої мудрості",
      cover: sriIsopanishadCover,
      duration: "4 години 20 хв",
      chapters: 18,
      rating: 4.9,
      reviews: 124,
      narrator: "Аніруддга дас",
      language: "Українська",
      size: "485 MB"
    }
  ];

  // Combine static and dynamic audiobooks
  const allBooks = [...staticAudiobooks, ...(audiobooks || [])];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/audio">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до аудіо
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">
              Аудіокниги
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Колекція ведичних писань у аудіо форматі з професійним озвученням
          </p>
        </div>

        {/* Audiobooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBooks.map((book: any) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={book.cover_image_url || book.cover}
                  alt={book.title_ua || book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Аудіокнига</Badge>
                  {book.tracks?.[0]?.count && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Music className="w-3 h-3 mr-1" />
                      {book.tracks[0].count}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {book.title_ua || book.title}
                </h3>
                
                {book.author && (
                  <p className="text-sm text-primary mb-3">{book.author}</p>
                )}
                
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                  {book.description_ua || book.description}
                </p>
                
                {book.year && (
                  <div className="text-xs text-muted-foreground mb-4">
                    Рік: {book.year}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Link 
                    to={`/audiobooks/${book.id}`} 
                    className="flex-1"
                  >
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Слухати
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <Card className="p-8 text-center mt-12 bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Підтримайте проєкт
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Допоможіть нам створювати більше якісних аудіокниг ведичної літератури
          </p>
          <Link to="/donation">
            <Button size="lg">
              Підтримати проєкт
            </Button>
          </Link>
        </Card>
      </main>
      <Footer />
    </div>
  );
};