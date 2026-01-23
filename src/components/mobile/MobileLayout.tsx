// src/components/mobile/MobileLayout.tsx
// Wrapper layout для мобільних пристроїв з Neu Bible-style spine navigation

import { ReactNode } from "react";
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
  /** Whether we're on a reader page (shows navigation arrows) */
  isReaderPage?: boolean;
  /** Callback for previous chapter/verse navigation */
  onPrevious?: () => void;
  /** Callback for next chapter/verse navigation */
  onNext?: () => void;
}

// Inner component that uses the context
function MobileLayoutInner({
  children,
  hideSpine = false,
  bookId,
  isReaderPage = false,
  onPrevious,
  onNext,
}: MobileLayoutProps) {
  const location = useLocation();
  const { isFullscreen } = useMobileReading();

  // Detect if we're on a reader page from the URL
  const isOnReaderPage = isReaderPage || location.pathname.includes("/lib/");

  // Extract bookId from URL if not provided
  const detectedBookId = bookId || extractBookIdFromPath(location.pathname);

  // When fullscreen, remove left padding smoothly
  const shouldShowPadding = !hideSpine && !isFullscreen;

  return (
    <div className="mobile-layout min-h-screen">
      {!hideSpine && (
        <SpineNavigation
          bookId={detectedBookId}
          isReaderPage={isOnReaderPage}
          showNavArrows={isOnReaderPage && Boolean(onPrevious || onNext)}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      )}
      {/* Add LEFT padding for spine navigation (spine on left), animate when entering fullscreen */}
      <div className={`transition-all duration-300 ${shouldShowPadding ? "pl-16" : "pl-0"}`}>
        {children}
      </div>
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

// Helper to extract book ID from path like /lib/bg/1/1 or /ua/lib/bg/1/1
function extractBookIdFromPath(pathname: string): string | undefined {
  // Remove language prefix if present
  const pathWithoutLang = pathname.replace(/^\/(ua|en)/, "");
  // Match /lib/{bookId}
  const match = pathWithoutLang.match(/^\/lib\/([^/]+)/);
  return match?.[1];
}

export default MobileLayout;
