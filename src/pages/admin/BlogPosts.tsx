import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

export default function BlogPosts() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: posts, refetch } = useQuery({
    queryKey: ["admin-blog-posts", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select(`
          *,
          category:blog_categories(name_ua, name_en)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter === "published") {
        query = query.eq("is_published", true);
      } else if (statusFilter === "draft") {
        query = query.eq("is_published", false).is("scheduled_publish_at", null);
      } else if (statusFilter === "scheduled") {
        query = query.eq("is_published", false).not("scheduled_publish_at", "is", null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей пост?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({ title: "Помилка видалення", variant: "destructive" });
    } else {
      toast({ title: "Пост видалено" });
      refetch();
    }
  };

  const filteredPosts = posts?.filter((post) => {
    const title = language === "ua" ? post.title_ua : post.title_en;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Керування постами блогу</h1>
        <Link to="/admin/blog-posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Новий пост
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Шукати пости..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі пости</SelectItem>
            <SelectItem value="published">Опубліковані</SelectItem>
            <SelectItem value="draft">Чернетки</SelectItem>
            <SelectItem value="scheduled">Заплановані</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Зображення</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Категорія</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Перегляди</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {language === "ua" ? post.title_ua : post.title_en}
                </TableCell>
                <TableCell>
                  {post.category
                    ? language === "ua"
                      ? post.category.name_ua
                      : post.category.name_en
                    : "-"}
                </TableCell>
                <TableCell>
                  {post.is_published ? (
                    <Badge>Опубліковано</Badge>
                  ) : post.scheduled_publish_at ? (
                    <Badge variant="secondary">Заплановано</Badge>
                  ) : (
                    <Badge variant="outline">Чернетка</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(post.created_at).toLocaleDateString("uk-UA")}
                </TableCell>
                <TableCell>{post.view_count || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/blog/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/admin/blog-posts/${post.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
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
