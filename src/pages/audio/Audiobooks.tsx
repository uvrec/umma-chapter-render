import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, Play, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

export const Audiobooks = () => {
  const audiobooks = [
    {
      id: "bhagavad-gita",
      title: "Бгаґавад-ґіта як вона є",
      author: "Шріла Прабгупада",
      description: "Повний переклад та коментарі до найважливішого твору ведичної літератури",
      cover: "/src/assets/bhagavad-gita-cover.webp",
      duration: "18 годин 45 хв",
      chapters: 18,
      rating: 4.9,
      reviews: 156,
      narrator: "Професійний читець",
      language: "Українська",
      size: "2.1 GB"
    },
    {
      id: "srimad-bhagavatam-1",
      title: "Шрімад-Бгаґаватам, Том 1",
      author: "Шріла Прабгупада", 
      description: "Перший том найсвятішого Пурани, що розкриває природу Абсолютної Істини",
      cover: "/src/assets/srimad-bhagavatam-1-cover.webp",
      duration: "25 годин 30 хв",
      chapters: 19,
      rating: 4.8,
      reviews: 89,
      narrator: "Професійний читець",
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
      narrator: "Професійний читець",
      language: "Українська",
      size: "2.5 GB"
    },
    {
      id: "sri-isopanishad",
      title: "Шрі Ішопанішад",
      author: "Шріла Прабгупада",
      description: "Досконале керівництво з самореалізації через 18 мантр древньої мудрості",
      cover: "/src/assets/sri-isopanishad-cover.webp",
      duration: "4 години 20 хв",
      chapters: 18,
      rating: 4.9,
      reviews: 124,
      narrator: "Професійний читець",
      language: "Українська",
      size: "485 MB"
    }
  ];

  const categories = ["Всі", "Ґіта", "Бгаґаватам", "Упанішади", "Інше"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/audiobooks">
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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "Всі" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Audiobooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {audiobooks.map((book) => (
            <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Аудіокнига</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {book.rating}
                    <span className="ml-1">({book.reviews})</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {book.title}
                </h3>
                
                <p className="text-sm text-primary mb-3">{book.author}</p>
                
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                  {book.description}
                </p>
                
                <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Тривалість:</span>
                    <span>{book.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Розділів:</span>
                    <span>{book.chapters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Мова:</span>
                    <span>{book.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Розмір:</span>
                    <span>{book.size}</span>
                  </div>
                </div>
                
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
                  <Button variant="outline" size="icon">
                    <Clock className="w-4 h-4" />
                  </Button>
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