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
import { useNavigate } from "react-router-dom";

import { ParserStatus } from "@/components/admin/ParserStatus";
import { parseVedabaseCC, getMaxVerseFromChapter } from "@/utils/vedabaseParser";
import { supabase } from "@/integrations/supabase/client";
import { normalizeTransliteration } from "@/utils/text/translitNormalize";

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
type Step = "source" | "intro" | "normalize" | "process" | "preview" | "save";

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

  const navigate = useNavigate();

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
        console.log("🐍 Trying Python parser at:", PARSE_ENDPOINT);
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

        if (!response.ok) throw new Error(`Parser HTTP ${response.status}: ${response.statusText}`);
        result = await response.json();
        console.log("🐍 Python parser result:", result?.verses?.length, "verses");
        toast({ title: "✅ Парсер успішно відпрацював", description: "Отримано JSON" });
      } catch (err: any) {
        console.log("🐍 Python parser failed:", err.message);
        usedFallback = true;
        toast({
          title: "⚠️ Browser fallback",
          description: "Використовую Edge-функцію fetch-html + parseVedabaseCC",
        });

        const [start, end] = verseRanges.includes("-")
          ? verseRanges.split("-").map(Number)
          : [parseInt(verseRanges, 10), parseInt(verseRanges, 10)];

        console.log("🔄 Fallback: calling fetch-html edge function for CC");
        const verses: any[] = [];

        for (let v = start; v <= end; v++) {
          const url = `https://vedabase.io/en/library/${vedabaseBook}/${lila}/${chapterNum}/${v}`;
          try {
            const { data: fetchData, error: fetchErr } = await supabase.functions.invoke("fetch-html", {
              body: { url },
            });
            if (fetchErr) throw fetchErr;
            const parsed = parseVedabaseCC(fetchData.html, url);
            if (parsed) {
              verses.push({
                verse_number: String(v),
                sanskrit: parsed.bengali || "",
                transliteration: parsed.transliteration || "",
                synonyms_en: parsed.synonyms || "",
                translation_en: parsed.translation || "",
                commentary_en: parsed.purport || "",
              });
            }
          } catch (e: any) {
            console.warn(`⚠️ Failed verse ${v}:`, e.message);
          }
          setProgress(10 + ((v - start + 1) / (end - start + 1)) * 80);
        }

        console.log(`✅ Fallback parsed ${verses.length} verses`);
        result = { verses };
      }

      console.log("📊 Final result:", {
        verses_count: result?.verses?.length,
        first_verse: result?.verses?.[0]
      });
      
      if (!result?.verses?.length) {
        console.error("❌ No verses in result:", result);
        throw new Error("Немає віршів у відповіді");
      }

      const siteSlug = VEDABASE_TO_SITE_SLUG[vedabaseBook] || vedabaseBook;
      const bookInfo = VEDABASE_BOOKS[vedabaseBook];

      const newImport: ImportData = {
        ...importData,
        source: "vedabase",
        rawText: JSON.stringify(result.verses, null, 2),
        processedText: JSON.stringify(result, null, 2),
        chapters: [
          {
            chapter_number: chapterNum,
            title_ua: importData.metadata.title_ua || `${bookInfo.name} ${vedabaseCanto} ${chapterNum}`,
            title_en: importData.metadata.title_en || `${vedabaseBook.toUpperCase()} ${vedabaseCanto} ${chapterNum}`,
            chapter_type: "verses",
            verses: result.verses,
          },
        ],
        metadata: {
          ...importData.metadata,
          source_url: vedabase_base,
          book_slug: siteSlug,
          vedabase_slug: vedabaseBook,
          canto: lilaNum.toString(),
          volume: vedabaseCanto,
        },
      };

      setImportData(newImport);


      setProgress(100);
      await saveToDatabase(newImport);
      return;
    } catch (e: any) {
      toast({ title: "Помилка", description: e.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [vedabaseBook, vedabaseCanto, vedabaseChapter, vedabaseVerse, lilaNum]);

  /** Збереження у базу */
  const saveToDatabase = useCallback(async (dataOverride?: ImportData) => {
    const data = dataOverride ?? importData;
    if (!data.chapters.length) {
      toast({ title: "Немає даних", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    try {
      const slug = data.metadata.book_slug || "imported-book";
      const { data: existing } = await supabase.from("books").select("id").eq("slug", slug).maybeSingle();

      let bookId = existing?.id;
      if (!bookId) {
        const { data: created, error } = await supabase
          .from("books")
          .insert({
            slug,
            title_ua: data.metadata.title_ua,
            title_en: data.metadata.title_en,
            is_published: true,
          })
          .select("id")
          .single();
        if (error) throw error;
        bookId = created.id;
      }

      // Resolve canto (volume) if provided to link chapters correctly
      let cantoId: string | null = null;
      if (data.metadata.canto) {
        const cantoNum = parseInt(data.metadata.canto, 10);
        const { data: canto } = await supabase
          .from("cantos")
          .select("id")
          .eq("book_id", bookId)
          .eq("canto_number", cantoNum)
          .maybeSingle();
        cantoId = canto?.id || null;
      }

      // Ensure we attach verses to the chapter used by the reader (canto_id + chapter_number)
      const chapterIdMap = new Map<number, string>();
      for (const ch of data.chapters) {
        let existingId: string | undefined;

        if (cantoId) {
          const { data: existing } = await supabase
            .from("chapters")
            .select("id")
            .eq("canto_id", cantoId)
            .eq("chapter_number", ch.chapter_number)
            .maybeSingle();
          existingId = existing?.id;
        } else {
          const { data: existing } = await supabase
            .from("chapters")
            .select("id")
            .eq("book_id", bookId)
            .eq("chapter_number", ch.chapter_number)
            .maybeSingle();
          existingId = existing?.id;
        }

        if (existingId) {
          // Не перезаписуємо назви, якщо користувач нічого не ввів
          const updates: any = { chapter_type: "verses" };
          if (data.metadata.title_ua?.trim()) updates.title_ua = data.metadata.title_ua.trim();
          if (data.metadata.title_en?.trim()) updates.title_en = data.metadata.title_en.trim();
          // Запишемо intro якщо є
          const introUa = ch.intro_ua?.trim();
          const introEn = ch.intro_en?.trim();
          if (introUa) updates.content_ua = introUa;
          if (introEn) updates.content_en = introEn;

          await supabase.from("chapters").update(updates).eq("id", existingId);
          chapterIdMap.set(ch.chapter_number, existingId);
        } else {
          const { data: inserted, error: insertErr } = await supabase
            .from("chapters")
            .insert({
              book_id: bookId,
              canto_id: cantoId,
              chapter_number: ch.chapter_number,
              title_ua: (data.metadata.title_ua?.trim() || ch.title_ua || "") as string,
              title_en: (data.metadata.title_en?.trim() || ch.title_en || "") as string,
              chapter_type: "verses",
              content_ua: ch.intro_ua || null,
              content_en: ch.intro_en || null,
              is_published: true,
            })
            .select("id")
            .single();
          if (insertErr) throw insertErr;
          chapterIdMap.set(ch.chapter_number, inserted!.id);
        }
      }
      const verses = data.chapters.flatMap((ch) =>
        ch.verses.map((v: any) => ({
          chapter_id: chapterIdMap.get(ch.chapter_number),
          verse_number: v.verse_number,
          verse_number_sort: (() => {
            const parts = String(v.verse_number).split(/[^0-9]+/).filter(Boolean);
            const last = parts.length ? parseInt(parts[parts.length - 1], 10) : NaN;
            return Number.isFinite(last) ? last : null;
          })(),
          // Bengali/Devanagari (store for both languages)
          sanskrit: v.sanskrit || v.sanskrit_ua || v.sanskrit_en || "",
          sanskrit_ua: v.sanskrit_ua || v.sanskrit || "",
          sanskrit_en: v.sanskrit_en || v.sanskrit || "",
          // Transliteration (separate UA and EN)
          transliteration_ua: v.transliteration_ua || v.transliteration || "",
          transliteration_en: v.transliteration_en || "",
          // Synonyms (word-by-word)
          synonyms_ua: v.synonyms_ua || "",
          synonyms_en: v.synonyms_en || v.synonyms || "",
          // Translation
          translation_ua: v.translation_ua || "",
          translation_en: v.translation_en || v.translation || "",
          // Commentary (purport)
          commentary_ua: v.commentary_ua || "",
          commentary_en: v.commentary_en || v.purport || v.commentary || "",
        }))
      );

      await supabase.from("verses").upsert(verses, { onConflict: "chapter_id,verse_number" });

      toast({
        title: "✅ Імпорт завершено",
        description: `${verses.length} віршів збережено.`,
      });

      // Автоперехід до сторінки розділу після імпорту
      const chapterNum = data.chapters[0]?.chapter_number;
      const slugForPath = data.metadata.book_slug || "library";
      const cantoNum = data.metadata.canto;
      const targetPath = cantoNum
        ? `/veda-reader/${slugForPath}/canto/${cantoNum}/chapter/${chapterNum}`
        : `/veda-reader/${slugForPath}/${chapterNum}`;

      setCurrentStep("save");
      navigate(targetPath);
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <CardTitle>Universal Book Import (Fixed)</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <ParserStatus />
            <Button variant="secondary" onClick={() => navigate(-1)}>Вийти</Button>
          </div>
        </CardHeader>

        <CardContent>
          {isProcessing && (
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-1">Обробка... {progress}%</p>
            </div>
          )}

          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="source">Джерело</TabsTrigger>
              <TabsTrigger value="intro">Intro</TabsTrigger>
              <TabsTrigger value="normalize">Normalization</TabsTrigger>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Назва глави (UA)</Label>
                  <Input 
                    value={importData.metadata.title_ua} 
                    onChange={(e) => setImportData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, title_ua: e.target.value }
                    }))}
                    placeholder={`${currentBookInfo.name} ${vedabaseCanto} ${vedabaseChapter}`}
                  />
                </div>
                <div>
                  <Label>Назва глави (EN)</Label>
                  <Input 
                    value={importData.metadata.title_en} 
                    onChange={(e) => setImportData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, title_en: e.target.value }
                    }))}
                    placeholder={`${vedabaseBook.toUpperCase()} ${vedabaseCanto} ${vedabaseChapter}`}
                  />
                </div>
              </div>

              <Button onClick={handleVedabaseImport} disabled={isProcessing}>
                <Globe className="w-4 h-4 mr-2" />
                Імпортувати з Vedabase
              </Button>
            </TabsContent>

            <TabsContent value="intro" className="space-y-4">
              <div className="space-y-3">
                <Label>Intro (EN) — з Vedabase</Label>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={async () => {
                    try {
                      setIsProcessing(true);
                      const chapterNum = parseInt(vedabaseChapter || "0", 10);
                      const lila = vedabaseCanto || "adi";
                      const vedabase_base = `https://vedabase.io/en/library/${vedabaseBook}/${lila}/${chapterNum}/`;
                      const res = await fetch(vedabase_base);
                      const html = await res.text();
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(html, "text/html");
                      // Грубий хак: беремо перші параграфи перед списком віршів
                      const allP = Array.from(doc.querySelectorAll("main p, .entry-content p"));
                      const introParas: string[] = [];
                      for (const p of allP) {
                        const txt = p.textContent?.trim() || "";
                        if (!txt) continue;
                        if (/[0-9]+\s*:\s*[0-9]+/.test(txt)) break; // зупиняємось, якщо схоже на посилання
                        if (p.querySelector("a[href*='/cc/']")) break; // список віршів
                        introParas.push(`<p>${txt}</p>`);
                        if (introParas.length >= 6) break; // обмежимося
                      }
                      const introHtml = introParas.join("\n");
                      setImportData(prev => {
                        const chapters = prev.chapters.length ? [...prev.chapters] : [{ chapter_number: chapterNum, chapter_type: "verses", verses: [] }];
                        chapters[0] = { ...chapters[0], intro_en: introHtml };
                        return { ...prev, chapters };
                      });
                      toast({ title: "Intro додано", description: `${introParas.length} абзаців` });
                    } catch (e: any) {
                      toast({ title: "Intro помилка", description: e.message, variant: "destructive" });
                    } finally {
                      setIsProcessing(false);
                    }
                  }}>Завантажити Intro EN</Button>
                </div>
                <Label>Intro (UA)</Label>
                <Textarea value={(importData.chapters[0]?.intro_ua)||""} onChange={(e)=>setImportData(prev=>{ const ch=[...prev.chapters]; if(!ch.length) ch.push({chapter_number: parseInt(vedabaseChapter||"0",10)||1, chapter_type:"verses", verses:[]}); ch[0]={...ch[0], intro_ua:e.target.value}; return {...prev, chapters: ch}; })} placeholder="Вставте український вступ (за потреби)" />
                <Label>Intro (EN)</Label>
                <Textarea value={(importData.chapters[0]?.intro_en)||""} onChange={(e)=>setImportData(prev=>{ const ch=[...prev.chapters]; if(!ch.length) ch.push({chapter_number: parseInt(vedabaseChapter||"0",10)||1, chapter_type:"verses", verses:[]}); ch[0]={...ch[0], intro_en:e.target.value}; return {...prev, chapters: ch}; })} placeholder="Відредагуйте англійський вступ" />
              </div>
            </TabsContent>

            <TabsContent value="normalize" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Нормалізація послівних термінів (UA)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Застосувати технічну нормалізацію діакритики (ı̄ тощо) до поля "synonyms_ua" у поточних даних імпорту.</p>
                  <Button variant="secondary" onClick={() => {
                    setImportData(prev => {
                      const chapters = prev.chapters.map(ch => ({
                        ...ch,
                        verses: ch.verses.map((v: any) => ({
                          ...v,
                          synonyms_ua: v.synonyms_ua ? normalizeTransliteration(v.synonyms_ua) : v.synonyms_ua,
                        })),
                      }));
                      return { ...prev, chapters };
                    });
                    toast({ title: "Нормалізовано", description: "Символи в послівних виправлено у даних імпорту" });
                  }}>Нормалізувати зараз</Button>
                </CardContent>
              </Card>
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
                <Button onClick={() => saveToDatabase()}>
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