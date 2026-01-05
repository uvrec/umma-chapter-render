import { useEffect, useRef } from "react";
import { Highlighter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionTooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onSave: () => void;
  onClose: () => void;
}

export const SelectionTooltip = ({
  isVisible,
  position,
  onSave,
  onClose,
}: SelectionTooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Delay adding listener to prevent immediate close
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Adjust position to keep tooltip in viewport
  const adjustedX = Math.min(position.x, window.innerWidth - 60);
  const adjustedY = Math.max(position.y - 50, 10);

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-150"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
        transform: "translateX(-50%)",
      }}
    >
      <Button
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSave();
        }}
        className="shadow-lg rounded-full px-3 py-2 gap-1.5 bg-primary hover:bg-primary/90"
      >
        <Highlighter className="h-4 w-4" />
        <span className="text-xs font-medium">Нотатка</span>
      </Button>
    </div>
  );
};
