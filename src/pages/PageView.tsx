import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageRenderer } from "@/components/PageRenderer";
import { PageMeta } from "@/components/PageMeta";
import { Skeleton } from "@/components/ui/skeleton";

export const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();
  const { language } = useLanguage();

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

  const title = language === "ua" ? page.title_ua : page.title_en;
  const metaDescription = language === "ua" ? page.meta_description_ua : page.meta_description_en;

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
          <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
          
          {metaDescription && (
            <p className="text-lg text-muted-foreground mb-8">{metaDescription}</p>
          )}

          <PageRenderer page={page} language={language} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
