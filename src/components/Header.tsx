import { Menu, Search, LogIn, Home, BookOpen, Headphones, User, Book, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
        <div className="mt-4 flex items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList className="flex-wrap gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <Home className="w-4 h-4" />
                    <span>Головна</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/library" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <BookOpen className="w-4 h-4" />
                    <span>Пояснення</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/audiobooks" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <Headphones className="w-4 h-4" />
                    <span>Аудіокниги</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/fudokazuki" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <User className="w-4 h-4" />
                    <span>Fudo Kazuki</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/glossary" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <Book className="w-4 h-4" />
                    <span>Глосарій</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/contact" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>Контакти</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/donation" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>Підтримати проєкт</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
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