import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Search, Users, ArrowRight } from "lucide-react";
export const Home = () => {
  return <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-teal-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Decorative botanical elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
          <svg width="400" height="600" viewBox="0 0 400 600" className="text-emerald-300">
            {/* Leaf 1 */}
            <path d="M350 150 Q380 180 380 220 Q380 260 350 290 Q320 260 320 220 Q320 180 350 150Z" fill="currentColor" opacity="0.6"/>
            <path d="M350 150 L350 290" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
            
            {/* Leaf 2 */}
            <path d="M300 250 Q340 270 360 310 Q340 350 300 370 Q260 350 240 310 Q260 270 300 250Z" fill="currentColor" opacity="0.5"/>
            <path d="M300 250 L300 370" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            
            {/* Leaf 3 */}
            <path d="M380 350 Q410 380 410 420 Q410 460 380 490 Q350 460 350 420 Q350 380 380 350Z" fill="currentColor" opacity="0.4"/>
            <path d="M380 350 L380 490" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            
            {/* Stems */}
            <path d="M350 150 Q330 200 300 250 Q280 300 350 350 Q370 400 380 450" stroke="currentColor" strokeWidth="3" opacity="0.3" fill="none"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light leading-tight text-white/90 tracking-wide">
              УЯВІТЬ ЖИТТЯ, ВПЛЕТЕНЕ
              <br />
              У БАГАТІ УЗОРИ
              <br />
              <span className="text-emerald-200">ДУХОВНОЇ МУДРОСТІ.</span>
            </h1>
            
            <div className="pt-8">
              <Button size="lg" asChild className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm">
                <Link to="/library" className="flex items-center gap-2">
                  Дізнатися більше
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
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