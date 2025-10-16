import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
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
import VerseQuote from "@/components/blog/VerseQuote";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBlogPostView } from "@/hooks/useBlogPostView";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { toast } from "@/hooks/use-toast";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const isPreview = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get("preview") === "1";
    } catch {
      return false;
    }
  }, []);

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      // Cast to any to allow selecting recently added verse-like fields not yet present in generated types
      let query: any = (supabase as any)
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
          sanskrit,
          transliteration,
          synonyms_ua,
          synonyms_en,
          translation_ua,
          translation_en,
          display_blocks,
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
        .eq("slug", slug);

      if (!isPreview) {
        query = query.eq("is_published", true).lte("published_at", new Date().toISOString());
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      // Loosen type so consumers can access extended fields without TS errors until types are regenerated
      return data as any;
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

  // 👇 інкремент + локальне оновлення
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
          {error && (
            <pre className="text-xs opacity-80 whitespace-pre-wrap break-words mb-4">
              {String((error as any)?.message || error)}
            </pre>
          )}
          <Link to="/blog">
            <Button>Повернутися до блогу</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = language === "ua" ? post.title_ua : post.title_en;
  // Primary content from UA/EN columns; fallback to other common columns if an external editor saved elsewhere
  const primaryContent = language === "ua" ? post.content_ua : post.content_en;
  const fallbackContentCandidates = [
    primaryContent,
    (post as any)?.content_html,
    (post as any)?.body_html,
    (post as any)?.body,
    (post as any)?.content,
  ].filter(Boolean) as string[];
  const content = fallbackContentCandidates.find((c) => typeof c === "string" && c.trim().length > 0) || "";
  const excerpt = language === "ua" ? post.excerpt_ua : post.excerpt_en;
  const metaDesc = language === "ua" ? post.meta_description_ua : post.meta_description_en;
  // Consider content present if, after stripping HTML tags, there's any non-whitespace text
  const hasContent = useMemo(() => {
    if (!content) return false;
    const plain = content
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    return plain.length > 0;
  }, [content]);

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
        <div className="max-w-4xl mx-auto prose-reader" data-reader-root="true">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Головна
            </Link>{" "}
            {" > "}
            <Link to="/blog" className="hover:text-foreground">
              Блог
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

          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <Badge className="mb-4">{language === "ua" ? post.category.name_ua : post.category.name_en}</Badge>
            )}
            <h1 className="blog-title mb-4">{title}</h1>

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

              <div className="flex items-center gap-1">
                <span>Автор: {post.author_display_name}</span>
              </div>
            </div>

            <Button variant="outline" onClick={handleShare} className="mb-6">
              <Share2 className="h-4 w-4 mr-2" />
              Поділитися
            </Button>
          </header>

          {/* Verse quote block if present */}
          {(post.sanskrit ||
            post.transliteration ||
            post.synonyms_ua ||
            post.synonyms_en ||
            post.translation_ua ||
            post.translation_en) && (
            <VerseQuote
              language={language === "ua" ? "ua" : "en"}
              verse={{
                sanskrit: post.sanskrit,
                transliteration: post.transliteration,
                synonyms_ua: post.synonyms_ua,
                synonyms_en: post.synonyms_en,
                translation_ua: post.translation_ua,
                translation_en: post.translation_en,
                display_blocks: post.display_blocks,
              }}
              title={language === "ua" ? "Цитата з писань" : "Scripture Quote"}
              className="mb-10"
              editable={!!isAdmin}
              onBlockToggle={async (block, visible) => {
                try {
                  const next = { ...(post.display_blocks || {}), [block]: visible } as any;
                  const { data, error } = await (supabase as any)
                    .from("blog_posts")
                    .update({ display_blocks: next })
                    .eq("id", post.id)
                    .select("display_blocks")
                    .maybeSingle();
                  if (error) throw error;
                  // optimistic UI: mutate cache locally
                  // Note: react-query is available; quick local set to keep it minimal here
                  Object.assign(post, { display_blocks: data?.display_blocks || next });
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          )}

          {/* Content */}
          <div className="verse-surface mb-8 rounded-lg p-6 sm:p-8">
            {hasContent ? (
              <div className="commentary-text">
                <TiptapRenderer content={content} className="!max-w-none" />
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">Контент поста ще не додано</p>
                <p className="text-sm mt-2">Будь ласка, зверніться до адміністратора</p>
                {isPreview && (
                  <div className="mt-4 text-xs">
                    <div className="mb-1">Debug:</div>
                    <pre className="opacity-80 whitespace-pre-wrap break-words">
                      {JSON.stringify({ hasContent, contentLen: content?.length, lang: language, slug }, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Embeds */}
          <div className="space-y-6 mb-8">
            {post.video_url && (
              <div className="verse-surface rounded-lg overflow-hidden">
                <VideoEmbed url={post.video_url} />
              </div>
            )}
            {post.audio_url && (
              <div className="verse-surface rounded-lg p-4">
                <AudioEmbed url={post.audio_url} />
              </div>
            )}
            {post.instagram_embed_url && (
              <div className="verse-surface rounded-lg p-4">
                <InstagramEmbed url={post.instagram_embed_url} />
              </div>
            )}
            {post.telegram_embed_url && (
              <div className="verse-surface rounded-lg p-4">
                <TelegramEmbed url={post.telegram_embed_url} />
              </div>
            )}
            {post.substack_embed_url && (
              <div className="verse-surface rounded-lg p-4">
                <SubstackEmbed url={post.substack_embed_url} />
              </div>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
