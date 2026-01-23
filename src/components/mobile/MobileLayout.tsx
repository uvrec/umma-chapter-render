// src/components/mobile/MobileLayout.tsx
// Wrapper layout для мобільних пристроїв з Neu Bible-style spine navigation

import { ReactNode, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { SpineNavigation } from "./SpineNavigation";
import { TranslationTooltip } from "./TranslationTooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileReadingProvider, useMobileReading } from "@/contexts/MobileReadingContext";
import { TimelineProvider } from "@/contexts/TimelineContext";

interface MobileLayoutProps {
  children: ReactNode;
  /** Hide the spine navigation */
  hideSpine?: boolean;
  /** Current book ID for TOC */
  bookId?: string;
}

// Inner component that uses the context
function MobileLayoutInner({
  children,
  hideSpine = false,
  bookId,
}: MobileLayoutProps) {
  const location = useLocation();
  const { isFullscreen } = useMobileReading();

  // Track spine visibility to move content with it
  // Read initial state from localStorage
  const [isSpineVisible, setIsSpineVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("vv_spine_hidden") !== "true";
  });

  const handleSpineVisibilityChange = useCallback((visible: boolean) => {
    setIsSpineVisible(visible);
  }, []);

  // Extract bookId from URL if not provided
  const detectedBookId = bookId || extractBookIdFromPath(location.pathname);

  // When fullscreen or spine hidden, remove left padding smoothly
  const shouldShowPadding = !hideSpine && isSpineVisible && !isFullscreen;

  return (
    <div
      className="mobile-layout min-h-screen overflow-x-hidden transition-[padding] duration-300"
      style={{ paddingLeft: shouldShowPadding ? '56px' : '0px' }}
    >
      {!hideSpine && (
        <SpineNavigation
          bookId={detectedBookId}
          onVisibilityChange={handleSpineVisibilityChange}
        />
      )}
      {children}
      {/* Translation tooltip for triple tap */}
      <TranslationTooltip />
    </div>
  );
}

export function MobileLayout(props: MobileLayoutProps) {
  const isMobile = useIsMobile();

  // На десктопі просто рендеримо children без змін
  if (!isMobile) {
    return <>{props.children}</>;
  }

  // Wrap with providers for mobile
  return (
    <MobileReadingProvider>
      <TimelineProvider>
        <MobileLayoutInner {...props} />
      </TimelineProvider>
    </MobileReadingProvider>
  );
}

// Helper to extract book ID from path like /lib/bg/1/1 or /uk/lib/bg/1/1
function extractBookIdFromPath(pathname: string): string | undefined {
  // Remove language prefix if present
  const pathWithoutLang = pathname.replace(/^\/(uk|en)/, "");
  // Match /lib/{bookId}
  const match = pathWithoutLang.match(/^\/lib\/([^/]+)/);
  return match?.[1];
}

export default MobileLayout;
