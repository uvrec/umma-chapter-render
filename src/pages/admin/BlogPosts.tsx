import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

type BlogPostRow = {
  id: string;
  slug: string;
  title_ua: string | null;
  title_en: string | null;
  is_published: boolean;
  scheduled_publish_at: string | null;
  created_at: string;
  view_count: number | null;
  featured_image: string | null;
  author_name?: string | null;
  category?: { name_ua: string | null; name_en: string | null } | null;
};

export default function BlogPosts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [page, setPage] = useState(1);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // основний запит
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-blog-posts", statusFilter, debounced, page, PAGE_SIZE],
    queryFn: async () => {
      // базовий селект із категорією
      let query = supabase
        .from("blog_posts")
        .select(
          `
          *,
          category:blog_categories(name_ua, name_en)
        `,
          { count: "exact" }, // ← важливо для total
        )
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      // статус фільтр — на сервері
      if (statusFilter === "published") {
        query = query.eq("is_published", true);
      } else if (statusFilter === "draft") {
        // чернетка = не опубліковано і не заплановано
        query = query.eq("is_published", false).is("scheduled_publish_at", null);
      } else if (statusFilter === "scheduled") {
        query = query.eq("is_published", false).not("scheduled_publish_at", "is", null);
      }

      // пошук і по UA, і по EN
      if (debounced) {
        query = query.or(`title_ua.ilike.%${debounced}%,title_en.ilike.%${debounced}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        rows: (data || []) as BlogPostRow[],
        total: count ?? 0,
      };
    },
    keepPreviousData: true,
  });

  const total = data?.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  useEffect(() => {
    // при зміні фільтру/пошуку скидаємо на 1 сторінку
    setPage(1);
  }, [statusFilter, debounced]);

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

  const rows = data?.rows ?? [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Керування постами блогу</h1>
        <Link to="/admin/blog-posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Новий пост
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Шукати за заголовком (UA/EN)…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[220px]">
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

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[84px]">Зображення</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Категорія</TableHead>
              <TableHead>Автор</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Перегляди</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((post) => {
              const title = (post.title_ua || post.title_en || "—").trim();
              const date = post.created_at ? new Date(post.created_at).toLocaleDateString("uk-UA") : "—";
              const cat = post.category?.name_ua ?? post.category?.name_en ?? "—";
              const views = post.view_count ?? 0;

              return (
                <TableRow key={post.id}>
                  <TableCell>
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt=""
                        className="w-16 h-16 object-cover rounded bg-muted"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{title}</TableCell>
                  <TableCell>{cat}</TableCell>
                  <TableCell>{post.author_name || "—"}</TableCell>
                  <TableCell>
                    {post.is_published ? (
                      <Badge>Опубліковано</Badge>
                    ) : post.scheduled_publish_at ? (
                      <Badge variant="secondary">Заплановано</Badge>
                    ) : (
                      <Badge variant="outline">Чернетка</Badge>
                    )}
                  </TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" title="Переглянути">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/blog-posts/${post.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Редагувати">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" title="Видалити" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Нічого не знайдено.
                </TableCell>
              </TableRow>
            )}

            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Завантаження…
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Пагінація */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Всього: {total} • Сторінка {page} з {totalPages}
          {isFetching && <span className="ml-2">↻</span>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isFetching}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isFetching}
          >
            Вперед
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
