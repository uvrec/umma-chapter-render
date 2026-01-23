// src/components/mobile/SpineNavigation.tsx
// Neu Bible-style spine (sidebar) navigation for mobile
// Бокова навігаційна панель з іконками для доступу до ключових функцій

import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  List,
  Type,
  Search,
  Settings,
  Clock,
  ChevronUp,
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMobileReading } from "@/contexts/MobileReadingContext";
import { SpineTypographyPanel } from "./SpineTypographyPanel";
import { SpineSearchOverlay } from "./SpineSearchOverlay";
import { SpineSettingsPanel } from "./SpineSettingsPanel";
import { SpineTocPanel } from "./SpineTocPanel";

type SpinePanel = "none" | "toc" | "typography" | "search" | "settings";

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
  /** Show timeline button */
  showTimeline?: boolean;
  /** Show navigation arrows */
  showNavArrows?: boolean;
  /** Callback when navigating to previous chapter/verse */
  onPrevious?: () => void;
  /** Callback when navigating to next chapter/verse */
  onNext?: () => void;
  /** Whether we're on a reader page */
  isReaderPage?: boolean;
}

export function SpineNavigation({
  bookId,
  showTimeline = true,
  showNavArrows = false,
  onPrevious,
  onNext,
  isReaderPage = false,
}: SpineNavigationProps) {
  const [activePanel, setActivePanel] = useState<SpinePanel>("none");
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, getLocalizedPath, t } = useLanguage();
  const { isFullscreen, exitFullscreen, shouldOpenSearch, resetSearchTrigger } = useMobileReading();

  // Spine theme state
  const [spineThemeIndex, setSpineThemeIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem(SPINE_THEME_STORAGE_KEY);
    const idx = saved ? parseInt(saved, 10) : 0;
    return isNaN(idx) ? 0 : idx % SPINE_THEMES.length;
  });

  // Swipe tracking
  const touchStartY = useRef<number | null>(null);
  const spineTheme = SPINE_THEMES[spineThemeIndex];

  // Save theme preference
  useEffect(() => {
    localStorage.setItem(SPINE_THEME_STORAGE_KEY, String(spineThemeIndex));
  }, [spineThemeIndex]);

  // Open search when triggered by double-tap
  useEffect(() => {
    if (shouldOpenSearch) {
      setActivePanel("search");
      resetSearchTrigger();
    }
  }, [shouldOpenSearch, resetSearchTrigger]);

  // Handle swipe on spine to change theme
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const threshold = 50; // minimum swipe distance

    if (Math.abs(deltaY) > threshold) {
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
  };

  const togglePanel = useCallback((panel: SpinePanel) => {
    setActivePanel((current) => (current === panel ? "none" : panel));
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel("none");
  }, []);

  const handleTimelineClick = () => {
    navigate(getLocalizedPath("/timeline"));
  };

  // Spine buttons configuration
  const spineButtons = [
    {
      id: "toc",
      icon: List,
      label: t("Зміст", "Contents"),
      onClick: () => togglePanel("toc"),
      active: activePanel === "toc",
      show: true,
    },
    {
      id: "typography",
      icon: Type,
      label: t("Типографіка", "Typography"),
      onClick: () => togglePanel("typography"),
      active: activePanel === "typography",
      show: true,
    },
    {
      id: "search",
      icon: Search,
      label: t("Пошук", "Search"),
      onClick: () => togglePanel("search"),
      active: activePanel === "search",
      show: true,
    },
    {
      id: "settings",
      icon: Settings,
      label: t("Налаштування", "Settings"),
      onClick: () => togglePanel("settings"),
      active: activePanel === "settings",
      show: true,
    },
  ];

  // Don't render if collapsed (manual) or fullscreen reading mode
  if (!isExpanded || isFullscreen) {
    return (
      <button
        onClick={() => {
          setIsExpanded(true);
          exitFullscreen();
        }}
        className={cn(
          "fixed left-0 top-1/2 -translate-y-1/2 z-[60]",
          "w-2 h-20 bg-brand-500 rounded-r-full",
          "hover:w-3 transition-all duration-300",
          "active:bg-brand-600",
          isFullscreen ? "opacity-30 hover:opacity-60" : "opacity-100"
        )}
        aria-label={t("Відкрити навігацію", "Open navigation")}
      />
    );
  }

  return (
    <>
      {/* Main Spine Bar - on the LEFT side */}
      <nav
        className={cn(
          "spine-navigation fixed left-0 top-0 bottom-0 z-[60]",
          "w-16 flex flex-col items-center justify-between py-6",
          "bg-gradient-to-b",
          spineTheme.gradient,
          "shadow-lg safe-left transition-all duration-500"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={t("Бокова навігація", "Spine navigation")}
      >
        {/* Top section - Theme change arrows */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setSpineThemeIndex((prev) =>
              prev === 0 ? SPINE_THEMES.length - 1 : prev - 1
            )}
            className="spine-btn w-10 h-10 flex items-center justify-center
              text-white/60 hover:text-white hover:bg-white/10
              rounded-full transition-colors"
            aria-label={t("Попередня тема", "Previous theme")}
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

        {/* Middle section - Main action buttons */}
        <div className="flex flex-col items-center gap-3">
          {spineButtons.filter(btn => btn.show).map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={btn.onClick}
                className={cn(
                  "spine-btn w-10 h-10 flex items-center justify-center",
                  "rounded-full transition-all duration-200",
                  btn.active
                    ? "bg-white text-brand-600 shadow-md scale-110"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
                aria-label={btn.label}
                aria-pressed={btn.active}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>

        {/* Bottom section - Timeline, theme down arrow, and close */}
        <div className="flex flex-col items-center gap-3">
          {showTimeline && (
            <button
              onClick={handleTimelineClick}
              className={cn(
                "spine-btn w-10 h-10 flex items-center justify-center",
                "text-white/80 hover:text-white hover:bg-white/10",
                "rounded-full transition-colors",
                location.pathname.includes("/timeline") && "bg-white/20 text-white"
              )}
              aria-label={t("Історія", "Timeline")}
            >
              <Clock className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => setSpineThemeIndex((prev) => (prev + 1) % SPINE_THEMES.length)}
            className="spine-btn w-10 h-10 flex items-center justify-center
              text-white/60 hover:text-white hover:bg-white/10
              rounded-full transition-colors"
            aria-label={t("Наступна тема", "Next theme")}
          >
            <ChevronDown className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsExpanded(false)}
            className="spine-btn w-10 h-10 flex items-center justify-center
              text-white/60 hover:text-white hover:bg-white/10
              rounded-full transition-colors mt-2"
            aria-label={t("Згорнути", "Collapse")}
          >
            <X className="h-5 w-5" />
          </button>
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
    </>
  );
}

export default SpineNavigation;
