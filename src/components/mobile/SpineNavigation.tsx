// src/components/mobile/SpineNavigation.tsx
// Neu Bible-style spine (sidebar) navigation for mobile
// Мінімалістична бокова панель: тільки 4 іконки, свайп для навігації

import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  List,
  Type,
  Search,
  Settings,
  Highlighter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { SpineTypographyPanel } from "./SpineTypographyPanel";
import { SpineSearchOverlay } from "./SpineSearchOverlay";
import { SpineSettingsPanel } from "./SpineSettingsPanel";
import { SpineTocPanel } from "./SpineTocPanel";
import { SpineHighlightsPanel } from "./SpineHighlightsPanel";

type SpinePanel = "none" | "toc" | "typography" | "search" | "settings" | "highlights";

// Spine color themes (like Neu Bible)
const SPINE_THEMES = [
  {
    id: "amber",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    accent: "amber",
  },
  {
    id: "coral",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    accent: "rose",
  },
  {
    id: "teal",
    gradient: "from-teal-400 via-emerald-500 to-green-600",
    accent: "teal",
  },
  {
    id: "purple",
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    accent: "purple",
  },
  {
    id: "ocean",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    accent: "blue",
  },
] as const;

const SPINE_THEME_STORAGE_KEY = "vv_spine_theme";

interface SpineNavigationProps {
  /** Current book ID for TOC navigation */
  bookId?: string;
  /** Callback when spine visibility changes */
  onVisibilityChange?: (isVisible: boolean) => void;
}

const SPINE_HIDDEN_STORAGE_KEY = "vv_spine_hidden";

export function SpineNavigation({
  bookId,
  onVisibilityChange,
}: SpineNavigationProps) {
  const [activePanel, setActivePanel] = useState<SpinePanel>("none");
  const location = useLocation();
  const { language, t } = useLanguage();

  // Spine theme state
  const [spineThemeIndex, setSpineThemeIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem(SPINE_THEME_STORAGE_KEY);
    const idx = saved ? parseInt(saved, 10) : 0;
    return isNaN(idx) ? 0 : idx % SPINE_THEMES.length;
  });

  // Spine hidden state (swipe left to hide)
  const [isHidden, setIsHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SPINE_HIDDEN_STORAGE_KEY) === "true";
  });

  // Swipe tracking - both X and Y
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const spineTheme = SPINE_THEMES[spineThemeIndex];

  // Save theme preference
  useEffect(() => {
    localStorage.setItem(SPINE_THEME_STORAGE_KEY, String(spineThemeIndex));
  }, [spineThemeIndex]);

  // Save hidden state and notify parent
  useEffect(() => {
    localStorage.setItem(SPINE_HIDDEN_STORAGE_KEY, String(isHidden));
    onVisibilityChange?.(!isHidden);
  }, [isHidden, onVisibilityChange]);

  // Handle swipe on spine
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchEndX - touchStartX.current;
    const threshold = 50; // minimum swipe distance

    // Check if it's more of a horizontal or vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      // Horizontal swipe
      if (deltaX < 0) {
        // Swipe LEFT - hide the spine
        setIsHidden(true);
      } else {
        // Swipe RIGHT - show highlights panel
        setActivePanel("highlights");
      }
    } else if (Math.abs(deltaY) > threshold) {
      // Vertical swipe - change theme
      if (deltaY > 0) {
        // Swipe up - next theme
        setSpineThemeIndex((prev) => (prev + 1) % SPINE_THEMES.length);
      } else {
        // Swipe down - previous theme
        setSpineThemeIndex((prev) =>
          prev === 0 ? SPINE_THEMES.length - 1 : prev - 1
        );
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  // Handle tap on screen edge to show spine when hidden
  const handleEdgeTap = useCallback(() => {
    if (isHidden) {
      setIsHidden(false);
    }
  }, [isHidden]);

  const togglePanel = useCallback((panel: SpinePanel) => {
    setActivePanel((current) => (current === panel ? "none" : panel));
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel("none");
  }, []);

  // Spine buttons configuration - only 4 essential buttons like Neu Bible
  const spineButtons = [
    {
      id: "toc",
      icon: List,
      label: t("Зміст", "Contents"),
      onClick: () => togglePanel("toc"),
      active: activePanel === "toc",
    },
    {
      id: "typography",
      icon: Type,
      label: t("Типографіка", "Typography"),
      onClick: () => togglePanel("typography"),
      active: activePanel === "typography",
    },
    {
      id: "search",
      icon: Search,
      label: t("Пошук", "Search"),
      onClick: () => togglePanel("search"),
      active: activePanel === "search",
    },
    {
      id: "highlights",
      icon: Highlighter,
      label: t("Виділення", "Highlights"),
      onClick: () => togglePanel("highlights"),
      active: activePanel === "highlights",
      show: true,
    },
    {
      id: "settings",
      icon: Settings,
      label: t("Налаштування", "Settings"),
      onClick: () => togglePanel("settings"),
      active: activePanel === "settings",
    },
  ];

  return (
    <>
      {/* Edge tap area to show spine when hidden */}
      {isHidden && (
        <div
          className="fixed left-0 top-0 bottom-0 w-4 z-50"
          onClick={handleEdgeTap}
          onTouchEnd={handleEdgeTap}
          aria-label={t("Показати навігацію", "Show navigation")}
        />
      )}

      {/* Main Spine Bar - clean minimal design like Neu Bible - LEFT side */}
      <nav
        className={cn(
          "spine-navigation fixed left-0 top-0 bottom-0 z-50",
          "w-14 flex flex-col items-center justify-center",
          "bg-gradient-to-b",
          spineTheme.gradient,
          "shadow-lg safe-left transition-all duration-300",
          isHidden ? "-translate-x-full" : "translate-x-0"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={t("Бокова навігація", "Spine navigation")}
      >
        {/* Only 4 main action buttons - centered vertically */}
        <div className="flex flex-col items-center gap-4">
          {spineButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={btn.onClick}
                className={cn(
                  "spine-btn w-11 h-11 flex items-center justify-center",
                  "rounded-full transition-all duration-200",
                  btn.active
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                aria-label={btn.label}
                aria-pressed={btn.active}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Panels that slide in from the left */}

      {/* TOC / Book List */}
      <SpineTocPanel
        open={activePanel === "toc"}
        onClose={closePanel}
        currentBookId={bookId}
      />

      {/* Typography Panel */}
      <SpineTypographyPanel
        open={activePanel === "typography"}
        onClose={closePanel}
      />

      {/* Search Overlay */}
      <SpineSearchOverlay
        open={activePanel === "search"}
        onClose={closePanel}
      />

      {/* Settings Panel */}
      <SpineSettingsPanel
        open={activePanel === "settings"}
        onClose={closePanel}
      />

      {/* Highlights Panel - REMEMBER BETTER */}
      <SpineHighlightsPanel
        open={activePanel === "highlights"}
        onClose={closePanel}
      />
    </>
  );
}

export default SpineNavigation;
