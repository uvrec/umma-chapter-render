import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Highlighter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const HIGHLIGHT_COLORS = [
  { id: "yellow", bg: "bg-yellow-200", ring: "ring-yellow-400" },
  { id: "green", bg: "bg-green-200", ring: "ring-green-400" },
  { id: "blue", bg: "bg-blue-200", ring: "ring-blue-400" },
  { id: "pink", bg: "bg-pink-200", ring: "ring-pink-400" },
  { id: "orange", bg: "bg-orange-200", ring: "ring-orange-400" },
] as const;

// Inline preview background matching CSS highlight colors
const PREVIEW_BG: Record<string, string> = {
  yellow: "rgba(253, 224, 71, 0.35)",
  green: "rgba(134, 239, 172, 0.35)",
  blue: "rgba(147, 197, 253, 0.35)",
  pink: "rgba(249, 168, 212, 0.35)",
  orange: "rgba(253, 186, 116, 0.35)",
};

interface HighlightDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string, color: string) => void;
  selectedText: string;
}

export const HighlightDialog = ({
  isOpen,
  onClose,
  onSave,
  selectedText,
}: HighlightDialogProps) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState("yellow");

  const handleSave = () => {
    onSave(notes, color);
    setNotes("");
    setColor("yellow");
    onClose();
  };

  const handleCancel = () => {
    setNotes("");
    setColor("yellow");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Highlighter className="h-5 w-5" />
            {t("Зберегти виділення", "Save Highlight")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Selected text preview with chosen color */}
          <div
            className="p-3 rounded-md text-sm max-h-32 overflow-y-auto"
            style={{ backgroundColor: PREVIEW_BG[color] || PREVIEW_BG.yellow }}
          >
            {selectedText}
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {t("Колір:", "Color:")}
            </span>
            <div className="flex items-center gap-2">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all",
                    c.bg,
                    color === c.id
                      ? `ring-2 ${c.ring} ring-offset-2 ring-offset-background scale-110`
                      : "hover:scale-105"
                  )}
                  aria-label={c.id}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <Textarea
            placeholder={t(
              "Додайте свої думки або нагадування...",
              "Add your thoughts or reminders..."
            )}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("Скасувати", "Cancel")}
          </Button>
          <Button onClick={handleSave}>
            {t("Зберегти", "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
