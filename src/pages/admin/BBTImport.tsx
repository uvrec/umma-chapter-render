import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { BookOpen, FileText, CheckCircle, AlertCircle, Loader2, Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const LOCAL_PARSER_URL = "http://127.0.0.1:5003";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qeplxgqadcbwlrbgydlb.supabase.co";

interface ParsedChapter {
  chapter_number: number;
  title_ua: string;
  verses: any[];
  verse_count: number;
}

interface ParsedIntro {
  slug: string;
  title_ua: string;
  content_ua: string;
  display_order: number;
}

interface ParseResult {
  chapters: ParsedChapter[];
  intros: ParsedIntro[];
  errors: { file: string; error: string }[];
  summary: {
    total_chapters: number;
    total_verses: number;
    total_intros: number;
    errors: number;
  };
}

interface AvailableFiles {
  chapters: string[];
  intros: { file: string; slug: string; title: string; order: number }[];
  docs_dir: string;
}

export default function BBTImport() {
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [availableFiles, setAvailableFiles] = useState<AvailableFiles | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [importMode, setImportMode] = useState<"all" | "chapters" | "intro">("all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"server" | "upload">("upload");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadParsing, setUploadParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check server status on mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    setServerStatus("checking");
    try {
      const res = await fetch(`${LOCAL_PARSER_URL}/health`);
      if (res.ok) {
        setServerStatus("online");
        loadAvailableFiles();
      } else {
        setServerStatus("offline");
      }
    } catch {
      setServerStatus("offline");
    }
  };

  const loadAvailableFiles = async () => {
    try {
      const res = await fetch(`${LOCAL_PARSER_URL}/admin/parse-bbt`);
      if (res.ok) {
        const data = await res.json();
        setAvailableFiles(data);
      }
    } catch (e) {
      console.error("Failed to load available files:", e);
    }
  };

  const handleParse = async () => {
    setLoading(true);
    setParseResult(null);

    try {
      const body: any = { mode: importMode };
      if (selectedChapter !== "all") {
        body.chapter = parseInt(selectedChapter);
      }

      const res = await fetch(`${LOCAL_PARSER_URL}/admin/parse-bbt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || err.error || "Parse failed");
      }

      const result: ParseResult = await res.json();
      setParseResult(result);

      // Auto-select all items
      const allIds = new Set<string>();
      result.chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
      result.intros.forEach((i) => allIds.add(`intro-${i.slug}`));
      setSelectedItems(allIds);

      toast({
        title: "Парсинг завершено",
        description: `${result.summary.total_chapters} глав (${result.summary.total_verses} віршів), ${result.summary.total_intros} intro сторінок`,
      });
    } catch (e) {
      toast({
        title: "Помилка парсингу",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleParseUploadedFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setUploadParsing(true);
    setParseResult(null);

    const chapters: ParsedChapter[] = [];
    const intros: ParsedIntro[] = [];
    const errors: { file: string; error: string }[] = [];

    try {
      // Get auth session for Authorization header
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Помилка авторизації",
          description: "Увійдіть в систему для імпорту файлів",
          variant: "destructive",
        });
        setUploadParsing(false);
        return;
      }

      for (const file of uploadedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        // Determine type from filename
        const isIntro = file.name.startsWith("UKBG00");
        formData.append("type", isIntro ? "intro" : "chapter");

        if (isIntro) {
          const prefix = file.name.split('.')[0].slice(0, 8);
          formData.append("file_prefix", prefix);
        }

        try {
          // Use fetch directly to properly handle FormData
          // supabase.functions.invoke() doesn't set correct Content-Type boundary
          const response = await fetch(
            `${SUPABASE_URL}/functions/v1/ventura-import`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: formData, // Browser auto-sets Content-Type with boundary
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            errors.push({
              file: file.name,
              error: errorData.error || errorData.detail || `HTTP ${response.status}`
            });
            continue;
          }

          const data = await response.json();

          if (data.success) {
            if (data.type === "intro") {
              intros.push(data.data);
            } else {
              chapters.push({
                ...data.data,
                verse_count: data.data.verses?.length || 0,
              });
            }
          } else {
            errors.push({ file: file.name, error: data.error || "Unknown error" });
          }
        } catch (e) {
          errors.push({
            file: file.name,
            error: e instanceof Error ? e.message : "Parse failed",
          });
        }
      }

      const result: ParseResult = {
        chapters,
        intros,
        errors,
        summary: {
          total_chapters: chapters.length,
          total_verses: chapters.reduce((sum, c) => sum + (c.verse_count || 0), 0),
          total_intros: intros.length,
          errors: errors.length,
        },
      };

      setParseResult(result);

      // Auto-select all items
      const allIds = new Set<string>();
      chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
      intros.forEach((i) => allIds.add(`intro-${i.slug}`));
      setSelectedItems(allIds);

      toast({
        title: "Парсинг завершено",
        description: `${result.summary.total_chapters} глав (${result.summary.total_verses} віршів), ${result.summary.total_intros} intro сторінок`,
      });
    } catch (e) {
      toast({
        title: "Помилка парсингу",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploadParsing(false);
    }
  };

  const handleSaveToSupabase = async () => {
    if (!parseResult) return;

    setSaving(true);
    setSaveProgress(0);

    const selectedChapters = parseResult.chapters.filter((c) =>
      selectedItems.has(`chapter-${c.chapter_number}`)
    );
    const selectedIntros = parseResult.intros.filter((i) =>
      selectedItems.has(`intro-${i.slug}`)
    );

    const totalItems = selectedChapters.length + selectedIntros.length;
    let processed = 0;
    let savedVerses = 0;
    let savedIntros = 0;

    try {
      // Get book_id for 'bg'
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("id")
        .eq("slug", "bg")
        .single();

      if (bookError || !book) {
        throw new Error("Книгу 'bg' не знайдено в базі даних");
      }

      const bookId = book.id;

      // Save chapters (verses)
      for (const chapter of selectedChapters) {
        // Get or create chapter
        let chapterId: string;

        const { data: existingChapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("book_id", bookId)
          .eq("chapter_number", chapter.chapter_number)
          .single();

        if (existingChapter) {
          chapterId = existingChapter.id;

          // Update chapter title if needed
          await supabase
            .from("chapters")
            .update({ title_ua: chapter.title_ua })
            .eq("id", chapterId);
        } else {
          // Create new chapter
          const { data: newChapter, error: chapterError } = await supabase
            .from("chapters")
            .insert({
              book_id: bookId,
              chapter_number: chapter.chapter_number,
              title_ua: chapter.title_ua,
              title_en: chapter.title_ua, // Fallback
            })
            .select("id")
            .single();

          if (chapterError || !newChapter) {
            console.error(`Error creating chapter ${chapter.chapter_number}:`, chapterError);
            continue;
          }
          chapterId = newChapter.id;
        }

        // Save verses for this chapter
        for (const verse of chapter.verses) {
          // Check if verse exists
          const { data: existingVerse } = await supabase
            .from("verses")
            .select("id")
            .eq("chapter_id", chapterId)
            .eq("verse_number", verse.verse_number)
            .single();

          if (existingVerse) {
            // Update existing verse
            const { error } = await supabase
              .from("verses")
              .update({
                transliteration_ua: verse.transliteration_ua,
                synonyms_ua: verse.synonyms_ua,
                translation_ua: verse.translation_ua,
                commentary_ua: verse.commentary_ua,
              })
              .eq("id", existingVerse.id);

            if (error) {
              console.error(`Error updating verse ${verse.verse_number}:`, error);
            } else {
              savedVerses++;
            }
          } else {
            // Insert new verse
            const { error } = await supabase.from("verses").insert({
              chapter_id: chapterId,
              verse_number: verse.verse_number,
              transliteration_ua: verse.transliteration_ua,
              synonyms_ua: verse.synonyms_ua,
              translation_ua: verse.translation_ua,
              commentary_ua: verse.commentary_ua,
            });

            if (error) {
              console.error(`Error inserting verse ${verse.verse_number}:`, error);
            } else {
              savedVerses++;
            }
          }
        }

        processed++;
        setSaveProgress(Math.round((processed / totalItems) * 100));
      }

      // Save intro pages
      for (const intro of selectedIntros) {
        // Check if intro exists
        const { data: existingIntro } = await supabase
          .from("intro_chapters")
          .select("id")
          .eq("book_id", bookId)
          .eq("slug", intro.slug)
          .single();

        if (existingIntro) {
          // Update existing
          const { error } = await supabase
            .from("intro_chapters")
            .update({
              title_ua: intro.title_ua,
              content_ua: intro.content_ua,
              display_order: intro.display_order,
            })
            .eq("id", existingIntro.id);

          if (error) {
            console.error(`Error updating intro ${intro.slug}:`, error);
          } else {
            savedIntros++;
          }
        } else {
          // Insert new
          const { error } = await supabase.from("intro_chapters").insert({
            book_id: bookId,
            slug: intro.slug,
            title_ua: intro.title_ua,
            title_en: intro.title_ua, // Fallback
            content_ua: intro.content_ua,
            display_order: intro.display_order,
          });

          if (error) {
            console.error(`Error inserting intro ${intro.slug}:`, error);
          } else {
            savedIntros++;
          }
        }

        processed++;
        setSaveProgress(Math.round((processed / totalItems) * 100));
      }

      toast({
        title: "Збережено!",
        description: `${savedVerses} віршів та ${savedIntros} intro сторінок`,
      });
    } catch (e) {
      toast({
        title: "Помилка збереження",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setSaveProgress(0);
    }
  };

  const toggleItem = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const toggleAll = () => {
    if (!parseResult) return;
    if (selectedItems.size === parseResult.chapters.length + parseResult.intros.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set<string>();
      parseResult.chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
      parseResult.intros.forEach((i) => allIds.add(`intro-${i.slug}`));
      setSelectedItems(allIds);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">BBT Імпорт</h1>
        <p className="text-muted-foreground">
          Імпорт Бгаґавад-ґіти з файлів BBT (Ventura формат)
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "server" | "upload")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Завантажити файли
          </TabsTrigger>
          <TabsTrigger value="server">
            <FileText className="w-4 h-4 mr-2" />
            Локальний сервер
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Завантаження файлів
              </CardTitle>
              <CardDescription>
                Виберіть .H93 файли для парсингу (глави: UKBG01XT.H93 - UKBG18XT.H93, intro: UKBG00XX.H93)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".h01,.h02,.h03,.h04,.h05,.h06,.h07,.h08,.h09,.h10,.h11,.h12,.h13,.h14,.h15,.h16,.h17,.h18,.h93,.H01,.H02,.H03,.H04,.H05,.H06,.H07,.H08,.H09,.H10,.H11,.H12,.H13,.H14,.H15,.H16,.H17,.H18,.H93"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Вибрати файли
                </Button>
                <p className="text-sm text-muted-foreground">
                  Підтримуються файли Ventura (.H01-.H18, .H93)
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Вибрані файли ({uploadedFiles.length}):</Label>
                  <ScrollArea className="h-[150px] border rounded-md p-2">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="text-sm py-1 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {file.name}
                        <span className="text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}

              <Button
                onClick={handleParseUploadedFiles}
                disabled={uploadParsing || uploadedFiles.length === 0}
                className="w-full"
              >
                {uploadParsing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Парсинг...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Парсити файли ({uploadedFiles.length})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Server Tab */}
        <TabsContent value="server" className="space-y-4">
          {/* Server Status */}
          <div className="flex items-center gap-2 mb-4">
            {serverStatus === "checking" && (
              <span className="text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                Перевірка сервера...
              </span>
            )}
            {serverStatus === "online" && (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Сервер онлайн
              </span>
            )}
            {serverStatus === "offline" && (
              <span className="text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Сервер офлайн
                <Button variant="outline" size="sm" onClick={checkServerStatus}>
                  Перевірити
                </Button>
              </span>
            )}
          </div>

          {serverStatus === "offline" && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-800">
                  Локальний сервер не запущено. Запустіть його командою:
                </p>
                <pre className="mt-2 p-3 bg-red-100 rounded text-sm">
                  python tools/parse_server.py
                </pre>
              </CardContent>
            </Card>
          )}

          {serverStatus === "online" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Налаштування парсингу
                </CardTitle>
                <CardDescription>
                  Виберіть що імпортувати з файлів BBT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Режим імпорту</Label>
                    <Select value={importMode} onValueChange={(v: any) => setImportMode(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все (глави + intro)</SelectItem>
                        <SelectItem value="chapters">Тільки глави</SelectItem>
                        <SelectItem value="intro">Тільки intro сторінки</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {importMode !== "intro" && (
                    <div className="space-y-2">
                      <Label>Глава</Label>
                      <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Всі глави (1-18)</SelectItem>
                          {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              Глава {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {availableFiles && (
                  <div className="text-sm text-muted-foreground">
                    Знайдено: {availableFiles.chapters.length} файлів глав,{" "}
                    {availableFiles.intros.length} intro файлів
                  </div>
                )}

                <Button onClick={handleParse} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Парсинг...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Парсити файли
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Parse Results (shared between tabs) */}
      {parseResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Результат парсингу
            </CardTitle>
            <CardDescription>
              {parseResult.summary.total_chapters} глав ({parseResult.summary.total_verses}{" "}
              віршів), {parseResult.summary.total_intros} intro сторінок
              {parseResult.summary.errors > 0 && (
                <span className="text-red-500 ml-2">
                  ({parseResult.summary.errors} помилок)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selectedItems.size ===
                parseResult.chapters.length + parseResult.intros.length
                  ? "Зняти всі"
                  : "Вибрати всі"}
              </Button>
              <span className="text-sm text-muted-foreground">
                Вибрано: {selectedItems.size} з{" "}
                {parseResult.chapters.length + parseResult.intros.length}
              </span>
            </div>

            <ScrollArea className="h-[300px] border rounded-md p-4">
              {/* Chapters */}
              {parseResult.chapters.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold">Глави</h4>
                  {parseResult.chapters.map((ch) => (
                    <div key={ch.chapter_number} className="flex items-center gap-2">
                      <Checkbox
                        id={`chapter-${ch.chapter_number}`}
                        checked={selectedItems.has(`chapter-${ch.chapter_number}`)}
                        onCheckedChange={() =>
                          toggleItem(`chapter-${ch.chapter_number}`)
                        }
                      />
                      <Label
                        htmlFor={`chapter-${ch.chapter_number}`}
                        className="flex-1 cursor-pointer"
                      >
                        Глава {ch.chapter_number}: {ch.title_ua} ({ch.verse_count} віршів)
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Intros */}
              {parseResult.intros.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Intro сторінки</h4>
                  {parseResult.intros.map((intro) => (
                    <div key={intro.slug} className="flex items-center gap-2">
                      <Checkbox
                        id={`intro-${intro.slug}`}
                        checked={selectedItems.has(`intro-${intro.slug}`)}
                        onCheckedChange={() => toggleItem(`intro-${intro.slug}`)}
                      />
                      <Label
                        htmlFor={`intro-${intro.slug}`}
                        className="flex-1 cursor-pointer"
                      >
                        {intro.title_ua}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Errors */}
              {parseResult.errors.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-semibold text-red-600">Помилки</h4>
                  {parseResult.errors.map((err, i) => (
                    <div key={i} className="text-sm text-red-500">
                      {err.file}: {err.error}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {saving && (
              <div className="space-y-2">
                <Progress value={saveProgress} />
                <p className="text-sm text-muted-foreground text-center">
                  Збереження... {saveProgress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleSaveToSupabase}
              disabled={saving || selectedItems.size === 0}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Збереження...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Зберегти в Supabase ({selectedItems.size} елементів)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
