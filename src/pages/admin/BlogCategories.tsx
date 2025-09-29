import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateSlug } from "@/utils/blogHelpers";

export default function BlogCategories() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nameUa, setNameUa] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [descUa, setDescUa] = useState("");
  const [descEn, setDescEn] = useState("");

  const { data: categories, refetch } = useQuery({
    queryKey: ["blog-categories-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name_ua");
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (category: any) => {
    setEditId(category.id);
    setNameUa(category.name_ua);
    setNameEn(category.name_en);
    setSlug(category.slug);
    setDescUa(category.description_ua || "");
    setDescEn(category.description_en || "");
    setOpen(true);
  };

  const handleReset = () => {
    setEditId(null);
    setNameUa("");
    setNameEn("");
    setSlug("");
    setDescUa("");
    setDescEn("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      name_ua: nameUa,
      name_en: nameEn,
      slug: slug || generateSlug(nameUa),
      description_ua: descUa,
      description_en: descEn,
    };

    try {
      if (editId) {
        const { error } = await supabase
          .from("blog_categories")
          .update(categoryData)
          .eq("id", editId);
        if (error) throw error;
        toast({ title: "Категорію оновлено" });
      } else {
        const { error } = await supabase
          .from("blog_categories")
          .insert(categoryData);
        if (error) throw error;
        toast({ title: "Категорію створено" });
      }
      setOpen(false);
      handleReset();
      refetch();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ title: "Помилка збереження", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити категорію?")) return;

    const { error } = await supabase.from("blog_categories").delete().eq("id", id);

    if (error) {
      toast({ title: "Помилка видалення", variant: "destructive" });
    } else {
      toast({ title: "Категорію видалено" });
      refetch();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Категорії блогу</h1>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) handleReset(); }}>
          <DialogTrigger asChild>
            <Button>
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name-en">Name (EN)</Label>
                  <Input
                    id="name-en"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Згенерується автоматично"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="desc-ua">Опис (UA)</Label>
                  <Textarea
                    id="desc-ua"
                    value={descUa}
                    onChange={(e) => setDescUa(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="desc-en">Description (EN)</Label>
                  <Textarea
                    id="desc-en"
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editId ? "Оновити" : "Створити"}
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
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name_ua}</TableCell>
                <TableCell>{category.name_en}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.post_count || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
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
