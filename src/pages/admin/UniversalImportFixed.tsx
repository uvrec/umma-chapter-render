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
import { importSingleChapter } from "@/utils/import/importer";

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
      const lila = vedabaseCanto || "adi";
      
      // Автоматично визначаємо максимальний вірш якщо не вказано
      let verseRanges = vedabaseVerse;
      if (!verseRanges) {
        try {
          const chapterUrl = `https://vedabase.io/en/library/${vedabaseBook}/${lila}/${chapterNum}/`;
          const { data: chapterData } = await supabase.functions.invoke("fetch-html", { body: { url: chapterUrl } });
          const maxVerse = getMaxVerseFromChapter(chapterData.html);
          verseRanges = maxVerse > 0 ? `1-${maxVerse}` : "1-500";
          toast({ title: "📖 Визначено діапазон", description: `Вірші 1-${maxVerse > 0 ? maxVerse : 500}` });
        } catch {
          verseRanges = "1-500"; // Збільшено default ліміт до 500
        }
      }

      // Формуємо базові URL
      const vedabase_base = `https://vedabase.io/en/library/${vedabaseBook}/${lila}/${chapterNum}/`;
      const gitabase_base = `https://gitabase.com/ukr/${vedabaseBook.toUpperCase()}/${lilaNum}/${chapterNum}`;

      let result: any = null;

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
        // ✅ Перевірка якості: якщо порожньо або відсутні ключові поля — примусово fallback
        const badResult = !Array.isArray(result?.verses) || !result.verses.length ||
          result.verses.every((v: any) => !(v?.translation_en || v?.translation_ua || v?.synonyms_en || v?.synonyms_ua || v?.commentary_en || v?.commentary_ua));
        if (badResult) {
          throw new Error("Python result is empty/incomplete — switching to browser fallback");
        }
        toast({ title: "✅ Парсер успішно відпрацював", description: "Отримано JSON" });
      } catch (err: any) {
        console.log("🐍 Python parser failed, using browser fallback:", err.message);
        toast({ title: "⚠️ Browser fallback", description: "Парсинг через Edge-функції (EN + UA)" });

        const [start, end] = verseRanges.includes("-")
          ? verseRanges.split("-").map(Number)
          : [parseInt(verseRanges, 10), parseInt(verseRanges, 10)];

        const verses: any[] = [];

        // 🧭 1) Знімаємо індекс посилань з сторінки глави (щоб виявляти "7-8", "10-16")
        try {
          const chapterUrl = `https://vedabase.io/en/library/${vedabaseBook}/${lila}/${chapterNum}/`;
          const { data: chapterHtml } = await supabase.functions.invoke("fetch-html", { body: { url: chapterUrl } });
          const map: Array<{ lastPart: string; from: number; to: number }> = [];
          if (chapterHtml?.html) {
            const dp = new DOMParser();
            const doc = dp.parseFromString(chapterHtml.html, 'text/html');
            const anchors = Array.from(doc.querySelectorAll(`a[href*="/${vedabaseBook}/${lila}/${chapterNum}/"]`));
            anchors.forEach(a => {
              const href = a.getAttribute('href') || '';
              const seg = href.split('/').filter(Boolean).pop() || '';
              if (!seg) return;
              if (/^\d+(?:-\d+)?$/.test(seg)) {
                if (seg.includes('-')) {
                  const [s, e] = seg.split('-').map(n => parseInt(n, 10));
                  if (!Number.isNaN(s) && !Number.isNaN(e)) map.push({ lastPart: seg, from: s, to: e });
                } else {
                  const n = parseInt(seg, 10);
                  if (!Number.isNaN(n)) map.push({ lastPart: seg, from: n, to: n });
                }
              }
            });

            // Фільтруємо лише сегменти, що перетинаються з [start, end], та унікалізуємо за lastPart
            const unique = new Map<string, { lastPart: string; from: number; to: number }>();
            map
              .filter(m => !(m.to < start || m.from > end))
              .sort((a, b) => a.from - b.from)
              .forEach(m => unique.set(m.lastPart, m));

            const targets = Array.from(unique.values());

            // 2) Парсимо кожен таргет як окремий вірш (включно з об'єднаними)
            for (const t of targets) {
              try {
                const vedabaseUrl = `https://vedabase.io/en/library/${vedabaseBook}/${lila}/${chapterNum}/${t.lastPart}`;
                const gitabaseUrl = `https://gitabase.com/ukr/${vedabaseBook.toUpperCase()}/${lilaNum}/${chapterNum}/${t.from}`;

                const [vedabaseRes, gitabaseRes] = await Promise.allSettled([
                  supabase.functions.invoke("fetch-html", { body: { url: vedabaseUrl } }),
                  supabase.functions.invoke("fetch-html", { body: { url: gitabaseUrl } }),
                ]);

                let parsedEN: any = null;
                let parsedUA: any = null;

                if (vedabaseRes.status === "fulfilled" && vedabaseRes.value.data) {
                  parsedEN = parseVedabaseCC(vedabaseRes.value.data.html, vedabaseUrl);
                }
                if (gitabaseRes.status === "fulfilled" && gitabaseRes.value.data) {
                  const gdp = new DOMParser();
                  const gdoc = gdp.parseFromString(gitabaseRes.value.data.html, 'text/html');
                  parsedUA = {
                    synonyms_ua: Array.from(gdoc.querySelectorAll('.r-synonyms-item')).map(item => {
                      const word = item.querySelector('.r-synonym')?.textContent?.trim() || '';
                      const meaning = item.querySelector('.r-synonim-text, .r-synonym-text')?.textContent?.trim() || '';
                      return word && meaning ? `${word} — ${meaning}` : '';
                    }).filter(Boolean).join('; '),
                    translation_ua: gdoc.querySelector('.r-translation')?.textContent?.trim() || '',
                    commentary_ua: Array.from(gdoc.querySelectorAll('.r-purport p')).map(p => p.textContent?.trim()).filter(Boolean).join('\n\n')
                  };
                }

                // Тільки додаємо вірш якщо є хоч якийсь контент
                const hasContent = 
                  (parsedEN?.bengali || parsedEN?.transliteration || parsedEN?.synonyms || parsedEN?.translation || parsedEN?.purport) ||
                  (parsedUA?.synonyms_ua || parsedUA?.translation_ua || parsedUA?.commentary_ua);
                
                if (hasContent) {
                  verses.push({
                    verse_number: t.lastPart, // ← "7" або "7-8"
                    sanskrit: parsedEN?.bengali || "",
                    transliteration_en: parsedEN?.transliteration || "",
                    transliteration_ua: "",
                    synonyms_en: parsedEN?.synonyms || "",
                    synonyms_ua: parsedUA?.synonyms_ua || "",
                    translation_en: parsedEN?.translation || "",
                    translation_ua: parsedUA?.translation_ua || "",
                    commentary_en: parsedEN?.purport || "",
                    commentary_ua: parsedUA?.commentary_ua || "",
                  });
                } else {
                  console.log(`⏭️ Пропускаю сегмент ${t.lastPart} (немає контенту)`);
                }
              } catch (e: any) {
                console.warn(`⚠️ Failed segment ${t.lastPart}:`, e.message);
              }
            }

            console.log(`✅ Fallback parsed ${verses.length} segment(s)`);
            result = { verses };
          } else {
            throw new Error('No chapter HTML');
          }
        } catch (e) {
          console.warn('Chapter TOC parse failed, using simple numeric loop', e);
          // Простий попередній алгоритм (на випадок збою)
          for (let v = start; v <= end; v++) {
            try {
              const vedabaseUrl = `https://vedabase.io/en/library/${vedabaseBook}/${lila}/${chapterNum}/${v}`;
              const gitabaseUrl = `https://gitabase.com/ukr/${vedabaseBook.toUpperCase()}/${lilaNum}/${chapterNum}/${v}`;

              const [vedabaseRes, gitabaseRes] = await Promise.allSettled([
                supabase.functions.invoke("fetch-html", { body: { url: vedabaseUrl } }),
                supabase.functions.invoke("fetch-html", { body: { url: gitabaseUrl } }),
              ]);

              let parsedEN: any = null;
              let parsedUA: any = null;

              if (vedabaseRes.status === "fulfilled" && vedabaseRes.value.data) {
                parsedEN = parseVedabaseCC(vedabaseRes.value.data.html, vedabaseUrl);
              }
              if (gitabaseRes.status === "fulfilled" && gitabaseRes.value.data) {
                const gitaDoc = new DOMParser().parseFromString(gitabaseRes.value.data.html, 'text/html');
                parsedUA = {
                  synonyms_ua: Array.from(gitaDoc.querySelectorAll('.r-synonyms-item')).map(item => {
                    const word = item.querySelector('.r-synonym')?.textContent?.trim() || '';
                    const meaning = item.querySelector('.r-synonim-text, .r-synonym-text')?.textContent?.trim() || '';
                    return word && meaning ? `${word} — ${meaning}` : '';
                  }).filter(Boolean).join('; '),
                  translation_ua: gitaDoc.querySelector('.r-translation')?.textContent?.trim() || '',
                  commentary_ua: Array.from(gitaDoc.querySelectorAll('.r-purport p')).map(p => p.textContent?.trim()).filter(Boolean).join('\n\n')
                };
              }

              // Тільки додаємо вірш якщо є хоч якийсь контент
              const hasContent = 
                (parsedEN?.bengali || parsedEN?.transliteration || parsedEN?.synonyms || parsedEN?.translation || parsedEN?.purport) ||
                (parsedUA?.synonyms_ua || parsedUA?.translation_ua || parsedUA?.commentary_ua);
              
              if (hasContent) {
                verses.push({
                  verse_number: String(v),
                  sanskrit: parsedEN?.bengali || "",
                  transliteration_en: parsedEN?.transliteration || "",
                  transliteration_ua: "",
                  synonyms_en: parsedEN?.synonyms || "",
                  synonyms_ua: parsedUA?.synonyms_ua || "",
                  translation_en: parsedEN?.translation || "",
                  translation_ua: parsedUA?.translation_ua || "",
                  commentary_en: parsedEN?.purport || "",
                  commentary_ua: parsedUA?.commentary_ua || "",
                });
              } else {
                console.log(`⏭️ Пропускаю вірш ${v} (немає контенту)`);
              }
            } catch (e: any) {
              console.warn(`⚠️ Failed verse ${v}:`, e.message);
            }
            setProgress(10 + ((v - start + 1) / (end - start + 1)) * 80);
          }
          console.log(`✅ Fallback parsed ${verses.length} verses`);
          result = { verses };
        }
      }

      console.log("📊 Final result:", {
        verses_count: result?.verses?.length,
        first_verse: result?.verses?.[0]
      });

      // 🔧 Дозаповнення EN блоків (synonyms/translation/purport) з Vedabase, якщо парсер їх не дав
      if (Array.isArray(result?.verses) && result.verses.length) {
        let idx = 0;
        for (const v of result.verses) {
          const missingEn = !(v?.translation_en || v?.synonyms_en || v?.commentary_en);
          if (missingEn) {
            try {
              const verseUrl = `${vedabase_base}${v.verse_number}`;
              const { data } = await supabase.functions.invoke("fetch-html", { body: { url: verseUrl } });
              const parsed = data?.html ? parseVedabaseCC(data.html, verseUrl) : null;
              if (parsed) {
                v.sanskrit = v.sanskrit || parsed.bengali || "";
                v.transliteration_en = v.transliteration_en || parsed.transliteration || "";
                v.synonyms_en = v.synonyms_en || parsed.synonyms || "";
                v.translation_en = v.translation_en || parsed.translation || "";
                v.commentary_en = v.commentary_en || parsed.purport || "";
              }
            } catch (e) {
              console.warn("EN fill fail for verse", v?.verse_number, e);
            }
          }
          idx++;
          setProgress(20 + Math.round((idx / result.verses.length) * 20));
        }
      }

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
            // ✅ Передаємо назви ТІЛЬКИ якщо вони були явно введені користувачем
            // Інакше upsertChapter збереже існуючі назви глави
            ...(importData.metadata.title_ua?.trim() && { title_ua: importData.metadata.title_ua.trim() }),
            ...(importData.metadata.title_en?.trim() && { title_en: importData.metadata.title_en.trim() }),
            // ✅ Передаємо intro як content для глави
            ...(importData.chapters[0]?.intro_ua && { content_ua: importData.chapters[0].intro_ua }),
            ...(importData.chapters[0]?.intro_en && { content_en: importData.chapters[0].intro_en }),
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

      // Import chapters safely: UPSERT (never delete existing verses)
      const total = data.chapters.length;
      for (let i = 0; i < total; i++) {
        const ch = data.chapters[i];
        await importSingleChapter(supabase, {
          bookId,
          cantoId: cantoId ?? null,
          chapter: ch,
          strategy: "upsert",
        });
        setProgress(10 + Math.round(((i + 1) / total) * 80));
      }

      const totalVerses = data.chapters.reduce((sum, ch) => sum + (ch.verses?.length || 0), 0);
      toast({
        title: "✅ Імпорт завершено",
        description: `${totalVerses} віршів збережено.`,
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