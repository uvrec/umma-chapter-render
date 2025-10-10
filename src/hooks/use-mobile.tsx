// src/hooks/useIsMobile.ts
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // початкове значення
    const update = () => setIsMobile(media.matches);
    update();

    // слухач змін
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}
