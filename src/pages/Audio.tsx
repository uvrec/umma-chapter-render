import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Play, Clock, User, ChevronDown, Headphones } from "lucide-react";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";

export const Audio = () => {
  // Sample playlist data
  const srimadBhagavatamTracks = [
    {
      id: "sb-1-1-1",
      title: "Шрімад-Бгаґаватам 1.1.1",
      duration: "5:32",
      src: "https://audio.fudokazuki.com/%D0%A8%D1%80%D1%96%D0%BC%D0%B0%D0%B4-%D0%B1%D0%B3%D0%B0%D2%91%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D0%BC%201.1.1%20(%D0%B7%20%D0%BF%D0%BE%D1%8F%D1%81%D0%BD%D0%B5%D0%BD%D0%BD%D1%8F%D0%BC)%20new.mp3"
    },
    {
      id: "sb-1-1-2",
      title: "Шрімад-Бгаґаватам 1.1.2",
      duration: "6:15",
      src: ""
    },
    {
      id: "sb-1-1-3",
      title: "Шрімад-Бгаґаватам 1.1.3",
      duration: "7:42",
      src: ""
    }
  ];

  const bhagavadGitaTracks = [
    {
      id: "bg-2-1",
      title: "Бгаґавад-ґіта 2.1",
      duration: "4:25",
      src: ""
    },
    {
      id: "bg-2-2", 
      title: "Бгаґавад-ґіта 2.2",
      duration: "5:18",
      src: ""
    },
    {
      id: "bg-2-3",
      title: "Бгаґавад-ґіта 2.3",
      duration: "6:33",
      src: ""
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6">
              <img 
                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png" 
                alt="Прабгупада солов'їною" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Почуйте Вічну Мудрість
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Зануртеся у світ ведичного знання через аудіокниги та лекції 
              великих духовних учителів. Слухайте, вивчайте та застосовуйте 
              древню мудрість у сучасному житті.
            </p>
            
            <Button size="lg" className="mb-4">
              <Play className="w-5 h-5 mr-2" />
              Почати слухати
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="flex justify-center mt-12">
          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Playlists Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Аудіобібліотека
          </h2>
          
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Srimad Bhagavatam Playlist */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">Шрімад-Бгаґаватам</h3>
                  <p className="text-muted-foreground">Перший том • 3 треки • 19:29</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      <User className="w-3 h-3 mr-1" />
                      Прабгупада
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      Новинка
                    </Badge>
                  </div>
                </div>
              </div>
              
              <PlaylistPlayer 
                tracks={srimadBhagavatamTracks}
                title="Шрімад-Бгаґаватам - Перший том"
              />
            </div>

            {/* Bhagavad Gita Playlist */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">Бгаґавад-ґіта</h3>
                  <p className="text-muted-foreground">Друга глава • 3 треки • 16:16</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      <User className="w-3 h-3 mr-1" />
                      Прабгупада
                    </Badge>
                  </div>
                </div>
              </div>
              
              <PlaylistPlayer 
                tracks={bhagavadGitaTracks}
                title="Бгаґавад-ґіта - Друга глава"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Individual Audiobooks Grid */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Колекція аудіокниг
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Bhagavad Gita Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src="/src/assets/bhagavad-gita-cover.webp" 
                    alt="Бгаґавад-ґіта"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    18 глав
                  </Badge>
                  <Badge variant="outline" className="text-xs">Повна версія</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  Бгаґавад-ґіта як вона є
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Повна версія з коментарями А.Ч. Бгактіведанти Свамі Прабгупади
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/audiobooks/bhagavad-gita">
                      <Play className="w-4 h-4 mr-1" />
                      Аудіокнига
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    Прабгупада
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Srimad Bhagavatam Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src="/src/assets/srimad-bhagavatam-1-cover.webp" 
                    alt="Шрімад-Бгаґаватам"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    12 томів
                  </Badge>
                  <Badge variant="outline" className="text-xs">Новинка</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  Шрімад-Бгаґаватам
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Прекрасна Пурана про життя та діяння Всевишнього Господа
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/audiobooks/srimad-bhagavatam">
                      <Play className="w-4 h-4 mr-1" />
                      Аудіокнига
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    Прабгупада
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sri Isopanishad Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src="/src/assets/sri-isopanishad-cover.webp" 
                    alt="Шрі Ішопанішад"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    18 мантр
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  Шрі Ішопанішад
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Найголовніша з усіх Упанішад, яка містить суть ведичного знання
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/audiobooks/sri-isopanishad">
                      <Play className="w-4 h-4 mr-1" />
                      Аудіокнига
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    Прабгупада
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Підтримайте проєкт
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Допомогти нам створювати більше якісного аудіоконтенту та підтримувати бібліотеку
          </p>
          <Button asChild size="lg">
            <Link to="/donation">
              Зробити внесок
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};