import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageRenderer } from "@/components/PageRenderer";
import { PageMeta } from "@/components/PageMeta";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { InlineEditableBlock } from "@/components/InlineEditableBlock";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Edit, Save, X } from "lucide-react";
import { z } from "zod";

const urlSchema = z.string().url().or(z.literal(""));

export const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitleUa, setEditedTitleUa] = useState("");
  const [editedTitleEn, setEditedTitleEn] = useState("");
  const [editedMetaDescriptionUa, setEditedMetaDescriptionUa] = useState("");
  const [editedMetaDescriptionEn, setEditedMetaDescriptionEn] = useState("");
  const [editedContentUa, setEditedContentUa] = useState("");
  const [editedContentEn, setEditedContentEn] = useState("");
  const [editedHeroImageUrl, setEditedHeroImageUrl] = useState("");
  const [editedBannerImageUrl, setEditedBannerImageUrl] = useState("");
  const [editedOgImage, setEditedOgImage] = useState("");
  const [editedSeoKeywords, setEditedSeoKeywords] = useState("");

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is required");
      
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (page) {
      setEditedTitleUa(page.title_ua || "");
      setEditedTitleEn(page.title_en || "");
      setEditedMetaDescriptionUa(page.meta_description_ua || "");
      setEditedMetaDescriptionEn(page.meta_description_en || "");
      setEditedContentUa(page.content_ua || "");
      setEditedContentEn(page.content_en || "");
      setEditedHeroImageUrl(page.hero_image_url || "");
      setEditedBannerImageUrl(page.banner_image_url || "");
      setEditedOgImage(page.og_image || "");
      setEditedSeoKeywords(page.seo_keywords || "");
    }
  }, [page]);

  const updatePageMutation = useMutation({
    mutationFn: async () => {
      if (!page) throw new Error("No page data");

      // Validate URLs
      try {
        urlSchema.parse(editedHeroImageUrl);
        urlSchema.parse(editedBannerImageUrl);
        urlSchema.parse(editedOgImage);
      } catch (e) {
        throw new Error("Один або декілька URL-адрес недійсні");
      }

      const { error } = await supabase
        .from('pages')
        .update({
          title_ua: editedTitleUa,
          title_en: editedTitleEn,
          meta_description_ua: editedMetaDescriptionUa,
          meta_description_en: editedMetaDescriptionEn,
          content_ua: editedContentUa,
          content_en: editedContentEn,
          hero_image_url: editedHeroImageUrl || null,
          banner_image_url: editedBannerImageUrl || null,
          og_image: editedOgImage || null,
          seo_keywords: editedSeoKeywords || null,
        })
        .eq('id', page.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', slug] });
      setIsEditMode(false);
      toast({
        title: "Зміни збережено",
        description: "Сторінку успішно оновлено",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Помилка збереження",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!editedTitleUa || !editedTitleEn) {
      toast({
        title: "Помилка валідації",
        description: "Заголовки обов'язкові для заповнення",
        variant: "destructive",
      });
      return;
    }
    updatePageMutation.mutate();
  };

  const handleCancel = () => {
    if (page) {
      setEditedTitleUa(page.title_ua || "");
      setEditedTitleEn(page.title_en || "");
      setEditedMetaDescriptionUa(page.meta_description_ua || "");
      setEditedMetaDescriptionEn(page.meta_description_en || "");
      setEditedContentUa(page.content_ua || "");
      setEditedContentEn(page.content_en || "");
      setEditedHeroImageUrl(page.hero_image_url || "");
      setEditedBannerImageUrl(page.banner_image_url || "");
      setEditedOgImage(page.og_image || "");
      setEditedSeoKeywords(page.seo_keywords || "");
    }
    setIsEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  // If page not found or error, redirect to 404
  if (error || !page) {
    return <Navigate to="/404" replace />;
  }

  // If page is not published and user is not admin, redirect to 404
  if (!page.is_published && !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  const title = isEditMode 
    ? (language === "ua" ? editedTitleUa : editedTitleEn)
    : (language === "ua" ? page.title_ua : page.title_en);
  
  const metaDescription = isEditMode
    ? (language === "ua" ? editedMetaDescriptionUa : editedMetaDescriptionEn)
    : (language === "ua" ? page.meta_description_ua : page.meta_description_en);

  const content = isEditMode
    ? (language === "ua" ? editedContentUa : editedContentEn)
    : (language === "ua" ? page.content_ua : page.content_en);

  const heroImageUrl = isEditMode ? editedHeroImageUrl : page.hero_image_url;
  const bannerImageUrl = isEditMode ? editedBannerImageUrl : page.banner_image_url;

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        titleUa={page.title_ua}
        titleEn={page.title_en}
        metaDescriptionUa={page.meta_description_ua || ""}
        metaDescriptionEn={page.meta_description_en || ""}
        ogImage={page.og_image || ""}
        seoKeywords={page.seo_keywords || ""}
        language={language}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!page.is_published && isAdmin && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
              ⚠️ Ця сторінка прихована від публічного доступу (режим перегляду адміністратора)
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {isEditMode ? (
            <>
              <InlineEditableBlock
                value={language === "ua" ? editedTitleUa : editedTitleEn}
                onChange={language === "ua" ? setEditedTitleUa : setEditedTitleEn}
                type="text"
                label={`Заголовок (${language === "ua" ? "UA" : "EN"})`}
                isEditing={isEditMode}
                placeholder="Заголовок сторінки"
              />
            </>
          ) : (
            <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
          )}
          
          {isEditMode ? (
            <InlineEditableBlock
              value={language === "ua" ? editedMetaDescriptionUa : editedMetaDescriptionEn}
              onChange={language === "ua" ? setEditedMetaDescriptionUa : setEditedMetaDescriptionEn}
              type="textarea"
              label={`Опис (${language === "ua" ? "UA" : "EN"})`}
              isEditing={isEditMode}
              placeholder="Короткий опис сторінки"
              className="mb-8"
            />
          ) : metaDescription ? (
            <p className="text-lg text-muted-foreground mb-8">{metaDescription}</p>
          ) : null}

          <div className="space-y-8">
            {isEditMode && (
              <InlineEditableBlock
                value={heroImageUrl || ""}
                onChange={setEditedHeroImageUrl}
                type="image"
                label="Hero зображення"
                isEditing={isEditMode}
              />
            )}

            {!isEditMode && heroImageUrl && (
              <div className="w-full h-[400px] relative overflow-hidden rounded-lg">
                <img
                  src={heroImageUrl}
                  alt="Hero"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {isEditMode && !heroImageUrl && (
              <InlineEditableBlock
                value={bannerImageUrl || ""}
                onChange={setEditedBannerImageUrl}
                type="image"
                label="Banner зображення"
                isEditing={isEditMode}
              />
            )}

            {!isEditMode && bannerImageUrl && !heroImageUrl && (
              <div className="w-full h-[200px] relative overflow-hidden rounded-lg">
                <img
                  src={bannerImageUrl}
                  alt="Banner"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {isEditMode ? (
              <InlineTiptapEditor
                content={language === "ua" ? editedContentUa : editedContentEn}
                onChange={language === "ua" ? setEditedContentUa : setEditedContentEn}
                label={`Контент (${language === "ua" ? "UA" : "EN"})`}
              />
            ) : (
              content && (
                <PageRenderer
                  page={{ content_ua: page.content_ua, content_en: page.content_en }}
                  language={language}
                />
              )
            )}
          </div>
        </div>
      </main>
      
      <Footer />

      {isAdmin && (
        <div className="fixed bottom-8 right-8 flex gap-2 z-50">
          {!isEditMode ? (
            <Button
              onClick={() => setIsEditMode(true)}
              size="lg"
              className="shadow-lg"
            >
              <Edit className="h-5 w-5 mr-2" />
              Редагувати
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="lg"
                className="shadow-lg"
              >
                <X className="h-5 w-5 mr-2" />
                Скасувати
              </Button>
              <Button
                onClick={handleSave}
                size="lg"
                className="shadow-lg"
                disabled={updatePageMutation.isPending}
              >
                <Save className="h-5 w-5 mr-2" />
                {updatePageMutation.isPending ? "Збереження..." : "Зберегти"}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
