// VedabaseImportV3 - FIXED VERSION - Dual language import
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { VEDABASE_BOOKS, getBookConfig, buildVedabaseUrl, buildGitabaseUrl } from "@/utils/Vedabase-books";
import { Badge } from "@/components/ui/badge";

interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

// ============================================================================
// PARSERS - FIXED VERSION
// ============================================================================

function extractVedabaseContent(html: string) {
  const result = {
    sanskrit: "",
    transliteration: "",
    synonyms: "",
    translation: "",
    purport: "",
  };

  try {
    // SANSKRIT (common for both languages)
    const devanagariMatch = html.match(/[\u0900-\u097F।॥\s]+/g);
    const bengaliMatch = html.match(/[\u0980-\u09FF।॥\s]+/g);

    const allMatches = [...(devanagariMatch || []), ...(bengaliMatch || [])];
    const longest = allMatches
      .map((s) => s.trim())
      .filter((s) => s.length > 10)
      .sort((a, b) => b.length - a.length)[0];

    if (longest) {
      result.sanskrit = longest;
    }

    // TRANSLITERATION (IAST)
    const iastPattern = /\b[a-zA-ZĀāĪīŪūṛṝḷḹĒēŌōṃḥṚṛṢṣṆṇṬṭḌḍÑñṄṅ\s\-']+\b/g;
    const iastMatches = html.match(iastPattern);

    if (iastMatches) {
      const withDiacritics = iastMatches.filter(
        (text) => /[ĀāĪīŪūṛṝḷḹĒēŌōṃḥṚṛṢṣṆṇṬṭḌḍÑñṄṅ]/.test(text) && text.trim().split(/\s+/).length > 3,
      );

      if (withDiacritics.length > 0) {
        result.transliteration = withDiacritics.sort((a, b) => b.length - a.length)[0].trim();
      }
    }

    // SYNONYMS - NO LENGTH LIMIT
    const synonymsMatch = html.match(/(?:SYNONYMS|Word for word)[:\s]*(.*?)(?=TRANSLATION|$)/is);
    if (synonymsMatch) {
      result.synonyms = synonymsMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // TRANSLATION - NO LENGTH LIMIT
    const translationMatch = html.match(/TRANSLATION[:\s]*(.*?)(?=PURPORT|COMMENTARY|$)/is);
    if (translationMatch) {
      result.translation = translationMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // PURPORT - NO LENGTH LIMIT, NO FOOTER
    const purportMatch = html.match(/(?:PURPORT|COMMENTARY)[:\s]*(.*?)$/is);
    if (purportMatch) {
      let purportText = purportMatch[1];

      // Remove footer patterns
      purportText = purportText.replace(/Help Srila Prabhupada send[\s\S]*$/i, "");
      purportText = purportText.replace(/Support this website[\s\S]*$/i, "");

      result.purport = purportText
        .replace(/<script[^>]*>.*?<\/script>/gis, "")
        .replace(/<style[^>]*>.*?<\/style>/gis, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  } catch (error) {
    console.error("Vedabase parse error:", error);
  }

  return result;
}

function extractGitabaseContent(html: string) {
  const result = {
    transliteration: "",
    synonyms: "",
    translation: "",
    purport: "",
  };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // TRANSLITERATION - from header
    const headerText = doc.querySelector("h1, h2")?.textContent || "";
    const iastPattern = /\b[a-zA-ZĀāĪīŪūṛṝḷḹĒēŌōṃḥṚṛṢṣṆṇṬṭḌḍÑñṄṅ\s\-']+\b/g;
    const iastMatches = headerText.match(iastPattern);

    if (iastMatches) {
      const withDiacritics = iastMatches.filter(
        (text) => /[ĀāĪīŪūṛṝḷḹĒēŌōṃḥṚṛṢṣṆṇṬṭḌḍÑñṄṅ]/.test(text) && text.trim().split(/\s+/).length > 3,
      );

      if (withDiacritics.length > 0) {
        result.transliteration = withDiacritics[0].trim();
      }
    }

    // Find content blocks
    const allBlocks = Array.from(doc.querySelectorAll("p, div"));

    for (const block of allBlocks) {
      const text = block.textContent?.trim() || "";

      // Skip empty or very short blocks
      if (text.length < 10) continue;

      // SYNONYMS - word-for-word translation
      if (text.includes("—") && text.split("—").length > 3) {
        if (!result.synonyms || result.synonyms.length < text.length) {
          result.synonyms = text;
        }
      }
      // TRANSLATION - "Текст" section
      else if (text.length > 50 && text.length < 1000 && !result.translation) {
        // This is likely the translation
        result.translation = text;
      }
      // PURPORT - "Комментарий" section
      else if (text.length > 500 && !result.purport) {
        result.purport = text;
      }
    }
  } catch (error) {
    console.error("Gitabase parse error:", error);
  }

  return result;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function VedabaseImportV3() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState("sb");
  const [cantoNumber, setCantoNumber] = useState("1");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [fromVerse, setFromVerse] = useState("1");
  const [toVerse, setToVerse] = useState("10");

  const [importEN, setImportEN] = useState(true);
  const [importUA, setImportUA] = useState(true);
  const [useGitabase, setUseGitabase] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [stats, setStats] = useState<ImportStats | null>(null);

  const bookConfig = useMemo(() => getBookConfig(selectedBook), [selectedBook]);

  const fetchHTML = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  };

  const startImport = async () => {
    setIsProcessing(true);
    setCurrentStep("Initialization...");
    setStats({ total: 0, imported: 0, skipped: 0, errors: [] });

    try {
      if (!bookConfig) throw new Error("Unknown book configuration");

      // 1. Book
      setCurrentStep("Checking book...");
      let { data: book } = await supabase
        .from("books")
        .select("id, slug")
        .eq("vedabase_slug", selectedBook)
        .maybeSingle();

      if (!book) {
        const { data: newBook, error } = await supabase
          .from("books")
          .insert({
            slug: selectedBook,
            vedabase_slug: selectedBook,
            title_ua: bookConfig.name_ua || selectedBook.toUpperCase(),
            title_en: bookConfig.name_en || selectedBook.toUpperCase(),
            has_cantos: bookConfig.has_cantos || false,
            is_published: true,
          })
          .select("id, slug")
          .single();

        if (error) throw new Error(error.message);
        book = newBook;
      }

      // 2. Chapter
      setCurrentStep("Checking chapter...");
      let chapterId: string;

      if (bookConfig.has_cantos) {
        // WITH CANTOS (e.g., Srimad Bhagavatam)
        let { data: canto } = await supabase
          .from("cantos")
          .select("id")
          .eq("book_id", book.id)
          .eq("canto_number", parseInt(cantoNumber))
          .maybeSingle();

        if (!canto) {
          const { data: newCanto, error } = await supabase
            .from("cantos")
            .insert({
              book_id: book.id,
              canto_number: parseInt(cantoNumber),
              title_ua: `Пісня ${cantoNumber}`,
              title_en: `Canto ${cantoNumber}`,
              is_published: true,
            })
            .select("id")
            .single();

          if (error) throw new Error(error.message);
          canto = newCanto;
        }

        let { data: chapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("canto_id", canto.id)
          .eq("chapter_number", parseInt(chapterNumber))
          .maybeSingle();

        if (!chapter) {
          // FIXED: Do NOT include book_id when canto_id is set
          const { data: newChapter, error } = await supabase
            .from("chapters")
            .insert({
              canto_id: canto.id,
              chapter_number: parseInt(chapterNumber),
              title_ua: `Глава ${chapterNumber}`,
              title_en: `Chapter ${chapterNumber}`,
              is_published: true,
            })
            .select("id")
            .single();

          if (error) throw new Error(error.message);
          chapter = newChapter;
        }

        chapterId = chapter.id;
      } else {
        // WITHOUT CANTOS (e.g., Bhagavad Gita)
        let { data: chapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("book_id", book.id)
          .eq("chapter_number", parseInt(chapterNumber))
          .maybeSingle();

        if (!chapter) {
          const { data: newChapter, error } = await supabase
            .from("chapters")
            .insert({
              book_id: book.id,
              chapter_number: parseInt(chapterNumber),
              title_ua: `Глава ${chapterNumber}`,
              title_en: `Chapter ${chapterNumber}`,
              is_published: true,
            })
            .select("id")
            .single();

          if (error) throw new Error(error.message);
          chapter = newChapter;
        }

        chapterId = chapter.id;
      }

      // 3. Import verses
      const from = parseInt(fromVerse);
      const to = parseInt(toVerse);
      const verseNumbers = Array.from({ length: to - from + 1 }, (_, i) => (from + i).toString());

      setStats((prev) => ({ ...prev!, total: verseNumbers.length }));

      for (const verseNum of verseNumbers) {
        setCurrentStep(`Importing verse ${verseNum}...`);

        let sanskrit = "";
        let transliterationEN = "";
        let transliterationUA = "";
        let synonymsEN = "";
        let translationEN = "";
        let purportEN = "";
        let synonymsUA = "";
        let translationUA = "";
        let purportUA = "";

        // VEDABASE (English)
        if (importEN) {
          try {
            const vedabaseUrl = buildVedabaseUrl(bookConfig, {
              canto: cantoNumber,
              chapter: chapterNumber,
              verse: verseNum,
            });
            const html = await fetchHTML(vedabaseUrl!);
            const data = extractVedabaseContent(html);

            sanskrit = data.sanskrit;
            transliterationEN = data.transliteration;
            synonymsEN = data.synonyms;
            translationEN = data.translation;
            purportEN = data.purport;

            await new Promise((r) => setTimeout(r, 500));
          } catch (e) {
            console.error(`Vedabase error ${verseNum}:`, e);
          }
        }

        // GITABASE (Ukrainian)
        if (importUA && useGitabase && bookConfig?.gitabase_available) {
          try {
            const gitabaseUrl = buildGitabaseUrl(bookConfig, {
              canto: cantoNumber,
              chapter: chapterNumber,
              verse: verseNum,
            });
            const html = await fetchHTML(gitabaseUrl!);
            const data = extractGitabaseContent(html);

            transliterationUA = data.transliteration;
            synonymsUA = data.synonyms;
            translationUA = data.translation;
            purportUA = data.purport;

            await new Promise((r) => setTimeout(r, 500));
          } catch (e) {
            console.error(`Gitabase error ${verseNum}:`, e);
          }
        }

        // Content check
        const hasContent =
          sanskrit || synonymsEN || translationEN || purportEN || synonymsUA || translationUA || purportUA;

        if (!hasContent) {
          setStats((prev) => ({
            ...prev!,
            errors: [...prev!.errors, `${verseNum}: empty`],
          }));
          continue;
        }

        // Save to database
        const displayBlocks = {
          sanskrit: !!sanskrit,
          transliteration: !!(transliterationEN || transliterationUA),
          synonyms: !!(synonymsEN || synonymsUA),
          translation: !!(translationEN || translationUA),
          commentary: !!(purportEN || purportUA),
        };

        const { error } = await supabase.from("verses").upsert(
          {
            chapter_id: chapterId,
            verse_number: verseNum,
            sanskrit,
            transliteration: transliterationUA || transliterationEN,
            synonyms_en: synonymsEN,
            translation_en: translationEN,
            commentary_en: purportEN,
            synonyms_ua: synonymsUA,
            translation_ua: translationUA,
            commentary_ua: purportUA,
            display_blocks: displayBlocks,
            is_published: true,
          },
          { onConflict: "chapter_id,verse_number" },
        );

        if (error) {
          setStats((prev) => ({
            ...prev!,
            errors: [...prev!.errors, `${verseNum}: ${error.message}`],
          }));
        } else {
          setStats((prev) => ({ ...prev!, imported: prev!.imported + 1 }));
        }
      }

      toast.success(`Import complete! Imported: ${stats?.imported || 0}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  // ========================================================================
  // UI
  // ========================================================================

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-xl font-bold">Імпорт віршів з Vedabase</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Двомовний імпорт віршів</CardTitle>
            <CardDescription>EN (Vedabase) + UA (Gitabase з автовиправленням)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Book Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Книга</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VEDABASE_BOOKS.map((b) => (
                      <SelectItem key={b.vedabase_slug} value={b.vedabase_slug}>
                        {b.name_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {bookConfig?.has_cantos && (
                <div>
                  <Label>Канто/Ліла</Label>
                  <Input
                    type="number"
                    value={cantoNumber}
                    onChange={(e) => setCantoNumber(e.target.value)}
                    placeholder="4"
                  />
                </div>
              )}
            </div>

            {/* Chapter & Verse Range */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Глава</Label>
                <Input
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <Label>Від вірша</Label>
                <Input type="number" value={fromVerse} onChange={(e) => setFromVerse(e.target.value)} placeholder="1" />
              </div>
              <div>
                <Label>До вірша</Label>
                <Input type="number" value={toVerse} onChange={(e) => setToVerse(e.target.value)} placeholder="10" />
              </div>
            </div>

            {/* Language Options */}
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center space-x-2">
                <Checkbox id="import-en" checked={importEN} onCheckedChange={(checked) => setImportEN(!!checked)} />
                <Label htmlFor="import-en" className="cursor-pointer">
                  Імпортувати англійською (Vedabase)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="import-ua" checked={importUA} onCheckedChange={(checked) => setImportUA(!!checked)} />
                <Label htmlFor="import-ua" className="cursor-pointer">
                  Імпортувати українською
                </Label>
              </div>

              {importUA && bookConfig?.gitabase_available && (
                <div className="ml-6 flex items-center space-x-2">
                  <Checkbox
                    id="use-gitabase"
                    checked={useGitabase}
                    onCheckedChange={(checked) => setUseGitabase(!!checked)}
                  />
                  <Label htmlFor="use-gitabase" className="cursor-pointer">
                    Gitabase (з автовиправленням)
                  </Label>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
              <strong>Примітка:</strong> Санскрит - спільний блок для обох мов. Purport = "Пояснення" українською.
            </div>

            {/* Import Button */}
            <Button onClick={startImport} disabled={isProcessing} size="lg" className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {currentStep || "Обробка..."}
                </>
              ) : (
                "Імпортувати вірші"
              )}
            </Button>

            {/* Stats */}
            {stats && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Всього:</span>
                  <Badge variant="secondary">{stats.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Імпортовано:
                  </span>
                  <Badge variant="default" className="bg-green-600">
                    {stats.imported}
                  </Badge>
                </div>
                {stats.errors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium">Помилки:</span>
                    </div>
                    <ul className="text-xs space-y-1 pl-6">
                      {stats.errors.slice(0, 5).map((err, i) => (
                        <li key={i} className="text-destructive">
                          {err}
                        </li>
                      ))}
                      {stats.errors.length > 5 && (
                        <li className="text-muted-foreground">... та ще {stats.errors.length - 5} помилок</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
