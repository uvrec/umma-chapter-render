/**
 * Повноцінний редактор листів
 * /admin/letters/new - створення нового листа
 * /admin/letters/:id/edit - редагування існуючого
 *
 * Функціонал:
 * - Редагування метаданих листа
 * - TipTap редактор для форматованого тексту
 * - AI переклад
 * - Live preview
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Icons
import {
  ArrowLeft,
  Save,
  Loader2,
  Languages,
  Sparkles,
  Eye,
  ExternalLink,
  Copy,
  Calendar,
  MapPin,
  User,
  FileText,
  Hash,
  Mail,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";
import { transliterateIAST } from "@/utils/text/transliteration";
import type { Letter } from "@/types/letter";

export default function AddEditLetter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();
  const isEditing = !!id;

  // State
  const [letter, setLetter] = useState<Partial<Letter>>({
    recipient_en: "",
    recipient_ua: "",
    location_en: "",
    location_ua: "",
    letter_date: new Date().toISOString().split("T")[0],
    reference: "",
    address_block: "",
    content_en: "",
    content_ua: "",
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Auth check
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  // Load letter data
  const { data: letterData, isLoading } = useQuery({
    queryKey: ["admin-letter", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await (supabase as any)
        .from("letters")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Letter;
    },
    enabled: !!id,
  });

  // Initialize state from loaded data
  useEffect(() => {
    if (letterData) {
      setLetter(letterData);
    }
  }, [letterData]);

  // Generate slug
  const generateSlug = () => {
    if (!letter.letter_date || !letter.recipient_en) return;

    const date = letter.letter_date.replace(/-/g, "");
    const recipient = letter.recipient_en
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 30);

    setLetter((prev) => ({ ...prev, slug: `${date}-${recipient}` }));
  };

  // AI Translation
  const translateContent = async () => {
    if (!letter.content_en) {
      toast.error("Немає тексту для перекладу");
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-claude`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text: letter.content_en,
            context: "letter",
          }),
        }
      );

      if (!response.ok) throw new Error("Translation failed");

      const data = await response.json();
      setLetter((prev) => ({ ...prev, content_ua: data.translated }));
      toast.success(
        `Перекладено! Знайдено ${data.terms_found?.length || 0} санскритських термінів`
      );
    } catch (error) {
      toast.error("Помилка перекладу");
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Transliterate
  const transliterateContent = () => {
    if (!letter.content_en) return;

    const transliterated = transliterateIAST(letter.content_en);
    setLetter((prev) => ({ ...prev, content_ua: transliterated }));
    toast.success("Транслітерацію застосовано");
  };

  // Save letter
  const handleSave = async () => {
    if (!letter.recipient_en) {
      toast.error("Отримувач обов'язковий");
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing) {
        const { error } = await (supabase as any)
          .from("letters")
          .update({
            recipient_en: letter.recipient_en,
            recipient_ua: letter.recipient_ua || null,
            location_en: letter.location_en || "",
            location_ua: letter.location_ua || null,
            letter_date: letter.letter_date,
            reference: letter.reference || null,
            address_block: letter.address_block || null,
            content_en: letter.content_en || "",
            content_ua: letter.content_ua || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
      } else {
        // Generate slug if not set
        const slug =
          letter.slug ||
          `${letter.letter_date?.replace(/-/g, "")}-${letter.recipient_en
            ?.toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 30)}`;

        const { data, error } = await (supabase as any)
          .from("letters")
          .insert({
            slug,
            recipient_en: letter.recipient_en,
            recipient_ua: letter.recipient_ua || null,
            location_en: letter.location_en || "",
            location_ua: letter.location_ua || null,
            letter_date: letter.letter_date,
            reference: letter.reference || null,
            address_block: letter.address_block || null,
            content_en: letter.content_en || "",
            content_ua: letter.content_ua || null,
          })
          .select()
          .single();

        if (error) throw error;

        // Navigate to edit mode
        navigate(`/admin/letters/${data.id}/edit`);
      }

      queryClient.invalidateQueries({ queryKey: ["admin-letters"] });
      queryClient.invalidateQueries({ queryKey: ["admin-letter", id] });

      toast.success(isEditing ? "Лист оновлено" : "Лист створено");
    } catch (error: any) {
      toast.error(`Помилка: ${error.message}`);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete letter
  const handleDelete = async () => {
    if (!id) return;

    try {
      const { error } = await (supabase as any).from("letters").delete().eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-letters"] });
      toast.success("Лист видалено");
      navigate("/admin/letters");
    } catch (error: any) {
      toast.error(`Помилка: ${error.message}`);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Word count
  const wordCount = (text: string | null | undefined) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/letters")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <div>
                  <h1 className="text-xl font-bold">
                    {isEditing ? "Редагування листа" : "Новий лист"}
                  </h1>
                  {letter.slug && (
                    <p className="text-xs text-muted-foreground">{letter.slug}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview */}
                {isEditing && letter.slug && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(`/library/letters/${letter.slug}`, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Відкрити на сайті</TooltipContent>
                  </Tooltip>
                )}

                {/* Delete */}
                {isEditing && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Видалити</TooltipContent>
                  </Tooltip>
                )}

                {/* Save */}
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Зберегти
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
            <TabsList className="mb-6">
              <TabsTrigger value="edit">Редагування</TabsTrigger>
              <TabsTrigger value="preview">Попередній перегляд</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Metadata */}
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Метадані листа</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Recipient EN */}
                      <div className="space-y-2">
                        <Label htmlFor="recipient_en">
                          <User className="w-4 h-4 inline mr-1" />
                          Отримувач (EN) *
                        </Label>
                        <Input
                          id="recipient_en"
                          value={letter.recipient_en || ""}
                          onChange={(e) =>
                            setLetter((prev) => ({ ...prev, recipient_en: e.target.value }))
                          }
                          placeholder="Sumati Morarji"
                        />
                      </div>

                      {/* Recipient UA */}
                      <div className="space-y-2">
                        <Label htmlFor="recipient_ua">Отримувач (UA)</Label>
                        <Input
                          id="recipient_ua"
                          value={letter.recipient_ua || ""}
                          onChange={(e) =>
                            setLetter((prev) => ({ ...prev, recipient_ua: e.target.value }))
                          }
                          placeholder="Суматі Морарджі"
                        />
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor="date">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Дата
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={letter.letter_date || ""}
                          onChange={(e) =>
                            setLetter((prev) => ({ ...prev, letter_date: e.target.value }))
                          }
                        />
                      </div>

                      {/* Location */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="location_en">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Локація (EN)
                          </Label>
                          <Input
                            id="location_en"
                            value={letter.location_en || ""}
                            onChange={(e) =>
                              setLetter((prev) => ({ ...prev, location_en: e.target.value }))
                            }
                            placeholder="Vrindavan"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location_ua">Локація (UA)</Label>
                          <Input
                            id="location_ua"
                            value={letter.location_ua || ""}
                            onChange={(e) =>
                              setLetter((prev) => ({ ...prev, location_ua: e.target.value }))
                            }
                            placeholder="Вріндаван"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Reference */}
                      <div className="space-y-2">
                        <Label htmlFor="reference">
                          <Hash className="w-4 h-4 inline mr-1" />
                          Reference
                        </Label>
                        <Input
                          id="reference"
                          value={letter.reference || ""}
                          onChange={(e) =>
                            setLetter((prev) => ({ ...prev, reference: e.target.value }))
                          }
                          placeholder="47-07-12"
                        />
                      </div>

                      {/* Address block */}
                      <div className="space-y-2">
                        <Label htmlFor="address_block">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Адресний блок
                        </Label>
                        <Textarea
                          id="address_block"
                          value={letter.address_block || ""}
                          onChange={(e) =>
                            setLetter((prev) => ({ ...prev, address_block: e.target.value }))
                          }
                          rows={3}
                          placeholder="Scindia Steam Navigation Co...."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Статистика</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Слів (EN)</div>
                          <div className="text-2xl font-bold">
                            {wordCount(letter.content_en)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Слів (UA)</div>
                          <div className="text-2xl font-bold">
                            {wordCount(letter.content_ua)}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-muted-foreground">Статус перекладу</div>
                          <Badge
                            variant={letter.content_ua ? "secondary" : "destructive"}
                            className="mt-1"
                          >
                            {letter.content_ua ? "Перекладено" : "Не перекладено"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right column - Content */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Текст листа</CardTitle>
                        <div className="flex items-center gap-2">
                          {/* Transliterate */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={transliterateContent}
                              >
                                <Languages className="w-4 h-4 mr-2" />
                                Транслітерувати
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Скопіювати EN текст з транслітерацією санскриту
                            </TooltipContent>
                          </Tooltip>

                          {/* AI Translate */}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={translateContent}
                            disabled={isTranslating}
                          >
                            {isTranslating ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Перекласти AI
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* English content */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">English</Label>
                          <Textarea
                            value={letter.content_en || ""}
                            onChange={(e) =>
                              setLetter((prev) => ({ ...prev, content_en: e.target.value }))
                            }
                            rows={20}
                            className="font-mono text-sm"
                            placeholder="Enter English text..."
                          />
                        </div>

                        {/* Ukrainian content */}
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Українська</Label>
                          <Textarea
                            value={letter.content_ua || ""}
                            onChange={(e) =>
                              setLetter((prev) => ({ ...prev, content_ua: e.target.value }))
                            }
                            rows={20}
                            className="font-mono text-sm"
                            placeholder="Введіть український текст..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <Card className="max-w-3xl mx-auto">
                <CardContent className="p-8">
                  {/* Letter header */}
                  <div className="mb-8 pb-6 border-b">
                    <Badge variant="secondary" className="mb-4">
                      {letter.reference || "Лист"}
                    </Badge>

                    <h1 className="text-2xl font-bold mb-4">
                      {letter.recipient_ua || letter.recipient_en || "Отримувач"}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(letter.letter_date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {letter.location_ua || letter.location_en || "Локація"}
                      </div>
                    </div>

                    {letter.address_block && (
                      <div className="mt-4 p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                        {letter.address_block}
                      </div>
                    )}
                  </div>

                  {/* Letter content */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {(letter.content_ua || letter.content_en || "").split("\n").map((p, idx) => (
                      <p key={idx} className="mb-4 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>

                  {!letter.content_en && !letter.content_ua && (
                    <div className="text-center text-muted-foreground py-12">
                      Текст листа ще не додано
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Delete confirmation dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Видалити лист?</AlertDialogTitle>
              <AlertDialogDescription>
                Цю дію неможливо скасувати. Лист буде видалено назавжди.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Видалити
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
