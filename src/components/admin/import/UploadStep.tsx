import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, FileText } from "lucide-react";
import { extractTextFromPDF } from "@/utils/import/pdf";
import { extractTextFromEPUB } from "@/utils/import/epub";
import { extractTextFromDOCX } from "@/utils/import/docx";
import { marked } from "marked";
import { toast } from "sonner";
import { ParserStatus } from "@/components/admin/ParserStatus";

type SourceKind = "unknown" | "html" | "markdown" | "text";

interface Props {
  onNext: (text: string) => void;
  onProgress?: (status: string) => void;
  onError?: (msg: string) => void;
  statusText?: string;
  errorText?: string;
}

export function UploadStep({ onNext, onProgress, onError, statusText, errorText }: Props) {
  const [raw, setRaw] = useState<string>("");
  const [detected, setDetected] = useState<SourceKind>("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [previewHTML, setPreviewHTML] = useState("");

  // ───────────── helpers
  const isLikelyHTML = (s: string) => /<\s*(p|div|h1|h2|h3|h4|h5|h6|ul|ol|li|table|strong|em|a)\b/i.test(s.trim());
  const isLikelyMarkdown = (s: string) =>
    /(^|\n)\s{0,3}(#{1,6}\s)|(\*\s)|(\-\s)|(\d+\.\s)|(\*\*.+\*\*)|(_.+_)|(`.+`)/.test(s);

  const detectKind = (s: string): SourceKind => {
    if (isLikelyHTML(s)) return "html";
    if (isLikelyMarkdown(s)) return "markdown";
    return "text";
  };

  const htmlFromMarkdown = async (md: string) => await marked(md);

  const htmlFromPlainText = (txt: string) => {
    const paragraphs = txt
      .split(/\n{2,}/)
      .map((block) => {
        const html = block
          .split("\n")
          .map((line) => line.replace(/</g, "&lt;").replace(/>/g, "&gt;"))
          .join("<br/>");
        return `<p>${html}</p>`;
      })
      .join("\n");
    return paragraphs || "<p></p>";
  };

  const plainFromHTML = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").trim();
  };

  const handlePasteChange = (val: string) => {
    setRaw(val);
    setDetected(detectKind(val));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    onProgress?.("Підготовка…");

    try {
      let extractedText = "";
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (file.type === "application/pdf" || ext === "pdf") {
        // якщо у вашій реалізації extractTextFromPDF підтримує onProgress — передасться;
        // якщо ні — безпечно ігнорується.
        extractedText = await (extractTextFromPDF as any)(file, {
          onProgress: ({ page, total }: { page: number; total: number }) =>
            onProgress?.(`Обробка PDF… ${page}/${total}`),
        });
      } else if (file.type === "application/epub+zip" || ext === "epub") {
        onProgress?.("Обробка EPUB…");
        extractedText = await extractTextFromEPUB(file);
      } else if (
        ext === "docx" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        onProgress?.("Обробка DOCX…");
        extractedText = await extractTextFromDOCX(file);
      } else if (ext === "md") {
        onProgress?.("Читання Markdown…");
        extractedText = await file.text();
      } else if (file.type === "text/plain" || ext === "txt") {
        onProgress?.("Читання TXT…");
        extractedText = await file.text();
      } else {
        const msg = "Непідтримуваний формат. Використайте PDF/DOCX/EPUB/TXT/MD.";
        toast.error(msg);
        onError?.(msg);
        return;
      }

      if (!extractedText || !extractedText.trim()) {
        const msg = "Порожній результат. Можливо, це скани без тексту.";
        toast.error(msg);
        onError?.(msg);
        return;
      }

      setRaw(extractedText);
      setDetected(detectKind(extractedText));
      onProgress?.("Готово.");
      toast.success("Файл успішно завантажено");
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Помилка при обробці файлу.";
      toast.error(msg);
      onError?.(msg);
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  const buildOutput = async (): Promise<string> => {
    if (!preserveFormatting) {
      if (detected === "html") return plainFromHTML(raw);
      if (detected === "markdown") return plainFromHTML(await marked(raw));
      return raw;
    }
    if (detected === "html") return raw;
    if (detected === "markdown") return await marked(raw);
    return htmlFromPlainText(raw);
  };

  const handleNext = async () => {
    if (!raw.trim()) {
      const msg = "Будь ласка, завантажте файл або вставте текст";
      toast.error(msg);
      onError?.(msg);
      return;
    }
    const out = await buildOutput();
    onNext(out);
  };

  useEffect(() => {
    const updatePreview = async () => {
      if (!raw) {
        setPreviewHTML("");
        return;
      }
      if (preserveFormatting) {
        const html = await buildOutput();
        setPreviewHTML(html);
      } else {
        const plainText =
          detected === "html" ? plainFromHTML(raw) : detected === "markdown" ? plainFromHTML(await marked(raw)) : raw;

        setPreviewHTML(
          `<pre style="white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${plainText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</pre>`,
        );
      }
    };
    updatePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw, detected, preserveFormatting]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-xl font-bold">Крок 1: Завантаження тексту</h2>
        <p className="text-muted-foreground">
          Завантажте файл книги (PDF, EPUB, DOCX, TXT, MD) або вставте текст вручну. Форматування можна зберегти.
        </p>
      </div>

      <ParserStatus />

      {/* перемикач збереження форматування */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-1">
          <Label htmlFor="preserve-format" className="font-medium">
            Зберігати форматування
          </Label>
        </div>
        <Switch id="preserve-format" checked={preserveFormatting} onCheckedChange={setPreserveFormatting} />
      </div>

      <Tabs defaultValue="file">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            <Upload className="mr-2 h-4 w-4" />
            Завантажити файл
          </TabsTrigger>
          <TabsTrigger value="paste">
            <FileText className="mr-2 h-4 w-4" />
            Вставити текст
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <div className="rounded-lg border-2 border-dashed p-8 text-center">
            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <label className="cursor-pointer">
              <span className="text-primary hover:underline">Натисніть для вибору файлу</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.epub,.txt,.md,.docx"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </label>
            <p className="mt-2 text-sm text-muted-foreground">PDF, EPUB, DOCX, TXT або MD</p>
          </div>

          {isLoading && <div className="text-center text-muted-foreground">Обробка файлу…</div>}
          {statusText && !errorText && <div className="text-center text-sm text-muted-foreground">{statusText}</div>}
          {errorText && <div className="text-center text-sm text-destructive">{errorText}</div>}
        </TabsContent>

        <TabsContent value="paste" className="space-y-3">
          <Textarea
            placeholder="Вставте текст книги сюди (Markdown/HTML/Plain)…"
            value={raw}
            onChange={(e) => handlePasteChange(e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Виявлено:{" "}
            <span className="font-medium">
              {detected === "html"
                ? "HTML"
                : detected === "markdown"
                  ? "Markdown"
                  : detected === "text"
                    ? "Звичайний текст"
                    : "невідомо"}
            </span>
          </p>
        </TabsContent>
      </Tabs>

      {raw && (
        <div className="rounded-lg bg-muted p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Символів: {raw.length.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              Попередній перегляд {preserveFormatting ? "(HTML)" : "(Plain text)"}
            </p>
          </div>
          <div
            className="prose prose-slate max-w-none rounded-md bg-background p-4 text-sm dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!raw.trim()}>
          Далі: Налаштування
        </Button>
      </div>
    </div>
  );
}
