// src/components/PageTransition.tsx
// Smooth page transitions on route changes.
// Desktop: very subtle opacity fade (minimal, non-distracting).
// Mobile/Capacitor: native-feeling slide-fade for polished app feel.

import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Remove both classes, force reflow, then add the right one
    el.classList.remove("page-transition-mobile", "page-transition-desktop");
    void el.offsetHeight;
    el.classList.add(isMobile ? "page-transition-mobile" : "page-transition-desktop");
  }, [location.pathname, isMobile]);

  return (
    <div ref={ref} className="page-transition-wrapper">
      {children}
    </div>
  );
}
