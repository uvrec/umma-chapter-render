import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Globe, BookOpen, FileText, CheckCircle, Download } from "lucide-react";

import { ParserStatus } from "@/components/admin/ParserStatus";
import { parseVedabaseCC } from "@/utils/vedabaseParser";
import { supabase } from "@/integrations/supabase/client";

// Мапінг Vedabase slug → Vedavoice slug
const VEDABASE_TO_SITE_SLUG: Record<string, string> = {
  sb: "bhagavatam",
  bg: "gita",
  cc: "scc",
  transcripts: "lectures",
  letters: "letters",
};

// Типи станів
type ImportSource = "file" | "vedabase" | "gitabase";
type Step = "source" | "process" | "preview" | "save";

interface ImportData {
  source: ImportSource;
  rawText: string;
  processedText: string;
  chapters: any[];
  metadata: {
    title_ua: string;
    title_en: string;
    author: string;
    book_slug?: string;
    vedabase_slug?: string;
    volume?: string;
    canto?: string;
    lila_name?: string;
    source_url?: string;
  };
}

// Каталог Vedabase книг
const VEDABASE_BOOKS: Record<
  string,
  {
    name: string;
    isMultiVolume: boolean;
    volumeLabel: string;
    cantos?: (string | number)[];
  }
> = {
  bg: { name: "Бгаґавад-ґіта як вона є", isMultiVolume: false, volumeLabel: "Глава" },
  sb: {
    name: "Шрімад-Бгаґаватам",
    isMultiVolume: true,
    volumeLabel: "Пісня",
    cantos: Array.from({ length: 12 }, (_, i) => i + 1),
  },
  cc: {
    name: "Шрі Чайтанья-чарітамріта",
    isMultiVolume: true,
    volumeLabel: "Ліла",
    cantos: ["adi", "madhya", "antya"],
  },
  iso: { name: "Шрі Ішопанішад", isMultiVolume: false, volumeLabel: "Мантра" },
  noi: { name: "Нектар настанов", isMultiVolume: false, volumeLabel: "Текст" },
  nod: { name: "Нектар відданості", isMultiVolume: false, volumeLabel: "Глава" },
  kb: { name: "Крішна — Верховна Особистість Бога", isMultiVolume: false, volumeLabel: "Глава" },
  tlk: { name: "Наука самоусвідомлення", isMultiVolume: false, volumeLabel: "Глава" },
  transcripts: { name: "Лекції", isMultiVolume: false, volumeLabel: "Лекція" },
  letters: { name: "Листи", isMultiVolume: false, volumeLabel: "Лист" },
};

// 👇 головна змінна: адреса парсера
const PARSE_ENDPOINT = import.meta.env.VITE_PARSER_URL
  ? `${import.meta.env.VITE_PARSER_URL}/admin/parse-web-chapter`
  : "http://127.0.0.1:5003/admin/parse-web-chapter";

