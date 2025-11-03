import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Highlighter } from "lucide-react";

interface HighlightDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  selectedText: string;
}

export const HighlightDialog = ({
  isOpen,
  onClose,
  onSave,
  selectedText,
}: HighlightDialogProps) => {
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave(notes);
    setNotes("");
    onClose();
  };

  const handleCancel = () => {
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Highlighter className="h-5 w-5" />
            Зберегти виділення
          </DialogTitle>
          <DialogDescription>
            Додайте нотатки до виділеного тексту (необов'язково)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Виділений текст:</label>
            <div className="p-3 bg-muted rounded-md text-sm max-h-32 overflow-y-auto">
              {selectedText}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Нотатки:
            </label>
            <Textarea
              id="notes"
              placeholder="Додайте свої думки, коментарі або нагадування..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Скасувати
          </Button>
          <Button onClick={handleSave}>
            Зберегти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
