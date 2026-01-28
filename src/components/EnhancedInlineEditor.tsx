// EnhancedInlineEditor.tsx — Розширений inline редактор з повним набором функцій
import { useEffect, useRef, useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mark, mergeAttributes } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
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
  Zap,
  Copy,
  Check,
} from "lucide-react";
import {
  applyNormalizationRules,
  defaultRules,
  ruleCategories,
} from "@/utils/text/textNormalizationRules";

/**
 * Custom Span mark to preserve <span> elements with class, style, id and data-* attributes
 * This prevents TipTap from stripping formatted content during HTML parsing
 */
const SpanMark = Mark.create({
  name: "span",

  // Include span mark when pasting/copying
  inclusive: true,

  // Group with other inline marks
  group: "inline",

  // Lower priority to not interfere with other marks (lower number = lower priority)
  priority: 50,

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (node) => {
          const element = node as HTMLElement;
          // Only preserve class, style and id - other attributes are not supported
          return {
            class: element.getAttribute("class"),
            style: element.getAttribute("style"),
            id: element.getAttribute("id"),
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

/**
 * Custom Paragraph node that preserves class attributes on <p> elements
 * This allows keeping classes like "purport first" when editing
 */
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
});

interface EnhancedInlineEditorProps {
  content: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
  compact?: boolean; // Компактний режим для меншого toolbar
  showNormalizeButton?: boolean; // Show text normalization button in toolbar
  // Scroll sync props
  onScroll?: (scrollRatio: number) => void; // Reports scroll position as ratio (0-1)
  syncScrollRatio?: number; // Receives scroll ratio from paired editor
  scrollSyncId?: string; // Unique ID to prevent infinite loops
}

export const EnhancedInlineEditor = ({
  content,
  onChange,
  label,
  placeholder = "Редагуйте контент...",
  editable = true,
  minHeight = "200px",
  compact = false,
  showNormalizeButton = false,
  onScroll,
  syncScrollRatio,
  scrollSyncId,
}: EnhancedInlineEditorProps) => {
  // Track if component is mounted for async operations
  const isMountedRef = useRef(true);
  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Track if we're currently syncing to prevent loops
  const isSyncingRef = useRef(false);
  // Store onScroll callback in ref to avoid stale closures
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;
  // Track when editor view is fully initialized (prevents "view not available" errors)
  const [isEditorReady, setIsEditorReady] = useState(false);
  // Track copy feedback state
  const [copied, setCopied] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Ensure content is valid HTML
  const initialContent = content || "<p></p>";

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          gapcursor: false,
          paragraph: false, // Disable default paragraph, we use CustomParagraph
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        CustomParagraph, // Custom paragraph that preserves class attributes
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
        SpanMark, // Custom mark to preserve <span> elements with class/style attributes
        Placeholder.configure({ placeholder }),
      ],
      content: initialContent,
      editable,
      onCreate: () => {
        // Editor view is now fully initialized and safe to access
        setIsEditorReady(true);
      },
      onDestroy: () => {
        // Editor is being destroyed, mark as not ready
        setIsEditorReady(false);
      },
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
      editorProps: {
        attributes: {
          class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4",
          style: `min-height: ${minHeight}`,
        },
        // Strip problematic styles from pasted content (especially from ePUB)
        transformPastedHTML(html) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // List of style properties to remove (common in ePUB files)
          const stylesToRemove = [
            "font-size",
            "font-family",
            "line-height",
            "letter-spacing",
            "word-spacing",
            "text-indent",
            "margin",
            "margin-top",
            "margin-bottom",
            "margin-left",
            "margin-right",
            "padding",
            "padding-top",
            "padding-bottom",
            "padding-left",
            "padding-right",
          ];

          // Remove problematic styles from all elements
          doc.querySelectorAll("[style]").forEach((el) => {
            const element = el as HTMLElement;
            stylesToRemove.forEach(prop => {
              element.style.removeProperty(prop);
            });
            // Clean up empty style attributes
            if (!element.getAttribute("style")?.trim()) {
              element.removeAttribute("style");
            }
          });

          return doc.body.innerHTML;
        },
      },
    },
    [editable]
  );

  // Scroll sync: attach scroll listener to both the container and the editor element
  useEffect(() => {
    const container = scrollContainerRef.current;

    // Guard: Wait until editor view is fully initialized
    // TipTap throws "The editor view is not available" if accessed too early
    if (!isEditorReady || !editor?.view) return;

    // Get the ProseMirror DOM element directly from the editor
    const editorElement = editor.view.dom as HTMLElement | null;

    if (!container) return;

    const handleScroll = (e: Event) => {
      if (isSyncingRef.current || !onScrollRef.current) return;

      const target = e.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;

      const scrollRatio = scrollTop / maxScroll;
      onScrollRef.current(scrollRatio);
    };

    // Attach to wrapper container
    container.addEventListener("scroll", handleScroll, { passive: true });
    // Also attach to ProseMirror element if it exists
    if (editorElement) {
      editorElement.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (editorElement) {
        editorElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [editor, isEditorReady]); // Re-attach when editor is ready

  // Scroll sync: apply scroll position from paired editor
  useEffect(() => {
    const container = scrollContainerRef.current;

    // Guard: Wait until editor view is fully initialized
    if (!isEditorReady || !editor?.view) return;

    const editorElement = editor.view.dom as HTMLElement | null;

    if (syncScrollRatio === undefined || !container) return;

    // Prevent loop
    isSyncingRef.current = true;

    // Try scrolling the container first
    const { scrollHeight: containerScrollHeight, clientHeight: containerClientHeight } = container;
    const containerMaxScroll = containerScrollHeight - containerClientHeight;

    if (containerMaxScroll > 0) {
      container.scrollTop = syncScrollRatio * containerMaxScroll;
    }

    // Also try scrolling the editor element
    if (editorElement) {
      const { scrollHeight, clientHeight } = editorElement;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll > 0) {
        editorElement.scrollTop = syncScrollRatio * maxScroll;
      }
    }

    // Reset sync flag after animation frame
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  }, [syncScrollRatio, scrollSyncId, editor, isEditorReady]);

  // Handle editable state changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Sync content from props (with normalized comparison to avoid update loops)
  useEffect(() => {
    if (!editor) return;
    const newContent = content || "<p></p>";
    const currentHTML = editor.getHTML();
    // Normalize HTML for comparison to avoid false positives from whitespace differences
    const normalizeHTML = (html: string) => html.trim().replace(/\s+/g, " ");
    if (normalizeHTML(newContent) !== normalizeHTML(currentHTML)) {
      editor.commands.setContent(newContent);
    }
  }, [editor, content]);

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

  // Image upload with proper memory cleanup and validation
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    const handleChange = async (e: Event) => {
      // Clean up event listener and input element
      input.removeEventListener("change", handleChange);

      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Файл занадто великий",
          description: "Максимальний розмір 5МБ",
          variant: "destructive",
        });
        return;
      }

      // Validate MIME type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Невірний тип файлу",
          description: "Дозволені тільки зображення",
          variant: "destructive",
        });
        return;
      }

      try {
        // Extract extension safely
        const lastDotIndex = file.name.lastIndexOf(".");
        const ext = lastDotIndex > 0 ? file.name.slice(lastDotIndex + 1).toLowerCase() : "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage.from("blog-media").upload(fileName, file);
        if (uploadError) throw new Error(uploadError.message || "Помилка завантаження");

        const { data } = supabase.storage.from("blog-media").getPublicUrl(fileName);

        // Only update editor if component is still mounted
        if (isMountedRef.current && editor) {
          editor.chain().focus().setImage({ src: data.publicUrl }).run();
          toast({ title: "Зображення завантажено" });
        }
      } catch (error) {
        if (isMountedRef.current) {
          const message = error instanceof Error ? error.message : "Невідома помилка";
          toast({
            title: "Помилка завантаження зображення",
            description: message,
            variant: "destructive",
          });
        }
      }
    };

    input.addEventListener("change", handleChange);
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("Введіть URL:");
    if (!url) return;

    if (!isValidUrl(url)) {
      toast({ title: "Невірний формат URL", variant: "destructive" });
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  }, [editor, isValidUrl]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().unsetLink().run();
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("Введіть YouTube URL:");
    if (!url) return;

    if (!isValidYoutubeUrl(url)) {
      toast({ title: "Невірний YouTube URL", variant: "destructive" });
      return;
    }

    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor, isValidYoutubeUrl]);

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const setColor = useCallback((color: string) => {
    if (color === "none") {
      editor?.chain().focus().unsetColor().run();
    } else {
      editor?.chain().focus().setColor(color).run();
    }
  }, [editor]);

  const setHighlight = useCallback((color: string) => {
    if (color === "none") {
      editor?.chain().focus().unsetHighlight().run();
    } else {
      editor?.chain().focus().setHighlight({ color }).run();
    }
  }, [editor]);

  const setFontSize = useCallback((size: string) => {
    editor?.chain().focus().setMark("textStyle", { fontSize: size }).run();
  }, [editor]);

  const clearFormatting = useCallback(() => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  // Normalize text using normalization rules (preserves HTML structure)
  const normalizeText = useCallback(() => {
    if (!editor) return;

    const html = editor.getHTML();

    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Walk through all text nodes and apply normalization
    const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // Enable all categories for normalization
    const enabledCategories = new Set(ruleCategories.map(c => c.id));
    let totalChanges = 0;

    // Apply normalization to each text node
    for (const textNode of textNodes) {
      const originalText = textNode.textContent || '';
      if (!originalText.trim()) continue;

      const { result, changes } = applyNormalizationRules(originalText, defaultRules, enabledCategories);

      if (result !== originalText) {
        textNode.textContent = result;
        totalChanges += changes.length;
      }
    }

    if (totalChanges > 0) {
      // Update editor content
      editor.commands.setContent(temp.innerHTML);
      toast({
        title: "Нормалізовано",
        description: `Застосовано ${totalChanges} змін`,
      });
    } else {
      toast({
        title: "Текст вже нормалізований",
        description: "Змін не потрібно",
      });
    }
  }, [editor]);

  // Copy entire content to clipboard
  const copyContent = useCallback(async () => {
    if (!editor) return;

    const html = editor.getHTML();
    // Get plain text version by stripping HTML tags
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const plainText = temp.textContent || temp.innerText || '';

    try {
      // Try to copy both HTML and plain text formats
      if (navigator.clipboard && navigator.clipboard.write) {
        const htmlBlob = new Blob([html], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob,
          }),
        ]);
      } else {
        // Fallback to plain text copy
        await navigator.clipboard.writeText(plainText);
      }

      setCopied(true);
      toast({
        title: "Скопійовано",
        description: "Вміст блоку скопійовано в буфер обміну",
      });

      // Reset copied state after 2 seconds
      setTimeout(() => {
        if (isMountedRef.current) {
          setCopied(false);
        }
      }, 2000);
    } catch (error) {
      toast({
        title: "Помилка копіювання",
        description: "Не вдалося скопіювати вміст",
        variant: "destructive",
      });
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="p-4 border border-dashed border-gray-300 rounded-md text-gray-500">
        Завантаження редактора...
      </div>
    );
  }

  return (
    <div
      className={`rounded-md border ${editable ? "border-amber-400/40 hover:border-amber-400/80" : "border-transparent"} transition-colors relative flex flex-col`}
    >

      {/* STICKY TOOLBAR - завжди видимий, поза скрольним контейнером */}
      {editable && (
        <div className="flex-shrink-0 z-40 flex flex-col gap-2 border-b bg-background/95 backdrop-blur-sm px-4 py-2 rounded-t-md">
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
                    { color: "#000000", name: "Чорний" },
                    { color: "#E11D48", name: "Червоний" },
                    { color: "#F59E0B", name: "Помаранчевий" },
                    { color: "#10B981", name: "Зелений" },
                    { color: "#3B82F6", name: "Синій" },
                    { color: "#8B5CF6", name: "Фіолетовий" },
                    { color: "#EC4899", name: "Рожевий" },
                    { color: "#6B7280", name: "Сірий" },
                    { color: "#FFFFFF", name: "Білий" },
                  ].map(({ color, name }) => (
                    <DropdownMenuItem
                      key={color}
                      className="p-0 w-5 h-5 rounded-full cursor-pointer border"
                      style={{ backgroundColor: color }}
                      onClick={() => setColor(color)}
                      aria-label={name}
                      title={name}
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
                    className="p-0 w-5 h-5 rounded-full cursor-pointer border flex items-center justify-center"
                    onClick={() => setHighlight("none")}
                    aria-label="Видалити маркер"
                    title="Видалити маркер"
                  >
                    ✕
                  </DropdownMenuItem>
                  {[
                    { color: "#FEF3C7", name: "Жовтий маркер" },
                    { color: "#DBEAFE", name: "Синій маркер" },
                    { color: "#D1FAE5", name: "Зелений маркер" },
                    { color: "#FCE7F3", name: "Рожевий маркер" },
                    { color: "#E0E7FF", name: "Фіолетовий маркер" },
                  ].map(({ color, name }) => (
                    <DropdownMenuItem
                      key={color}
                      className="p-0 w-5 h-5 rounded-full cursor-pointer border"
                      style={{ backgroundColor: color }}
                      onClick={() => setHighlight(color)}
                      aria-label={name}
                      title={name}
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
              {showNormalizeButton && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={normalizeText}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Нормалізувати текст (виправити транслітерацію)"
                >
                  <Zap className="h-3 w-3" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${copied ? "text-green-600" : ""}`}
                onClick={copyContent}
                onMouseDown={(e) => e.preventDefault()}
                title="Скопіювати весь блок"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDITOR CONTENT - скрольний контейнер */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto min-h-[200px]"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
