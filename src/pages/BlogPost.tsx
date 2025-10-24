// BlogPost.tsx - з підтримкою двомовного режиму

import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
import { VideoEmbed } from "@/components/blog/VideoEmbed";
import { AudioEmbed } from "@/components/blog/AudioEmbed";
import { InstagramEmbed } from "@/components/blog/InstagramEmbed";
import { TelegramEmbed } from "@/components/blog/TelegramEmbed";
import { SubstackEmbed } from "@/components/blog/SubstackEmbed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBlogPostView } from "@/hooks/useBlogPostView";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  // Читаємо dualMode з localStorage
  const [dualMode, setDualMode] = useState(() => localStorage.getItem("vv_reader_dualMode") === "true");

  // Слухаємо зміни з GlobalSettingsPanel
  useEffect(() => {
    const handler = () => {
      setDualMode(localStorage.getItem("vv_reader_dualMode") === "true");
    };
    window.addEventListener("vv-reader-prefs-changed", handler);
    return () => window.removeEventListener("vv-reader-prefs-changed", handler);
  }, []);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
          id,
          title_ua,
          title_en,
          slug,
          content_ua,
          content_en,
          excerpt_ua,
          excerpt_en,
          cover_image_url,
          featured_image,
          video_url,
          audio_url,
          instagram_embed_url,
          telegram_embed_url,
          substack_embed_url,
          meta_description_ua,
          meta_description_en,
          is_published,
          published_at,
          created_at,
          updated_at,
          view_count,
          read_time,
          category_id,
          author_display_name,
          category:blog_categories(name_ua, name_en),
          tags:blog_post_tags(tag:blog_tags(name_ua, name_en, slug))
        `,
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .lte("published_at", new Date().toISOString())
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", post?.category_id],
    queryFn: async () => {
      if (!post?.category_id) return [];
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title_ua, title_en, slug, excerpt_ua, excerpt_en, featured_image, published_at")
        .eq("category_id", post.category_id)
        .eq("is_published", true)
        .neq("id", post.id)
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!post?.category_id,
  });

  useBlogPostView(post?.id, () => {
    queryClient.setQueryData(["blog-post", slug], (old: any) =>
      old ? { ...old, view_count: (old.view_count ?? 0) + 1 } : old,
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Пост не знайдено</h1>
          <p className="text-muted-foreground mb-6">
            {isError ? "Виникла помилка при завантаженні поста" : "Такого поста не існує або він ще не опублікований"}
          </p>
          <Link to="/blog">
            <Button>Повернутися до блогу</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const titleUa = post.title_ua;
  const titleEn = post.title_en;
  const contentUa = post.content_ua;
  const contentEn = post.content_en;
  const excerptUa = post.excerpt_ua;
  const excerptEn = post.excerpt_en;
  const metaDescUa = post.meta_description_ua;
  const metaDescEn = post.meta_description_en;

  // Для SEO та соцмереж - одна мова
  const title = language === "ua" ? titleUa : titleEn;
  const excerpt = language === "ua" ? excerptUa : excerptEn;
  const metaDesc = language === "ua" ? metaDescUa : metaDescEn;

  const hasContentUa = contentUa && contentUa.trim().length > 20;
  const hasContentEn = contentEn && contentEn.trim().length > 20;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: excerpt, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title} | Духовна Бібліотека</title>
        <meta name="description" content={metaDesc || excerpt} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc || excerpt} />
        <meta property="og:image" content={post.featured_image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content={post.author_display_name} />
      </Helmet>

      <Header />

      <article className="container mx-auto py-8">
        <div className={dualMode ? "max-w-7xl mx-auto" : "max-w-4xl mx-auto"}>
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              {language === "ua" ? "Головна" : "Home"}
            </Link>{" "}
            {" > "}
            <Link to="/blog" className="hover:text-foreground">
              {language === "ua" ? "Блог" : "Blog"}
            </Link>
            {post.category && (
              <>
                {" > "}
                <span>{language === "ua" ? post.category.name_ua : post.category.name_en}</span>
              </>
            )}
            {" > "}
            <span className="text-foreground">{title}</span>
          </nav>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <img src={post.featured_image} alt={title} className="w-full h-96 object-cover rounded-lg" />
            </div>
          )}

          {dualMode ? (
            // DUAL MODE - Side by side
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ukrainian Column */}
              <div>
                <header className="mb-8">
                  {post.category && <Badge className="mb-4">{post.category.name_ua}</Badge>}
                  <h1 className="blog-title mb-4">{titleUa}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.published_at || post.created_at).toLocaleDateString("uk-UA")}</span>
                    </div>

                    {post.read_time > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.read_time} хв читання</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.view_count || 0} переглядів</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4">Автор: {post.author_display_name}</div>

                  <Button variant="outline" onClick={handleShare} className="mb-6">
                    <Share2 className="h-4 w-4 mr-2" />
                    Поділитися
                  </Button>
                </header>

                <div className="blog-body prose prose-lg prose-slate dark:prose-invert max-w-none">
                  {hasContentUa ? (
                    <TiptapRenderer content={contentUa} className="!max-w-none" />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">Контент українською ще не додано</p>
                    </div>
                  )}
                </div>
              </div>

              {/* English Column */}
              <div>
                <header className="mb-8">
                  {post.category && <Badge className="mb-4">{post.category.name_en}</Badge>}
                  <h1 className="blog-title mb-4">{titleEn}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.published_at || post.created_at).toLocaleDateString("en-US")}</span>
                    </div>

                    {post.read_time > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.read_time} min read</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.view_count || 0} views</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4">Author: {post.author_display_name}</div>

                  <Button variant="outline" onClick={handleShare} className="mb-6">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </header>

                <div className="blog-body prose prose-lg prose-slate dark:prose-invert max-w-none">
                  {hasContentEn ? (
                    <TiptapRenderer content={contentEn} className="!max-w-none" />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">English content not yet added</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // SINGLE LANGUAGE MODE
            <>
              <header className="mb-8">
                {post.category && (
                  <Badge className="mb-4">{language === "ua" ? post.category.name_ua : post.category.name_en}</Badge>
                )}
                <h1 className="blog-title mb-4">{title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.published_at || post.created_at).toLocaleDateString(
                        language === "ua" ? "uk-UA" : "en-US",
                      )}
                    </span>
                  </div>

                  {post.read_time > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {post.read_time} {language === "ua" ? "хв читання" : "min read"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>
                      {post.view_count || 0} {language === "ua" ? "переглядів" : "views"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span>
                      {language === "ua" ? "Автор" : "Author"}: {post.author_display_name}
                    </span>
                  </div>
                </div>

                <Button variant="outline" onClick={handleShare} className="mb-6">
                  <Share2 className="h-4 w-4 mr-2" />
                  {language === "ua" ? "Поділитися" : "Share"}
                </Button>
              </header>

              <div className="blog-body prose prose-lg prose-slate dark:prose-invert max-w-none">
                {language === "ua" ? (
                  hasContentUa ? (
                    <TiptapRenderer content={contentUa} className="!max-w-none" />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">Контент поста ще не додано</p>
                      <p className="text-sm mt-2">Будь ласка, зверніться до адміністратора</p>
                    </div>
                  )
                ) : hasContentEn ? (
                  <TiptapRenderer content={contentEn} className="!max-w-none" />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg">Post content not yet added</p>
                    <p className="text-sm mt-2">Please contact the administrator</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Embeds - показуємо один раз, не дублюємо в dual mode */}
          {!dualMode && (
            <div className="space-y-8 mb-8 mt-8">
              {post.video_url && <VideoEmbed url={post.video_url} />}
              {post.audio_url && <AudioEmbed url={post.audio_url} />}
              {post.instagram_embed_url && <InstagramEmbed url={post.instagram_embed_url} />}
              {post.telegram_embed_url && <TelegramEmbed url={post.telegram_embed_url} />}
              {post.substack_embed_url && <SubstackEmbed url={post.substack_embed_url} />}
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
