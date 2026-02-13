import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, AlertCircle, CheckCircle, Search, Wrench, Zap, Eye, BookOpen, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import {
  applyNormalizationRules,
  defaultRules,
  ruleCategories,
} from "@/utils/text/textNormalizationRules";

const ALL_VALUE = "__all__";

interface EncodingRemnant {
  table_name: string;
  column_name: string;
  affected_count: number;
  sample_id: string;
  sample_verse_number: string;
  sample_text: string;
}

interface Book {
  id: string;
  title_uk: string;
  slug: string;
  has_cantos: boolean;
}

interface Canto {
  id: string;
  canto_number: number;
  title_uk: string;
}

interface Chapter {
  id: string;
  chapter_number: number;
  title_uk: string;
}

interface VerseChange {
  verse_id: string;
  verse_number: string;
  field: string;
  original: string;
  normalized: string;
  changes: Array<{ from: string; to: string; position: number }>;
}

// Fields to normalize in verses
const NORMALIZABLE_FIELDS = [
  { key: "synonyms_uk", label: "Послівний переклад" },
  { key: "translation_uk", label: "Літературний переклад" },
  { key: "commentary_uk", label: "Пояснення" },
] as const;

export default function NormalizeTexts() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isNormalizingUK, setIsNormalizingUA] = useState(false);
  const [isNormalizingEN, setIsNormalizingEN] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [encodingRemnants, setEncodingRemnants] = useState<EncodingRemnant[]>([]);
  const [scanCompleted, setScanCompleted] = useState(false);

  // Batch content normalization state
  const [books, setBooks] = useState<Book[]>([]);
  const [cantos, setCantos] = useState<Canto[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [selectedCantoId, setSelectedCantoId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isLoadingCantos, setIsLoadingCantos] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isPreviewingChanges, setIsPreviewingChanges] = useState(false);
  const [isApplyingChanges, setIsApplyingChanges] = useState(false);
  const [verseChanges, setVerseChanges] = useState<VerseChange[]>([]);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(ruleCategories.map(c => c.id))
  );

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  // Load books on mount
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoadingBooks(true);
      try {
        const { data, error } = await supabase
          .from("books")
          .select("id, title_uk, slug, has_cantos")
          .order("title_uk");
        if (error) throw error;
        setBooks(data || []);
      } catch (error: any) {
        console.error("Error loading books:", error);
        toast.error("Помилка завантаження книг");
      } finally {
        setIsLoadingBooks(false);
      }
    };
    loadBooks();
  }, []);

  // Load cantos when book is selected
  useEffect(() => {
    if (!selectedBookId) {
      setCantos([]);
      setSelectedCantoId("");
      return;
    }

    const book = books.find(b => b.id === selectedBookId);
    setSelectedBook(book || null);

    if (!book?.has_cantos) {
      setCantos([]);
      setSelectedCantoId("");
      return;
    }

    const loadCantos = async () => {
      setIsLoadingCantos(true);
      try {
        const { data, error } = await supabase
          .from("cantos")
          .select("id, canto_number, title_uk")
          .eq("book_id", selectedBookId)
          .order("canto_number");
        if (error) throw error;
        setCantos(data || []);
      } catch (error: any) {
        console.error("Error loading cantos:", error);
        toast.error("Помилка завантаження пісень");
      } finally {
        setIsLoadingCantos(false);
      }
    };
    loadCantos();
  }, [selectedBookId, books]);

  // Load chapters when book or canto is selected
  useEffect(() => {
    if (!selectedBookId) {
      setChapters([]);
      setSelectedChapterId("");
      return;
    }

    // If book has cantos, require canto selection
    if (selectedBook?.has_cantos && !selectedCantoId) {
      setChapters([]);
      setSelectedChapterId("");
      return;
    }

    const loadChapters = async () => {
      setIsLoadingChapters(true);
      try {
        let query = supabase
          .from("chapters")
          .select("id, chapter_number, title_uk")
          .order("chapter_number");

        if (selectedCantoId) {
          query = query.eq("canto_id", selectedCantoId);
        } else {
          query = query.eq("book_id", selectedBookId);
        }

        const { data, error } = await query;
        if (error) throw error;
        setChapters(data || []);
      } catch (error: any) {
        console.error("Error loading chapters:", error);
        toast.error("Помилка завантаження глав");
      } finally {
        setIsLoadingChapters(false);
      }
    };
    loadChapters();
  }, [selectedBookId, selectedCantoId, selectedBook]);

  // Preview changes for selected scope
  const handlePreviewChanges = async () => {
    if (!selectedBookId) {
      toast.error("Оберіть книгу");
      return;
    }

    setIsPreviewingChanges(true);
    setVerseChanges([]);

    try {
      // Build query based on selection scope
      let query = supabase
        .from("verses")
        .select("id, verse_number, synonyms_uk, translation_uk, commentary_uk, chapters!inner(id, book_id, canto_id)");

      if (selectedChapterId) {
        // Single chapter
        query = query.eq("chapter_id", selectedChapterId);
      } else if (selectedCantoId) {
        // Whole canto
        query = query.eq("chapters.canto_id", selectedCantoId);
      } else {
        // Whole book
        query = query.eq("chapters.book_id", selectedBookId);
      }

      const { data: verses, error } = await query;
      if (error) throw error;

      if (!verses || verses.length === 0) {
        toast.info("Немає віршів для нормалізації");
        return;
      }

      const allChanges: VerseChange[] = [];

      for (const verse of verses) {
        for (const field of NORMALIZABLE_FIELDS) {
          const originalText = verse[field.key as keyof typeof verse] as string | null;
          if (!originalText) continue;

          const { result, changes } = applyNormalizationRules(
            originalText,
            defaultRules,
            enabledCategories
          );

          if (changes.length > 0 && result !== originalText) {
            allChanges.push({
              verse_id: verse.id,
              verse_number: verse.verse_number,
              field: field.key,
              original: originalText,
              normalized: result,
              changes: changes.map(c => ({ from: c.original, to: c.replacement, position: c.position })),
            });
          }
        }
      }

      setVerseChanges(allChanges);

      if (allChanges.length === 0) {
        toast.success("Всі тексти вже нормалізовані!");
      } else {
        toast.info(`Знайдено ${allChanges.length} полів для нормалізації`);
      }
    } catch (error: any) {
      console.error("Error previewing changes:", error);
      toast.error("Помилка аналізу текстів", { description: error.message });
    } finally {
      setIsPreviewingChanges(false);
    }
  };

  // Apply normalization changes
  const handleApplyChanges = async () => {
    if (verseChanges.length === 0) return;

    const scopeText = selectedChapterId
      ? "цю главу"
      : selectedCantoId
      ? "цю пісню"
      : "цю книгу";

    if (!confirm(`Застосувати ${verseChanges.length} змін до ${scopeText}?\n\nЦя операція незворотня.`)) {
      return;
    }

    setIsApplyingChanges(true);

    try {
      // Group changes by verse_id for batch updates
      const updatesByVerse = new Map<string, Record<string, string>>();

      for (const change of verseChanges) {
        const existing = updatesByVerse.get(change.verse_id) || {};
        existing[change.field] = change.normalized;
        updatesByVerse.set(change.verse_id, existing);
      }

      // Apply updates
      let updatedCount = 0;
      for (const [verseId, updates] of updatesByVerse) {
        const { error } = await supabase
          .from("verses")
          .update(updates)
          .eq("id", verseId);

        if (error) {
          console.error(`Error updating verse ${verseId}:`, error);
          throw error;
        }
        updatedCount++;
      }

      toast.success(`Нормалізовано ${updatedCount} віршів!`, {
        description: `Застосовано ${verseChanges.length} змін`
      });

      // Clear preview
      setVerseChanges([]);
    } catch (error: any) {
      console.error("Error applying changes:", error);
      toast.error("Помилка застосування змін", { description: error.message });
    } finally {
      setIsApplyingChanges(false);
    }
  };

  // Toggle category
  const toggleCategory = (categoryId: string) => {
    setEnabledCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
    // Clear preview when categories change
    setVerseChanges([]);
  };

  // Get scope description
  const getScopeDescription = () => {
    if (selectedChapterId) {
      const chapter = chapters.find(c => c.id === selectedChapterId);
      return `Глава ${chapter?.chapter_number}: ${chapter?.title_uk || ""}`;
    }
    if (selectedCantoId) {
      const canto = cantos.find(c => c.id === selectedCantoId);
      return `Пісня ${canto?.canto_number}: ${canto?.title_uk || ""}`;
    }
    if (selectedBookId) {
      const book = books.find(b => b.id === selectedBookId);
      return book?.title_uk || "";
    }
    return "";
  };

  const handleNormalizeUA = async () => {
    if (!confirm('⚠️ Це оновить ВСІ українські тексти Чайтанья-чарітамріти (послівний переклад, літературний переклад та пояснення).\n\nПродовжити?')) {
      return;
    }

    setIsNormalizingUA(true);
    try {
      // @ts-expect-error SQL function will be created in Supabase
      const { error } = await supabase.rpc('normalize_ukrainian_cc_texts');
      if (error) throw error;
      toast.success('✅ Українські тексти успішно нормалізовано!', {
        description: 'Застосовано всі правила нормалізації'
      });
    } catch (error: any) {
      console.error(error);
      toast.error('❌ Помилка нормалізації', {
        description: error.message || 'Спробуйте ще раз'
      });
    } finally {
      setIsNormalizingUA(false);
    }
  };

  const handleNormalizeEN = async () => {
    if (!confirm('⚠️ Це видалить всі повторювані слова з англійських Synonyms Чайтанья-чарітамріти.\n\nПродовжити?')) {
      return;
    }

    setIsNormalizingEN(true);
    try {
      // @ts-expect-error SQL function will be created in Supabase
      const { error } = await supabase.rpc('remove_duplicate_words_in_synonyms');
      if (error) throw error;
      toast.success('✅ Англійські synonyms очищено від дублів!', {
        description: 'Видалено всі повторювані слова'
      });
    } catch (error: any) {
      console.error(error);
      toast.error('❌ Помилка очищення', {
        description: error.message || 'Спробуйте ще раз'
      });
    } finally {
      setIsNormalizingEN(false);
    }
  };

  // Scan for HTML encoding remnants
  const handleScanEncodingRemnants = async () => {
    setIsScanning(true);
    setScanCompleted(false);
    setEncodingRemnants([]);
    try {
      const { data, error } = await supabase.rpc('find_html_encoding_remnants');
      if (error) throw error;
      const rows = (data as EncodingRemnant[] | null) ?? [];
      setEncodingRemnants(rows);
      setScanCompleted(true);
      if (rows.length > 0) {
        toast.warning(`Знайдено ${rows.length} полів з проблемами кодування`, {
          description: 'Перегляньте деталі нижче та запустіть виправлення'
        });
      } else {
        toast.success('✅ База даних чиста!', {
          description: 'Залишків HTML кодування не знайдено'
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error('❌ Помилка сканування', {
        description: error.message || 'Переконайтеся що SQL функція створена в Supabase'
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Fix HTML encoding remnants
  const handleFixEncodingRemnants = async () => {
    if (!confirm('⚠️ Це декодує всі HTML ентіті (&lt;p&gt; → <p>) у всіх текстових полях.\n\nРезервна копія буде створена автоматично.\n\nПродовжити?')) {
      return;
    }

    setIsFixing(true);
    try {
      const { data, error } = await supabase.rpc('fix_html_encoding_remnants');
      if (error) throw error;

      const fixRows = (data as Array<{ fixed_count?: number }> | null) ?? [];
      const totalFixed = fixRows.reduce((sum, row) => sum + (row.fixed_count ?? 0), 0);

      if (totalFixed > 0) {
        toast.success(`✅ Виправлено ${totalFixed} записів!`, {
          description: 'Резервну копію збережено в таблиці html_encoding_cleanup_backup'
        });
        // Re-scan to show updated status
        await handleScanEncodingRemnants();
      } else {
        toast.info('Нічого виправляти', {
          description: 'Всі записи вже чисті'
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error('❌ Помилка виправлення', {
        description: error.message || 'Спробуйте ще раз'
      });
    } finally {
      setIsFixing(false);
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Нормалізація текстів</h1>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
            ← Назад до адмінки
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Увага!</strong> Ці операції змінюють дані в базі даних безповоротно.
            Переконайтеся що SQL функції створені в Supabase перед використанням.
          </AlertDescription>
        </Alert>

        {/* Batch Content Normalization Card */}
        <Card className="border-amber-400/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Пакетна нормалізація контенту
            </CardTitle>
            <CardDescription>
              Застосувати правила нормалізації до текстів віршів (послівний переклад, літературний переклад, пояснення)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scope Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Книга</label>
                <Select
                  value={selectedBookId}
                  onValueChange={(value) => {
                    setSelectedBookId(value);
                    setSelectedCantoId("");
                    setSelectedChapterId("");
                    setVerseChanges([]);
                  }}
                  disabled={isLoadingBooks}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть книгу..." />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title_uk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBook?.has_cantos && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Пісня</label>
                  <Select
                    value={selectedCantoId || ALL_VALUE}
                    onValueChange={(value) => {
                      setSelectedCantoId(value === ALL_VALUE ? "" : value);
                      setSelectedChapterId("");
                      setVerseChanges([]);
                    }}
                    disabled={isLoadingCantos || !selectedBookId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Вся книга" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>Вся книга</SelectItem>
                      {cantos.map((canto) => (
                        <SelectItem key={canto.id} value={canto.id}>
                          Пісня {canto.canto_number}: {canto.title_uk}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Глава</label>
                <Select
                  value={selectedChapterId || ALL_VALUE}
                  onValueChange={(value) => {
                    setSelectedChapterId(value === ALL_VALUE ? "" : value);
                    setVerseChanges([]);
                  }}
                  disabled={isLoadingChapters || !selectedBookId || (selectedBook?.has_cantos && !selectedCantoId)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedBook?.has_cantos && !selectedCantoId ? "Оберіть пісню" : "Вся пісня/книга"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUE}>{selectedCantoId ? "Вся пісня" : "Вся книга"}</SelectItem>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        Глава {chapter.chapter_number}: {chapter.title_uk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Selection */}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span className="text-sm">Налаштування категорій правил ({enabledCategories.size} активних)</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-muted rounded-lg">
                  {ruleCategories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Checkbox
                        checked={enabledCategories.has(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      {category.name_uk}
                    </label>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Selected Scope Display */}
            {selectedBookId && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Область: <strong>{getScopeDescription()}</strong>
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handlePreviewChanges}
                disabled={!selectedBookId || isPreviewingChanges}
                className="flex-1"
                variant="outline"
              >
                {isPreviewingChanges && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isPreviewingChanges && <Eye className="mr-2 h-4 w-4" />}
                {isPreviewingChanges ? "Аналіз..." : "Переглянути зміни"}
              </Button>

              <Button
                onClick={handleApplyChanges}
                disabled={verseChanges.length === 0 || isApplyingChanges}
                className="flex-1"
              >
                {isApplyingChanges && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isApplyingChanges && <Zap className="mr-2 h-4 w-4" />}
                {isApplyingChanges ? "Застосування..." : `Застосувати (${verseChanges.length})`}
              </Button>
            </div>

            {/* Preview Results */}
            {verseChanges.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Знайдено змін: {verseChanges.length}</h4>
                  <span className="text-sm text-muted-foreground">
                    {new Set(verseChanges.map(c => c.verse_id)).size} віршів
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Вірш</TableHead>
                        <TableHead className="w-32">Поле</TableHead>
                        <TableHead>Зміни</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {verseChanges.slice(0, 100).map((change, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs">{change.verse_number}</TableCell>
                          <TableCell className="text-xs">
                            {NORMALIZABLE_FIELDS.find(f => f.key === change.field)?.label || change.field}
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="space-y-1">
                              {change.changes.slice(0, 3).map((c, j) => (
                                <div key={j}>
                                  <span className="bg-red-100 dark:bg-red-900/30 px-1 rounded line-through">{c.from}</span>
                                  {" → "}
                                  <span className="bg-green-100 dark:bg-green-900/30 px-1 rounded">{c.to}</span>
                                </div>
                              ))}
                              {change.changes.length > 3 && (
                                <span className="text-muted-foreground">+{change.changes.length - 3} більше...</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {verseChanges.length > 100 && (
                    <div className="p-2 text-center text-sm text-muted-foreground border-t">
                      Показано 100 з {verseChanges.length} змін
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📝 Українські тексти (Чайтанья-чарітамріта)</CardTitle>
            <CardDescription>
              Застосувати всі правила нормалізації до послівного перекладу, 
              літературного перекладу та пояснень
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">Правила нормалізації:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Апостроф після "н" → м'який знак (н' → нь)</li>
                <li>Санн'ясі → Санньясі (та всі похідні форми)</li>
                <li>проджджгіта → проджджхіта</li>
                <li>джджг → джджх</li>
                <li>джг → джх</li>
              </ul>
            </div>
            <Button 
              onClick={handleNormalizeUA} 
              disabled={isNormalizingUK}
              size="lg"
              className="w-full"
            >
              {isNormalizingUK && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNormalizingUK ? 'Нормалізація...' : 'Нормалізувати українські тексти'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔤 Англійські Synonyms (Чайтанья-чарітамріта)</CardTitle>
            <CardDescription>
              Видалити повторювані слова з блоку Synonyms (залишаючи тільки унікальні слова)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">Що буде зроблено:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Видалення дублікатів слів з synonyms_en</li>
                <li>Збереження порядку слів</li>
                <li>Видалення зайвих пробілів</li>
              </ul>
            </div>
            <Button 
              onClick={handleNormalizeEN} 
              disabled={isNormalizingEN}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {isNormalizingEN && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNormalizingEN ? 'Очищення...' : 'Очистити англійські synonyms від дублів'}
            </Button>
          </CardContent>
        </Card>

        {/* HTML Encoding Remnants Card */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🔍</span>
              HTML Encoding Remnants
            </CardTitle>
            <CardDescription>
              Знайти та виправити закодовані HTML ентіті (&lt;p&gt; замість &lt;p&gt;),
              які відображаються як видимі теги в режимі редагування
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">Що шукаємо:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code>&amp;lt;p&amp;gt;</code> → <code>&lt;p&gt;</code></li>
                <li><code>&amp;lt;/p&amp;gt;</code> → <code>&lt;/p&gt;</code></li>
                <li><code>&amp;nbsp;</code> → пробіл</li>
                <li>Подвійне кодування: <code>&amp;amp;lt;</code> → <code>&lt;</code></li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleScanEncodingRemnants}
                disabled={isScanning}
                variant="outline"
                className="flex-1"
              >
                {isScanning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isScanning && <Search className="mr-2 h-4 w-4" />}
                {isScanning ? 'Сканування...' : 'Сканувати базу даних'}
              </Button>

              <Button
                onClick={handleFixEncodingRemnants}
                disabled={isFixing || !scanCompleted || encodingRemnants.length === 0}
                variant="destructive"
                className="flex-1"
              >
                {isFixing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isFixing && <Wrench className="mr-2 h-4 w-4" />}
                {isFixing ? 'Виправлення...' : 'Виправити все'}
              </Button>
            </div>

            {/* Scan Results */}
            {scanCompleted && (
              <div className="space-y-2">
                {encodingRemnants.length === 0 ? (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      База даних чиста! Залишків HTML кодування не знайдено.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 dark:text-amber-200">
                        Знайдено {encodingRemnants.reduce((sum, r) => sum + r.affected_count, 0)} записів
                        з проблемами кодування в {encodingRemnants.length} полях.
                      </AlertDescription>
                    </Alert>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Таблиця</TableHead>
                            <TableHead>Поле</TableHead>
                            <TableHead className="text-right">Кількість</TableHead>
                            <TableHead>Приклад</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {encodingRemnants.map((remnant, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{remnant.table_name}</TableCell>
                              <TableCell>{remnant.column_name}</TableCell>
                              <TableCell className="text-right">{remnant.affected_count}</TableCell>
                              <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                                {remnant.sample_text?.substring(0, 80)}...
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle>⚠️ Інструкція для створення SQL функцій</CardTitle>
            <CardDescription>
              Ці функції потрібно створити в Supabase SQL Editor один раз
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">1. Відкрийте Supabase SQL Editor</p>
              <p className="text-sm font-medium">2. Виконайте наступні SQL команди:</p>
              <div className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
                <pre>{`-- 1. Застосуйте міграцію для HTML encoding remnants:
-- supabase/migrations/20260113120000_fix_html_encoding_remnants.sql

-- 2. Функція для нормалізації українських текстів
CREATE OR REPLACE FUNCTION normalize_ukrainian_cc_texts()
RETURNS void AS $$
-- (повний код функції з документації)
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Функція для видалення дублів у synonyms
CREATE OR REPLACE FUNCTION remove_duplicate_words_in_synonyms()
RETURNS void AS $$
-- (повний код функції з документації)
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Функції для HTML encoding remnants (вже в міграції):
-- find_html_encoding_remnants() - діагностика
-- fix_html_encoding_remnants() - виправлення`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
