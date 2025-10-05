import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Bold,
  Italic,
  Heading2,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
} from 'lucide-react';

interface InlineTiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  label: string;
}

export const InlineTiptapEditor = ({ content, onChange, label }: InlineTiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Color,
      TextStyle,
      Placeholder.configure({
        placeholder: "Редагуйте контент...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('page-media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('page-media')
          .getPublicUrl(fileName);

        editor?.chain().focus().setImage({ src: publicUrl }).run();
        toast({ title: "Зображення додано" });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({ title: "Помилка завантаження", variant: "destructive" });
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt('Введіть URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Введіть YouTube URL:');
    if (url) {
      editor?.commands.setYoutubeVideo({ src: url });
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-2 p-4 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/60 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
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
      </div>
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none min-h-[200px] focus:outline-none"
      />
    </div>
  );
};