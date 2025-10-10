// Header.tsx — збільшене лого (×4), охайні навігаційні кнопки з прозорим бекґраундом і бордером лише при hover

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

  // спільний клас для спокійних «прозорих» кнопок із бордером лише при hover
  const navBtn = "hover:bg-foreground/5 hover:border hover:border-foreground/20 transition-colors";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md shadow-header">
      <div className="container mx-auto px-4 py-4">
        {/* Logo */}
        <div className="mb-4 flex items-center justify-center">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png"
              alt="Vedavoice"
              className="h-64 w-auto object-contain" // було h-16 — тепер ×4
            />
          </Link>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 md:flex">
            <Button variant="ghost" size="sm" asChild className={navBtn}>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Головна
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild className={navBtn}>
              <Link to="/library">
                <BookOpen className="mr-2 h-4 w-4" />
                Бібліотека
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild className={navBtn}>
              <Link to="/glossary">
                <Book className="mr-2 h-4 w-4" />
                Глосарій
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild className={navBtn}>
              <Link to="/blog">
                <FileText className="mr-2 h-4 w-4" />
                Блог
              </Link>
            </Button>
          </nav>

          {/* Desktop Controls */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {!user && (
              <Button variant="outline" size="sm" asChild className={navBtn}>
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Вхід
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="outline" size="sm" asChild className={navBtn}>
                <Link to="/admin/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  {t("Адмін", "Admin")}
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
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
                  className="flex items-center space-x-3 rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                  onClick={() => setOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Головна</span>
                </Link>

                <Link
                  to="/library"
                  className="flex items-center space-x-3 rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                  onClick={() => setOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Бібліотека</span>
                </Link>

                <Collapsible open={translationsOpen} onOpenChange={setTranslationsOpen}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20">
                    <div className="flex items-center space-x-3">
                      <Languages className="h-5 w-5" />
                      <span>Переклади</span>
                    </div>
                    {translationsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CollapsibleTrigger>

                  <CollapsibleContent className="ml-6 mt-2 space-y-2">
                    <Collapsible open={prabhupadaOpen} onOpenChange={setPrabhupadaOpen}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20">
                        <span>Прабгупада</span>
                        {prabhupadaOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </CollapsibleTrigger>

                      <CollapsibleContent className="ml-4 mt-1 space-y-1">
                        <Link
                          to="/translations/prabhupada/letters"
                          className="flex items-center space-x-3 rounded-md px-3 py-1 text-xs transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                          onClick={() => setOpen(false)}
                        >
                          <span>Листи</span>
                        </Link>
                        <Link
                          to="/translations/prabhupada/lectures"
                          className="flex items-center space-x-3 rounded-md px-3 py-1 text-xs transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                          onClick={() => setOpen(false)}
                        >
                          <span>Лекції</span>
                        </Link>
                        <Link
                          to="/translations/prabhupada/books"
                          className="flex items-center space-x-3 rounded-md px-3 py-1 text-xs transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                          onClick={() => setOpen(false)}
                        >
                          <span>Книги</span>
                        </Link>
                        <Link
                          to="/translations/prabhupada/photos"
                          className="flex items-center space-x-3 rounded-md px-3 py-1 text-xs transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                          onClick={() => setOpen(false)}
                        >
                          <span>Фото</span>
                        </Link>
                      </CollapsibleContent>
                    </Collapsible>

                    <Link
                      to="/translations/aindra-prabhu"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                      onClick={() => setOpen(false)}
                    >
                      <span>Аіндри прабгу</span>
                    </Link>

                    <Link
                      to="/translations/acharya-books"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                      onClick={() => setOpen(false)}
                    >
                      <span>Книги ачар'їв</span>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Link
                  to="/glossary"
                  className="flex items-center space-x-3 rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                  onClick={() => setOpen(false)}
                >
                  <Book className="h-5 w-5" />
                  <span>Глосарій</span>
                </Link>

                <Link
                  to="/blog"
                  className="flex items-center space-x-3 rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                  onClick={() => setOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span>Блог</span>
                </Link>

                <Link
                  to="/contact"
                  className="flex items-center space-x-3 rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Контакти</span>
                </Link>

                <Link
                  to="/donation"
                  className="flex items-center space-x-3 rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                  onClick={() => setOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  <span>Підтримати проєкт</span>
                </Link>

                {!user && (
                  <Link
                    to="/auth"
                    className="flex items-center space-x-3 rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                    onClick={() => setOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Вхід</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-3 rounded-md px-3 py-3 text-foreground transition-colors hover:bg-foreground/5 hover:border hover:border-foreground/20"
                    onClick={() => setOpen(false)}
                  >
                    <User className="h-5 w-5" />
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
