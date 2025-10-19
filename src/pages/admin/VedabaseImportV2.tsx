import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Download, AlertCircle, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VEDABASE_BOOKS, getBookConfig, buildVedabaseUrl, buildGitabaseUrl, getOurSlug } from "@/utils/Vedabase-books";
import { Badge } from "@/components/ui/badge";
import { detectScript } from "@/utils/synonyms";
import { parseGitabaseHTML } from "@/utils/import/webImporter";
import { ParserStatus } from "@/components/admin/ParserStatus";
import { useParserHealth } from "@/hooks/useParserHealth";
import { ImportIds } from "@/config/importIds";

/**
 * FIXED: Improved Vedabase import with proper HTML parsing
 * - Proper content extraction without navigation elements
 * - Correct field separation
 * - Better error handling
 */
export default function VedabaseImportV2() {
  const navigate = useNavigate();
  const { status: parserStatus } = useParserHealth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState("bg");
  const [cantoNumber, setCantoNumber] = useState("1");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [manualMode, setManualMode] = useState(false);
  const [manualFrom, setManualFrom] = useState("1");
  const [manualTo, setManualTo] = useState("10");

  const [importEN, setImportEN] = useState(true);
  const [importUA, setImportUA] = useState(() => selectedBook === "cc");
  const [useGitabaseUA, setUseGitabaseUA] = useState(() => selectedBook === "cc");

  const allowUA = useMemo(() => importUA && selectedBook === "cc", [importUA, selectedBook]);
  const allowEN = useMemo(() => importEN, [importEN]);

  const fetchHtmlViaProxy = async (url: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("fetch-proxy", { body: { url } });
    if (error) throw new Error(error.message || "Proxy error");
    const html = (data as any)?.html as string | undefined;
    if (!html) throw new Error("Empty proxy response");
    return html;
  };

  const [stats, setStats] = useState<{
    total: number;
    imported: number;
    skipped: number;
    grouped: string[];
    errors: string[];
  } | null>(null);

  const bookConfig = useMemo(() => getBookConfig(selectedBook)!, [selectedBook]);
  const requiresCanto = !!bookConfig?.has_cantos;
  const requiresChapter = useMemo(
    () => !!bookConfig?.url_pattern?.includes("{chapter}") || !!bookConfig?.url_pattern?.includes("{lila}"),
    [bookConfig],
  );

  /**
   * FIXED: Clean text extraction - removes navigation and UI elements
   */
  const cleanText = (text: string): string => {
    if (!text) return "";

    // Remove common navigation/UI elements
    const cleaned = text
      .replace(
        /Bhaktivedanta|Vedabase|Settings|English|Library|Search|Support|Tools|Contact|Default View|Show in Advanced View|Dual Language View/gi,
        "",
      )
      .replace(/Previous (verse|Chapter)|Next (verse|Chapter)/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return cleaned;
  };

  /**
   * FIXED: Proper section extraction from specific container
   */
  const extractSectionContent = (doc: Document, containerSelector: string, sectionClass: string): string => {
    try {
      // Find the main content container first
      const contentContainer = doc.querySelector(containerSelector);
      if (!contentContainer) {
        console.warn(`Container not found: ${containerSelector}`);
        return "";
      }

      // Extract specific section within the container
      const section = contentContainer.querySelector(sectionClass);
      if (!section) {
        console.warn(`Section not found: ${sectionClass} in ${containerSelector}`);
        return "";
      }

      // Get only text content, excluding nested navigation
      const text = Array.from(section.childNodes)
        .filter((node) => {
          // Exclude navigation elements
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            const tagName = el.tagName.toLowerCase();
            if (["nav", "header", "footer", "button", "a"].includes(tagName)) {
              return false;
            }
            if (
              el.classList.contains("navigation") ||
              el.classList.contains("breadcrumb") ||
              el.classList.contains("menu")
            ) {
              return false;
            }
          }
          return true;
        })
        .map((node) => node.textContent || "")
        .join("\n")
        .trim();

      return cleanText(text);
    } catch (error) {
      console.error(`Error extracting section ${sectionClass}:`, error);
      return "";
    }
  };

  /**
   * FIXED: Proper verse content extraction
   */
  const extractVerseContent = (
    doc: Document,
    language: "en" | "uk",
  ): {
    sanskrit: string;
    transliteration: string;
    synonyms: string;
    translation: string;
    commentary: string;
  } => {
    const result = {
      sanskrit: "",
      transliteration: "",
      synonyms: "",
      translation: "",
      commentary: "",
    };

    try {
      // Main content container (avoid navigation)
      const mainContent = doc.querySelector("main, article, .verse-content, #content");
      if (!mainContent) {
        console.warn("Main content container not found");
        return result;
      }

      // Extract Sanskrit/Bengali - look for script-specific content
      const scriptElements = mainContent.querySelectorAll('[lang="sa"], .devanagari, .bengali, .sanskrit-text');
      if (scriptElements.length > 0) {
        result.sanskrit = Array.from(scriptElements)
          .map((el) => el.textContent?.trim() || "")
          .filter((t) => t.length > 0 && /[\u0900-\u097F\u0980-\u09FF]/.test(t))
          .join("\n");
      }

      // Transliteration
      const translitElements = mainContent.querySelectorAll('.transliteration, .roman, [class*="translit"]');
      if (translitElements.length > 0) {
        result.transliteration = Array.from(translitElements)
          .map((el) => cleanText(el.textContent || ""))
          .filter((t) => t.length > 0)
          .join("\n");
      }

      // Synonyms/Word-for-word
      const synonymsElements = mainContent.querySelectorAll('.synonyms, .word-for-word, [class*="synonym"]');
      if (synonymsElements.length > 0) {
        result.synonyms = Array.from(synonymsElements)
          .map((el) => cleanText(el.textContent || ""))
          .filter((t) => t.length > 0)
          .join("\n");
      }

      // Translation
      const translationElements = mainContent.querySelectorAll(
        '.translation, [class*="translation"]:not([class*="translit"])',
      );
      if (translationElements.length > 0) {
        result.translation = Array.from(translationElements)
          .map((el) => cleanText(el.textContent || ""))
          .filter((t) => t.length > 0)
          .join("\n");
      }

      // Commentary/Purport
      const commentaryElements = mainContent.querySelectorAll(
        '.purport, .commentary, [class*="purport"], [class*="commentary"]',
      );
      if (commentaryElements.length > 0) {
        result.commentary = Array.from(commentaryElements)
          .map((el) => cleanText(el.textContent || ""))
          .filter((t) => t.length > 0)
          .join("\n\n");
      }

      console.log(`Extracted content (${language}):`, {
        sanskritLength: result.sanskrit.length,
        translitLength: result.transliteration.length,
        synonymsLength: result.synonyms.length,
        translationLength: result.translation.length,
        commentaryLength: result.commentary.length,
      });
    } catch (error) {
      console.error(`Error extracting verse content (${language}):`, error);
    }

    return result;
  };

  /**
   * Scan chapter for verse numbers
   */
  const scanChapterVerses = async (baseUrl: string): Promise<string[]> => {
    setCurrentStep("Scanning page...");
    try {
      const html = await fetchHtmlViaProxy(baseUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const anchors = Array.from(doc.querySelectorAll<HTMLAnchorElement>("a[href]"));
      const verseLinks = anchors
        .map((a) => a.href || "")
        .map((href) => {
          try {
            const path = new URL(href).pathname;
            if (!path.includes(`/library/${bookConfig.slug}/`)) return null;
            const m = path.match(/\/(\d+(?:-\d+)?)\/?$/);
            return m ? m[1] : null;
          } catch {
            return null;
          }
        })
        .filter((v): v is string => !!v);

      const uniqueVerses = Array.from(new Set(verseLinks));
      console.log(`Found verses: ${uniqueVerses.length}`, uniqueVerses);
      return uniqueVerses;
    } catch (error) {
      console.error("Scan error:", error);
      return [];
    }
  };

  /**
   * FIXED: Import single verse with proper content extraction
   */
  const importVerseFromVedabase = async (
    verseNumber: string,
    verseUrl: string,
    chapterId: string,
    gitabaseMap?: Map<string, { translation?: string; commentary?: string }>,
  ): Promise<{ success: boolean; isGrouped: boolean; error?: string }> => {
    try {
      setCurrentStep(`Importing verse ${verseNumber}...`);

      const isGrouped = verseNumber.includes("-");
      if (isGrouped) {
        console.log(`⚠️ Verse ${verseNumber} is grouped - skipping`);
        return { success: true, isGrouped: true };
      }

      const base = verseUrl.replace(/\/$/, "");
      const parser = new DOMParser();

      // Load English page
      let contentEN = { sanskrit: "", transliteration: "", synonyms: "", translation: "", commentary: "" };
      if (allowEN) {
        try {
          const htmlEN = await fetchHtmlViaProxy(base + "/side-by-side/en/");
          const docEN = parser.parseFromString(htmlEN, "text/html");
          contentEN = extractVerseContent(docEN, "en");
        } catch (e) {
          console.warn(`⚠️ Failed to load EN for ${verseNumber}:`, e);
        }
      }

      // Load Ukrainian page
      let contentUA = { sanskrit: "", transliteration: "", synonyms: "", translation: "", commentary: "" };
      if (allowUA) {
        try {
          let htmlUA = "";
          try {
            htmlUA = await fetchHtmlViaProxy(base + "/side-by-side/uk/");
          } catch {
            htmlUA = await fetchHtmlViaProxy(base + "/side-by-side/ua/");
          }
          const docUA = parser.parseFromString(htmlUA, "text/html");
          contentUA = extractVerseContent(docUA, "uk");
        } catch (e) {
          console.warn(`⚠️ Failed to load UA for ${verseNumber}:`, e);
        }
      }

      // Merge Sanskrit/transliteration (prefer EN, fallback UA)
      const sanskrit = contentEN.sanskrit || contentUA.sanskrit;
      const transliteration = contentEN.transliteration || contentUA.transliteration;

      // Gitabase fallback for UA
      if (gitabaseMap && allowUA) {
        const g = gitabaseMap.get(verseNumber);
        if (g) {
          if (!contentUA.translation && g.translation) {
            contentUA.translation = g.translation;
          }
          if (!contentUA.commentary && g.commentary) {
            contentUA.commentary = g.commentary;
          }
        }
      }

      // Check if we have any content
      const hasContent = !!(
        sanskrit ||
        transliteration ||
        (allowEN && (contentEN.synonyms || contentEN.translation || contentEN.commentary)) ||
        (allowUA && (contentUA.synonyms || contentUA.translation || contentUA.commentary))
      );

      if (!hasContent) {
        console.warn(`⚠️ Verse ${verseNumber}: empty content, skipping`);
        return { success: false, isGrouped: false, error: "Empty content" };
      }

      console.log(`✅ Verse ${verseNumber}:`, {
        hasSanskrit: !!sanskrit,
        hasTranslit: !!transliteration,
        hasEN: !!(allowEN && (contentEN.synonyms || contentEN.translation || contentEN.commentary)),
        hasUA: !!(allowUA && (contentUA.synonyms || contentUA.translation || contentUA.commentary)),
      });

      // Display blocks configuration
      const displayBlocks = {
        sanskrit: !!sanskrit,
        transliteration: !!transliteration,
        synonyms: !!((allowEN && contentEN.synonyms) || (allowUA && contentUA.synonyms)),
        translation: !!((allowEN && contentEN.translation) || (allowUA && contentUA.translation)),
        commentary: !!((allowEN && contentEN.commentary) || (allowUA && contentUA.commentary)),
      };

      // Prepare insert payload
      const insertPayload: any = {
        chapter_id: chapterId,
        verse_number: verseNumber,
        sanskrit,
        transliteration,
        display_blocks: displayBlocks,
      };

      if (allowEN) {
        insertPayload.synonyms_en = contentEN.synonyms;
        insertPayload.translation_en = contentEN.translation;
        insertPayload.commentary_en = contentEN.commentary;
      }

      if (allowUA) {
        insertPayload.synonyms_ua = contentUA.synonyms;
        insertPayload.translation_ua = contentUA.translation;
        insertPayload.commentary_ua = contentUA.commentary;
      }

      // Save to database
      const { error: upsertError } = await supabase.from("verses").upsert(insertPayload, {
        onConflict: "chapter_id,verse_number",
        ignoreDuplicates: false,
      });

      if (upsertError) {
        return { success: false, isGrouped: false, error: upsertError.message };
      }

      return { success: true, isGrouped: false };
    } catch (error) {
      return {
        success: false,
        isGrouped: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  /**
   * Main import function
   */
  const startImport = async () => {
    setIsProcessing(true);
    setStats({ total: 0, imported: 0, skipped: 0, grouped: [], errors: [] });

    try {
      if (!bookConfig) {
        toast.error("Unknown book");
        return;
      }

      // Find or create book
      const { data: dbBooks } = await supabase
        .from("books")
        .select("id, slug, has_cantos")
        .eq("vedabase_slug", selectedBook)
        .limit(1);

      let dbBook = dbBooks?.[0] ?? null;

      if (!dbBook) {
        console.log(`📚 Creating book with vedabase_slug="${selectedBook}"...`);
        const ourSlug = getOurSlug(bookConfig) || selectedBook;
        const bookTitle = bookConfig.name_ua || bookConfig.name_en || selectedBook.toUpperCase();

        const { data: newBook, error: createBookError } = await supabase
          .from("books")
          .insert({
            slug: ourSlug,
            vedabase_slug: selectedBook,
            title_ua: bookConfig.name_ua || bookTitle,
            title_en: bookConfig.name_en || bookTitle,
            has_cantos: bookConfig.has_cantos || false,
          })
          .select("id, slug, has_cantos")
          .single();

        if (createBookError) {
          toast.error(`Failed to create book: ${createBookError.message}`);
          return;
        }

        dbBook = newBook;
        toast.success(`Book "${bookTitle}" created!`);
      }

      // Build URL for side-by-side page
      const baseUrl = buildVedabaseUrl(bookConfig, {
        canto: cantoNumber,
        chapter: chapterNumber,
      });

      const chapterUrl = baseUrl.replace(/\/$/, "") + "/side-by-side/uk/";

      // Extract chapter title
      let chapterTitleUa = `Глава ${chapterNumber}`;
      let chapterTitleEn = `Chapter ${chapterNumber}`;

      try {
        const chapterHtml = await fetchHtmlViaProxy(chapterUrl);
        const chapterDoc = new DOMParser().parseFromString(chapterHtml, "text/html");
        const h1 = chapterDoc.querySelector("h1");
        if (h1) {
          const fullTitle = h1.textContent?.trim() || "";
          const parts = fullTitle.split(/[\/\-]/);
          if (parts.length >= 2) {
            chapterTitleUa = parts[0].trim();
            chapterTitleEn = parts[1].trim();
          } else {
            chapterTitleUa = fullTitle;
            chapterTitleEn = fullTitle;
          }
        }
      } catch (error) {
        console.warn("Failed to extract chapter title:", error);
      }

      // Find or create chapter
      let chapterId: string;

      if (requiresCanto) {
        const { data: canto } = await supabase
          .from("cantos")
          .select("id")
          .eq("book_id", dbBook.id)
          .eq("canto_number", parseInt(cantoNumber))
          .single();

        let cantoId = canto?.id;

        if (!cantoId) {
          const { data: newCanto, error: cantoError } = await supabase
            .from("cantos")
            .insert({
              book_id: dbBook.id,
              canto_number: parseInt(cantoNumber),
              title_ua: `Пісня ${cantoNumber}`,
              title_en: `Canto ${cantoNumber}`,
            })
            .select("id")
            .single();

          if (cantoError) {
            toast.error(`Canto creation error: ${cantoError.message}`);
            return;
          }
          cantoId = newCanto.id;
        }

        const { data: existingChapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("canto_id", cantoId)
          .eq("chapter_number", parseInt(chapterNumber))
          .single();

        if (existingChapter) {
          chapterId = existingChapter.id;
          await supabase
            .from("chapters")
            .update({
              title_en: chapterTitleEn,
              ...(allowUA ? { title_ua: chapterTitleUa } : {}),
            })
            .eq("id", chapterId);
        } else {
          const { data: newChapter, error: chapterError } = await supabase
            .from("chapters")
            .insert({
              canto_id: cantoId,
              chapter_number: parseInt(chapterNumber),
              title_ua: chapterTitleUa,
              title_en: chapterTitleEn,
              chapter_type: "verses",
            })
            .select("id")
            .single();

          if (chapterError) {
            toast.error(`Chapter creation error: ${chapterError.message}`);
            return;
          }
          chapterId = newChapter.id;
        }
      } else {
        const { data: existingChapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("book_id", dbBook.id)
          .eq("chapter_number", parseInt(chapterNumber))
          .single();

        if (existingChapter) {
          chapterId = existingChapter.id;
          await supabase
            .from("chapters")
            .update({
              title_en: chapterTitleEn,
              ...(allowUA ? { title_ua: chapterTitleUa } : {}),
            })
            .eq("id", chapterId);
        } else {
          const { data: newChapter, error: chapterError } = await supabase
            .from("chapters")
            .insert({
              book_id: dbBook.id,
              chapter_number: parseInt(chapterNumber),
              title_ua: chapterTitleUa,
              title_en: chapterTitleEn,
              chapter_type: "verses",
            })
            .select("id")
            .single();

          if (chapterError) {
            toast.error(`Chapter creation error: ${chapterError.message}`);
            return;
          }
          chapterId = newChapter.id;
        }
      }

      // Preload Gitabase (UA) if enabled
      let gitabaseMap: Map<string, { translation?: string; commentary?: string }> | undefined = undefined;
      if (useGitabaseUA && bookConfig.gitabase_available) {
        try {
          const gUrl = buildGitabaseUrl(bookConfig, { canto: cantoNumber, chapter: chapterNumber });
          if (gUrl) {
            const gHtml = await fetchHtmlViaProxy(gUrl);
            gitabaseMap = parseGitabaseHTML(gHtml);
          }
        } catch (e) {
          console.warn("Gitabase unavailable or parse error:", e);
        }
      }

      // Scan verses
      let verseNumbers: string[];

      if (manualMode) {
        const from = parseInt(manualFrom);
        const to = parseInt(manualTo);
        verseNumbers = Array.from({ length: to - from + 1 }, (_, i) => (from + i).toString());
        console.log("Manual mode:", verseNumbers);
      } else {
        verseNumbers = await scanChapterVerses(baseUrl);
        if (verseNumbers.length === 0) {
          toast.error("No verses found. Try manual mode.");
          return;
        }
      }

      setStats((prev) => ({ ...prev!, total: verseNumbers.length }));

      // Import each verse
      for (const verseNum of verseNumbers) {
        const verseUrl = buildVedabaseUrl(bookConfig, {
          canto: cantoNumber,
          chapter: chapterNumber,
          verse: verseNum,
        });

        const result = await importVerseFromVedabase(verseNum, verseUrl, chapterId, gitabaseMap);

        if (result.success) {
          if (result.isGrouped) {
            setStats((prev) => ({
              ...prev!,
              grouped: [...prev!.grouped, verseNum],
              skipped: prev!.skipped + 1,
            }));
          } else {
            setStats((prev) => ({ ...prev!, imported: prev!.imported + 1 }));
          }
        } else {
          setStats((prev) => ({
            ...prev!,
            errors: [...prev!.errors, `${verseNum}: ${result.error}`],
          }));
        }
      }

      toast.success("Import completed!");
    } catch (error) {
      console.error("Import error:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setIsProcessing(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Import from Vedabase (Side-by-Side) - FIXED</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="vedabase" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="vedabase">Vedabase (EN+UA)</TabsTrigger>
          </TabsList>

          <TabsContent value="vedabase" className="space-y-4">
            <ParserStatus className="mb-3" />
            
            <Card>
              <CardHeader>
                <CardTitle>Import Settings</CardTitle>
                <CardDescription>Uses side-by-side pages for automatic UA+EN content extraction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Book</Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEDABASE_BOOKS.map((book) => (
                        <SelectItem key={book.slug} value={book.slug}>
                          {book.name_ua} ({book.slug})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {requiresCanto && (
                  <div className="space-y-2">
                    <Label>Canto/Lila Number</Label>
                    <Input type="number" value={cantoNumber} onChange={(e) => setCantoNumber(e.target.value)} min="1" />
                  </div>
                )}

                {requiresChapter && (
                  <div className="space-y-2">
                    <Label>Chapter Number</Label>
                    <Input
                      type="number"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(e.target.value)}
                      min="1"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="import-en"
                      checked={importEN}
                      onChange={(e) => setImportEN(e.target.checked)}
                    />
                    <Label htmlFor="import-en">Import English</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="import-ua"
                      checked={importUA}
                      onChange={(e) => setImportUA(e.target.checked)}
                      disabled={selectedBook !== "cc"}
                    />
                    <Label htmlFor="import-ua">
                      Import Ukrainian {selectedBook !== "cc" && "(only available for CC)"}
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="manual-mode"
                    checked={manualMode}
                    onChange={(e) => setManualMode(e.target.checked)}
                  />
                  <Label htmlFor="manual-mode">Manual mode (specify verse range)</Label>
                </div>

                {manualMode && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>From verse</Label>
                      <Input type="number" value={manualFrom} onChange={(e) => setManualFrom(e.target.value)} min="1" />
                    </div>
                    <div>
                      <Label>To verse</Label>
                      <Input type="number" value={manualTo} onChange={(e) => setManualTo(e.target.value)} min="1" />
                    </div>
                  </div>
                )}

                <Button onClick={startImport} disabled={isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {currentStep || "Importing..."}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Start Import
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <Badge>{stats.total}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Imported:</span>
                    <Badge variant="default">{stats.imported}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Skipped:</span>
                    <Badge variant="secondary">{stats.skipped}</Badge>
                  </div>
                  {stats.grouped.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Grouped verses:</h4>
                      <div className="flex flex-wrap gap-2">
                        {stats.grouped.map((v) => (
                          <Badge key={v} variant="outline">
                            {v}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {stats.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-destructive">Errors:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {stats.errors.map((err, i) => (
                          <li key={i} className="text-destructive">
                            {err}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
