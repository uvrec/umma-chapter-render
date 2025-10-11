import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ArrowLeft, Mic, Calendar, Clock } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

// covers: імпортуємо, щоб працювало у проді
import bhagavadGitaCover from "@/assets/bhagavad-gita-new.png";
import sbCover from "@/assets/srimad-bhagavatam-1-cover.webp";
import morningWalksCover from "/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png";

type Track = {
  id: string;
  title: string;
  duration: string; // "mm:ss"
  src: string; // URL або шлях до файлу
};

export const Lectures = () => {
  const lecturePlaylists: Array<{
    id: string;
    title: string;
    description: string;
    cover: string;
    author: string;
    date: string;
    duration: string;
    tracks: Track[];
  }> = [
    {
      id: "prabhupada-bg",
      title: "Лекції з Бгаґавад-ґіти",
      description: "Глибокі роз'яснення Шріли Прабгупади на вірші Бгаґавад-ґіти",
      cover: bhagavadGitaCover,
      author: "Шріла Прабгупада",
      date: "1966-1977",
      duration: "45+ годин",
      tracks: [
        { id: "bg-1-1", title: "БГ 1.1 - Початок великої битви", duration: "45:32", src: "/audio/lectures/bg-1-1.mp3" },
        {
          id: "bg-1-2",
          title: "БГ 1.2-1.3 - Армії на Курукшетрі",
          duration: "52:18",
          src: "/audio/lectures/bg-1-2.mp3",
        },
        { id: "bg-2-1", title: "БГ 2.1 - Скорбота Арджуни", duration: "48:45", src: "/audio/lectures/bg-2-1.mp3" },
      ],
    },
    {
      id: "prabhupada-sb",
      title: "Лекції з Шрімад-Бгаґаватам",
      description: "Коментарі Шріли Прабгупади на вірші Шрімад-Бгаґаватам",
      cover: sbCover,
      author: "Шріла Прабгупада",
      date: "1962-1977",
      duration: "200+ годин",
      tracks: [
        {
          id: "sb-1-1-1",
          title: "ШБ 1.1.1 - Абсолютна Істина",
          duration: "1:02:15",
          src: "/audio/lectures/sb-1-1-1.mp3",
        },
        {
          id: "sb-1-1-2",
          title: "ШБ 1.1.2 - Дгарма та природа душі",
          duration: "57:33",
          src: "/audio/lectures/sb-1-1-2.mp3",
        },
        {
          id: "sb-1-2-1",
          title: "ШБ 1.2.1 - Питання мудреців",
          duration: "1:15:22",
          src: "/audio/lectures/sb-1-2-1.mp3",
        },
      ],
    },
    {
      id: "morning-walks",
      title: "Ранкові прогулянки",
      description: "Неформальні бесіди Шріли Прабгупади під час ранкових прогулянок",
      cover: morningWalksCover,
      author: "Шріла Прабгупада",
      date: "1973-1977",
      duration: "30+ годин",
      tracks: [
        {
          id: "walk-1",
          title: "Ранкова прогулянка - Про духовний учитель",
          duration: "25:45",
          src: "/audio/lectures/walk-1.mp3",
        },
        {
          id: "walk-2",
          title: "Ранкова прогулянка - Про медитацію",
          duration: "32:18",
          src: "/audio/lectures/walk-2.mp3",
        },
      ],
    },
  ];

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
            <Mic className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">Духовні лекції</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Колекція духовних лекцій та бесід з коментарями на ведичні писання
          </p>
        </div>

        <div className="space-y-12">
          {lecturePlaylists.map((playlist) => (
            <div key={playlist.id} className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img src={playlist.cover} alt={playlist.title} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{playlist.title}</h2>
                    <p className="text-muted-foreground mb-4">{playlist.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mic className="w-4 h-4 mr-2" />
                        {playlist.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {playlist.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {playlist.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <PlaylistPlayer tracks={playlist.tracks} title={playlist.title} albumCover={playlist.cover} />
            </div>
          ))}
        </div>

        <Card className="p-8 text-center mt-12 bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Підтримайте проєкт</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Допоможіть нам створювати більше якісного духовного контенту та розширювати бібліотеку лекцій
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
