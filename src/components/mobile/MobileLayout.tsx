// src/components/mobile/MobileLayout.tsx
// Wrapper layout для мобільних пристроїв з Neu Bible-style spine navigation

import { ReactNode, useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SpineNavigation } from "./SpineNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children: ReactNode;
  /** Hide the spine navigation */
  hideSpine?: boolean;
  /** Current book ID for TOC */
  bookId?: string;
}

export function MobileLayout({
  children,
  hideSpine = false,
  bookId,
}: MobileLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();

  // Track spine visibility to move content with it
  // Read initial state from localStorage
  const [isSpineVisible, setIsSpineVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("vv_spine_hidden") !== "true";
  });

  const handleSpineVisibilityChange = useCallback((visible: boolean) => {
    setIsSpineVisible(visible);
  }, []);

  // Update body class for CSS-based margin (more reliable than JS)
  useEffect(() => {
    if (isMobile && !hideSpine && isSpineVisible) {
      document.body.classList.add('spine-visible');
    } else {
      document.body.classList.remove('spine-visible');
    }
    return () => {
      document.body.classList.remove('spine-visible');
    };
  }, [isMobile, hideSpine, isSpineVisible]);

  // На десктопі просто рендеримо children без змін
  if (!isMobile) {
    return <>{children}</>;
  }

  // Extract bookId from URL if not provided
  const detectedBookId = bookId || extractBookIdFromPath(location.pathname);

  return (
    <div className="mobile-layout min-h-screen overflow-x-hidden">
      {!hideSpine && (
        <SpineNavigation
          bookId={detectedBookId}
          onVisibilityChange={handleSpineVisibilityChange}
        />
      )}
      {children}
    </div>
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
