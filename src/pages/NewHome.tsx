import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { BookOpen, Headphones, Book, ChevronDown, Play, Clock, User } from "lucide-react";
import templeBackground from "@/assets/temple-background.jpg";

export const NewHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - inspired by gaudiobooks.ru */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png)`
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Site Logo and Title */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-64 h-64 md:w-80 md:h-80 mb-4">
                <img 
                  src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png" 
                  alt="Прабгупада солов'їною" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-medium">
              Бібліотека ведичних аудіокниг
            </p>
            
            {/* Verse Quote */}
            <div className="mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20">
              <p className="text-lg md:text-xl italic mb-2 text-white/95">
                Шрімад-Бгаґаватам 1.1.1
              </p>
              <p className="text-base md:text-lg leading-relaxed text-white/90">
                Бесіди про діяння та величність Творця Благих Справ — найдорожче надбання людства.
                У своїх творах великі мудреці з такою досконалістю описали Його діяння, що,
                коли ми слухаємо їх, наш слух виконує своє істинне призначення.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link to="/library">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Переглянути бібліотеку
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Link to="/audiobooks">
                  <Headphones className="w-5 h-5 mr-2" />
                  Аудіокниги
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </section>
      
      {/* Latest Uploads Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Останні завантаження
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Sample audiobook cards - showing only 2 latest */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-12 h-12 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    2 год 15 хв
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  Шрімад-Бгаґаватам 1.1.1-10
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Початок великого епосу ведичної мудрості з коментарями А.Ч. Бгакті­веданти Свамі Прабгупади
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    Прабгупада
                  </div>
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4 mr-1" />
                    Слухати
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-12 h-12 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    1 год 45 хв
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  Бгаґавад-ґіта 2.1-10
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Арджуна на полі битви - початок найвідомішого духовного діалогу в історії людства
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    Прабгупада
                  </div>
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4 mr-1" />
                    Слухати
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Бібліотека</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Повна колекція ведичних текстів з коментарями та перекладами українською мовою
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <Link to="/library">Перейти до бібліотеки</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Аудіокниги</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Слухайте ведичну мудрість у виконанні досвідчених читців та вчителів
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <Link to="/audiobooks">Слухати аудіокниги</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Book className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Глосарій</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Пояснення санскритських термінів та філософських понять
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <Link to="/glossary">Переглянути глосарій</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Почніть свою духовну подорож сьогодні
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Долучайтеся до тисяч людей, які вже відкрили для себе вічну мудрість ведичних писань
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/library">
                Почати читання
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/donation">
                Підтримати проєкт
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};