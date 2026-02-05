import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2, MoreHorizontal } from "lucide-react";
import * as Icons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface AudioCategory {
  id: string;
  name_uk: string;
  name_en: string;
  slug: string;
  description_uk?: string | null;
  description_en?: string | null;
  icon?: string | null;
  display_order: number;
}

type FormState = {
  name_uk: string;
  name_en: string;
  slug: string;
  description_uk: string;
  description_en: string;
  icon: string;
  display_order: number;
};

function generateSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[ʼ''`"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AudioCategories() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AudioCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<AudioCategory | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    name_uk: "",
    name_en: "",
    slug: "",
    description_uk: "",
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
      name_uk: "",
      name_en: "",
      slug: "",
      description_uk: "",
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
      name_uk: category.name_uk ?? "",
      name_en: category.name_en ?? "",
      slug: category.slug ?? "",
      description_uk: category.description_uk ?? "",
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
      if (!data.name_uk.trim() || !data.name_en.trim()) {
        throw new Error("Назви (UA/EN) обов'язкові");
      }
      if (!data.slug.trim()) {
        throw new Error("Slug обов'язковий");
      }
      if (await slugExists(data.slug, editingCategory?.id)) {
        throw new Error("Такий slug уже існує");
      }

      const payload = {
        name_uk: data.name_uk.trim(),
        name_en: data.name_en.trim(),
        slug: data.slug.trim(),
        description_uk: data.description_uk.trim() || null,
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
      setDeleteCategory(null);
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Не вдалось видалити");
      setDeleteCategory(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Категорії аудіо" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Категорії аудіо</h1>
            <p className="text-muted-foreground text-sm">
              {categories?.length || 0} категорій
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Додати категорію
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Завантаження…
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Іконка</TableHead>
                  <TableHead>Назва</TableHead>
                  <TableHead className="w-[120px]">Slug</TableHead>
                  <TableHead className="w-[80px]">Порядок</TableHead>
                  <TableHead className="w-[80px] text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const Icon = (Icons as any)[category.icon ?? ""] ?? Icons.Tags;
                  return (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <Icon className="w-4 h-4 opacity-70" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{category.name_uk}</div>
                          <div className="text-sm text-muted-foreground">{category.name_en}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        {category.display_order}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteCategory(category)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Видалити
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">Категорій поки немає</p>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Створити першу категорію
            </Button>
          </div>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(o) => (o ? null : handleCloseDialog())}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Редагувати категорію" : "Нова категорія"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name_uk">Назва (UK) *</Label>
                <Input
                  id="name_uk"
                  value={formData.name_uk}
                  onChange={(e) => setFormData((s) => ({ ...s, name_uk: e.target.value }))}
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
                    slug: s.slug || generateSlug(s.name_uk || s.name_en),
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
              <div className="flex items-center justify-center h-10 w-10 rounded border">
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
                <Label htmlFor="description_uk">Опис (UK)</Label>
                <Textarea
                  id="description_uk"
                  value={formData.description_uk}
                  onChange={(e) => setFormData((s) => ({ ...s, description_uk: e.target.value }))}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити категорію?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCategory && (
                <span className="block mb-2 font-medium text-foreground">
                  «{deleteCategory.name_uk}»
                </span>
              )}
              Ця дія видалить категорію назавжди.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCategory && deleteMutation.mutate(deleteCategory.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
