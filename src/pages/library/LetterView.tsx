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


export const LetterView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  // Мовні налаштування
  const [language, setLanguage] = useState<"ua" | "en">("ua");

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState<{
    recipient_ua: string;
    recipient_en: string;
    location_ua: string;
    location_en: string;
    content_ua: string;
    content_en: string;
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
      if (editedLetter.recipient_ua !== letter.recipient_ua) updates.recipient_ua = editedLetter.recipient_ua;
      if (editedLetter.recipient_en !== letter.recipient_en) updates.recipient_en = editedLetter.recipient_en;
      if (editedLetter.location_ua !== letter.location_ua) updates.location_ua = editedLetter.location_ua;
      if (editedLetter.location_en !== letter.location_en) updates.location_en = editedLetter.location_en;
      if (editedLetter.content_ua !== letter.content_ua) updates.content_ua = editedLetter.content_ua;
      if (editedLetter.content_en !== letter.content_en) updates.content_en = editedLetter.content_en;

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
      recipient_ua: letter.recipient_ua || "",
      recipient_en: letter.recipient_en,
      location_ua: letter.location_ua || "",
      location_en: letter.location_en,
      content_ua: letter.content_ua || "",
      content_en: letter.content_en,
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
            <Button onClick={() => navigate("/library/letters")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Повернутися до списку
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recipient = language === "ua" && letter.recipient_ua
    ? letter.recipient_ua
    : letter.recipient_en;

  const location = language === "ua" && letter.location_ua
    ? letter.location_ua
    : letter.location_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Навігація */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/library/letters")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            До списку листів
          </Button>

          <div className="flex gap-2">
            <Button
              variant={language === "ua" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("ua")}
            >
              Українська
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
          </div>
        </div>

        {/* Admin Edit Header */}
        {isAdmin && (
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 mb-4 -mx-4 px-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <span className="text-sm text-muted-foreground">
                    Режим редагування
                  </span>
                )}
              </div>
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
            </div>
          </div>
        )}

        {/* Метадані листа */}
        <div className="mb-8">
          {isEditing && editedLetter ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Отримувач UA</label>
                  <Input
                    value={editedLetter.recipient_ua}
                    onChange={(e) => setEditedLetter({ ...editedLetter, recipient_ua: e.target.value })}
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
                    value={editedLetter.location_ua}
                    onChange={(e) => setEditedLetter({ ...editedLetter, location_ua: e.target.value })}
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
                  {new Date(letter.letter_date).toLocaleDateString("uk-UA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 mb-4">
              <User className="w-6 h-6 mt-1 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">Лист до {recipient}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(letter.letter_date).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </div>
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
                  content={editedLetter.content_ua}
                  onChange={(html) => setEditedLetter({ ...editedLetter, content_ua: html })}
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
              __html: language === "ua" && letter.content_ua
                ? letter.content_ua
                : letter.content_en
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};
