import { Menu, Search, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Header = () => {
  return (
    <header className="bg-gradient-header shadow-header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-white flex items-center space-x-2">
              <div className="w-10 h-10 bg-islamic-gold rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">U</span>
              </div>
              <span>UMMA.RU</span>
            </div>
            <div className="hidden md:flex text-sm text-white/80">
              достоверно об исламе
            </div>
          </div>

          {/* Banner Ad Placeholder */}
          <div className="hidden lg:flex items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
              <span className="text-islamic-gold font-semibold">Вебинар:</span> Быть и оставаться богатым мусульманином
            </div>
          </div>

          {/* Login Button */}
          <Button variant="islamic" size="sm" className="text-white">
            <LogIn className="w-4 h-4" />
            Войти
          </Button>
        </div>

        {/* Navigation Bar */}
        <div className="mt-4 flex items-center space-x-4">
          <Button variant="menu" size="sm" className="bg-primary/80 hover:bg-primary">
            <Menu className="w-4 h-4" />
            Меню
          </Button>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input 
                placeholder="Поиск..." 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full text-white hover:bg-white/10"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};