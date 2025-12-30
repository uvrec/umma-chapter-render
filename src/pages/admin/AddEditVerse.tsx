import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { AudioUploader } from "@/components/admin/shared/AudioUploader";
import { Breadcrumbs, BreadcrumbItem } from "@/components/admin/Breadcrumbs";

export default function AddEditVerse() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [selectedBookId, setSelectedBookId] = useState(searchParams.get("bookId") || "");
  const [selectedCantoId, setSelectedCantoId] = useState(searchParams.get("cantoId") || "");
  const [chapterId, setChapterId] = useState(searchParams.get("chapterId") || "");
  const [verseNumber, setVerseNumber] = useState("");
  const [sanskritUa, setSanskritUa] = useState("");
  const [sanskritEn, setSanskritEn] = useState("");
  const [transliterationUa, setTransliterationUa] = useState("");
  const [transliterationEn, setTransliterationEn] = useState("");
  const [synonymsUa, setSynonymsUa] = useState("");
  const [synonymsEn, setSynonymsEn] = useState("");
  const [translationUa, setTranslationUa] = useState("");
  const [translationEn, setTranslationEn] = useState("");
  const [commentaryUa, setCommentaryUa] = useState("");
  const [commentaryEn, setCommentaryEn] = useState("");

  // Audio URLs - simplified structure (4 fields)
  const [audioUrl, setAudioUrl] = useState(""); // Legacy field
  const [fullVerseAudioUrl, setFullVerseAudioUrl] = useState(""); // PRIMARY: complete verse (95% use case)
  const [recitationAudioUrl, setRecitationAudioUrl] = useState(""); // Sanskrit + Transliteration
  const [explanationUaAudioUrl, setExplanationUaAudioUrl] = useState(""); // Synonyms + Translation + Commentary UA
  const [explanationEnAudioUrl, setExplanationEnAudioUrl] = useState(""); // EN version

  // UI state for collapsible advanced audio section
  const [showAdvancedAudio, setShowAdvancedAudio] = useState(false);

  const { data: books } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("title_ua");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const selectedBook = books?.find((b) => b.id === selectedBookId);

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
      const { data, error } = await supabase.from("verses").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user && isAdmin,
  });

  // Підвантажуємо контекст глави (книгу/пісню) у режимі редагування
  useEffect(() => {
    const loadChapterContext = async () => {
      if (chapterId && chapters) {
        const chapter = chapters.find((c) => c.id === chapterId);
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
      setSanskritUa(verse.sanskrit_ua || (verse as any).sanskrit || "");
      setSanskritEn(verse.sanskrit_en || (verse as any).sanskrit || "");
      setTransliterationUa(verse.transliteration_ua || "");
      setTransliterationEn(verse.transliteration_en || "");
      setSynonymsUa(verse.synonyms_ua || "");
      setSynonymsEn(verse.synonyms_en || "");
      setTranslationUa(verse.translation_ua || "");
      setTranslationEn(verse.translation_en || "");
      setCommentaryUa(verse.commentary_ua || "");
      setCommentaryEn(verse.commentary_en || "");

      // Legacy audio field
      setAudioUrl(verse.audio_url || "");

      // Simplified dual audio fields (4 fields)
      setFullVerseAudioUrl(verse.full_verse_audio_url || "");
      setRecitationAudioUrl(verse.recitation_audio_url || "");
      setExplanationUaAudioUrl(verse.explanation_ua_audio_url || "");
      setExplanationEnAudioUrl(verse.explanation_en_audio_url || "");

      // Auto-expand advanced section if any secondary audio exists
      if (verse.recitation_audio_url || verse.explanation_ua_audio_url || verse.explanation_en_audio_url) {
        setShowAdvancedAudio(true);
      }
    }
  }, [verse]);

  const mutation = useMutation({
    mutationFn: async () => {
      const verseData = {
        chapter_id: chapterId,
        verse_number: verseNumber,
        sanskrit_ua: sanskritUa || null,
        sanskrit_en: sanskritEn || null,
        transliteration_ua: transliterationUa || null,
        transliteration_en: transliterationEn || null,
        synonyms_ua: synonymsUa || null,
        synonyms_en: synonymsEn || null,
        translation_ua: translationUa || null,
        translation_en: translationEn || null,
        commentary_ua: commentaryUa || null,
        commentary_en: commentaryEn || null,

        // Audio URLs - simplified structure
        audio_url: audioUrl || null, // Legacy field (kept for compatibility)
        full_verse_audio_url: fullVerseAudioUrl || null, // PRIMARY audio
        recitation_audio_url: recitationAudioUrl || null, // Sanskrit + Transliteration
        explanation_ua_audio_url: explanationUaAudioUrl || null, // UA explanation
        explanation_en_audio_url: explanationEnAudioUrl || null, // EN explanation

        is_published: true,
      };

      if (id) {
        const { error } = await supabase.from("verses").update(verseData).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("verses").insert(verseData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Очищуємо кеш для фронтенду і адмінки
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      toast({
        title: id ? "Вірш оновлено" : "Вірш додано",
        description: "Зміни успішно збережено",
      });

      // Navigate back with context preserved
      const params = new URLSearchParams();
      if (selectedBookId) params.set("bookId", selectedBookId);
      if (selectedCantoId) params.set("cantoId", selectedCantoId);
      if (chapterId) params.set("chapterId", chapterId);
      navigate(`/admin/scripture?${params.toString()}`);
    },
    onError: (error) => {
      toast({
        title: "Помилка",
        description: (error as any).message,
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

  // Build breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Вірші", href: "/admin/scripture" }];

  const selectedBookData = books?.find((b) => b.id === selectedBookId);
  if (selectedBookData) {
    breadcrumbs.push({ label: selectedBookData.title_ua });
  }

  const selectedCantoData = cantos?.find((c) => c.id === selectedCantoId);
  if (selectedCantoData) {
    breadcrumbs.push({ label: `Пісня ${selectedCantoData.canto_number}` });
  }

  const selectedChapterData = chapters?.find((ch) => ch.id === chapterId);
  if (selectedChapterData) {
    breadcrumbs.push({ label: `Розділ ${selectedChapterData.chapter_number}` });
  }

  breadcrumbs.push({ label: id ? `Редагувати вірш ${verseNumber || ""}` : "Новий вірш" });

  return (
    <div className="container mx-auto p-6 max-w-4xl pb-32">
      <Button
        variant="ghost"
        onClick={() => {
          const params = new URLSearchParams();
          if (selectedBookId) params.set("bookId", selectedBookId);
          if (selectedCantoId) params.set("cantoId", selectedCantoId);
          if (chapterId) params.set("chapterId", chapterId);
          navigate(`/admin/scripture?${params.toString()}`);
        }}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад до віршів
      </Button>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && <Breadcrumbs items={breadcrumbs} />}

      <Card>
        <CardHeader>
          <CardTitle>{id ? "Редагувати вірш" : "Додати вірш"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="bookId">Книга *</Label>
              <Select
                value={selectedBookId}
                onValueChange={(value) => {
                  setSelectedBookId(value);
                  setSelectedCantoId("");
                  setChapterId("");
                }}
                required
              >
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
                <Select
                  value={selectedCantoId}
                  onValueChange={(value) => {
                    setSelectedCantoId(value);
                    setChapterId("");
                  }}
                  required
                >
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
                <p className="mt-1 text-xs text-muted-foreground">Спочатку оберіть пісню, потім — главу.</p>
              </div>
            )}

            {((selectedBook?.has_cantos && selectedCantoId) || (!selectedBook?.has_cantos && selectedBookId)) && (
              <div>
                <Label htmlFor="chapterId">Глава *</Label>
                <Select value={chapterId} onValueChange={setChapterId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть главу" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        Глава {chapter.chapter_number}: {chapter.title_ua}
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
                placeholder="напр., 1.1.1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Українська колонка */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Українська</h3>

                <div>
                  <Label htmlFor="sanskritUa">Санскрит</Label>
                  <Textarea
                    id="sanskritUa"
                    value={sanskritUa}
                    onChange={(e) => setSanskritUa(e.target.value)}
                    placeholder="ॐ नमो भगवते वासुदेवाय..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="transliterationUa">Транслітерація</Label>
                  <Textarea
                    id="transliterationUa"
                    value={transliterationUa}
                    onChange={(e) => setTransliterationUa(e.target.value)}
                    placeholder="ом̇ намо бгаґавате ва̄судева̄йа..."
                    rows={3}
                  />
                </div>

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
                  <EnhancedInlineEditor
                    content={commentaryUa}
                    onChange={setCommentaryUa}
                    label="Коментар українською..."
                  />
                </div>
              </div>

              {/* English колонка */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">English</h3>

                <div>
                  <Label htmlFor="sanskritEn">Sanskrit</Label>
                  <Textarea
                    id="sanskritEn"
                    value={sanskritEn}
                    onChange={(e) => setSanskritEn(e.target.value)}
                    placeholder="ॐ नमो भगवते वासुदेवाय..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="transliterationEn">Transliteration</Label>
                  <Textarea
                    id="transliterationEn"
                    value={transliterationEn}
                    onChange={(e) => setTransliterationEn(e.target.value)}
                    placeholder="oṁ namo bhagavate vāsudevāya..."
                    rows={3}
                  />
                </div>

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
                  <EnhancedInlineEditor
                    content={commentaryEn}
                    onChange={setCommentaryEn}
                    label="Commentary in English..."
                  />
                </div>
              </div>
            </div>

            {/* Audio Files Section */}
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Аудіо файли</h3>
                  <p className="text-sm text-muted-foreground mt-1">Основне аудіо вірша (лекція/запис)</p>
                </div>
              </div>

              {/* PRIMARY AUDIO - Always visible, prominent */}
              <AudioUploader
                label="Повний вірш (лекція)"
                value={fullVerseAudioUrl}
                onChange={setFullVerseAudioUrl}
                primary={true}
              />

              {/* ADVANCED AUDIO - Collapsible section */}
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedAudio(!showAdvancedAudio)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Додаткові аудіо записи
                    </span>
                    {(recitationAudioUrl || explanationUaAudioUrl || explanationEnAudioUrl) && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        {[recitationAudioUrl, explanationUaAudioUrl, explanationEnAudioUrl].filter(Boolean).length}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{showAdvancedAudio ? "Приховати" : "Показати"}</span>
                </Button>

                {showAdvancedAudio && (
                  <div className="space-y-4 pl-4 border-l-2 border-border">
                    <p className="text-xs text-muted-foreground">
                      Окремі аудіо для різних частин вірша (студійні записи)
                    </p>

                    <AudioUploader
                      label="Читання санскриту/бенгалі"
                      value={recitationAudioUrl}
                      onChange={setRecitationAudioUrl}
                      compact={true}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AudioUploader
                        label="Пояснення (українською)"
                        value={explanationUaAudioUrl}
                        onChange={setExplanationUaAudioUrl}
                        compact={true}
                      />

                      <AudioUploader
                        label="Explanation (English)"
                        value={explanationEnAudioUrl}
                        onChange={setExplanationEnAudioUrl}
                        compact={true}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground italic">
                      Примітка: Пояснення включає послівний переклад, літературний переклад та коментар
                    </p>
                  </div>
                )}
              </div>

              {/* Legacy Audio Field */}
              {audioUrl && (
                <div className="mt-4 p-4 bg-muted/30 border border-dashed rounded-lg">
                  <Label className="text-xs text-muted-foreground">Застаріле поле (для сумісності)</Label>
                  <Input
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://example.com/audio.mp3"
                    className="mt-2"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Збереження..." : "Зберегти"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/scripture")}>
                Скасувати
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
