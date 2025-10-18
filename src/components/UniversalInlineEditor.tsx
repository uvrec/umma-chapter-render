// src/components/UniversalInlineEditor.tsx
// Універсальний inline editor який можна додати на будь-яку сторінку

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseClient } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Edit, Save, X } from "lucide-react";

interface UniversalInlineEditorProps {
  // База даних
  table: "chapters" | "verses" | "blog_posts" | string;
  recordId: string;
  field: string;
  
  // Відображення
  initialValue: string;
  label?: string;
  language?: "ua" | "en";
  
  // Опції
  showToggle?: boolean; // Показувати кнопку увімк/вимк редагування
  alwaysEditable?: boolean; // Завжди в режимі редагування
  className?: string;
}

/**
 * Універсальний inline editor для будь-якої сторінки
 * 
 * Використання:
 * <UniversalInlineEditor
 *   table="chapters"
 *   recordId={chapterId}
 *   field="content_ua"
 *   initialValue={chapter.content_ua}
 *   language="ua"
 * />
 */
export function UniversalInlineEditor({
  table,
  recordId,
  field,
  initialValue,
  label,
  language = "ua",
  showToggle = true,
  alwaysEditable = false,
  className = "",
}: UniversalInlineEditorProps) {
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(alwaysEditable);
  const [content, setContent] = useState(initialValue || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Синхронізуємо з initialValue при зміні
  useEffect(() => {
    setContent(initialValue || "");
  }, [initialValue]);

  // Перевіряємо чи користувач адміністратор
  const isAdmin = user?.email?.includes("admin"); // Adjust this check

  if (!isAdmin) {
    // Для не-адмінів показуємо просто контент
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from(table)
        .update({ [field]: content })
        .eq("id", recordId);

      if (error) throw error;

      toast({ title: "✅ Збережено" });
      setHasChanges(false);
      
      if (!alwaysEditable) {
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Помилка збереження", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(initialValue || "");
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== initialValue);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Контрольна панель */}
      {showToggle && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {label || `Editing: ${table}.${field}`}
          </span>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Редагувати
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="ghost"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Скасувати
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={!hasChanges || isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Збереження..." : "Зберегти"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Редактор або контент */}
      {isEditing || alwaysEditable ? (
        <InlineTiptapEditor
          content={content}
          onChange={handleContentChange}
          label={label || field}
          editable={true}
        />
      ) : (
        <div 
          className="prose prose-sm max-w-none p-4 rounded-lg border bg-muted/20"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* Індикатор незбережених змін */}
      {hasChanges && (
        <div className="mt-2 text-sm text-amber-600 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          Незбережені зміни
        </div>
      )}
    </div>
  );
}

/**
 * Хук для швидкого додавання inline editing
 */
export function useInlineEditor(
  table: string,
  recordId: string,
  field: string,
  initialValue: string
) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialValue);
  
  return {
    isEditing,
    content,
    setIsEditing,
    setContent,
    EditorComponent: () => (
      <UniversalInlineEditor
        table={table}
        recordId={recordId}
        field={field}
        initialValue={initialValue}
        alwaysEditable={isEditing}
      />
    ),
  };
}
