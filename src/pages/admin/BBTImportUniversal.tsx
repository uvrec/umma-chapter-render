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
import sbCanto2Data from "@/data/sb-canto2-combined.json";

// Book configurations
interface BookConfig {
  id: string; // Unique identifier for UI selection (e.g., "sb-2", "sb-4")
  slug: string; // Database slug (e.g., "sb" for all Bhagavatam)
  title_uk: string;
  title_en: string;
  hasVerses: boolean; // true for verse-based books, false for continuous text books
  hasChapters: boolean; // false for NOI, ISO, BS - verses directly at book level
  data: ParsedBookData | ParsedBookDataNoChapters;
  cantoNumber?: number; // For multi-canto books like Bhagavatam
}

interface ParsedChapterWithVerses {
  chapter_number: number;
  chapter_title_uk: string;
  chapter_title_en?: string;
  // Legacy field for backwards compatibility
  title_uk?: string;
  verses: {
    verse_number: string;
    // UK fields
    sanskrit_uk?: string;
    transliteration_uk?: string;
    synonyms_uk?: string;
    translation_uk?: string;
    commentary_uk?: string;
    // EN fields (from vedabase)
    sanskrit_en?: string;
    transliteration_en?: string;
    synonyms_en?: string;
    translation_en?: string;
    commentary_en?: string;
    source_url?: string;
  }[];
}

interface ParsedChapterWithContent {
  chapter_number: number;
  chapter_title_uk: string;
  // Legacy field for backwards compatibility
  title_uk?: string;
  content_uk: string;
}

interface ParsedIntro {
  slug: string;
  title_uk: string;
  content_uk: string;
  display_order: number;
}

interface ParsedVerse {
  verse_number: string;
  sanskrit_uk?: string;
  transliteration_uk?: string;
  synonyms_uk?: string;
  translation_uk?: string;
  commentary_uk?: string;
  sanskrit_en?: string;
  transliteration_en?: string;
  synonyms_en?: string;
  translation_en?: string;
  commentary_en?: string;
  source_url?: string;
}

// Books with chapters (BG, SB, etc.)
interface ParsedBookData {
  chapters: (ParsedChapterWithVerses | ParsedChapterWithContent)[];
  intros: ParsedIntro[];
}

// Books without chapters - verses directly at book level (NOI, ISO, BS)
interface ParsedBookDataNoChapters {
  hasChapters: false;
  verses: ParsedVerse[];
  intros: ParsedIntro[];
}

const BOOK_CONFIGS: BookConfig[] = [
  {
    id: "bg",
    slug: "bg",
    title_uk: "Бгаґавад-ґіта як вона є",
    title_en: "Bhagavad-gita As It Is",
    hasVerses: true,
    hasChapters: true,
    data: bbtGitaData as ParsedBookData,
  },
  {
    id: "poy",
    slug: "poy",
    title_uk: "Досконалість йоґи",
    title_en: "The Perfection of Yoga",
    hasVerses: false,
    hasChapters: true,
    data: poyData as ParsedBookData,
  },
  {
    id: "ea",
    slug: "ea",
    title_uk: "Легка подорож до інших планет",
    title_en: "Easy Journey to Other Planets",
    hasVerses: false,
    hasChapters: true,
    data: eaData as ParsedBookData,
  },
  {
    id: "noi",
    slug: "noi",
    title_uk: "Нектар настанов",
    title_en: "The Nectar of Instruction",
    hasVerses: true,
    hasChapters: false, // Verses directly at book level
    data: noiData as ParsedBookDataNoChapters,
  },
  {
    id: "iso",
    slug: "iso",
    title_uk: "Шрі Ішопанішада",
    title_en: "Sri Isopanisad",
    hasVerses: true,
    hasChapters: false, // Mantras directly at book level
    data: isoData as ParsedBookDataNoChapters,
  },
  {
    id: "pqn",
    slug: "pqn",
    title_uk: "Досконалі питання, досконалі відповіді",
    title_en: "Perfect Questions, Perfect Answers",
    hasVerses: false,
    hasChapters: true,
    data: pqnData as ParsedBookData,
  },
  {
    id: "sb-4",
    slug: "sb",
    title_uk: "Шрімад-Бгаґаватам, Пісня 4, Частина 2",
    title_en: "Srimad Bhagavatam, Canto 4, Part 2",
    hasVerses: true,
    hasChapters: true,
    data: sb4Data as ParsedBookData,
    cantoNumber: 4,
  },
  {
    id: "sb-2",
    slug: "sb",
    title_uk: "Шрімад-Бгаґаватам, Пісня 2",
    title_en: "Srimad Bhagavatam, Canto 2",
    hasVerses: true,
    hasChapters: true,
    data: sbCanto2Data as ParsedBookData,
    cantoNumber: 2,
  },
];

