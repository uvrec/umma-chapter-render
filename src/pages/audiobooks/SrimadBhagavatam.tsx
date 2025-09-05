import { Header } from "@/components/Header";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import { Link } from "react-router-dom";

const tracks = [
  { id: "1", title: "Пісня 1.1: Питання мудреців", duration: "18:30", src: "/audio/sb-1-1-1.mp3" },
  { id: "2", title: "Пісня 1.2: Божество є причиною всіх причин", duration: "25:45", src: "/audio/sb-1-1-2.mp3" },
  { id: "3", title: "Пісня 1.3: Крішна - джерело всіх втілень", duration: "32:15", src: "/audio/sb-1-1-3.mp3" },
  { id: "4", title: "Пісня 1.4: Зявлення Шрі Нарада", duration: "28:20", src: "/audio/sb-1-1-4.mp3" },
  { id: "5", title: "Пісня 1.5: Нарада наставляє В'ясу", duration: "35:10", src: "/audio/sb-1-1-5.mp3" },
  { id: "6", title: "Пісня 1.6: Бесіда між Нарадою та В'ясою", duration: "29:55", src: "/audio/sb-1-1-6.mp3" },
  { id: "7", title: "Пісня 1.7: Син Дрони карається", duration: "41:20", src: "/audio/sb-1-1-7.mp3" },
];

const sampleReviews = [
  {
    id: "1",
    userName: "Віктор",
    avatar: "",
    rating: 5,
    comment: "Шрімад-Бгагаватам - це справжня скарбниця духовного знання. Переклад і коментарі Прабгупади роблять цей стародавній текст зрозумілим і актуальним. Диктор читає з великою повагою та розумінням.",
    tags: ["Духовний", "Освітній", "Глибокий", "Натхненний", "Чудовий голос"],
    bookRating: 5,
    speakerRating: 5
  },
  {
    id: "2", 
    userName: "Анна",
    avatar: "",
    rating: 4,
    comment: "Дуже цікаві історії та філософські роздуми. Допомагає краще зрозуміти ведичну культуру та мудрість. Рекомендую всім, хто шукає глибші відповіді на життєві питання.",
    tags: ["Цікавий", "Мудрий", "Корисний", "Добре структурований"],
    bookRating: 4,
    speakerRating: 4
  }
];

export const SrimadBhagavatam = () => {
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
                    src="/src/assets/srimad-bhagavatam-1.webp" 
                    alt="Шрімад-Бгагаватам обкладинка" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Шрімад-Бгагаватам
                    </h1>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>А. Ч. Бхактіведанта Свамі Прабгупада</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Перша пісня</span>
                    </div>
                    <span>•</span>
                    <span>~3.5 години</span>
                  </div>

                  <div className="prose prose-sm text-foreground">
                    <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Шрімад-Бгагаватам, також відомий як Бгагавата-пурана, - це найзначніше з усіх пуранічних писань. 
                      Цей священний текст розповідає про діяльність аватарів Вишну, особливо про трансцендентні розваги 
                      Господа Крішни.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      Перша пісня знайомить нас з мудрецями Наймішаран'ї, які звертаються до Сути Госвамі з проханням 
                      розповісти їм про найвище знання - про Господа та Його енергії.
                    </p>
                  </div>

                  <div className="prose prose-sm text-foreground">
                    <h3 className="text-lg font-semibold mb-2">Про автора</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      А. Ч. Бхактіведанта Свамі Прабгупада присвятив своє життя перекладу та поясненню ведичних писань. 
                      Його коментарі до Шрімад-Бгагаватам вважаються авторитетним джерелом для розуміння цієї 
                      трансцендентної літератури.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Player */}
            <div className="lg:col-span-2">
              <PlaylistPlayer 
                tracks={tracks} 
                title="Шрімад-Бгагаватам - Перша пісня"
              />
            </div>
          </div>
          
          {/* Reviews Section */}
          <ReviewsSection
            bookTitle="Шрімад-Бгагаватам"
            overallRating={4.6}
            totalReviews={34}
            bookRating={4.7}
            speakerRating={4.5}
            reviews={sampleReviews}
          />
        </div>
      </main>
    </div>
  );
};