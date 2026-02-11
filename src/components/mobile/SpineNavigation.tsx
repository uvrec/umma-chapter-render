// src/components/mobile/SpineNavigation.tsx
// Neu Bible-style spine (sidebar) navigation for mobile
// Мінімалістична бокова панель: 4 іконки, drag для Timeline, свайп для тем

import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  List,
  Type,
  Search,
  Settings,
  ChevronUp,
  ChevronDown,
  X,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { useMobileReading } from "@/contexts/MobileReadingContext";
import { SpineTypographyPanel } from "./SpineTypographyPanel";
import { SpineSearchOverlay } from "./SpineSearchOverlay";
import { SpineSettingsPanel } from "./SpineSettingsPanel";
import { SpineTocPanel } from "./SpineTocPanel";
import { SpineHighlightsPanel } from "./SpineHighlightsPanel";

type SpinePanel = "none" | "toc" | "typography" | "search" | "settings";

// Spine themes mapped to app themes (mobile only: craft, nord, solarized-light, solarized-dark)
const SPINE_THEME_MAP = [
  { id: "craft", appTheme: "craft" as const, gradient: "from-amber-400 via-orange-500 to-red-500" },
  { id: "nord", appTheme: "nord" as const, gradient: "from-teal-400 via-cyan-500 to-blue-500" },
  { id: "solarized-light", appTheme: "solarized-light" as const, gradient: "from-pink-400 via-rose-500 to-red-500" },
  { id: "solarized-dark", appTheme: "solarized-dark" as const, gradient: "from-emerald-400 via-teal-500 to-cyan-600" },
] as const;

const SPINE_THEME_STORAGE_KEY = "vv_spine_theme";

interface SpineNavigationProps {
  /** Current book ID for TOC navigation */
  bookId?: string;
  /** Callback when spine visibility changes */
  onVisibilityChange?: (isVisible: boolean) => void;
}

