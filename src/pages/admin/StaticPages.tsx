import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface StaticPageMetadata {
  id: string;
  slug: string;
  title_ua: string;
  title_en: string;
  meta_description_ua?: string;
  meta_description_en?: string;
  hero_image_url?: string;
  og_image?: string;
  seo_keywords?: string;
}

const StaticPages = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<StaticPageMetadata | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title_ua: "",
    title_en: "",
    meta_description_ua: "",
    meta_description_en: "",
    hero_image_url: "",
    og_image: "",
    seo_keywords: "",
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const { data: pages, isLoading } = useQuery({
    queryKey: ["static-pages-metadata"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("static_page_metadata")
        .select("*")
        .order("slug");

      if (error) throw error;
      return data as StaticPageMetadata[];
    },
    enabled: !!user && isAdmin,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<StaticPageMetadata> & { id: string }) => {
      const { error } = await supabase
        .from("static_page_metadata")
        .update(data)
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["static-pages-metadata"] });
      toast({
        title: "Успіх",
        description: "Метадані оновлено",
      });
      setIsDialogOpen(false);
      setEditingPage(null);
    },
    onError: () => {
      toast({
        title: "Помилка",
        description: "Не вдалося оновити метадані",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<StaticPageMetadata, "id">) => {
      const { error } = await supabase
        .from("static_page_metadata")
        .insert(data);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["static-pages-metadata"] });
      toast({
        title: "Успіх",
        description: "Нову сторінку створено",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Помилка",
        description: "Не вдалося створити сторінку",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("static_page_metadata")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["static-pages-metadata"] });
      toast({
        title: "Успіх",
        description: "Сторінку видалено",
      });
    },
    onError: () => {
      toast({
        title: "Помилка",
        description: "Не вдалося видалити сторінку",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title_ua: "",
      title_en: "",
      meta_description_ua: "",
      meta_description_en: "",
      hero_image_url: "",
      og_image: "",
      seo_keywords: "",
    });
    setEditingPage(null);
  };

  const handleEdit = (page: StaticPageMetadata) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title_ua: page.title_ua,
      title_en: page.title_en,
      meta_description_ua: page.meta_description_ua || "",
      meta_description_en: page.meta_description_en || "",
      hero_image_url: page.hero_image_url || "",
      og_image: page.og_image || "",
      seo_keywords: page.seo_keywords || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      updateMutation.mutate({ ...formData, id: editingPage.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-8">Завантаження...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <h1 className="text-3xl font-bold">Статичні сторінки</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Додати сторінку
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPage ? "Редагувати метадані" : "Нова статична сторінка"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="contact"
                      disabled={!!editingPage}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="title_ua">Назва (UA)</Label>
                    <Input
                      id="title_ua"
                      value={formData.title_ua}
                      onChange={(e) => setFormData({ ...formData, title_ua: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="title_en">Назва (EN)</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta_description_ua">Мета-опис (UA)</Label>
                    <Textarea
                      id="meta_description_ua"
                      value={formData.meta_description_ua}
                      onChange={(e) => setFormData({ ...formData, meta_description_ua: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta_description_en">Мета-опис (EN)</Label>
                    <Textarea
                      id="meta_description_en"
                      value={formData.meta_description_en}
                      onChange={(e) => setFormData({ ...formData, meta_description_en: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero_image_url">Hero Image URL</Label>
                    <Input
                      id="hero_image_url"
                      value={formData.hero_image_url}
                      onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="og_image">OG Image URL</Label>
                    <Input
                      id="og_image"
                      value={formData.og_image}
                      onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo_keywords">SEO Keywords</Label>
                    <Input
                      id="seo_keywords"
                      value={formData.seo_keywords}
                      onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      Зберегти
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {pages?.map((page) => (
              <Card key={page.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{page.title_ua}</h3>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        /{page.slug}
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {page.title_en}
                    </p>
                    {page.meta_description_ua && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {page.meta_description_ua}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(page)}
                    >
                      Редагувати
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Ви впевнені, що хочете видалити цю сторінку?")) {
                          deleteMutation.mutate(page.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaticPages;
