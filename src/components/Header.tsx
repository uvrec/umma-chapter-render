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
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-foreground flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png"
                  alt="Прабгупада Солов'їною"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
            <div className="hidden md:flex text-sm text-muted-foreground">
              ведичні писання з коментарями ачар'їв
            </div>
          </div>

          {/* Banner Ad Placeholder */}
          <div className="hidden lg:flex items-center">
            <div className="bg-secondary border border-border rounded-md px-4 py-2 text-foreground text-sm">
              <span className="text-primary font-semibold">Освіта:</span>{" "}
              Духовне знання для сучасного світу
            </div>
          </div>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
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

          {/* Language Switcher, Theme Toggle and Auth Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ua' ? 'en' : 'ua')}
            >
              <Languages className="w-4 h-4 mr-2" />
              {language === 'ua' ? 'УКР' : 'ENG'}
            </Button>
            <ThemeToggle />
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/dashboard">
                      <User className="w-4 h-4 mr-2" />
                      {t('Адмін', 'Admin')}
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('Вхід', 'Login')}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="mt-4 flex items-center justify-between">
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
                      to="/library/other"
                      className="flex items-center space-x-3 px-3 py-2 text-sm rounded-md hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      <span>Інше</span>
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
