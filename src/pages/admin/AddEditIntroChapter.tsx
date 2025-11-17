import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
import { z } from "zod";

// ——— helpers
const nonEmpty = (s: string) => (s ?? "").trim();
const safeInt = (v: string | number, fallback = 0) => {
  const n = typeof v === "number" ? v : parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};
const slugify = (s: string) =>
  nonEmpty(s)
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-zа-щьюяґєії0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

// ——— схема валідації
const IntroChapterSchema = z.object({
  title_ua: z.string().trim().min(1, "Назва (ua) обовʼязкова"),
  title_en: z.string().trim().min(1, "Назва (en) обовʼязкова"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug обовʼязковий")
    .regex(/^[a-z0-9-]+$/i, "Slug: лише літери, цифри та дефіс"),
  display_order: z.number().int().min(0).optional().default(0),
  content_ua: z.string().optional().default(""),
  content_en: z.string().optional().default(""),
});

type IntroForm = z.infer<typeof IntroChapterSchema>;

export default function AddEditIntroChapter() {
  const { bookId, id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();
  const isEdit = !!id;

  // ——— state
  const [form, setForm] = useState<IntroForm>({
    title_ua: "",
    title_en: "",
    slug: "",
    content_ua: "",
    content_en: "",
    display_order: 0,
  });

  // ——— guard
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth", { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const canQuery = Boolean(user && isAdmin);
  const canQueryBook = canQuery && Boolean(bookId);
  const canQueryIntro = canQuery && isEdit && Boolean(id);

  // ——— book
  const {
    data: book,
    isLoading: bookLoading,
    isError: bookError,
  } = useQuery({
    queryKey: ["admin:book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("id", bookId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: canQueryBook,
    staleTime: 60_000,
  });

  // ——— intro chapter (edit)
  const {
    data: intro,
    isLoading: introLoading,
    isError: introError,
  } = useQuery({
    queryKey: ["admin:intro-chapter", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("intro_chapters").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: canQueryIntro,
    staleTime: 0,
  });

  useEffect(() => {
    if (intro) {
      setForm({
        title_ua: intro.title_ua || "",
        title_en: intro.title_en || "",
        content_ua: intro.content_ua || "",
        content_en: intro.content_en || "",
        slug: intro.slug || "",
        display_order: intro.display_order ?? 0,
      });
    }
  }, [intro]);

  // ——— автослаг: якщо користувач ще не чіпав slug
  useEffect(() => {
    if (!isEdit && !nonEmpty(form.slug) && nonEmpty(form.title_ua)) {
      setForm((f) => ({ ...f, slug: slugify(f.title_ua) }));
    }
  }, [form.title_ua, form.slug, isEdit]);

  // ——— мутація
  const saveMutation = useMutation({
    mutationFn: async (payload: IntroForm) => {
      const parsed = IntroChapterSchema.safeParse({
        ...payload,
        display_order: safeInt(payload.display_order ?? 0, 0),
      });
      if (!parsed.success) {
        const msg = parsed.error.errors[0]?.message ?? "Невалідні дані форми";
        throw new Error(msg);
      }
      const dataToSave = {
        ...parsed.data,
        // trimmed версії
        title_ua: nonEmpty(parsed.data.title_ua),
        title_en: nonEmpty(parsed.data.title_en),
        slug: nonEmpty(parsed.data.slug),
      };

      if (isEdit) {
        const { error } = await supabase
          .from("intro_chapters")
          .update({ ...dataToSave, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("intro_chapters").insert([{ ...dataToSave, book_id: bookId }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin:intro-chapters", bookId] });
      toast({
        title: "Успіх",
        description: isEdit ? "Главу оновлено" : "Главу створено",
      });
      navigate(`/admin/intro-chapters/${bookId}`, { replace: true });
    },
    onError: (err: any) => {
      toast({
        title: "Помилка",
        description: err?.message ?? "Не вдалося зберегти",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const isLoading = bookLoading || introLoading;
  const hasError = bookError || introError;

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link to={`/admin/intro-chapters/${bookId}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Назад
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Редагувати" : "Додати"} вступну главу{book?.title_ua ? ` — ${book.title_ua}` : ""}
        </h1>
      </div>

      {isLoading && (
        <Card className="max-w-3xl">
          <CardContent className="py-10 text-muted-foreground">Завантаження…</CardContent>
        </Card>
      )}

      {hasError && (
        <Card className="max-w-3xl">
          <CardContent className="py-10 text-destructive">Не вдалося завантажити дані.</CardContent>
        </Card>
      )}

      {!isLoading && !hasError && (
        <Card>
          <CardHeader>
            <CardTitle>Інформація про главу</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_ua">Назва (українською) *</Label>
                  <Input
                    id="title_ua"
                    value={form.title_ua}
                    onChange={(e) => setForm((f) => ({ ...f, title_ua: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">Назва (англійською) *</Label>
                  <Input
                    id="title_en"
                    value={form.title_en}
                    onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder="preface"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Дозволено: літери, цифри, дефіс. Формується з назви автоматично, але можна відредагувати.
                  </p>
                </div>
                <div>
                  <Label htmlFor="display_order">Порядок відображення</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={String(form.display_order ?? 0)}
                    onChange={(e) => setForm((f) => ({ ...f, display_order: safeInt(e.target.value, 0) }))}
                    min={0}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>Контент (українською)</Label>
                <EnhancedInlineEditor
                  content={form.content_ua}
                  onChange={(html) => setForm((f) => ({ ...f, content_ua: html }))}
                  label="Редагувати контент українською"
                />
              </div>

              <div>
                <Label>Контент (англійською)</Label>
                <EnhancedInlineEditor
                  content={form.content_en}
                  onChange={(html) => setForm((f) => ({ ...f, content_en: html }))}
                  label="Редагувати контент англійською"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Збереження..." : "Зберегти"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/admin/intro-chapters/${bookId}`)}>
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