export function SpineNavigation({
  bookId,
  onVisibilityChange,
}: SpineNavigationProps) {
  const [activePanel, setActivePanel] = useState<SpinePanel>("none");
  const location = useLocation();
  const navigate = useNavigate();
  const { t, getLocalizedPath } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isFullscreen, exitFullscreen } = useMobileReading();

  // Find current theme index based on app theme
  const getCurrentThemeIndex = useCallback(() => {
    const idx = SPINE_THEME_MAP.findIndex(t => t.appTheme === theme);
    return idx >= 0 ? idx : 0;
  }, [theme]);

  const [spineThemeIndex, setSpineThemeIndex] = useState(getCurrentThemeIndex);

  // Sync spine theme with app theme
  useEffect(() => {
    setSpineThemeIndex(getCurrentThemeIndex());
  }, [theme, getCurrentThemeIndex]);

  // Drag state for Timeline reveal
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const spineTheme = SPINE_THEME_MAP[spineThemeIndex];
  const isSettingsMode = activePanel === "settings";

  // Change theme (both Spine and App)
  const changeTheme = useCallback((direction: "up" | "down") => {
    const newIndex = direction === "up"
      ? (spineThemeIndex + 1) % SPINE_THEME_MAP.length
      : spineThemeIndex === 0 ? SPINE_THEME_MAP.length - 1 : spineThemeIndex - 1;

    setSpineThemeIndex(newIndex);
    setTheme(SPINE_THEME_MAP[newIndex].appTheme);
    localStorage.setItem(SPINE_THEME_STORAGE_KEY, String(newIndex));
  }, [spineThemeIndex, setTheme]);

  // Handle touch start - reset drag state to prevent stuck isDragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setDragX(0);
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  // Handle touch move - for horizontal drag
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || isSettingsMode) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX.current;

    // Only start dragging if moving right
    if (deltaX > 20) {
      setIsDragging(true);
      // Limit drag to screen width minus spine width
      const maxDrag = window.innerWidth - 56;
      setDragX(Math.min(maxDrag, Math.max(0, deltaX)));
    }
  };

  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchStartY.current ? touchEndY - touchStartY.current : 0;

    // If was dragging horizontally
    if (isDragging) {
      // If dragged more than half screen, show timeline
      if (deltaX > window.innerWidth / 2) {
        setShowTimeline(true);
        setDragX(window.innerWidth - 56); // Spine to right edge
      } else {
        setDragX(0); // Snap back
        setShowTimeline(false);
      }
      setIsDragging(false);
    }
    // If in settings mode, check for vertical swipe
    else if (isSettingsMode && Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < 0) {
        changeTheme("down"); // Swipe down = previous theme
      } else {
        changeTheme("up"); // Swipe up = next theme
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Close timeline and return spine to left
  const closeTimeline = useCallback(() => {
    setShowTimeline(false);
    setDragX(0);
  }, []);

  const togglePanel = useCallback((panel: SpinePanel) => {
    setActivePanel((current) => (current === panel ? "none" : panel));
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel("none");
  }, []);

  // Notify parent about visibility (hidden when fullscreen)
  useEffect(() => {
    onVisibilityChange?.(!isFullscreen);
  }, [isFullscreen, onVisibilityChange]);

  // When exiting fullscreen, open TOC panel automatically
  const handleExitFullscreen = useCallback(() => {
    exitFullscreen();
    setActivePanel("toc");
  }, [exitFullscreen]);

  // Spine buttons configuration - only 4 buttons
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
      id: "audio",
      icon: Headphones,
      label: t("Аудіо", "Audio"),
      onClick: () => navigate(getLocalizedPath("/audio")),
      active: location.pathname.includes("/audio"),
    },
    {
      id: "settings",
      icon: Settings,
      label: t("Налаштування", "Settings"),
      onClick: () => togglePanel("settings"),
      active: activePanel === "settings",
    },
  ];

  // Calculate spine position (hidden when fullscreen)
  const spineStyle: React.CSSProperties = {
    transform: isFullscreen
      ? "translateX(-100%)"
      : dragX > 0
        ? `translateX(${dragX}px)`
        : undefined,
    transition: isDragging ? "none" : "transform 300ms ease-out",
  };

  // Don't render panels when in fullscreen mode
  if (isFullscreen) {
    return (
      <nav
        className={cn(
          "spine-navigation fixed left-0 top-0 bottom-0 z-50",
          "w-14 flex flex-col items-center justify-center",
          "bg-gradient-to-b",
          spineTheme.gradient,
          "shadow-lg safe-left"
        )}
        style={spineStyle}
        aria-label={t("Бокова навігація", "Spine navigation")}
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      {/* Timeline panel (behind Spine, revealed when dragging right) */}
      <div
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 bg-background",
          "transition-opacity duration-300",
          (showTimeline || dragX > 50) ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ width: dragX > 0 ? `${dragX}px` : showTimeline ? `calc(100% - 56px)` : 0 }}
        onClick={closeTimeline}
      >
        {(showTimeline || dragX > 100) && (
          <SpineHighlightsPanel
            open={true}
            onClose={closeTimeline}
          />
        )}
      </div>

      {/* Main Spine Bar */}
      <nav
        className={cn(
          "spine-navigation fixed left-0 top-0 bottom-0 z-50",
          "w-14 flex flex-col items-center justify-center",
          "bg-gradient-to-b",
          spineTheme.gradient,
          "shadow-lg safe-left"
        )}
        style={spineStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label={t("Бокова навігація", "Spine navigation")}
      >
        {/* Settings mode: only theme arrows + X */}
        {isSettingsMode ? (
          <div className="flex flex-col items-center justify-between h-full py-8">
            {/* Theme up button */}
            <button
              onClick={() => changeTheme("up")}
              className="spine-btn w-11 h-11 flex items-center justify-center
                text-white/60 hover:text-white hover:bg-white/10
                rounded-full transition-colors"
              aria-label={t("Наступна тема", "Next theme")}
            >
              <ChevronUp className="h-6 w-6" />
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Theme down button */}
            <button
              onClick={() => changeTheme("down")}
              className="spine-btn w-11 h-11 flex items-center justify-center
                text-white/60 hover:text-white hover:bg-white/10
                rounded-full transition-colors"
              aria-label={t("Попередня тема", "Previous theme")}
            >
              <ChevronDown className="h-6 w-6" />
            </button>

            {/* Close button */}
            <button
              onClick={closePanel}
              className="spine-btn w-11 h-11 flex items-center justify-center
                text-white/80 hover:text-white hover:bg-white/10
                rounded-full transition-colors mt-4"
              aria-label={t("Закрити", "Close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* Normal mode: 4 action buttons */
          <div className="flex flex-col items-center gap-6 mt-auto mb-24">
            {spineButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.id}
                  onClick={btn.onClick}
                  className={cn(
                    "spine-btn w-12 h-12 flex items-center justify-center",
                    "rounded-full transition-all duration-200",
                    btn.active
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                  aria-label={btn.label}
                  aria-pressed={btn.active}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </button>
              );
            })}
          </div>
        )}
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
    </>
  );
}

export default SpineNavigation;
