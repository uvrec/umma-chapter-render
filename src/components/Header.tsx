import { Menu, Search, LogIn, Home, BookOpen, Headphones, User, Book, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
// Fixed NavigationMenu error

export const Header = () => {
  const [open, setOpen] = useState(false);

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
              ведичні писання з коментарями ачар'їв
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
        <div className="mt-4 flex items-center justify-between">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
                <span className="ml-2">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Навігація</SheetTitle>
                <SheetDescription>
                  Оберіть розділ для перегляду
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Головна</span>
                </Link>
                
                <Link 
                  to="/library" 
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Бібліотека</span>
                </Link>
                
                <Link 
                  to="/audiobooks" 
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <Headphones className="w-5 h-5" />
                  <span>Аудіокниги</span>
                </Link>
                
                <Link 
                  to="/glossary" 
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <Book className="w-5 h-5" />
                  <span>Глосарій</span>
                </Link>
                
                <Link 
                  to="/fudokazuki" 
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Fudo Kazuki</span>
                </Link>
                
                <Link 
                  to="/contact" 
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Контакти</span>
                </Link>
                
                <Link 
                  to="/donation" 
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span>Підтримати проєкт</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 max-w-md ml-4">
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