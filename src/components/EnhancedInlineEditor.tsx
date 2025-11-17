// EnhancedInlineEditor.tsx — Розширений inline редактор з повним набором функцій
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Quote,
  Code,
  Minus,
  RemoveFormatting,
} from "lucide-react";

interface EnhancedInlineEditorProps {
  content: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
  compact?: boolean; // Компактний режим для меншого toolbar
}

export const EnhancedInlineEditor = ({
  content,
  onChange,
  label,
  placeholder = "Редагуйте контент...",
  editable = true,
  minHeight = "200px",
  compact = false,
}: EnhancedInlineEditorProps) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          gapcursor: false,
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        Image,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-amber-700 underline decoration-dotted hover:decoration-solid dark:text-amber-300",
          },
        }),
        Youtube.configure({ width: 640, height: 480 }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Color,
        TextStyle,
        Highlight.configure({
          multicolor: true,
        }),
        Underline,
        Subscript,
        Superscript,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Placeholder.configure({ placeholder }),
      ],
      content,
      editable,
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
      editorProps: {
        attributes: {
          class: `prose prose-sm dark:prose-invert max-w-none min-h-[${minHeight}] focus:outline-none p-4`,
        },
      },
    },
    [editable]
  );

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
      if (content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, editable, content]);

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("blog-media").upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("blog-media").getPublicUrl(fileName);
        editor?.chain().focus().setImage({ src: data.publicUrl }).run();
        toast({ title: "✅ Зображення завантажено" });
      } catch (error) {
        console.error(error);
        toast({ title: "Помилка завантаження зображення", variant: "destructive" });
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt("Введіть URL:");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt("Введіть YouTube URL:");
    if (url) editor?.commands.setYoutubeVideo({ src: url });
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  const setHighlight = (color: string) => {
    if (color === "none") {
      editor?.chain().focus().unsetHighlight().run();
    } else {
      editor?.chain().focus().setHighlight({ color }).run();
    }
  };

  const setFontSize = (size: string) => {
    editor?.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  const clearFormatting = () => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  };

  if (!editor) return null;

  return (
    <div
      className={`rounded-md border ${editable ? "border-amber-400/40 hover:border-amber-400/80" : "border-transparent"} transition-colors relative`}
    >
      {/* STICKY TOOLBAR */}
      {editable && (
        <div className="sticky top-16 z-40 flex flex-col gap-2 border-b bg-background/95 backdrop-blur-sm px-4 py-2">
          {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}

          <div className={`flex flex-wrap gap-1 ${compact ? "gap-0.5" : "gap-1"}`}>
            {/* Текстове форматування */}
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("bold") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Жирний (Ctrl+B)"
              >
                <Bold className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("italic") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Курсив (Ctrl+I)"
              >
                <Italic className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("underline") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Підкреслений (Ctrl+U)"
              >
                <UnderlineIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("strike") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Закреслений"
              >
                <Strikethrough className="h-3 w-3" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Заголовки */}
            <div className="flex gap-1">
              {[1, 2, 3].map((lvl) => (
                <Button
                  key={lvl}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${editor.isActive("heading", { level: lvl }) ? "bg-accent" : ""}`}
                  onClick={() => editor.chain().focus().toggleHeading({ level: lvl as 1 | 2 | 3 }).run()}
                  title={`Заголовок ${lvl}`}
                >
                  {lvl === 1 ? (
                    <Heading1 className="h-3 w-3" />
                  ) : lvl === 2 ? (
                    <Heading2 className="h-3 w-3" />
                  ) : (
                    <Heading3 className="h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Списки */}
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Маркований список"
              >
                <List className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Нумерований список"
              >
                <ListOrdered className="h-3 w-3" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Вирівнювання */}
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                title="По лівому краю"
              >
                <AlignLeft className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                title="По центру"
              >
                <AlignCenter className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                title="По правому краю"
              >
                <AlignRight className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive({ textAlign: "justify" }) ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                title="По ширині"
              >
                <AlignJustify className="h-3 w-3" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Спеціальні стилі */}
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("subscript") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                title="Підрядковий"
              >
                <SubscriptIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("superscript") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                title="Надрядковий"
              >
                <SuperscriptIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("blockquote") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Цитата"
              >
                <Quote className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("code") ? "bg-accent" : ""}`}
                onClick={() => editor.chain().focus().toggleCode().run()}
                title="Код"
              >
                <Code className="h-3 w-3" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Колір та маркер */}
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Колір тексту">
                    <Palette className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="grid grid-cols-5 gap-1 p-2">
                  {[
                    "#000000",
                    "#E11D48",
                    "#F59E0B",
                    "#10B981",
                    "#3B82F6",
                    "#8B5CF6",
                    "#EC4899",
                    "#6B7280",
                    "#FFFFFF",
                  ].map((color) => (
                    <DropdownMenuItem
                      key={color}
                      className="p-0 w-5 h-5 rounded-full cursor-pointer border"
                      style={{ backgroundColor: color }}
                      onClick={() => setColor(color)}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${editor.isActive("highlight") ? "bg-accent" : ""}`}
                    title="Маркер"
                  >
                    <Highlighter className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="grid grid-cols-5 gap-1 p-2">
                  <DropdownMenuItem
                    className="p-0 w-5 h-5 rounded-full cursor-pointer border"
                    onClick={() => setHighlight("none")}
                    title="Видалити маркер"
                  >
                    ✕
                  </DropdownMenuItem>
                  {["#FEF3C7", "#DBEAFE", "#D1FAE5", "#FCE7F3", "#E0E7FF"].map((color) => (
                    <DropdownMenuItem
                      key={color}
                      className="p-0 w-5 h-5 rounded-full cursor-pointer border"
                      style={{ backgroundColor: color }}
                      onClick={() => setHighlight(color)}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Розмір шрифту">
                    <Type className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"].map((size) => (
                    <DropdownMenuItem key={size} onClick={() => setFontSize(size)}>
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Медіа та вставки */}
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={addLink}
                title="Посилання"
              >
                <LinkIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleImageUpload}
                title="Зображення"
              >
                <ImageIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={addYoutubeVideo}
                title="YouTube"
              >
                <YoutubeIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={insertTable}
                title="Таблиця"
              >
                <TableIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Горизонтальна лінія"
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Undo/Redo та очистка */}
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Скасувати (Ctrl+Z)"
              >
                <Undo className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Повторити (Ctrl+Y)"
              >
                <Redo className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={clearFormatting}
                title="Очистити форматування"
              >
                <RemoveFormatting className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDITOR CONTENT */}
      <EditorContent editor={editor} />
    </div>
  );
};
