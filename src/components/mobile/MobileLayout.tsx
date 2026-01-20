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
}

export function MobileLayout({
  children,
  hideSpine = false,
  bookId,
}: MobileLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();

  // На десктопі просто рендеримо children без змін
  if (!isMobile) {
    return <>{children}</>;
  }

  // Extract bookId from URL if not provided
  const detectedBookId = bookId || extractBookIdFromPath(location.pathname);

  return (
    <div className="mobile-layout min-h-screen">
      {!hideSpine && (
        <SpineNavigation bookId={detectedBookId} />
      )}
      {/* Add LEFT padding for spine navigation (spine on left) */}
      <div className={!hideSpine ? "pl-14" : ""}>
        {children}
      </div>
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
