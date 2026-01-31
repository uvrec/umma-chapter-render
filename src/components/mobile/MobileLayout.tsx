// src/components/mobile/MobileLayout.tsx
// Wrapper layout для мобільних пристроїв з Neu Bible-style spine navigation

import { ReactNode, useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SpineNavigation } from "./SpineNavigation";
import { TranslationTooltip } from "./TranslationTooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileReadingProvider, useMobileReading } from "@/contexts/MobileReadingContext";
import { TimelineProvider } from "@/contexts/TimelineContext";
import { useAudio } from "@/contexts/ModernAudioContext";

const EDGE_SWIPE_THRESHOLD = 30; // px from left edge to trigger swipe
const SWIPE_MIN_DISTANCE = 50; // min px to complete swipe

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
  const { isFullscreen, exitFullscreen } = useMobileReading();
  const { currentTrack } = useAudio();

  // Hide spine when audio player is active (has a track loaded)
  const isPlayerActive = !!currentTrack;

  // Track spine visibility to move content with it
  const [isSpineVisible, setIsSpineVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("vv_spine_hidden") !== "true";
  });

  // Edge swipe state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [isEdgeSwiping, setIsEdgeSwiping] = useState(false);

  const handleSpineVisibilityChange = useCallback((visible: boolean) => {
    setIsSpineVisible(visible);
  }, []);

  // Extract bookId from URL if not provided
  const detectedBookId = bookId || extractBookIdFromPath(location.pathname);

  // Handle edge swipe to exit fullscreen
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    // Only track if starting from left edge and in fullscreen
    if (isFullscreen && touch.clientX < EDGE_SWIPE_THRESHOLD) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      setIsEdgeSwiping(true);
    }
  }, [isFullscreen]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !isEdgeSwiping) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;

    // Only allow right swipe
    if (deltaX > 0) {
      setSwipeDelta(Math.min(deltaX, window.innerWidth * 0.8));
    }
  }, [isEdgeSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !isEdgeSwiping) return;

    // If swiped enough, exit fullscreen
    if (swipeDelta > SWIPE_MIN_DISTANCE) {
      exitFullscreen();
    }

    // Reset state
    touchStartRef.current = null;
    setSwipeDelta(0);
    setIsEdgeSwiping(false);
  }, [swipeDelta, exitFullscreen, isEdgeSwiping]);

  // When fullscreen, spine hidden, or player is active - remove left padding smoothly
  const shouldShowPadding = !hideSpine && isSpineVisible && !isFullscreen && !isPlayerActive;

  // Calculate content transform during swipe
  const contentStyle: React.CSSProperties = {
    paddingLeft: shouldShowPadding ? '56px' : '0px',
    transform: isEdgeSwiping && swipeDelta > 0 ? `translateX(${swipeDelta}px)` : undefined,
    transition: isEdgeSwiping ? 'none' : 'padding 300ms ease-out, transform 300ms ease-out',
  };

  return (
    <div
      className="mobile-layout min-h-screen overflow-x-hidden"
      style={contentStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {!hideSpine && !isPlayerActive && (
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
