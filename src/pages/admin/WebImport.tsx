// src/pages/admin/WebImport.tsx - ПОКРАЩЕНА ВЕРСІЯ
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, AlertTriangle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { parseChapterFromWeb } from "@/utils/import/webImporter";
import { importSingleChapter } from "@/utils/import/importer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type ImportStep = "idle" | "fetching-vedabase" | "fetching-gitabase" | "parsing" | "importing" | "done" | "error";

export default function WebImport() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [books, setBooks] = useState<any[]>([]);
  const [cantos, setCantos] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedCanto, setSelectedCanto] = useState<string>("");
  const [chapterNumber, setChapterNumber] = useState<string>("1");
  const [chapterTitleUa, setChapterTitleUa] = useState<string>("");
  const [chapterTitleEn, setChapterTitleEn] = useState<string>("");
  const [vedabaseUrl, setVedabaseUrl] = useState<string>("https://vedabase.io/en/library/cc/adi/1/");
  const [gitabaseUrl, setGitabaseUrl] = useState<string>("https://gitabase.com/ukr/CC/1/1");

  const [importStep, setImportStep] = useState<ImportStep>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [importResult, setImportResult] = useState<{ versesCount?: number; error?: string } | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
      return;
    }
    loadBooks();
  }, [user, isAdmin, navigate]);

  const loadBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("id, title_ua, title_en, has_cantos")
      .order("display_order");

    if (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити книги",
        variant: "destructive",
      });
      return;
    }

    setBooks(data || []);
  };

  const loadCantos = async (bookId: string) => {
    const { data, error } = await supabase
      .from("cantos")
      .select("id, canto_number, title_ua, title_en")
      .eq("book_id", bookId)
      .order("canto_number");

    if (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити канти",
        variant: "destructive",
      });
      return;
    }

    setCantos(data || []);
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedCanto("");
    setCantos([]);

    const book = books.find((b) => b.id === bookId);
    if (book?.has_cantos) {
      loadCantos(bookId);
    }
  };

  /**
   * Завантажує HTML через CORS proxy з retry логікою
   */
  const fetchWithProxy = async (url: string, retries = 2): Promise<string> => {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
    ];

    for (let attempt = 0; attempt <= retries; attempt++) {
      const proxyUrl = proxies[attempt % proxies.length];

      try {
        console.log(`[WebImport] Attempt ${attempt + 1}: Fetching via`, proxyUrl);
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();

        if (text.length < 100) {
          throw new Error("Response too short, possibly blocked");
        }

        console.log(`[WebImport] Success! Response length: ${text.length}`);
        return text;
      } catch (error) {
        console.error(`[WebImport] Attempt ${attempt + 1} failed:`, error);

        if (attempt === retries) {
          throw new Error(
            `Не вдалося завантажити ${url} після ${retries + 1} спроб: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    throw new Error(`Failed to fetch ${url}`);
  };

  const validateInputs = (): boolean => {
    if (!selectedBook) {
      toast({
        title: "Помилка",
        description: "Виберіть книгу",
        variant: "destructive",
      });
      return false;
    }

    if (cantos.length > 0 && !selectedCanto) {
      toast({
        title: "Помилка",
        description: "Виберіть кант",
        variant: "destructive",
      });
      return false;
    }

    if (!chapterNumber || parseInt(chapterNumber) < 1) {
      toast({
        title: "Помилка",
        description: "Введіть правильний номер глави",
        variant: "destructive",
      });
      return false;
    }

    if (!chapterTitleUa || !chapterTitleEn) {
      toast({
        title: "Помилка",
        description: "Введіть назви глави українською та англійською",
        variant: "destructive",
      });
      return false;
    }

    if (!vedabaseUrl || !gitabaseUrl) {
      toast({
        title: "Помилка",
        description: "Введіть обидва URL",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleImport = async () => {
    if (!validateInputs()) return;

    setImportStep("fetching-vedabase");
    setProgress(10);
    setImportResult(null);

    try {
      // Крок 1: Завантажуємо Vedabase
      console.log("[WebImport] Step 1: Fetching Vedabase...");
      const vedabaseHtml = await fetchWithProxy(vedabaseUrl);
      console.log("[WebImport] Vedabase HTML length:", vedabaseHtml.length);
      setProgress(30);

      // Крок 2: Завантажуємо Gitabase
      setImportStep("fetching-gitabase");
      console.log("[WebImport] Step 2: Fetching Gitabase...");
      const gitabaseHtml = await fetchWithProxy(gitabaseUrl);
      console.log("[WebImport] Gitabase HTML length:", gitabaseHtml.length);
      setProgress(50);

      // Крок 3: Парсимо главу
      setImportStep("parsing");
      console.log("[WebImport] Step 3: Parsing chapter...");
      const chapter = await parseChapterFromWeb(
        vedabaseHtml,
        gitabaseHtml,
        parseInt(chapterNumber),
        chapterTitleUa,
        chapterTitleEn,
      );

      console.log("[WebImport] Parsed chapter:", {
        chapter_number: chapter.chapter_number,
        verses_count: chapter.verses.length,
        title_ua: chapter.title_ua,
      });

      if (chapter.verses.length === 0) {
        throw new Error("Не знайдено жодного вірша. Перевірте URL та структуру сторінок.");
      }

      setProgress(70);

      // Крок 4: Імпортуємо в базу даних
      setImportStep("importing");
      console.log("[WebImport] Step 4: Importing to database...");
      await importSingleChapter(supabase, {
        bookId: selectedBook,
        cantoId: selectedCanto || null,
        chapter,
        strategy: "replace",
      });

      setProgress(100);
      setImportStep("done");
      setImportResult({ versesCount: chapter.verses.length });

      console.log("[WebImport] ✅ Import successful!");
      toast({
        title: "Успіх!",
        description: `Главу ${chapterNumber} успішно імпортовано (${chapter.verses.length} віршів)`,
      });

      // Очищуємо форму після успішного імпорту
      setTimeout(() => {
        setChapterNumber((prev) => (parseInt(prev) + 1).toString());
        setChapterTitleUa("");
        setChapterTitleEn("");
        setImportStep("idle");
        setProgress(0);
      }, 3000);
    } catch (error) {
      console.error("[WebImport] ❌ Import error:", error);
      setImportStep("error");
      setImportResult({ error: error instanceof Error ? error.message : "Невідома помилка" });

      toast({
        title: "Помилка імпорту",
        description: error instanceof Error ? error.message : "Не вдалося імпортувати главу",
        variant: "destructive",
      });
    }
  };

  const resetImport = () => {
    setImportStep("idle");
    setProgress(0);
    setImportResult(null);
  };

  if (!user || !isAdmin) return null;

  const isImporting = importStep !== "idle" && importStep !== "done" && importStep !== "error";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Імпорт з веб-сторінок</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Попередження про CORS */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Важливо</AlertTitle>
          <AlertDescription>
            Імпорт використовує CORS proxy для завантаження контенту з Vedabase та Gitabase. Процес може зайняти 30-60
            секунд. Дивіться логи в консолі браузера (F12) для детальної інформації.
          </AlertDescription>
        </Alert>

        <Card className="p-6 mb-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="book">Книга *</Label>
              <Select value={selectedBook} onValueChange={handleBookChange} disabled={isImporting}>
                <SelectTrigger id="book">
                  <SelectValue placeholder="Виберіть книгу" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title_ua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {cantos.length > 0 && (
              <div>
                <Label htmlFor="canto">Кант *</Label>
                <Select value={selectedCanto} onValueChange={setSelectedCanto} disabled={isImporting}>
                  <SelectTrigger id="canto">
                    <SelectValue placeholder="Виберіть кант" />
                  </SelectTrigger>
                  <SelectContent>
                    {cantos.map((canto) => (
                      <SelectItem key={canto.id} value={canto.id}>
                        Кант {canto.canto_number}: {canto.title_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="chapterNumber">Номер глави *</Label>
              <Input
                id="chapterNumber"
                type="number"
                min="1"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                placeholder="1"
                disabled={isImporting}
              />
            </div>

            <div>
              <Label htmlFor="titleUa">Назва глави (українською) *</Label>
              <Input
                id="titleUa"
                value={chapterTitleUa}
                onChange={(e) => setChapterTitleUa(e.target.value)}
                placeholder="Духовний учитель"
                disabled={isImporting}
              />
            </div>

            <div>
              <Label htmlFor="titleEn">Назва глави (англійською) *</Label>
              <Input
                id="titleEn"
                value={chapterTitleEn}
                onChange={(e) => setChapterTitleEn(e.target.value)}
                placeholder="The Spiritual Master"
                disabled={isImporting}
              />
            </div>

            <div>
              <Label htmlFor="vedabaseUrl">URL Vedabase (бенгалі + англійська) *</Label>
              <Input
                id="vedabaseUrl"
                value={vedabaseUrl}
                onChange={(e) => setVedabaseUrl(e.target.value)}
                placeholder="https://vedabase.io/en/library/cc/adi/1/"
                disabled={isImporting}
              />
              <p className="text-xs text-muted-foreground mt-1">Приклад: https://vedabase.io/en/library/cc/adi/1/</p>
            </div>

            <div>
              <Label htmlFor="gitabaseUrl">URL Gitabase (українська) *</Label>
              <Input
                id="gitabaseUrl"
                value={gitabaseUrl}
                onChange={(e) => setGitabaseUrl(e.target.value)}
                placeholder="https://gitabase.com/ukr/CC/1/1"
                disabled={isImporting}
              />
              <p className="text-xs text-muted-foreground mt-1">Приклад: https://gitabase.com/ukr/CC/1/1</p>
            </div>

            {/* Progress bar */}
            {isImporting && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  {importStep === "fetching-vedabase" && "⏳ Завантажуємо дані з Vedabase..."}
                  {importStep === "fetching-gitabase" && "⏳ Завантажуємо дані з Gitabase..."}
                  {importStep === "parsing" && "🔄 Обробляємо дані..."}
                  {importStep === "importing" && "📥 Імпортуємо до бази даних..."}
                </p>
              </div>
            )}

            {/* Result messages */}
            {importStep === "done" && importResult && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Успішно імпортовано!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Главу {chapterNumber} імпортовано. Знайдено {importResult.versesCount} віршів.
                </AlertDescription>
              </Alert>
            )}

            {importStep === "error" && importResult?.error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Помилка імпорту</AlertTitle>
                <AlertDescription>{importResult.error}</AlertDescription>
              </Alert>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={isImporting} className="flex-1" size="lg">
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Імпортуємо...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Імпортувати главу
                  </>
                )}
              </Button>

              {(importStep === "done" || importStep === "error") && (
                <Button onClick={resetImport} variant="outline" size="lg">
                  Скинути
                </Button>
              )}
            </div>

            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              <p className="font-semibold">💡 Порада:</p>
              <p>• Відкрийте консоль браузера (F12) щоб бачити детальні логи імпорту</p>
              <p>• Переконайтеся що URL вказують на першу сторінку глави</p>
              <p>• Якщо імпорт не спрацював, спробуйте ще раз - це може бути тимчасова проблема proxy</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
