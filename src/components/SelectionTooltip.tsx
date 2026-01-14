import { useEffect, useRef, useState } from "react";
import { Highlighter, Copy, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SelectionTooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText?: string;
  onSave: () => void;
  onClose: () => void;
  onCopy?: () => Promise<void>;
  onShare?: () => Promise<void>;
}

export const SelectionTooltip = ({
  isVisible,
  position,
  selectedText,
  onSave,
  onClose,
  onCopy,
  onShare,
}: SelectionTooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Reset copied state when tooltip closes
  useEffect(() => {
    if (!isVisible) {
      setCopied(false);
    }
  }, [isVisible]);

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
  const adjustedX = Math.min(position.x, window.innerWidth - 120);
  const adjustedY = Math.max(position.y - 50, 10);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onCopy) {
      await onCopy();
    } else if (selectedText) {
      // Fallback: just copy selected text
      await navigator.clipboard.writeText(selectedText);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1000);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      await onShare();
    }
    onClose();
  };

  const handleHighlight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave();
  };

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
      <div className="flex items-center gap-1 bg-background border rounded-full shadow-lg px-1 py-1">
        {/* Copy button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="rounded-full px-2 py-1.5 h-auto gap-1"
          title={t("Копіювати", "Copy")}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="text-xs hidden sm:inline">{copied ? t("Готово", "Done") : t("Копіювати", "Copy")}</span>
        </Button>

        {/* Share button */}
        {(onShare || navigator.share) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="rounded-full px-2 py-1.5 h-auto gap-1"
            title={t("Поділитися", "Share")}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs hidden sm:inline">{t("Поділитися", "Share")}</span>
          </Button>
        )}

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Highlight/Note button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHighlight}
          className="rounded-full px-2 py-1.5 h-auto gap-1 text-primary hover:text-primary"
          title={t("Виділити", "Highlight")}
        >
          <Highlighter className="h-4 w-4" />
          <span className="text-xs hidden sm:inline">{t("Виділити", "Highlight")}</span>
        </Button>
      </div>
    </div>
  );
};
