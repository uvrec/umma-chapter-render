import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AudioUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  accept?: string;
  maxSizeMB?: number;
  showManualInput?: boolean;
}

export function AudioUploader({
  label,
  value,
  onChange,
  bucket = "verse-audio",
  accept = "audio/*",
  maxSizeMB = 50,
  showManualInput = true,
}: AudioUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/m4a",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/aac",
    "audio/flac",
  ];

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Помилка",
        description: "Підтримуються тільки аудіо файли (MP3, M4A, WAV, OGG, FLAC)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "Помилка",
        description: `Файл завеликий (${fileSizeMB.toFixed(1)}MB). Максимум: ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onChange(publicUrl);
      setUploadProgress(100);

      toast({
        title: "Успіх",
        description: "Аудіо файл успішно завантажено",
      });
    } catch (error: any) {
      toast({
        title: "Помилка завантаження",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input to allow re-uploading the same file
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      // Extract file path from URL
      const urlParts = value.split(`/${bucket}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from(bucket).remove([filePath]);
      }

      onChange("");
      toast({
        title: "Успіх",
        description: "Аудіо файл видалено",
      });
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        // Preview with audio player
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
          <audio src={value} controls className="flex-1 h-10" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
            aria-label="Видалити аудіо"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Upload zone
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Input
            id={`audio-upload-${label}`}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <Label
            htmlFor={`audio-upload-${label}`}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {isUploading ? "Завантаження..." : "Натисніть або перетягніть аудіо"}
            </span>
            <span className="text-xs text-muted-foreground">
              MP3, M4A, WAV, OGG, FLAC (макс. {maxSizeMB}MB)
            </span>
          </Label>
        </div>
      )}

      {isUploading && (
        <div className="space-y-1">
          <Progress value={uploadProgress} />
          <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
        </div>
      )}

      {showManualInput && !value && !isUploading && (
        <>
          <div className="text-xs text-muted-foreground text-center">або вставте URL:</div>
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/audio.mp3"
          />
        </>
      )}
    </div>
  );
}
