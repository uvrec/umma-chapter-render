// src/hooks/useIsTouchDevice.ts
// Detects if the device has touch capability (phones, tablets)

import { useEffect, useState } from "react";

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for touch capability
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error msMaxTouchPoints is non-standard, exists in older browsers
      navigator.msMaxTouchPoints > 0;

    setIsTouch(hasTouch);
  }, []);

  return isTouch;
}
