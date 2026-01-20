// VerseNumberEditor.tsx — Інструмент для мануального редагування номерів віршів
// Дозволяє адміну змінювати verse_number для складних випадків (16-18, 1.1, тощо)

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
interface VerseNumberEditorProps {
  verseId: string;
  currentNumber: string;
  onUpdate?: () => void;
  bookSlug?: string; // для визначення префіксу (ШБ, БҐ, etc.)
}

/* Префікси книг */
const getBookPrefix = (slug: string | undefined): string => {
  const prefixes: Record<string, string> = {
    sb: "ШБ",
    bg: "БҐ",
    cc: "ЧЧ",
    noi: "НВ",
    iso: "Ішо",
    nod: "НВ",
  };
  return slug ? prefixes[slug] || slug.toUpperCase() : "";
};

export const VerseNumberEditor = ({
  verseId,
  currentNumber,
  onUpdate,
  bookSlug
}: VerseNumberEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newNumber, setNewNumber] = useState(currentNumber);
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    if (!newNumber.trim()) {
      toast({
        title: "Помилка",
        description: "Номер вірша не може бути порожнім",
        variant: "destructive"
      });
      return;
    }
    setIsSaving(true);
    try {
      const {
        error
      } = await supabase.from("verses").update({
        verse_number: newNumber.trim()
      }).eq("id", verseId);
      if (error) throw error;
      toast({
        title: "Успіх",
        description: `Номер вірша змінено на "${newNumber}"`
      });
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating verse number:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося оновити номер вірша",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    setNewNumber(currentNumber);
    setIsEditing(false);
  };
  const prefix = getBookPrefix(bookSlug);
  if (!isEditing) {
    return <div className="flex items-center gap-2">
        <span className="font-semibold text-2xl md:text-5xl text-center whitespace-nowrap" style={{ color: "rgb(188, 115, 26)" }}>{prefix} {currentNumber}</span>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-7 w-7 p-0" title="Редагувати номер вірша">
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      </div>;
  }
  return <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{prefix}</span>
      <Input value={newNumber} onChange={e => setNewNumber(e.target.value)} className="h-8 w-24 text-sm" placeholder="1 або 16-18" disabled={isSaving} />
      <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving || newNumber === currentNumber} className="h-8 w-8 p-0" title="Зберегти">
        <Check className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving} className="h-8 w-8 p-0" title="Скасувати">
        <X className="h-4 w-4" />
      </Button>
    </div>;
};