import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";

/** Допоміжне: витягти шлях файла з публічного URL Supabase storage */
function extractStoragePath(publicUrl: string, bucket: string): string | null {
  try {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return publicUrl.slice(idx + marker.length);
  } catch {
    return null;
  }
}

export default function AddEditVerse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  // селекти та поля форми
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [selectedCantoId, setSelectedCantoId] = useState<string>("");
  const [chapterId, setChapterId] = useState<string>("");

  const [verseNumber, setVerseNumber] = useState<string>("");
  const [sanskrit, setSanskrit] = useState<string>("");
  const [transliteration, setTransliteration] = useState<string>("");
  const [synonymsUa, setSynonymsUa] = useState<string>("");
  const [synonymsEn, setSynonymsEn] = useState<string>("");
  const [translationUa, setTranslationUa] = useState<string>("");
  const [translationEn, setTranslationEn] = useState<string>("");
  const [commentaryUa, setCommentaryUa] = useState<string>("");
  const [commentaryEn, setCommentaryEn] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    if (!user || !isAdmin) navigate("/auth");
  }, [user, isAdmin, navigate]);

  /* =========================
     Довідники: книги/пісні/розділи
  ========================== */

  const { data: books } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("title_ua");
      if (error) throw error;
      return data as Array<{ id: string; title_ua: string; has_cantos: boolean }>;
    },
    enabled: !!user && isAdmin,
    staleTime: 60_000,
  });

  const selectedBook = useMemo(() => books?.find((b) => b.id === selectedBookId), [books, selectedBookId]);

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
      return data as Array<{ id: string; canto_number: number; title_ua: string }>;
    },
    enabled: !!selectedBookId && !!selectedBook?.has_cantos,
    staleTime: 60_000,
  });

  const { data: chapters } = useQuery({
    queryKey: ["admin-chapters", selectedBookId, selectedCantoId],
    queryFn: async () => {
      if (!selectedBookId) return [];

      let query = supabase.from("chapters").select("*");

      if (selectedBook?.has_cantos) {
        if (!selectedCantoId) return [];
        query = query.eq("canto_id", selectedCantoId);
      } else {
        query = query.eq("book_id", selectedBookId);
      }

      const { data, error } = await query.order("chapter_number");
      if (error) throw error;
      return data as Array<{ id: string; chapter_number: number; title_ua: string }>;
    },
    enabled: !!selectedBookId && (!!selectedCantoId || !selectedBook?.has_cantos),
    staleTime: 60_000,
  });

  /* =========================
     Редагування: підтягнути вірш і його контекст
  ========================== */

  const { data: verse } = useQuery({
    queryKey: ["verse", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("verses").select("*").eq("id", id).single();
      if (error) throw error;
      return data as any;
    },
    enabled: !!id && !!user && isAdmin,
  });

  // окремо завантажуємо контекст розділу (книга/пісня), щоб одразу розставити селекти
  useEffect(() => {
    const loadContextForEdit = async () => {
      if (!verse?.chapter_id) return;
      // стягуємо дані розділу + його canto/book
      const { data: ch, error } = await supabase
        .from("chapters")
        .select("id, book_id, canto_id")
        .eq("id", verse.chapter_id)
        .maybeSingle();
      if (error) {
        console.error(error);
        return;
      }
      if (!ch) return;

      // якщо є canto — книга з canto; інакше — книга без canto
      if (ch.canto_id) {
        const { data: ca } = await supabase.from("cantos").select("id, book_id").eq("id", ch.canto_id).maybeSingle();
        if (ca?.book_id) {
          setSelectedBookId(ca.book_id);
          setSelectedCantoId(ch.canto_id);
        }
      } else if (ch.book_id) {
        setSelectedBookId(ch.book_id);
        setSelectedCantoId("");
      }
      setChapterId(verse.chapter_id);
    };

    if (isEdit && verse) {
      // заповнити поля
      setVerseNumber(verse.verse_number || "");
      setSanskrit(verse.sanskrit || "");
      setTransliteration(verse.transliteration || "");
      setSynonymsUa(verse.synonyms_ua || "");
      setSynonymsEn(verse.synonyms_en || "");
      setTranslationUa(verse.translation_ua || "");
      setTranslationEn(verse.translation_en || "");
      setCommentaryUa(verse.commentary_ua || "");
      setCommentaryEn(verse.commentary_en || "");
      setAudioUrl(verse.audio_url || "");
      // і підтягнути контекст
      loadContextForEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, verse?.id]);

  /* =========================
     Збереження
  ========================== */

  const mutation = useMutation({
    mutationFn: async () => {
      if (!chapterId || !verseNumber.trim()) {
        throw new Error("Заповніть обовʼязкові поля: розділ та номер вірша.");
      }

      const payload = {
        chapter_id: chapterId,
        verse_number: verseNumber.trim(),
        sanskrit: sanskrit?.trim() || null,
        transliteration: transliteration?.trim() || null,
        synonyms_ua: synonymsUa?.trim() || null,
        synonyms_en: synonymsEn?.trim() || null,
        translation_ua: translationUa?.trim() || null,
        translation_en: translationEn?.trim() || null,
        commentary_ua: commentaryUa || null,
        commentary_en: commentaryEn || null,
        audio_url: audioUrl?.trim() || null,
      };

      if (isEdit) {
        const { error } = await supabase.from("verses").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        // у БД має бути UNIQUE (chapter_id, verse_number)
        const { error } = await supabase.from("verses").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      toast({
        title: isEdit ? "Вірш оновлено" : "Вірш додано",
        description: "Зміни успішно збережено",
      });
      navigate("/admin/verses");
    },
    onError: (err: any) => {
      toast({
        title: "Помилка",
        description: err?.message ?? "Не вдалося зберегти вірш",
        variant: "destructive",
      });
    },
  });

  /* =========================
     Аудіо: upload/remove
  ========================== */

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", "audio/wav", "audio/ogg", "audio/webm"];
    if (!allowed.includes(file.type)) {
      toast({
        title: "Помилка",
        description: "Підтримуються лише MP3/M4A/WAV/OGG/WEBM",
        variant: "destructive",
      });
      return;
    }

    try {
      const ext = file.name.split(".").pop() || "mp3";
      const name = `${crypto.randomUUID?.() ?? Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("verse-audio").upload(name, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("verse-audio").getPublicUrl(name);
      setAudioUrl(publicUrl);

      toast({ title: "Успіх", description: "Аудіо завантажено" });
    } catch (err: any) {
      toast({
        title: "Помилка завантаження",
        description: err?.message ?? "Не вдалося завантажити аудіо",
        variant: "destructive",
      });
    } finally {
      // очищаємо інпут, щоб можна було повторно вибрати той самий файл
      e.currentTarget.value = "";
    }
  };

  const handleRemoveAudio = async () => {
    if (!audioUrl) return;
    try {
      const path = extractStoragePath(audioUrl, "verse-audio");
      if (path) {
        await supabase.storage.from("verse-audio").remove([path]);
      }
      setAudioUrl("");
      toast({ title: "Успіх", description: "Аудіо видалено" });
    } catch (err: any) {
      toast({
        title: "Помилка",
        description: err?.message ?? "Не вдалося видалити аудіо",
        variant: "destructive",
      });
    }
  };

  /* =========================
     Рендер
  ========================== */

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl pb-32">
      <Button variant="ghost" onClick={() => navigate("/admin/verses")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад до віршів
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Редагувати вірш" : "Додати вірш"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="space-y-6"
          >
            {/* Книга */}
            <div>
              <Label>Книга *</Label>
              <Select
                value={selectedBookId}
                onValueChange={(v) => {
                  setSelectedBookId(v);
                  setSelectedCantoId("");
                  setChapterId("");
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть книгу" />
                </SelectTrigger>
                <SelectContent>
                  {books?.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.title_ua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Пісня (якщо книга з canto) */}
            {selectedBook?.has_cantos && (
              <div>
                <Label>Пісня *</Label>
                <Select
                  value={selectedCantoId}
                  onValueChange={(v) => {
                    setSelectedCantoId(v);
                    setChapterId("");
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть пісню" />
                  </SelectTrigger>
                  <SelectContent>
                    {cantos?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        Пісня {c.canto_number}: {c.title_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Розділ */}
            {((selectedBook?.has_cantos && selectedCantoId) || (!selectedBook?.has_cantos && selectedBookId)) && (
              <div>
                <Label>Розділ *</Label>
                <Select value={chapterId} onValueChange={setChapterId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть розділ" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters?.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        Розділ {ch.chapter_number}: {ch.title_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Номер вірша */}
            <div>
              <Label htmlFor="verseNumber">Номер вірша *</Label>
              <Input
                id="verseNumber"
                value={verseNumber}
                onChange={(e) => setVerseNumber(e.target.value)}
                placeholder="1.1.1 (або ШБ 1.1.1)"
                required
              />
            </div>

            <div>
              <Label htmlFor="sanskrit">Санскрит</Label>
              <Textarea
                id="sanskrit"
                value={sanskrit}
                onChange={(e) => setSanskrit(e.target.value)}
                placeholder="ॐ नमो भगवते वासुदेवाय…"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="transliteration">Транслітерація</Label>
              <Textarea
                id="transliteration"
                value={transliteration}
                onChange={(e) => setTransliteration(e.target.value)}
                placeholder="ом̇ намо бгаґавате ва̄судева̄йа…"
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
                  <Label>Синоніми</Label>
                  <Textarea
                    value={synonymsUa}
                    onChange={(e) => setSynonymsUa(e.target.value)}
                    placeholder="ом̇ — …; намах̣ — …"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Переклад</Label>
                  <Textarea
                    value={translationUa}
                    onChange={(e) => setTranslationUa(e.target.value)}
                    placeholder="Український переклад…"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Коментар</Label>
                  <InlineTiptapEditor content={commentaryUa} onChange={setCommentaryUa} label="Коментар (UA)" />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>Synonyms</Label>
                  <Textarea
                    value={synonymsEn}
                    onChange={(e) => setSynonymsEn(e.target.value)}
                    placeholder="om — …; namah — …"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Translation</Label>
                  <Textarea
                    value={translationEn}
                    onChange={(e) => setTranslationEn(e.target.value)}
                    placeholder="English translation…"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Commentary</Label>
                  <InlineTiptapEditor content={commentaryEn} onChange={setCommentaryEn} label="Commentary (EN)" />
                </div>
              </TabsContent>
            </Tabs>

            {/* Аудіо */}
            <div>
              <Label>Аудіо файл</Label>
              <div className="space-y-3">
                {audioUrl ? (
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                    <audio src={audioUrl} controls className="flex-1" />
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemoveAudio} title="Видалити аудіо">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Input
                      id="audioFile"
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleAudioUpload}
                    />
                    <Label htmlFor="audioFile" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Натисніть, щоб завантажити аудіо</span>
                      <span className="text-xs text-muted-foreground">MP3, M4A, WAV, OGG, WEBM (до ~50MB)</span>
                    </Label>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">Або вставте URL:</div>
                <Input
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Збереження..." : "Зберегти"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/verses")}>
                Скасувати
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
