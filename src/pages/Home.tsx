import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import srimadBhagavatam1Cover from "@/assets/srimad-bhagavatam-1.jpg";

interface Book {
  id: string;
  title: string;
  description: string;
  price: string;
  hasVerse?: boolean;
  verseLink?: string;
  coverImage: string;
  category: "classics" | "small" | "russian";
}

const books: Book[] = [
  {
    id: "sb-1-1",
    title: "Перша пісня Шрімад Бгаґаватам",
    description: "Перші дев'ять розділів найбільшого шедевра індійської духовної думки, літератури, богослов'я та метафізики.",
    price: "595 грн",
    hasVerse: true,
    verseLink: "/verses/srimad-bhagavatam",
    coverImage: srimadBhagavatam1Cover,
    category: "classics"
  },
  {
    id: "sb-2",
    title: "Друга пісня Шрімад Бгаґаватам",
    description: "Ця пісня \"Шрімад-Бгаґаватам\" являє собою стислий виклад усієї книги.",
    price: "438 грн",
    coverImage: "/api/placeholder/300/400",
    category: "classics"
  },
  {
    id: "bg",
    title: "Бгаґавад-Ґіта як вона є",
    description: "Суть усієї ведичної мудрості. У цьому творі у стислому вигляді викладено основні ідеї давньоіндійської філософії.",
    price: "425 грн",
    hasVerse: true,
    verseLink: "/verses/bhagavad-gita", 
    coverImage: "/api/placeholder/300/400",
    category: "classics"
  },
  {
    id: "iso",
    title: "Шрі Ішопанішада",
    description: "Переклад одного з найважливіших філософських трактатів Стародавньої Індії.",
    price: "50 грн",
    hasVerse: true,
    verseLink: "/verses/isopanisad",
    coverImage: "/api/placeholder/300/400",
    category: "small"
  },
  {
    id: "nectar",
    title: "Нектар настанов",
    description: "Одинадцять віршів «Шрі Упадешамріти» містять найважливіші настанови для тих, хто хоче йти шляхом бгакті.",
    price: "65 грн",
    coverImage: "/api/placeholder/300/400",
    category: "small"
  },
  {
    id: "science",
    title: "Наука самоусвідомлення",
    description: "Збірник бесід з різними цікавими людьми: Джоном Ленноном, радянським професором Г. Котовським та іншими.",
    price: "127 грн",
    coverImage: "/api/placeholder/300/400",
    category: "small"
  },
  {
    id: "krishna",
    title: "Крішна. Верховний Бог - Особа",
    description: "Біографія Крішни. Книга є скороженим переказом 10 Пісні \"Шрімад-Бхагаватам\".",
    price: "94 грн",
    hasVerse: true,
    verseLink: "/verses",
    coverImage: "/api/placeholder/300/400",
    category: "classics"
  },
  {
    id: "nectar-devotion",
    title: "Нектар відданости",
    description: "Океан нектарних смаків відданого служіння від Шрі Рупи Госвамі.",
    price: "350 грн",
    hasVerse: true,
    verseLink: "/verses",
    coverImage: "/api/placeholder/300/400",
    category: "classics"
  },
  {
    id: "songs",
    title: "Пісні ачар'їв-вайшнавів",
    description: "Унікальне зібрання бгаджанів мовою українською-солов'їною!",
    price: "146 грн",
    coverImage: "/api/placeholder/300/400",
    category: "small"
  },
  {
    id: "raja-vidya",
    title: "Раджа-відя - найшляхетніше знання",
    description: "Можна пишатися академічною освітою, але не знати відповіді на запитання \"хто я?\". Усі люди за рідкісними винятками вважають себе за це тіло.",
    price: "48 грн",
    coverImage: "/api/placeholder/300/400",
    category: "small"
  },
  {
    id: "perfect-questions",
    title: "Досконалі питання, досконалі відповіді",
    description: "Бесіди духовного учителя, представника однієї з найбільш давніх релігійних традицій, із молодим шукачем істини.",
    price: "41 грн",
    coverImage: "/api/placeholder/300/400",
    category: "small"
  },
  {
    id: "journey",
    title: "Подорож самопізнання",
    description: "Серед безплідної пустелі матеріалізму «Подорож самопізнання» служитиме надійною малою, що виведе до оазису вищого, духовного усвідомлення.",
    price: "59 грн",
    coverImage: "/api/placeholder/300/400",
    category: "small"
  }
];

export const Home = () => {
  const classicBooks = books.filter(book => book.category === "classics");
  const smallBooks = books.filter(book => book.category === "small");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-6 text-primary">
            ॐ
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Прабгупада солов'їною
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ведична бібліотека з коментарями Його Божественної Милості А.Ч. Бхактіведанти Свамі Прабгупади
          </p>
        </div>

        {/* Classic Books Section */}
        <section className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-2xl font-semibold text-foreground mx-6">Основні писання</h2>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classicBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden">
                  {book.coverImage && typeof book.coverImage === 'string' && !book.coverImage.includes('placeholder') ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-6xl mb-4 text-primary">
                          ॐ
                        </div>
                        <div className="text-lg font-semibold text-foreground/80 line-clamp-3">
                          {book.title}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">{book.price}</span>
                    {book.hasVerse && (
                      <Link to={book.verseLink!}>
                        <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                          Читати вірші
                        </Badge>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Small Books Section */}
        <section>
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-2xl font-semibold text-foreground mx-6">Малі книги</h2>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {smallBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 rounded-t-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:dark:to-indigo-900/20 flex items-center justify-center">
                    <div className="text-center p-3">
                      <div className="text-4xl mb-2 text-primary">
                        📖
                      </div>
                      <div className="text-sm font-medium text-foreground/80 line-clamp-4">
                        {book.title}
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-foreground mb-2 text-sm line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">{book.price}</span>
                    {book.hasVerse && (
                      <Link to={book.verseLink!}>
                        <Badge variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                          Читати
                        </Badge>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-border">
          <p className="text-muted-foreground mb-2">
            Київська громада Свідомості Крішни
          </p>
          <p className="text-sm text-muted-foreground">
            Доставка Новою поштою по Україні та за кордон
          </p>
        </footer>
      </main>
    </div>
  );
};