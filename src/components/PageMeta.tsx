import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  titleUa: string;
  titleEn: string;
  metaDescriptionUa?: string;
  metaDescriptionEn?: string;
  ogImage?: string;
  seoKeywords?: string;
  language: string;
}

export const PageMeta = ({
  titleUa,
  titleEn,
  metaDescriptionUa,
  metaDescriptionEn,
  ogImage,
  seoKeywords,
  language,
}: PageMetaProps) => {
  const title = language === "ua" ? titleUa : titleEn;
  const description = language === "ua" ? metaDescriptionUa : metaDescriptionEn;
  const siteName = "Прабгупада солов'їною";

  return (
    <Helmet>
      <html lang={language} />
      <title>{title} | {siteName}</title>
      {description && <meta name="description" content={description} />}
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};