function hasVerses(chapter: ParsedChapterWithVerses | ParsedChapterWithContent): chapter is ParsedChapterWithVerses {
  return 'verses' in chapter && Array.isArray(chapter.verses);
}

function hasContent(chapter: ParsedChapterWithVerses | ParsedChapterWithContent): chapter is ParsedChapterWithContent {
  return 'content_uk' in chapter && typeof chapter.content_uk === 'string';
}

export default function BBTImportUniversal() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<string>(BOOK_CONFIGS[0].id);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const bookConfig = useMemo(() =>
    BOOK_CONFIGS.find(b => b.id === selectedBook) || BOOK_CONFIGS[0],
    [selectedBook]
  );

  // Helper to check if data has chapters
  const isBookWithChapters = (data: ParsedBookData | ParsedBookDataNoChapters): data is ParsedBookData => {
    return 'chapters' in data && Array.isArray(data.chapters);
  };

  const chapters = isBookWithChapters(bookConfig.data) ? bookConfig.data.chapters : [];
  const directVerses = !isBookWithChapters(bookConfig.data) ? bookConfig.data.verses : [];
  const intros = bookConfig.data.intros || [];

  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => {
    const allIds = new Set<string>();
    if (bookConfig.hasChapters) {
      chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
    } else {
      // For books without chapters, select all verses by default
      directVerses.forEach((v) => allIds.add(`verse-${v.verse_number}`));
    }
    intros.forEach((i) => allIds.add(`intro-${i.slug}`));
    return allIds;
  });

  // Reset selection when book changes
  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId);
    const config = BOOK_CONFIGS.find(b => b.id === bookId);
    if (config) {
      const allIds = new Set<string>();
      if (config.hasChapters && isBookWithChapters(config.data)) {
        config.data.chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
      } else if (!config.hasChapters && !isBookWithChapters(config.data)) {
        config.data.verses.forEach((v) => allIds.add(`verse-${v.verse_number}`));
      }
      (config.data.intros || []).forEach((i) => allIds.add(`intro-${i.slug}`));
      setSelectedItems(allIds);
    }
  };

  const totalVerses = bookConfig.hasVerses
    ? (bookConfig.hasChapters
        ? chapters.reduce((sum, c) => sum + (hasVerses(c) ? c.verses.length : 0), 0)
        : directVerses.length)
    : 0;

  const handleSaveToSupabase = async () => {
    setSaving(true);
    setSaveProgress(0);

    const selectedChapters = chapters.filter((c) =>
      selectedItems.has(`chapter-${c.chapter_number}`)
    );
    const selectedDirectVerses = directVerses.filter((v) =>
      selectedItems.has(`verse-${v.verse_number}`)
    );
    const selectedIntros = intros.filter((i) =>
      selectedItems.has(`intro-${i.slug}`)
    );

    const totalItems = bookConfig.hasChapters
      ? selectedChapters.length + selectedIntros.length
      : selectedDirectVerses.length + selectedIntros.length;
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
            title_uk: bookConfig.title_uk,
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
              title_uk: `Пісня ${bookConfig.cantoNumber}`,
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

        // Get chapter title from various possible field names (chapter_title_uk is primary, title_uk is legacy)
        const chapterTitleUk = chapter.chapter_title_uk || chapter.title_uk || '';
        const chapterTitleEn = (hasVerses(chapter) ? chapter.chapter_title_en : undefined) || '';

        if (existingChapter) {
          chapterId = existingChapter.id;

          // Update chapter
          const updateData = {
            title_uk: chapterTitleUk.replace(/\n/g, ' '),
            ...(chapterTitleEn && { title_en: chapterTitleEn.replace(/\n/g, ' ') }),
            ...(cantoId && { canto_id: cantoId }),
            ...(!bookConfig.hasVerses && hasContent(chapter) && {
              content_uk: chapter.content_uk,
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
            title_uk: chapterTitleUk.replace(/\n/g, ' '),
            title_en: chapterTitleEn ? chapterTitleEn.replace(/\n/g, ' ') : chapterTitleUk.replace(/\n/g, ' '),
            ...(cantoId && { canto_id: cantoId }),
            ...(!bookConfig.hasVerses && hasContent(chapter) && {
              content_uk: chapter.content_uk,
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
                  // UK fields
                  sanskrit_uk: verse.sanskrit_uk,
                  transliteration_uk: verse.transliteration_uk,
                  synonyms_uk: verse.synonyms_uk,
                  translation_uk: verse.translation_uk,
                  commentary_uk: verse.commentary_uk,
                  // EN fields
                  sanskrit_en: verse.sanskrit_en,
                  transliteration_en: verse.transliteration_en,
                  synonyms_en: verse.synonyms_en,
                  translation_en: verse.translation_en,
                  commentary_en: verse.commentary_en,
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
                // UK fields
                sanskrit_uk: verse.sanskrit_uk,
                transliteration_uk: verse.transliteration_uk,
                synonyms_uk: verse.synonyms_uk,
                translation_uk: verse.translation_uk,
                commentary_uk: verse.commentary_uk,
                // EN fields
                sanskrit_en: verse.sanskrit_en,
                transliteration_en: verse.transliteration_en,
                synonyms_en: verse.synonyms_en,
                translation_en: verse.translation_en,
                commentary_en: verse.commentary_en,
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

      // Save direct verses for books without chapters (NOI, ISO, BS)
      if (!bookConfig.hasChapters && selectedDirectVerses.length > 0) {
        // For books without chapters, create a single "main" chapter to hold verses
        // Chapter number = 1, title = book title
        let mainChapterId: string;

        const { data: existingMainChapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("book_id", bookId)
          .eq("chapter_number", 1)
          .single();

        if (existingMainChapter) {
          mainChapterId = existingMainChapter.id;
        } else {
          const { data: newMainChapter, error: chapterError } = await supabase
            .from("chapters")
            .insert({
              book_id: bookId,
              chapter_number: 1,
              title_uk: bookConfig.title_uk,
              title_en: bookConfig.title_en,
            })
            .select("id")
            .single();

          if (chapterError || !newMainChapter) {
            console.error(`Error creating main chapter for ${bookConfig.slug}:`, chapterError);
            throw new Error(`Не вдалося створити главу для книги ${bookConfig.slug}`);
          }
          mainChapterId = newMainChapter.id;
          savedChapters++;
        }

        // Save verses directly linked to main chapter
        for (const verse of selectedDirectVerses) {
          const { data: existingVerse } = await supabase
            .from("verses")
            .select("id")
            .eq("chapter_id", mainChapterId)
            .eq("verse_number", verse.verse_number)
            .single();

          if (existingVerse) {
            const { error } = await supabase
              .from("verses")
              .update({
                sanskrit_uk: verse.sanskrit_uk,
                transliteration_uk: verse.transliteration_uk,
                synonyms_uk: verse.synonyms_uk,
                translation_uk: verse.translation_uk,
                commentary_uk: verse.commentary_uk,
                sanskrit_en: verse.sanskrit_en,
                transliteration_en: verse.transliteration_en,
                synonyms_en: verse.synonyms_en,
                translation_en: verse.translation_en,
                commentary_en: verse.commentary_en,
              })
              .eq("id", existingVerse.id);

            if (error) {
              console.error(`Error updating verse ${verse.verse_number}:`, error);
            } else {
              savedVerses++;
            }
          } else {
            const { error } = await supabase.from("verses").insert({
              chapter_id: mainChapterId,
              verse_number: verse.verse_number,
              sanskrit_uk: verse.sanskrit_uk,
              transliteration_uk: verse.transliteration_uk,
              synonyms_uk: verse.synonyms_uk,
              translation_uk: verse.translation_uk,
              commentary_uk: verse.commentary_uk,
              sanskrit_en: verse.sanskrit_en,
              transliteration_en: verse.transliteration_en,
              synonyms_en: verse.synonyms_en,
              translation_en: verse.translation_en,
              commentary_en: verse.commentary_en,
            });

            if (error) {
              console.error(`Error inserting verse ${verse.verse_number}:`, error);
            } else {
              savedVerses++;
            }
          }

          processed++;
          setSaveProgress(Math.round((processed / totalItems) * 100));
        }
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
          const { error } = await supabase.from("intro_chapters").insert({
            book_id: bookId,
            slug: intro.slug,
            title_uk: intro.title_uk,
            title_en: intro.title_uk,
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
    const totalSelectableItems = bookConfig.hasChapters
      ? chapters.length + intros.length
      : directVerses.length + intros.length;

    if (selectedItems.size === totalSelectableItems) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set<string>();
      if (bookConfig.hasChapters) {
        chapters.forEach((c) => allIds.add(`chapter-${c.chapter_number}`));
      } else {
        directVerses.forEach((v) => allIds.add(`verse-${v.verse_number}`));
      }
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
                <SelectItem key={book.id} value={book.id}>
                  {book.title_uk}
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
            Дані готові до імпорту: {bookConfig.title_uk}
          </CardTitle>
          <CardDescription className="text-green-700">
            {bookConfig.hasVerses
              ? "Книга з віршами (як Бгаґавад-ґіта)"
              : "Книга з суцільним текстом (глави без віршів)"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid ${bookConfig.hasVerses ? (bookConfig.hasChapters ? 'grid-cols-3' : 'grid-cols-2') : 'grid-cols-2'} gap-4 text-center`}>
            {bookConfig.hasChapters && (
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-green-600">{chapters.length}</div>
                <div className="text-sm text-muted-foreground">Глав</div>
              </div>
            )}
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
              {selectedItems.size === (bookConfig.hasChapters ? chapters.length : directVerses.length) + intros.length
                ? "Зняти всі"
                : "Вибрати всі"}
            </Button>
            <span className="text-sm text-muted-foreground">
              Вибрано: {selectedItems.size} з {(bookConfig.hasChapters ? chapters.length : directVerses.length) + intros.length}
            </span>
          </div>

          <ScrollArea className="h-[400px] border rounded-md p-4">
            {/* Chapters (for books with chapters) */}
            {bookConfig.hasChapters && (
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
                      Глава {ch.chapter_number}: {(ch.chapter_title_uk || ch.title_uk || '').replace(/\n/g, ' ')}
                      {bookConfig.hasVerses && hasVerses(ch) && (
                        <span className="text-muted-foreground ml-1">
                          ({ch.verses.length} віршів)
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {/* Direct Verses (for books without chapters like NOI, ISO) */}
            {!bookConfig.hasChapters && directVerses.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="font-semibold">Вірші / Мантри</h4>
                {directVerses.map((verse) => (
                  <div key={verse.verse_number} className="flex items-center gap-2">
                    <Checkbox
                      id={`verse-${verse.verse_number}`}
                      checked={selectedItems.has(`verse-${verse.verse_number}`)}
                      onCheckedChange={() => toggleItem(`verse-${verse.verse_number}`)}
                    />
                    <Label
                      htmlFor={`verse-${verse.verse_number}`}
                      className="flex-1 cursor-pointer"
                    >
                      {bookConfig.slug === 'iso' ? 'Мантра' : 'Вірш'} {verse.verse_number}
                      {verse.translation_uk && (
                        <span className="text-muted-foreground ml-1 text-xs truncate max-w-md inline-block">
                          - {verse.translation_uk.substring(0, 50)}...
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            )}

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
                      {intro.title_uk}
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
