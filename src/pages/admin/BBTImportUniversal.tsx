import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { BookOpen, CheckCircle, Loader2, Database, Library } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import pre-parsed data for different books
import bbtGitaData from "@/data/bbt-parsed.json";
import poyData from "@/data/poy-parsed.json";
import eaData from "@/data/ea-parsed.json";
import noiData from "@/data/noi-parsed.json";
import isoData from "@/data/iso-parsed.json";
import pqnData from "@/data/pqn-parsed.json";
import sb4Data from "@/data/sb4-parsed.json";

// Book configurations
interface BookConfig {
  slug: string;
  title_ua: string;
  title_en: string;
  hasVerses: boolean; // true for Gita-like, false for continuous text books
  data: ParsedBookData;
  cantoNumber?: number; // For multi-canto books like Bhagavatam
}

interface ParsedChapterWithVerses {
  chapter_number: number;
  title_ua: string;
  verses: {
    verse_number: string;
    transliteration_ua?: string;
    synonyms_ua?: string;
    translation_ua?: string;
    commentary_ua?: string;
  }[];
}

interface ParsedChapterWithContent {
  chapter_number: number;
  title_ua: string;
  content_ua: string;
}

interface ParsedIntro {
  slug: string;
  title_ua: string;
  content_ua: string;
  display_order: number;
}

interface ParsedBookData {
  chapters: (ParsedChapterWithVerses | ParsedChapterWithContent)[];
  intros: ParsedIntro[];
}

const BOOK_CONFIGS: BookConfig[] = [
  {
    slug: "bg",
    title_ua: "Бгаґавад-ґіта як вона є",
    title_en: "Bhagavad-gita As It Is",
    hasVerses: true,
    data: bbtGitaData as ParsedBookData,
  },
  {
    slug: "poy",
    title_ua: "Досконалість йоґи",
    title_en: "The Perfection of Yoga",
    hasVerses: false,
    data: poyData as ParsedBookData,
  },
  {
    slug: "ea",
    title_ua: "Легка подорож до інших планет",
    title_en: "Easy Journey to Other Planets",
    hasVerses: false,
    data: eaData as ParsedBookData,
  },
  {
    slug: "noi",
    title_ua: "Нектар настанов",
    title_en: "The Nectar of Instruction",
    hasVerses: true,
    data: noiData as ParsedBookData,
  },
  {
    slug: "iso",
    title_ua: "Шрі Ішопанішада",
    title_en: "Sri Isopanisad",
    hasVerses: true,
    data: isoData as ParsedBookData,
  },
  {
    slug: "pqn",
    title_ua: "Досконалі питання, досконалі відповіді",
    title_en: "Perfect Questions, Perfect Answers",
    hasVerses: false,
    data: pqnData as ParsedBookData,
  },
  {
    slug: "sb",
    title_ua: "Шрімад-Бгаґаватам, Пісня 4, Частина 2",
    title_en: "Srimad Bhagavatam, Canto 4, Part 2",
    hasVerses: true,
    data: sb4Data as ParsedBookData,
    cantoNumber: 4,
  },
];

function hasVerses(chapter: ParsedChapterWithVerses | ParsedChapterWithContent): chapter is ParsedChapterWithVerses {
  return 'verses' in chapter && Array.isArray(chapter.verses);
}

function hasContent(chapter: ParsedChapterWithVerses | ParsedChapterWithContent): chapter is ParsedChapterWithContent {
  return 'content_ua' in chapter && typeof chapter.content_ua === 'string';
}

