// src/components/mobile/TranslationTooltip.tsx
// Мінімалістичний тултіп для показу перекладу на потрійний тап
// Зникає при скролі

import { useEffect, useRef } from "react";
import { useMobileReading } from "@/contexts/MobileReadingContext";
import { cn } from "@/lib/utils";

export function TranslationTooltip() {
  const { tooltip, hideTooltip } = useMobileReading();
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Hide tooltip on scroll
  useEffect(() => {
    if (!tooltip.visible) return;

    const handleScroll = () => {
      hideTooltip();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [tooltip.visible, hideTooltip]);

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (!tooltip.visible) return;

    const timer = setTimeout(() => {
      hideTooltip();
    }, 5000);

    return () => clearTimeout(timer);
  }, [tooltip.visible, hideTooltip]);

  if (!tooltip.visible || !tooltip.text) return null;

  // Calculate position to keep tooltip in viewport
  const style: React.CSSProperties = {
    left: Math.max(16, Math.min(tooltip.position.x - 100, window.innerWidth - 216)),
    top: Math.max(16, tooltip.position.y - 60),
  };

  return (
    <div
      ref={tooltipRef}
      className={cn(
        "fixed z-[100] pointer-events-none",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      style={style}
    >
      <div className="bg-foreground/90 text-background px-4 py-3 rounded-lg shadow-xl max-w-[200px]">
        <p className="text-sm leading-relaxed">{tooltip.text}</p>
      </div>
    </div>
  );
}

export default TranslationTooltip;
