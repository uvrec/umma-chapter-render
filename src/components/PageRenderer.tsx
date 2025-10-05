import { TiptapRenderer } from "./blog/TiptapRenderer";

interface PageContent {
  content_ua?: string;
  content_en?: string;
  hero_image_url?: string;
  banner_image_url?: string;
}

interface PageRendererProps {
  page: PageContent;
  language: string;
}

export const PageRenderer = ({ page, language }: PageRendererProps) => {
  const content = language === "ua" ? page.content_ua : page.content_en;

  return (
    <div className="space-y-8">
      {page.hero_image_url && (
        <div className="w-full h-[400px] relative overflow-hidden rounded-lg">
          <img
            src={page.hero_image_url}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {page.banner_image_url && !page.hero_image_url && (
        <div className="w-full h-[200px] relative overflow-hidden rounded-lg">
          <img
            src={page.banner_image_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {content && (
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <TiptapRenderer content={content} />
        </div>
      )}
    </div>
  );
};