export default function BBTImportUniversal() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<string>(BOOK_CONFIGS[0].slug);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const bookConfig = useMemo(() =>
    BOOK_CONFIGS.find(b => b.slug === selectedBook) || BOOK_CONFIGS[0],
    [selectedBook]
  );

  const chapters = bookConfig.data.chapters;
  const intros = bookConfig.data.intros || [];

  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => {
    const allIds = new Set<string>();
    chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
    intros.forEach((i) => allIds.add(`intro-${i.slug}`));
    return allIds;
  });

  // Reset selection when book changes
  const handleBookChange = (bookSlug: string) => {
    setSelectedBook(bookSlug);
    const config = BOOK_CONFIGS.find(b => b.slug === bookSlug);
    if (config) {
      const allIds = new Set<string>();
      config.data.chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
      (config.data.intros || []).forEach((i) => allIds.add(`intro-${i.slug}`));
      setSelectedItems(allIds);
    }
  };

  const totalVerses = bookConfig.hasVerses
    ? chapters.reduce((sum, c) => sum + (hasVerses(c) ? c.verses.length : 0), 0)
    : 0;

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
    let savedChapters = 0;
    let savedVerses = 0;
    let savedIntros = 0;

    try {
      // Get or create book
      let { data: book, error: bookError } = await supabase
        .from("books")
        .select("id")
        .eq("slug", bookConfig.slug)
        .single();

      if (bookError || !book) {
        // Create the book if it doesn't exist
        const { data: newBook, error: createError } = await supabase
          .from("books")
          .insert({
            slug: bookConfig.slug,
            title_ua: bookConfig.title_ua,
            title_en: bookConfig.title_en,
            is_published: true,
          })
          .select("id")
          .single();

        if (createError || !newBook) {
          throw new Error(`Не вдалося створити книгу '${bookConfig.slug}': ${createError?.message}`);
        }
        book = newBook;
        console.log(`Created new book: ${bookConfig.slug}`);
      }

      const bookId = book.id;

      // Handle canto for multi-canto books (like Bhagavatam)
      let cantoId: string | null = null;
      if (bookConfig.cantoNumber) {
        // Find existing canto
        const { data: existingCanto } = await supabase
          .from("cantos")
          .select("id")
          .eq("book_id", bookId)
          .eq("canto_number", bookConfig.cantoNumber)
          .single();

        if (existingCanto) {
          cantoId = existingCanto.id;
          console.log(`Found existing canto ${bookConfig.cantoNumber}: ${cantoId}`);
        } else {
          // Create the canto
          const { data: newCanto, error: cantoError } = await supabase
            .from("cantos")
            .insert({
              book_id: bookId,
              canto_number: bookConfig.cantoNumber,
              title_ua: `Пісня ${bookConfig.cantoNumber}`,
              title_en: `Canto ${bookConfig.cantoNumber}`,
            })
            .select("id")
            .single();

          if (cantoError || !newCanto) {
            console.error(`Error creating canto ${bookConfig.cantoNumber}:`, cantoError);
          } else {
            cantoId = newCanto.id;
            console.log(`Created new canto ${bookConfig.cantoNumber}: ${cantoId}`);
          }
        }
      }

      // Save chapters
      for (const chapter of selectedChapters) {
        let chapterId: string;

        // Build query for finding existing chapter
        let chapterQuery = supabase
          .from("chapters")
          .select("id")
          .eq("book_id", bookId)
          .eq("chapter_number", chapter.chapter_number);

        // For canto-based books, also filter by canto_id
        if (cantoId) {
          chapterQuery = chapterQuery.eq("canto_id", cantoId);
        }

        const { data: existingChapter } = await chapterQuery.single();

        if (existingChapter) {
          chapterId = existingChapter.id;

          // Update chapter
          const updateData = {
            title_ua: chapter.title_ua.replace(/\n/g, ' '),
            ...(cantoId && { canto_id: cantoId }),
            ...(!bookConfig.hasVerses && hasContent(chapter) && {
              content_ua: chapter.content_ua,
              chapter_type: "text" as const,
            }),
          };

          await supabase
            .from("chapters")
            .update(updateData)
            .eq("id", chapterId);
        } else {
          // Create new chapter
          const insertData = {
            book_id: bookId,
            chapter_number: chapter.chapter_number,
            title_ua: chapter.title_ua.replace(/\n/g, ' '),
            title_en: chapter.title_ua.replace(/\n/g, ' '), // Fallback
            ...(cantoId && { canto_id: cantoId }),
            ...(!bookConfig.hasVerses && hasContent(chapter) && {
              content_ua: chapter.content_ua,
              chapter_type: "text" as const,
            }),
          };

          const { data: newChapter, error: chapterError } = await supabase
            .from("chapters")
            .insert(insertData)
            .select("id")
            .single();

          if (chapterError || !newChapter) {
            console.error(`Error creating chapter ${chapter.chapter_number}:`, chapterError);
            continue;
          }
          chapterId = newChapter.id;
        }

        savedChapters++;

        // Save verses if book has verses (like Gita)
        if (bookConfig.hasVerses && hasVerses(chapter)) {
          for (const verse of chapter.verses) {
            const { data: existingVerse } = await supabase
              .from("verses")
              .select("id")
              .eq("chapter_id", chapterId)
              .eq("verse_number", verse.verse_number)
              .single();

            if (existingVerse) {
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
        }

        processed++;
        setSaveProgress(Math.round((processed / totalItems) * 100));
      }

      // Save intro pages
      for (const intro of selectedIntros) {
        const { data: existingIntro } = await supabase
          .from("intro_chapters")
          .select("id")
          .eq("book_id", bookId)
          .eq("slug", intro.slug)
          .single();

        if (existingIntro) {
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
          const { error } = await supabase.from("intro_chapters").insert({
            book_id: bookId,
            slug: intro.slug,
            title_ua: intro.title_ua,
            title_en: intro.title_ua,
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

      const resultParts: string[] = [];
      if (savedChapters > 0) resultParts.push(`${savedChapters} глав`);
      if (savedVerses > 0) resultParts.push(`${savedVerses} віршів`);
      if (savedIntros > 0) resultParts.push(`${savedIntros} intro сторінок`);

      toast({
        title: "Збережено!",
        description: resultParts.join(", ") || "Немає змін",
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
          Універсальний імпорт книг BBT
        </p>
      </div>

      {/* Book Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="w-5 h-5" />
            Вибір книги
          </CardTitle>
          <CardDescription>
            Оберіть книгу для імпорту
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBook} onValueChange={handleBookChange}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Оберіть книгу" />
            </SelectTrigger>
            <SelectContent>
              {BOOK_CONFIGS.map((book) => (
                <SelectItem key={book.slug} value={book.slug}>
                  {book.title_ua}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Дані готові до імпорту: {bookConfig.title_ua}
          </CardTitle>
          <CardDescription className="text-green-700">
            {bookConfig.hasVerses
              ? "Книга з віршами (як Бгаґавад-ґіта)"
              : "Книга з суцільним текстом (глави без віршів)"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid ${bookConfig.hasVerses ? 'grid-cols-3' : 'grid-cols-2'} gap-4 text-center`}>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600">{chapters.length}</div>
              <div className="text-sm text-muted-foreground">Глав</div>
            </div>
            {bookConfig.hasVerses && (
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-green-600">{totalVerses}</div>
                <div className="text-sm text-muted-foreground">Віршів</div>
              </div>
            )}
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
                    Глава {ch.chapter_number}: {ch.title_ua.replace(/\n/g, ' ')}
                    {bookConfig.hasVerses && hasVerses(ch) && (
                      <span className="text-muted-foreground ml-1">
                        ({ch.verses.length} віршів)
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>

            {/* Intros */}
            {intros.length > 0 && (
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
                      {intro.title_ua}
                    </Label>
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
