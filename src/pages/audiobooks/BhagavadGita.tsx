import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlaylistPlayer } from "@/components/PlaylistPlayer";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import { Link } from "react-router-dom";
import bhagavadGitaCover from "@/assets/bhagavad-gita-new.png";

type Track = {
  id: string;
  title: string;
  duration: string; // mm:ss
  src: string;
};

const tracks: Track[] = [
  {
    id: "sb-1-1-1",
    title: "Шрімад-Бгаґаватам 1.1.1",
    duration: "05:32",
    src: "https://audio.fudokazuki.com/%D0%A8%D1%80%D1%96%D0%BC%D0%B0%D0%B4-%D0%B1%D0%B3%D0%B0%E1%B9%AD%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D0%BC%201.1.1%20(%D0%B7%20%D0%BF%D0%BE%D1%8F%D1%81%D0%BD%D0%B5%D0%BD%D0%BD%D1%8F%D0%BC)%20new.mp3",
  },
  {
    id: "sb-1-1-2",
    title: "Шрімад-Бгаґаватам 1.1.2",
    duration: "06:15",
    src: "https://audio.fudokazuki.com/%D0%A8%D1%80%D1%96%D0%BC%D0%B0%D0%B4-%D0%B1%D0%B3%D0%B0%E1%B9%AD%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D0%BC%201.1.2%20(%D0%B7%20%D0%BF%D0%BE%D1%8F%D1%81%D0%BD%D0%B5%D0%BD%D0%BD%D1%8F%D0%BC)%20new.mp3",
  },
  {
    id: "sb-1-1-3",
    title: "Шрімад-Бгаґаватам 1.1.3",
    duration: "07:42",
    src: "https://audio.fudokazuki.com/%D0%A8%D1%80%D1%96%D0%BC%D0%B0%D0%B4-%D0%B1%D0%B3%D0%B0%E1%B9%AD%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D0%BC%201.1.3%20(%D0%B7%20%D0%BF%D0%BE%D1%8F%D1%81%D0%BD%D0%B5%D0%BD%D0%BD%D1%8F%D0%BC).mp3",
  },
];

const sampleReviews = [
  {
    id: "1",
    userName: "Олексій",
    avatar: "",
    rating: 5,
    comment:
      "Неймовірно глибокий та трансформуючий текст. Коментарі Прабгупади додають ясності. Голос диктора приємний і легко сприймається навіть під час довгих сеансів прослуховування.",
    tags: ["Надихаючий", "Філософський", "Глибокий", "Трансформуючий", "Ясний голос"],
    bookRating: 5,
    speakerRating: 5,
  },
  {
    id: "2",
    userName: "Марія",
    avatar: "",
    rating: 4,
    comment:
      "Дуже хороша аудіокнига для тих, хто цікавиться східною філософією. Коментарі допомагають зрозуміти контекст і значення. Якість запису відмінна.",
    tags: ["Освітній", "Цікавий", "Добре структурований", "Якісний запис"],
    bookRating: 4,
    speakerRating: 5,
  },
];

export const BhagavadGita = () => {
  const coverFallback =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='100%25' height='100%25' fill='%23eee'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='24'>Bhagavad-gita</text></svg>";

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
                    src={bhagavadGitaCover}
                    alt="Обкладинка: Бгаґавад-ґіта як вона є"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = coverFallback;
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Бгаґавад-ґіта як вона є</h1>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>А. Ч. Бхактіведанта Свамі Прабгупада</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>~ 18 розділів</span>
                    </div>
                    <span>•</span>
                    <span>~ 4 години</span>
                  </div>

                  <div className="prose prose-sm text-foreground">
                    <h3 className="text-lg font-semibold mb-2">Про книгу</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      «Бгаґавад-ґіта як вона є» — найвідоміший із класичних творів ведичної мудрості. Це діалог між
                      принцом Арджуною та його наставником — Господом Крішною, що розкриває природу душі, дгарми та
                      шляхи йоги.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      Коментарі Шріли Прабгупади розкривають глибинний духовний зміст і роблять текст доступним
                      сучасному слухачеві.
                    </p>
                  </div>

                  <div className="prose prose-sm text-foreground">
                    <h3 className="text-lg font-semibold mb-2">Про автора</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      А. Ч. Бхактіведанта Свамі Прабгупада (1896–1977) — засновник-ачарʼя ІСКОН, перекладач і коментатор
                      класичних ведичних писань, автор понад 60 томів і засновник 108 храмів по всьому світу.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Player */}
            <div className="lg:col-span-2">
              <PlaylistPlayer tracks={tracks} title="Бгаґавад-ґіта як вона є" albumCover={bhagavadGitaCover} />
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewsSection
            bookTitle="Бгаґавад-ґіта як вона є"
            overallRating={4.5}
            totalReviews={47}
            bookRating={4.4}
            speakerRating={4.6}
            reviews={sampleReviews}
          />

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <Link to="/audiobooks">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Повернутися до аудіокниг
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BhagavadGita;
