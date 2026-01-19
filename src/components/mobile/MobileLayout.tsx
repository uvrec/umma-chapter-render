// src/components/mobile/MobileLayout.tsx
// Wrapper layout для мобільних пристроїв з Neu Bible-style spine navigation

import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SpineNavigation } from "./SpineNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

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

export function MobileLayout({
  children,
  hideSpine = false,
  bookId,
  isReaderPage = false,
  onPrevious,
  onNext,
}: MobileLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();

  // На десктопі просто рендеримо children без змін
  if (!isMobile) {
    return <>{children}</>;
  }

  // Detect if we're on a reader page from the URL
  const isOnReaderPage = isReaderPage || location.pathname.includes("/lib/");

  // Extract bookId from URL if not provided
  const detectedBookId = bookId || extractBookIdFromPath(location.pathname);

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
      {/* Add RIGHT padding for spine navigation (Neu Bible style - spine on right) */}
      <div className={!hideSpine ? "pr-16" : ""}>
        {children}
      </div>
    </div>
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
