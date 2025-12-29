import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { BookOpen, FileText, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
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

const LOCAL_PARSER_URL = "http://127.0.0.1:5003";

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

    try {
      // Save chapters (verses)
      for (const chapter of selectedChapters) {
        for (const verse of chapter.verses) {
          const verseNumber = `${chapter.chapter_number}.${verse.verse_number}`;

          // Upsert verse
          const { error } = await supabase.from("verses").upsert(
            {
              book: "bg",
              verse_number: verseNumber,
              transliteration_ua: verse.transliteration_ua,
              synonyms_ua: verse.synonyms_ua,
              translation_ua: verse.translation_ua,
              commentary_ua: verse.commentary_ua,
            },
            { onConflict: "book,verse_number" }
          );

          if (error) {
            console.error(`Error saving verse ${verseNumber}:`, error);
          }
        }

        processed++;
        setSaveProgress(Math.round((processed / totalItems) * 100));
      }

      // Save intro pages
      for (const intro of selectedIntros) {
        const { error } = await supabase.from("intro_chapters").upsert(
          {
            book: "bg",
            slug: intro.slug,
            title_ua: intro.title_ua,
            content_ua: intro.content_ua,
            display_order: intro.display_order,
          },
          { onConflict: "book,slug" }
        );

        if (error) {
          console.error(`Error saving intro ${intro.slug}:`, error);
        }

        processed++;
        setSaveProgress(Math.round((processed / totalItems) * 100));
      }

      toast({
        title: "Збережено!",
        description: `${selectedChapters.length} глав та ${selectedIntros.length} intro сторінок`,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">BBT Імпорт</h1>
          <p className="text-muted-foreground">
            Імпорт Бгаґавад-ґіти з файлів BBT (Ventura формат)
          </p>
        </div>

        {/* Server Status */}
        <div className="flex items-center gap-2">
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
        <>
          {/* Parse Options */}
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

          {/* Parse Results */}
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
        </>
      )}
    </div>
  );
}
