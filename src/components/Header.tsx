import {
  Menu,
  LogIn,
  Home,
  BookOpen,
  Book,
  MessageCircle,
  Heart,
  Languages,
  ChevronDown,
  ChevronRight,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [translationsOpen, setTranslationsOpen] = useState(false);
  const [prabhupadaOpen, setPrabhupadaOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md shadow-header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Theme Toggle, Login and Admin Button */}
          <div className="flex items-center gap-2 ml-4">
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
                  {t("Адмін", "Admin")}
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

            <Button variant="ghost" size="sm" asChild>
              <Link to="/library">
                <BookOpen className="w-4 h-4 mr-2" />
                Бібліотека
              </Link>
            </Button>

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

                <Collapsible open={translationsOpen} onOpenChange={setTranslationsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 rounded-md hover:bg-muted transition-colors text-foreground">
                    <div className="flex items-center space-x-3">
                      <Languages className="w-5 h-5" />
                      <span>Переклади</span>
                    </div>
                    {translationsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 space-y-2 mt-2">
                    <Collapsible open={prabhupadaOpen} onOpenChange={setPrabhupadaOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-muted">
                        <span>Прабгупада</span>
                        {prabhupadaOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
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
                    <span>{t("Адмін", "Admin")}</span>
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
