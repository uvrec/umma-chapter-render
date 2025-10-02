import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText } from 'lucide-react';
import { extractTextFromPDF } from '@/utils/import/pdf';
import { extractTextFromEPUB } from '@/utils/import/epub';
import { normalizeText } from '@/utils/import/normalizers';
import { toast } from 'sonner';

interface UploadStepProps {
  onNext: (text: string) => void;
}

export function UploadStep({ onNext }: UploadStepProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      let extractedText = '';

      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type === 'application/epub+zip') {
        extractedText = await extractTextFromEPUB(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        extractedText = await file.text();
      } else if (file.name.endsWith('.md')) {
        extractedText = await file.text();
      } else {
        toast.error('Непідтримуваний формат файлу');
        return;
      }

      setText(normalizeText(extractedText));
      toast.success('Файл успішно завантажено');
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error('Помилка при обробці файлу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!text.trim()) {
      toast.error('Будь ласка, завантажте файл або введіть текст');
      return;
    }
    onNext(normalizeText(text));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Крок 1: Завантаження тексту</h2>
        <p className="text-muted-foreground">
          Завантажте файл книги (PDF, EPUB, TXT, MD) або вставте текст вручну
        </p>
      </div>

      <Tabs defaultValue="file">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            <Upload className="w-4 h-4 mr-2" />
            Завантажити файл
          </TabsTrigger>
          <TabsTrigger value="paste">
            <FileText className="w-4 h-4 mr-2" />
            Вставити текст
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <label className="cursor-pointer">
              <span className="text-primary hover:underline">
                Натисніть для вибору файлу
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.epub,.txt,.md"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </label>
            <p className="text-sm text-muted-foreground mt-2">
              PDF, EPUB, TXT або MD
            </p>
          </div>
          
          {isLoading && (
            <div className="text-center text-muted-foreground">
              Обробка файлу...
            </div>
          )}
        </TabsContent>

        <TabsContent value="paste">
          <Textarea
            placeholder="Вставте текст книги сюди..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />
        </TabsContent>
      </Tabs>

      {text && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Витягнуто {text.length.toLocaleString()} символів
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!text.trim()}>
          Далі: Налаштування
        </Button>
      </div>
    </div>
  );
}
