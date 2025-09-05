import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Search, Users, ArrowRight } from "lucide-react";
export const Home = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background with geometric shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
          {/* Geometric decorations */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-secondary/15 blur-3xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-6xl text-primary mb-4">ॐ</div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Прабгупада</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  солов'їною
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Ведична бібліотека з коментарями Бгактіведанти Свамі Прабгупади та ачар'ями
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link to="/library">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Переглянути бібліотеку
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/audiobooks">
                  <Headphones className="w-5 h-5 mr-2" />
                  Аудіокниги
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right side - Visual element */}
          <div className="relative flex justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              {/* Main circle with Om symbol */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 backdrop-blur-sm border border-primary/20">
                
              </div>
              {/* Floating elements */}
              
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-secondary/15 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Сарсті</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">скарб ачар'їв - це їхнє вані</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Library Section */}
            <Card className="group p-6 hover:shadow-lg transition-all cursor-pointer border-0 bg-card/50 backdrop-blur-sm">
              <Link to="/library" className="block">
                <div className="w-full aspect-square mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Бібліотека
                </h3>
                <p className="text-muted-foreground text-sm">
                  Бгагавад-гіта, Шрімад-Бгагаватам та інші класичні тексти з коментарями
                </p>
              </Link>
            </Card>

            {/* Audiobooks Section */}
            <Card className="group p-6 hover:shadow-lg transition-all cursor-pointer border-0 bg-card/50 backdrop-blur-sm">
              <Link to="/audiobooks" className="block">
                <div className="w-full aspect-square mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Headphones className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Аудіокниги
                </h3>
                <p className="text-muted-foreground text-sm">
                  Слухайте священні тексти у виконанні досвідчених наставників
                </p>
              </Link>
            </Card>

            {/* Glossary Section */}
            <Card className="group p-6 hover:shadow-lg transition-all cursor-pointer border-0 bg-card/50 backdrop-blur-sm">
              <Link to="/glossary" className="block">
                <div className="w-full aspect-square mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Search className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Глосарій
                </h3>
                <p className="text-muted-foreground text-sm">
                  Словник санскритських термінів з детальними поясненнями
                </p>
              </Link>
            </Card>

            {/* Community Section */}
            
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">духовний шлях</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">переклади та коментарі авторитетних духовних учителів</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/library">
                  Почати читання
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/donation">
                  Підтримати проект
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>;
};