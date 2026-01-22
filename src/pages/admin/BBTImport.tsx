import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { BookOpen, CheckCircle, Loader2, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import pre-parsed data
import bbtData from "@/data/bbt-parsed.json";

interface ParsedChapter {
  chapter_number: number;
  title_uk: string;
  verses: {
    verse_number: string;
    transliteration_uk?: string;
    synonyms_uk?: string;
    translation_uk?: string;
    commentary_uk?: string;
  }[];
}

interface ParsedIntro {
  slug: string;
  title_uk: string;
  content_uk: string;
  display_order: number;
}

export default function BBTImport() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => {
    // Auto-select all items
    const allIds = new Set<string>();
    (bbtData.chapters as ParsedChapter[]).forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
    (bbtData.intros as ParsedIntro[]).forEach((i) => allIds.add(`intro-${i.slug}`));
    return allIds;
  });

  const chapters = bbtData.chapters as ParsedChapter[];
  const intros = bbtData.intros as ParsedIntro[];
  const totalVerses = chapters.reduce((sum, c) => sum + c.verses.length, 0);

  const handleSaveToSupabase = async () => {
    setSaving(true);
    setSaveProgress(0);

    const selectedChapters = chapters.filter((c) =>
      selectedItems.has(`chapter-${c.chapter_number}`)
    );
    const selectedIntros = intros.filter((i) =>
      selectedItems.has(`intro-${i.slug}`)
    );

    const totalItems = selectedChapters.length + selectedIntros.length;
    let processed = 0;
    let savedVerses = 0;
    let savedIntros = 0;

    try {
      // Get book_id for 'gita'
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("id")
        .eq("slug", "gita")
        .single();

      if (bookError || !book) {
        throw new Error("Книгу 'gita' не знайдено в базі даних");
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
            .update({ title_uk: chapter.title_uk.replace(/\n/g, ' ') })
            .eq("id", chapterId);
        } else {
          // Create new chapter
          const { data: newChapter, error: chapterError } = await supabase
            .from("chapters")
            .insert({
              book_id: bookId,
              chapter_number: chapter.chapter_number,
              title_uk: chapter.title_uk.replace(/\n/g, ' '),
              title_en: chapter.title_uk.replace(/\n/g, ' '), // Fallback
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
            // Update existing verse (only Ukrainian fields!)
            const { error } = await supabase
              .from("verses")
              .update({
                transliteration_uk: verse.transliteration_uk,
                synonyms_uk: verse.synonyms_uk,
                translation_uk: verse.translation_uk,
                commentary_uk: verse.commentary_uk,
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
              transliteration_uk: verse.transliteration_uk,
              synonyms_uk: verse.synonyms_uk,
              translation_uk: verse.translation_uk,
              commentary_uk: verse.commentary_uk,
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
              title_uk: intro.title_uk,
              content_uk: intro.content_uk,
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
            title_uk: intro.title_uk,
            title_en: intro.title_uk, // Fallback
            content_uk: intro.content_uk,
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
    if (selectedItems.size === chapters.length + intros.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set<string>();
      chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
      intros.forEach((i) => allIds.add(`intro-${i.slug}`));
      setSelectedItems(allIds);
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">BBT Імпорт</h1>
        <p className="text-muted-foreground">
          Імпорт Бгаґавад-ґіти з файлів BBT (Ventura формат)
        </p>
      </div>

      {/* Data Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Дані готові до імпорту
          </CardTitle>
          <CardDescription className="text-green-700">
            Файли вже парсовані і включені в проєкт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600">{chapters.length}</div>
              <div className="text-sm text-muted-foreground">Глав</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600">{totalVerses}</div>
              <div className="text-sm text-muted-foreground">Віршів</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600">{intros.length}</div>
              <div className="text-sm text-muted-foreground">Intro сторінок</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection & Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Вибрати для імпорту
          </CardTitle>
          <CardDescription>
            Оберіть які глави та intro сторінки імпортувати в базу даних.
            Існуючі записи будуть оновлені (тільки українські поля).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={toggleAll}>
              {selectedItems.size === chapters.length + intros.length
                ? "Зняти всі"
                : "Вибрати всі"}
            </Button>
            <span className="text-sm text-muted-foreground">
              Вибрано: {selectedItems.size} з {chapters.length + intros.length}
            </span>
          </div>

          <ScrollArea className="h-[400px] border rounded-md p-4">
            {/* Chapters */}
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold">Глави</h4>
              {chapters.map((ch) => (
                <div key={ch.chapter_number} className="flex items-center gap-2">
                  <Checkbox
                    id={`chapter-${ch.chapter_number}`}
                    checked={selectedItems.has(`chapter-${ch.chapter_number}`)}
                    onCheckedChange={() => toggleItem(`chapter-${ch.chapter_number}`)}
                  />
                  <Label
                    htmlFor={`chapter-${ch.chapter_number}`}
                    className="flex-1 cursor-pointer"
                  >
                    Глава {ch.chapter_number}: {ch.title_uk.replace(/\n/g, ' ')} ({ch.verses.length} віршів)
                  </Label>
                </div>
              ))}
            </div>

            {/* Intros */}
            <div className="space-y-2">
              <h4 className="font-semibold">Intro сторінки</h4>
              {intros.map((intro) => (
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
                    {intro.title_uk}
                  </Label>
                </div>
              ))}
            </div>
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
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Збереження...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Імпортувати в Supabase ({selectedItems.size} елементів)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
