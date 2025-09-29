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

export default function AddEditVerse() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: chapters } = useQuery({
    queryKey: ["chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*, books(title_ua)")
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
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
              <Label htmlFor="chapterId">Глава *</Label>
              <Select value={chapterId} onValueChange={setChapterId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть главу" />
                </SelectTrigger>
                <SelectContent>
                  {chapters?.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.books?.title_ua} - Глава {chapter.chapter_number}: {chapter.title_ua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  <Textarea
                    id="commentaryUa"
                    value={commentaryUa}
                    onChange={(e) => setCommentaryUa(e.target.value)}
                    placeholder="Коментар українською..."
                    rows={6}
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
                  <Textarea
                    id="commentaryEn"
                    value={commentaryEn}
                    onChange={(e) => setCommentaryEn(e.target.value)}
                    placeholder="Commentary in English..."
                    rows={6}
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
