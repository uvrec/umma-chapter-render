// src/components/mobile/MobileLayout.tsx
// Wrapper layout для мобільних пристроїв з bottom navigation

import { ReactNode } from "react";
import { MobileTabBar } from "./MobileTabBar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children: ReactNode;
  hideTabBar?: boolean;
}

export function MobileLayout({ children, hideTabBar = false }: MobileLayoutProps) {
  const isMobile = useIsMobile();

  // На десктопі просто рендеримо children без змін
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-layout min-h-screen pb-20">
      {children}
      {!hideTabBar && <MobileTabBar />}
    </div>
  );
}

export default MobileLayout;
