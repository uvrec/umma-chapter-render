import {
  Menu,
  Search,
  LogIn,
  Home,
  BookOpen,
  Headphones,
  Book,
  MessageCircle,
  Heart,
  Languages,
  ChevronDown,
  ChevronRight,
  FileText,
  Music,
  Mic,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useState, useRef } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [translationsOpen, setTranslationsOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [prabhupadaOpen, setPrabhupadaOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const handleSearch = () => {
    const value = inputRef.current?.value || "";
    if (value.trim()) {
      navigate(`/glossary?search=${encodeURIComponent(value)}`);
      setOpen(false);
    }
  };

  return (
    <header className="bg-background border-b border-border shadow-header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Desktop search */}
          <div className="flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Input
                ref={inputRef}
                placeholder="Пошук по сайту та глосарію..."
                className="pr-10"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Language Switcher, Theme Toggle, Login and Admin Button */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ua' ? 'en' : 'ua')}
            >
              <Languages className="w-4 h-4 mr-2" />
              {language === 'ua' ? 'УКР' : 'ENG'}
            </Button>
            <ThemeToggle />
            {!user && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-2" />
                  Вхід
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/dashboard">
                  <User className="w-4 h-4 mr-2" />
                  {t('Адмін', 'Admin')}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="mt-4 flex items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Головна
              </Link>
            </Button>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Бібліотека
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-popover">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/library/all"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Всі розділи</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Перегляд усіх книг та розділів
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/library/prabhupada"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Прабгупада</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Твори Шріли Прабгупади
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/library/acharyas"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Ачар'ї</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Книги та коментарі ачар'їв
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Headphones className="w-4 h-4 mr-2" />
                    Аудіо
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-popover">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/audio/audiobooks"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Аудіокниги
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Ведичні писання у форматі аудіокниг
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/audio/lectures"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              <Mic className="w-4 h-4 mr-2" />
                              Лекції
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Духовні лекції та наставлення
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/audio/music"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              <Music className="w-4 h-4 mr-2" />
                              Музика
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Бгаджани та кіртани
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/audio/podcasts"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              <Mic className="w-4 h-4 mr-2" />
                              Подкасти
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Духовні розмови та обговорення
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/glossary">
                <Book className="w-4 h-4 mr-2" />
                Глосарій
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/blog">
                <FileText className="w-4 h-4 mr-2" />
                Блог
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Контакти
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link to="/donation">
                <Heart className="w-4 h-4 mr-2" />
                Підтримати
              </Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Menu className="w-4 h-4" />
                <span className="ml-2">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Навігація</SheetTitle>
                <SheetDescription>Оберіть розділ для перегляду</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {/* Mobile search */}
                <div className="block md:hidden">
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      placeholder="Пошук по сайту та глосарію..."
                      className="pr-10"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={handleSearch}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Link
                  to="/"
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Головна</span>
                </Link>

                <Collapsible open={libraryOpen} onOpenChange={setLibraryOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5" />
                      <span>Бібліотека</span>
                    </div>
                    {libraryOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 space-y-2 mt-2">
                    <Link
                      to="/library"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <span>Всі розділи</span>
                    </Link>
                    <Link
                      to="/library/prabhupada"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <span>Прабгупада</span>
                    </Link>
                    <Link
                      to="/library/acharyas"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <span>Ачар'ї</span>
                    </Link>
                    <Link
                      to="/library/all"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <span>Всі розділи</span>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={audioOpen} onOpenChange={setAudioOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground">
                    <div className="flex items-center space-x-3">
                      <Headphones className="w-5 h-5" />
                      <span>Аудіо</span>
                    </div>
                    {audioOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 space-y-2 mt-2">
                    <Link
                      to="/audio/audiobooks"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>Аудіокниги</span>
                    </Link>
                    <Link
                      to="/audio/lectures"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <Mic className="w-4 h-4 mr-1" />
                      <span>Лекції</span>
                    </Link>
                    <Link
                      to="/audio/music"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <Music className="w-4 h-4 mr-1" />
                      <span>Музика</span>
                    </Link>
                    <Link
                      to="/audio/podcasts"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <Mic className="w-4 h-4 mr-1" />
                      <span>Подкасти</span>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={translationsOpen} onOpenChange={setTranslationsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground">
                    <div className="flex items-center space-x-3">
                      <Languages className="w-5 h-5" />
                      <span>Переклади</span>
                    </div>
                    {translationsOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 space-y-2 mt-2">
                    <Collapsible open={prabhupadaOpen} onOpenChange={setPrabhupadaOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-muted">
                        <span>Прабгупада</span>
                        {prabhupadaOpen ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 space-y-1 mt-1">
                        <Link
                          to="/translations/prabhupada/letters"
                          className="flex items-center space-x-3 px-3 py-1 text-xs rounded-md hover:bg-muted"
                          onClick={() => setOpen(false)}
                        >
                          <span>Листи</span>
                        </Link>
                        <Link
                          to="/translations/prabhupada/lectures"
                          className="flex items-center space-x-3 px-3 py-1 text-xs rounded-md hover:bg-muted"
                          onClick={() => setOpen(false)}
                        >
                          <span>Лекції</span>
                        </Link>
                        <Link
                          to="/translations/prabhupada/books"
                          className="flex items-center space-x-3 px-3 py-1 text-xs rounded-md hover:bg-muted"
                          onClick={() => setOpen(false)}
                        >
                          <span>Книги</span>
                        </Link>
                        <Link
                          to="/translations/prabhupada/photos"
                          className="flex items-center space-x-3 px-3 py-1 text-xs rounded-md hover:bg-muted"
                          onClick={() => setOpen(false)}
                        >
                          <span>Фото</span>
                        </Link>
                      </CollapsibleContent>
                    </Collapsible>
                    <Link
                      to="/translations/aindra-prabhu"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <span>Аіндри прабгу</span>
                    </Link>
                    <Link
                      to="/translations/acharya-books"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <span>Книги ачар'їв</span>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Link
                  to="/glossary"
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <Book className="w-5 h-5" />
                  <span>Глосарій</span>
                </Link>

                <Link
                  to="/blog"
                  className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <FileText className="w-5 h-5" />
                  <span>Блог</span>
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

                {!user && (
                  <Link
                    to="/auth"
                    className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Вхід</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>{t('Адмін', 'Admin')}</span>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
