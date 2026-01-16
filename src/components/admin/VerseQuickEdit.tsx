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
import { Loader2, Save, X, Clock, ChevronDown, ChevronUp, Volume2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { AudioUploader } from "@/components/admin/shared/AudioUploader";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  recitation_audio_url?: string;
  explanation_ua_audio_url?: string;
  explanation_en_audio_url?: string;
}

interface VerseLocation {
  bookSlug: string;
  chapterNumber: number;
  cantoNumber?: number;
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
  const [verseLocation, setVerseLocation] = useState<VerseLocation | null>(null);
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

  // Audio fields
  const [fullVerseAudioUrl, setFullVerseAudioUrl] = useState("");
  const [recitationAudioUrl, setRecitationAudioUrl] = useState("");
  const [explanationUaAudioUrl, setExplanationUaAudioUrl] = useState("");
  const [explanationEnAudioUrl, setExplanationEnAudioUrl] = useState("");
  const [isAudioOpen, setIsAudioOpen] = useState(false);

  // Load verse data or reset for create mode
  useEffect(() => {
    if (isCreateMode) {
      // Reset form for create mode
      setVerse(null);
      setVerseLocation(null);
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
      // Reset audio fields
      setFullVerseAudioUrl("");
      setRecitationAudioUrl("");
      setExplanationUaAudioUrl("");
      setExplanationEnAudioUrl("");
      return;
    }

    if (!verseId) {
      setVerse(null);
      setVerseLocation(null);
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
        setSanskritUa(data.sanskrit_ua || (data as any).sanskrit || "");
        setTransliterationUa(data.transliteration_ua || "");
        setSynonymsUa(data.synonyms_ua || "");
        setTranslationUa(data.translation_ua || "");
        setCommentaryUa(data.commentary_ua || "");
        // English fields
        setSanskritEn(data.sanskrit_en || (data as any).sanskrit || "");
        setTransliterationEn(data.transliteration_en || "");
        setSynonymsEn(data.synonyms_en || "");
        setTranslationEn(data.translation_en || "");
        setCommentaryEn(data.commentary_en || "");
        // Audio fields
        setFullVerseAudioUrl(data.full_verse_audio_url || "");
        setRecitationAudioUrl(data.recitation_audio_url || "");
        setExplanationUaAudioUrl(data.explanation_ua_audio_url || "");
        setExplanationEnAudioUrl(data.explanation_en_audio_url || "");
        // Auto-open audio section if verse has audio
        if (data.full_verse_audio_url || data.recitation_audio_url ||
            data.explanation_ua_audio_url || data.explanation_en_audio_url) {
          setIsAudioOpen(true);
        }

        // Load verse location (chapter -> canto -> book)
        if (data.chapter_id) {
          const { data: chapterData } = await supabase
            .from("chapters")
            .select("chapter_number, canto_id, book_id")
            .eq("id", data.chapter_id)
            .single();

          if (chapterData) {
            let bookSlug: string | null = null;
            let cantoNumber: number | undefined = undefined;

            if (chapterData.canto_id) {
              // Chapter belongs to a canto
              const { data: cantoData } = await supabase
                .from("cantos")
                .select("canto_number, book_id")
                .eq("id", chapterData.canto_id)
                .single();

              if (cantoData) {
                cantoNumber = cantoData.canto_number;
                const { data: bookData } = await supabase
                  .from("books")
                  .select("slug")
                  .eq("id", cantoData.book_id)
                  .single();
                bookSlug = bookData?.slug || null;
              }
            } else if (chapterData.book_id) {
              // Chapter belongs directly to a book
              const { data: bookData } = await supabase
                .from("books")
                .select("slug")
                .eq("id", chapterData.book_id)
                .single();
              bookSlug = bookData?.slug || null;
            }

            if (bookSlug) {
              setVerseLocation({
                bookSlug,
                chapterNumber: chapterData.chapter_number,
                cantoNumber,
              });
            }
          }
        }
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
        // Audio fields
        full_verse_audio_url: fullVerseAudioUrl || null,
        recitation_audio_url: recitationAudioUrl || null,
        explanation_ua_audio_url: explanationUaAudioUrl || null,
        explanation_en_audio_url: explanationEnAudioUrl || null,
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

  // Construct public URL for the verse
  const getPublicVerseUrl = (): string | null => {
    if (!verseLocation || !verseNumber) return null;
    const { bookSlug, chapterNumber, cantoNumber } = verseLocation;
    if (cantoNumber) {
      return `/lib/${bookSlug}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNumber}`;
    }
    return `/lib/${bookSlug}/${chapterNumber}/${verseNumber}`;
  };

  const publicVerseUrl = getPublicVerseUrl();

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
        <div className="flex items-center gap-1">
          {publicVerseUrl && (
            <Button variant="ghost" size="sm" asChild title="Переглянути в бібліотеці">
              <Link to={publicVerseUrl} target="_blank">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
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

          {/* Audio Section */}
          <Collapsible open={isAudioOpen} onOpenChange={setIsAudioOpen}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Аудіо
                  {(fullVerseAudioUrl || recitationAudioUrl || explanationUaAudioUrl || explanationEnAudioUrl) && (
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {[fullVerseAudioUrl, recitationAudioUrl, explanationUaAudioUrl, explanationEnAudioUrl].filter(Boolean).length}
                    </span>
                  )}
                </span>
                {isAudioOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Primary Audio - Full Verse */}
              <AudioUploader
                label="Повний вірш (лекція)"
                value={fullVerseAudioUrl}
                onChange={setFullVerseAudioUrl}
                primary={true}
                showManualInput={false}
              />

              {/* Secondary Audio - Recitation */}
              <AudioUploader
                label="Читання санскриту/бенгалі"
                value={recitationAudioUrl}
                onChange={setRecitationAudioUrl}
                compact={true}
                showManualInput={false}
              />

              {/* Explanation Audio - Ukrainian */}
              <AudioUploader
                label="Пояснення (українською)"
                value={explanationUaAudioUrl}
                onChange={setExplanationUaAudioUrl}
                compact={true}
                showManualInput={false}
              />

              {/* Explanation Audio - English */}
              <AudioUploader
                label="Explanation (English)"
                value={explanationEnAudioUrl}
                onChange={setExplanationEnAudioUrl}
                compact={true}
                showManualInput={false}
              />
            </CollapsibleContent>
          </Collapsible>

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
