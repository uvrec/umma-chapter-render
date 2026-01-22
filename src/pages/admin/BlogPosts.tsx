// src/pages/admin/BlogPostsInfinite.tsx
import { RefreshFeedButton } from "@/components/admin/RefreshFeedButton";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

const PAGE_SIZE = 20;

function escapeLike(term: string) {
  // escape % and _ for ILIKE
  return term.replace(/[%_]/g, (m) => `\\${m}`);
}

export default function BlogPostsInfinite() {
  const { language } = useLanguage();
  const qc = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");

  // debounce пошуку
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const queryKey = useMemo(
    () => ["admin-blog-posts-infinite", statusFilter, debouncedSearch],
    [statusFilter, debouncedSearch],
  );

  const fetchPage = async ({ pageParam = 0 }): Promise<{ items: any[]; nextPage: number; hasMore: boolean }> => {
    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("blog_posts")
      .select(
        `
        *,
        category:blog_categories(name_ua, name_en)
      `,
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    // статус
    if (statusFilter === "published") {
      query = query.eq("is_published", true);
    } else if (statusFilter === "draft") {
      query = query.eq("is_published", false).is("scheduled_publish_at", null);
    } else if (statusFilter === "scheduled") {
      query = query.eq("is_published", false).not("scheduled_publish_at", "is", null);
    }

    // пошук
    if (debouncedSearch) {
      const term = escapeLike(debouncedSearch);
      query = query.or(`title_ua.ilike.%${term}%,title_en.ilike.%${term}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      items: data || [],
      nextPage: pageParam + 1,
      hasMore: (data?.length || 0) === PAGE_SIZE,
    };
  };

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    {
      queryKey,
      queryFn: fetchPage,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  );

  // ∞-scroll сенсор
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей пост?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Помилка видалення", variant: "destructive" });
    } else {
      toast({ title: "Пост видалено" });
      qc.invalidateQueries({ queryKey });
      refetch();
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header (оновлений блок дій) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Керування постами блогу</h1>
        <div className="flex gap-2">
          <RefreshFeedButton />
          <Link to="/admin/blog-posts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Новий пост
            </Button>
          </Link>
        </div>
      </div>

      {/* Controls */}
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
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
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

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Зображення</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Автор</TableHead>
              <TableHead>Категорія</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Перегляди</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPosts.map((post: any) => (
              <TableRow key={post.id}>
                <TableCell>
                  {post.featured_image && (
                    <img src={post.featured_image} alt="" className="w-16 h-16 object-cover rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{language === "uk" ? post.title_uk : post.title_en}</TableCell>
                <TableCell>{post.author_name || "Аніруддга дас"}</TableCell>
                <TableCell>
                  {post.category ? (language === "uk" ? post.category.name_uk : post.category.name_en) : "-"}
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
                <TableCell>{new Date(post.created_at).toLocaleDateString("uk-UA")}</TableCell>
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
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* рядок-завантажувач */}
            <TableRow>
              <TableCell colSpan={8}>
                <div ref={loadMoreRef} className="py-4 text-center text-sm text-muted-foreground">
                  {isLoading
                    ? "Завантаження..."
                    : isError
                      ? `Помилка: ${(error as any)?.message || "невідомо"}`
                      : isFetchingNextPage
                        ? "Підтягуємо ще..."
                        : hasNextPage
                          ? "Прокрутіть нижче, щоб завантажити більше"
                          : allPosts.length
                            ? "Це все 🎉"
                            : "Немає постів"}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
