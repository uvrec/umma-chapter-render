import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ArrowLeft, Podcast as PodcastIcon, Calendar, Users } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import bhagavadGitaCover from "@/assets/bhagavad-gita-new.png";

type Track = { id: string; title: string; duration: string; src: string };

export const Podcasts = () => {
  const podcasts: Array<{
    id: string;
    title: string;
    description: string;
    cover: string;
    host: string;
    year: string;
    category: string;
    tracks: Track[];
  }> = [
    {
      id: "spiritual-talks",
      title: "Духовні бесіди",
      description: "Глибокі розмови про ведичну філософію та духовний розвиток",
      cover: "/src/assets/albums/mantra-prayer.jpg",
      host: "Ведичні вчителі",
      year: "2024",
      category: "Філософія",
      tracks: [
        {
          id: "talk-1",
          title: "Природа душі та свідомості",
          duration: "45:30",
          src: "/audio/podcasts/nature-of-soul.mp3",
        },
        {
          id: "talk-2",
          title: "Карма та реінкарнація",
          duration: "38:15",
          src: "/audio/podcasts/karma-reincarnation.mp3",
        },
        {
          id: "talk-3",
          title: "Мантра медитація для початківців",
          duration: "32:45",
          src: "/audio/podcasts/mantra-meditation.mp3",
        },
        {
          id: "talk-4",
          title: "Ведичний спосіб життя в сучасному світі",
          duration: "52:20",
          src: "/audio/podcasts/vedic-lifestyle.mp3",
        },
      ],
    },
    {
      id: "bhagavad-gita-discussions",
      title: "Обговорення Бгаґавад-ґіти",
      description: "Детальний розбір віршів з найважливішого ведичного твору",
      cover: bhagavadGitaCover,
      host: "Експерти з ведичної літератури",
      year: "2024",
      category: "Писання",
      tracks: [
        {
          id: "gita-1",
          title: "Розділ 1: Скорбота Арджуни",
          duration: "28:30",
          src: "/audio/podcasts/gita-chapter-1.mp3",
        },
        {
          id: "gita-2",
          title: "Розділ 2: Зміст Ґіти у підсумку",
          duration: "42:15",
          src: "/audio/podcasts/gita-chapter-2.mp3",
        },
        { id: "gita-3", title: "Розділ 3: Карма-йога", duration: "36:45", src: "/audio/podcasts/gita-chapter-3.mp3" },
      ],
    },
  ];

  const categories = ["Всі", "Філософія", "Писання", "Медитація", "Спосіб життя"];

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

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <PodcastIcon className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">Подкасти</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Духовні бесіди, обговорення писань та глибокі роздуми про ведичну мудрість
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button key={category} variant={category === "Всі" ? "default" : "outline"} size="sm">
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-12">
          {podcasts.map((podcast) => (
            <div key={podcast.id} className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={podcast.cover}
                        alt={`Обкладинка: ${podcast.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{podcast.title}</h2>
                    <p className="text-muted-foreground mb-4">{podcast.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {podcast.host}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {podcast.year}
                      </div>
                      <div className="flex items-center">
                        <PodcastIcon className="w-4 h-4 mr-2" />
                        {podcast.category}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <PlaylistPlayer tracks={podcast.tracks} title={podcast.title} albumCover={podcast.cover} />
            </div>
          ))}
        </div>

        <Card className="p-8 text-center mt-12 bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Підтримайте подкасти</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Допоможіть нам створювати більше якісного контенту для духовного розвитку
          </p>
          <Link to="/donation">
            <Button size="lg">Підтримати проєкт</Button>
          </Link>
        </Card>
      </main>
      <Footer />
    </div>
  );
};
