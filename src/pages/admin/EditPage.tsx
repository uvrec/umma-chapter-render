import { useState, useEffect } from "react";
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

const urlSchema = z.string().url("Невірний формат URL").or(z.literal(""));

export const EditPage = () => {
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

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && !!slug,
  });

  useEffect(() => {
    if (page) {
      setTitleUa(page.title_ua || "");
      setTitleEn(page.title_en || "");
      setContentUa(page.content_ua || "");
      setContentEn(page.content_en || "");
      setMetaDescriptionUa(page.meta_description_ua || "");
      setMetaDescriptionEn(page.meta_description_en || "");
      setHeroImageUrl(page.hero_image_url || "");
      setBannerImageUrl(page.banner_image_url || "");
      setOgImage(page.og_image || "");
      setSeoKeywords(page.seo_keywords || "");
      setIsPublished(page.is_published ?? true);
    }
  }, [page]);

  const updatePageMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("pages")
        .update({
          title_ua: titleUa,
          title_en: titleEn,
          content_ua: contentUa,
          content_en: contentEn,
          meta_description_ua: metaDescriptionUa,
          meta_description_en: metaDescriptionEn,
          hero_image_url: heroImageUrl,
          banner_image_url: bannerImageUrl,
          og_image: ogImage,
          seo_keywords: seoKeywords,
          is_published: isPublished,
        })
        .eq("slug", slug);

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
    onError: (error) => {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти зміни: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleUa || !titleEn) {
      toast({
        title: "Помилка",
        description: "Заповніть обов'язкові поля",
        variant: "destructive",
      });
      return;
    }
    
    // Validate URLs
    const urlFields = [
      { value: heroImageUrl, name: "Hero зображення" },
      { value: bannerImageUrl, name: "Банер" },
      { value: ogImage, name: "OG зображення" },
    ];
    
    for (const field of urlFields) {
      if (field.value) {
        const result = urlSchema.safeParse(field.value);
        if (!result.success) {
          toast({
            title: "Помилка валідації",
            description: `${field.name}: ${result.error.errors[0].message}`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    updatePageMutation.mutate();
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
            <Button variant="outline" onClick={() => navigate("/admin/pages")}>
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
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>

              <Tabs defaultValue="ua" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ua">Українська</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <TabsContent value="ua" className="space-y-4">
                  <div>
                    <Label htmlFor="titleUa">Заголовок *</Label>
                    <Input
                      id="titleUa"
                      value={titleUa}
                      onChange={(e) => setTitleUa(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescriptionUa">Meta опис (SEO)</Label>
                    <Textarea
                      id="metaDescriptionUa"
                      value={metaDescriptionUa}
                      onChange={(e) => setMetaDescriptionUa(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentUa">Контент</Label>
                    <TiptapEditor
                      content={contentUa}
                      onChange={setContentUa}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label htmlFor="titleEn">Title *</Label>
                    <Input
                      id="titleEn"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescriptionEn">Meta Description (SEO)</Label>
                    <Textarea
                      id="metaDescriptionEn"
                      value={metaDescriptionEn}
                      onChange={(e) => setMetaDescriptionEn(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentEn">Content</Label>
                    <TiptapEditor
                      content={contentEn}
                      onChange={setContentEn}
                    />
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
};

export default EditPage;
