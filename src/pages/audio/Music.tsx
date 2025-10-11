import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ArrowLeft, Music as MusicIcon, Users, Calendar } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

// узгоджений тип для треків
type Track = { id: string; title: string; duration: string; src: string };

export const Music = () => {
  const albums: Array<{
    id: string;
    title: string;
    description: string;
    cover: string;
    artist: string;
    year: string;
    genre: string;
    tracks: Track[];
  }> = [
    {
      id: "krishna-bhajans",
      title: "Мантри та бгаджани",
      description: "Традиційні ведичні мантри та бгаджани для медитації та духовного очищення",
      cover: "/src/assets/albums/mantra-prayer.jpg",
      artist: "Духовні співаки",
      year: "2023",
      genre: "Мантри",
      tracks: [
        { id: "hare-krishna-1", title: "Маха-мантра (повільна версія)", duration: "12:45", src: "/audio/music/hare-krishna-slow.mp3" },
        { id: "hare-krishna-2", title: "Маха-мантра (швидка версія)", duration: "8:33", src: "/audio/music/hare-krishna-fast.mp3" },
        { id: "govinda", title: "Говінда Джайа Джайа", duration: "6:21", src: "/audio/music/govinda.mp3" },
        { id: "sri-krishna", title: "Шрі Крішна Шаранам Мама", duration: "9:15", src: "/audio/music/sri-krishna.mp3" },
      ],
    },
    {
      id: "gopi-gita",
      title: "Ґопі-ґіта",
      description: "Піснеспіви з Шрімад-Бгаґаватам про любов ґопі до Шрі Крішни",
      cover: "/src/assets/albums/relief-gopi-gita.jpg",
      artist: "Традиційні співи",
      year: "2023",
      genre: "Духовні пісні",
      tracks: [
        { id: "gopi-1", title: "Ґопі-ґіта - Перша пісня", duration: "15:32", src: "/audio/music/gopi-gita-1.mp3" },
        { id: "gopi-2", title: "Ґопі-ґіта - Друга пісня", duration: "18:45", src: "/audio/music/gopi-gita-2.mp3" },
        { id: "gopi-3", title: "Ґопі-ґіта - Третя пісня", duration: "14:28", src: "/audio/music/gopi-gita-3.mp3" },
      ],
    },
    {
      id: "contemporary",
      title: "Сучасна духовна музика",
      description: "Сучасні інтерпретації древніх мантр та бгаджанів",
      cover: "/src/assets/albums/color.jpg",
      artist: "Різні виконавці",
      year: "2024",
      genre: "Fusion",
      tracks: [
        { id: "modern-1", title: "Радга Крішна (сучасна версія)", duration: "5:42", src: "/audio/music/modern-radha-krishna.mp3" },
        { id: "modern-2", title: "Ом Намо Бгаґавате (електронна версія)", duration: "7:18", src: "/audio/music/modern-om-namo.mp3" },
        { id: "modern-3", title: "Джапа медитація (ambient)", duration: "20:00", src: "/audio/music/japa-ambient.mp3" },
      ],
    },
    // УВАГА: Bandcamp не відтворюється напряму <audio> через CORS. Лиши як зовнішні посилання або додай власні MP3.
    {
      id: "fudo-kazuki",
      title: "Fudo Kazuki - Дискографія",
      description: "Експериментальна духовна музика, ambient, електроніка з елементами традиційних мантр",
      cover: "/src/assets/albums/the-glories-of-radha-kunda.jpg",
      artist: "Fudo Kazuki",
      year: "2020-2024",
      genre: "Експериментальна",
      tracks: [
        // якщо немає локальних файлів — краще зробити список з зовнішніми <a> замість програвача
      ] as Track[],
    },
  ];

  const genres = ["Всі", "Мантри", "Духовні пісні", "Fusion", "Медитація", "Експериментальна"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          {/* Фікс: назад саме до /audio */}
          <Link to="/audio">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до аудіо
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MusicIcon className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">Духовна музика</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Мантри, бгаджани та духовні пісні для медитації та внутрішнього розвитку
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {genres.map((genre) => (
            <Button key={genre} variant={genre === "Всі" ? "default" : "outline"} size="sm">
              {genre}
            </Button>
          ))}
        </div>

        <div className="space-y-12">
          {albums.map((album) => (
            <div key={album.id} className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={album.cover}
                        alt={`Обкладинка: ${album.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{album.title}</h2>
                    <p className="text-muted-foreground mb-4">{album.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {album.artist}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {album.year}
                      </div>
                      <div className="flex items-center">
                        <MusicIcon className="w-4 h-4 mr-2" />
                        {album.genre}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {album.tracks.length > 0 ? (
                <PlaylistPlayer tracks={album.tracks} title={album.title} albumCover={album.cover} />
              ) : (
                <Card className="p-6 text-center text-sm text-muted-foreground">
                  Для цього альбому відсутні локальні треки. Додайте MP3 у /public/audio або використайте зовнішні посилання як окремі <a>.
                </Card>
              )}
            </div>
          ))}
        </div>

        <Card className="p-8 text-center mt-12 bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Підтримайте музикантів</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Допоможіть нам підтримувати духовних музикантів та створювати нову якісну музику
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