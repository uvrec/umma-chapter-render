import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          category:blog_categories(name_ua, name_en),
          tags:blog_post_tags(tag:blog_tags(name_ua, name_en, slug))
        `)
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

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

  useBlogPostView(post?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Пост не знайдено</h1>
          <Link to="/blog">
            <Button>Повернутися до блогу</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = language === "ua" ? post.title_ua : post.title_en;
  const content = language === "ua" ? post.content_ua : post.content_en;
  const excerpt = language === "ua" ? post.excerpt_ua : post.excerpt_en;
  const metaDesc = language === "ua" ? post.meta_description_ua : post.meta_description_en;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        text: excerpt,
        url: window.location.href,
      });
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
        <meta property="article:author" content={post.author} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "image": post.featured_image,
            "datePublished": post.published_at,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "description": metaDesc || excerpt
          })}
        </script>
      </Helmet>

      <Header />

      <article className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Головна</Link>
            {" > "}
            <Link to="/blog" className="hover:text-foreground">Блог</Link>
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
              <img
                src={post.featured_image}
                alt={title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <Badge className="mb-4">
                {language === "ua" ? post.category.name_ua : post.category.name_en}
              </Badge>
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
                <span>Автор: {post.author}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tagItem: any, index: number) => (
                  <Link
                    key={index}
                    to={`/blog/tag/${tagItem.tag.slug}`}
                    className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80"
                  >
                    {language === "ua" ? tagItem.tag.name_ua : tagItem.tag.name_en}
                  </Link>
                ))}
              </div>
            )}

            {/* Share Button */}
            <Button variant="outline" onClick={handleShare} className="mb-6">
              <Share2 className="h-4 w-4 mr-2" />
              Поділитися
            </Button>
          </header>

          {/* Content */}
          <div className="blog-body">
            <TiptapRenderer content={content} />
          </div>

          {/* Media Embeds */}
          <div className="space-y-8 mb-8">
            {post.video_url && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Відео</h3>
                <VideoEmbed url={post.video_url} />
              </div>
            )}

            {post.audio_url && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Аудіо</h3>
                <AudioEmbed url={post.audio_url} />
              </div>
            )}

            {post.instagram_embed_url && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Instagram</h3>
                <InstagramEmbed url={post.instagram_embed_url} />
              </div>
            )}

            {post.telegram_embed_url && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Telegram</h3>
                <TelegramEmbed url={post.telegram_embed_url} />
              </div>
            )}

            {post.substack_embed_url && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Substack</h3>
                <SubstackEmbed url={post.substack_embed_url} />
              </div>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className="mt-12 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">Схожі пости</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {relatedPost.featured_image && (
                        <img
                          src={relatedPost.featured_image}
                          alt={language === "ua" ? relatedPost.title_ua : relatedPost.title_en}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary">
                          {language === "ua" ? relatedPost.title_ua : relatedPost.title_en}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {language === "ua" ? relatedPost.excerpt_ua : relatedPost.excerpt_en}
                        </p>
                        <time className="text-xs text-muted-foreground mt-2 block">
                          {new Date(relatedPost.published_at).toLocaleDateString("uk-UA")}
                        </time>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}