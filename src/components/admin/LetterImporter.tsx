/**
 * Компонент для імпорту листів Прабгупади з JSON файлів
 *
 * ВАЖЛИВО: Потрібна міграція 20251107000002_create_letters_tables.sql
 * Після застосування міграції, Supabase автоматично згенерує типи для таблиці letters
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Info,
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
   * Обробка single JSON input
   */
  const handleParseJSON = () => {
    const parsed = parseLetterJSON(jsonInput);
    if (parsed) {
      setParsedData(parsed);
      toast({
        title: "✅ JSON розпарсено",
        description: `Лист до: ${parsed.metadata.recipient_en}`,
      });
    } else {
      toast({
        title: "❌ Помилка парсингу",
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
          title: "✅ Імпорт успішний",
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
        title: "❌ Помилка імпорту",
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
          title: "✅ Імпорт завершено",
          description: `Успішно: ${results.successful}, Помилки: ${results.failed}`,
        });
      } else {
        toast({
          title: "❌ Імпорт не вдався",
          description: "Жодного листа не імпортовано",
          variant: "destructive",
        });
      }

      setBatchFiles([]);
    } catch (error: any) {
      toast({
        title: "❌ Помилка batch імпорту",
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
    <div className="space-y-6">
      {/* Інформація */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>ℹ️ Важливо:</strong> Для роботи цього інструменту потрібно застосувати
          міграцію <code>20251107000002_create_letters_tables.sql</code> до бази даних.
          Після застосування міграції, Supabase автоматично згенерує TypeScript типи.
        </AlertDescription>
      </Alert>

      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Mail className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 dark:text-blue-100">
          <strong>📮 Workflow імпорту:</strong>
          <ol className="list-decimal ml-4 mt-2 space-y-1">
            <li>
              Виконайте <code>python tools/letters_importer.py --slug [slug]</code>
            </li>
            <li>
              Виконайте <code>python tools/letter_translator.py --input [file]</code>
            </li>
            <li>Завантажте згенерований JSON нижче</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Single Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Імпорт одного листа
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>JSON дані листа</Label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"metadata": {"slug": "letter-to-mahatma-gandhi", ...}, "content_en": "..."}'
              className="font-mono text-sm min-h-[200px]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleParseJSON}
              disabled={!jsonInput || isProcessing}
              variant="outline"
            >
              Розпарсити JSON
            </Button>
            <Button
              onClick={handleImportSingle}
              disabled={!parsedData || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Імпорт...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Імпортувати
                </>
              )}
            </Button>
          </div>

          {parsedData && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-semibold">Готово до імпорту:</span>
              </div>
              <div className="text-sm space-y-1">
                <div>
                  <strong>Slug:</strong> {parsedData.metadata.slug}
                </div>
                <div>
                  <strong>Отримувач (EN):</strong> {parsedData.metadata.recipient_en}
                </div>
                <div>
                  <strong>Отримувач (UA):</strong> {parsedData.metadata.recipient_ua}
                </div>
                <div>
                  <strong>Дата:</strong> {parsedData.metadata.letter_date}
                </div>
                <div>
                  <strong>Локація:</strong> {parsedData.metadata.location_en}
                </div>
                {parsedData.metadata.reference && (
                  <div>
                    <strong>Reference:</strong> {parsedData.metadata.reference}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Batch імпорт (багато листів)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Оберіть JSON файли</Label>
            <Input
              type="file"
              multiple
              accept=".json"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
            {batchFiles.length > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                Обрано файлів: {batchFiles.length}
              </div>
            )}
          </div>

          <Button
            onClick={handleBatchImport}
            disabled={batchFiles.length === 0 || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Імпорт {currentLetter}... ({progress}%)
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Імпортувати {batchFiles.length} листів
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {currentLetter}
              </p>
            </div>
          )}

          {batchResults && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Badge variant="outline" className="justify-center">
                  Всього: {batchResults.total}
                </Badge>
                <Badge className="justify-center bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Успішно: {batchResults.successful}
                </Badge>
                <Badge variant="destructive" className="justify-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  Помилки: {batchResults.failed}
                </Badge>
              </div>

              {batchResults.errors.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2 text-red-900 dark:text-red-100">
                    Помилки імпорту:
                  </h4>
                  <ul className="text-xs space-y-1 text-red-800 dark:text-red-200">
                    {batchResults.errors.map((err, idx) => (
                      <li key={idx}>
                        <strong>{err.slug}:</strong> {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Інструкції */}
      <Card>
        <CardHeader>
          <CardTitle>📖 Інструкції</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div>
            <h4 className="font-semibold mb-1">1. Підготовка JSON</h4>
            <p className="text-muted-foreground">
              Використовуйте Python скрипти для завантаження листів з vedabase.io:
            </p>
            <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
              python tools/letters_importer.py --slug letter-to-mahatma-gandhi
            </pre>
            <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
              python tools/letter_translator.py --input tools/outputs/letters/letter-to-mahatma-gandhi.json
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-1">2. Формат slug</h4>
            <p className="text-muted-foreground">
              Slug формат: <code>letter-to-[recipient-name]</code>
              <br />
              Приклад: <code>letter-to-mahatma-gandhi</code>, <code>letter-to-jawaharlal-nehru</code>
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">3. Структура JSON</h4>
            <p className="text-muted-foreground">
              JSON має містити <code>metadata</code> (з recipient, date, location) та <code>content_en</code>
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">4. Після імпорту</h4>
            <p className="text-muted-foreground">
              Листи будуть доступні на <code>/library/letters</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
