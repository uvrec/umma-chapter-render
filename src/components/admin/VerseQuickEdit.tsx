import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, X, Clock } from "lucide-react";

interface Verse {
  id: string;
  verse_number: string;
  sanskrit_ua?: string;
  sanskrit_en?: string;
  transliteration_ua?: string;
  transliteration_en?: string;
  synonyms_ua?: string;
  synonyms_en?: string;
  translation_ua?: string;
  translation_en?: string;
  commentary_ua?: string;
  commentary_en?: string;
  full_verse_audio_url?: string;
}

interface VerseQuickEditProps {
  verseId: string | null;
  chapterId?: string | null;
  mode?: "edit" | "create";
  onClose: () => void;
  onSuccess: () => void;
}

export function VerseQuickEdit({ verseId, chapterId, mode = "edit", onClose, onSuccess }: VerseQuickEditProps) {
  const queryClient = useQueryClient();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isCreateMode = mode === "create";

  // Form fields - Ukrainian
  const [verseNumber, setVerseNumber] = useState("");
  const [sanskritUa, setSanskritUa] = useState("");
  const [transliterationUa, setTransliterationUa] = useState("");
  const [synonymsUa, setSynonymsUa] = useState("");
  const [translationUa, setTranslationUa] = useState("");
  const [commentaryUa, setCommentaryUa] = useState("");

  // Form fields - English
  const [sanskritEn, setSanskritEn] = useState("");
  const [transliterationEn, setTransliterationEn] = useState("");
  const [synonymsEn, setSynonymsEn] = useState("");
  const [translationEn, setTranslationEn] = useState("");
  const [commentaryEn, setCommentaryEn] = useState("");

  // Load verse data or reset for create mode
  useEffect(() => {
    if (isCreateMode) {
      // Reset form for create mode
      setVerse(null);
      setVerseNumber("");
      setSanskritUa("");
      setTransliterationUa("");
      setSynonymsUa("");
      setTranslationUa("");
      setCommentaryUa("");
      setSanskritEn("");
      setTransliterationEn("");
      setSynonymsEn("");
      setTranslationEn("");
      setCommentaryEn("");
      return;
    }

    if (!verseId) {
      setVerse(null);
      return;
    }

    const loadVerse = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("verses")
          .select("*")
          .eq("id", verseId)
          .single();

        if (error) {
          toast({
            title: "Помилка",
            description: "Не вдалося завантажити вірш",
            variant: "destructive",
          });
          return;
        }

        setVerse(data);
        setVerseNumber(data.verse_number || "");
        // Ukrainian fields
        setSanskritUa(data.sanskrit_ua || "");
        setTransliterationUa(data.transliteration_ua || "");
        setSynonymsUa(data.synonyms_ua || "");
        setTranslationUa(data.translation_ua || "");
        setCommentaryUa(data.commentary_ua || "");
        // English fields
        setSanskritEn(data.sanskrit_en || "");
        setTransliterationEn(data.transliteration_en || "");
        setSynonymsEn(data.synonyms_en || "");
        setTranslationEn(data.translation_en || "");
        setCommentaryEn(data.commentary_en || "");
      } finally {
        setIsLoading(false);
      }
    };

    loadVerse();
  }, [verseId, isCreateMode]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const verseData = {
        verse_number: verseNumber,
        // Ukrainian fields
        sanskrit_ua: sanskritUa || null,
        transliteration_ua: transliterationUa || null,
        synonyms_ua: synonymsUa || null,
        translation_ua: translationUa || null,
        commentary_ua: commentaryUa || null,
        // English fields
        sanskrit_en: sanskritEn || null,
        transliteration_en: transliterationEn || null,
        synonyms_en: synonymsEn || null,
        translation_en: translationEn || null,
        commentary_en: commentaryEn || null,
      };

      if (isCreateMode) {
        if (!chapterId) throw new Error("No chapter ID for create");
        const { error } = await supabase
          .from("verses")
          .insert({ ...verseData, chapter_id: chapterId, is_published: true });
        if (error) throw error;
      } else {
        if (!verseId) throw new Error("No verse ID");
        const { error } = await supabase
          .from("verses")
          .update(verseData)
          .eq("id", verseId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      if (verseId) {
        queryClient.invalidateQueries({ queryKey: ["verse", verseId] });
      }
      toast({
        title: "Успіх",
        description: isCreateMode ? "Вірш створено" : "Вірш оновлено",
      });
      onSuccess();
      if (isCreateMode) {
        onClose();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verseNumber) {
      toast({
        title: "Помилка",
        description: "Номер вірша обов'язковий",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate();
  };

  if (!isCreateMode && !verseId) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground p-8 text-center">
        <Clock className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm">Виберіть вірш для редагування</p>
        <p className="text-xs mt-2">Натисніть на вірш у центральній панелі</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-4">Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-l">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold">{isCreateMode ? "Створити вірш" : "Редагувати вірш"}</h3>
          {!isCreateMode && verse?.verse_number && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {verse.verse_number}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form */}
      <ScrollArea className="flex-1">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Verse Number */}
          <div className="space-y-2">
            <Label htmlFor="quick-verse-number">Номер вірша *</Label>
            <Input
              id="quick-verse-number"
              value={verseNumber}
              onChange={(e) => setVerseNumber(e.target.value)}
              placeholder="2.13"
              required
            />
          </div>

          {/* Language Tabs */}
          <Tabs defaultValue="ua" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ua">Українська</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>

            {/* Ukrainian Tab */}
            <TabsContent value="ua" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="quick-sanskrit-ua">Санскрит</Label>
                <Textarea
                  id="quick-sanskrit-ua"
                  value={sanskritUa}
                  onChange={(e) => setSanskritUa(e.target.value)}
                  placeholder="देहिनोऽस्मिन्..."
                  rows={3}
                  className="font-sanskrit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-transliteration-ua">Транслітерація</Label>
                <Textarea
                  id="quick-transliteration-ua"
                  value={transliterationUa}
                  onChange={(e) => setTransliterationUa(e.target.value)}
                  placeholder="dehino 'smin..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-synonyms-ua">Синоніми</Label>
                <Textarea
                  id="quick-synonyms-ua"
                  value={synonymsUa}
                  onChange={(e) => setSynonymsUa(e.target.value)}
                  placeholder="деха – тіло; асмін – в цьому..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-translation-ua">Переклад</Label>
                <Textarea
                  id="quick-translation-ua"
                  value={translationUa}
                  onChange={(e) => setTranslationUa(e.target.value)}
                  placeholder="Як душа..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-commentary-ua">Коментар</Label>
                <Textarea
                  id="quick-commentary-ua"
                  value={commentaryUa}
                  onChange={(e) => setCommentaryUa(e.target.value)}
                  placeholder="В цьому вірші..."
                  rows={6}
                />
              </div>
            </TabsContent>

            {/* English Tab */}
            <TabsContent value="en" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="quick-sanskrit-en">Sanskrit</Label>
                <Textarea
                  id="quick-sanskrit-en"
                  value={sanskritEn}
                  onChange={(e) => setSanskritEn(e.target.value)}
                  placeholder="देहिनोऽस्मिन्..."
                  rows={3}
                  className="font-sanskrit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-transliteration-en">Transliteration</Label>
                <Textarea
                  id="quick-transliteration-en"
                  value={transliterationEn}
                  onChange={(e) => setTransliterationEn(e.target.value)}
                  placeholder="dehino 'smin..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-synonyms-en">Synonyms</Label>
                <Textarea
                  id="quick-synonyms-en"
                  value={synonymsEn}
                  onChange={(e) => setSynonymsEn(e.target.value)}
                  placeholder="deha – body; asmin – in this..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-translation-en">Translation</Label>
                <Textarea
                  id="quick-translation-en"
                  value={translationEn}
                  onChange={(e) => setTranslationEn(e.target.value)}
                  placeholder="As the soul..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-commentary-en">Commentary</Label>
                <Textarea
                  id="quick-commentary-en"
                  value={commentaryEn}
                  onChange={(e) => setCommentaryEn(e.target.value)}
                  placeholder="In this verse..."
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-background">
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreateMode ? "Створення..." : "Збереження..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isCreateMode ? "Створити" : "Зберегти"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saveMutation.isPending}
            >
              Скасувати
            </Button>
          </div>
        </form>
      </ScrollArea>

      {/* Hint */}
      <div className="p-3 border-t bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium">Швидка клавіша:</span>
          <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">
            Enter
          </kbd>
          <span>→ Зберегти</span>
        </div>
      </div>
    </div>
  );
}
