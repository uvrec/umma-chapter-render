import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TiptapEditor } from "@/components/blog/TiptapEditor";
import { generateSlug, calculateReadTime } from "@/utils/blogHelpers";
import { toast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import { z } from "zod";
import { isValidHttpsUrlOrEmpty, isValidTelegramUrlOrEmpty, TELEGRAM_REGEX } from "@/utils/validators";

// zod-схеми для повідомлень про помилки
const httpsUrlSchema = z.string().refine(isValidHttpsUrlOrEmpty, {
  message: "Невірний формат URL",
});
const telegramSchema = z.string().refine(isValidTelegramUrlOrEmpty, {
  message: "Невалідне посилання Telegram. Формати: https://t.me/канал або https://t.me/канал/123",
});

export default function AddEditBlogPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // ——— основні стани
  const [titleUa, setTitleUa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [contentUa, setContentUa] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [excerptUa, setExcerptUa] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [substackUrl, setSubstackUrl] = useState("");
  const [metaDescUa, setMetaDescUa] = useState("");
  const [metaDescEn, setMetaDescEn] = useState("");

  // ——— автор
  const [authorName, setAuthorName] = useState("Аніруддга дас");

  // ——— автозбереження
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // категорії
  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_categories").select("*").order("name_ua");
      if (error) throw error;
      return data;
    },
  });

  // пост (редагування)
  const { data: post } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (post) {
      setTitleUa(post.title_ua || "");
      setTitleEn(post.title_en || "");
      setSlug(post.slug || "");
      setContentUa(post.content_ua || "");
      setContentEn(post.content_en || "");
      setExcerptUa(post.excerpt_ua || "");
      setExcerptEn(post.excerpt_en || "");
      setCategoryId(post.category_id || "");
      setIsPublished(post.is_published || false);
      setScheduledAt(post.scheduled_publish_at || "");
      setFeaturedImage(post.featured_image || "");
      setVideoUrl(post.video_url || "");
      setAudioUrl(post.audio_url || "");
      setInstagramUrl(post.instagram_embed_url || "");
      setTelegramUrl(post.telegram_embed_url || "");
      setSubstackUrl(post.substack_embed_url || "");
      setMetaDescUa(post.meta_description_ua || "");
      setMetaDescEn(post.meta_description_en || "");
      setAuthorName(post.author_display_name || "Аніруддга дас");
    }
  }, [post]);

  useEffect(() => {
    if (titleUa && !slug && !isEdit) {
      setSlug(generateSlug(titleUa));
    }
  }, [titleUa, isEdit, slug]);

  // ——— автозбереження
  const autoSave = useCallback(async () => {
    if (!isEdit || !id) return;

    setIsSaving(true);
    try {
      const readTime = calculateReadTime(contentUa + contentEn);
      const postData = {
        title_ua: titleUa,
        title_en: titleEn,
        slug,
        content_ua: contentUa,
        content_en: contentEn,
        excerpt_ua: excerptUa,
        excerpt_en: excerptEn,
        category_id: categoryId,
        is_published: isPublished,
        scheduled_publish_at: scheduledAt || null,
        featured_image: featuredImage,
        video_url: videoUrl,
        audio_url: audioUrl,
        instagram_embed_url: instagramUrl,
        telegram_embed_url: telegramUrl,
        substack_embed_url: substackUrl,
        meta_description_ua: metaDescUa,
        meta_description_en: metaDescEn,
        read_time: readTime,
        author_name: authorName || "Аніруддга дас",
      };

      await supabase.from("blog_posts").update(postData).eq("id", id);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    isEdit,
    id,
    titleUa,
    titleEn,
    slug,
    contentUa,
    contentEn,
    excerptUa,
    excerptEn,
    categoryId,
    isPublished,
    scheduledAt,
    featuredImage,
    videoUrl,
    audioUrl,
    instagramUrl,
    telegramUrl,
    substackUrl,
    metaDescUa,
    metaDescEn,
    authorName,
  ]);

  // Trigger auto-save when content changes
  useEffect(() => {
    if (!isEdit) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [
    contentUa,
    contentEn,
    titleUa,
    titleEn,
    excerptUa,
    excerptEn,
    metaDescUa,
    metaDescEn,
    autoSave,
    isEdit,
  ]);

  // ——— завантаження обкладинки
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID?.() ?? Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("blog-media").upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-media").getPublicUrl(fileName);

      setFeaturedImage(publicUrl);
      toast({ title: "Зображення завантажено" });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({ title: "Помилка завантаження", variant: "destructive" });
    }
  };

  // ——— просто очищаємо поле (файл у бакеті залишаємо)
  const handleRemoveImage = () => {
    setFeaturedImage("");
    toast({ title: "Зображення прибрано з поста" });
  };

  // ——— submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Перевірка обов'язкових полів
    if (!categoryId) {
      toast({
        title: "Помилка",
        description: "Оберіть категорію поста",
        variant: "destructive",
      });
      return;
    }

    // Валідація URL
    const checks: Array<{ label: string; value: string; schema: z.ZodTypeAny }> = [
      { label: "Обкладинка", value: featuredImage.trim(), schema: httpsUrlSchema },
      { label: "YouTube/Vimeo URL", value: videoUrl.trim(), schema: httpsUrlSchema },
      { label: "Spotify/SoundCloud URL", value: audioUrl.trim(), schema: httpsUrlSchema },
      { label: "Instagram URL", value: instagramUrl.trim(), schema: httpsUrlSchema },
      { label: "Telegram URL", value: telegramUrl.trim(), schema: telegramSchema },
      { label: "Substack URL", value: substackUrl.trim(), schema: httpsUrlSchema },
    ];

    for (const { label, value, schema } of checks) {
      const res = schema.safeParse(value);
      if (!res.success) {
        toast({
          title: "Помилка валідації",
          description: `${label}: ${res.error.errors[0].message}`,
          variant: "destructive",
        });
        return;
      }
    }

    const readTime = calculateReadTime(contentUa + contentEn);

    const postData: any = {
      title_ua: titleUa,
      title_en: titleEn,
      slug,
      content_ua: contentUa,
      content_en: contentEn,
      excerpt_ua: excerptUa,
      excerpt_en: excerptEn,
      category_id: categoryId,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      scheduled_publish_at: scheduledAt || null,
      featured_image: featuredImage,
      video_url: videoUrl,
      audio_url: audioUrl,
      instagram_embed_url: instagramUrl,
      telegram_embed_url: telegramUrl,
      substack_embed_url: substackUrl,
      meta_description_ua: metaDescUa,
      meta_description_en: metaDescEn,
      read_time: readTime,
      author_name: authorName || "Аніруддга дас",
    };

    try {
      if (isEdit) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", id);
        if (error) throw error;
        toast({ title: "Пост оновлено" });
      } else {
        const { error } = await supabase.from("blog_posts").insert([postData]);
        if (error) throw error;
        toast({ title: "Пост створено" });
      }
      navigate("/admin/blog-posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({ title: "Помилка збереження", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/admin/blog-posts")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Назад до списку
        </Button>
        {isEdit && (
          <div className="text-sm text-muted-foreground">
            {isSaving ? (
              <span className="text-amber-600">Збереження...</span>
            ) : lastSaved ? (
              <span>Автозбереження: {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ліва колонка — контент */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="ua" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="ua">Українська</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>

            <TabsContent value="ua" className="space-y-4">
              <div>
                <Label htmlFor="title-ua">Заголовок *</Label>
                <Input id="title-ua" value={titleUa} onChange={(e) => setTitleUa(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="excerpt-ua">Короткий опис</Label>
                <Textarea id="excerpt-ua" value={excerptUa} onChange={(e) => setExcerptUa(e.target.value)} rows={3} />
              </div>

              <div>
                <Label>Контент *</Label>
                <TiptapEditor content={contentUa} onChange={setContentUa} placeholder="Почніть писати українською..." />
              </div>

              <div>
                <Label htmlFor="meta-desc-ua">Meta опис (SEO)</Label>
                <Textarea
                  id="meta-desc-ua"
                  value={metaDescUa}
                  onChange={(e) => setMetaDescUa(e.target.value)}
                  maxLength={160}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">{metaDescUa.length}/160 символів</p>
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              <div>
                <Label htmlFor="title-en">Title *</Label>
                <Input id="title-en" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="excerpt-en">Excerpt</Label>
                <Textarea id="excerpt-en" value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} rows={3} />
              </div>

              <div>
                <Label>Content *</Label>
                <TiptapEditor content={contentEn} onChange={setContentEn} placeholder="Start writing in English..." />
              </div>

              <div>
                <Label htmlFor="meta-desc-en">Meta description (SEO)</Label>
                <Textarea
                  id="meta-desc-en"
                  value={metaDescEn}
                  onChange={(e) => setMetaDescEn(e.target.value)}
                  maxLength={160}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">{metaDescEn.length}/160 characters</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Права колонка — налаштування */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Налаштування публікації</h3>

            <div>
              <Label htmlFor="author">Автор</Label>
              <Input
                id="author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ім’я автора"
              />
              <p className="mt-1 text-xs text-muted-foreground">Якщо порожньо — буде «Аніруддга дас».</p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="published">Опублікувати</Label>
              <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            {!isPublished && (
              <div>
                <Label htmlFor="scheduled">Запланувати на</Label>
                <Input
                  id="scheduled"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {isEdit ? "Оновити" : "Створити"} пост
            </Button>
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Основні налаштування</h3>

            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="category">Категорія *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть категорію" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name_ua}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!categoryId && <p className="text-xs text-destructive mt-1">Категорія обов'язкова</p>}
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Головне зображення</h3>
            {featuredImage && <img src={featuredImage} alt="Featured" className="w-full rounded" />}
            <div className="flex gap-2">
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
              {featuredImage && (
                <Button type="button" variant="destructive" onClick={handleRemoveImage}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Видалити
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Медіа</h3>

            <div>
              <Label htmlFor="video">YouTube/Vimeo URL</Label>
              <Input
                id="video"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <Label htmlFor="audio">Spotify/SoundCloud URL</Label>
              <Input
                id="audio"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://open.spotify.com/..."
              />
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Соціальні мережі</h3>

            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/p/..."
              />
            </div>

            <div>
              <Label htmlFor="telegram">Telegram URL</Label>
              <Input
                id="telegram"
                value={telegramUrl}
                onChange={(e) => setTelegramUrl(e.target.value)}
                placeholder="https://t.me/prabhupada_ua або https://t.me/prabhupada_ua/123"
              />
              {!!telegramUrl && !TELEGRAM_REGEX.test(telegramUrl.trim()) && (
                <p className="mt-1 text-xs text-destructive">
                  Невалідне посилання Telegram. Формати: https://t.me/канал або https://t.me/канал/123
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="substack">Substack URL</Label>
              <Input
                id="substack"
                value={substackUrl}
                onChange={(e) => setSubstackUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
