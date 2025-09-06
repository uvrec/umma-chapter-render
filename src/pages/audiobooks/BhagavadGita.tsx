import { Header } from "@/components/Header";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import { Link } from "react-router-dom";

const tracks = [
  { id: "1", title: "Вступ до Бгагавад-гіти", duration: "15:42", src: "/audio/bg-intro.mp3" },
  { id: "2", title: "Розділ 1: Смуток Арджуни", duration: "23:15", src: "/audio/bg-ch1.mp3" },
  { id: "3", title: "Розділ 2: Зміст Гіти, підсумований", duration: "45:30", src: "/audio/bg-ch2.mp3" },
  { id: "4", title: "Розділ 3: Карма-йога", duration: "32:18", src: "/audio/bg-ch3.mp3" },
  { id: "5", title: "Розділ 4: Трансцендентне знання", duration: "28:45", src: "/audio/bg-ch4.mp3" },
  { id: "6", title: "Розділ 5: Карма-йога - дія в усвідомленні Крішни", duration: "19:33", src: "/audio/bg-ch5.mp3" },
  { id: "7", title: "Розділ 6: Дгьяна-йога", duration: "35:27", src: "/audio/bg-ch6.mp3" },
  { id: "8", title: "Розділ 7: Знання про Абсолют", duration: "22:14", src: "/audio/bg-ch7.mp3" },
];

const sampleReviews = [
  {
    id: "1",
    userName: "Олексій",
    avatar: "",
    rating: 5,
    comment: "Неймовірно глибокий та трансформуючий текст. Читання Прабгупади додає багато clarity до стародавньої мудрості. Голос диктора дуже приємний і легко сприймається навіть під час довгих сеансів прослуховування.",
    tags: ["Надихаючий", "Філософський", "Глибокий", "Трансформуючий", "Ясний голос"],
    bookRating: 5,
    speakerRating: 5
  },
  {
    id: "2", 
    userName: "Марія",
    avatar: "",
    rating: 4,
    comment: "Дуже хороша аудіокнига для тих, хто цікавиться східною філософією. Коментарі допомагають зрозуміти контекст і значення. Якість запису відмінна.",
    tags: ["Освітній", "Цікавий", "Добре структурований", "Якісний запис"],
    bookRating: 4,
    speakerRating: 5
  }
];

export const BhagavadGita = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/audiobooks" className="inline-flex items-center mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до аудіокниг
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Book Info */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="aspect-square w-full mb-6 bg-muted rounded-lg overflow-hidden">
                  <img 
                    src="/src/assets/bhagavad-gita.jpg" 
                    alt="Бгагавад-гіта обкладинка" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Бгагавад-гіта як вона є
                    </h1>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>А. Ч. Бхактіведанта Свамі Прабгупада</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>8 розділів</span>
                    </div>
                    <span>•</span>
                    <span>~4 години</span>
                  </div>

                  <div className="prose prose-sm text-foreground">
                    <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      "Бгагавад-гіта як вона є" - це найвідоміший та найшанованіший з усіх класичних творів ведичної мудрості. 
                      Ця безсмертна поема, записана більше п'яти тисяч років тому, складається з філософської бесіди між 
                      принцом Арджуною та його другом і наставником, Господом Крішною.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      Коментарі Шріли Прабгупади розкривають глибинний духовний зміст цього священного тексту, 
                      роблячи його доступним для сучасного читача.
                    </p>
                  </div>

                  <div className="prose prose-sm text-foreground">
                    <h3 className="text-lg font-semibold mb-2">Про автора</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      А. Ч. Бхактіведанта Свамі Прабгупада (1896-1977) - засновник-ачар'я Міжнародного товариства 
                      свідомості Крішни (ІСКОН). Він переклав понад 60 томів класичних ведичних писань англійською мовою 
                      та заснував 108 храмів по всьому світу.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Player */}
            <div className="lg:col-span-2">
              <PlaylistPlayer 
                tracks={tracks} 
                title="Бгагавад-гіта як вона є"
                albumCover="/src/assets/bhagavad-gita-cover.webp"
              />
            </div>
          </div>
          
          {/* Reviews Section */}
          <ReviewsSection
            bookTitle="Бгагавад-гіта як вона є"
            overallRating={4.5}
            totalReviews={47}
            bookRating={4.4}
            speakerRating={4.6}
            reviews={sampleReviews}
          />
        </div>
      </main>
    </div>
  );
};