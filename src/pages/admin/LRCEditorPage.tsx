/**
 * LRCEditorPage - Окрема адмін сторінка для редагування LRC timestamps
 *
 * Функції:
 * - Вибір книги → глави → вірша
 * - Редагування LRC для різних секцій (санскрит, переклад, коментар)
 * - Збереження в таблицю verse_lyrics
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Music, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";
import { LRCEditor } from "@/components/admin/LRCEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Section = 'sanskrit' | 'transliteration' | 'translation' | 'commentary';

export default function LRCEditorPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selection state
  const [selectedBookId, setSelectedBookId] = useState(searchParams.get("bookId") || "");
  const [selectedCantoId, setSelectedCantoId] = useState(searchParams.get("cantoId") || "");
  const [selectedChapterId, setSelectedChapterId] = useState(searchParams.get("chapterId") || "");
  const [selectedVerseId, setSelectedVerseId] = useState(searchParams.get("verseId") || "");
  const [activeSection, setActiveSection] = useState<Section>("sanskrit");

  // Auth check
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  // Fetch books
  const { data: books } = useQuery({
    queryKey: ["lrc-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title_uk, has_cantos")
        .order("title_uk");
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const selectedBook = books?.find((b) => b.id === selectedBookId);

  // Fetch cantos if book has them
  const { data: cantos } = useQuery({
    queryKey: ["lrc-cantos", selectedBookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cantos")
        .select("id, title_uk, canto_number")
        .eq("book_id", selectedBookId)
        .order("canto_number");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBookId && !!selectedBook?.has_cantos,
  });

  // Fetch chapters
  const { data: chapters } = useQuery({
    queryKey: ["lrc-chapters", selectedBookId, selectedCantoId],
    queryFn: async () => {
      let query = supabase
        .from("chapters")
        .select("id, title_uk, chapter_number")
        .order("chapter_number");

      if (selectedBook?.has_cantos && selectedCantoId) {
        query = query.eq("canto_id", selectedCantoId);
      } else if (!selectedBook?.has_cantos) {
        query = query.eq("book_id", selectedBookId);
      } else {
        return [];
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBookId && (!!selectedCantoId || !selectedBook?.has_cantos),
  });

  // Fetch verses with audio
  const { data: verses } = useQuery({
    queryKey: ["lrc-verses", selectedChapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verses")
        .select("id, verse_number, sanskrit_uk, transliteration_uk, translation_uk, commentary_uk, full_verse_audio_url")
        .eq("chapter_id", selectedChapterId)
        .order("verse_number");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedChapterId,
  });

  // Fetch current verse details
  const { data: currentVerse } = useQuery({
    queryKey: ["lrc-verse", selectedVerseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verses")
        .select("*")
        .eq("id", selectedVerseId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedVerseId,
  });

  // Fetch existing LRC for this verse
  const { data: existingLRC, refetch: refetchLRC } = useQuery({
    queryKey: ["lrc-lyrics", selectedVerseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verse_lyrics")
        .select("*")
        .eq("verse_id", selectedVerseId);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedVerseId,
  });

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBookId) params.set("bookId", selectedBookId);
    if (selectedCantoId) params.set("cantoId", selectedCantoId);
    if (selectedChapterId) params.set("chapterId", selectedChapterId);
    if (selectedVerseId) params.set("verseId", selectedVerseId);
    setSearchParams(params);
  }, [selectedBookId, selectedCantoId, selectedChapterId, selectedVerseId, setSearchParams]);

  // Navigate to next/previous verse
  const navigateVerse = (direction: "prev" | "next") => {
    if (!verses || !selectedVerseId) return;
    const currentIndex = verses.findIndex((v) => v.id === selectedVerseId);
    if (currentIndex === -1) return;

    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < verses.length) {
      setSelectedVerseId(verses[newIndex].id);
    }
  };

  // Get text for current section
  const getSectionText = (section: Section): string => {
    if (!currentVerse) return "";
    switch (section) {
      case "sanskrit":
        return currentVerse.sanskrit_uk || currentVerse.sanskrit_en || "";
      case "transliteration":
        return currentVerse.transliteration_uk || currentVerse.transliteration_en || "";
      case "translation":
        return currentVerse.translation_uk || currentVerse.translation_en || "";
      case "commentary":
        return currentVerse.commentary_uk || currentVerse.commentary_en || "";
      default:
        return "";
    }
  };

  // Get existing LRC for current section
  const getExistingLRCForSection = (section: Section): string | undefined => {
    if (!existingLRC) return undefined;
    const record = existingLRC.find((l) =>
      l.audio_type === "full" &&
      (l.language === "uk" || l.language === "sa")
    );
    return record?.lrc_content || undefined;
  };

  // Save LRC handler
  const handleSaveLRC = async (lrcContent: string) => {
    if (!selectedVerseId) return;

    try {
      const { error } = await supabase.from("verse_lyrics").upsert(
        {
          verse_id: selectedVerseId,
          audio_type: "full",
          language: activeSection === "sanskrit" ? "sa" : "uk",
          lrc_content: lrcContent,
          sync_type: "line",
        },
        {
          onConflict: "verse_id,audio_type,language",
        }
      );

      if (error) throw error;

      toast.success(`LRC для "${activeSection}" збережено`);
      refetchLRC();
    } catch (error) {
      toast.error(`Помилка: ${(error as any).message}`);
    }
  };

  // Stats
  const versesWithAudio = verses?.filter((v) => v.full_verse_audio_url) || [];
  const currentVerseIndex = verses?.findIndex((v) => v.id === selectedVerseId) ?? -1;

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад до панелі
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <Music className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">LRC Editor</h1>
          <p className="text-muted-foreground">Створення timestamps для синхронізації аудіо з текстом</p>
        </div>
      </div>

      {/* Selection Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Вибір вірша</CardTitle>
          <CardDescription>Оберіть вірш для редагування LRC timestamps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Book selector */}
            <div>
              <Label>Книга</Label>
              <Select
                value={selectedBookId}
                onValueChange={(value) => {
                  setSelectedBookId(value);
                  setSelectedCantoId("");
                  setSelectedChapterId("");
                  setSelectedVerseId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть книгу" />
                </SelectTrigger>
                <SelectContent>
                  {books?.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title_uk}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Canto selector (if applicable) */}
            {selectedBook?.has_cantos && (
              <div>
                <Label>Пісня</Label>
                <Select
                  value={selectedCantoId}
                  onValueChange={(value) => {
                    setSelectedCantoId(value);
                    setSelectedChapterId("");
                    setSelectedVerseId("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть пісню" />
                  </SelectTrigger>
                  <SelectContent>
                    {cantos?.map((canto) => (
                      <SelectItem key={canto.id} value={canto.id}>
                        Пісня {canto.canto_number}: {canto.title_uk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Chapter selector */}
            <div>
              <Label>Глава</Label>
              <Select
                value={selectedChapterId}
                onValueChange={(value) => {
                  setSelectedChapterId(value);
                  setSelectedVerseId("");
                }}
                disabled={!chapters?.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть главу" />
                </SelectTrigger>
                <SelectContent>
                  {chapters?.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      Глава {chapter.chapter_number}: {chapter.title_uk}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Verse selector */}
            <div>
              <Label>
                Вірш{" "}
                {versesWithAudio.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({versesWithAudio.length} з аудіо)
                  </span>
                )}
              </Label>
              <Select
                value={selectedVerseId}
                onValueChange={setSelectedVerseId}
                disabled={!verses?.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть вірш" />
                </SelectTrigger>
                <SelectContent>
                  {verses?.map((verse) => (
                    <SelectItem key={verse.id} value={verse.id}>
                      <span className="flex items-center gap-2">
                        {verse.verse_number}
                        {verse.full_verse_audio_url && (
                          <Music className="h-3 w-3 text-green-500" />
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Navigation buttons */}
          {selectedVerseId && verses && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateVerse("prev")}
                disabled={currentVerseIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Попередній
              </Button>
              <span className="text-sm text-muted-foreground">
                Вірш {currentVerseIndex + 1} з {verses.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateVerse("next")}
                disabled={currentVerseIndex >= verses.length - 1}
              >
                Наступний
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LRC Editor */}
      {currentVerse && currentVerse.full_verse_audio_url ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Вірш {currentVerse.verse_number}
            </CardTitle>
            <CardDescription>
              Використовуйте Space для встановлення мітки на поточному рядку
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as Section)}>
              <TabsList className="mb-4">
                <TabsTrigger value="sanskrit" disabled={!getSectionText("sanskrit")}>
                  Санскрит
                </TabsTrigger>
                <TabsTrigger value="transliteration" disabled={!getSectionText("transliteration")}>
                  Транслітерація
                </TabsTrigger>
                <TabsTrigger value="translation" disabled={!getSectionText("translation")}>
                  Переклад
                </TabsTrigger>
                <TabsTrigger value="commentary" disabled={!getSectionText("commentary")}>
                  Коментар
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeSection}>
                <LRCEditor
                  verseId={selectedVerseId}
                  audioUrl={currentVerse.full_verse_audio_url}
                  initialText={getSectionText(activeSection)}
                  initialLRC={getExistingLRCForSection(activeSection)}
                  section={activeSection}
                  onSave={handleSaveLRC}
                  onCancel={() => setSelectedVerseId("")}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : selectedVerseId && currentVerse && !currentVerse.full_verse_audio_url ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Немає аудіо для цього вірша</h3>
            <p className="text-muted-foreground mb-4">
              Спочатку додайте аудіо файл до вірша, щоб створювати LRC timestamps
            </p>
            <Button onClick={() => navigate(`/admin/verses/${selectedVerseId}/edit`)}>
              Редагувати вірш
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Оберіть вірш для редагування</h3>
            <p className="text-muted-foreground">
              Використовуйте селектори вище, щоб обрати вірш з аудіо
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
