import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, X, Clock } from "lucide-react";

interface Verse {
  id: string;
  verse_number: string;
  sanskrit_ua?: string;
  transliteration_ua?: string;
  translation_ua?: string;
  commentary_ua?: string;
  full_verse_audio_url?: string;
}

interface VerseQuickEditProps {
  verseId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function VerseQuickEdit({ verseId, onClose, onSuccess }: VerseQuickEditProps) {
  const queryClient = useQueryClient();
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [verseNumber, setVerseNumber] = useState("");
  const [sanskritUa, setSanskritUa] = useState("");
  const [transliterationUa, setTransliterationUa] = useState("");
  const [translationUa, setTranslationUa] = useState("");
  const [commentaryUa, setCommentaryUa] = useState("");

  // Load verse data
  useEffect(() => {
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
        setSanskritUa(data.sanskrit_ua || "");
        setTransliterationUa(data.transliteration_ua || "");
        setTranslationUa(data.translation_ua || "");
        setCommentaryUa(data.commentary_ua || "");
      } finally {
        setIsLoading(false);
      }
    };

    loadVerse();
  }, [verseId]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!verseId) throw new Error("No verse ID");

      const { error } = await supabase
        .from("verses")
        .update({
          verse_number: verseNumber,
          sanskrit_ua: sanskritUa || null,
          transliteration_ua: transliterationUa || null,
          translation_ua: translationUa || null,
          commentary_ua: commentaryUa || null,
        })
        .eq("id", verseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verses"] });
      queryClient.invalidateQueries({ queryKey: ["verse", verseId] });
      toast({
        title: "Успіх",
        description: "Вірш оновлено",
      });
      onSuccess();
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
    updateMutation.mutate();
  };

  if (!verseId) {
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
          <h3 className="font-semibold">Редагувати вірш</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {verse?.verse_number}
          </p>
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

          {/* Sanskrit */}
          <div className="space-y-2">
            <Label htmlFor="quick-sanskrit">Санскрит (UA)</Label>
            <Textarea
              id="quick-sanskrit"
              value={sanskritUa}
              onChange={(e) => setSanskritUa(e.target.value)}
              placeholder="देहिनोऽस्मिन्..."
              rows={3}
              className="font-sanskrit"
            />
          </div>

          {/* Transliteration */}
          <div className="space-y-2">
            <Label htmlFor="quick-transliteration">Транслітерація (UA)</Label>
            <Textarea
              id="quick-transliteration"
              value={transliterationUa}
              onChange={(e) => setTransliterationUa(e.target.value)}
              placeholder="dehino 'smin..."
              rows={2}
            />
          </div>

          {/* Translation */}
          <div className="space-y-2">
            <Label htmlFor="quick-translation">Переклад (UA)</Label>
            <Textarea
              id="quick-translation"
              value={translationUa}
              onChange={(e) => setTranslationUa(e.target.value)}
              placeholder="Як душа..."
              rows={4}
            />
          </div>

          {/* Commentary */}
          <div className="space-y-2">
            <Label htmlFor="quick-commentary">Коментар (UA)</Label>
            <Textarea
              id="quick-commentary"
              value={commentaryUa}
              onChange={(e) => setCommentaryUa(e.target.value)}
              placeholder="В цьому вірші..."
              rows={6}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-background">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Збереження...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Зберегти
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
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
