// src/pages/admin/BlogTags.tsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateSlug } from "@/utils/blogHelpers";

type BlogTag = {
  id: string;
  name_ua: string;
  name_en: string;
  slug: string;
  post_count?: number | null;
};

export default function BlogTags() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // форма
  const [nameUa, setNameUa] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true); // якщо користувач сам змінить slug — вимикаємо автогенерацію

  // пошук
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const {
    data: tags,
    refetch,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blog-tags-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_tags").select("*").order("name_ua");
      if (error) throw error;
      return data as BlogTag[];
    },
  });

  const handleEdit = (tag: BlogTag) => {
    setEditId(tag.id);
    setNameUa(tag.name_ua);
    setNameEn(tag.name_en);
    setSlug(tag.slug);
    setAutoSlug(false); // при редагуванні існуючого — не чіпаємо slug автоматично
    setOpen(true);
  };

  const handleReset = () => {
    setEditId(null);
    setNameUa("");
    setNameEn("");
    setSlug("");
    setAutoSlug(true);
  };

  // автогенерація slug з української назви (лише якщо користувач сам не правив slug)
  useEffect(() => {
    if (autoSlug) {
      setSlug(generateSlug(nameUa));
    }
  }, [nameUa, autoSlug]);

  const handleSlugManualChange = (v: string) => {
    setSlug(v);
    if (v !== generateSlug(nameUa)) {
      setAutoSlug(false);
    } else if (!editId) {
      setAutoSlug(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameUa || !nameEn) {
      toast({ title: "Заповніть назви українською та англійською", variant: "destructive" });
      return;
    }

    const tagData = {
      name_ua: nameUa,
      name_en: nameEn,
      slug: slug || generateSlug(nameUa),
    };

    try {
      if (editId) {
        const { error } = await supabase.from("blog_tags").update(tagData).eq("id", editId);
        if (error) throw error;
        toast({ title: "Тег оновлено" });
      } else {
        const { error } = await supabase.from("blog_tags").insert(tagData);
        if (error) throw error;
        toast({ title: "Тег створено" });
      }
      setOpen(false);
      handleReset();
      refetch();
    } catch (err: any) {
      console.error("Error saving tag:", err);
      toast({
        title: "Помилка збереження",
        description: err?.message || "Спробуйте ще раз",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити тег?")) return;

    const { error } = await supabase.from("blog_tags").delete().eq("id", id);

    if (error) {
      toast({ title: "Помилка видалення", variant: "destructive" });
    } else {
      toast({ title: "Тег видалено" });
      refetch();
    }
  };

  const filtered = useMemo(() => {
    if (!tags) return [];
    if (!debouncedSearch) return tags;
    return tags.filter((t) => {
      const ua = (t.name_ua || "").toLowerCase();
      const en = (t.name_en || "").toLowerCase();
      const sl = (t.slug || "").toLowerCase();
      return ua.includes(debouncedSearch) || en.includes(debouncedSearch) || sl.includes(debouncedSearch);
    });
  }, [tags, debouncedSearch]);

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto py-8">
      {/* Хедер дій */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Теги блогу</h1>
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) handleReset();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Новий тег
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Редагувати" : "Створити"} тег</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name-ua">Назва (UA)</Label>
                  <Input id="name-ua" value={nameUa} onChange={(e) => setNameUa(e.target.value)} required />
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
                  onChange={(e) => handleSlugManualChange(e.target.value)}
                  placeholder="Згенерується автоматично"
                />
                {autoSlug ? (
                  <p className="mt-1 text-xs text-muted-foreground">Slug генерується автоматично з назви (UA)</p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">Автогенерацію вимкнено (вручну відредаговано)</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                {editId ? "Оновити" : "Створити"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Пошук */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Пошук тегів (UA/EN/slug)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Таблиця */}
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
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Завантаження…
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-destructive">
                  Помилка: {(error as any)?.message || "не вдалося завантажити"}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Нічого не знайдено
                </TableCell>
              </TableRow>
            )}

            {filtered.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name_ua}</TableCell>
                <TableCell>{tag.name_en}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell>{tag.post_count ?? 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(tag)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(tag.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
