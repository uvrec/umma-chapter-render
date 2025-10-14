// src/pages/admin/WebImport.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { parseChapterFromWeb } from "@/utils/import/webImporter";
import { importSingleChapter } from "@/utils/import/importer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [vedabaseUrl, setVedabaseUrl] = useState<string>("https://vedabase.io/en/library/cc/adi/1/1/");
  const [gitabaseUrl, setGitabaseUrl] = useState<string>("https://gitabase.com/ukr/CC/1/1");
  const [isImporting, setIsImporting] = useState(false);

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
   * Завантажує HTML через CORS proxy
   */
  const fetchWithProxy = async (url: string): Promise<string> => {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      throw new Error(`Не вдалося завантажити контент з ${url}. Перевірте URL.`);
    }
  };

  const handleImport = async () => {
    console.log("[WebImport] handleImport started");
    console.log("[WebImport] selectedBook:", selectedBook);
    console.log("[WebImport] selectedCanto:", selectedCanto);
    console.log("[WebImport] cantos.length:", cantos.length);

    if (!selectedBook || (!selectedCanto && cantos.length > 0)) {
      console.error("[WebImport] Validation failed: book or canto missing");
      toast({
        title: "Помилка",
        description: "Виберіть книгу" + (cantos.length > 0 ? " та кант" : ""),
        variant: "destructive",
      });
      return;
    }

    if (!chapterTitleUa || !chapterTitleEn) {
      console.error("[WebImport] Validation failed: chapter titles missing");
      toast({
        title: "Помилка",
        description: "Введіть назви глави українською та англійською",
        variant: "destructive",
      });
      return;
    }

    if (!vedabaseUrl || !gitabaseUrl) {
      console.error("[WebImport] Validation failed: URLs missing");
      toast({
        title: "Помилка",
        description: "Введіть обидва URL",
        variant: "destructive",
      });
      return;
    }

    console.log("[WebImport] Validation passed, starting import");
    setIsImporting(true);

    try {
      // Завантажуємо контент з обох сайтів через proxy
      console.log("[WebImport] Fetching Vedabase:", vedabaseUrl);
      toast({
        title: "Завантаження",
        description: "Завантажуємо дані з Vedabase...",
      });

      const vedabaseHtml = await fetchWithProxy(vedabaseUrl);
      console.log("[WebImport] Vedabase HTML length:", vedabaseHtml.length);

      console.log("[WebImport] Fetching Gitabase:", gitabaseUrl);
      toast({
        title: "Завантаження",
        description: "Завантажуємо дані з Gitabase...",
      });

      const gitabaseHtml = await fetchWithProxy(gitabaseUrl);
      console.log("[WebImport] Gitabase HTML length:", gitabaseHtml.length);

      console.log("[WebImport] Parsing chapter");
      toast({
        title: "Парсинг",
        description: "Обробляємо дані...",
      });

      // Парсимо главу
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

      console.log("[WebImport] Importing to database");
      toast({
        title: "Імпорт",
        description: "Імпортуємо до бази даних...",
      });

      // Імпортуємо в базу даних
      await importSingleChapter(supabase, {
        bookId: selectedBook,
        cantoId: selectedCanto || null,
        chapter,
        strategy: "replace",
      });

      console.log("[WebImport] Import successful!");
      toast({
        title: "Успіх!",
        description: `Главу ${chapterNumber} успішно імпортовано (${chapter.verses.length} віршів)`,
      });

      // Очищуємо форму
      setChapterNumber("");
      setChapterTitleUa("");
      setChapterTitleEn("");
    } catch (error) {
      console.error("[WebImport] Import error:", error);
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося імпортувати главу",
        variant: "destructive",
      });
    } finally {
      console.log("[WebImport] Import process finished");
      setIsImporting(false);
    }
  };

  if (!user || !isAdmin) return null;

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
            Імпорт використовує CORS proxy для завантаження контенту з Vedabase та Gitabase. Якщо виникають помилки,
            перевірте правильність URL або спробуйте пізніше. Дивіться логи в консолі браузера (F12).
          </AlertDescription>
        </Alert>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="book">Книга</Label>
              <Select value={selectedBook} onValueChange={handleBookChange}>
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
                <Label htmlFor="canto">Кант</Label>
                <Select value={selectedCanto} onValueChange={setSelectedCanto}>
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
              <Label htmlFor="chapterNumber">Номер глави</Label>
              <Input
                id="chapterNumber"
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                placeholder="1"
              />
            </div>

            <div>
              <Label htmlFor="titleUa">Назва глави (українською)</Label>
              <Input
                id="titleUa"
                value={chapterTitleUa}
                onChange={(e) => setChapterTitleUa(e.target.value)}
                placeholder="Духовний учитель"
              />
            </div>

            <div>
              <Label htmlFor="titleEn">Назва глави (англійською)</Label>
              <Input
                id="titleEn"
                value={chapterTitleEn}
                onChange={(e) => setChapterTitleEn(e.target.value)}
                placeholder="The Spiritual Master"
              />
            </div>

            <div>
              <Label htmlFor="vedabaseUrl">URL Vedabase (бенгалі + англійська)</Label>
              <Input
                id="vedabaseUrl"
                value={vedabaseUrl}
                onChange={(e) => setVedabaseUrl(e.target.value)}
                placeholder="https://vedabase.io/en/library/cc/adi/1/1/"
              />
              <p className="text-xs text-muted-foreground mt-1">Приклад: https://vedabase.io/en/library/cc/adi/1/1/</p>
            </div>

            <div>
              <Label htmlFor="gitabaseUrl">URL Gitabase (українська)</Label>
              <Input
                id="gitabaseUrl"
                value={gitabaseUrl}
                onChange={(e) => setGitabaseUrl(e.target.value)}
                placeholder="https://gitabase.com/ukr/CC/1/1"
              />
              <p className="text-xs text-muted-foreground mt-1">Приклад: https://gitabase.com/ukr/CC/1/1</p>
            </div>

            <Button onClick={handleImport} disabled={isImporting} className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              {isImporting ? "Імпортуємо..." : "Імпортувати главу"}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Порада:</strong> Відкрийте консоль браузера (F12) щоб бачити детальні логи імпорту.
              </p>
              <p>Переконайтеся що URL вказують на першу сторінку глави.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
