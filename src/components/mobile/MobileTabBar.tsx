// src/components/mobile/MobileTabBar.tsx
// Нижня навігаційна панель для мобільних пристроїв

import { useLocation, useNavigate } from "react-router-dom";
import { Home, Book, Headphones, Calendar, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

interface TabItem {
  id: string;
  icon: React.ElementType;
  labelUk: string;
  labelEn: string;
  basePath: string; // Base path without language prefix
  matchPaths?: string[]; // Paths to match (without language prefix)
  exactMatch?: boolean;
  nonLocalized?: boolean; // For paths like /auth that don't have language prefix
}

const tabs: TabItem[] = [
  {
    id: "home",
    icon: Home,
    labelUk: "Головна",
    labelEn: "Home",
    basePath: "/",
    exactMatch: true,
  },
  {
    id: "library",
    icon: Book,
    labelUk: "Бібліотека",
    labelEn: "Library",
    basePath: "/library",
    matchPaths: ["/library", "/lib", "/veda-reader"],
  },
  {
    id: "audio",
    icon: Headphones,
    labelUk: "Аудіо",
    labelEn: "Audio",
    basePath: "/audio",
    matchPaths: ["/audio", "/audiobooks"],
  },
  {
    id: "calendar",
    icon: Calendar,
    labelUk: "Календар",
    labelEn: "Calendar",
    basePath: "/calendar",
    matchPaths: ["/calendar"],
  },
  {
    id: "profile",
    icon: User,
    labelUk: "Профіль",
    labelEn: "Profile",
    basePath: "/auth",
    matchPaths: ["/auth", "/stats", "/admin", "/search"],
    nonLocalized: true, // /auth doesn't have language prefix
  },
];

export function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, getLocalizedPath } = useLanguage();
  const { selection } = useHapticFeedback();

  // Remove language prefix from pathname for matching
  const getPathWithoutLang = (pathname: string) => {
    const match = pathname.match(/^\/(uk|en)(\/.*)?$/);
    return match ? (match[2] || '/') : pathname;
  };

  const pathWithoutLang = getPathWithoutLang(location.pathname);

  const isActive = (tab: TabItem) => {
    // For non-localized paths, check original pathname
    if (tab.nonLocalized) {
      if (tab.matchPaths) {
        return tab.matchPaths.some((p) => location.pathname.startsWith(p));
      }
      return location.pathname === tab.basePath;
    }

    // For localized paths, check path without language prefix
    if (tab.exactMatch) {
      return pathWithoutLang === '/' || pathWithoutLang === '';
    }
    if (tab.matchPaths) {
      return tab.matchPaths.some((p) => pathWithoutLang.startsWith(p));
    }
    return pathWithoutLang === tab.basePath;
  };

  const getTabPath = (tab: TabItem) => {
    if (tab.nonLocalized) {
      return tab.basePath;
    }
    return getLocalizedPath(tab.basePath);
  };

  return (
    <nav className="mobile-tab-bar fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          const label = language === "uk" ? tab.labelUk : tab.labelEn;

          return (
            <button
              key={tab.id}
              onClick={() => { selection(); navigate(getTabPath(tab)); }}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 px-2 transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-transform",
                  active && "scale-110"
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1 font-medium truncate max-w-[64px]",
                  active && "font-semibold"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileTabBar;
