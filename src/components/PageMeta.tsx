import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_CONFIG } from "@/lib/constants";

interface PageMetaProps {
  titleUk: string;
  titleEn: string;
  metaDescriptionUk?: string;
  metaDescriptionEn?: string;
  ogImage?: string;
  seoKeywords?: string;
  language: string;
}

export const PageMeta = ({
  titleUk,
  titleEn,
  metaDescriptionUk,
  metaDescriptionEn,
  ogImage,
  seoKeywords,
  language,
}: PageMetaProps) => {
  const location = useLocation();
  // Ensure title is always a string (Helmet requires it)
  const title = (language === "uk" ? titleUk : titleEn) || SITE_CONFIG.siteName;
  const description = language === "uk" ? metaDescriptionUk : metaDescriptionEn;

  // Get path without language prefix
  const pathWithoutLang = location.pathname.replace(/^\/(uk|en)/, '') || '/';

  // Build URLs for each language
  const ukUrl = `${SITE_CONFIG.baseUrl}/uk${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const enUrl = `${SITE_CONFIG.baseUrl}/en${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const currentUrl = language === "uk" ? ukUrl : enUrl;

  // ISO 639-1: 'uk' for Ukrainian
  const htmlLang = language === "uk" ? "uk" : "en";
  const ogLocale = language === "uk" ? "uk_UK" : "en_US";
  const ogLocaleAlternate = language === "uk" ? "en_US" : "uk_UK";

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{title} | {SITE_CONFIG.siteName}</title>
      {description && <meta name="description" content={description} />}
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Hreflang for multilingual SEO */}
      <link rel="alternate" hrefLang="uk" href={ukUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={ukUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage || SITE_CONFIG.socialImage} />
      <meta property="og:site_name" content={SITE_CONFIG.siteName} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlternate} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage || SITE_CONFIG.socialImage} />
    </Helmet>
  );
};
