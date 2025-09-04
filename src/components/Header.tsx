import { Menu, Search, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Header = () => {
  return (
    <header className="bg-background border-b border-border shadow-header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <div className="w-10 h-10 bg-secondary border border-border rounded-md flex items-center justify-center">
                <span className="text-primary font-bold text-lg">🕉️</span>
              </div>
              <span>Прабгупада солов'їною</span>
            </div>
            <div className="hidden md:flex text-sm text-muted-foreground">
              ведичні писання з коментарями
            </div>
          </div>

          {/* Banner Ad Placeholder */}
          <div className="hidden lg:flex items-center">
            <div className="bg-secondary border border-border rounded-md px-4 py-2 text-foreground text-sm">
              <span className="text-primary font-semibold">Освіта:</span> Духовне знання для сучасного світу
            </div>
          </div>

          {/* Login Button */}
          <Button variant="outline" size="sm">
            <LogIn className="w-4 h-4" />
            Увійти
          </Button>
        </div>

        {/* Navigation Bar */}
        <div className="mt-4 flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Menu className="w-4 h-4" />
            Меню
          </Button>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input 
                placeholder="Пошук..." 
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full"
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