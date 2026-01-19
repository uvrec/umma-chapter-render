/**
 * HreflangTags - Standalone hreflang/canonical tags for pages not using PageMeta
 *
 * Use this component to add proper multilingual SEO tags to any page.
 * It automatically generates correct hreflang and canonical URLs based on current path.
 */

import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";

// Paths that should not have hreflang tags (admin, auth, api)
const NON_LOCALIZED_PATHS = ['/admin', '/auth', '/api'];

export const HreflangTags = () => {
  const location = useLocation();
  const { language } = useLanguage();

  // Don't add hreflang for non-localized paths
  if (NON_LOCALIZED_PATHS.some(p => location.pathname.startsWith(p))) {
    return null;
  }

  // Get path without language prefix
  const pathWithoutLang = location.pathname.replace(/^\/(ua|en)/, '') || '/';

  // Build URLs for each language
  const uaUrl = `${SITE_CONFIG.baseUrl}/ua${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const enUrl = `${SITE_CONFIG.baseUrl}/en${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const currentUrl = language === "ua" ? uaUrl : enUrl;

  // IMPORTANT: hreflang uses ISO 639-1 codes ('uk' for Ukrainian)
  // URL paths use 'ua' but hreflang MUST be 'uk' for Google SEO
  const htmlLang = language === "ua" ? "uk" : "en";

  return (
    <Helmet>
      <html lang={htmlLang} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Hreflang for multilingual SEO */}
      <link rel="alternate" hrefLang="uk" href={uaUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={uaUrl} />
    </Helmet>
  );
};
