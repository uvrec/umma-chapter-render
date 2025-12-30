// EnhancedInlineEditor.tsx — з sticky toolbar
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mark, mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Bold,
  Italic,
  Heading2,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
} from "lucide-react";

/**
 * Custom Span mark to preserve <span> elements with class, style, id and data-* attributes
 * This prevents TipTap from stripping formatted content during HTML parsing
 */
const SpanMark = Mark.create({
  name: "span",
  inclusive: true,
  group: "inline",
  priority: 1000,

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (node) => {
          const element = node as HTMLElement;
          const dataAttrs: Record<string, string> = {};
          Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith("data-")) {
              dataAttrs[attr.name] = attr.value;
            }
          });
          return {
            class: element.getAttribute("class"),
            style: element.getAttribute("style"),
            id: element.getAttribute("id"),
            ...dataAttrs,
          };
        },
      },
    ];
  },

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return { id: attributes.id };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
});

interface EnhancedInlineEditorProps {
  content: string;
  onChange: (content: string) => void;
  label: string;
  editable?: boolean;
}

export const EnhancedInlineEditor = ({ content, onChange, label, editable = true }: EnhancedInlineEditorProps) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ gapcursor: false }),
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
        SpanMark, // Custom mark to preserve <span> elements with class/style attributes
        Placeholder.configure({ placeholder: "Редагуйте контент..." }),
      ],
      content,
      editable,
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
      editorProps: {
        attributes: { class: "prose prose-sm max-w-none min-h-[200px] focus:outline-none p-4" },
      },
    },
    [editable],
  );

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editor, editable]);

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

  if (!editor) return null;

  return (
    <div
      className={`rounded-md border ${editable ? "border-amber-400/40 hover:border-amber-400/80" : "border-transparent"} transition-colors relative`}
    >
      {/* STICKY TOOLBAR */}
      {editable && (
        <div className="sticky top-16 z-40 flex items-center justify-between gap-2 border-b bg-background/95 backdrop-blur-sm px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <Bold className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <Italic className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading"
            >
              <Heading2 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="List"
            >
              <List className="h-3 w-3" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addLink} title="Link">
              <LinkIcon className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleImageUpload}
              title="Image"
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
          </div>
        </div>
      )}

      {/* EDITOR CONTENT */}
      <EditorContent editor={editor} />
    </div>
  );
};
