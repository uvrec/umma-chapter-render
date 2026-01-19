import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TiptapEditor } from "@/components/blog/TiptapEditor";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { ExternalLink, RotateCcw } from "lucide-react";
import { PageBuilder, type PageBlock } from "@/components/admin/PageBuilder";

const urlSchema = z.string().url("Невірний формат URL").or(z.literal(""));

type PageRow = {
  slug: string;
  title_uk: string | null;
  title_en: string | null;
  content_uk: string | null;
  content_en: string | null;
  meta_description_uk: string | null;
  meta_description_en: string | null;
  hero_image_url: string | null;
  banner_image_url: string | null;
  og_image: string | null;
  seo_keywords: string | null;
  is_published: boolean | null;
  sections: any | null;
};

export default function EditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [titleUa, setTitleUa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [contentUa, setContentUa] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [metaDescriptionUa, setMetaDescriptionUa] = useState("");
  const [metaDescriptionEn, setMetaDescriptionEn] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [sections, setSections] = useState<PageBlock[]>([]);

  // redirect non-admin
  useEffect(() => {
    if (!user || !isAdmin) navigate("/auth");
  }, [user, isAdmin, navigate]);

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", slug],
    queryFn: async (): Promise<PageRow> => {
      const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).single();
      if (error) throw error;
      return data as PageRow;
    },
    enabled: !!user && isAdmin && !!slug,
  });

  // зберігаємо початковий снапшот, щоб визначати "брудність"
  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        titleUa,
        titleEn,
        contentUa,
        contentEn,
        metaDescriptionUa,
        metaDescriptionEn,
        heroImageUrl,
        bannerImageUrl,
        ogImage,
        seoKeywords,
        isPublished,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // як тільки прийшла сторінка — заповнюємо поля
  useEffect(() => {
    if (page) {
      setTitleUa(page.title_uk || "");
      setTitleEn(page.title_en || "");
      setContentUa(page.content_uk || "");
      setContentEn(page.content_en || "");
      setMetaDescriptionUa(page.meta_description_uk || "");
      setMetaDescriptionEn(page.meta_description_en || "");
      setHeroImageUrl(page.hero_image_url || "");
      setBannerImageUrl(page.banner_image_url || "");
      setOgImage(page.og_image || "");
      setSeoKeywords(page.seo_keywords || "");
      setIsPublished(page.is_published ?? true);
      setSections((page.sections as PageBlock[]) || []);
    }
  }, [page]);

  // dirty state
  const isDirty = useMemo(() => {
    const current = JSON.stringify({
      titleUa,
      titleEn,
      contentUa,
      contentEn,
      metaDescriptionUa,
      metaDescriptionEn,
      heroImageUrl,
      bannerImageUrl,
      ogImage,
      seoKeywords,
      isPublished,
    });
    // якщо initialSnapshot порожній (ще не встановлено) — не блокуємо
    return initialSnapshot && current !== initialSnapshot;
  }, [
    titleUa,
    titleEn,
    contentUa,
    contentEn,
    metaDescriptionUa,
    metaDescriptionEn,
    heroImageUrl,
    bannerImageUrl,
    ogImage,
    seoKeywords,
    isPublished,
    initialSnapshot,
  ]);

  // попередження при виході з незбереженими змінами
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; // потрібен для більшості браузерів
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty]);

  const updatePageMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title_uk: titleUa,
        title_en: titleEn,
        content_uk: contentUa,
        content_en: contentEn,
        meta_description_uk: metaDescriptionUa,
        meta_description_en: metaDescriptionEn,
        hero_image_url: heroImageUrl,
        banner_image_url: bannerImageUrl,
        og_image: ogImage,
        seo_keywords: seoKeywords,
        is_published: isPublished,
        sections: sections.length > 0 ? (sections as any) : null,
      };

      const { error } = await supabase.from("pages").update(payload).eq("slug", slug);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", slug] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast({
        title: "Успішно збережено",
        description: "Зміни на сторінці збережено",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти зміни: " + error.message,
        variant: "destructive",
      });
    },
  });

  const validateUrls = (): boolean => {
    const fields = [
      { value: heroImageUrl, name: "Hero зображення" },
      { value: bannerImageUrl, name: "Банер" },
      { value: ogImage, name: "OG зображення" },
    ];
    for (const f of fields) {
      if (!f.value) continue;
      const res = urlSchema.safeParse(f.value);
      if (!res.success) {
        toast({
          title: "Помилка валідації",
          description: `${f.name}: ${res.error.errors[0].message}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!titleUa || !titleEn) {
      toast({
        title: "Помилка",
        description: "Заповніть обов'язкові поля (UA та EN заголовки)",
        variant: "destructive",
      });
      return;
    }
    if (!validateUrls()) return;
    updatePageMutation.mutate();
  };

  const handleReset = () => {
    if (!page) return;
    setTitleUa(page.title_uk || "");
    setTitleEn(page.title_en || "");
    setContentUa(page.content_uk || "");
    setContentEn(page.content_en || "");
    setMetaDescriptionUa(page.meta_description_uk || "");
    setMetaDescriptionEn(page.meta_description_en || "");
    setHeroImageUrl(page.hero_image_url || "");
    setBannerImageUrl(page.banner_image_url || "");
    setOgImage(page.og_image || "");
    setSeoKeywords(page.seo_keywords || "");
    setIsPublished(page.is_published ?? true);
  };

  if (isLoading) {
    return <div className="p-8">Завантаження...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Редагувати сторінку</h1>
            <p className="text-muted-foreground">/{slug}</p>
          </div>
          <div className="flex gap-2">
            {isPublished && (
              <a
                href={`/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Переглянути
              </a>
            )}
            <Button variant="outline" onClick={handleReset} disabled={updatePageMutation.isPending}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Скинути
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/pages")} disabled={updatePageMutation.isPending}>
              Скасувати
            </Button>
            <Button onClick={handleSubmit} disabled={updatePageMutation.isPending}>
              {updatePageMutation.isPending ? "Збереження..." : "Зберегти"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основна інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">Опублікувати сторінку</Label>
                <Switch id="isPublished" checked={isPublished} onCheckedChange={setIsPublished} />
              </div>

              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Основне</TabsTrigger>
                  <TabsTrigger value="blocks">Блоки контенту</TabsTrigger>
                  <TabsTrigger value="legacy">Старий контент</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="titleUa">Заголовок (UK) *</Label>
                    <Input id="titleUa" value={titleUa} onChange={(e) => setTitleUa(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">Заголовок (EN) *</Label>
                    <Input id="titleEn" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="metaDescriptionUa">Meta опис (UK)</Label>
                    <Textarea
                      id="metaDescriptionUa"
                      value={metaDescriptionUa}
                      onChange={(e) => setMetaDescriptionUa(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescriptionEn">Meta Description (EN)</Label>
                    <Textarea
                      id="metaDescriptionEn"
                      value={metaDescriptionEn}
                      onChange={(e) => setMetaDescriptionEn(e.target.value)}
                      rows={2}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="blocks">
                  <PageBuilder sections={sections} onChange={setSections} />
                </TabsContent>

                <TabsContent value="legacy" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Використовується для сторінок без блокової структури (застарілий формат)
                  </p>
                  <div>
                    <Label htmlFor="contentUa">Контент (UK)</Label>
                    <TiptapEditor content={contentUa} onChange={setContentUa} />
                  </div>
                  <div>
                    <Label htmlFor="contentEn">Content (EN)</Label>
                    <TiptapEditor content={contentEn} onChange={setContentEn} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Зображення та медіа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroImageUrl">Hero зображення (URL)</Label>
                <Input
                  id="heroImageUrl"
                  type="url"
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="bannerImageUrl">Банер (URL)</Label>
                <Input
                  id="bannerImageUrl"
                  type="url"
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="ogImage">Open Graph зображення (URL)</Label>
                <Input
                  id="ogImage"
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="seoKeywords">Ключові слова (через кому)</Label>
                <Input
                  id="seoKeywords"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="ведична література, аудіокниги, глосарій"
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
