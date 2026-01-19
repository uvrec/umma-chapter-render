import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_CONFIG } from "@/lib/constants";

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
  const location = useLocation();
  const title = language === "ua" ? titleUa : titleEn;
  const description = language === "ua" ? metaDescriptionUa : metaDescriptionEn;

  // Get path without language prefix
  const pathWithoutLang = location.pathname.replace(/^\/(ua|en)/, '') || '/';

  // Build URLs for each language
  const uaUrl = `${SITE_CONFIG.baseUrl}/ua${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const enUrl = `${SITE_CONFIG.baseUrl}/en${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const currentUrl = language === "ua" ? uaUrl : enUrl;

  // IMPORTANT: hreflang uses ISO 639-1 codes ('uk' for Ukrainian)
  // URL paths use 'ua' but hreflang MUST be 'uk' for Google SEO
  const htmlLang = language === "ua" ? "uk" : "en";
  const ogLocale = language === "ua" ? "uk_UA" : "en_US";
  const ogLocaleAlternate = language === "ua" ? "en_US" : "uk_UA";

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{title} | {SITE_CONFIG.siteName}</title>
      {description && <meta name="description" content={description} />}
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Hreflang for multilingual SEO */}
      <link rel="alternate" hrefLang="uk" href={uaUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={uaUrl} />

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
