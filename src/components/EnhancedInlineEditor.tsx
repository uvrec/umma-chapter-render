// EnhancedInlineEditor.tsx — Розширений inline редактор з повним набором функцій
import { useEffect, useRef, useCallback } from "react";
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
import { Extension } from "@tiptap/core";

// Custom FontSize extension to properly handle font sizes
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});
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
  Unlink,
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
  // Track if the content change came from the editor itself
  const isInternalChange = useRef(false);
  // Keep a ref to the editor for use in async callbacks
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  // Ensure content is valid HTML
  const initialContent = content || "<p></p>";

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          gapcursor: false,
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'max-w-full h-auto',
          },
        }),
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
        FontSize,
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
      content: initialContent,
      editable,
      onUpdate: ({ editor }) => {
        isInternalChange.current = true;
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4",
          style: `min-height: ${minHeight}`,
        },
        // Зберігаємо форматування при вставці з буфера обміну
        handlePaste: (view, event, slice) => {
          // Дозволяємо стандартну поведінку вставки з HTML
          return false;
        },
        transformPastedHTML(html) {
          // Зберігаємо весь HTML без змін
          return html;
        },
      },
    },
    [editable]
  );

  // Keep editorRef in sync
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);

      // Only sync content from props if it's an external change (not from our own onUpdate)
      if (isInternalChange.current) {
        isInternalChange.current = false;
        return;
      }

      const newContent = content || "<p></p>";
      // Compare normalized content to avoid unnecessary updates
      if (newContent !== editor.getHTML()) {
        // Save cursor position
        const { from, to } = editor.state.selection;
        editor.commands.setContent(newContent, false);
        // Try to restore cursor position if within bounds
        try {
          const maxPos = editor.state.doc.content.size;
          const safeFrom = Math.min(from, maxPos);
          const safeTo = Math.min(to, maxPos);
          editor.commands.setTextSelection({ from: safeFrom, to: safeTo });
        } catch {
          // If restoration fails, just let it be at the start
        }
      }
    }
  }, [editor, editable, content]);


  // URL validation helper
  const isValidUrl = useCallback((urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  // YouTube URL validation
  const isValidYoutubeUrl = useCallback((urlString: string): boolean => {
    if (!isValidUrl(urlString)) return false;
    try {
      const url = new URL(urlString);
      return url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be');
    } catch {
      return false;
    }
  }, [isValidUrl]);

  const handleImageUpload = useCallback(async () => {
    // Save selection before any async operations
    const currentEditor = editorRef.current;
    if (!currentEditor) return;

    const savedSelection = {
      from: currentEditor.state.selection.from,
      to: currentEditor.state.selection.to,
    };

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // File size validation (max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        toast({ title: "Файл занадто великий (макс. 5MB)", variant: "destructive" });
        return;
      }

      try {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("blog-media").upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("blog-media").getPublicUrl(fileName);

        // Use editorRef to avoid stale closure
        const ed = editorRef.current;
        if (ed) {
          ed.chain()
            .focus()
            .setTextSelection(savedSelection)
            .setImage({ src: data.publicUrl })
            .run();
        }
        toast({ title: "Зображення завантажено" });
      } catch (error) {
        console.error(error);
        toast({ title: "Помилка завантаження зображення", variant: "destructive" });
      }
    };
    input.click();
  }, []);

  const addLink = useCallback(() => {
    const currentEditor = editorRef.current;
    if (!currentEditor) return;

    // Save the current selection before prompt
    const { from, to } = currentEditor.state.selection;
    const hasSelection = from !== to;

    const url = window.prompt("Введіть URL:");
    if (!url) return;

    if (!isValidUrl(url)) {
      toast({ title: "Невірний формат URL", variant: "destructive" });
      return;
    }

    // Restore selection and apply link
    currentEditor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .setLink({ href: url })
      .run();

    if (!hasSelection) {
      toast({ title: "Виділіть текст для створення посилання", variant: "destructive" });
    }
  }, [isValidUrl]);

  const removeLink = useCallback(() => {
    editorRef.current?.chain().focus().unsetLink().run();
  }, []);

  const addYoutubeVideo = useCallback(() => {
    const currentEditor = editorRef.current;
    if (!currentEditor) return;

    // Save selection
    const { from, to } = currentEditor.state.selection;

    const url = window.prompt("Введіть YouTube URL:");
    if (!url) return;

    if (!isValidYoutubeUrl(url)) {
      toast({ title: "Невірний YouTube URL", variant: "destructive" });
      return;
    }

    // Restore selection and insert video
    currentEditor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .setYoutubeVideo({ src: url })
      .run();
  }, [isValidYoutubeUrl]);

  const insertTable = useCallback(() => {
    editorRef.current?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, []);

  const setColor = useCallback((color: string) => {
    if (color === "none") {
      editorRef.current?.chain().focus().unsetColor().run();
    } else {
      editorRef.current?.chain().focus().setColor(color).run();
    }
  }, []);

  const setHighlight = useCallback((color: string) => {
    if (color === "none") {
      editorRef.current?.chain().focus().unsetHighlight().run();
    } else {
      editorRef.current?.chain().focus().setHighlight({ color }).run();
    }
  }, []);

  const setFontSize = useCallback((size: string) => {
    // Use updateAttributes on TextStyle mark for font size
    editorRef.current?.chain().focus().setMark("textStyle", { fontSize: size }).run();
  }, []);

  const clearFormatting = useCallback(() => {
    editorRef.current?.chain().focus().clearNodes().unsetAllMarks().run();
  }, []);

  if (!editor) {
    console.log('[EnhancedInlineEditor] Editor is null, returning placeholder');
    return (
      <div className="p-4 border border-dashed border-gray-300 rounded-md text-gray-500">
        Завантаження редактора... (label: {label})
      </div>
    );
  }

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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                  onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Колір тексту" onMouseDown={(e) => e.preventDefault()}>
                    <Palette className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="grid grid-cols-5 gap-1 p-2" onMouseDown={(e) => e.preventDefault()}>
                  <DropdownMenuItem
                    className="p-0 w-5 h-5 rounded-full cursor-pointer border flex items-center justify-center text-xs"
                    onClick={() => setColor("none")}
                    title="Видалити колір"
                  >
                    ✕
                  </DropdownMenuItem>
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
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Highlighter className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="grid grid-cols-5 gap-1 p-2" onMouseDown={(e) => e.preventDefault()}>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Розмір шрифту" onMouseDown={(e) => e.preventDefault()}>
                    <Type className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onMouseDown={(e) => e.preventDefault()}>
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
                className={`h-8 w-8 ${editor.isActive("link") ? "bg-accent" : ""}`}
                onClick={addLink}
                onMouseDown={(e) => e.preventDefault()}
                title="Додати посилання"
              >
                <LinkIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${editor.isActive("link") ? "bg-accent text-accent-foreground" : "opacity-50"}`}
                onClick={removeLink}
                onMouseDown={(e) => e.preventDefault()}
                title={editor.isActive("link") ? "Видалити посилання" : "Виділіть текст з посиланням"}
              >
                <Unlink className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleImageUpload}
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
