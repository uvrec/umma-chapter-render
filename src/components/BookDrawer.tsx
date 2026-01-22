/**
 * BookDrawer - Context menu for book navigation
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Home,
  BookOpen,
  List,
  PlayCircle,
  User,
  BookText,
  Languages,
  Image,
  Bookmark,
  StickyNote,
  Highlighter,
  Settings,
  Mail,
  Search,
  ChevronRight,
  Heart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface BookDrawerProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
  chapterNumber?: number;
  verseNumber?: string;
  onClose?: () => void;
  // Feature flags for available sections
  hasGlossary?: boolean;
  hasPronunciationGuide?: boolean;
  hasImageGalleries?: boolean;
  hasAuthorPage?: boolean;
  hasDedication?: boolean;
  hasDisciplicSuccession?: boolean;
}

interface DrawerItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
}

const DrawerItem = ({
  icon,
  label,
  href,
  onClick,
  badge,
  disabled,
}: DrawerItemProps) => {
  const baseClasses = cn(
    "flex items-center justify-between w-full px-4 py-3 rounded-lg",
    "text-foreground transition-all duration-200",
    "hover:bg-primary/10 hover:text-primary",
    "active:bg-primary/15",
    disabled && "opacity-50 pointer-events-none"
  );

  const content = (
    <>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {!badge && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={cn(baseClasses, "group")} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={cn(baseClasses, "group")}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export const BookDrawer = ({
  bookTitle,
  bookSlug,
  cantoNumber,
  chapterNumber,
  verseNumber,
  onClose,
  hasGlossary = true,
  hasPronunciationGuide = true,
  hasImageGalleries = true,
  hasAuthorPage = true,
  hasDedication = true,
  hasDisciplicSuccession = true,
}: BookDrawerProps) => {
  const [open, setOpen] = useState(false);
  const { t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleNavigate = (path: string) => {
    navigate(getLocalizedPath(path));
    handleClose();
  };

  // Build base path for the book
  const bookBasePath = getLocalizedPath(`/lib/${bookSlug}`);
  const cantoPath = cantoNumber ? getLocalizedPath(`/lib/${bookSlug}/${cantoNumber}`) : bookBasePath;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 hover:bg-primary/10"
          aria-label={t("Меню книги", "Book menu")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-80 p-0 bg-background border-r border-border"
      >
        {/* Header with book title */}
        <div className="bg-primary text-primary-foreground p-4">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 opacity-80 cursor-pointer hover:opacity-100 transition-opacity" />
            <SheetHeader className="flex-1">
              <SheetTitle className="text-primary-foreground text-lg font-semibold truncate">
                {bookTitle}
              </SheetTitle>
            </SheetHeader>
          </div>
        </div>

        {/* Navigation content */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {/* Main Navigation */}
          <div className="py-2">
            <DrawerItem
              icon={<Home className="h-5 w-5" />}
              label={t("Головна", "Home")}
              href="/"
              onClick={handleClose}
            />

            <DrawerItem
              icon={<BookOpen className="h-5 w-5" />}
              label={t("Обкладинка", "Cover")}
              href={bookBasePath}
              onClick={handleClose}
            />

            <DrawerItem
              icon={<List className="h-5 w-5" />}
              label={t("Зміст", "Table of Contents")}
              href={`${bookBasePath}/contents`}
              onClick={handleClose}
            />

            <DrawerItem
              icon={<PlayCircle className="h-5 w-5" />}
              label={t("Продовжити читання", "Resume reading")}
              onClick={() => {
                // TODO: Implement resume reading logic
                handleClose();
              }}
            />
          </div>

          <Separator className="my-1" />

          {/* Book Resources */}
          <div className="py-2">
            {hasAuthorPage && (
              <DrawerItem
                icon={<User className="h-5 w-5" />}
                label={t("Автор", "The Author")}
                href={`${bookBasePath}/author`}
                onClick={handleClose}
              />
            )}

            {hasDedication && (
              <DrawerItem
                icon={<Heart className="h-5 w-5" />}
                label={t("Посвята", "Dedication")}
                href={`${bookBasePath}/dedication`}
                onClick={handleClose}
              />
            )}

            {hasDisciplicSuccession && (
              <DrawerItem
                icon={<Users className="h-5 w-5" />}
                label={t("Парампара", "Disciplic Succession")}
                href={`${bookBasePath}/disciplic-succession`}
                onClick={handleClose}
              />
            )}

            {hasGlossary && (
              <DrawerItem
                icon={<BookText className="h-5 w-5" />}
                label={t("Глосарій", "Glossary")}
                href={`${bookBasePath}/glossary`}
                onClick={handleClose}
              />
            )}

            {hasPronunciationGuide && (
              <DrawerItem
                icon={<Languages className="h-5 w-5" />}
                label={t("Вимова санскриту", "Pronunciation Guide")}
                href={`${bookBasePath}/pronunciation`}
                onClick={handleClose}
              />
            )}

            {hasImageGalleries && (
              <DrawerItem
                icon={<Image className="h-5 w-5" />}
                label={t("Галерея зображень", "Image Galleries")}
                href={`${bookBasePath}/galleries`}
                onClick={handleClose}
              />
            )}
          </div>

          <Separator className="my-1" />

          {/* User Content */}
          <div className="py-2">
            <DrawerItem
              icon={<Bookmark className="h-5 w-5" />}
              label={t("Закладки", "Bookmarks")}
              href={`${bookBasePath}/bookmarks`}
              onClick={handleClose}
            />

            <DrawerItem
              icon={<StickyNote className="h-5 w-5" />}
              label={t("Нотатки", "Notes")}
              href={`${bookBasePath}/notes`}
              onClick={handleClose}
            />

            <DrawerItem
              icon={<Highlighter className="h-5 w-5" />}
              label={t("Виділення", "Highlights")}
              href={`${bookBasePath}/highlights`}
              onClick={handleClose}
            />
          </div>

          <Separator className="my-1" />

          {/* Settings & Contact */}
          <div className="py-2">
            <DrawerItem
              icon={<Settings className="h-5 w-5" />}
              label={t("Налаштування", "Settings")}
              href={`${bookBasePath}/settings`}
              onClick={handleClose}
            />

            <DrawerItem
              icon={<Mail className="h-5 w-5" />}
              label={t("Зв'язатися з нами", "Contact us")}
              href="/contact"
              onClick={handleClose}
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              © 1966–{new Date().getFullYear()} The Bhaktivedanta Book Trust
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              vedavoice.org
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookDrawer;
