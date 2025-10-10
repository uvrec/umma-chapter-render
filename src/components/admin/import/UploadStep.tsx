import { useState } from "react";
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

interface UploadStepProps {
  onNext: (text: string) => void; // передаємо або HTML (коли preserve), або plain text
}

type SourceKind = "unknown" | "html" | "markdown" | "text";

export function UploadStep({ onNext }: UploadStepProps) {
  const [raw, setRaw] = useState<string>(""); // первинний вміст (як завантажили/вставили)
  const [detected, setDetected] = useState<SourceKind>("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [preserveFormatting, setPreserveFormatting] = useState(true);

  // ————————————— helpers
  const isLikelyHTML = (s: string) => /<\s*(p|div|h1|h2|h3|h4|h5|h6|ul|ol|li|table|strong|em|a)\b/i.test(s.trim());
  const isLikelyMarkdown = (s: string) =>
    /(^|\n)\s{0,3}(#{1,6}\s)|(\*\s)|(\-\s)|(\d+\.\s)|(\*\*.+\*\*)|(_.+_)|(`.+`)/.test(s);

  const htmlFromMarkdown = (md: string) => marked(md);

  const htmlFromPlainText = (txt: string) => {
    // перетворюємо пусті рядки на <p>, один перенос на <br />
    const paragraphs = txt
      .split(/\n{2,}/)
      .map((block) => {
        const html = block
          .split("\n")
          .map((line) => line.replace(/</g, "&lt;").replace(/>/g, "&gt;")) // базова екранізація
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

  // Після завантаження або вставки: визначаємо тип вмісту
  const detectKind = (s: string): SourceKind => {
    if (isLikelyHTML(s)) return "html";
    if (isLikelyMarkdown(s)) return "markdown";
    return "text";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      let extractedText = "";

      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file); // ймовірно TEXT
      } else if (file.type === "application/epub+zip") {
        extractedText = await extractTextFromEPUB(file); // залежить від реалізації (HTML або TEXT)
      } else if (
        file.name.endsWith(".docx") ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        extractedText = await extractTextFromDOCX(file); // залежить від реалізації (HTML або TEXT)
      } else if (file.name.endsWith(".md")) {
        extractedText = await file.text(); // MARKDOWN
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        extractedText = await file.text(); // TEXT
      } else {
        toast.error("Непідтримуваний формат файлу");
        return;
      }

      setRaw(extractedText);
      setDetected(detectKind(extractedText));
      toast.success("Файл успішно завантажено");
    } catch (error) {
      console.error("Error extracting text:", error);
      toast.error("Помилка при обробці файлу");
    } finally {
      setIsLoading(false);
      // очищаємо input, щоб можна було повторно завантажити той самий файл
      e.target.value = "";
    }
  };

  const handlePasteChange = (val: string) => {
    setRaw(val);
    setDetected(detectKind(val));
  };

  // те, що віддамо у onNext
  const buildOutput = (): string => {
    if (!preserveFormatting) {
      // Повертаємо plain text (з HTML/MD знімаємо розмітку)
      if (detected === "html") return plainFromHTML(raw);
      if (detected === "markdown") return plainFromHTML(htmlFromMarkdown(raw));
      return raw; // і так plain text
    }

    // Preserve formatting (віддаємо HTML):
    if (detected === "html") return raw;
    if (detected === "markdown") return htmlFromMarkdown(raw);
    // text → простий HTML з <p> і <br />
    return htmlFromPlainText(raw);
  };

  const handleNext = () => {
    if (!raw.trim()) {
      toast.error("Будь ласка, завантажте файл або вставте текст");
      return;
    }
    const out = buildOutput();
    onNext(out);
  };

  const previewHTML = preserveFormatting
    ? buildOutput() // HTML
    : `<pre style="white-space:pre-wrap;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,'Liberation Mono','Courier New',monospace;">${(detected ===
      "html"
        ? plainFromHTML(raw)
        : detected === "markdown"
          ? plainFromHTML(htmlFromMarkdown(raw))
          : raw
      )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</pre>`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-xl font-bold">Крок 1: Завантаження тексту</h2>
        <p className="text-muted-foreground">
          Завантажте файл книги (PDF, EPUB, DOCX, TXT, MD) або вставте текст вручну. Форматування можна зберегти.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-1">
          <Label htmlFor="preserve-format" className="font-medium">
            Зберігати форматування
          </Label>
          <p className="text-xs text-muted-foreground">
            Якщо увімкнено — результатом буде HTML (Markdown конвертується, текст загортається у параграфи).
          </p>
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
