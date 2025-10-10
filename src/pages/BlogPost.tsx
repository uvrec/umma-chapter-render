import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
import { useBlogPostView } from "@/hooks/useBlogPostView";

type DbPost = {
  id: string;
  slug: string;
  title_ua: string | null;
  title_en: string | null;
  content_ua: string | null; // HTML із редактора
  content_en: string | null;
  excerpt_ua: string | null;
  excerpt_en: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  read_time: number | null;
  view_count: number | null;
  author_display_name: string | null;
  blog_categories: {
    id: string;
    name_ua: string | null;
    name_en: string | null;
    slug: string | null;
  } | null;
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog-post", slug],
    enabled: !!slug,
    queryFn: async (): Promise<DbPost | null> => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
          id, slug,
          title_ua, title_en,
          content_ua, content_en,
          excerpt_ua, excerpt_en,
          cover_image_url,
          published_at, created_at,
          read_time, view_count, author_display_name,
          blog_categories ( id, name_ua, name_en, slug )
        `,
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .lte("published_at", new Date().toISOString())
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // інкремент перегляду через 3с (раз за сесію)
  useBlogPostView(post?.id);

  const title = useMemo(() => (language === "ua" ? post?.title_ua : post?.title_en) || "", [language, post]);
  const content = useMemo(() => (language === "ua" ? post?.content_ua : post?.content_en) || "", [language, post]);
  const categoryName = useMemo(
    () => (language === "ua" ? post?.blog_categories?.name_ua : post?.blog_categories?.name_en),
    [language, post],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "ua" ? "Назад до блогу" : "Back to blog"}
          </Link>
        </div>

        {isLoading && (
          <div className="text-center text-muted-foreground py-16">
            {language === "ua" ? "Завантаження…" : "Loading…"}
          </div>
        )}

        {error && (
          <div className="text-center text-destructive py-16">
            {language === "ua" ? "Помилка завантаження статті" : "Failed to load the article"}
          </div>
        )}

        {!isLoading && !post && (
          <div className="text-center text-muted-foreground py-16">
            {language === "ua" ? "Статтю не знайдено" : "Post not found"}
          </div>
        )}

        {post && (
          <article className="space-y-6">
            {/* Cover */}
            {post.cover_image_url && (
              <Card className="overflow-hidden">
                <img src={post.cover_image_url} alt={title} className="w-full h-auto object-cover" />
              </Card>
            )}

            {/* Title + meta */}
            <header className="space-y-3">
              {categoryName && <Badge variant="secondary">{categoryName}</Badge>}
              <h1 className="blog-title text-foreground">{title}</h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {post.author_display_name && (
                  <span className="inline-flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author_display_name}
                  </span>
                )}
                <span>•</span>
                <span className="inline-flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString(
                    language === "ua" ? "uk-UA" : "en-US",
                  )}
                </span>
                {post.read_time ? (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.read_time} {language === "ua" ? "хв" : "min"}
                    </span>
                  </>
                ) : null}
                {typeof post.view_count === "number" && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center">👁 {post.view_count}</span>
                  </>
                )}
              </div>
            </header>

            {/* Content (HTML, санітизується в TiptapRenderer) */}
            <TiptapRenderer content={content} />
          </article>
        )}
      </main>
    </div>
  );
}
