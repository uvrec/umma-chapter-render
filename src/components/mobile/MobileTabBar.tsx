// src/components/mobile/MobileTabBar.tsx
// Нижня навігаційна панель для мобільних пристроїв

import { useLocation, useNavigate } from "react-router-dom";
import { Book, Headphones, Calendar, Search, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  icon: React.ElementType;
  labelUa: string;
  labelEn: string;
  path: string;
  matchPaths?: string[];
}

const tabs: TabItem[] = [
  {
    id: "library",
    icon: Book,
    labelUa: "Бібліотека",
    labelEn: "Library",
    path: "/library",
    matchPaths: ["/library", "/veda-reader"],
  },
  {
    id: "audio",
    icon: Headphones,
    labelUa: "Аудіо",
    labelEn: "Audio",
    path: "/audio",
    matchPaths: ["/audio", "/audiobooks"],
  },
  {
    id: "calendar",
    icon: Calendar,
    labelUa: "Календар",
    labelEn: "Calendar",
    path: "/calendar",
    matchPaths: ["/calendar"],
  },
  {
    id: "search",
    icon: Search,
    labelUa: "Пошук",
    labelEn: "Search",
    path: "/search",
    matchPaths: ["/search"],
  },
  {
    id: "profile",
    icon: User,
    labelUa: "Профіль",
    labelEn: "Profile",
    path: "/auth",
    matchPaths: ["/auth", "/stats", "/admin"],
  },
];

export function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isActive = (tab: TabItem) => {
    if (tab.matchPaths) {
      return tab.matchPaths.some((p) => location.pathname.startsWith(p));
    }
    return location.pathname === tab.path;
  };

  return (
    <nav className="mobile-tab-bar fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          const label = language === "uk" ? tab.labelUa : tab.labelEn;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
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
