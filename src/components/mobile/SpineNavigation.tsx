// src/components/mobile/SpineNavigation.tsx
// Neu Bible-style spine (sidebar) navigation for mobile
// Бокова навігаційна панель з іконками для доступу до ключових функцій

import { useState, useCallback } from "react";
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
import { SpineTypographyPanel } from "./SpineTypographyPanel";
import { SpineSearchOverlay } from "./SpineSearchOverlay";
import { SpineSettingsPanel } from "./SpineSettingsPanel";
import { SpineTocPanel } from "./SpineTocPanel";

type SpinePanel = "none" | "toc" | "typography" | "search" | "settings";

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

  // Don't render if collapsed
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50
          w-2 h-20 bg-brand-500 rounded-r-full
          hover:w-3 transition-all duration-200
          active:bg-brand-600"
        aria-label={t("Відкрити навігацію", "Open navigation")}
      />
    );
  }

  return (
    <>
      {/* Main Spine Bar */}
      <nav
        className={cn(
          "spine-navigation fixed left-0 top-0 bottom-0 z-50",
          "w-16 flex flex-col items-center justify-between py-6",
          "bg-gradient-to-b from-brand-500 via-brand-500 to-brand-600",
          "shadow-lg safe-left"
        )}
        aria-label={t("Бокова навігація", "Spine navigation")}
      >
        {/* Top section - Navigation buttons */}
        <div className="flex flex-col items-center gap-4">
          {showNavArrows && onPrevious && (
            <button
              onClick={onPrevious}
              className="spine-btn w-10 h-10 flex items-center justify-center
                text-white/80 hover:text-white hover:bg-white/10
                rounded-full transition-colors"
              aria-label={t("Попередній", "Previous")}
            >
              <ChevronUp className="h-6 w-6" />
            </button>
          )}
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

        {/* Bottom section - Timeline and close */}
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

          {showNavArrows && onNext && (
            <button
              onClick={onNext}
              className="spine-btn w-10 h-10 flex items-center justify-center
                text-white/80 hover:text-white hover:bg-white/10
                rounded-full transition-colors"
              aria-label={t("Наступний", "Next")}
            >
              <ChevronDown className="h-6 w-6" />
            </button>
          )}

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
