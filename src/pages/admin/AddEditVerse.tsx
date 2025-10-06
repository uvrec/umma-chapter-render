import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";

export default function AddEditVerse() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedCantoId, setSelectedCantoId] = useState("");
  const [chapterId, setChapterId] = useState(searchParams.get("chapterId") || "");
  const [verseNumber, setVerseNumber] = useState("");
  const [sanskrit, setSanskrit] = useState("");
  const [transliteration, setTransliteration] = useState("");
  const [synonymsUa, setSynonymsUa] = useState("");
  const [synonymsEn, setSynonymsEn] = useState("");
  const [translationUa, setTranslationUa] = useState("");
  const [translationEn, setTranslationEn] = useState("");
  const [commentaryUa, setCommentaryUa] = useState("");
  const [commentaryEn, setCommentaryEn] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const { data: books } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("title_ua");
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const selectedBook = books?.find(b => b.id === selectedBookId);

  const { data: cantos } = useQuery({
    queryKey: ["admin-cantos", selectedBookId],
    queryFn: async () => {
      if (!selectedBookId) return [];
      const { data, error } = await supabase
        .from("cantos")
        .select("*")
        .eq("book_id", selectedBookId)
        .order("canto_number");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBookId && !!selectedBook?.has_cantos,
  });

  const { data: chapters } = useQuery({
    queryKey: ["admin-chapters", selectedBookId, selectedCantoId],
    queryFn: async () => {
      if (!selectedBookId) return [];
      
      let query = supabase.from("chapters").select("*, books(title_ua), cantos(title_ua, canto_number)");
      
      if (selectedBook?.has_cantos && selectedCantoId) {
        query = query.eq("canto_id", selectedCantoId);
      } else if (!selectedBook?.has_cantos) {
        query = query.eq("book_id", selectedBookId);
      } else {
        return [];
      }
      
      const { data, error } = await query.order("chapter_number");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBookId && (!!selectedCantoId || !selectedBook?.has_cantos),
  });

  const { data: verse } = useQuery({
    queryKey: ["verse", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("verses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user && isAdmin,
  });

  // Load chapter's book and canto when editing
  useEffect(() => {
    const loadChapterContext = async () => {
      if (chapterId && chapters) {
        const chapter = chapters.find(c => c.id === chapterId);
        if (chapter) {
          if (chapter.book_id) {
            setSelectedBookId(chapter.book_id);
          } else if (chapter.canto_id) {
            const { data: canto } = await supabase
              .from("cantos")
              .select("book_id, id")
              .eq("id", chapter.canto_id)
              .single();
            if (canto) {
              setSelectedBookId(canto.book_id);
              setSelectedCantoId(canto.id);
            }
          }
        }
      }
    };
    loadChapterContext();
  }, [chapterId, chapters]);

  useEffect(() => {
    if (verse) {
      setChapterId(verse.chapter_id);
      setVerseNumber(verse.verse_number);
      setSanskrit(verse.sanskrit || "");
      setTransliteration(verse.transliteration || "");
      setSynonymsUa(verse.synonyms_ua || "");
      setSynonymsEn(verse.synonyms_en || "");
      setTranslationUa(verse.translation_ua || "");
      setTranslationEn(verse.translation_en || "");
      setCommentaryUa(verse.commentary_ua || "");
      setCommentaryEn(verse.commentary_en || "");
      setAudioUrl(verse.audio_url || "");
    }
  }, [verse]);

  const mutation = useMutation({
    mutationFn: async () => {
      const verseData = {
        chapter_id: chapterId,
        verse_number: verseNumber,
        sanskrit: sanskrit || null,
        transliteration: transliteration || null,
        synonyms_ua: synonymsUa || null,
        synonyms_en: synonymsEn || null,
        translation_ua: translationUa || null,
        translation_en: translationEn || null,
        commentary_ua: commentaryUa || null,
        commentary_en: commentaryEn || null,
        audio_url: audioUrl || null,
      };

      if (id) {
        const { error } = await supabase
          .from("verses")
          .update(verseData)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("verses").insert(verseData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      toast({
        title: id ? "Вірш оновлено" : "Вірш додано",
        description: "Зміни успішно збережено",
      });
      navigate("/admin/verses");
    },
    onError: (error) => {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterId || !verseNumber) {
      toast({
        title: "Помилка",
        description: "Заповніть обов'язкові поля: глава та номер вірша",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate();
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/verses")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад до віршів
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Редагувати вірш" : "Додати вірш"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="bookId">Книга *</Label>
              <Select value={selectedBookId} onValueChange={(value) => {
                setSelectedBookId(value);
                setSelectedCantoId("");
                setChapterId("");
              }} required>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть книгу" />
                </SelectTrigger>
                <SelectContent>
                  {books?.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title_ua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBook?.has_cantos && (
              <div>
                <Label htmlFor="cantoId">Пісня *</Label>
                <Select value={selectedCantoId} onValueChange={(value) => {
                  setSelectedCantoId(value);
                  setChapterId("");
                }} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть пісню" />
                  </SelectTrigger>
                  <SelectContent>
                    {cantos?.map((canto) => (
                      <SelectItem key={canto.id} value={canto.id}>
                        Пісня {canto.canto_number}: {canto.title_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {((selectedBook?.has_cantos && selectedCantoId) || (!selectedBook?.has_cantos && selectedBookId)) && (
              <div>
                <Label htmlFor="chapterId">Розділ *</Label>
                <Select value={chapterId} onValueChange={setChapterId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть розділ" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        Розділ {chapter.chapter_number}: {chapter.title_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="verseNumber">Номер вірша *</Label>
              <Input
                id="verseNumber"
                value={verseNumber}
                onChange={(e) => setVerseNumber(e.target.value)}
                placeholder="ШБ 1.1.1 або 1.1.1"
                required
              />
            </div>

            <div>
              <Label htmlFor="sanskrit">Санскрит</Label>
              <Textarea
                id="sanskrit"
                value={sanskrit}
                onChange={(e) => setSanskrit(e.target.value)}
                placeholder="ॐ नमो भगवते वासुदेवाय..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="transliteration">Транслітерація</Label>
              <Textarea
                id="transliteration"
                value={transliteration}
                onChange={(e) => setTransliteration(e.target.value)}
                placeholder="ом̇ намо бгаґавате ва̄судева̄йа..."
                rows={3}
              />
            </div>

            <Tabs defaultValue="ua" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ua">Українська</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              <TabsContent value="ua" className="space-y-4">
                <div>
                  <Label htmlFor="synonymsUa">Синоніми</Label>
                  <Textarea
                    id="synonymsUa"
                    value={synonymsUa}
                    onChange={(e) => setSynonymsUa(e.target.value)}
                    placeholder="ом̇ – мій Господи; намах̣ – у шанобі схиляюсь..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="translationUa">Переклад</Label>
                  <Textarea
                    id="translationUa"
                    value={translationUa}
                    onChange={(e) => setTranslationUa(e.target.value)}
                    placeholder="Український переклад вірша..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="commentaryUa">Коментар</Label>
                  <InlineTiptapEditor
                    content={commentaryUa}
                    onChange={setCommentaryUa}
                    label="Коментар українською..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label htmlFor="synonymsEn">Synonyms</Label>
                  <Textarea
                    id="synonymsEn"
                    value={synonymsEn}
                    onChange={(e) => setSynonymsEn(e.target.value)}
                    placeholder="om – O my Lord; namah – offering obeisances..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="translationEn">Translation</Label>
                  <Textarea
                    id="translationEn"
                    value={translationEn}
                    onChange={(e) => setTranslationEn(e.target.value)}
                    placeholder="English translation of the verse..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="commentaryEn">Commentary</Label>
                  <InlineTiptapEditor
                    content={commentaryEn}
                    onChange={setCommentaryEn}
                    label="Commentary in English..."
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label htmlFor="audioUrl">Audio URL</Label>
              <Input
                id="audioUrl"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://audio.example.com/verse.mp3"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Збереження..." : "Зберегти"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/verses")}
              >
                Скасувати
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
