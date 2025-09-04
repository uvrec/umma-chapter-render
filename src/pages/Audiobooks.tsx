import { Header } from "@/components/Header";
import { Headphones, Play, ChevronDown, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const Audiobooks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/30" />
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              <span className="block text-foreground mb-2">Почуйте</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Вічну Мудрість
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Зануртеся у світ ведичних писань через аудіозаписи з коментарями 
              Шріли Прабгупади та інших ачар'їв
            </p>
            
            {/* CTA Button */}
            <div className="pt-4">
              <Button size="lg" className="px-8 py-6 text-lg">
                <Volume2 className="w-5 h-5 mr-2" />
                Почати слухати
              </Button>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2 text-muted-foreground">
              <span className="text-sm">Прокрутіть донизу</span>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Audiobooks Grid */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Колекція аудіокниг</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Відкрийте для себе найглибші духовні істини через голос досвідчених наставників
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 group">
              <Link to="/audiobooks/bhagavad-gita" className="block">
                <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden group-hover:ring-2 group-hover:ring-primary transition-all cursor-pointer">
                  <img 
                    src="/src/assets/bhagavad-gita.jpg" 
                    alt="Бгагавад-гіта обкладинка" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Бгагавад-гіта як вона є
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Повна аудіоверсія з коментарями Шріли Прабгупади
                </p>
              </Link>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/audiobooks/bhagavad-gita">
                  <Play className="w-4 h-4 mr-2" />
                  Слухати
                </Link>
              </Button>
            </Card>
            
            <Card className="p-6 group">
              <Link to="/audiobooks/srimad-bhagavatam" className="block">
                <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden group-hover:ring-2 group-hover:ring-primary transition-all cursor-pointer">
                  <img 
                    src="/src/assets/srimad-bhagavatam-1.webp" 
                    alt="Шрімад-Бгагаватам обкладинка" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Шрімад-Бгагаватам
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Аудіозаписи перших пісень з детальними поясненнями
                </p>
              </Link>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/audiobooks/srimad-bhagavatam">
                  <Play className="w-4 h-4 mr-2" />
                  Слухати
                </Link>
              </Button>
            </Card>

            <Card className="p-6 group">
              <Link to="/audiobooks/sri-isopanishad" className="block">
                <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden group-hover:ring-2 group-hover:ring-primary transition-all cursor-pointer">
                  <img 
                    src="/src/assets/small-book-icon.webp" 
                    alt="Шрі Ішопанішада обкладинка" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Шрі Ішопанішада
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Аудіоверсія священного тексту з коментарями
                </p>
              </Link>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/audiobooks/sri-isopanishad">
                  <Play className="w-4 h-4 mr-2" />
                  Слухати
                </Link>
              </Button>
            </Card>

            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/small-book-icon.webp" 
                  alt="Раджа-відя обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Раджа-відя - найшляхетніше знання</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Лекції про найвище знання та духовну реалізацію
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>

            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/small-book-icon.webp" 
                  alt="Нектар настанов обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Нектар настанов</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Практичні настанови для духовного розвитку
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>

            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/small-book-icon.webp" 
                  alt="Наука самоусвідомлення обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Наука самоусвідомлення</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Наукові принципи духовного пізнання
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>

            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/small-book-icon.webp" 
                  alt="Досконалі питання, досконалі відповіді обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Досконалі питання, досконалі відповіді</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Діалоги про найважливіші духовні теми
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>

            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/small-book-icon.webp" 
                  alt="Пісні ачар'їв-вайшнавів обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Пісні ачар'їв-вайшнавів</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Духовні пісні великих вчителів минулого
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>

            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/small-book-icon.webp" 
                  alt="Подорож самопізнання обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Подорож самопізнання</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Етапи духовного розвитку та самопізнання
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>

            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/small-book-icon.webp" 
                  alt="Чайтанья-чарітамріта обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Чайтанья-чарітамріта</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Життєпис Господа Чайтаньї та Його вчення
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};