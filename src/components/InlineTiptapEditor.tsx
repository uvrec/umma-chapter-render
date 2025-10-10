// InlineTiptapEditor.tsx — додано пропси editable, hot-reinit по ключу, виправлено link styling
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

interface InlineTiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  label: string;
  editable?: boolean; // NEW
}

export const InlineTiptapEditor = ({ content, onChange, label, editable = true }: InlineTiptapEditorProps) => {
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
        Placeholder.configure({ placeholder: "Редагуйте контент..." }),
      ],
      content,
      editable, // NEW
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
      editorProps: {
        attributes: { class: "prose prose-sm max-w-none min-h-[200px] focus:outline-none" },
      },
    },
    [editable],
  ); // ensure reconfig on editable changes

  // keep editable in sync if prop changes after mount
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
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("page-media").upload(fileName, file);
        if (error) throw error;
        const {
          data: { publicUrl },
        } = supabase.storage.from("page-media").getPublicUrl(fileName);
        editor?.chain().focus().setImage({ src: publicUrl }).run();
        toast({ title: "Зображення додано" });
      } catch (err) {
        console.error(err);
        toast({ title: "Помилка завантаження", variant: "destructive" });
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
      className={`space-y-2 rounded-lg border-2 border-dashed ${editable ? "border-amber-400/40 hover:border-amber-400/80" : "border-transparent"} p-4 transition-colors`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {editable && (
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-3 w-3" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addLink}>
              <LinkIcon className="h-3 w-3" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleImageUpload}>
              <ImageIcon className="h-3 w-3" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addYoutubeVideo}>
              <YoutubeIcon className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
