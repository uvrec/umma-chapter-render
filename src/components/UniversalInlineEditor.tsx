import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

type Props = {
  table: string;
  recordId: string;
  field: string;
  initialValue: string;
  label?: string;
  language?: string;
  showToggle?: boolean;
};

export const UniversalInlineEditor = ({
  table,
  recordId,
  field,
  initialValue,
  label,
  language,
  showToggle = true,
}: Props) => {
  const [value, setValue] = useState<string>(initialValue || "");
  const [editing, setEditing] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from(table)
        .update({ [field]: value })
        .eq("id", recordId);
      if (error) throw error;
      toast({ title: "Збережено", description: "Зміни успішно збережено" });
      setEditing(false);
    } catch (e: any) {
      toast({ title: "Помилка", description: e.message || "Не вдалося зберегти", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-3">
      {label && (
        <div className="text-sm font-medium text-muted-foreground">
          {label} {language ? `— ${language.toUpperCase()}` : null}
        </div>
      )}
      {editing ? (
        <>
          <Textarea
            className="min-h-[240px]"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Вставте або введіть контент..."
          />
          <div className="flex gap-2">
            <Button disabled={saving} onClick={handleSave}>
              {saving ? "Збереження..." : "Зберегти"}
            </Button>
            {showToggle && (
              <Button variant="outline" disabled={saving} onClick={() => setEditing(false)}>
                Перегляд
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="prose prose-lg max-w-none dark:prose-invert whitespace-pre-wrap">{value || "—"}</div>
          {showToggle && (
            <Button variant="outline" onClick={() => setEditing(true)}>
              Редагувати
            </Button>
          )}
        </>
      )}
    </div>
  );
};
