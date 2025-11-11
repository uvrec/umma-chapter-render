// BlogPost.tsx - з підтримкою двомовного режиму

import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
import { BlogPoetryContent } from "@/components/blog/BlogPoetryContent";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { VideoEmbed } from "@/components/blog/VideoEmbed";
import { AudioEmbed } from "@/components/blog/AudioEmbed";
import { InstagramEmbed } from "@/components/blog/InstagramEmbed";
import { TelegramEmbed } from "@/components/blog/TelegramEmbed";
import { SubstackEmbed } from "@/components/blog/SubstackEmbed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Eye, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogPostView } from "@/hooks/useBlogPostView";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Читаємо dualMode з localStorage
  const [dualMode, setDualMode] = useState(() => localStorage.getItem("vv_reader_dualMode") === "true");

  // ✅ ДОДАНО: Display blocks для контролю видимості блоків
  const [displayBlocks, setDisplayBlocks] = useState({
    sanskrit: true,
    transliteration: true,
    synonyms: true,
    translation: true,
    commentary: true,
  });

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
      // Спочатку пробуємо завантажити з новими полями (якщо міграція вже запущена)
      let { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
          id,
          title_ua,
          title_en,
          slug,
          content_mode,
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
          display_blocks,
          sanskrit,
          transliteration,
          synonyms_ua,
          synonyms_en,
          poetry_translation_ua,
          poetry_translation_en,
          audio_sanskrit_url,
          audio_transliteration_url,
          audio_synonyms_ua_url,
          audio_synonyms_en_url,
          audio_poetry_translation_ua_url,
          audio_poetry_translation_en_url,
          audio_commentary_ua_url,
          audio_commentary_en_url,
          category:blog_categories(name_ua, name_en),
          tags:blog_post_tags(tag:blog_tags(name_ua, name_en, slug))
        `,
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .lte("published_at", new Date().toISOString())
        .maybeSingle();

      // Fallback: якщо помилка (міграція ще не запущена), завантажуємо без нових полів
      if (error && error.message?.includes("column")) {
        const fallback = await supabase
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
            display_blocks,
            category:blog_categories(name_ua, name_en),
            tags:blog_post_tags(tag:blog_tags(name_ua, name_en, slug))
          `,
          )
          .eq("slug", slug)
          .eq("is_published", true)
          .lte("published_at", new Date().toISOString())
          .maybeSingle();

        data = fallback.data;
        error = fallback.error;
      }

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // ✅ ДОДАНО: Завантажити display_blocks з БД
  useEffect(() => {
    if (post?.display_blocks) {
      setDisplayBlocks({
        sanskrit: (post.display_blocks as any).sanskrit ?? true,
        transliteration: (post.display_blocks as any).transliteration ?? true,
        synonyms: (post.display_blocks as any).synonyms ?? true,
        translation: (post.display_blocks as any).translation ?? true,
        commentary: (post.display_blocks as any).commentary ?? true,
      });
    }
  }, [post?.display_blocks]);

  // Функція для збереження змін контенту
  const handleContentUpdate = async (field: "content_ua" | "content_en", value: string) => {
    if (!post?.id) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ [field]: value })
        .eq("id", post.id);

      if (error) throw error;

      // Оновлюємо кеш
      queryClient.setQueryData(["blog-post", slug], (old: any) => (old ? { ...old, [field]: value } : old));

      toast({ title: "✅ Збережено" });
    } catch (error) {
      console.error(error);
      toast({ title: "Помилка збереження", variant: "destructive" });
    }
  };

  // ✅ ДОДАНО: Обробка перемикання блоків
  const handleToggleBlock = async (blockName: keyof typeof displayBlocks, value: boolean) => {
    const newBlocks = { ...displayBlocks, [blockName]: value };
    setDisplayBlocks(newBlocks);

    if (isAdmin && post?.id) {
      try {
        const { error } = await supabase
          .from("blog_posts")
          .update({ display_blocks: newBlocks })
          .eq("id", post.id);

        if (error) throw error;
        toast({ title: "✅ Налаштування збережено" });
      } catch (error) {
        console.error(error);
        toast({ title: "Помилка збереження", variant: "destructive" });
      }
    }
  };

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
          {/* ✅ ДОДАНО: Панель налаштувань блоків (тільки для адміна) */}
          {isAdmin && (
            <Card className="mb-6 p-4 bg-card/50">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                {language === "ua" ? "Налаштування відображення блоків" : "Display Blocks Settings"}
              </h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={displayBlocks.sanskrit}
                    onCheckedChange={(v) => handleToggleBlock('sanskrit', !!v)}
                  />
                  <span className="text-sm">{language === "ua" ? "Санскрит" : "Sanskrit"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={displayBlocks.transliteration}
                    onCheckedChange={(v) => handleToggleBlock('transliteration', !!v)}
                  />
                  <span className="text-sm">{language === "ua" ? "Транслітерація" : "Transliteration"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={displayBlocks.synonyms}
                    onCheckedChange={(v) => handleToggleBlock('synonyms', !!v)}
                  />
                  <span className="text-sm">{language === "ua" ? "Послівний переклад" : "Word-for-word"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={displayBlocks.translation}
                    onCheckedChange={(v) => handleToggleBlock('translation', !!v)}
                  />
                  <span className="text-sm">{language === "ua" ? "Переклад" : "Translation"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={displayBlocks.commentary}
                    onCheckedChange={(v) => handleToggleBlock('commentary', !!v)}
                  />
                  <span className="text-sm">{language === "ua" ? "Пояснення" : "Commentary"}</span>
                </label>
              </div>
            </Card>
          )}
          
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
                    post.content_mode === "poetry" ? (
                      <BlogPoetryContent
                        sanskrit={post.sanskrit}
                        transliteration={post.transliteration}
                        synonyms={post.synonyms_ua}
                        poetryTranslation={post.poetry_translation_ua}
                        commentary={contentUa}
                        audioSanskritUrl={post.audio_sanskrit_url}
                        audioTransliterationUrl={post.audio_transliteration_url}
                        audioSynonymsUrl={post.audio_synonyms_ua_url}
                        audioPoetryTranslationUrl={post.audio_poetry_translation_ua_url}
                        audioCommentaryUrl={post.audio_commentary_ua_url}
                        displayBlocks={displayBlocks}
                        language="ua"
                      />
                    ) : isAdmin ? (
                      <InlineTiptapEditor
                        content={contentUa}
                        onChange={(value) => handleContentUpdate("content_ua", value)}
                        label="Контент (UA)"
                      />
                    ) : (
                      <TiptapRenderer content={contentUa} displayBlocks={displayBlocks} className="!max-w-none" />
                    )
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
                    post.content_mode === "poetry" ? (
                      <BlogPoetryContent
                        sanskrit={post.sanskrit}
                        transliteration={post.transliteration}
                        synonyms={post.synonyms_en}
                        poetryTranslation={post.poetry_translation_en}
                        commentary={contentEn}
                        audioSanskritUrl={post.audio_sanskrit_url}
                        audioTransliterationUrl={post.audio_transliteration_url}
                        audioSynonymsUrl={post.audio_synonyms_en_url}
                        audioPoetryTranslationUrl={post.audio_poetry_translation_en_url}
                        audioCommentaryUrl={post.audio_commentary_en_url}
                        displayBlocks={displayBlocks}
                        language="en"
                      />
                    ) : isAdmin ? (
                      <InlineTiptapEditor
                        content={contentEn}
                        onChange={(value) => handleContentUpdate("content_en", value)}
                        label="Content (EN)"
                      />
                    ) : (
                      <TiptapRenderer content={contentEn} displayBlocks={displayBlocks} className="!max-w-none" />
                    )
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
                    post.content_mode === "poetry" ? (
                      <BlogPoetryContent
                        sanskrit={post.sanskrit}
                        transliteration={post.transliteration}
                        synonyms={post.synonyms_ua}
                        poetryTranslation={post.poetry_translation_ua}
                        commentary={contentUa}
                        audioSanskritUrl={post.audio_sanskrit_url}
                        audioTransliterationUrl={post.audio_transliteration_url}
                        audioSynonymsUrl={post.audio_synonyms_ua_url}
                        audioPoetryTranslationUrl={post.audio_poetry_translation_ua_url}
                        audioCommentaryUrl={post.audio_commentary_ua_url}
                        displayBlocks={displayBlocks}
                        language="ua"
                      />
                    ) : isAdmin ? (
                      <InlineTiptapEditor
                        content={contentUa}
                        onChange={(value) => handleContentUpdate("content_ua", value)}
                        label="Контент (UA)"
                      />
                    ) : (
                      <TiptapRenderer content={contentUa} displayBlocks={displayBlocks} className="!max-w-none" />
                    )
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">Контент поста ще не додано</p>
                      <p className="text-sm mt-2">Будь ласка, зверніться до адміністратора</p>
                    </div>
                  )
                ) : hasContentEn ? (
                  post.content_mode === "poetry" ? (
                    <BlogPoetryContent
                      sanskrit={post.sanskrit}
                      transliteration={post.transliteration}
                      synonyms={post.synonyms_en}
                      poetryTranslation={post.poetry_translation_en}
                      commentary={contentEn}
                      audioSanskritUrl={post.audio_sanskrit_url}
                      audioTransliterationUrl={post.audio_transliteration_url}
                      audioSynonymsUrl={post.audio_synonyms_en_url}
                      audioPoetryTranslationUrl={post.audio_poetry_translation_en_url}
                      audioCommentaryUrl={post.audio_commentary_en_url}
                      displayBlocks={displayBlocks}
                      language="en"
                    />
                  ) : isAdmin ? (
                    <InlineTiptapEditor
                      content={contentEn}
                      onChange={(value) => handleContentUpdate("content_en", value)}
                      label="Content (EN)"
                    />
                  ) : (
                    <TiptapRenderer content={contentEn} displayBlocks={displayBlocks} className="!max-w-none" />
                  )
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
