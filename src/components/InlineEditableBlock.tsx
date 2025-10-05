import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InlineEditableBlockProps {
  value: string;
  onChange: (value: string) => void;
  type: "text" | "textarea" | "image";
  label: string;
  isEditing: boolean;
  placeholder?: string;
  className?: string;
}

export const InlineEditableBlock = ({
  value,
  onChange,
  type,
  label,
  isEditing,
  placeholder,
  className = "",
}: InlineEditableBlockProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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

      onChange(publicUrl);
      toast({ title: "Зображення завантажено" });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: "Помилка завантаження", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isEditing) {
    if (type === "image" && value) {
      return (
        <div className={`w-full h-[400px] relative overflow-hidden rounded-lg ${className}`}>
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`space-y-2 p-4 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/60 transition-colors ${className}`}>
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      
      {type === "text" && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-medium"
        />
      )}

      {type === "textarea" && (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="resize-none"
        />
      )}

      {type === "image" && (
        <div className="space-y-2">
          {value && (
            <div className="w-full h-[200px] relative overflow-hidden rounded-lg mb-2">
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="URL зображення"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => document.getElementById(`file-${label}`)?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Upload className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            </Button>
            <input
              id={`file-${label}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
};