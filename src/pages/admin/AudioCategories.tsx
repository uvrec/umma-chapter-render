import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface AudioCategory {
  id: string;
  name_ua: string;
  name_en: string;
  slug: string;
  description_ua?: string | null;
  description_en?: string | null;
  icon?: string | null;
  display_order: number;
}

type FormState = {
  name_ua: string;
  name_en: string;
  slug: string;
  description_ua: string;
  description_en: string;
  icon: string;
  display_order: number;
};

function generateSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[ʼ'’`"]/g, "") // апострофи
    .replace(/[^a-z0-9\s-]/g, "") // тільки латиниця/цифри/пробіли/дефіс
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AudioCategories() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);
  const [editingCategory, setEditingCategory] = useState<AudioCategory | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    name_ua: "",
    name_en: "",
    slug: "",
    description_ua: "",
    description_en: "",
    icon: "",
    display_order: 0,
  });

  const IconPreview = useMemo(() => {
    const Raw = (Icons as any)[formData.icon] as React.ComponentType<any> | undefined;
    return Raw ?? Icons.Tags;
  }, [formData.icon]);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["audio-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as AudioCategory[];
    },
    staleTime: 60_000,
  });

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name_ua: "",
      name_en: "",
      slug: "",
      description_ua: "",
      description_en: "",
      icon: "",
      display_order: 0,
    });
    setIsCheckingSlug(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const openCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (category: AudioCategory) => {
    setEditingCategory(category);
    setFormData({
      name_ua: category.name_ua ?? "",
      name_en: category.name_en ?? "",
      slug: category.slug ?? "",
      description_ua: category.description_ua ?? "",
      description_en: category.description_en ?? "",
      icon: category.icon ?? "",
      display_order: category.display_order ?? 0,
    });
    setIsDialogOpen(true);
  };

  async function slugExists(slug: string, excludeId?: string) {
    setIsCheckingSlug(true);
    try {
      let q = supabase.from("audio_categories").select("id").eq("slug", slug);
      if (excludeId) {
        q = q.neq("id", excludeId);
      }
      const { data, error } = await q.limit(1);
      if (error) throw error;
      return (data?.length ?? 0) > 0;
    } finally {
      setIsCheckingSlug(false);
    }
  }

  const saveMutation = useMutation({
    mutationFn: async (data: FormState) => {
      // валідація
      if (!data.name_ua.trim() || !data.name_en.trim()) {
        throw new Error("Назви (UA/EN) обов’язкові");
      }
      if (!data.slug.trim()) {
        throw new Error("Slug обов’язковий");
      }
      // унікальність slug
      if (await slugExists(data.slug, editingCategory?.id)) {
        throw new Error("Такий slug уже існує");
      }

      const payload = {
        name_ua: data.name_ua.trim(),
        name_en: data.name_en.trim(),
        slug: data.slug.trim(),
        description_ua: data.description_ua.trim() || null,
        description_en: data.description_en.trim() || null,
        icon: data.icon.trim() || null,
        display_order: Number.isFinite(data.display_order) ? data.display_order : 0,
      };

      if (editingCategory) {
        const { error } = await supabase.from("audio_categories").update(payload).eq("id", editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("audio_categories").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio-categories"] });
      toast.success(editingCategory ? "Категорію оновлено" : "Категорію створено");
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Не вдалось зберегти");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("audio_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio-categories"] });
      toast.success("Категорію видалено");
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Не вдалось видалити");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/admin/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Категорії аудіо</h1>

        <Dialog open={isDialogOpen} onOpenChange={(o) => (o ? openCreate() : handleCloseDialog())}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Додати категорію
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Редагувати категорію" : "Нова категорія"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_ua">Назва (UA) *</Label>
                  <Input
                    id="name_ua"
                    value={formData.name_ua}
                    onChange={(e) => setFormData((s) => ({ ...s, name_ua: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">Назва (EN) *</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData((s) => ({ ...s, name_en: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto_auto] items-end gap-2">
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((s) => ({ ...s, slug: e.target.value }))}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6"
                  onClick={() =>
                    setFormData((s) => ({
                      ...s,
                      slug: s.slug || generateSlug(s.name_ua || s.name_en),
                    }))
                  }
                >
                  Згенерувати
                </Button>
                {isCheckingSlug && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> перевірка…
                  </div>
                )}
              </div>

              <div className="grid grid-cols-[1fr_auto] items-end gap-3">
                <div>
                  <Label htmlFor="icon">Іконка (Lucide)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData((s) => ({ ...s, icon: e.target.value }))}
                    placeholder="Mic, Music, Radio, Headphones ..."
                  />
                </div>
                <div className="flex items-center justify-center h-10 rounded border">
                  <IconPreview className="w-5 h-5 opacity-80" />
                </div>
              </div>

              <div>
                <Label htmlFor="display_order">Порядок відображення</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData((s) => ({ ...s, display_order: parseInt(e.target.value || "0", 10) }))}
                />
                <p className="text-xs text-muted-foreground mt-1">Менше число — вище у списку.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description_ua">Опис (UA)</Label>
                  <Textarea
                    id="description_ua"
                    value={formData.description_ua}
                    onChange={(e) => setFormData((s) => ({ ...s, description_ua: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">Опис (EN)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData((s) => ({ ...s, description_en: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Скасувати
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Збереження…
                    </>
                  ) : (
                    "Зберегти"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Завантаження…
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-4">
          {categories.map((category) => {
            const Icon = (Icons as any)[category.icon ?? ""] ?? Icons.Tags;
            return (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5 opacity-80" />
                    <span className="font-semibold">{category.name_ua}</span>
                    <span className="text-muted-foreground">/ {category.name_en}</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Видалити цю категорію?")) {
                          deleteMutation.mutate(category.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="text-foreground">Slug:</span> {category.slug}
                  </p>
                  {category.icon && (
                    <p>
                      <span className="text-foreground">Іконка:</span> {category.icon}
                    </p>
                  )}
                  <p>
                    <span className="text-foreground">Порядок:</span> {category.display_order}
                  </p>
                  {category.description_ua && (
                    <p>
                      <span className="text-foreground">Опис:</span> {category.description_ua}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center text-muted-foreground">
          Категорій поки немає. Створіть першу через кнопку «Додати категорію».
        </Card>
      )}
    </div>
  );
}
