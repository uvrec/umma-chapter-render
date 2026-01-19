import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Headphones, User } from "lucide-react";
import srimadBhagavatam1Cover from "@/assets/srimad-bhagavatam-1-cover.webp";
import bhagavadGitaCover from "@/assets/bhagavad-gita-new.png";
import srimadBhagavatam2Cover from "@/assets/srimad-bhagavatam-2-cover.webp";
import krishnaSupremePersonCover from "@/assets/krishna-supreme-person-cover.webp";

interface Book {
  id: string;
  title: string;
  description: string;
  price: string;
  hasVerse?: boolean;
  verseLink?: string;
  coverImage: string;
  purchaseUrl: string;
}

const prabhupadaBooks: Book[] = [
  {
    id: "sb-1-1",
    title: "Перша пісня Шрімад Бгаґаватам",
    description: "Перші дев'ять розділів найбільшого шедевра індійської духовної думки, літератури, богослов'я та метафізики.",
    price: "595 грн",
    hasVerse: true,
    verseLink: "/lib/sb/1",
    coverImage: srimadBhagavatam1Cover,
    purchaseUrl: "https://books.krishna.ua/tproduct/384929173-626906141911-persha-psnya-shrmad-bgaavatam"
  },
  {
    id: "sb-2",
    title: "Друга пісня Шрімад Бгаґаватам",
    description: "Ця пісня \"Шрімад-Бгаґаватам\" являє собою стислий виклад усієї книги.",
    price: "438 грн",
    coverImage: srimadBhagavatam2Cover,
    purchaseUrl: "https://books.krishna.ua/uk/srimad-bhagavatam-2-pisnja/"
  },
  {
    id: "bg",
    title: "Бгаґавад-Ґіта як вона є",
    description: "Суть усієї ведичної мудрості. У цьому творі у стислому вигляді викладено основні ідеї давньоіндійської філософії.",
    price: "425 грн",
    hasVerse: true,
    verseLink: "/lib/bg/1",
    coverImage: bhagavadGitaCover,
    purchaseUrl: "https://books.krishna.ua/uk/bhagavad-gita-jak-vona-je/"
  },
  {
    id: "iso",
    title: "Шрі Ішопанішада",
    description: "Переклад одного з найважливіших філософських трактатів Стародавньої Індії.",
    price: "50 грн",
    hasVerse: true,
    verseLink: "/lib/iso/1",
    coverImage: "https://optim.tildacdn.com/stor3130-6531-4561-b838-633461363163/-/format/webp/26491780.png.webp",
    purchaseUrl: "https://books.krishna.ua/uk/sri-ishopanishada/"
  },
  {
    id: "krishna",
    title: "Крішна. Верховний Бог - Особа",
    description: "Біографія Крішни. Книга є скороженим переказом 10 Пісні \"Шрімад-Бхагаватам\".",
    price: "94 грн",
    hasVerse: false,
    coverImage: krishnaSupremePersonCover,
    purchaseUrl: "https://books.krishna.ua/uk/krishna-verhovnyj-bog-osoba/"
  },
  {
    id: "nectar-devotion",
    title: "Нектар відданости",
    description: "Океан нектарних смаків відданого служіння від Шрі Рупи Госвамі.",
    price: "350 грн",
    hasVerse: false,
    coverImage: "/lovable-uploads/3b875002-99ad-4bb7-9e0c-aa933b5780fa.png",
    purchaseUrl: "https://books.krishna.ua/uk/nektar-viddanosti/"
  }
];

export const PrabhupadaBooks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="w-full h-64 md:h-80 lg:h-96 rounded-lg mb-12 overflow-hidden shadow-lg">
          <img 
            src="/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png" 
            alt="Студія звукозапису" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24">
              <img 
                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png" 
                alt="Прабгупада солов'їною" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Книги А.Ч. Бгакті­веданти Свамі Прабгупади</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Переклади ведичних писань з коментарями Його Божественної Милості А.Ч. Бгакті­веданти Свамі Прабгупади
          </p>
        </div>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prabhupadaBooks.map(book => (
              <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden">
                  {book.coverImage && typeof book.coverImage === 'string' && !book.coverImage.includes('placeholder') ? (
                    <Link to={book.verseLink || '#'} className="block w-full h-full">
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </Link>
                  ) : (
                    <Link to={book.verseLink || '#'} className="block w-full h-full">
                      <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                        <div className="text-center p-4">
                          <div className="text-6xl mb-4 text-primary">
                            ॐ
                          </div>
                          <div className="text-lg font-semibold text-foreground/80 line-clamp-3">
                            {book.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-center">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3 text-center font-light">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {book.hasVerse && (
                      <Link to={book.verseLink!}>
                        <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                          <BookOpen className="w-3 h-3 mr-1" />
                          Читати
                        </Badge>
                      </Link>
                    )}
                    <Link to={
                        book.id === 'sb-1-1' ? '/audiobooks/sb' :
                        book.id === 'bg' ? '/audiobooks/bg' :
                        book.id === 'iso' ? '/audiobooks/iso' :
                        '/audio/audiobooks'
                      }>
                      <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors cursor-pointer">
                        <Headphones className="w-3 h-3 mr-1" />
                        Аудіокнига
                      </Badge>
                    </Link>
                    <Badge variant="outline" className="hover:bg-muted transition-colors cursor-pointer">
                      <Link to="/audio/lectures" className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        Лекції
                      </Link>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
