import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function BlogTags() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nameUa, setNameUa] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");

  const { data: tags, refetch } = useQuery({
    queryKey: ["blog-tags-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_tags")
        .select("*")
        .order("name_ua");
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (tag: any) => {
    setEditId(tag.id);
    setNameUa(tag.name_ua);
    setNameEn(tag.name_en);
    setSlug(tag.slug);
    setOpen(true);
  };

  const handleReset = () => {
    setEditId(null);
    setNameUa("");
    setNameEn("");
    setSlug("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagData = {
      name_ua: nameUa,
      name_en: nameEn,
      slug: slug || generateSlug(nameUa),
    };

    try {
      if (editId) {
        const { error } = await supabase
          .from("blog_tags")
          .update(tagData)
          .eq("id", editId);
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
    } catch (error) {
      console.error('Error saving tag:', error);
      toast({ title: "Помилка збереження", variant: "destructive" });
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Теги блогу</h1>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) handleReset(); }}>
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
            {tags?.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name_ua}</TableCell>
                <TableCell>{tag.name_en}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell>{tag.post_count || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tag.id)}
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
