/**
 * Перегляд окремого листа Прабгупади
 *
 * Маршрут: /library/letters/:slug
 *
 * Функціонал:
 * - Відображення метаданих (отримувач, дата, локація, адреса)
 * - Повний текст листа
 * - Підсвітка санскритських термінів
 * - Мовний переключач (UA/EN)
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Loader2,
  Edit,
  Save,
  X,
} from "lucide-react";
import type { Letter } from "@/types/letter";
import { useLanguage } from "@/contexts/LanguageContext";


export const LetterView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const { language, getLocalizedPath } = useLanguage();

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState<{
    recipient_uk: string;
    recipient_en: string;
    location_uk: string;
    location_en: string;
    content_uk: string;
    content_en: string;
    letter_date: string;
  } | null>(null);

  // Завантажити лист
  const { data: letter, isLoading } = useQuery({
    queryKey: ["letter", slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("letters")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Letter;
    },
    enabled: !!slug,
  });

  // Mutation for saving letter changes
  const saveLetterMutation = useMutation({
    mutationFn: async () => {
      if (!letter || !editedLetter) return;

      const updates: Partial<Letter> = {};
      if (editedLetter.recipient_uk !== letter.recipient_uk) updates.recipient_uk = editedLetter.recipient_uk;
      if (editedLetter.recipient_en !== letter.recipient_en) updates.recipient_en = editedLetter.recipient_en;
      if (editedLetter.location_uk !== letter.location_uk) updates.location_uk = editedLetter.location_uk;
      if (editedLetter.location_en !== letter.location_en) updates.location_en = editedLetter.location_en;
      if (editedLetter.content_uk !== letter.content_uk) updates.content_uk = editedLetter.content_uk;
      if (editedLetter.content_en !== letter.content_en) updates.content_en = editedLetter.content_en;
      if (editedLetter.letter_date !== letter.letter_date) updates.letter_date = editedLetter.letter_date;

      if (Object.keys(updates).length > 0) {
        const { error } = await (supabase as any)
          .from("letters")
          .update(updates)
          .eq("id", letter.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letter", slug] });
      setIsEditing(false);
      toast.success("Зміни збережено");
    },
    onError: (error) => {
      console.error("Save error:", error);
      toast.error("Помилка збереження");
    },
  });

  const startEdit = () => {
    if (!letter) return;
    setEditedLetter({
      recipient_uk: letter.recipient_uk || "",
      recipient_en: letter.recipient_en,
      location_uk: letter.location_uk || "",
      location_en: letter.location_en,
      content_uk: letter.content_uk || "",
      content_en: letter.content_en,
      letter_date: letter.letter_date,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedLetter(null);
  };

  const saveEdit = () => {
    saveLetterMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Лист не знайдено</h2>
            <Button onClick={() => navigate(getLocalizedPath("/library/letters"))}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "uk" ? "Повернутися до списку" : "Back to list"}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recipient = language === "uk" && letter.recipient_uk
    ? letter.recipient_uk
    : letter.recipient_en;

  const location = language === "uk" && letter.location_uk
    ? letter.location_uk
    : letter.location_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Навігація + Edit button */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(getLocalizedPath("/library/letters"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "uk" ? "До списку листів" : "Back to letters"}
          </Button>

          {/* Admin Edit Controls */}
          {isAdmin && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveEdit}
                    disabled={saveLetterMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saveLetterMutation.isPending ? "Збереження..." : "Зберегти"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    <X className="mr-2 h-4 w-4" />
                    Скасувати
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={startEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редагувати
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Метадані листа */}
        <div className="mb-8">
          {isEditing && editedLetter ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Отримувач UA</label>
                  <Input
                    value={editedLetter.recipient_uk}
                    onChange={(e) => setEditedLetter({ ...editedLetter, recipient_uk: e.target.value })}
                    className="text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Recipient EN</label>
                  <Input
                    value={editedLetter.recipient_en}
                    onChange={(e) => setEditedLetter({ ...editedLetter, recipient_en: e.target.value })}
                    className="text-lg font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Локація UA</label>
                  <Input
                    value={editedLetter.location_uk}
                    onChange={(e) => setEditedLetter({ ...editedLetter, location_uk: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Location EN</label>
                  <Input
                    value={editedLetter.location_en}
                    onChange={(e) => setEditedLetter({ ...editedLetter, location_en: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <Input
                    type="date"
                    value={editedLetter.letter_date}
                    onChange={(e) => setEditedLetter({ ...editedLetter, letter_date: e.target.value })}
                    className="w-auto"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 mb-4">
              <User className="w-6 h-6 mt-1 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">
                  {language === "uk" ? "Лист до " : "Letter to "}
                  <button
                    onClick={() => navigate(getLocalizedPath(`/library/letters?recipient=${encodeURIComponent(letter.recipient_en)}`))}
                    className="hover:text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    {recipient}
                  </button>
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <button
                    onClick={() => {
                      const year = new Date(letter.letter_date).getFullYear();
                      navigate(getLocalizedPath(`/library/letters?yearFrom=${year}&yearTo=${year}`));
                    }}
                    className="flex items-center gap-2 hover:text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    {new Date(letter.letter_date).toLocaleDateString(
                      language === "uk" ? "uk-UA" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </button>
                  <button
                    onClick={() => navigate(getLocalizedPath(`/library/letters?location=${encodeURIComponent(letter.location_en)}`))}
                    className="flex items-center gap-2 hover:text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    {location}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reference та адреса */}
          {(letter.reference || letter.address_block) && (
            <div className="space-y-4 mt-4">
              {letter.reference && (
                <div>
                  <Badge variant="outline">Reference: {letter.reference}</Badge>
                </div>
              )}

              {letter.address_block && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    АДРЕСА:
                  </div>
                  <div className="text-sm whitespace-pre-line font-mono text-muted-foreground">
                    {letter.address_block}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Текст листа */}
        {isEditing && editedLetter ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-muted/20">
                <label className="text-sm text-muted-foreground mb-2 block">Текст UA</label>
                <EnhancedInlineEditor
                  content={editedLetter.content_uk}
                  onChange={(html) => setEditedLetter({ ...editedLetter, content_uk: html })}
                  label="Редагувати текст UA"
                />
              </div>
              <div className="border rounded-lg p-4 bg-muted/20">
                <label className="text-sm text-muted-foreground mb-2 block">Content EN</label>
                <EnhancedInlineEditor
                  content={editedLetter.content_en}
                  onChange={(html) => setEditedLetter({ ...editedLetter, content_en: html })}
                  label="Edit content EN"
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: language === "uk" && letter.content_uk
                ? letter.content_uk
                : letter.content_en
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};
