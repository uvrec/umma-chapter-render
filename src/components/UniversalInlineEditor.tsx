import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // якщо немає — заміни className конкатенацією

type Props = {
  table: "chapters" | "verses";
  recordId: string;
  field: string;
  initialValue: string;
  label?: string;
  language?: "ua" | "en" | string;
  showToggle?: boolean;
};

// невеликий debounce для автозбереження
const debounce = (fn: (...a: any[]) => void, ms = 1200) => {
  let t: any;
  return (...a: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
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
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: true,
        blockquote: true,
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        protocols: ["http", "https", "mailto"],
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Placeholder.configure({
        placeholder: "Введіть або вставте контент…",
      }),
    ],
    content: initialValue || "",
    autofocus: "end",
    editorProps: {
      attributes: {
        class: "min-h-[280px] outline-none prose prose-lg max-w-none dark:prose-invert leading-relaxed",
      },
      handleKeyDown: (_view, ev) => {
        if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "s") {
          ev.preventDefault();
          void handleSave();
          return true;
        }
        return false;
      },
    },
    onUpdate: () => {
      setDirty(true);
      debouncedAutoSave();
    },
  });

  useEffect(() => {
    // якщо initialValue змінився (перемкнули мову/главу)
    if (editor && initialValue !== editor.getHTML()) {
      editor.commands.setContent(initialValue || "", false, { preserveWhitespace: "full" });
      setDirty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, editor?.commands, table, recordId, field]);

  const saveToDB = async (html: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from(table)
        .update({ [field]: html })
        .eq("id", recordId);
      if (error) throw error;
      setDirty(false);
      toast({ title: "Збережено", description: "Зміни успішно збережено" });
    } catch (e: any) {
      toast({ title: "Помилка", description: e?.message ?? "Не вдалося зберегти", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const debouncedAutoSave = useMemo(
    () =>
      debounce(() => {
        if (!editor) return;
        const html = editor.getHTML();
        // автозбереження тільки якщо реальна зміна і не у прев’ю
        if (!preview) saveToDB(html);
      }, 1500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, preview, table, recordId, field],
  );

  const handleSave = async () => {
    if (!editor) return;
    await saveToDB(editor.getHTML());
  };

  // простий тулбар
  const Toolbar = () => {
    if (!editor) return null;
    const itemBtn = (label: string, onClick: () => void, active = false) => (
      <Button type="button" variant={active ? "default" : "outline"} size="sm" className="h-8" onClick={onClick}>
        {label}
      </Button>
    );
    return (
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        {itemBtn("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {itemBtn("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {itemBtn("U", () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"))}
        {itemBtn(
          "H1",
          () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          editor.isActive("heading", { level: 1 }),
        )}
        {itemBtn(
          "H2",
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 }),
        )}
        {itemBtn("• List", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {itemBtn("1. List", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {itemBtn("“”", () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
        {itemBtn("</>", () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"))}
        <div className="ml-auto flex items-center gap-3">
          {showToggle && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Прев’ю</span>
              <Switch checked={preview} onCheckedChange={setPreview} />
            </div>
          )}
          <Button type="button" size="sm" variant="outline" onClick={() => setFullscreen((v) => !v)}>
            {fullscreen ? "Звичайний" : "На весь екран"}
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Збереження…" : "Зберегти"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-4 shadow-sm",
        fullscreen && "fixed inset-0 z-50 m-0 h-dvh w-dvw rounded-none p-6 bg-background",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">
          {label ? label : "Контент"} {language ? <>— {String(language).toUpperCase()}</> : null}
          {dirty && <span className="ml-2 text-xs text-amber-600">*є незбережені зміни</span>}
        </div>
      </div>

      <Toolbar />

      <div className={cn("mt-3")}>
        {preview ? (
          // прев’ю тим самим стилем, що і рендер
          <div className="prose prose-lg max-w-none dark:prose-invert leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }} />
          </div>
        ) : (
          <div className="rounded-lg border bg-background/50 px-3 py-2">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalInlineEditor;
