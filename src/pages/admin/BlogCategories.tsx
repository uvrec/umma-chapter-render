import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateSlug } from "@/utils/blogHelpers";

type CategoryRow = {
  id: string;
  name_ua: string;
  name_en: string;
  slug: string;
  description_ua?: string | null;
  description_en?: string | null;
  // nested count через звʼязок blog_posts
  blog_posts?: { count: number }[];
};

export default function BlogCategories() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [nameUa, setNameUa] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [descUa, setDescUa] = useState("");
  const [descEn, setDescEn] = useState("");

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["blog-categories-admin"],
    // ВАЖЛИВО: тут я підтягую count постів через релейшн `blog_posts`
    // Якщо у тебе інша назва FK-реляції — підправ її тут.
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("id, name_ua, name_en, slug, description_ua, description_en, blog_posts(count)")
        .order("name_ua");

      if (error) throw error;
      return data as CategoryRow[];
    },
  });

  const rows = useMemo(
    () =>
      (categories || []).map((c) => ({
        ...c,
        post_count: c.blog_posts?.[0]?.count ?? 0,
      })),
    [categories],
  );

  const resetForm = () => {
    setEditId(null);
    setNameUa("");
    setNameEn("");
    setSlug("");
    setDescUa("");
    setDescEn("");
  };

  const handleEdit = (category: CategoryRow & { post_count?: number }) => {
    setEditId(category.id);
    setNameUa(category.name_ua);
    setNameEn(category.name_en);
    setSlug(category.slug);
    setDescUa(category.description_ua || "");
    setDescEn(category.description_en || "");
    setOpen(true);
  };

  const handleDialogChange = (val: boolean) => {
    setOpen(val);
    if (!val) resetForm();
  };

  // Проста перевірка slug
  const isValidSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

  const ensureSlug = async (base: string, currentId?: string | null) => {
    // 1) якщо порожньо — генеруємо
    let s = (slug || generateSlug(base || "")).trim();

    // 2) якщо невалідний — підчистимо
    if (!isValidSlug(s)) {
      s = generateSlug(base || s);
    }
    if (!s) s = "category";

    // 3) зробимо унікальним (перевірка в БД)
    let candidate = s;
    let i = 1;
    // простий цикл: додаємо -2, -3, ...
    // щоб уникати конфлікту з поточним записом, виключаємо currentId при редагуванні
    // (припускаю унікальний індекс на blog_categories.slug)
    // 5 спроб зазвичай більш ніж достатньо
    while (i < 10) {
      const { data, error } = await supabase.from("blog_categories").select("id").eq("slug", candidate).limit(1);

      if (error) break; // не блокуємо збереження якщо помилка селекту

      const conflict = (data || []).filter((r) => r.id !== currentId);
      if (conflict.length === 0) return candidate;

      i++;
      candidate = `${s}-${i}`;
    }
    return candidate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Мін-валідатор
    if (!nameUa.trim() || !nameEn.trim()) {
      toast({ title: "Заповніть назви українською та англійською", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const finalSlug = await ensureSlug(nameUa, editId);

      const categoryData = {
        name_ua: nameUa.trim(),
        name_en: nameEn.trim(),
        slug: finalSlug,
        description_ua: descUa.trim() || null,
        description_en: descEn.trim() || null,
      };

      if (editId) {
        const { error } = await supabase.from("blog_categories").update(categoryData).eq("id", editId);
        if (error) throw error;
        toast({ title: "Категорію оновлено" });
      } else {
        const { error } = await supabase.from("blog_categories").insert(categoryData);
        if (error) throw error;
        toast({ title: "Категорію створено" });
      }

      setOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({ title: "Помилка збереження", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: { id: string; name_ua: string; post_count: number }) => {
    if (row.post_count > 0) {
      toast({
        title: "Неможливо видалити",
        description: `У категорії «${row.name_ua}» є пости (${row.post_count}). Спочатку перенесіть або видаліть пости.`,
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Видалити категорію «${row.name_ua}»?`)) return;

    setDeletingId(row.id);
    const { error } = await supabase.from("blog_categories").delete().eq("id", row.id);
    setDeletingId(null);

    if (error) {
      toast({ title: "Помилка видалення", variant: "destructive" });
    } else {
      toast({ title: "Категорію видалено" });
      refetch();
    }
  };

  const fillSlugIfEmpty = () => {
    if (!slug.trim() && nameUa.trim()) {
      setSlug(generateSlug(nameUa.trim()));
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Категорії блогу</h1>

        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Нова категорія
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editId ? "Редагувати" : "Створити"} категорію</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name-ua">Назва (UA)</Label>
                  <Input
                    id="name-ua"
                    value={nameUa}
                    onChange={(e) => setNameUa(e.target.value)}
                    onBlur={fillSlugIfEmpty}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name-en">Name (EN)</Label>
                  <Input id="name-en" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
                </div>
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  placeholder="Згенерується автоматично"
                  onBlur={() => setSlug((s) => generateSlug(s || nameUa))}
                />
                {slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && (
                  <p className="text-xs text-destructive mt-1">Лише латиниця/цифри та тире (lowercase).</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="desc-ua">Опис (UA)</Label>
                  <Textarea id="desc-ua" value={descUa} onChange={(e) => setDescUa(e.target.value)} rows={3} />
                </div>
                <div>
                  <Label htmlFor="desc-en">Description (EN)</Label>
                  <Textarea id="desc-en" value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={3} />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Збереження..." : editId ? "Оновити" : "Створити"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Назва (UA)</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Постів</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>Завантаження...</TableCell>
              </TableRow>
            )}

            {!isLoading &&
              rows.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name_ua}</TableCell>
                  <TableCell>{category.name_en}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.post_count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(category as any)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === category.id}
                        onClick={() =>
                          handleDelete({
                            id: category.id,
                            name_ua: category.name_ua,
                            post_count: category.post_count,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Немає категорій
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
