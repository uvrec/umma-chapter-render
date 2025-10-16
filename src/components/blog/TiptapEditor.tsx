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
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const TiptapEditor = ({ content, onChange, placeholder = "Почніть писати..." }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        gapcursor: false,
        link: false, // Disable default link from StarterKit
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Youtube.configure({ width: 640, height: 360 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Color,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "verse-surface commentary-text p-4 min-h-[400px] focus:outline-none rounded-lg",
      },
    },
  });

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
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

  const setFontSize = (size: string) => {
    editor?.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  if (!editor) return null;

  return (
    <div className="relative border rounded-lg bg-background">
      {/* Sticky Toolbar */}
      <div
        className="
          sticky top-0 z-10 
          flex flex-wrap gap-1 p-2 
          border-b bg-muted/60 backdrop-blur-sm
        "
      >
        {/* Text styling */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-accent" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-accent" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-accent" : ""}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Align */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={editor.isActive({ textAlign: "justify" }) ? "bg-accent" : ""}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        {/* Headings */}
        {[1, 2, 3].map((lvl) => (
          <Button
            key={lvl}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: lvl as 1 | 2 | 3 | 4 | 5 | 6 })
                .run()
            }
            className={editor.isActive("heading", { level: lvl }) ? "bg-accent" : ""}
          >
            {lvl === 1 ? (
              <Heading1 className="h-4 w-4" />
            ) : lvl === 2 ? (
              <Heading2 className="h-4 w-4" />
            ) : (
              <Heading3 className="h-4 w-4" />
            )}
          </Button>
        ))}

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-accent" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-accent" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Media + Links */}
        <Button variant="ghost" size="icon" onClick={addLink}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleImageUpload}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={addYoutubeVideo}>
          <YoutubeIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={insertTable}>
          <TableIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Color & Font Size */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="grid grid-cols-5 gap-1 p-2">
            {["#000000", "#E11D48", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280", "#FFFFFF"].map(
              (color) => (
                <DropdownMenuItem
                  key={color}
                  className="p-0 w-5 h-5 rounded-full cursor-pointer border"
                  style={{ backgroundColor: color }}
                  onClick={() => setColor(color)}
                />
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Type className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["12px", "14px", "16px", "18px", "20px", "24px"].map((size) => (
              <DropdownMenuItem key={size} onClick={() => setFontSize(size)}>
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[400px]" />
    </div>
  );
};
