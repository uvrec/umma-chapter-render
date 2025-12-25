/**
 * Компонент для імпорту листів Прабгупади з Vedabase та JSON файлів
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Globe,
} from "lucide-react";
import {
  importLetter,
  importLettersBatch,
  parseLetterJSON,
  parseLettersJSONBatch,
} from "@/utils/import/letterImporter";
import type { LetterImportData } from "@/types/letter";

export const LetterImporter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLetter, setCurrentLetter] = useState<string>("");

  // URL import
  const [vedabaseUrl, setVedabaseUrl] = useState("");
  const [importedData, setImportedData] = useState<any>(null);

  // Single import
  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState<LetterImportData | null>(null);

  // Batch import
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchResults, setBatchResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: Array<{ slug: string; error: string }>;
  } | null>(null);

  /**
   * Імпорт з Vedabase URL
   */
  const handleImportFromUrl = async () => {
    // Extract slug from URL
    const match = vedabaseUrl.match(/\/letters\/([^\/]+)/);
    if (!match) {
      toast({
        title: "Помилка",
        description: "Невірний формат URL. Приклад: https://vedabase.io/en/library/letters/letter-to-mahatma-gandhi/",
        variant: "destructive",
      });
      return;
    }

    const slug = match[1].replace(/\/$/, "");
    setIsProcessing(true);
    setProgress(10);

    try {
      const { data, error } = await supabase.functions.invoke("vedabase-import", {
        body: {
          type: "letters",
          action: "import",
          slugs: [slug],
        },
      });

      if (error) throw error;

      setProgress(100);

      if (data.imported > 0) {
        toast({
          title: "Імпорт успішний",
          description: `Лист "${slug}" імпортовано`,
        });
        setImportedData(data);
        setVedabaseUrl("");
      } else {
        toast({
          title: "Помилка імпорту",
          description: data.errors?.[0] || "Невідома помилка",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  /**
   * Обробка single JSON input
   */
  const handleParseJSON = () => {
    const parsed = parseLetterJSON(jsonInput);
    if (parsed) {
      setParsedData(parsed);
      toast({
        title: "JSON розпарсено",
        description: `Лист до: ${parsed.metadata.recipient_en}`,
      });
    } else {
      toast({
        title: "Помилка парсингу",
        description: "Перевірте формат JSON",
        variant: "destructive",
      });
    }
  };

  /**
   * Імпорт одного листа
   */
  const handleImportSingle = async () => {
    if (!parsedData) {
      toast({
        title: "Помилка",
        description: "Спочатку розпарсіть JSON",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(50);
      const result = await importLetter(parsedData);

      if (result.success) {
        toast({
          title: "Імпорт успішний",
          description: `Лист імпортовано: ${parsedData.metadata.slug}`,
        });
        setJsonInput("");
        setParsedData(null);
      } else {
        throw new Error(result.error);
      }

      setProgress(100);
    } catch (error: any) {
      toast({
        title: "Помилка імпорту",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  /**
   * Обробка завантаження файлів для batch import
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const jsonFiles = files.filter((f) => f.name.endsWith(".json"));

    if (jsonFiles.length === 0) {
      toast({
        title: "Помилка",
        description: "Оберіть JSON файли",
        variant: "destructive",
      });
      return;
    }

    setBatchFiles(jsonFiles);
    toast({
      title: "Файли завантажено",
      description: `Обрано ${jsonFiles.length} файлів`,
    });
  };

  /**
   * Batch імпорт багатьох листів
   */
  const handleBatchImport = async () => {
    if (batchFiles.length === 0) {
      toast({
        title: "Помилка",
        description: "Оберіть файли для імпорту",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setBatchResults(null);

    try {
      // Прочитати всі файли
      const jsonStrings = await Promise.all(
        batchFiles.map((file) => file.text())
      );

      // Розпарсити JSON
      const letters = parseLettersJSONBatch(jsonStrings);

      if (letters.length === 0) {
        throw new Error("Не вдалося розпарсити жодного JSON файлу");
      }

      // Імпортувати
      const results = await importLettersBatch(
        letters,
        (current, total, slug) => {
          setCurrentLetter(slug);
          setProgress(Math.round((current / total) * 100));
        }
      );

      setBatchResults(results);

      if (results.successful > 0) {
        toast({
          title: "Імпорт завершено",
          description: `Успішно: ${results.successful}, Помилки: ${results.failed}`,
        });
      } else {
        toast({
          title: "Імпорт не вдався",
          description: "Жодного листа не імпортовано",
          variant: "destructive",
        });
      }

      setBatchFiles([]);
    } catch (error: any) {
      toast({
        title: "Помилка batch імпорту",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentLetter("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Імпорт листів
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Import */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Імпорт з Vedabase URL</Label>
          <div className="flex gap-2">
            <Input
              value={vedabaseUrl}
              onChange={(e) => setVedabaseUrl(e.target.value)}
              placeholder="https://vedabase.io/en/library/letters/letter-to-mahatma-gandhi/"
              disabled={isProcessing}
            />
            <Button
              onClick={handleImportFromUrl}
              disabled={!vedabaseUrl || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
            </Button>
          </div>
          {importedData && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded text-sm">
              <CheckCircle className="w-4 h-4 inline mr-2 text-green-600" />
              Імпортовано: {importedData.imported} листів
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <Label className="text-base font-semibold">Або імпорт з JSON</Label>
        </div>

        {/* Single Import */}
        <div className="space-y-3">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"metadata": {...}, "content_en": "..."}'
            className="font-mono text-sm min-h-[120px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleParseJSON}
              disabled={!jsonInput || isProcessing}
              variant="outline"
              size="sm"
            >
              Розпарсити
            </Button>
            <Button
              onClick={handleImportSingle}
              disabled={!parsedData || isProcessing}
              size="sm"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Імпортувати
            </Button>
          </div>
          {parsedData && (
            <div className="p-3 bg-muted rounded text-sm">
              <strong>До: {parsedData.metadata.recipient_en}</strong>
              <br />
              <span className="text-muted-foreground">
                {parsedData.metadata.letter_date}
              </span>
            </div>
          )}
        </div>

        {/* Batch Import */}
        <div className="border-t pt-4 space-y-3">
          <Label className="text-base font-semibold">Batch імпорт</Label>
          <Input
            type="file"
            multiple
            accept=".json"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
          {batchFiles.length > 0 && (
            <Button
              onClick={handleBatchImport}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {currentLetter} ({progress}%)
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Імпортувати {batchFiles.length} файлів
                </>
              )}
            </Button>
          )}
          {batchResults && (
            <div className="flex gap-2">
              <Badge className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                {batchResults.successful}
              </Badge>
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                {batchResults.failed}
              </Badge>
            </div>
          )}
        </div>

        {isProcessing && <Progress value={progress} />}
      </CardContent>
    </Card>
  );
};