export default function UniversalImportFixed() {
  const [currentStep, setCurrentStep] = useState<Step>("source");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importData, setImportData] = useState<ImportData>({
    source: "file",
    rawText: "",
    processedText: "",
    chapters: [],
    metadata: {
      title_ua: "",
      title_en: "",
      author: "Шріла Прабгупада",
    },
  });

  // Vedabase
  const [vedabaseBook, setVedabaseBook] = useState("cc");
  const [vedabaseCanto, setVedabaseCanto] = useState("");
  const [vedabaseChapter, setVedabaseChapter] = useState("");
  const [vedabaseVerse, setVedabaseVerse] = useState("");

  const currentBookInfo = useMemo(
    () => VEDABASE_BOOKS[vedabaseBook as keyof typeof VEDABASE_BOOKS],
    [vedabaseBook]
  );

  const lilaNum = useMemo(() => {
    const map: Record<string, number> = { adi: 1, madhya: 2, antya: 3 };
    return map[vedabaseCanto.toLowerCase()] || 1;
  }, [vedabaseCanto]);

  /** Імпорт з Vedabase */
  const handleVedabaseImport = useCallback(async () => {
    if (!vedabaseChapter) {
      toast({ title: "Помилка", description: "Вкажіть номер глави", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setProgress(10);

    try {
      const chapterNum = parseInt(vedabaseChapter, 10);
      const verseRanges = vedabaseVerse || "1-100";

      // Формуємо базові URL
      const lila = vedabaseCanto || "adi";
      const vedabase_base = `https://vedabase.io/en/library/${vedabaseBook}/${lila}/${chapterNum}/`;
      const gitabase_base = `https://gitabase.com/ukr/${vedabaseBook.toUpperCase()}/${lilaNum}/${chapterNum}`;

      let result: any = null;
      let usedFallback = false;

      try {
        toast({ title: "Python парсер", description: "Звернення до Flask API..." });
        const response = await fetch(PARSE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lila: lilaNum,
            chapter: chapterNum,
            verse_ranges: verseRanges,
            vedabase_base,
            gitabase_base,
          }),
        });

        if (!response.ok) throw new Error("Parser error");
        result = await response.json();
        toast({ title: "✅ Парсер успішно відпрацював", description: "Отримано JSON" });
      } catch (err) {
        usedFallback = true;
        toast({
          title: "⚠️ Локальний fallback",
          description: "Парсер недоступний, використовую вбудований CC-парсер",
        });

        // fallback лише для CC
        const [start, end] = verseRanges.includes("-")
          ? verseRanges.split("-").map(Number)
          : [parseInt(verseRanges, 10), parseInt(verseRanges, 10)];

        const verses: any[] = [];
        for (let v = start; v <= end; v++) {
          try {
            const url = `https://vedabase.io/en/library/cc/${lila}/${chapterNum}/${v}`;
            const html = await fetch(url).then((r) => r.text());
            const verseData = parseVedabaseCC(html, url);
            if (verseData) {
              verses.push({
                verse_number: v.toString(),
                sanskrit: verseData.bengali,
                transliteration: verseData.transliteration,
                synonyms_en: verseData.synonyms,
                translation_en: verseData.translation,
                commentary_en: verseData.purport,
              });
            }
          } catch (e) {
            console.warn(`Error on verse ${v}`, e);
          }
          setProgress(20 + ((v - start) / (end - start + 1)) * 70);
        }
        result = { verses };
      }

      if (!result?.verses?.length) throw new Error("Немає віршів у відповіді");

      const siteSlug = VEDABASE_TO_SITE_SLUG[vedabaseBook] || vedabaseBook;
      const bookInfo = VEDABASE_BOOKS[vedabaseBook];

      setImportData((prev) => ({
        ...prev,
        source: "vedabase",
        rawText: JSON.stringify(result.verses, null, 2),
        processedText: JSON.stringify(result, null, 2),
        chapters: [
          {
            chapter_number: chapterNum,
            title_ua: `${bookInfo.name} ${vedabaseCanto} ${chapterNum}`,
            chapter_type: "verses",
            verses: result.verses,
          },
        ],
        metadata: {
          ...prev.metadata,
          source_url: vedabase_base,
          title_ua: bookInfo.name,
          title_en:
            vedabaseBook === "cc"
              ? "Chaitanya-charitamrita"
              : vedabaseBook === "sb"
              ? "Srimad-Bhagavatam"
              : "Bhagavad-gita As It Is",
          book_slug: siteSlug,
          vedabase_slug: vedabaseBook,
          canto: lilaNum.toString(),
          volume: vedabaseCanto,
        },
      }));

      setProgress(100);
      setCurrentStep("preview");
      toast({
        title: "✅ Розпарсено",
        description: `${result.verses.length} віршів${usedFallback ? " (fallback)" : ""}`,
      });
    } catch (e: any) {
      toast({ title: "Помилка", description: e.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [vedabaseBook, vedabaseCanto, vedabaseChapter, vedabaseVerse, lilaNum]);

  /** Збереження у базу */
  const saveToDatabase = useCallback(async () => {
    if (!importData.chapters.length) {
      toast({ title: "Немає даних", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    try {
      const slug = importData.metadata.book_slug || "imported-book";
      const { data: existing } = await supabase.from("books").select("id").eq("slug", slug).maybeSingle();

      let bookId = existing?.id;
      if (!bookId) {
        const { data: created, error } = await supabase
          .from("books")
          .insert({
            slug,
            title_ua: importData.metadata.title_ua,
            title_en: importData.metadata.title_en,
            is_published: true,
          })
          .select("id")
          .single();
        if (error) throw error;
        bookId = created.id;
      }

      const chapters = importData.chapters.map((ch) => ({
        book_id: bookId,
        chapter_number: ch.chapter_number,
        title_ua: ch.title_ua,
        title_en: ch.title_en || ch.title_ua,
        chapter_type: "verses" as const,
      }));

      const { data: chaptersData } = await supabase
        .from("chapters")
        .upsert(chapters, { onConflict: "book_id,chapter_number" })
        .select("id, chapter_number");

      const idMap = new Map(chaptersData.map((ch) => [ch.chapter_number, ch.id]));
      const verses = importData.chapters.flatMap((ch) =>
        ch.verses.map((v: any) => ({
          chapter_id: idMap.get(ch.chapter_number),
          verse_number: v.verse_number,
          sanskrit: v.sanskrit || "",
          transliteration_en: v.transliteration || "",
          synonyms_en: v.synonyms_en || "",
          translation_en: v.translation_en || "",
          commentary_en: v.commentary_en || "",
        }))
      );

      await supabase.from("verses").upsert(verses, { onConflict: "chapter_id,verse_number" });

      toast({
        title: "✅ Імпорт завершено",
        description: `${verses.length} віршів збережено.`,
      });
      setCurrentStep("save");
    } catch (e: any) {
      toast({ title: "Помилка збереження", description: e.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [importData]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Universal Book Import (Fixed)
          </CardTitle>
          <ParserStatus className="mt-4" />
        </CardHeader>

        <CardContent>
          {isProcessing && (
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-1">Обробка... {progress}%</p>
            </div>
          )}

          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="source">Джерело</TabsTrigger>
              <TabsTrigger value="process">Обробка</TabsTrigger>
              <TabsTrigger value="preview">Перегляд</TabsTrigger>
              <TabsTrigger value="save">Збереження</TabsTrigger>
            </TabsList>

            <TabsContent value="source" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Книга</Label>
                  <select
                    value={vedabaseBook}
                    onChange={(e) => setVedabaseBook(e.target.value)}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {Object.entries(VEDABASE_BOOKS).map(([slug, info]) => (
                      <option key={slug} value={slug}>
                        {info.name} ({slug.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
                {currentBookInfo.isMultiVolume && (
                  <div>
                    <Label>{currentBookInfo.volumeLabel}</Label>
                    <select
                      value={vedabaseCanto}
                      onChange={(e) => setVedabaseCanto(e.target.value)}
                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="">Оберіть...</option>
                      {currentBookInfo.cantos?.map((c) => (
                        <option key={c} value={String(c)}>
                          {String(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Глава</Label>
                  <Input value={vedabaseChapter} onChange={(e) => setVedabaseChapter(e.target.value)} />
                </div>
                <div>
                  <Label>Вірші (опціонально)</Label>
                  <Input value={vedabaseVerse} onChange={(e) => setVedabaseVerse(e.target.value)} />
                </div>
              </div>

              <Button onClick={handleVedabaseImport} disabled={isProcessing}>
                <Globe className="w-4 h-4 mr-2" />
                Імпортувати з Vedabase
              </Button>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Результат парсингу</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Глав: {importData.chapters.length}</p>
                  <p>Символів JSON: {importData.processedText.length}</p>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button onClick={saveToDatabase}>
                  <Download className="w-4 h-4 mr-2" />
                  Зберегти в базу
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}