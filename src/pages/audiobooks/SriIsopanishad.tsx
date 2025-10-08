import { Header } from "@/components/Header";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import { Link } from "react-router-dom";
import sriIsopanishadCover from "@/assets/sri-isopanishad-audiobook.png";

const tracks = [
  { id: "1", title: "Вступ до Шрі Ішопанішада", duration: "12:30", src: "/audio/iso-intro.mp3" },
  { id: "2", title: "Мантра 1: Все належить Богу", duration: "15:45", src: "/audio/iso-mantra1.mp3" },
  { id: "3", title: "Мантра 2: Живи сто років", duration: "13:20", src: "/audio/iso-mantra2.mp3" },
  { id: "4", title: "Мантра 3: Демонічні світи", duration: "11:15", src: "/audio/iso-mantra3.mp3" },
  { id: "5", title: "Мантра 4: Нерухомий рухомий", duration: "14:50", src: "/audio/iso-mantra4.mp3" },
  { id: "6", title: "Мантра 5-8: Парадокси духовного життя", duration: "18:35", src: "/audio/iso-mantra5-8.mp3" },
  { id: "7", title: "Мантра 9-14: Знання та невігластво", duration: "22:20", src: "/audio/iso-mantra9-14.mp3" },
  { id: "8", title: "Мантра 15-18: Молитва до Господа", duration: "16:40", src: "/audio/iso-mantra15-18.mp3" },
];

const sampleReviews = [
  {
    id: "1",
    userName: "Дмитро",
    avatar: "",
    rating: 5,
    comment: "Шрі Ішопанішада - це концентрована мудрість у найчистішому вигляді. Кожна мантра - це окрема філософська перлина. Прабгупада майстерно розкриває глибинний зміст цих стародавніх віршів.",
    tags: ["Філософський", "Концентрований", "Мудрий", "Глибокий", "Ясний виклад"],
    bookRating: 5,
    speakerRating: 5
  },
  {
    id: "2", 
    userName: "Тетяна",
    avatar: "",
    rating: 4,
    comment: "Невелика, але дуже змістовна книга. Ідеально підходить для тих, хто тільки починає знайомитись з ведичною філософією. Диктор читає зрозуміло та з правильними наголосами.",
    tags: ["Початківцям", "Зрозуміло", "Змістовно", "Якісний запис"],
    bookRating: 4,
    speakerRating: 4
  }
];

export const SriIsopanishad = () => {
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
                <div className="aspect-square w-full mb-6 bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={sriIsopanishadCover} 
                    alt="Шрі Ішопанішада обкладинка" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Шрі Ішопанішада
                    </h1>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>А. Ч. Бхактіведанта Свамі Прабгупада</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>18 мантр</span>
                    </div>
                    <span>•</span>
                    <span>~2 години</span>
                  </div>

                  <div className="prose prose-sm text-foreground">
                    <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Шрі Ішопанішада - це одна з найважливіших упанішад, яка містить суть ведичного знання в 
                      лише вісімнадцяти мантрах. Це найстародавніший філософський текст у світі, який розкриває 
                      найглибші істини про природу реальності.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      Текст починається з фундаментального принципу: "Ішавасьям ідам сарвам" - "Все в цьому всесвіті 
                      належить Господу і контролюється Ним". Це основа духовного світогляду.
                    </p>
                  </div>

                  <div className="prose prose-sm text-foreground">
                    <h3 className="text-lg font-semibold mb-2">Про автора</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Шріла Прабгупада назвав Шрі Ішопанішаду "посібником для людської цивілізації". Його коментарі 
                      допомагають зрозуміти глибокий духовний зміст кожної мантри і застосувати ці знання у повсякденному житті.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Player */}
            <div className="lg:col-span-2">
              <PlaylistPlayer 
                tracks={tracks} 
                title="Шрі Ішопанішада"
                albumCover={sriIsopanishadCover}
              />
            </div>
          </div>
          
          {/* Reviews Section */}
          <ReviewsSection
            bookTitle="Шрі Ішопанішада"
            overallRating={4.3}
            totalReviews={28}
            bookRating={4.5}
            speakerRating={4.1}
            reviews={sampleReviews}
          />
        </div>
      </main>
    </div>
  );
};